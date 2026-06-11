// OpenSCAD Parametric Model
$fn = 100;

// Base dimensions
base_len = 0.341352;
base_wid = 0.199422;
base_hgt = 0.065029;

// Annular section parameters
ann_cx = 0.2416;
ann_cy = 0.0997;
ann_r_out = 0.0997;
ann_r_in = 0.0434;
ann_hgt = 0.015;

// Sleeve parameters
slv_cx = -0.0834;
slv_cy = 0.0998;
slv_r_out = 0.1301;
slv_r_in = 0.0867;
slv_hgt = 0.2601;

// Arm parameters
arm_len = 0.325145;
arm_wid = 0.260116;
arm_hgt = 0.1301;
arm_cx = 0.0081;
arm_cy = -0.03035;
arm_z_start = 0.065;

// Web parameters
web_x1 = 0.0466; web_x2 = 0.1863;
web_y1 = 0.0781; web_y2 = 0.0996;
web_z_start = 0.065;
web_z_end = 0.2601;

// Module: Main base block
module base_block() {
    cube([base_len, base_wid, base_hgt]);
}

// Module: Low annular ring on upper surface
module annulus() {
    translate([ann_cx, ann_cy, base_hgt])
        cylinder(h=ann_hgt, r=ann_r_out);
}

// Module: Tall outer sleeve
module sleeve_outer() {
    translate([slv_cx, slv_cy, 0])
        cylinder(h=slv_hgt, r=slv_r_out);
}

// Module: Projecting stepped arm tier
module arm_tier() {
    translate([arm_cx, arm_cy, arm_z_start])
        cube([arm_len, arm_wid, arm_hgt - arm_z_start], center=true);
}

// Module: Triangular web rib
module web_rib() {
    translate([0, 0, web_z_start])
        linear_extrude(height=web_z_end - web_z_start)
            polygon(points=[[web_x1, web_y1], [web_x2, web_y1], [web_x2, web_y2]]);
}

// Module: Full assembly with subtractive features
module model() {
    difference() {
        union() {
            base_block();
            annulus();
            sleeve_outer();
            arm_tier();
            web_rib();
        }
        // Through-hole for annular section
        translate([ann_cx, ann_cy, -1])
            cylinder(h=base_hgt + ann_hgt + 2, r=ann_r_in);
        // Hollow core for sleeve
        translate([slv_cx, slv_cy, -1])
            cylinder(h=slv_hgt + 2, r=slv_r_in);
    }
}

// Render model
model();