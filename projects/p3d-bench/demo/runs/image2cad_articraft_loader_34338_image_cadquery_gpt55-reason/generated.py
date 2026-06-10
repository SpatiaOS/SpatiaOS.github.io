import math
import cadquery as cq

# -----------------------------------------------------------------------------
# Parameters
# -----------------------------------------------------------------------------
# Coordinate convention:
#   X: vehicle length (front/bucket is negative X)
#   Y: vehicle width
#   Z: vertical height
# Dimensions are estimated from the reference image and kept fully parametric.

# Main chassis and body
body_width = 32.0
frame_length = 74.0
frame_width = 30.0
frame_height = 4.0
frame_center_x = 0.0
frame_center_z = 23.5

lower_frame_length = 78.0
lower_frame_width = 24.0
lower_frame_height = 2.2
lower_frame_center_z = 20.5

rear_deck_length = 45.0
rear_deck_width = 42.0
rear_deck_thickness = 3.0
rear_deck_center_x = 17.5
rear_deck_center_z = 31.0
rear_deck_top_z = rear_deck_center_z + rear_deck_thickness / 2.0

# Wheels and tires
wheel_radius = 13.0
wheel_width = 8.0
wheel_center_y = 23.0
tread_radial_depth = 2.2
wheel_center_z = wheel_radius + tread_radial_depth + 0.3
front_wheel_x = -12.0
rear_wheel_x = 25.0

tread_count = 18
tread_tangent_length = 5.2
tread_side_overhang = 1.6

hub_radius = 6.2
hub_inner_radius = 3.7
hub_cap_radius = 1.45
hub_depth = 1.2
hub_cap_depth = 1.8

sidewall_tread_count = 8
sidewall_tread_depth = 0.8
sidewall_tread_width = 1.25
sidewall_inner_radius = wheel_radius * 0.63
sidewall_outer_radius = wheel_radius + 0.45
sidewall_tread_branch_angle = 17.0

axle_radius = 1.65
axle_length = 2.0 * wheel_center_y + wheel_width + 2.0

# Segmented wheel fenders
fender_arc_radius = wheel_radius + tread_radial_depth + 1.3
fender_segment_length = 7.4
fender_segment_thickness = 1.6
fender_width = wheel_width + 2.6
fender_angles = [-65.0, -40.0, -15.0, 10.0, 35.0, 60.0]

# Hood / engine cover
hood_width = 29.0
hood_profile = [
    (-35.5, 23.0),
    (-4.0, 23.0),
    (8.0, 32.0),
    (4.0, 36.8),
    (-20.0, 37.2),
    (-34.5, 30.0),
]
hood_top_start = (-30.5, 33.0)
hood_top_end = (-8.0, 37.0)
hood_grille_bar_width = 0.75
hood_grille_bar_height = 0.8

# Cab
cab_center_x = 19.0
cab_length = 22.0
cab_width = 24.0
cab_base_z = rear_deck_top_z
cab_wall_height = 24.0
cab_sill_height = 5.0
cab_post_size = 2.4
cab_roof_length = cab_length + 5.0
cab_roof_width = cab_width + 5.0
cab_roof_thickness = 4.8
cab_roof_fillet = 1.25

# Exhaust stack and roof beacon
exhaust_x = 34.0
exhaust_y = 15.5
exhaust_radius = 1.8
exhaust_height = 18.0
exhaust_cap_radius = 2.35
exhaust_cap_height = 1.4

beacon_radius = 1.8
beacon_height = 1.4

# Bucket / front scoop
bucket_width = 62.0
bucket_plate_thickness = 2.0
bucket_side_thickness = 2.0
bucket_bottom_front = (-72.0, 5.0)
bucket_bottom_rear = (-40.0, 13.0)
bucket_back_top = (-36.0, 30.0)
bucket_front_top = (-68.0, 22.0)
bucket_edge_radius = 1.25

