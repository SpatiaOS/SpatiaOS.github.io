// Parameters (mm)
$fn = 96;
eps = 0.02;

// Base plate
base_length = 120;
base_width = 44;
base_thickness = 4;

// Tall long side walls
side_wall_length = base_length;
side_wall_width = 7;
side_wall_height = 16;
side_wall_y_offset = base_width/2 - side_wall_width/2;

// Open center channel
channel_width = base_width - 2*side_wall_width;

// Lower end tab
tab_length = 18;
tab_side_clearance = 2.5;
tab_width = channel_width - 2*tab_side_clearance;
tab_height = 7;
tab_end_clearance = 6;
tab_x = -base_length/2 + tab_end_clearance + tab_length/2;

// Annular post row
post_count = 4;
post_outer_diameter = 12;
post_inner_diameter = 6;
post_height = 12;
post_spacing = 18;
post_row_center_x = 0;
post_row_center_y = 0;

// Post spacing helper
function post_x(i) = post_row_center_x + (i - (post_count - 1)/2) * post_spacing;

// Base plate
module base_plate() {
    translate([0, 0, base_thickness/2])
        cube([base_length, base_width, base_thickness], center=true);
}

// Raised rectangular part starting at base top
module raised_box(l, w, h, x=0, y=0) {
    translate([x, y, base_thickness - eps/2 + h/2])
        cube([l, w, h + eps], center=true);
}

// Tall rectangular side-wall build
module long_side_walls() {
    for (side = [-1, 1])
        raised_box(
            side_wall_length,
            side_wall_width,
            side_wall_height,
            0,
            side * side_wall_y_offset
        );
}

// Lower rectangular tab at one end
module lower_end_tab() {
    raised_box(tab_length, tab_width, tab_height, tab_x, 0);
}

// Added ring-shaped post with real center opening
module annular_post(outer_d, inner_d, h) {
    difference() {
        translate([0, 0, base_thickness - eps])
            cylinder(h=h + eps, d=outer_d, center=false);

        translate([0, 0, base_thickness - 2*eps])
            cylinder(h=h + 4*eps, d=inner_d, center=false);
    }
}

// Centered row of annular posts inside the channel
module annular_post_row() {
    for (i = [0 : 1 : post_count - 1])
        translate([post_x(i), post_row_center_y, 0])
            annular_post(post_outer_diameter, post_inner_diameter, post_height);
}

// Main model
module model() {
    union() {
        base_plate();
        long_side_walls();
        lower_end_tab();
        annular_post_row();
    }
}

model();