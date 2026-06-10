// Parametric Shock Absorber / Suspension Strut Model
// Optimized for performance (replaced sphere loop with linear_extrude helix)

$fn = 60; // Global resolution for curves

// --- Parameters ---

// General Dimensions
shaft_diameter = 8;       
total_height = 120;       

// Spring Parameters
spring_od = 26;           // Outer diameter of the spring
spring_wire_d = 3.5;      // Thickness of the spring wire
spring_free_length = 60;  // Length of the spring
spring_coils = 6.5;       // Number of coils
spring_seat_z = 28;       // Z position where the spring sits (on top of bottom flange)

// Gear / Adjustment Collar Parameters
gear_diameter = 24;
gear_height = 8;
gear_teeth = 10;
gear_tooth_depth = 3;
gear_z = spring_seat_z + spring_free_length; // Sits directly on top of the spring

// Top Mount Parameters
top_mount_body_d = 16;
top_mount_body_h = 22;
top_mount_z = gear_z + gear_height;
top_eyelet_d_outer = 12;
top_eyelet_d_inner = 6;
top_eyelet_width = 14;
top_eyelet_z_offset = -8; // Position relative to the top of the mount body

// Bottom Mount Parameters
bottom_flange_d = 28;
bottom_flange_h = 6;
bottom_flange_z = spring_seat_z - bottom_flange_h;
bottom_body_d = 14;
bottom_body_h = 15;
bottom_eyelet_d_outer = 12;
bottom_eyelet_d_inner = 6;
bottom_eyelet_width = 14;
bottom_eyelet_center_z = 7; // Center of the bottom eyelet

// --- Main Assembly ---
union() {
    // Central Shaft (Piston Rod) - runs through the entire assembly
    color("silver")
    cylinder(h = total_height + 10, d = shaft_diameter, center = false);

    // Bottom Assembly (Eyelet + Body + Flange)
    color("grey")
    bottom_assembly();

    // Coil Spring
    color("lightgrey")
    translate([0, 0, spring_seat_z])
    coil_spring(spring_od, spring_wire_d, spring_free_length, spring_coils);

    // Adjustment Gear / Spline Ring
    color("grey")
    translate([0, 0, gear_z])
    adjustment_gear(gear_diameter, gear_height, gear_teeth, gear_tooth_depth);

    // Top Mount Assembly
    color("grey")
    translate([0, 0, top_mount_z])
    top_assembly();
}

// --- Modules ---

// Efficient Coil Spring Module
// Uses linear_extrude with twist to generate a helix, which is much faster than a loop of spheres.
module coil_spring(od, wire_d, length, coils) {
    radius = (od - wire_d) / 2;
    
    // Main helical body
    linear_extrude(height = length, twist = 360 * coils, slices = coils * 30, convexity = 10) {
        translate([radius, 0, 0])
        circle(r = wire_d / 2, $fn = 24);
    }
    
    // Add flat "ground" rings at top and bottom for realism and to close the geometry
    // Bottom ring
    translate([0, 0, 0])
    rotate_extrude()
    translate([radius, 0])
    circle(r = wire_d / 2, $fn = 24);

    // Top ring
    translate([0, 0, length])
    rotate_extrude()
    translate([radius, 0])
    circle(r = wire_d / 2, $fn = 24);
}

// Adjustment Gear Ring Module
module adjustment_gear(d, h, teeth, tooth_depth) {
    hub_outer_d = d - tooth_depth * 2;
    hub_inner_d = shaft_diameter + 4; // Clearance for shaft
    
    // Main ring body with central hole
    difference() {
        cylinder(h = h, d = hub_outer_d, center = false);
        translate([0, 0, -1])
        cylinder(h = h + 2, d = hub_inner_d, center = false);
    }

    // External Teeth
    // Calculate approximate tooth width based on circumference
    tooth_width = (PI * hub_outer_d) / teeth * 0.6;
    
    for (i = [0 : teeth - 1]) {
        rotate([0, 0, i * 360 / teeth])
        translate([hub_outer_d / 2, 0, h / 2])
        cube([tooth_depth + 1, tooth_width, h], center = true);
    }
}

// Top Mount Module
module top_assembly() {
    // Main vertical body
    cylinder(h = top_mount_body_h, d = top_mount_body_d, center = false);
    
    // Top Hex Cap / Adjustment Nut
    translate([0, 0, top_mount_body_h])
    cylinder(h = 4, d = top_mount_body_d * 0.85, $fn = 6, center = false);
    
    // Top Eyelet (Mounting Lug)
    translate([0, 0, top_mount_body_h + top_eyelet_z_offset])
    rotate([0, 90, 0]) // Orient along X-axis
    difference() {
        cylinder(h = top_eyelet_width, d = top_eyelet_d_outer, center = true);
        cylinder(h = top_eyelet_width + 2, d = top_eyelet_d_inner, center = true);
    }
}

// Bottom Assembly Module
module bottom_assembly() {
    // Bottom Eyelet (Mounting Lug)
    translate([0, 0, bottom_eyelet_center_z])
    rotate([0, 90, 0]) // Orient along X-axis
    difference() {
        cylinder(h = bottom_eyelet_width, d = bottom_eyelet_d_outer, center = true);
        cylinder(h = bottom_eyelet_width + 2, d = bottom_eyelet_d_inner, center = true);
    }
    
    // Lower Damper Body (connects eyelet to flange)
    // Starts from the top of the eyelet area
    translate([0, 0, bottom_eyelet_center_z + bottom_eyelet_width/2])
    cylinder(h = bottom_body_h, d = bottom_body_d, center = false);
    
    // Base Flange (Spring Seat)
    translate([0, 0, bottom_flange_z])
    cylinder(h = bottom_flange_h, d = bottom_flange_d, center = false);
}