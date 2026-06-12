// ============================================
// Stepped-Depth Hole Plate with Raised Ribs
// ============================================

// --- Base Plate Parameters ---
base_length    = 120;   // Length of base plate (X)
base_width     = 60;    // Width of base plate (Y)
base_thickness = 8;     // Thickness of base plate (Z)

// --- Rib Parameters ---
rib_height     = 6;     // Height of raised ribs above base top surface
rib_width      = 4;     // Width of each rib (Y)
rib_offset     = 18;    // Distance from plate centerline to rib centerline

// --- Circular Opening Parameters ---
// Upper recess (shallow counterbore from top)
recess_diameter = 18;   // Diameter of upper recess
recess_depth    = 3;    // Depth of upper recess from top surface

// Lower through hole (deeper cut, smaller diameter)
through_diameter = 10;  // Diameter of lower through-hole

// --- Hole Layout Parameters ---
hole_spacing   = 36;    // X-distance from center to end holes
hole_y_offset  = 0;     // Y-offset for hole row (centered)

// --- Resolution ---
$fn = 100;

// ============================================
// Module: stepped_hole
// Creates a single stepped-depth hole cut
// ============================================
module stepped_hole() {
    // Upper shallow recess (counterbore)
    translate([0, 0, base_thickness/2 - recess_depth])
        cylinder(h = recess_depth + 1, d = recess_diameter);
    
    // Lower through hole (full depth)
    translate([0, 0, -base_thickness/2 - 1])
        cylinder(h = base_thickness + 2, d = through_diameter);
}

// ============================================
// Module: rib_pair
// Creates two symmetric raised ribs on top face
// ============================================
module rib_pair() {
    for (side = [-1, 1]) {
        translate([
            -base_length / 2,
            side * rib_offset - rib_width / 2,
            base_thickness / 2
        ])
            cube([base_length, rib_width, rib_height]);
    }
}

// ============================================
// Main Assembly
// ============================================
difference() {
    // --- Additive: Base plate + Ribs ---
    union() {
        // Base plate (centered)
        cube([base_length, base_width, base_thickness], center = true);
        
        // Raised ribs on top surface
        rib_pair();
    }
    
    // --- Subtractive: Three stepped holes ---
    // Left end hole
    translate([-hole_spacing, hole_y_offset, 0])
        stepped_hole();
    
    // Center hole
    translate([0, hole_y_offset, 0])
        stepped_hole();
    
    // Right end hole
    translate([hole_spacing, hole_y_offset, 0])
        stepped_hole();
}