// Parametric Variables
base_length = 0.75;
base_width = 0.21875;
base_height = 0.28125;
main_extrusion_depth = 0.2812;

cut_radius = 0.0312;
cut_depth = 0.0625;
cut_z_start = 0.1081;

hole1_x = 0.0717;
hole1_y = 0.0625;
hole2_x = 0.6692;
hole2_y = 0.0625;

$fn = 100;

// Module: Main Base Block
module main_base() {
    // Solid upper-side extrusion from base datum
    // Fills footprint to all edges with zero offset
    cube([base_length, base_width, base_height]);
}

// Module: Remove-Material Feature
module circular_cuts() {
    // Two separate circular profiles, not connected into a slot
    translate([hole1_x, hole1_y, cut_z_start])
        cylinder(h=cut_depth, r=cut_radius, center=false);
    translate([hole2_x, hole2_y, cut_z_start])
        cylinder(h=cut_depth, r=cut_radius, center=false);
}

// Main Model Assembly
difference() {
    main_base();
    circular_cuts();
}