// ==========================================
// Parametric Tractor with Front Loader
// ==========================================

/* [Global Resolution] */
$fn = 60;
eps = 0.05; // Small epsilon for clean boolean operations

/* [Dimensions - Main Body] */
body_length = 90;
body_width = 40;
body_height = 25;
hood_length = 45;
hood_height = 20;

/* [Dimensions - Wheels] */
wheel_base = 55;
track_width = 55;
rear_wheel_dia = 36;
rear_wheel_width = 14;
front_wheel_dia = 30;
front_wheel_width = 12;
tread_count = 16;
tread_thickness = 2;

/* [Dimensions - Cabin] */
cab_length = 30;
cab_width = 36;
cab_height = 30;
window_thickness = 4;

/* [Dimensions - Loader Arms & Bucket] */
arm_thickness = 5;
arm_width = 8;
bucket_width = 50;
bucket_depth = 25;
bucket_height = 25;

// ==========================================
// Helper Modules
// ==========================================

// A single wheel with chevron tractor treads and recessed hub
module tractor_wheel(dia, width) {
    r = dia / 2;
    hub_r = r * 0.5;
    
    union() {
        difference() {
            // Main tire body
            cylinder(d=dia, h=width, center=true);
            
            // Outer recess
            translate([0, 0, width/2 - 2 + eps])
                cylinder(r=r*0.75, h=4, center=true);
            
            // Inner recess
            translate([0, 0, -(width/2 - 2 + eps)])
                cylinder(r=r*0.75, h=4, center=true);
                
            // Axle hole
            cylinder(d=4, h=width+2, center=true);
        }
        
        // Center hub detail
        cylinder(r=hub_r, h=width - 1, center=true);
        cylinder(d=6, h=width + 1, center=true); // Axle cap
        
        // Chevron Treads
        for(i = [0 : tread_count - 1]) {
            rotate([0, 0, i * (360 / tread_count)]) {
                // Right side of chevron
                translate([r - 1, 0, width/4])
                    rotate([0, 30, 0])
                    cube([tread_thickness+1, tread_thickness, width/2], center=true);
                // Left side of chevron
                translate([r - 1, 0, -width/4])
                    rotate([0, -30, 0])
                    cube([tread_thickness+1, tread_thickness, width/2], center=true);
            }
        }
    }
}

// The main chassis, fenders, and hood
module chassis() {
    union() {
        // Rear flat bed / base platform
        translate([0, 0, body_height/2])
            cube([body_length, body_width, body_height], center=true);
            
        // Side fenders (rear)
        translate([-body_length/2 + 15, 0, body_height/2 + 2])
            cube([30, track_width + 5, body_height - 4], center=true);
            
        // Front Hood (sloped)
        translate([body_length/2 - hood_length/2, 0, body_height + hood_height/2]) {
            difference() {
                // Base block for hood
                cube([hood_length, body_width - 6, hood_height], center=true);
                // Slope cutout
                translate([10, 0, 5])
                    rotate([0, 15, 0])
                    cube([hood_length, body_width, hood_height+10], center=true);
            }
        }
        
        // Side mounting blocks for loader arms
        translate([10, 0, body_height + 5])
            cube([20, body_width + 4, 15], center=true);
            
        // Exhaust pipe
        translate([-10, body_width/2 - 5, body_height]) {
            cylinder(d=6, h=30);
            translate([0, 0, 30]) cylinder(d=8, h=5);
        }
    }
}

// The driver's cabin with windows
module cabin() {
    union() {
        difference() {
            // Main cabin block
            translate([0, 0, cab_height/2])
                cube([cab_length, cab_width, cab_height], center=true);
                
            // Side windows cutout
            translate([0, 0, cab_height/2 + 2])
                cube([cab_length - window_thickness*2, cab_width + 2, cab_height - window_thickness*2], center=true);
                
            // Front/Rear windows cutout
            translate([0, 0, cab_height/2 + 2])
                cube([cab_length + 2, cab_width - window_thickness*2, cab_height - window_thickness*2], center=true);
        }
        
        // Roof
        translate([0, 0, cab_height]) {
            hull() {
                translate([0, 0, 2])
                    cube([cab_length + 4, cab_width + 4, 2], center=true);
                translate([0, 0, 0])
                    cube([cab_length + 2, cab_width + 2, 2], center=true);
            }
        }
    }
}

// Front loader arms and crossbars
module loader_arms() {
    arm_x1 = 15;
    arm_z1 = body_height + 10;
    
    arm_x2 = 45;
    arm_z2 = body_height + 20;
    
    arm_x3 = 85;
    arm_z3 = 10;
    
