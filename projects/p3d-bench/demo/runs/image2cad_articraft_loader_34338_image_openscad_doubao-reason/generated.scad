// ==============================================
// Toy Front Loader / Bulldozer 3D Model
// All dimensions in millimeters
// ==============================================

// -------------------
// GLOBAL SETTINGS
// -------------------
$fn = 64; // Smoothness for curved surfaces

// -------------------
// PARAMETRIC DIMENSIONS
// -------------------
// Wheel specs
rear_wheel_dia = 50;
front_wheel_dia = 45;
wheel_thickness = 15;
tread_depth = 3;
tread_count = 12;
hub_recess_dia = 24;
hub_recess_depth = 4;

// Chassis specs
chassis_length = 100;
chassis_width = 70;
chassis_height = 20;
chassis_fillet = 2;

// Cab specs
cab_width = 45;
cab_depth = 40;
cab_height = 40;
cab_fillet = 3;
window_size = [12, 20];

// Exhaust specs
exhaust_dia = 6;
exhaust_height = 25;

// Loader arm specs
arm_thickness = 8;
arm_length = 60;
arm_spacing = 65;
arm_angle = 15; // tilt angle from horizontal

// Bucket specs
bucket_width = 90;
bucket_height = 40;
bucket_depth = 25;
bucket_wall = 3;
bucket_tilt = 30; // forward tilt angle

// -------------------
// HELPER MODULES
// -------------------
module rounded_box(w, d, h, r) {
    // Rounded edge 3D box using minkowski sum
    minkowski() {
        cube([w - 2*r, d - 2*r, h - 2*r], center=true);
        sphere(r=r);
    }
}

module wheel(dia, thickness, tread_depth, num_treads) {
    // Off-road wheel with deep treads and recessed hub
    difference() {
        union() {
            // Main tire body
            cylinder(h=thickness, d=dia, center=true);
            // Add chevron treads around circumference
            for (i = [0:num_treads-1]) {
                rotate([0, 0, i * 360/num_treads])
                translate([dia/2, 0, 0])
                rotate([0, 45, 0])
                cube([tread_depth, thickness*0.8, dia/8], center=true);
            }
        }
        // Cut recessed hubs on both sides
        for (side = [-1, 1]) {
            translate([0, 0, side*(thickness/2 - hub_recess_depth + 0.1)])
            cylinder(h=hub_recess_depth, d=hub_recess_dia, center=true);
            // Add small center hole detail
            translate([0, 0, side*(thickness/2 + 0.1)])
            cylinder(h=1, d=5, center=true);
        }
    }
}

module bucket(width, height, depth, wall_thickness, tilt_angle) {
    // Front loader bucket with hollow cavity
    rotate([0, tilt_angle, 0])
    difference() {
        // Outer bucket shell
        linear_extrude(width)
        polygon(points=[
            [0, 0], [depth, 0],
            [depth + height/2, height], [height/4, height]
        ]);
        // Cut inner cavity
        translate([wall_thickness, wall_thickness, wall_thickness])
        linear_extrude(width - 2*wall_thickness)
        polygon(points=[
            [0, 0], [depth - 2*wall_thickness, 0],
            [depth + height/2 - 2*wall_thickness, height - 2*wall_thickness],
            [height/4, height - 2*wall_thickness]
        ]);
    }
}

// -------------------
// MAIN ASSEMBLY
// -------------------
union() {
    // Base chassis
    translate([0, 0, chassis_height/2 + rear_wheel_dia/2])
    rounded_box(chassis_length, chassis_width, chassis_height, chassis_fillet);

    // Operator cab
    translate([chassis_length*0.2, 0, chassis_height + rear_wheel_dia/2 + cab_height/2])
    difference() {
        rounded_box(cab_depth, cab_width, cab_height, cab_fillet);
        // Cut side windows
        for (side = [-1, 1]) {
            translate([0, side*(cab_width/2 - 5), 0])
            cube([cab_depth*0.6, 10, window_size.y], center=true);
        }
        // Cut front window
        translate([cab_depth*0.3, 0, 0])
        cube([10, cab_width*0.6, window_size.y], center=true);
    }

    // Exhaust pipe
    translate([chassis_length*0.3, chassis_width*0.35, chassis_height + rear_wheel_dia/2 + exhaust_height/2])
    cylinder(h=exhaust_height, d=exhaust_dia, center=true);

    // Mount wheels
    wheel_x = chassis_length * 0.35;
    wheel_y = chassis_width/2 + wheel_thickness/2;
    wheel_z = rear_wheel_dia / 2;
    // Rear wheels (larger)
    for (side = [-1, 1]) {
        translate([wheel_x, side*wheel_y, wheel_z])
        wheel(rear_wheel_dia, wheel_thickness, tread_depth, tread_count);
    }
    // Front wheels (smaller)
    for (side = [-1, 1]) {
        translate([-wheel_x, side*wheel_y, wheel_z])
        wheel(front_wheel_dia, wheel_thickness, tread_depth, tread_count);
    }

    // Loader lifting arms
    for (side = [-1, 1]) {
        translate([-chassis_length/2 + 10, side*(arm_spacing/2), chassis_height + rear_wheel_dia/2 + 5])
        rotate([0, arm_angle, 0])
        cube([arm_length, arm_thickness, 10], center=true);
    }
    // Cross reinforcement bars between arms
    for (z = [5, 15, 25]) {
        translate([-chassis_length/2 + 20, 0, chassis_height + rear_wheel_dia/2 + z])
        rotate([0, arm_angle, 0])
        cylinder(h=arm_spacing, d=5, center=true);
    }

    // Front bucket
    translate([-chassis_length/2 - 15, 0, rear_wheel_dia/2 + 10])
    bucket(bucket_width, bucket_height, bucket_depth, bucket_wall, bucket_tilt);
}