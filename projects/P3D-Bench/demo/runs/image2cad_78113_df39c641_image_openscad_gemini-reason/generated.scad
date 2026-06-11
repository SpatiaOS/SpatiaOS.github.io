/*
 * Parametric Motorcycle Model
 * Optimized for fast compilation and STL export.
 * Avoids slow operations like minkowski() and uses efficient hull() and primitive combinations.
 */

// --- Global Parameters ---
wheelbase = 1400;       // Distance between front and rear axles
wheel_r = 320;          // Radius of the wheels
tire_w = 100;           // Width of the tires
fork_angle = 25;        // Rake angle of the front forks in degrees
fork_l = 800;           // Length of the front forks

// Global resolution (kept reasonable to prevent export timeouts)
$fn = 36;

// --- Derived Parameters ---
// Calculate the position of the steering head based on fork geometry
head_x = wheelbase - sin(fork_angle) * fork_l;
head_z = wheel_r + cos(fork_angle) * fork_l;

// --- Helper Modules ---

// Creates a tube between two points
module tube(p1, p2, d) {
    hull() {
        translate(p1) sphere(d=d);
        translate(p2) sphere(d=d);
    }
}

// Fast rounded box alternative to minkowski
module rounded_box(size, r) {
    if (r <= 0) {
        cube(size, center=true);
    } else {
        x = max(0, size[0]/2 - r);
        y = max(0, size[1]/2 - r);
        z = max(0, size[2]/2 - r);
        hull() {
            translate([x, y, z]) sphere(r);
            translate([-x, y, z]) sphere(r);
            translate([x, -y, z]) sphere(r);
            translate([-x, -y, z]) sphere(r);
            translate([x, y, -z]) sphere(r);
            translate([-x, y, -z]) sphere(r);
            translate([x, -y, -z]) sphere(r);
            translate([-x, -y, -z]) sphere(r);
        }
    }
}

// Shock absorber module
module shock(p1, p2) {
    v = p2 - p1;
    dist = norm(v);
    if (dist > 0) {
        dir = v / dist;
        // Handle vertical case to avoid cross product issues
        if (abs(dir[2]) > 0.999) {
            translate(p1) {
                color("Silver") cylinder(h=dist/2, d=40);
                color("Black") translate([0, 0, dist/2]) cylinder(h=dist/2, d=55);
                color("DarkGoldenrod") for(i=[0:15:dist/2-15]) {
                    translate([0, 0, dist/4 + i]) cylinder(h=6, d=65);
                }
            }
        } else {
            angle = acos(dir[2]);
            axis = cross([0,0,1], dir);
            translate(p1) rotate(angle, axis) {
                color("Silver") cylinder(h=dist/2, d=40);
                color("Black") translate([0, 0, dist/2]) cylinder(h=dist/2, d=55);
                color("DarkGoldenrod") for(i=[0:15:dist/2-15]) {
                    translate([0, 0, dist/4 + i]) cylinder(h=6, d=65);
                }
            }
        }
    }
}

// Curved fender using fast cylindrical difference
module fender(r, w) {
    rotate([90, 0, 0]) {
        difference() {
            cylinder(h=w, r=r+15, center=true);
            cylinder(h=w+2, r=r, center=true);
            // Cut off lower half
            translate([0, -r, 0]) cube([r*3, r*2, w+10], center=true);
            // Cut front and back to make it a short arc
            translate([r, r, 0]) rotate([0, 0, 30]) cube([r*2, r*2, w+10], center=true);
            translate([-r, r, 0]) rotate([0, 0, -30]) cube([r*2, r*2, w+10], center=true);
        }
    }
}

// --- Component Modules ---

module wheel(r, w) {
    rotate([90, 0, 0]) {
        // Tire
        color("DarkSlateGray") rotate_extrude() 
            translate([r - w/2, 0]) circle(d=w);
        
        // Rim
        color("Silver") rotate_extrude() 
            translate([r - w + 10, 0]) square([20, w-10], center=true);
            
        // Hub
        color("Silver") cylinder(h=w+20, d=w, center=true);
        
        // Spokes (36 spokes)
        color("Silver") {
            for(i=[0:10:179]) {
                rotate([0, 0, i]) cylinder(h=(r-w/2)*2, d=4, center=true);
            }
        }
    }
}

