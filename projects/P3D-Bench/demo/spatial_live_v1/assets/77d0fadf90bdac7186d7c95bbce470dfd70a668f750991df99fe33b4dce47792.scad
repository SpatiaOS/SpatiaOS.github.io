// Image-estimated dimensions, mm
$fn = 96;
epsilon = 0.03;

gear_module = 1.4;
pressure_angle = 20;
backlash = 0.14;
involute_steps = 7;
ring_teeth = 96;
sun_teeth = 60;
planet_count = 3;
sun_phase = 0;

axis_height = 91;
ring_outer_radius = 78;
ring_front_y = 8;
ring_depth = 14;
rear_lip_depth = 1.2;
rear_lip_width = 3;

gear_depth = 9;
sun_spokes = 5;
sun_spoke_angle = 13;
sun_window_inner = 12.5;
sun_rim_width = 5;
sun_hub_diameter = 23;
hub_projection = 1;
planet_hub_diameter = 8.5;
planet_hole_diameter = 3.2;
planet_hole_radius = 7.1;

carrier_front_y = -1;
carrier_depth = 3.5;
carrier_rear_clearance = 1.5;
carrier_hub_diameter = 20;
carrier_arm_width = 5.5;
carrier_eye_diameter = 11;
carrier_slot_width = 2;
carrier_slot_margin = 5;
planet_pin_diameter = 4.5;
planet_pin_front_y = -18;
washer_depth = 1.3;
bolt_head_diameter = 7;
bolt_head_depth = 2.5;
socket_diameter = 2.7;
socket_depth = 1.2;

shaft_diameter = 10.5;
shaft_front_y = -91;
shaft_rear_y = 39;
shaft_cap_diameter = 18;
shaft_cap_depth = 3;
shaft_end_bore = 7;
shaft_end_bore_depth = 5;
sleeve_diameter = 15.5;
sleeve_front_y = -83;

bearing_front_y = -62;
bearing_length = 40;
bearing_diameter = 23;
bearing_flange_diameter = 26;
bearing_flange_depth = 3;
rear_bearing_diameter = 20;
rear_bearing_front_y = 29;
oil_stem_diameter = 5;
oil_stem_height = 3;
oil_cap_diameter = 7;
oil_cap_height = 2.5;
oil_embed = 0.8;
oil_y = -28;

lever_width = 7;
lever_depth = 4.5;
lever_chamfer = 1;
lever_collar_diameter = 19;
lever_collar_depth = 6;
lever_slot_size = 3;
lever_slot_radius = 17;
upright_length = 116;
upright_angle = 3;
upright_y = -74;
diagonal_length = 174;
diagonal_angle = -35;
diagonal_y = -63.5;
short_length = 46;
short_angle = 65;
short_y = -85;

grip_length = 25;
grip_diameter = 8;
grip_flange_diameter = 9.3;
grip_flange_depth = 1.5;
grip_end_diameter = 8.5;
grip_recess_diameter = 5.5;
grip_recess_depth = 1.1;

stand_width = 114;
stand_top_width = 16;
stand_plate_depth = 5.5;
front_stand_y = -42;
rear_stand_y = 31;
stand_border = 13;
base_width = 124;
base_front_y = -50;
base_rear_y = 43;
rail_width = 8;
rail_height = 6;
foot_width = 12;
foot_depth = 12;
foot_height = 3;
foot_overlap = 1;
foot_chamfer = 1.2;
ring_mount_spacing = 0.52 * ring_outer_radius;
ring_mount_width = 10;
frame_bolt_inset = 9;
frame_bolt_height = 7;

frame_color = [0.61, 0.62, 0.64];
rim_color = [0.67, 0.68, 0.70];
gear_color = [0.70, 0.71, 0.72];
steel_color = [0.74, 0.75, 0.77];

// Derived geometry
planet_teeth = (ring_teeth - sun_teeth) / 2;
ring_pitch_radius = gear_module * ring_teeth / 2;
sun_pitch_radius = gear_module * sun_teeth / 2;
planet_pitch_radius = gear_module * planet_teeth / 2;
planet_orbit = sun_pitch_radius + planet_pitch_radius;
sun_root_radius = sun_pitch_radius - 1.25 * gear_module;
ring_root_radius = ring_pitch_radius + 1.25 * gear_module;
gear_front_y = ring_front_y + (ring_depth - gear_depth) / 2;
carrier_rear_y = ring_front_y + ring_depth + carrier_rear_clearance;
rail_z = foot_height - foot_overlap;
base_top = rail_z + rail_height;
rail_x = (base_width - rail_width) / 2;
mount_top = axis_height
          - sqrt(pow(ring_outer_radius, 2) - pow(ring_mount_spacing, 2))
          + (ring_outer_radius - ring_root_radius) * 0.6;

