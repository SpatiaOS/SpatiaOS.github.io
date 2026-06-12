// ==========================================
// Parametric Annular Rim with Hollow Collar,
// Radial Ribs, and Stepped Underside Relief
// ==========================================

// --- Resolution ---
$fn = 100;

// --- Outer Annular Rim ---
outer_ring_od       = 100;   // overall outer diameter
outer_ring_id       = 70;    // inner diameter of rim (start of window zone)
outer_ring_depth    = 10;    // full depth of the main outer rim

// --- Hollow Collar (central hub) ---
collar_od           = 30;    // outer diameter of collar
collar_id           = 15;    // bore diameter (hollow center)
web_depth           = 6;     // shallower depth for collar and ribs

// --- Radial Ribs ---
rib_count           = 6;     // number of solid radial ribs
rib_width           = 8;     // circumferential width of each rib

// --- Tolerance overlap for clean unions ---
overlap             = 0.1;

// --- Derived radii ---
outer_ring_or       = outer_ring_od / 2;
outer_ring_ir       = outer_ring_id / 2;
collar_or           = collar_od / 2;
collar_ir           = collar_id / 2;

// ==========================================
// Modules
// ==========================================

// Main outer rim: deep annular ring
module outer_rim() {
    difference() {
        // solid outer cylinder, centered on z so top face is at z = 0
        translate([0, 0, -outer_ring_depth / 2])
            cylinder(h = outer_ring_depth, r = outer_ring_or);
        // subtract inner hole (extend slightly for robust difference)
        translate([0, 0, -outer_ring_depth / 2 - overlap])
            cylinder(h = outer_ring_depth + 2 * overlap, r = outer_ring_ir);
    }
}

// Hollow collar: shallower concentric ring
module collar() {
    difference() {
        translate([0, 0, -web_depth / 2])
            cylinder(h = web_depth, r = collar_or);
        // bore through collar
        translate([0, 0, -web_depth / 2 - overlap])
            cylinder(h = web_depth + 2 * overlap, r = collar_ir);
    }
}

// Single radial rib: shallow web connecting collar to rim
module rib(angle) {
    // radial length from collar outer edge to rim inner edge
    rib_length = outer_ring_ir - collar_or + 2 * overlap;
    mid_radius = (outer_ring_ir + collar_or) / 2;

    rotate([0, 0, angle])
        translate([mid_radius, 0, -web_depth / 2])
            cube([rib_length, rib_width, web_depth], center = true);
}

// Array of ribs spaced evenly around the axis
module all_ribs() {
    for (i = [0 : rib_count - 1]) {
        rib(i * 360 / rib_count);
    }
}

// ==========================================
// Assembly
// ==========================================

union() {
    // deepest tier: outer annular rim
    outer_rim();

    // shallower tier: central hollow collar
    collar();

    // shallower tier: solid radial ribs bridging collar and rim,
    // leaving rounded slot-like window spaces between them
    all_ribs();
}