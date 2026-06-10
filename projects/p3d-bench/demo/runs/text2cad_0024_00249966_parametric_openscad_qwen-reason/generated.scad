$fn = 100; // Smooth curve resolution

// Base dimensions & offsets
base_len = 0.75;
base_wid = 0.364251;
base_h = 0.080711;
base_r = 0.04; // Arc-based corner radius

// Through-hole parameters
hole_x = 0.4987;
hole_y = 0.1821;
hole_r = 0.0396;

// Coaxial stepped stack parameters
stack_x = 0.1865;
stack_y = 0.1821;
collar_r = 0.1104;
collar_h = 0.0914;
post_r = 0.0563;
post_h = 0.2893;

// Raised rounded region parameters
raised_len = 0.4584;
raised_wid = 0.3356;
raised_x = 0.2916;
raised_y = 0.0144;
raised_h = 0.0411;
raised_r = 0.03;

// Rectangular rib/tab parameters
rib_len = 0.182741;
rib_wid = 0.094416;
rib_x = 0.5673;
rib_y = 0.1349;
rib_h = 0.0305;

// Inner slot parameters (representative dimensions)
slot_len = 0.12;
slot_wid = 0.05;
slot_x = 0.25;
slot_y = 0.1821;
slot_r = 0.015;

// Helper: Rounded rectangle with exact bounding box starting at [0,0]
module rounded_rect(len, wid, r) {
    hull() {
        translate([r, r]) circle(r);
        translate([len - r, r]) circle(r);
        translate([r, wid - r]) circle(r);
        translate([len - r, wid - r]) circle(r);
    }
}

// Main assembly: union of solids, difference for voids
difference() {
    // Combine all solid features
    union() {
        // 1. Main base with arc-based rounded outline
        translate([0, 0, 0]) linear_extrude(height=base_h) rounded_rect(base_len, base_wid, base_r);

        // 2. Raised rounded region on the right side
        translate([raised_x, raised_y, base_h]) linear_extrude(height=raised_h) rounded_rect(raised_len, raised_wid, raised_r);

        // 3. Rectangular solid rib/tab on the raised region
        translate([rib_x, rib_y, base_h + raised_h]) cube([rib_len, rib_wid, rib_h]);

        // 4. Lower circular collar of the coaxial stack
        translate([stack_x, stack_y, base_h]) cylinder(h=collar_h, r=collar_r);

        // 5. Upper solid post of the coaxial stack
        translate([stack_x, stack_y, base_h + collar_h]) cylinder(h=post_h, r=post_r);
    }

    // Void 1: Circular through opening (cuts through base, raised region, and stack)
    translate([hole_x, hole_y, -0.5]) cylinder(h=1.0, r=hole_r);

    // Void 2: Inner slot-like through opening in the base
    translate([slot_x, slot_y, -0.5]) linear_extrude(height=base_h + 1.0) rounded_rect(slot_len, slot_wid, slot_r);
}