    // Single arm profile
    module single_arm() {
        hull() {
            translate([arm_x1, 0, arm_z1]) rotate([90, 0, 0]) cylinder(d=arm_width, h=arm_thickness, center=true);
            translate([arm_x2, 0, arm_z2]) rotate([90, 0, 0]) cylinder(d=arm_width, h=arm_thickness, center=true);
        }
        hull() {
            translate([arm_x2, 0, arm_z2]) rotate([90, 0, 0]) cylinder(d=arm_width, h=arm_thickness, center=true);
            translate([arm_x3, 0, arm_z3]) rotate([90, 0, 0]) cylinder(d=arm_width, h=arm_thickness, center=true);
        }
        // Pivot pins details
        translate([arm_x1, 0, arm_z1]) rotate([90, 0, 0]) cylinder(d=arm_width*0.6, h=arm_thickness+2, center=true);
        translate([arm_x2, 0, arm_z2]) rotate([90, 0, 0]) cylinder(d=arm_width*0.6, h=arm_thickness+2, center=true);
        translate([arm_x3, 0, arm_z3]) rotate([90, 0, 0]) cylinder(d=arm_width*0.6, h=arm_thickness+2, center=true);
    }
    
    // Left and Right Arms
    translate([0, body_width/2 + arm_thickness/2 + 2, 0]) single_arm();
    translate([0, -(body_width/2 + arm_thickness/2 + 2), 0]) single_arm();
    
    // Crossbars
    translate([arm_x2 - 5, 0, arm_z2 - 2])
        rotate([90, 0, 0]) cylinder(d=4, h=body_width + 4, center=true);
        
    translate([(arm_x2+arm_x3)/2 - 5, 0, (arm_z2+arm_z3)/2])
        rotate([90, 0, 0]) cylinder(d=4, h=body_width + 4, center=true);
        
    // Ladder detail on the hood (between arms)
    for(i=[0:2]) {
        translate([25 + i*8, 0, body_height + 12])
            cube([2, 20, 2], center=true);
    }
}

// Front bucket/scoop
module bucket() {
    // 2D Profile of the bucket
    points = [
        [0, 0], 
        [bucket_depth, 0], 
        [bucket_depth + 5, bucket_height], 
        [0, bucket_height]
    ];
    
    inner_points = [
        [2, 2], 
        [bucket_depth - 1, 2], 
        [bucket_depth + 4, bucket_height + 1], 
        [2, bucket_height + 1]
    ];

    translate([82, 0, 0]) {
        difference() {
            // Outer shell
            rotate([90, 0, 90])
                linear_extrude(bucket_width, center=true)
                polygon(points);
                
            // Inner hollow
            rotate([90, 0, 90])
                linear_extrude(bucket_width - 4, center=true)
                polygon(inner_points);
                
            // Detail holes in back plate
            translate([0, bucket_width/4, bucket_height - 5])
                rotate([0, 90, 0]) cylinder(d=3, h=10, center=true);
            translate([0, -bucket_width/4, bucket_height - 5])
                rotate([0, 90, 0]) cylinder(d=3, h=10, center=true);
        }
    }
}

// ==========================================
// Main Assembly
// ==========================================

module tractor_assembly() {
    // 1. Chassis
    translate([0, 0, rear_wheel_dia/2 - 5])
        chassis();
        
    // 2. Cabin
    translate([-body_length/2 + cab_length/2 + 5, 0, rear_wheel_dia/2 - 5 + body_height])
        cabin();
        
    // 3. Wheels
    // Rear Left
    translate([-body_length/2 + 15, track_width/2, rear_wheel_dia/2])
        rotate([90, 0, 0])
        tractor_wheel(rear_wheel_dia, rear_wheel_width);
        
    // Rear Right
    translate([-body_length/2 + 15, -track_width/2, rear_wheel_dia/2])
        rotate([90, 0, 0])
        tractor_wheel(rear_wheel_dia, rear_wheel_width);
        
    // Front Left
    translate([-body_length/2 + 15 + wheel_base, track_width/2, front_wheel_dia/2])
        rotate([90, 0, 0])
        tractor_wheel(front_wheel_dia, front_wheel_width);
        
    // Front Right
    translate([-body_length/2 + 15 + wheel_base, -track_width/2, front_wheel_dia/2])
        rotate([90, 0, 0])
        tractor_wheel(front_wheel_dia, front_wheel_width);
        
    // 4. Loader Arms
    translate([-20, 0, rear_wheel_dia/2 - 5])
        loader_arms();
        
    // 5. Bucket
    translate([-20, 0, rear_wheel_dia/2 - 5])
        bucket();
}

// Render the final model
tractor_assembly();