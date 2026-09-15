// Parameters
$fn = 48;
eps = 0.05;

n_teeth = 36;
spl_rmaj = 10.0;
spl_rmin = 8.62;

pin_l = 75;
pin_spl_l = 21.5;
pin_jr = 10.0;
pin_jl = pin_l - pin_spl_l;
pin_hd = 6.0;

ear_r = 11.7;
ear_t = 8.0;
ear_gap = 25.4;
hole_d = 8.0;
hub_d = 28.0;

ujy_hub_l = 18;
ujy_l = 52;
ujy_bore = 19.48;
ujy_hx = ujy_l - ear_r;

aj_l = 72;
aj_hub_l = 34;
aj_ear_r = 13.0;
aj_hx = aj_l - aj_ear_r;
aj_bore = 19.5;
aj_cb_big = 17.37;
aj_cb_sml = 6.78;
aj_h = 26;
aj_w = 42;

shank_r = 11.08;
shank_l = 78;
shaft_spl_l = 62;
shaft_eng = 26;
shaft_yoke_l = 52;
shaft_hx = shaft_yoke_l - ear_r;

cross_span = ear_gap + 2 * ear_t;
cross_d = 8.0;
cross_mid = 14.5;

left_ang = 32;
right_ang = -16;

al = [0.78, 0.78, 0.80];
blk = [0.08, 0.08, 0.08];

function spline_poly(n, r0, r1) =
    [for (i = [0 : n - 1])
        each let (a = i * 360 / n, da = 360 / n)
            [
                [r0 * cos(a - da * 0.22), r0 * sin(a - da * 0.22)],
                [r1 * cos(a - da * 0.14), r1 * sin(a - da * 0.14)],
                [r1 * cos(a + da * 0.14), r1 * sin(a + da * 0.14)],
                [r0 * cos(a + da * 0.22), r0 * sin(a + da * 0.22)]
            ]
    ];

module spline_x(h) {
    rotate([0, 90, 0])
        linear_extrude(height = h, convexity = 12)
            polygon(spline_poly(n_teeth, spl_rmin, spl_rmaj));
}

module rcyl(h, r) {
    rotate([0, 90, 0])
        cylinder(h = h, r = r);
}

module chamfer_cyl(h, r, ch = 1.6) {
    rotate([0, 90, 0]) {
        cylinder(h = ch, r1 = r - ch, r2 = r);
        translate([0, 0, ch])
            cylinder(h = h - 2 * ch, r = r);
        translate([0, 0, h - ch])
            cylinder(h = ch, r1 = r, r2 = r - ch);
    }
}

module fork_ears(er, et, eg, hd, toward = -1) {
    for (s = [-1, 1])
        translate([0, s * (eg + et) / 2, 0])
            hull() {
                rotate([90, 0, 0])
                    cylinder(r = er, h = et, center = true);
                translate([toward * (er + 2), 0, 0])
                    cube([2, et, min(hd * 0.62, er * 1.6)], center = true);
            }
}

module uj_cross() {
    union() {
        rotate([90, 0, 0])
            cylinder(d = cross_d, h = cross_span, center = true);
        cylinder(d = cross_d, h = cross_span, center = true);
        rotate([90, 0, 0])
            cylinder(d = cross_mid, h = ear_gap - 0.8, center = true);
        cylinder(d = cross_mid, h = ear_gap - 0.8, center = true);
        sphere(d = cross_mid + 3);
    }
}

