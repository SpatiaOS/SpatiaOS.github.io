import cadquery as cq
import math

# =============================================================================
# BEVEL GEAR ASSEMBLY - Three bevel gears with pins
# =============================================================================

# --- Gear Parameters ---
# Smaller gear (79afa20a)
small_gear_teeth = 20
small_gear_module = 6.0
small_gear_pitch_dia = small_gear_teeth * small_gear_module  # 120mm
small_gear_bore_dia = 28.8
small_gear_bore_length = 30.0
small_gear_face_width = 25.0
small_gear_cone_angle = 35.0  # degrees, pitch cone half-angle
small_gear_hub_dia = 55.0
small_gear_hub_length = 15.0
small_gear_thickness = 12.0

# Larger gears (79b06576) - two identical instances
large_gear_teeth = 32
large_gear_module = 6.0
large_gear_pitch_dia = large_gear_teeth * large_gear_module  # 192mm
large_gear_bore_dia = 67.748
large_gear_bore_length = 10.0
large_gear_face_width = 35.0
large_gear_cone_angle = 40.0  # degrees
large_gear_hub_dia = 100.0
large_gear_hub_length = 20.0
large_gear_thickness = 16.0

# --- Pin Parameters ---
# Pin for small gear (79b1021e)
pin_small_radius = 14.4
pin_small_dia = pin_small_radius * 2  # 28.8mm
pin_small_length = 120.0

# Pin 1 for large gear (79b03e80)
pin_large1_radius = 33.87
pin_large1_dia = pin_large1_radius * 2  # 67.74mm
pin_large1_length = 175.0

# Pin 2 for large gear (79af53d4)
pin_large2_radius = 33.87
pin_large2_dia = pin_large2_radius * 2  # 67.74mm
pin_large2_length = 100.0

# --- Tooth Parameters ---
tooth_height = 8.0
tooth_width_angle = 12.0  # degrees per tooth at pitch circle

# --- Assembly Positions ---
# Spacing between gear centers (estimated from bounding box)
center_distance_1 = 155.0  # small to large1
center_distance_2 = 165.0  # large1 to large2

# Axis angles for meshing (tilt angles from vertical Z-axis)
small_gear_tilt_x = 0.0
small_gear_tilt_y = 0.0
large1_axis_angle = 55.0  # degrees from vertical
large2_axis_angle = 55.0


def create_bevel_gear_body(pitch_dia, cone_angle, face_width, bore_dia, 
                           bore_length, hub_dia, hub_length, thickness, num_teeth):
    """
    Create a simplified bevel gear body with teeth.
    The gear is created with its axis along Z, cone pointing upward.
    """
    # Calculate dimensions
    outer_dia = pitch_dia + face_width * math.sin(math.radians(cone_angle))
    inner_dia = pitch_dia - face_width * math.sin(math.radians(cone_angle))
    cone_height = face_width * math.cos(math.radians(cone_angle))
    
    # Create the main conical body (simplified as a tapered cylinder)
    gear = (
        cq.Workplane("XY")
        .circle(outer_dia / 2)
        .workplane(offset=cone_height)
        .circle(inner_dia / 2)
        .loft(combine=True)
    )
    
    # Add hub at the base
    hub = (
        cq.Workplane("XY")
        .circle(hub_dia / 2)
        .extrude(-hub_length)
    )
    
    # Combine gear body with hub
    gear = gear.union(hub)
    
    # Create bore hole
    gear = (
        gear.faces("<Z").workplane()
        .hole(bore_dia, depth=bore_length + hub_length + cone_height)
    )
    
    return gear, outer_dia, inner_dia, cone_height


def add_teeth(gear, outer_dia, num_teeth, tooth_height, cone_angle, cone_height):
    """
    Add teeth around the bevel gear body.
    """
    tooth_width = (2 * math.pi * outer_dia / 2) / num_teeth * 0.4
    
    # Create teeth by adding material around the outer edge
    for i in range(num_teeth):
        angle = i * (360.0 / num_teeth)
        
        # Calculate tooth position on the outer cone surface
        x_pos = (outer_dia / 2 - tooth_height / 2) * math.cos(math.radians(angle))
        y_pos = (outer_dia / 2 - tooth_height / 2) * math.sin(math.radians(angle))
        
        # Create individual tooth
        tooth = (
            cq.Workplane("XY")
            .center(x_pos, y_pos)
            .rect(tooth_height, tooth_width)
            .workplane(offset=cone_height * 0.3)
            .rect(tooth_height * 0.8, tooth_width * 0.8)
            .loft(combine=False)
        )
        
        # Union tooth with gear body
        gear = gear.union(tooth)
    
    return gear


# =============================================================================
# CREATE SMALLER BEVEL GEAR
# =============================================================================
small_gear_body, small_outer_dia, small_inner_dia, small_cone_height = (
    create_bevel_gear_body(
        small_gear_pitch_dia, small_gear_cone_angle, small_gear_face_width,
        small_gear_bore_dia, small_gear_bore_length,
        small_gear_hub_dia, small_gear_hub_length, small_gear_thickness,
        small_gear_teeth
    )
)

