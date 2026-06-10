// Parameters
base_length = 0.5;
base_width = 0.75;
base_height = 0.016667;

block1_length = 0.5;
block1_width = 0.5;
block1_offset_front = 0.25;          // Y distance from front edge
block1_reach = 0.2334;               // Z top from base datum
block1_height = block1_reach - base_height;

strip_width = 0.0083;                // X dimension
strip_length = 0.5;                  // Y dimension
strip_height = 0.0083;
strip_offset_front = 0.25;           // Y position
right_strip_x = base_length - strip_width; // flush right

upper_pad_depth = 0.1;
upper_pad_length = 0.5;
upper_pad_width = 0.250819;
upper_pad_offset_front = 0.24922;    // Y position
upper_pad_z = block1_reach;          // bottom sits on top of block1

transverse_thickness = 0.0021;
transverse_reach = 0.335265;         // top from base datum
transverse_z_bottom = transverse_reach - transverse_thickness;
transverse_length = 0.5;
transverse_width = upper_pad_width;  // same footprint as upper pad
transverse_y = upper_pad_offset_front;

// Void (stepped pocket) dimensions
shallow_pocket_depth = 0.1;
shallow_pocket_z = transverse_reach - shallow_pocket_depth; // bottom of shallow pocket
deep_pocket_depth = 0.2167;
deep_pocket_width = right_strip_x;   // from left edge (0) to inner edge of right strip
deep_pocket_z = shallow_pocket_z - deep_pocket_depth;

$fn = 50; // resolution for any curves (none here)

// Main solid union
module solids() {
    // Base slab
    cube([base_length, base_width, base_height]);
    
    // Upper rectangular feature (block1)
    translate([0, block1_offset_front, base_height])
        cube([block1_length, block1_width, block1_height]);
    
    // Left narrow strip
    translate([0, strip_offset_front, base_height])
        cube([strip_width, strip_length, strip_height]);
    
    // Right narrow strip
    translate([right_strip_x, strip_offset_front, base_height])
        cube([strip_width, strip_length, strip_height]);
    
    // Upper pad (stepped shallow solid)
    translate([0, upper_pad_offset_front, upper_pad_z])
        cube([upper_pad_length, upper_pad_width, upper_pad_depth]);
    
    // Thin transverse feature
    translate([0, transverse_y, transverse_z_bottom])
        cube([transverse_length, transverse_width, transverse_thickness]);
}

// Void solid (to be subtracted)
module void() {
    // Shallow pocket
    translate([0, upper_pad_offset_front, shallow_pocket_z])
        cube([upper_pad_length, upper_pad_width, shallow_pocket_depth]);
    
    // Deep pocket (narrower, shares left, front, back edges)
    translate([0, upper_pad_offset_front, deep_pocket_z])
        cube([deep_pocket_width, upper_pad_width, deep_pocket_depth]);
}

// Final model
difference() {
    solids();
    void();
}