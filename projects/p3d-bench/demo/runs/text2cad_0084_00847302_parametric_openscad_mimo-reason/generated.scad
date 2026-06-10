// Parametric OpenSCAD Model - Rectangular Enclosure with Cuts and Ledge
// All dimensions in inches

// === PARAMETERS ===
// Main body dimensions
outer_width = 0.75;      // X dimension
outer_depth = 0.625;     // Y dimension
outer_height = 0.55;     // Z dimension
wall_thickness = 0.075;  // Wall material thickness

// Front wall cut dimensions
front_cut_length = 0.5;
front_cut_margin = 0.125;
front_cut_z_start = 0.25;
front_cut_z_end = 0.45;
front_cut_depth = 0.075;

// Left side opening dimensions
left_cut_depth = 0.075;
left_cut_y_span = 0.225;
left_cut_y_front_margin = 0.2;
left_cut_z_max = 0.5;

// Internal ledge dimensions
ledge_length = 0.5;
ledge_width = 0.1;
ledge_thickness = 0.0125;
ledge_margin_x = 0.125;

// Resolution
$fn = 100;

// === MODULES ===
// Main hollow enclosure module
module hollow_enclosure() {
    difference() {
        // Outer solid block
        cube([outer_width, outer_depth, outer_height]);
        
        // Inner void (open top hollow)
        translate([wall_thickness, wall_thickness, wall_thickness])
        cube([outer_width - 2*wall_thickness, 
              outer_depth - 2*wall_thickness, 
              outer_height]);
    }
}

// Front horizontal wall cut
module front_wall_cut() {
    // Position: centered on front face (Y=0)
    translate([front_cut_margin, 0, front_cut_z_start])
    cube([front_cut_length, front_cut_depth, 
          front_cut_z_end - front_cut_z_start]);
}

// Left side vertical opening
module left_side_opening() {
    // Position: on left face (X=0)
    translate([0, left_cut_y_front_margin, 0])
    cube([left_cut_depth, left_cut_y_span, left_cut_z_max]);
}

// Internal ledge
module internal_ledge() {
    // Position: inside front wall, above base
    translate([ledge_margin_x, wall_thickness, wall_thickness])
    cube([ledge_length, ledge_width, ledge_thickness]);
}

// === MAIN MODEL ===
difference() {
    // Start with hollow enclosure
    hollow_enclosure();
    
    // Subtract front wall cut
    front_wall_cut();
    
    // Subtract left side opening
    left_side_opening();
}

// Add internal ledge
internal_ledge();