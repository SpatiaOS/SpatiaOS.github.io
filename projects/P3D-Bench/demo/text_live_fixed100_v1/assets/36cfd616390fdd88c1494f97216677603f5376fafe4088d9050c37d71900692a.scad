// Main Body Dimensions
body_width = 100;
body_depth = 70;
body_height = 40;

// Cavity Tier 1 (Broad Upper Recess & Rim)
rim_thickness = 4;
tier1_depth = 8;
tier1_width = body_width - (2 * rim_thickness);
tier1_length = body_depth - (2 * rim_thickness);

// Cavity Tier 2 (Intermediate Inset Pocket)
tier2_depth = 18;
tier2_width = 66;
tier2_length = 46;

// Cavity Tier 3 (Deepest Pocket - Asymmetric/Shifted)
tier3_depth = 30;
tier3_width = 34;
tier3_length = 36;
tier3_x_offset = -14;
tier3_y_offset = 0;

// Side Projection Features
proj_width = 12;
proj_length = 36;
proj_height = 18;

// Side Recess Features (Stepped tier directly above projection)
side_recess_width = rim_thickness + 4;
side_recess_length = 36;
side_recess_depth = 14;

// Overlap offset for clean Boolean cuts
eps = 0.01;

// Solid exterior geometry including side projection
module main_solid() {
    // Primary rectangular block
    translate([-body_width/2, -body_depth/2, 0])
        cube([body_width, body_depth, body_height]);

    // Added rectangular solid projection on the +X side
    translate([body_width/2, -proj_length/2, 0])
        cube([proj_width, proj_length, proj_height]);
}

// Subtractive interior cavities and stepped cutaways
module interior_cuts() {
    // Tier 1: Broad upper recess creating the outer rim
    translate([-tier1_width/2, -tier1_length/2, body_height - tier1_depth])
        cube([tier1_width, tier1_length, tier1_depth + eps]);

    // Tier 2: Intermediate centered inset pocket
    translate([-tier2_width/2, -tier2_length/2, body_height - tier2_depth])
        cube([tier2_width, tier2_length, tier2_depth + eps]);

    // Tier 3: Deepest pocket shifted to create uneven interior ledges
    translate([-tier3_width/2 + tier3_x_offset, -tier3_length/2 + tier3_y_offset, body_height - tier3_depth])
        cube([tier3_width, tier3_length, tier3_depth + eps]);

    // Side Recess: Stepped depth tier through the rim above the side projection
    translate([body_width/2 - rim_thickness, -side_recess_length/2, body_height - side_recess_depth])
        cube([side_recess_width + eps, side_recess_length, side_recess_depth + eps]);
}

// Final Model Assembly
difference() {
    main_solid();
    interior_cuts();
}