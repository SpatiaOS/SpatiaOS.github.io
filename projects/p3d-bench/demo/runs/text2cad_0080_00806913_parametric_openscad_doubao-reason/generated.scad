// Curve resolution setting
$fn = 100;

// Overall part dimensions
overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;
main_thickness = 0.1471;

// Rounded link lobe parameters
lobe_outer_radius = 0.1103;
lobe_center_y = 0.1103;
lobe1_center_x = 0.1103;
lobe2_center_x = 0.6397;

// Annular step and bore parameters
internal_step_radius = 0.0956;
bore_radius = 0.0294;
annular_recess_depth = 0.0882;

// Middle web slot parameters
slot_length = 0.191175;
slot_vertical_height = 0.023529;
slot_side_offset = 0.2794;
slot_z_lower = 0.0618;
slot_z_upper = 0.0853;
slot_through_depth = 0.7353;

// Main body module: rounded link shape extruded to full height
module rounded_link_body() {
    linear_extrude(height = main_thickness) {
        // Create rounded link footprint via hull of two end circles
        hull() {
            translate([lobe1_center_x, lobe_center_y])
                circle(r = lobe_outer_radius);
            translate([lobe2_center_x, lobe_center_y])
                circle(r = lobe_outer_radius);
        }
    }
}

// Final assembled part with all cuts
difference() {
    rounded_link_body();

    // Cut lower annular recesses at both lobe positions
    translate([lobe1_center_x, lobe_center_y, 0])
        cylinder(r = internal_step_radius, h = annular_recess_depth);
    translate([lobe2_center_x, lobe_center_y, 0])
        cylinder(r = internal_step_radius, h = annular_recess_depth);

    // Cut full through bores at both lobe centers
    translate([lobe1_center_x, lobe_center_y, -0.1])
        cylinder(r = bore_radius, h = main_thickness + 0.2);
    translate([lobe2_center_x, lobe_center_y, -0.1])
        cylinder(r = bore_radius, h = main_thickness + 0.2);

    // Cut through middle web slot
    translate([slot_side_offset, 0, slot_z_lower])
        cube([slot_length, slot_through_depth, slot_vertical_height]);
}