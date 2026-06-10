// Parametric recreation of the pictured wall/ceiling mounted caged fan.
// Units: millimeters

//============================================================
// Global resolution
//============================================================
$fn = 72;
eps = 0.01;

smooth_fn = 96;
torus_fn  = 96;
rod_fn    = 12;
slot_fn   = 18;

//============================================================
// Visual colors
//============================================================
color_body   = [0.70, 0.70, 0.72];
color_guard  = [0.76, 0.76, 0.78];
color_blades = [0.50, 0.50, 0.52];
color_dark   = [0.18, 0.18, 0.18];

//============================================================
// Fan cage / grille parameters
//============================================================
cage_outer_radius = 88;
cage_inner_radius = 36;
cage_top_z        = 20;
cage_bottom_z     = 0;

cage_rim_height = 5;
cage_wire_d     = 2.6;
cage_small_wire_d = 1.45;

top_spoke_count      = 96;
top_spoke_width      = 1.0;
top_spoke_thickness  = 1.25;

bottom_spoke_count     = 72;
bottom_spoke_width     = 0.9;
bottom_spoke_thickness = 1.1;

side_bar_count = 96;
side_bar_d     = 1.35;

cage_concentric_radii       = [43, 55, 67, 79];
cage_lower_concentric_radii = [34, 52, 70, 84];

cage_clip_angles = [0, 180];
cage_clip_width  = 10;
cage_clip_depth  = 5;
cage_clip_height = 8;

//============================================================
// Fan rotor / blade parameters
//============================================================
blade_count        = 5;
blade_z            = 8;
blade_thickness    = 1.6;
blade_outer_radius = 68;
blade_angle_offset = 10;

hub_d = 28;
hub_h = 7;

//============================================================
// Motor body parameters
//============================================================
motor_d       = 70;
motor_radius  = motor_d / 2;
motor_base_z  = cage_top_z - 2;
motor_h       = 56;
motor_top_z   = motor_base_z + motor_h;

motor_wall         = 3;
motor_lid_h        = 5;
motor_shell_h      = motor_h - motor_lid_h;
motor_shell_center_z = motor_base_z + motor_shell_h / 2;
motor_lid_center_z   = motor_top_z - motor_lid_h / 2;

motor_bottom_cap_h = 7;
motor_edge_wire_d  = 2.0;

motor_side_vent_count  = 56;
motor_side_vent_width  = 1.15;
motor_side_vent_depth  = 2.4;
motor_side_vent_height = 13;

top_slot_count  = 24;
top_slot_radius = 25;
top_slot_len    = 13;
top_slot_width  = 2.4;

center_slot_len   = 24;
center_slot_width = 2.5;

switch_x = -10;
switch_y = 1;
switch_base_len = 13;
switch_base_w   = 8;
switch_base_h   = 2.2;
switch_slider_len = 7;
switch_slider_w   = 5;
switch_slider_h   = 3;

//============================================================
// Side hinge and support arm parameters
//============================================================
hinge_z = motor_base_z + 36;
hinge_x = motor_radius + 22;

hinge_width    = 28;
hinge_gap      = 15;
hinge_plate_t  = 3;
hinge_pin_d    = 6;
hinge_knob_d   = 12;

arm_d        = 24;
arm_neck_d   = 17;
arm_attach_d = 28;

wall_plate_radius    = 53;
wall_plate_thickness = 24;
wall_plate_x         = 185;
wall_plate_z         = 104;
wall_plate_center    = [wall_plate_x, 0, wall_plate_z];

wall_plate_rim_d = 3.0;
wall_hub_d       = 34;

arm_start  = [hinge_x + 10, 0, hinge_z + 1];
arm_mid    = [82, 0, hinge_z + 9];
arm_end    = [wall_plate_x - wall_plate_thickness / 2 - 22, 0, wall_plate_z - 8];
arm_attach = [wall_plate_x - wall_plate_thickness / 2 - 2, 0, wall_plate_z];

thin_rod_d  = 1.2;
brace_rod_d = 2.0;
rod_ball_d  = 5;

