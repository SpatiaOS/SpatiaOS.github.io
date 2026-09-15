import cadquery as cq

# ----------------------------------------------------------------------
# Parameters
# ----------------------------------------------------------------------
# Base disk dimensions
base_radius = 45.0          # Outer radius of the thin circular base
base_thickness = 4.0        # Thickness of the base disk

# Central sleeve dimensions
sleeve_outer_radius = 16.0  # Outer radius of the central vertical sleeve
sleeve_inner_radius = 12.0  # Inner bore radius of the sleeve
sleeve_height = 48.0        # Total height of the central sleeve from bottom

# Internal step / base cut dimensions
floor_hole_radius = 7.5     # Opening through the base floor (smaller than sleeve ID)

# Radial tabs dimensions
tab_count = 4               # Number of symmetric radial tabs
tab_height = 22.0           # Tab height (lower than sleeve for stepped profile)
tab_width = 10.0            # Width/thickness of each tab
tab_outer_radius = 38.0     # Outer reach of tabs across the base disk
tab_tip_radius = tab_width / 2.0  # Radius for rounded plan profile (semicircular end)

# ----------------------------------------------------------------------
# 1. Base Disk
# ----------------------------------------------------------------------
# Create the solid circular base plate
base = cq.Workplane("XY").circle(base_radius).extrude(base_thickness)

# ----------------------------------------------------------------------
# 2. Central Sleeve (Solid)
# ----------------------------------------------------------------------
# Create the solid cylinder for the tall center sleeve
sleeve_solid = (
    cq.Workplane("XY")
    .circle(sleeve_outer_radius)
    .extrude(sleeve_height)
)

# Combine base and sleeve
part = base.union(sleeve_solid)

# ----------------------------------------------------------------------
# 3. Solid Radial Tabs
# ----------------------------------------------------------------------
# Generate four radial tabs extending outward across the base
# Each tab has rounded plan edges (semicircular outer ends)
tab_x_inner = sleeve_inner_radius - 2.0   # Overlap into sleeve wall for solid union
tab_x_arc_center = tab_outer_radius - tab_tip_radius

for i in range(tab_count):
    angle = i * (360.0 / tab_count)
    
    # 2D profile in plan view with rounded outer end
    tab = (
        cq.Workplane("XY")
        .moveTo(tab_x_inner, -tab_tip_radius)
        .lineTo(tab_x_arc_center, -tab_tip_radius)
        .threePointsArc((tab_outer_radius, 0.0), (tab_x_arc_center, tab_tip_radius))
        .lineTo(tab_x_inner, tab_tip_radius)
        .close()
        .extrude(tab_height)
        .rotate((0, 0, 0), (0, 0, 1), angle)
    )
    part = part.union(tab)

# ----------------------------------------------------------------------
# 4. Hollow Sleeve Bore & Stepped Base Cut
# ----------------------------------------------------------------------
# Cut the hollow open bore down through the sleeve to the base floor level
sleeve_bore = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(sleeve_inner_radius)
    .extrude(sleeve_height)
)
part = part.cut(sleeve_bore)

# Cut the centered circular through-hole in the base floor,
# creating an internal shoulder/step beneath the sleeve bore
floor_cut = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .circle(floor_hole_radius)
    .extrude(base_thickness + 2.0)
)
result = part.cut(floor_cut)