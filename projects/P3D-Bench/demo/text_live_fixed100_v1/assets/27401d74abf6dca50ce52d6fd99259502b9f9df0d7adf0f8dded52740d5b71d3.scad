// Main body dimensions (mm)
body_length = 0.702127;
body_width = 0.524964;
reference_height = 0.210295;
body_height = 0.2103;
epsilon = 0.000001;

// Shallow top recess
top_length = 0.667793;
top_width = 0.490631;
top_left = 0.0171;
top_front = 0.0172;
top_floor = 0.1888;
top_depth = 0.0215;

// Middle pocket
middle_length = 0.650626;
middle_width = 0.46488;
middle_left = 0.0257;
middle_front = 0.03;
middle_floor = 0.0729;
middle_depth = 0.1159;

// Lower offset pocket
lower_length = 0.567882;
lower_width = 0.447713;
lower_left = 0.0999;
lower_front = 0.0386;
lower_floor = 0.0215;
lower_depth = 0.0515;

// Side projection
projection_length = 0.130618;
projection_width = 0.463588;
projection_overhang = 0.0479;
projection_front = 0.03;
projection_bottom = 0.073;
projection_thickness = 0.0146;

// Side recess; upper edge approximately 0.1889
side_cut_depth = 0.0343;
side_face_length = 0.367372;
side_face_height = 0.101285;
side_front = 0.0546;
side_bottom = 0.0876;

// Rectangular pocket cutter
module pocket_cut(length, width, left, front, floor_z, depth) {
    translate([left, front, floor_z])
        cube([length, width, depth + epsilon]);
}

// Main body with three contained pocket levels
module pocketed_body() {
    difference() {
        cube([body_length, body_width, body_height]);

        pocket_cut(
            top_length, top_width,
            top_left, top_front,
            top_floor, top_depth
        );

        pocket_cut(
            middle_length, middle_width,
            middle_left, middle_front,
            middle_floor, middle_depth
        );

        pocket_cut(
            lower_length, lower_width,
            lower_left, lower_front,
            lower_floor, lower_depth
        );
    }
}

// Solid lower side projection
module side_projection() {
    translate([
        -projection_overhang,
        projection_front,
        projection_bottom
    ])
        cube([
            projection_length,
            projection_width,
            projection_thickness
        ]);
}

// Non-through left-side recess
module side_recess() {
    translate([-epsilon, side_front, side_bottom])
        cube([
            side_cut_depth + epsilon,
            side_face_length,
            side_face_height
        ]);
}

// Final solid
module model() {
    difference() {
        union() {
            pocketed_body();
            side_projection();
        }
        side_recess();
    }
}

model();