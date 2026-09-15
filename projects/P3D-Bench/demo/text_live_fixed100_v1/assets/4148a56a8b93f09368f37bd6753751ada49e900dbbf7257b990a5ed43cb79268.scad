$fn = 100;

// Tolerances for robust booleans
eps = 0.001;
overlap = 0.001;

// Base reference dimensions
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;
base_corner_radius = 0.0625;

// Central base/collar hole
base_hole_x = 0.375;
base_hole_y = 0.25;
base_hole_radius = 0.125;
collar_inner_radius = base_hole_radius;

// Underside annular collar
collar_height = 0.0375;
collar_outer_radius = 0.2125;

// End tabs
tab_length = 0.125;
tab_width = 0.375;
tab_front_back_offset = 0.0625;
tab_total_reach = 0.5875;
tab_height = tab_total_reach - base_height;
tab_top_radius = tab_length / 2;

// Tab holes
tab_hole_radius = 0.0937;
tab_hole_y = 0.25;

right_tab_x = base_length - tab_length;
left_tab_x = 0;

right_tab_hole_x = 0.75;
left_tab_hole_x = 0;

// Rounded rectangle occupying an exact bounding footprint
module rounded_rectangle_2d(l, w, r) {
    hull() {
        translate([r, r]) circle(r=r);
        translate([l - r, r]) circle(r=r);
        translate([l - r, w - r]) circle(r=r);
        translate([r, w - r]) circle(r=r);
    }
}

// Base plate with arc-edged plan outline
module base_plate() {
    linear_extrude(height=base_height, convexity=10)
        rounded_rectangle_2d(base_length, base_width, base_corner_radius);
}

// Solid collar blank; final central cut forms the annular ring
module collar_blank() {
    translate([base_hole_x, base_hole_y, -collar_height])
        cylinder(h=collar_height + overlap, r=collar_outer_radius);
}

// Vertical tab elevation profile with rounded top
module rounded_top_profile(l, h, r) {
    h_rect = max(h - r, 0);
    union() {
        square([l, h_rect]);
        translate([l / 2, h_rect]) circle(r=r);
    }
}

// Upright tab extruded along front-back width
module upright_tab(x, y, z_bottom, h) {
    translate([x, y + tab_width, z_bottom])
        rotate([90, 0, 0])
            linear_extrude(height=tab_width, convexity=10)
                rounded_top_profile(tab_length, h, tab_top_radius);
}

// Circular opening through tab
module tab_hole(x) {
    translate([x, tab_hole_y, base_height - overlap - eps])
        cylinder(
            h=tab_height + overlap + 2 * eps,
            r=tab_hole_radius
        );
}

module right_tab() {
    difference() {
        upright_tab(
            right_tab_x,
            tab_front_back_offset,
            base_height - overlap,
            tab_height + overlap
        );
        tab_hole(right_tab_hole_x);
    }
}

module left_tab() {
    difference() {
        upright_tab(
            left_tab_x,
            tab_front_back_offset,
            base_height - overlap,
            tab_height + overlap
        );
        tab_hole(left_tab_hole_x);
    }
}

// Final assembly
difference() {
    union() {
        base_plate();
        collar_blank();
        right_tab();
        left_tab();
    }

    // Central through void, continuous through base and collar
    translate([base_hole_x, base_hole_y, -collar_height - eps])
        cylinder(
            h=base_height + collar_height + 2 * eps,
            r=collar_inner_radius
        );
}