//============================================================
// Helper functions
//============================================================
function polar_xy(r, a, z = 0) = [r * cos(a), r * sin(a), z];

//============================================================
// Helper modules
//============================================================

// Cylinder oriented between two arbitrary 3D points.
module cylinder_between(p1, p2, d, segments = 16) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    L = norm(v);

    if (L > eps) {
        translate(p1) {
            if (abs(v[0]) < eps && abs(v[1]) < eps) {
                if (v[2] >= 0) {
                    cylinder(h = L, d = d, center = false, $fn = segments);
                } else {
                    rotate([180, 0, 0])
                        cylinder(h = L, d = d, center = false, $fn = segments);
                }
            } else {
                rotate(a = acos(v[2] / L), v = [-v[1], v[0], 0])
                    cylinder(h = L, d = d, center = false, $fn = segments);
            }
        }
    }
}

// Frustum oriented between two arbitrary 3D points.
module frustum_between(p1, p2, d1, d2, segments = 32) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    L = norm(v);

    if (L > eps) {
        translate(p1) {
            if (abs(v[0]) < eps && abs(v[1]) < eps) {
                if (v[2] >= 0) {
                    cylinder(h = L, r1 = d1 / 2, r2 = d2 / 2, center = false, $fn = segments);
                } else {
                    rotate([180, 0, 0])
                        cylinder(h = L, r1 = d1 / 2, r2 = d2 / 2, center = false, $fn = segments);
                }
            } else {
                rotate(a = acos(v[2] / L), v = [-v[1], v[0], 0])
                    cylinder(h = L, r1 = d1 / 2, r2 = d2 / 2, center = false, $fn = segments);
            }
        }
    }
}

// Round wire ring / torus.
module torus(major_r, tube_d, segments = 96) {
    rotate_extrude(convexity = 10, $fn = segments)
        translate([major_r, 0, 0])
            circle(d = tube_d, $fn = max(8, ceil(segments / 6)));
}

// Flat annular cylinder used for thick rim bands.
module annular_cylinder(outer_r, inner_r, h, z = 0, segments = 96) {
    translate([0, 0, z])
        difference() {
            cylinder(h = h, r = outer_r, center = true, $fn = segments);
            cylinder(h = h + 2, r = inner_r, center = true, $fn = segments);
        }
}

// Rounded 2D slot for vent cuts.
module rounded_slot_2d(len, wid) {
    hull() {
        translate([-len / 2 + wid / 2, 0])
            circle(d = wid, $fn = slot_fn);
        translate([ len / 2 - wid / 2, 0])
            circle(d = wid, $fn = slot_fn);
    }
}

// Straight radial rectangular grille bar.
module radial_bar(a, r1, r2, z, width, thickness) {
    rotate([0, 0, a])
        translate([(r1 + r2) / 2, 0, z])
            cube([r2 - r1, width, thickness], center = true);
}

//============================================================
// Fan cage and grille
//============================================================
module cage_guard() {
    union() {
        // Thick lower outer rim.
        annular_cylinder(
            cage_outer_radius + 4,
            cage_outer_radius - 6,
            cage_rim_height,
            cage_bottom_z + cage_rim_height / 2,
            smooth_fn
        );

        // Rolled outer top and bottom rings.
        translate([0, 0, cage_bottom_z + cage_rim_height])
            torus(cage_outer_radius - 2, cage_wire_d, torus_fn);

        translate([0, 0, cage_top_z])
            torus(cage_outer_radius, cage_wire_d, torus_fn);

        // Inner ring around the motor opening.
        translate([0, 0, cage_top_z])
            torus(cage_inner_radius, cage_wire_d, torus_fn);

        // Concentric upper grille wires.
        for (r = cage_concentric_radii) {
            translate([0, 0, cage_top_z])
                torus(r, cage_small_wire_d, torus_fn);
        }

        // Dense radial top grille bars.
        for (i = [0 : top_spoke_count - 1]) {
            radial_bar(
                i * 360 / top_spoke_count,
                cage_inner_radius,
                cage_outer_radius - 2,
                cage_top_z,
                top_spoke_width,
                top_spoke_thickness
            );
        }

