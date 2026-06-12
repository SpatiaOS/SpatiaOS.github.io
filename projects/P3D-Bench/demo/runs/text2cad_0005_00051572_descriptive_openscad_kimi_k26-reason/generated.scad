// Parametric dimensions
base_width = 60;
base_length = 100;
base_thickness = 3;

// Tall long side walls
wall_height = 12;
wall_thickness = 5;

// Short end tab (lower than walls)
tab_height = 6;
tab_width = 30;
tab_length = 5; // extent along base_length

// Annular posts (tall hollow cylinders)
post_height = 12;
post_outer_d = 8;
post_inner_d = 4;
post_count = 5;
post_spacing = 15;

$fn = 60;

// Hollow cylindrical post module
module annular_post(od, id, h) {
    difference() {
        cylinder(h=h, d=od);
        // Slightly taller inner cylinder ensures clean open bore
        translate([0, 0, -0.01])
            cylinder(h=h + 0.02, d=id);
    }
}

// Main assembly
union() {
    // Flat rectangular base
    cube([base_width, base_length, base_thickness]);

    // Raised long side walls (full length)
    translate([0, 0, base_thickness])
        cube([wall_thickness, base_length, wall_height]);
    translate([base_width - wall_thickness, 0, base_thickness])
        cube([wall_thickness, base_length, wall_height]);

    // Short rectangular tab at one end, centered between side walls
    tab_x = wall_thickness + (base_width - 2 * wall_thickness - tab_width) / 2;
    translate([tab_x, 0, base_thickness])
        cube([tab_width, tab_length, tab_height]);

    // Centered row of annular posts inside the channel
    row_span = (post_count - 1) * post_spacing;
    row_start_y = (base_length - row_span) / 2;
    for (i = [0 : post_count - 1]) {
        y_pos = row_start_y + i * post_spacing;
        translate([base_width / 2, y_pos, base_thickness])
            annular_post(post_outer_d, post_inner_d, post_height);
    }
}