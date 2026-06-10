import cadquery as cq
import math

# ============================================================
# Conical Strainer/Filter Basket
# Perforated truncated cone with reinforcement ribs, bands,
# slot perforations, circular holes, and hemispherical dome end
# ============================================================

# === Core Dimensions ===
large_radius = 100.0        # Outer radius at the open (large) end
small_radius = 40.0         # Outer radius at the closed (small) end
cone_length = 280.0         # Axial length of the conical section
wall_thickness = 2.5        # Shell wall thickness

# === Reinforcement Structure ===
num_ribs = 8                # Number of longitudinal ribs
rib_height = 3.0            # Rib protrusion above cone surface
rib_width = 3.0             # Rib thickness (tangential)

num_bands = 5               # Number of circumferential bands
band_height = 2.5           # Band protrusion above surface
band_width = 5.0            # Band width (axial direction)

# === Perforation Parameters ===
slot_length = 10.0          # Rectangular slot length
slot_width = 2.0            # Rectangular slot width
hole_diameter = 4.5         # Circular hole diameter along ribs

# === Rim at Open End ===
rim_extension = 3.0         # Radial extension beyond outer surface
rim_depth = 6.0             # Axial depth of rim

# === Derived Constants ===
cos45 = math.cos(math.pi / 4)
sin45 = math.sin(math.pi / 4)
inner_dome_r = small_radius - wall_thickness


def radius_at_z(z):
    """Outer cone radius at a given axial position z."""
    return large_radius + (small_radius - large_radius) * z / cone_length


# ============================================================
# STEP 1: Conical shell with hemispherical dome end cap
# ============================================================
# Profile in XZ plane revolved 360° around the Z axis
body = (
    cq.Workplane("XZ")
    # Outer surface from open end to dome junction
    .moveTo(large_radius, 0)
    .lineTo(small_radius, cone_length)
    # Outer dome arc (quarter circle, radius = small_radius)
    .threePointArc(
        (small_radius * cos45, cone_length + small_radius * sin45),
        (0, cone_length + small_radius)
    )
    # Traverse pole to inner dome surface
    .lineTo(0, cone_length + inner_dome_r)
    # Inner dome arc (quarter circle, radius = inner_dome_r)
    .threePointArc(
        (inner_dome_r * cos45, cone_length + inner_dome_r * sin45),
        (inner_dome_r, cone_length)
    )
    # Inner surface back to open end
    .lineTo(large_radius - wall_thickness, 0)
    .close()
    .revolve(360, (0, 0), (0, 1))
)

# ============================================================
# STEP 2: Rim/flange at the open end
# ============================================================
rim = (
    cq.Workplane("XZ")
    .moveTo(large_radius - wall_thickness, 0)
    .lineTo(large_radius - wall_thickness, -rim_depth)
    .lineTo(large_radius + rim_extension, -rim_depth)
    .lineTo(large_radius + rim_extension, 0)
    .close()
    .revolve(360, (0, 0), (0, 1))
)
body = body.union(rim)

# ============================================================
# STEP 3: Circumferential reinforcement bands
# ============================================================
band_positions = [
    15 + i * (cone_length - 30) / (num_bands - 1)
    for i in range(num_bands)
]

for z_pos in band_positions:
    r = radius_at_z(z_pos)
    band = (
        cq.Workplane("XZ")
        .moveTo(r, z_pos - band_width / 2)
        .lineTo(r + band_height, z_pos - band_width / 2)
        .lineTo(r + band_height, z_pos + band_width / 2)
        .lineTo(r, z_pos + band_width / 2)
        .close()
        .revolve(360, (0, 0), (0, 1))
    )
    body = body.union(band)

# ============================================================
# STEP 4: Longitudinal reinforcement ribs
# ============================================================
# Template rib at angle=0 (along X axis), extending from rim to dome
rib_template = (
    cq.Workplane("XZ")
    .moveTo(large_radius, -rim_depth)
    .lineTo(large_radius + rib_height, -rim_depth)
    .lineTo(small_radius + rib_height, cone_length)
    .lineTo(small_radius, cone_length)
    .close()
    .extrude(rib_width / 2, both=True)
)

# Place rib copies evenly around circumference
for i in range(num_ribs):
    angle = i * 360.0 / num_ribs
    body = body.union(
        rib_template.rotate((0, 0, 0), (0, 0, 1), angle)
    )

# ============================================================
# STEP 5: Cut perforations (slots and holes)
# ============================================================
cut_depth = wall_thickness + rib_height + band_height + 10
panel_angle = 360.0 / num_ribs
angle_margin = 6.0  # Degrees of margin from each rib edge

# Build all cutters into a single compound for one boolean cut
all_cutters = None

for band_idx in range(len(band_positions) - 1):
    # Axial zone between adjacent bands
    z_low = band_positions[band_idx] + band_width / 2 + 3
    z_high = band_positions[band_idx + 1] - band_width / 2 - 3
    z_span = z_high - z_low

    if z_span < 6:
        continue

    # --- Rectangular slot perforations in each panel ---
    num_rows = min(3, max(1, int(z_span / 12)))

    for rib_idx in range(num_ribs):
        a_start = rib_idx * panel_angle + angle_margin
        a_end = (rib_idx + 1) * panel_angle - angle_margin
        a_span = a_end - a_start

        for row in range(num_rows):
            z = z_low + (row + 0.5) * z_span / num_rows
            r = radius_at_z(z)
            arc_len = 2 * math.pi * r * a_span / 360
            num_slots = min(3, max(1, int(arc_len / (slot_length + 4))))

            for s in range(num_slots):
                slot_angle = a_start + (s + 0.5) * a_span / num_slots

                cutter = (
                    cq.Workplane("XY")
                    .box(cut_depth, slot_length, slot_width)
                    .translate((r, 0, z))
                    .rotate((0, 0, 0), (0, 0, 1), slot_angle)
                )
                if all_cutters is None:
                    all_cutters = cutter
                else:
                    all_cutters = all_cutters.union(cutter)

    # --- Circular holes along each rib ---
    num_holes = min(3, max(1, int(z_span / 16)))

    for rib_idx in range(num_ribs):
        rib_angle = rib_idx * panel_angle

        for h in range(num_holes):
            z = z_low + (h + 0.5) * z_span / num_holes
            r = radius_at_z(z)

            # Cylinder oriented radially through the wall
            hole_cutter = (
                cq.Workplane("XY")
                .circle(hole_diameter / 2)
                .extrude(cut_depth)
                .translate((0, 0, -cut_depth / 2))
                .rotate((0, 0, 0), (0, 1, 0), 90)
                .translate((r, 0, z))
                .rotate((0, 0, 0), (0, 0, 1), rib_angle)
            )
            if all_cutters is None:
                all_cutters = hole_cutter
            else:
                all_cutters = all_cutters.union(hole_cutter)

# Single boolean cut for all perforations
if all_cutters is not None:
    body = body.cut(all_cutters)

# Final result
result = body