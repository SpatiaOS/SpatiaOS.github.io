// ========== Parameters ==========
base_w       = 80;            // total width (X)
base_d       = 50;            // total depth (Y)
base_t       = 2;             // base slab thickness
front_strip  = 15;            // exposed front strip depth
raised_d     = base_d - front_strip; // depth of rear raised area
raised_h     = 6;             // height of raised block above base
strip_w      = 3;             // width of side strips (X)
strip_h      = 10;            // height of side strips (above raised block)
t_wall_thick = 1.5;           // transverse wall thickness (Y)
t_wall_h     = 4;             // transverse wall height (Z, shallow)
slot_w       = 30;            // width of slot opening (X)
slot_h       = 2;             // height of slot opening (Z)
leg_h        = 5;             // downward leg height below base
leg_d        = raised_d;      // depth of legs (Y) – same as raised block
$fn          = 50;            // resolution for cylinders if needed

// ========== Modules ==========
// Thin transverse wall with a through-slot
module transverse_wall() {
    difference() {
        // main wall, sits on raised block front edge
        translate([0, front_strip, base_t + raised_h])
            cube([base_w, t_wall_thick, t_wall_h]);
        // slot cutout, slightly oversized in Y to guarantee full cut
        translate([(base_w - slot_w)/2,
                   front_strip - 0.1,
                   base_t + raised_h + (t_wall_h - slot_h)/2])
            cube([slot_w, t_wall_thick + 0.2, slot_h]);
    }
}

// ========== Main Assembly ==========
union() {
    // 1. Thin rectangular base slab
    color("lightblue")
        cube([base_w, base_d, base_t]);

    // 2. Raised rectangular portion (rear area)
    color("lightgreen")
        translate([0, front_strip, base_t])
            cube([base_w, raised_d, raised_h]);

    // 3. Narrow raised strips on left and right sides of the raised area
    color("orange")
    translate([0, front_strip, base_t + raised_h]) {
        cube([strip_w, raised_d, strip_h]);                  // left strip
        translate([base_w - strip_w, 0, 0])
            cube([strip_w, raised_d, strip_h]);              // right strip
    }

    // 4. Very thin transverse feature with internal opening
    color("red")
    transverse_wall();

    // 5. Downward legs (aligned continuation) making the underside non‑flat
    color("gray") {
        // left leg
        translate([0, front_strip, -leg_h])
            cube([strip_w, leg_d, leg_h]);
        // right leg
        translate([base_w - strip_w, front_strip, -leg_h])
            cube([strip_w, leg_d, leg_h]);
    }
}