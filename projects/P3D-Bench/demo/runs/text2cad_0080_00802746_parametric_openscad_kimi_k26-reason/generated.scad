// Parametric stepped cylindrical part with shared shoulder at Z=0
$fn = 100;

// --- Main solid dimensions ---
POS_RADIUS = 0.1875;          // Radius of positive-side round sections
NEG_RADIUS = 0.1875;          // Radius of negative-side round section
POS_REACH_PRIMARY = 0.5625;   // Upper solid section reach from shoulder
POS_REACH_TOTAL = 0.9375;     // Extended positive reach to enclose deepest voids
NEG_REACH = 0.5625;           // Negative solid section reach from shoulder

// --- Positive side voids ---
POS_HOLE_LARGE_R = 0.0975;    // Larger circular removal radius
POS_HOLE_SMALL_R = 0.0534;    // Smaller separate circular removal radius
POS_HOLE_REACH = 0.9375;      // Reach of both positive holes from shoulder

// --- Negative side voids ---
NEG_HOLE_R = 0.0562;          // Central circular removal radius
NEG_HOLE_REACH = 0.375;       // Reach of central hole from shoulder

NEG_RECESS1_OR = 0.1162;      // Outer radius of first annular recess
NEG_RECESS1_IR = 0.0562;      // Inner radius of first annular recess
NEG_RECESS2_OR = 0.075;       // Outer radius of second annular recess
NEG_RECESS2_IR = 0.0562;      // Inner radius of second annular recess
NEG_RECESS_REACH = 0.0562;    // Reach of both shallow annular recesses from shoulder

// --- Main body: union of positive and negative round solids ---
module body() {
    union() {
        // Explicit upper round solid section per specification
        cylinder(h = POS_REACH_PRIMARY, r = POS_RADIUS);
        // Extension to contain positive-side holes reaching 0.9375
        cylinder(h = POS_REACH_TOTAL, r = POS_RADIUS);
        // Second attached solid circular section on negative side
        translate([0, 0, -NEG_REACH])
            cylinder(h = NEG_REACH, r = NEG_RADIUS);
    }
}

// --- Positive side voids: circular removals reaching from shoulder ---
module positive_voids() {
    // Large circular removal
    cylinder(h = POS_HOLE_REACH, r = POS_HOLE_LARGE_R);
    // Smaller separate circular removal (coaxial, nested inside large)
    cylinder(h = POS_HOLE_REACH, r = POS_HOLE_SMALL_R);
}

// --- Negative side voids: central hole and shallow annular recesses ---
module negative_voids() {
    // Central circular removal
    translate([0, 0, -NEG_HOLE_REACH])
        cylinder(h = NEG_HOLE_REACH, r = NEG_HOLE_R);

    // Shallow annular recess 1 (ring between IR and OR)
    translate([0, 0, -NEG_RECESS_REACH])
        difference() {
            cylinder(h = NEG_RECESS_REACH, r = NEG_RECESS1_OR);
            // Slightly taller inner plug to ensure clean subtraction
            cylinder(h = NEG_RECESS_REACH + 0.01, r = NEG_RECESS1_IR);
        }

    // Shallow annular recess 2 (ring between IR and OR)
    translate([0, 0, -NEG_RECESS_REACH])
        difference() {
            cylinder(h = NEG_RECESS_REACH, r = NEG_RECESS2_OR);
            cylinder(h = NEG_RECESS_REACH + 0.01, r = NEG_RECESS2_IR);
        }
}

// --- Build part by subtracting all voids from the main body ---
difference() {
    body();
    positive_voids();
    negative_voids();
}