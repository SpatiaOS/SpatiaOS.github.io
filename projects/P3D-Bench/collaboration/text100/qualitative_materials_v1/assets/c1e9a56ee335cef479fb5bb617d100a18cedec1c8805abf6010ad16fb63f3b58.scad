// Parametric OpenSCAD model
// Base underside / base plane datum: z = 0, +z upward

$fn = 128;
eps = 0.00005;
clearance = 0.00001;

// Overall reference envelope
reference_length = 0.303436;   // left-right, X
reference_width  = 0.502485;   // front-back, Y
reference_height = 0.468362;   // envelope height
upright_height   = 0.4684;     // main upright height from datum

// Main upper body shaping
wall_thickness  = 0.030;
corner_radius   = 0.045;
floor_thickness = 0.030;

inner_rx = max(0.001, reference_length / 2 - wall_thickness);
inner_ry = max(0.001, reference_width  / 2 - wall_thickness);

// Small circular sleeve / recess
small_span          = 0.1428;
small_outer_r       = small_span / 2;      // 0.0714
small_bore_r        = 0.025;
small_recess_depth  = 0.1764;
small_sleeve_height = upright_height;

// Stated small offsets for traceability
small_left_offset  = 0.0827;
small_right_offset = 0.0779;
small_front_offset = 0.3518;
small_back_offset  = 0.0079;

// Small axis, using stated coaxial center
small_axis_x = 0.1542;
small_axis_y = 0.4232;

// Large lower annular solid / recess
large_profile_span = 0.4168;
large_recess_span  = 0.3512;

large_outer_r   = large_profile_span / 2;  // 0.2084
large_annular_r = large_recess_span / 2;   // 0.1756
large_bore_r    = 0.0546;
large_height    = 0.203;
large_recess_depth = 0.128;

// Stated large offsets for traceability
large_left_offset  = 0.366;
large_right_offset = -0.4138;
large_front_offset = 0.0692;
large_back_offset  = 0.0821;

// Large axis derived from circular recess span offsets
large_axis_x = large_left_offset + large_annular_r;   // 0.5416
large_axis_y = large_front_offset + large_annular_r;  // 0.2448


// Rounded rectangular 2D profile, flush to [0..length] and [0..width]
module rounded_rect_profile(length, width, r) {
    hull() {
        translate([r, r]) circle(r=r);
        translate([length - r, r]) circle(r=r);
        translate([length - r, width - r]) circle(r=r);
        translate([r, width - r]) circle(r=r);
    }
}

// Main upper body: rounded exterior, open curved interior cavity
module main_upper_body() {
    difference() {
        // Exterior upright envelope
        linear_extrude(height=upright_height, convexity=10)
            rounded_rect_profile(reference_length, reference_width, corner_radius);

        // Interior curved opening, leaving a thin floor at the base
        translate([0, 0, floor_thickness - eps])
            linear_extrude(
                height=upright_height - floor_thickness + 2 * eps,
                convexity=10
            )
            translate([reference_length / 2, reference_width / 2])
                scale([inner_rx, inner_ry])
                    circle(r=1);
    }
}

// Positioned cylinder helper
module cyl_at(x, y, z, h, r) {
    translate([x, y, z])
        cylinder(h=h, r=r);
}


// Final part
difference() {
    union() {
        // Main rounded upright body
        main_upper_body();

        // Small coaxial circular sleeve
        cyl_at(small_axis_x, small_axis_y, 0, small_sleeve_height, small_outer_r);

        // Large lower annular circular solid, outer circular tier
        cyl_at(large_axis_x, large_axis_y, 0, large_height, large_outer_r);
    }

    // Underside large stepped circular recess
    cyl_at(
        large_axis_x,
        large_axis_y,
        -eps,
        large_recess_depth + 2 * eps,
        large_annular_r
    );

    // Underside small stepped circular recess
    // Tiny radial clearance avoids coincident-face Boolean issues
    cyl_at(
        small_axis_x,
        small_axis_y,
        -eps,
        small_recess_depth + 2 * eps,
        small_outer_r + clearance
    );

    // Large central bore, true opening through large circular tier
    cyl_at(
        large_axis_x,
        large_axis_y,
        -eps,
        large_height + 2 * eps,
        large_bore_r
    );

    // Small central bore, true opening through small circular tier
    cyl_at(
        small_axis_x,
        small_axis_y,
        -eps,
        small_sleeve_height + 2 * eps,
        small_bore_r
    );
}