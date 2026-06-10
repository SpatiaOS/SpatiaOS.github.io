// Fast STL-exportable biomechanical clawed mech inspired by the supplied image.
// Units: millimeters.
// Interpretation: skeletal Technic/Bionicle-style creature with arched torso armor,
// visible pin holes, ball joints, trussed limbs, two pincer hands, dorsal fin,
// rear fork rods, and broad clawed feet.
//
// Performance note: this version avoids expensive minkowski() rounding and uses
// low/medium polygon counts so STL export completes reliably.

// -----------------------------------------------------------------------------
// Global quality and scale
// -----------------------------------------------------------------------------
model_scale = 1.0;
curve_fn    = 24;
sphere_fn   = 20;
eps         = 0.05;
$fn         = curve_fn;

// Preview colors only; STL export ignores colors.
light_color  = [0.72, 0.72, 0.68, 1.0];
mid_color    = [0.45, 0.47, 0.48, 1.0];
dark_color   = [0.08, 0.08, 0.08, 1.0];
accent_color = [0.26, 0.28, 0.30, 1.0];

// -----------------------------------------------------------------------------
// Main mechanical dimensions
// -----------------------------------------------------------------------------
beam_width      = 8;
beam_depth      = 5.4;
beam_pitch      = 10;
beam_hole_d     = 3.5;
rod_d           = 3.0;
link_rod_d      = 2.3;
truss_rod_d     = 2.5;
pin_d           = 4.0;
pin_cap_d       = 7.0;
pin_cap_t       = 1.6;
joint_ball_d    = 10;
large_joint_d   = 13;
hole_clearance  = 4;

// Pose reference points
shoulder_x = 35; shoulder_y = -2;  shoulder_z = 120;
elbow_x    = 62; elbow_y    = -14; elbow_z    = 108;
wrist_x    = 90; wrist_y    = -18; wrist_z    = 101;

hip_x      = 15; hip_y      = -1;  hip_z      = 76;
knee_x     = 26; knee_y     = -5;  knee_z     = 45;
ankle_x    = 22; ankle_y    = -7;  ankle_z    = 15;

// Torso armor shell
torso_shell_center     = [0, 0, 108];
torso_shell_width      = 52;
torso_shell_radius     = 32;
torso_shell_thickness  = 4.0;
torso_shell_a1         = 104;
torso_shell_a2         = 256;
torso_shell_segments   = 36;
torso_rib_width        = 1.3;
torso_rib_thickness    = 1.8;
torso_rib_positions    = [-22, -8, 8, 22];

front_chest_pos        = [0, -26, 102];
front_chest_size       = [34, 8, 20];
front_chest_pitch      = -8;
abdomen_pos            = [0, -18, 91];
abdomen_size           = [22, 12, 18];
pelvis_pos             = [0, -1, 76];
pelvis_size            = [32, 14, 16];

// Neck and head
head_size              = 20;
head_center            = [-6, -17, 153];
head_rotation          = [8, 0, -18];
head_mount_point       = [-4, -13, 143];
head_chamfer           = 0.9;

// Feet
foot_width             = 24;
foot_length            = 34;
foot_height            = 6;
foot_center_y          = -14;
foot_center_z          = 3;
toe_pad_width          = 5;
toe_pad_length         = 10;
toe_pad_height         = 4;
toe_pad_spacing        = 7;
toe_claw_length        = 9;
heel_size              = [18, 12, 7];
outer_outrigger_size   = [8, 22, 5];
ankle_bracket_size     = [16, 12, 13];

// Pincer hand
claw_palm_size         = [12, 12, 8];
claw_hinge_x           = 10;
claw_jaw_y             = 5.0;
claw_link_length       = 17;
claw_blade_length      = 24;
claw_blade_root_w      = 4.2;
claw_blade_tip_w       = 0.8;
claw_blade_thick       = 2.2;
claw_open_angle        = 18;
arm_claw_yaw           = 8;
arm_claw_pitch         = 6;

// Back details
dorsal_fin_thickness   = 4;
rear_fork_rod_d        = 2.5;
rear_fork_tip_d        = 1.0;
spring_max_rings       = 9;

// -----------------------------------------------------------------------------
// Vector helpers
// -----------------------------------------------------------------------------
function v_add(a, b) = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function v_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function v_mid(a, b) = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
function v_len(v)    = sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);

