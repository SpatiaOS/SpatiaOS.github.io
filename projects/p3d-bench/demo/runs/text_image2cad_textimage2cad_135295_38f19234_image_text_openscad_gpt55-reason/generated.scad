// Stylized leaping quadruped assembly reconstruction
// Units: millimeters

// -------------------------
// Global parameters
// -------------------------
model_scale = 1.0;

// Kept aligned to +X for simple STL export.
// Set final_yaw_deg = 45 and final_pitch_deg = 8 to align local head-to-tail
// approximately with world vector [-0.70, -0.70, 0.14].
final_roll_deg  = 0;
final_pitch_deg = 0;
final_yaw_deg   = 0;

surface_fn = 44;
seam_fn    = 12;
claw_fn    = 12;
$fn = surface_fn;

eps = 0.05;

// Colors for preview; STL export remains a unified solid.
main_color      = [0.72, 0.74, 0.78, 1.0];
highlight_color = [0.86, 0.87, 0.90, 1.0];
shadow_color    = [0.48, 0.50, 0.54, 1.0];
seam_color      = [0.04, 0.04, 0.05, 1.0];
eye_color       = [0.02, 0.02, 0.02, 1.0];
nose_color      = [0.03, 0.03, 0.035, 1.0];
claw_color      = [0.06, 0.06, 0.07, 1.0];

// -------------------------
// Main sculptural dimensions
// -------------------------
nose_radius = 2.30;
nose_length = 2.06;
nose_base_x = 115.8;
nose_center_z = 23.0;

body_nodes = [
    [[-54, 0,  0], [30, 31, 29]],
    [[-16, 0, 10], [43, 27, 28]],
    [[ 28, 0, 18], [32, 24, 26]],
    [[ 52, 0, 22], [18, 20, 22]]
];

hip_bulge_nodes_pos = [
    [[-59, 19, -4], [18, 11, 22]],
    [[-39, 23, -7], [16, 10, 18]]
];

shoulder_bulge_nodes_pos = [
    [[ 30, 17, 12], [15,  9, 18]],
    [[ 51, 15, 18], [12,  8, 16]]
];

belly_nodes = [
    [[-25, 0, -9], [25, 16, 10]],
    [[ 35, 0, -7], [20, 14,  9]]
];

neck_nodes = [
    [[47, 0, 24], [16, 18, 17]],
    [[63, 0, 34], [16, 16, 17]],
    [[78, 0, 31], [13, 14, 14]]
];

head_nodes = [
    [[ 73, 0, 33], [19, 18, 21]],
    [[ 93, 0, 28], [18, 14, 14]],
    [[110.5, 0, 23], [5.5, 5.5, 5]]
];

head_cheek_nodes_pos = [
    [[ 85, 10, 26], [10, 7, 8]],
    [[104,  7, 22], [ 9, 5, 6]]
];

lower_jaw_nodes = [
    [[ 86, 0, 18], [13, 10, 6]],
    [[109, 0, 18], [ 7,  5, 4]]
];

brow_nodes_pos = [
    [[75,  7, 43], [6, 4, 4]],
    [[94, 10, 37], [9, 3.5, 3]]
];

eye_socket_x = 91.5;
eye_socket_z = 36.0;
eye_socket_inner_y = 13.8;
eye_socket_outer_y = 23.5;
eye_socket_radius = 3.8;

eye_center = [91.5, 18.55, 36.0];
eye_radii  = [2.4, 0.85, 2.0];

mouth_groove_path_pos = [
    [ 91, 13.2, 22],
    [103,  9.6, 20],
    [114,  3.2, 22]
];
mouth_groove_radius = 0.9;

ear_points_pos = [
    [62,  5, 42],
    [83,  6, 39],
    [84, 18, 38],
    [62, 19, 40],
    [72, 16, 68]
];

ear_faces = [
    [0, 1, 4],
    [1, 2, 4],
    [2, 3, 4],
    [3, 0, 4],
    [0, 3, 2, 1]
];

tail_points = [
    [-70, 0,  4],
    [-89, 0, 15],
    [-105, 0, 36],
    [-101, 0, 58],
    [-119, 0, 70],
    [-136, 0, 72]
];

