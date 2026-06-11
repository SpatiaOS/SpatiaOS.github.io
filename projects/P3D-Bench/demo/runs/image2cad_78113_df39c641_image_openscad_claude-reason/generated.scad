// Cafe Racer Motorcycle - Simplified Model
// Inspired by classic vintage cafe racer styling
// Approximate scale: 1:10

$fn = 60;

// === Global Parameters ===
wheelbase = 140;        // distance between wheel centers
wheel_radius = 27;      // outer radius of tire
wheel_width = 12;       // tire width
rim_radius = 19;        // inner rim radius
tire_thickness = 8;     // tire cross-section radius
spoke_count = 16;       // number of spokes per wheel
axle_height = 30;       // height of axles from ground

// Frame
frame_tube_r = 2.5;     // frame tube radius
steering_angle = 25;    // steering head angle from vertical

// Engine
engine_width = 40;
engine_height = 35;
engine_depth = 30;

// Tank
tank_length = 55;
tank_width = 28;
tank_height = 20;

// Seat
seat_length = 35;
seat_width = 22;
seat_height = 5;

// Forks
fork_tube_r = 2;
fork_length = 55;
fork_offset = 5;

// Fender
fender_coverage = 120;  // degrees of wheel coverage

// Exhaust
exhaust_r = 2.5;
muffler_r = 4;
muffler_length = 25;

// === Helper Modules ===

// Torus for tire shape
module torus(R, r) {
    rotate_extrude(convexity=4)
        translate([R, 0, 0])
            circle(r=r);
}

// Spoked wheel with tire, rim, hub
module wheel() {
    rotate([90, 0, 0]) {
        // Tire
        color([0.3, 0.3, 0.3])
            torus(wheel_radius - tire_thickness/2, tire_thickness/2);
        
        // Rim - outer ring
        color([0.7, 0.7, 0.7])
            torus(rim_radius, 1.5);
        
        // Hub
        color([0.6, 0.6, 0.6])
            cylinder(h=wheel_width*0.6, r=4, center=true);
        
        // Hub flanges
        for (side = [-1, 1])
            translate([0, 0, side * 3])
                color([0.6, 0.6, 0.6])
                    cylinder(h=1, r=5.5, center=true);
        
        // Spokes
        color([0.75, 0.75, 0.75])
        for (i = [0:spoke_count-1]) {
            angle = i * 360 / spoke_count;
            offset_z = (i % 2 == 0) ? 2.5 : -2.5;
            rotate([0, 0, angle])
                translate([0, 0, offset_z])
                    rotate([0, 90, 0])
                        // Spoke from hub to rim
                        hull() {
                            cylinder(h=0.1, r=0.3);
                            translate([0, 0, rim_radius - 4])
                                cylinder(h=0.1, r=0.3);
                        }
        }
        
        // Brake drum
        translate([0, 0, wheel_width*0.3])
            color([0.55, 0.55, 0.55])
                cylinder(h=2, r=8, center=true);
    }
}

// Front fender
module front_fender() {
    color([0.7, 0.7, 0.7])
    rotate([90, 0, 0])
    difference() {
        // Outer shell
        rotate_extrude(angle=fender_coverage, convexity=4, $fn=80)
            translate([wheel_radius - 1, 0, 0])
                square([3, wheel_width + 4], center=true);
        // Hollow inside
        rotate_extrude(angle=fender_coverage + 1, convexity=4, $fn=80)
            translate([wheel_radius - 1, 0, 0])
                square([1.5, wheel_width + 2], center=true);
    }
}

// Rear fender
module rear_fender() {
    color([0.7, 0.7, 0.7])
    rotate([90, 0, 0])
    difference() {
        rotate([0, 0, -30])
        rotate_extrude(angle=140, convexity=4, $fn=80)
            translate([wheel_radius - 1, 0, 0])
                square([3, wheel_width + 4], center=true);
        rotate([0, 0, -31])
        rotate_extrude(angle=142, convexity=4, $fn=80)
            translate([wheel_radius - 1, 0, 0])
                square([1.5, wheel_width + 2], center=true);
    }
}

// Fork leg
module fork_leg(length) {
    color([0.75, 0.72, 0.4]) // gold fork tubes
    cylinder(h=length*0.6, r=fork_tube_r, $fn=30);
    
