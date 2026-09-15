import cadquery as cq

# ==============================================================================
# PARAMETERS
# ==============================================================================

# Plan & Collar Dimensions
collar_spacing = 46.0         # Center-to-center distance from origin to collar (X axis)
collar_base_radius = 18.0     # Radius of lower circular collar pads
collar_base_height = 16.0     # Height of the shared base section
collar_boss_radius = 13.5     # Radius of upper stacked circular collar boss
collar_boss_height = 25.0     # Total top height of circular collar sections
collar_bore_dia = 12.0        # Through-bore diameter in collars

# Central Tall Arc-Sided Body Dimensions
center_base_radius = 26.0     # Radius of central section at the base
tall_body_radius = 23.5       # Radius of the main arc-sided vertical column
tall_body_height = 54.0       # Height to shoulder of tall body
top_rim_radius = 26.5         # Radius of top annular flange/collar
total_height = 62.0           # Total height of the model

# Internal Bore & Annular Dimensions
center_bore_dia = 24.0        # Main internal through-bore diameter
center_top_bore_dia = 34.0    # Top annular counterbore diameter
center_top_bore_depth = 12.0  # Depth of top annular opening

# Underside Stepped Recess Cuts (different cut depths)
center_under_dia_1 = 38.0     # Outer underside circular recess diameter
center_under_depth_1 = 6.0    # First step depth of center underside recess
center_under_dia_2 = 30.0     # Inner underside circular recess diameter
center_under_depth_2 = 14.0   # Deeper second step depth beneath central body
left_under_dia = 22.0         # Left collar underside counterbore diameter
left_under_depth = 4.0        # Shallow cut depth under left collar
right_under_dia = 22.0        # Right collar underside counterbore diameter
right_under_depth = 8.5       # Intermediate cut depth under right collar

# Small Openings (Fastener / Locating Cuts)
bolt_circle_dia = 43.5        # PCD for small openings on top rim
num_rim_holes = 6             # Number of holes on top rim
rim_hole_dia = 3.2            # Diameter of rim openings
rim_hole_depth = 8.0          # Depth of rim openings
collar_pin_dia = 2.5          # Diameter of small pin holes on collar faces
collar_pin_depth = 5.0        # Depth of collar pin openings
collar_pin_offset = 9.75      # Y-offset for collar pin holes

# ==============================================================================
# MODEL GENERATION
# ==============================================================================

# 1. Base Solid: Create a continuous rounded plan using tangent hulls
#    Collars stay circular rather than being simplified into rectangular pads.
base_sketch = (
    cq.Sketch()
    .circle(center_base_radius)
    .circle(collar_base_radius, mode='a', origin=(-collar_spacing, 0))
    .circle(collar_base_radius, mode='a', origin=(collar_spacing, 0))
    .hull()
)
base = cq.Workplane("XY").placeSketch(base_sketch).extrude(collar_base_height)

# 2. Stacked Circular Sections on Collars:
#    Adding upper circular bosses onto the base collars
left_boss = (
    cq.Workplane("XY")
    .workplane(offset=collar_base_height)
    .center(-collar_spacing, 0)
    .circle(collar_boss_radius)
    .extrude(collar_boss_height - collar_base_height)
)

right_boss = (
    cq.Workplane("XY")
    .workplane(offset=collar_base_height)
    .center(collar_spacing, 0)
    .circle(collar_boss_radius)
    .extrude(collar_boss_height - collar_base_height)
)

# 3. Stacked Circular Sections on Central Body:
#    Tall arc-sided column topped with an annular collar rim
tall_column = (
    cq.Workplane("XY")
    .workplane(offset=collar_base_height)
    .circle(tall_body_radius)
    .extrude(tall_body_height - collar_base_height)
)

top_rim = (
    cq.Workplane("XY")
    .workplane(offset=tall_body_height)
    .circle(top_rim_radius)
    .extrude(total_height - tall_body_height)
)

# Combine all solid additive elements
body = base.union(left_boss).union(right_boss).union(tall_column).union(top_rim)

# 4. Internal Bores Through Stacked Sections:
#    The bores continue completely through the stacked circular sections
left_bore = (
    cq.Workplane("XY")
    .center(-collar_spacing, 0)
    .circle(collar_bore_dia / 2.0)
    .extrude(total_height * 2, both=True)
)

right_bore = (
    cq.Workplane("XY")
    .center(collar_spacing, 0)
    .circle(collar_bore_dia / 2.0)
    .extrude(total_height * 2, both=True)
)

center_bore = (
    cq.Workplane("XY")
    .circle(center_bore_dia / 2.0)
    .extrude(total_height * 2, both=True)
)

body = body.cut(left_bore).cut(right_bore).cut(center_bore)

# 5. Annular Recess on Top Face of Central Body
top_annular_cut = (
    cq.Workplane("XY")
    .workplane(offset=total_height - center_top_bore_depth)
    .circle(center_top_bore_dia / 2.0)
    .extrude(center_top_bore_depth + 1.0)
)
body = body.cut(top_annular_cut)

# 6. Underside Stepped Depth Cuts:
#    Creating different cut depths beneath each joined section
#    - Left collar: shallow recess (4.0 mm)
#    - Right collar: intermediate recess (8.5 mm)
#    - Center: dual-stepped deep recess (6.0 mm and 14.0 mm)
center_under_step1 = (
    cq.Workplane("XY")
    .circle(center_under_dia_1 / 2.0)
    .extrude(center_under_depth_1)
)

center_under_step2 = (
    cq.Workplane("XY")
    .circle(center_under_dia_2 / 2.0)
    .extrude(center_under_depth_2)
)

left_under_cut = (
    cq.Workplane("XY")
    .center(-collar_spacing, 0)
    .circle(left_under_dia / 2.0)
    .extrude(left_under_depth)
)

right_under_cut = (
    cq.Workplane("XY")
    .center(collar_spacing, 0)
    .circle(right_under_dia / 2.0)
    .extrude(right_under_depth)
)

body = (
    body.cut(center_under_step1)
    .cut(center_under_step2)
    .cut(left_under_cut)
    .cut(right_under_cut)
)

# 7. Small Openings / Cuts (Fastener and Dowel Pin Recesses):
#    Top rim bolt circle cuts
rim_holes = (
    cq.Workplane("XY")
    .workplane(offset=total_height)
    .polarArray(radius=bolt_circle_dia / 2.0, startAngle=0, angle=360, count=num_rim_holes)
    .circle(rim_hole_dia / 2.0)
    .extrude(-rim_hole_depth)
)

# Collar locating pin recesses
collar_pin_points = [
    (-collar_spacing, -collar_pin_offset),
    (-collar_spacing, collar_pin_offset),
    (collar_spacing, -collar_pin_offset),
    (collar_spacing, collar_pin_offset),
]

collar_pins = (
    cq.Workplane("XY")
    .workplane(offset=collar_boss_height)
    .pushPoints(collar_pin_points)
    .circle(collar_pin_dia / 2.0)
    .extrude(-collar_pin_depth)
)

body = body.cut(rim_holes).cut(collar_pins)

# Export final geometry
result = body