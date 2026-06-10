// CAD Model: Base with two internal cylindrical voids
// All dimensions are in inches/mm as per the provided unitless values.

$fn = 100; // High resolution for smooth circular profiles

// --- Parameters ---

// Main base dimensions
base_length = 0.75;
base_width = 0.21875;
base_height = 0.28125;

// Remove-material feature parameters
hole_radius = 0.0312;
hole1_x = 0.0717;      // Distance from left edge for first axis
hole2_x = 0.6692;      // Distance from left edge for second axis
hole_y = 0.0625;       // Distance from front edge for both axes

// Cut height parameters (Z-axis)
cut_z_start = 0.1081;  // Bottom of the removed band
cut_z_end = 0.1705;    // Top of the removed band
cut_depth = cut_z_end - cut_z_start; // ~0.0624 (matches the 0.0625 declared depth)

// --- Modules ---

// Module for the main rectangular base
module main_base() {
    // Formed as one solid upper-side extrusion from the base datum (z=0),
    // filling the footprint to the left, right, front, and back edges.
    cube([base_length, base_width, base_height]);
}

// Module for the subtractive features
module removed_features() {
    // Feature made only from 2 separate circular profiles
    // The intervening material is left solid (not a connected slot)
    
    // First circular profile (Left)
    translate([hole1_x, hole_y, cut_z_start])
        cylinder(h=cut_depth, r=hole_radius);
        
    // Second circular profile (Right)
    translate([hole2_x, hole_y, cut_z_start])
        cylinder(h=cut_depth, r=hole_radius);
}

// --- Main Assembly ---

// Subtract the circular profiles from the main base
difference() {
    main_base();
    removed_features();
}