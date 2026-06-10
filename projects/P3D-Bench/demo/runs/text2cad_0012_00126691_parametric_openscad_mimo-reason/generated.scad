// Parameters
base_length = 0.5;
base_width = 0.75;
base_height = 0.016667;

upper_length = 0.5;
upper_width = 0.5;
upper_offset_front = 0.25;
upper_reach = 0.2334;

strip_width = 0.0083;
strip_length = 0.5;
strip_offset_front = 0.25;
strip_height = 0.0083;

trans_length = 0.5;
trans_width = 0.250819;
trans_offset_front = 0.24922;
trans_thickness = 0.0021;
trans_reach = 0.335265;

upper_pad_depth = 0.1;
deeper_depth = 0.2167;
deeper_x = 0.4;  // Assumed x-dimension of deeper continuation

hole_length = 0.4;  // Assumed hole dimensions in transverse feature
hole_width = 0.2;

$fn = 100;  // Smoothness for curved surfaces

// Base slab
module base() {
    cube([base_length, base_width, base_height]);
}

// Upper rectangular feature
module upper_feature() {
    translate([0, upper_offset_front, base_height])
        cube([upper_length, upper_width, upper_reach]);
}

// Edge strips
module edge_strips() {
    z_pos = base_height + upper_reach;
    // Left strip
    translate([0, upper_offset_front, z_pos])
        cube([strip_width, strip_length, strip_height]);
    // Right strip
    translate([base_length - strip_width, upper_offset_front, z_pos])
        cube([strip_width, strip_length, strip_height]);
}

// Transverse feature with hole
module transverse_feature() {
    z_pos = trans_reach - trans_thickness;
    hole_x = (trans_length - hole_length) / 2;
    hole_y = (trans_width - hole_width) / 2;
    translate([0, trans_offset_front, z_pos])
        difference() {
            cube([trans_length, trans_width, trans_thickness]);
            translate([hole_x, hole_y, -0.001])
                cube([hole_length, hole_width, trans_thickness + 0.002]);
        }
}

// Stepped portion: deeper continuation and upper pad
module stepped_portion() {
    // Deeper continuation (lower part)
    deeper_z_start = trans_reach - trans_thickness - upper_pad_depth - deeper_depth;
    translate([0, trans_offset_front, deeper_z_start])
        cube([deeper_x, trans_width, deeper_depth]);
    // Upper pad (shallow part)
    upper_pad_z_start = trans_reach - trans_thickness - upper_pad_depth;
    translate([0, trans_offset_front, upper_pad_z_start])
        cube([trans_length, trans_width, upper_pad_depth]);
}

// Main model: union of all parts
union() {
    base();
    upper_feature();
    edge_strips();
    transverse_feature();
    stepped_portion();
}