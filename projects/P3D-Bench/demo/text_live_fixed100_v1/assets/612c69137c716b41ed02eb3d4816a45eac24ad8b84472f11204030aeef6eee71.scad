// ============================================================
// Parametric model: base plate with center void, underside
// collar, and two upright rounded lifting tabs
// ============================================================

// ---------- Parameters ----------
$fn = 80;

// Base plate
base_l      = 0.75;    // overall length (X)
base_w      = 0.5;     // overall width (Y)
base_t      = 0.125;   // extrusion depth from base datum (Z)
base_edge_r = 0.02;    // top edge arc (fillet) radius

// Central through void
hole_r  = 0.125;       // radius
hole_x  = 0.375;       // axis, from left edge
hole_y  = 0.25;        // axis, from front edge

// Underside annular collar
collar_h  = 0.0375;    // reach below base underside
collar_ro = 0.2125;    // outer radius
collar_ri = 0.125;     // inner radius (matches center void)

// Upright tabs (both ends)
tab_thk     = 0.125;   // tab thickness (X)
tab_w       = 0.375;   // tab width (Y)
tab_inset   = 0.0625;  // front/back inset
tab_top_z   = 0.5875;  // total reach from base datum
tab_hole_r  = 0.0937;  // through opening radius
tab_embed   = 0.05;    // embedment into base for solid union

// Derived values
cap_r       = tab_w / 2;            // rounded-top radius of tab elevation
tab_hole_z  = tab_top_z - cap_r;    // hole center height (= cap center)
tab_base_z  = base_t - tab_embed;   // tab start (buried in base)
right_tab_x = 0.625;                // left-offset of right tab
left_tab_x  = 0;                    // left-offset of left tab
tab_y       = hole_y;               // both tabs centered at front-offset 0.25

// ---------- Modules ----------

// Base plate: sharp lower body, arc-rounded top edges
module arc_edge_plate() {
    union() {
        // Sharp-edged lower body (full footprint)
        cube([base_l, base_w, base_t - base_edge_r]);
        // Fully rounded block: supplies arced top edges
        minkowski() {
            translate([base_edge_r, base_edge_r, base_edge_r])
                cube([base_l - 2*base_edge_r,
                      base_w - 2*base_edge_r,
                      base_t - 2*base_edge_r]);
            sphere(base_edge_r);
        }
    }
}

// Underside hollow circular collar (annular ring)
module collar() {
    difference() {
        // Outer ring body (runs up into base for clean union)
        cylinder(h = collar_h + base_t, r = collar_ro);
        // Inner bore, extended to guarantee an open ring
        translate([0, 0, -0.05])
            cylinder(h = collar_h + base_t + 0.1, r = collar_ri);
    }
}

// Upright rounded tab: stadium elevation, hole through thickness
// x0 = tab left face; local Y centered on tab width axis
module upright_tab(x0) {
    difference() {
        // Rounded-top elevation: straight body + tangent top cap
        hull() {
            translate([x0, -tab_w/2, tab_base_z])
                cube([tab_thk, tab_w, tab_hole_z - tab_base_z]);
            translate([x0, 0, tab_hole_z])
                rotate([0, 90, 0])
                    cylinder(h = tab_thk, r = cap_r);
        }
        // Through opening, axis along tab thickness (X)
        translate([x0 - 0.05, 0, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_thk + 0.1, r = tab_hole_r);
    }
}

// ---------- Assembly ----------

difference() {
    union() {
        // Base plate
        arc_edge_plate();

        // Underside collar concentric with center void
        translate([hole_x, hole_y, -collar_h])
            collar();

        // Right and left upright tabs (embedded into base top)
        translate([0, tab_y, 0]) {
            upright_tab(right_tab_x);
            upright_tab(left_tab_x);
        }
    }

    // Central through void, continuous through base and collar
    translate([hole_x, hole_y, -0.1])
        cylinder(h = 0.35, r = hole_r);
}