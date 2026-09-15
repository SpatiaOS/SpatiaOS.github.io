// Dimensions in millimeters
base_length = 110;
base_width = 44;
base_thickness = 4;

side_wall_thickness = 4;
side_wall_height = 22;       // Above base

end_tab_depth = 8;
end_tab_inset = 3;           // From the negative-X end
end_tab_height = 12;         // Above base

post_count = 4;
post_pitch = 22;
post_outer_diameter = 14;
post_inner_diameter = 7;
post_height = 22;            // Above base
post_row_center_x = 0;

overlap = 0.02;
$fn = 96;

// Derived dimensions
channel_width = base_width - 2 * side_wall_thickness;
end_tab_width = channel_width;
end_tab_x = -base_length / 2 + end_tab_inset;
post_row_span = (post_count - 1) * post_pitch;

assert(base_thickness > 0 && side_wall_thickness > 0);
assert(channel_width > post_outer_diameter);
assert(post_count >= 1 && post_count == floor(post_count));
assert(post_inner_diameter > 0 &&
       post_inner_diameter < post_outer_diameter);
assert(post_count == 1 || post_pitch > post_outer_diameter);
assert(end_tab_height > 0 && end_tab_height < side_wall_height);
assert(post_height > 0 && end_tab_inset >= 0);
assert(end_tab_depth > 0 &&
       end_tab_inset + end_tab_depth < base_length);
assert(post_row_center_x - post_row_span / 2 -
       post_outer_diameter / 2 > end_tab_x + end_tab_depth);
assert(post_row_center_x + post_row_span / 2 +
       post_outer_diameter / 2 < base_length / 2);

// Flat base
module base_plate() {
    translate([-base_length / 2, -base_width / 2, 0])
        cube([base_length, base_width, base_thickness]);
}

// Tall longitudinal wall
module side_wall(side) {
    translate([
        0,
        side * (base_width - side_wall_thickness) / 2,
        base_thickness + (side_wall_height - overlap) / 2
    ])
        cube([
            base_length,
            side_wall_thickness,
            side_wall_height + overlap
        ], center = true);
}

// Lower end tab, joined to both side walls
module end_tab() {
    translate([
        end_tab_x,
        -end_tab_width / 2 - overlap,
        base_thickness - overlap
    ])
        cube([
            end_tab_depth,
            end_tab_width + 2 * overlap,
            end_tab_height + overlap
        ]);
}

// Annular post; bore does not cut the base
module annular_post() {
    difference() {
        cylinder(
            h = post_height + overlap,
            d = post_outer_diameter
        );
        translate([0, 0, -overlap])
            cylinder(
                h = post_height + 3 * overlap,
                d = post_inner_diameter
            );
    }
}

// Centered row of raised rings
module post_row() {
    for (i = [0 : post_count - 1])
        translate([
            post_row_center_x + (i - (post_count - 1) / 2) * post_pitch,
            0,
            base_thickness - overlap
        ])
            annular_post();
}

// Unified open-channel model
module channel_model() {
    union() {
        base_plate();
        for (side = [-1, 1])
            side_wall(side);
        end_tab();
        post_row();
    }
}

channel_model();