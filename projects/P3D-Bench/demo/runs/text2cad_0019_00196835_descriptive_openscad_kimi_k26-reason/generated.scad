// Parameters
$fn = 100;

// Main rail dimensions
rail_length = 120;
rail_width = 10;
rail_height = 8;

// Shallow full-length top narrow band
top_layer_height = 2;
top_layer_width = 6;

// Wider block-like extension at one end
end_block_length = 30;
end_block_width = 22;

// Small circular removed features near the rail ends
rail_hole_diameter = 3;
rail_hole_depth = top_layer_height + 0.2; // cut through the shallow top layer
rail_hole_inset = 12;                     // distance from each rail end

// End block shallow circular recessing
shallow_recess_diameter = 5;
shallow_recess_depth = top_layer_height;
shallow_recess_x1 = end_block_length * 0.25;
shallow_recess_x2 = end_block_length * 0.75;

// End block much deeper cutout (through top layer and lower body)
deep_cutout_length = 14; // along X
deep_cutout_width = 16;  // along Y
deep_cutout_depth = rail_height + top_layer_height + 0.2;

// Derived overall length
total_length = end_block_length + rail_length;

// Assembly
difference() {
    union() {
        // Lower body: wider end block
        translate([0, -end_block_width / 2, 0])
            cube([end_block_length, end_block_width, rail_height]);

        // Lower body: long slim rail
        translate([end_block_length, -rail_width / 2, 0])
            cube([rail_length, rail_width, rail_height]);

        // Continuous shallow top layer over block and rail
        translate([0, -top_layer_width / 2, rail_height])
            cube([total_length, top_layer_width, top_layer_height]);
    }

    // Circular cuts near rail ends (along the narrow top band)
    translate([end_block_length + rail_hole_inset, 0, rail_height + top_layer_height - rail_hole_depth])
        cylinder(d = rail_hole_diameter, h = rail_hole_depth + 0.1);

    translate([total_length - rail_hole_inset, 0, rail_height + top_layer_height - rail_hole_depth])
        cylinder(d = rail_hole_diameter, h = rail_hole_depth + 0.1);

    // Shallow circular recesses on the end block
    translate([shallow_recess_x1, 0, rail_height + top_layer_height - shallow_recess_depth])
        cylinder(d = shallow_recess_diameter, h = shallow_recess_depth + 0.1);

    translate([shallow_recess_x2, 0, rail_height + top_layer_height - shallow_recess_depth])
        cylinder(d = shallow_recess_diameter, h = shallow_recess_depth + 0.1);

    // Deep rectangular cutout creating stepped depth through and below the lower body
    translate([end_block_length / 2 - deep_cutout_length / 2, -deep_cutout_width / 2, -0.1])
        cube([deep_cutout_length, deep_cutout_width, deep_cutout_depth]);
}