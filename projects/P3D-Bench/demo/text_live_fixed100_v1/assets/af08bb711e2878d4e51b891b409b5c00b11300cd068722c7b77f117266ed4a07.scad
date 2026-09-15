// Parameters (mm)
base_length   = 100;
base_width    = 36;
base_thick    = 3;
wall_height   = 15;
wall_thick    = 3;
tab_height    = 6;
tab_thick     = 5;
post_count    = 4;
post_height   = 12;
post_od       = 8;
post_id       = 4;
post_margin   = 12;
$fn           = 72;

module base_plate() {
    cube([base_length, base_width, base_thick]);
}

module side_walls() {
    translate([0, 0, base_thick])
        cube([base_length, wall_thick, wall_height]);
    translate([0, base_width - wall_thick, base_thick])
        cube([base_length, wall_thick, wall_height]);
}

module end_tab() {
    translate([0, wall_thick, base_thick])
        cube([tab_thick, base_width - 2 * wall_thick, tab_height]);
}

module annular_post() {
    translate([0, 0, base_thick])
        difference() {
            cylinder(h = post_height, d = post_od);
            translate([0, 0, -0.2])
                cylinder(h = post_height + 0.4, d = post_id);
        }
}

module post_row() {
    span = base_length - tab_thick - 2 * post_margin;
    step = (post_count > 1) ? span / (post_count - 1) : 0;
    cy = base_width / 2;
    for (i = [0 : post_count - 1]) {
        cx = tab_thick + post_margin + i * step;
        translate([cx, cy, 0])
            annular_post();
    }
}

union() {
    base_plate();
    side_walls();
    end_tab();
    post_row();
}