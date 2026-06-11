// === Parameters ===

// Rail dimensions
rail_length = 120;          // Full length of the slim rail
rail_body_width = 12;       // Narrow width of the rail body
rail_body_height = 8;       // Height of the rail lower body
top_layer_height = 2;       // Shallow full-length top layer height
top_layer_overhang = 2;     // Top layer overhang beyond body on each side

// End block dimensions
end_block_length = 25;      // Length of the wider end block extension
end_block_width = 30;       // Width of the end block

// Shallow circular recess parameters
recess_diameter = 5;        // Diameter of shallow circular recesses
recess_depth = 1.5;         // Depth of shallow recesses into top layer

// Deep cutout parameters on end block
deep_cutout_width = 14;     // Width of the deep through-cutout
deep_cutout_length = 10;    // Length of the deep through-cutout
deep_cutout_x_offset = 8;   // X offset of cutout from outer edge of end block

$fn = 100;

// Computed values
top_layer_width = rail_body_width + 2 * top_layer_overhang;
total_height = rail_body_height + top_layer_height;
y_center_rail = rail_body_width / 2;
y_offset_block = -(end_block_width - rail_body_width) / 2;

// === Modules ===

// Rail body: narrow lower strip + wider shallow top layer
module rail_solid() {
    // Lower narrow body strip
    cube([rail_length, rail_body_width, rail_body_height]);
    // Full-length shallow top layer (wider than body)
    translate([0, -top_layer_overhang, rail_body_height])
        cube([rail_length, top_layer_width, top_layer_height]);
}

// End block: wider body + matching shallow top layer
module end_block_solid() {
    // Wider block body extending from x=0 end
    translate([-end_block_length, y_offset_block, 0])
        cube([end_block_length, end_block_width, rail_body_height]);
    // Matching shallow top layer on end block
    translate([-end_block_length, y_offset_block, rail_body_height])
        cube([end_block_length, end_block_width, top_layer_height]);
}

// Shallow circular recesses near rail ends (along narrow band)
module rail_recesses() {
    // Near end-block end of rail
    translate([10, y_center_rail, total_height - recess_depth])
        cylinder(h=recess_depth + 0.1, d=recess_diameter);
    // Near far end of rail
    translate([rail_length - 10, y_center_rail, total_height - recess_depth])
        cylinder(h=recess_depth + 0.1, d=recess_diameter);
}

// End block removed features: shallow recesses + deep through-cutout
module end_block_recesses() {
    // Shallow circular recess on end block (near one edge)
    translate([-end_block_length / 2, y_offset_block + 6, total_height - recess_depth])
        cylinder(h=recess_depth + 0.1, d=recess_diameter);
    // Shallow circular recess on end block (near opposite edge)
    translate([-end_block_length / 2, y_offset_block + end_block_width - 6, total_height - recess_depth])
        cylinder(h=recess_depth + 0.1, d=recess_diameter);

    // Deep cutout: goes through the entire body and below, creating stepped depth
    // Positioned toward the outer end of the block
    translate([
        -deep_cutout_x_offset - deep_cutout_length,
        y_offset_block + (end_block_width - deep_cutout_width) / 2,
        -2   // extends below z=0 to ensure through-and-below cut
    ])
        cube([deep_cutout_length, deep_cutout_width, total_height + 4]);
}

// === Main Model ===
difference() {
    // Combine rail and end block solids
    union() {
        rail_solid();
        end_block_solid();
    }

    // Subtract all removed features
    rail_recesses();
    end_block_recesses();
}