// ============================================================
// Channel tray with side walls, end tab, and annular posts
// ============================================================

// ---------- Parameters (all dimensions in mm) ----------
base_length   = 80;    // X dimension of base plate
base_width    = 40;    // Y dimension of base plate
base_height   = 4;     // thickness of base plate

wall_thickness = 5;    // thickness of the long side walls
wall_height    = 16;   // height of side walls above base top

tab_length     = 8;    // length of end tab wall (along X)
tab_thickness  = 5;    // thickness of end tab (along Y)
tab_height     = 10;   // top of tab is lower than side walls

post_outer_d   = 10;   // outer diameter of annular posts
post_inner_d   = 5;    // central opening diameter of posts
post_count     = 5;    // number of posts in the center row
post_height    = 12;   // height of posts above base top
post_spacing   = 14;   // center-to-center spacing of posts

$fn = 100;             // smooth curved surfaces

// ---------- Modules ----------

// Flat rectangular base plate
module base_plate() {
    cube([base_length, base_width, base_height], center = true);
}

// Long raised side walls running along X, at both Y edges
module side_walls() {
    inner_span = base_width - 2 * wall_thickness;
    for (side = [-1, 1]) {
        translate([0, side * (inner_span / 2 + wall_thickness / 2), 0])
            cube([base_length, wall_thickness,
                  base_height + wall_height],
                  center = true);
    }
}

// Short rectangular tab wall at one end, inside side-wall outline,
// stepped lower than the side walls
module end_tab() {
    translate([-base_length / 2 + tab_length / 2, 0,
               -base_height / 2 + (base_height + tab_height) / 2])
        cube([tab_length, tab_thickness, base_height + tab_height],
             center = true);
}

// Annular post: real cylindrical ring with an open center bore
module annular_post(x) {
    translate([x, 0, 0])
        difference() {
            // Outer cylinder rising from base top
            cylinder(h = base_height / 2 + post_height,
                     d = post_outer_d,
                     center = false);
            // Central through opening
            translate([0, 0, -1])
                cylinder(h = base_height / 2 + post_height + 2,
                         d = post_inner_d);
        }
}

// Row of evenly spaced centered posts inside the channel
module post_row() {
    for (i = [0 : post_count - 1])
        annular_post(-((post_count - 1) * post_spacing) / 2
                     + i * post_spacing);
}

// ---------- Assembly ----------
union() {
    base_plate();   // flat floor
    side_walls();   // tallest raised portions (top at wall_height)
    end_tab();      // shorter stepped wall at one end
    post_row();     // hollow ring posts in the open channel
}