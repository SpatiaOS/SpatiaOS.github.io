// =============================================
// Bevel Gear Assembly
// Three bevel gears with coaxial shaft pins
// converging toward a common mesh zone
// =============================================

$fn = 80;

// --- Gear Tooth Parameters ---
gear_mod   = 3.75;               // module (mm)
addendum   = gear_mod;            // tooth addendum
dedendum   = 1.25 * gear_mod;     // tooth dedendum

// --- Small Bevel Gear ---
small_teeth     = 24;
small_pitch_r   = small_teeth * gear_mod / 2;  // 45 mm
small_cone_ang  = atan(small_teeth / 40);       // ~30.96°
small_face_w    = 20;
small_bore_d    = 28.8;
small_hub_dia   = 44;
small_hub_ht    = 18;

// --- Large Bevel Gear (2 instances) ---
large_teeth     = 40;
large_pitch_r   = large_teeth * gear_mod / 2;  // 75 mm
large_cone_ang  = atan(large_teeth / small_teeth); // ~59.04°
large_face_w    = 25;
large_bore_d    = 67.748;
large_hub_dia   = 82;
large_hub_ht    = 18;

// --- Shared Cone Distance ---
cone_dist = large_pitch_r / sin(large_cone_ang); // ~87.5 mm

// --- Axial Offsets (apex to gear big-end along axis) ---
large_ax_off = cone_dist * cos(large_cone_ang);  // ~45 mm
small_ax_off = cone_dist * cos(small_cone_ang);  // ~75 mm

// --- Pin / Shaft Dimensions ---
small_pin_d     = 28.8;
small_pin_len   = 120;
small_pin_ovlap = 30.6;

pin_a_d         = 67.74;
pin_a_len       = 175;
pin_a_ovlap     = 10.6;

pin_b_d         = 67.74;
pin_b_len       = 100;
pin_b_ovlap     = 10.6;


// ===========================================
// 2D Gear Tooth Profile (trapezoid approx.)
// ===========================================
module gear_profile_2d(num_teeth, pitch_r) {
    tip_r  = pitch_r + addendum;
    root_r = pitch_r - dedendum;
    pitch_ang = 360 / num_teeth;
    tip_half  = pitch_ang * 0.16;   // half-width at tip
    root_half = pitch_ang * 0.26;   // half-width at root

    union() {
        circle(r = root_r, $fn = num_teeth * 4);
        for (i = [0 : num_teeth - 1]) {
            a = i * pitch_ang;
            polygon([
                [root_r * cos(a - root_half), root_r * sin(a - root_half)],
                [tip_r  * cos(a - tip_half),  tip_r  * sin(a - tip_half)],
                [tip_r  * cos(a + tip_half),  tip_r  * sin(a + tip_half)],
                [root_r * cos(a + root_half), root_r * sin(a + root_half)]
            ]);
        }
    }
}


// ===========================================
// Bevel Gear Body
// Big-end at z=0, teeth taper toward +Z
// Hub extends in -Z direction
// ===========================================
module bevel_gear(nt, pr, ca, fw, bd, hd, hh) {
    sc = (cone_dist - fw) / cone_dist;  // taper scale factor
    ht = fw * cos(ca);                   // axial tooth height
    rr = pr - dedendum;                  // root radius at big end

    difference() {
        union() {
            // Tapered toothed rim
            linear_extrude(height = ht, scale = sc, convexity = 10)
                gear_profile_2d(nt, pr);

            // Cylindrical hub
            translate([0, 0, -hh])
                cylinder(h = hh + 0.01, d = hd);
        }

        // Through bore
        translate([0, 0, -hh - 1])
            cylinder(h = ht + hh + 2, d = bd);

        // Interior recess between hub and rim (web effect)
        translate([0, 0, -0.01])
            cylinder(h = ht * 0.45,
                     r1 = hd / 2 + 5,
                     r2 = rr * sc * 0.35);
    }
}


// ===========================================
// Combined Gear + Shaft Unit
// ===========================================
module gear_with_shaft(nt, pr, ca, fw, bd, hd, hh, pd, pl, po) {
    // Gear body
    bevel_gear(nt, pr, ca, fw, bd, hd, hh);

    // Coaxial shaft/pin (positioned so overlap into bore = po)
    translate([0, 0, -hh + po - pl])
        cylinder(h = pl, d = pd);
}


// ===========================================
// ASSEMBLY
// ===========================================

// --- Large Gear A ---
// Center-bottom position, axis along -Z, shaft extends downward
translate([0, 0, -large_ax_off])
    gear_with_shaft(
        large_teeth, large_pitch_r, large_cone_ang, large_face_w,
        large_bore_d, large_hub_dia, large_hub_ht,
        pin_a_d, pin_a_len, pin_a_ovlap
    );

// --- Large Gear B ---
// Right-side position, axis along +X, shaft extends to the right
rotate([0, -90, 0])
translate([0, 0, -large_ax_off])
    gear_with_shaft(
        large_teeth, large_pitch_r, large_cone_ang, large_face_w,
        large_bore_d, large_hub_dia, large_hub_ht,
        pin_b_d, pin_b_len, pin_b_ovlap
    );

// --- Small Gear ---
// Upper-left position, axis perpendicular to both large gears
// Rotation maps +Z toward (0.707, -0.707, 0), placing body upper-left
rotate(a = 90, v = [1, 1, 0])
translate([0, 0, -small_ax_off])
    gear_with_shaft(
        small_teeth, small_pitch_r, small_cone_ang, small_face_w,
        small_bore_d, small_hub_dia, small_hub_ht,
        small_pin_d, small_pin_len, small_pin_ovlap
    );