function polar(r, a) = [r * cos(a), r * sin(a)];
function involute_angle(r, rb) =
    sqrt(max(pow(r / rb, 2) - 1, 0)) * 180 / PI
    - acos(min(1, rb / r));
function flank_angle(r, rp, rb, n, lash) =
    90 / n - lash * 180 / (2 * PI * rp)
    + involute_angle(rp, rb) - involute_angle(r, rb);

// XZ profiles and axial cylinders
module xz_extrude(y, depth, z = axis_height) {
    translate([0, y + depth, z])
        rotate([90, 0, 0])
            linear_extrude(height = depth, convexity = 12)
                children();
}

module axial_cylinder(x, y, z, diameter, depth, facets = $fn) {
    translate([x, y, z])
        rotate([-90, 0, 0])
            cylinder(d = diameter, h = depth, $fn = facets);
}

// Involute tooth outline
module gear_outline(n, root = -1, tip = -1, lash = backlash) {
    rp = gear_module * n / 2;
    rb = rp * cos(pressure_angle);
    rr = root < 0 ? rp - 1.25 * gear_module : root;
    ra = tip < 0 ? rp + gear_module : tip;
    rs = max(rr, rb);
    root_angle = flank_angle(rs, rp, rb, n, lash);

    union() {
        circle(r = rr, $fn = n * 4);
        for (i = [0 : n - 1])
            rotate(i * 360 / n)
                polygon(concat(
                    [polar(rr - epsilon, -root_angle)],
                    [for (j = [0 : involute_steps])
                        let(r = rs + (ra - rs) * j / involute_steps)
                            polar(r, -flank_angle(r, rp, rb, n, lash))],
                    [for (j = [involute_steps : -1 : 0])
                        let(r = rs + (ra - rs) * j / involute_steps)
                            polar(r, flank_angle(r, rp, rb, n, lash))],
                    [polar(rr - epsilon, root_angle)]
                ));
    }
}

module annular_window(inner_r, outer_r, a0, a1) {
    polygon(concat(
        [for (i = [0 : involute_steps * 2])
            polar(outer_r, a0 + (a1 - a0) * i / (involute_steps * 2))],
        [for (i = [involute_steps * 2 : -1 : 0])
            polar(inner_r, a0 + (a1 - a0) * i / (involute_steps * 2))]
    ));
}

// Large internally toothed rim
module internal_ring() {
    color(rim_color)
        union() {
            xz_extrude(ring_front_y, ring_depth)
                difference() {
                    circle(r = ring_outer_radius);
                    rotate(180 / ring_teeth)
                        gear_outline(
                            ring_teeth,
                            ring_pitch_radius - gear_module,
                            ring_root_radius,
                            -backlash
                        );
                }

            xz_extrude(ring_front_y + ring_depth - epsilon,
                       rear_lip_depth + epsilon)
                difference() {
                    circle(r = ring_outer_radius);
                    circle(r = ring_outer_radius - rear_lip_width);
                }
        }
}

// Open-spoked central gear
module sun_gear() {
    color(gear_color)
        union() {
            xz_extrude(gear_front_y, gear_depth)
                rotate(sun_phase)
                    difference() {
                        gear_outline(sun_teeth);
                        for (i = [0 : sun_spokes - 1])
                            annular_window(
                                sun_window_inner,
                                sun_root_radius - sun_rim_width,
                                i * 360 / sun_spokes + sun_spoke_angle / 2,
                                (i + 1) * 360 / sun_spokes - sun_spoke_angle / 2
                            );
                    }

            axial_cylinder(0, gear_front_y - hub_projection, axis_height,
                           sun_hub_diameter, gear_depth + 2 * hub_projection);
        }
}

// Recessed fastener
module socket_head(x, y, z, diameter = bolt_head_diameter) {
    difference() {
        axial_cylinder(x, y, z, diameter, bolt_head_depth, 6);
        axial_cylinder(x, y - epsilon, z, socket_diameter,
                       socket_depth + epsilon, 6);
    }
}