        // Vertical outer guard bars wrapping the fan perimeter.
        for (i = [0 : side_bar_count - 1]) {
            let (a = i * 360 / side_bar_count) {
                cylinder_between(
                    polar_xy(cage_outer_radius - 2.4, a, cage_bottom_z + 2.2),
                    polar_xy(cage_outer_radius - 1.0, a, cage_top_z - 1.0),
                    side_bar_d,
                    rod_fn
                );
            }
        }

        // Lower grille rings visible below the fan blades.
        for (r = cage_lower_concentric_radii) {
            translate([0, 0, cage_bottom_z + 4])
                torus(r, cage_small_wire_d, torus_fn);
        }

        // Lower radial grille bars.
        for (i = [0 : bottom_spoke_count - 1]) {
            radial_bar(
                i * 360 / bottom_spoke_count + 360 / (2 * bottom_spoke_count),
                12,
                cage_outer_radius - 6,
                cage_bottom_z + 4,
                bottom_spoke_width,
                bottom_spoke_thickness
            );
        }

        // Small side latch tabs on the outer rim.
        for (a = cage_clip_angles) {
            rotate([0, 0, a])
                translate([cage_outer_radius + 2, 0, cage_bottom_z + cage_rim_height + 2])
                    cube([cage_clip_depth, cage_clip_width, cage_clip_height], center = true);
        }
    }
}

//============================================================
// Fan rotor and blades
//============================================================
module fan_blade_2d() {
    polygon(points = [
        [hub_d * 0.32, -4],
        [blade_outer_radius * 0.48, -13],
        [blade_outer_radius * 0.82, -18],
        [blade_outer_radius, -9],
        [blade_outer_radius * 0.72, 8],
        [hub_d * 0.35, 5]
    ]);
}

module fan_rotor() {
    union() {
        // Broad swept blades under the protective cage.
        for (i = [0 : blade_count - 1]) {
            rotate([0, 0, i * 360 / blade_count + blade_angle_offset])
                translate([0, 0, blade_z])
                    linear_extrude(height = blade_thickness, center = true, convexity = 4)
                        fan_blade_2d();
        }

        // Central blade hub.
        translate([0, 0, blade_z])
            cylinder(h = hub_h, d = hub_d, center = true, $fn = smooth_fn);

        translate([0, 0, blade_z + hub_h / 2])
            torus(hub_d / 2, 1.4, 48);
    }
}

//============================================================
// Motor housing with vented top cover
//============================================================
module motor_top_lid() {
    difference() {
        cylinder(h = motor_lid_h, d = motor_d + 2, center = true, $fn = smooth_fn);

        // Circular array of tangential ventilation slots.
        for (i = [0 : top_slot_count - 1]) {
            rotate([0, 0, i * 360 / top_slot_count])
                translate([top_slot_radius, 0, 0])
                    rotate([0, 0, 90])
                        linear_extrude(height = motor_lid_h + 2, center = true, convexity = 4)
                            rounded_slot_2d(top_slot_len, top_slot_width);
        }

        // Central parallel ventilation slots.
        for (yy = [-12 : 6 : 12]) {
            translate([-7, yy, 0])
                linear_extrude(height = motor_lid_h + 2, center = true, convexity = 4)
                    rounded_slot_2d(center_slot_len, center_slot_width);
        }

        // Diagonal seam/groove seen on the top cap.
        translate([7, -8, 0])
            rotate([0, 0, -35])
                linear_extrude(height = motor_lid_h + 2, center = true, convexity = 4)
                    rounded_slot_2d(motor_d * 0.72, 1.25);
    }
}

module motor_body() {
    union() {
        // Hollow cylindrical motor shell.
        difference() {
            translate([0, 0, motor_shell_center_z])
                cylinder(h = motor_shell_h, d = motor_d, center = true, $fn = smooth_fn);

            translate([0, 0, motor_shell_center_z])
                cylinder(h = motor_shell_h + 2, d = motor_d - 2 * motor_wall, center = true, $fn = smooth_fn);
        }

