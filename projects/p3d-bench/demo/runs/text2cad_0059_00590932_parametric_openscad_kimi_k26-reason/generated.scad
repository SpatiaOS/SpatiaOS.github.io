// Parameters
$fn = 100;

// Main base dimensions
base_length = 0.165891;
base_width = 0.325401;
base_height = 0.408347;

// Square recess (top pocket)
sq_recess_size = 0.089326;
sq_recess_front = 0.0191;
sq_recess_z = 0.319;

// Lower rectangular opening (breaks through front face)
lower_w = 0.076565;
lower_d = 0.132416;
lower_left = 0.0447;
lower_front = -0.0303;
lower_z = 0.319;

// Upper back strip removal (step)
back_y = 0.2106;
back_w = 0.114848;
back_z = 0.2807;

// Shallow front base extension
shallow_h = 0.0383;
shallow_proj = 0.134;
shallow_y = 0.1148;

// Mounting holes in shallow extension
hole_r = 0.0255;
hole_front = 0.0574;
hole_x1 = -0.069;
hole_x2 = 0.2349;

// Main body with internal cutouts
module main_body() {
    difference() {
        cube([base_length, base_width, base_height]);
        
        // Square recess centered along length, from top
        translate([(base_length - sq_recess_size)/2, sq_recess_front, sq_recess_z])
            cube([sq_recess_size, sq_recess_size, base_height - sq_recess_z + 0.001]);
        
        // Lower opening through bottom vertical band
        translate([lower_left, lower_front, -0.001])
            cube([lower_w, lower_d, lower_z + 0.001]);
        
        // Back upper strip cutaway
        translate([-0.001, back_y, back_z])
            cube([base_length + 0.002, back_w, base_height - back_z + 0.001]);
    }
}

// Shallow projecting front section
module front_extension() {
    translate([-shallow_proj, 0, 0])
        cube([base_length + 2*shallow_proj, shallow_y, shallow_h]);
}

// Assembly
difference() {
    union() {
        main_body();
        front_extension();
    }
    
    // Two through holes in front extension
    translate([hole_x1, hole_front, -0.001])
        cylinder(h = shallow_h + 0.002, r = hole_r);
    
    translate([hole_x2, hole_front, -0.001])
        cylinder(h = shallow_h + 0.002, r = hole_r);
}