// Motorcycle 3D Model - OpenSCAD
// Estimated dimensions based on typical motorcycle proportions (mm)

// Parameters
wheel_diameter = 250;     // Diameter of the tire
wheel_width = 40;         // Width of the tire (cross-section)
rim_diameter = 180;       // Diameter of the rim (inside the tire)
frame_length = 1000;      // Overall length of the main frame
frame_width = 180;        // Width of the frame (between wheels)
frame_height = 250;       // Height of the frame from ground to top
engine_length = 350;      // Length of the engine block
engine_width = 180;       // Width of the engine block
engine_height = 250;      // Height of the engine block
fuel_tank_length = 400;   // Length of the fuel tank
fuel_tank_width = 130;    // Width of the fuel tank
fuel_tank_height = 180;   // Height of the fuel tank
seat_length = 250;        // Length of the seat
seat_width = 130;         // Width of the seat
seat_height = 40;         // Height of the seat
front_fork_length = 350;  // Length of the front fork tubes
rear_shock_length = 180;  // Length of the rear shock absorbers
swingarm_length = 350;    // Length of the rear swingarm
$fn = 100;                // Smoothness for curved surfaces

// Module: Wheel (tire, rim, spokes)
module wheel(diameter, width, rim_diam) {
    // Tire (torus shape)
    rotate_extrude($fn = 100) {
        translate([diameter / 2, 0, 0]) circle(r = width / 2);
    }
    // Rim (cylinder)
    cylinder(h = width, d = rim_diam, center = true);
    // Spokes (radial cylinders)
    spoke_length = (diameter - rim_diam) / 2; // Length from rim to tire
    for (i = [0 : 20 : 360]) {
        rotate([0, 0, i]) {
            translate([rim_diam / 2, 0, 0]) {
                cylinder(h = spoke_length, d = 2, center = true); // Spoke diameter = 2mm
            }
        }
    }
}

// Module: Front Wheel (positioned at front of frame)
module front_wheel() {
    translate([frame_length / 2, 0, wheel_diameter / 2]) {
        wheel(wheel_diameter, wheel_width, rim_diameter);
    }
}

// Module: Rear Wheel (positioned at rear of frame)
module rear_wheel() {
    translate([-frame_length / 2, 0, wheel_diameter / 2]) {
        wheel(wheel_diameter, wheel_width, rim_diameter);
    }
}

// Module: Frame (main tubular structure)
module frame() {
    // Main frame tube (cylinder, centered)
    translate([0, 0, frame_height / 2]) {
        cylinder(h = frame_length, d = 20, center = true); // Tube diameter = 20mm
    }
    // Subframe (cube, for seat/rear suspension)
    translate([-frame_length / 4, 0, frame_height / 2 + 50]) {
        cube([frame_length / 2, frame_width / 2, 10], center = true);
    }
}

// Module: Engine (crankcase + cylinders)
module engine() {
    // Crankcase (cube)
    translate([0, 0, engine_height / 2]) {
        cube([engine_length, engine_width, engine_height], center = true);
    }
    // Cylinders (two, V-twin style)
    for (i = [-1, 1]) {
        translate([i * engine_length / 4, 0, engine_height / 2 + 100]) {
            cylinder(h = 200, d = 100, center = true); // Cylinder height = 200mm, diameter = 100mm
        }
    }
}

// Module: Fuel Tank (rectangular with rounded top)
module fuel_tank() {
    translate([0, 0, frame_height + fuel_tank_height / 2]) {
        // Base cube
        cube([fuel_tank_length, fuel_tank_width, fuel_tank_height], center = true);
        // Rounded top (Minkowski with sphere)
        minkowski() {
            cube([fuel_tank_length - 20, fuel_tank_width - 20, fuel_tank_height - 20], center = true);
            sphere(r = 10); // Rounded edge radius = 10mm
        }
    }
}

// Module: Seat (flat with rounded edges)
module seat() {
    translate([-frame_length / 4, 0, frame_height + seat_height / 2 + fuel_tank_height / 2]) {
        // Base cube
        cube([seat_length, seat_width, seat_height], center = true);
        // Rounded edges (Minkowski with sphere)
        minkowski() {
            cube([seat_length - 10, seat_width - 10, seat_height - 10], center = true);
            sphere(r = 5); // Rounded edge radius = 5mm
        }
    }
}

// Module: Front Fork (tubes + handlebar)
module front_fork() {
    // Fork tubes (cylinders)
    for (i = [-1, 1]) {
        translate([frame_length / 2, i * frame_width / 4, wheel_diameter / 2 + front_fork_length / 2]) {
            cylinder(h = front_fork_length, d = 20, center = true); // Fork tube diameter = 20mm
        }
    }
    // Handlebar (cube)
    translate([frame_length / 2 + 100, 0, wheel_diameter / 2 + front_fork_length + 20]) {
        cube([200, 20, 20], center = true); // Handlebar length = 200mm, width/height = 20mm
    }
}

// Module: Rear Suspension (swingarm + shock absorbers)
module rear_suspension() {
    // Swingarm (cube)
    translate([-frame_length / 2, 0, wheel_diameter / 2 + 50]) {
        cube([swingarm_length, 20, 20], center = true); // Swingarm length = 350mm, width/height = 20mm
    }
    // Shock absorbers (cylinders)
    for (i = [-1, 1]) {
        translate([-frame_length / 2 + swingarm_length / 2, i * frame_width / 4, wheel_diameter / 2 + 100]) {
            cylinder(h = rear_shock_length, d = 20, center = true); // Shock diameter = 20mm
        }
    }
}

// Module: Fenders (front and rear)
module front_fender() {
    translate([frame_length / 2, 0, wheel_diameter / 2 + 20]) {
        rotate_extrude(angle = 180, $fn = 100) {
            translate([wheel_diameter / 2 + 10, 0, 0]) circle(r = 10); // Fender radius = 10mm
        }
    }
}

module rear_fender() {
    translate([-frame_length / 2, 0, wheel_diameter / 2 + 20]) {
        rotate_extrude(angle = 180, $fn = 100) {
            translate([wheel_diameter / 2 + 10, 0, 0]) circle(r = 10); // Fender radius = 10mm
        }
    }
}

// Module: Exhaust (pipes + tips)
module exhaust() {
    for (i = [-1, 1]) {
        translate([i * engine_length / 4, 0, engine_height / 2 + 50]) {
            cylinder(h = 300, d = 30, center = true); // Exhaust pipe diameter = 30mm
            translate([0, 0, 150]) {
                sphere(r = 15); // Exhaust tip radius = 15mm
            }
        }
    }
}

// Main Assembly: Combine all modules
module motorcycle() {
    // Wheels
    front_wheel();
    rear_wheel();
    // Frame
    frame();
    // Engine
    engine();
    // Fuel Tank
    fuel_tank();
    // Seat
    seat();
    // Front Fork
    front_fork();
    // Rear Suspension
    rear_suspension();
    // Fenders
    front_fender();
    rear_fender();
    // Exhaust
    exhaust();
}

// Render the motorcycle
motorcycle();