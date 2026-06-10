// Main reference span dimensions
base_length = 0.75;
base_width = 0.421875;
base_height = 0.191921;

// Lower base extrusion height
lower_base_height = 0.1919;

// Left circular profile parameters
left_circle_x = 0.2109;
left_circle_y = 0.2109;
left_circle_radius = 0.2109;

// Right circular group parameters
right_circle_x = 0.6094;
right_circle_y = 0.2109;
right_outer_radius = 0.1406;
right_inner_radius = 0.1055;

// Upper circular section parameters
upper_section_height = 0.4424;
upper_section_width = 0.4218;
upper_section_depth = 0.4218;
upper_left_offset = 0;
upper_right_offset = 0.3282;
upper_front_offset = 0;
upper_back_offset = 0;

// Rectangular tab parameters
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_left_offset = 0.0703;
tab_right_offset = 0.6385;
tab_front_offset = 0.1758;
tab_back_offset = 0.1757;

// Resolution control
$fn = 100;

// Module for lower base with circular profiles and voids
module lower_base() {
    difference() {
        // Main base plate (will be modified with voids)
        cube([base_length, base_width, lower_base_height]);
        
        // Left circular profile void (creates solid cylinder)
        // Actually this is a solid feature, so we don't subtract it
        // Instead, we'll add it as a solid cylinder
    }
    
    // Add left solid cylinder
    translate([left_circle_x, left_circle_y, 0])
        cylinder(h = lower_base_height, r = left_circle_radius);
    
    // Add right annular cylinder (outer - inner)
    translate([right_circle_x, right_circle_y, 0])
        difference() {
            cylinder(h = lower_base_height, r = right_outer_radius);
            cylinder(h = lower_base_height, r = right_inner_radius);
        }
    
    // Create slot-like voids in the base
    // These are rounded cutouts that create voids in the base
    // Example slot: a rectangular slot with rounded ends
    translate([0.3, 0.1, 0]) {
        // Slot shape: rectangle with rounded ends
        hull() {
            translate([0, 0, 0])
                cylinder(h = lower_base_height, r = 0.02);
            translate([0.2, 0, 0])
                cylinder(h = lower_base_height, r = 0.02);
        }
    }
    
    // Additional curved void
    translate([0.5, 0.3, 0]) {
        difference() {
            cylinder(h = lower_base_height, r = 0.05);
            cylinder(h = lower_base_height, r = 0.03);
        }
    }
}

// Module for upper circular section (taller continuation)
module upper_section() {
    // Calculate position based on offsets
    x_pos = base_length - upper_right_offset - upper_section_width;
    y_pos = base_width - upper_back_offset - upper_section_depth;
    
    translate([x_pos, y_pos, 0]) {
        difference() {
            // Outer cylinder
            cylinder(h = upper_section_height, r = upper_section_width/2);
            
            // Inner annular void
            cylinder(h = upper_section_height, r = right_inner_radius);
            
            // Rounded slot interruptions in the opening
            // Create a slot through the cylinder wall
            translate([0, 0, lower_base_height]) {
                rotate([0, 0, 45])
                    cube([upper_section_width, 0.02, upper_section_height - lower_base_height], center = true);
            }
        }
    }
}

// Module for rectangular upright tab
module rectangular_tab() {
    // Calculate position based on offsets
    x_pos = tab_left_offset;
    y_pos = tab_front_offset;
    
    translate([x_pos, y_pos, 0])
        cube([tab_length, tab_width, tab_height]);
}

// Main assembly
union() {
    // Lower base with circular profiles and voids
    lower_base();
    
    // Upper circular section (taller continuation)
    upper_section();
    
    // Rectangular upright tab
    rectangular_tab();
}