tail_radii = [9, 8, 6.8, 5.7, 4.6, 3.5];
tail_flat_tip_end = [-145, 0, 72];
tail_tip_radius = 3.5;

dorsal_ridge_nodes = [
    [[-70, 0, 25], [8, 4.5, 3.5]],
    [[-42, 0, 35], [9, 4.0, 3.2]],
    [[ -8, 0, 42], [11, 4.0, 3.0]],
    [[ 28, 0, 43], [9, 3.7, 2.8]],
    [[ 58, 0, 41], [7, 3.5, 2.8]],
    [[ 76, 0, 47], [5, 3.0, 2.4]]
];

chest_keel_points = [
    [55, -7,  14],
    [96, -6,   2],
    [77, -5, -23],
    [55,  7,  14],
    [96,  6,   2],
    [77,  5, -23]
];

chest_keel_faces = [
    [0, 1, 2],
    [3, 5, 4],
    [0, 3, 4, 1],
    [1, 4, 5, 2],
    [2, 5, 3, 0]
];

// -------------------------
// Limb and paw dimensions
// -------------------------
front_near_leg_points = [
    [43, -22,  18],
    [56, -29,  -5],
    [69, -36, -27],
    [96, -39, -40]
];
front_near_leg_radii = [10, 8.5, 6.5, 5.4];

front_far_leg_points = [
    [43,  22,  18],
    [62,  32,   1],
    [82,  40, -18],
    [105, 43, -31]
];
front_far_leg_radii = [8.5, 7.2, 5.5, 4.5];

rear_near_leg_points = [
    [-54, -21,   4],
    [-42, -31, -20],
    [-18, -35, -42],
    [ 17, -37, -48]
];
rear_near_leg_radii = [13, 11, 8.4, 6];

rear_far_leg_points = [
    [-61,  20,   7],
    [-84,  29,  -8],
    [-82,  35, -31],
    [-49,  39, -42]
];
rear_far_leg_radii = [10, 8, 6, 5];

front_paw_len = 22;
front_paw_width = 11;
front_paw_height = 6.4;
front_toe_len = 7.0;
front_claw_len = 5.0;

rear_paw_len = 24;
rear_paw_width = 12;
rear_paw_height = 7.0;
rear_toe_len = 7.5;
rear_claw_len = 5.5;

front_near_paw_pos = [99, -39, -41];
front_far_paw_pos  = [108, 43, -32];
rear_near_paw_pos  = [25, -37, -49];
rear_far_paw_pos   = [-45, 39, -43];

front_near_paw_yaw = -3;
front_far_paw_yaw  =  6;
rear_near_paw_yaw  = -4;
rear_far_paw_yaw   = 14;

paw_toe_offsets_fraction = [-0.28, 0, 0.28];

// -------------------------
// Raised seam network
// -------------------------
dorsal_seam_path = [
    [-70, 0, 25],
    [-42, 0, 35],
    [ -8, 0, 42],
    [ 28, 0, 43],
    [ 58, 0, 41],
    [ 76, 0, 47]
];

face_center_seam_path = [
    [72, 0, 52],
    [84, 0, 42],
    [101, 0, 31],
    [116, 0, 24]
];

side_seam_paths_pos = [
    [[-70, 15, 23], [-54, 25, 15], [-43, 24, -4], [-55, 16, -16]],
    [[-61, 17, 22], [-28, 24, 36], [  7, 23, 35], [ 37, 18, 32]],
    [[-50, 26,  1], [-20, 27, 14], [ 16, 25, 16], [ 48, 19, 18]],
    [[-24, 21,-11], [  4, 24,  0], [ 30, 21, 10]],
    [[ 33, 18, 31], [ 44, 22, 21], [ 49, 19,  7], [ 42, 14, -1]],
    [[ 75,  8, 50], [ 88, 13, 41], [104,  8, 31], [116,  2, 25]],
    [[ 67,  6, 42], [ 79, 16, 39], [ 89, 16, 34]],
    [[ 54, 20, 14], [ 63, 27,  0], [ 70, 34,-16]],
    [[-49, 20,  4], [-39, 29,-18], [-23, 32,-35]],
    mouth_groove_path_pos
];