# Loader arms and hydraulic linkages
loader_arm_y = body_width / 2.0 + 2.4
loader_arm_width = 2.8
loader_arm_thickness = 2.6
loader_pin_radius = 1.7
loader_pin_span = 2.0 * loader_arm_y + loader_arm_width + 2.0

loader_rear_pivot = (6.5, 38.0)
loader_elbow_pivot = (-14.0, 34.2)
loader_bucket_pivot = (-41.5, 23.0)
loader_lower_frame_pivot = (-25.0, 23.0)
loader_lower_bucket_pivot = (-49.0, 16.5)

hydraulic_barrel_radius = 1.45
hydraulic_rod_radius = 0.75

# Small side steps
step_width_x = 8.5
step_depth_y = 2.3
step_height = 0.8


# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------
def make_box(length_x, width_y, height_z, center, rotate_y=0.0, fillet_radius=0.0, fillet_selector=None):
    """Create a box centered at the origin, optionally fillet it, rotate about Y, then translate."""
    workplane = cq.Workplane("XY").box(length_x, width_y, height_z)

    if fillet_radius > 0.0:
        if fillet_selector:
            workplane = workplane.edges(fillet_selector).fillet(fillet_radius)
        else:
            workplane = workplane.edges().fillet(fillet_radius)

    shape = workplane.val()

    if abs(rotate_y) > 1.0e-9:
        shape = shape.rotate((0, 0, 0), (0, 1, 0), rotate_y)

    return shape.translate(center)


def make_cylinder_y(radius, length, center):
    """Create a cylinder with its axis along the global Y direction."""
    start_point = cq.Vector(center[0], center[1] - length / 2.0, center[2])
    return cq.Solid.makeCylinder(radius, length, start_point, cq.Vector(0, 1, 0))


def make_cylinder_z(radius, height, base_center):
    """Create a vertical cylinder starting at base_center."""
    start_point = cq.Vector(base_center[0], base_center[1], base_center[2])
    return cq.Solid.makeCylinder(radius, height, start_point, cq.Vector(0, 0, 1))


def make_cylinder_between(start, end, radius):
    """Create a cylinder between two arbitrary 3D points."""
    start_vec = cq.Vector(*start)
    end_vec = cq.Vector(*end)
    direction = end_vec - start_vec
    length = direction.Length
    return cq.Solid.makeCylinder(radius, length, start_vec, direction.normalized())


def make_beam_between_xz(start_xz, end_xz, width_y, thickness, center_y):
    """Create a rectangular beam following a line in the XZ plane at a fixed Y location."""
    dx = end_xz[0] - start_xz[0]
    dz = end_xz[1] - start_xz[1]
    length = math.hypot(dx, dz)
    angle_y = -math.degrees(math.atan2(dz, dx))

    center = (
        (start_xz[0] + end_xz[0]) / 2.0,
        center_y,
        (start_xz[1] + end_xz[1]) / 2.0,
    )

    return make_box(length, width_y, thickness, center, rotate_y=angle_y)


def make_prism_xz(points_xz, depth_y, center_y=0.0):
    """Extrude a 2D XZ profile symmetrically along Y."""
    shape = (
        cq.Workplane("XZ")
        .polyline(points_xz)
        .close()
        .extrude(depth_y, both=True)
        .val()
    )
    return shape.translate((0.0, center_y, 0.0))


