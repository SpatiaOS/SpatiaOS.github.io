// ========================================================
// Parametric model
// ========================================================
$fn = 96;

// Overall base reference span
base_L  = 0.75;       // length (X)
base_W  = 0.421875;   // width  (Y)
base_H  = 0.191921;   // base extrusion height (Z)

// Left circular profile (lower base)
c1_x = 0.2109;
c1_y = 0.2109;
c1_r = 0.2109;

// Right concentric circular profile (lower base)
c2_x = 0.6094;
c2_y = 0.2109;
c2_r_outer = 0.1406;
c2_r_inner = 0.1055;

// Upper (taller) annular tower over the left circle
upper_H       = 0.4424;
upper_r_outer = c1_r;            // same footprint radius
upper_r_inner = 0.1055;          // hollow opening
// Slot-like interruption(s) in the opening
slot_w        = 0.040;
slot_len      = 2 * upper_r_outer;

// Rectangular upright tab
tab_L = 0.041188;
tab_W = 0.070313;
tab_H = 0.441346;
tab_x = 0.0703;     // left offset
tab_y = 0.1758;     // front offset

// ========================================================
// Lower base : two rounded profiles (not a filled plate)
// ========================================================
module lower_base() {
    linear_extrude(height = base_H) {
        union() {
            // Left big disk
            translate([c1_x, c1_y]) circle(r = c1_r);
            // Right annular ring (outer minus inner)
            difference() {
                translate([c2_x, c2_y]) circle(r = c2_r_outer);
                translate([c2_x, c2_y]) circle(r = c2_r_inner);
            }
        }
    }
}

// ========================================================
// Upper tower : taller hollow cylinder with slot openings
// ========================================================
module upper_tower() {
    difference() {
        // Outer solid
        translate([c1_x, c1_y, 0])
            cylinder(h = upper_H, r = upper_r_outer);
        // Central hollow bore
        translate([c1_x, c1_y, -0.01])
            cylinder(h = upper_H + 0.02, r = upper_r_inner);
        // Slot-like rounded interruption across the opening
        translate([c1_x, c1_y, -0.01])
            hull() {
                translate([-slot_len/2 + slot_w/2, 0, 0])
                    cylinder(h = upper_H + 0.02, r = slot_w/2);
                translate([ slot_len/2 - slot_w/2, 0, 0])
                    cylinder(h = upper_H + 0.02, r = slot_w/2);
            }
    }
}

// ========================================================
// Rectangular upright tab
// ========================================================
module upright_tab() {
    translate([tab_x, tab_y, 0])
        cube([tab_L, tab_W, tab_H]);
}

// ========================================================
// Assembly
// ========================================================
union() {
    lower_base();
    upper_tower();
    upright_tab();
}