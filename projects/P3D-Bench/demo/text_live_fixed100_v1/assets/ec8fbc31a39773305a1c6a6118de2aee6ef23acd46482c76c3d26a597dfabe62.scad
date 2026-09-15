// ===================== Parameters =====================
$fn = 64;

// --- Base plate (shallow, arc-ended outline) ---
plate_len = 80;    // overall length along X
plate_w   = 46;    // overall width along Y (arc diameter)
plate_thk = 8;     // plate thickness along Z

// --- Central through opening ---
bore_d = 26;       // real through hole diameter

// --- Under-side annular collar (hollow ring, shallow lower tier) ---
collar_thk  = 5;                       // collar height below the plate
collar_wall = 7;                       // radial wall thickness
collar_od   = bore_d + 2*collar_wall;  // collar outer diameter

// --- Tall rounded end tabs ---
tab_thk    = 10;   // tab thickness along X
tab_w      = 28;   // tab width along Y
tab_h      = 26;   // tab height above the plate top
tab_r      = 4;    // tab corner rounding radius
tab_embed  = 2;    // how far the tab sinks into the plate (clean union)
tab_hole_d = 8;    // tab through hole diameter
tab_hole_z = 16;   // hole centre height above the plate top
tab_x      = plate_len/2 - plate_w/2;  // arc centre of the plate ends

// ===================== Modules =====================
// Stadium / arc-ended outline of the base plate (2D)
module plate_outline() {
    hull() {
        translate([-(plate_len/2 - plate_w/2), 0]) circle(d = plate_w);
        translate([ (plate_len/2 - plate_w/2), 0]) circle(d = plate_w);
    }
}

// Rounded tab: local Z spans -tab_embed .. tab_h, centred on X and Y
module rounded_tab() {
    H = tab_h + tab_embed;
    minkowski() {
        translate([0, 0, H/2 - tab_embed])
            cube([tab_thk - 2*tab_r, tab_w - 2*tab_r, H - 2*tab_r], center = true);
        sphere(r = tab_r, $fn = 24);
    }
}

// ===================== Build =====================
difference() {
    union() {
        // 1. shallow base plate with arc-based outline
        linear_extrude(height = plate_thk) plate_outline();

        // 2. hollow ring collar on the underside, surrounding the bore
        translate([0, 0, -collar_thk])
            difference() {
                cylinder(h = collar_thk, d = collar_od);
                translate([0, 0, -1]) cylinder(h = collar_thk + 2, d = bore_d);
            }

        // 3. two tall rounded tabs rising from the plate ends
        for (sx = [-1, 1])
            translate([sx * tab_x, 0, plate_thk]) rounded_tab();
    }

    // 4. central through opening (passes through plate + collar)
    translate([0, 0, -collar_thk - 1])
        cylinder(h = plate_thk + collar_thk + 2, d = bore_d);

    // 5. through hole in each tab (through its thickness, along X)
    for (sx = [-1, 1])
        translate([sx * tab_x, 0, plate_thk + tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_thk + 4, d = tab_hole_d, center = true);
}