// Model Parameters
$fn = 100; // Resolution for curved surfaces

// Base dimensions
base_length = 120;
base_width = 50;
base_thickness = 5;

// Side wall dimensions
wall_thickness = 4;
wall_height = 20; // Height extending above the base

// Lower rectangular tab dimensions (at one end)
tab_length = 15;
tab_height = 8; // Stepped lower height

// Taller rectangular build dimensions (at the opposite end)
end_block_length = 20;
end_block_height = 20; // Tallest raised portion

// Annular post dimensions
post_outer_diameter = 14;
post_inner_diameter = 8;
post_height = 14; // Intermediate stepped height
num_posts = 4;

// Derived parameters for post positioning
channel_width = base_width - (2 * wall_thickness);
channel_length_for_posts = base_length - tab_length - end_block_length;
post_spacing = channel_length_for_posts / num_posts;
post_start_x = tab_length + (post_spacing / 2);

// Reusable module for the annular post
module annular_post(h, od, id) {
    difference() {
        // Outer solid cylinder
        cylinder(h = h, d = od, center = false);
        // Inner cutout (extended slightly on Z to prevent zero-thickness artifacts)
        translate([0, 0, -0.1])
            cylinder(h = h + 0.2, d = id, center = false);
    }
}

// Main Model Assembly
union() {
    // 1. Flat rectangular base
    translate([0, -base_width/2, 0])
        cube([base_length, base_width, base_thickness]);

    // 2. Raised long side walls (forming the open channel)
    // Front wall
    translate([0, -base_width/2, base_thickness])
        cube([base_length, wall_thickness, wall_height]);
    
    // Back wall
    translate([0, (base_width/2) - wall_thickness, base_thickness])
        cube([base_length, wall_thickness, wall_height]);

    // 3. Short rectangular added wall/tab (lower level)
    // Sits at x=0, inside the side walls
    translate([0, -channel_width/2, base_thickness])
        cube([tab_length, channel_width, tab_height]);

    // 4. Taller rectangular build (upper level)
    // Sits at the opposite end, inside the side walls
    translate([base_length - end_block_length, -channel_width/2, base_thickness])
        cube([end_block_length, channel_width, end_block_height]);

    // 5. Centered row of annular cylindrical posts
    // Distributed evenly in the open channel space between the two end blocks
    for (i = [0 : num_posts - 1]) {
        translate([post_start_x + (i * post_spacing), 0, base_thickness])
            annular_post(post_height, post_outer_diameter, post_inner_diameter);
    }
}