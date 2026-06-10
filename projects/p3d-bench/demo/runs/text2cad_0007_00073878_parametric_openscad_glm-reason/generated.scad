// === Parameters ===

// Main reference dimensions
main_length = 0.375;
main_width = 0.375;
main_height = 0.25;

// Main annular cylinder (sleeve)
main_cx = 0.1875;       // Center x offset from left edge
main_cy = 0.1875;       // Center y offset from front edge
main_outer_r = 0.1875;  // Outer radius
main_bore_r = 0.075;    // Through bore radius
// Wall thickness = 0.1875 - 0.075 = 0.1125

// Shallow attached annular tab
tab_cx = 0.1875;        // Center x offset from left edge
tab_cy = -0.1875;       // Center y offset from front edge (extends forward)
tab_outer_r = 0.1875;   // Outer radius
tab_bore_r = 0.05;      // Through opening radius
tab_height = 0.05;      // Height from underside datum
// Wall thickness = 0.1875 - 0.05 = 0.1375
// Bounding span: 0.375 x 0.5625 (left 0, right 0, front -0.375, back 0.1875)

// Underside recess/cut
recess_cx = 0.1875;     // Centered on main axis
recess_cy = 0.1875;     // Centered on main axis
recess_r = 0.075;       // Circular cut radius
recess_depth = 0.125;   // Depth from underside (z=0 to z=0.125)
// Bounded footprint: 0.2557 x 0.2884
// Offsets: left 0.0597, right 0.0596, front 0.0433, back 0.0433

$fn = 100;

// === Modules ===

// Main sleeve: annular cylinder with through bore
module main_sleeve() {
    difference() {
        cylinder(h=main_height, r=main_outer_r);
        // Through bore extends slightly to ensure clean cut
        translate([0, 0, -0.001])
            cylinder(h=main_height + 0.002, r=main_bore_r);
    }
}

// Shallow tab: annular cylinder with through opening
module shallow_tab() {
    difference() {
        cylinder(h=tab_height, r=tab_outer_r);
        // Through opening extends slightly to ensure clean cut
        translate([0, 0, -0.001])
            cylinder(h=tab_height + 0.002, r=tab_bore_r);
    }
}

// Underside recess: circular pocket on underside of main sleeve
module underside_recess() {
    translate([0, 0, -0.001])
        cylinder(h=recess_depth + 0.001, r=recess_r);
}

// === Assembly ===

difference() {
    // Union of main sleeve and shallow tab
    union() {
        // Main annular cylinder positioned at specified center
        translate([main_cx, main_cy, 0])
            main_sleeve();

        // Shallow annular tab positioned at specified center
        translate([tab_cx, tab_cy, 0])
            shallow_tab();
    }

    // Underside recess cut on main axis
    translate([recess_cx, recess_cy, 0])
        underside_recess();
}