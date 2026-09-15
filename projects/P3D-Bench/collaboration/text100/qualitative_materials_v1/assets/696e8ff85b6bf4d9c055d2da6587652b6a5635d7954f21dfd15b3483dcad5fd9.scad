// ============================================================
//  Open-web ribbed panel with raised side walls
//  - thin shallow web (floor) with a grid of cross ribs,
//    corner diagonal ribs and circular through openings
//  - two long solid side walls raised above the web
// ============================================================

// ---------------- Parameters ----------------
L       = 160;   // overall length (X)
W       = 90;    // overall width  (Y)
web_t   = 4;     // thickness of the shallow web / floor
rib_w   = 5;     // width of every rib
rib_h   = 10;    // rib height, measured from the base plane
wall_t  = 7;     // side-wall thickness
wall_h  = 22;    // side-wall height, measured from the base plane
cols    = 4;     // number of web cells along X
rows    = 2;     // number of web cells along Y
hole_d  = 20;    // diameter of the circular openings through the web
$fn     = 64;

// ---------------- Derived values ----------------
x0    = rib_w;              // start of the open interior along X
y0    = wall_t;             // start of the open interior along Y
Li    = L - 2*rib_w;        // interior length
Wi    = W - 2*wall_t;       // interior width
cellW = Li / cols;          // cell size along X
cellH = Wi / rows;          // cell size along Y

// ---------------- Modules ----------------

// Shallow web (floor) that closes the base side
module web() {
    cube([L, W, web_t]);
}

// Straight rib between two points in the XY plane
module diag_rib(ax, ay, bx, by, w, h) {
    dx = bx - ax;
    dy = by - ay;
    translate([ax, ay, 0])
        rotate([0, 0, atan2(dy, dx)])
            translate([0, -w/2, 0])
                cube([norm([dx, dy]), w, h]);
}

// Rib network: end ribs, cross ribs and corner diagonals
module ribs() {
    // short-edge (end) ribs
    cube([rib_w, W, rib_h]);
    translate([L - rib_w, 0, 0]) cube([rib_w, W, rib_h]);

    // longitudinal cross ribs
    for (i = [1 : cols - 1])
        translate([x0 + i*cellW - rib_w/2, y0, 0])
            cube([rib_w, Wi, rib_h]);

    // transverse cross rib through the middle
    translate([x0, W/2 - rib_w/2, 0]) cube([Li, rib_w, rib_h]);

    // diagonal ribs in the four corner cells
    diag_rib(x0,      y0,      x0 + cellW,      y0 + cellH,      rib_w, rib_h);
    diag_rib(x0 + Li, y0,      x0 + Li - cellW, y0 + cellH,      rib_w, rib_h);
    diag_rib(x0,      y0 + Wi, x0 + cellW,      y0 + Wi - cellH, rib_w, rib_h);
    diag_rib(x0 + Li, y0 + Wi, x0 + Li - cellW, y0 + Wi - cellH, rib_w, rib_h);
}

// Two long side walls added along opposite edges (solid, higher than web)
module side_walls() {
    cube([L, wall_t, wall_h]);
    translate([0, W - wall_t, 0]) cube([L, wall_t, wall_h]);
}

// Circular openings cut through the web in the open cells
module openings() {
    for (c = [1 : cols - 2], r = [0 : rows - 1])
        translate([x0 + (c + 0.5)*cellW, y0 + (r + 0.5)*cellH, -1])
            cylinder(h = web_t + 2, d = hole_d);
}

// ---------------- Assembly ----------------
difference() {
    union() {
        web();          // thin base web
        ribs();         // perimeter + cross + diagonal ribs
        side_walls();   // raised long side walls
    }
    openings();         // voids: open cells stay empty, holes go through the base
}