def make_wheel_parts(center_x, center_y, center_z):
    """Create a chunky tire, side hubs, and raised chevron-like tread details."""
    parts = []

    # Main tire cylinder
    parts.append(make_cylinder_y(wheel_radius, wheel_width, (center_x, center_y, center_z)))

    # Gear-like outer tread blocks around the tire circumference
    for index in range(tread_count):
        angle = index * 360.0 / tread_count
        lug = make_box(
            tread_tangent_length,
            wheel_width + tread_side_overhang,
            tread_radial_depth,
            (center_x, center_y, center_z + wheel_radius + tread_radial_depth / 2.0),
        )
        lug = lug.rotate(
            (center_x, center_y, center_z),
            (center_x, center_y + 1.0, center_z),
            angle,
        )
        parts.append(lug)

    # Raised circular hub details on both wheel faces
    for face_sign in (-1.0, 1.0):
        hub_center_y = center_y + face_sign * (wheel_width / 2.0 + hub_depth / 2.0)
        cap_center_y = center_y + face_sign * (wheel_width / 2.0 + hub_cap_depth / 2.0)

        parts.append(make_cylinder_y(hub_radius, hub_depth, (center_x, hub_center_y, center_z)))
        parts.append(make_cylinder_y(hub_inner_radius, hub_depth * 1.15, (center_x, hub_center_y, center_z)))
        parts.append(make_cylinder_y(hub_cap_radius, hub_cap_depth, (center_x, cap_center_y, center_z)))

    # Chevron-like bars on the outer visible sidewall
    outer_side_sign = 1.0 if center_y >= 0.0 else -1.0
    chevron_center_y = center_y + outer_side_sign * (wheel_width / 2.0 + sidewall_tread_depth / 2.0 + 0.06)

    for index in range(sidewall_tread_count):
        theta = math.radians(index * 360.0 / sidewall_tread_count + 360.0 / sidewall_tread_count * 0.25)
        outer_point = (
            center_x + sidewall_outer_radius * math.cos(theta),
            center_z + sidewall_outer_radius * math.sin(theta),
        )

        for branch_sign in (-1.0, 1.0):
            inner_theta = theta + branch_sign * math.radians(sidewall_tread_branch_angle)
            inner_point = (
                center_x + sidewall_inner_radius * math.cos(inner_theta),
                center_z + sidewall_inner_radius * math.sin(inner_theta),
            )
            parts.append(
                make_beam_between_xz(
                    inner_point,
                    outer_point,
                    sidewall_tread_depth,
                    sidewall_tread_width,
                    chevron_center_y,
                )
            )

    return parts


def make_segmented_fender_parts(center_x, center_y, center_z):
    """Approximate the arched fenders with short tangent plates over the tire tops."""
    parts = []

    for angle in fender_angles:
        segment = make_box(
            fender_segment_length,
            fender_width,
            fender_segment_thickness,
            (center_x, center_y, center_z + fender_arc_radius + fender_segment_thickness / 2.0),
        )
        segment = segment.rotate(
            (center_x, center_y, center_z),
            (center_x, center_y + 1.0, center_z),
            angle,
        )
        parts.append(segment)

    return parts


# -----------------------------------------------------------------------------
# Model construction
# -----------------------------------------------------------------------------
model_components = []

# Wheels, tires, axles, and fenders
for axle_x in (front_wheel_x, rear_wheel_x):
    model_components.append(make_cylinder_y(axle_radius, axle_length, (axle_x, 0.0, wheel_center_z)))

    for wheel_y in (-wheel_center_y, wheel_center_y):
        model_components.extend(make_wheel_parts(axle_x, wheel_y, wheel_center_z))
        model_components.extend(make_segmented_fender_parts(axle_x, wheel_y, wheel_center_z))

# Main chassis rails and lower skid frame
model_components.append(make_box(frame_length, frame_width, frame_height, (frame_center_x, 0.0, frame_center_z)))
model_components.append(make_box(lower_frame_length, lower_frame_width, lower_frame_height, (frame_center_x, 0.0, lower_frame_center_z)))

for side in (-1.0, 1.0):
    model_components.append(
        make_box(
            frame_length,
            2.2,
            3.2,
            (frame_center_x, side * (frame_width / 2.0 - 1.0), frame_center_z - 2.3),
        )
    )

# Rear deck/platform with raised perimeter lip
model_components.append(make_box(rear_deck_length, rear_deck_width, rear_deck_thickness, (rear_deck_center_x, 0.0, rear_deck_center_z)))