module frame() {
    w = 250;
    tube_d = 35;
    
    color("Black") {
        // Steering head tube
        translate([head_x, 0, head_z]) rotate([0, -fork_angle, 0]) cylinder(h=220, d=50, center=true);
        
        // Main backbone
        tube([head_x-20, 0, head_z-20], [head_x-500, 0, head_z-50], tube_d);
        tube([head_x-500, 0, head_z-50], [head_x-800, 0, head_z-150], tube_d);
        
        // Front down tubes
        tube([head_x-20, w/4, head_z-60], [head_x-150, w/2, head_z-300], tube_d);
        tube([head_x-20, -w/4, head_z-60], [head_x-150, -w/2, head_z-300], tube_d);
        
        // Cradle down to bottom rails
        tube([head_x-150, w/2, head_z-300], [head_x-200, w/2, wheel_r-50], tube_d);
        tube([head_x-150, -w/2, head_z-300], [head_x-200, -w/2, wheel_r-50], tube_d);
        
        // Bottom cradle rails
        tube([head_x-200, w/2, wheel_r-50], [300, w/2, wheel_r-50], tube_d);
        tube([head_x-200, -w/2, wheel_r-50], [300, -w/2, wheel_r-50], tube_d);
        
        // Vertical posts
        tube([300, w/2, wheel_r-50], [300, w/2, head_z-150], tube_d);
        tube([300, -w/2, wheel_r-50], [300, -w/2, head_z-150], tube_d);
        
        // Rear subframe
        tube([300, w/2, head_z-150], [-100, w/2, head_z-150], tube_d);
        tube([300, -w/2, head_z-150], [-100, -w/2, head_z-150], tube_d);
        
        // Subframe diagonal supports
        tube([300, w/2, wheel_r+100], [-50, w/2, head_z-150], tube_d);
        tube([300, -w/2, wheel_r+100], [-50, -w/2, head_z-150], tube_d);
    }
}

module swingarm() {
    w = 280;
    pivot_x = 300;
    pivot_z = wheel_r + 50;
    
    color("Black") {
        // Pivot tube
        translate([pivot_x, 0, pivot_z]) rotate([90, 0, 0]) cylinder(h=w+40, d=60, center=true);
        
        // Swingarm arms
        tube([pivot_x, w/2, pivot_z], [0, w/2, wheel_r], 40);
        tube([pivot_x, -w/2, pivot_z], [0, -w/2, wheel_r], 40);
        
        // Cross bracing
        tube([pivot_x-100, w/2, pivot_z-20], [pivot_x-100, -w/2, pivot_z-20], 35);
    }
}

module forks() {
    fork_w = 200;
    tube_d = 40;
    lower_d = 55;
    
    translate([wheelbase, 0, wheel_r]) rotate([0, -fork_angle, 0]) {
        color("Silver") {
            // Lower fork legs
            translate([0, fork_w/2, 0]) cylinder(h=350, d=lower_d);
            translate([0, -fork_w/2, 0]) cylinder(h=350, d=lower_d);
            
            // Upper fork tubes
            translate([0, fork_w/2, 350]) cylinder(h=450, d=tube_d);
            translate([0, -fork_w/2, 350]) cylinder(h=450, d=tube_d);
            
            // Triple clamps
            translate([-20, 0, 750]) cube([80, fork_w+tube_d, 30], center=true);
            translate([-20, 0, 550]) cube([80, fork_w+tube_d, 30], center=true);
        }
        
        // Headlight (boxy style from image)
        color("Black") translate([60, 0, 650]) {
            cube([100, 120, 100], center=true);
            color("White") translate([50, 0, 0]) rotate([0, 90, 0]) cylinder(h=10, d=100, center=true);
        }
        
        // Speedometer
        color("Black") translate([0, 0, 800]) rotate([0, 20, 0]) cylinder(h=40, d=80, center=true);
        
        // Handlebars (clip-on / drag style)
        color("Black") translate([-30, 0, 780]) {
            rotate([0, 90, 0]) cylinder(h=60, d=25, center=true);
            rotate([90, 0, 0]) cylinder(h=150, d=22, center=true);
            
            translate([0, 75, 0]) rotate([-15, 15, 0]) {
                cylinder(h=250, d=22);
                color("222222") translate([0, 0, 200]) cylinder(h=100, d=35, center=true);
            }
            translate([0, -75, 0]) rotate([15, 15, 0]) {
                cylinder(h=250, d=22);
                color("222222") translate([0, 0, 200]) cylinder(h=100, d=35, center=true);
            }
        }
    }
}

