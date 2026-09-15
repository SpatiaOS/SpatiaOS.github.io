// ---------------- Parameters ----------------
// Main reference body
L = 0.702127;     // length  (X)
W = 0.524964;     // width   (Y)
H = 0.210295;     // height  (Z)

// Top rectangular recess (open at the top face)
r1_x = 0.0171;    r1_y = 0.0172;    r1_z = 0.1888;
r1_dx = 0.667793; r1_dy = 0.490631;

// Second contained cut below the top recess
r2_x = 0.0257;    r2_y = 0.0300;    r2_z = 0.0729;
r2_dx = 0.650626; r2_dy = 0.464880;

// Lower offset pocket (non-through, bottom thickness 0.0215)
r3_x = 0.0999;    r3_y = 0.0386;    r3_z = 0.0215;
r3_dx = 0.567882; r3_dy = 0.447713; r3_dz = 0.0515;

// Solid side projection overhanging the left length edge
p_x = -0.0479;    p_y = 0.0300;     p_z = 0.0730;
p_dx = 0.130618;  p_dy = 0.463588;  p_dz = 0.0146;

// Side recess cut into the left edge
s_x = 0.0000;     s_y = 0.0546;     s_z = 0.0876;
s_dx = 0.0343;    s_dy = 0.367400;  s_dz = 0.101285;

eps = 0.001;      // overshoot to guarantee clean boolean cuts
$fn = 64;

// ---------------- Model ----------------
difference() {
    // Body plus the added solid side projection
    union() {
        cube([L, W, H]);
        translate([p_x, p_y, p_z])
            cube([p_dx, p_dy, p_dz]);
    }

    // 1) Shallow top recess (overshoot above the top face)
    translate([r1_x, r1_y, r1_z])
        cube([r1_dx, r1_dy, H - r1_z + eps]);

    // 2) Contained continuation cut down to the lower band
    translate([r2_x, r2_y, r2_z])
        cube([r2_dx, r2_dy, r1_z - r2_z + eps]);

    // 3) Lower offset rectangular pocket
    translate([r3_x, r3_y, r3_z])
        cube([r3_dx, r3_dy, r3_dz + eps]);

    // 4) Side recess from the left edge (overshoot past the edge)
    translate([s_x - eps, s_y, s_z])
        cube([s_dx + eps, s_dy, s_dz]);
}