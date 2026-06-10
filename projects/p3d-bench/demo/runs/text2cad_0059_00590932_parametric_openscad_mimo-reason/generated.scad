// Main dimensions
length = 0.165891;
width = 0.325401;
height = 0.408347;
extrusion_depth = 0.4083;

// Square recess parameters
recess_size = 0.089326;
recess_left_offset = 0.0383;
recess_front_offset = 0.0191;
recess_back_offset = 0.217;
recess_top_z = 0.319;
recess_bottom_z = 0.4083;
recess_depth = 0.0893;

// Lower opening parameters
opening_width = 0.076565;
opening_height = 0.132416;
opening_left_offset = 0.0447;
opening_right_offset = 0.0446;
opening_front_offset = -0.0303;
opening_back_remaining = 0.2233;
opening_bottom_z = 0;
opening_top_z = 0.319;

// Upper back strip removal
strip_removal_start_z = 0.2807;
strip_removal_end_z = 0.4083;
strip_removal_depth = 0.1276;
strip_front_remaining = 0.2106;
strip_width = 0.114848;

// Shallow base section
shallow_height = 0.0383;
shallow_length = 0.4339;
shallow_width = 0.1148;
shallow_side_projection = 0.134;

// Circular openings in shallow section
opening_radius = 0.0255;
opening_front_offset_shallow = 0.0574;
opening1_left_offset = -0.069;
opening2_left_offset = 0.2349;

$fn = 100; // Smooth curves

// Main base
module main_base() {
    cube([length, width, height]);
}

// Square recess from top
module square_recess() {
    translate([
        recess_left_offset,
        recess_front_offset,
        recess_top_z
    ])
    cube([recess_size, recess_size, recess_depth]);
}

// Lower rectangular opening
module lower_opening() {
    translate([
        opening_left_offset,
        opening_front_offset,
        opening_bottom_z
    ])
    cube([opening_width, opening_height, opening_top_z - opening_bottom_z]);
}

// Upper back strip removal
module back_strip_removal() {
    translate([
        0,
        width - strip_width,
        strip_removal_start_z
    ])
    cube([length, strip_width, strip_removal_end_z - strip_removal_start_z]);
}

// Shallow base section
module shallow_section() {
    translate([
        -shallow_side_projection,
        0,
        0
    ])
    cube([shallow_length, shallow_width, shallow_height]);
}

// Circular openings in shallow section
module shallow_openings() {
    // First opening
    translate([
        opening1_left_offset + shallow_side_projection,
        opening_front_offset_shallow,
        -0.001
    ])
    cylinder(h = shallow_height + 0.002, r = opening_radius);
    
    // Second opening
    translate([
        opening2_left_offset + shallow_side_projection,
        opening_front_offset_shallow,
        -0.001
    ])
    cylinder(h = shallow_height + 0.002, r = opening_radius);
}

// Final assembly
difference() {
    union() {
        main_base();
        shallow_section();
    }
    
    // Subtractive operations
    square_recess();
    lower_opening();
    back_strip_removal();
    shallow_openings();
}