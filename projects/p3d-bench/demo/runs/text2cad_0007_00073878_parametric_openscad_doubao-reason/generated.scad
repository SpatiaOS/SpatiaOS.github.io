// Global resolution for smooth curved surfaces
$fn = 100;

// ==============================
// PARAMETRIC DIMENSION DEFINITIONS
// ==============================
// Base reference dimensions
ref_length = 0.375;   // X-axis reference span
ref_width = 0.375;    // Y-axis reference span
ref_height = 0.25;    // Z-axis max height of main sleeve

// Main annular sleeve parameters
main_center_x = 0.1875;   // X position of main cylinder center
main_center_y = 0.1875;   // Y position of main cylinder center
main_outer_r = 0.1875;    // Outer radius of main sleeve
main_bore_r = 0.075;      // Inner through bore radius of main sleeve
main_height = ref_height; // Total height of main sleeve

// Shallow annular tab parameters
tab_center_x = 0.1875;    // X position of tab center
tab_center_y = -0.1875;   // Y position of tab center
tab_outer_r = 0.1875;     // Outer radius of tab
tab_bore_r = 0.05;        // Inner through bore radius of tab
tab_height = 0.05;        // Height of shallow tab (lower than main sleeve)

// Underside recess cut parameters
recess_center_x = main_center_x;
recess_center_y = main_center_y;
recess_r = 0.075;         // Radius of underside recess
recess_depth = 0.125;     // Depth of recess measured up from base (Z=0)

// ==============================
// REUSABLE MODULE DEFINITIONS
// ==============================
// Annular (hollow) cylinder module
module annular_cylinder(height, outer_r, inner_r, center = false) {
    difference() {
        // Outer solid cylinder
        cylinder(h = height, r = outer_r, center = center);
        // Inner through bore (extra height to ensure complete cut)
        cylinder(h = height + 0.1, r = inner_r, center = center);
    }
}

// ==============================
// MAIN MODEL ASSEMBLY
// ==============================
difference() {
    // Union of all positive solid features
    union() {
        // Main annular sleeve
        translate([main_center_x, main_center_y, 0])
            annular_cylinder(main_height, main_outer_r, main_bore_r);
        
        // Shallow attached annular tab
        translate([tab_center_x, tab_center_y, 0])
            annular_cylinder(tab_height, tab_outer_r, tab_bore_r);
    }
    
    // Underside recess cut associated with main bore
    translate([recess_center_x, recess_center_y, 0])
        cylinder(h = recess_depth, r = recess_r);
}