function shoulder_pt(s)    = [s * shoulder_x, shoulder_y, shoulder_z];
function elbow_pt(s)       = [s * elbow_x,    elbow_y,    elbow_z];
function wrist_pt(s)       = [s * wrist_x,    wrist_y,    wrist_z];
function hip_pt(s)         = [s * hip_x,      hip_y,      hip_z];
function knee_pt(s)        = [s * knee_x,     knee_y,     knee_z];
function ankle_pt(s)       = [s * ankle_x,    ankle_y,    ankle_z];
function foot_center_pt(s) = [s * ankle_x, foot_center_y, foot_center_z];

// Orient local Z axis to an arbitrary vector.
module orient_z_to_vec(v) {
    l = v_len(v);

    if (l < eps) {
        children();
    } else {
        axis = cross([0, 0, 1], v);
        axis_len = v_len(axis);
        safe_cos = min(1, max(-1, v[2] / l));
        angle = acos(safe_cos);

        if (axis_len < eps) {
            if (v[2] < 0)
                rotate([180, 0, 0]) children();
            else
                children();
        } else {
            rotate(a = angle, v = axis) children();
        }
    }
}

// -----------------------------------------------------------------------------
// Fast reusable primitives
// -----------------------------------------------------------------------------

// Lightweight chamfered rectangular box.
// Uses a 2D chamfered footprint extruded in Z, much faster than minkowski().
module chamfered_box(size = [10, 10, 10], ch = 0.8) {
    x = size[0] / 2;
    y = size[1] / 2;
    c = max(0, min(ch, x - eps, y - eps));

    if (c <= eps) {
        cube(size, center = true);
    } else {
        linear_extrude(height = size[2], center = true, convexity = 2)
            polygon(points = [
                [-x + c, -y], [ x - c, -y],
                [ x, -y + c], [ x,  y - c],
                [ x - c,  y], [-x + c,  y],
                [-x,  y - c], [-x, -y + c]
            ]);
    }
}

// Solid capsule/Technic beam along local Z.
module capsule_solid_z(len = 20, w = beam_width, d = beam_depth) {
    body_len = max(len - w, eps);
    end_z    = max((len - w) / 2, 0);

    union() {
        cube([w, d, body_len], center = true);

        translate([0, 0, end_z])
            rotate([90, 0, 0])
                cylinder(h = d, d = w, center = true);

        translate([0, 0, -end_z])
            rotate([90, 0, 0])
                cylinder(h = d, d = w, center = true);
    }
}

// Perforated Technic-style beam with holes through Y.
module technic_beam_z(
    len = 30,
    w = beam_width,
    d = beam_depth,
    pitch = beam_pitch,
    hole_diam = beam_hole_d,
    holes = 0
) {
    hole_count = holes > 0 ? holes : max(1, floor((len - w) / pitch) + 1);

    difference() {
        capsule_solid_z(len, w, d);

        for (i = [0 : hole_count - 1]) {
            zpos = (i - (hole_count - 1) / 2) * pitch;

            translate([0, 0, zpos])
                rotate([90, 0, 0])
                    cylinder(h = d + hole_clearance, d = hole_diam, center = true);
        }
    }
}

// Beam between two world-space points.
module beam_between(
    p1,
    p2,
    w = beam_width,
    d = beam_depth,
    pitch = beam_pitch,
    hole_diam = beam_hole_d,
    holes = 0,
    perforated = true
) {
    v = v_sub(p2, p1);
    l = v_len(v);

    if (l > eps) {
        translate(v_mid(p1, p2))
            orient_z_to_vec(v) {
                if (perforated)
                    technic_beam_z(l, w, d, pitch, hole_diam, holes);
                else
                    capsule_solid_z(l, w, d);
            }
    }
}

// Cylindrical rod between two points.
module rod_between(p1, p2, d = rod_d) {
    v = v_sub(p2, p1);
    l = v_len(v);

    if (l > eps) {
        translate(v_mid(p1, p2))
            orient_z_to_vec(v)
                cylinder(h = l, d = d, center = true);
    }
}

// Tapered rod/cone between two points.
module tapered_rod_between(p1, p2, d1 = 3, d2 = 1) {
    v = v_sub(p2, p1);
    l = v_len(v);

    if (l > eps) {
        translate(v_mid(p1, p2))
            orient_z_to_vec(v)
                cylinder(h = l, r1 = d1 / 2, r2 = d2 / 2, center = true);
    }
}

