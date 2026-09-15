// Parametric dimensions (in millimeters)
base_d = 50;
base_h = 8;
sleeve_od = 32;
sleeve_id = 18;
sleeve_h = 50;
arm_length = 60;
arm_end_d = 22;
arm_hole_d = 11;
arm_h = 16;
step_h = 8;
step_x = 25;
rib_t = 4;
rib_top_h = 42;

$fn = 100;

// Base section
module base_section() {
    cylinder(h = base_h, d = base_d);
}

// Tall sleeve solid
module sleeve_solid() {
    cylinder(h = sleeve_h, d = sleeve_od);
}

// Projecting arm solid
module arm_solid() {
    hull() {
        cylinder(h = arm_h, d = sleeve_od);
        translate([arm_length, 0, 0])
            cylinder(h = arm_h, d = arm_end_d);
    }
}

// Triangular stiffening rib
module triangular_rib() {
    rotate([90, 0, 0])
        linear_extrude(height = rib_t, center = true)
            polygon(points = [
                [sleeve_id / 2 + 1, arm_h - 1],
                [sleeve_id / 2 + 1, rib_top_h],
                [sleeve_od / 2, rib_top_h],
                [arm_length - arm_hole_d / 2, arm_h],
                [arm_length - arm_hole_d / 2, arm_h - 1]
            ]);
}

// Stepped underside cutaway
module underside_cutaway() {
    cut_length = arm_length + arm_end_d - step_x + 5;
    cut_width = sleeve_od * 2;
    translate([step_x, -cut_width / 2, -1])
        cube([cut_length, cut_width, step_h + 1]);
}

// Central bore
module central_bore() {
    translate([0, 0, -1])
        cylinder(h = sleeve_h + 2, d = sleeve_id);
}

// Arm end opening
module arm_opening() {
    translate([arm_length, 0, -1])
        cylinder(h = arm_h + 2, d = arm_hole_d);
}

// Main model
difference() {
    union() {
        base_section();
        sleeve_solid();
        arm_solid();
        triangular_rib();
    }
    underside_cutaway();
    central_bore();
    arm_opening();
}