module engine() {
    color("DimGray") translate([600, 0, wheel_r + 50]) {
        // Main crankcase
        rounded_box([350, 280, 200], 20);
        
        // Engine side covers
        translate([0, 140, 0]) rotate([90, 0, 0]) cylinder(h=50, d=200);
        translate([0, -140, 0]) rotate([-90, 0, 0]) cylinder(h=50, d=200);
        translate([100, 150, -20]) rotate([90, 0, 0]) cylinder(h=40, d=120);
        translate([100, -150, -20]) rotate([-90, 0, 0]) cylinder(h=40, d=120);
        
        // Tilted cylinder block
        translate([50, 0, 100]) rotate([0, 15, 0]) {
            // Cylinder base
            cube([200, 260, 50], center=true);
            
            // Finned block
            translate([0, 0, 100]) {
                cube([180, 250, 150], center=true);
                // Fast cooling fins
                for(i=[-60:15:60]) {
                    translate([0, 0, i]) cube([220, 270, 5], center=true);
                }
            }
            
            // Cylinder head
            translate([0, 0, 200]) rounded_box([180, 250, 60], 10);
            
            // Valve cover
            translate([0, 0, 250]) rounded_box([140, 210, 40], 10);
            
            // Carburetors
            color("Silver") {
                translate([-150, 60, 100]) rotate([0, -10, 0]) cylinder(h=100, d=50, center=true);
                translate([-150, -60, 100]) rotate([0, -10, 0]) cylinder(h=100, d=50, center=true);
            }
            // Air filters
            color("Black") {
                translate([-220, 60, 100]) rotate([0, -10, 0]) cylinder(h=80, d=70, center=true);
                translate([-220, -60, 100]) rotate([0, -10, 0]) cylinder(h=80, d=70, center=true);
            }
        }
    }
}

module exhaust() {
    color("Silver") {
        // Left exhaust pipe and muffler
        tube([700, 80, wheel_r+150], [800, 120, wheel_r], 45);
        tube([800, 120, wheel_r], [750, 150, wheel_r-100], 45);
        tube([750, 150, wheel_r-100], [300, 180, wheel_r-100], 45);
        tube([300, 180, wheel_r-100], [-100, 200, wheel_r-50], 80);
        
        // Right exhaust pipe and muffler
        tube([700, -80, wheel_r+150], [800, -120, wheel_r], 45);
        tube([800, -120, wheel_r], [750, -150, wheel_r-100], 45);
        tube([750, -150, wheel_r-100], [300, -180, wheel_r-100], 45);
        tube([300, -180, wheel_r-100], [-100, -200, wheel_r-50], 80);
    }
}

module tank() {
    translate([700, 0, head_z - 100]) {
        difference() {
            // Faceted cafe racer tank shape
            hull() {
                translate([250, 0, 120]) cube([50, 250, 20], center=true);
                translate([250, 0, -20]) cube([50, 300, 20], center=true);
                translate([-150, 0, 100]) cube([50, 180, 20], center=true);
                translate([-150, 0, -20]) cube([50, 200, 20], center=true);
                translate([50, 0, 150]) cube([100, 260, 20], center=true);
            }
            
            // Knee cutouts
            translate([-50, 150, 0]) sphere(d=200);
            translate([-50, -150, 0]) sphere(d=200);
            
            // Bottom tunnel clearance for frame
            translate([50, 0, -50]) rotate([0, 5, 0]) cylinder(h=500, d=120, center=true);
        }
        
        // Gas cap
        color("Silver") translate([150, 0, 150]) cylinder(h=20, d=80);
    }
}

