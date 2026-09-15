// Parameters
$fn = 72;

shaft_len = 438;
shaft_d   = 6;
boss_d    = 30;
boss_t    = 14;

bushing_od = 8;
bushing_l  = 5;

piston_d = 50;
piston_h = 40;
skirt_id = 40;
skirt_h  = 22;
pocket_d = 30;
pocket_h = 10;
crown_t  = 8;
pin_d    = 12;
pin_z    = 21;
groove_z = 34.2;
groove_r = 1.15;

spacer_od = 54.56;
spacer_id = 50;
spacer_h  = 5;
spacer_z  = 27;

be_od = 30;
be_t  = 14;
se_od = 22;
se_t  = 16;
beam_t = 8;

rod_cc = [68, 74, 104, 134];
x_pos  = [52, 128, 240, 352];

module piston() {
    difference() {
        cylinder(h = piston_h, d = piston_d);
        translate([0, 0, -0.2])
            cylinder(h = skirt_h + 0.2, d = skirt_id);
        translate([0, 0, piston_h - crown_t - pocket_h])
            cylinder(h = pocket_h + 0.2, d = pocket_d);
        translate([0, 0, pin_z])
            rotate([0, 90, 0])
                cylinder(h = piston_d + 2, d = pin_d, center = true);
        translate([0, 0, groove_z])
            rotate_extrude(convexity = 6)
                translate([piston_d / 2, 0])
                    circle(r = groove_r);
    }
}

module spacer_ring() {
    difference() {
        cylinder(h = spacer_h, d = spacer_od);
        translate([0, 0, -0.2])
            cylinder(h = spacer_h + 0.4, d = spacer_id);
    }
}

module connecting_rod(cc) {
    z1 = be_od * 0.32;
    z2 = cc - se_od * 0.32;
    zm = cc * 0.42;
    difference() {
        union() {
            rotate([0, 90, 0])
                cylinder(h = be_t, d = be_od, center = true);
            translate([0, 0, cc])
                rotate([0, 90, 0])
                    cylinder(h = se_t, d = se_od, center = true);
            hull() {
                translate([0, 0, z1])
                    rotate([0, 90, 0])
                        cylinder(h = beam_t, d = be_od * 0.72, center = true);
                translate([0, 0, zm])
                    rotate([0, 90, 0])
                        cylinder(h = beam_t * 0.85, d = 11.5, center = true);
            }
            hull() {
                translate([0, 0, zm])
                    rotate([0, 90, 0])
                        cylinder(h = beam_t * 0.85, d = 11.5, center = true);
                translate([0, 0, z2])
                    rotate([0, 90, 0])
                        cylinder(h = beam_t, d = se_od * 0.68, center = true);
            }
            hull() {
                translate([0, 0, z1])
                    cube([be_t * 0.92, 3.4, 1], center = true);
                translate([0, 0, z2])
                    cube([se_t * 0.85, 3.0, 1], center = true);
            }
        }
        rotate([0, 90, 0])
            cylinder(h = be_t + 4, d = shaft_d + 0.25, center = true);
        translate([0, 0, cc])
            rotate([0, 90, 0])
                cylinder(h = se_t + 4, d = pin_d, center = true);
        for (s = [-1, 1])
            translate([s * (beam_t / 2 - 1.1), 0, zm])
                hull() {
                    translate([0, 0, -cc * 0.16])
                        rotate([0, 90, 0])
                            cylinder(h = 2.6, d = 7.5, center = true);
                    translate([0, 0,  cc * 0.16])
                        rotate([0, 90, 0])
                            cylinder(h = 2.6, d = 6.2, center = true);
                }
    }
}

module shaft_bar() {
    rotate([0, -90, 0])
        cylinder(h = shaft_len, d = shaft_d);
    for (i = [0 : 3])
        translate([x_pos[i], 0, 0])
            rotate([0, 90, 0])
                cylinder(h = boss_t, d = boss_d, center = true);
}

module bushing() {
    translate([bushing_l / 2, 0, 0])
        rotate([0, 90, 0])
            cylinder(h = bushing_l, d = bushing_od, center = true);
}

union() {
    shaft_bar();
    bushing();
    for (i = [0 : 3]) {
        translate([x_pos[i], 0, 0]) {
            connecting_rod(rod_cc[i]);
            translate([0, 0, rod_cc[i] - pin_z]) {
                piston();
                translate([0, 0, spacer_z])
                    spacer_ring();
            }
        }
    }
}