// Ribbed hose/spring between two points.
module corrugated_between(p1, p2, core_d = 1.5, ring_d = 4, ring_w = 0.9, pitch = 3) {
    v = v_sub(p2, p1);
    l = v_len(v);
    ring_count = min(spring_max_rings, max(2, floor(l / pitch) + 1));

    if (l > eps) {
        translate(v_mid(p1, p2))
            orient_z_to_vec(v)
                union() {
                    cylinder(h = l, d = core_d, center = true);

                    for (i = [0 : ring_count - 1]) {
                        zpos = -l / 2 + i * l / (ring_count - 1);

                        translate([0, 0, zpos])
                            cylinder(h = ring_w, d = ring_d, center = true);
                    }
                }
    }
}

// Telescoping hydraulic piston detail.
module hydraulic_between(p1, p2, body_d = 5, shaft_d = 2, body_fraction = 0.4) {
    v = v_sub(p2, p1);
    l = v_len(v);
    body_len = max(body_d, l * body_fraction);

    if (l > eps) {
        translate(v_mid(p1, p2))
            orient_z_to_vec(v)
                union() {
                    cylinder(h = l, d = shaft_d, center = true);
                    cylinder(h = body_len, d = body_d, center = true);

                    translate([0, 0, -l/2])
                        sphere(d = body_d * 0.75, $fn = sphere_fn);

                    translate([0, 0, l/2])
                        sphere(d = body_d * 0.75, $fn = sphere_fn);
                }
    }
}

// Washer/ring detail at a joint.
module washer_at(pos, axis = [0, 1, 0], d_outer = 11, d_inner = 5, thick = 3) {
    translate(pos)
        orient_z_to_vec(axis)
            difference() {
                cylinder(h = thick, d = d_outer, center = true);
                cylinder(h = thick + hole_clearance, d = d_inner, center = true);
            }
}

// Capped axle/pin along a given axis.
module capped_axle(pos, axis = [1, 0, 0], length = 20, d = pin_d, cap_d = pin_cap_d, cap_t = pin_cap_t) {
    translate(pos)
        orient_z_to_vec(axis)
            union() {
                cylinder(h = length, d = d, center = true);

                translate([0, 0, length/2 + cap_t/2 - eps])
                    cylinder(h = cap_t, d = cap_d, center = true);

                translate([0, 0, -length/2 - cap_t/2 + eps])
                    cylinder(h = cap_t, d = cap_d, center = true);
            }
}

// Ball joint.
module joint_ball(pos, d = joint_ball_d) {
    translate(pos)
        sphere(d = d, $fn = sphere_fn);
}

// Box with circular holes through Y.
module block_with_y_holes(
    size = [16, 10, 16],
    rows = 2,
    cols = 2,
    spacing_x = 7,
    spacing_z = 7,
    hole_diam = beam_hole_d,
    chamfer = 0.9
) {
    difference() {
        chamfered_box(size, ch = chamfer);

        for (ix = [0 : cols - 1])
            for (iz = [0 : rows - 1]) {
                xpos = (ix - (cols - 1) / 2) * spacing_x;
                zpos = (iz - (rows - 1) / 2) * spacing_z;

                translate([xpos, 0, zpos])
                    rotate([90, 0, 0])
                        cylinder(h = size[1] + hole_clearance, d = hole_diam, center = true);
            }
    }
}

// Triangular open truss frame.
module triangular_frame(p1, p2, p3, d = truss_rod_d) {
    union() {
        rod_between(p1, p2, d);
        rod_between(p2, p3, d);
        rod_between(p3, p1, d);

        for (p = [p1, p2, p3])
            translate(p)
                sphere(d = d * 1.25, $fn = 12);
    }
}

// Cylindrical armor shell segment extruded along X.
// Cross-section is an annular arc.
module arc_shell_x(width, r, thick, a1, a2, seg = torso_shell_segments) {
    outer_pts = [
        for (i = [0 : seg])
            [r * cos(a1 + (a2 - a1) * i / seg),
             r * sin(a1 + (a2 - a1) * i / seg)]
    ];

    inner_pts = [
        for (i = [seg : -1 : 0])
            [(r - thick) * cos(a1 + (a2 - a1) * i / seg),
             (r - thick) * sin(a1 + (a2 - a1) * i / seg)]
    ];

    rotate([0, 90, 0])
        linear_extrude(height = width, center = true, convexity = 6)
            polygon(points = concat(outer_pts, inner_pts));
}

