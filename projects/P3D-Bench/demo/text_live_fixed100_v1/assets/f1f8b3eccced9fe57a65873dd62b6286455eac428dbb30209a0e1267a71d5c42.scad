// Parameters
$fn = 100;
eps = 0.0001;

base_length = 0.75;
base_width = 0.375;
base_height = 0.0375;

upper_top = 0.1312;
upper_height = upper_top - base_height;

front_offset = 0.0281;
back_offset = 0.0375;
channel_width = base_width - front_offset - back_offset;

left_block_right_offset = 0.7181;
left_block_length = base_length - left_block_right_offset;
left_block_front_offset = front_offset;
left_block_back_offset = back_offset;
left_block_width = base_width - left_block_front_offset - left_block_back_offset;
left_block_top = 0.0937;
left_block_height = left_block_top - base_height;

post_y = 0.1875;
post_x = [0.15, 0.30, 0.45, 0.60];
post_outer_r = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_r = [0.0188, 0.0197, 0.0216, 0.0234];
post_top = upper_top;
post_height = post_top - base_height;

// Annular post module
module annular_post(x, y, r_out, r_in, h) {
    translate([x, y, base_height])
    difference() {
        cylinder(h=h, r=r_out);
        translate([0, 0, -eps])
        cylinder(h=h + 2*eps, r=r_in);
    }
}

// Base reference
cube([base_length, base_width, base_height]);

// Raised upper channel walls, open interior
translate([0, 0, base_height])
difference() {
    cube([base_length, base_width, upper_height]);
    translate([-eps, front_offset, -eps])
    cube([base_length + 2*eps, channel_width, upper_height + 2*eps]);
}

// Left narrower rectangular solid
translate([0, left_block_front_offset, base_height])
cube([left_block_length, left_block_width, left_block_height]);

// Four annular cylindrical posts
for (i = [0 : len(post_x) - 1]) {
    annular_post(post_x[i], post_y, post_outer_r[i], post_inner_r[i], post_height);
}