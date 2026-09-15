// Parameters (mm)
body_width = 100;
body_depth = 80;
body_height = 40;

rim_thickness = 4;
upper_recess_depth = 9;

middle_inset_x = 8;
middle_inset_y = 8;
middle_recess_depth = 22;

deep_pocket_width = 48;
deep_pocket_depth = 38;
deep_pocket_offset_x = 9;
deep_pocket_offset_y = -4;
bottom_thickness = 6;

projection_length = 18;
projection_width = 32;
projection_height = 12;
projection_offset_y = 0;

side_recess_width = 24;
side_recess_inset = 14;

join_overlap = 0.2;
epsilon = 0.01;

// Derived dimensions
upper_width = body_width - 2 * rim_thickness;
upper_depth = body_depth - 2 * rim_thickness;
middle_width = upper_width - 2 * middle_inset_x;
middle_depth = upper_depth - 2 * middle_inset_y;

upper_floor = body_height - upper_recess_depth;
middle_floor = body_height - middle_recess_depth;
deep_floor = bottom_thickness;
side_floor = projection_height;

// Parameter checks
assert(rim_thickness > 0 && bottom_thickness > 0);
assert(upper_width > 0 && upper_depth > 0);
assert(middle_width > 0 && middle_depth > 0);
assert(middle_inset_x > 0 && middle_inset_y > 0);
assert(body_height > upper_floor &&
       upper_floor > middle_floor &&
       middle_floor > deep_floor);
assert(deep_pocket_width > 0 && deep_pocket_depth > 0);
assert(abs(deep_pocket_offset_x) + deep_pocket_width / 2
       < middle_width / 2);
assert(abs(deep_pocket_offset_y) + deep_pocket_depth / 2
       < middle_depth / 2);
assert(side_floor > deep_floor && side_floor < middle_floor);
assert(projection_length > 0 && join_overlap > epsilon);
assert(projection_width > side_recess_width && side_recess_width > 0);
assert(abs(projection_offset_y) + projection_width / 2 < body_depth / 2);
assert(side_recess_inset > (body_width - middle_width) / 2 &&
       side_recess_inset < body_width / 2);

// Bottom-aligned rectangular solid
module rectangular_solid(width, depth, height) {
    translate([-width / 2, -depth / 2, 0])
        cube([width, depth, height]);
}

// Top-opening rectangular cut
module pocket_cut(width, depth, floor_z, offset_x = 0, offset_y = 0) {
    translate([offset_x - width / 2,
               offset_y - depth / 2,
               floor_z])
        cube([width, depth, body_height - floor_z + epsilon]);
}

// Joined projection on the right side
module side_projection() {
    translate([body_width / 2 - join_overlap,
               projection_offset_y - projection_width / 2,
               0])
        cube([projection_length + join_overlap,
              projection_width,
              projection_height]);
}

// Side opening above the projection
module side_recess() {
    translate([body_width / 2 - side_recess_inset,
               projection_offset_y - side_recess_width / 2,
               side_floor])
        cube([side_recess_inset + projection_length + epsilon,
              side_recess_width,
              body_height - side_floor + epsilon]);
}

// Stepped cavity body
module stepped_body() {
    difference() {
        union() {
            rectangular_solid(body_width, body_depth, body_height);
            side_projection();
        }

        // Broad upper recess and thin rim
        pocket_cut(upper_width, upper_depth, upper_floor);

        // Inset intermediate recess
        pocket_cut(middle_width, middle_depth, middle_floor);

        // Offset deepest pocket with solid bottom
        pocket_cut(deep_pocket_width, deep_pocket_depth, deep_floor,
                   deep_pocket_offset_x, deep_pocket_offset_y);

        // Additional side tier
        side_recess();
    }
}

stepped_body();