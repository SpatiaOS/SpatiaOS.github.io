// Parameters
$fn = 128;
eps = 0.0005;

// Reference datum
ref_length = 0.375;
ref_width  = 0.375;
ref_height = 0.25;

// Main annular sleeve
main_height = ref_height;
main_center_x = 0.1875;
main_center_y = 0.1875;
main_outer_radius = 0.1875;
main_bore_radius  = 0.075;
main_wall_thickness = main_outer_radius - main_bore_radius; // 0.1125

// Shallow attached tab
tab_height = 0.05;
tab_center_x = 0.1875;
tab_center_y = -0.1875;
tab_outer_radius = 0.1875;
tab_bore_radius  = 0.05;
tab_wall_thickness = tab_outer_radius - tab_bore_radius; // 0.1375

tab_left_x  = 0;
tab_right_x = 0.375;
tab_front_y = -0.375;
tab_back_y  = 0.1875;
tab_span_x = tab_right_x - tab_left_x;   // 0.375
tab_span_y = tab_back_y - tab_front_y;   // 0.5625

// Underside recess / lower bore relief
recess_height = 0.125;
recess_center_x = main_center_x;
recess_center_y = main_center_y;
recess_footprint_x = 0.2557;
recess_footprint_y = 0.2884;
recess_left_offset  = 0.0597;
recess_right_offset = 0.0596;
recess_front_offset = 0.0433;
recess_back_offset  = 0.0433;
recess_cutter_radius = 0.075;

// 2D rounded cutter envelope
module rounded_rect_2d(w, d, r) {
    hull() {
        for (x = [-w/2 + r, w/2 - r])
            for (y = [-d/2 + r, d/2 - r])
                translate([x, y])
                    circle(r=r);
    }
}

// Main circular sleeve outer solid
module main_outer_solid() {
    translate([main_center_x, main_center_y, 0])
        cylinder(h=main_height, r=main_outer_radius);
}

// Tab outer profile: circular lower tab plus upper attachment web
module tab_outer_profile_2d() {
    union() {
        translate([tab_center_x, tab_center_y])
            circle(r=tab_outer_radius);

        translate([tab_left_x, tab_center_y])
            square([tab_span_x, tab_back_y - tab_center_y], center=false);
    }
}

// Shallow tab solid
module tab_outer_solid() {
    linear_extrude(height=tab_height, center=false, convexity=10)
        tab_outer_profile_2d();
}

// Vertical cylindrical cut
module vertical_bore_cut(cx, cy, r, h) {
    translate([cx, cy, -eps])
        cylinder(h=h + 2*eps, r=r);
}

// Underside recess from base upward
module underside_recess_cut() {
    translate([recess_center_x, recess_center_y, -eps])
        linear_extrude(height=recess_height + eps, center=false, convexity=10)
            rounded_rect_2d(recess_footprint_x, recess_footprint_y, recess_cutter_radius);
}

// Complete model
difference() {
    union() {
        main_outer_solid();
        tab_outer_solid();
    }

    // Main through bore
    vertical_bore_cut(main_center_x, main_center_y, main_bore_radius, main_height);

    // Tab through opening
    vertical_bore_cut(tab_center_x, tab_center_y, tab_bore_radius, tab_height);

    // Removed underside recess / lower bore band
    underside_recess_cut();
}