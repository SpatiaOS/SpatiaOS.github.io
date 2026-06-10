// Stylized Leaping Panther/Cat Figurine
// Approximate bounding box: 260 x 129 x 115 mm
// Constructed from hull'd ellipsoids for organic freeform appearance

$fn = 32;

// === Body Parameters ===
chest_pos      = [25, 0, 15];
hip_pos        = [-40, 0, 0];
shoulder_pos   = [15, 0, 38];

// Head
head_pos       = [75, 0, 44];
head_size      = [20, 19, 18];
snout_offset   = [20, 0, -8];
snout_size     = [11, 11, 10];
jaw_size       = [14, 13, 8];
ear_height     = 20;
ear_spread_y   = 11;
nose_radius    = 2.3;
nose_depth     = 2.06;
eye_radius     = 3;
brow_offset_y  = 14;

// Legs
front_leg_spread = 14;
back_leg_spread  = 13;
upper_leg_r      = 8;
lower_leg_r      = 6;
paw_dim          = [8, 6, 4];
toe_dim          = [4, 2.5, 2.2];
toe_spacing      = 3.5;

// Tail
tail_segments    = 24;
tail_base_r      = 8;
tail_reach       = 100;
tail_arc_height  = 44;

// === Helper Modules ===
module elli(rx, ry, rz) {
    scale([rx, ry, rz]) sphere(1);
}

module paw(pos) {
    translate(pos) elli(paw_dim[0], paw_dim[1], paw_dim[2]);
    for (dy = [-toe_spacing, 0, toe_spacing])
        translate(pos + [5, dy, -1]) elli(toe_dim[0], toe_dim[1], toe_dim[2]);
}

// Limb segment: hull between two positioned spheres
module limb_seg(p1, r1, p2, r2) {
    hull() {
        translate(p1) sphere(r1);
        translate(p2) sphere(r2);
    }
}

// Upper limb from ellipsoidal origin to spherical joint
module limb_origin(p1, e, p2, r2) {
    hull() {
        translate(p1) elli(e[0], e[1], e[2]);
        translate(p2) sphere(r2);
    }
}

// === Main Figurine ===
module leaping_cat() {

    // ---- TORSO ----
    // Chest to mid-body
    hull() {
        translate(chest_pos) elli(32, 28, 32);
        translate([-25, 0, 5]) elli(26, 23, 25);
    }
    // Mid-body to hip
    hull() {
        translate([-25, 0, 5]) elli(25, 22, 25);
        translate(hip_pos) elli(32, 25, 30);
    }
    // Shoulder ridge
    translate(shoulder_pos) elli(26, 23, 16);
    hull() {
        translate(shoulder_pos) elli(20, 20, 14);
        translate([-10, 0, 30]) elli(22, 20, 14);
    }

    // ---- NECK ----
    hull() {
        translate([40, 0, 28]) elli(18, 17, 22);
        translate([62, 0, 42]) elli(15, 15, 15);
    }

    // ---- HEAD ----
    translate(head_pos) {
        // Cranium with snout
        hull() {
            elli(head_size[0], head_size[1], head_size[2]);
            translate(snout_offset) elli(snout_size[0], snout_size[1], snout_size[2]);
        }
        // Lower jaw
        hull() {
            translate([6, 0, -10]) elli(jaw_size[0], jaw_size[1], jaw_size[2]);
            translate([20, 0, -12]) elli(9, 9, 6);
        }
        // Cheek mass
        for (s = [-1, 1])
            translate([8, s * 16, -2]) elli(8, 5, 8);

        // Ears (left and right)
        for (s = [-1, 1])
            translate([-2, s * ear_spread_y, 15])
                rotate([s * 12, -8, 0])
                hull() {
                    elli(5, 4, 3);
                    translate([2, s * 3, ear_height]) elli(2.5, 1.5, 2);
                }

        // Nose
        translate([30, 0, -9]) rotate([0, 90, 0])
            cylinder(r = nose_radius, h = nose_depth);

        // Brow ridges and eye spheres
        for (s = [-1, 1]) {
            translate([9, s * brow_offset_y, 4]) elli(5.5, 3.5, 3.5);
            // Eye indentation sphere (slightly raised)
            translate([11, s * (brow_offset_y + 0.5), 3]) sphere(eye_radius);
        }
    }

    // ---- FRONT RIGHT LEG ----
    limb_origin([42, -front_leg_spread, 5], [13, 10, 16],
                [62, -12, -25], upper_leg_r);
    limb_seg([62, -12, -25], upper_leg_r,
             [80, -11, -50], lower_leg_r);
    paw([84, -11, -54]);

    // ---- FRONT LEFT LEG ----
    limb_origin([42, front_leg_spread, 5], [13, 10, 16],
                [58, 12, -28], upper_leg_r);
    limb_seg([58, 12, -28], upper_leg_r,
             [74, 11, -52], lower_leg_r);
    paw([78, 11, -56]);

    // ---- BACK RIGHT LEG ----
    limb_origin([-42, -back_leg_spread, 2], [20, 13, 22],
                [-58, -12, -30], 9);
    limb_seg([-58, -12, -30], 9,
             [-32, -11, -56], 7);
    limb_seg([-32, -11, -56], 7,
             [-20, -11, -62], 5.5);
    paw([-16, -11, -65]);

    // ---- BACK LEFT LEG ----
    limb_origin([-42, back_leg_spread, 2], [20, 13, 22],
                [-62, 12, -34], 9);
    limb_seg([-62, 12, -34], 9,
             [-40, 11, -60], 7);
    limb_seg([-40, 11, -60], 7,
             [-28, 11, -66], 5.5);
    paw([-24, 11, -69]);

    // ---- TAIL ----
    // Graceful arc from hip, curving upward and backward
    for (i = [0 : tail_segments - 1]) {
        t1 = i / tail_segments;
        t2 = (i + 1) / tail_segments;

        x1 = -55 - tail_reach * t1;
        z1 = 8 + tail_arc_height * sin(t1 * 145);
        x2 = -55 - tail_reach * t2;
        z2 = 8 + tail_arc_height * sin(t2 * 145);

        // Slight lateral sway for natural look
        y1 = 4 * sin(t1 * 180);
        y2 = 4 * sin(t2 * 180);

        r1 = tail_base_r * (1 - t1 * 0.63);
        r2 = tail_base_r * (1 - t2 * 0.63);

        hull() {
            translate([x1, y1, z1]) sphere(r1);
            translate([x2, y2, z2]) sphere(r2);
        }
    }
}

// Render: lift so paws sit near z = 0
translate([10, 0, 70])
    leaping_cat();