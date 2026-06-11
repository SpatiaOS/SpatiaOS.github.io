// ============================================
// Cafe Racer Motorcycle - Parametric OpenSCAD
// ============================================

// --- Resolution ---
$fn = 60;

// --- Wheel Parameters ---
wheel_r = 24;           // Wheel radius (tire outer)
wheel_w = 7;            // Wheel width (rim)
rim_r = 19;             // Rim radius
hub_r = 3.5;            // Hub radius
spoke_n = 16;           // Number of spokes
spoke_thick = 0.8;      // Spoke thickness
tire_r = 3.5;           // Tire cross-section radius

// --- Frame Parameters ---
frame_tube_d = 2.5;     // Frame tube diameter
fork_d = 3.5;           // Fork tube diameter

// --- Key Positions (centerline x=0, y=forward, z=up) ---
// Wheels
front_y = 55;           front_z = wheel_r;
rear_y = -55;           rear_z = wheel_r;

// Steering
steer_y = 40;           steer_z = 50;

// Engine
engine_w = 14;          engine_h = 16;          engine_l = 22;
engine_y = 5;           engine_z = 24;

// Tank
tank_w = 13;            tank_l = 34;            tank_h = 10;
tank_y = 18;            tank_z = 46;

// Seat
seat_w = 12;            seat_l = 20;            seat_h = 5;
seat_y = -8;            seat_z = 44;

// --- Helper Modules ---

// Frame tube between two points
module frame_tube(p1, p2, d = frame_tube_d) {
    hull() {
        translate(p1) sphere(d = d);
        translate(p2) sphere(d = d);
    }
}

// Motorcycle wheel with tire, rim, hub and spokes
module wheel() {
    rotate([0, 90, 0]) {
        // Tire (torus)
        rotate_extrude()
            translate([wheel_r - tire_r, 0, 0])
            circle(r = tire_r);
        
        // Rim
        cylinder(h = wheel_w - 1, r = rim_r, center = true);
        
        // Hub
        cylinder(h = wheel_w + 1, r = hub_r, center = true);
        
        // Spokes
        for (i = [0 : spoke_n - 1])
            rotate([0, 0, i * 360 / spoke_n])
                translate([0, -spoke_thick / 2, -wheel_w / 2])
                    cube([rim_r, spoke_thick, wheel_w]);
    }
}

// --- Component Modules ---

module engine_block() {
    // Main engine block
    translate([0, engine_y, engine_z])
        cube([engine_w, engine_l, engine_h], center = true);
    
    // Cooling fins
    for (i = [0 : 5])
        translate([0, engine_y, engine_z - engine_h / 2 + 3 + i * 2])
            cube([engine_w + 2, engine_l - 4, 1], center = true);
    
    // Cylinder head
    translate([0, engine_y + engine_l / 4, engine_z + engine_h / 2 + 3])
        cube([engine_w, engine_l / 2, 6], center = true);
    
    // Clutch cover (left side)
    translate([-engine_w / 2 - 1, engine_y, engine_z])
        rotate([0, 90, 0])
        cylinder(h = 2, d = 10, center = true);
    
    // Side cover / battery box (right side)
    translate([engine_w / 2 + 1, engine_y - 5, engine_z - 2])
        cube([2, 8, 8], center = true);
}

module fuel_tank() {
    translate([0, tank_y, tank_z])
        scale([1, 1.6, 0.6])
        sphere(d = tank_w);
}

module seat() {
    translate([0, seat_y, seat_z])
        cube([seat_w, seat_l, seat_h], center = true);
}

module front_fork() {
    fork_x = wheel_w / 2 + 2;
    
    // Fork legs
    for (sx = [-1, 1]) {
        // Lower fork (slider)
        hull() {
            translate([sx * fork_x, front_y, front_z]) sphere(d = fork_d);
            translate([sx * fork_x, front_y - 8, front_z + 18]) sphere(d = fork_d);
        }
        // Upper fork (stanchion)
        hull() {
            translate([sx * fork_x, front_y - 8, front_z + 18]) sphere(d = fork_d * 0.8);
            translate([sx * fork_x, steer_y + 2, steer_z + 5]) sphere(d = fork_d * 0.8);
        }
    }
    
    // Triple clamps
    translate([0, front_y - 6, front_z + 16])
        rotate([0, 90, 0])
        cylinder(h = fork_x * 2 + 4, d = 4, center = true);
    translate([0, front_y - 4, front_z + 22])
        rotate([0, 90, 0])
        cylinder(h = fork_x * 2 + 4, d = 3.5, center = true);
    
    // Steering head tube
    translate([0, steer_y, steer_z])
        rotate([0, 0, -25])
        cylinder(h = 20, d = 5, center = true);
    