        // Solid lower cap where the motor meets the cage.
        translate([0, 0, motor_base_z + motor_bottom_cap_h / 2])
            cylinder(h = motor_bottom_cap_h, d = motor_d, center = true, $fn = smooth_fn);

        // Slight base shoulder over the grille.
        translate([0, 0, motor_base_z + 1.3])
            cylinder(h = 2.6, d = motor_d + 5, center = true, $fn = smooth_fn);

        // Vented upper lid.
        translate([0, 0, motor_lid_center_z])
            motor_top_lid();

        // Rolled motor edges.
        translate([0, 0, motor_base_z + 1])
            torus(motor_radius, motor_edge_wire_d, torus_fn);

        translate([0, 0, motor_top_z - motor_lid_h])
            torus(motor_radius, motor_edge_wire_d, torus_fn);

        translate([0, 0, motor_top_z - 0.3])
            torus(motor_radius, motor_edge_wire_d * 0.9, torus_fn);

        // Vertical lower vent ribs around motor side.
        for (i = [0 : motor_side_vent_count - 1]) {
            rotate([0, 0, i * 360 / motor_side_vent_count])
                translate([
                    motor_radius + motor_side_vent_depth / 2 - 0.4,
                    0,
                    motor_base_z + 2 + motor_side_vent_height / 2
                ])
                    cube(
                        [motor_side_vent_depth, motor_side_vent_width, motor_side_vent_height],
                        center = true
                    );
        }

        // Rectangular service-panel detail on the lower side.
        rotate([0, 0, 220])
            translate([motor_radius + 2, 0, motor_base_z + 14])
                cube([5, 20, 24], center = true);

        // Raised top switch and small slider.
        translate([switch_x, switch_y, motor_top_z + switch_base_h / 2])
            cube([switch_base_len, switch_base_w, switch_base_h], center = true);

        translate([switch_x + 1.5, switch_y, motor_top_z + switch_base_h + switch_slider_h / 2])
            cube([switch_slider_len, switch_slider_w, switch_slider_h], center = true);
    }
}

//============================================================
// Hinge bracket and wall support arm
//============================================================
module hinge_assembly() {
    union() {
        // Rectangular boss protruding from motor side.
        translate([motor_radius + 8, 0, hinge_z])
            cube([18, 22, 20], center = true);

        // Clevis side plates.
        for (sy = [-1, 1]) {
            translate([hinge_x + 4, sy * (hinge_gap / 2 + hinge_plate_t / 2), hinge_z])
                cube([22, hinge_plate_t, 22], center = true);
        }

        // Central swivel block.
        translate([hinge_x + 8, 0, hinge_z])
            cube([13, hinge_gap, 14], center = true);

        // Hinge pin and visible bolt heads.
        cylinder_between(
            [hinge_x + 4, -hinge_width / 2, hinge_z],
            [hinge_x + 4,  hinge_width / 2, hinge_z],
            hinge_pin_d,
            24
        );

        cylinder_between(
            [hinge_x + 4, -hinge_width / 2 - 4, hinge_z],
            [hinge_x + 4, -hinge_width / 2 + 1, hinge_z],
            hinge_knob_d,
            24
        );

        cylinder_between(
            [hinge_x + 4, hinge_width / 2 - 1, hinge_z],
            [hinge_x + 4, hinge_width / 2 + 4, hinge_z],
            hinge_knob_d,
            24
        );

        // Short collar at arm entrance.
        cylinder_between(
            [arm_start[0] - 7, 0, arm_start[2] - 2.5],
            [arm_start[0] + 4, 0, arm_start[2] + 1.5],
            arm_neck_d + 4,
            smooth_fn
        );
    }
}

module support_arm() {
    union() {
        // Small tapered neck from hinge to main tube.
        frustum_between(arm_start, arm_mid, arm_neck_d, arm_d, smooth_fn);

