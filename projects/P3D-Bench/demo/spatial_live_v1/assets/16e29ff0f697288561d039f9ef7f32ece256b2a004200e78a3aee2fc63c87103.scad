// ===================== Parameters =====================
$fn = 80;
eps = 0.2;

// Shared shaft
shaft_len = 438;
shaft_d   = 6;
disc_d    = 30;
disc_t    = 14;
disc_z    = 14;                 // disc (big-end) center height above shaft axis
stations  = [60, 155, 250, 345];

// Connecting rod
rod_L     = 132;                // big-end center to wrist-pin center
big_ro    = 23;
big_ri    = 15.5;
small_ro  = 17;
small_ri  = 6;
fork_gap  = 14;                 // matches disc thickness (forked big end)
plate_t   = 5;

// Piston
piston_h    = 44;
piston_r    = 25;               // 50 mm OD
skirt_d     = 40;
skirt_dpth  = 26;
pocket_d    = 30;
pocket_dpth = 10;
crown_t     = 4;
pin_d       = 12;
pin_z       = 22;               // wrist-pin bore height above piston bottom

// Spacer ring
ring_od = 54.56;
ring_id = 50;
ring_t  = 5;

// Bushing
bush_od = 8;
bush_id = 6;
bush_l  = 5;

piston_bottom = disc_z + rod_L - pin_z;   // = 124

// ===================== Helpers =====================
module cyl_y(t, r) rotate([90, 0, 0]) cylinder(h = t, r = r, center = true);

module ring_y(r_out, r_in, t)
    difference() {
        cyl_y(t, r_out);
        cyl_y(t + 2*eps, r_in);
    }

// ===================== Shaft bar with disc bosses =====================
module disc_boss()
    difference() {
        cyl_y(disc_t, disc_d/2);
        translate([0, 0, 6]) cube([3, disc_t + 2*eps, 14], center = true); // slot
    }

module shaft_bar()
    color("#7d8288") {
        rotate([0, 90, 0]) cylinder(h = shaft_len, d = shaft_d);
        for (x = stations)
            translate([x, 0, 0]) {
                translate([0, 0, 7]) cube([8, 6, 13], center = true);      // bracket arm
                translate([0, 0, disc_z]) disc_boss();
            }
        // bushing at far end
        translate([shaft_len - bush_l, 0, 0])
            color("#8f959c")
            rotate([0, 90, 0])
            difference() {
                cylinder(h = bush_l, d = bush_od);
                translate([0, 0, -eps]) cylinder(h = bush_l + 2*eps, d = bush_id);
            }
    }

// ===================== Connecting rod (forked I-beam) =====================
module conrod() {
    web_t = 4;
    flange_y = big_ri - 8;        // y ~ 7.5 .. 11.5
    difference() {
        union() {
            // forked big-end eyes straddling the disc
            for (s = [-1, 1])
                translate([0, s*(fork_gap/2 + plate_t/2), 0])
                    ring_y(big_ro, big_ri, plate_t);
            // knuckle joining fork tops
            translate([0, 0, 21]) cyl_y(20, 4);
            // I-beam: central web + two side flanges
            translate([0, 0, 0]) {
                hull() { translate([0, 0, 22]) cyl_y(web_t, 6);
                         translate([0, 0, rod_L - 14]) cyl_y(web_t, 9); }
                for (s = [-1, 1])
                    translate([0, s*(flange_y + web_t/2), 0])
                        hull() { translate([0, 0, 22]) cyl_y(web_t, 6);
                                 translate([0, 0, rod_L - 14]) cyl_y(web_t, 9); }
            }
            // small-end eye (enters piston skirt bore)
            translate([0, 0, rod_L]) cyl_y(16, small_ro);
        }
        // wrist-pin hole through small end
        translate([0, 0, rod_L]) cyl_y(16 + 2*eps, small_ri);
        // lightening slot in the web
        hull() {
            translate([0, 0, 40]) cyl_y(6, 1.5);
            translate([0, 0, 95]) cyl_y(6, 1.5);
        }
    }
}

// ===================== Piston =====================
module piston()
    difference() {
        cylinder(h = piston_h, r = piston_r);
        // hollow skirt bore (40 mm)
        translate([0, 0, -eps]) cylinder(h = skirt_dpth + eps, d = skirt_d);
        // blind pocket (30 mm) beneath the crown
        translate([0, 0, piston_h - crown_t - pocket_dpth])
            cylinder(h = pocket_dpth, d = pocket_d);
        // transverse wrist-pin bore (12 mm)
        translate([0, 0, pin_z])
            rotate([90, 0, 0])
                cylinder(h = 2*piston_r + 2*eps, d = pin_d, center = true);
        // circumferential ring groove near crown
        translate([0, 0, 33])
            difference() {
                cylinder(h = 6, r = piston_r + eps);
                translate([0, 0, -eps]) cylinder(h = 6 + 2*eps, r = piston_r - 1.2);
            }
    }

module spacer_ring()
    translate([0, 0, Sequence_z])
        difference() {
            cylinder(h = ring_t, d = ring_od);
            translate([0, 0, -eps]) cylinder(h = ring_t + 2*eps, d = ring_id - 0.6);
        }

// ===================== Assembly =====================
shaft_bar();
for (i = [0:3]) {
    translate([stations[i], 0, disc_z])
        color("#9aa0a8") conrod();
    translate([stations[i], 0, piston_bottom]) {
        color("#b8bcc2") piston();
        color("#c9ced4") spacer_ring();
    }
}