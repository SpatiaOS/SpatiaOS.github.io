// =============================================================
//  Inline 4-piston cranktrain reconstruction (single unified model)
//  Bounding box ~ 55 x 438 x 168 mm ; mechanism plane normal = X
// =============================================================
$fn = 96;

// ---- shaft bar -------------------------------------------------
shaft_len = 438;                 // backbone rod length
shaft_d   = 6;                   // backbone rod diameter

// ---- crank layout ----------------------------------------------
n_cyl       = 4;
pist_pitch  = 100;               // cylinder spacing along shaft
pist_y0     = 70;                // first cylinder axis position
skew        = 16;                // in-plane rod skew seen in the render
crank_throw = 24;                // disc-boss offset from backbone axis
sigma       = [1, -1, -1, 1];    // crank phasing: up, down, down, up

// ---- disc bosses + bracket arms ---------------------------------
disc_d = 30;
disc_t = 14;
arm_w  = 10;                     // arm width along shaft
arm_th = 7;                      // arm thickness along X
slot_w = 3;                      // narrow rectangular slot width

// ---- connecting rod (I-beam) ------------------------------------
rod_rise    = 75;                // vertical pin-to-pin rise
rod_cc      = sqrt(pow(skew, 2) + pow(rod_rise, 2));   // center distance
rod_tilt    = atan2(skew, rod_rise);                   // in-plane tilt
bigend_or   = 20.5;              // big-end eye outer radius
bigend_id   = 15.3;              // big-end bore (fits 30 mm disc)
bigend_w    = 15;                // big-end width along X
smallend_or = 15.5;              // small-end eye outer radius
smallend_id = 12;                // wrist-pin bore
smallend_w  = 12;
shank_w     = 13;                // shank width (in mechanism plane)
shank_t     = 7;                 // shank thickness along X
web_t       = 3;                 // I-beam web thickness
flange_t    = 4;                 // I-beam flange thickness

// ---- piston ------------------------------------------------------
pist_d       = 50;
pist_h       = 40;
skirt_d      = 40;               // lower skirt through-bore
skirt_depth  = 24;
pocket_d     = 30;               // blind pocket beneath crown
pocket_depth = 14;
pin_d        = 12;               // transverse wrist-pin bore
pin_off      = 16;               // pin center above piston bottom
groove_z     = 36;               // ring-groove center above bottom
groove_r     = 1.5;              // toroidal groove blend radius

// ---- spacer ring --------------------------------------------------
ring_od = 54.56;
ring_id = 49.9;                  // snug fit on 50 mm barrel
ring_h  = 5;
ring_z  = 29;                    // ring bottom above piston bottom

// ---- bushing -------------------------------------------------------
bush_od  = 8;
bush_id  = 6.1;                  // receives 6 mm backbone rod
bush_len = 5;

// ---- helpers --------------------------------------------------------
module cylX(h, d) { rotate([0, 90, 0]) cylinder(h = h, d = d, center = true); }
module cylY(h, d) { rotate([-90, 0, 0]) cylinder(h = h, d = d, center = false); } // y = 0..h

// ---- shaft bar: backbone rod + four bracketed disc bosses ----------
module crank_throw(s) {
    difference() {
        union() {
            // short rectangular bracket arm from backbone to disc edge
            translate([0, 0, s*4]) cube([arm_th, arm_w, 14], center = true);
            // disc boss, axis along X (big-end eye wraps it)
            translate([0, 0, s*crank_throw]) cylX(disc_t, disc_d);
        }
        // narrow rectangular slot across the disc face
        translate([0, 0, s*crank_throw])
            intersection() {
                cube([disc_t + 2, slot_w, disc_d + 4], center = true);
                cylX(disc_t + 2, disc_d - 1);
            }
        // lightening slot through the bracket arm
        translate([0, 0, s*0.5]) cube([slot_w + 0.5, arm_w + 2, 4], center = true);
    }
}

module shaft_bar() {
    cylY(shaft_len, shaft_d);
    for (i = [0 : n_cyl - 1])
        translate([0, pist_y0 + i*pist_pitch - sigma[i]*skew, 0])
            crank_throw(sigma[i]);
}

// ---- I-beam connecting rod: big end at origin, small end at +Z ------
module conrod() {
    difference() {
        union() {
            cylX(bigend_w, 2*bigend_or);                              // big-end eye
            translate([0, 0, rod_cc]) cylX(smallend_w, 2*smallend_or);// small-end eye
            translate([0, 0, rod_cc/2]) {                             // I-beam shank
                cube([web_t, shank_w, rod_cc], center = true);
                for (sy = [-1, 1])
                    translate([0, sy*(shank_w - flange_t)/2, 0])
                        cube([shank_t, flange_t, rod_cc], center = true);
            }
        }
        cylX(bigend_w + 2, 2*bigend_id);                              // big-end bore
        translate([0, 0, rod_cc]) cylX(smallend_w + 2, 2*smallend_id);// wrist-pin bore
    }
}

// ---- piston: skirt bore, crown pocket, ring groove, pin bore --------
module piston() {
    difference() {
        cylinder(h = pist_h, d = pist_d);
        translate([0, 0, -0.5]) cylinder(h = skirt_depth + 0.5, d = skirt_d);
        translate([0, 0, pist_h - pocket_depth]) cylinder(h = pocket_depth + 0.5, d = pocket_d);
        // circumferential ring groove (toroidal blend)
        translate([0, 0, groove_z]) rotate_extrude() translate([pist_d/2, 0]) circle(groove_r);
        // transverse wrist-pin bore through full width
        translate([0, 0, pin_off]) cylX(pist_d + 4, pin_d);
    }
}

module spacer_ring() {
    difference() {
        cylinder(h = ring_h, d = ring_od);
        translate([0, 0, -0.5]) cylinder(h = ring_h + 1, d = ring_id);
    }
}

module bushing() {
    difference() {
        cylY(bush_len, bush_od);
        translate([0, -0.5, 0]) rotate([-90, 0, 0]) cylinder(h = bush_len + 1, d = bush_id);
    }
}

// ---- assembly --------------------------------------------------------
union() {
    shaft_bar();
    bushing();                       // far-end bushing over the rod tip
    for (i = [0 : n_cyl - 1]) {
        s  = sigma[i];
        yp = pist_y0 + i*pist_pitch;              // piston / cylinder axis
        yd = yp - s*skew;                         // crank-pin (disc) position
        // connecting rod: big end on disc boss, small end in skirt bore
        translate([0, yd, s*crank_throw])
            rotate([-s*rod_tilt, 0, 0]) conrod();
        // piston + spacer ring seated on barrel below the groove
        translate([0, yp, s*crank_throw + rod_rise - pin_off]) {
            piston();
            translate([0, 0, ring_z]) spacer_ring();
        }
    }
}