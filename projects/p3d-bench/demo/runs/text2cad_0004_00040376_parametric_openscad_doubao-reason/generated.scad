// Global Resolution Setting
$fn = 64;

// --------------------------
// Primary Parameter Definitions
// --------------------------
// Base overall dimensions
base_total_length = 0.75;       // X-axis total span
base_total_width = 0.421875;    // Y-axis total span
lower_base_height = 0.1919;     // Z-height of lower base from datum
upper_left_total_height = 0.4424; // Total Z-height of left upper section from datum

// Left circular feature parameters
left_circle_x = 0.2109;         // X center position from left edge
left_circle_y = 0.2109;         // Y center position from front edge
left_circle_outer_r = 0.2109;   // Outer radius of left circular profile
left_upper_inner_r = 0.1055;    // Inner radius for upper left hollow section
upper_slot_width = 0.04;        // Width of rounded slot interruptions in upper opening

// Right circular feature parameters
right_circle_x = 0.6094;        // X center position from left edge
right_circle_y = 0.2109;        // Y center position from front edge
right_circle_outer_r = 0.1406;  // Outer radius of right circular profile
right_circle_inner_r = 0.1055;  // Inner radius of right base opening

// Upright tab parameters
tab_x_len = 0.041188;           // X dimension of tab
tab_y_width = 0.070313;         // Y dimension of tab
tab_z_height = 0.441346;        // Z height of tab from datum
tab_x_offset = 0.0703;          // Left edge X position from datum
tab_y_offset = 0.1758;          // Front edge Y position from datum

// --------------------------
// Module Definitions
// --------------------------
// 2D profile of lower base with connecting slot and right opening
module lower_base_2d_profile() {
    difference() {
        // Connected outer boundary (hull of left and right outer circles)
        hull() {
            translate([left_circle_x, left_circle_y])
            circle(r = left_circle_outer_r);
            
            translate([right_circle_x, right_circle_y])
            circle(r = right_circle_outer_r);
        }
        // Subtract inner void for right circular feature
        translate([right_circle_x, right_circle_y])
        circle(r = right_circle_inner_r);
    }
}

// Upper left annular section with hollow core and slot interruptions
module upper_left_annular_feature() {
    difference() {
        // Outer solid cylinder (full height from base datum)
        translate([left_circle_x, left_circle_y, 0])
        cylinder(h = upper_left_total_height, r = left_circle_outer_r);
        
        // Inner hollow core (extended to avoid z-fighting)
        translate([left_circle_x, left_circle_y, -0.1])
        cylinder(h = upper_left_total_height + 0.2, r = left_upper_inner_r);
        
        // Rounded slot interruptions (opposite positions)
        for (rot = [0, 180]) {
            rotate(rot)
            translate([left_circle_x, left_circle_y, -0.1])
            linear_extrude(height = upper_left_total_height + 0.2)
            offset(r = upper_slot_width / 2)
            square([0.06, upper_slot_width], center = true);
        }
    }
}

// Upright rectangular tab feature
module upright_tab_feature() {
    translate([tab_x_offset, tab_y_offset, 0])
    cube([tab_x_len, tab_y_width, tab_z_height]);
}

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // Extrude lower base profile to specified height
    linear_extrude(height = lower_base_height)
    lower_base_2d_profile();
    
    // Add upper left annular section (merges with lower base automatically)
    upper_left_annular_feature();
    
    // Add upright tab
    upright_tab_feature();
}