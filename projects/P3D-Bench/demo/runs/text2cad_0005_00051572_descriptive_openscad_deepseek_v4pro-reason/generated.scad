// Parametric design: channel with side walls, low end tab, and row of annular posts.

// Base dimensions
base_length = 80;      // X direction
base_width  = 40;      // Y direction
base_thickness = 3;    // Z thickness of the flat part

// Side walls (tallest features)
wall_thickness = 5;    // Y extent of each rail
wall_height    = 20;   // Z height from top of base

// End tab (short cross‑wall)
tab_length = 10;       // X length
tab_height = 8;        // Z height from top of base

// Annular posts
post_outer_d = 8;      // outer diameter
post_inner_d = 4;      // hole diameter
post_height  = 15;     // Z height from top of base
num_posts    = 4;      // number of posts in the row
post_clearance = 5;    // distance from tab and opposite end

// Resolution
$fn = 80;

// Convenience: Y‑range of the inner channel (between the rails)
channel_y_min = wall_thickness;
channel_y_max = base_width - wall_thickness;

// ----- Base plate -----
module base() {
    cube([base_length, base_width, base_thickness]);
}

// ----- Tall side walls (full length) -----
module side_walls() {
    // Left wall (at Y=0)
    translate([0, 0, base_thickness])
        cube([base_length, wall_thickness, wall_height]);
    // Right wall (at Y=base_width - wall_thickness)
    translate([0, channel_y_max, base_thickness])
        cube([base_length, wall_thickness, wall_height]);
}

// ----- Short cross‑wall at one end (lower than side walls) -----
module end_tab() {
    translate([0, channel_y_min, base_thickness])
        cube([tab_length, channel_y_max - channel_y_min, tab_height]);
}

// ----- Annular post (hollow cylinder) -----
module annular_post(x, y, z) {
    // Always start at the base top plane
    translate([x, y, z])
        difference() {
            cylinder(h=post_height, d=post_outer_d);
            cylinder(h=post_height, d=post_inner_d);  // hole through the post only
        }
}

// ----- Row of annular posts, centered in the channel -----
module posts() {
    // X range available for posts: from right of tab to left of far end with clearance
    start_x = tab_length + post_clearance;
    end_x   = base_length - post_clearance;

    // Even spacing
    if (num_posts > 1) {
        spacing = (end_x - start_x) / (num_posts - 1);
        for (i = [0 : num_posts-1]) {
            x = start_x + i * spacing;
            annular_post(x, base_width/2, base_thickness);
        }
    } else {
        // single post at the middle of the available range
        x = (start_x + end_x) / 2;
        annular_post(x, base_width/2, base_thickness);
    }
}

// ----- Assemble the whole model -----
union() {
    base();
    side_walls();
    end_tab();
    posts();
}