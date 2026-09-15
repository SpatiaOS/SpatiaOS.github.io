// Hand-cranked ring-gear mill
$fn = 64;

// --- parameters (mm) ---
shaft_h = 64;
shaft_d = 8;

foot_l = 108;
foot_w = 22;
foot_h = 6;

plate_t = 8;
plate_b = 88;
boss_d  = 24;

ring_od    = 114;
ring_id    = 88;
ring_w     = 16;
ring_teeth = 52;
rt_h = 3.2;
rt_w = 2.5;

ig_od    = 72;
ig_id    = 56;
ig_w     = 7;
ig_teeth = 16;
igt_h = 4;
igt_w = 6;
hub_d   = 16;
spoke_w = 7;
spoke_t = 6;

hous_d1 = 28;
hous_d2 = 14;
noz_d   = 18;
noz_l   = 10;
noz_hole = 8;

arm_sq = 6;
grip_d = 8;
grip_l = 20;

wheel_x = plate_t/2 + ring_w/2 + 6;

// --- ring gear (internal teeth) ---
module ring_gear() {
    rotate([0, 90, 0]) {
        rotate_extrude(convexity = 8, $fn = 80)
            hull() {
                translate([ring_id/2 + 2.2, -ring_w/2 + 2.2]) circle(r = 2.2, $fn = 20);
                translate([ring_id/2 + 2.2,  ring_w/2 - 2.2]) circle(r = 2.2, $fn = 20);
                translate([ring_od/2 - 2.2, -ring_w/2 + 2.2]) circle(r = 2.2, $fn = 20);
                translate([ring_od/2 - 2.2,  ring_w/2 - 2.2]) circle(r = 2.2, $fn = 20);
            }
        for (i = [0 : ring_teeth - 1])
            rotate(i * 360 / ring_teeth)
                translate([ring_id/2 - rt_h/2 + 0.6, 0, 0])
                    cube([rt_h, rt_w, ring_w - 3], center = true);
    }
}

// --- inner spoked gear ---
module inner_gear() {
    rotate([0, 90, 0]) {
        difference() {
            union() {
                cylinder(d = ig_od - 2*igt_h + 1.5, h = ig_w, center = true, $fn = 48);
                for (i = [0 : ig_teeth - 1])
                    rotate(i * 360 / ig_teeth)
                        translate([ig_od/2 - igt_h/2, 0, 0])
                            cube([igt_h + 1, igt_w, ig_w], center = true);
            }
            cylinder(d = ig_id, h = ig_w + 2, center = true, $fn = 48);
        }
        for (a = [0, 90])
            rotate(a)
                cube([ig_id - 3, spoke_w, spoke_t], center = true);
        for (a = [0 : 90 : 270])
            rotate(a)
                translate([ig_id/2 - 5, 0, 0]) {
                    cube([9, spoke_w + 3, spoke_t + 2], center = true);
                    cylinder(d = 5.5, h = 12, center = true);
                }
        cylinder(d = hub_d, h = 12, center = true);
        cylinder(d = shaft_d + 3, h = 16, center = true);
    }
}

// --- stand ---
module base() {
    translate([5, 0, foot_h/2])
        cube([foot_w, foot_l, foot_h], center = true);
    hull() {
        translate([0, 0, foot_h])
            cube([plate_t, plate_b, 4], center = true);
        translate([-plate_t/2, 0, shaft_h])
            rotate([0, 90, 0])
                cylinder(d = boss_d, h = plate_t);
    }
}

// --- conical housing ---
module housing() {
    translate([0, 0, shaft_h]) {
        rotate([0, 90, 0])
            cylinder(d = 18, h = plate_t + 6, center = true);
        translate([-plate_t/2, 0, 0])
            rotate([0, -90, 0]) {
                cylinder(d = hous_d1, h = 13);
                translate([0, 0, 13])
                    cylinder(d1 = hous_d1, d2 = hous_d2, h = 32);
                translate([0, 0, 45])
                    cylinder(d = hous_d2 + 3, h = 3.5);
                difference() {
                    translate([0, 0, 48])
                        cylinder(d = noz_d, h = noz_l);
                    translate([0, 0, 47])
                        cylinder(d = noz_hole, h = noz_l + 3);
                }
            }
    }
}

module grip() {
    rotate([90, 0, 0])
        hull() {
            translate([0, 0,  grip_l/2 - 1]) sphere(d = grip_d);
            translate([0, 0, -(grip_l/2 - 1)]) sphere(d = grip_d);
        }
}

module arm(len) {
    translate([-arm_sq/2, -arm_sq/2, 0])
        cube([arm_sq, arm_sq, len]);
    translate([0, 0, len])
        grip();
}

module handles() {
    translate([-12, 0, shaft_h + hous_d1/2 - 1]) {
        cube([16, 11, 9], center = true);
        rotate([90, 0, 0])
            cylinder(d = 9, h = 12, center = true);
        translate([4, 0, 3])
            rotate([0, -10, 0])
                arm(42);
        translate([-4, 0, 3])
            rotate([0, -50, 0])
                arm(80);
    }
}

module fittings() {
    // shaft
    translate([-40, 0, shaft_h])
        rotate([0, 90, 0])
            cylinder(d = shaft_d, h = wheel_x + 52);
    // wheel-side cap
    translate([wheel_x + ring_w/2 - 1, 0, shaft_h])
        rotate([0, 90, 0]) {
            cylinder(d = 17, h = 3.5);
            translate([0, 0, 3.5])
                cylinder(d = 11, h = 2);
        }
    // vertical rod in ring
    translate([wheel_x - 3, 0, shaft_h])
        cylinder(d = 3.4, h = ring_id/2 - 8);
    translate([wheel_x - 3, 0, shaft_h + ring_id/2 - 8])
        sphere(d = 4.2);
    // nozzle T-pin
    translate([-56, 0, shaft_h])
        rotate([90, 0, 0])
            hull() {
                translate([0, 0, 11]) sphere(d = 5.2);
                translate([0, 0, -11]) sphere(d = 5.2);
            }
    // side pin on cone
    translate([-34, 0, shaft_h - 4])
        rotate([-90, 0, 0]) {
            cylinder(d = 5.4, h = 14);
            translate([0, 0, 14])
                sphere(d = 5.4);
        }
}

union() {
    base();
    translate([wheel_x, 0, shaft_h]) {
        ring_gear();
        inner_gear();
    }
    housing();
    handles();
    fittings();
}