deck_front_x = rear_deck_center_x - rear_deck_length / 2.0
deck_rear_x = rear_deck_center_x + rear_deck_length / 2.0
deck_edge_z = rear_deck_top_z + 0.45

model_components.append(make_box(rear_deck_length, 1.0, 0.9, (rear_deck_center_x, rear_deck_width / 2.0, deck_edge_z)))
model_components.append(make_box(rear_deck_length, 1.0, 0.9, (rear_deck_center_x, -rear_deck_width / 2.0, deck_edge_z)))
model_components.append(make_box(1.0, rear_deck_width, 0.9, (deck_front_x, 0.0, deck_edge_z)))
model_components.append(make_box(1.0, rear_deck_width, 0.9, (deck_rear_x, 0.0, deck_edge_z)))

# Rear bumper / counterweight block
model_components.append(make_box(4.0, rear_deck_width - 3.0, 6.0, (deck_rear_x + 1.0, 0.0, frame_center_z + 0.5)))

# Hood / engine cover as an extruded side profile
model_components.append(make_prism_xz(hood_profile, hood_width))

# Hood top grille: lengthwise rails and cross bars on the sloped surface
hood_surface_angle = -math.degrees(math.atan2(hood_top_end[1] - hood_top_start[1], hood_top_end[0] - hood_top_start[0]))
raised_hood_top_start = (hood_top_start[0], hood_top_start[1] + 0.75)
raised_hood_top_end = (hood_top_end[0], hood_top_end[1] + 0.75)

for grille_y in (-8.5, -3.0, 3.0, 8.5):
    model_components.append(
        make_beam_between_xz(
            raised_hood_top_start,
            raised_hood_top_end,
            hood_grille_bar_width,
            hood_grille_bar_height,
            grille_y,
        )
    )

for fraction in (0.18, 0.36, 0.54, 0.72, 0.90):
    x = hood_top_start[0] + fraction * (hood_top_end[0] - hood_top_start[0])
    z = hood_top_start[1] + fraction * (hood_top_end[1] - hood_top_start[1])
    model_components.append(
        make_box(
            0.9,
            hood_width - 5.0,
            hood_grille_bar_height,
            (x, 0.0, z + 0.85),
            rotate_y=hood_surface_angle,
        )
    )

# Vertical grille marks on the front face of the engine cover
for grille_y in (-10.0, -5.0, 0.0, 5.0, 10.0):
    model_components.append(make_box(0.8, 0.75, 6.2, (-35.7, grille_y, 27.4)))

# Side engine panel details
for side in (-1.0, 1.0):
    side_y = side * (hood_width / 2.0 + 0.45)
    model_components.append(make_box(28.0, 0.8, 4.6, (-17.0, side_y, 26.8)))
    for vent_x in (-28.0, -24.0, -20.0, -16.0):
        model_components.append(make_box(0.75, 0.9, 5.8, (vent_x, side_y, 28.5)))

# Side access steps between the wheels and cab
for side in (-1.0, 1.0):
    step_y = side * (body_width / 2.0 + 2.0)
    for index, step_z in enumerate((24.5, 27.4, 30.3)):
        model_components.append(
            make_box(
                step_width_x,
                step_depth_y,
                step_height,
                (2.0 + index * 0.5, step_y, step_z),
            )
        )

# Cab lower panels, posts, window frames, and roof
cab_front_x = cab_center_x - cab_length / 2.0
cab_rear_x = cab_center_x + cab_length / 2.0
cab_side_y = cab_width / 2.0
cab_top_z = cab_base_z + cab_wall_height
cab_post_center_z = cab_base_z + cab_wall_height / 2.0
cab_lower_panel_center_z = cab_base_z + cab_sill_height / 2.0
cab_header_top_z = cab_top_z - cab_post_size / 2.0
cab_sill_beam_z = cab_base_z + cab_sill_height + cab_post_size / 2.0

