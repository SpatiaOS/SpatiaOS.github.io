// Parameters
$fn = 96;
eps = 0.0005;

// Base
base_length = 0.75;
base_width  = 0.375;
base_height = 0.0375;

// Raised upper wall material
upper_top_z = 0.1312;
upper_height = upper_top_z - base_height;
channel_front_offset = 0.0281;
channel_back_offset  = 0.0375;
channel_width = base_width - channel_front_offset - channel_back_offset;

// Left end solid
left_block_left_offset  = 0;
left_block_right_offset = 0.7181;
left_block_front_offset = 0.0281;
left_block_back_offset  = 0.0375;
left_block_length = base_length - left_block_left_offset - left_block_right_offset;
left_block_width  = base_width - left_block_front_offset - left_block_back_offset;
left_block_height = 0.05625;

// Annular posts
post_y = 0.1875;
post_top_z = 0.1312;
post_height = post_top_z - base_height;
post_x_positions = [0.15, 0.3, 0.45, 0.6];
post_outer_radii = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_radii = [0.0188, 0.0197, 0.0216, 0.0234];

// Helper cuboid
module cuboid_at(pos, size) {
    translate(pos)
        cube(size, center=false);
}

// Rectangular base
module base_plate() {
    cuboid_at([0, 0, 0], [base_length, base_width, base_height]);
}

// Raised side walls with open channel
module raised_upper_walls() {
    difference() {
        cuboid_at(
            [0, 0, base_height - eps],
            [base_length, base_width, upper_height + eps]
        );

        cuboid_at(
            [-eps, channel_front_offset, base_height - 2*eps],
            [base_length + 2*eps, channel_width, upper_height + 4*eps]
        );
    }
}

// Lower left-end rectangular solid
module left_end_block() {
    cuboid_at(
        [left_block_left_offset, left_block_front_offset, base_height - eps],
        [left_block_length, left_block_width, left_block_height + eps]
    );
}

// Single annular post
module annular_post(x, y, z, h, outer_r, inner_r) {
    translate([x, y, z - eps])
        difference() {
            cylinder(h=h + eps, r=outer_r, center=false);
            translate([0, 0, -eps])
                cylinder(h=h + 3*eps, r=inner_r, center=false);
        }
}

// Four separate annular posts
module post_set() {
    for (i = [0 : len(post_x_positions) - 1]) {
        annular_post(
            post_x_positions[i],
            post_y,
            base_height,
            post_height,
            post_outer_radii[i],
            post_inner_radii[i]
        );
    }
}

// Main model
union() {
    base_plate();
    raised_upper_walls();
    left_end_block();
    post_set();
}