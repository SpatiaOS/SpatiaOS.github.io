import math
import cadquery as cq

# ==============================================================================
# Parametric Dimensions
# ==============================================================================

# --- Outer Rim (Tier 1 - Deepest tier) ---
rim_outer_radius = 95.0       # Outer radius of the main annular rim
rim_inner_radius = 75.0       # Inner radius of the main annular rim
rim_thickness = 22.0          # Axial thickness of the outer rim (Z: -11 to +11)

# --- Concentric Collar / Hub (Tier 2 - Intermediate tier) ---
collar_outer_radius = 38.0    # Outer radius of the central collar
bore_radius = 22.0            # Radius of the hollow central bore (open center)
collar_thickness = 15.0       # Axial thickness of the collar (Z: -7.5 to +7.5)

# --- Rib Web (Tier 3 - Shallowest tier) ---
rib_thickness = 7.0           # Axial thickness of the radial ribs (Z: -3.5 to +3.5)
num_ribs = 6                  # Number of solid radial ribs / window cutouts
rib_angular_width = 16.0      # Angular thickness of each rib (degrees)

# --- Rounded Slot-like Window Spaces ---
window_inner_radius = 44.0    # Inner radius boundary of the window cutouts
window_outer_radius = 69.0    # Outer radius boundary of the window cutouts
window_corner_fillet = 4.5    # Radius for rounded corners of the slot windows

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Outer Annular Rim
# Deepest tier providing the main outer boundary with an open interior.
outer_rim = (
    cq.Workplane("XY")
    .cylinder(rim_thickness, rim_outer_radius)
    .cut(cq.Workplane("XY").cylinder(rim_thickness + 2.0, rim_inner_radius))
)

# 2. Concentric Hollow Center Collar
# Intermediate tier positioned at the center sharing the same axis, open bore.
center_collar = (
    cq.Workplane("XY")
    .cylinder(collar_thickness, collar_outer_radius)
    .cut(cq.Workplane("XY").cylinder(collar_thickness + 2.0, bore_radius))
)

# 3. Intermediate Web Blank
# Shallower tier spanning between the collar and outer rim.
# A small overlap ensures clean, robust boolean unions without non-manifold edges.
web_blank = (
    cq.Workplane("XY")
    .cylinder(rib_thickness, rim_inner_radius + 1.0)
    .cut(cq.Workplane("XY").cylinder(rib_thickness + 2.0, collar_outer_radius - 1.0))
)

# 4. Merge tiers into a stepped base part
# This establishes stepped faces on top and underside relief on the bottom.
stepped_base = outer_rim.union(center_collar).union(web_blank)

# Ensure the central bore remains clear through all tiers
stepped_base = stepped_base.cut(
    cq.Workplane("XY").cylinder(rim_thickness + 5.0, bore_radius)
)

# 5. Construct a Single Rounded Slot Window Cutter
# Calculate angular bounds for one cutout window
window_angle = (360.0 / num_ribs) - rib_angular_width
alpha = math.radians(window_angle / 2.0)

# Compute boundary vertices for the annular sector
p1 = (window_inner_radius * math.cos(-alpha), window_inner_radius * math.sin(-alpha))
p2 = (window_outer_radius * math.cos(-alpha), window_outer_radius * math.sin(-alpha))
p3 = (window_outer_radius * math.cos(alpha), window_outer_radius * math.sin(alpha))
p4 = (window_inner_radius * math.cos(alpha), window_inner_radius * math.sin(alpha))

# Midpoints along the concentric arcs for exact 3-point arc construction
arc_mid_outer = (window_outer_radius, 0.0)
arc_mid_inner = (window_inner_radius, 0.0)

# Extrude and fillet the cutter to form a rounded slot shape
cutter_height = rib_thickness * 3.0
slot_cutter = (
    cq.Workplane("XY")
    .moveTo(p1[0], p1[1])
    .lineTo(p2[0], p2[1])
    .threePointsArc(arc_mid_outer, p3)
    .lineTo(p4[0], p4[1])
    .threePointsArc(arc_mid_inner, p1)
    .close()
    .extrude(cutter_height / 2.0, both=True)
    .edges("|Z")
    .fillet(window_corner_fillet)
)

# 6. Cut Window Spaces to Form Radial Ribs
# Replicate the cutter radially around the central axis
result = stepped_base
for i in range(num_ribs):
    rot_angle = i * (360.0 / num_ribs)
    rotated_cutter = slot_cutter.rotate((0, 0, 0), (0, 0, 1), rot_angle)
    result = result.cut(rotated_cutter)