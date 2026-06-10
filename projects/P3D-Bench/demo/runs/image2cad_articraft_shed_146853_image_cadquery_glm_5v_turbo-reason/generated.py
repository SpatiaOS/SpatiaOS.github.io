import cadquery as cq
import math

# =============================================================================
# PARAMETERS - Shed/Garage Building Model
# =============================================================================

# Overall Building Dimensions
building_length = 200.0      # Length along X-axis (front to back)
building_width = 160.0       # Width along Y-axis (side to side)
wall_height = 100.0          # Height of vertical walls
roof_height = 60.0           # Additional height at roof peak

# Framing Dimensions
stud_width = 5.0             # Width of vertical studs
stud_depth = 5.0             # Depth of vertical studs
plate_thickness = 10.0       # Thickness of top/bottom plates
rafter_thickness = 8.0       # Thickness of roof rafters
purlin_size = 6.0            # Size of square purlins (roof cross-members)

# Stud Spacing
stud_spacing = 20.0          # Center-to-center spacing of wall studs

# Foundation/Base
base_thickness = 8.0         # Thickness of foundation slab
base_overhang = 5.0          # How much base extends beyond walls

# Door Parameters
door_width = 35.0            # Width of each door panel
door_height = 80.0           # Height of doors
door_frame_width = 4.0       # Thickness of door frame
door_gap = 1.0               # Gap between door panels

# Number of framing bays (approximate)
num_rafters = 9              # Number of rafter pairs along length

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def create_stud(height, width=stud_width, depth=stud_depth):
    """Create a single vertical stud (rectangular post)"""
    return cq.Workplane("XY").box(width, depth, height)

def create_plate(length, width=plate_thickness, depth=plate_thickness):
    """Create a horizontal plate (sill or top plate)"""
    return cq.Workplane("XY").box(length, depth, width)

def create_rafter(roof_span, roof_rise, thickness=rafter_thickness):
    """Create a single roof rafter (angled beam for gable roof)"""
    # Calculate rafter length using Pythagorean theorem
    half_span = roof_span / 2
    rafter_length = math.sqrt(half_span**2 + roof_rise**2)
    angle = math.atan2(roof_rise, half_span)
    
    # Create rafter and rotate to correct pitch
    rafter = (
        cq.Workplane("XZ")
        .box(thickness, stud_depth, rafter_length)
        .rotate((0, 0, 0), (1, 0, 0), -math.degrees(angle))
    )
    return rafter

def create_purlin(length, size=purlin_size):
    """Create a horizontal purlin (runs perpendicular to rafters)"""
    return cq.Workplane("YZ").box(size, length, size)

# =============================================================================
# MAIN MODEL CONSTRUCTION
# =============================================================================

result = cq.Workplane("XY")

# --- 1. FOUNDATION SLAB ---
foundation = (
    cq.Workplane("XY")
    .box(
        building_length + 2 * base_overhang,
        building_width + 2 * base_overhang,
        base_thickness
    )
    .translate((0, 0, -base_thickness / 2))
)
result = result.union(foundation)

# --- 2. BOTTOM PLATES (Sills) ---
# Front and back plates (along width direction)
for y_pos in [-building_width / 2, building_width / 2]:
    plate = (
        create_plate(building_width)
        .rotate((0, 0, 0), (0, 0, 1), 90)
        .translate((0, y_pos, plate_thickness / 2))
    )
    result = result.union(plate)

# Side plates (along length direction)
for x_pos in [-building_length / 2, building_length / 2]:
    plate = (
        create_plate(building_length)
        .translate((x_pos, 0, plate_thickness / 2))
    )
    result = result.union(plate)

# --- 3. VERTICAL STUDS ---
# Function to add studs along a wall
def add_wall_studs(start_x, end_x, y_pos, height, skip_center=False, 
                   center_skip_width=0, num_skip=1):
    """Add evenly spaced studs along a wall line"""
    local_result = cq.Workplane("XY")
    wall_length = abs(end_x - start_x)
    num_studs = int(wall_length / stud_spacing) + 1
    
    for i in range(num_studs):
        x_pos = start_x + (i * wall_length / (num_studs - 1)) if num_studs > 1 else start_x
        
        # Check if we should skip this stud (for door opening)
        if skip_center:
            door_start = -center_skip_width * num_skip / 2
            door_end = center_skip_width * num_skip / 2
            if door_start < x_pos < door_end:
                continue
        
        stud = (
            create_stud(height)
            .translate((x_pos, y_pos, height / 2 + plate_thickness))
        )
        local_result = local_result.union(stud)
    
    return local_result

# Side wall studs (left and right sides)
for x_pos in [-building_length / 2, building_length / 2]:
    studs = add_wall_studs(-building_width / 2, building_width / 2, x_pos, wall_height)
    result = result.union(studs)

# Back wall studs
back_studs = add_wall_studs(-building_length / 2, building_length / 2, 
                            -building_width / 2, wall_height)
result = result.union(back_studs)

# Front wall studs (with gap for double door)
front_studs = add_wall_studs(
    -building_length / 2, building_length / 2,
    building_width / 2, wall_height,
    skip_center=True,
    center_skip_width=(door_width * 2 + door_gap),
    num_skip=1
)
result = result.union(front_studs)