        // Main cylindrical support arm.
        cylinder_between(arm_mid, arm_end, arm_d, smooth_fn);

        // Tapered collar into the wall plate hub.
        frustum_between(arm_end, arm_attach, arm_d, arm_attach_d, smooth_fn);

        // Subtle sleeve detail near the wider tube.
        cylinder_between(
            [arm_mid[0] - 4, 0, arm_mid[2] - 1.7],
            [arm_mid[0] + 9, 0, arm_mid[2] + 3.7],
            arm_d + 3,
            smooth_fn
        );

        // End collar at the dish mount.
        cylinder_between(
            [arm_attach[0] - 11, 0, arm_attach[2] - 4],
            [arm_attach[0] + 2, 0, arm_attach[2]],
            arm_attach_d + 3,
            smooth_fn
        );
    }
}

//============================================================
// Rear circular wall/ceiling plate
//============================================================
module wall_plate_dish() {
    union() {
        // Shallow revolved dish/lens, oriented with its axis along X.
        translate(wall_plate_center)
            rotate([0, 90, 0])
                rotate_extrude(convexity = 10, $fn = smooth_fn)
                    polygon(points = [
                        [0, -wall_plate_thickness / 2],
                        [wall_plate_radius * 0.22, -wall_plate_thickness * 0.49],
                        [wall_plate_radius * 0.58, -wall_plate_thickness * 0.40],
                        [wall_plate_radius * 0.88, -wall_plate_thickness * 0.14],
                        [wall_plate_radius,        wall_plate_thickness * 0.10],
                        [wall_plate_radius * 0.93,  wall_plate_thickness * 0.40],
                        [wall_plate_radius * 0.65,  wall_plate_thickness * 0.58],
                        [wall_plate_radius * 0.18,  wall_plate_thickness * 0.54],
                        [0,                         wall_plate_thickness * 0.48]
                    ]);

        // Rolled outer rim on the dish.
        translate(wall_plate_center)
            rotate([0, 90, 0])
                translate([0, 0, wall_plate_thickness * 0.02])
                    torus(wall_plate_radius * 0.97, wall_plate_rim_d, smooth_fn);

        // Central hub where the arm joins the dish.
        cylinder_between(
            [wall_plate_x - wall_plate_thickness / 2 - 8, 0, wall_plate_z],
            [wall_plate_x - wall_plate_thickness / 2 + 10, 0, wall_plate_z],
            wall_hub_d,
            smooth_fn
        );

        // Smaller raised front cap.
        cylinder_between(
            [wall_plate_x - wall_plate_thickness / 2 - 13, 0, wall_plate_z],
            [wall_plate_x - wall_plate_thickness / 2 - 5, 0, wall_plate_z],
            wall_hub_d * 0.72,
            smooth_fn
        );
    }
}

//============================================================
// Thin auxiliary rods / braces visible around the arm
//============================================================
module support_rods() {
    union() {
        // Long thin stabilizer rod running behind the main arm.
        cylinder_between(
            [motor_radius + 12, -13, hinge_z + 14],
            [arm_end[0] - 16,  -13, arm_end[2] + 6],
            thin_rod_d,
            8
        );

        // Diagonal brace / pull rod below the arm.
        cylinder_between(
            [arm_end[0] - 34, -14, arm_end[2] - 6],
            [arm_end[0] - 14, -14, arm_end[2] - 45],
            brace_rod_d,
            12
        );

        translate([arm_end[0] - 34, -14, arm_end[2] - 6])
            sphere(d = rod_ball_d, $fn = 16);

        translate([arm_end[0] - 14, -14, arm_end[2] - 45])
            sphere(d = rod_ball_d, $fn = 16);
    }
}

//============================================================
// Main assembly
//============================================================
module main_model() {
    union() {
        color(color_blades)
            fan_rotor();

        color(color_guard)
            cage_guard();

        color(color_body)
            motor_body();

        color(color_body)
            hinge_assembly();

        color(color_body)
            support_arm();

        color(color_body)
            wall_plate_dish();

        color(color_dark)
            support_rods();
    }
}

main_model();