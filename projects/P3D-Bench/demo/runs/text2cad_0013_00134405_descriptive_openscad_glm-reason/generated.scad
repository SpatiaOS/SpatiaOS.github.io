// ============================================================
// Annular Rim with Collar, Radial Ribs & Stepped Profile
// ============================================================

// --- Outer Rim (tallest tier) ---
outer_r         = 42;      // Outer radius of the rim
rim_width       = 10;      // Radial width of the outer rim wall
rim_height      = 14;      // Full height of outer rim

// --- Central Collar (shorter tier) ---
collar_outer_r  = 18;      // Outer radius of the collar
collar_inner_r  = 10;      // Center bore radius (open center)
collar_height   = 7;       // Height of collar (shorter than rim)

// --- Radial Ribs (shorter tier, same as collar) ---
num_ribs        = 6;        // Number of radial ribs
rib_angular_w   = 16;       // Angular width of each rib (degrees)
rib_height      = 7;        // Height of rib web (matches collar tier)

// --- Window Slot Corner Radius ---
slot_corner_r   = 2.5;      // Corner radius on rib edges / window slots

// --- Resolution ---
$fn = 120;

// Derived: inner edge of the outer rim
rim_inner_r = outer_r - rim_width;

// ---------------------------------------------------------
// Module: 2D rib profile with rounded corners
// Creates a sector-like shape spanning from r_in to r_out
// with the given angular width and corner radius.
// The rounded corners produce the slot-like window spaces
// between adjacent ribs.
// ---------------------------------------------------------
module rib_profile(r_in, r_out, ang_width, cr) {
    half_aw = ang_width / 2;
    hull() {
        for (r = [r_in, r_out]) {
            for (a = [-half_aw, half_aw]) {
                translate([r * cos(a), r * sin(a)])
                    circle(r = cr, $fn = 36);
            }
        }
    }
}

// ---------------------------------------------------------
// Main Model Assembly
// ---------------------------------------------------------
union() {
    // 1) Outer rim — tall annular ring, open center
    difference() {
        cylinder(r = outer_r, h = rim_height);
        translate([0, 0, -0.05])
            cylinder(r = rim_inner_r, h = rim_height + 0.1);
    }

    // 2) Central collar — shorter concentric annular ring, open bore
    difference() {
        cylinder(r = collar_outer_r, h = collar_height);
        translate([0, 0, -0.05])
            cylinder(r = collar_inner_r, h = collar_height + 0.1);
    }

    // 3) Radial ribs — connect collar to rim at the shorter tier
    //    Rounded corners on the rib profiles create the rounded
    //    slot-like window spaces between adjacent ribs.
    for (i = [0 : num_ribs - 1]) {
        rotate([0, 0, i * 360 / num_ribs])
            linear_extrude(height = rib_height)
                rib_profile(
                    r_in      = collar_outer_r,
                    r_out     = rim_inner_r,
                    ang_width = rib_angular_w,
                    cr        = slot_corner_r
                );
    }
}