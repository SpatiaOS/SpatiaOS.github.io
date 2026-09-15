// Parameters
shaft_len = 438; shaft_d = 6;
stations = [69, 169, 269, 369];
throw_h = 20;                       // crank disc offset above backbone
disc_d = 30; disc_t = 14;
arm_w = 12; arm_t = 6;
pist_d = 50; pist_h = 40; pist_z0 = 124;
skirt_d = 40; skirt_h = 28; pocket_d = 30;
ring_od = 54.56; ring_id = 49.5; ring_h = 5;
pin_d = 12; pin_z = 153;
rod_w = 12; rod_t = 10; eye_d = 40; small_d = 20;
bush_od = 8; bush_id = 5.6; bush_l = 5;
$fn = 64;

module piston() {
    translate([0, 0, pist_z0]) {
        difference() {
            cylinder(h = pist_h, d = pist_d);                 // barrel + flat crown
            translate([0, 0, -1]) cylinder(h = skirt_h + 1, d = skirt_d);   // skirt bore
            translate([0, 0, skirt_h]) cylinder(h = 8, d = pocket_d);       // blind pocket
            translate([0, 0, pist_h - 4])                     // ring groove
                difference() { cylinder(h = 3, d = pist_d + 2); cylinder(h = 3, d = pist_d - 4); }
        }
        translate([0, 0, pist_h - 10])                        // spacer ring seated on barrel
            difference() { cylinder(h = ring_h, d = ring_od); cylinder(h = ring_h, d = ring_id); }
    }
}

module rod() {
    difference() {
        union() {
            translate([0, -rod_t/2, throw_h]) rotate([-90, 0, 0]) cylinder(h = rod_t, d = eye_d);   // big end
            translate([-rod_w/2, -rod_t/2, throw_h]) cube([rod_w, rod_t, pin_z - throw_h]);          // shank
            translate([0, -rod_t/2, pin_z]) rotate([-90, 0, 0]) cylinder(h = rod_t, d = small_d);    // small end
        }
        translate([-3, 2, throw_h + 20]) cube([6, 3, pin_z - throw_h - 40]);   // I-beam pockets
        translate([-3, -5, throw_h + 20]) cube([6, 3, pin_z - throw_h - 40]);
        translate([-1.5, -10, throw_h + 25]) cube([3, 20, pin_z - throw_h - 60]); // lightening slot
    }
}

module shaft() {
    difference() {
        union() {
            rotate([0, 90, 0]) cylinder(h = shaft_len, d = shaft_d);          // backbone rod
            for (x = stations) {
                translate([x - arm_w/2, -arm_t/2, -3]) cube([arm_w, arm_t, throw_h + 6]); // bracket arm
                translate([x, 0, throw_h]) rotate([-90, 0, 0]) cylinder(h = disc_t, d = disc_d, center = true); // disc boss
            }
        }
        for (x = stations) translate([x - 1.5, -10, throw_h/2 - 4]) cube([3, 20, 8]); // arm slots
    }
}

module bushing() {
    rotate([0, 90, 0])
        difference() { cylinder(h = bush_l, d = bush_od); translate([0, 0, -1]) cylinder(h = bush_l + 2, d = bush_id); }
}

// Unified assembly
difference() {
    union() {
        shaft();
        bushing();
        for (x = stations) translate([x, 0, 0]) { piston(); rod(); }
    }
    for (x = stations) translate([x, -40, pin_z]) rotate([-90, 0, 0]) cylinder(h = 80, d = pin_d); // wrist-pin bores
}