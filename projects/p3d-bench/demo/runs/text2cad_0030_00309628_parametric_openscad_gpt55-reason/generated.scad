// Parameters
$fn = 96;
clearance = 0.00005;

// Datum: left-front-bottom of base; X=length, Y=width, Z=up.

// Main base
base_length = 0.75;
base_width = 0.625;
base_height = 0.00625;
base_upward_reach_reference = 0.0062;

// Left upright wall
wall_left_offset = 0;
wall_right_offset = 0.7437;
wall_thickness = 0.0063;
wall_depth = base_width;
wall_total_height = 0.1938;
wall_rise_above_plate = 0.1875;

// Lower wall opening
lower_open_length = 0.081103;
lower_open_height = 0.111891;
lower_open_front_offset = 0.4447;
lower_open_back_offset = 0.0992;
lower_open_z_min = 0;
lower_open_cut_reach = 0.0062;

// Circular wall through-hole
circle_hole_radius = 0.0432;
circle_hole_center_y = 0.2948;
circle_hole_z_min = 0.0631;
circle_hole_z_max = 0.1495;
circle_hole_cut_reach = 0.0625;

// Upper wall opening
upper_open_length = 0.043521;
upper_open_height = 0.044108;
upper_open_front_offset = 0.091;
upper_open_back_offset = 0.4905;
upper_open_z_min = 0.0992;
upper_open_z_max_reference = 0.1433;
upper_open_cut_reach = 0.0625;

// Base through opening
base_open_length = 0.264669;
base_open_width = 0.40625;
base_open_left_offset = 0.3125;
base_open_right_offset = 0.1728;
base_open_front_offset = 0.2073;
base_open_back_offset = 0.0115;
base_open_z_min = -0.0562;
base_open_z_max = 0.0063;

// Derived positions
wall_x0 = wall_left_offset;
wall_y0 = 0;
wall_z0 = 0;
circle_hole_center_z = (circle_hole_z_min + circle_hole_z_max) / 2;

// Basic box module
module box_at(x0, y0, z0, sx, sy, sz) {
    translate([x0, y0, z0])
        cube([sx, sy, sz], center=false);
}

// Thin rectangular base
module base_plate() {
    box_at(0, 0, 0, base_length, base_width, base_height);
}

// Solid wall strip along left edge
module left_upright_wall() {
    box_at(wall_x0, wall_y0, wall_z0, wall_thickness, wall_depth, wall_total_height);
}

// Rectangular cut normal to wall
module wall_rect_cut(y0, y_len, z0, z_len, cut_reach) {
    z_bottom_clearance = (z0 <= 0) ? clearance : 0;
    through_depth = max(cut_reach, wall_thickness) + 2 * clearance;

    box_at(
        wall_x0 - clearance,
        y0,
        z0 - z_bottom_clearance,
        through_depth,
        y_len,
        z_len + z_bottom_clearance
    );
}

// Circular cut normal to wall
module wall_round_cut(yc, zc, radius, cut_reach) {
    through_depth = max(cut_reach, wall_thickness) + 2 * clearance;

    translate([wall_x0 - clearance, yc, zc])
        rotate([0, 90, 0])
            cylinder(h=through_depth, r=radius, center=false);
}

// Base rectangular through cut
module base_rect_cut() {
    box_at(
        base_open_left_offset,
        base_open_front_offset,
        base_open_z_min,
        base_open_length,
        base_open_width,
        base_open_z_max - base_open_z_min
    );
}

// Lower rectangular wall opening
module lower_wall_opening_cut() {
    wall_rect_cut(
        lower_open_front_offset,
        lower_open_length,
        lower_open_z_min,
        lower_open_height,
        lower_open_cut_reach
    );
}

// Circular wall hole
module circular_wall_hole_cut() {
    wall_round_cut(
        circle_hole_center_y,
        circle_hole_center_z,
        circle_hole_radius,
        circle_hole_cut_reach
    );
}

// Upper rectangular wall opening
module upper_wall_opening_cut() {
    wall_rect_cut(
        upper_open_front_offset,
        upper_open_length,
        upper_open_z_min,
        upper_open_height,
        upper_open_cut_reach
    );
}

// Main model
difference() {
    union() {
        base_plate();
        left_upright_wall();
    }

    base_rect_cut();
    lower_wall_opening_cut();
    circular_wall_hole_cut();
    upper_wall_opening_cut();
}