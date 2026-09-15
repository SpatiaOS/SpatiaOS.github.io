// Overall dimensions (mm)
base_length = 130;
base_width = 60;
base_thickness = 4;

// Raised long side walls
wall_thickness = 5;
wall_height = 14;

// Low end wall / tab
end_tab_length = 12;
end_tab_height = 6;
end_tab_offset = 2;

// Annular posts
post_count = 6;
post_spacing = 16;
post_outer_diameter = 10;
post_inner_diameter = 5;
post_height = 10;

// Resolution and assembly overlap
$fn = 80;
overlap = 0.2;

// Flat rectangular base
module base_plate() {
    cube([base_length, base_width, base_thickness], center=true);
}

// Raised wall along one long side
module side_wall(y_position) {
    translate([0, y_position, base_thickness / 2 + wall_height / 2])
        cube([base_length, wall_thickness, wall_height], center=true);
}

// Lower transverse tab at one end of the open channel
module end_tab() {
    inner_width = base_width - 2 * wall_thickness;
    x_position = -base_length / 2 + end_tab_offset + end_tab_length / 2;

    translate([x_position, 0, base_thickness / 2 + end_tab_height / 2])
        cube([end_tab_length, inner_width, end_tab_height], center=true);
}

// Ring-shaped post with a true central opening
module annular_post(x_position) {
    translate([x_position, 0, base_thickness / 2])
        difference() {
            cylinder(
                h = post_height + overlap,
                d = post_outer_diameter,
                center = true
            );

            translate([0, 0, overlap / 2])
                cylinder(
                    h = post_height + overlap + 0.2,
                    d = post_inner_diameter,
                    center = true
                );
        }
}

// Centered row of posts inside the channel
module post_row() {
    for (i = [0 : post_count - 1])
        annular_post((i - (post_count - 1) / 2) * post_spacing);
}

// Complete stepped model
union() {
    base_plate();

    side_wall(base_width / 2 - wall_thickness / 2);
    side_wall(-(base_width / 2 - wall_thickness / 2));

    end_tab();
    post_row();
}