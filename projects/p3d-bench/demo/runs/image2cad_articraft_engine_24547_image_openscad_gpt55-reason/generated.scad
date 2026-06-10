// Parametric horizontal steam-engine / flywheel model
// Units: millimeters

// ----------------------------
// Global resolution and helpers
// ----------------------------
$fn = 80;
eps = 0.03;
part_overlap = 0.35;
face_overlap = 0.08;

// ----------------------------
// Base dimensions
// ----------------------------
base_length = 154;
base_depth = 92;
base_center_x = -12;

base_thickness = 4.5;
top_plate_thickness = 2.8;
base_top_z = base_thickness + top_plate_thickness;

base_corner_radius = 6;
top_plate_inset = 5;
top_plate_corner_radius = 5;

border_width = 4;
border_height = 1.2;

base_bolt_d = 5.2;
base_bolt_h = 1.8;
base_bolt_margin_x = 14;
base_bolt_margin_y = 12;

// ----------------------------
// Main shaft and flywheels
// ----------------------------
shaft_x = 26;
shaft_z = 52;
shaft_d = 7;
shaft_len = 90;

front_stub_length = 17;
front_stub_d = 5;
front_knob_length = 4;
front_knob_d = 7;

rear_cap_length = 4;
rear_cap_d = 8;

wheel_radius = 33;
wheel_thickness = 10;
wheel_y_offset = 26;

wheel_rim_width = 6;
wheel_hub_radius = 8.5;
wheel_hub_boss_d = 17;
wheel_hub_extension = 3.5;
wheel_face_ridge_t = 1.2;

spoke_count = 5;
spoke_width = 6.6;
spoke_angle_offset = 18;

wheel_bolt_circle_r = 5.4;
wheel_bolt_d = 3.2;
wheel_bolt_h = 1.5;

// ----------------------------
// Horizontal ribbed cylinder
// ----------------------------
cylinder_y = 0;
cylinder_axis_z = shaft_z;

barrel_center_x = -56;
barrel_length = 56;
barrel_core_d = 24;
barrel_fin_d = 30;
fin_width = 0.9;
fin_pitch = 2.3;

barrel_left_x = barrel_center_x - barrel_length / 2;
barrel_right_x = barrel_center_x + barrel_length / 2;

endcap_length = 5;
endcap_d = 31;

head_body_length = 14;
head_body_d = 33;
head_body_center_x = barrel_right_x + head_body_length / 2;
head_body_right_x = barrel_right_x + head_body_length;

nose_length = 10;
nose_center_x = head_body_right_x + nose_length / 2;
nose_right_x = head_body_right_x + nose_length;

gland_length = 8;
gland_d = 18;
gland_center_x = nose_right_x + gland_length / 2;
gland_right_x = nose_right_x + gland_length;

head_flange_width = 3.2;
head_flange_d = 36;

valve_pipe_x = head_body_center_x;
valve_socket_d = 12;
valve_socket_h = 3.2;
valve_pipe_d = 8.5;
valve_pipe_wall = 1.2;
valve_pipe_h = 14.5;

// Cylinder bed/support
cylinder_bed_y_offset = 13;
cylinder_bed_plate_t = 3;
cylinder_saddle_top_z = cylinder_axis_z - barrel_fin_d / 2 + 1.2;
cylinder_saddle_height = cylinder_saddle_top_z - base_top_z + part_overlap;
saddle_post_w = 8;
saddle_post_d = 20;

// ----------------------------
// Frame and bearing supports
// ----------------------------
outer_support_gap = 9;
outer_support_y = wheel_y_offset + wheel_thickness / 2 + outer_support_gap;
outer_support_plate_t = 5;

support_foot_x = 48;
support_foot_h = 5;

bearing_boss_d = 17;
bearing_block_w = 18;
bearing_cap_h = 7;

center_pedestal_x = 38;
center_pedestal_y = 34;
center_pedestal_height = 28;

inner_cheek_y = 15;
inner_cheek_t = 4;

// ----------------------------
// Crank, piston, and linkage
// ----------------------------
crank_radius = 11;
crank_angle = -105;
crank_pin_x = shaft_x + crank_radius * cos(crank_angle);
crank_pin_z = shaft_z + crank_radius * sin(crank_angle);

crank_hub_d = 13;
crank_hub_length = 16;
crank_pin_d = 6.2;
crank_pin_length = 18;

crank_cheek_spacing = 9;
crank_cheek_t = 3.2;
crank_web_start_d = 12;
crank_web_end_d = 7.5;

