// ============================================================
// Base plate with central through hole, underside annular
// collar, and two upright slot-rounded end tabs
// All dimensions in model units
// ============================================================

// ---------------- Parameters ----------------
// Base plate
base_len    = 0.75;     // X length
base_wid    = 0.50;     // Y width
base_hgt    = 0.125;    // Z thickness (extrusion depth from datum)
edge_rad    = 0.03125;  // arc radius on the upper-side plate edges

// Central circular through void
hole_x = 0.375;         // axis offset from left edge
hole_y = 0.25;          // axis offset from front edge
hole_r = 0.125;         // hole radius

// Underside annular collar (concentric with through hole)
collar_h  = 0.0375;     // reach below the base underside
collar_ro = 0.2125;     // outer radius
collar_ri = 0.125;      // inner radius (matches through hole)

// End tabs
tab_thk    = 0.125;     // tab thickness (X footprint)
tab_wid    = 0.375;     // tab width (Y footprint)
tab_y0     = 0.0625;    // tab inset from front/back edges
tab_reach  = 0.5875;    // total tab height above base datum
tab_hole_r = 0.0937;    // tab through-opening radius

// Derived tab values
tab_top_r   = tab_wid / 2;              // slot-top arc radius (0.1875)
tab_arc_z   = tab_reach - tab_top_r;    // Z of arc / opening center (0.4)
tab_cy      = tab_y0 + tab_wid / 2;     // tab Y centerline (0.25)
tab_right_x = base_len - tab_thk;       // right tab X origin (0.625)

$fn = 64;               // curve resolution

// ---------------- Base plate ----------------
// Full 0.75 x 0.5 footprint, sharp underside datum, vertical
// sides, and arc-rounded (filleted) upper perimeter edges.
module base_plate() {
    minkowski() {
        // slab inset by edge_rad, stopping edge_rad below the top
        translate([edge_rad, edge_rad, 0])
            linear_extrude(height = base_hgt - edge_rad)
                square([base_len - 2*edge_rad, base_wid - 2*edge_rad]);
        // upper hemisphere rounds only the top edges
        intersection() {
            sphere(r = edge_rad, $fn = 32);
            translate([-edge_rad, -edge_rad, 0])
                cube([2*edge_rad, 2*edge_rad, edge_rad]);
        }
    }
}

// ---------------- Underside annular collar ----------------
// Hollow circular ring from the base underside (z=0) down to
// z = -collar_h, concentric with the central hole.
module collar() {
    difference() {
        translate([hole_x, hole_y, -collar_h])
            cylinder(h = collar_h, r = collar_ro);
        translate([hole_x, hole_y, -collar_h - 0.01])
            cylinder(h = collar_h + 0.02, r = collar_ri);
    }
}

// ---------------- Upright rounded tab ----------------
// Slot-like elevation: straight legs plus a semicircular top
// whose center is at (tab_cy, tab_arc_z). x0 = tab X origin.
module tab(x0) {
    // straight portion (rooted into the plate top for a solid merge)
    translate([x0, tab_y0, base_hgt - edge_rad])
        cube([tab_thk, tab_wid, tab_arc_z - base_hgt + edge_rad]);
    // rounded top, cylinder axis along X (the tab thickness)
    translate([x0, tab_cy, tab_arc_z])
        rotate([0, 90, 0])
            cylinder(h = tab_thk, r = tab_top_r);
}

// ---------------- Tab through-opening ----------------
// Circular opening cut through the tab thickness (axis along X,
// passing through the given plan offset at front-offset 0.25).
module tab_hole(x0) {
    translate([x0 - 0.01, tab_cy, tab_arc_z])
        rotate([0, 90, 0])
            cylinder(h = tab_thk + 0.02, r = tab_hole_r);
}

// ---------------- Assembly ----------------
difference() {
    union() {
        base_plate();        // arc-edged base plate
        collar();            // underside annular ring
        tab(0);              // left-end tab  (opening axis at left-offset 0)
        tab(tab_right_x);    // right-end tab (opening axis at left-offset 0.75)
    }

    // central through void: continuous through plate and collar
    translate([hole_x, hole_y, -collar_h - 0.01])
        cylinder(h = base_hgt + collar_h + 0.02, r = hole_r);

    // tab openings
    tab_hole(0);
    tab_hole(tab_right_x);
}