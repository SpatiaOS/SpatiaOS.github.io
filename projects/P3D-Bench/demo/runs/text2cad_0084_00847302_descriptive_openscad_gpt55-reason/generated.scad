// Parameters (mm)
$fn = 64;
eps = 0.05;

// Enclosure dimensions
outer_width = 80;
outer_depth = 52;
outer_height = 42;
wall_thickness = 3;
bottom_thickness = 3;

// Derived interior dimensions
inner_width = outer_width - 2 * wall_thickness;
inner_depth = outer_depth - 2 * wall_thickness;
inner_height = outer_height - bottom_thickness;

// Front horizontal through opening
front_slot_width = 38;
front_slot_height = 10;
front_slot_bottom_z = 9;
front_slot_depth = wall_thickness + 2 * eps;

// Right side vertical through opening
side_open_width = 17;
side_open_height = 28;
side_open_y_offset = 0;
side_open_depth = wall_thickness + 2 * eps;

// Interior thin ledge along rear wall
ledge_end_margin = 8;
ledge_length = inner_width - 2 * ledge_end_margin;
ledge_projection = 6;
ledge_thickness = 1.2;
ledge_z = bottom_thickness + 8;
ledge_wall_overlap = 0.3;

// Solid outside block
module outer_body() {
    translate([-outer_width / 2, -outer_depth / 2, 0])
        cube([outer_width, outer_depth, outer_height]);
}

// Open-top hollow cavity
module inner_cavity_cut() {
    translate([-inner_width / 2, -inner_depth / 2, bottom_thickness])
        cube([inner_width, inner_depth, inner_height + eps]);
}

// Straight rectangular enclosure shell
module enclosure_shell() {
    difference() {
        outer_body();
        inner_cavity_cut();
    }
}

// Removed horizontal side feature on front wall
module front_horizontal_cut() {
    translate([
        -front_slot_width / 2,
        -outer_depth / 2 - eps,
        front_slot_bottom_z
    ])
        cube([front_slot_width, front_slot_depth, front_slot_height]);
}

// Removed vertical side feature on right wall
module right_vertical_cut() {
    translate([
        outer_width / 2 - wall_thickness - eps,
        side_open_y_offset - side_open_width / 2,
        -eps
    ])
        cube([side_open_depth, side_open_width, side_open_height + eps]);
}

// Thin internal ledge attached to rear inner wall
module rear_inner_ledge() {
    translate([
        -ledge_length / 2,
        outer_depth / 2 - wall_thickness - ledge_projection,
        ledge_z
    ])
        cube([
            ledge_length,
            ledge_projection + ledge_wall_overlap,
            ledge_thickness
        ]);
}

// Final model
difference() {
    union() {
        enclosure_shell();
        rear_inner_ledge();
    }

    front_horizontal_cut();
    right_vertical_cut();
}