# Solid lower sill panels under the windows
model_components.append(make_box(cab_post_size, cab_width, cab_sill_height, (cab_front_x, 0.0, cab_lower_panel_center_z)))
model_components.append(make_box(cab_post_size, cab_width, cab_sill_height, (cab_rear_x, 0.0, cab_lower_panel_center_z)))

for side in (-1.0, 1.0):
    model_components.append(make_box(cab_length, cab_post_size, cab_sill_height, (cab_center_x, side * cab_side_y, cab_lower_panel_center_z)))

# Corner posts
for post_x in (cab_front_x, cab_rear_x):
    for post_y in (-cab_side_y, cab_side_y):
        model_components.append(make_box(cab_post_size, cab_post_size, cab_wall_height, (post_x, post_y, cab_post_center_z)))

# Front/rear center window dividers and side window dividers
model_components.append(make_box(cab_post_size, cab_post_size, cab_wall_height, (cab_front_x, 0.0, cab_post_center_z)))
model_components.append(make_box(cab_post_size, cab_post_size, cab_wall_height, (cab_rear_x, 0.0, cab_post_center_z)))

for side in (-1.0, 1.0):
    model_components.append(make_box(cab_post_size, cab_post_size, cab_wall_height, (cab_center_x, side * cab_side_y, cab_post_center_z)))

# Horizontal top headers
model_components.append(make_box(cab_post_size, cab_width + cab_post_size, cab_post_size, (cab_front_x, 0.0, cab_header_top_z)))
model_components.append(make_box(cab_post_size, cab_width + cab_post_size, cab_post_size, (cab_rear_x, 0.0, cab_header_top_z)))

for side in (-1.0, 1.0):
    model_components.append(make_box(cab_length + cab_post_size, cab_post_size, cab_post_size, (cab_center_x, side * cab_side_y, cab_header_top_z)))

# Lower window sills
model_components.append(make_box(cab_post_size, cab_width + cab_post_size, cab_post_size, (cab_front_x, 0.0, cab_sill_beam_z)))
model_components.append(make_box(cab_post_size, cab_width + cab_post_size, cab_post_size, (cab_rear_x, 0.0, cab_sill_beam_z)))

for side in (-1.0, 1.0):
    model_components.append(make_box(cab_length + cab_post_size, cab_post_size, cab_post_size, (cab_center_x, side * cab_side_y, cab_sill_beam_z)))

# Rounded cab roof and small raised roof cap
cab_roof_center_z = cab_top_z + cab_roof_thickness / 2.0
model_components.append(
    make_box(
        cab_roof_length,
        cab_roof_width,
        cab_roof_thickness,
        (cab_center_x, 0.0, cab_roof_center_z),
        fillet_radius=cab_roof_fillet,
    )
)
model_components.append(
    make_box(
        cab_roof_length - 3.0,
        cab_roof_width - 3.0,
        1.1,
        (cab_center_x, 0.0, cab_top_z + cab_roof_thickness + 0.55),
        fillet_radius=0.35,
    )
)

# Exhaust stack on the rear deck
model_components.append(make_cylinder_z(exhaust_radius, exhaust_height, (exhaust_x, exhaust_y, rear_deck_top_z)))
model_components.append(
    make_cylinder_z(
        exhaust_cap_radius,
        exhaust_cap_height,
        (exhaust_x, exhaust_y, rear_deck_top_z + exhaust_height),
    )
)

# Small roof beacon / vent detail
model_components.append(
    make_cylinder_z(
        beacon_radius,
        beacon_height,
        (cab_center_x + 6.0, cab_width / 2.0 - 4.0, cab_top_z + cab_roof_thickness),
    )
)

# Bucket: bottom, back wall, side plates, lips, and reinforcing ribs
model_components.append(make_beam_between_xz(bucket_bottom_front, bucket_bottom_rear, bucket_width, bucket_plate_thickness, 0.0))
model_components.append(make_beam_between_xz(bucket_bottom_rear, bucket_back_top, bucket_width, bucket_plate_thickness, 0.0))

