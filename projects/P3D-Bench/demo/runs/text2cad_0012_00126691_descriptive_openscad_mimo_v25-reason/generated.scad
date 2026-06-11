// Parameters
base_width = 80;
base_depth = 60;
base_height = 4;

rear_width = 60;
rear_depth = 40;
rear_height = 8;

side_strip_width = 5;
side_strip_depth = rear_depth;
side_strip_height = 6;

transverse_width = base_width;
transverse_depth = 3;
transverse_height = 12;

hole_width = 30;
hole_height = 6;

$fn = 100;

// Base slab
module base() {
    cube([base_width, base_depth, base_height]);
}

// Rear raised portion
module rear_block() {
    translate([0, base_depth - rear_depth, base_height])
        cube([rear_width, rear_depth, rear_height]);
}

// Left side strip
module left_strip() {
    translate([0, base_depth - side_strip_depth, base_height])
        cube([side_strip_width, side_strip_depth, side_strip_height]);
}

// Right side strip
module right_strip() {
    translate([base_width - side_strip_width, base_depth - side_strip_depth, base_height])
        cube([side_strip_width, side_strip_depth, side_strip_height]);
}

// Transverse feature with internal opening
module transverse_feature() {
    translate([0, base_depth - rear_depth - transverse_depth, base_height])
        difference() {
            // Outer shell
            cube([transverse_width, transverse_depth, transverse_height]);
            // Internal opening
            translate([(transverse_width - hole_width)/2, -1, (transverse_height - hole_height)/2])
                cube([hole_width, transverse_depth + 2, hole_height]);
        }
}

// Main assembly
union() {
    base();
    rear_block();
    left_strip();
    right_strip();
    transverse_feature();
}