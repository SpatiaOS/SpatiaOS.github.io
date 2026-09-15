// ============================================================
// Open-Web Base Plate with Raised Side Walls
// A shallow lattice web (perimeter frame + cross + diagonal
// ribs, with circular openings) and two taller solid side
// walls along the long edges.
// ============================================================

// ---------------- Parameters ----------------
L        = 140;  // overall length of the web (X)
W        = 80;   // overall width of the web (Y)
t_web    = 5;    // web (rib) thickness in Z
frame    = 6;    // perimeter frame rib width
rib      = 5;    // internal cross-rib width
wall_t   = 6;    // side wall thickness
wall_h   = 25;   // side wall height (greater than web)
hole_d   = 14;   // diameter of circular openings
$fn      = 80;   // curve resolution

// Derived geometry for the quadrant layout
x_inner  = L/2 + rib/2;   // inner edge of central transverse rib
x_outer  = L - frame;     // inner edge of perimeter frame
y_inner  = W/2 + rib/2;   // inner edge of central longitudinal rib
y_outer  = W - frame;     // inner edge of perimeter frame
dx       = x_outer - x_inner;              // quadrant span in X
dy       = y_outer - y_inner;              // quadrant span in Y
diag_len = sqrt(dx*dx + dy*dy);            // diagonal rib length
diag_ang = atan2(dy, dx);                  // diagonal rib angle

// ---------------- 2D Web Profile ----------------
// Perimeter frame: outer rectangle minus inset rectangle
module perimeter_frame() {
    difference() {
        square([L, W]);
        translate([frame, frame])
            square([L - 2*frame, W - 2*frame]);
    }
}

// Diagonal rib in the +X/+Y quadrant (mirrored for the others)
module diagonal_rib() {
    mid = [(x_inner + x_outer)/2, (y_inner + y_outer)/2];
    translate(mid)
        rotate(diag_ang)
            square([diag_len, rib], center=true);
}

// Full web profile: frame + central cross ribs + 4 diagonals
module web_profile() {
    union() {
        perimeter_frame();
        // central longitudinal rib (along X)
        translate([0, W/2 - rib/2]) square([L, rib]);
        // central transverse rib (along Y)
        translate([L/2 - rib/2, 0]) square([rib, W]);
        // diagonal ribs in all four quadrants
        diagonal_rib();
        mirror([1, 0]) diagonal_rib();
        mirror([0, 1]) diagonal_rib();
        mirror([1, 0]) mirror([0, 1]) diagonal_rib();
    }
}

// ---------------- Circular Openings ----------------
// Through-holes at the center of each quadrant
module circular_openings() {
    cx = (x_inner + x_outer)/2;
    cy = (y_inner + y_outer)/2;
    for (sx = [-1, 1], sy = [-1, 1])
        translate([L/2 + sx*cx, W/2 + sy*cy, -1])
            cylinder(h = t_web + 2, d = hole_d);
}

// ---------------- Raised Side Walls ----------------
// Solid walls along the two long edges (Y = 0 and Y = W)
module side_walls() {
    translate([0, 0, 0])          cube([L, wall_t, wall_h]);
    translate([0, W - wall_t, 0]) cube([L, wall_t, wall_h]);
}

// ---------------- Assemble Part ----------------
difference() {
    union() {
        // shallow open web: extruded rib profile
        linear_extrude(height = t_web)
            web_profile();
        // tall side walls on the same base side
        side_walls();
    }
    // circular openings pass completely through the web
    circular_openings();
}