// --------------------------
// Parameters (all dimensions in mm)
// --------------------------
$fn = 60; // Smoothness for curved surfaces

// Wheel parameters
wheel_diameter = 300;
wheel_width = 50;
tire_thickness = 15;
rim_inner_dia = wheel_diameter - 2*tire_thickness;
hub_diameter = 40;
spoke_count = 32;
spoke_diameter = 2;

// Frame & Chassis parameters
wheelbase = 460; // Distance between wheel centers
frame_tube_diameter = 14;
fork_tube_diameter = 12;
fork_length = 260;
swingarm_tube_diameter = 12;
rear_shock_length = 120;
rear_shock_diameter = 14;
spring_coil_count = 7;
spring_diameter = 10;

// Body parameters
tank_length = 280;
tank_width = 110;
tank_height = 80;
seat_length = 170;
seat_width = 95;
seat_height = 25;
fender_thickness = 3;
fender_clearance = 10;

// Powertrain parameters
engine_width = 120;
engine_height = 145;
engine_depth = 85;
cooling_fin_count = 8;
cooling_fin_thickness = 2;
cooling_fin_spacing = 6;

// Controls parameters
handlebar_width = 180;
handlebar_diameter = 8;
headlight_size = 40;

// --------------------------
// Reusable Modules
// --------------------------

// Spoked wheel module
module wheel() {
    union() {
        // Tire (rounded profile)
        rotate_extrude() {
            translate([wheel_diameter/2 - tire_thickness/2, 0])
            circle(r=tire_thickness/2);
        }
        // Rim
        cylinder(h=wheel_width, d=rim_inner_dia, center=true);
        difference() {
            cylinder(h=wheel_width + 1, d=rim_inner_dia - 6, center=true);
            cylinder(h=wheel_width + 2, d=hub_diameter + 6, center=true);
        }
        // Hub
        cylinder(h=wheel_width + 8, d=hub_diameter, center=true);
        // Spokes
        for (a = [0: 360/spoke_count: 359]) {
            rotate(a)
            translate([(hub_diameter/2 + rim_inner_dia/2)/2, 0, 0])
            rotate([0, 90, 0])
            cylinder(h=(rim_inner_dia - hub_diameter)/2 - 4, d=spoke_diameter, center=true);
        }
    }
}

// Curved wheel fender module
module fender(wheel_d, width, clearance, thickness) {
    linear_extrude(width) {
        difference() {
            arc_r = wheel_d/2 + clearance + thickness/2;
            inner_arc_r = wheel_d/2 + clearance - thickness/2;
            sector_angle = 100; // Arc coverage angle
            polygon(points=[
                [0, 0],
                [arc_r * cos(sector_angle/2), arc_r * sin(sector_angle/2)],
                [inner_arc_r * cos(sector_angle/2), inner_arc_r * sin(sector_angle/2)],
                [inner_arc_r * cos(-sector_angle/2), inner_arc_r * sin(-sector_angle/2)],
                [arc_r * cos(-sector_angle/2), arc_r * sin(-sector_angle/2)]
            ]);
        }
    }
}

// --------------------------
// Main Assembly
// --------------------------
union() {
    // --------------------------
    // Wheels
    // --------------------------
    // Front wheel
    translate([wheelbase/2, 0, wheel_diameter/2])
    rotate([0, 90, 0])
    wheel();
    
    // Rear wheel
    translate([-wheelbase/2, 0, wheel_diameter/2])
    rotate([0, 90, 0])
    wheel();

    // --------------------------
    // Fenders
    // --------------------------
    // Front fender
    translate([wheelbase/2, -wheel_width/2 - 2, wheel_diameter/2 + fender_clearance + fender_thickness/2])
    rotate([0, 0, -90])
    fender(wheel_diameter, wheel_width + 4, fender_clearance, fender_thickness);
    
    // Rear fender
    translate([-wheelbase/2, -wheel_width/2 - 2, wheel_diameter/2 + fender_clearance + fender_thickness/2])
    rotate([0, 0, -90])
    fender(wheel_diameter, wheel_width + 4, fender_clearance, fender_thickness);

    // --------------------------
    // Front Fork & Handlebars
    // --------------------------
    // Left fork tube
    translate([wheelbase/2 + 10, wheel_width/2 + 10, wheel_diameter/2 + fork_length/2])
    cylinder(h=fork_length, d=fork_tube_diameter, center=true);
    
    // Right fork tube
    translate([wheelbase/2 + 10, -wheel_width/2 - 10, wheel_diameter/2 + fork_length/2])
    cylinder(h=fork_length, d=fork_tube_diameter, center=true);
    
