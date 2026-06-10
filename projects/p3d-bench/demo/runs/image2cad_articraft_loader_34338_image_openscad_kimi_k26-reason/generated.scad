// ============================================
// Front Loader / Wheel Loader
// Parametric OpenSCAD model
// ============================================

$fn = 60;

// --- Dimensions ---

// Wheels
wheel_diameter = 48;
wheel_width = 16;
wheel_bore = 8;
num_treads = 12;

// Vehicle track and wheelbase
track_width = 82;
wheelbase = 80;
wheel_center_z = wheel_diameter / 2;

// Main chassis block
chassis_length = 100;
chassis_width = 74;
chassis_height = 20;
chassis_z = 24; // center

// Rear engine housing
rear_length = 50;
rear_width = 72;
rear_height = 28;
rear_x = -35;
rear_z = 44;

// Front hood
hood_length = 40;
hood_width = 72;
hood_height = 18;
hood_x = 35;
hood_z = 40;

// Cab
cab_length = 36;
cab_width = 48;
cab_height = 30;
cab_x = 10;
cab_z = 55;

// Bucket
bucket_depth = 50;
bucket_back_width = 62;
bucket_front_width = 90;
bucket_back_height = 32;
bucket_front_height = 10;
bucket_bottom_z = 4;
bucket_x = 85;

// Lift arms
arm_start = [5, 26, 40];
arm_end = [60, 26, 28];
arm_size = [6, 6]; // width, height of beam cross-section

// Exhaust
exhaust_x = -25;
exhaust_y = 18;
exhaust_z = rear_z + rear_height/2;
exhaust_height = 15;
exhaust_dia = 5;

// ============================================
// Modules
// ============================================

// Beam between two 3D points with rectangular cross-section
module beam(p1, p2, size) {
    dir = p2 - p1;
    len = norm(dir);
    pitch = atan2(dir[2], sqrt(dir[0]*dir[0] + dir[1]*dir[1]));
    yaw = atan2(dir[1], dir[0]);
    
    translate(p1)
    rotate([0, -pitch, yaw])
    translate([0, -size[1]/2, -size[2]/2])
    cube([len, size[1], size[2]]);
}

// Wheel with knobby tread
module wheel(d, w, bore) {
    // Tire body
    cylinder(d=d, h=w*0.9, center=true);
    
    // Tread blocks arranged around circumference
    for (i = [0 : num_treads - 1]) {
        rotate([0, 0, i * 360 / num_treads])
        translate([d/2, 0, 0])
        rotate([0, 0, 45])
        cube([d*0.12, d*0.12, w*0.95], center=true);
    }
    
    // Hub
    cylinder(d=bore + 8, h=w + 1, center=true);
    // Hubcap
    cylinder(d=bore + 2, h=w + 3, center=true);
}

// Operator cab with window cutouts
module cab() {
    difference() {
        // Main cab volume
        translate([cab_x, 0, cab_z])
        cube([cab_length, cab_width, cab_height], center=true);
        
        // Front window
        translate([cab_x + cab_length/2 + 0.5, 0, cab_z + 2])
        cube([2, 24, 18], center=true);
        
        // Rear window
        translate([cab_x - cab_length/2 - 0.5, 0, cab_z + 2])
        cube([2, 24, 18], center=true);
        
        // Left window
        translate([cab_x, cab_width/2 + 0.5, cab_z + 2])
        cube([20, 2, 18], center=true);
        
        // Right window
        translate([cab_x, -cab_width/2 - 0.5, cab_z + 2])
        cube([20, 2, 18], center=true);
    }
    
    // Roof overhang
    translate([cab_x, 0, cab_z + cab_height/2 + 2])
    cube([cab_length + 4, cab_width + 4, 4], center=true);
    
    // Roof vent / beacon
    translate([cab_x, 0, cab_z + cab_height/2 + 5])
    cylinder(d=4, h=3);
}

// Main chassis and bodywork
module chassis() {
    // Central base plate
    translate([0, 0, chassis_z])
    cube([chassis_length, chassis_width, chassis_height], center=true);
    
    // Rear engine housing
    translate([rear_x, 0, rear_z])
    cube([rear_length, rear_width, rear_height], center=true);
    
    // Front hood / grille area
    translate([hood_x, 0, hood_z])
    cube([hood_length, hood_width, hood_height], center=true);
}

// Loader bucket (solid wedge / frustum)
module loader_bucket() {
    d = bucket_depth;
    bw = bucket_back_width;
    fw = bucket_front_width;
    bh = bucket_back_height;
    fh = bucket_front_height;
    bz = bucket_bottom_z;
    
    // Build a frustum using hull() of corner cubes
    hull() {
        // Back face corners
        translate([-d/2, -bw/2, bz]) cube([1,1,1]);
        translate([-d/2,  bw/2, bz]) cube([1,1,1]);
        translate([-d/2, -bw/2, bz + bh]) cube([1,1,1]);
        translate([-d/2,  bw/2, bz + bh]) cube([1,1,1]);
        
        // Front face corners
        translate([ d/2, -fw/2, bz]) cube([1,1,1]);
        translate([ d/2,  fw/2, bz]) cube([1,1,1]);
        translate([ d/2, -fw/2, bz + fh]) cube([1,1,1]);
        translate([ d/2,  fw/2, bz + fh]) cube([1,1,1]);
    }
}

// ============================================
// Main Assembly
// ============================================

union() {
    // --- Body and Cab ---
    chassis();
    cab();
    
    // --- Exhaust stack ---
    translate([exhaust_x, exhaust_y, exhaust_z])
    cylinder(d=exhaust_dia, h=exhaust_height);
    
    // --- Wheels ---
    // Front left
    translate([wheelbase/2, track_width/2, wheel_center_z])
    wheel(wheel_diameter, wheel_width, wheel_bore);
    // Front right
    translate([wheelbase/2, -track_width/2, wheel_center_z])
    wheel(wheel_diameter, wheel_width, wheel_bore);
    // Rear left
    translate([-wheelbase/2, track_width/2, wheel_center_z])
    wheel(wheel_diameter, wheel_width, wheel_bore);
    // Rear right
    translate([-wheelbase/2, -track_width/2, wheel_center_z])
    wheel(wheel_diameter, wheel_width, wheel_bore);
    
    // --- Axles ---
    // Front axle
    translate([wheelbase/2, 0, wheel_center_z])
    rotate([90, 0, 0])
    cylinder(d=8, h=track_width + wheel_width, center=true);
    // Rear axle
    translate([-wheelbase/2, 0, wheel_center_z])
    rotate([90, 0, 0])
    cylinder(d=8, h=track_width + wheel_width, center=true);
    
    // --- Lift Arms ---
    // Left arm
    beam(arm_start, arm_end, arm_size);
    // Right arm
    beam([arm_start[0], -arm_start[1], arm_start[2]],
         [arm_end[0], -arm_end[1], arm_end[2]],
         arm_size);
    
    // Cross-braces between arms (ladder rungs)
    translate([20, 0, 38])
    cube([4, 52, 4], center=true);
    translate([45, 0, 31])
    cube([4, 52, 4], center=true);
    
    // --- Bucket ---
    translate([bucket_x, 0, 0])
    loader_bucket();
}