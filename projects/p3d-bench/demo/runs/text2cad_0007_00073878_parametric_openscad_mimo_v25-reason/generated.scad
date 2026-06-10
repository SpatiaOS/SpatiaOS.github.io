// =============================================
// Parameters
// =============================================

// Main reference dimensions
main_length = 0.375;      // Overall X span
main_width  = 0.375;      // Overall Y span
main_height = 0.25;       // Main sleeve height (Z)

// Main annular cylinder (sleeve)
main_cx = 0.1875;         // Center X from left edge
main_cy = 0.1875;         // Center Y from front edge
main_R  = 0.1875;         // Outer radius
main_r  = 0.075;          // Through-bore radius (on main axis)
// Radial wall thickness: 0.1875 - 0.075 = 0.1125

// Shallow annular tab
tab_cx = 0.1875;          // Center X from left edge
tab_cy = -0.1875;         // Center Y (extends forward of reference)
tab_R  = 0.1875;          // Outer radius
tab_r  = 0.05;            // Through-opening radius
tab_h  = 0.05;            // Height from base datum
// Radial wall thickness: 0.1875 - 0.05 = 0.1375

// Underside recess (rectangular pocket from base)
// Bounded footprint: 0.2557 x 0.2884
recess_off_l = 0.0597;    // Left edge offset from reference
recess_off_r = 0.0596;    // Right edge offset from reference
recess_off_f = 0.0433;    // Front edge offset from reference
recess_off_b = 0.0433;    // Back edge offset from reference
recess_w = main_length - recess_off_l - recess_off_r;  // 0.2557
recess_d = main_width  - recess_off_f - recess_off_b;   // 0.2884
recess_h = 0.125;         // Recess depth (z=0 to z=0.125)

// Resolution
$fn  = 100;
eps  = 0.001;

// =============================================
// Main Model
// =============================================

difference() {
    union() {
        // Main annular cylinder (sleeve)
        translate([main_cx, main_cy, 0])
            difference() {
                cylinder(h = main_height, r = main_R);
                translate([0, 0, -eps])
                    cylinder(h = main_height + 2 * eps, r = main_r);
            }

        // Shallow annular tab (attached forward of sleeve)
        translate([tab_cx, tab_cy, 0])
            difference() {
                cylinder(h = tab_h, r = tab_R);
                translate([0, 0, -eps])
                    cylinder(h = tab_h + 2 * eps, r = tab_r);
            }
    }

    // Underside rectangular recess (counterbore pocket from base)
    translate([recess_off_l, recess_off_f, -eps])
        cube([recess_w, recess_d, recess_h + eps]);
}