ear_seam_paths_pos = [
    [[62,  5, 42], [72, 16, 68], [84, 18, 38]],
    [[62, 19, 40], [72, 16, 68], [83,  6, 39]],
    [[62,  5, 42], [83,  6, 39], [84, 18, 38], [62, 19, 40], [62, 5, 42]]
];

seam_radius_body = 0.85;
seam_radius_head = 0.58;
seam_radius_dorsal = 1.0;

// -------------------------
// Utility functions/modules
// -------------------------
function v_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function clamp(x, lo, hi) = min(max(x, lo), hi);

module ellipsoid(p=[0,0,0], r=[1,1,1], rot=[0,0,0], fn=surface_fn) {
    translate(p)
        rotate(rot)
            scale(r)
                sphere(r=1, $fn=fn);
}

module ellipsoid_chain(nodes, fn=surface_fn) {
    for (i = [0 : len(nodes) - 2]) {
        hull() {
            ellipsoid(p=nodes[i][0],     r=nodes[i][1],     fn=fn);
            ellipsoid(p=nodes[i + 1][0], r=nodes[i + 1][1], fn=fn);
        }
    }
}

module capsule_between(p1, p2, r1, r2, fn=surface_fn) {
    hull() {
        translate(p1) sphere(r=r1, $fn=fn);
        translate(p2) sphere(r=r2, $fn=fn);
    }
}

module tube_path(points, radii, fn=surface_fn) {
    for (i = [0 : len(points) - 2]) {
        capsule_between(points[i], points[i + 1], radii[i], radii[i + 1], fn=fn);
    }
}

module uniform_tube_path(points, r=1, fn=seam_fn) {
    for (i = [0 : len(points) - 2]) {
        capsule_between(points[i], points[i + 1], r, r, fn=fn);
    }
}

module tapered_cylinder_between(p1, p2, r1=1, r2=1, fn=24) {
    v = v_sub(p2, p1);
    l = norm(v);

    if (l > eps) {
        translate(p1) {
            if (abs(v[0]) + abs(v[1]) < eps) {
                if (v[2] >= 0) {
                    cylinder(h=l, r1=r1, r2=r2, center=false, $fn=fn);
                } else {
                    rotate([180, 0, 0])
                        cylinder(h=l, r1=r1, r2=r2, center=false, $fn=fn);
                }
            } else {
                rotate(a=acos(clamp(v[2] / l, -1, 1)), v=[-v[1], v[0], 0])
                    cylinder(h=l, r1=r1, r2=r2, center=false, $fn=fn);
            }
        }
    }
}

// -------------------------
// Sculptural body modules
// -------------------------
module torso_shell() {
    union() {
        ellipsoid_chain(body_nodes, fn=surface_fn);

        ellipsoid_chain(hip_bulge_nodes_pos, fn=surface_fn);
        mirror([0, 1, 0]) ellipsoid_chain(hip_bulge_nodes_pos, fn=surface_fn);

        ellipsoid_chain(shoulder_bulge_nodes_pos, fn=surface_fn);
        mirror([0, 1, 0]) ellipsoid_chain(shoulder_bulge_nodes_pos, fn=surface_fn);

        ellipsoid_chain(belly_nodes, fn=surface_fn);
    }
}

module dorsal_ridge() {
    ellipsoid_chain(dorsal_ridge_nodes, fn=surface_fn);
}

module neck_shell() {
    union() {
        ellipsoid_chain(neck_nodes, fn=surface_fn);

        hull() {
            ellipsoid(p=[58, 0, 19], r=[15, 12, 10], fn=surface_fn);
            ellipsoid(p=[84, 0, 19], r=[12,  9,  7], fn=surface_fn);
        }
    }
}

module tail_shell() {
    union() {
        tube_path(tail_points, tail_radii, fn=surface_fn);

