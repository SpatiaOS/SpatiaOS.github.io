// Parameters
$fn = 96;
eps = 0.001;

// Main base
base_len = 0.7500;
base_w = 0.364251;
base_h = 0.080711;

// Base inner slot-like through void
slot_len = 0.1500;
slot_w = 0.0300;
slot_cx = 0.2550;
slot_cy = 0.0475;

// Base circular through opening
hole_cx = 0.4987;
hole_cy = 0.1821;
hole_r = 0.0396;

// Lower circular collar
collar_cx = 0.1865;
collar_cy = 0.1821;
collar_r = 0.1104;
collar_h = 0.0914;

// Upper solid post
post_cx = collar_cx;
post_cy = collar_cy;
post_r = 0.0563;
post_h = 0.2893;

// Right raised rounded region
raised_x = 0.2916;
raised_y = 0.0144;
raised_len = 0.4584;
raised_w = 0.3356;
raised_h = 0.0411;

// Rectangular raised rib/tab
rib_len = 0.182741;
rib_w = 0.094416;
rib_x = base_len - rib_len;
rib_y = 0.1349;
rib_h = 0.0305;

// Derived heights
z_base_top = base_h;
z_collar_top = base_h + collar_h;
z_post_top = base_h + collar_h + post_h;
z_raised_top = base_h + raised_h;
z_rib_top = base_h + raised_h + rib_h;
cut_h = max(z_post_top, z_rib_top) + 2 * eps;

// 2D horizontal capsule
module capsule_2d(len, wid) {
    r = wid / 2;
    hull() {
        translate([r, r]) circle(r = r);
        translate([len - r, r]) circle(r = r);
    }
}

// 3D extruded capsule
module capsule_prism(len, wid, h) {
    linear_extrude(height = h)
        capsule_2d(len, wid);
}

// Slot-like void
module slot_2d(len, wid) {
    capsule_2d(len, wid);
}

// Main base with inner through slot
module base_body() {
    linear_extrude(height = base_h)
        difference() {
            capsule_2d(base_len, base_w);
            translate([slot_cx - slot_len / 2, slot_cy - slot_w / 2])
                slot_2d(slot_len, slot_w);
        }
}

// Lower collar cylinder
module lower_collar() {
    translate([collar_cx, collar_cy, z_base_top])
        cylinder(h = collar_h, r = collar_r);
}

// Upper solid post cylinder
module upper_post() {
    translate([post_cx, post_cy, z_collar_top])
        cylinder(h = post_h, r = post_r);
}

// Right raised rounded shoulder
module raised_region() {
    translate([raised_x, raised_y, z_base_top])
        capsule_prism(raised_len, raised_w, raised_h);
}

// Rectangular rib/tab tier
module rib_tab() {
    translate([rib_x, rib_y, z_raised_top])
        cube([rib_len, rib_w, rib_h]);
}

// Through circular cut
module circular_through_cut() {
    translate([hole_cx, hole_cy, -eps])
        cylinder(h = cut_h, r = hole_r);
}

// Main model
difference() {
    union() {
        base_body();
        lower_collar();
        upper_post();
        raised_region();
        rib_tab();
    }

    // Base and raised-region circular through opening
    circular_through_cut();
}