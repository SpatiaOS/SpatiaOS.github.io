// === Parameters ===

// Main base
base_length = 0.165891;    // x
base_width  = 0.325401;    // y
base_height = 0.408347;    // z
base_extr   = 0.4083;      // extrusion depth

// Square recess (top cut)
rec_sx = 0.089326;         // x size
rec_sy = 0.089326;         // y size
rec_ox = 0.0383;           // left offset
rec_oy = 0.0191;           // front offset
rec_z0 = 0.319;            // bottom of recess
rec_z1 = 0.4083;           // top of recess

// Lower rectangular opening
lop_sx = 0.076565;         // x size
lop_sy = 0.132416;         // y size
lop_ox = 0.0447;           // left offset
lop_oy = -0.0303;          // front offset (negative = breaks front face)
lop_z0 = 0;                // bottom
lop_z1 = 0.319;            // top

// Upper back strip removal
str_len = 0.165891;        // full length
str_wid = 0.114848;        // strip width
str_y0  = 0.2106;          // front edge of strip (material left in front)
str_z0  = 0.2807;          // bottom of removed band
str_z1  = 0.4083;          // top of removed band

// Shallow added base section
add_h   = 0.0383;          // height
add_sx  = 0.4339;          // x span
add_sy  = 0.1148;          // y span (front portion)
add_pro = 0.134;           // protrusion beyond each side of main base

// Through holes in shallow section
hol_r   = 0.0255;          // radius
hol_oy  = 0.0574;          // front offset (same for both)
hol1_ox = -0.069;          // left offset of hole 1 relative to base left edge
hol2_ox = 0.2349;          // left offset of hole 2 relative to base left edge

$fn = 100;

// === Modules ===

// Main base block
module main_base() {
    cube([base_length, base_width, base_extr]);
}

// Square recess cut from top surface
module square_recess() {
    translate([rec_ox, rec_oy, rec_z0])
        cube([rec_sx, rec_sy, rec_z1 - rec_z0]);
}

// Lower rectangular opening breaking through front face
module lower_opening() {
    translate([lop_ox, lop_oy, lop_z0])
        cube([lop_sx, lop_sy, lop_z1 - lop_z0]);
}

// Upper back strip removal forming step
module back_strip_cut() {
    translate([0, str_y0, str_z0])
        cube([str_len, str_wid, str_z1 - str_z0]);
}

// Shallow base extension with side protrusions
module shallow_section() {
    translate([-add_pro, 0, 0])
        cube([add_sx, add_sy, add_h]);
}

// Two circular through holes in shallow section
module through_holes() {
    translate([hol1_ox, hol_oy, -0.001])
        cylinder(h = add_h + 0.002, r = hol_r);
    translate([hol2_ox, hol_oy, -0.001])
        cylinder(h = add_h + 0.002, r = hol_r);
}

// === Assembly ===

union() {
    // Base with cuts
    difference() {
        main_base();
        square_recess();    // top recess
        lower_opening();    // lower through opening
        back_strip_cut();   // back step removal
    }
    // Shallow added section with holes
    difference() {
        shallow_section();
        through_holes();
    }
}