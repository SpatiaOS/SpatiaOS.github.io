// Parametric Bracket Model with Stepped Features
$fn = 100;

// === Base Plate ===
base_length = 0.75;
base_width = 0.3643;
base_height = 0.0807;
base_corner_r = 0.015;

// === Base Through Hole ===
hole_cx = 0.4987;
hole_cy = 0.1821;
hole_r = 0.0396;

// === Inner Slot Opening (through void in base) ===
slot_cx = 0.10;
slot_cy = 0.05;
slot_lx = 0.08;
slot_ly = 0.03;
slot_corner_r = 0.008;

// === Collar (Lower Stepped Cylinder) ===
collar_cx = 0.1865;
collar_cy = 0.1821;
collar_r = 0.1104;
collar_h = 0.0914;

// === Upper Post (Smaller Cylinder) ===
post_r = 0.0563;
post_h = 0.2893;

// === Raised Rounded Region (Right Side) ===
raised_ox = 0.2916;
raised_oy = 0.0144;
raised_lx = 0.4584;
raised_ly = 0.3356;
raised_h = 0.0411;
raised_corner_r = 0.015;

// === Circular Profile on Raised Region ===
raised_hole_cx = 0.4987;
raised_hole_cy = 0.1822;
raised_hole_r = 0.0396;

// === Rectangular Rib ===
rib_ox = 0.5673;
rib_oy = 0.1349;
rib_lx = 0.182741;
rib_ly = 0.094416;
rib_h = 0.0305;

// Small overlap for clean boolean ops
eps = 0.002;

// 2D rounded rectangle with bottom-left at origin
module rounded_rect_2d(w, h, r) {
    offset(r=r)
    translate([r, r])
    square([w - 2*r, h - 2*r]);
}

// === Main Assembly ===
union() {
    // --- Base plate with subtracted through features ---
    difference() {
        // Solid base extrusion
        linear_extrude(base_height)
        rounded_rect_2d(base_length, base_width, base_corner_r);

        // Inner slot-like opening (through void)
        translate([slot_cx - slot_lx/2, slot_cy - slot_ly/2, -eps])
        linear_extrude(base_height + 2*eps)
        rounded_rect_2d(slot_lx, slot_ly, slot_corner_r);

        // Circular through hole
        translate([hole_cx, hole_cy, -eps])
        cylinder(h=base_height + 2*eps, r=hole_r);
    }

    // --- Coaxial round stepped stack ---
    // Lower circular collar
    translate([collar_cx, collar_cy, base_height])
    cylinder(h=collar_h, r=collar_r);

    // Upper solid cylinder (post)
    translate([collar_cx, collar_cy, base_height + collar_h])
    cylinder(h=post_h, r=post_r);

    // --- Raised rounded region on right side ---
    difference() {
        translate([raised_ox, raised_oy, base_height])
        linear_extrude(raised_h)
        rounded_rect_2d(raised_lx, raised_ly, raised_corner_r);

        // Circular through hole continuing through raised region
        translate([raised_hole_cx, raised_hole_cy, base_height - eps])
        cylinder(h=raised_h + 2*eps, r=raised_hole_r);
    }

    // --- Rectangular rib/tab on raised region ---
    translate([rib_ox, rib_oy, base_height + raised_h])
    cube([rib_lx, rib_ly, rib_h]);
}