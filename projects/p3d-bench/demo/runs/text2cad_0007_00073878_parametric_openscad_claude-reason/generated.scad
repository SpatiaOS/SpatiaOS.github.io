// === Parameters ===
$fn = 100;

// Main reference dimensions
ref_length = 0.375;       // X span
ref_width  = 0.375;       // Y span
ref_height = 0.25;        // Z span / main extrusion depth

// Main annular cylinder
main_cx      = 0.1875;    // Center X (from left edge)
main_cy      = 0.1875;    // Center Y (from front edge)
main_outer_r = 0.1875;    // Outer radius
main_bore_r  = 0.075;     // Central through-bore radius
main_h       = 0.25;      // Full height
// Radial wall = 0.1875 - 0.075 = 0.1125

// Shallow attached annular tab
tab_cx      = 0.1875;     // Center X
tab_cy      = -0.1875;    // Center Y (extends in -Y direction)
tab_outer_r = 0.1875;     // Outer radius
tab_bore_r  = 0.05;       // Centered through-opening radius
tab_h       = 0.05;       // Tab height (lower than main sleeve)
// Radial wall = 0.1875 - 0.05 = 0.1375

// Underside recess / counterbore (from base upward)
recess_cx = 0.1875;       // Same center as main bore
recess_cy = 0.1875;
recess_r  = 0.1442;       // Counterbore radius (derived from 0.2884/2 bounding footprint)
recess_h  = 0.125;        // Depth from z=0 upward to z=0.125

// Boolean clearance
eps = 0.001;

// === Helper Modules ===

// Annular cylinder: solid cylinder with a concentric through hole
module annular_cylinder(cx, cy, h, r_outer, r_bore) {
    translate([cx, cy, 0])
        difference() {
            cylinder(h = h, r = r_outer);
            translate([0, 0, -eps])
                cylinder(h = h + 2 * eps, r = r_bore);
        }
}

// === Main Model Assembly ===
difference() {
    // Step 1: Union of positive bodies
    union() {
        // Main annular cylinder (full-height sleeve)
        translate([main_cx, main_cy, 0])
            cylinder(h = main_h, r = main_outer_r);

        // Shallow attached annular tab (tangent to main at Y=0)
        translate([tab_cx, tab_cy, 0])
            cylinder(h = tab_h, r = tab_outer_r);
    }

    // Step 2: Main central through bore (radius 0.075, full height)
    translate([main_cx, main_cy, -eps])
        cylinder(h = main_h + 2 * eps, r = main_bore_r);

    // Step 3: Tab centered through opening (radius 0.05, tab height)
    translate([tab_cx, tab_cy, -eps])
        cylinder(h = tab_h + 2 * eps, r = tab_bore_r);

    // Step 4: Underside recess / counterbore from base
    // Enlarges bore from radius 0.075 to 0.1442 in the lower half (z=0 to z=0.125)
    // Bounding footprint ~0.2557 x 0.2884, offsets L 0.0597, R 0.0596, F 0.0433, B 0.0433
    translate([recess_cx, recess_cy, -eps])
        cylinder(h = recess_h + eps, r = recess_r);
}