// Vertical plate in X/Z plane, extruded along Y.
module vertical_plate_y(points, thickness) {
    rotate([90, 0, 0])
        linear_extrude(height = thickness, center = true, convexity = 4)
            polygon(points = points);
}

// Flat tapered claw/blade along local +X.
module tapered_blade_x(length = 20, root_w = 4, tip_w = 1, thick = 2) {
    linear_extrude(height = thick, center = true, convexity = 3)
        polygon(points = [
            [0, -root_w/2],
            [length * 0.78, -tip_w/2],
            [length, 0],
            [length * 0.78, tip_w/2],
            [0, root_w/2]
        ]);
}

// -----------------------------------------------------------------------------
// Subassemblies
// -----------------------------------------------------------------------------

module claw_hand(open_angle = claw_open_angle) {
    // Wrist barrel and central palm block.
    color(light_color) {
        rotate([0, 90, 0])
            cylinder(h = 12, d = 8.5, center = true);

        translate([4, 0, 0])
            block_with_y_holes(
                size = claw_palm_size,
                rows = 1,
                cols = 1,
                spacing_x = 1,
                spacing_z = 1,
                hole_diam = beam_hole_d,
                chamfer = 0.8
            );
    }

    // Two articulated pincer jaws.
    for (j = [-1, 1]) {
        color(accent_color)
            translate([claw_hinge_x, j * claw_jaw_y, 0])
                cylinder(h = claw_palm_size[2] + 2, d = 5, center = true);

        translate([claw_hinge_x, j * claw_jaw_y, 0])
            rotate([0, 0, j * open_angle]) {
                color(accent_color) {
                    translate([claw_link_length/2, 0, 2.1])
                        rotate([0, 90, 0])
                            cylinder(h = claw_link_length, d = 1.9, center = true);

                    translate([claw_link_length/2, 0, -2.1])
                        rotate([0, 90, 0])
                            cylinder(h = claw_link_length, d = 1.9, center = true);
                }

                color(light_color)
                    translate([claw_link_length, 0, 0])
                        tapered_blade_x(
                            length = claw_blade_length,
                            root_w = claw_blade_root_w,
                            tip_w = claw_blade_tip_w,
                            thick = claw_blade_thick
                        );
            }
    }

    // Small ribbed spring details beneath the jaws.
    color(dark_color) {
        for (j = [-1, 1])
            corrugated_between(
                [2, j * (claw_jaw_y + 3), -3],
                [claw_hinge_x + claw_link_length - 1, j * (claw_jaw_y + 6), -3],
                core_d = 1.2,
                ring_d = 3.3,
                ring_w = 0.8,
                pitch = 3.0
            );
    }
}

module head_mask() {
    d = head_size;

    // Angular mask-like head with eye holes and snout.
    color(light_color)
        difference() {
            union() {
                scale([1.15, 0.80, 0.66])
                    sphere(d = d, $fn = sphere_fn);

                translate([0, -d*0.34, -d*0.08])
                    chamfered_box([d*0.92, d*0.55, d*0.36], ch = head_chamfer);

                translate([0, d*0.20, -d*0.02])
                    chamfered_box([d*0.76, d*0.34, d*0.42], ch = head_chamfer);
            }

            // Flatten lower mask.
            translate([0, 0, -d*0.62])
                cube([d*3, d*3, d*0.52], center = true);

            // Eye sockets through the front.
            for (x = [-d*0.21, d*0.21])
                translate([x, -d*0.50, d*0.08])
                    rotate([90, 0, 0])
                        cylinder(h = d*1.25, d = d*0.17, center = true);

            // Mouth slot.
            translate([0, -d*0.62, -d*0.15])
                chamfered_box([d*0.72, d*0.20, d*0.08], ch = 0.2);

            // Side gill grooves.
            for (s = [-1, 1])
                translate([s*d*0.48, -d*0.28, -d*0.05])
                    rotate([0, 0, s*18])
                        chamfered_box([d*0.06, d*0.40, d*0.09], ch = 0.1);
        }

    // Dark eye inserts.
    color(dark_color) {
        for (x = [-d*0.21, d*0.21])
            translate([x, -d*0.64, d*0.08])
                rotate([90, 0, 0])
                    cylinder(h = 1.2, d = d*0.11, center = true);
    }

