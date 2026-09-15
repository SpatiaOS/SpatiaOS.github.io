// Parameters
$fn = 64;

base_length = 120;
base_width = 40;
base_thickness = 5;

wall_thickness = 5;
wall_height = 20;

tab_length = 15;
tab_height = 10;

post_od = 16;
post_id = 8;
post_height = 15;
post_count = 3;

// Channel width between side walls
channel_width = base_width - 2 * wall_thickness;

// Annular post module
module annular_post(h, od, id) {
    difference() {
        cylinder(h = h, d = od);
        translate([0, 0, -0.1])
            cylinder(h = h + 0.2, d = id);
    }
}

// Main assembly
union() {
    // Flat rectangular base
    cube([base_length, base_width, base_thickness]);

    // Raised long side walls
    translate([0, 0, base_thickness])
        cube([base_length, wall_thickness, wall_height]);

    translate([0, base_width - wall_thickness, base_thickness])
        cube([base_length, wall_thickness, wall_height]);

    // Short rectangular end tab
    translate([0, wall_thickness, base_thickness])
        cube([tab_length, channel_width, tab_height]);

    // Centered row of annular cylindrical posts
    available_length = base_length - tab_length;
    post_spacing = available_length / (post_count + 1);

    for (i = [1 : post_count]) {
        translate([tab_length + i * post_spacing, base_width / 2, base_thickness])
            annular_post(post_height, post_od, post_id);
    }
}