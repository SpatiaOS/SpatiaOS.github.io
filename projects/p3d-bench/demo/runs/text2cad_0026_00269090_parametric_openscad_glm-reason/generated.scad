// === Parametric Dimensions ===

// Base slab
base_length = 0.375;
base_width = 0.75;
base_height = 0.013393;
base_extrude = 0.0134;
corner_radius = 0.02;

// Upper body (second solid, same footprint)
body_reach = 0.2277;
body_start_z = base_extrude;
body_height = body_reach - body_start_z;

// Sleeve/post feature
sleeve_left = 0.308;
sleeve_front = 0.308;
sleeve_length = 0.066964;
sleeve_width = 0.133929;
sleeve_reach = 0.442;
sleeve_start_z = body_reach;
sleeve_height = sleeve_reach - sleeve_start_z;
sleeve_wall = 0.008;

// Lower continuation beneath base
lower_bottom_z = -0.2277;
lower_top_z = -0.0134;
lower_height = lower_top_z - lower_bottom_z;

// Circular hole cuts
hole_radius = 0.0067;
hole_x = 0.3616;
hole_y1 = 0.0672;
hole_y2 = 0.6828;
hole_z_bottom = 0.1674;
hole_z_top = 0.1808;
hole_depth = hole_z_top - hole_z_bottom;

$fn = 100;

// === Modules ===

// 2D rounded rectangle profile
module rounded_rect_2d(l, w, r) {
    hull() {
        translate([r, r])       circle(r=r);
        translate([l-r, r])     circle(r=r);
        translate([l-r, w-r])   circle(r=r);
        translate([r, w-r])     circle(r=r);
    }
}

// Rectangular inner void with uniform wall thickness
module inner_void(l, w, wall, h) {
    translate([wall, wall, 0])
        cube([l - 2*wall, w - 2*wall, h]);
}

// === Main Model ===

difference() {
    // -- Solid bodies --
    union() {
        // Base slab: rounded footprint, extruded from datum
        linear_extrude(height = base_extrude)
            rounded_rect_2d(base_length, base_width, corner_radius);

        // Upper body: same rounded footprint, extends to body_reach
        translate([0, 0, body_start_z])
            linear_extrude(height = body_height)
                rounded_rect_2d(base_length, base_width, corner_radius);

        // Sleeve/post outer shell
        translate([sleeve_left, sleeve_front, sleeve_start_z])
            cube([sleeve_length, sleeve_width, sleeve_height]);

        // Lower continuation outer shell below base
        translate([sleeve_left, sleeve_front, lower_bottom_z])
            cube([sleeve_length, sleeve_width, lower_height]);
    }

    // -- Voids and cuts --
    union() {
        // Sleeve inner void through upper body and sleeve (keeps inner loops open)
        translate([sleeve_left, sleeve_front, body_start_z - 0.001])
            inner_void(sleeve_length, sleeve_width, sleeve_wall,
                       sleeve_reach - body_start_z + 0.002);

        // Lower continuation inner void
        translate([sleeve_left, sleeve_front, lower_bottom_z - 0.001])
            inner_void(sleeve_length, sleeve_width, sleeve_wall,
                       lower_height + 0.002);

        // Circular hole near front edge
        translate([hole_x, hole_y1, hole_z_bottom])
            cylinder(h = hole_depth, r = hole_radius);

        // Circular hole near back edge
        translate([hole_x, hole_y2, hole_z_bottom])
            cylinder(h = hole_depth, r = hole_radius);
    }
}