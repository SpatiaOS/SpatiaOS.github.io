// Parameters
$fn = 128;
eps = 0.0001;

// Base envelope
base_length = 0.742363;
base_width = 0.535615;
base_height_nominal = 0.094385;
base_height = 0.0944;
base_corner_radius = 0.0530;
base_offset_left = 0;
base_offset_front = 0;

// Main coaxial axis
axis_x = 0.1583;
axis_y = 0.3113;

// Base-plane void and stepped bore
base_void_radius = 0.0530;
counterbore_radius = 0.0748;
counterbore_floor_z = 0.0218;
counterbore_depth = 0.0726;
counterbore_top_z = counterbore_floor_z + counterbore_depth;

// Upper annular collar
collar_outer_radius = 0.0966;
collar_inner_radius = 0.0748;
collar_rise = 0.1452;
collar_top_z = 0.2396;
collar_join_overlap = eps;
collar_left_offset = 0.0617;
collar_right_offset = 0.4875;
collar_front_offset = 0.2147;
collar_back_offset = 0.1277;

// Small side recesses
side_recess_radius = 0.0073;
side_recess_depth = 0.0073;
side_recess_y_center = 0.0472;
side_recess_z_min = 0.0399;
side_recess_z_max = 0.0545;
side_recess_z_center = (side_recess_z_min + side_recess_z_max) / 2;
side_recess_specs = [
    [0.4487,  1],
    [0.5939, -1]
];

// Underside circular recesses
underside_recess_radius = 0.0221;
underside_recess_depth = 0.0152;
underside_recess_centers = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Rounded base footprint
module rounded_footprint_2d(l, w, r) {
    hull() {
        translate([r, r]) circle(r=r);
        translate([l-r, r]) circle(r=r);
        translate([l-r, w-r]) circle(r=r);
        translate([r, w-r]) circle(r=r);
    }
}

// Vertical circular cut
module z_cylinder_cut(x, y, r, z0, z1) {
    translate([x, y, z0])
        cylinder(h=z1-z0, r=r, center=false);
}

// X-direction blind circular side recess
module x_side_recess(face_x, dir) {
    translate([face_x + dir*side_recess_depth/2, side_recess_y_center, side_recess_z_center])
        rotate([0, 90, 0])
            cylinder(h=side_recess_depth + 2*eps, r=side_recess_radius, center=true);
}

// Annular cylinder
module annular_cylinder(outer_r, inner_r, h) {
    difference() {
        cylinder(h=h, r=outer_r, center=false);
        translate([0, 0, -eps])
            cylinder(h=h + 2*eps, r=inner_r, center=false);
    }
}

// Base blank
module base_blank() {
    translate([base_offset_left, base_offset_front, 0])
        linear_extrude(height=base_height, convexity=10)
            rounded_footprint_2d(base_length, base_width, base_corner_radius);
}

// Base with all circular removals
module base_with_cuts() {
    difference() {
        base_blank();

        // Through core void
        z_cylinder_cut(axis_x, axis_y, base_void_radius, -base_height, base_height + eps);

        // Circular counterbore band
        z_cylinder_cut(axis_x, axis_y, counterbore_radius,
                       counterbore_floor_z - eps, counterbore_top_z + eps);

        // Two shallow side circular recesses
        for (s = side_recess_specs)
            x_side_recess(s[0], s[1]);

        // Four separate underside circular recesses
        for (p = underside_recess_centers)
            z_cylinder_cut(p[0], p[1], underside_recess_radius,
                           -eps, underside_recess_depth);
    }
}

// Hollow upper collar
module upper_collar() {
    collar_start_z = collar_top_z - collar_rise - collar_join_overlap;
    collar_model_height = collar_rise + collar_join_overlap;

    translate([axis_x, axis_y, collar_start_z])
        annular_cylinder(collar_outer_radius, collar_inner_radius, collar_model_height);
}

// Main model
union() {
    base_with_cuts();
    upper_collar();
}