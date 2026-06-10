// Shock Absorber Assembly Model
// Based on analysis of the provided image
// All dimensions in millimeters, estimated from proportions

$fn = 64; // Moderate resolution for performance

// ==================== PARAMETERS ====================
// Overall assembly dimensions
assembly_height = 120;
assembly_width = 40;

// Spring parameters
spring_outer_diameter = 32;
spring_wire_diameter = 5;
spring_coils = 6;
spring_pitch = 11;

// Central shaft parameters
shaft_diameter = 16;
shaft_length = 75;

// Flange/gear parameters (star-shaped components)
flange_outer_diameter = 40;
flange_inner_diameter = 18;
flange_height = 7;
flange_teeth = 8;
flange_tooth_width = 5;
flange_tooth_depth = 6;

// Eyelet/mounting parameters (top and bottom cylindrical mounts)
eyelet_outer_diameter = 16;
eyelet_length = 14;
eyelet_hole_diameter = 8;
eyelet_hole_length = 14;

// Base plate parameters
base_plate_diameter = 38;
base_plate_height = 4;

// Spring rendering quality
spring_segments_per_coil = 12; // Reduced for performance
spring_sphere_fn = 6; // Low polygon count for spring wire

// ==================== MODULE DEFINITIONS ====================

// Module: Eyelet - cylindrical mount with mounting hole
module eyelet() {
    difference() {
        // Main cylindrical body with rounded ends
        union() {
            cylinder(h = eyelet_length, d = eyelet_outer_diameter, center = true, $fn = 32);
            // Rounded caps
            translate([0, 0, eyelet_length/2])
                sphere(d = eyelet_outer_diameter, $fn = 32);
            translate([0, 0, -eyelet_length/2])
                sphere(d = eyelet_outer_diameter, $fn = 32);
        }
        // Transverse mounting hole
        rotate([90, 0, 0])
            cylinder(h = eyelet_outer_diameter + 4, d = eyelet_hole_diameter, center = true, $fn = 32);
    }
}

// Module: Flange - star/gear shaped component
module flange() {
    difference() {
        // Outer cylinder
        cylinder(h = flange_height, d = flange_outer_diameter, center = true, $fn = 48);
        
        // Inner hole for shaft
        cylinder(h = flange_height + 2, d = flange_inner_diameter, center = true, $fn = 32);
        
        // Teeth cutouts (creates star pattern)
        for (i = [0 : flange_teeth - 1]) {
            rotate([0, 0, i * 360 / flange_teeth])
                translate([flange_outer_diameter/2 - flange_tooth_depth/2, 0, 0])
                    cube([flange_tooth_depth, flange_tooth_width, flange_height + 2], center = true);
        }
    }
}

// Module: Spring - helical coil spring (optimized for performance)
module spring(spring_height, coils, wire_d, outer_d) {
    segments = coils * spring_segments_per_coil;
    radius = (outer_d - wire_d) / 2;
    
    for (i = [0 : segments - 1]) {
        angle1 = i * 360 * coils / segments;
        angle2 = (i + 1) * 360 * coils / segments;
        z1 = i * spring_height / segments;
        z2 = (i + 1) * spring_height / segments;
        
        hull() {
            translate([radius * cos(angle1), radius * sin(angle1), z1])
                sphere(d = wire_d, $fn = spring_sphere_fn);
            translate([radius * cos(angle2), radius * sin(angle2), z2])
                sphere(d = wire_d, $fn = spring_sphere_fn);
        }
    }
}

// Module: Central shaft
module central_shaft() {
    cylinder(h = shaft_length, d = shaft_diameter, center = true, $fn = 32);
}

// Module: Base plate with central hole
module base_plate() {
    difference() {
        union() {
            // Main plate
            cylinder(h = base_plate_height, d = base_plate_diameter, center = true, $fn = 48);
            // Rim detail
            translate([0, 0, base_plate_height/2 - 1])
                cylinder(h = 2, d = base_plate_diameter + 2, center = true, $fn = 48);
        }
        // Central hole for shaft
        cylinder(h = base_plate_height + 4, d = shaft_diameter + 2, center = true, $fn = 32);
    }
}

// ==================== ASSEMBLY ====================

// Calculate spring height
spring_height = spring_coils * spring_pitch;

// Top eyelet assembly
translate([0, 0, assembly_height/2 - eyelet_length/2 - flange_height])
    eyelet();

// Top flange
translate([0, 0, assembly_height/2 - eyelet_length - flange_height])
    flange();

// Spring assembly with central shaft
translate([0, 0, 0]) {
    // Central shaft
    central_shaft();
    
    // Coil spring around shaft
    translate([0, 0, -shaft_length/2 + spring_height/2 + 5])
        spring(spring_height, spring_coils, spring_wire_diameter, spring_outer_diameter);
}

// Bottom flange
translate([0, 0, -assembly_height/2 + eyelet_length + flange_height + base_plate_height])
    flange();

// Base plate
translate([0, 0, -assembly_height/2 + base_plate_height/2])
    base_plate();

// Bottom eyelet assembly (inverted)
translate([0, 0, -assembly_height/2 + eyelet_length/2 + base_plate_height])
    rotate([0, 180, 0])
        eyelet();