// Hydraulic tilt-actuator assembly (parametric approximation of the isometric model)
$fn = 64;

// --- overall ---
base_l = 102;
base_w = 82;
base_h = 16;
turn_d = 58;
turn_h = 7;
pivot_d = 46;
pivot_l = 38;
shaft_af = 11;
shaft_l = 28;
cyl_d = 22;
cyl_l = 92;
rod_d = 10;
arm_t = 10;

module hex_prf(af, h) {
    cylinder(d=af / cos(30), h=h, $fn=6);
}

module hole(d, h, z=0) {
    translate([0, 0, z]) cylinder(d=d, h=h, center=true);
}

module flange_tab(w, d, h, hole_d=4.2, hole_span=14) {
    difference() {
        cube([w, d, h], center=true);
        for (s = [-1, 1])
            translate([s * hole_span / 2, 0, 0])
                rotate([90, 0, 0]) cylinder(d=hole_d, h=d + 2, center=true);
    }
}

module base() {
    difference() {
        union() {
            translate([0, 2, base_h / 2])
                cube([base_l - 8, base_w - 10, base_h], center=true);
            // front connector boss
            translate([-22, -base_w / 2 + 10, 9])
                cube([28, 16, 18], center=true);
            // front-right drop tab
            translate([40, -28, 6])
                cube([18, 14, 12], center=true);
            // right side ear
            translate([48, 8, 8])
                cube([16, 28, 16], center=true);
            // rear-left ear
            translate([-40, 28, 8])
                cube([22, 18, 16], center=true);
            // rear-right ear
            translate([36, 32, 8])
                cube([22, 16, 16], center=true);
            // circular pad
            translate([2, 4, base_h])
                cylinder(d=turn_d + 8, h=3);
        }
        // top pocket
        translate([-8, -6, base_h - 3])
            cube([36, 22, 8], center=true);
        // connector holes
        translate([-28, -base_w / 2 + 10, 10])
            rotate([90, 0, 0]) cylinder(d=3.2, h=20, center=true);
        translate([-16, -base_w / 2 + 10, 10])
            rotate([90, 0, 0]) cylinder(d=3.2, h=20, center=true);
        translate([-22, -base_w / 2 + 14, 12])
            cube([14, 6, 8], center=true);
        // tab holes
        translate([40, -30, 6]) {
            translate([-4, 0, 0]) rotate([90, 0, 0]) cylinder(d=4.2, h=20, center=true);
            translate([4, 0, 0]) rotate([90, 0, 0]) cylinder(d=4.2, h=20, center=true);
        }
        translate([50, 8, 8]) {
            translate([0, -8, 0]) rotate([0, 90, 0]) cylinder(d=4.2, h=22, center=true);
            translate([0, 8, 0]) rotate([0, 90, 0]) cylinder(d=4.2, h=22, center=true);
        }
        translate([-40, 34, 8]) {
            translate([-5, 0, 0]) rotate([90, 0, 0]) cylinder(d=4.2, h=20, center=true);
            translate([5, 0, 0]) rotate([90, 0, 0]) cylinder(d=4.2, h=20, center=true);
        }
        translate([36, 38, 8])
            cube([10, 8, 10], center=true);
        // base through-holes
        for (p = [[-40, -20], [38, -8], [-38, 12]])
            translate([p[0], p[1], base_h / 2])
                cylinder(d=5, h=base_h + 4, center=true);
    }
}

module turntable() {
    translate([2, 4, base_h]) {
        cylinder(d=turn_d, h=turn_h);
        translate([0, 0, turn_h])
            cylinder(d=turn_d - 8, h=3);
        translate([0, 0, turn_h + 3])
            cylinder(d=36, h=4);
    }
}

module bearing_ring(od, id, w) {
    difference() {
        cylinder(d=od, h=w, center=true);
        cylinder(d=id, h=w + 1, center=true);
    }
}

