// ==========================================
// Parametric Variables
// ==========================================

// Main Reference Dimensions
main_length = 0.375;
main_width = 0.375;
main_height = 0.25;

// Main Annular Cylinder
main_cx = 0.1875;
main_cy = 0.1875;
main_outer_r = 0.1875;
main_bore_r = 0.075;

// Shallow Attached Annular Tab
tab_cx = 0.1875;
tab_cy = -0.1875;
tab_outer_r = 0.1875;
tab_bore_r = 0.05;
tab_height = 0.05;

// Underside Recess / Cut
recess_w = 0.2557; // X dimension footprint
recess_l = 0.2884; // Y dimension footprint
recess_h = 0.125;  // Height of the removed band from underside

// Resolution for smooth curves
$fn = 100;

// ==========================================
// Module Definitions
// ==========================================

// Module for the complete annular assembly
module annular_assembly() {
    difference() {
        // 1. Combine solid bodies
        union() {
            // Main annular cylinder
            // Centered at (0.1875, 0.1875) with height 0.25
            translate([main_cx, main_cy, 0])
                cylinder(h=main_height, r=main_outer_r);

            // Shallow attached annular tab
            // A straight rectangular body connecting the tab center to the main cylinder center
            // Bounding span: X from 0 to 0.375, Y from -0.1875 to 0.1875
            translate([0, tab_cy, 0])
                cube([main_length, main_cy - tab_cy, tab_height]);

            // Circular outer profile of the tab
            // Centered at (0.1875, -0.1875) with height 0.05
            translate([tab_cx, tab_cy, 0])
                cylinder(h=tab_height, r=tab_outer_r);
        }

        // 2. Subtractive operations (Holes and Recesses)
        
        // Main central through bore
        // Extended slightly in Z to ensure clean manifold cuts
        translate([main_cx, main_cy, -0.01])
            cylinder(h=main_height + 0.02, r=main_bore_r);

        // Tab central through opening
        translate([tab_cx, tab_cy, -0.01])
            cylinder(h=tab_height + 0.02, r=tab_bore_r);

        // Removed underside recess/cut
        // Bounded footprint 0.2557 by 0.2884, centered on the main axis
        translate([main_cx, main_cy, 0])
            translate([-recess_w/2, -recess_l/2, -0.01])
                cube([recess_w, recess_l, recess_h + 0.01]);

        // Circular cut profile band associated with the main bore
        // Runs from 0 to 0.125 measured upward from the base underside
        translate([main_cx, main_cy, -0.01])
            cylinder(h=recess_h + 0.01, r=main_bore_r);
    }
}

// ==========================================
// Main Execution
// ==========================================

// Instantiate the modeled component
color("steelblue")
    annular_assembly();