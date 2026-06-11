// ============================================
// Vintage Cafe Racer Motorcycle Model
// Parametric OpenSCAD Design
// ============================================

// --------------------------------------------
// Global Parameters (all dimensions in mm)
// --------------------------------------------
$fn = 60; // Global resolution for curves

// Wheel parameters
wheel_radius = 32;
tire_width = 12;
rim_radius = 28;
hub_radius = 6;
spoke_count = 16;

// Chassis geometry
wheelbase = 130;
ground_clearance = 18;
fork_rake = 24;
fork_length = 70;

// Fuel Tank dimensions
tank_length = 52;
tank_width = 20;
tank_height = 14;
tank_knee_indent = 4;

// Engine dimensions
engine_block_l = 34;
engine_block_w = 20;
engine_block_h = 26;
cylinder_bore = 10;
fin_count = 8;

// Seat dimensions
seat_length = 38;
seat_width_front = 14;
seat_width_rear = 10;
seat_height = 6;

// Frame tube radius
tube_radius = 3;

// --------------------------------------------
// Module: Complete Wheel Assembly
// --------------------------------------------
module wheel() {
    union() {
        // Tire (torus shape)
        rotate_extrude(convexity=10) {
            translate([rim_radius + tire_width/2 - 2, 0])
                circle(r=tire_width/2);
        }
        
        // Rim
        color("gray")
            rotate_extrude(convexity=10) {
                translate([rim_radius, 0])
                    circle(r=1.5);
            }
        
        // Hub
        color("darkgray")
            cylinder(h=tire_width+2, r=hub_radius, center=true);
        
        // Axle hole
        color("black")
            cylinder(h=tire_width+4, r=2, center=true);
        
        // Spokes
        color("silver")
        for (i = [0 : spoke_count-1]) {
            rotate([0, 0, i * (360/spoke_count)])
                rotate([85, 0, 0]) {
                    hull() {
                        translate([0, 0, hub_radius])
                            sphere(r=0.8);
                        translate([0, 0, rim_radius-2])
                            sphere(r=0.5);
                    }
                    hull() {
                        translate([0, 0, hub_radius])
                            sphere(r=0.8);
                        rotate([0, 180, 0])
                            translate([0, 0, rim_radius*0.7])
                                sphere(r=0.5);
                    }
                }
        }
    }
}

// --------------------------------------------
// Module: Front Fender
// --------------------------------------------
module front_fender() {
    color("lightgray")
    difference() {
        rotate([90, 0, 0]) {
            linear_extrude(height=tire_width+8, center=true, convexity=10) {
                difference() {
                    offset(r=2) {
                        intersection() {
                            scale([1, 0.6])
                                circle(r=rim_radius+tire_width/2+3);
                            translate([-5, -20, 0])
                                square([40, 25]);
                        }
                    }
                    scale([1, 0.55])
                        circle(r=rim_radius+tire_width/2+1);
                }
            }
        }
        translate([0, 0, -20])
            cube([80, 30, 40], center=true);
    }
}

// --------------------------------------------
// Module: Rear Fender
// --------------------------------------------
module rear_fender() {
    color("lightgray")
    rotate([90, 0, 0]) {
        linear_extrude(height=tire_width+6, center=true, convexity=10) {
            difference() {
                offset(r=2) {
                    intersection() {
                        scale([1, 0.5])
                            circle(r=rim_radius+tire_width/2+4);
                        translate([-15, -15, 0])
                            square([45, 25]);
                    }
                }
                scale([1, 0.45])
                    circle(r=rim_radius+tire_width/2+1);
            }
        }
    }
    translate([15, 0, rim_radius+tire_width/2])
        sphere(r=3);
}

