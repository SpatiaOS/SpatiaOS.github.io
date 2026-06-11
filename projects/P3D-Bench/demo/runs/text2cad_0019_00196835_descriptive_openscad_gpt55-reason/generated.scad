// Parameters
$fn = 96;
eps = 0.05;
layer_overlap = 0.02;

// Rail dimensions
rail_length = 180;
rail_width = 12;
rail_base_height = 3.0;
rail_top_width = 8;
top_layer_height = 0.9;

// Wider end block
end_block_length = 34;
end_block_overlap = 8;
end_block_width = 28;
end_block_top_width = 22;

// Rail removed features
rail_recess_diameter = 4.2;
rail_recess_depth = top_layer_height + 0.35;
rail_left_recess_x = 14;
rail_right_recess_offset = 12;
rail_recess_y = 0;

// End block removed features
block_shallow_recess_diameter = 6.5;
block_shallow_recess_depth = 0.55;
block_shallow_recess_y = 7;

counterbore_diameter = 13;
counterbore_depth = top_layer_height + 0.75;
deep_cut_diameter = 6.5;

// Derived dimensions
block_start_x = rail_length - end_block_overlap;
block_center_x = block_start_x + end_block_length / 2;
part_height = rail_base_height + top_layer_height;

rail_right_recess_x = block_start_x - rail_right_recess_offset;
block_shallow_recess_x = block_start_x + 9;
deep_cut_x = block_start_x + 24;
deep_cut_y = 0;

// 2D rail footprint
module rail_footprint(w) {
    translate([rail_length / 2, 0])
        square([rail_length, w], center=true);
}

// 2D end block footprint
module end_block_footprint(w) {
    translate([block_center_x, 0])
        square([end_block_length, w], center=true);
}

// Lower body outline
module lower_body_2d() {
    union() {
        rail_footprint(rail_width);
        end_block_footprint(end_block_width);
    }
}

// Shallow top layer outline
module top_layer_2d() {
    union() {
        rail_footprint(rail_top_width);
        end_block_footprint(end_block_top_width);
    }
}

// Main lower rail and wider end block
module lower_body() {
    linear_extrude(height=rail_base_height, convexity=2)
        lower_body_2d();
}

// Full-length shallow raised top layer
module shallow_top_layer() {
    translate([0, 0, rail_base_height - layer_overlap])
        linear_extrude(height=top_layer_height + layer_overlap, convexity=2)
            top_layer_2d();
}

// Complete solid before cuts
module main_solid() {
    union() {
        lower_body();
        shallow_top_layer();
    }
}

// Blind circular recess from top
module circular_recess(x, y, d, depth) {
    translate([x, y, part_height - depth])
        cylinder(h=depth + eps, d=d, center=false);
}

// Full-depth circular cut
module through_cut(x, y, d) {
    translate([x, y, -eps])
        cylinder(h=part_height + 2 * eps, d=d, center=false);
}

// Stepped end cutout: shallow counterbore plus deeper through cut
module stepped_deep_cutout(x, y) {
    union() {
        circular_recess(x, y, counterbore_diameter, counterbore_depth);
        through_cut(x, y, deep_cut_diameter);
    }
}

// Rail end recesses along the narrow band
module rail_removed_features() {
    circular_recess(rail_left_recess_x, rail_recess_y, rail_recess_diameter, rail_recess_depth);
    circular_recess(rail_right_recess_x, rail_recess_y, rail_recess_diameter, rail_recess_depth);
}

// Wider end block recesses and deeper cutout
module end_block_removed_features() {
    circular_recess(block_shallow_recess_x, block_shallow_recess_y, block_shallow_recess_diameter, block_shallow_recess_depth);
    stepped_deep_cutout(deep_cut_x, deep_cut_y);
}

// Final model
difference() {
    main_solid();
    rail_removed_features();
    end_block_removed_features();
}