module pivot_housing() {
    translate([2, 4, base_h + turn_h + 18]) {
        rotate([90, 0, 0]) {
            difference() {
                union() {
                    cylinder(d=pivot_d, h=pivot_l, center=true);
                    translate([0, 0, 8]) cylinder(d=pivot_d + 6, h=8, center=true);
                    translate([0, 0, -10]) cylinder(d=pivot_d - 4, h=10, center=true);
                    // angular cheeks
                    hull() {
                        translate([0, 10, 0]) cube([28, 8, 30], center=true);
                        translate([0, -8, 0]) cube([34, 6, 26], center=true);
                    }
                }
                cylinder(d=14, h=pivot_l + 20, center=true);
                translate([0, 0, 10]) cylinder(d=28, h=6, center=true);
            }
            // inner race
            bearing_ring(32, 16, 8);
            translate([0, 0, pivot_l / 2 - 2])
                hex_prf(shaft_af, 6);
        }
        // protruding hex shaft
        rotate([90, 0, 0])
            translate([0, 0, pivot_l / 2])
                hex_prf(shaft_af, shaft_l);
        // left-side cap
        rotate([90, 0, 0])
            translate([0, 0, -pivot_l / 2 - 4])
                cylinder(d=24, h=8, center=true);
    }
}

module arm_plate() {
    linear_extrude(height=arm_t, center=true)
        difference() {
            polygon([
                [-8, -6], [22, -10], [18, 52], [-16, 36], [-22, 10]
            ]);
            polygon([
                [2, 8], [12, 8], [10, 34], [-2, 28]
            ]);
        }
}

module support_arm() {
    translate([2, 4, base_h + turn_h + 22]) {
        rotate([0, -12, 0]) {
            translate([-6, -8, 8]) rotate([90, 0, 0]) arm_plate();
            translate([-6, 10, 8]) rotate([90, 0, 0]) arm_plate();
            // cross web
            translate([-4, 1, 22])
                cube([8, 16, 28], center=true);
            // upper clamp
            translate([-8, 1, 54])
                difference() {
                    cube([28, 22, 16], center=true);
                    rotate([0, 90, 0]) cylinder(d=cyl_d + 0.6, h=32, center=true);
                }
            // diagonal brace
            hull() {
                translate([10, 1, 8]) sphere(d=7);
                translate([-2, 1, 48]) sphere(d=6);
            }
        }
    }
}

module rod_end() {
    rotate([0, 90, 0]) {
        cylinder(d=rod_d, h=16);
        translate([0, 0, 16]) {
            difference() {
                union() {
                    cube([12, 12, 10], center=true);
                    translate([0, 0, 7]) cylinder(d=14, h=6, center=true);
                }
                translate([0, 0, 7])
                    rotate([0, 90, 0]) cylinder(d=6.5, h=20, center=true);
            }
            translate([8, 0, 7]) rotate([0, 90, 0]) {
                cylinder(d=6, h=8, center=true);
                translate([0, 0, 5]) hex_prf(8, 3);
                translate([0, 0, -6]) cylinder(d=8, h=2);
            }
        }
    }
}

module hydraulic_cylinder() {
    translate([2, 4, base_h + turn_h + 22])
        rotate([0, -28, 8])
            translate([-78, 1, 52])
                rotate([0, 90, 0]) {
                    // barrel
                    cylinder(d=cyl_d, h=cyl_l);
                    // rear cap / glands
                    translate([0, 0, -6]) cylinder(d=cyl_d + 8, h=10);
                    translate([0, 0, 4]) cylinder(d=cyl_d + 4, h=4);
                    // two rear stubs
                    for (s = [-1, 1])
                        translate([s * 6, 8, -10])
                            cylinder(d=7, h=14);
                    // front gland
                    translate([0, 0, cyl_l - 2]) cylinder(d=cyl_d + 8, h=10);
                    translate([0, 0, cyl_l + 6]) cylinder(d=cyl_d + 2, h=5);
                    translate([0, 0, cyl_l + 10]) cylinder(d=rod_d + 4, h=6);
                    // rod + eye
                    translate([0, 0, cyl_l + 14])
                        rotate([0, -90, 0]) rod_end();
                }
}

module assembly() {
    base();
    turntable();
    pivot_housing();
    support_arm();
    hydraulic_cylinder();
}

assembly();