// --------------------------------------------
// Module: Front Fork Assembly
// --------------------------------------------
module front_fork_assembly(x_pos) {
    color("silver")
    translate([x_pos, 0, ground_clearance]) {
        rotate([fork_rake, 0, 0]) {
            // Upper triple clamp
            translate([0, 0, fork_length-5]) {
                difference() {
                    cube([16, 8, 6], center=true);
                    cylinder(h=8, r=3.5, center=true);
                }
            }
            
            // Lower triple clamp
            translate([0, 0, 10]) {
                difference() {
                    cube([18, 10, 8], center=true);
                    cylinder(h=12, r=4, center=true);
                }
            }
            
            // Left fork tube
            translate([-6, 0, fork_length/2])
                cylinder(h=fork_length, r=2.5, center=true);
            
            // Right fork tube
            translate([6, 0, fork_length/2])
                cylinder(h=fork_length, r=2.5, center=true);
            
            // Handlebars
            translate([0, 0, fork_length-2]) {
                rotate([0, 90, 0])
                    cylinder(h=30, r=2, center=true);
                
                translate([-15, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(h=8, r=3, center=true);
                translate([15, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(h=8, r=3, center=true);
            }
            
            // Headlight mount
            translate([0, -8, fork_length-15])
                sphere(r=6);
            
            // Headlight
            translate([0, -14, fork_length-15]) {
                rotate([90, 0, 0])
                    cylinder(h=4, r=7, center=true);
            }
            
            // Front axle connection
            translate([0, 0, -5])
                cylinder(h=10, r=4, center=true);
        }
    }
}

// --------------------------------------------
// Module: Fuel Tank
// --------------------------------------------
module fuel_tank(tank_x, tank_y, tank_z) {
    color("darkgray")
    translate([tank_x, tank_y, tank_z]) {
        hull() {
            translate([-tank_length/2 + 5, -tank_width/2 + 2, tank_height/2 - 2])
                sphere(r=4);
            translate([-tank_length/2 + 5, tank_width/2 - 2, tank_height/2 - 2])
                sphere(r=4);
            
            translate([0, -tank_width/2 + 1, tank_height/2 + 2])
                sphere(r=5);
            translate([0, tank_width/2 - 1, tank_height/2 + 2])
                sphere(r=5);
            
            translate([tank_length/2 - 8, -tank_width/2 + 3, tank_height/2 - 1])
                sphere(r=4);
            translate([tank_length/2 - 8, tank_width/2 - 3, tank_height/2 - 1])
                sphere(r=4);
            
            translate([-tank_length/2 + 10, -tank_width/2 - tank_knee_indent, -tank_height/3])
                sphere(r=3);
            translate([-tank_length/2 + 10, tank_width/2 + tank_knee_indent, -tank_height/3])
                sphere(r=3);
            
            translate([tank_length/2 - 5, -tank_width/2 + 2, -tank_height/4])
                sphere(r=3);
            translate([tank_length/2 - 5, tank_width/2 - 2, -tank_height/4])
                sphere(r=3);
        }
        
        // Fuel cap
        translate([5, 0, tank_height/2 + 2]) {
            cylinder(h=3, r=4);
            translate([0, 0, 3])
                cylinder(h=1.5, r=5);
        }
        
        // Side badge
        translate([8, tank_width/2 - 0.5, tank_height/4])
            rotate([0, 90, 0])
                cylinder(h=2, r=3, $fn=24);
    }
}

// --------------------------------------------
// Module: Engine Block with Cooling Fins
// --------------------------------------------
module engine_block(eng_x, eng_y, eng_z) {
    color("dimgray")
    translate([eng_x, eng_y, eng_z]) {
        // Main crankcase
        hull() {
            translate([-engine_block_l/2 + 5, -engine_block_w/2, -engine_block_h/2 + 5])
                sphere(r=4);
            translate([-engine_block_l/2 + 5, engine_block_w/2, -engine_block_h/2 + 5])
                sphere(r=4);
            translate([engine_block_l/2 - 3, -engine_block_w/2 + 2, -engine_block_h/2 + 5])
                sphere(r=4);
            translate([engine_block_l/2 - 3, engine_block_w/2 - 2, -engine_block_h/2 + 5])
                sphere(r=4);
            
            translate([-engine_block_l/2 + 5, -engine_block_w/2, 0])
                sphere(r=4);
            translate([-engine_block_l/2 + 5, engine_block_w/2, 0])
                sphere(r=4);
            translate([engine_block_l/2 - 3, -engine_block_w/2 + 2, 0])
                sphere(r=4);
            translate([engine_block_l/2 - 3, engine_block_w/2 - 2, 0])
                sphere(r=4);
        }
        
        // Cylinder barrel with cooling fins
        translate([0, 0, 2]) {
            for (i = [0 : fin_count-1]) {
                translate([0, 0, i * 2.2]) {
                    difference() {
                        cylinder(h=1.8, r=cylinder_bore/2 + 1.5);
                        cylinder(h=2, r=cylinder_bore/2 - 0.5);
                    }
                }
            }
            translate([0, 0, fin_count * 2.2]) {
                cylinder(h=4, r=cylinder_bore/2 + 2);
                translate([0, 0, 3])
                    cylinder(h=4, r=1.5);
            }
        }
        
        // Cylinder jug side view
        translate([engine_block_l/4, engine_block_w/2 - 2, 5]) {
            rotate([90, 0, 0])
                cylinder(h=6, r=cylinder_bore/2 + 1);
        }
        
        // Exhaust header pipe
        color("silver")
        translate([engine_block_l/2 - 5, -engine_block_w/2 - 3, 0]) {
            rotate([0, 90, 0])
                cylinder(h=25, r=2);
            translate([20, 0, 0])
                rotate([0, 90, 0])
                    cylinder(h=12, r=3.5);
        }
        
        // Carburetor/intake
        color("silver")
        translate([-engine_block_l/2 + 2, 0, 8]) {
            rotate([0, 90, 0])
                cylinder(h=8, r=3);
            translate([-10, 0, 0])
                rotate([0, 90, 0])
                    cylinder(h=6, r=4);
        }
        
        // Sump/oil pan
        translate([0, 0, -engine_block_h/2 + 2]) {
            hull() {
                translate([-8, -6, 0])
                    sphere(r=3);
                translate([8, -6, 0])
                    sphere(r=3);
                translate([-8, 6, 0])
                    sphere(r=3);
                translate([8, 6, 0])
                    sphere(r=3);
                translate([0, 0, -5])
                    sphere(r=4);
            }
        }
    }
}

// --------------------------------------------
// Module: Cafe Racer Seat
// --------------------------------------------
module motorcycle_seat(seat_x, seat_y, seat_z) {
    color("saddlebrown")
    translate([seat_x, seat_y, seat_z]) {
        hull() {
            translate([-seat_length/2 + 5, -seat_width_front/2, 0])
                sphere(r=2);
            translate([-seat_length/2 + 5, seat_width_front/2, 0])
                sphere(r=2);
            
            translate([0, -seat_width_front/2 - 1, 0])
                sphere(r=2.5);
            translate([0, seat_width_front/2 + 1, 0])
                sphere(r=2.5);
            
            translate([seat_length/2 - 5, -seat_width_rear/2, 0])
                sphere(r=2);
            translate([seat_length/2 - 5, seat_width_rear/2, 0])
                sphere(r=2);
            
            translate([-seat_length/2 + 8, 0, seat_height - 1])
                sphere(r=2);
            translate([2, 0, seat_height + 1])
                sphere(r=2.5);
            translate([seat_length/2 - 8, 0, seat_height - 0.5])
                sphere(r=2);
        }
        
        // Rear cowl bump
        translate([seat_length/2 - 3, 0, seat_height/2]) {
            rotate([0, 20, 0])
                scale([1, 1, 0.6])
                    sphere(r=5);
        }
        
        // Front hinge
        color("silver")
        translate([-seat_length/2, 0, -2]) {
            cylinder(h=4, r=2);
            translate([0, -4, 0])
                cylinder(h=4, r=1.5);
            translate([0, 4, 0])
                cylinder(h=4, r=1.5);
        }
    }
}

// --------------------------------------------
// Module: Main Frame (Tubular Cradle)
// --------------------------------------------
module main_frame(front_x, rear_x, frame_z) {
    color("red") {
        // Backbone tube
        hull() {
            translate([front_x + 15, 0, frame_z + 35])
                sphere(r=tube_radius);
            translate([rear_x - 25, 0, frame_z + 28])
                sphere(r=tube_radius);
        }
        
        // Seat tube
        hull() {
            translate([rear_x - 25, 0, frame_z + 28])
                sphere(r=tube_radius);
            translate([rear_x - 20, 0, frame_z + 5])
                sphere(r=tube_radius);
        }
        
        // Down tubes
        for (y_off = [-8, 8]) {
            hull() {
                translate([front_x + 12, y_off * 0.3, frame_z + 32])
                    sphere(r=tube_radius);
                translate([front_x + 35, y_off, frame_z + 5])
                    sphere(r=tube_radius);
            }
        }
        
        // Bottom cradle tubes
        for (y_off = [-10, 10]) {
            hull() {
                translate([front_x + 35, y_off, frame_z + 5])
                    sphere(r=tube_radius);
                translate([rear_x - 15, y_off * 0.8, frame_z + 8])
                    sphere(r=tube_radius);
            }
        }
        
        // Rear stays
        for (y_off = [-6, 6]) {
            hull() {
                translate([rear_x - 20, y_off, frame_z + 8])
                    sphere(r=tube_radius);
                translate([rear_x - 5, y_off * 1.2, frame_z + 10])
                    sphere(r=tube_radius);
            }
        }
        
        // Steering head
        translate([front_x + 10, 0, frame_z + 25]) {
            rotate([fork_rake, 0, 0])
                cylinder(h=25, r=tube_radius + 1);
        }
        
        // Gusset plates
        translate([front_x + 20, 0, frame_z + 20])
            rotate([0, 0, 45])
                cube([6, 1, 8], center=true);
    }
}

// --------------------------------------------
// Module: Rear Suspension (Shocks & Swingarm)
// --------------------------------------------
module rear_suspension(rear_x, sus_z) {
    color("silver")
    translate([rear_x, 0, sus_z]) {
        // Swingarm
        hull() {
            translate([-15, 0, 10])
                sphere(r=3);
            translate([15, 0, 10])
                sphere(r=3);
            translate([-15, -12, 10])
                sphere(r=2.5);
            translate([15, -12, 10])
                sphere(r=2.5);
        }
        
        // Shock mounts
        translate([-20, 12, 25])
            sphere(r=2);
        translate([-5, 10, 12])
            sphere(r=2);
        
        // Left shock absorber
        translate([-12, 11, 18]) {
            rotate([0, 15, 0]) {
                difference() {
                    cylinder(h=18, r=3);
                    cylinder(h=19, r=2);
                }
                translate([0, 0, -8])
                    cylinder(h=10, r=3.5);
                translate([0, 0, 9])
                    cylinder(h=6, r=1.5);
            }
        }
        
        // Right shock absorber
        translate([-12, -11, 18]) {
            rotate([0, 15, 0]) {
                difference() {
                    cylinder(h=18, r=3);
                    cylinder(h=19, r=2);
                }
                translate([0, 0, -8])
                    cylinder(h=10, r=3.5);
                translate([0, 0, 9])
                    cylinder(h=6, r=1.5);
            }
        }
    }
}

// ============================================
// MAIN ASSEMBLY - Complete Motorcycle Model
// ============================================
union() {
    // Position coordinates
    front_wheel_x = -wheelbase/2 + 10;
    rear_wheel_x = wheelbase/2 - 10;
    frame_base_z = ground_clearance - 5;
    
    // Front wheel
    translate([front_wheel_x, 0, ground_clearance])
        wheel();
    
    // Front fender
    translate([front_wheel_x + 5, 0, ground_clearance])
        front_fender();
    
    // Front fork assembly
    front_fork_assembly(front_wheel_x);
    
    // Rear wheel
    translate([rear_wheel_x, 0, ground_clearance])
        wheel();
    
    // Rear fender
    translate([rear_wheel_x - 5, 0, ground_clearance])
        rear_fender();
    
    // Main frame
    main_frame(front_wheel_x, rear_wheel_x, frame_base_z);
    
    // Fuel tank
    fuel_tank(front_wheel_x + 45, 0, frame_base_z + 22);
    
    // Engine block
    engine_block(front_wheel_x + 42, 0, frame_base_z + 12);
    
    // Seat
    motorcycle_seat(front_wheel_x + 65, 0, frame_base_z + 26);
    
    // Rear suspension
    rear_suspension(rear_wheel_x - 5, frame_base_z);
}