// ======================= Parameters =======================
$fn = 64;

journal_r      = 10.0;      // smooth pin/shaft journal radius
spline_root_r  = 8.62;      // 36-tooth spline root radius
spline_tip_r   = 9.5;
spline_len     = 21.5;

hub_r   = 11.7;             // yoke hub OD/2 (~23.4 mm)
hub_len = 26;
bell_r  = 16.8;             // fork-base flare radius
bell_len= 7;

ear_th   = 5;               // fork ear plate thickness
ear_off  = 13.5;            // fork ear plate centre offset from axis
ear_r    = 11.5;            // rounded ear tip radius
pin_hole_r = 4;             // Ø8 cross-pin holes

shaft_r = 11.08;            // main shaft shank radius
bend_ang = 13;              // articulation angle of the left joint
pivot_x  = 170;             // articulation pivot position on X

grey  = [0.74,0.75,0.78];
grey2 = [0.83,0.84,0.86];
steel = [0.60,0.61,0.64];
black = [0.10,0.10,0.10];

// Straight (trapezoidal) spline tooth profile as a point list
function spline_pts(teeth, r_root, r_tip) =
    [ for (i = [0 : 4*teeth-1])
        let(a = i*360/(4*teeth), m = i % 4,
            rr = (m==1 || m==2) ? r_tip : r_root)
        [ rr*cos(a), rr*sin(a) ] ];

// Toothed prism running along +X, starting at xc
module spline_prism(xc, h, teeth=36, r_root=spline_root_r, r_tip=spline_tip_r) {
    translate([xc,0,0])
        rotate([0,90,0])
            linear_extrude(height=h, convexity=10)
                polygon(spline_pts(teeth, r_root, r_tip));
}

// Universal-joint yoke: hub + splined bore, one clevis pair (Ø8 holes)
// plus a rounded lug pair on the hub (counterbored web holes)
module uj_yoke(hole_x=32, lug_x=5) {
    color(grey2)
    difference() {
        union() {
            // hub tube
            rotate([0,90,0]) cylinder(r=hub_r, h=hub_len, center=true);
            // fork-base flare
            translate([hub_len/2-1,0,0]) rotate([0,90,0])
                cylinder(r1=hub_r, r2=bell_r, h=bell_len);
            // main fork ear pair (plates offset in ±Y)
            for (s=[-1,1])
                hull() {
                    translate([hub_len/2+2, s*ear_off, 0])
                        cube([10, ear_th, 2*ear_r], center=true);
                    translate([hole_x, s*ear_off, 0])
                        rotate([90,0,0])
                        cylinder(r=ear_r, h=ear_th, center=true);
                }
            // rounded lug pair above/below hub
            for (s=[-1,1])
                hull() {
                    translate([lug_x,0,s*10.5]) cylinder(r=8, h=3, center=true);
                    translate([lug_x,0,s*16])   cylinder(r=6, h=9, center=true);
                }
        }
        // internal splined bore through hub
        scale([1,1.04,1.04])
            spline_prism(-hub_len/2-1, hub_len+2, 36);
        // Ø8 cross-pin holes through ear pair
        translate([hole_x,0,0]) rotate([90,0,0])
            cylinder(r=pin_hole_r, h=2*(ear_off+ear_th), center=true);
        // Ø8 counterbored web holes through lug pair / hub
        translate([lug_x,0,0]) cylinder(r=pin_hole_r, h=48, center=true);
        for (s=[-1,1]) translate([lug_x,0,s*19])
            cylinder(r=6.3, h=2.5, center=true);
    }
}

// Cross / spider: central boss with 4 Ø8 trunnions
module cross_spider(cx, reach_y=14.5, reach_z=13.5) {
    color(steel)
    translate([cx,0,0]) union() {
        sphere(r=7, $fn=40);
        rotate([0,90,0]) cylinder(r=6, h=14, center=true);
        rotate([90,0,0]) cylinder(r=pin_hole_r, h=2*reach_y, center=true);
        cylinder(r=pin_hole_r, h=2*reach_z, center=true);
    }
}

// Left splined pin (stub): journal + internal spline, two Ø6 radial holes
module splined_pin1() {
    color(grey)
    difference() {
        union() {
            translate([-1.5,0,0]) rotate([0,90,0])
                cylinder(r1=8.8, r2=journal_r, h=1.5);
            rotate([0,90,0]) cylinder(r=journal_r, h=54);
            spline_prism(53.5, spline_len+0.4, 36);
        }
        translate([12,0,0]) rotate([90,0,0]) cylinder(r=3, h=26, center=true);
        translate([38,0,0]) cylinder(r=3, h=26, center=true);
    }
}

