// Parameters
$fn = 128;
cut_epsilon = 0.001;

// Overall size
overall_length = 0.750000;
overall_width  = 0.220587;
overall_height = 0.147058;   // 0.1471 nominal extrusion height

// Rounded-link footprint
outer_lobe_radius = overall_width / 2;  // 0.1103 nominal
left_lobe_center  = [outer_lobe_radius, outer_lobe_radius];
right_lobe_center = [overall_length - outer_lobe_radius, outer_lobe_radius];
lobe_centers = [left_lobe_center, right_lobe_center];

// Concentric circular features at each lobe
step_recess_radius = 0.0956;
step_recess_depth  = 0.0882;
bore_radius        = 0.0294;

// Middle side slot
slot_length = 0.191175;
slot_x_start = (overall_length - slot_length) / 2;  // 0.2794 nominal side offsets
slot_z_bottom = 0.0618;
slot_height = 0.023529;                            // top is 0.0853 nominal
slot_depth_reach = 0.7353;

// 2D rounded link profile
module rounded_link_profile() {
    hull() {
        for (p = lobe_centers)
            translate(p)
                circle(r = outer_lobe_radius);
    }
}

// Main solid extruded upward from underside datum
module main_body() {
    linear_extrude(height = overall_height, convexity = 10)
        rounded_link_profile();
}

// Through bore at one lobe axis
module bore_cut(p) {
    translate([p[0], p[1], -cut_epsilon])
        cylinder(h = overall_height + 2 * cut_epsilon, r = bore_radius);
}

// Underside circular stepped recess at one lobe axis
module underside_recess_cut(p) {
    translate([p[0], p[1], -cut_epsilon])
        cylinder(h = step_recess_depth + cut_epsilon, r = step_recess_radius);
}

// Front-to-back rectangular slot through the side web
module side_web_slot_cut() {
    translate([slot_x_start, -cut_epsilon, slot_z_bottom])
        cube([slot_length, slot_depth_reach + cut_epsilon, slot_height], center = false);
}

// Final part
difference() {
    main_body();

    // Separate circular/annular cuts at both lobe axes
    for (p = lobe_centers) {
        underside_recess_cut(p);
        bore_cut(p);
    }

    // Through slot in the middle web
    side_web_slot_cut();
}