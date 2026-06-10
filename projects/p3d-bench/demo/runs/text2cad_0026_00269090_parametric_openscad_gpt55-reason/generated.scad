// Parameters
$fn = 96;
eps = 0.0002;

// Main base and shared footprint
base_length = 0.375;
base_width = 0.750;
base_height_declared = 0.013393;
base_extrude_depth = 0.0134;
base_datum_z = 0;

edge_left_offset = 0;
edge_right_offset = 0;
edge_front_offset = 0;
edge_back_offset = 0;

footprint_length = base_length - edge_left_offset - edge_right_offset;
footprint_width = base_width - edge_front_offset - edge_back_offset;

// Arc footprint and inner loop opening
main_wall = 0.0134;
outer_arc_radius = 0.0672;
inner_arc_radius = max(outer_arc_radius - main_wall, eps);

base_z0 = base_datum_z;
base_z1 = base_datum_z + base_extrude_depth;
upper_reach = 0.2277;

// Raised sleeve/post
sleeve_length_declared = 0.066964;
sleeve_width_declared = 0.133929;
sleeve_height_declared = 0.214286;
sleeve_extrude_depth = 0.2143;
sleeve_total_reach = 0.442;

sleeve_left_offset_nominal = 0.308;
sleeve_right_offset = 0;
sleeve_front_offset = 0.308;
sleeve_back_offset_nominal = 0.3081;

sleeve_length = sleeve_length_declared;
sleeve_width = sleeve_width_declared;
sleeve_wall = main_wall;
sleeve_x0 = base_length - sleeve_right_offset - sleeve_length;
sleeve_y0 = sleeve_front_offset;
sleeve_z0 = upper_reach;
sleeve_z1 = sleeve_total_reach;

// Lower continuation below sleeve
lower_shoulder_z0 = -base_extrude_depth;
lower_shoulder_z1 = base_datum_z;

lower_deep_start_below = 0.2277;
lower_deep_end_below = 0.0134;
lower_deep_depth = 0.2143;
lower_deep_inset_left = main_wall;
lower_deep_inset_front = main_wall;
lower_deep_inset_back = main_wall;
lower_deep_wall = main_wall;

lower_deep_length = sleeve_length - lower_deep_inset_left;
lower_deep_width = sleeve_width - lower_deep_inset_front - lower_deep_inset_back;
lower_deep_x0 = base_length - lower_deep_length;
lower_deep_y0 = sleeve_y0 + lower_deep_inset_front;
lower_deep_z0 = -lower_deep_start_below;
lower_deep_z1 = -lower_deep_end_below;

// Two circular side cuts
hole_radius = 0.0067;
hole_cut_depth = 0.0134;
hole_axis_x_from_left = 0.3616;
hole_y_front = 0.0672;
hole_y_back = 0.6828;
hole_z_min = 0.1674;
hole_z_max = 0.1808;
hole_y_positions = [hole_y_front, hole_y_back];
hole_z_center = (hole_z_min + hole_z_max) / 2;

// Rounded rectangle in the XY plane
module rounded_rect_2d(w, d, r) {
    rr = min(r, w / 2 - eps, d / 2 - eps);
    offset(r=rr)
        translate([rr, rr])
            square([w - 2 * rr, d - 2 * rr], center=false);
}

// Vertical capsule/slot in the XY plane
module capsule_2d(w, d) {
    r = w / 2;
    hull() {
        translate([r, r])
            circle(r=r);
        translate([r, d - r])
            circle(r=r);
    }
}

// Extrude a 2D child between two Z levels
module extrude_between(z0, z1) {
    translate([0, 0, z0])
        linear_extrude(height=z1 - z0, convexity=10)
            children();
}

// Main rounded footprint with true inner loop opening
module main_footprint_2d() {
    translate([edge_left_offset, edge_front_offset])
        difference() {
            rounded_rect_2d(footprint_length, footprint_width, outer_arc_radius);

            translate([main_wall, main_wall])
                rounded_rect_2d(
                    footprint_length - 2 * main_wall,
                    footprint_width - 2 * main_wall,
                    inner_arc_radius
                );
        }
}

// Sleeve/post footprint with open elongated slot
module sleeve_ring_2d(outer_l, outer_w, wall) {
    difference() {
        capsule_2d(outer_l, outer_w);

        translate([wall, wall])
            capsule_2d(outer_l - 2 * wall, outer_w - 2 * wall);
    }
}

// Thin base layer
module base_layer() {
    extrude_between(base_z0, base_z1)
        main_footprint_2d();
}

// Upper body continuing to the stated reach
module upper_body() {
    extrude_between(base_z1, upper_reach)
        main_footprint_2d();
}

// Raised sleeve/post
module raised_sleeve() {
    translate([sleeve_x0, sleeve_y0, 0])
        extrude_between(sleeve_z0, sleeve_z1)
            sleeve_ring_2d(sleeve_length, sleeve_width, sleeve_wall);
}

// Shallow lower shoulder under sleeve
module lower_shoulder() {
    translate([sleeve_x0, sleeve_y0, 0])
        extrude_between(lower_shoulder_z0, lower_shoulder_z1)
            sleeve_ring_2d(sleeve_length, sleeve_width, sleeve_wall);
}

// Deeper contained lower continuation
module lower_deep_continuation() {
    translate([lower_deep_x0, lower_deep_y0, 0])
        extrude_between(lower_deep_z0, lower_deep_z1)
            sleeve_ring_2d(lower_deep_length, lower_deep_width, lower_deep_wall);
}

// Circular cuts through the right-side wall only
module side_hole_cut(y_pos) {
    translate([hole_axis_x_from_left - eps, y_pos, hole_z_center])
        rotate([0, 90, 0])
            cylinder(h=hole_cut_depth + 2 * eps, r=hole_radius, center=false);
}

// Main model
difference() {
    union() {
        base_layer();
        upper_body();
        raised_sleeve();
        lower_shoulder();
        lower_deep_continuation();
    }

    for (yp = hole_y_positions)
        side_hole_cut(yp);
}