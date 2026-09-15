import cadquery as cq
import math

# =========================================================
# Parametric Dimensions
# =========================================================

# Main upright body
body_radius = 28.0
body_height = 65.0

# Stepped circular collar (Top features)
collar_tier1_radius = 42.0       # Lower stepped tier (flange)
collar_tier1_height = 12.0       # Z: 65.0 -> 77.0
collar_tier2_radius = 36.0       # Upper stepped tier (rim)
collar_tier2_height = 10.0       # Z: 77.0 -> 87.0
total_height = body_height + collar_tier1_height + collar_tier2_height  # 87.0

# Side appendages (added solid mounting ears)
appendage_span = 72.0            # Center-to-center distance between ear ends
appendage_width = 24.0           # Width in Y direction
appendage_thickness = 10.0       # Vertical thickness
appendage_z_bottom = 10.0        # Elevation from bottom datum
appendage_z_top = appendage_z_bottom + appendage_thickness

# Small raised round portions (bosses on the appendages)
boss_radius = 7.5                # Outer radius of raised boss
boss_height = 3.5                # Protrusion height above appendage
boss_hole_radius = 4.0           # Through-hole radius
boss_x_offset = appendage_span / 2.0  # 36.0 mm from center

# Internal bore & coaxial recesses (Upper side)
central_bore_radius = 10.0       # Continuous internal bore
top_counterbore_radius = 22.0    # Upper hollow chamber
top_counterbore_depth = 20.0     # Reaches through tier 2 and into tier 1 (Z: 87 -> 67)

# Concentric rim features (cuts & recesses)
annular_groove_ri = 31.0         # Inner radius of top annular groove
annular_groove_ro = 33.5         # Outer radius of top annular groove
annular_groove_depth = 2.5       # Depth of groove into top face

# Elongated slot-like openings in the collar rim
slot_pcd_radius = 26.5           # Radial center of slots
slot_length = 8.0                # Arc-center distance of the slot
slot_width = 4.0                 # Width of slot
slot_depth = 5.0                 # Depth of cut into the rim
slot_angles = [45, 135, 225, 315]  # Symmetrical 4-slot layout

# Lower coaxial reach depths (measured directly from shared shoulder face Z = 0)
reach_depth_shallow = 4.0        # Shallow reach depth from shared face
lower_step1_radius = 24.0        # Radius of shallow pocket

reach_depth_mid = 15.0           # Intermediate reach depth from shared face
lower_step2_radius = 18.0        # Radius of intermediate bore

reach_depth_deep = 28.0          # Deep reach depth from shared face
lower_step3_radius = 14.0        # Radius of deep bore

# =========================================================
# Model Construction
# =========================================================

# 1. Create the main upright rounded body
body = (
    cq.Workplane("XY")
    .circle(body_radius)
    .extrude(body_height)
)

# 2. Add the thicker stepped circular collar tiers at the top
tier1 = (
    cq.Workplane("XY")
    .workplane(offset=body_height)
    .circle(collar_tier1_radius)
    .extrude(collar_tier1_height)
)

tier2 = (
    cq.Workplane("XY")
    .workplane(offset=body_height + collar_tier1_height)
    .circle(collar_tier2_radius)
    .extrude(collar_tier2_height)
)

result = body.union(tier1).union(tier2)

# Fillet the transition between the upright body and the collar tier 1
result = result.edges(
    cq.NearestToPointSelector((body_radius, 0, body_height))
).fillet(2.5)

# Chamfer outer rim transitions
result = result.edges(
    cq.NearestToPointSelector((collar_tier2_radius, 0, total_height))
).chamfer(1.0)
result = result.edges(
    cq.NearestToPointSelector((collar_tier1_radius, 0, body_height + collar_tier1_height))
).chamfer(1.0)
result = result.edges(
    cq.NearestToPointSelector((body_radius, 0, 0))
).chamfer(1.5)

# 3. Add side appendages (solid material ears protruding laterally)
appendages = (
    cq.Workplane("XY")
    .workplane(offset=appendage_z_bottom)
    .slot2D(appendage_span, appendage_width)
    .extrude(appendage_thickness)
)
result = result.union(appendages)

# 4. Add small raised round portions (bosses) on top of the appendages
bosses = (
    cq.Workplane("XY")
    .workplane(offset=appendage_z_top)
    .pushPoints([(-boss_x_offset, 0), (boss_x_offset, 0)])
    .circle(boss_radius)
    .extrude(boss_height)
)
result = result.union(bosses)

# Cut through-holes in the raised appendages/bosses
boss_holes = (
    cq.Workplane("XY")
    .workplane(offset=appendage_z_bottom - 1.0)
    .pushPoints([(-boss_x_offset, 0), (boss_x_offset, 0)])
    .circle(boss_hole_radius)
    .extrude(appendage_thickness + boss_height + 2.0)
)
result = result.cut(boss_holes)

# 5. Continuous central coaxial through-bore
central_bore = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .circle(central_bore_radius)
    .extrude(total_height + 2.0)
)
result = result.cut(central_bore)

# 6. Top coaxial counterbore (annular hollow extending through upper tiers)
top_counterbore = (
    cq.Workplane("XY")
    .workplane(offset=total_height - top_counterbore_depth)
    .circle(top_counterbore_radius)
    .extrude(top_counterbore_depth + 1.0)
)
result = result.cut(top_counterbore)

# 7. Concentric annular groove recess in the collar top face
annular_groove = (
    cq.Workplane("XY")
    .workplane(offset=total_height - annular_groove_depth)
    .circle(annular_groove_ro)
    .extrude(annular_groove_depth + 1.0)
    .cut(
        cq.Workplane("XY")
        .workplane(offset=total_height - annular_groove_depth - 0.5)
        .circle(annular_groove_ri)
        .extrude(annular_groove_depth + 2.0)
    )
)
result = result.cut(annular_groove)

# 8. Elongated slot-like openings in the rim of the collar
for angle in slot_angles:
    rad = math.radians(angle)
    x = slot_pcd_radius * math.cos(rad)
    y = slot_pcd_radius * math.sin(rad)
    slot_cutter = (
        cq.Workplane("XY")
        .workplane(offset=total_height - slot_depth)
        .center(x, y)
        .slot2D(slot_length, slot_width, angle + 90.0)
        .extrude(slot_depth + 1.0)
    )
    result = result.cut(slot_cutter)

# 9. Lower coaxial reach depths from shared shoulder face (datum at Z = 0)
# Each depth originates from the same shoulder plane rather than stacked end-to-end.

# Shallow reach depth
cut_shallow = (
    cq.Workplane("XY")
    .workplane(offset=-0.2)
    .circle(lower_step1_radius)
    .extrude(reach_depth_shallow + 0.2)
)
result = result.cut(cut_shallow)

# Intermediate reach depth
cut_mid = (
    cq.Workplane("XY")
    .workplane(offset=-0.2)
    .circle(lower_step2_radius)
    .extrude(reach_depth_mid + 0.2)
)
result = result.cut(cut_mid)

# Deep reach depth
cut_deep = (
    cq.Workplane("XY")
    .workplane(offset=-0.2)
    .circle(lower_step3_radius)
    .extrude(reach_depth_deep + 0.2)
)
result = result.cut(cut_deep)