// Parametric OpenSCAD model of an open-top hollow enclosure with
// front and left side openings, plus an internal front ledge.
// All dimensions in millimeters.

// ---------- Global parameters ----------
$fn = 100;  // smoothing for any curved primitives (none used, but good practice)

// Overall outer envelope
total_width = 0.75;
total_depth = 0.625;
total_height = 0.55;

// Wall thickness (used for all walls, top and bottom are open)
wall_thickness = 0.075;

// ---------- Derived inner dimensions ----------
inner_width = total_width - 2 * wall_thickness;   // 0.6
inner_depth = total_depth - 2 * wall_thickness;   // 0.475
// inner void runs full height (open top and bottom)

// ---------- Front wall cut (horizontal rectangular opening) ----------
front_cut_length = 0.5;
front_cut_low_z = 0.25;
front_cut_high_z = 0.45;
front_cut_height = front_cut_high_z - front_cut_low_z; // 0.2
front_cut_x_offset = (total_width - front_cut_length) / 2; // 0.125, centered
front_cut_depth = wall_thickness;  // cuts through entire front wall

// ---------- Left side opening (vertical rectangular opening) ----------
left_cut_depth = wall_thickness;            // cuts inward from left face
left_cut_y_front_margin = 0.2;
left_cut_y_back_margin = 0.2;
left_cut_y_span = total_depth - left_cut_y_front_margin - left_cut_y_back_margin; // 0.225
left_cut_y_start = left_cut_y_front_margin; // 0.2
left_cut_height = 0.5;                     // from underside (z=0) up to 0.5
left_cut_z_start = 0;

// ---------- Internal front ledge ----------
ledge_length = 0.5;
ledge_width = 0.1;           // protrudes into interior from front inner face
ledge_thickness = 0.0125;     // thickness (small tier)
ledge_x_offset = (total_width - ledge_length) / 2; // 0.125, centered
ledge_y_back = wall_thickness; // attaches to front inner face at y=0.075
ledge_z_start = 0;            // vertical position at bottom (adjustable)

// ---------- Modules ----------

// Creates the hollow shell: walls only, no top or bottom.
module hollow_body() {
    difference() {
        // outer solid block
        cube([total_width, total_depth, total_height]);
        // subtract inner void, slightly oversized in height to remove floor and ceiling
        translate([wall_thickness, wall_thickness, -1])
            cube([inner_width, inner_depth, total_height + 2]);
    }
}

// Adds the internal ledge (shallow tier) on the front inner wall.
module internal_ledge() {
    translate([ledge_x_offset, ledge_y_back, ledge_z_start])
        cube([ledge_length, ledge_width, ledge_thickness]);
}

// ---------- Main assembly ----------
union() {
    // Hollow enclosure with cutouts
    difference() {
        hollow_body();

        // Front horizontal wall cut (subtractive)
        translate([front_cut_x_offset, -0.01, front_cut_low_z])
            cube([front_cut_length, front_cut_depth + 0.01, front_cut_height]);

        // Left vertical side opening (subtractive)
        translate([-0.01, left_cut_y_start, left_cut_z_start])
            cube([left_cut_depth + 0.01, left_cut_y_span, left_cut_height]);
    }

    // Attach the thin internal ledge
    internal_ledge();
}