    translate([0, 0, length*0.6])
        color([0.5, 0.5, 0.5])
            cylinder(h=length*0.4, r=fork_tube_r + 0.5, $fn=30);
}

// Front fork assembly
module front_forks() {
    fork_spread = wheel_width/2 + 1;
    
    for (side = [-1, 1]) {
        translate([0, side * fork_spread, 0])
            fork_leg(fork_length);
    }
    
    // Triple clamp - lower
    translate([0, 0, fork_length * 0.55])
        color([0.5, 0.5, 0.5])
            rotate([90, 0, 0])
                cylinder(h=fork_spread*2 + 4, r=3, center=true, $fn=20);
    
    // Triple clamp - upper
    translate([0, 0, fork_length * 0.85])
        color([0.5, 0.5, 0.5])
            rotate([90, 0, 0])
                cylinder(h=fork_spread*2 + 2, r=2.5, center=true, $fn=20);
    
    // Steering stem
    translate([0, 0, fork_length * 0.5])
        color([0.5, 0.5, 0.5])
            cylinder(h=fork_length*0.45, r=2, $fn=20);
}

// Handlebar
module handlebars() {
    bar_width = 30;
    color([0.45, 0.45, 0.45]) {
        // Main bar
        rotate([90, 0, 0])
            cylinder(h=bar_width, r=1.2, center=true, $fn=20);
        
        // Grips
        for (side = [-1, 1]) {
            translate([0, side * bar_width/2, 0])
                rotate([90, 0, 0])
                    cylinder(h=6, r=2, center=true, $fn=20);
        }
        
        // Clamp
        cylinder(h=3, r=3, center=true, $fn=20);
    }
    
    // Headlight
    translate([5, 0, -3])
        color([0.65, 0.65, 0.65])
            scale([0.7, 1, 0.8])
                sphere(r=6, $fn=40);
}

// Engine block
module engine() {
    // Main crankcase
    color([0.45, 0.45, 0.45])
    translate([0, 0, 0])
        hull() {
            translate([0, 0, -5])
                cube([engine_depth*0.8, engine_width*0.7, 2], center=true);
            translate([0, 0, engine_height*0.3])
                cube([engine_depth*0.9, engine_width*0.6, 2], center=true);
        }
    
    // Cylinder block
    color([0.4, 0.4, 0.4])
    translate([-2, 0, engine_height*0.3]) {
        hull() {
            cube([engine_depth*0.6, engine_width*0.55, 2], center=true);
            translate([0, 0, engine_height*0.4])
                cube([engine_depth*0.5, engine_width*0.5, 2], center=true);
        }
    }
    
    // Cylinder head
    color([0.5, 0.5, 0.5])
    translate([-2, 0, engine_height*0.7])
        cube([engine_depth*0.55, engine_width*0.55, engine_height*0.15], center=true);
    
    // Cooling fins on cylinder
    color([0.42, 0.42, 0.42])
    for (i = [0:6]) {
        translate([-2, 0, engine_height*0.3 + i*3])
            cube([engine_depth*0.7 + i*0.3, engine_width*0.6, 1], center=true);
    }
    
    // Alternator cover (left side)
    translate([0, -engine_width*0.35, 0])
        color([0.5, 0.5, 0.5])
            rotate([90, 0, 0])
                cylinder(h=3, r=8, center=true, $fn=40);
    
    // Clutch cover (right side)
    translate([2, engine_width*0.35, 3])
        color([0.5, 0.5, 0.5])
            rotate([90, 0, 0])
                cylinder(h=3, r=9, center=true, $fn=40);
    
    // Sump / oil pan
    color([0.4, 0.4, 0.4])
    translate([0, 0, -8])
        cube([engine_depth*0.6, engine_width*0.5, 6], center=true);
}

