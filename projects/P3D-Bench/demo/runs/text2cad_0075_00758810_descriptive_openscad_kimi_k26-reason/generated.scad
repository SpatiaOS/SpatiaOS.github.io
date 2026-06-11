// Resolution for curved surfaces
$fn = 100;

// --- Base dimensions ---
base_length = 80;       // Overall length including curved ends
base_width  = 50;       // Width (also diameter of curved ends)
base_thick  = 15;       // Base thickness

// --- Collar dimensions ---
collar_od = 24;         // Outer diameter of raised collar
collar_id = 12;         // Internal bore diameter (same as upper bore)
collar_h  = 6;          // Height of collar above base

// --- Through-hole depth tiers ---
// The collar bore extends into the base before opening into the larger lower tier.
bore_into_base = 4;                     // Extension of small bore past collar into base
bore_depth     = collar_h + bore_into_base; // Total small-diameter depth from top face
step_dia       = 20;                    // Larger diameter of lower stepped continuation
step_height    = base_thick - bore_into_base; // Height of lower tier from underside up

// --- Side recesses ---
side_rec_d      = 6;    // Diameter of side recesses
side_rec_depth  = 3;    // Shallow depth
side_rec_z      = base_thick / 2;
side_rec_x      = [-12, 12]; // Positions along X on flat sides

// --- Underside circular pattern ---
us_cut_d     = 8;       // Diameter of bottom circular cuts
us_cut_depth = 2;       // Shallow depth
us_count     = 6;       // Number of cuts in polar pattern
us_radius    = 22;      // Radius from center (clears stepped hole)

// --- Base solid (stadium / capsule shape with curved ends) ---
module base_solid() {
    linear_extrude(height = base_thick)
        hull() {
            translate([-(base_length - base_width) / 2, 0]) circle(d = base_width);
            translate([ (base_length - base_width) / 2, 0]) circle(d = base_width);
        }
}

// --- Raised annular collar ---
module collar_solid() {
    translate([0, 0, base_thick])
        cylinder(h = collar_h, d = collar_od);
}

// --- Upper bore (through collar and partially into base) ---
module upper_bore() {
    translate([0, 0, base_thick + collar_h - bore_depth])
        cylinder(h = bore_depth + 0.1, d = collar_id);
}

// --- Lower stepped cut (larger diameter continuing to underside) ---
module lower_stepped_cut() {
    translate([0, 0, -0.05])
        cylinder(h = step_height + 0.1, d = step_dia);
}

// --- Small shallow side recesses on flat lateral faces ---
module side_recesses() {
    for (x = side_rec_x)
        for (y_sign = [-1, 1])
            let(angle = y_sign == 1 ? 90 : -90)
            translate([x, y_sign * base_width / 2, side_rec_z])
            rotate([angle, 0, 0])
            cylinder(h = side_rec_depth + 0.1, d = side_rec_d);
}

// --- Shallow circular pattern on underside ---
module underside_pattern() {
    for (i = [0 : us_count - 1])
        let(a = i * 360 / us_count)
        translate([us_radius * cos(a), us_radius * sin(a), -0.05])
        cylinder(h = us_cut_depth + 0.1, d = us_cut_d);
}

// --- Main assembly ---
difference() {
    union() {
        base_solid();
        collar_solid();
    }
    // Remove through-hole tiers (real opening, not surface mark)
    upper_bore();
    lower_stepped_cut();
    // Remove side and bottom circular features
    side_recesses();
    underside_pattern();
}