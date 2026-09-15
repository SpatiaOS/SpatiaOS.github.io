// Parameters
length = 120;
width = 70;
web_h = 3;
wall_h = 16;
wall_t = 6;
frame_w = 8;
rib_w = 3.5;
n_bays = 3;
pad_d = 20;
web_hole_d = 12;
corner_hole_d = 4;
corner_inset = 5;
$fn = 72;

module side_walls() {
    cube([length, wall_t, wall_h]);
    translate([0, width - wall_t, 0])
        cube([length, wall_t, wall_h]);
}

module perimeter() {
    difference() {
        cube([length, width, web_h]);
        translate([frame_w, frame_w, -0.5])
            cube([length - 2 * frame_w, width - 2 * frame_w, web_h + 1]);
    }
}

module cross_ribs() {
    bay = length / n_bays;
    translate([0, (width - rib_w) / 2, 0])
        cube([length, rib_w, web_h]);
    for (i = [0 : n_bays])
        translate([i * bay - rib_w / 2, 0, 0])
            cube([rib_w, width, web_h]);
}

module diagonal_ribs() {
    bay = length / n_bays;
    ang = atan2(width, bay);
    dlen = sqrt(bay * bay + width * width);
    for (i = [0 : n_bays - 1]) {
        translate([i * bay + bay / 2, width / 2, web_h / 2]) {
            rotate([0, 0, ang])
                cube([dlen, rib_w, web_h], center = true);
            rotate([0, 0, -ang])
                cube([dlen, rib_w, web_h], center = true);
        }
    }
}

module hole_pads() {
    bay = length / n_bays;
    for (i = [0 : n_bays - 1])
        translate([i * bay + bay / 2, width / 2, 0])
            cylinder(h = web_h, d = pad_d);
}

module web() {
    intersection() {
        cube([length, width, web_h]);
        union() {
            perimeter();
            cross_ribs();
            diagonal_ribs();
            hole_pads();
        }
    }
}

module through_holes() {
    bay = length / n_bays;
    for (i = [0 : n_bays - 1])
        translate([i * bay + bay / 2, width / 2, -1])
            cylinder(h = wall_h + 2, d = web_hole_d);
    for (x = [corner_inset, length - corner_inset])
        for (y = [corner_inset, width - corner_inset])
            translate([x, y, -1])
                cylinder(h = wall_h + 2, d = corner_hole_d);
}

difference() {
    union() {
        web();
        side_walls();
    }
    through_holes();
}