// Fuel tank
module fuel_tank() {
    color([0.65, 0.65, 0.65]) {
        // Main tank body - sculpted shape
        hull() {
            translate([-tank_length*0.35, 0, 0])
                scale([1, 1, 0.7])
                    rotate([90, 0, 0])
                        cylinder(h=tank_width*0.7, r=tank_height*0.45, center=true, $fn=40);
            translate([tank_length*0.35, 0, -2])
                scale([1, 1, 0.6])
                    rotate([90, 0, 0])
                        cylinder(h=tank_width*0.85, r=tank_height*0.5, center=true, $fn=40);
        }
        
        // Tank knee indents (subtle)
        difference() {
            hull() {
                translate([-tank_length*0.35, 0, 0])
                    scale([1, 1, 0.7])
                        rotate([90, 0, 0])
                            cylinder(h=tank_width*0.72, r=tank_height*0.46, center=true, $fn=40);
                translate([tank_length*0.35, 0, -2])
                    scale([1, 1, 0.6])
                        rotate([90, 0, 0])
                            cylinder(h=tank_width*0.87, r=tank_height*0.51, center=true, $fn=40);
            }
            // Knee cutouts
            for (side = [-1, 1])
                translate([0, side*tank_width*0.38, -2])
                    scale([2.5, 1, 1.3])
                        sphere(r=6, $fn=30);
        }
    }
    
    // Fuel cap
    translate([5, 0, tank_height*0.35])
        color([0.5, 0.5, 0.5]) {
            cylinder(h=2, r=4, $fn=30);
            translate([0, 0, 2])
                cylinder(h=1, r=3, $fn=30);
        }
}

// Seat
module seat() {
    color([0.3, 0.3, 0.3]) {
        // Seat pad - cafe racer flat style
        hull() {
            translate([-seat_length*0.4, 0, 0])
                scale([1, 1, 0.5])
                    rotate([90, 0, 0])
                        cylinder(h=seat_width, r=seat_height*0.8, center=true, $fn=30);
            translate([seat_length*0.4, 0, -1])
                scale([1, 1, 0.4])
                    rotate([90, 0, 0])
                        cylinder(h=seat_width*0.7, r=seat_height*0.6, center=true, $fn=30);
        }
        
        // Seat base/pan
        translate([0, 0, -3])
            hull() {
                translate([-seat_length*0.4, 0, 0])
                    cube([3, seat_width, 2], center=true);
                translate([seat_length*0.4, 0, 0])
                    cube([3, seat_width*0.6, 2], center=true);
            }
    }
}

// Exhaust system
module exhaust_system() {
    color([0.6, 0.6, 0.6]) {
        // Header pipes (2 into 1 style)
        // Pipe 1 - from cylinder
        translate([0, 0, 0])
        rotate([90, 0, 0])
        translate([0, 0, -engine_width*0.3]) {
            // Down pipe
            rotate([0, 20, 0])
                cylinder(h=20, r=exhaust_r, $fn=20);
        }
        
        // Main exhaust run along bottom
        translate([0, -engine_width*0.3, -15])
        rotate([0, -85, 0])
            cylinder(h=100, r=exhaust_r, $fn=20);
        
        // Muffler
        translate([85, -engine_width*0.3, -12])
        rotate([0, 5, 0]) {
            // Muffler body
            color([0.55, 0.55, 0.55])
                cylinder(h=muffler_length, r=muffler_r, $fn=30);
            // End cap
            translate([0, 0, muffler_length])
                color([0.5, 0.5, 0.5])
                    cylinder(h=2, r=muffler_r + 0.5, $fn=30);
            // Tip
            translate([0, 0, muffler_length + 2])
                color([0.5, 0.5, 0.5])
                    cylinder(h=3, r1=muffler_r, r2=muffler_r - 1, $fn=30);
        }
    }
}

// Swingarm
module swingarm() {
    arm_length = 50;
    color([0.5, 0.5, 0.5]) {
        for (side = [-1, 1]) {
            translate([0, side * 8, 0])
                rotate([0, -10, 0])
                    cylinder(h=arm_length, r=2, $fn=20);
        }
        // Pivot
        rotate([90, 0, 0])
            cylinder(h=20, r=3, center=true, $fn=20);
    }
}

// Rear shock absorbers
module rear_shocks() {
    color([0.7, 0.65, 0.3]) {
        for (side = [-1, 1]) {
            translate([0, side * 10, 0]) {
                // Spring
                cylinder(h=30, r=2.5, $fn=20);
                // Upper mount
                translate([0, 0, 30])
                    sphere(r=2.5, $fn=20);
                // Lower mount
                sphere(r=2.5, $fn=20);
                // Shaft
                color([0.5, 0.5, 0.5])
                    cylinder(h=35, r=1, $fn=15);
            }
        }
    }
}

