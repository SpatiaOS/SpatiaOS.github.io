// OpenSCAD model of an overlapping cylindrical body with side branch, stepped bore,
// annular reliefs, deep through cuts, and small radial recesses.
// All dimensions defined parametrically.

// --- Core dimensions ---
$fn = 100;
body_d  = 40;    // main vertical cylinder diameter
body_h  = 60;    // main cylinder overall height
bore_d  = 20;    // main central bore diameter (blind)
bore_depth   = 40;   // depth of main bore from top
cbore_d = 28;    // larger counterbore diameter (stepped recess)
cbore_depth = 15;    // depth of counterbore from top

// --- Side cylinder ---
side_d  = 20;    // diameter of horizontal side cylinder
side_len = 30;   // protrusion length
side_z   = 20;   // height of side cylinder axis from base
side_x   = body_d/2 - side_d/3;  // x-coordinate to ensure intersection with main body

// --- Bottom annular relief (shallow ring groove) ---
ann_inner_d = 24;
ann_outer_d = 36;
ann_depth   = 4;

// --- Deep cut from bottom (penetrates into side cylinder cavity) ---
deep_d  = 12;
deep_x  = body_d/2 - side_d/2 + 2; // offset to intersect side hole
deep_z  = side_z + side_d/2 + 5;   // depth from bottom through intersection

// --- Through hole along side cylinder axis ---
side_hole_d     = 8;
side_hole_depth = side_len + 5; // drill from outer end inward

// --- Small radial blind holes around main body ---
radial_hole_d       = 5;
radial_hole_depth   = 8;
radial_hole_count   = 6;
radial_hole_z       = body_h - 10;

// ------------------- Modules -------------------

// Main vertical cylinder
module main_body() {
    cylinder(d = body_d, h = body_h, center = false);
}

// Side cylinder protruding horizontally
module side_cylinder() {
    translate([side_x, 0, side_z])
        rotate([0, 90, 0])
            cylinder(d = side_d, h = side_len, center = false);
}

// Stepped inner bore (blind main bore + larger counterbore)
module inner_bore() {
    // main bore
    translate([0, 0, body_h - bore_depth])
        cylinder(d = bore_d, h = bore_depth + 0.1, center = false);
    // counterbore
    translate([0, 0, body_h - cbore_depth])
        cylinder(d = cbore_d, h = cbore_depth + 0.1, center = false);
}

// Shallow annular groove on bottom face (to be subtracted)
module annular_relief() {
    difference() {
        cylinder(d = ann_outer_d, h = ann_depth + 0.1, center = false);
        cylinder(d = ann_inner_d, h = ann_depth + 0.1, center = false);
    }
}

// Deep circular cut rising from bottom
module deep_cut() {
    translate([deep_x, 0, 0])
        cylinder(d = deep_d, h = deep_z + 0.1, center = false);
}

// Hole drilled along the side cylinder axis (from outer end inward)
module side_hole() {
    translate([side_x + side_len, 0, side_z])
        rotate([0, 90, 0])
            cylinder(d = side_hole_d, h = side_hole_depth, center = false);
}

// Array of small radial blind holes around main body
module radial_holes() {
    for (i = [0 : 360 / radial_hole_count : 359]) {
        rotate([0, 0, i])
            translate([body_d/2, 0, radial_hole_z])
                rotate([0, -90, 0])      // drill inward along radial direction
                    cylinder(d = radial_hole_d, h = radial_hole_depth + 0.1, center = false);
    }
}

// ------------------- Final Model -------------------
difference() {
    union() {
        main_body();
        side_cylinder();
    }
    inner_bore();       // stepped central bore
    annular_relief();   // shallow bottom groove
    deep_cut();         // deep cross‑cut from bottom
    side_hole();        // through hole in side branch
    radial_holes();     // small blind radial recesses
}