module seat() {
    translate([150, 0, head_z - 130]) {
        // Seat pan
        color("Black") hull() {
            translate([150, 0, 0]) cube([50, 180, 20], center=true);
            translate([-200, 0, 0]) cube([50, 220, 20], center=true);
        }
        // Seat cushion with slight rear kickup
        color("222222") hull() {
            translate([150, 0, 20]) cube([40, 160, 30], center=true);
            translate([-180, 0, 20]) cube([40, 200, 40], center=true);
            translate([-200, 0, 40]) cube([20, 200, 40], center=true);
        }
    }
}

module drivetrain() {
    color("333333") {
        // Front sprocket
        translate([400, -120, wheel_r+50]) rotate([90, 0, 0]) cylinder(h=10, d=100, center=true);
        // Rear sprocket
        translate([0, -120, wheel_r]) rotate([90, 0, 0]) cylinder(h=10, d=200, center=true);
        
        // Drive chain
        hull() {
            translate([400, -120, wheel_r+100]) rotate([90, 0, 0]) cylinder(h=8, d=10, center=true);
            translate([0, -120, wheel_r+100]) rotate([90, 0, 0]) cylinder(h=8, d=10, center=true);
        }
        hull() {
            translate([400, -120, wheel_r]) rotate([90, 0, 0]) cylinder(h=8, d=10, center=true);
            translate([0, -120, wheel_r-100]) rotate([90, 0, 0]) cylinder(h=8, d=10, center=true);
        }
    }
}

module accessories() {
    color("Black") {
        // Footpegs
        translate([300, 0, wheel_r - 50]) {
            rotate([90, 0, 0]) cylinder(h=400, d=20, center=true);
            translate([0, 200, 0]) rotate([90, 0, 0]) cylinder(h=100, d=30);
            translate([0, -200, 0]) rotate([-90, 0, 0]) cylinder(h=100, d=30);
        }
    }
    
    color("Red") {
        // Tail light
        translate([-220, 0, head_z - 100]) rotate([0, -10, 0]) cylinder(h=30, d=50, center=true);
    }
    
    color("Silver") {
        // Brake discs
        translate([wheelbase, 60, wheel_r]) rotate([90, 0, 0]) cylinder(h=10, d=250, center=true);
        translate([0, 60, wheel_r]) rotate([90, 0, 0]) cylinder(h=10, d=220, center=true);
    }
    
    color("Black") {
        // Brake calipers
        translate([wheelbase-50, 60, wheel_r+80]) cube([60, 30, 80], center=true);
        translate([-50, 60, wheel_r+70]) cube([50, 30, 70], center=true);
    }
}

// --- Main Assembly ---
module motorcycle() {
    // Chassis
    frame();
    swingarm();
    
    // Suspension
    forks();
    shock([100, 140, wheel_r + 30], [100, 125, head_z - 150]);
    shock([100, -140, wheel_r + 30], [100, -125, head_z - 150]);
    
    // Powertrain
    engine();
    exhaust();
    drivetrain();
    
    // Bodywork
    color("FireBrick") {
        tank();
        // Front and rear fenders
        translate([wheelbase, 0, wheel_r]) rotate([0, -fork_angle, 0]) fender(wheel_r + 20, tire_w + 30);
        translate([0, 0, wheel_r]) rotate([0, 20, 0]) fender(wheel_r + 30, tire_w + 40);
    }
    seat();
    
    // Wheels (rear is slightly wider)
    translate([wheelbase, 0, wheel_r]) wheel(wheel_r, tire_w);
    translate([0, 0, wheel_r]) wheel(wheel_r, tire_w + 20);
    
    // Details
    accessories();
}

// Render the complete motorcycle
motorcycle();