module uj_yoke() {
    hb = -ujy_hx;
    difference() {
        union() {
            translate([hb, 0, 0])
                rcyl(ujy_hub_l, hub_d / 2);
            translate([hb - 1.2, 0, 0])
                rcyl(4.2, hub_d / 2 + 1.6);
            fork_ears(ear_r, ear_t, ear_gap, hub_d, -1);
            hull() {
                translate([hb + ujy_hub_l - 1, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(d = hub_d * 0.72, h = 1);
                translate([-2, 0, 0])
                    cube([1, ear_gap + 2 * ear_t - 2, ear_r * 0.7], center = true);
            }
        }
        translate([2, 0, 0])
            cube([ear_r * 2 + 8, ear_gap, ear_r * 2 + 6], center = true);
        rotate([90, 0, 0])
            cylinder(d = hole_d, h = cross_span + 4, center = true);
        translate([hb - 2, 0, 0])
            rcyl(ujy_hub_l + 4, ujy_bore / 2);
        translate([hb - 0.1, 0, 0])
            rotate([0, 90, 0])
                cylinder(h = 2.4, d1 = ujy_bore + 5, d2 = ujy_bore);
        translate([hb + ujy_hub_l - 2.2, 0, 0])
            rotate([0, 90, 0])
                cylinder(h = 2.4, d1 = ujy_bore, d2 = ujy_bore + 5);
    }
}

module splined_pin() {
    difference() {
        union() {
            chamfer_cyl(pin_jl, pin_jr, 1.6);
            translate([pin_jl, 0, 0])
                spline_x(pin_spl_l);
            translate([pin_jl, 0, 0])
                rcyl(pin_spl_l, spl_rmin);
        }
        translate([10, 0, 0])
            cylinder(d = pin_hd, h = pin_jr * 2 + 2, center = true);
        translate([28, 0, 0])
            rotate([90, 0, 0])
                cylinder(d = pin_hd, h = pin_jr * 2 + 2, center = true);
    }
}

module angle_joint() {
    hb0 = aj_hx - aj_hub_l;
    difference() {
        union() {
            fork_ears(aj_ear_r, ear_t, ear_gap, aj_h, 1);
            translate([hb0, 0, 0])
                rotate([0, 90, 0])
                    cylinder(h = aj_hub_l, d = hub_d + 2);
            translate([hb0 + aj_hub_l / 2, 0, 0])
                cube([aj_hub_l - 2, aj_w - 8, aj_h], center = true);
            hull() {
                translate([4, 0, 0])
                    cube([2, ear_gap + 2 * ear_t - 4, aj_ear_r * 0.7], center = true);
                translate([hb0 + 2, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(d = hub_d * 0.75, h = 1);
            }
        }
        translate([-2, 0, 0])
            cube([aj_ear_r * 2 + 6, ear_gap, aj_ear_r * 2 + 8], center = true);
        rotate([90, 0, 0])
            cylinder(d = hole_d, h = cross_span + 6, center = true);
        translate([hb0 - 1, 0, 0])
            rcyl(aj_hub_l + 2, aj_bore / 2);
        translate([aj_hx - 2.4, 0, 0])
            rotate([0, 90, 0])
                cylinder(h = 2.6, d1 = aj_bore, d2 = aj_bore + 6);
        translate([hb0 + aj_hub_l / 2, 0, 0]) {
            rotate([90, 0, 0])
                cylinder(d = aj_cb_sml, h = aj_w + 4, center = true);
            translate([0, (aj_w - 8) / 2 - 2.5, 0])
                rotate([-90, 0, 0])
                    cylinder(d = aj_cb_big, h = 8);
        }
        translate([hb0 + aj_hub_l / 2, 0, aj_h / 4])
            cube([aj_hub_l + 2, 2.2, aj_h / 2 + 2], center = true);
    }
}

module shaft_yoke_end() {
    hb = -shaft_hx;
    difference() {
        union() {
            translate([hb, 0, 0])
                rcyl(shaft_hx - ear_r + 6, hub_d / 2);
            fork_ears(ear_r, ear_t, ear_gap, hub_d, -1);
            hull() {
                translate([hb + 8, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(d = hub_d, h = 1);
                rotate([0, 90, 0])
                    cylinder(d = shank_r * 2, h = 1);
            }
        }
        translate([2, 0, 0])
            cube([ear_r * 2 + 8, ear_gap, ear_r * 2 + 6], center = true);
        rotate([90, 0, 0])
            cylinder(d = hole_d, h = cross_span + 4, center = true);
    }
}

module shaft() {
    color(blk) {
        translate([shaft_eng, 0, 0])
            spline_x(shaft_spl_l - shaft_eng);
        translate([shaft_eng, 0, 0])
            rcyl(shaft_spl_l - shaft_eng, spl_rmin);
    }
    color(al) {
        rcyl(shaft_eng + 0.2, pin_jr);
        translate([shaft_spl_l - 0.2, 0, 0]) {
            hull() {
                rcyl(4, pin_jr);
                translate([6, 0, 0])
                    rcyl(1, shank_r);
            }
            translate([6, 0, 0])
                rcyl(shank_l - 6, shank_r);
        }
        translate([shaft_spl_l + shank_l + shaft_hx, 0, 0])
            shaft_yoke_end();
    }
}

module pin_in_yoke(side) {
    hb = -ujy_hx;
    overlap = 4.5;
    translate([hb - pin_jl + overlap, 0, 0])
        splined_pin();
}

module outer_group(side) {
    rotate([90, 0, 0]) {
        if (side > 0)
            mirror([1, 0, 0])
                uj_yoke();
        else
            uj_yoke();
    }
    rotate([90, 0, 0]) {
        if (side > 0)
            mirror([1, 0, 0])
                pin_in_yoke(side);
        else
            pin_in_yoke(side);
    }
}

module assembly() {
    color(al) {
        rotate([0, left_ang, 0])
            uj_cross();
        angle_joint();
        rotate([0, left_ang, 0])
            outer_group(-1);
    }

    translate([aj_hx - shaft_eng, 0, 0])
        shaft();

    right_jc = aj_hx - shaft_eng + shaft_spl_l + shank_l + shaft_hx;
    translate([right_jc, 0, 0]) {
        color(al) {
            rotate([0, right_ang, 0])
                uj_cross();
            rotate([0, right_ang, 0])
                outer_group(1);
        }
    }
}

rotate([12, -18, -42])
    assembly();