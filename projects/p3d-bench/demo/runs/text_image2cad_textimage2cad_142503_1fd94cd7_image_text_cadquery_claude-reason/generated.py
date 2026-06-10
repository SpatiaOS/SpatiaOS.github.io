import cadquery as cq
import math

# ============================================================
# Premier League Trophy — Parametric CAD Model
# Approximate overall envelope: 120 mm wide × 170 mm tall × 60 mm deep
# ============================================================

# ===================== Parameters =====================

# Pedestal body
body_top_z = 130.0          # height of pedestal body

# Crown
crown_z = body_top_z        # crown sits on top of pedestal
crown_outer_r = 24.0        # outer radius of crown ring
crown_inner_r = 18.5        # inner radius (bore ~37 mm dia)
crown_band_h = 8.0          # solid ring band height
crown_tooth_h = 12.0        # triangular tooth height above band
num_teeth = 10              # number of crown teeth
tooth_angle = 360.0 / num_teeth

# Crown geometry helpers
wall_thickness = crown_outer_r - crown_inner_r
mid_radius = (crown_outer_r + crown_inner_r) / 2.0

# Spheres
sphere_radius = 3.0         # bearing ball radius

# Handle cross-section
handle_cs_width = 7.5       # handle width (tangential)
handle_cs_depth = 4.0       # handle depth (radial)

# Cross-bar dimensions
bar_section = 7.5           # square cross-section size
upper_bar_length = 120.0    # parallel key length
lower_bar_length = 101.0    # shorter key length

# ===================== 1. Pedestal Body =====================
# Revolved half-profile in XZ plane (x = radius, y = height)
# Revolve axis: Z-axis → workplane local (0,0)→(0,1)

body = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    # --- Flared base ---
    .lineTo(28, 0)
    .lineTo(28, 8)
    # --- Main compound-curved profile ---
    .spline([
        (25, 12), (20, 18), (16, 25),          # base-to-stem taper
        (14, 36), (13, 48),                      # narrow stem
        (14, 58), (17, 68),                      # cup widening
        (22, 76), (26, 83), (27, 87),            # shoulder bulge
        (25, 92), (20, 97),                      # shoulder-to-neck
        (17, 102), (16, 107),                    # narrow neck
        (17, 111), (19, 115),                    # neck-to-top transition
        (20, 118),                               # top platform edge
    ])
    # --- Top platform and rim ---
    .lineTo(20, 122)
    .lineTo(20, body_top_z)
    .lineTo(0, body_top_z)
    .close()
    .revolve(360, (0, 0), (0, 1))
)

# ===================== 2. Crown Ring with Pointed Teeth =====================
# Solid annular base band
crown = (
    cq.Workplane("XY")
    .workplane(offset=crown_z)
    .circle(crown_outer_r)
    .circle(crown_inner_r)
    .extrude(crown_band_h)
)

# Triangular teeth lofted from wide base rectangle to narrow tip
for i in range(num_teeth):
    angle_deg = i * tooth_angle
    angle_rad = math.radians(angle_deg)

    # Center of tooth on mid-radius ring
    tcx = mid_radius * math.cos(angle_rad)
    tcy = mid_radius * math.sin(angle_rad)

    # Circumferential base width of tooth
    base_w = 2.0 * mid_radius * math.sin(math.radians(tooth_angle / 2.0)) * 0.90

    tooth = (
        cq.Workplane("XY")
        .transformed(
            offset=(tcx, tcy, crown_z + crown_band_h),
            rotate=(0, 0, angle_deg),
        )
        .rect(wall_thickness, base_w)
        .workplane(offset=crown_tooth_h)
        .rect(wall_thickness * 0.30, 0.5)
        .loft()
    )
    crown = crown.union(tooth)

# ===================== 3. Decorative Spheres (10-fold array) =====================
sphere_z = crown_z + crown_band_h + crown_tooth_h + sphere_radius * 0.5

for i in range(num_teeth):
    angle_rad = math.radians(i * tooth_angle)
    sx = mid_radius * math.cos(angle_rad)
    sy = mid_radius * math.sin(angle_rad)

    ball = (
        cq.Workplane("XY")
        .transformed(offset=(sx, sy, sphere_z))
        .sphere(sphere_radius)
    )
    crown = crown.union(ball)

# ===================== 4. Curved Handles (mirrored pair) =====================
# S-curve sweep path for right handle (XZ plane)
handle_path = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .spline([
        (12, 20), (28, 48), (38, 76),
        (40, 98), (36, 116), (28, 130), (22, 140),
    ])
)

# Sweep rectangular cross-section along path, then translate to body edge
handle_right = (
    cq.Workplane("XY")
    .rect(handle_cs_depth, handle_cs_width)
    .sweep(handle_path)
    .translate((22, 0, 10))
)

# Left handle is a mirror of the right about the YZ plane
handle_left = handle_right.mirror("YZ")

# ===================== 5. Horizontal Cross-bars =====================
# Upper bar — parallel key with rounded (slot) ends
upper_bar = (
    cq.Workplane("XY")
    .workplane(offset=152)
    .slot2D(upper_bar_length, bar_section, angle=0)
    .extrude(bar_section)
)

# Lower bar — slightly shorter key
lower_bar = (
    cq.Workplane("XY")
    .workplane(offset=142)
    .slot2D(lower_bar_length, bar_section, angle=0)
    .extrude(bar_section)
)

# ===================== 6. Decorative S-Curved Strips (4 total) =====================
# Thin strips that follow the handle contours
strip_path = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .spline([
        (6, 25), (16, 55), (24, 85),
        (24, 105), (18, 120), (10, 132), (5, 145),
    ])
)

strip_right_front = (
    cq.Workplane("XY")
    .rect(1.0, 4.0)
    .sweep(strip_path)
    .translate((18, 5, 5))
)

strip_right_back = strip_right_front.translate((0, -10, 0))
strip_left_front = strip_right_front.mirror("YZ")
strip_left_back = strip_right_back.mirror("YZ")

# ===================== Final Assembly =====================
result = body.union(crown)
result = result.union(handle_right).union(handle_left)
result = result.union(upper_bar).union(lower_bar)
result = result.union(strip_right_front).union(strip_right_back)
result = result.union(strip_left_front).union(strip_left_back)