// Three small planetary pinions
module planet_assembly(index) {
    a = 90 + index * 360 / planet_count;
    px = planet_orbit * cos(a);
    pz = axis_height + planet_orbit * sin(a);
    phase = (sun_teeth + planet_teeth) * a / planet_teeth
          + 180 - 180 / planet_teeth
          - sun_teeth * sun_phase / planet_teeth;

    color(gear_color)
        union() {
            translate([px, 0, pz])
                xz_extrude(gear_front_y, gear_depth, 0)
                    rotate(phase)
                        difference() {
                            gear_outline(planet_teeth);
                            for (j = [0 : 2])
                                translate(polar(planet_hole_radius, j * 120))
                                    circle(d = planet_hole_diameter);
                        }

            axial_cylinder(px, gear_front_y - hub_projection, pz,
                           planet_hub_diameter,
                           gear_depth + 2 * hub_projection);
        }

    color(steel_color)
        union() {
            axial_cylinder(
                px, planet_pin_front_y, pz, planet_pin_diameter,
                carrier_rear_y + carrier_depth
                - planet_pin_front_y + epsilon
            );
            axial_cylinder(px, carrier_front_y - washer_depth + epsilon,
                           pz, carrier_eye_diameter,
                           washer_depth + epsilon);
            socket_head(px, planet_pin_front_y - bolt_head_depth + epsilon, pz);
        }
}

// Slotted three-arm planet carrier
module carrier_profile(slotted = true) {
    difference() {
        union() {
            circle(d = carrier_hub_diameter);
            for (i = [0 : planet_count - 1])
                rotate(i * 360 / planet_count)
                    hull() {
                        translate([0, carrier_hub_diameter * 0.35])
                            circle(d = carrier_arm_width);
                        translate([0, planet_orbit])
                            circle(d = carrier_eye_diameter);
                    }
        }

        if (slotted)
            for (i = [0 : planet_count - 1])
                rotate(i * 360 / planet_count)
                    hull() {
                        translate([0, carrier_hub_diameter / 2
                                      + carrier_slot_margin])
                            circle(d = carrier_slot_width);
                        translate([0, planet_orbit
                                      - carrier_eye_diameter * 0.7])
                            circle(d = carrier_slot_width);
                    }
    }
}

module carriers() {
    color(steel_color)
        union() {
            xz_extrude(carrier_front_y, carrier_depth)
                carrier_profile();
            xz_extrude(carrier_rear_y, carrier_depth)
                carrier_profile(false);
            axial_cylinder(0, carrier_front_y - shaft_cap_depth, axis_height,
                           sleeve_diameter,
                           carrier_depth + shaft_cap_depth);
        }
}

// Chamfered feet
module foot() {
    w = foot_width / 2;
    d = foot_depth / 2;
    c = foot_chamfer;
    linear_extrude(height = foot_height)
        polygon([
            [-w + c, -d], [w - c, -d],
            [w, -d + c], [w, d - c],
            [w - c, d], [-w + c, d],
            [-w, d - c], [-w, -d + c]
        ]);
}

// Solid front pedestal and open rear A-frame
module pedestal_profile(open_frame = false) {
    difference() {
        polygon([
            [-stand_width / 2, base_top - epsilon],
            [ stand_width / 2, base_top - epsilon],
            [ stand_top_width / 2, axis_height],
            [-stand_top_width / 2, axis_height]
        ]);

        if (open_frame)
            polygon([
                [-stand_width / 2 + stand_border, base_top + stand_border],
                [ stand_width / 2 - stand_border, base_top + stand_border],
                [0, axis_height - stand_border]
            ]);
    }
}

module stand() {
    color(frame_color)
        union() {
            for (side = [-1, 1]) {
                translate([side * rail_x - rail_width / 2, base_front_y, rail_z])
                    cube([rail_width, base_rear_y - base_front_y, rail_height]);

                for (fy = [base_front_y + foot_depth / 2,
                           base_rear_y - foot_depth / 2])
                    translate([side * rail_x, fy, 0])
                        foot();
            }

            for (y = [base_front_y, base_rear_y - rail_width])
                translate([-base_width / 2, y, rail_z])
                    cube([base_width, rail_width, rail_height]);

            translate([-base_width / 2, ring_front_y, rail_z])
                cube([base_width, ring_depth, rail_height]);

