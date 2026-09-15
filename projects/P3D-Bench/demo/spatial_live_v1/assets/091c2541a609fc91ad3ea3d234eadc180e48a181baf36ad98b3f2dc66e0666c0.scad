// Parameters
body_width = 50.7;
body_height = 19.0;
body_depth = 7.9;
front_plate_thickness = 0.1;
segment_thickness = 0.01;

digit_count = 4;
digit_pitch = 12.9;
digit_center_height = 9.3;
digit_height = 13.4;
digit_slant = 0.18;

horizontal_segment_length = 6.44;
horizontal_segment_width = 1.48;
middle_segment_length = 6.34;
middle_segment_width = 1.44;
vertical_segment_length = 5.68;
vertical_segment_width = 1.50;
segment_end_clearance = 0.20;

decimal_radius = 0.8;
last_decimal_radius = 0.8026;
decimal_offset_x = 4.1;
decimal_center_height = 3.6;

pin_count = 12;
pin_pitch = 2.54;
pin_radius = 0.25;
pin_shank_length = 2.63;
pin_tip_length = 0.37;
pin_tip_radius = 0.12;
pin_top_offset = 2.0;

join_overlap = 0.002;
$fn = 64;

bar_row_offset = (digit_height - horizontal_segment_width) / 2;
side_column_offset = horizontal_segment_length / 2
                   + segment_end_clearance / 2;

// Hexagonal segment profile
module segment_profile(length, width) {
    bevel = width / 2;
    polygon(points = [
        [-length / 2, 0],
        [-length / 2 + bevel, -width / 2],
        [ length / 2 - bevel, -width / 2],
        [ length / 2, 0],
        [ length / 2 - bevel, width / 2],
        [-length / 2 + bevel, width / 2]
    ]);
}

// Seven-segment digit
module digit_profile() {
    multmatrix([
        [1, digit_slant, 0, 0],
        [0, 1,           0, 0],
        [0, 0,           1, 0],
        [0, 0,           0, 1]
    ])
    union() {
        for (row = [-1, 1])
            translate([0, row * bar_row_offset])
                segment_profile(
                    horizontal_segment_length,
                    horizontal_segment_width
                );

        segment_profile(middle_segment_length, middle_segment_width);

        for (side = [-1, 1], row = [-1, 1])
            translate([
                side * side_column_offset,
                row * bar_row_offset / 2
            ])
                rotate(90)
                    segment_profile(
                        vertical_segment_length,
                        vertical_segment_width
                    );
    }
}

// Front-facing extrusion
module front_feature(x, z) {
    translate([x, -front_plate_thickness + join_overlap, z])
        rotate([90, 0, 0])
            linear_extrude(height = segment_thickness + join_overlap)
                children();
}

// Housing and front datum plate
module housing() {
    color([0.58, 0.58, 0.60])
        translate([0, body_depth / 2, body_height / 2])
            cube([body_width, body_depth, body_height], center = true);

    color([0.64, 0.64, 0.66])
        translate([
            0,
            (join_overlap - front_plate_thickness) / 2,
            body_height / 2
        ])
            cube([
                body_width,
                front_plate_thickness + join_overlap,
                body_height
            ], center = true);
}

// Display segments and decimal points
module display_face() {
    color([0.72, 0.72, 0.74])
        for (i = [0 : digit_count - 1]) {
            digit_x = (i - (digit_count - 1) / 2) * digit_pitch;

            front_feature(digit_x, digit_center_height)
                digit_profile();

            front_feature(
                digit_x + decimal_offset_x,
                decimal_center_height
            )
                circle(r = i == digit_count - 1
                    ? last_decimal_radius
                    : decimal_radius);
        }
}

// Tapered locating pin
module locating_pin() {
    union() {
        translate([0, 0, -join_overlap])
            cylinder(
                h = pin_shank_length + join_overlap,
                r = pin_radius
            );

        translate([0, 0, pin_shank_length - join_overlap])
            cylinder(
                h = pin_tip_length + join_overlap,
                r1 = pin_radius,
                r2 = pin_tip_radius
            );
    }
}

// Upper rear pin row
module rear_pins() {
    color([0.75, 0.75, 0.77])
        for (i = [0 : pin_count - 1])
            translate([
                (i - (pin_count - 1) / 2) * pin_pitch,
                body_depth,
                body_height - pin_top_offset
            ])
                rotate([-90, 0, 0])
                    locating_pin();
}

// Unified assembly
union() {
    housing();
    display_face();
    rear_pins();
}