// ==========================================
// Parametric Low-Poly Leaping Quadruped Assembly
// ==========================================

$fn = 8; // low-poly sculptural facets

// -- Overall pose --
pose_z = 45; // diagonal orientation in XY plane

// -- Head shell dimensions --
head_nose_x = 42;
ear_base = 12;
ear_height = 15;
nose_r = 2.3;
nose_h = 2.1;
eye_r = 3.2;

// -- Body core dimensions --
body_front_x = 20;
body_rear_x = -48;
body_half_width = 30;
body_top_z = 28;
body_bottom_z = -28;

// -- Ornamental figurine: tail & limbs --
tail_start = [-65, 0, 5];
tail_pts = [
    [-90, 6, 12],
    [-115, 14, 22],
    [-140, 22, 32],
    [-165, 28, 38],
    [-185, 32, 42]
];
tail_r_start = 9;
tail_r_end = 4;

rear_leg = [
    [-55, 16, -2],
    [-78, 24, -20],
    [-100, 28, -38],
    [-118, 32, -48],
    [-132, 36, -52]
];

front_paw_l = [
    [35, 16, -18],
    [50, 18, -30],
    [60, 20, -36]
];
front_paw_r = [
    [35, -16, -18],
    [50, -18, -30],
    [60, -20, -36]
];

// -- Unnamed part (inferred lower jaw) --
jaw_x = head_nose_x - 14;

// ==========================================
// Modules
// ==========================================

module pointed_ear(base, height) {
    b = base;
    h = height;
    polyhedron(
        points = [
            [0, -b/2, 0],
            [0, b/2, 0],
            [b*0.6, 0, 0],
            [b*0.2, 0, h]
        ],
        faces = [
            [0, 1, 2],
            [0, 2, 3],
            [2, 1, 3],
            [1, 0, 3]
        ]
    );
}

module sculptural_head_shell() {
    nx = head_nose_x;
    difference() {
        union() {
            // Cranium, snout and cheeks
            hull() {
                translate([nx - 26, 0, 10]) sphere(12);
                translate([nx - 22, 0, 20]) sphere(10);
                translate([nx - 24, 10, 9]) sphere(9);
                translate([nx - 24, -10, 9]) sphere(9);
                translate([nx - 14, 0, 18]) sphere(9);
                translate([nx - 6, 0, 6]) sphere(9);
                translate([nx, 0, 3]) sphere(7);
                translate([nx + 4, 0, 2]) sphere(6);
                translate([nx - 16, 8, 1]) sphere(6);
                translate([nx - 16, -8, 1]) sphere(6);
            }
            // Ears
            translate([nx - 20, 9, 22]) rotate([10, 0, 25]) pointed_ear(ear_base, ear_height);
            translate([nx - 20, -9, 22]) rotate([10, 0, -25]) pointed_ear(ear_base, ear_height);
            // Cylindrical nose tip
            translate([nx + 6, 0, 2]) rotate([0, 90, 0]) cylinder(h = nose_h, r = nose_r);
        }
        // Eye indentations
        translate([nx - 12, 10, 10]) sphere(eye_r);
        translate([nx - 12, -10, 10]) sphere(eye_r);
    }
}

module unnamed_part() {
    // Inferred lower jaw / chin piece
    jx = jaw_x;
    hull() {
        translate([jx - 8, 0, -6]) sphere(5);
        translate([jx + 2, 0, -5]) sphere(5);
        translate([jx + 10, 0, -4]) sphere(4);
        translate([jx - 4, 6, -5]) sphere(4);
        translate([jx - 4, -6, -5]) sphere(4);
    }
}

module figurine_body() {
    fx = body_front_x;
    rx = body_rear_x;
    hw = body_half_width;
    tz = body_top_z;
    bz = body_bottom_z;
    // Compact near-cubic torso
    hull() {
        translate([fx, 0, 0]) sphere(26);
        translate([fx - 5, hw, 5]) sphere(24);
        translate([fx - 5, -hw, 5]) sphere(24);
        translate([fx - 10, 0, tz - 4]) sphere(24);
        translate([fx - 5, 0, bz + 4]) sphere(24);
        translate([-5, 0, tz - 6]) sphere(26);
        translate([-10, hw - 4, 0]) sphere(24);
        translate([-10, -hw + 4, 0]) sphere(24);
        translate([rx + 15, 0, 8]) sphere(26);
        translate([rx + 20, hw - 6, 4]) sphere(22);
        translate([rx + 20, -hw + 6, 4]) sphere(22);
        translate([rx, 0, tz - 8]) sphere(24);
        translate([rx + 5, 0, bz + 6]) sphere(22);
    }
}

module ornamental_figurine() {
    // Long curved tail
    all_tail = concat([tail_start], tail_pts);
    n = len(all_tail);
    for (i = [0 : n - 2]) {
        r1 = tail_r_start - (tail_r_start - tail_r_end) * i / (n - 1);
        r2 = tail_r_start - (tail_r_start - tail_r_end) * (i + 1) / (n - 1);
        hull() {
            translate(all_tail[i]) sphere(r1);
            translate(all_tail[i+1]) sphere(r2);
        }
    }
    
    // Rear leg and foot
    hull() {
        translate(rear_leg[0]) sphere(18);
        translate(rear_leg[1]) sphere(15);
        translate(rear_leg[2]) sphere(12);
        translate(rear_leg[3]) sphere(10);
        translate(rear_leg[4]) sphere(8);
    }
    
    // Front paws
    hull() {
        translate(front_paw_l[0]) sphere(9);
        translate(front_paw_l[1]) sphere(7);
        translate(front_paw_l[2]) sphere(5);
    }
    hull() {
        translate(front_paw_r[0]) sphere(9);
        translate(front_paw_r[1]) sphere(7);
        translate(front_paw_r[2]) sphere(5);
    }
}

// ==========================================
// Assembly
// ==========================================

module quadruped() {
    sculptural_head_shell();
    unnamed_part();
    figurine_body();
    ornamental_figurine();
}

rotate([0, 0, pose_z])
quadruped();