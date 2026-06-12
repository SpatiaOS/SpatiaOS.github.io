// ============================================================
// Parametric Channel Base with Annular Posts and Stepped Tab
// ============================================================

// --- Base plate parameters ---
base_length      = 80;   // overall length of the base
base_width       = 36;   // overall width of the base
base_thickness   = 3;    // thickness of the flat base plate

// --- Side wall parameters ---
side_wall_height   = 22; // height of long side walls above base (tallest feature)
side_wall_thickness = 3;  // thickness of each side wall

// --- End tab parameters ---
tab_height  = 13;        // height of end tab above base (shorter than side walls)
tab_length  = 10;        // length of tab along base direction
// tab_width is computed to fill the channel

// --- Annular post parameters ---
post_count       = 4;    // number of ring-shaped posts in the channel
post_outer_radius = 5;   // outer radius of each post
post_inner_radius = 2.5; // inner radius (real through-hole) of each post
post_height       = 22;  // height of posts above base (matches side walls = tall step)
post_clearance    = 2;   // minimum clearance from tab and end edge

// --- Resolution ---
$fn = 80;

// --- Computed values ---
channel_width = base_width - 2 * side_wall_thickness;
tab_width     = channel_width; // tab spans full channel width

// ============================================================
// Module: annular post — a ring-shaped solid with a real hole
// ============================================================
module annular_post(r_out, r_in, h) {
    difference() {
        cylinder(r=r_out, h=h);
        // Subtract slightly taller cylinder to guarantee clean opening
        translate([0, 0, -0.1])
            cylinder(r=r_in, h=h + 0.2);
    }
}

// ============================================================
// Main model assembly
// ============================================================
union() {

    // 1) Flat rectangular base plate
    cube([base_length, base_width, base_thickness]);

    // 2) Left long side wall (tall step)
    translate([0, 0, base_thickness])
        cube([base_length, side_wall_thickness, side_wall_height]);

    // 3) Right long side wall (tall step)
    translate([0, base_width - side_wall_thickness, base_thickness])
        cube([base_length, side_wall_thickness, side_wall_height]);

    // 4) Short rectangular tab at one end inside the channel (lower step)
    translate([0, side_wall_thickness, base_thickness])
        cube([tab_length, tab_width, tab_height]);

    // 5) Centered row of annular cylindrical posts inside the channel
    //    Posts are spaced evenly in the remaining channel length
    //    after the tab, with clearance at both ends.
    post_zone_start = tab_length + post_clearance + post_outer_radius;
    post_zone_end   = base_length - post_clearance - post_outer_radius;

    // Compute spacing; handle single-post case
    spacing = post_count > 1
            ? (post_zone_end - post_zone_start) / (post_count - 1)
            : 0;

    for (i = [0 : post_count - 1]) {
        x_pos = post_count > 1
              ? post_zone_start + i * spacing
              : (post_zone_start + post_zone_end) / 2;
        translate([x_pos, base_width / 2, base_thickness])
            annular_post(post_outer_radius, post_inner_radius, post_height);
    }

}