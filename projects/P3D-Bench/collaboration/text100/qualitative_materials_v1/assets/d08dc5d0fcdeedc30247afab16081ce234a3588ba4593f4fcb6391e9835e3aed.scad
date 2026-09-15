// ============================================================
// Rounded wedge base plate
// - rounded teardrop perimeter (0.7408 x 0.6728 footprint)
// - central circular through opening with crossing web
// - stepped underside: shallow circular boss below the pad
// - small round pin feature with blind underside recess
// - slot-like through openings near the outer lobes
// ============================================================

// ---------------- Overall ----------------
L   = 0.740822;   // overall length (X)
W   = 0.672842;   // overall width  (Y)
H   = 0.171797;   // overall height (Z)
eps = 0.002;      // cutter overshoot
$fn = 120;        // curve resolution

// ---------------- Underside step stack ----------------
boss_h  = 0.020616;        // shallow lower boss step (depth 0.0206)
pad_h   = H - boss_h;      // broader upper pad depth (~0.1512)
floor_t = 0.03;            // diaphragm tying the boss ring to the pad

// ---------------- Rounded wedge outline ----------------
heel_r = W/2;              // large rounded left lobe
nose_r = 0.20;             // smaller rounded right lobe
heel_x = heel_r;
nose_x = L - nose_r;
lobe_y = W/2;

// ---------------- Central through opening ----------------
hole_x = 0.3687;           // axis from left edge
hole_y = 0.4283;           // axis from front edge
hole_r = 0.2165;           // opening radius

// ---------------- Shallow circular boss (underside) ----------------
boss_x = 0.3688;
boss_y = 0.4282;
boss_r = 0.2165;           // outer radius (span 0.432928)
rim_t  = 0.06;             // ring wall thickness
bore_r = boss_r - rim_t;   // preserved inner void radius

// ---------------- Straight web across the opening ----------------
web_x = 0.3434;            // left offset
web_t = 0.025368;          // thickness (X)
web_y = 0.2119;            // front offset
web_w = 0.432873;          // width across the opening (Y)
web_e = 0.004;             // embed into the hole wall

// ---------------- Small round feature + removed recess ----------------
pin_x = 0.4796;
pin_y = 0.4282;
pin_r = 0.2/2;             // solid round feature (span 0.2)
rec_x = 0.4796;
rec_y = 0.4283;
rec_r = 0.150716/2;        // removed recess radius (~0.0754)
rec_top = boss_h + 0.0206; // recess ceiling: 0.0206 into the pad
rec_bot = boss_h - 0.1512; // cutter bottom: band totals 0.1718

// ---------------- Lobe slots (through openings) ----------------
slot1_x = 0.12; slot1_y = 0.28; slot1_l = 0.14; slot1_w = 0.05;
slot2_x = 0.63; slot2_y = W/2;  slot2_l = 0.14; slot2_w = 0.05;

// ================= 2D profiles =================
module wedge_profile() {
    hull() {
        translate([heel_x, lobe_y]) circle(r=heel_r);
        translate([nose_x, lobe_y]) circle(r=nose_r);
    }
}

module slot_profile(l, w) {
    hull()
        for (s = [-1, 1])
            translate([0, s*(l - w)/2]) circle(d=w);
}

// ================= Solid features =================
// Main pad: broader upper plate, depth pad_h, sitting on the boss step
module pad() {
    translate([0, 0, boss_h])
        linear_extrude(height=pad_h)
            wedge_profile();
}

// Shallow circular boss below the pad (solid where present,
// inner void preserved by the bore cutter below)
module lower_boss() {
    translate([boss_x, boss_y, 0])
        cylinder(r=boss_r, h=boss_h);
}

// Narrow straight web crossing the central opening, full height
module cross_web() {
    translate([web_x, web_y - web_e, 0])
        cube([web_t, web_w + 2*web_e, H]);
}

// Smaller round solid feature standing in the central opening
module pin_feature() {
    translate([pin_x, pin_y, 0])
        cylinder(r=pin_r, h=H);
}

// ================= Cutters =================
// Central circular through opening (through the pad)
module central_opening() {
    translate([hole_x, hole_y, boss_h + floor_t])
        cylinder(r=hole_r, h=H);
}

// Inner void of the shallow boss (bore through the step)
module boss_bore() {
    translate([boss_x, boss_y, -eps])
        cylinder(r=bore_r, h=H + 2*eps);
}

// Slot-like through openings near the rounded lobes
module lobe_slots() {
    translate([slot1_x, slot1_y, boss_h - eps])
        linear_extrude(height=pad_h + 2*eps)
            slot_profile(slot1_l, slot1_w);
    translate([slot2_x, slot2_y, boss_h - eps])
        linear_extrude(height=pad_h + 2*eps)
            slot_profile(slot2_l, slot2_w);
}

// Blind circular recess removed from the underside
module blind_recess() {
    translate([rec_x, rec_y, rec_bot])
        cylinder(r=rec_r, h=rec_top - rec_bot);
}

// ================= Assembly =================
// Stage 1: pad + boss with through cuts; web and pin are added
// after the cuts so they survive inside the central opening;
// finally the blind recess is removed from the underside.
difference() {
    union() {
        difference() {
            union() {
                pad();
                lower_boss();
            }
            central_opening();
            boss_bore();
            lobe_slots();
        }
        cross_web();
        pin_feature();
    }
    blind_recess();
}