crosshead_x = 8;
crosshead_z = cylinder_axis_z;
crosshead_width = 10;
crosshead_y = 14;
crosshead_h = 8;

piston_rod_d = 3.2;

guide_rail_y_offset = 7;
guide_rail_z_offset = 6;
guide_rail_d = 2.2;

conrod_thickness_y = 5.2;
conrod_small_end_d = 6;
conrod_big_end_d = 8.5;

valve_block_x = shaft_x - 6;
valve_block_z = shaft_z + 13;
valve_block_size = [10, 12, 8];

// ----------------------------
// Vector helper functions
// ----------------------------
function v_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function v_mid(a, b) = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

// ----------------------------
// Basic oriented primitives
// ----------------------------
module cyl_x(length, d, center = true) {
    rotate([0, 90, 0])
        cylinder(h = length, d = d, center = center);
}

module cyl_y(length, d, center = true) {
    rotate([90, 0, 0])
        cylinder(h = length, d = d, center = center);
}

module cone_x(length, d1, d2) {
    rotate([0, 90, 0])
        cylinder(h = length, d1 = d1, d2 = d2, center = true);
}

module hex_prism_y(thickness, d) {
    rotate([90, 0, 0])
        cylinder(h = thickness, d = d, center = true, $fn = 6);
}

module bolt_head_z(d, h) {
    cylinder(h = h, d = d, center = false, $fn = 6);
}

// Cylinder between arbitrary 3D points, useful for rods and guide rails.
module cylinder_between(p1, p2, d) {
    let(v = v_sub(p2, p1), l = norm(v)) {
        if (l > eps) {
            translate(v_mid(p1, p2)) {
                if (abs(v[0]) < eps && abs(v[1]) < eps) {
                    cylinder(h = l, d = d, center = true);
                } else {
                    rotate(a = acos(min(1, max(-1, v[2] / l))), v = cross([0, 0, 1], v))
                        cylinder(h = l, d = d, center = true);
                }
            }
        }
    }
}

// ----------------------------
// 2D/plate helper modules
// ----------------------------
module rounded_rect_2d(w, d, r) {
    hull() {
        for (xpos = [-w / 2 + r, w / 2 - r])
            for (ypos = [-d / 2 + r, d / 2 - r])
                translate([xpos, ypos])
                    circle(r = r);
    }
}

module rounded_plate(w, d, h, r) {
    linear_extrude(height = h, convexity = 4)
        rounded_rect_2d(w, d, r);
}

module rounded_frame(w, d, h, r, border) {
    difference() {
        rounded_plate(w, d, h, r);
        translate([0, 0, -eps])
            rounded_plate(w - 2 * border, d - 2 * border, h + 2 * eps, max(r - border, 0.1));
    }
}

// Extrudes an X-Z polygon through Y, used for triangular/gusset plates.
module xz_plate(points, thickness) {
    rotate([90, 0, 0])
        linear_extrude(height = thickness, center = true, convexity = 5)
            polygon(points = points);
}

// Flat rounded link in the X-Z plane with thickness along Y.
module link_xz(p1, p2, ypos, thickness, d_start, d_end) {
    hull() {
        translate([p1[0], ypos, p1[1]])
            cyl_y(thickness, d_start);
        translate([p2[0], ypos, p2[1]])
            cyl_y(thickness, d_end);
    }
}

module annular_disc_y(outer_d, inner_d, thickness) {
    rotate([90, 0, 0])
        linear_extrude(height = thickness, center = true, convexity = 6)
            difference() {
                circle(d = outer_d);
                circle(d = inner_d);
            }
}

// Hollow vertical pipe with a closed lower wall and open top.
module hollow_pipe_z(h, outer_d, wall) {
    difference() {
        cylinder(h = h, d = outer_d, center = false);
        translate([0, 0, wall])
            cylinder(h = h - wall + eps, d = outer_d - 2 * wall, center = false);
    }
}

// ----------------------------
// Flywheel construction
// ----------------------------
module flywheel_2d(r, rim_w, hub_r, spoke_w, n, spoke_angle) {
    union() {
        // Outer rim.
        difference() {
            circle(r = r);
            circle(r = r - rim_w);
        }

        // Central hub web.
        circle(r = hub_r);

        // Rounded spokes.
        for (i = [0 : n - 1]) {
            rotate(spoke_angle + i * 360 / n)
                hull() {
                    translate([hub_r * 0.72, 0])
                        circle(d = spoke_w);
                    translate([r - rim_w * 0.55, 0])
                        circle(d = spoke_w);
                }
        }
    }
}

