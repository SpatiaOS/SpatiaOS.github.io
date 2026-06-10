// Parametric Link Model
// Overall dimensions: length=0.75, width=0.220587, height=0.147058

// Parameters
overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;
main_solid_thickness = 0.1471;

// Base footprint parameters
lobe_radius = 0.1103;
left_lobe_center_x = 0.1103;
left_lobe_center_y = 0.1103;
right_lobe_center_x = 0.6397;
right_lobe_center_y = 0.1103;

// Circular feature parameters
outer_lobe_radius = 0.1103;
stepped_radius = 0.0956;
bore_radius = 0.0294;
recess_depth = 0.0882;

// Slot parameters
slot_length = 0.191175;
slot_height = 0.023529;
slot_left_offset = 0.2794;
slot_right_offset = 0.2794;
slot_vertical_start = 0.0618;
slot_vertical_end = 0.0853;
slot_reach = 0.7353;

// Resolution
$fn = 100;

// Helper module: rounded link base footprint
module base_footprint() {
    hull() {
        // Left lobe
        translate([left_lobe_center_x, left_lobe_center_y, 0])
            circle(r = lobe_radius);
        // Right lobe
        translate([right_lobe_center_x, right_lobe_center_y, 0])
            circle(r = lobe_radius);
    }
}

// Helper module: circular features at lobe centers
module circular_features() {
    // Left lobe features
    translate([left_lobe_center_x, left_lobe_center_y, 0]) {
        // Through bore
        cylinder(h = overall_height + 0.01, r = bore_radius, center = false);
        // Annular recess
        translate([0, 0, overall_height - recess_depth])
            cylinder(h = recess_depth + 0.01, r = stepped_radius, center = false);
    }
    
    // Right lobe features
    translate([right_lobe_center_x, right_lobe_center_y, 0]) {
        // Through bore
        cylinder(h = overall_height + 0.01, r = bore_radius, center = false);
        // Annular recess
        translate([0, 0, overall_height - recess_depth])
            cylinder(h = recess_depth + 0.01, r = stepped_radius, center = false);
    }
}

// Helper module: rectangular slot
module slot_cut() {
    slot_width = slot_length;
    slot_depth = slot_reach;
    slot_height_val = slot_vertical_end - slot_vertical_start;
    
    // Position slot in the middle of the part
    slot_x_start = slot_left_offset;
    slot_y_start = 0; // Starts at front edge
    slot_z_start = slot_vertical_start;
    
    translate([slot_x_start, slot_y_start, slot_z_start])
        cube([slot_width, slot_depth, slot_height_val]);
}

// Main model construction
difference() {
    // Create main solid body
    linear_extrude(height = main_solid_thickness)
        base_footprint();
    
    // Cut circular features
    circular_features();
    
    // Cut rectangular slot
    slot_cut();
}