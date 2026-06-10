// Parameters
$fn = 120;
eps = 0.0005;

// Plate
plate_length = 0.225;
plate_width = 0.750;
plate_thickness = 0.0375;

// Plate through holes
hole_radius = 0.0281;
hole_x = 0.1125;
hole_y_positions = [0.0375, 0.7125];

// Central rectangular body
center_body_length = 0.225;
center_body_width = 0.5625;
center_body_front_offset = 0.0938;
center_body_back_offset = 0.0937;
center_body_top_z = 0.1125;
center_body_down_depth = 0.375;
center_body_total_height = center_body_top_z + center_body_down_depth;

// Stepped boss
boss_axis_x = plate_length / 2;
boss_axis_y = 0.46875;

collar_outer_radius = 0.1078;
collar_inner_radius = 0.0563;
collar_height = 0.0938;
collar_top_z = center_body_top_z + collar_height;

pin_radius = 0.0563;
pin_height = 0.1594;
pin_top_z = center_body_top_z + pin_height;

// Helper: rectangular prism by offsets
module offset_box(x0, y0, z0, sx, sy, sz) {
    translate([x0, y0, z0])
        cube([sx, sy, sz], center=false);
}

// Helper: vertical through hole
module vertical_hole(x, y, z0, h, r) {
    translate([x, y, z0 + h / 2])
        cylinder(h=h + 2 * eps, r=r, center=true);
}

// Helper: annular cylinder
module annular_cylinder(outer_r, inner_r, h) {
    difference() {
        cylinder(h=h, r=outer_r, center=false);
        translate([0, 0, -eps])
            cylinder(h=h + 2 * eps, r=inner_r, center=false);
    }
}

// Main plate with two individual through openings
module holed_plate() {
    difference() {
        offset_box(0, 0, 0, plate_length, plate_width, plate_thickness);

        for (hy = hole_y_positions)
            vertical_hole(hole_x, hy, 0, plate_thickness, hole_radius);
    }
}

// Central upper and underside rectangular solids on shared footprint
module central_body() {
    offset_box(
        0,
        center_body_front_offset,
        -center_body_down_depth,
        center_body_length,
        center_body_width,
        center_body_total_height
    );
}

// Upper annular collar and solid pin
module stepped_boss() {
    translate([boss_axis_x, boss_axis_y, center_body_top_z])
        annular_cylinder(collar_outer_radius, collar_inner_radius, collar_height);

    translate([boss_axis_x, boss_axis_y, center_body_top_z])
        cylinder(h=pin_height, r=pin_radius, center=false);
}

// Complete model
union() {
    holed_plate();
    central_body();
    stepped_boss();
}