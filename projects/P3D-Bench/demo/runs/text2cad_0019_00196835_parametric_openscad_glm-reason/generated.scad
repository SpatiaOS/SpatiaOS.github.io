// ============================================================
// Parametric Model: Rectangular Rail with End Block, Recesses, and Cutouts
// ============================================================

// --- Rail dimensions ---
rail_length      = 0.748506;
rail_width       = 0.024642;
rail_lower_h     = 0.0185;    // lower body extrusion depth
rail_top_h       = 0.0046;    // top layer extrusion depth
rail_top_thick   = 0.00462;   // top layer nominal thickness

// --- Circular recess parameters (rail & end block) ---
recess_r         = 0.0043;    // radius of all circular recesses
recess_y_offset  = 0.0108;    // center offset from front edge
recess_x1        = 0.0138;    // rail recess 1 center from left end
recess_x2        = 0.7346;    // rail recess 2 center from left end
recess_z_bot     = 0.0062;    // bottom of recess band above base
recess_z_top     = 0.0185;    // top of recess band above base
recess_depth     = 0.0123;    // vertical extent of recess band

// --- End block position and size ---
end_x_left       = 0.7192;                     // left edge from rail left end
end_x_right      = 0.748506 + 0.0015;          // right edge = rail right + 0.0015
end_y_front      = -0.0361;                     // front edge (in front of rail front)
end_y_back       = 0.024642 + 0.0299;          // back edge (beyond rail back)
end_lower_h      = 0.0185;                     // same lower body extrusion depth
end_top_h        = 0.0046;                     // same top layer extrusion depth
end_top_thick    = 0.00462;                    // same top layer nominal thickness

// --- End block circular recess ---
end_recess_x     = 0.7361;    // center from rail left end
end_recess_y     = -0.0192;   // center in front of rail front edge

// --- Rectangular cutout in end block ---
cutout_side      = 0.027722;  // equal-sided square cutout
cutout_z_top     = 0.0185;    // top of cutout (at lower body top)
cutout_z_bot     = -0.0585;   // bottom of cutout (below base underside)
cutout_depth     = 0.077;     // total reach of cutout

// --- Resolution ---
$fn = 100;

// ============================================================
// Main Model
// ============================================================

difference() {
    union() {
        // ---- Rail lower body ----
        cube([rail_length, rail_width, rail_lower_h]);

        // ---- Rail shallow top layer ----
        translate([0, 0, rail_lower_h])
            cube([rail_length, rail_width, rail_top_h]);

        // ---- End block lower body ----
        translate([end_x_left, end_y_front, 0])
            cube([end_x_right - end_x_left,
                  end_y_back - end_y_front,
                  end_lower_h]);

        // ---- End block shallow top layer ----
        translate([end_x_left, end_y_front, end_lower_h])
            cube([end_x_right - end_x_left,
                  end_y_back - end_y_front,
                  end_top_h]);
    }

    // ---- Rail circular recess 1 ----
    translate([recess_x1, recess_y_offset, recess_z_bot])
        cylinder(h=recess_depth, r=recess_r);

    // ---- Rail circular recess 2 ----
    translate([recess_x2, recess_y_offset, recess_z_bot])
        cylinder(h=recess_depth, r=recess_r);

    // ---- End block circular recess ----
    translate([end_recess_x, end_recess_y, recess_z_bot])
        cylinder(h=recess_depth, r=recess_r);

    // ---- Deep rectangular cutout in end block ----
    // Shares end block left edge and front edge
    translate([end_x_left, end_y_front, cutout_z_bot])
        cube([cutout_side, cutout_side, cutout_z_top - cutout_z_bot]);
}