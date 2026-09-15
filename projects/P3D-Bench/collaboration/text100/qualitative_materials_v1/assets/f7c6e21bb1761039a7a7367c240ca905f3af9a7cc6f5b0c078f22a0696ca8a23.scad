// ---------------- Parameters (mm) ----------------
$fn = 100;

// Main rounded base plate
base_l   = 0.740822;              // overall length (X)
base_w   = 0.672842;              // overall width  (Y)
base_h   = 0.171797;              // overall height (Z)
corner_r = 0.16;                  // rounded outer lobe radius

// Stepped underside
lower_pad_h = 0.0206;                 // contained lower pad depth
upper_pad_h = base_h - lower_pad_h;   // broad upper pad depth (0.1512)
pad_r       = 0.432928 / 2;           // pad radius (0.216464)

// Central circular through opening
hole_x = 0.3687;                  // axis from left edge
hole_y = 0.4283;                  // axis from front edge
hole_r = 0.2165;

// Shallow circular upper feature around the opening
collar_h = 0.020616;

// Narrow straight web crossing the opening
web_x0 = 0.3434;  web_dx = 0.025368;   // left offset, length (X)
web_y0 = 0.2119;  web_dy = 0.432873;   // front offset, width (Y)

// Small round feature / post inside the opening
post_x = 0.4796;                  // axis from left edge
post_y = 0.4283;                  // axis from front edge
post_r = 0.0992;                  // outer radius (bounding span 0.1984)

// Circular removed recess at the post axis
recess_r  = 0.0754;
recess_z0 = -0.1512;              // band start (below base underside)
recess_z1 =  0.0206;              // band end (total band 0.1718)

// Slot-like openings near the rounded lobes
slot_len = 0.07;
slot_w   = 0.028;
slot_off = 0.13;

eps = 0.002;

// ---------------- Modules ----------------
// Rounded rectangular footprint of the base
module base_footprint() {
    offset(r = corner_r)
        square([base_l - 2*corner_r, base_w - 2*corner_r]);
}

// Capsule-shaped slot profile
module slot_profile() {
    hull() {
        translate([-(slot_len - slot_w)/2, 0]) circle(r = slot_w/2);
        translate([ (slot_len - slot_w)/2, 0]) circle(r = slot_w/2);
    }
}

// Four diagonal slots near the rounded corners
module corner_slots() {
    for (px = [slot_off, base_l - slot_off], py = [slot_off, base_w - slot_off]) {
        ang = ((px < base_l/2) == (py < base_w/2)) ? 45 : -45;
        translate([px, py, -eps])
            linear_extrude(base_h + 2*eps)
                rotate(ang) slot_profile();
    }
}

// ---------------- Model ----------------
difference() {
    union() {
        difference() {
            union() {
                // Broad upper pad: rounded plate, z = 0.0206 .. 0.1718
                translate([0, 0, lower_pad_h])
                    linear_extrude(upper_pad_h) base_footprint();
                // Shallow circular upper feature (consumed by the opening)
                translate([hole_x, hole_y, base_h - collar_h])
                    cylinder(r = pad_r, h = collar_h);
                // Contained lower pad: floor of the central opening, z = 0 .. 0.0206
                translate([hole_x, hole_y, 0])
                    cylinder(r = pad_r, h = lower_pad_h);
            }
            // Central opening through the upper pad, stopping on the lower pad
            translate([hole_x, hole_y, lower_pad_h])
                cylinder(r = hole_r, h = upper_pad_h + eps);
        }
        // Narrow web crossing the opening, full height 0 .. 0.1718
        translate([web_x0, web_y0, 0])
            cube([web_dx, web_dy, base_h]);
        // Round post inside the opening, full height 0 .. 0.1718
        translate([post_x, post_y, 0])
            cylinder(r = post_r, h = base_h);
    }
    // Circular removed recess: through lower pad, 0.0206 up into the post
    translate([post_x, post_y, recess_z0])
        cylinder(r = recess_r, h = recess_z1 - recess_z0);
    // Slot-like through openings near the rounded lobes
    corner_slots();
}