// Serrated angle-joint body: fork cheeks + serrated barrel + Ø19.5 clevis
module serrated_angle_joint() {
    color(grey2) union() {
        // fork cheeks (engage Z trunnions of cross 1)
        difference() {
            union() {
                for (s=[-1,1])
                    hull() {
                        translate([96,0,s*13.5]) cube([12,23,ear_th], center=true);
                        translate([94,0,s*13.5])
                            cylinder(r=11.5, h=ear_th, center=true);
                    }
                // web arms down to the core
                for (s=[-1,1])
                    hull() {
                        translate([103,0,s*13.5]) cube([8,21,6], center=true);
                        translate([110,0,0]) rotate([0,90,0])
                            cylinder(r=8.6, h=1, center=true);
                    }
            }
            translate([94,0,0]) cylinder(r=pin_hole_r, h=40, center=true);
        }
        // core and serrated zone (visible toothed ring)
        translate([100,0,0]) rotate([0,90,0]) cylinder(r=8.6, h=46);
        spline_prism(104, 36, 38, 8.24, 9.3);
        // rectangular clevis with Ø19.5 countersunk hole
        difference() {
            union() {
                translate([141,0,0]) cube([12,19,20], center=true);
                for (s=[-1,1])
                    hull() {
                        translate([146,s*7,0]) cube([10,5,20], center=true);
                        translate([158,s*7,0]) rotate([90,0,0])
                            cylinder(r=13, h=5, center=true);
                    }
            }
            translate([158,0,0]) rotate([90,0,0])
                cylinder(r=9.75, h=26, center=true);
            for (s=[-1,1]) translate([158,s*9.5,0]) rotate([s*90,0,0])
                cylinder(r1=13, r2=9.75, h=2.6);
        }
        // clamp pin through the clevis
        color(steel) union() {
            translate([158,0,0]) rotate([90,0,0])
                cylinder(r=9.6, h=19, center=true);
            for (s=[1,-1]) translate([158,s*10.3,0]) rotate([90,0,0])
                cylinder(r=12.6, h=1.8, center=true);
        }
    }
}

// Shaft-yoke eye lug + transition neck ending in the pivot ball
module shaft_neck_angled() {
    color(grey)
    difference() {
        union() {
            hull() {
                translate([150,0,0]) cube([12,6,22], center=true);
                translate([158,0,0]) rotate([90,0,0])
                    cylinder(r=13, h=6, center=true);
            }
            hull() {
                translate([146,0,0]) cube([8,6,16], center=true);
                translate([169,0,0]) rotate([0,90,0])
                    cylinder(r=10.7, h=1, center=true);
            }
            translate([pivot_x,0,0]) sphere(r=10.9, $fn=56);
        }
        translate([158,0,0]) rotate([90,0,0])
            cylinder(r=9.9, h=9, center=true);
    }
}

// Slender grounded locating pin resting on a flat of the angle joint
module locating_pin() {
    color(steel)
        translate([143,0,10.6]) rotate([0,90,0])
            cylinder(r=0.8, h=30, center=true);
}

module left_cluster() {
    splined_pin1();
    color(grey) translate([47,0,0]) rotate([0,90,0]) cylinder(r=10.9, h=3);
    translate([62,0,0]) uj_yoke(32, 5);
    cross_spider(94);
    serrated_angle_joint();
    shaft_neck_angled();
    locating_pin();
}

// ======================= Assembly =======================

// Articulated left subassembly (bend at the angle joint)
translate([pivot_x,0,0]) rotate([0,bend_ang,0]) translate([-pivot_x,0,0])
    left_cluster();

// Straight driveline: sleeve -> shank -> spline -> yoke -> cross -> stub pin

// black sleeve over the shaft
color(black) translate([169,0,0]) rotate([0,90,0])
    cylinder(r=10.55, h=44);
// collar + collar step
color(grey) {
    translate([212,0,0])  rotate([0,90,0]) cylinder(r=11.5, h=3.5);
    translate([215,0,0])  rotate([0,90,0]) cylinder(r=shaft_r, h=65);
    // taper to spline
    translate([280,0,0])  rotate([0,90,0]) cylinder(r1=shaft_r, r2=9.3, h=4);
}
// shaft 36-tooth spline entering yoke 2
spline_prism(284, spline_len, 36);

// right universal-joint yoke
translate([300,0,0]) uj_yoke(32, 5);

// right cross / spider
cross_spider(332, 14.5, 13.5);

// right splined pin (stub) with toothed spline ring and Ø6 radial holes
color(grey)
difference() {
    union() {
        translate([307,0,0]) rotate([0,90,0]) cylinder(r=journal_r, h=67);
        spline_prism(315, spline_len, 36, 9.5, 10.45);   // proud toothed ring
        translate([372.5,0,0]) rotate([0,90,0])
            cylinder(r1=journal_r, r2=8.6, h=1.5);
    }
    translate([350,0,0]) cylinder(r=3, h=26, center=true);
    translate([367,0,0]) rotate([90,0,0]) cylinder(r=3, h=26, center=true);
}