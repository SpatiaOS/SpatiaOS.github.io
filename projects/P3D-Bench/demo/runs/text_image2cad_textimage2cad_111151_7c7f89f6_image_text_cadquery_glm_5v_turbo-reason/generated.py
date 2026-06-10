import cadquery as cq

# ==========================================
# PARAMETERS
# ==========================================

# --- Leg Dimensions ---
LEG_WIDTH = 25.0          # Square footprint width (mm)
LEG_HEIGHT = 100.0        # Total height of leg (mm)
WAIST_RADIUS = 140.0      # Radius of concave cylindrical sides (mm)
LEG_FILLET_RADIUS = 2.0   # Radius of vertical edge rounds (mm)
LEG_CHAMFER_SIZE = 3.0    # Size of end flares (mm)

# --- Seat / Base Dimensions ---
SEAT_WIDTH = 100.0        # Total width (X-axis) (mm)
SEAT_DEPTH = 110.0        # Total depth (Y-axis) (mm)
SEAT_THICKNESS = 12.0     # Thickness of the base platform (mm)
ARM_RADIUS = 50.0         # Radius of semicircular armrest features (mm)

# --- Backrest Dimensions ---
BACK_WIDTH = 80.0         # Width of the backrest panel (mm)
BACK_HEIGHT = 215.0       # Height of the backrest panel (mm)
BACK_THICKNESS = 10.0     # Thickness of the backrest panel (mm)

# --- Cutout Features ---
DIAMOND_SIZE = 18.0       # Side length of diamond cutouts (mm)


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def create_waisted_leg():
    """
    Creates a single leg with a waisted (hourglass) profile on all four sides.
    Method: Intersect two extruded profiles (one concave in X, one in Y).
    """
    half_w = LEG_WIDTH / 2
    # Calculate sagitta for the concave arc to ensure it passes through the width at ends
    # and bows inward by a reasonable amount determined by WAIST_RADIUS
    sagitta = WAIST_RADIUS - (WAIST_RADIUS**2 - half_w**2)**0.5
    
    # Profile 1: Concave in X direction (extruded in Y)
    # Vertices define a shape that is wide at top/bottom and narrow in middle
    p1 = (
        cq.Workplane("XZ")
        .moveTo(-half_w, 0)
        .lineTo(half_w, 0)
        .threePointArc((half_w - sagitta, LEG_HEIGHT/2), (half_w, LEG_HEIGHT))
        .lineTo(-half_w, LEG_HEIGHT)
        .threePointArc((-half_w + sagitta, LEG_HEIGHT/2), (-half_w, 0))
        .close()
    )
    extrusion_1 = p1.extrude(LEG_WIDTH)

    # Profile 2: Concave in Y direction (extruded in X)
    p2 = (
        cq.Workplane("YZ")
        .moveTo(-half_w, 0)
        .lineTo(half_w, 0)
        .threePointArc((half_w - sagitta, LEG_HEIGHT/2), (half_w, LEG_HEIGHT))
        .lineTo(-half_w, LEG_HEIGHT)
        .threePointArc((-half_w + sagitta, LEG_HEIGHT/2), (-half_w, 0))
        .close()
    )
    extrusion_2 = p2.extrude(LEG_WIDTH)

    # Intersect to get the 4-sided waist
    leg = extrusion_1.intersect(extrusion_2)

    # Apply chamfers to top and bottom edges (Perpendicular to Z)
    # Using chaining syntax which is robust for selection
    leg = leg.edges(">Z").chamfer(LEG_CHAMFER_SIZE)
    
    # Apply fillets to the 4 vertical edges (Parallel to Z)
    leg = leg.edges("|Z").fillet(LEG_FILLET_RADIUS)
    
    return leg


