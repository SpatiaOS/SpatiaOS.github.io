// Parametric scissors assembly
$fn = 64;

blade_thick  = 2.0;
handle_thick = 6.5;
boss_h       = 0.45;
boss_r       = 2.66;
pivot_hole_d = 1.583;
open_ang     = 6.2;

L_blade_len = 90.0;
L_blade_w   = 7.4;
L_tip_d     = 2.5;
L_cx        = 12.2;
L_cy        = 41.0;
L_tilt      = 7;
L_rt        = 11.3;
L_rb        = 8.0;
L_dy        = 11.2;
L_hrt       = 7.1;
L_hrb       = 5.3;
L_hdy       = 8.8;

S_blade_len = 92.0;
S_blade_w   = 6.8;
S_tip_d     = 1.7;
S_cx        = 10.4;
S_cy        = 36.5;
S_tilt      = 31;
S_rt        = 10.0;
S_rb        = 8.5;
S_dy        = 6.0;
S_hrt       = 6.2;
S_hrb       = 5.3;
S_hdy       = 4.1;

shaft_r     = 0.79;
shaft_h     = 4.0;
head_top_r  = 2.66;
head_bot_r  = 2.56;
head_h      = 1.0;
slot_w      = 0.68;
slot_d      = 0.72;

module egg_2d(r_top, r_bot, dy) {
    hull() {
        translate([0,  dy]) circle(r = r_top);
        translate([0, -dy]) circle(r = r_bot);
    }
}

module half_2d(large) {
    len  = large ? L_blade_len : S_blade_len;
    bw   = large ? L_blade_w   : S_blade_w;
    tip  = large ? L_tip_d     : S_tip_d;
    cx   = large ? L_cx        : S_cx;
    cy   = large ? L_cy        : S_cy;
    tilt = large ? L_tilt      : S_tilt;
    rt   = large ? L_rt        : S_rt;
    rb   = large ? L_rb        : S_rb;
    dy   = large ? L_dy        : S_dy;
    hrt  = large ? L_hrt       : S_hrt;
    hrb  = large ? L_hrb       : S_hrb;
    hdy  = large ? L_hdy       : S_hdy;
    px   = bw * 0.42;

    difference() {
        union() {
            translate([cx, cy]) rotate(tilt)
                egg_2d(rt, rb, dy);
            hull() {
                translate([cx, cy]) rotate(tilt)
                    translate([0, -dy]) circle(r = rb);
                translate([px, 5]) circle(d = bw);
            }
            hull() {
                translate([px, 7])               circle(d = bw + 0.8);
                translate([px + 0.15, -len*0.18]) circle(d = bw * 0.92);
                translate([px - 0.1,  -len*0.52]) circle(d = bw * 0.78);
                translate([tip * 0.52, -len])     circle(d = tip);
            }
            circle(r = 4.4);
        }
        translate([cx, cy]) rotate(tilt)
            egg_2d(hrt, hrb, hdy);
    }
}

module scissor_half(large) {
    len  = large ? L_blade_len : S_blade_len;
    cy   = large ? L_cy        : S_cy;
    dy   = large ? L_dy        : S_dy;
    rb   = large ? L_rb        : S_rb;
    hdy  = large ? L_hdy       : S_hdy;
    hrb  = large ? L_hrb       : S_hrb;
    y_outer_bot = cy - dy - rb;
    y_hole_bot  = cy - hdy - hrb;
    y_split     = y_outer_bot + 0.4;

    difference() {
        union() {
            linear_extrude(blade_thick, convexity = 10)
                half_2d(large);

            intersection() {
                linear_extrude(handle_thick, convexity = 10)
                    half_2d(large);
                translate([-50, y_hole_bot - 0.8, 0])
                    cube([100, 90, handle_thick + 1]);
            }

            hull() {
                intersection() {
                    linear_extrude(handle_thick, convexity = 8)
                        half_2d(large);
                    translate([-50, y_split, 0])
                        cube([100, max(1.2, y_hole_bot - y_split - 0.6), handle_thick]);
                }
                linear_extrude(blade_thick)
                    intersection() {
                        half_2d(large);
                        translate([-50, 1]) square([100, 6]);
                    }
            }

            cylinder(h = blade_thick + boss_h, r = boss_r);
        }

        translate([0, 0, -2])
            cylinder(h = handle_thick + 8, d = pivot_hole_d);

        translate([-1.6, -len * 0.48, blade_thick + 0.15])
            rotate([0, 26, 0])
                cube([7, len + 8, 3], center = true);
    }
}

module slotted_knob_fastener() {
    difference() {
        union() {
            rotate_extrude(convexity = 6)
                polygon([
                    [0, 0],
                    [head_bot_r, 0],
                    [head_bot_r, head_h * 0.55],
                    [head_bot_r * 0.88, head_h],
                    [0, head_h]
                ]);
            translate([0, 0, head_h])
                cylinder(h = shaft_h, r = shaft_r);
            translate([0, 0, head_h + shaft_h])
                rotate_extrude(convexity = 6)
                    polygon([
                        [0, 0],
                        [head_top_r, 0],
                        [head_top_r, head_h * 0.5],
                        [head_top_r * 0.9, head_h * 0.82],
                        [head_top_r * 0.35, head_h],
                        [0, head_h]
                    ]);
        }
        translate([-slot_w / 2, -head_top_r - 1,
                   head_h + shaft_h + head_h - slot_d])
            cube([slot_w, head_top_r * 2 + 2, slot_d + 1]);
    }
}

union() {
    translate([0, 0, blade_thick])
        rotate([0, 0, -open_ang])
            scissor_half(true);

    translate([0, 0, blade_thick])
        mirror([0, 0, 1])
            rotate([0, 0, open_ang])
                mirror([1, 0, 0])
                    scissor_half(false);

    translate([0, 0, -head_h])
        slotted_knob_fastener();
}