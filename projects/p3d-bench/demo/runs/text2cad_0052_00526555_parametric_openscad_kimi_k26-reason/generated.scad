// Parametric dimensions
length = 0.75;                  // Overall length (X)
width = 5/7;                    // Overall width (Y) = 0.714286
height = 0.25;                  // Overall height (Z)
main_depth = 0.25;              // Depth of side portions from front face

// Stepped footprint geometry
side_width = length / 3;        // Width of each shallow side region = 0.25
center_start = side_width;      // X start of deep center region = 0.25
center_end = 2 * side_width;    // X end of deep center region = 0.5

// Upper through-opening
hole_x = length / 2;            // Axis 0.375 from left edge
hole_y = 15/28;                 // Axis 0.5357 from front edge
hole_r = 5/56;                  // Radius 0.0893

// Front blind cylindrical cuts
fh1_x = 5/56;                   // Axis 0.0893 from left edge
fh2_x = 37/56;                  // Axis 0.6607 from left edge
fh_z = height / 2;              // Center height 0.125
fh_r = 11/224;                  // Radius 0.0491
fh_depth = 3/28;                // Blind cut depth 0.1071

$fn = 100;

// Main solid: stepped footprint extruded vertically
// Side portions extend to main_depth; center rib extends to full width
module stepped_block() {
    linear_extrude(height = height, convexity = 4)
        polygon([
            [0, 0],
            [length, 0],
            [length, main_depth],
            [center_end, main_depth],
            [center_end, width],
            [center_start, width],
            [center_start, main_depth],
            [0, main_depth]
        ]);
}

// Upper through-hole (vertical, cuts through full height)
module upper_through_hole() {
    translate([hole_x, hole_y, -0.001])
        cylinder(h = height + 0.002, r = hole_r);
}

// Front blind hole (horizontal, into +Y from front face)
module front_blind_hole(x_pos) {
    translate([x_pos, -0.001, fh_z])
        rotate([-90, 0, 0])
            cylinder(h = fh_depth + 0.001, r = fh_r);
}

// Final part with all features subtracted
difference() {
    stepped_block();
    upper_through_hole();
    front_blind_hole(fh1_x);
    front_blind_hole(fh2_x);
}