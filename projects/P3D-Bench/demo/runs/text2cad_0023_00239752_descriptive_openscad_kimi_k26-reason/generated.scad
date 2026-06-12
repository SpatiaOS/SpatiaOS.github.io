// Parameters
base_w = 60;
base_l = 100;
base_t = 5;

rib_w = 8;
rib_h = 4;
rib_l = 96;
rib_offset = 16;

rec_d = 12;
rec_depth = 2;
bore_d = 6;
bore_depth = base_t + 0.2;

hole_end_dist = 18;
hole_pair_spacing = 22;

$fn = 100;

// Base plate
module base() {
    cube([base_w, base_l, base_t], center=true);
}

// Lengthwise rib
module rib() {
    cube([rib_w, rib_l, rib_h], center=true);
}

// Stepped hole: shallow recess + deeper bore
module stepped_hole() {
    translate([0, 0, base_t/2 - rec_depth])
        cylinder(d=rec_d, h=rec_depth + 0.01);
    translate([0, 0, base_t/2 - bore_depth])
        cylinder(d=bore_d, h=bore_depth + 0.01);
}

// Assembly
difference() {
    union() {
        base();
        translate([rib_offset, 0, base_t/2 + rib_h/2]) rib();
        translate([-rib_offset, 0, base_t/2 + rib_h/2]) rib();
    }
    // Holes near ends
    translate([0, base_l/2 - hole_end_dist, 0]) stepped_hole();
    translate([0, base_l/2 - hole_end_dist - hole_pair_spacing, 0]) stepped_hole();
    translate([0, -base_l/2 + hole_end_dist, 0]) stepped_hole();
}