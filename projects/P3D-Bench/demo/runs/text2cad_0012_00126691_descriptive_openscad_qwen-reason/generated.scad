// Resolution control for smooth curves
$fn = 64;

// Base slab dimensions
base_width = 100;
base_depth = 80;
base_thickness = 3;

// Rear raised portion dimensions
rear_width = 80;
rear_depth = 50;
rear_height = 15;

// Side strip dimensions
strip_width = 8;
strip_height = 5;

// Transverse feature dimensions
trans_width = base_width;
trans_depth = 8;
trans_height = 12;
hole_diameter = 6;
trans_y_pos = base_depth * 0.4;

// Stepped feature dimensions
step_width = 30;
step_depth = 15;
shallow_height = 4;
deep_extension = 8;
step_y_pos = base_depth - rear_depth - 5;

// Module: Base slab
module base_slab() {
    cube([base_width, base_depth, base_thickness]);
}

// Module: Rear raised block
module rear_block() {
    translate([(base_width - rear_width)/2, base_depth - rear_depth, base_thickness])
        cube([rear_width, rear_depth, rear_height]);
}

// Module: Left and right side strips
module side_strips() {
    translate([0, base_depth - rear_depth, base_thickness])
        cube([strip_width, rear_depth, strip_height]);
    translate([base_width - strip_width, base_depth - rear_depth, base_thickness])
        cube([strip_width, rear_depth, strip_height]);
}

// Module: Transverse feature with internal opening
module transverse_feature() {
    difference() {
        translate([0, trans_y_pos, base_thickness])
            cube([trans_width, trans_depth, trans_height]);
        // Through-hole spanning the width
        translate([base_width/2, trans_y_pos + trans_depth/2, base_thickness + trans_height/2])
            rotate([0, 90, 0])
            cylinder(h=trans_width + 4, d=hole_diameter, center=true);
    }
}

// Module: Stepped vertical extents
module stepped_feature() {
    // Shallow addition on top of base shoulder
    translate([(base_width - step_width)/2, step_y_pos, base_thickness])
        cube([step_width, step_depth, shallow_height]);
    // Aligned continuation extending deeper below base level
    translate([(base_width - step_width)/2, step_y_pos, -deep_extension])
        cube([step_width, step_depth, base_thickness + deep_extension]);
}

// Main assembly: additive construction
union() {
    base_slab();
    rear_block();
    side_strips();
    transverse_feature();
    stepped_feature();
}