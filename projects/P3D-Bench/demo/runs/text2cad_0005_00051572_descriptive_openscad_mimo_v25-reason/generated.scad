// Parameters
base_length = 100;
base_width = 60;
base_thickness = 5;
side_wall_height = 25;
side_wall_thickness = 8;
tab_length = 30;
tab_width = 40;
tab_height = 15;
post_outer_radius = 8;
post_inner_radius = 5;
post_height = side_wall_height;
number_of_posts = 5;
$fn = 100;

// Base platform
module base() {
    cube([base_length, base_width, base_thickness]);
}

// Long side walls
module side_walls() {
    // Left wall
    translate([0, 0, base_thickness])
        cube([base_length, side_wall_thickness, side_wall_height]);
    // Right wall
    translate([0, base_width - side_wall_thickness, base_thickness])
        cube([base_length, side_wall_thickness, side_wall_height]);
}

// Short tab at one end
module tab() {
    translate([0, (base_width - tab_width) / 2, base_thickness])
        cube([tab_length, tab_width, tab_height]);
}

// Single annular post
module annular_post() {
    difference() {
        cylinder(h = post_height, r = post_outer_radius);
        cylinder(h = post_height + 1, r = post_inner_radius);
    }
}

// Row of centered posts
module post_row() {
    // Calculate spacing
    available_length = base_length - 2 * side_wall_thickness - 2 * post_outer_radius;
    spacing = available_length / (number_of_posts - 1);
    
    for (i = [0 : number_of_posts - 1]) {
        translate([
            side_wall_thickness + post_outer_radius + i * spacing,
            base_width / 2,
            base_thickness
        ])
            annular_post();
    }
}

// Main assembly
union() {
    base();
    side_walls();
    tab();
    post_row();
}