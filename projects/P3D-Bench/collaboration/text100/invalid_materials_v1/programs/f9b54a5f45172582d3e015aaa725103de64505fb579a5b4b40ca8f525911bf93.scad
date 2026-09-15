// ============================================
// Parametric shallow frame with round bosses
// ============================================

// ----- Base plate parameters -----
plate_length   = 120;   // X dimension of base plate
plate_width    = 80;    // Y dimension of base plate
plate_thick    = 6;     // shallow tier thickness

// ----- Central opening (through cut) -----
open_length    = 60;    // X size of central cutout
open_width     = 40;    // Y size of central cutout

// ----- Boss parameters -----
boss_height    = 25;    // tall tier above the plate top
boss_d         = 18;    // diameter of solid bosses
ring_od        = 24;    // outside diameter of annular bosses
ring_id        = 10;    // bore diameter of annular bosses
cut_extra      = 4;     // how far cuts extend below underside

// ----- Positions of round features [x, y] -----
// First two are solid plugs, last two are annular rings with bores
solid_bosses = [
    [-38,  22],
    [ 38, -22]
];
ring_bosses = [
    [-38, -22],
    [ 38,  22]
];

$fn = 100;

// ---------- Modules ----------

// Solid base plate
module base_plate() {
    cube([plate_length, plate_width, plate_thick], center = true);
}

// Solid upright cylinder boss
module solid_boss() {
    // Sits on top face, rises above it
    translate([0, 0, plate_thick / 2])
        cylinder(h = boss_height + plate_thick / 2,
                 d = boss_d, center = false);
}

// Annular (tube) boss with central void
module ring_boss() {
    difference() {
        translate([0, 0, plate_thick / 2])
            cylinder(h = boss_height + plate_thick / 2,
                     d = ring_od, center = false);
        // Central void through the added material only;
        // the deeper through-cut is handled globally below.
        translate([0, 0, plate_thick / 2])
            cylinder(h = boss_height + plate_thick / 2 + 1,
                     d = ring_id, center = false);
    }
}

// Deep bore cutter: extends from above the boss down past
// the underside of the plate (stepped depth behavior)
module deep_bore_cutter() {
    total_h = boss_height + plate_thick + cut_extra + 2;
    translate([0, 0, boss_height + plate_thick/2 - total_h + ... 0])
        cylinder(h = total_h, d = ring_id, center = false);
}

// ---------- Assembly ----------

difference() {
    union() {
        // Shallow base tier
        base_plate();
        // Separate round additions on upper face
        for (p = solid_bosses)
            translate(p) solid_boss();
        for (p = ring_bosses)
            translate(p) ring_boss();
    }

    // Cut true central opening through the plate
    cube([open_length, open_width, plate_thick + 2], center = true);

    // Ring bores continue as circular cuts through and below base
    for (p = ring_bosses) {
        cut_h = boss_height + plate_thick + cut_extra;
        translate([p[0], p[1], -cut_extra - 1])
            cylinder(h = cut_h + 1, d = ring_id, center = false);
    }
}