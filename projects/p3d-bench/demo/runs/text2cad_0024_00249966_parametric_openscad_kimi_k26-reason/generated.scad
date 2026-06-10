$fn = 100;

// Main base plate
base_l = 0.75;
base_w = 0.364251;
base_h = 0.080711;

// Base circular through opening
hole_x = 0.4987;
hole_y = 0.1821;
hole_r = 0.0396;

// Inner slot-like through void in base
slot_l = 0.18;
slot_w = 0.06;
slot_x = 0.4;
slot_y = base_w / 2;

// Coaxial collar and post
collar_x = 0.1865;
collar_y = 0.1821;
collar_r = 0.1104;
collar_h = 0.0914;
post_r = 0.0563;
post_h = 0.2893;

// Raised rounded right-side region
raised_x = 0.2916;
raised_y = 0.0144;
raised_l = 0.4584;
raised_w = 0.3356;
raised_h = 0.0411;
raised_corner_r = 0.02;

// Rectangular rib on raised region shoulder
rib_x = 0.5673;
rib_y = 0.1349;
rib_l = 0.182741;
rib_w = 0.094416;
rib_h = 0.0305;

module rounded_rect(w, h, r) {
    offset(r = r) square([w - 2*r, h - 2*r]);
}

module base_body() {
    difference() {
        cube([base_l, base_w, base_h]);
        // Base circular through opening
        translate([hole_x, hole_y, -1])
            cylinder(h = base_h + 2, r = hole_r);
        // Inner slot-like opening
        translate([slot_x - slot_l/2, slot_y - slot_w/2, -1])
            cube([slot_l, slot_w, base_h + 2]);
    }
}

module raised_region() {
    translate([raised_x, raised_y, base_h])
        linear_extrude(height = raised_h)
            rounded_rect(raised_l, raised_w, raised_corner_r);
}

module rib() {
    translate([rib_x, rib_y, base_h + raised_h])
        cube([rib_l, rib_w, rib_h]);
}

module coaxial_stack() {
    translate([collar_x, collar_y, base_h])
        cylinder(h = collar_h, r = collar_r);
    translate([collar_x, collar_y, base_h + collar_h])
        cylinder(h = post_h, r = post_r);
}

difference() {
    union() {
        base_body();
        raised_region();
        rib();
        coaxial_stack();
    }
    // Continue hole through raised region and rib
    translate([hole_x, hole_y, base_h - 1])
        cylinder(h = raised_h + rib_h + 2, r = hole_r);
}