// Parametric model of a base with circular profiles, upper section, and upright tab
// Units: inches

// === PARAMETERS ===
base_length = 0.75;
base_width = 0.421875;
base_height = 0.191921;
base_extrusion = 0.1919;

// Circular profile 1 (left side)
profile1_x = 0.2109;
profile1_y = 0.2109;
profile1_radius = 0.2109;

// Circular profile 2 (right side, annular)
profile2_x = 0.6094;
profile2_y = 0.2109;
profile2_outer_radius = 0.1406;
profile2_inner_radius = 0.1055;

// Upper circular section
upper_footprint = 0.4218;
upper_left_offset = 0;
upper_right_offset = 0.3282;
upper_front_offset = 0;
upper_back_offset = 0;
upper_total_height = 0.4424;

// Upright rectangular tab
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_left_offset = 0.0703;
tab_right_offset = 0.6385;
tab_front_offset = 0.1758;
tab_back_offset = 0.1757;

// Resolution
$fn = 100;

// === MODULES ===
// Create a circular profile (solid or annular)
module circular_profile(x, y, outer_r, inner_r = 0) {
    translate([x, y, 0]) {
        if (inner_r == 0) {
            // Solid circle
            circle(r = outer_r);
        } else {
            // Annular ring
            difference() {
                circle(r = outer_r);
                circle(r = inner_r);
            }
        }
    }
}

// Create the base with circular profiles
module base_with_profiles() {
    difference() {
        // Start with rectangular base
        square([base_length, base_width]);
        
        // Subtract circular profiles to create voids
        // Profile 1: solid circle
        circular_profile(profile1_x, profile1_y, profile1_radius);
        
        // Profile 2: annular ring
        circular_profile(profile2_x, profile2_y, 
                        profile2_outer_radius, profile2_inner_radius);
    }
}

// Create the upper circular section
module upper_section() {
    translate([upper_left_offset, upper_front_offset, 0]) {
        linear_extrude(height = upper_total_height) {
            // Circular footprint
            circle(d = upper_footprint);
        }
    }
}

// Create the upright tab
module upright_tab() {
    translate([tab_left_offset, tab_front_offset, 0]) {
        cube([tab_length, tab_width, tab_height]);
    }
}

// === MAIN MODEL ===
// Combine all components
union() {
    // Lower base with profiles (extruded upward)
    linear_extrude(height = base_extrusion) {
        base_with_profiles();
    }
    
    // Upper circular section (extends from base datum to full height)
    upper_section();
    
    // Upright tab (extends from base datum to full height)
    upright_tab();
}