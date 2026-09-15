// ============================================================
// Open rectangular web panel with ribbed frame and tall side walls
// All dimensions in millimeters
// ============================================================

$fn = 96;

// ---------- Main dimensions ----------
panel_len   = 140;   // overall length (X)
panel_width = 80;    // overall depth (Y)

web_t       = 3;     // thin web (base) thickness
rib_w       = 6;     // width of all ribs
rib_h       = 12;    // height of ribs above web top

wall_t      = 8;     // thickness of solid side walls
wall_h      = 30;    // total wall height (measured from bottom of web)

// ---------- Hole pattern ----------
hole_d      = 18;            // diameter of circular openings
hole_cols   = 3;             // grid of holes (X)
hole_rows   = 2;             // grid of holes (Y)
hole_pitch_x = 34;           // spacing between holes in X
hole_pitch_y = 24;           // spacing between holes in Y

// ---------- Derived ----------
wall_z = wall_h - web_t;      // wall height above web top

// ============================================================
// Modules
// ============================================================

// Thin base web covering full footprint
module base_web() {
    translate([0, 0, web_t/2])
        cube([panel_len, panel_width, web_t], center = true);
}

// Vertical rib standing on the web, running along X
module rib_x(len, xpos, ypos) {
    translate([xpos, ypos, web_t + rib_h/2])
        cube([len, rib_w, rib_h], center = true);
}

// Vertical rib standing on the web, running along Y
module rib_y(len, xpos, ypos) {
    translate([xpos, ypos, web_t + rib_h/2])
        cube([rib_w, len, rib_h], center = true);
}

// Diagonal rib: a bar of given length rotated about Z, then lifted onto web
module diag_rib(len, angle, cx, cy) {
    translate([cx, cy, web_t + rib_h/2])
        rotate([0, 0, angle])
            cube([len, rib_w, rib_h], center = true);
}

// Solid side wall along one long edge, rising above the ribs
module side_wall(yoff) {
    translate([0, yoff, wall_h/2])
        cube([panel_len, wall_t, wall_h], center = true);
}

// Pattern of circular openings cut through the web
module hole_pattern() {
    for (i = [0 : hole_cols - 1])
        for (j = [0 : hole_rows - 1])
            translate([(i - (hole_cols - 1)/2) * hole_pitch_x,
                       (j - (hole_rows - 1)/2) * hole_pitch_y,
                       0])
                cylinder(h = web_t * 3, d = hole_d, center = true);
}

// ============================================================
// Assembly
// ============================================================
difference() {
    union() {
        // 1. Shallow web base (with ribs/walls added before hole cutting,
        //    then holes cut through everything passing the base zone keeps
        //    the loops visible in the open areas of the web)
        base_web();

        // 2. Perimeter ribs on the two short ends (long sides get walls instead)
        rib_y(panel_width, -(panel_len/2 - rib_w/2), 0);   // left end rib
        rib_y(panel_width,  (panel_len/2 - rib_w/2), 0);   // right end rib
        // short rim segments closing corners behind the walls
        rib_x(rib_w*2, 0,  (panel_width/2 - wall_t/2));
        rib_x(rib_w*2, 0, -(panel_width/2 - wall_t/2));

        // 3. Internal transverse (cross) ribs
        for (i = [-1, 1])
            rib_y(panel_width - 2*wall_t, i * panel_len/4, 0);

        // 4. Internal diagonal ribs forming an X web pattern
        diag_len = sqrt(pow(panel_len - 2*rib_w, 2) + pow(panel_width - 2*wall_t, 2));
        ang = atan2(panel_width - 2*wall_t, panel_len - 2*rib_w);
        diag_rib(diag_len,  ang, 0, 0);
        diag_rib(diag_len, -ang, 0, 0);

        // 5. Tall solid side walls along both long edges
        side_wall( (panel_width - wall_t)/2);
        side_wall(-(panel_width - wall_t)/2);
    }

    // Circular openings pass through the shallow web
    // (walls and ribs rise above, so only the web gets the openings)
    hole_pattern();
}