# Add door frame posts (thicker studs around door opening)
door_frame_left = (
    create_stud(door_height, door_frame_width, door_frame_width)
    .translate((-(door_width + door_gap / 2), building_width / 2 - stud_depth / 2, 
                door_height / 2 + plate_thickness))
)
door_frame_right = (
    create_stud(door_height, door_frame_width, door_frame_width)
    .translate(((door_width + door_gap / 2), building_width / 2 - stud_depth / 2, 
                door_height / 2 + plate_thickness))
)
result = result.union(door_frame_left).union(door_frame_right)

# Center door post (between two doors)
center_post = (
    create_stud(door_height, door_frame_width, door_frame_width)
    .translate((0, building_width / 2 - stud_depth / 2, 
                door_height / 2 + plate_thickness))
)
result = result.union(center_post)

# --- 4. DOOR PANELS ---
# Left door panel
left_door = (
    cq.Workplane("XY")
    .box(door_width, stud_depth, door_height)
    .translate((-(door_width / 2 + door_gap / 2), 
                building_width / 2 - stud_depth / 2,
                door_height / 2 + plate_thickness))
)
result = result.union(left_door)

# Right door panel  
right_door = (
    cq.Workplane("XY")
    .box(door_width, stud_depth, door_height)
    .translate(((door_width / 2 + door_gap / 2),
                building_width / 2 - stud_depth / 2,
                door_height / 2 + plate_thickness))
)
result = result.union(right_door)

# --- 5. TOP PLATES ---
# Same position as bottom plates but at top of wall height
for y_pos in [-building_width / 2, building_width / 2]:
    plate = (
        create_plate(building_width)
        .rotate((0, 0, 0), (0, 0, 1), 90)
        .translate((0, y_pos, wall_height + plate_thickness / 2))
    )
    result = result.union(plate)

for x_pos in [-building_length / 2, building_length / 2]:
    plate = (
        create_plate(building_length)
        .translate((x_pos, 0, wall_height + plate_thickness / 2))
    )
    result = result.union(plate)

# --- 6. ROOF RAFTERS (Gable Structure) ---
# Calculate rafter geometry
roof_span = building_width
half_span = roof_span / 2
rafter_run = math.sqrt(half_span**2 + roof_height**2)

# Place rafter pairs along the length of the building
rafter_positions = []
if num_rafters > 1:
    for i in range(num_rafters):
        x_pos = -building_length / 2 + (i * building_length / (num_rafters - 1))
        rafter_positions.append(x_pos)
else:
    rafter_positions.append(0)

for x_pos in rafter_positions:
    # Left rafter (from left eave to peak)
    left_rafter = (
        cq.Workplane("XZ")
        .box(rafter_thickness, stud_depth, rafter_run)
        .rotate((0, 0, 0), (0, 1, 0), math.degrees(math.atan2(roof_height, half_span)))
        .translate((x_pos, -half_span / 2, wall_height))
    )
    
    # Right rafter (from right eave to peak)
    right_rafter = (
        cq.Workplane("XZ")
        .box(rafter_thickness, stud_depth, rafter_run)
        .rotate((0, 0, 0), (0, 1, 0), -math.degrees(math.atan2(roof_height, half_span)))
        .translate((x_pos, half_span / 2, wall_height))
    )
    
    result = result.union(left_rafter).union(right_rafter)

# Ridge board (horizontal member at peak connecting rafters)
ridge_board = (
    cq.Workplane("XZ")
    .box(building_length, stud_depth, rafter_thickness)
    .translate((0, 0, wall_height + roof_height))
    .rotate((0, 0, 0), (0, 1, 0), 90)
)
result = result.union(ridge_board)

# --- 7. PURLINS (Horizontal roof bracing) ---
# Add purlins running perpendicular to rafters at regular intervals
num_purlins = 5
for i in range(1, num_purlins):
    # Position along the rafter slope
    t = i / num_purlins  # Parameter from 0 to 1 along rafter
    y_offset = -half_span + t * roof_span
    z_offset = wall_height + t * roof_height
    
    purlin = (
        cq.Workplane("XZ")
        .box(purlin_size, building_length, purlin_size)
        .rotate((0, 0, 0), (1, 0, 0), 90)
        .translate((0, y_offset, z_offset))
    )
    result = result.union(purlin)

# --- 8. GABLE END FRAMING (Triangular ends) ---
# Vertical studs in gable ends (under roof slope)
def add_gable_studs(x_pos, is_front=False):
    """Add diagonal/vertical framing in gable end"""
    gable_result = cq.Workplane("XY")
    
    # Add short vertical studs under roof slope
    num_gable_studs = 4
    for i in range(1, num_gable_studs):
        t = i / num_gable_studs
        y_pos = (-building_width / 2 + t * building_width / 2) if not is_front else \
                (building_width / 2 - t * building_width / 2)
        
        # Height decreases linearly toward the peak edge
        stud_h = t * roof_height
        
        if stud_h > 5:  # Only add if meaningful height
            stud = (
                create_stud(stud_h)
                .translate((x_pos, y_pos, wall_height + stud_h / 2))
            )
            gable_result = gable_result.union(stud)
    
    return gable_result

# Add gable studs to both ends
gable_left = add_gable_studs(-building_length / 2)
gable_right = add_gable_studs(building_length / 2)
result = result.union(gable_left).union(gable_right)

print("Shed model created successfully!")