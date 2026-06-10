// --- Parameters ---

// Base dimensions
base_length = 0.75;
base_width = 0.421875;
base_height = 0.191921;

// Left circular profile (Forms the left side of the base and the taller section)
left_center_x = 0.2109;
left_center_y = 0.2109;
left_outer_r = 0.2109;
left_inner_r = 0.1055; // Inner radius matching the slot opening

// Right circular profile (Forms the right side of the base)
right_center_x = 0.6094;
right_center_y = 0.2109;
right_outer_r = 0.1406;
right_inner_r = 0.1055;

// Taller section height (Extruded from base datum)
tall_height = 0.4424;

// Upright tab dimensions and position
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_offset_x = 0.0703;
tab_offset_y = 0.1758;

// Global resolution for smooth curves
$fn = 100;

// --- Main Model ---

union() {
    // Main body with voids subtracted
    difference() {
        // Solid bodies
        union() {
            // Lower base extrusion
            // Formed by hulling the two outer circular profiles to create a continuous span
            linear_extrude(height = base_height) {
                hull() {
                    translate([left_center_x, left_center_y]) 
                        circle(r = left_outer_r);
                    translate([right_center_x, right_center_y]) 
                        circle(r = right_outer_r);
                }
            }
            
            // Taller circular solid section
            // Positioned over the left-side axis, starting from the base datum (Z=0)
            linear_extrude(height = tall_height) {
                translate([left_center_x, left_center_y]) 
                    circle(r = left_outer_r);
            }
        }
        
        // Inner openings / true voids
        // Formed as a rounded slot connecting the left and right inner radii
        // Cut through the entire height of the model
        translate([0, 0, -1]) {
            linear_extrude(height = tall_height + 2) {
                hull() {
                    translate([left_center_x, left_center_y]) 
                        circle(r = left_inner_r);
                    translate([right_center_x, right_center_y]) 
                        circle(r = right_inner_r);
                }
            }
        }
    }
    
    // Separate solid rectangular upright tab
    // Unioned after the difference to ensure it remains a solid feature
    translate([tab_offset_x, tab_offset_y, 0]) {
        cube([tab_length, tab_width, tab_height]);
    }
}