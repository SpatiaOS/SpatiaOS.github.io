// ============================================================
// Open-web ribbed plate with two raised side walls
// Stepped section: shallow web, tall solid walls (same base)
// ============================================================

// ---------------- Parameters ----------------
part_L  = 120;   // overall length (X)
part_W  = 80;    // overall width (Y)
web_t   = 4;     // thin web thickness (shallow step)
wall_t  = 6;     // side wall thickness
wall_h  = 24;    // side wall height from common base plane (tall step)
frame_w = 6;     // perimeter frame width
rib_w   = 4;     // cross / diagonal rib width
ring_w  = 4;     // reinforcement ring width around circular openings
hole_d  = 22;    // circular opening diameter (through the web)
n_hx    = 2;     // number of openings along X
n_hy    = 2;     // number of openings along Y
ov      = 1;     // overlap so ribs merge into the frame
$fn     = 100;

// ---------------- Derived dimensions ----------------
inner_L  = part_L - 2*frame_w;              // clear length inside frame
inner_W  = part_W - 2*frame_w;              // clear width inside frame
diag_len = sqrt(inner_L*inner_L + inner_W*inner_W); // diagonal rib length
diag_ang = atan2(inner_W, inner_L);         // diagonal rib angle
sx = inner_L / n_hx;                        // opening pitch X
sy = inner_W / n_hy;                        // opening pitch Y

// Opening center coordinates (centered grid)
function hx(i) = (i - (n_hx-1)/2) * sx;
function hy(j) = (j - (n_hy-1)/2) * sy;

// ---------------- Modules ----------------

// Perimeter frame of the open web (rectangular ring, no slab)
module perimeter_frame() {
    difference() {
        cube([part_L, part_W, web_t], center=true);
        cube([inner_L, inner_W, web_t + 2], center=true);
    }
}

// Orthogonal (cross) ribs spanning the inner area
module cross_ribs() {
    cube([inner_L + 2*ov, rib_w, web_t], center=true);  // along X
    cube([rib_w, inner_W + 2*ov, web_t], center=true);  // along Y
}

// Diagonal ribs (X-brace corner to corner)
module diagonal_ribs() {
    for (s = [1, -1])
        rotate([0, 0, s*diag_ang])
            cube([diag_len + 2*ov, rib_w, web_t], center=true);
}

// Annular reinforcement ring around one circular opening
module hole_ring(x, y) {
    translate([x, y, 0])
        difference() {
            cylinder(h = web_t,     d = hole_d + 2*ring_w, center = true);
            cylinder(h = web_t + 2, d = hole_d,            center = true);
        }
}

// Shallow open web: frame + ribs + rings; all cells stay void
module web() {
    translate([0, 0, web_t/2])
    difference() {
        union() {
            perimeter_frame();
            cross_ribs();
            diagonal_ribs();
            for (i = [0:n_hx-1], j = [0:n_hy-1])
                hole_ring(hx(i), hy(j));
        }
        // Guarantee the circular loops pass cleanly through the web
        for (i = [0:n_hx-1], j = [0:n_hy-1])
            translate([hx(i), hy(j), 0])
                cylinder(h = web_t + 2, d = hole_d, center = true);
    }
}

// Two long side walls: added solid material along opposite edges
module side_walls() {
    for (s = [-1, 1])
        translate([0, s*(part_W/2 - wall_t/2), wall_h/2])
            cube([part_L, wall_t, wall_h], center=true);
}

// ---------------- Assembly ----------------
union() {
    color("silver") web();         // shallow open web
    color("gray")   side_walls();  // raised solid side walls
}