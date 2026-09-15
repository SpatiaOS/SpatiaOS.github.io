// ============================================================
// Stepped Plate with Central Opening, Underside Collar,
// and Tall Rounded End Tabs
// ============================================================

// ---------------- Parameters ----------------
plate_length    = 80;   // overall length of the base plate (X)
plate_width     = 40;   // overall width of the base plate (Y)
plate_thickness = 6;    // thickness of the base plate (Z)

end_radius      = 20;   // radius of the arcs forming the plate outline ends

center_hole_d   = 20;   // diameter of the central through opening
collar_outer_d  = 34;   // outer diameter of the annular collar
collar_height   = 4;    // height (thickness) of the underside collar

tab_height      = 20;   // total height of the tall end tabs (from plate bottom)
tab_width       = 24;   // width (Y) of each rounded tab
tab_thickness   = 10;   // thickness (X) of each tab
tab_hole_d      = 8;    // diameter of the through opening in each tab

$fn = 100;              // smoothness of curved surfaces

// ---------------- Helper modules ----------------

// Arc-based (stadium-like) plate outline: hull of two circles,
// so the outline is formed purely by arcs and tangent lines.
module arc_plate(length, width, thickness) {
    r = width / 2;
    hull() {
        translate([-(length/2 - r), 0, 0]) cylinder(h=thickness, r=r);
        translate([ (length/2 - r), 0, 0]) cylinder(h=thickness, r=r);
    }
}

// Hollow annular ring (collar) around the central opening.
module collar(outer_d, inner_d, height) {
    difference() {
        cylinder(h=height, d=outer_d);
        translate([0, 0, -1]) cylinder(h=height + 2, d=inner_d);
    }
}

// Tall rounded tab: vertical rounded block with a through hole.
module rounded_tab(width, thickness, height, hole_d) {
    r = width / 2;
    difference() {
        hull() {
            translate([0, -(width/2 - r), 0]) cylinder(h=height, r=r);
            translate([0,  (width/2 - r), 0]) cylinder(h=height, r=r);
        }
        // Through hole across the tab thickness (X direction)
        rotate([0, 90, 0])
            translate([0, 0, -(thickness + 2) / 2])
                cylinder(h=thickness + 2, d=hole_d, center=true);
    }
}

// ---------------- Main model ----------------

// Step 1: base plate with arc-based outline and central through opening
difference() {
    // solid shallow plate (sits with bottom at z = 0)
    translate([0, 0, 0])
        arc_plate(plate_length, plate_width, plate_thickness);

    // central through opening, cut through the full plate thickness
    translate([0, 0, -1])
        cylinder(h=plate_thickness + 2, d=center_hole_d);
}

// Step 2: shallow annular collar on the underside around the opening
// (hollow ring, extends below z = 0)
translate([0, 0, -collar_height])
    collar(collar_outer_d, center_hole_d, collar_height);

// Step 3: tall rounded tabs at the two ends of the plate,
// rising well above the base plate
tab_offset = plate_length/2 - tab_thickness/2 - end_radius * 0.35;
for (sx = [-1, 1]) {
    translate([sx * tab_offset, 0, 0])
        rounded_tab(tab_width, tab_thickness, tab_height, tab_hole_d);
}