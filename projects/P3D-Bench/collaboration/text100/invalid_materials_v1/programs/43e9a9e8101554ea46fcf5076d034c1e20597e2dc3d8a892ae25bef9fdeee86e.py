import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Main base (upper-side plate)
base_length = 0.623414
base_width = 0.421907
base_height = 0.047589  # Upper extrusion from base datum Z=0

# Shallow underside tier
shallow_length = 0.651015
shallow_width = 0.507703
shallow_depth = 0.0476
shallow_offset_x = 0.0       # Left offset: 0
shallow_offset_y = -0.0429   # Front offset: -0.0429

# Axis for concentric features
axis_x = 0.276
axis_y = 0.211

# Shallow tier separate solid round profile
round_profile_radius = 0.0666

# Deeper concentric annular continuation
annular_outer_radius = 0.1428
annular_inner_radius = 0.0952
deeper_depth = 0.1713        # Extends 0.1713 below shallow tier (to Z = -0.2189)

# Deeper rectangular strip continuation
strip_length = 0.088321
strip_width = 0.507703
strip_offset_x = 0.0         # Left offset: 0
strip_offset_y = -0.0428     # Front offset: -0.0428

# 3 circular recess cuts on underside/side (X = 0)
recess_radius = 0.0157
recess_depth = 0.1076
recess_y_coords = [0.0397, 0.211, 0.3823]
recess_z_center = -(0.108 + 0.1394) / 2.0  # -0.1237 (band between -0.108 and -0.1394)

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Main Base: Curved-outline plate on the upper side (Z: 0 to 0.047589)
# Semicircular right-end profile flush to reference edges
r_base = base_width / 2.0
base_plate = (
    cq.Workplane("XY")
    .moveTo(0, 0)
    .lineTo(base_length - r_base, 0)
    .threePointsArc((base_length, r_base), (base_length - r_base, base_width))
    .lineTo(0, base_width)
    .close()
    .extrude(base_height)
)

# 2. Shallow Underside Tier: Solid tier starting at base underside (Z: -0.0476 to 0)
# Overall footprint: 0.651015 by 0.507703 with edge offsets
r_shallow = shallow_width / 2.0
y_shallow_min = shallow_offset_y
y_shallow_max = y_shallow_min + shallow_width
y_shallow_mid = y_shallow_min + r_shallow

shallow_tier = (
    cq.Workplane("XY")
    .moveTo(0, y_shallow_min)
    .lineTo(shallow_length - r_shallow, y_shallow_min)
    .threePointsArc(
        (shallow_length, y_shallow_mid),
        (shallow_length - r_shallow, y_shallow_max)
    )
    .lineTo(0, y_shallow_max)
    .close()
    .extrude(-shallow_depth)
)

# Include separate solid round profile in the shallow tier
shallow_round_feature = (
    cq.Workplane("XY", origin=(axis_x, axis_y, -shallow_depth))
    .circle(round_profile_radius)
    .extrude(shallow_depth)
)

# 3. Deeper Concentric Annular Continuation (Z: -0.2189 to -0.0476)
annular_continuation = (
    cq.Workplane("XY", origin=(axis_x, axis_y, -shallow_depth))
    .circle(annular_outer_radius)
    .extrude(-deeper_depth)
)

# 4. Deeper Rectangular Strip Continuation (Z: -0.2189 to -0.0476)
y_strip_min = strip_offset_y
y_strip_max = y_strip_min + strip_width

strip_continuation = (
    cq.Workplane("XY", origin=(0, 0, -shallow_depth))
    .moveTo(0, y_strip_min)
    .lineTo(strip_length, y_strip_min)
    .lineTo(strip_length, y_strip_max)
    .lineTo(0, y_strip_max)
    .close()
    .extrude(-deeper_depth)
)

# Combine all solid additions into the main body
result = (
    base_plate
    .union(shallow_tier)
    .union(shallow_round_feature)
    .union(annular_continuation)
    .union(strip_continuation)
)

# 5. Inner Void Loop: Full through-hole opening along the central axis
# Preserves the inner void loops in the raised curved region as real openings
through_void = (
    cq.Workplane("XY", origin=(axis_x, axis_y, -0.25))
    .circle(annular_inner_radius)
    .extrude(0.35)
)
result = result.cut(through_void)

# 6. Pattern of 3 Circular Recesses on the side/underside area (X = 0)
# Cut along +X into the strip body at the specified Y and Z band
for y_pos in recess_y_coords:
    recess_cut = (
        cq.Workplane("YZ", origin=(0, y_pos, recess_z_center))
        .circle(recess_radius)
        .extrude(recess_depth)
    )
    result = result.cut(recess_cut)