bucket_side_profile = [
    bucket_bottom_front,
    bucket_bottom_rear,
    bucket_back_top,
    bucket_front_top,
]

for side in (-1.0, 1.0):
    side_panel_y = side * (bucket_width / 2.0 + bucket_side_thickness / 2.0)
    model_components.append(make_prism_xz(bucket_side_profile, bucket_side_thickness, center_y=side_panel_y))

    # Raised outlines on the bucket side plates
    side_edge_y = side * (bucket_width / 2.0 + bucket_side_thickness + 0.25)
    model_components.append(make_beam_between_xz(bucket_bottom_front, bucket_bottom_rear, 0.9, 1.1, side_edge_y))
    model_components.append(make_beam_between_xz(bucket_bottom_rear, bucket_back_top, 0.9, 1.1, side_edge_y))
    model_components.append(make_beam_between_xz(bucket_back_top, bucket_front_top, 0.9, 1.1, side_edge_y))
    model_components.append(make_beam_between_xz(bucket_front_top, bucket_bottom_front, 0.9, 1.1, side_edge_y))

# Bucket cutting edge and upper back lip
model_components.append(make_cylinder_y(bucket_edge_radius, bucket_width + 2.0 * bucket_side_thickness, (bucket_bottom_front[0], 0.0, bucket_bottom_front[1])))
model_components.append(make_cylinder_y(bucket_edge_radius, bucket_width + 2.0 * bucket_side_thickness, (bucket_back_top[0], 0.0, bucket_back_top[1])))

# Vertical ribs on the bucket back plate
for rib_y in (-20.0, -10.0, 0.0, 10.0, 20.0):
    model_components.append(make_beam_between_xz(bucket_bottom_rear, bucket_back_top, 1.0, 1.2, rib_y))

# Loader arms: two-piece raised arms on each side, plus lower links
for side in (-1.0, 1.0):
    arm_y = side * loader_arm_y

    model_components.append(make_beam_between_xz(loader_rear_pivot, loader_elbow_pivot, loader_arm_width, loader_arm_thickness, arm_y))
    model_components.append(make_beam_between_xz(loader_elbow_pivot, loader_bucket_pivot, loader_arm_width, loader_arm_thickness, arm_y))
    model_components.append(make_beam_between_xz(loader_lower_frame_pivot, loader_lower_bucket_pivot, loader_arm_width * 0.75, loader_arm_thickness * 0.75, arm_y))

    # Hydraulic lift cylinder: large barrel and slimmer polished rod
    barrel_start = (-26.0, arm_y, 23.7)
    barrel_end = (-14.5, arm_y, 29.0)
    rod_end = (3.5, arm_y, 37.0)

    model_components.append(make_cylinder_between(barrel_start, barrel_end, hydraulic_barrel_radius))
    model_components.append(make_cylinder_between(barrel_end, rod_end, hydraulic_rod_radius))

    # Short bucket curl link near the front scoop
    model_components.append(make_cylinder_between((-36.0, arm_y, 22.0), (-49.0, arm_y, 16.5), hydraulic_rod_radius))

# Cross pins/tubes through both loader arms
for pin_xz in (
    loader_rear_pivot,
    loader_elbow_pivot,
    loader_bucket_pivot,
    loader_lower_frame_pivot,
    loader_lower_bucket_pivot,
):
    model_components.append(make_cylinder_y(loader_pin_radius, loader_pin_span, (pin_xz[0], 0.0, pin_xz[1])))

# Additional cross tube just behind the bucket lip
model_components.append(make_cylinder_y(1.25, bucket_width - 8.0, (-45.0, 0.0, 19.0)))

# -----------------------------------------------------------------------------
# Final result
# -----------------------------------------------------------------------------
result = cq.Workplane("XY").newObject([cq.Compound.makeCompound(model_components)])