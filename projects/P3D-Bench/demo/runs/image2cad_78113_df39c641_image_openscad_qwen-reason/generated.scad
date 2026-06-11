// Motorcycle Model - OpenSCAD
// Based on a classic boxer-engine motorcycle (e.g., BMW R series)
// Optimized for performance and manifold geometry

$fn = 30; // Moderate resolution for performance

// --- Parameters ---
wheelbase = 720;
wheel_radius = 290;
tire_width = 50;
rim_radius = 250;

// Engine
engine_z = 160;
crankcase_w = 100; // X axis (side to side)
crankcase_d = 140; // Y axis (front to back)
crankcase_h = 110; // Z axis
cylinder_len = 110;
cylinder_r = 45;

// Tank
tank_y_center = -40;
tank_z_center = 360;

// Seat
seat_y_center = 160;
seat_z_center = 390;

// Fork
fork_angle = 25;

// --- Main Assembly ---
motorcycle();

module motorcycle() {
    // 1. Wheels
    // Rear
    translate([0, -wheelbase/2, 0]) wheel_assembly();
    // Front (rotated for fork angle)
    translate([0, wheelbase/2, 0]) rotate([0, 0, -fork_angle]) wheel_assembly();

    // 2. Frame
    frame_assembly();

    // 3. Engine (Boxer)
    translate([0, 0, engine_z]) engine_assembly();

    // 4. Tank
    translate([0, tank_y_center, tank_z_center]) fuel_tank();

    // 5. Seat
    translate([0, seat_y_center, seat_z_center]) seat_assembly();

    // 6. Fenders
    translate([0, -wheelbase/2, 0]) rear_fender();
    translate([0, wheelbase/2, 0]) rotate([0, 0, -fork_angle]) front_fender();
    
    // 7. Handlebars / Headlight
    translate([0, wheelbase/2 - 40, 460]) {
        rotate([0, 0, -fork_angle]) {
            headlight_assembly();
            handlebars();
        }
    }
    
    // 8. Exhaust
    exhaust_pipe();
    
    // 9. Rear Suspension / Swingarm
    rear_suspension();
}

// --- Modules ---

module wheel_assembly() {
    // Tire
    color([0.2, 0.2, 0.2])
    rotate_extrude()
    translate([wheel_radius, 0, 0])
    circle(r = tire_width/2);

    // Rim
    color([0.7, 0.7, 0.7])
    difference() {
        cylinder(h = tire_width - 5, r = rim_radius, center = true);
        cylinder(h = tire_width + 1, r = rim_radius - 20, center = true);
    }

    // Hub
    color([0.5, 0.5, 0.5])
    cylinder(h = tire_width + 10, r = 25, center = true);

    // Spokes (Radial) - Reduced count for performance
    color([0.6, 0.6, 0.6])
    for (a = [0 : 15 : 360]) {
        rotate([0, 0, a]) {
            translate([25, 0, 0]) 
            rotate([0, 90, 0]) 
            cylinder(h = rim_radius - 25, r = 2);
        }
    }
}

module engine_assembly() {
    // Crankcase (Central block)
    color([0.4, 0.4, 0.4])
    // Main block
    cube([crankcase_w, crankcase_d, crankcase_h], center = true);
    
    // Bottom contour (simplified)
    translate([0, 0, -crankcase_h/2])
    hull() {
        cube([crankcase_w - 10, crankcase_d - 10, 20], center = true);
    }

    // Cylinders (Boxer - sticking out along X axis)
    color([0.3, 0.3, 0.3])
    for (side = [-1, 1]) {
        translate([side * (crankcase_w/2 + cylinder_len/2), 0, 10]) {
            rotate([0, 90, 0]) {
                // Cylinder Block
                cylinder(h = cylinder_len, r = cylinder_r);
                
                // Cooling Fins
                color([0.5, 0.5, 0.5])
                for (x = [10 : 12 : cylinder_len - 10]) {
                    translate([x, 0, 0])
                    cylinder(h = 5, r = cylinder_r + 8);
                }
                
                // Cylinder Head
                color([0.6, 0.6, 0.6])
                translate([cylinder_len, 0, 0])
                cylinder(h = 35, r = cylinder_r + 2);
            }
        }
    }
}

module fuel_tank() {
    // Boxy tank shape using hull
    color([0.6, 0.6, 0.6])
    hull() {
        // Front nose
        translate([0, -100, 0])
        cube([110, 50, 70], center = true);
        
        // Middle (widest)
        translate([0, 0, 10])
        cube([150, 120, 90], center = true);
        
        // Rear (tapered)
        translate([0, 90, -10])
        cube([120, 60, 70], center = true);
    }
    
    // Tank Cap
    color([0.8, 0.8, 0.8])
    translate([0, -60, 50])
    cylinder(h = 15, r = 18);
}

module frame_assembly() {
    color([0.2, 0.2, 0.2])
    