module flywheel(r, thickness, rim_w, hub_r, spoke_w, n, hub_boss_d, hub_extension, face_ridge, spoke_angle = 0) {
    union() {
        // Main spoked wheel body.
        rotate([90, 0, 0])
            linear_extrude(height = thickness, center = true, convexity = 10)
                flywheel_2d(r, rim_w, hub_r, spoke_w, n, spoke_angle);

        // Thick central boss.
        cyl_y(thickness + 2 * hub_extension, hub_boss_d);

        // Raised rim and inner decorative rings on both faces.
        for (sgn = [-1, 1]) {
            translate([0, sgn * (thickness / 2 + face_ridge / 2 - face_overlap / 2), 0])
                annular_disc_y(2 * r, 2 * (r - rim_w * 0.72), face_ridge + face_overlap);

            translate([0, sgn * (thickness / 2 + face_ridge / 2 - face_overlap / 2), 0])
                annular_disc_y(2 * (hub_r + 5), 2 * (hub_r + 1.2), face_ridge + face_overlap);
        }
    }
}

module wheel_face_bolts(y_center, outward_sign, angle_offset = 0) {
    boss_length = wheel_thickness + 2 * wheel_hub_extension;
    face_y = y_center + outward_sign * (boss_length / 2 + wheel_bolt_h / 2 - face_overlap / 2);

    for (i = [0 : spoke_count - 1]) {
        let(a = angle_offset + i * 360 / spoke_count)
            translate([
                shaft_x + wheel_bolt_circle_r * cos(a),
                face_y,
                shaft_z + wheel_bolt_circle_r * sin(a)
            ])
                hex_prism_y(wheel_bolt_h + face_overlap, wheel_bolt_d);
    }
}

// ----------------------------
// Ribbed horizontal cylinder
// ----------------------------
module ribbed_cylinder_x(length, core_d, fin_d, rib_w, pitch) {
    union() {
        cyl_x(length, core_d);

        // Closely-spaced cooling/steam-jacket ribs along the cylinder.
        for (xpos = [-length / 2 + rib_w / 2 : pitch : length / 2 - rib_w / 2])
            translate([xpos, 0, 0])
                cyl_x(rib_w, fin_d);
    }
}

// ----------------------------
// Major assemblies
// ----------------------------
module base_assembly() {
    union() {
        // Lower rounded slab.
        translate([base_center_x, 0, 0])
            rounded_plate(base_length, base_depth, base_thickness, base_corner_radius);

        // Raised upper plate.
        translate([base_center_x, 0, base_thickness - face_overlap])
            rounded_plate(
                base_length - 2 * top_plate_inset,
                base_depth - 2 * top_plate_inset,
                top_plate_thickness + face_overlap,
                top_plate_corner_radius
            );

        // Thin raised perimeter lip.
        translate([base_center_x, 0, base_top_z - face_overlap / 2])
            rounded_frame(
                base_length - 2 * top_plate_inset,
                base_depth - 2 * top_plate_inset,
                border_height + face_overlap,
                top_plate_corner_radius,
                border_width
            );

        // Four small hex fasteners near the base corners.
        for (xpos = [
            base_center_x - base_length / 2 + base_bolt_margin_x,
            base_center_x + base_length / 2 - base_bolt_margin_x
        ])
            for (ypos = [
                -base_depth / 2 + base_bolt_margin_y,
                base_depth / 2 - base_bolt_margin_y
            ])
                translate([xpos, ypos, base_top_z + border_height - face_overlap])
                    bolt_head_z(base_bolt_d, base_bolt_h);
    }
}

module cylinder_bed() {
    union() {
        // Long side plates supporting the horizontal cylinder.
        for (yy = [-cylinder_bed_y_offset, cylinder_bed_y_offset]) {
            translate([0, yy, 0])
                xz_plate([
                    [barrel_left_x + 8, base_top_z - part_overlap],
                    [gland_right_x + 4, base_top_z - part_overlap],
                    [gland_right_x - 4, cylinder_saddle_top_z],
                    [barrel_left_x + 12, cylinder_saddle_top_z]
                ], cylinder_bed_plate_t);
        }

        // Two rectangular saddle posts under the ribbed barrel.
        for (xpos = [barrel_center_x - 15, barrel_center_x + 14]) {
            translate([
                xpos,
                0,
                base_top_z + cylinder_saddle_height / 2 - part_overlap / 2
            ])
                cube([saddle_post_w, saddle_post_d, cylinder_saddle_height], center = true);
        }
    }
}