# Add teeth to small gear
small_gear = add_teeth(
    small_gear_body, small_outer_dia, small_gear_teeth,
    tooth_height, small_gear_cone_angle, small_cone_height
)

# Position small gear at upper left
small_gear_position = (-140, 80, 120)

# =============================================================================
# CREATE LARGER BEVEL GEAR 1 (center position)
# =============================================================================
large_gear1_body, large_outer_dia, large_inner_dia, large_cone_height = (
    create_bevel_gear_body(
        large_gear_pitch_dia, large_gear_cone_angle, large_gear_face_width,
        large_gear_bore_dia, large_gear_bore_length,
        large_gear_hub_dia, large_gear_hub_length, large_gear_thickness,
        large_gear_teeth
    )
)

# Add teeth to large gear 1
large_gear1 = add_teeth(
    large_gear1_body, large_outer_dia, large_gear_teeth,
    tooth_height, large_gear_cone_angle, large_cone_height
)

# Rotate large gear 1 to mesh with small gear (tilt axis)
large_gear1 = large_gear1.rotate((0, 0, 0), (1, 0, 0), large1_axis_angle)
large_gear1 = large_gear1.rotate((0, 0, 0), (0, 0, 1), 60)

# Position large gear 1
large_gear1_position = (0, 0, 0)

# =============================================================================
# CREATE LARGER BEVEL GEAR 2 (right position) - Mirror of gear 1
# =============================================================================
large_gear2_body, _, _, _ = (
    create_bevel_gear_body(
        large_gear_pitch_dia, large_gear_cone_angle, large_gear_face_width,
        large_gear_bore_dia, large_gear_bore_length,
        large_gear_hub_dia, large_gear_hub_length, large_gear_thickness,
        large_gear_teeth
    )
)

# Add teeth to large gear 2
large_gear2 = add_teeth(
    large_gear2_body, large_outer_dia, large_gear_teeth,
    tooth_height, large_gear_cone_angle, large_cone_height
)

# Rotate large gear 2 (mirror configuration)
large_gear2 = large_gear2.rotate((0, 0, 0), (1, 0, 0), -large2_axis_angle)
large_gear2 = large_gear2.rotate((0, 0, 0), (0, 0, 1), -60)

# Position large gear 2
large_gear2_position = (150, -80, -50)

# =============================================================================
# CREATE PINS
# =============================================================================

# Pin for small gear (79b1021e) - thin, 120mm long
pin_small = (
    cq.Workplane("XY")
    .circle(pin_small_dia / 2)
    .extrude(pin_small_length)
)

# Pin 1 for large gear (79b03e80) - thick, 175mm long
pin_large1 = (
    cq.Workplane("XY")
    .circle(pin_large1_dia / 2)
    .extrude(pin_large1_length)
)

# Pin 2 for large gear (79af53d4) - thick, 100mm long
pin_large2 = (
    cq.Workplane("XY")
    .circle(pin_large2_dia / 2)
    .extrude(pin_large2_length)
)

# =============================================================================
# ASSEMBLY - Position all components
# =============================================================================

# Position small gear
small_gear_assembly = small_gear.translate(small_gear_position)

# Position and orient pin for small gear (protrudes from hub side)
pin_small_assembly = (
    pin_small
    .rotate((0, 0, 0), (0, 0, 1), 180)  # Flip so it protrudes upward
    .translate((
        small_gear_position[0],
        small_gear_position[1],
        small_gear_position[2] + small_gear_hub_length - 20
    ))
)

# Position large gear 1
large_gear1_assembly = large_gear1.translate(large_gear1_position)

# Position pin for large gear 1 (175mm long)
pin_large1_assembly = (
    pin_large1
    .rotate((0, 0, 0), (1, 0, 0), large1_axis_angle)
    .rotate((0, 0, 0), (0, 0, 1), 60)
    .translate((
        large_gear1_position[0],
        large_gear1_position[1],
        large_gear1_position[2] - 30
    ))
)

# Position large gear 2
large_gear2_assembly = large_gear2.translate(large_gear2_position)

# Position pin for large gear 2 (100mm long)
pin_large2_assembly = (
    pin_large2
    .rotate((0, 0, 0), (1, 0, 0), -large2_axis_angle)
    .rotate((0, 0, 0), (0, 0, 1), -60)
    .translate((
        large_gear2_position[0],
        large_gear2_position[1],
        large_gear2_position[2] + 20
    ))
)

# =============================================================================
# COMBINE INTO SINGLE UNIFIED MODEL
# =============================================================================

# Union all components into one solid
result = (
    small_gear_assembly
    .union(pin_small_assembly)
    .union(large_gear1_assembly)
    .union(pin_large1_assembly)
    .union(large_gear2_assembly)
    .union(pin_large2_assembly)
)