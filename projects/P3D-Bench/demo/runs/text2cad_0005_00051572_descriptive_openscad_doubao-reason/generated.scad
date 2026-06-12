// ==============================
// PARAMETRIC DIMENSIONS (ALL IN MM)
// ==============================
// Base dimensions
base_length = 150;
base_width = 60;
base_thickness = 5;

// Side wall dimensions (tallest raised parts)
side_wall_height = 30;
side_wall_thickness = 4;

// End tab dimensions (shorter than side walls)
end_tab_height = 15;
end_tab_depth = 20;

// Annular post dimensions (mid-height between tab and walls)
num_posts = 4;
post_outer_dia = 12;
post_inner_dia = 6;
post_height = 20;

// Global resolution for curved surfaces
$fn = 80;

// ==============================
// MODULE DEFINITIONS
// ==============================
// Annular (hollow ring) post module, no base cutout
module annular_post(outer_d, inner_d, height) {
    difference() {
        // Solid outer cylinder
        cylinder(h=height, d=outer_d, center=false);
        // Inner cutout only through post, no floor penetration
        cylinder(h=height, d=inner_d, center=false);
    }
}

// ==============================
// MAIN MODEL ASSEMBLY
// ==============================
union() {
    // 1. Flat rectangular base
    color("silver") cube([base_length, base_width, base_thickness]);

    // 2. Raised long side walls forming open channel
    color("gray") {
        // Left side wall
        translate([0, 0, base_thickness])
            cube([base_length, side_wall_thickness, side_wall_height]);
        // Right side wall
        translate([0, base_width - side_wall_thickness, base_thickness])
            cube([base_length, side_wall_thickness, side_wall_height]);
    }

    // 3. Short end tab inside channel, lower than side walls
    color("blue") translate([0, side_wall_thickness, base_thickness])
        cube([end_tab_depth, base_width - 2*side_wall_thickness, end_tab_height]);

    // 4. Centered row of annular posts in channel
    color("orange") {
        // Calculate even spacing for posts along channel length
        post_spacing = (base_length - end_tab_depth) / (num_posts + 1);
        // Y position for centered alignment in channel
        post_y = base_width / 2;

        for (i = [1:1:num_posts]) {
            translate([end_tab_depth + i * post_spacing - post_outer_dia/2, post_y - post_outer_dia/2, base_thickness])
                annular_post(post_outer_dia, post_inner_dia, post_height);
        }
    }
}