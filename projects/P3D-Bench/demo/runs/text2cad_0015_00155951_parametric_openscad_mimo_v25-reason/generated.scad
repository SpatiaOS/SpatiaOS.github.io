// Parameters
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;
hole_radius = 0.125;
hole_x = 0.375;
hole_y = 0.25;

collar_outer_radius = 0.2125;
collar_inner_radius = 0.125;
collar_height = 0.0375;

tab_width = 0.125;
tab_length = 0.375;
tab_height = 0.5875 - base_height;
tab_y_offset = 0.0625;

right_tab_x_offset = 0.625;
right_tab_hole_radius = 0.0937;
right_tab_hole_x = 0.75;
right_tab_hole_y = 0.25;

left_tab_x_offset = 0;
left_tab_hole_radius = 0.0937;
left_tab_hole_x = 0;
left_tab_hole_y = 0.25;

$fn = 100;

// Base plate with rounded top edges
module base_plate() {
    // Create base with rounded top edges using minkowski sum
    minkowski() {
        // Main rectangular body (smaller by rounding radius)
        cube([base_length - 2*0.01, base_width - 2*0.01, base_height]);
        // Sphere for rounding edges
        sphere(r = 0.01);
    }
}

// Underside annular collar
module underside_collar() {
    // Create hollow ring centered on hole axis
    translate([hole_x, hole_y, -collar_height]) {
        difference() {
            cylinder(h = collar_height, r = collar_outer_radius);
            cylinder(h = collar_height + 0.001, r = collar_inner_radius);
        }
    }
}

// Rounded tab module
module rounded_tab(x_offset, hole_x_pos, hole_radius) {
    // Tab body with rounded top edges
    translate([x_offset, tab_y_offset, base_height]) {
        minkowski() {
            // Tab core (smaller by rounding radius)
            cube([tab_width - 2*0.01, tab_length - 2*0.01, tab_height]);
            // Sphere for rounding top edges
            sphere(r = 0.01);
        }
    }
    
    // Through hole in tab
    translate([hole_x_pos, hole_y, base_height - 0.001]) {
        cylinder(h = tab_height + 0.002, r = hole_radius);
    }
}

// Main assembly
difference() {
    union() {
        // Base plate
        base_plate();
        
        // Underside collar
        underside_collar();
        
        // Right tab
        rounded_tab(right_tab_x_offset, right_tab_hole_x, right_tab_hole_radius);
        
        // Left tab
        rounded_tab(left_tab_x_offset, left_tab_hole_x, left_tab_hole_radius);
    }
    
    // Central through hole (through base and collar)
    translate([hole_x, hole_y, -collar_height - 0.001]) {
        cylinder(h = base_height + collar_height + 0.002, r = hole_radius);
    }
}