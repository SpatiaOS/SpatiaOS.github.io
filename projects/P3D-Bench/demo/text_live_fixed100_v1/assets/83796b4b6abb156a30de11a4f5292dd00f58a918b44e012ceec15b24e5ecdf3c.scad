// Parameters — millimeters
base_diameter = 52;
base_height = 8;

shoulder_diameter = 46;
shoulder_height = 6;

sleeve_outer_diameter = 40;
sleeve_height = 42;
bore_diameter = 24;

arm_length = 64;              // Sleeve axis to rounded-end axis
arm_root_width = 28;
arm_end_diameter = 24;
arm_height = 14;
cutaway_start = 34;            // Distance from sleeve axis
cutaway_height = 7;

end_hole_diameter = 14;

rib_thickness = 4;
rib_height = 32;
rib_sleeve_overlap = 2;
rib_hole_clearance = 3;

epsilon = 0.05;
$fn = 100;

// Derived dimensions
shoulder_z = base_height;
sleeve_z = base_height + shoulder_height;
total_height = sleeve_z + sleeve_height;
rib_root_x = sleeve_outer_diameter / 2 - rib_sleeve_overlap;
rib_tip_x = arm_length - end_hole_diameter / 2 - rib_hole_clearance;
cutaway_end = arm_length + arm_end_diameter / 2 + epsilon;
cutaway_width = max(arm_root_width, arm_end_diameter) + 2 * epsilon;

// Parameter checks
assert(bore_diameter < min(base_diameter,
                          shoulder_diameter,
                          sleeve_outer_diameter));
assert(end_hole_diameter < arm_end_diameter);
assert(cutaway_height > 0 && cutaway_height < arm_height);
assert(cutaway_start > base_diameter / 2);
assert(rib_tip_x > rib_root_x);
assert(arm_height + rib_height <= total_height);

// Stepped circular body
module stepped_upright() {
    union() {
        cylinder(d = base_diameter, h = base_height);

        translate([0, 0, shoulder_z - epsilon])
            cylinder(d = shoulder_diameter,
                     h = shoulder_height + epsilon);

        translate([0, 0, sleeve_z - epsilon])
            cylinder(d = sleeve_outer_diameter,
                     h = sleeve_height + epsilon);
    }
}

// Rounded arm outline
module arm_profile() {
    hull() {
        circle(d = arm_root_width);
        translate([arm_length, 0])
            circle(d = arm_end_diameter);
    }
}

// Raised outer tier from underside cutaway
module stepped_arm() {
    difference() {
        linear_extrude(height = arm_height)
            arm_profile();

        translate([cutaway_start, -cutaway_width / 2, -epsilon])
            cube([cutaway_end - cutaway_start,
                  cutaway_width,
                  cutaway_height + epsilon]);
    }
}

// Thin triangular web, embedded into arm and sleeve
module triangular_rib() {
    translate([0, 0, arm_height - epsilon])
        rotate([90, 0, 0])
            linear_extrude(height = rib_thickness, center = true)
                polygon(points = [
                    [rib_root_x, 0],
                    [rib_tip_x, 0],
                    [rib_root_x, rib_height + epsilon]
                ]);
}

// Full-depth circular openings
module through_openings() {
    translate([0, 0, -epsilon])
        cylinder(d = bore_diameter,
                 h = total_height + 2 * epsilon);

    translate([arm_length, 0, -epsilon])
        cylinder(d = end_hole_diameter,
                 h = total_height + 2 * epsilon);
}

// Main model
difference() {
    union() {
        stepped_upright();
        stepped_arm();
        triangular_rib();
    }
    through_openings();
}