    // Fork crown
    translate([wheelbase/2 + 10, 0, wheel_diameter/2 + fork_length - 15])
    cube([30, wheel_width + 40, 20], center=true);
    
    // Handlebars
    translate([wheelbase/2 + 25, 0, wheel_diameter/2 + fork_length - 5])
    rotate([0, 15, 0])
    cylinder(h=handlebar_width, d=handlebar_diameter, center=true);
    
    // Headlight
    translate([wheelbase/2 + 40, 0, wheel_diameter/2 + fork_length - 35])
    cube([headlight_size, headlight_size, headlight_size * 0.7], center=true);

    // --------------------------
    // Frame
    // --------------------------
    // Main top frame tube
    translate([-wheelbase/2 + 100, 0, wheel_diameter/2 + 120])
    rotate([0, -10, 0])
    cylinder(h=320, d=frame_tube_diameter, center=true);
    
    // Main down tube
    translate([wheelbase/2 - 50, 0, wheel_diameter/2 + 90])
    rotate([0, 60, 0])
    cylinder(h=250, d=frame_tube_diameter, center=true);
    
    // Seat post tube
    translate([-wheelbase/2 + 130, 0, wheel_diameter/2 + 60])
    rotate([0, -80, 0])
    cylinder(h=170, d=frame_tube_diameter, center=true);
    
    // Swingarm
    translate([-wheelbase/2 + 30, wheel_width/2 + 10, wheel_diameter/2])
    rotate([0, 5, 0])
    cylinder(h=200, d=swingarm_tube_diameter, center=true);
    translate([-wheelbase/2 + 30, -wheel_width/2 - 10, wheel_diameter/2])
    rotate([0, 5, 0])
    cylinder(h=200, d=swingarm_tube_diameter, center=true);

    // Rear shocks
    translate([-wheelbase/2 + 60, wheel_width/2 + 10, wheel_diameter/2 + 70])
    cylinder(h=rear_shock_length, d=rear_shock_diameter, center=true);
    translate([-wheelbase/2 + 60, -wheel_width/2 - 10, wheel_diameter/2 + 70])
    cylinder(h=rear_shock_length, d=rear_shock_diameter, center=true);
    
    // Coil springs
    for (i = [0:spring_coil_count]) {
        translate([-wheelbase/2 + 60, wheel_width/2 + 10, wheel_diameter/2 + 70 - rear_shock_length/2 + i * (rear_shock_length*0.7)/spring_coil_count])
        cylinder(h=2, d=spring_diameter + 6, center=true);
        translate([-wheelbase/2 + 60, -wheel_width/2 - 10, wheel_diameter/2 + 70 - rear_shock_length/2 + i * (rear_shock_length*0.7)/spring_coil_count])
        cylinder(h=2, d=spring_diameter + 6, center=true);
    }

    // --------------------------
    // Engine
    // --------------------------
    translate([0, 0, wheel_diameter/2 + 50]) {
        // Main engine block
        cube([engine_width, engine_depth, engine_height], center=true);
        // Cylinder cooling fins
        for (i = [0:cooling_fin_count]) {
            translate([0, 0, engine_height/2 - 40 + i * cooling_fin_spacing])
            cube([engine_width + 30, engine_depth + 10, cooling_fin_thickness], center=true);
        }
        // Side covers
        translate([engine_width/2 + 2, 0, 0])
        cylinder(h=10, d=60, center=true);
        translate([-engine_width/2 - 2, 0, 0])
        cylinder(h=10, d=80, center=true);
    }

    // --------------------------
    // Fuel Tank
    // --------------------------
    translate([wheelbase/2 - 170, 0, wheel_diameter/2 + 150])
    rotate([0, -5, 0])
    hull() {
        // Front section of tank
        translate([0, 0, 0])
        cylinder(h=tank_width, d=tank_height, center=true);
        // Rear section of tank
        translate([tank_length, 0, -10])
        cylinder(h=tank_width - 10, d=tank_height - 10, center=true);
        // Top cap detail
        translate([tank_length/2 - 20, 0, tank_height/2 + 5])
        cylinder(h=10, d=25, center=true);
    }

    // --------------------------
    // Seat
    // --------------------------
    translate([-wheelbase/2 + 150, 0, wheel_diameter/2 + 150])
    rotate([0, -5, 0])
    hull() {
        // Front seat section
        translate([0, 0, 0])
        cube([20, seat_width, seat_height], center=true);
        // Rear seat section
        translate([seat_length, 0, -5])
        cube([20, seat_width - 10, seat_height - 10], center=true);
    }
}