    // Top circular port and cheek fins.
    color(accent_color) {
        translate([0, -d*0.04, d*0.40])
            difference() {
                cylinder(h = 2.0, d = d*0.34, center = true);
                cylinder(h = 2.4, d = d*0.16, center = true);
            }

        for (s = [-1, 1])
            translate([s*d*0.45, -d*0.28, -d*0.15])
                rotate([0, 0, s*15])
                    chamfered_box([d*0.10, d*0.38, d*0.14], ch = 0.25);
    }
}

module dorsal_fin_plate(thickness = dorsal_fin_thickness) {
    fin_pts = [
        [-6,  0],
        [ 6,  0],
        [ 8, 20],
        [ 2, 38],
        [-5, 32],
        [-8, 10]
    ];

    difference() {
        vertical_plate_y(fin_pts, thickness);

        for (hp = [[0, 9], [2, 18], [-1, 27]])
            translate([hp[0], 0, hp[1]])
                rotate([90, 0, 0])
                    cylinder(h = thickness + hole_clearance, d = beam_hole_d + 0.4, center = true);
    }
}

module rear_fork_array() {
    // Long fork-like antenna rods projecting from the back.
    color(accent_color) {
        for (s = [-1, 1]) {
            rod_between([s*8, 20, 128], [s*27, 42, 143], d = rear_fork_rod_d);
            tapered_rod_between([s*27, 42, 143], [s*43, 52, 148], d1 = rear_fork_rod_d, d2 = rear_fork_tip_d);

            rod_between([s*13, 18, 123], [s*36, 41, 134], d = rear_fork_rod_d * 0.9);
            tapered_rod_between([s*36, 41, 134], [s*52, 50, 138], d1 = rear_fork_rod_d * 0.9, d2 = rear_fork_tip_d);
        }
    }
}

module pelvis_assembly() {
    color(light_color)
        translate(pelvis_pos)
            block_with_y_holes(
                size = pelvis_size,
                rows = 2,
                cols = 3,
                spacing_x = 9,
                spacing_z = 7,
                hole_diam = beam_hole_d,
                chamfer = 1.0
            );

    color(accent_color)
        capped_axle([0, hip_y, hip_z], axis = [1, 0, 0], length = hip_x*2 + 18);

    // Lower abdominal connector block.
    color(mid_color)
        translate([0, -11, 86])
            block_with_y_holes(
                size = [20, 10, 14],
                rows = 2,
                cols = 2,
                spacing_x = 7,
                spacing_z = 6,
                hole_diam = beam_hole_d,
                chamfer = 0.9
            );
}

module torso_assembly() {
    // Large arched armor shell over the torso.
    color(light_color)
        translate(torso_shell_center)
            arc_shell_x(
                width = torso_shell_width,
                r = torso_shell_radius,
                thick = torso_shell_thickness,
                a1 = torso_shell_a1,
                a2 = torso_shell_a2,
                seg = torso_shell_segments
            );

    // Raised ribs segmenting the shell.
    color(accent_color) {
        for (x = torso_rib_positions)
            translate(v_add(torso_shell_center, [x, 0, 0]))
                arc_shell_x(
                    width = torso_rib_width,
                    r = torso_shell_radius + 0.8,
                    thick = torso_rib_thickness,
                    a1 = torso_shell_a1 + 5,
                    a2 = torso_shell_a2 - 5,
                    seg = 26
                );

        rod_between([-torso_shell_width/2 + 3, -29, torso_shell_center[2] + 4],
                    [ torso_shell_width/2 - 3, -29, torso_shell_center[2] + 4],
                    d = 2.2);

        rod_between([-torso_shell_width/2 + 3, 27, torso_shell_center[2] + 5],
                    [ torso_shell_width/2 - 3, 27, torso_shell_center[2] + 5],
                    d = 2.2);
    }

    // Front armor and abdomen blocks.
    color(light_color)
        translate(front_chest_pos)
            rotate([front_chest_pitch, 0, 0])
                chamfered_box(front_chest_size, ch = 1.2);

    color(mid_color)
        translate(abdomen_pos)
            block_with_y_holes(
                size = abdomen_size,
                rows = 2,
                cols = 2,
                spacing_x = 7,
                spacing_z = 7,
                hole_diam = beam_hole_d,
                chamfer = 0.9
            );

    // Front rivet/washers.
    color(accent_color) {
        for (x = [-8, 8])
            for (z = [96, 104])
                washer_at([x, -31, z], axis = [0, 1, 0], d_outer = 6.5, d_inner = 2.8, thick = 1.6);
    }

