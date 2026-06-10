// Parametric dimensions (all linear units in inches)
$fn = 64;               // facet count for circles

// ---------- main annular cylinder (sleeve) ----------
main_outer_r   = 0.1875;    // outer radius
main_bore_r    = 0.075;     // through‑bore radius
main_h         = 0.25;      // height (from underside datum)
main_x         = 0.1875;    // centre X (from left edge)
main_y         = 0.1875;    // centre Y (from front edge)

// ---------- attached shallow annular tab ----------
tab_outer_r    = 0.1875;    // outer radius
tab_bore_r     = 0.05;      // through‑hole radius
tab_h          = 0.05;      // height
tab_x          = 0.1875;    // centre X
tab_y          = -0.1875;   // centre Y (forward of main body)

// ---------- underside recess (rounded‑rectangular pocket) ----------
// overall footprint rectangle (before corner rounding)
recess_w       = 0.2557;    // X dimension
recess_d       = 0.2884;    // Y dimension
// offsets from the 0.375 × 0.375 reference base
recess_l_off   = 0.0597;    // left
recess_r_off   = 0.0596;    // right
recess_f_off   = 0.0433;    // front
recess_b_off   = 0.0433;    // back
recess_cr      = 0.075;     // corner radius (circular cut profile)
recess_h       = 0.125;     // depth from underside (z = 0..0.125)

// derived centre of the recess from the offsets
recess_cx = (0.375 - recess_r_off - recess_l_off) / 2 + recess_l_off; // = 0.1875
recess_cy = (0.375 - recess_b_off - recess_f_off) / 2 + recess_f_off; // = 0.1875

// --- helper module: hollow cylinder (annular ring) ---
module hollow_cylinder(outer_r, inner_r, h, cx, cy) {
    translate([cx, cy, 0])
        difference() {
            cylinder(r = outer_r, h = h);
            cylinder(r = inner_r, h = h + 0.01); // slight overcut avoids coplanar faces
        }
}

// --- main body ---
module main_body() {
    hollow_cylinder(main_outer_r, main_bore_r, main_h, main_x, main_y);
}

// --- shallow tab ---
module tab() {
    hollow_cylinder(tab_outer_r, tab_bore_r, tab_h, tab_x, tab_y);
}

// --- underside recess (rounded rectangle pocket) ---
module recess_cut() {
    linear_extrude(height = recess_h) {
        translate([recess_cx, recess_cy, 0])
            // create a rounded rectangle by expanding a smaller square
            offset(r = recess_cr)
                square(
                    [recess_w - 2 * recess_cr, recess_d - 2 * recess_cr],
                    center = true
                );
    }
}

// --- final solid ---
difference() {
    union() {
        main_body();
        tab();
    }
    recess_cut();   // remove pocket from underside
}