        // Short flat-ended cylindrical tip visible in the reference.
        tapered_cylinder_between(
            tail_points[len(tail_points) - 1],
            tail_flat_tip_end,
            tail_tip_radius,
            tail_tip_radius,
            fn=surface_fn
        );
    }
}

module angular_chest_keel() {
    polyhedron(points=chest_keel_points, faces=chest_keel_faces, convexity=4);
}

// -------------------------
// Head modules
// -------------------------
module pointed_ears() {
    union() {
        polyhedron(points=ear_points_pos, faces=ear_faces, convexity=4);
        mirror([0, 1, 0])
            polyhedron(points=ear_points_pos, faces=ear_faces, convexity=4);
    }
}

module head_shell() {
    difference() {
        union() {
            ellipsoid_chain(head_nodes, fn=surface_fn);

            ellipsoid_chain(head_cheek_nodes_pos, fn=surface_fn);
            mirror([0, 1, 0]) ellipsoid_chain(head_cheek_nodes_pos, fn=surface_fn);

            ellipsoid_chain(lower_jaw_nodes, fn=surface_fn);

            ellipsoid_chain(brow_nodes_pos, fn=surface_fn);
            mirror([0, 1, 0]) ellipsoid_chain(brow_nodes_pos, fn=surface_fn);
        }

        // Eye recesses and subtle muzzle groove cuts.
        for (side = [-1, 1]) {
            tapered_cylinder_between(
                [eye_socket_x, side * eye_socket_inner_y, eye_socket_z],
                [eye_socket_x, side * eye_socket_outer_y, eye_socket_z],
                eye_socket_radius,
                eye_socket_radius,
                fn=24
            );
        }

        uniform_tube_path(mouth_groove_path_pos, r=mouth_groove_radius, fn=seam_fn);
        mirror([0, 1, 0])
            uniform_tube_path(mouth_groove_path_pos, r=mouth_groove_radius, fn=seam_fn);
    }
}

module head_inlays() {
    color(eye_color) {
        ellipsoid(p= eye_center, r=eye_radii, fn=24);
        ellipsoid(p=[eye_center[0], -eye_center[1], eye_center[2]], r=eye_radii, fn=24);
    }

    color(nose_color) {
        tapered_cylinder_between(
            [nose_base_x, 0, nose_center_z],
            [nose_base_x + nose_length, 0, nose_center_z],
            nose_radius,
            nose_radius,
            fn=28
        );

        ellipsoid(
            p=[nose_base_x + nose_length, 0, nose_center_z],
            r=[0.75, nose_radius, nose_radius],
            fn=28
        );
    }
}

// -------------------------
// Limb and paw modules
// -------------------------
module limb_chain(points, radii, fn=surface_fn) {
    for (i = [0 : len(points) - 2]) {
        capsule_between(points[i], points[i + 1], radii[i], radii[i + 1], fn=fn);
    }
}

module paw(
    pos=[0,0,0],
    yaw=0,
    pitch=0,
    foot_len=22,
    foot_width=11,
    foot_height=6,
    toe_len=7,
    claw_len=5,
    paw_scale=1
) {
    translate(pos)
        rotate([0, pitch, yaw])
            scale([paw_scale, paw_scale, paw_scale]) {
                color(main_color) {
                    difference() {
                        union() {
                            hull() {
                                ellipsoid(
                                    p=[-foot_len * 0.18, 0, 0],
                                    r=[foot_len * 0.42, foot_width * 0.43, foot_height * 0.50],
                                    fn=24
                                );
                                ellipsoid(
                                    p=[ foot_len * 0.25, 0, -0.3],
                                    r=[foot_len * 0.34, foot_width * 0.37, foot_height * 0.42],
                                    fn=24
                                );
                            }

                            for (off = paw_toe_offsets_fraction) {
                                capsule_between(
                                    [foot_len * 0.15, off * foot_width, 0],
                                    [foot_len * 0.50, off * foot_width, 0],
                                    foot_height * 0.22,
                                    foot_height * 0.16,
                                    fn=18
                                );
                            }
                        }

                        // Small local flat underside, matching the few planar contact faces.
                        translate([0, 0, -foot_height])
                            cube([foot_len * 2, foot_width * 2, foot_height * 1.2], center=true);
                    }
                }

                color(claw_color) {
                    for (off = paw_toe_offsets_fraction) {
                        tapered_cylinder_between(
                            [foot_len * 0.50, off * foot_width, 0],
                            [foot_len * 0.50 + claw_len, off * foot_width, -foot_height * 0.18],
                            foot_height * 0.14,
                            0.18,
                            fn=claw_fn
                        );
                    }
                }
            }
}

