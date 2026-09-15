// =========================================================
//  Yoke-style part: elongated rounded slab base with through
//  holes near the ends, and a crowned upright body with a
//  through bore and stepped-depth circular reliefs.
// =========================================================

// ---- Global resolution ----
$fn = 96;

// ---- Base slab parameters ----
base_len        = 80;    // overall slab length along X
base_w          = 30;    // overall slab width along Y
base_t          = 8;     // slab thickness along Z
base_hole_d     = 6;     // diameter of through holes in slab
base_hole_inset = 12;    // hole center distance from each rounded end

// ---- Upright body parameters ----
up_w      = 20;          // upright width along X (flat lower sides)
up_h      = 45;          // upright height above base top face
up_t      = 12;          // upright thickness along Y
crown_r   = up_w / 2;    // radius of curved crown at upright top

// ---- Cut parameters (stepped depths) ----
bore_d         = 16;     // through bore diameter in upright
bore_z         = base_t + 28;  // bore axis height
relief_d       = bore_d + 8;   // diameter of circular relief around bore
relief_depth_f = 2.5;    // relief reach from front face (partial)
relief_depth_b = 4.0;    // relief reach from back face (partial, deeper)

// ---------------------------------------------------------
// Base slab: elongated plate with fully rounded ends,
// built as the hull of two end cylinders.
// ---------------------------------------------------------
module base_slab() {
    hull() {
        translate([-(base_len/2 - base_w/2), 0, 0])
            cylinder(h = base_t, d = base_w);
        translate([ base_len/2 - base_w/2), 0, 0])
            cylinder(h = base_t, d = base_w);
    }
}

// ---------------------------------------------------------
// Through holes in the slab, placed near each rounded end.
// Drilled with extra height to guarantee a clean cut.
// ---------------------------------------------------------
module base_holes() {
    for (xs = [-(base_len/2 - base_hole_inset),
                (base_len/2 - base_hole_inset)]) {
        translate([xs, 0, -1])
            cylinder(h = base_t + 2, d = base_hole_d);
    }
}

// ---------------------------------------------------------
// Upright solid: flat lower sides and a curved crown.
// Profile is drawn in 2D (X/Y), extruded along Y, then
// rotated so the profile height aligns with world Z.
// ---------------------------------------------------------
module upright_body() {
    translate([0, up_t/2, base_t])
        rotate([90, 0, 0])
            linear_extrude(height = up_t)
                hull() {
                    // flat-sided lower portion
                    translate([-up_w/2, 0])
                        square([up_w, up_h - crown_r]);
                    // rounded crown
                    translate([0, up_h - crown_r])
                        circle(r = crown_r);
                }
}

// ---------------------------------------------------------
// Circular passage through the upright (full depth).
// Axis along Y, slightly overshot for a manifold cut.
// ---------------------------------------------------------
module through_bore() {
    translate([0, 0, bore_z])
        rotate([90, 0, 0])
            cylinder(h = up_t + 2, d = bore_d, center = true);
}

// ---------------------------------------------------------
// Rounded reliefs around the bore on each face, each
// reaching only partway in (stepped cut depths).
// ---------------------------------------------------------
module face_reliefs() {
    // front face relief (shallower reach)
    translate([0, up_t/2, bore_z])
        rotate([90, 0, 0])
            cylinder(h = relief_depth_f + 0.01, d = relief_d);
    // back face relief (deeper reach)
    translate([0, -up_t/2, bore_z])
        rotate([-90, 0, 0])
            cylinder(h = relief_depth_b + 0.01, d = relief_d);
}

// ---------------------------------------------------------
// Main model: solid mass first, then all subtractive cuts.
// ---------------------------------------------------------
difference() {
    // Solid material: slab plus upright
    union() {
        base_slab();
        upright_body();
    }
    // Removed material
    base_holes();     // through holes in slab
    through_bore();   // through passage in upright
    face_reliefs();   // partial-depth rounded reliefs in upper body
}