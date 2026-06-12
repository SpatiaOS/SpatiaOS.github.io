// Parametric Dimensions
base_width = 80;
base_depth = 120;
base_height = 5;

wall_thickness = 8;
wall_height = 25;

tab_width = 40;
tab_depth = 10;
tab_height = 15;
tab_edge_margin = 5;

num_posts = 5;
post_outer_d = 12;
post_inner_d = 6;
post_height = 20;
post_spacing = 18;

// Resolution for curved surfaces
$fn = 64;

// Flat rectangular base
module base() {
    cube([base_width, base_depth, base_height], center=true);
}

// Raised long side walls forming the open channel
module side_walls() {
    left_x = -base_width / 2;
    right_x = base_width / 2 - wall_thickness;
    translate([left_x, 0, base_height])
        cube([wall_thickness, base_depth, wall_height]);
    translate([right_x, 0, base_height])
        cube([wall_thickness, base_depth, wall_height]);
}

// Short rectangular tab at one end, lower than side walls
module end_tab() {
    tab_y = base_depth / 2 - tab_depth - tab_edge_margin;
    translate([-tab_width / 2, tab_y, base_height])
        cube([tab_width, tab_depth, tab_height]);
}

// Single annular cylindrical post with real central opening
module annular_post() {
    difference() {
        cylinder(h=post_height, d=post_outer_d);
        cylinder(h=post_height + 1, d=post_inner_d);
    }
}

// Centered row of posts inside the channel
module post_row() {
    start_y = -((num_posts - 1) * post_spacing) / 2;
    for (i = [0 : num_posts - 1]) {
        y_pos = start_y + i * post_spacing;
        translate([0, y_pos, base_height])
            annular_post();
    }
}

// Main assembly combining all features
union() {
    base();
    side_walls();
    end_tab();
    post_row();
}