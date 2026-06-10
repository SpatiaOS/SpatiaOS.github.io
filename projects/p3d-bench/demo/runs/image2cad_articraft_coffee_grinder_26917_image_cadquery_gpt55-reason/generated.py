import cadquery as cq
import math

# Parameters (estimated proportions, units in millimeters)
base_width = 110.0
base_depth = 100.0
base_thickness = 6.0
base_chamfer = 1.3

base_deck_width = 96.0
base_deck_depth = 86.0
base_deck_thickness = 2.2
base_deck_chamfer = 0.7

base_frame_width = 88.0
base_frame_depth = 78.0
base_frame_strip_width = 1.4
base_frame_height = 0.8

body_width = 72.0
body_depth = 68.0
body_height = 54.0
body_corner_radius = 1.4

top_plate_width = 98.0
top_plate_depth = 88.0
top_plate_thickness = 7.0
top_plate_chamfer = 1.1

front_panel_width = 56.0
front_panel_height = 32.0
front_panel_thickness = 1.4
front_panel_chamfer = 0.35

front_trim_width = 66.0
front_trim_depth = 2.2
front_trim_height = 4.2

nameplate_width = 39.0
nameplate_height = 10.8
nameplate_thickness = 1.6
nameplate_border_thickness = 0.55
nameplate_text_size = 5.3
nameplate_text_depth = 0.6

front_knob_flange_radius = 8.0
front_knob_flange_length = 2.8
front_knob_radius = 6.2
front_knob_length = 5.8

hopper_clearance_above_top_plate = 1.0
hopper_height = 42.0
hopper_bottom_outer_radius = 34.5
hopper_top_outer_radius = 43.5
hopper_wall_thickness = 3.6
hopper_floor_thickness = 3.0

central_post_radius = 5.3
central_post_collar_radius = 8.3
central_post_collar_height = 3.0

handle_angle_degrees = -18.0
handle_above_rim = 3.8
handle_thickness = 3.0
hub_plate_length = 28.0
hub_plate_width = 18.0
handle_bar_length = 56.0
handle_bar_width = 9.0
end_pad_length = 20.0
end_pad_width = 13.0

hub_washer_radius = 7.2
hub_washer_thickness = 1.2
hub_nut_diameter = 10.0
hub_nut_height = 3.0
hub_screw_radius = 2.4
hub_screw_height = 0.9

crank_pin_radius = 2.5
crank_pin_height = 10.0
crank_knob_radius = 8.0
crank_knob_top_recess_radius = 2.2
crank_knob_top_ring_outer_radius = 4.5
crank_knob_top_ring_inner_radius = 2.2
crank_knob_top_ring_height = 1.1

# Derived placement values
base_top_z = base_thickness
base_deck_bottom_z = base_top_z
base_deck_top_z = base_deck_bottom_z + base_deck_thickness

body_bottom_z = base_deck_top_z
body_top_z = body_bottom_z + body_height
body_front_y = -body_depth / 2.0

top_plate_bottom_z = body_top_z
top_plate_top_z = top_plate_bottom_z + top_plate_thickness

hopper_bottom_z = top_plate_top_z + hopper_clearance_above_top_plate
hopper_top_z = hopper_bottom_z + hopper_height
hopper_floor_z = hopper_bottom_z + hopper_floor_thickness
hopper_bottom_inner_radius = hopper_bottom_outer_radius - hopper_wall_thickness
hopper_top_inner_radius = hopper_top_outer_radius - hopper_wall_thickness

handle_bottom_z = hopper_top_z + handle_above_rim
handle_top_z = handle_bottom_z + handle_thickness

central_post_bottom_z = hopper_floor_z
central_post_height = handle_top_z - central_post_bottom_z


# Helper functions
def rotate_xy(x_value, y_value, angle_degrees):
    """Rotate an XY point about the origin."""
    angle_radians = math.radians(angle_degrees)
    return (
        x_value * math.cos(angle_radians) - y_value * math.sin(angle_radians),
        x_value * math.sin(angle_radians) + y_value * math.cos(angle_radians),
    )