            xz_extrude(front_stand_y, stand_plate_depth, 0)
                pedestal_profile();
            xz_extrude(rear_stand_y, stand_plate_depth, 0)
                pedestal_profile(true);

            for (side = [-1, 1])
                translate([
                    side * ring_mount_spacing - ring_mount_width / 2,
                    ring_front_y,
                    base_top - epsilon
                ])
                    cube([ring_mount_width, ring_depth,
                          mount_top - base_top + epsilon]);
        }

    color(steel_color)
        for (side = [-1, 1])
            socket_head(
                side * (stand_width / 2 - frame_bolt_inset),
                front_stand_y - bolt_head_depth + epsilon,
                base_top + frame_bolt_height
            );
}

// Stepped shaft and bearing housings
module shaft_and_bearings() {
    color(steel_color)
        difference() {
            union() {
                axial_cylinder(0, shaft_front_y, axis_height, shaft_diameter,
                               shaft_rear_y - shaft_front_y);
                axial_cylinder(0, shaft_front_y, axis_height,
                               shaft_cap_diameter, shaft_cap_depth);
                axial_cylinder(0, sleeve_front_y, axis_height,
                               sleeve_diameter,
                               bearing_front_y - sleeve_front_y
                               + bearing_flange_depth);
            }
            axial_cylinder(0, shaft_front_y - epsilon, axis_height,
                           shaft_end_bore, shaft_end_bore_depth + epsilon);
        }

    color(frame_color)
        union() {
            axial_cylinder(0, bearing_front_y, axis_height,
                           bearing_diameter, bearing_length);

            for (y = [bearing_front_y - bearing_flange_depth / 2,
                      bearing_front_y + bearing_length - bearing_flange_depth])
                axial_cylinder(0, y, axis_height,
                               bearing_flange_diameter, bearing_flange_depth);

            axial_cylinder(0, rear_bearing_front_y, axis_height,
                           rear_bearing_diameter,
                           shaft_rear_y - rear_bearing_front_y);

            translate([0, oil_y,
                       axis_height + bearing_diameter / 2 - oil_embed])
                cylinder(d = oil_stem_diameter,
                         h = oil_stem_height + oil_embed);

            translate([0, oil_y,
                       axis_height + bearing_diameter / 2
                       + oil_stem_height - epsilon])
                cylinder(d = oil_cap_diameter, h = oil_cap_height);
        }
}

// Projecting cylindrical hand grip
module hand_grip(x, z, mount_y) {
    front = mount_y - grip_length;

    difference() {
        union() {
            axial_cylinder(x, front, z, grip_diameter, grip_length);
            axial_cylinder(x, front, z, grip_end_diameter, grip_flange_depth);
            axial_cylinder(x, mount_y - grip_flange_depth, z,
                           grip_flange_diameter,
                           grip_flange_depth + lever_depth + epsilon);
        }
        axial_cylinder(x, front - epsilon, z,
                       grip_recess_diameter, grip_recess_depth + epsilon);
    }
}

// Two long operating levers and the short crank
module operating_lever(length, angle, y) {
    w = lever_width;
    c = lever_chamfer;
    px = length * sin(angle);
    pz = axis_height + length * cos(angle);

    color(steel_color)
        union() {
            xz_extrude(y, lever_depth)
                rotate(-angle)
                    difference() {
                        polygon([
                            [-w / 2, 0],
                            [ w / 2, 0],
                            [ w / 2, length + w / 2 - c],
                            [ w / 2 - c, length + w / 2],
                            [-w / 2 + c, length + w / 2],
                            [-w / 2, length + w / 2 - c]
                        ]);
                        translate([0, lever_slot_radius])
                            square(lever_slot_size, center = true);
                    }

            axial_cylinder(0, y - (lever_collar_depth - lever_depth) / 2,
                           axis_height, lever_collar_diameter,
                           lever_collar_depth);

            hand_grip(px, pz, y);
        }
}

// Complete static display assembly
union() {
    stand();
    internal_ring();
    sun_gear();
    carriers();

    for (i = [0 : planet_count - 1])
        planet_assembly(i);

    shaft_and_bearings();
    operating_lever(diagonal_length, diagonal_angle, diagonal_y);
    operating_lever(upright_length, upright_angle, upright_y);
    operating_lever(short_length, short_angle, short_y);
}