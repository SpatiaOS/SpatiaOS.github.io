// === Parameters ===

// Base dimensions
base_length = 120;
base_width  = 50;
base_height = 4;

// Side wall dimensions (run along the long axis)
wall_thickness = 5;
wall_height    = 25;    // tallest feature

// End tab dimensions (short wall at one end, lower than side walls)
tab_width      = 40;    // fits inside side walls
tab_depth      = 8;     // how far it extends along length
tab_height     = 15;    // shorter than side walls

// Annular post parameters
post_outer_r   = 6;
post_inner_r   = 3;     // real central opening
post_height    = 18;    // mid-height, between tab and walls
post_count     = 5;
post_start_x   = 20;    // first post center offset from left end
post_spacing   = 20;    // center-to-center spacing

// Resolution
$fn = 80;

// === Derived values ===
channel_width = base_width - 2 * wall_thickness;

// === Modules ===

// Flat rectangular base plate
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// Single long side wall
module side_wall() {
    cube([base_length, wall_thickness, wall_height]);
}

// Both side walls along the long edges
module side_walls() {
    // Left side wall (y = 0)
    translate([0, 0, base_height])
        side_wall();
    // Right side wall (y = base_width - wall_thickness)
    translate([0, base_width - wall_thickness, base_height])
        side_wall();
}

// Short end tab inside the channel at one end (x = 0 side)
module end_tab() {
    translate([wall_thickness, wall_thickness, base_height])
        cube([tab_depth, channel_width, tab_height]);
}

// Single annular post (ring with real hole)
module annular_post() {
    difference() {
        cylinder(r = post_outer_r, h = post_height);
        translate([0, 0, -0.5])
            cylinder(r = post_inner_r, h = post_height + 1);
    }
}

// Row of annular posts centered in the channel
module post_row() {
    center_y = base_width / 2;
    for (i = [0 : post_count - 1]) {
        x_pos = post_start_x + i * post_spacing;
        translate([x_pos, center_y, base_height])
            annular_post();
    }
}

// === Assembly ===
union() {
    // 1. Flat rectangular base
    base_plate();

    // 2. Raised long side walls forming the open channel
    side_walls();

    // 3. Short end tab at one end, lower than side walls
    end_tab();

    // 4. Centered row of annular (hollow) cylindrical posts
    post_row();
}