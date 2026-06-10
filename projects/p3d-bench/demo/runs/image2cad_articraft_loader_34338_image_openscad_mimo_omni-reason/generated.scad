// Toy Front Loader - Parametric Model
// Estimated dimensions based on image proportions

// Global parameters
$fn = 100; // Smooth curves

// Main dimensions (in arbitrary units, scale as needed)
loader_length = 120;
loader_width = 60;
loader_height = 70;

// Wheel parameters
wheel_diameter = 30;
wheel_width = 15;
wheel_hub_diameter = 10;
wheel_hub_height = 8;
tread_depth = 3;
tread_width = 4;
num_treads = 12;
tread_angle = 45; // degrees

// Bucket parameters
bucket_width = 50;
bucket_height = 25;
bucket_depth = 20;
bucket_wall_thickness = 2;
cutting_edge_height = 5;

// Cab parameters
cab_width = 35;
cab_length = 30;
cab_height = 30;
cab_wall_thickness = 3;
window_width = 10;
window_height = 15;
roof_overhang = 3;

// Body parameters
body_width = 40;
body_length = 60;
body_height = 25;
engine_compartment_length = 25;
exhaust_diameter = 4;
exhaust_height = 15;

// Mechanical arm parameters
arm_width = 6;
arm_length = 40;
arm_height = 8;
pivot_diameter = 5;
pivot_height = 10;

// Helper module: create a wheel with treads
module wheel(d, w, hub_d, hub_h, tread_d, tread_w, num_treads, tread_angle) {
    // Main wheel cylinder
    cylinder(h=w, d=d, center=true);
    
    // Hub
    translate([0, 0, w/2 - hub_h/2])
        cylinder(h=hub_h, d=hub_d, center=true);
    
    // Treads
    for (i = [0:num_treads-1]) {
        rotate([0, 0, i * 360/num_treads])
            translate([d/2 - tread_d/2, 0, 0])
                rotate([tread_angle, 0, 0])
                    cube([tread_d, tread_w, w], center=true);
    }
}

// Helper module: create the loader bucket
module bucket(w, h, d, wall_t, edge_h) {
    // Main bucket body (trapezoidal shape)
    difference() {
        // Outer shell
        hull() {
            // Bottom face
            translate([0, 0, 0])
                cube([w, d, wall_t], center=true);
            // Top face (slightly smaller)
            translate([0, 0, h])
                cube([w - 2*wall_t, d - 2*wall_t, wall_t], center=true);
        }
        
        // Inner cavity
        translate([0, 0, wall_t])
            hull() {
                cube([w - 2*wall_t, d - 2*wall_t, 0.1], center=true);
                translate([0, 0, h - wall_t])
                    cube([w - 4*wall_t, d - 4*wall_t, 0.1], center=true);
            }
    }
    
    // Cutting edge (reinforced front edge)
    translate([0, -d/2 + wall_t/2, edge_h/2])
        cube([w, wall_t, edge_h], center=true);
}

// Helper module: create the loader cab
module cab(w, l, h, wall_t, win_w, win_h, roof_ov) {
    // Main cab structure
    difference() {
        // Outer shell
        cube([w, l, h], center=true);
        
        // Interior hollow
        translate([0, 0, wall_t])
            cube([w - 2*wall_t, l - 2*wall_t, h], center=true);
        
        // Front window
        translate([0, -l/2 + wall_t/2, h/4])
            cube([win_w, wall_t + 1, win_h], center=true);
        
        // Side windows
        for (side = [-1, 1]) {
            translate([side * (w/2 - wall_t/2), 0, h/4])
                cube([wall_t + 1, win_w, win_h], center=true);
        }
    }
    
    // Roof with overhang
    translate([0, 0, h/2 + roof_ov/2])
        cube([w + 2*roof_ov, l + 2*roof_ov, roof_ov], center=true);
    
    // Roof rounded edge (approximation)
    translate([0, 0, h/2 + roof_ov])
        rotate_extrude()
            translate([w/2 + roof_ov, 0, 0])
                circle(r=roof_ov/2);
}

// Helper module: create the mechanical arm
module arm(w, l, h, pivot_d, pivot_h) {
    // Main arm beam
    cube([w, l, h], center=true);
    
    // Pivot joints at both ends
    for (pos = [-1, 1]) {
        translate([0, pos * (l/2 - pivot_h/2), 0])
            cylinder(h=pivot_h, d=pivot_d, center=true);
    }
}

// Main loader assembly
module front_loader() {
    // Main body/chassis
    translate([0, 0, body_height/2]) {
        // Main body block
        cube([body_width, body_length, body_height], center=true);
        
        // Engine compartment (extended front)
        translate([0, -body_length/2 - engine_compartment_length/2, 0])
            cube([body_width, engine_compartment_length, body_height * 0.8], center=true);
        
        // Exhaust pipe
        translate([body_width/4, -body_length/2 - engine_compartment_length/2, body_height/2 + exhaust_height/2])
            cylinder(h=exhaust_height, d=exhaust_diameter, center=true);
    }
    
    // Cab (positioned on top of body)
    translate([0, body_length/4, body_height + cab_height/2])
        cab(cab_width, cab_length, cab_height, cab_wall_thickness, window_width, window_height, roof_overhang);
    
    // Wheels (4 wheels: 2 front, 2 rear)
    wheel_positions = [
        [body_width/2 + wheel_width/2, -body_length/4, wheel_diameter/2],   // Front right
        [-body_width/2 - wheel_width/2, -body_length/4, wheel_diameter/2],  // Front left
        [body_width/2 + wheel_width/2, body_length/4, wheel_diameter/2],    // Rear right
        [-body_width/2 - wheel_width/2, body_length/4, wheel_diameter/2]    // Rear left
    ];
    
    for (pos = wheel_positions) {
        translate(pos)
            rotate([90, 0, 0])
                wheel(wheel_diameter, wheel_width, wheel_hub_diameter, wheel_hub_height, 
                      tread_depth, tread_width, num_treads, tread_angle);
    }
    
    // Mechanical arms (connecting body to bucket)
    arm_positions = [
        [body_width/4, -body_length/2 - arm_length/2, body_height/2 + arm_height/2],
        [-body_width/4, -body_length/2 - arm_length/2, body_height/2 + arm_height/2]
    ];
    
    for (pos = arm_positions) {
        translate(pos)
            rotate([0, -15, 0]) // Slight downward angle
                arm(arm_width, arm_length, arm_height, pivot_diameter, pivot_height);
    }
    
    // Bucket (attached to arms)
    translate([0, -body_length/2 - arm_length - bucket_depth/2, body_height/2 + arm_height/2])
        bucket(bucket_width, bucket_height, bucket_depth, bucket_wall_thickness, cutting_edge_height);
}

// Render the complete model
front_loader();