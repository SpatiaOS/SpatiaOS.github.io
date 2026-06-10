$fn = 100;

// Parameters
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

base_hole_radius = 0.0163;
base_hole_centers = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.5870, 0.5163]
];

// Rail outline
rail_outer_length = 0.5109;
rail_outer_width = 0.5217;
rail_offset_left = 0.0435;
rail_offset_front = 0.0109;
rail_offset_right_ref = 0.1847;
rail_offset_back_ref = 0.0109;
rail_height = 0.0978;
rail_rib_thickness = 0.0163;

// Shallow tab
tab_length = 0.0435;
tab_width = 0.0761;
tab_offset_left = 0.7065;
tab_offset_front = 0.0978;
tab_offset_right_ref = -0.0109;
tab_offset_back_ref = 0.3696;
tab_height = 0.0163;

// Deeper side block
side_block_length = 0.1413;
side_block_width = 0.086957;
side_block_offset_left = 0.5978;
side_block_offset_front = 0.4130;
side_block_offset_right_ref = 0;
side_block_offset_back_ref = 0.0435;
side_block_source_width_ref = 0.125;
side_block_height = 0.141304;

side_block_hole_radius = 0.0326;
side_block_hole_center = [0.7391, 0.4548];

// Helper extrusion
module extrude_profile_at(x, y, z, h, conv=10) {
    translate([x, y, z])
        linear_extrude(height=h, convexity=conv)
            children();
}

// 2D rectangular rib outline
module rectangular_rib_outline_2d(outer_l, outer_w, rib_t) {
    difference() {
        square([outer_l, outer_w]);
        translate([rib_t, rib_t])
            square([outer_l - 2*rib_t, outer_w - 2*rib_t]);
    }
}

// Base plate with four through holes
module base_plate() {
    extrude_profile_at(0, 0, 0, base_height) {
        difference() {
            square([base_length, base_width]);
            for (c = base_hole_centers)
                translate([c[0], c[1]])
                    circle(r=base_hole_radius);
        }
    }
}

// Raised rail group as an outline, not a filled pad
module raised_rail_group() {
    extrude_profile_at(rail_offset_left, rail_offset_front, base_height, rail_height) {
        rectangular_rib_outline_2d(
            rail_outer_length,
            rail_outer_width,
            rail_rib_thickness
        );
    }
}

// Shallow upper tab
module shallow_tab() {
    extrude_profile_at(tab_offset_left, tab_offset_front, base_height, tab_height) {
        square([tab_length, tab_width]);
    }
}

// Deeper side block with through opening
module side_block() {
    extrude_profile_at(side_block_offset_left, side_block_offset_front, base_height, side_block_height) {
        difference() {
            square([side_block_length, side_block_width]);
            translate([
                side_block_hole_center[0] - side_block_offset_left,
                side_block_hole_center[1] - side_block_offset_front
            ])
                circle(r=side_block_hole_radius);
        }
    }
}

// Main model
union() {
    base_plate();
    raised_rail_group();
    shallow_tab();
    side_block();
}