def chamfered_box(length, depth, height, chamfer_size, x=0.0, y=0.0, z_center=0.0):
    """Create a centered box with small chamfers on all edges."""
    part = cq.Workplane("XY").box(length, depth, height)
    if chamfer_size > 0:
        part = part.edges().chamfer(chamfer_size)
    return part.translate((x, y, z_center))


def rounded_vertical_box(length, depth, height, radius, x=0.0, y=0.0, z_center=0.0):
    """Create a box with rounded vertical edges."""
    part = cq.Workplane("XY").box(length, depth, height)
    if radius > 0:
        part = part.edges("|Z").fillet(radius)
    return part.translate((x, y, z_center))


def cylinder_z(radius, height, z_bottom, x=0.0, y=0.0, fillet=0.0):
    """Create a vertical cylinder positioned by its bottom face."""
    part = (
        cq.Workplane("XY")
        .workplane(offset=z_bottom + height / 2.0)
        .cylinder(height, radius)
    )
    if fillet > 0:
        part = part.edges("%Circle").fillet(fillet)
    return part.translate((x, y, 0.0))


def cylinder_y(radius, length, x, center_y, z_center, fillet=0.0):
    """Create a cylinder whose axis runs front-to-back along Y."""
    part = cq.Workplane("XY").cylinder(length, radius)
    if fillet > 0:
        part = part.edges("%Circle").fillet(fillet)
    return part.rotate((0, 0, 0), (1, 0, 0), 90).translate((x, center_y, z_center))


