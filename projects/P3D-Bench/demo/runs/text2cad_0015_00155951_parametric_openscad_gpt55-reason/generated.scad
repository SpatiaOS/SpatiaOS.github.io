// Parameters
$fn = 96;
eps = 0.0005;

// Base
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;
base_corner_radius = 0.0625;

// Central through void
void_x = 0.375;
void_y = 0.25;
void_radius = 0.125;

// Underside annular collar
collar_depth = 0.0375;
collar_outer_radius = 0.2125;

// Upright rounded tabs
tab_length = 0.125;
tab_front_offset = 0.0625;
tab_back_offset = 0.0625;
tab_width = base_width - tab_front_offset - tab_back_offset;
tab_y0 = tab_front_offset;
tab_y1 = base_width - tab_back_offset;
tab_y_center = (tab_y0 + tab_y1) / 2;
tab_top_z = 0.5875;
tab_cap_radius = tab_width / 2;
tab_hole_radius = 0.0937;
tab_hole_z = tab_top_z - tab_cap_radius;
left_tab_x0 = 0;
right_tab_x0 = base_length - tab_length;
tab_arc_segments = 48;

// Rounded rectangle footprint
module rounded_rectangle_2d(l, w, r) {
    rr = min(r, min(l, w) / 2);
    if (rr > 0)
        translate([rr, rr])
            offset(r=rr)
                square([l - 2*rr, w - 2*rr], center=false);
    else
        square([l, w], center=false);
}

// Base plate
module base_plate() {
    linear_extrude(height=base_height, convexity=4)
        rounded_rectangle_2d(base_length, base_width, base_corner_radius);
}

// Solid collar body; central cut makes it annular
module underside_collar() {
    translate([void_x, void_y, -collar_depth])
        cylinder(h=collar_depth + eps, r=collar_outer_radius, center=false);
}

// Vertical circular through cut
module vertical_hole(x, y, r, z0, z1) {
    translate([x, y, z0])
        cylinder(h=z1 - z0, r=r, center=false);
}

// Horizontal circular cut through tab thickness
module x_axis_hole(x0, x1, y, z, r) {
    translate([(x0 + x1) / 2, y, z])
        rotate([0, 90, 0])
            cylinder(h=x1 - x0, r=r, center=true);
}

// Slot-like upright tab profile in Y-Z
function tab_profile_points(y0, y1, z0, ztop, n) =
    let(r=(y1-y0)/2, yc=(y0+y1)/2, zc=ztop-r)
    concat(
        [[y0, z0], [y1, z0]],
        [for (i = [0:n]) [yc + r*cos(180*i/n), zc + r*sin(180*i/n)]]
    );

// Extrude tab profile along X
module tab_body(x0) {
    multmatrix([
        [0, 0, 1, x0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
        linear_extrude(height=tab_length, convexity=6)
            polygon(points=tab_profile_points(tab_y0, tab_y1, base_height - eps, tab_top_z, tab_arc_segments));
}

// Upright tab with through opening
module upright_tab(x0) {
    difference() {
        tab_body(x0);
        x_axis_hole(x0 - eps, x0 + tab_length + eps, tab_y_center, tab_hole_z, tab_hole_radius);
    }
}

// Main model
difference() {
    union() {
        base_plate();
        underside_collar();
        upright_tab(left_tab_x0);
        upright_tab(right_tab_x0);
    }

    // Continuous central void through base and collar
    vertical_hole(void_x, void_y, void_radius, -collar_depth - eps, base_height + eps);
}