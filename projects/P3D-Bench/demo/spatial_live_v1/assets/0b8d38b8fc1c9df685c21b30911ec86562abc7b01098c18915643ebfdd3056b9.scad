/* Parameters */
$fn = 48;
spl_r0 = 8.24;  spl_r1 = 8.62;  spl_teeth = 36;
shank_r = 11.08; shank_l = 78;
ear_t = 8; ear_gap = 20; hole8 = 8;
journal_r = 10; journal_l = 54;
hub_r = 14; csk_d = 19.48;
bend = 45;                 // angle-joint bend (deg)
Px = -30;                  // branch pivot X

module spline_x(len, n = spl_teeth) {
    union() {
        rotate([0,90,0]) cylinder(h=len, r=spl_r0);
        for (i=[0:n-1]) rotate([i*360/n,0,0])
            translate([0,-0.8,spl_r0-0.3]) cube([len,1.6,spl_r1-spl_r0+0.3]);
    }
}
module ear(x0,hx,w,t,z0) {
    difference() {
        hull() {
            translate([x0,-w/2,z0]) cube([hx-x0,w,t]);
            translate([hx,0,z0]) cylinder(h=t, r=w/2);
        }
        translate([hx,0,z0-1]) cylinder(h=t+2, d=hole8);
    }
}
module fork_z(x0,hx,w) { for(s=[1,-1]) ear(x0,hx,w,ear_t, s>0? ear_gap/2 : -ear_gap/2-ear_t); }
module fork_y(x0,hx,w) { rotate([90,0,0]) fork_z(x0,hx,w); }
module spider() {
    union() {
        cube([14,14,14], center=true);
        cylinder(h=38, d=7.8, center=true);
        rotate([90,0,0]) cylinder(h=38, d=7.8, center=true);
    }
}
module csk(x) { translate([x,0,0]) rotate([0,-90,0]) cylinder(h=4, r1=csk_d/2+2.5, r2=csk_d/2); }
module splined_pin(x0) {
    difference() {
        union() {
            translate([x0,0,0]) spline_x(22);
            translate([x0+21,0,0]) rotate([0,90,0]) cylinder(h=journal_l, r=journal_r);
        }
        translate([x0+62,0,0]) cylinder(h=40, d=6, center=true);
        translate([x0+48,0,0]) rotate([90,0,0]) cylinder(h=40, d=6, center=true);
    }
}
module yoke_hub(x0, len) {
    difference() {
        translate([x0,0,0]) rotate([0,90,0]) cylinder(h=len, r=hub_r);
        translate([x0+2,0,0]) spline_x(len);
        csk(x0+len);
    }
}

/* Main unified model */
union() {
    /* splined shaft yoke */
    union() {
        translate([Px,0,0]) spline_x(80);
        translate([50,0,0]) rotate([0,90,0]) cylinder(h=shank_l, r=shank_r);
        translate([128,0,0]) rotate([0,90,0]) cylinder(h=20, r=13);
        fork_z(146,168,28);
    }
    translate([168,0,0]) spider();               // cross #2
    union() {                                    // universal yoke #2
        fork_y(150,168,28);
        translate([180,-18,-8]) cube([8,36,16]);
        yoke_hub(186,24);
    }
    splined_pin(188);                            // splined pin #2
    /* angle-joint boss + clevis plate (global frame) */
    difference() {
        union() {
            translate([-32,0,0]) rotate([0,90,0]) cylinder(h=26, r=12);
            translate([-36,10,-15]) cube([28,8,30]);
        }
        translate([Px,0,0]) spline_x(24);
        translate([-22,8,0]) rotate([-90,0,0]) cylinder(h=12, d=csk_d);
    }
    translate([-34,18,15]) rotate([90,0,0])      // slender locating wedge pin
        linear_extrude(8) polygon([[0,0],[25,0],[25,1.2],[0,2]]);
    translate([Px,0,0]) sphere(r=11);
    /* bent branch: angle joint body, cross #1, yoke #1, pin #1 */
    translate([Px,0,0]) rotate([0,-135,0]) union() {
        union() {                                // serrated angle joint
            spline_x(30);
            translate([2,-11,-11]) cube([12,22,22]);
            translate([14,-11,-11]) cube([17,22,22]);
            fork_z(30,40,20);
        }
        translate([40,0,0]) spider();            // cross #1
        union() {                                // universal yoke #1
            fork_y(34,40,26);
            yoke_hub(48,22);
        }
        splined_pin(48);                         // splined pin #1
    }
}