    // Shoulder axle and side structural rods.
    color(accent_color)
        capped_axle([0, shoulder_y, shoulder_z], axis = [1, 0, 0], length = shoulder_x*2 + 14);

    for (s = [-1, 1]) {
        color(accent_color) {
            washer_at(shoulder_pt(s), axis = [1, 0, 0], d_outer = 13, d_inner = 5, thick = 4);

            rod_between(v_add(shoulder_pt(s), [-s*5, 9, -5]),
                        v_add(hip_pt(s),      [-s*2, 6,  9]),
                        d = link_rod_d);

            hydraulic_between(v_add(shoulder_pt(s), [-s*8, 5, -8]),
                              v_add(hip_pt(s),      [-s*5, 4, 13]),
                              body_d = 4.4,
                              shaft_d = 1.8,
                              body_fraction = 0.34);
        }
    }

    // Neck beam and joint.
    color(accent_color) {
        beam_between([0, -8, 133], head_mount_point, w = 6, d = 5, pitch = 8, hole_diam = 2.8);
        joint_ball(head_mount_point, d = 8);
    }

    // Dorsal fin and rear fork rods.
    color(light_color)
        translate([0, 22, 122])
            dorsal_fin_plate(dorsal_fin_thickness);

    rear_fork_array();
    pelvis_assembly();
}

module head_assembly() {
    translate(head_center)
        rotate(head_rotation)
            head_mask();
}

module foot_assembly(side = 1) {
    fc = foot_center_pt(side);

    // Wide mechanical foot sole.
    color(light_color)
        translate(fc)
            chamfered_box([foot_width, foot_length, foot_height], ch = 1.3);

    // Heel block.
    color(mid_color)
        translate([side*ankle_x, foot_center_y + foot_length/2 - heel_size[1]/2 + 1, foot_center_z + 2])
            chamfered_box(heel_size, ch = 1.0);

    // Outer stabilizer pad.
    color(mid_color)
        translate([side*(ankle_x + foot_width/2 + 2), foot_center_y, foot_center_z + 0.5])
            chamfered_box(outer_outrigger_size, ch = 0.8);

    // Three front toes.
    color(light_color) {
        for (tx = [-toe_pad_spacing, 0, toe_pad_spacing])
            translate([side*ankle_x + tx, foot_center_y - foot_length/2 + 2, foot_center_z + 2])
                chamfered_box([toe_pad_width, toe_pad_length, toe_pad_height], ch = 0.6);
    }

    // Toe claw tips.
    color(accent_color) {
        for (tx = [-toe_pad_spacing, 0, toe_pad_spacing])
            translate([side*ankle_x + tx, foot_center_y - foot_length/2 - 3, foot_center_z + 3.2])
                rotate([0, 0, -90])
                    tapered_blade_x(length = toe_claw_length, root_w = 3.6, tip_w = 0.7, thick = 1.8);
    }

    // Ankle bracket and ball joint.
    color(mid_color)
        translate([side*ankle_x, ankle_y, 11])
            block_with_y_holes(
                size = ankle_bracket_size,
                rows = 1,
                cols = 2,
                spacing_x = 7,
                spacing_z = 1,
                hole_diam = beam_hole_d,
                chamfer = 0.8
            );

    color(accent_color) {
        joint_ball(ankle_pt(side), d = joint_ball_d);
        capped_axle(ankle_pt(side), axis = [1, 0, 0], length = 17);
    }
}

module leg_assembly(side = 1) {
    hip   = hip_pt(side);
    knee  = knee_pt(side);
    ankle = ankle_pt(side);

    // Hip, knee and ankle joints.
    color(accent_color) {
        joint_ball(hip, d = large_joint_d);
        washer_at(hip, axis = [1, 0, 0], d_outer = 14, d_inner = 5, thick = 4);

        joint_ball(knee, d = large_joint_d);
        capped_axle(knee, axis = [1, 0, 0], length = 17);
        washer_at(knee, axis = [1, 0, 0], d_outer = 14, d_inner = 5, thick = 4);
    }

    // Upper leg double beams.
    color(light_color) {
        beam_between(v_add(hip,  [ side*3.5, -2.5, 0]),
                     v_add(knee, [ side*3.5, -2.0, 1]),
                     w = 7, d = 5);

        beam_between(v_add(hip,  [-side*3.5,  2.5, 0]),
                     v_add(knee, [-side*3.5,  2.0, 1]),
                     w = 7, d = 5);
    }

