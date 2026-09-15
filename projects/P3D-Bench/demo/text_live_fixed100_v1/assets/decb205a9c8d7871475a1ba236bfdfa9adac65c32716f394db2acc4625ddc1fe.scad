// Parameters
base_length     = 100;   // overall length of the base (X)
base_width      = 40;    // overall width of the base (Y)
base_thickness  = 5;     // thickness of the flat base (Z)

wall_height     = 15;    // height of the tall side walls above the base top
wall_thickness  = 5;     // thickness of each side wall

tab_length      = 15;    // length of the end tab (X)
tab_height      = 10;    // tab height above base top (lower than walls)

post_od         = 12;    // outer diameter of annular posts
post_id         = 6;     // inner diameter (real central opening)
post_height     = 12;    // post height above base top (below wall height)
post_count      = 5;     // number of posts in the centered row

$fn = 100;

// Flat rectangular base
module base() {
    cube([base_length, base_width, base_thickness]);
}

// Long side walls along the length, raised from the base top
module side_walls() {
    translate([0, 0, base_thickness])
        cube([base_length, wall_thickness, wall_height]);              // wall at Y = 0
    translate([0, base_width - wall_thickness, base_thickness])
        cube([base_length, wall_thickness, wall_height]);              // wall at Y = max
}

// Short end tab at one end, inside the side-wall outline, lower than walls
module end_tab() {
    translate([0, wall_thickness, base_thickness])
        cube([tab_length, base_width - 2*wall_thickness, tab_height]);
}

// Annular (ring) post: added solid with a real central opening
module annular_post(h) {
    difference() {
        cylinder(h = h, d = post_od);                                  // outer body
        translate([0, 0, -1])
            cylinder(h = h + 2, d = post_id);                          // through-bore
    }
}

// Centered row of annular posts along the channel centerline
module post_row() {
    spacing   = base_length / (post_count + 1);                        // even spacing
    for (i = [1 : post_count]) {
        x = spacing * i;                                               // X along the row
        y = base_width / 2;                                            // centered on width
        translate([x, y, base_thickness])
            annular_post(post_height);
    }
}

// Main model: union of all added solids (nothing subtracted from the base)
union() {
    base();        // flat rectangular base
    side_walls();  // tall raised side walls forming an open channel
    end_tab();     // shorter stepped tab at one end
    post_row();    // centered row of ring-shaped posts with central openings
}