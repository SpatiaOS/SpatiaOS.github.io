// === Parameters ===

// Base dimensions
base_length     = 80;    // overall length (X)
base_width      = 50;    // overall width (Y), also 2× corner radius for full round ends
base_height     = 12;    // base thickness (Z)
base_corner_r   = 25;    // end rounding radius (= base_width/2 for pill shape)

// Raised collar on top face
collar_od       = 32;    // collar outer diameter
collar_id       = 18;    // collar inner bore diameter
collar_height   = 10;    // collar height above base top

// Stepped through-bore
bore_upper_d    = 18;    // upper bore diameter (matches collar_id)
bore_lower_d    = 11;    // narrower lower bore diameter
bore_step_z     = 4;     // Z height where the step occurs (measured from base bottom)

// Side recesses (small cylindrical pockets on long edges)
side_recess_d     = 7;   // recess diameter
side_recess_depth = 2.5; // how deep into the side wall
num_side_recesses = 3;   // count per side
side_recess_z     = base_height / 2; // vertical centre of recesses

// Underside circular pockets
under_cut_d       = 9;   // pocket diameter
under_cut_depth   = 2.5; // pocket depth into base bottom
num_under_cuts    = 6;   // total pockets arranged on a ring
under_cut_orbit_r = 22;  // ring radius for pocket centres

// Resolution
$fn = 120;

// === Helper Modules ===

// Pill-shaped (stadium) base: hull of two end cylinders
module rounded_base(len, wid, h, cr) {
    offset_x = len / 2 - cr;
    hull() {
        translate([-offset_x, 0, 0])
            cylinder(r = cr, h = h);
        translate([ offset_x, 0, 0])
            cylinder(r = cr, h = h);
    }
}

// === Main Assembly ===
difference() {

    // ---- Positive geometry ----
    union() {
        // 1. Thick rounded base with curved ends
        rounded_base(base_length, base_width, base_height, base_corner_r);

        // 2. Raised annular collar centred on base top
        translate([0, 0, base_height])
            cylinder(d = collar_od, h = collar_height);
    }

    // ---- Subtractive geometry ----

    // 3a. Stepped through-bore — upper section
    //     Runs from the step height up through the entire collar
    translate([0, 0, bore_step_z - 0.01])
        cylinder(d = bore_upper_d,
                 h = (base_height - bore_step_z) + collar_height + 0.02);

    // 3b. Stepped through-bore — lower (narrower) section
    //     Runs from bottom face up to the step
    translate([0, 0, -0.01])
        cylinder(d = bore_lower_d, h = bore_step_z + 0.02);

    // 4. Small shallow side recesses along +Y and −Y long edges
    for (side = [1, -1]) {
        for (i = [0 : num_side_recesses - 1]) {
            xi = -((num_side_recesses - 1) / 2) * 18 + i * 18;
            // Cylindrical pocket pointing inward from the edge
            translate([xi, side * (base_corner_r + side_recess_depth), side_recess_z])
                rotate([side * 90, 0, 0])
                    cylinder(d = side_recess_d,
                             h = side_recess_depth + 0.01);
        }
    }

    // 5. Shallow underside circular pocket pattern
    for (i = [0 : num_under_cuts - 1]) {
        angle = i * (360 / num_under_cuts);
        translate([under_cut_orbit_r * cos(angle),
                   under_cut_orbit_r * sin(angle),
                   -0.01])
            cylinder(d = under_cut_d, h = under_cut_depth + 0.01);
    }
}