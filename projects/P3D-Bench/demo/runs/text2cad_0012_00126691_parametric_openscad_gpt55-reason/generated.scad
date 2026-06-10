$fn = 64;
eps = 0.0001;

// Parameters
base_length = 0.5;
base_width = 0.75;
base_height = 0.016667;        // main extrusion depth ~= 0.0167

rear_feature_length = base_length;
rear_feature_width = 0.5;
rear_feature_front_offset = base_width - rear_feature_width;
rear_feature_reach = 0.2334;

edge_strip_width = 0.0083;
edge_strip_length = rear_feature_width;
edge_strip_height = 0.0083;
edge_strip_opposite_offset = 0.4917;

transverse_length = base_length;
transverse_front_offset = 0.24922;
transverse_back_offset = 0.249961;
transverse_width = base_width - transverse_front_offset - transverse_back_offset;
transverse_thickness = 0.0021;
transverse_reach = 0.335265;
transverse_z = transverse_reach - transverse_thickness;

step_shoulder_z = rear_feature_reach;
upper_pad_depth = 0.1;
lower_continuation_depth = 0.2167;
lower_continuation_length = edge_strip_opposite_offset;
lower_continuation_width = transverse_width;

internal_wall_x = edge_strip_width;
internal_wall_y = edge_strip_width;
internal_void_x = internal_wall_x;
internal_void_y = transverse_front_offset + internal_wall_y;
internal_void_length = transverse_length - 2 * internal_wall_x;
internal_void_width = transverse_width - 2 * internal_wall_y;
internal_void_z = base_height - eps;
internal_void_height = transverse_reach - base_height + 2 * eps;

internal_void_points = [
    [internal_void_x, internal_void_y],
    [internal_void_x + internal_void_length, internal_void_y],
    [internal_void_x + internal_void_length, internal_void_y + internal_void_width],
    [internal_void_x, internal_void_y + internal_void_width]
];

// Helper
module cuboid_at(x, y, z, sx, sy, sz) {
    translate([x, y, z])
        cube([sx, sy, sz], center=false);
}

// Base slab
module base_slab() {
    cuboid_at(0, 0, 0, base_length, base_width, base_height);
}

// Rear raised rectangular feature
module rear_feature() {
    cuboid_at(
        0,
        rear_feature_front_offset,
        base_height - eps,
        rear_feature_length,
        rear_feature_width,
        rear_feature_reach - base_height + eps
    );
}

// Narrow left and right upper edge strips
module edge_strips() {
    cuboid_at(
        0,
        rear_feature_front_offset,
        step_shoulder_z - eps,
        edge_strip_width,
        edge_strip_length,
        edge_strip_height + eps
    );

    cuboid_at(
        edge_strip_opposite_offset,
        rear_feature_front_offset,
        step_shoulder_z - eps,
        edge_strip_width,
        edge_strip_length,
        edge_strip_height + eps
    );
}

// Aligned stepped portion
module stepped_portion() {
    union() {
        // Deeper continuation measured from the same shoulder
        cuboid_at(
            0,
            transverse_front_offset,
            step_shoulder_z - lower_continuation_depth - eps,
            lower_continuation_length,
            lower_continuation_width,
            lower_continuation_depth + eps
        );

        // Upper pad
        cuboid_at(
            0,
            transverse_front_offset,
            step_shoulder_z - eps,
            transverse_length,
            transverse_width,
            upper_pad_depth + eps
        );
    }
}

// Thin transverse top feature
module transverse_cap() {
    cuboid_at(
        0,
        transverse_front_offset,
        transverse_z,
        transverse_length,
        transverse_width,
        transverse_thickness
    );
}

// Closed internal profile cut as a real void
module internal_profile_void() {
    translate([0, 0, internal_void_z])
        linear_extrude(height=internal_void_height, center=false, convexity=4)
            polygon(points=internal_void_points);
}

// Main model
difference() {
    union() {
        base_slab();
        rear_feature();
        edge_strips();
        stepped_portion();
        transverse_cap();
    }

    internal_profile_void();
}