def create_decorative_bracket():
    """
    Creates the main body: Seat platform with armrests and the tall backrest.
    """
    # 1. SEAT BASE
    seat = (
        cq.Workplane("XY")
        .box(SEAT_WIDTH, SEAT_DEPTH, SEAT_THICKNESS)
    )

    # 2. ARMRESTS
    # Create semi-cylinder profiles on the sides
    arm_height = 30.0 
    
    # Left Arm Profile
    # Positioned at the side of the seat
    left_arm = (
        cq.Workplane("YZ")
        .transformed(offset=(-SEAT_WIDTH/2, SEAT_DEPTH/4, SEAT_THICKNESS/2))
        .moveTo(0, 0)
        .threePointArc((ARM_RADIUS, ARM_RADIUS), (0, ARM_RADIUS*2)) 
        .line(0, -ARM_RADIUS*2)
        .close()
        .extrude(ARM_RADIUS) 
    )
    
    # Right Arm: Mirror Left Arm across YZ plane (Normal X) to flip X coordinates
    right_arm = left_arm.mirror((1, 0, 0))

    seat = seat.union(left_arm).union(right_arm)

    # 3. SEAT CUTOUTS (Diamonds)
    def make_diamond_sketch(wp, x, y, size):
        d = size / 2
        return (
            wp.center(x, y)
            .moveTo(0, d).lineTo(d, 0).lineTo(0, -d).lineTo(-d, 0).close()
        )

    # Workplane on top of seat
    seat_top_wp = cq.Workplane("XY").workplane(offset=SEAT_THICKNESS/2 + 0.01)
    
    # Grid of diamonds
    offsets = [(-22, -22), (22, -22), (-22, 22), (22, 22)]
    cut_sketch = seat_top_wp
    for ox, oy in offsets:
        cut_sketch = make_diamond_sketch(cut_sketch, ox, oy, DIAMOND_SIZE)
        
    seat = seat.cut(cut_sketch.extrude(-SEAT_THICKNESS * 2))

    # 4. BACKREST
    # Vertical plate rising from the back center of the seat
    back_center_y = -SEAT_DEPTH / 2 + BACK_THICKNESS / 2
    back_bottom_z = SEAT_THICKNESS / 2
    
    # Create raw stock for backrest
    back_stock = (
        cq.Workplane("YZ")
        .transformed(offset=(0, back_center_y, back_bottom_z + BACK_HEIGHT/2))
        .box(BACK_THICKNESS, BACK_WIDTH, BACK_HEIGHT)
    )

    # Define the Leaf Shape (Cutting volume)
    w = BACK_WIDTH / 2
    h = BACK_HEIGHT / 2
    
    leaf_profile = (
        cq.Workplane("YZ")
        .transformed(offset=(0, back_center_y, back_bottom_z + BACK_HEIGHT/2))
        .moveTo(0, h)                     # Top Center (Point)
        .spline([(w*0.8, h*0.5), (w, 0), (w*0.9, -h)]) # Right Curve
        .lineTo(-w*0.9, -h)               # Bottom Edge
        .spline([(-w, 0), (-w*0.8, h*0.5)]) # Left Curve
        .close()
        .extrude(BACK_THICKNESS * 2, both=True) 
    )

    # Intersect stock with leaf shape
    back = back_stock.intersect(leaf_profile)

    # 5. BACKREST CUTOUT (Clover/Diamond Cluster)
    cutout_wp = (
        cq.Workplane("YZ")
        .transformed(offset=(0, back_center_y + BACK_THICKNESS/2 + 0.1, back_bottom_z + BACK_HEIGHT*0.65))
    )
    
    back_cut = (
        cutout_wp
        .polygon(4, DIAMOND_SIZE * 1.8)
        .extrude(-BACK_THICKNESS * 2)
    )
    back = back.cut(back_cut)

    return seat.union(back)


# ==========================================
# ASSEMBLY
# ==========================================

# 1. Generate Parts
main_body = create_decorative_bracket()
leg_part = create_waisted_leg()

# 2. Position Legs
leg_spacing_x = SEAT_WIDTH * 0.35
leg_spacing_y = SEAT_DEPTH * 0.35
z_offset = -SEAT_THICKNESS/2 - LEG_HEIGHT/2 

legs = []
positions = [
    (-leg_spacing_x, leg_spacing_y, z_offset),
    (leg_spacing_x, leg_spacing_y, z_offset),
    (-leg_spacing_x, -leg_spacing_y, z_offset),
    (leg_spacing_x, -leg_spacing_y, z_offset)
]

for pos in positions:
    legs.append(leg_part.translate(pos))

# 3. Unify Assembly
assembly = main_body
for leg in legs:
    assembly = assembly.union(leg)

result = assembly