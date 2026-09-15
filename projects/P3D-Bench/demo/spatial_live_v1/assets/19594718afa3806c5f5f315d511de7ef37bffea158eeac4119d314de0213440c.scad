// =====================================================
//  Four-cylinder piston / connecting-rod / shaft assembly
//  Bounding envelope approx. 55 x 438 x 157 mm
// =====================================================
$fn = 72;

// ---------- Shaft bar with disc bosses ----------
shaft_len     = 438;    // overall backbone length
shaft_d       = 6;      // backbone rod diameter
crank_throw   = 25;     // offset from rod axis to disc centre
disc_d        = 30;     // disc boss diameter
disc_th       = 14;     // disc boss thickness
arm_t         = 8;      // bracket arm thickness (across shaft)
arm_w         = 12;     // bracket arm width (along shaft)
disc_slot_w   = 4;      // narrow rectangular slot in disc
stations      = [69, 169, 269, 369];   // station positions along shaft

// ---------- Bushing ----------
bush_od = 8; bush_id = 5.9; bush_len = 5; bush_pos = -2;

// ---------- Piston ----------
pist_d       = 50;
pist_h       = 40;
crown_t      = 6;       // solid crown thickness
skirt_bore_d = 40;      // lower skirt through bore
skirt_bore_h = 27;
pocket_d     = 30;      // blind pocket under crown
pin_d        = 12;      // wrist-pin bore
pin_z        = 18;      // pin height above skirt face
grv_z        = 33;      // ring groove position
grv_h        = 2;
grv_dp       = 1;

// ---------- Spacer ring ----------
ring_od = 54.56; ring_id = 49.6; ring_h = 5; ring_z = 26;

// ---------- Connecting rod ----------
rod_len       = 120;                // eye centre to eye centre
big_eye_od    = 46;
big_eye_bore  = disc_d + 0.4;
fork_gap      = disc_th + 0.8;      // clearance slot for the disc boss
fork_t        = 5;                  // one fork prong thickness
fork_th       = fork_gap + 2*fork_t;
shank_w0      = 36;                 // I-beam width at big end
shank_w1      = 20;                 // I-beam width at small end
shank_t1      = 10;                 // I-beam thickness at small end
flange_l      = 9;                  // flange length (width direction)
web_t         = 6;                  // web thickness at big end
small_eye_od  = 20;

// derived
piston_base_z = rod_len - crank_throw - pin_z;

// =====================================================
//  Modules
// =====================================================

// I-beam cross-section: u = width direction, v = thickness direction
module i_profile(w, t, fl, wt) {
    union() {
        translate([ w/2 - fl/2, 0]) square([fl, t], center = true);
        translate([-w/2 + fl/2, 0]) square([fl, t], center = true);
        square([w, wt], center = true);
    }
}

module conrod() {
    difference() {
        union() {
            // big-end blank (eye axis along Y)
            rotate([90, 0, 0]) cylinder(h = fork_th, d = big_eye_od, center = true);
            // tapered I-beam shank
            linear_extrude(height = rod_len,
                           scale = [shank_w1/shank_w0, shank_t1/fork_th])
                i_profile(shank_w0, fork_th, flange_l, web_t);
            // small end eye
            translate([0, 0, rod_len])
                rotate([90, 0, 0]) cylinder(h = shank_t1, d = small_eye_od, center = true);
        }
        // big-end bore
        rotate([90, 0, 0]) cylinder(h = fork_th + 4, d = big_eye_bore, center = true);
        // fork slot, tapering closed as it merges into the shank
        hull() {
            translate([0, 0, -6]) cube([big_eye_od + 10, fork_gap, 44], center = true);
            translate([0, 0, rod_len*0.22]) cube([big_eye_od + 10, 0.6, 1], center = true);
        }
        // wrist-pin bore
        translate([0, 0, rod_len])
            rotate([90, 0, 0]) cylinder(h = shank_t1 + 4, d = pin_d, center = true);
    }
}

module piston() {
    difference() {
        cylinder(h = pist_h, d = pist_d);
        // lower skirt bore
        translate([0, 0, -1]) cylinder(h = skirt_bore_h + 1, d = skirt_bore_d);
        // blind pocket under the crown
        translate([0, 0, skirt_bore_h])
            cylinder(h = pist_h - crown_t - skirt_bore_h, d = pocket_d);
        // circumferential ring groove
        translate([0, 0, grv_z])
            rotate_extrude() translate([pist_d/2 - grv_dp, 0]) square([grv_dp + 1, grv_h]);
        // transverse wrist-pin bore (axis parallel to shaft)
        translate([0, 0, pin_z])
            rotate([90, 0, 0]) cylinder(h = pist_d + 4, d = pin_d, center = true);
        // flat pads around the pin bore mouths
        for (s = [-1, 1])
            translate([0, s*pist_d/2, pin_z]) cube([18, 2.4, 13], center = true);
    }
}

module spacer_ring() {
    difference() {
        cylinder(h = ring_h, d = ring_od);
        translate([0, 0, -1]) cylinder(h = ring_h + 2, d = ring_id);
    }
}

// one bracket arm + disc boss hanging below the backbone rod
module crank_station() {
    difference() {
        union() {
            translate([0, 0, -crank_throw/2 + 1.5])
                cube([arm_t, arm_w, crank_throw + 3], center = true);
            translate([0, 0, -crank_throw])
                rotate([90, 0, 0]) cylinder(h = disc_th, d = disc_d, center = true);
        }
        // narrow rectangular slot in the disc
        translate([0, 0, -crank_throw - 7])
            cube([disc_slot_w, disc_th + 2, 15], center = true);
    }
}

module shaft_bar() {
    union() {
        rotate([-90, 0, 0]) cylinder(h = shaft_len, d = shaft_d);
        for (y = stations) translate([0, y, 0]) crank_station();
    }
}

module bushing() {
    difference() {
        rotate([-90, 0, 0]) cylinder(h = bush_len, d = bush_od);
        translate([0, -1, 0]) rotate([-90, 0, 0]) cylinder(h = bush_len + 2, d = bush_id);
    }
}

// =====================================================
//  Assembly
// =====================================================
module assembly() {
    color("silver") {
        shaft_bar();
        translate([0, bush_pos, 0]) bushing();

        for (y = stations) {
            // connecting rod: big eye on the disc boss, small eye in the piston
            translate([0, y, -crank_throw]) conrod();
            // piston with its spacer ring
            translate([0, y, piston_base_z]) {
                piston();
                translate([0, 0, ring_z]) spacer_ring();
            }
        }
    }
}

assembly();