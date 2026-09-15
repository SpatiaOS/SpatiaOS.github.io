// ===========================================================================
// Parametric model: arc-edged base plate + annular underside collar + 2 tabs
// All linear dimensions are in millimetres (expressed as the given fractions).
// ===========================================================================

// ---- Base reference envelope ----------------------------------------------
L = 0.75;                // base plate length  (X)
W = 0.5;                 // base plate width   (Y)
H = 0.125;               // base plate height  (Z), top side at z = H
plate_corner = 0.0625;   // plan corner radius of the arc-edged plate

// ---- Central through void + concentric underside collar --------------------
hole_x    = 0.375;       // void axis: 0.375 from left edge
hole_y    = 0.25;        // void axis: 0.25  from front edge
hole_r    = 0.125;       // void radius
collar_ro = 0.2125;      // collar outer radius
collar_ri = 0.125;       // collar inner radius (= void radius -> hollow ring)
collar_h  = 0.0375;      // collar drop below the base underside

// ---- End tabs (both identical, mirrored about the base centre) -------------
tab_tx   = 0.125;        // tab plan footprint along X
tab_ty   = 0.375;        // tab plan footprint along Y
tab_r    = 0.0625;       // tab end / edge round radius (= tab_tx/2)
tab_top  = 0.5875;       // tab top reach measured from the base datum
tab_h    = tab_top - H;  // tab height above the base top face

// ---- Tab openings ----------------------------------------------------------
tab_hole_r = 0.0937;                       // opening radius
tab_hole_z = (H + tab_top) / 2;            // opening height (mid tab)
right_tab_cx = L - tab_tx/2;               // 0.6875
left_tab_cx  = tab_tx/2;                   // 0.0625

$fn = 120;

// ---------------------------------------------------------------------------
// Rounded (arc-edged) rectangular plate footprint, extruded upward
// ---------------------------------------------------------------------------
module rounded_plate(l, w, h, r) {
    linear_extrude(height = h)
        offset(r = r) square([l - 2*r, w - 2*r], center = true);
}

// ---------------------------------------------------------------------------
// Slot / stadium footprint: rounded ends along Y (length y, width x)
// ---------------------------------------------------------------------------
module slot_footprint(x, y, r) {
    hull() {
        translate([0,  y/2 - r]) circle(r = r);
        translate([0, -(y/2 - r)]) circle(r = r);
    }
}

// ---------------------------------------------------------------------------
// Upright tab: stadium plan footprint, full-round (slot-like) top elevation
// ---------------------------------------------------------------------------
module tab(h) {
    union() {
        // straight body of the tab (up to where the round cap starts)
        linear_extrude(height = h - tab_r)
            slot_footprint(tab_tx, tab_ty, tab_r);
        // round cap: cylinder with Y axis -> rounded outline in elevation
        translate([0, 0, h - tab_r])
            rotate([90, 0, 0])
                cylinder(h = tab_ty, r = tab_r, center = true);
    }
}

// ===========================================================================
// Assembly
// ===========================================================================
difference() {
    union() {
        // 1. base plate: full 0.75 x 0.5 footprint, extruded 0.125 from datum
        translate([L/2, W/2, 0])
            rounded_plate(L, W, H, plate_corner);

        // 2. underside annular collar (hollow circular ring, not a pad)
        translate([hole_x, hole_y, -collar_h])
            difference() {
                cylinder(h = collar_h, r = collar_ro);
                translate([0, 0, -0.5])
                    cylinder(h = collar_h + 1, r = collar_ri);
            }

        // 3. right-end upper tab (X: 0.625 .. 0.75, Y: 0.0625 .. 0.4375)
        translate([right_tab_cx, W/2, H]) tab(tab_h);

        // 4. left-end upper tab (X: 0 .. 0.125, Y: 0.0625 .. 0.4375)
        translate([left_tab_cx, W/2, H]) tab(tab_h);
    }

    // 5. central circular through void - continuous through base and collar
    translate([hole_x, hole_y, -collar_h - 0.5])
        cylinder(h = H + collar_h + 1, r = hole_r);

    // 6. right tab opening, through the tab thickness (Y axis)
    translate([L, W/2, tab_hole_z])
        rotate([90, 0, 0])
            cylinder(h = tab_ty + 1, r = tab_hole_r, center = true);

    // 7. left tab opening, through the tab thickness (Y axis)
    translate([0, W/2, tab_hole_z])
        rotate([90, 0, 0])
            cylinder(h = tab_ty + 1, r = tab_hole_r, center = true);
}