import math
import cadquery as cq

# Parameters (millimeters)
# Overall layout tuned to match the stated approximate envelope: 426.5 x 323.3 x 265.7 mm
central_large_gear_position = (0.0, 0.0, 0.0)
right_large_gear_position = (135.0, 0.0, 58.0)
small_gear_position = (-145.0, 128.0, 16.0)

# Large bevel gears, repeated twice
large_tooth_count = 56
large_outer_radius = 120.0
large_front_root_radius = 104.0
large_back_root_radius = 94.0
large_tooth_inner_radius = 52.0
large_body_thickness = 18.0
large_tooth_axial_raise = 4.5
large_bore_radius = 33.92
large_shaft_radius = 33.87
large_long_shaft_length = 175.0
large_short_shaft_length = 100.0
large_front_hub_radius = 48.0
large_front_hub_length = 16.0
large_rear_hub_radius = 42.0
large_rear_hub_length = 8.0
large_inner_rim_outer_radius = 58.0
large_inner_rim_length = 4.0

# Smaller bevel gear
small_tooth_count = 36
small_outer_radius = 75.5
small_front_root_radius = 65.0
small_back_root_radius = 60.0
small_tooth_inner_radius = 55.0
small_body_thickness = 16.0
small_tooth_axial_raise = 3.0
small_bore_radius = 14.45
small_pin_radius = 14.3998
small_pin_length = 120.0
small_front_hub_radius = 25.0
small_front_hub_length = 18.0
small_rear_hub_radius = 21.0
small_rear_hub_length = 5.0
small_inner_rim_outer_radius = 31.0
small_inner_rim_length = 3.0

# Tooth shape proportions
tooth_root_width_fraction = 0.72
tooth_tip_width_fraction = 0.46


def polar_point(radius, angle_radians):
    """Return an XY point from polar coordinates."""
    return (
        radius * math.cos(angle_radians),
        radius * math.sin(angle_radians),
    )


def make_annular_cylinder(outer_radius, inner_radius, length, center_z):
    """Create a centered annular cylinder along the local Z axis."""
    return (
        cq.Workplane("XY")
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(length, both=True)
        .translate((0.0, 0.0, center_z))
        .val()
    )


def make_solid_cylinder(radius, length, center_z):
    """Create a plain cylindrical shaft along the local Z axis."""
    return (
        cq.Workplane("XY")
        .circle(radius)
        .extrude(length, both=True)
        .translate((0.0, 0.0, center_z))
        .val()
    )


def make_radial_tooth(
    tooth_index,
    tooth_count,
    inner_radius,
    outer_radius,
    axial_thickness,
    axial_raise,
    phase_degrees=0.0,
):
    """Create one tapered radial tooth as a four-sided prism."""
    pitch_angle = 2.0 * math.pi / tooth_count
    center_angle = math.radians(phase_degrees) + tooth_index * pitch_angle

    root_half_angle = pitch_angle * tooth_root_width_fraction / 2.0
    tip_half_angle = pitch_angle * tooth_tip_width_fraction / 2.0

    tooth_profile = [
        polar_point(inner_radius, center_angle - root_half_angle),
        polar_point(outer_radius, center_angle - tip_half_angle),
        polar_point(outer_radius, center_angle + tip_half_angle),
        polar_point(inner_radius, center_angle + root_half_angle),
    ]

    return (
        cq.Workplane("XY")
        .polyline(tooth_profile)
        .close()
        .extrude(axial_thickness + axial_raise, both=True)
        .translate((0.0, 0.0, axial_raise / 2.0))
        .val()
    )


