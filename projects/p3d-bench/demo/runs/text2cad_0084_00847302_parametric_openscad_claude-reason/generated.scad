// === Parameters ===

// Outer enclosure dimensions
outer_length = 0.75;       // X dimension
outer_width  = 0.625;      // Y dimension
outer_height = 0.55;       // Z dimension

// Wall / floor thickness (shared by all sides)
wall_t = 0.075;

// Front wall cut: horizontal rectangular notch in front face
front_cut_len     = 0.5;    // X span of cut
front_cut_margin  = 0.125;  // X margin each side
front_cut_depth   = 0.075;  // Y depth inward from front face
front_cut_z_lo    = 0.25;   // Z lower bound
front_cut_z_hi    = 0.45;   // Z upper bound

// Left side opening: vertical rectangular notch in left face
left_cut_depth    = 0.075;  // X depth inward from left face
left_cut_span     = 0.225;  // Y span along side wall
left_cut_y_margin = 0.2;    // Y margin front and back
left_cut_z_hi     = 0.5;    // Z upper bound (starts at 0)

// Internal ledge along front inside region
ledge_len      = 0.5;       // X span
ledge_width    = 0.1;       // Y depth into interior
ledge_thick    = 0.0125;    // Z thickness (shallow tier)
ledge_x_margin = 0.125;     // X margin each side

// Tolerance for clean boolean cuts
eps = 0.001;

// === Modules ===

// Outer shell with inner void (open-top box)
module hollow_box() {
    difference() {
        // Solid outer body
        cube([outer_length, outer_width, outer_height]);

        // Rectangular inner void – extends past top for open-top effect
        translate([wall_t, wall_t, wall_t])
            cube([outer_length - 2 * wall_t,
                  outer_width  - 2 * wall_t,
                  outer_height - wall_t + eps]);
    }
}

// Front wall cut (centered horizontally, partial height band)
module front_wall_cut() {
    translate([front_cut_margin, -eps, front_cut_z_lo])
        cube([front_cut_len,
              front_cut_depth + eps,
              front_cut_z_hi - front_cut_z_lo]);
}

// Left side opening (partial along Y, from base up to left_cut_z_hi)
module left_side_opening() {
    translate([-eps, left_cut_y_margin, 0])
        cube([left_cut_depth + eps,
              left_cut_span,
              left_cut_z_hi]);
}

// Thin internal ledge on floor near front inner wall
module front_ledge() {
    translate([ledge_x_margin, wall_t, wall_t])
        cube([ledge_len, ledge_width, ledge_thick]);
}

// === Main Assembly ===

union() {
    // Hollow enclosure with wall cuts subtracted
    difference() {
        hollow_box();
        front_wall_cut();
        left_side_opening();
    }

    // Add thin ledge on interior floor along front region
    front_ledge();
}