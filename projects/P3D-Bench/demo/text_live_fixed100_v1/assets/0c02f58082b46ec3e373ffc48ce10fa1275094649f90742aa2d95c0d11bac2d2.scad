// Parametric OpenSCAD model
// Units: millimeters

// Resolution for cylinders and circular holes
$fn = 100;

// ------------------------------------------------------------------
// Base plate dimensions
// ------------------------------------------------------------------
base_length    = 90;
base_width     = 30;
base_thickness = 5;

// ------------------------------------------------------------------
// Raised long side-wall dimensions
// ------------------------------------------------------------------
side_wall_thickness = 5;
side_wall_height    = 14;

// ------------------------------------------------------------------
// Lower rectangular tab / short wall at one end
// ------------------------------------------------------------------
tab_length = 12;
tab_height = 6;
tab_inset  = 2;   // distance from the left base edge

// ------------------------------------------------------------------
// Annular cylindrical post dimensions
// ------------------------------------------------------------------
post_count          = 4;
post_outer_d        = 8;
post_inner_d        = 4;
post_height         = side_wall_height;
post_edge_clearance = 6;

// ------------------------------------------------------------------
// Small overlap to help produce robust CSG unions
// ------------------------------------------------------------------
overlap = 0.02;

// ------------------------------------------------------------------
// Derived values
// ------------------------------------------------------------------
channel_width = base_width - 2 * side_wall_thickness;
tab_width     = channel_width + 2 * overlap;

post_radius  = post_outer_d / 2;
post_start_x = -base_length / 2 + tab_inset + tab_length
               + post_edge_clearance + post_radius;
post_end_x   =  base_length / 2 - post_edge_clearance - post_radius;

post_span    = max(0, post_end_x - post_start_x);
post_spacing = (post_count > 1) ? post_span / (post_count - 1) : 0;

// ------------------------------------------------------------------
// Module: flat rectangular base plate
// ------------------------------------------------------------------
module base_plate() {
    translate([0, 0, base_thickness / 2]) {
        cube([base_length, base_width, base_thickness], center = true);
    }
}

// ------------------------------------------------------------------
// Module: long side wall
// side = +1 for right wall, side = -1 for left wall
// ------------------------------------------------------------------
module long_side_wall(side = 1) {
    y_pos = side * (base_width / 2 - side_wall_thickness / 2);

    translate([
        0,
        y_pos,
        base_thickness - overlap + (side_wall_height + overlap) / 2
    ]) {
        cube(
            [base_length, side_wall_thickness, side_wall_height + overlap],
            center = true
        );
    }
}

// ------------------------------------------------------------------
// Module: lower rectangular tab at one end of the channel
// ------------------------------------------------------------------
module lower_tab() {
    x_pos = -base_length / 2 + tab_inset + tab_length / 2;

    translate([
        x_pos,
        0,
        base_thickness - overlap + (tab_height + overlap) / 2
    ]) {
        cube([tab_length, tab_width, tab_height + overlap], center = true);
    }
}

// ------------------------------------------------------------------
// Module: annular cylindrical post
// Creates a ring-shaped solid with a real central opening.
// ------------------------------------------------------------------
module annular_post(x_pos) {
    translate([x_pos, 0, base_thickness - overlap]) {
        difference() {
            // Outer cylindrical post body
            cylinder(h = post_height + overlap, d = post_outer_d);

            // Central hole through the post body
            translate([0, 0, -0.1]) {
                cylinder(
                    h = post_height + overlap + 0.2,
                    d = post_inner_d
                );
            }
        }
    }
}

// ------------------------------------------------------------------
// Assemble model
// ------------------------------------------------------------------
union() {
    // Flat rectangular base
    base_plate();

    // Raised long side walls, forming an open channel
    long_side_wall(1);
    long_side_wall(-1);

    // Lower rectangular tab / short wall at one end
    lower_tab();

    // Centered row of annular cylindrical posts inside the channel
    if (post_count > 0) {
        for (i = [0 : post_count - 1]) {
            annular_post(post_start_x + i * post_spacing);
        }
    }
}