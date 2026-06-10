// Parameters
$fn = 96;
eps = 0.00001;

// Reference datum
rail_left_x = 0;
rail_front_y = 0;
base_z = 0;

// Main rail
rail_length = 0.748506;
rail_width = 0.024642;
rail_height_nominal = 0.018482;
lower_body_height = 0.0185;

// Shallow top layers
top_layer_thickness_nominal = 0.00462;
top_layer_height = 0.0046;
top_layer_z = lower_body_height;

// Circular recess bands
recess_radius = 0.0043;
recess_bottom_z = 0.0062;
recess_depth = 0.0123;
recess_top_z = recess_bottom_z + recess_depth;

// Rail recess locations
rail_recess_y_offset = 0.0108;
rail_recess_y = rail_front_y + rail_recess_y_offset;
rail_recess_xs = [0.0138, 0.7346];

// End block
end_block_side = 0.030803;
end_block_left_x = 0.7192;
end_block_right_overhang_ref = 0.0015;
end_block_front_offset = 0.0361;
end_block_back_offset_ref = 0.0299;
end_block_x = rail_left_x + end_block_left_x;
end_block_y = rail_front_y - end_block_front_offset;

// End block circular recess
end_recess_x = rail_left_x + 0.7361;
end_recess_y = rail_front_y - 0.0192;

// Deep end cutout
end_cutout_side = 0.027722;
end_cutout_reach = 0.077;
end_cutout_top_z = lower_body_height;
end_cutout_bottom_z = end_cutout_top_z - end_cutout_reach;

// Helper: box from minimum corner
module box_min(x, y, z, sx, sy, sz) {
    translate([x, y, z])
        cube([sx, sy, sz], center=false);
}

// Lower rail body
module rail_lower_body() {
    box_min(rail_left_x, rail_front_y, base_z,
            rail_length, rail_width, lower_body_height);
}

// Rail top layer
module rail_top_layer() {
    box_min(rail_left_x, rail_front_y, top_layer_z,
            rail_length, rail_width, top_layer_height);
}

// Lower end block body
module end_block_lower_body() {
    box_min(end_block_x, end_block_y, base_z,
            end_block_side, end_block_side, lower_body_height);
}

// End block top layer
module end_block_top_layer() {
    box_min(end_block_x, end_block_y, top_layer_z,
            end_block_side, end_block_side, top_layer_height);
}

// Vertical blind circular recess cutter
module circular_recess_cut(x, y) {
    translate([x, y, recess_bottom_z - eps])
        cylinder(h=recess_depth + 2*eps, r=recess_radius, center=false);
}

// Deep square cutout sharing end block left/front edges
module end_cutout_cut() {
    box_min(end_block_x - eps, end_block_y - eps, end_cutout_bottom_z,
            end_cutout_side + eps, end_cutout_side + eps,
            end_cutout_reach + eps);
}

// Lower solid bodies before cuts
module lower_bodies() {
    union() {
        rail_lower_body();
        end_block_lower_body();
    }
}

// All shallow top layers
module top_layers() {
    union() {
        rail_top_layer();
        end_block_top_layer();
    }
}

// All removed lower-body features
module lower_body_cuts() {
    for (x = rail_recess_xs)
        circular_recess_cut(x, rail_recess_y);

    circular_recess_cut(end_recess_x, end_recess_y);
    end_cutout_cut();
}

// Main model
union() {
    difference() {
        lower_bodies();
        lower_body_cuts();
    }

    top_layers();
}