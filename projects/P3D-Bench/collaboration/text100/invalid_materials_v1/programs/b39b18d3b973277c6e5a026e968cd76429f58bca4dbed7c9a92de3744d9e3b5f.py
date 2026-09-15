import cadquery as cq
import math

# ==============================================================================
# Parametric Dimensions & Specifications
# ==============================================================================

# Base plate parameters
base_thickness = 12.0               # Thickness of the main mounting base slab
base_main_radius = 60.0             # Radius of the primary rounded arc section
tab_center_x = 60.0                 # Center location of the mounting lobe/tab
tab_radius = 25.0                   # Radius of the mounting tab end arc

# Underside feature (stepped depth below the base)
bottom_boss_radius = 36.0           # Outer radius of lower circular projection
bottom_boss_depth = 10.0            # Depth of projection below the underside (Z < 0)

# Central through opening
central_opening_radius = 24.0       # Radius of large main through opening (dia 48mm)

# Central upper stepped collar (coaxial with the main through opening)
central_collar_lower_radius = 34.0  # Outer radius of lower collar tier
central_collar_lower_height = 5.0   # Height of lower tier above base
central_collar_upper_radius = 30.0  # Outer radius of upper collar tier
central_collar_upper_height = 10.0  # Total height of upper tier above base

# Upright annular tubes (circular pattern on upper face)
pcd_radius = 45.0                   # Pitch circle radius for upright tube array
tube_angles = [45, 135, 225, 315]   # Angular positions around central opening
tube_height = 34.0                  # Total height of tall upright tubes above base
tube_outer_radius = 7.5             # Outer radius of tall tubes (dia 15mm)
tube_inner_radius = 4.0             # Inner bore radius of tall tubes (dia 8mm)

# Coaxial stepped collars at the base of each upright tube
tube_collar_radius = 11.5           # Outer radius of shorter collar (dia 23mm)
tube_collar_height = 7.0            # Height of shorter collar above base

# Auxiliary mounting collar on tab (separate coaxial stepped feature)
tab_collar_outer_radius = 16.0      # Outer radius of tab collar (dia 32mm)
tab_collar_height = 8.0             # Height above base
tab_counterbore_radius = 10.0       # Radius of coaxial counterbore step
tab_counterbore_depth = 4.0         # Depth of counterbore step
tab_through_radius = 6.0            # Through bore radius

# ==============================================================================
# Step 1: Create Base Plate with Rounded Arc Portion & Extended Lobe
# ==============================================================================
# Analytical tangent points between main circle (R1=60 at x=0) and tab circle (R2=25 at x=60):
# sin(alpha) = (R1 - R2) / Distance = (60 - 25) / 60 = 35/60 = 7/12
# cos(alpha) = sqrt(95)/12 ≈ 0.8122
cos_alpha = math.sqrt(95.0) / 12.0
sin_alpha = 7.0 / 12.0

p1_x = base_main_radius * sin_alpha
p1_y = base_main_radius * cos_alpha
p2_x = tab_center_x + tab_radius * sin_alpha
p2_y = tab_radius * cos_alpha

# Construct the base outline smoothly with arcs and tangent lines
base = (
    cq.Workplane("XY")
    .moveTo(p1_x, p1_y)
    .threePointsArc((-base_main_radius, 0.0), (p1_x, -p1_y))
    .lineTo(p2_x, -p2_y)
    .threePointsArc((tab_center_x + tab_radius, 0.0), (p2_x, p2_y))
    .close()
    .extrude(base_thickness)
)

# ==============================================================================
# Step 2: Add Underside Continuation (Lower Boss)
# ==============================================================================
# Adds stepped depth on the bottom face, extending below the underside
bottom_boss = (
    cq.Workplane("XY")
    .workplane(offset=0.0)
    .circle(bottom_boss_radius)
    .extrude(-bottom_boss_depth)
)
result = base.union(bottom_boss)

# ==============================================================================
# Step 3: Add Central Coaxial Stepped Collar on Upper Face
# ==============================================================================
# Lower tier of central collar
central_collar_lower = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(central_collar_lower_radius)
    .extrude(central_collar_lower_height)
)
# Upper narrower tier of central collar
central_collar_upper = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + central_collar_lower_height)
    .circle(central_collar_upper_radius)
    .extrude(central_collar_upper_height - central_collar_lower_height)
)
result = result.union(central_collar_lower).union(central_collar_upper)

# ==============================================================================
# Step 4: Add Upright Tubes with Coaxial Stepped Base Collars
# ==============================================================================
# Each post consists of a shorter, wider collar and a taller, narrower tube
for angle in tube_angles:
    rad = math.radians(angle)
    tx = pcd_radius * math.cos(rad)
    ty = pcd_radius * math.sin(rad)

    # Shorter collar (lower step)
    post_collar = (
        cq.Workplane("XY")
        .workplane(offset=base_thickness)
        .moveTo(tx, ty)
        .circle(tube_collar_radius)
        .extrude(tube_collar_height)
    )
    # Taller upright tube (coaxial upper step)
    post_tube = (
        cq.Workplane("XY")
        .workplane(offset=base_thickness)
        .moveTo(tx, ty)
        .circle(tube_outer_radius)
        .extrude(tube_height)
    )
    result = result.union(post_collar).union(post_tube)

# ==============================================================================
# Step 5: Add Shorter Collar on Mounting Tab (Separate Coaxial Stepped Feature)
# ==============================================================================
tab_collar = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(tab_center_x, 0.0)
    .circle(tab_collar_outer_radius)
    .extrude(tab_collar_height)
)
result = result.union(tab_collar)

# ==============================================================================
# Step 6: Create Bores to Make Features Annular
# ==============================================================================
# 6a. Large central through opening (penetrates both upper collar and lower boss)
total_central_cut_depth = (
    bottom_boss_depth + base_thickness + central_collar_upper_height + 4.0
)
central_bore = (
    cq.Workplane("XY")
    .workplane(offset=-bottom_boss_depth - 2.0)
    .circle(central_opening_radius)
    .extrude(total_central_cut_depth)
)
result = result.cut(central_bore)

# 6b. Bores through all upright tubes in the circular pattern
for angle in tube_angles:
    rad = math.radians(angle)
    tx = pcd_radius * math.cos(rad)
    ty = pcd_radius * math.sin(rad)

    tube_bore = (
        cq.Workplane("XY")
        .workplane(offset=-2.0)
        .moveTo(tx, ty)
        .circle(tube_inner_radius)
        .extrude(base_thickness + tube_height + 4.0)
    )
    result = result.cut(tube_bore)

# 6c. Coaxial stepped hole in the tab collar (through bore + counterbore step)
tab_through_bore = (
    cq.Workplane("XY")
    .workplane(offset=-2.0)
    .moveTo(tab_center_x, 0.0)
    .circle(tab_through_radius)
    .extrude(base_thickness + tab_collar_height + 4.0)
)
tab_counterbore = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + tab_collar_height - tab_counterbore_depth)
    .moveTo(tab_center_x, 0.0)
    .circle(tab_counterbore_radius)
    .extrude(tab_counterbore_depth + 2.0)
)
result = result.cut(tab_through_bore).cut(tab_counterbore)