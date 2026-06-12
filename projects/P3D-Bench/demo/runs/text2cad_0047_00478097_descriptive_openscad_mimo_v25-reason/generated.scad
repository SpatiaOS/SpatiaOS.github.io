// Main parameters
outer_width = 80;
outer_depth = 60;
outer_height = 40;
rim_thickness = 3;
rim_height = 5;
upper_recess_depth = 10;
upper_recess_inset = 8;
middle_recess_depth = 15;
middle_recess_inset = 15;
lower_recess_depth = 20;
lower_recess_inset = 22;
lower_recess_shift = 10;  // Shift deepest pocket to one side

// Side projection parameters
projection_width = 20;
projection_depth = 15;
projection_height = 12;
side_recess_depth = 8;
side_recess_height = 6;

// Resolution control
$fn = 50;

// Main body with stepped cavity
module main_body() {
    difference() {
        // Outer solid block
        cube([outer_width, outer_depth, outer_height]);
        
        // Top rim (thin border)
        translate([rim_thickness, rim_thickness, outer_height - rim_height])
            cube([outer_width - 2*rim_thickness, 
                  outer_depth - 2*rim_thickness, 
                  rim_height + 1]);
        
        // Upper recess (broad)
        translate([upper_recess_inset, upper_recess_inset, 
                   outer_height - rim_height - upper_recess_depth])
            cube([outer_width - 2*upper_recess_inset, 
                  outer_depth - 2*upper_recess_inset, 
                  upper_recess_depth + 1]);
        
        // Middle recess (smaller inset)
        translate([middle_recess_inset, middle_recess_inset, 
                   outer_height - rim_height - upper_recess_depth - middle_recess_depth])
            cube([outer_width - 2*middle_recess_inset, 
                  outer_depth - 2*middle_recess_inset, 
                  middle_recess_depth + 1]);
        
        // Lower recess (deepest, shifted to one side)
        translate([lower_recess_inset + lower_recess_shift, 
                   lower_recess_inset, 
                   outer_height - rim_height - upper_recess_depth - middle_recess_depth - lower_recess_depth])
            cube([outer_width - 2*lower_recess_inset - lower_recess_shift, 
                  outer_depth - 2*lower_recess_inset, 
                  lower_recess_depth + 1]);
    }
}

// Side projection with recess
module side_projection() {
    union() {
        // Rectangular projection
        translate([outer_width, 0, 0])
            cube([projection_width, projection_depth, projection_height]);
        
        // Side recess above projection (creates stepped depth tier)
        translate([outer_width - side_recess_depth, 
                   0, 
                   projection_height])
            cube([side_recess_depth, projection_depth, side_recess_height]);
    }
}

// Final assembly
union() {
    main_body();
    side_projection();
}