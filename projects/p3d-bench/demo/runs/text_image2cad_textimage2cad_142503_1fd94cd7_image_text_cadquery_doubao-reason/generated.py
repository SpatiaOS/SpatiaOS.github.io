import cadquery as cq
import math as m

# --------------------------
# Parameters
# --------------------------
# Pedestal dimensions
pedestal_base_dia = 60.0
pedestal_height = 130.0
emboss_text_depth = 0.8
emboss_text_size = 8.0

# Crown dimensions
crown_outer_dia = 50.0
crown_inner_dia = 36.88
crown_height = 20.0
num_crown_teeth = 10

# Bearing balls
ball_radius = 3.0
num_balls = 10

# Handles
main_handle_thickness = 7.5
main_handle_width = 20.0
handle_outer_offset = 55.0

# Support strips
strip_thickness = 1.2
strip_width = 10.0

# Overall envelope target: 60 × 178 × 120 mm
total_height = pedestal_height + crown_height + 2*ball_radius

# --------------------------
# 1. Create Pedestal Body
# --------------------------
# Revolved 2D profile of the trophy body
pedestal_profile = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(pedestal_base_dia/2, 0)
    .lineTo(pedestal_base_dia/2, 12)  # Flared base
    .spline([
        (pedestal_base_dia/2 - 6, 45),  # Tapered midsection
        (pedestal_base_dia/2 - 2, 90),
        (pedestal_base_dia/2 + 4, 102)  # Bulging shoulder
    ], includeCurrent=True)
    .spline([
        (crown_inner_dia/2 + 3, 118),  # Concave neck
        (crown_inner_dia/2, pedestal_height)
    ], includeCurrent=True)
    .lineTo(0, pedestal_height)
    .close()
)
pedestal = pedestal_profile.revolve(360, axisStart=(0, 0, 0), axisEnd=(0, 1, 0))

# Add embossed text
text = (
    cq.Workplane("YZ", origin=(pedestal_base_dia/2 - 2, 0, 60))
    .text("Premier\nLeague", emboss_text_size, emboss_text_depth, font="Arial", combine=False)
)
pedestal = pedestal.union(text)

# --------------------------
# 2. Create Serrated Crown Ring
# --------------------------
# Generate zigzag crown profile points
crown_points = []
for i in range(2 * num_crown_teeth):
    angle = m.radians(i * 360 / (2 * num_crown_teeth))
    r = crown_outer_dia/2 if i % 2 == 0 else (crown_inner_dia/2 + 3)
    crown_points.append((r * m.cos(angle), r * m.sin(angle)))

crown = (
    cq.Workplane("XY")
    .polyline(crown_points).close()
    .extrude(crown_height)
    .translate((0, 0, pedestal_height))
    .cut(
        cq.Workplane("XY")
        .circle(crown_inner_dia/2)
        .extrude(crown_height)
        .translate((0, 0, pedestal_height))
    )
)

# --------------------------
# 3. Add Crown Tip Balls (FIXED: array locations defined before creating spheres)
# --------------------------
balls = (
    cq.Workplane("XY")
    .polarArray(crown_outer_dia/2, 0, 360, num_balls)
    .sphere(ball_radius)
    .translate((0, 0, pedestal_height + crown_height))
)

# --------------------------
# 4. Create Curved Handles (Mirrored Pair)
# --------------------------
# S-curve path for main handle
handle_path = (
    cq.Workplane("XZ")
    .moveTo(handle_outer_offset, 0)
    .spline([
        (handle_outer_offset + 5, 60),
        (handle_outer_offset - 5, 90),
        (handle_outer_offset - 20, total_height - 15)
    ], includeCurrent=True)
)

# Sweep cross section along path
main_handle = (
    cq.Workplane("YZ")
    .rect(main_handle_thickness, main_handle_width)
    .sweep(handle_path)
)
# Mirror second handle across YZ plane
main_handle_mirrored = main_handle.mirror(mirrorPlane="YZ")

# --------------------------
# 5. Create Curved Support Strips (4 total, 2 per side)
# --------------------------
def make_support_strip(offset_x):
    strip_path = (
        cq.Workplane("XZ")
        .moveTo(offset_x, 5)
        .spline([
            (offset_x + 4, 60),
            (offset_x - 3, 100),
            (offset_x - 10, total_height - 25)
        ], includeCurrent=True)
    )
    return (
        cq.Workplane("YZ")
        .rect(strip_thickness, strip_width)
        .sweep(strip_path)
    )

strip_inner = make_support_strip(handle_outer_offset - 12)
strip_outer = make_support_strip(handle_outer_offset - 6)
# Mirror strips to opposite side
strip_inner_mirrored = strip_inner.mirror("YZ")
strip_outer_mirrored = strip_outer.mirror("YZ")

# --------------------------
# Combine all components into single unified model
# --------------------------
result = (
    pedestal
    .union(crown)
    .union(balls)
    .union(main_handle)
    .union(main_handle_mirrored)
    .union(strip_inner)
    .union(strip_outer)
    .union(strip_inner_mirrored)
    .union(strip_outer_mirrored)
)