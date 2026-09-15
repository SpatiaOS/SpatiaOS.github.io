// ============================================================
// Channel Base with Side Walls, End Tab and Annular Post Row
// ============================================================

$fn = 100;

// ---- Base plate ----
base_length   = 140;    // X dimension
base_width    = 56;     // Y dimension
base_height   = 6;      // Z thickness of the floor

// ---- Long side walls (run along X, on both Y edges) ----
wall_thickness = 8;     // Y thickness of each side wall
wall_height    = 22;    // height above the base top face

// ---- End tab / short cross wall ----
tab_length     = 10;    // X extent of the tab
tab_height     = 12;    // height above base top (lower than side walls)
tab_inset      = 4;     // distance from the end face of the base

// ---- Annular posts (ring shaped solids, centred row) ----
post_count     = 5;
post_outer_d   = 18;
post_inner_d   = 9;
post_height    = 16;    // height above base top (lower than side walls)
post_margin    = 26;    // clear distance from each base end to first/last post

// Derived values
top_of_base   = base_height;                       // Z of the floor upper face
channel_width = base_width - 2 * wall_thickness;   // free Y width inside walls
tab_width     = channel_width;                     // tab spans the channel
post_span     = base_length - 2 * post_margin;     // centre-to-centre span
post_pitch    = post_count > 1 ? post_span / (post_count - 1) : 0;

// ------------------------------------------------------------
// Modules
// ------------------------------------------------------------

// Flat rectangular floor
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// One long side wall raised from the base top face
module side_wall(y_pos) {
    translate([0, y_pos, top_of_base])
        cube([base_length, wall_thickness, wall_height]);
}

// Both side walls, leaving an open channel between them
module side_walls() {
    side_wall(0);                                  // wall on -Y edge
    side_wall(base_width - wall_thickness);        // wall on +Y edge
}

// Short rectangular tab at one end, inside the side-wall outline
module end_tab() {
    translate([tab_inset, wall_thickness, top_of_base])
        cube([tab_length, tab_width, tab_height]);
}

// Single annular (ring) post with a real central opening
module ring_post() {
    difference() {
        cylinder(h = post_height, d = post_outer_d);
        // through hole, extended for clean boolean faces
        translate([0, 0, -1])
            cylinder(h = post_height + 2, d = post_inner_d);
    }
}

// Centred row of annular posts standing on the base top face
module post_row() {
    for (i = [0 : post_count - 1])
        translate([post_margin + i * post_pitch,
                   base_width / 2,
                   top_of_base])
            ring_post();
}

// ------------------------------------------------------------
// Assembly : base + walls + tab + posts (all additive solids)
// ------------------------------------------------------------
module channel_assembly() {
    union() {
        base_plate();   // flat rectangular floor
        side_walls();   // tallest raised features
        end_tab();      // lower stepped rectangular addition
        post_row();      // ring shaped posts inside the channel
    }
}

channel_assembly();