// Parameters
$fn = 80;

base_length = 0.341352;
base_width  = 0.199422;
base_height = 0.065029;
base_z      = 0.065;

ann_cx = 0.2416;
ann_cy = 0.0997;
ann_or = 0.0997;
ann_ir = 0.0434;

slv_cx = -0.0834;
slv_cy = 0.0998;
slv_or = 0.1301;
slv_ir = 0.0867;
slv_h  = 0.2601;
slv_span = 0.2602;

arm_l   = 0.325145;
arm_w   = 0.260116;
arm_h   = 0.130058;
arm_x0  = -0.4086;
arm_y0  = -0.0303;
arm_top = 0.1301;

web_run  = 0.108382;
web_t    = 0.0217;
web_x0   = 0.0466;
web_x1   = 0.1863;
web_y0   = 0.0781;
web_y1   = 0.0996;
web_rise = 0.195087;

eps = 0.001;

// Low rounded annular base pad with through hole
module base_plate() {
    linear_extrude(height = base_z)
    difference() {
        union() {
            square([ann_cx, base_width]);
            translate([ann_cx, ann_cy])
                circle(r = ann_or);
        }
        translate([ann_cx, ann_cy])
            circle(r = ann_ir);
    }
}

// Taller hollow sleeve
module hollow_sleeve() {
    translate([slv_cx, slv_cy, 0])
    difference() {
        cylinder(h = slv_h, r = slv_or);
        translate([0, 0, -eps])
            cylinder(h = slv_h + 2 * eps, r = slv_ir);
    }
}

// Raised straight-sided arm (lower band 0..base_z omitted)
module projecting_arm() {
    translate([arm_x0, arm_y0, base_z])
        cube([arm_l, arm_w, arm_top - base_z]);
}

// Narrow triangular web / gusset
module triangular_web() {
    translate([0, web_y1, 0])
    rotate([90, 0, 0])
    linear_extrude(height = web_t)
        polygon([
            [web_x0, base_z],
            [web_x0, slv_h],
            [web_x1, base_z]
        ]);
}

// Main model
union() {
    base_plate();
    hollow_sleeve();
    projecting_arm();
    triangular_web();
}