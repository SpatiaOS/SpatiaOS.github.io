// ============================================================
// Parameters
// ============================================================

// Base plate
base_l = 0.75;           // length (x)
base_w = 0.5;            // width (y)
base_h = 0.125;          // height (z)
base_edge_r = 0.015;     // arc-edge rounding radius

// Central through void
void_cx = 0.375;         // center x from left
void_cy = 0.25;          // center y from front
void_r = 0.125;          // void radius

// Underside annular collar
collar_or = 0.2125;      // outer radius
collar_ir = 0.125;       // inner radius (matches void)
collar_h = 0.0375;       // height below base datum

// Right upper tab
rtab_x = 0.625;          // x start offset from left
rtab_y = 0.0625;         // y start offset from front
rtab_dx = 0.125;         // x footprint
rtab_dy = 0.375;         // y footprint
rtab_ztop = 0.5875;      // top z from base datum
rtab_hole_cx = 0.75;     // hole center x
rtab_hole_cy = 0.25;     // hole center y
rtab_hole_r = 0.0937;    // hole radius

// Left upper tab
ltab_x = 0;              // x start offset from left
ltab_y = 0.0625;         // y start offset from front
ltab_dx = 0.125;          // x footprint
ltab_dy = 0.375;          // y footprint
ltab_ztop = 0.5875;       // top z from base datum
ltab_hole_cx = 0;         // hole center x
ltab_hole_cy = 0.25;      // hole center y
ltab_hole_r = 0.0937;     // hole radius

// Tab rounding
tab_r = 0.02;

$fn = 100;

// ============================================================
// Modules
// ============================================================

// Arc-edged plate: flat bottom, rounded top and vertical edges
module arc_edged_plate(l, w, h, r) {
    translate([r, r, 0])
    minkowski() {
        cube([l - 2*r, w - 2*r, h - r]);
        cylinder(r=r, h=r, $fn=60);
    }
}

// Rounded upright tab: flat bottom, rounded top and edges
module rounded_tab(x, y, dx, dy, z_base, z_top, r) {
    h = z_top - z_base;
    translate([x + r, y + r, z_base])
    minkowski() {
        cube([dx - 2*r, dy - 2*r, h - r]);
        cylinder(r=r, h=r, $fn=60);
    }
}

// ============================================================
// Assembly
// ============================================================

union() {
    // --- Base plate with central through void ---
    difference() {
        arc_edged_plate(base_l, base_w, base_h, base_edge_r);
        // Void passes through base and collar region
        translate([void_cx, void_cy, -(collar_h + 0.01)])
            cylinder(r=void_r, h=base_h + collar_h + 0.02);
    }

    // --- Underside annular collar (hollow ring) ---
    translate([void_cx, void_cy, -collar_h])
    difference() {
        cylinder(r=collar_or, h=collar_h);
        // Inner bore continuous with base void
        translate([0, 0, -0.01])
            cylinder(r=collar_ir, h=collar_h + 0.02);
    }

    // --- Right upper tab with through hole ---
    difference() {
        rounded_tab(rtab_x, rtab_y, rtab_dx, rtab_dy,
                    base_h, rtab_ztop, tab_r);
        translate([rtab_hole_cx, rtab_hole_cy, base_h - 0.01])
            cylinder(r=rtab_hole_r, h=rtab_ztop - base_h + 0.02);
    }

    // --- Left upper tab with through hole ---
    difference() {
        rounded_tab(ltab_x, ltab_y, ltab_dx, ltab_dy,
                    base_h, ltab_ztop, tab_r);
        translate([ltab_hole_cx, ltab_hole_cy, base_h - 0.01])
            cylinder(r=ltab_hole_r, h=ltab_ztop - base_h + 0.02);
    }
}