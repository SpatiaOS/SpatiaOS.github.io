// ============================================================
//  Four-piston / connecting-rod / disc-bossed shaft assembly
//  Units: millimetres
// ============================================================

$fn = 72;

/* ---------- shaft bar ---------- */
shaft_len   = 438;
shaft_dia   = 6;
boss_dia    = 30;
boss_thk    = 14;
boss_slot_w = 6;

/* ---------- bushing ---------- */
bushing_od  = 8;
bushing_id  = 6;
bushing_len = 5;

/* ---------- piston ---------- */
piston_dia   = 50;
piston_h     = 40;
skirt_bore   = 40;
skirt_bore_h = 28;              // depth of the lower skirt bore
crown_pocket = 30;              // blind pocket under the crown
crown_thk    = 6;               // material left under the crown
pin_dia      = 12;
groove_w     = 3;               // ring groove
groove_d     = 1.5;
groove_z     = 30;              // from skirt opening

/* ---------- spacer ring ---------- */
spacer_od = 54.56;
spacer_id = 50.2;
spacer_h  = 5;
spacer_z  = 34;                 // from skirt opening

/* ---------- connecting rod ---------- */
rod_big_od   = 40;
rod_big_id   = boss_dia + 0.4;
rod_big_thk  = 12;
rod_thk      = 10;
rod_small_od = 26;
rod_small_id = pin_dia;
rod_len      = 80;              // shaft axis -> wrist-pin axis

/* ---------- layout ---------- */
piston_offset  = rod_len;                     // shaft axis -> piston centre
piston_spacing = 85;
px             = [-1.5, -0.5, 0.5, 1.5] * piston_spacing;   // four stations
piston_base_z  = piston_offset - piston_h/2;  // skirt opening height

// ------------------------------------------------------------
// Piston: local origin at skirt opening, axis +Z toward the crown
// ------------------------------------------------------------
module piston() {
    difference() {
        cylinder(h = piston_h, r = piston_dia/2);

        // lower skirt bore
        translate([0,0,-1])
            cylinder(h = skirt_bore_h + 1, r = skirt_bore/2);

        // blind pocket beneath the crown
        translate([0,0,skirt_bore_h])
            cylinder(h = piston_h - crown_thk - skirt_bore_h, r = crown_pocket/2);

        // circumferential ring groove
        translate([0,0,groove_z])
            rotate_extrude()
                translate([piston_dia/2 - groove_d, 0])
                    square([groove_d + 1, groove_w]);

        // transverse wrist-pin bore (full width)
        translate([0,0,piston_h/2]) rotate([0,90,0])
            cylinder(h = piston_dia + 4, r = pin_dia/2, center = true);
    }
}

// ------------------------------------------------------------
// Spacer ring (sits on the piston barrel near the crown)
// ------------------------------------------------------------
module spacer_ring() {
    difference() {
        cylinder(h = spacer_h, r = spacer_od/2);
        translate([0,0,-0.5]) cylinder(h = spacer_h + 1, r = spacer_id/2);
    }
}

// ------------------------------------------------------------
// Connecting rod: big-end centre at origin, rod along +Z,
// thickness along X (big-end eye rides on a disc boss)
// ------------------------------------------------------------
module conrod() {
    // big-end eye
    rotate([0,90,0]) difference() {
        cylinder(h = rod_big_thk, r = rod_big_od/2, center = true);
        cylinder(h = rod_big_thk + 2, r = rod_big_id/2, center = true);
    }

    // shank: 2D profile in the Y-Z plane, extruded along X,
    // with a central lightening slot (I-beam / forked look)
    translate([rod_thk/2, 0, 0]) rotate([0,-90,0])
        linear_extrude(rod_thk)
            difference() {
                polygon([[18,-9],[18,9],[70,-6],[70,6]]);
                polygon([[28,-3],[58,-3],[58,3],[28,3]]);
            }

    // small-end eye (wrist pin)
    translate([0,0,rod_len]) rotate([0,90,0]) difference() {
        cylinder(h = rod_thk, r = rod_small_od/2, center = true);
        cylinder(h = rod_thk + 2, r = rod_small_id/2, center = true);
    }
}

// ------------------------------------------------------------
// Shaft bar: backbone rod, end bushing, disc bosses, bracket arms
// ------------------------------------------------------------
module shaft_bar() {
    // backbone rod
    rotate([0,90,0]) cylinder(h = shaft_len, r = shaft_dia/2, center = true);

    // bushing at the -X end
    translate([-shaft_len/2, 0, 0]) rotate([0,90,0])
        difference() {
            cylinder(h = bushing_len, r = bushing_od/2);
            translate([0,0,-0.5]) cylinder(h = bushing_len + 1, r = bushing_id/2);
        }

    // disc bosses with a narrow radial slot
    for (i = [0:3])
        translate([px[i], 0, 0]) difference() {
            rotate([0,90,0]) cylinder(h = boss_thk, r = boss_dia/2, center = true);
            translate([0, boss_dia/2 - 2.5, 0])
                cube([boss_thk + 2, boss_dia - 5, boss_slot_w], center = true);
        }

    // short rectangular bracket arms linking the bosses
    for (i = [0:2]) {
        x0 = px[i]     + boss_thk/2 + 2;
        x1 = px[i + 1] - boss_thk/2 - 2;
        translate([(x0 + x1)/2, 0, 0]) difference() {
            cube([x1 - x0, 12, 6], center = true);
            translate([0, 0, 3]) cube([x1 - x0 + 2, 4, 6], center = true);   // slot
        }
    }
}

// ------------------------------------------------------------
// Assembly
// ------------------------------------------------------------
union() {
    shaft_bar();

    for (i = [0:3]) {
        // piston + spacer ring
        translate([px[i], 0, piston_base_z]) {
            piston();
            translate([0, 0, spacer_z]) spacer_ring();
        }
        // connecting rod from the disc boss up into the skirt bore
        translate([px[i], 0, 0]) conrod();
    }
}