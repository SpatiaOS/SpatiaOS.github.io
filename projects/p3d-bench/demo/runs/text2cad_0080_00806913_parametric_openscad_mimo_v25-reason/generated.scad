// Main dimensions
overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;
extrusion_height = 0.1471;

// Lobe parameters
lobe_radius = 0.1103;
left_lobe_center = [0.1103, 0.1103];
right_lobe_center = [0.6397, 0.1103];

// Internal circular features
inner_radius = 0.0956;
bore_radius = 0.0294;
recess_depth = 0.0882;

// Slot parameters
slot_length = 0.191175;
slot_height = 0.023529;
slot_offset = 0.2794;
slot_z_min = 0.0618;
slot_z_max = 0.0853;
slot_reach = 0.7353;

$fn = 100;

// Create stadium-shaped base footprint
module stadium_base() {
    hull() {
        translate(left_lobe_center) circle(r=lobe_radius);
        translate(right_lobe_center) circle(r=lobe_radius);
    }
}

// Main body
module main_body() {
    linear_extrude(height=extrusion_height) {
        stadium_base();
    }
}

// Circular features at lobe centers
module circular_features(center) {
    // Through bore
    translate(center)
        cylinder(h=extrusion_height + 1, r=bore_radius, center=true);
    
    // Annular recess from bottom
    translate(center)
        cylinder(h=recess_depth, r=inner_radius);
}

// Rectangular slot
module side_slot() {
    translate([slot_offset, -1, slot_z_min])
        cube([slot_length, slot_reach, slot_z_max - slot_z_min]);
}

// Final assembly
difference() {
    main_body();
    
    // Cut circular features at both lobes
    circular_features(left_lobe_center);
    circular_features(right_lobe_center);
    
    // Cut rectangular slot
    side_slot();
}