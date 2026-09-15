import cadquery as cq

# =============================================================================
# Parameters
# =============================================================================

# Base dimensions (low rectangular foundation)
base_length = 120.0       # Total length along X axis
base_width = 70.0         # Total width along Y axis
base_height = 10.0        # Shallow base thickness along Z axis

# Upright slab (full-width wall at one end)
slab_length = 14.0        # Thickness along X axis
slab_width = base_width   # Spans full width of the base
slab_height = 42.0        # Height from bottom of base

# Central block (tallest solid section, set inward from the slab)
central_start_x = 36.0    # Set inward along X axis
central_end_x = 78.0      # Extends to X = 78.0
central_length = central_end_x - central_start_x  # 42.0 mm
central_width = 62.0      # Set slightly inward from base width
central_height = 60.0     # Reaches higher than all other sections

# Narrow rear/right portion (intermediate shallower tier)
rear_start_x = central_end_x                      # 78.0 mm
rear_end_x = base_length                          # 120.0 mm
rear_length = rear_end_x - rear_start_x           # 42.0 mm
rear_tier_y_min = 2.0                             # Positioned on the right (+Y) side
rear_tier_y_max = base_width / 2.0                # Aligned with the outer right edge (+35.0 mm)
rear_tier_width = rear_tier_y_max - rear_tier_y_min  # 33.0 mm (narrow tier)
rear_tier_height = 26.0                           # Intermediate shallower height

# Concave bite (curved valley between upright wall and central block)
bite_start_x = slab_length                        # 14.0 mm
bite_end_x = central_start_x                      # 36.0 mm
bite_mid_x = (bite_start_x + bite_end_x) / 2.0    # 25.0 mm
bite_arc_top_z = 24.0                             # Tangent blend height on walls
bite_arc_bottom_z = base_height                   # Bottom touches top of base (10.0 mm)

# Cut-away recess near top and rear of the central block
recess_center_x = 72.0    # Near the rear face of the central block
recess_center_y = 0.0     # Centered across the block
recess_radius = 12.0      # Radius of the cut-away circular feature
recess_depth = 18.0       # Pocket depth cut into the top face

# =============================================================================
# Model Construction
# =============================================================================

# 1. Base: Solid rectangular stock (shallow tier)
base = cq.Workplane("XY").box(
    base_length, base_width, base_height, centered=(False, True, False)
)

# 2. Upright slab: Full-width wall at front end with rounded shoulders
slab = (
    cq.Workplane("XY")
    .box(slab_length, slab_width, slab_height, centered=(False, True, False))
    .edges("|X and >Z")
    .fillet(4.0)
    .edges("<X and >Z")
    .fillet(2.0)
)

# 3. Central block: Main tall raised mass set inward from the slab
central_block = (
    cq.Workplane("XY")
    .transformed(offset=(central_start_x, 0, 0))
    .box(central_length, central_width, central_height, centered=(False, True, False))
)

# 4. Rear/Right tier: Narrower shallower section extending to the back
rear_tier_center_y = (rear_tier_y_min + rear_tier_y_max) / 2.0
rear_tier = (
    cq.Workplane("XY")
    .transformed(offset=(rear_start_x, rear_tier_center_y, 0))
    .box(rear_length, rear_tier_width, rear_tier_height, centered=(False, True, False))
    .edges(">Z and >Y")
    .fillet(3.0)
)

# Combine the solid additive bodies into a unified closed stock
model = base.union(slab).union(central_block).union(rear_tier)

# 5. Concave bite: Smooth curved scoop between the upright wall and central block
# Profile drawn on the XZ plane with a circular arc dipping to the base height
bite_cutter = (
    cq.Workplane("XZ")
    .moveTo(bite_start_x, central_height + 10.0)
    .lineTo(bite_start_x, bite_arc_top_z)
    .threePointsArc((bite_mid_x, bite_arc_bottom_z), (bite_end_x, bite_arc_top_z))
    .lineTo(bite_end_x, central_height + 10.0)
    .close()
    .extrude(base_width, both=True)
)
model = model.cut(bite_cutter)

# 6. Top-rear cut-away recess: Cylindrical pocket cut into the top-rear corner
# (recess rather than an added boss)
recess_cutter = (
    cq.Workplane("XY")
    .workplane(offset=central_height)
    .transformed(offset=(recess_center_x, recess_center_y, 0))
    .circle(recess_radius)
    .extrude(-recess_depth)
)
model = model.cut(recess_cutter)

# Final result export
result = model