module engine_cylinder() {
    union() {
        // Ribbed main cylinder barrel.
        translate([barrel_center_x, cylinder_y, cylinder_axis_z])
            ribbed_cylinder_x(barrel_length, barrel_core_d, barrel_fin_d, fin_width, fin_pitch);

        // Left end cap.
        translate([
            barrel_left_x - endcap_length / 2 + part_overlap / 2,
            cylinder_y,
            cylinder_axis_z
        ])
            cyl_x(endcap_length + part_overlap, endcap_d);

        // Small raised end face on the cap.
        translate([
            barrel_left_x - endcap_length + 0.7,
            cylinder_y,
            cylinder_axis_z
        ])
            cyl_x(1.4, endcap_d - 5);

        // Large flange where barrel meets the smooth head.
        translate([
            barrel_right_x + head_flange_width / 2 - part_overlap / 2,
            cylinder_y,
            cylinder_axis_z
        ])
            cyl_x(head_flange_width + part_overlap, head_flange_d);

        // Smooth cylinder head.
        translate([
            head_body_center_x - part_overlap / 2,
            cylinder_y,
            cylinder_axis_z
        ])
            cyl_x(head_body_length + part_overlap, head_body_d);

        // Tapered nose leading to piston-rod gland.
        translate([
            nose_center_x - part_overlap / 2,
            cylinder_y,
            cylinder_axis_z
        ])
            cone_x(nose_length + part_overlap, head_body_d * 0.82, gland_d + 2);

        // Piston-rod gland at the front.
        translate([
            gland_center_x - part_overlap / 2,
            cylinder_y,
            cylinder_axis_z
        ])
            cyl_x(gland_length + part_overlap, gland_d);

        // Vertical valve / oiler pipe on top of the head.
        translate([
            valve_pipe_x,
            cylinder_y,
            cylinder_axis_z + head_body_d / 2 - 0.8
        ])
            cylinder(h = valve_socket_h, d = valve_socket_d, center = false);

        translate([
            valve_pipe_x,
            cylinder_y,
            cylinder_axis_z + head_body_d / 2 + valve_socket_h - 1.1
        ])
            hollow_pipe_z(valve_pipe_h, valve_pipe_d, valve_pipe_wall);
    }
}

module support_frame() {
    union() {
        // Central pedestal under the crank area.
        translate([
            shaft_x,
            0,
            base_top_z + center_pedestal_height / 2 - part_overlap / 2
        ])
            cube([
                center_pedestal_x,
                center_pedestal_y,
                center_pedestal_height + part_overlap
            ], center = true);

        // Two inner cheek plates leaving space for the crank linkage.
        for (yy = [-inner_cheek_y, inner_cheek_y]) {
            translate([0, yy, 0])
                xz_plate([
                    [shaft_x - 22, base_top_z - part_overlap],
                    [shaft_x + 18, base_top_z - part_overlap],
                    [shaft_x + 10, shaft_z - 9],
                    [shaft_x - 8, shaft_z - 9]
                ], inner_cheek_t);

            translate([shaft_x, yy, shaft_z - 4])
                cube([16, inner_cheek_t + 2, 14], center = true);

            translate([shaft_x, yy, shaft_z])
                cyl_y(inner_cheek_t + 3, bearing_boss_d * 0.82);
        }

        // Outer triangular bearing frames just outside the two flywheels.
        for (sgn = [-1, 1]) {
            let(ypos = sgn * outer_support_y) {
                translate([
                    shaft_x - 4,
                    ypos,
                    base_top_z + support_foot_h / 2 - part_overlap / 2
                ])
                    cube([
                        support_foot_x,
                        outer_support_plate_t + 4,
                        support_foot_h + part_overlap
                    ], center = true);

                translate([0, ypos, 0])
                    xz_plate([
                        [shaft_x - 30, base_top_z - part_overlap],
                        [shaft_x + 22, base_top_z - part_overlap],
                        [shaft_x + 12, shaft_z - 8],
                        [shaft_x - 8, shaft_z - 8]
                    ], outer_support_plate_t);

                translate([shaft_x, ypos, shaft_z - 3])
                    cube([bearing_block_w, outer_support_plate_t + 2, 14], center = true);

                translate([shaft_x, ypos, shaft_z])
                    cyl_y(outer_support_plate_t + 2, bearing_boss_d);

                translate([shaft_x, ypos, shaft_z + 6])
                    cube([bearing_block_w, outer_support_plate_t + 2, bearing_cap_h], center = true);
            }
        }
    }
}

module shaft_and_flywheels() {
    union() {
        // Common crankshaft.
        translate([shaft_x, 0, shaft_z])
            cyl_y(shaft_len, shaft_d);

