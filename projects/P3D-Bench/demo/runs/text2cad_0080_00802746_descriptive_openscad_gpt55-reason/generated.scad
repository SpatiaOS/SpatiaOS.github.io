// Parameters (mm)
curve_segments = 96;
$fn = curve_segments;
eps = 0.05;

// Main vertical round solids
upper_center_x = 0;
upper_center_y = 20;
upper_outer_d = 70;
upper_height = 34;

lower_center_x = 0;
lower_center_y = -28;
lower_outer_d = 52;
lower_height = 22;

upper_center = [upper_center_x, upper_center_y];
lower_center = [lower_center_x, lower_center_y];
model_height = max(upper_height, lower_height);

// Upper sleeve bore and stepped recesses
upper_bore_d = 24;

upper_top_step_1_d = 56;
upper_top_step_1_depth = 3;

upper_top_step_2_d = 46;
upper_top_step_2_depth = 8;

upper_top_step_3_d = 36;
upper_top_step_3_depth = 15;

// Upper underside reliefs
upper_bottom_relief_outer_od = 62;
upper_bottom_relief_outer_id = 46;
upper_bottom_relief_outer_depth = 2.4;

upper_bottom_relief_inner_od = 48;
upper_bottom_relief_inner_id = 30;
upper_bottom_relief_inner_depth = 6.5;

upper_bottom_deep_cut_d = 32;
upper_bottom_deep_cut_depth = 18;

// Lower side cylinder cuts
lower_bore_d = 10;

lower_top_step_1_d = 24;
lower_top_step_1_depth = 3.5;

lower_top_step_2_d = 17;
lower_top_step_2_depth = 8;

lower_bottom_relief_od = 42;
lower_bottom_relief_id = 28;
lower_bottom_relief_depth = 2.2;

lower_bottom_deep_cut_d = 30;
lower_bottom_deep_cut_depth = 10;

// Small removed circular profiles
lower_screw_x_offset = 16;
lower_screw_y_offset = -9;
lower_screw_hole_d = 6.5;
lower_screw_top_recess_d = 11.2;
lower_screw_top_recess_depth = 2.6;
lower_screw_bottom_recess_d = 9.5;
lower_screw_bottom_recess_depth = 2.0;

lower_front_recess_offset = 19;
lower_front_recess_d = 11;
lower_front_recess_depth = 4;

upper_small_recess_x_offset = 14;
upper_small_recess_y_offset = 28;
upper_small_recess_d = 5.5;
upper_small_recess_depth = 2;

lower_screw_positions = [
    [lower_center_x - lower_screw_x_offset, lower_center_y + lower_screw_y_offset],
    [lower_center_x + lower_screw_x_offset, lower_center_y + lower_screw_y_offset]
];

lower_front_recess_pos = [
    lower_center_x,
    lower_center_y - lower_front_recess_offset
];

upper_small_recess_positions = [
    [upper_center_x - upper_small_recess_x_offset, upper_center_y + upper_small_recess_y_offset],
    [upper_center_x + upper_small_recess_x_offset, upper_center_y + upper_small_recess_y_offset]
];

// Basic vertical cylinder
module vertical_round(pos, d, h) {
    translate([pos[0], pos[1], 0])
        cylinder(h=h, d=d, center=false);
}

// Through opening
module through_cut(pos, d, h) {
    translate([pos[0], pos[1], -eps])
        cylinder(h=h + 2*eps, d=d, center=false);
}

// Top blind circular cut
module top_circular_recess(pos, d, depth, top_z) {
    translate([pos[0], pos[1], top_z - depth])
        cylinder(h=depth + eps, d=d, center=false);
}

// Bottom blind circular cut
module bottom_circular_recess(pos, d, depth) {
    translate([pos[0], pos[1], -eps])
        cylinder(h=depth + eps, d=d, center=false);
}

// Annular relief cutter
module annular_recess(pos, od, id, z0, h) {
    translate([pos[0], pos[1], z0])
        difference() {
            cylinder(h=h, d=od, center=false);
            translate([0, 0, -eps])
                cylinder(h=h + 2*eps, d=id, center=false);
        }
}

// Bottom annular relief
module bottom_annular_recess(pos, od, id, depth) {
    annular_recess(pos, od, id, -eps, depth + eps);
}

// Overlapping round body
module main_body() {
    union() {
        vertical_round(upper_center, upper_outer_d, upper_height);
        vertical_round(lower_center, lower_outer_d, lower_height);
    }
}

// Upper sleeve through bore and stepped cuts
module upper_sleeve_cuts() {
    through_cut(upper_center, upper_bore_d, upper_height);

    top_circular_recess(upper_center, upper_top_step_1_d, upper_top_step_1_depth, upper_height);
    top_circular_recess(upper_center, upper_top_step_2_d, upper_top_step_2_depth, upper_height);
    top_circular_recess(upper_center, upper_top_step_3_d, upper_top_step_3_depth, upper_height);

    bottom_annular_recess(upper_center, upper_bottom_relief_outer_od, upper_bottom_relief_outer_id, upper_bottom_relief_outer_depth);
    bottom_annular_recess(upper_center, upper_bottom_relief_inner_od, upper_bottom_relief_inner_id, upper_bottom_relief_inner_depth);
    bottom_circular_recess(upper_center, upper_bottom_deep_cut_d, upper_bottom_deep_cut_depth);
}

// Lower side cylinder bore and hidden underside cuts
module lower_side_cuts() {
    through_cut(lower_center, lower_bore_d, lower_height);

    top_circular_recess(lower_center, lower_top_step_1_d, lower_top_step_1_depth, lower_height);
    top_circular_recess(lower_center, lower_top_step_2_d, lower_top_step_2_depth, lower_height);

    bottom_annular_recess(lower_center, lower_bottom_relief_od, lower_bottom_relief_id, lower_bottom_relief_depth);
    bottom_circular_recess(lower_center, lower_bottom_deep_cut_d, lower_bottom_deep_cut_depth);
}

// Separate small round cuts, all subtractive
module small_removed_profiles() {
    for (p = lower_screw_positions) {
        through_cut(p, lower_screw_hole_d, lower_height);
        top_circular_recess(p, lower_screw_top_recess_d, lower_screw_top_recess_depth, lower_height);
        bottom_circular_recess(p, lower_screw_bottom_recess_d, lower_screw_bottom_recess_depth);
    }

    top_circular_recess(lower_front_recess_pos, lower_front_recess_d, lower_front_recess_depth, lower_height);

    for (p = upper_small_recess_positions) {
        top_circular_recess(p, upper_small_recess_d, upper_small_recess_depth, upper_height);
    }
}

// Main model
difference() {
    main_body();

    upper_sleeve_cuts();
    lower_side_cuts();
    small_removed_profiles();
}