// Frame tubes
module frame_tube(p1, p2, r=frame_tube_r) {
    // Draw a tube between two points
    v = p2 - p1;
    length = norm(v);
    
    if (length > 0) {
        // Calculate rotation to align z-axis with vector
        b = acos(v[2] / length);
        c = atan2(v[1], v[0]);
        
        translate(p1)
            rotate([0, 0, c])
                rotate([0, b, 0])
                    cylinder(h=length, r=r, $fn=16);
    }
}

// Main frame
module frame() {
    color([0.5, 0.5, 0.5]) {
        // Steering head position
        sh = [10, 0, axle_height + 40]; // steering head top
        sb = [0, 0, axle_height + 10];  // steering head bottom
        
        // Top tube - steering head to seat area
        frame_tube(sh, [95, 0, axle_height + 42]);
        
        // Seat stays
        frame_tube([95, 0, axle_height + 42], [wheelbase + 5, 0, axle_height + 5]);
        
        // Down tube - steering head to engine area
        frame_tube(sb, [40, 0, axle_height - 18]);
        
        // Lower cradle
        frame_tube([40, 0, axle_height - 18], [85, 0, axle_height - 18]);
        
        // Rear lower
        frame_tube([85, 0, axle_height - 18], [wheelbase + 5, 0, axle_height + 5]);
        
        // Engine mount vertical
        frame_tube([55, 0, axle_height - 18], [55, 0, axle_height + 20]);
        
        // Cross brace
        frame_tube([55, 0, axle_height + 20], [85, 0, axle_height + 38]);
        
        // Sub-frame for seat (both sides)
        for (side = [-1, 1]) {
            frame_tube([85, side*5, axle_height + 38], [wheelbase + 10, side*5, axle_height + 25], 1.5);
        }
    }
}

// Foot pegs
module foot_pegs() {
    color([0.4, 0.4, 0.4])
    for (side = [-1, 1]) {
        translate([65, side * 20, axle_height - 20]) {
            rotate([90, 0, 0])
                cylinder(h=5*side, r=1.2, $fn=15);
            translate([0, side*5, 0])
                rotate([90, 0, 0])
                    cylinder(h=1, r=2, $fn=15);
        }
    }
}

// Kickstand
module kickstand() {
    color([0.4, 0.4, 0.4])
    translate([55, -15, axle_height - 18])
        rotate([5, 25, 0])
            cylinder(h=28, r=1.2, $fn=15);
}

// === Main Assembly ===

// Ground reference: wheels sit on z=0 plane

// Front wheel
translate([0, 0, axle_height])
    wheel();

// Rear wheel  
translate([wheelbase, 0, axle_height])
    wheel();

// Front forks
translate([0, 0, axle_height])
    rotate([0, -steering_angle, 0])
        translate([0, 0, -3])
            front_forks();

// Handlebars
translate([0, 0, axle_height])
    rotate([0, -steering_angle, 0])
        translate([0, 0, fork_length * 0.92])
            handlebars();

// Front fender
translate([0, 0, axle_height])
    rotate([0, -40, 0])
        front_fender();

// Rear fender
translate([wheelbase, 0, axle_height])
    rotate([0, -50, 0])
        rear_fender();

// Frame
frame();

// Engine
translate([50, 0, axle_height + 5])
    engine();

// Fuel tank
translate([50, 0, axle_height + 42])
    fuel_tank();

// Seat
translate([105, 0, axle_height + 38])
    seat();

// Exhaust
translate([30, 0, axle_height + 10])
    exhaust_system();

// Swingarm
translate([95, 0, axle_height + 5])
    rotate([0, 0, 0])
        swingarm();

// Rear shocks
translate([105, 0, axle_height + 5])
    rotate([0, -15, 0])
        rear_shocks();

// Foot pegs
foot_pegs();

// Kickstand
kickstand();

// Chain guard hint
color([0.45, 0.45, 0.45])
translate([120, -8, axle_height - 5])
    rotate([0, -5, 0])
        cube([35, 1.5, 4], center=true);