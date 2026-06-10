// =============================================================================
// Parametric CAD Model - Base, Second Solid, Raised Sleeve, Lower Continuation & Cuts
// =============================================================================

// Global resolution
$fn = 100;

// --- Base & Main Footprint Parameters ---
base_len   = 0.375;
base_wid   = 0.75;
base_ht    = 0.013393;
second_reach = 0.2277;

// --- Raised Sleeve/Post Parameters ---
feat_len   = 0.066964;
feat_wid   = 0.133929;
feat_ht    = 0.214286;
feat_left  = 0.308;
feat_front = 0.308;

// --- Lower Continuation Parameters ---
lower_start_z = -0.2277;
lower_end_z   = -0.0134;
lower_ht      = 0.2143;
lower_inset   = 0.005; // Ensures containment within shallower footprint

// --- Circular Cut Parameters ---
cut_r      = 0.0067;
cut_x      = 0.3616;
cut_y1     = 0.6828;
cut_y2     = 0.0672;
cut_z_mid  = 0.1741; // (0.1674 + 0.1808) / 2
cut_ht     = 0.0134;

// =============================================================================
// Modules
// =============================================================================

// Pill-shaped footprint spanning exact len x wid with 0 edge offsets
module pill_footprint(l, w) {
    hull() {
        circle(r = l/2);
        translate([0, w - l, 0]) circle(r = l/2);
    }
}

// Raised sleeve with central slot/opening (inner loops remain open)
module raised_sleeve(l, w, h, wall = 0.012) {
    difference() {
        cube([l, w, h]);
        translate([wall, wall, -0.01])
            cube([l - 2*wall, w - 2*wall, h + 0.02]);
    }
}

// Lower continuation block sharing right edge, inset on other sides
module lower_continuation(l, w, h, inset) {
    // Positioned to share right edge, contained within parent footprint
    translate([inset, inset, 0])
        cube([l - inset, w - 2*inset, h]);
}

// =============================================================================
// Main Assembly
// =============================================================================
difference() {
    // Union of all positive solid volumes
    union() {
        // 1. Base solid (extruded from datum Z=0)
        translate([0, 0, 0])
            linear_extrude(height = base_ht, convexity = 10)
                pill_footprint(base_len, base_wid);

        // 2. Second upper solid (stacked on base, extends to 0.2277)
        translate([0, 0, base_ht])
            linear_extrude(height = second_reach - base_ht, convexity = 10)
                pill_footprint(base_len, base_wid);

        // 3. Raised sleeve/post feature (sits atop second solid)
        translate([feat_left, feat_front, second_reach])
            raised_sleeve(feat_len, feat_wid, feat_ht);

        // 4. Paired lower continuation (extends below base underside)
        translate([feat_left, feat_front, lower_start_z])
            lower_continuation(feat_len, feat_wid, lower_ht, lower_inset);
    }

    // --- Subtractive Features ---
    // Circular opening 1
    translate([cut_x, cut_y1, cut_z_mid])
        cylinder(r = cut_r, h = cut_ht + 0.002, center = true, $fn = 32);

    // Circular opening 2
    translate([cut_x, cut_y2, cut_z_mid])
        cylinder(r = cut_r, h = cut_ht + 0.002, center = true, $fn = 32);
}