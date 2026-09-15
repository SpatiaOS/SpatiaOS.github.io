// OpenSCAD parametric model
// Low rounded base, hollow stepped sleeve, stepped side arm, end opening, top rib

// Global settings
$fn = 96;
eps = 0.1;

// Base parameters
base_length = 130;
base_width = 70;
base_height = 12;
base_corner_radius = 5;
base_center_x = 25;

// Stepped circular collar under sleeve
step1_d = 58;
step1_h = 7;
step2_d = 46;
step2_h = 7;

// Sleeve parameters
sleeve_od = 36;
sleeve_id = 20;
sleeve_height = 74;

// Side arm parameters
arm_end_x = 64;              // center of rounded arm end
arm_width = 20;
arm_depth = 12;
arm_overlap = 7;             // penetration into sleeve wall for clean union
arm_end_radius = arm_width / 2;
arm_start_x = sleeve_od / 2 - arm_overlap;
arm_top_z = sleeve_height - eps;
arm_bottom_z = arm_top_z - arm_depth;

// Arm underside step
upper_tier_thickness = 6;
lower_cut_depth = arm_depth - upper_tier_thickness;
lower_cut_start_x = sleeve_od / 2 + 2;
lower_cut_end_x = arm_end_x + arm_end_radius + 1;

// Rounded end opening
end_opening_d = 7;

// Top triangular rib
rib_thickness = 2.5;
rib_height = 9;
rib_start_x = sleeve_od / 2 - 2;
rib_end_x = arm_end_x - end_opening_d / 2 - 2;
rib_length = rib_end_x - rib_start_x;


// Rounded rectangular base solid
module rounded_box(l, w, h, r) {
    translate([0, 0, h / 2])
        minkowski() {
            cube([l - 2 * r, w - 2 * r, h - 2 * r], center = true);
            sphere(r);
        }
}

// Two stacked circular steps around the sleeve
module stepped_collar(d1, h1, d2, h2) {
    cylinder(h = h1, d = d1);
    translate([0, 0, h1])
        cylinder(h = h2, d = d2);
}

// Plan shape of side arm: rectangular shank + rounded far end
module arm_profile() {
    union() {
        translate([arm_start_x, -arm_width / 2])
            square([arm_end_x - arm_start_x, arm_width]);

        translate([arm_end_x, 0])
            circle(r = arm_end_radius);
    }
}

// Extruded arm body
module arm_body() {
    linear_extrude(height = arm_depth)
        arm_profile();
}

// Thin triangular raised rib
module triangular_rib(length, height, thickness) {
    rotate([90, 0, 0])
        linear_extrude(height = thickness, center = true)
            polygon(points = [
                [0, 0],
                [length, 0],
                [length, height]
            ]);
}


// Final model
difference() {
    union() {
        // Low rounded base plate
        translate([base_center_x, 0, 0])
            rounded_box(base_length, base_width, base_height, base_corner_radius);

        // Stepped circular portions on base, around sleeve
        translate([0, 0, base_height - eps])
            stepped_collar(step1_d, step1_h + eps, step2_d, step2_h);

        // Tall sleeve outer body
        translate([0, 0, -eps])
            cylinder(h = sleeve_height + eps, d = sleeve_od);

        // Projecting side arm
        translate([0, 0, arm_bottom_z])
            arm_body();

        // Triangular rib on top, running from rounded end toward sleeve
        translate([rib_start_x, 0, arm_top_z - eps])
            triangular_rib(rib_length, rib_height, rib_thickness);
    }

    // Central through bore, continuing through base, steps, and sleeve
    translate([0, 0, -1])
        cylinder(h = sleeve_height + 2, d = sleeve_id);

    // Lower cutaway to create stepped underside of arm
    translate([
        lower_cut_start_x,
        -(arm_width / 2 + 1),
        arm_bottom_z - eps
    ])
        cube([
            lower_cut_end_x - lower_cut_start_x,
            arm_width + 2,
            lower_cut_depth + eps
        ]);

    // Real rounded opening in smaller rounded arm end
    translate([arm_end_x, 0, arm_bottom_z - 1])
        cylinder(h = arm_depth + 2, d = end_opening_d);
}