// Parameters
outer_width = 80;
outer_depth = 60;
outer_height = 50;
wall_thickness = 3;
rim_height = 4;
rim_thickness = 2;

// Horizontal recess parameters
recess_width = 40;
recess_height = 12;
recess_offset_from_bottom = 15;

// Vertical opening parameters
vertical_opening_width = 25;
vertical_opening_height = 35;

// Internal ledge parameters
ledge_thickness = 1.5;
ledge_depth = 4;
ledge_height = 25;

// Resolution
$fn = 100;

// Main enclosure body
module enclosure_body() {
    difference() {
        // Outer shell
        cube([outer_width, outer_depth, outer_height]);
        
        // Hollow interior
        translate([wall_thickness, wall_thickness, 0])
            cube([outer_width - 2*wall_thickness, 
                  outer_depth - 2*wall_thickness, 
                  outer_height - rim_height]);
        
        // Rim recess (creates thicker top edge)
        translate([wall_thickness - rim_thickness, wall_thickness - rim_thickness, outer_height - rim_height])
            cube([outer_width - 2*wall_thickness + 2*rim_thickness, 
                  outer_depth - 2*wall_thickness + 2*rim_thickness, 
                  rim_height]);
    }
}

// Horizontal recess on front face
module horizontal_recess() {
    translate([(outer_width - recess_width)/2, -0.1, recess_offset_from_bottom])
        cube([recess_width, wall_thickness + 0.2, recess_height]);
}

// Vertical through opening on right face
module vertical_opening() {
    translate([outer_width - wall_thickness - 0.1, 
               (outer_depth - vertical_opening_width)/2, 
               -0.1])
        cube([wall_thickness + 0.2, vertical_opening_width, vertical_opening_height]);
}

// Internal ledge/rib
module internal_ledge() {
    translate([wall_thickness, wall_thickness, ledge_height])
        cube([outer_width - 2*wall_thickness, ledge_depth, ledge_thickness]);
}

// Final assembly
difference() {
    union() {
        enclosure_body();
    }
    
    // Subtract features
    horizontal_recess();
    vertical_opening();
}

// Add internal ledge
internal_ledge();