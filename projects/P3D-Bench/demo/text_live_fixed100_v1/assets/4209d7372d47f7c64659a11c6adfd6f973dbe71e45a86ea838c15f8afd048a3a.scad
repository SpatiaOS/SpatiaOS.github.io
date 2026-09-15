// ============================================================
//  Twin-lug bracket plate
//  Base plate with central bore, underside annular collar and
//  two upright rounded (slot-shaped) tabs with through holes
// ============================================================

$fn = 128;
eps = 0.001;                       // small overlap for clean booleans

// ---------- Base plate ----------
base_len   = 0.75;                 // X extent (left -> right)
base_wid   = 0.5;                  // Y extent (front -> back)
base_h     = 0.125;                // extrusion depth from base datum (+Z)
base_cr    = 0.0625;               // arc (rounded) corner radius of plate

// ---------- Central bore ----------
bore_x     = 0.375;                // from left edge
bore_y     = 0.25;                 // from front edge
bore_r     = 0.125;

// ---------- Underside annular collar ----------
collar_or  = 0.2125;               // outer radius
collar_ir  = 0.125;                // inner radius (= bore radius)
collar_h   = 0.0375;               // reaches below the base underside

// ---------- Upright tabs ----------
tab_thk    = 0.125;                // thickness in X
tab_wid    = 0.375;                // width in Y
tab_y0     = 0.0625;               // clearance from front (and back) edge
tab_top    = 0.5875;               // total reach from base datum
tab_r      = tab_wid / 2;          // elevation rounding radius
tab_arc_z  = tab_top - tab_r;      // centre height of the rounded head
tab_hole_r = 0.0937;               // through opening in each tab

tab_x_left  = 0;                   // left tab: X 0.000 .. 0.125
tab_x_right = base_len - tab_thk;  // right tab: X 0.625 .. 0.750

// ============================================================
//  Modules
// ============================================================

// Rounded-corner (arc-edged) plate, full 0.75 x 0.5 footprint
module base_plate() {
    linear_extrude(height = base_h)
        offset(r = base_cr) offset(delta = -base_cr)
            square([base_len, base_wid]);
}

// Underside collar: hollow ring below the base datum
module underside_collar() {
    translate([bore_x, bore_y, -collar_h])
        difference() {
            cylinder(h = collar_h + eps, r = collar_or);
            translate([0, 0, -eps])
                cylinder(h = collar_h + 3 * eps, r = collar_ir);
        }
}

// Upright slot-shaped tab (solid), extruded along X
module upright_tab(x0) {
    translate([x0, tab_y0, 0])
        rotate([90, 0, 90])                       // extrude along +X
            linear_extrude(height = tab_thk)
                hull() {
                    square([tab_wid, tab_arc_z]);          // straight body
                    translate([tab_r, tab_arc_z])
                        circle(r = tab_r);                 // rounded head
                }
}

// Through opening of a tab (cylinder along X)
module tab_hole(x0) {
    translate([x0 - eps, tab_y0 + tab_r, tab_arc_z])
        rotate([0, 90, 0])
            cylinder(h = tab_thk + 2 * eps, r = tab_hole_r);
}

// ============================================================
//  Main model
// ============================================================
difference() {

    // ---- all solid material ----
    union() {
        base_plate();                 // 1) base plate
        underside_collar();           // 2) annular collar underneath
        upright_tab(tab_x_right);     // 3) right-end tab
        upright_tab(tab_x_left);      // 4) left-end tab
    }

    // ---- central bore, continuous through plate + collar ----
    translate([bore_x, bore_y, -collar_h - eps])
        cylinder(h = base_h + collar_h + 2 * eps, r = bore_r);

    // ---- tab openings, cut through tab thickness ----
    tab_hole(tab_x_right);
    tab_hole(tab_x_left);
}