    // Upper leg triangular bracing.
    color(accent_color)
        triangular_frame(
            v_add(hip,  [ side*6,  1, -2]),
            v_add(knee, [ side*8,  1,  3]),
            v_add(knee, [-side*5,  1, 12]),
            d = 2.4
        );

    // Lower shin beams.
    color(light_color) {
        beam_between(v_add(knee,  [ side*3.2, -2.4, 0]),
                     v_add(ankle, [ side*3.2, -2.2, 0]),
                     w = 8, d = 5);

        beam_between(v_add(knee,  [-side*3.2,  2.2, 0]),
                     v_add(ankle, [-side*3.2,  2.0, 0]),
                     w = 6.5, d = 5);
    }

    // Outer shin truss and piston detail.
    color(accent_color) {
        triangular_frame(
            [side*(knee_x + 4),  knee_y - 2, knee_z],
            [side*(ankle_x + 5), ankle_y - 2, ankle_z + 2],
            [side*(knee_x + 18), (knee_y + ankle_y)/2 - 2, (knee_z + ankle_z)/2],
            d = 3.0
        );

        rod_between(v_add(knee,  [ side*8, -4, -5]),
                    v_add(ankle, [-side*6, -4,  5]),
                    d = 2.4);

        hydraulic_between(v_add(knee,  [ side*8, 1, -3]),
                          v_add(ankle, [ side*5, 1,  4]),
                          body_d = 4.6,
                          shaft_d = 1.8,
                          body_fraction = 0.38);
    }

    foot_assembly(side);
}

module arm_assembly(side = 1) {
    shoulder = shoulder_pt(side);
    elbow    = elbow_pt(side);
    wrist    = wrist_pt(side);

    // Main shoulder, elbow and wrist joints.
    color(accent_color) {
        joint_ball(shoulder, d = large_joint_d);
        joint_ball(elbow, d = joint_ball_d);
        joint_ball(wrist, d = joint_ball_d);

        washer_at(shoulder, axis = [1, 0, 0], d_outer = 14, d_inner = 5, thick = 4);
        capped_axle(elbow, axis = [0, 1, 0], length = 16);
        capped_axle(wrist, axis = [0, 1, 0], length = 14);
    }

    // Upper arm beams.
    color(light_color) {
        beam_between(v_add(shoulder, [0, -3,  3]),
                     v_add(elbow,    [0, -2,  2]),
                     w = 7, d = 5);

        beam_between(v_add(shoulder, [0,  3, -3]),
                     v_add(elbow,    [0,  2, -2]),
                     w = 6.5, d = 5);
    }

    // Forearm beams.
    color(light_color) {
        beam_between(v_add(elbow, [0, -2.5,  2]),
                     v_add(wrist, [0, -2.5,  2]),
                     w = 7, d = 5);

        beam_between(v_add(elbow, [0,  2.5, -2]),
                     v_add(wrist, [0,  2.5, -2]),
                     w = 6.5, d = 5);
    }

    // Arm triangular bracing and piston.
    color(accent_color) {
        triangular_frame(
            v_add(shoulder, [0,  5, -4]),
            v_add(elbow,    [0,  5, -3]),
            v_add(elbow,    [0, -4,  6]),
            d = 2.2
        );

        hydraulic_between(v_add(shoulder, [0,  5, -5]),
                          v_add(elbow,    [0,  5, -5]),
                          body_d = 4.2,
                          shaft_d = 1.7,
                          body_fraction = 0.36);
    }

    // Ribbed hose along forearm.
    color(dark_color)
        corrugated_between(v_add(elbow, [0, -5, 3]),
                           v_add(wrist, [0, -5, 3]),
                           core_d = 1.3,
                           ring_d = 4.0,
                           ring_w = 0.9,
                           pitch = 3.1);

    // Pincer hand aimed outward and slightly forward.
    translate(wrist)
        rotate([0, side * arm_claw_pitch, side > 0 ? -arm_claw_yaw : 180 + arm_claw_yaw])
            claw_hand(claw_open_angle);
}

// -----------------------------------------------------------------------------
// Main model
// -----------------------------------------------------------------------------
module mech_creature() {
    union() {
        torso_assembly();
        head_assembly();

        for (s = [-1, 1]) {
            leg_assembly(s);
            arm_assembly(s);
        }
    }
}

scale([model_scale, model_scale, model_scale])
    mech_creature();