    // Main Loop (Steering head to Engine to Rear)
    hull() {
        // Headstock
        translate([0, wheelbase/2 - 60, 460]) sphere(r = 14);
        // Engine top mount
        translate([0, 0, engine_z + crankcase_h/2]) sphere(r = 14);
        // Rear pivot
        translate([0, -wheelbase/2 + 50, 150]) sphere(r = 14);
        // Bottom loop (under engine)
        translate([0, 0, 50]) sphere(r = 14);
    }
    
    // Top tube / Seat rails
    hull() {
        translate([0, wheelbase/2 - 60, 460]) sphere(r = 12); // Headstock
        translate([0, 100, 380]) sphere(r = 12); // Under seat front
        translate([0, seat_y_center + 80, seat_z_center - 20]) sphere(r = 12); // Under seat rear
    }
}

module seat_assembly() {
    color([0.1, 0.1, 0.1])
    // Seat Pan (Flat, slightly contoured)
    hull() {
        translate([0, -60, 0])
        cube([140, 20, 30], center = true);
        
        translate([0, 60, -5])
        cube([130, 20, 30], center = true);
    }
    
    // Seat Struts
    color([0.5, 0.5, 0.5])
    translate([0, -50, -20])
    cylinder(h = 30, r = 8);
    translate([0, 50, -20])
    cylinder(h = 30, r = 8);
}

module rear_fender() {
    color([0.6, 0.6, 0.6])
    // Curved shell over rear tire
    // Using rotate_extrude with limited angle
    // square([radial_thickness, z_height])
    rotate_extrude(angle = 130, convexity = 10)
    translate([wheel_radius + 8, 0, 0])
    square([15, tire_width + 10]); 
}

module front_fender() {
    color([0.6, 0.6, 0.6])
    // Similar to rear
    rotate_extrude(angle = 130, convexity = 10)
    translate([wheel_radius + 8, 0, 0])
    square([15, tire_width + 10]);
}

module headlight_assembly() {
    color([0.8, 0.8, 0.8])
    // Headlight bucket
    rotate([90, 0, 0])
    cylinder(h = 50, r = 45);
    
    // Fork tubes
    color([0.5, 0.5, 0.5])
    translate([-35, -80, 0])
    cylinder(h = 120, r = 16);
    translate([35, -80, 0])
    cylinder(h = 120, r = 16);
    
    // Fork Gaiters (Rubber boots)
    color([0.3, 0.3, 0.3])
    translate([-35, -80, -40])
    cylinder(h = 60, r = 20);
    translate([35, -80, -40])
    cylinder(h = 60, r = 20);
}

module handlebars() {
    color([0.3, 0.3, 0.3])
    // Handlebar tube
    rotate([0, 90, 0])
    cylinder(h = 360, r = 10, center = true);
    
    // Grips
    translate([-160, 0, 0])
    rotate([0, 90, 0])
    cylinder(h = 70, r = 14);
    translate([160, 0, 0])
    rotate([0, 90, 0])
    cylinder(h = 70, r = 14);
    
    // Mirrors (Simple)
    translate([-160, 0, 20])
    rotate([0, 45, 0])
    cylinder(h = 60, r = 3);
    translate([160, 0, 20])
    rotate([0, -45, 0])
    cylinder(h = 60, r = 3);
}

module exhaust_pipe() {
    color([0.4, 0.4, 0.4])
    // Exhaust from Right Cylinder (Positive X)
    // Path: Head -> Down -> Back -> Muffler
    
    // Using hull of spheres for smooth pipe
    hull() {
        // Start at cylinder head
        translate([crankcase_w/2 + cylinder_len + 35, 0, 10 + 20]) sphere(r = 12);
        
        // Curve down and slightly forward/back
        translate([crankcase_w/2 + cylinder_len, 40, -30]) sphere(r = 12);
        
        // Go back along the side
        translate([crankcase_w/2 + 20, 200, -50]) sphere(r = 12);
        
        // Muffler start
        translate([crankcase_w/2 + 20, 350, -50]) sphere(r = 12);
    }
    
    // Muffler
    translate([crankcase_w/2 + 20, 380, -50])
    rotate([0, 90, 0]) // Orient along Y
    cylinder(h = 150, r = 22);
}

module rear_suspension() {
    color([0.3, 0.3, 0.3])
    // Swingarm
    hull() {
        translate([0, -wheelbase/2 + 50, 150]) sphere(r = 15); // Pivot
        translate([0, -wheelbase/2, 0]) sphere(r = 15); // Axle
    }
    
    // Shock absorbers (Dual)
    color([0.6, 0.6, 0.6])
    for (x = [-60, 60]) {
        translate([x, -100, 150]) {
            // Shock body
            rotate([30, 0, 0]) // Angled back
            cylinder(h = 150, r = 10);
        }
    }
}