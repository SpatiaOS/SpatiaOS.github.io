// Parametric Design with All Dimensions
// $fn = 100 for smooth curves
$fn = 100;

/* Overall base dimensions */
base_length = 0.75;
base_width  = 0.364251;
base_height = 0.080711;
base_r      = base_width / 2;

/* Through hole in base (also goes through raised region) */
hole_x = 0.4987;
hole_y = 0.1821;
hole_r = 0.0396;

/* Left coaxial stepped stack */
collar_x  = 0.1865;
collar_y  = 0.1821;
collar_r  = 0.1104;
collar_h  = 0.0914;          // height above base top

post_r     = 0.0563;
post_h     = 0.2893;         // height above collar top

/* Raised rounded region (right side) */
raised_x_off = 0.2916;                      // left edge offset
raised_y_front = 0.0144;
raised_y_back  = 0.0143;
raised_width  = base_width - raised_y_front - raised_y_back; // 0.335551
raised_length = 0.4584;                     // from raised_x_off to right edge
raised_r      = raised_width / 2;
raised_h      = 0.0411;                     // height above base top

/* Rectangular rib / tab on raised region */
rib_x     = 0.5673;                         // left edge
rib_w     = 0.182741;
rib_y     = 0.1349;                         // front edge
rib_d     = 0.094416;
rib_h     = 0.0305;                         // height above raised region top

/* Inner slot (through void in base, dimensions estimated) */
slot_x      = 0.4;
slot_y      = base_width / 2;
slot_length = 0.15;
slot_width  = 0.06;
slot_r      = slot_width / 2;

// ---------- Reusable 2D shapes ----------
// Pill (stadium) shape aligned to first quadrant
module stadium_2d(length, width) {
    r = width / 2;
    hull() {
        translate([r, r]) circle(r = r);
        translate([length - r, r]) circle(r = r);
    }
}

// Centered pill shape (long side along X)
module centered_pill_2d(length, width) {
    r = width / 2;
    hull() {
        translate([-length/2 + r, 0]) circle(r = r);
        translate([ length/2 - r, 0]) circle(r = r);
    }
}

// ---------- Solid bodies ----------

// Base solid
module base() {
    linear_extrude(height = base_height)
        stadium_2d(base_length, base_width);
}

// Left stepped stack (collar + upper post)
module stepped_stack() {
    union() {
        // collar (starts at base top)
        translate([collar_x, collar_y, base_height])
            cylinder(h = collar_h, r = collar_r);
        // upper post (starts at top of collar)
        translate([collar_x, collar_y, base_height + collar_h])
            cylinder(h = post_h, r = post_r);
    }
}

// Raised rounded region on right side
module raised_region() {
    translate([0, 0, base_height])
        linear_extrude(height = raised_h)
            translate([raised_x_off, raised_y_front])
                stadium_2d(raised_length, raised_width);
}

// Rectangular rib on top of raised region
module rib() {
    translate([rib_x, rib_y, base_height + raised_h])
        cube([rib_w, rib_d, rib_h]);
}

// Slot through base (assumed shape)
module slot_cut() {
    translate([slot_x, slot_y, -0.005])   // slightly below base to ensure through
        linear_extrude(height = base_height + 0.01)
            centered_pill_2d(slot_length, slot_width);
}

// Through hole for base and raised region
module through_hole() {
    translate([hole_x, hole_y, -0.5])
        cylinder(h = 2.0, r = hole_r);
}

// ---------- Final assembly ----------
difference() {
    union() {
        base();
        stepped_stack();
        raised_region();
        rib();
    }
    slot_cut();
    through_hole();
}