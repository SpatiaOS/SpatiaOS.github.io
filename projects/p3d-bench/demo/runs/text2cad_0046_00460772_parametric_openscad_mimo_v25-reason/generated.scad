// ==========================================
// Parametric CAD Model
// Base with annular boss, hollow sleeve,
// stepped arm, and triangular web gusset
// ==========================================

$fn = 100;
eps = 0.001; // Boolean tolerance

// ---- Main Base ----
base_l = 0.341352;
base_w = 0.199422;
base_h = 0.065029;

// ---- Annular Section (upper side) ----
ann_cx = 0.2416;
ann_cy = 0.0997;
ann_or = 0.0997;
ann_ir = 0.0434;
ann_h  = 0.065;

// ---- Hollow Sleeve ----
slv_or = 0.1301;
slv_ir = 0.0867;
slv_h  = 0.2601;
// Edge offsets from base edges
slv_lo = -0.2135;
slv_ro = 0.2946;
slv_fo = -0.0303;
slv_bo = -0.0305;
// Computed center from offsets
slv_cx = slv_lo + slv_or; // -0.0834
slv_cy = slv_fo + slv_or; //  0.0998

// ---- Arm Section ----
arm_l  = 0.325145;
arm_w  = 0.260116;
arm_re = 0.1301;
// Edge offsets from base edges
arm_lo = -0.4086;
arm_ro = 0.4248;
arm_fo = -0.0303;
arm_bo = -0.0304;
// Computed origin
arm_x1 = arm_lo;          // -0.4086
arm_y1 = arm_fo;          // -0.0303
// Lower band removal depth
cut_z  = 0.065;

// ---- Triangular Web Gusset ----
web_x1   = 0.0466;
web_y1   = 0.0781;
web_y2   = 0.0996;
web_run  = 0.108382;
web_rise = 0.195087;

// ==========================================
// Assembly
// ==========================================

union() {

    // Step 1: Main base plate with through-holes
    // for annular bore and sleeve bore
    difference() {
        cube([base_l, base_w, base_h]);
        translate([ann_cx, ann_cy, -eps])
            cylinder(h = base_h + 2*eps, r = ann_ir);
        translate([slv_cx, slv_cy, -eps])
            cylinder(h = base_h + 2*eps, r = slv_ir);
    }

    // Step 2: Low annular ring on upper side
    translate([ann_cx, ann_cy, base_h])
    difference() {
        cylinder(h = ann_h, r = ann_or);
        translate([0, 0, -eps])
            cylinder(h = ann_h + 2*eps, r = ann_ir);
    }

    // Step 3: Taller hollow sleeve (annular cylinder)
    translate([slv_cx, slv_cy, 0])
    difference() {
        cylinder(h = slv_h, r = slv_or);
        translate([0, 0, -eps])
            cylinder(h = slv_h + 2*eps, r = slv_ir);
    }

    // Step 4: Arm section with lower band cut away
    // leaving a raised stepped tier
    difference() {
        translate([arm_x1, arm_y1, 0])
            cube([arm_l, arm_w, arm_re]);
        translate([arm_x1 - eps, arm_y1 - eps, -eps])
            cube([arm_l + 2*eps, arm_w + 2*eps, cut_z + eps]);
    }

    // Step 5: Triangular web gusset
    // Right triangle rising from base top to sleeve tier
    translate([0, web_y1, 0])
    linear_extrude(height = web_y2 - web_y1)
        polygon(points = [
            [web_x1, base_h],
            [web_x1 + web_run, base_h],
            [web_x1, base_h + web_rise]
        ]);
}