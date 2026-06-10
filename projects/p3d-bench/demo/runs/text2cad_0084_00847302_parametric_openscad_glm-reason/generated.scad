// Outer dimensions of the enclosure
outer_x = 0.75;
outer_y = 0.625;
outer_z = 0.55;

// Wall and floor thickness (inferred from cut depths)
wall_t = 0.075;
floor_t = 0.075;

// Front wall cut: horizontal rectangular opening
fc_length = 0.5;
fc_side_margin = 0.125;
fc_z_lo = 0.25;
fc_z_hi = 0.45;
fc_depth = 0.075;

// Left side opening: vertical rectangular cut
ls_depth = 0.075;
ls_y_start = 0.2;
ls_y_span = 0.225;
ls_z_top = 0.5;

// Internal front ledge
ledge_length = 0.5;
ledge_width = 0.1;
ledge_x_start = 0.125;
ledge_thickness = 0.0125;

eps = 0.001;
$fn = 50;

module hollow_enclosure() {
    difference() {
        cube([outer_x, outer_y, outer_z]);
        translate([wall_t, wall_t, floor_t])
            cube([outer_x - 2*wall_t,
                  outer_y - 2*wall_t,
                  outer_z - floor_t + eps]);
    }
}

module front_wall_cut() {
    translate([fc_side_margin, -eps, fc_z_lo])
        cube([fc_length, fc_depth + eps, fc_z_hi - fc_z_lo]);
}

module left_side_opening() {
    translate([-eps, ls_y_start, -eps])
        cube([ls_depth + eps, ls_y_span, ls_z_top + eps]);
}

module internal_ledge() {
    translate([ledge_x_start, wall_t, floor_t])
        cube([ledge_length, ledge_width, ledge_thickness]);
}

difference() {
    union() {
        hollow_enclosure();
        internal_ledge();
    }
    front_wall_cut();
    left_side_opening();
}