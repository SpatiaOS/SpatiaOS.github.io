// === Parameters ===

// Base obround slab
base_length   = 0.75;
base_width    = 0.25;
base_thick    = 0.1;
end_r         = base_width / 2;   // 0.125, radius of rounded ends

// Base through-holes
hole_r  = 0.05;
hole_y  = 0.125;                  // center from front edge
hole_x1 = 0.125;                  // first hole from left edge
hole_x2 = 0.625;                  // second hole from left edge

// Lower upright block
up_x = 0.2;                      // x offset from left edge
up_y = 0.025;                    // y offset from front edge
up_l = 0.35;                     // length along x
up_w = 0.2;                      // width along y
up_h = 0.2;                      // height above base top

// Rounded cap (semicylinder)
cap_r = up_w / 2;                // 0.1, matches half the upright width

// Horizontal through-passage
pass_r    = 0.05;
pass_y    = 0.125;               // y center from front edge
pass_z    = 0.3;                 // z center above base underside
pass_x0   = 0.2;                // start x (upright left face)
pass_len  = 0.444;              // reach along +x

// Rounded upper relief (removed material)
rel_x     = 0.255;              // x start
rel_xspan = 0.24;               // x extent
rel_y     = 0.025;              // y start (front of upright)
rel_yspan = 0.299;              // y extent (overruns back)
rel_zbot  = 0.18;               // z bottom
rel_ztop  = 0.45;               // z top
rel_r     = rel_xspan / 2;      // 0.12, semicircle radius at top
rel_rect_h = rel_ztop - rel_zbot - rel_r; // 0.15, straight portion height

$fn = 100;

// === Modules ===

// 2D profile for the rounded relief (slot with semicircular top)
// Drawn in x-y plane where y maps to final z after rotation
module relief_profile_2d() {
    // Rectangular lower portion
    translate([rel_x, rel_zbot])
        square([rel_xspan, rel_rect_h]);
    // Semicircular upper portion
    translate([rel_x + rel_r, rel_zbot + rel_rect_h])
        difference() {
            circle(r = rel_r);
            translate([-rel_r, -2 * rel_r])
                square([2 * rel_r, 2 * rel_r]);
        }
}

// === Main Assembly ===

difference() {
    union() {
        // 1) Obround base slab: hull of two end cylinders
        hull() {
            translate([end_r, end_r, 0])
                cylinder(h = base_thick, r = end_r);
            translate([base_length - end_r, end_r, 0])
                cylinder(h = base_thick, r = end_r);
        }

        // 2) Solid rectangular lower upright
        translate([up_x, up_y, base_thick])
            cube([up_l, up_w, up_h]);

        // 3) Rounded cap (upper half of cylinder over same footprint)
        intersection() {
            translate([up_x, up_y + cap_r, base_thick + up_h])
                rotate([0, 90, 0])
                    cylinder(h = up_l, r = cap_r);
            // Clip to keep only upper hemisphere
            translate([up_x, up_y, base_thick + up_h])
                cube([up_l, up_w, cap_r]);
        }
    }

    // 4) Two vertical through-holes in the base
    translate([hole_x1, hole_y, -0.01])
        cylinder(h = base_thick + 0.02, r = hole_r);
    translate([hole_x2, hole_y, -0.01])
        cylinder(h = base_thick + 0.02, r = hole_r);

    // 5) Horizontal circular through-passage along x
    translate([pass_x0, pass_y, pass_z])
        rotate([0, 90, 0])
            cylinder(h = pass_len, r = pass_r);

    // 6) Rounded upper relief cutout (slot with semicircular top)
    //    Profile in x-z, extruded along y
    translate([0, rel_y + rel_yspan, 0])
        rotate([90, 0, 0])
            linear_extrude(height = rel_yspan)
                relief_profile_2d();
}