        // Front flywheel.
        translate([shaft_x, -wheel_y_offset, shaft_z])
            flywheel(
                wheel_radius,
                wheel_thickness,
                wheel_rim_width,
                wheel_hub_radius,
                spoke_width,
                spoke_count,
                wheel_hub_boss_d,
                wheel_hub_extension,
                wheel_face_ridge_t,
                spoke_angle_offset
            );

        // Rear flywheel.
        translate([shaft_x, wheel_y_offset, shaft_z])
            flywheel(
                wheel_radius,
                wheel_thickness,
                wheel_rim_width,
                wheel_hub_radius,
                spoke_width,
                spoke_count,
                wheel_hub_boss_d,
                wheel_hub_extension,
                wheel_face_ridge_t,
                spoke_angle_offset + 12
            );

        // Small bolt heads on the exposed hub faces.
        wheel_face_bolts(-wheel_y_offset, -1, spoke_angle_offset + 12);
        wheel_face_bolts(wheel_y_offset, 1, spoke_angle_offset + 24);

        // Shaft protrusion on the front face.
        translate([
            shaft_x,
            -shaft_len / 2 - front_stub_length / 2 + part_overlap / 2,
            shaft_z
        ])
            cyl_y(front_stub_length + part_overlap, front_stub_d);

        translate([
            shaft_x,
            -shaft_len / 2 - front_stub_length - front_knob_length / 2 + part_overlap / 2,
            shaft_z
        ])
            cyl_y(front_knob_length + part_overlap, front_knob_d);

        // Small rear end cap.
        translate([
            shaft_x,
            shaft_len / 2 + rear_cap_length / 2 - part_overlap / 2,
            shaft_z
        ])
            cyl_y(rear_cap_length + part_overlap, rear_cap_d);
    }
}

module crank_assembly() {
    union() {
        // Piston rod emerging from the cylinder gland and passing through crosshead.
        cylinder_between(
            [gland_right_x - 1, 0, cylinder_axis_z],
            [crosshead_x + crosshead_width / 2, 0, cylinder_axis_z],
            piston_rod_d
        );

        // Crosshead block and its transverse pin.
        translate([crosshead_x, 0, crosshead_z])
            cube([crosshead_width, crosshead_y, crosshead_h], center = true);

        translate([crosshead_x, 0, crosshead_z])
            cyl_y(crosshead_y + 5, 5.2);

        // Horizontal guide rails beneath the piston rod.
        for (yy = [-guide_rail_y_offset, guide_rail_y_offset]) {
            cylinder_between(
                [gland_right_x - 1, yy, cylinder_axis_z - guide_rail_z_offset],
                [shaft_x - 4, yy, cylinder_axis_z - guide_rail_z_offset],
                guide_rail_d
            );
        }

        // Connecting rod between crosshead and crank pin.
        link_xz(
            [crosshead_x + crosshead_width / 2 - 1, cylinder_axis_z],
            [crank_pin_x, crank_pin_z],
            0,
            conrod_thickness_y,
            conrod_small_end_d,
            conrod_big_end_d
        );

        // Crank hub on the shaft.
        translate([shaft_x, 0, shaft_z])
            cyl_y(crank_hub_length, crank_hub_d);

        // Two crank cheeks around the connecting rod.
        for (yy = [-crank_cheek_spacing / 2, crank_cheek_spacing / 2]) {
            link_xz(
                [shaft_x, shaft_z],
                [crank_pin_x, crank_pin_z],
                yy,
                crank_cheek_t,
                crank_web_start_d,
                crank_web_end_d
            );
        }

        // Crank pin through big end.
        translate([crank_pin_x, 0, crank_pin_z])
            cyl_y(crank_pin_length, crank_pin_d);

        // Small valve-gear block and angled link above the crank.
        translate([valve_block_x, 0, valve_block_z])
            cube(valve_block_size, center = true);

        translate([
            valve_block_x,
            0,
            valve_block_z + valve_block_size[2] / 2 - face_overlap
        ])
            bolt_head_z(5, 2);

        link_xz(
            [gland_right_x + 2, cylinder_axis_z + 6],
            [valve_block_x, valve_block_z],
            0,
            4,
            3.8,
            5
        );

        translate([gland_right_x + 2, 0, cylinder_axis_z + 6])
            cyl_y(7, 4);
    }
}

// ----------------------------
// Main model
// ----------------------------
module steam_engine_model() {
    union() {
        base_assembly();
        support_frame();
        cylinder_bed();
        engine_cylinder();
        shaft_and_flywheels();
        crank_assembly();
    }
}

steam_engine_model();