module limb_set() {
    color(main_color) {
        limb_chain(front_near_leg_points, front_near_leg_radii, fn=surface_fn);
        limb_chain(front_far_leg_points,  front_far_leg_radii,  fn=surface_fn);
        limb_chain(rear_near_leg_points,  rear_near_leg_radii,  fn=surface_fn);
        limb_chain(rear_far_leg_points,   rear_far_leg_radii,   fn=surface_fn);

        // Organic shoulder and hip blends.
        ellipsoid(p=front_near_leg_points[0], r=[12, 9, 12], fn=surface_fn);
        ellipsoid(p=front_far_leg_points[0],  r=[10, 8, 11], fn=surface_fn);
        ellipsoid(p=rear_near_leg_points[0],  r=[15, 10, 15], fn=surface_fn);
        ellipsoid(p=rear_far_leg_points[0],   r=[12,  9, 12], fn=surface_fn);
    }

    paw(
        pos=front_near_paw_pos,
        yaw=front_near_paw_yaw,
        foot_len=front_paw_len,
        foot_width=front_paw_width,
        foot_height=front_paw_height,
        toe_len=front_toe_len,
        claw_len=front_claw_len
    );

    paw(
        pos=front_far_paw_pos,
        yaw=front_far_paw_yaw,
        foot_len=front_paw_len * 0.92,
        foot_width=front_paw_width * 0.90,
        foot_height=front_paw_height * 0.88,
        toe_len=front_toe_len,
        claw_len=front_claw_len * 0.9
    );

    paw(
        pos=rear_near_paw_pos,
        yaw=rear_near_paw_yaw,
        foot_len=rear_paw_len,
        foot_width=rear_paw_width,
        foot_height=rear_paw_height,
        toe_len=rear_toe_len,
        claw_len=rear_claw_len
    );

    paw(
        pos=rear_far_paw_pos,
        yaw=rear_far_paw_yaw,
        foot_len=rear_paw_len * 0.90,
        foot_width=rear_paw_width * 0.90,
        foot_height=rear_paw_height * 0.88,
        toe_len=rear_toe_len,
        claw_len=rear_claw_len * 0.9
    );
}

// -------------------------
// Decorative segmented seams
// -------------------------
module panel_seams() {
    color(seam_color) {
        uniform_tube_path(dorsal_seam_path, r=seam_radius_dorsal, fn=seam_fn);
        uniform_tube_path(face_center_seam_path, r=seam_radius_head, fn=seam_fn);

        for (path = side_seam_paths_pos) {
            uniform_tube_path(path, r=seam_radius_body, fn=seam_fn);
            mirror([0, 1, 0])
                uniform_tube_path(path, r=seam_radius_body, fn=seam_fn);
        }

        for (path = ear_seam_paths_pos) {
            uniform_tube_path(path, r=seam_radius_head, fn=seam_fn);
            mirror([0, 1, 0])
                uniform_tube_path(path, r=seam_radius_head, fn=seam_fn);
        }
    }
}

// -------------------------
// Unified assembly
// -------------------------
module unified_quadruped() {
    union() {
        color(main_color) torso_shell();
        color(highlight_color) dorsal_ridge();

        color(main_color) tail_shell();
        color(main_color) neck_shell();

        color(main_color) head_shell();
        color(main_color) pointed_ears();
        head_inlays();

        limb_set();

        color(shadow_color) angular_chest_keel();

        panel_seams();
    }
}

scale([model_scale, model_scale, model_scale])
    rotate([final_roll_deg, final_pitch_deg, final_yaw_deg])
        unified_quadruped();