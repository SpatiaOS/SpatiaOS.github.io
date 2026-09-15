// Parameters
base_l = 0.75;
base_w = 0.375;
base_h = 0.0375;

raised_h = 0.0937;
raised_top = 0.1312;

front_wall_t = 0.0281;
back_wall_t = 0.0375;

left_l = 0.0319;
left_w = 0.3094;
left_h = 0.0562;
left_y = 0.0281;

post_y = 0.1875;
post_h = 0.0937;
post_xs = [0.15, 0.3, 0.45, 0.6];
post_ors = [0.0469, 0.0469, 0.0562, 0.0562];
post_irs = [0.0188, 0.0197, 0.0216, 0.0234];

$fn = 100;

module base_plate() {
    cube([base_l, base_w, base_h]);
}

module raised_walls() {
    cube([base_l, front_wall_t, raised_h]);
    translate([0, base_w - back_wall_t, 0])
        cube([base_l, back_wall_t, raised_h]);
}

module left_end_solid() {
    translate([0, left_y, 0])
        cube([left_l, left_w, left_h]);
}

module post_outers() {
    for (i = [0:3])
        translate([post_xs[i], post_y, 0])
            cylinder(h = post_h, r = post_ors[i]);
}

module post_holes() {
    for (i = [0:3])
        translate([post_xs[i], post_y, -0.1])
            cylinder(h = raised_top + 0.2, r = post_irs[i]);
}

difference() {
    union() {
        base_plate();
        translate([0, 0, base_h]) {
            raised_walls();
            left_end_solid();
            post_outers();
        }
    }
    post_holes();
}