// Outer body reference dimensions
outer_width  = 0.75;
outer_depth  = 0.625;
outer_height = 0.55;

// Wall and floor thickness (derived from the 0.075 cut depths)
wall_thickness  = 0.075;
floor_thickness = 0.075;

// Inner void dimensions
inner_width  = outer_width  - 2 * wall_thickness;
inner_depth  = outer_depth  - 2 * wall_thickness;
inner_height = outer_height - floor_thickness;

// Front horizontal wall cut parameters
front_cut_length = 0.5;
front_cut_depth  = 0.075;
front_cut_bottom = 0.25;
front_cut_height = 0.20;               // 0.45 - 0.25
front_cut_x      = 0.125;              // centered, 0.125 margin from left
front_cut_y      = 0;                  // front face

// Left vertical side opening parameters
left_cut_depth  = 0.075;
left_cut_span   = 0.225;
left_cut_y      = 0.2;                 // 0.2 front margin
left_cut_z      = 0;                   // underside
left_cut_height = 0.5;

// Internal front ledge parameters
ledge_length    = 0.5;
ledge_width     = 0.1;
ledge_thickness = 0.0125;
ledge_x         = 0.125;               // 0.125 side margins
ledge_y         = wall_thickness;      // front inside face
ledge_z         = floor_thickness;     // sits on interior floor

// Hollow open-top enclosure shell
module enclosure_shell() {
    difference() {
        cube([outer_width, outer_depth, outer_height]);
        translate([wall_thickness, wall_thickness, floor_thickness])
            cube([inner_width, inner_depth, inner_height + 0.001]);
    }
}

// Shallow internal ledge along front inside face
module front_ledge() {
    translate([ledge_x, ledge_y, ledge_z])
        cube([ledge_length, ledge_width, ledge_thickness]);
}

// Front wall slot
module front_slot() {
    translate([front_cut_x, front_cut_y - 0.001, front_cut_bottom])
        cube([front_cut_length, front_cut_depth + 0.001, front_cut_height]);
}

// Left side slot
module left_slot() {
    translate([left_cut_x - 0.001, left_cut_y, left_cut_z])
        cube([left_cut_depth + 0.001, left_cut_span, left_cut_height]);
}

// Assemble: shell + ledge, then subtract front and left openings
difference() {
    union() {
        enclosure_shell();
        front_ledge();
    }
    front_slot();
    left_slot();
}