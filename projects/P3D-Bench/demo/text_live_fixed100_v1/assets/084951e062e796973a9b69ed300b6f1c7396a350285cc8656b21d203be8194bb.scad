// Parameters
$fn = 72;

bore_d = 10;

base_d = 32;
base_h = 4.5;
base_round = 1.2;

step_d = 22;
step_h = 9;

sleeve_od = 18;
sleeve_h = 30;

arm_reach = 36;
arm_w = 12;
arm_h = 9;
arm_outer_h = 5.5;
arm_step_x = 18;
arm_hole_d = 5;

rib_t = 1.6;
rib_h = 5.5;
rib_end_x = 30;

eps = 0.05;

// Low rounded base (circular flange, filleted top rim)
module rounded_base() {
    hull() {
        cylinder(d = base_d, h = max(base_h - base_round, 0.02));
        translate([0, 0, base_h - base_round])
            rotate_extrude(convexity = 4)
                translate([base_d / 2 - base_round, 0])
                    circle(r = base_round);
    }
}

// Intermediate circular step
module circular_step() {
    cylinder(d = step_d, h = step_h);
}

// Tall annular sleeve body (bore subtracted later)
module sleeve_body() {
    cylinder(d = sleeve_od, h = sleeve_h);
}

// Projecting side arm with rounded end (full inner depth)
module arm_body() {
    hull() {
        translate([0, -arm_w / 2, 0])
            cube([arm_reach, arm_w, arm_h]);
        translate([arm_reach, 0, 0])
            cylinder(d = arm_w, h = arm_h);
    }
}

// Thin triangular rib (raised web on top of the arm)
module top_rib() {
    translate([0, 0, arm_h])
        rotate([90, 0, 0])
            linear_extrude(height = rib_t, center = true)
                polygon([
                    [sleeve_od / 2 - 1, 0],
                    [rib_end_x, 0],
                    [sleeve_od / 2 - 1, rib_h]
                ]);
}

// Assembly
difference() {
    union() {
        rounded_base();
        circular_step();
        sleeve_body();
        arm_body();
        top_rib();
    }

    // Through-bore of the stepped circular stack
    translate([0, 0, -eps])
        cylinder(d = bore_d, h = sleeve_h + 2 * eps);

    // Rounded opening at the smaller arm end
    translate([arm_reach, 0, -eps])
        cylinder(d = arm_hole_d, h = arm_h + 2 * eps);

    // Lower cutaway: outer arm sits on a higher tier
    translate([arm_step_x, -arm_w, -eps])
        cube([arm_reach + arm_w, arm_w * 2, arm_h - arm_outer_h + eps]);
}