def cone_z(bottom_radius, top_radius, height, z_bottom, x=0.0, y=0.0):
    """Create a vertical frustum using a loft between two circular profiles."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_bottom)
        .circle(bottom_radius)
        .workplane(offset=height)
        .circle(top_radius)
        .loft(combine=True)
        .translate((x, y, 0.0))
    )


def annular_cylinder(outer_radius, inner_radius, height, z_bottom, x=0.0, y=0.0, fillet=0.0):
    """Create a vertical annular ring."""
    part = (
        cq.Workplane("XY")
        .workplane(offset=z_bottom)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(height)
    )
    if fillet > 0:
        part = part.edges("%Circle").fillet(fillet)
    return part.translate((x, y, 0.0))


def rectangular_frame(width, depth, strip_width, height, z_bottom, x=0.0, y=0.0):
    """Create four raised strips forming a rectangular frame."""
    z_center = z_bottom + height / 2.0
    return [
        cq.Workplane("XY")
        .box(width, strip_width, height)
        .translate((x, y - depth / 2.0 + strip_width / 2.0, z_center)),
        cq.Workplane("XY")
        .box(width, strip_width, height)
        .translate((x, y + depth / 2.0 - strip_width / 2.0, z_center)),
        cq.Workplane("XY")
        .box(strip_width, depth - 2.0 * strip_width, height)
        .translate((x - width / 2.0 + strip_width / 2.0, y, z_center)),
        cq.Workplane("XY")
        .box(strip_width, depth - 2.0 * strip_width, height)
        .translate((x + width / 2.0 - strip_width / 2.0, y, z_center)),
    ]


def orient_xy_profile_to_front(profile, y_back_plane, z_center, x_center=0.0):
    """Turn an XY extruded profile into a raised detail on the front XZ face."""
    return (
        profile.rotate((0, 0, 0), (1, 0, 0), 90)
        .translate((x_center, y_back_plane, z_center))
    )


# Collect separate solids as a compound to preserve the small decorative details.
component_shapes = []


def add_component(component):
    if isinstance(component, cq.Workplane):
        component_shapes.extend(component.vals())
    elif isinstance(component, (list, tuple)):
        for item in component:
            add_component(item)
    else:
        component_shapes.append(component)


# Base plinth with a raised deck and decorative rectangular frames
base_plate = chamfered_box(
    base_width,
    base_depth,
    base_thickness,
    base_chamfer,
    z_center=base_thickness / 2.0,
)
add_component(base_plate)

base_deck = chamfered_box(
    base_deck_width,
    base_deck_depth,
    base_deck_thickness,
    base_deck_chamfer,
    z_center=base_deck_bottom_z + base_deck_thickness / 2.0,
)
add_component(base_deck)

add_component(
    rectangular_frame(
        base_frame_width,
        base_frame_depth,
        base_frame_strip_width,
        base_frame_height,
        base_deck_top_z,
    )
)

# Small front-left inset detail visible on the base
add_component(
    rectangular_frame(
        24.0,
        10.0,
        1.0,
        0.55,
        base_deck_top_z + 0.05,
        x=-34.0,
        y=-42.0,
    )
)

# Main square grinder body
body = rounded_vertical_box(
    body_width,
    body_depth,
    body_height,
    body_corner_radius,
    z_center=body_bottom_z + body_height / 2.0,
)
add_component(body)

# Rounded front corner posts/ribs
front_post_height = body_height - 7.0
for post_x in (-body_width / 2.0 + 2.2, body_width / 2.0 - 2.2):
    add_component(
        cylinder_z(
            2.4,
            front_post_height,
            body_bottom_z + 3.5,
            x=post_x,
            y=body_front_y - 0.9,
            fillet=0.25,
        )
    )

# Raised front panel and upper front trim
front_panel_center_z = body_bottom_z + 20.5
front_panel = chamfered_box(
    front_panel_width,
    front_panel_thickness,
    front_panel_height,
    front_panel_chamfer,
    y=body_front_y - front_panel_thickness / 2.0,
    z_center=front_panel_center_z,
)
add_component(front_panel)

front_trim = rounded_vertical_box(
    front_trim_width,
    front_trim_depth,
    front_trim_height,
    0.8,
    y=body_front_y - front_trim_depth / 2.0,
    z_center=body_top_z - 17.5,
)
add_component(front_trim)

# Oval front nameplate with raised border and text
nameplate_center_z = body_top_z - 15.5
nameplate_back_y = body_front_y + 0.05
nameplate_outer_y = nameplate_back_y - nameplate_thickness

nameplate_base_flat = (
    cq.Workplane("XY")
    .ellipse(nameplate_width / 2.0, nameplate_height / 2.0)
    .extrude(nameplate_thickness)
)
nameplate_base = orient_xy_profile_to_front(
    nameplate_base_flat,
    nameplate_back_y,
    nameplate_center_z,
)
add_component(nameplate_base)

nameplate_border_flat = (
    cq.Workplane("XY")
    .ellipse(nameplate_width / 2.0, nameplate_height / 2.0)
    .ellipse(nameplate_width / 2.0 - 1.7, nameplate_height / 2.0 - 1.4)
    .extrude(nameplate_border_thickness)
)
nameplate_border = orient_xy_profile_to_front(
    nameplate_border_flat,
    nameplate_outer_y - 0.03,
    nameplate_center_z,
)
add_component(nameplate_border)

# Text may depend on installed fonts; if unavailable, the rest of the model still builds.
try:
    nameplate_text_flat = cq.Workplane("XY").text(
        "Fusion 360",
        nameplate_text_size,
        nameplate_text_depth,
        cut=False,
        combine=False,
        halign="center",
        valign="center",
    )
    nameplate_text = orient_xy_profile_to_front(
        nameplate_text_flat,
        nameplate_outer_y - nameplate_border_thickness - 0.08,
        nameplate_center_z - 0.2,
    )
    add_component(nameplate_text)
except Exception:
    pass

# Front control knob
front_knob_z = body_bottom_z + 17.5
front_knob_surface_y = body_front_y - front_panel_thickness

front_knob_flange = cylinder_y(
    front_knob_flange_radius,
    front_knob_flange_length,
    0.0,
    front_knob_surface_y - front_knob_flange_length / 2.0,
    front_knob_z,
    fillet=0.35,
)
add_component(front_knob_flange)

front_knob_body = cylinder_y(
    front_knob_radius,
    front_knob_length,
    0.0,
    front_knob_surface_y - front_knob_flange_length - front_knob_length / 2.0 + 0.5,
    front_knob_z,
    fillet=0.85,
)
add_component(front_knob_body)

# Broad square top plate beneath the circular hopper
top_plate = chamfered_box(
    top_plate_width,
    top_plate_depth,
    top_plate_thickness,
    top_plate_chamfer,
    z_center=top_plate_bottom_z + top_plate_thickness / 2.0,
)
add_component(top_plate)

add_component(
    rectangular_frame(
        top_plate_width - 8.0,
        top_plate_depth - 8.0,
        1.2,
        0.55,
        top_plate_top_z + 0.05,
    )
)

# Circular base rings that locate the hopper on the top plate
add_component(annular_cylinder(40.0, 31.0, 1.8, top_plate_top_z, fillet=0.25))
add_component(annular_cylinder(37.4, 31.8, 1.2, top_plate_top_z + 1.6, fillet=0.18))

# Hollow tapered hopper bowl: outer frustum minus inner frustum
hopper_outer = cone_z(
    hopper_bottom_outer_radius,
    hopper_top_outer_radius,
    hopper_height,
    hopper_bottom_z,
)

hopper_inner_void_height = (hopper_top_z + 2.0) - hopper_floor_z
hopper_inner_void = cone_z(
    hopper_bottom_inner_radius,
    hopper_top_inner_radius + 1.2,
    hopper_inner_void_height,
    hopper_floor_z,
)

hopper_shell = hopper_outer.cut(hopper_inner_void)
add_component(hopper_shell)

# Decorative lower hopper foot rings
add_component(
    annular_cylinder(
        hopper_bottom_outer_radius + 4.0,
        hopper_bottom_inner_radius - 1.8,
        2.3,
        hopper_bottom_z - 0.2,
        fillet=0.3,
    )
)
add_component(
    annular_cylinder(
        hopper_bottom_outer_radius + 2.6,
        hopper_bottom_inner_radius - 0.6,
        1.1,
        hopper_bottom_z + 3.2,
        fillet=0.18,
    )
)
add_component(
    annular_cylinder(
        hopper_bottom_outer_radius + 1.4,
        hopper_bottom_inner_radius + 0.6,
        1.1,
        hopper_bottom_z + 5.7,
        fillet=0.18,
    )
)

# Decorative upper hopper lip and thin grooves/ridges
add_component(
    annular_cylinder(
        hopper_top_outer_radius + 2.7,
        hopper_top_inner_radius - 1.0,
        3.2,
        hopper_top_z - 1.0,
        fillet=0.35,
    )
)
add_component(
    annular_cylinder(
        hopper_top_outer_radius + 1.3,
        hopper_top_inner_radius - 0.2,
        1.1,
        hopper_top_z - 5.0,
        fillet=0.18,
    )
)
add_component(
    annular_cylinder(
        hopper_top_outer_radius + 0.2,
        hopper_top_inner_radius + 0.4,
        1.0,
        hopper_top_z - 8.3,
        fillet=0.15,
    )
)

# Concentric ridges on the visible inside floor of the hopper
inner_floor_z = hopper_floor_z + 0.08
add_component(annular_cylinder(31.0, 22.0, 0.9, inner_floor_z, fillet=0.12))
add_component(annular_cylinder(28.0, 26.2, 0.85, inner_floor_z + 1.0, fillet=0.1))
add_component(annular_cylinder(24.2, 22.7, 0.85, inner_floor_z + 1.9, fillet=0.1))

# Subtle vertical seam line on the front-right side of the hopper
hopper_seam_radius = (hopper_bottom_outer_radius + hopper_top_outer_radius) / 2.0 + 0.35
hopper_seam_height = hopper_height - 6.0
hopper_seam = (
    cq.Workplane("XY")
    .box(0.9, 0.7, hopper_seam_height)
    .translate(
        (
            0.0,
            -hopper_seam_radius,
            hopper_bottom_z + hopper_height / 2.0,
        )
    )
    .rotate((0, 0, 0), (0, 0, 1), 28.0)
)
add_component(hopper_seam)

# Central vertical post rising through the hopper
add_component(
    cylinder_z(
        central_post_radius,
        central_post_height,
        central_post_bottom_z,
        fillet=0.35,
    )
)
add_component(
    cylinder_z(
        central_post_collar_radius,
        central_post_collar_height,
        central_post_bottom_z,
        fillet=0.25,
    )
)

# Hand crank: hub plate, long handle, and end pad
hub_plate = rounded_vertical_box(
    hub_plate_length,
    hub_plate_width,
    handle_thickness,
    1.1,
    z_center=handle_bottom_z + handle_thickness / 2.0,
).rotate((0, 0, 0), (0, 0, 1), handle_angle_degrees)
add_component(hub_plate)

handle_bar_center_x = hub_plate_length / 2.0 + handle_bar_length / 2.0 - 2.0
handle_bar = rounded_vertical_box(
    handle_bar_length,
    handle_bar_width,
    handle_thickness,
    handle_bar_width / 2.0 - 0.45,
    x=handle_bar_center_x,
    z_center=handle_bottom_z + handle_thickness / 2.0,
).rotate((0, 0, 0), (0, 0, 1), handle_angle_degrees)
add_component(handle_bar)

end_pad_center_x = hub_plate_length / 2.0 + handle_bar_length - 3.0
end_pad = rounded_vertical_box(
    end_pad_length,
    end_pad_width,
    handle_thickness,
    1.0,
    x=end_pad_center_x,
    z_center=handle_bottom_z + handle_thickness / 2.0,
).rotate((0, 0, 0), (0, 0, 1), handle_angle_degrees)
add_component(end_pad)

# Hub washer and hex-head fastener
add_component(
    cylinder_z(
        hub_washer_radius,
        hub_washer_thickness,
        handle_top_z,
        fillet=0.15,
    )
)

hub_nut = (
    cq.Workplane("XY")
    .workplane(offset=handle_top_z + hub_washer_thickness)
    .polygon(6, hub_nut_diameter)
    .extrude(hub_nut_height)
)
add_component(hub_nut)

add_component(
    cylinder_z(
        hub_screw_radius,
        hub_screw_height,
        handle_top_z + hub_washer_thickness + hub_nut_height,
        fillet=0.1,
    )
)

# End pad screw detail
end_screw_local_x = end_pad_center_x + end_pad_length * 0.32
end_screw_local_y = -end_pad_width * 0.18
end_screw_x, end_screw_y = rotate_xy(
    end_screw_local_x,
    end_screw_local_y,
    handle_angle_degrees,
)
add_component(
    cylinder_z(
        2.4,
        0.9,
        handle_top_z,
        x=end_screw_x,
        y=end_screw_y,
        fillet=0.12,
    )
)

# Crank knob at the end of the handle
crank_knob_local_x = end_pad_center_x - 1.0
crank_knob_local_y = 0.0
crank_knob_x, crank_knob_y = rotate_xy(
    crank_knob_local_x,
    crank_knob_local_y,
    handle_angle_degrees,
)

add_component(
    cylinder_z(
        crank_pin_radius,
        crank_pin_height,
        handle_top_z,
        x=crank_knob_x,
        y=crank_knob_y,
        fillet=0.18,
    )
)

crank_knob_center_z = handle_top_z + 7.0
crank_knob_body = (
    cq.Workplane("XY")
    .sphere(crank_knob_radius)
    .translate((crank_knob_x, crank_knob_y, crank_knob_center_z))
)

crank_knob_recess = cylinder_z(
    crank_knob_top_recess_radius,
    5.0,
    crank_knob_center_z + crank_knob_radius - 3.8,
    x=crank_knob_x,
    y=crank_knob_y,
)
crank_knob_body = crank_knob_body.cut(crank_knob_recess)
add_component(crank_knob_body)

add_component(
    annular_cylinder(
        crank_knob_top_ring_outer_radius,
        crank_knob_top_ring_inner_radius,
        crank_knob_top_ring_height,
        crank_knob_center_z + crank_knob_radius - crank_knob_top_ring_height - 0.4,
        x=crank_knob_x,
        y=crank_knob_y,
        fillet=0.1,
    )
)

# Final compound result
final_compound = cq.Compound.makeCompound(component_shapes)
result = cq.Workplane("XY").add(final_compound)