    // Front axle
    translate([0, front_y, front_z])
        rotate([0, 90, 0])
        cylinder(h = fork_x * 2 + 2, d = 3, center = true);
}

module handlebars() {
    translate([0, steer_y + 2, steer_z + 8]) {
        // Main bar
        rotate([0, 90, 0])
            cylinder(h = 28, d = 2, center = true);
        // Grips
        for (sx = [-1, 1])
            translate([sx * 12, 0, 0])
                rotate([0, 90, 0])
                cylinder(h = 4, d = 3, center = true);
    }
}

module headlight() {
    translate([0, front_y - 2, front_z + 12])
        rotate([90, 0, 0]) {
            // Housing
            cylinder(h = 6, d1 = 8, d2 = 10, center = true);
            // Lens
            translate([0, 0, -3.5])
                cylinder(h = 1, d = 9, center = true);
        }
}

module front_fender() {
    // Torus arc over front wheel
    translate([0, front_y, front_z])
        rotate([0, 90, 0])
        rotate([0, 0, 135])
        rotate_extrude(angle = 90)
        translate([wheel_r + 2, 0, 0])
        circle(r = 1.5);
}

module rear_fender() {
    // Torus arc over rear wheel
    translate([0, rear_y, rear_z])
        rotate([0, 90, 0])
        rotate([0, 0, 135])
        rotate_extrude(angle = 90)
        translate([wheel_r + 2, 0, 0])
        circle(r = 1.5);
}

module swingarm() {
    arm_x = wheel_w / 2 + 1;
    for (sx = [-1, 1]) {
        hull() {
            translate([sx * arm_x, rear_y, rear_z]) sphere(d = 3);
            translate([sx * arm_x, rear_y + 25, rear_z + 5]) sphere(d = 3);
        }
    }
    // Rear axle
    translate([0, rear_y, rear_z])
        rotate([0, 90, 0])
        cylinder(h = arm_x * 2 + 2, d = 3, center = true);
}

module rear_suspension() {
    shock_x = 4;
    for (sx = [-1, 1]) {
        // Shock body
        hull() {
            translate([sx * shock_x, rear_y + 12, rear_z + 12]) sphere(d = 2.5);
            translate([sx * shock_x, rear_y + 22, rear_z + 25]) sphere(d = 2.5);
        }
        // Spring (simplified)
        hull() {
            translate([sx * shock_x, rear_y + 14, rear_z + 14]) sphere(d = 3.5);
            translate([sx * shock_x, rear_y + 20, rear_z + 23]) sphere(d = 3.5);
        }
    }
}

module exhaust() {
    // Header pipe
    hull() {
        translate([engine_w / 2 + 1, engine_y, engine_z]) sphere(d = 3);
        translate([engine_w / 2 + 2, engine_y - 10, engine_z - 6]) sphere(d = 3);
    }
    // Muffler
    hull() {
        translate([engine_w / 2 + 2, engine_y - 10, engine_z - 6]) sphere(d = 3);
        translate([engine_w / 2 + 2, rear_y + 15, engine_z - 8]) sphere(d = 4);
    }
}

module foot_pegs() {
    for (sx = [-1, 1])
        translate([sx * (engine_w / 2 + 3), engine_y - 5, engine_z - 8])
            rotate([0, 90, 0])
            cylinder(h = 4, d = 2.5, center = true);
}

module instrument_cluster() {
    // Simple binnacle on steering head
    translate([0, steer_y + 3, steer_z + 6])
        cube([6, 4, 3], center = true);
}

module frame() {
    // Down tube (steering head to engine)
    frame_tube([0, steer_y, steer_z], [0, engine_y + 5, engine_z - 5]);
    // Top tube (steering head to tank front)
    frame_tube([0, steer_y, steer_z], [0, tank_y + 5, tank_z + 3]);
    // Seat tube (steering head to seat front)
    frame_tube([0, steer_y, steer_z], [0, seat_y + 5, seat_z]);
    // Engine mount to swingarm pivot
    frame_tube([0, engine_y - 5, engine_z - 5], [0, rear_y + 20, rear_z + 5]);
    // Seat rail
    frame_tube([0, seat_y + 5, seat_z], [0, rear_y + 10, rear_z + 10]);
}

// --- Assembly ---
module motorcycle() {
    // Wheels
    translate([0, front_y, front_z]) wheel();
    translate([0, rear_y, rear_z]) wheel();
    
    // Frame
    frame();
    
    // Engine
    engine_block();
    
    // Front end
    front_fork();
    handlebars();
    headlight();
    front_fender();
    
    // Bodywork
    fuel_tank();
    seat();
    rear_fender();
    
    // Rear assembly
    swingarm();
    rear_suspension();
    
    // Exhaust
    exhaust();
    
    // Controls
    foot_pegs();
    
    // Instruments
    instrument_cluster();
}

motorcycle();