def make_hubbed_bevel_gear(
    tooth_count,
    outer_radius,
    front_root_radius,
    back_root_radius,
    tooth_inner_radius,
    body_thickness,
    tooth_axial_raise,
    bore_radius,
    front_hub_radius,
    front_hub_length,
    rear_hub_radius,
    rear_hub_length,
    inner_rim_outer_radius,
    inner_rim_length,
    shaft_radius,
    shaft_length,
    shaft_center_offset,
    tooth_phase_degrees=0.0,
):
    """Create a simplified bevel gear with radial teeth, hubs, bore, and shaft."""
    solids = []

    # Conical gear web, cut with an axial bore.
    gear_web_solid = cq.Solid.makeCone(
        back_root_radius,
        front_root_radius,
        body_thickness,
        cq.Vector(0.0, 0.0, -body_thickness / 2.0),
        cq.Vector(0.0, 0.0, 1.0),
    )
    bore_tool = cq.Workplane("XY").circle(bore_radius).extrude(body_thickness + 2.0, both=True)
    gear_web = cq.Workplane("XY").newObject([gear_web_solid]).cut(bore_tool).val()
    solids.append(gear_web)

    # Radial tooth array.
    for tooth_index in range(tooth_count):
        solids.append(
            make_radial_tooth(
                tooth_index=tooth_index,
                tooth_count=tooth_count,
                inner_radius=tooth_inner_radius,
                outer_radius=outer_radius,
                axial_thickness=body_thickness,
                axial_raise=tooth_axial_raise,
                phase_degrees=tooth_phase_degrees,
            )
        )

    # Raised front hub and decorative annular rim.
    front_hub_center_z = body_thickness / 2.0 + front_hub_length / 2.0 - 1.0
    solids.append(make_annular_cylinder(front_hub_radius, bore_radius, front_hub_length, front_hub_center_z))

    front_rim_center_z = body_thickness / 2.0 + inner_rim_length / 2.0 + 0.2
    solids.append(
        make_annular_cylinder(
            inner_rim_outer_radius,
            front_hub_radius * 0.98,
            inner_rim_length,
            front_rim_center_z,
        )
    )

    # Smaller rear collar to suggest the through-bore boss.
    rear_hub_center_z = -body_thickness / 2.0 - rear_hub_length / 2.0 + 1.0
    solids.append(make_annular_cylinder(rear_hub_radius, bore_radius, rear_hub_length, rear_hub_center_z))

    # Coaxial shaft or pin.
    solids.append(make_solid_cylinder(shaft_radius, shaft_length, shaft_center_offset))

    return cq.Compound.makeCompound(solids)


# Central large gear with the longer vertical shaft.
central_large_gear = make_hubbed_bevel_gear(
    tooth_count=large_tooth_count,
    outer_radius=large_outer_radius,
    front_root_radius=large_front_root_radius,
    back_root_radius=large_back_root_radius,
    tooth_inner_radius=large_tooth_inner_radius,
    body_thickness=large_body_thickness,
    tooth_axial_raise=large_tooth_axial_raise,
    bore_radius=large_bore_radius,
    front_hub_radius=large_front_hub_radius,
    front_hub_length=large_front_hub_length,
    rear_hub_radius=large_rear_hub_radius,
    rear_hub_length=large_rear_hub_length,
    inner_rim_outer_radius=large_inner_rim_outer_radius,
    inner_rim_length=large_inner_rim_length,
    shaft_radius=large_shaft_radius,
    shaft_length=large_long_shaft_length,
    shaft_center_offset=0.0,
    tooth_phase_degrees=0.0,
).translate(central_large_gear_position)

# Right large gear: same gear body, rotated so its axis is horizontal and its conical face points inward.
right_large_gear = make_hubbed_bevel_gear(
    tooth_count=large_tooth_count,
    outer_radius=large_outer_radius,
    front_root_radius=large_front_root_radius,
    back_root_radius=large_back_root_radius,
    tooth_inner_radius=large_tooth_inner_radius,
    body_thickness=large_body_thickness,
    tooth_axial_raise=large_tooth_axial_raise,
    bore_radius=large_bore_radius,
    front_hub_radius=large_front_hub_radius,
    front_hub_length=large_front_hub_length,
    rear_hub_radius=large_rear_hub_radius,
    rear_hub_length=large_rear_hub_length,
    inner_rim_outer_radius=large_inner_rim_outer_radius,
    inner_rim_length=large_inner_rim_length,
    shaft_radius=large_shaft_radius,
    shaft_length=large_short_shaft_length,
    shaft_center_offset=-20.0,
    tooth_phase_degrees=360.0 / large_tooth_count / 2.0,
).rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), -90.0).translate(right_large_gear_position)

# Smaller gear with its thin pin protruding axially upward from the hub.
small_pin_center_offset = -small_body_thickness / 2.0 - 1.0 + small_pin_length / 2.0
small_gear = make_hubbed_bevel_gear(
    tooth_count=small_tooth_count,
    outer_radius=small_outer_radius,
    front_root_radius=small_front_root_radius,
    back_root_radius=small_back_root_radius,
    tooth_inner_radius=small_tooth_inner_radius,
    body_thickness=small_body_thickness,
    tooth_axial_raise=small_tooth_axial_raise,
    bore_radius=small_bore_radius,
    front_hub_radius=small_front_hub_radius,
    front_hub_length=small_front_hub_length,
    rear_hub_radius=small_rear_hub_radius,
    rear_hub_length=small_rear_hub_length,
    inner_rim_outer_radius=small_inner_rim_outer_radius,
    inner_rim_length=small_inner_rim_length,
    shaft_radius=small_pin_radius,
    shaft_length=small_pin_length,
    shaft_center_offset=small_pin_center_offset,
    tooth_phase_degrees=5.0,
).translate(small_gear_position)

# Single display/result object for the complete assembly.
assembly_compound = cq.Compound.makeCompound(
    [
        central_large_gear,
        right_large_gear,
        small_gear,
    ]
)

result = cq.Workplane("XY").newObject([assembly_compound])