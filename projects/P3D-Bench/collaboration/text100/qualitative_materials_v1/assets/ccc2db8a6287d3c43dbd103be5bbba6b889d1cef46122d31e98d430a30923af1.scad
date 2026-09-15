// ============================================================
// Parametric model: base plate with annular boss, hollow
// sleeve, stepped arm tier and triangular gusset web.
// All dimensions treated as millimeters, datum at the base
// underside (z = 0), base origin at its bottom-left corner.
// ============================================================

$fn = 120;   // smoothness for all cylindrical faces

// ---------------- Main base ----------------
base_len   = 0.341352;   // overall length (X)
base_wid   = 0.199422;   // overall width  (Y)
base_hgt   = 0.065029;   // base thickness (Z)

// -------- Low rounded annular section (upper side) --------
ann_cx     = 0.2416;     // center X from left edge
ann_cy     = 0.0997;     // center Y from front edge
ann_r_out  = 0.0997;     // outer radius
ann_r_in   = 0.0434;     // inner radius (open hole)
ann_thk    = 0.065;      // annular section thickness

// ---------------- Tall hollow sleeve ----------------
slv_cx     = -0.0834;    // center X from left reference
slv_cy     = 0.0998;     // center Y from front reference
slv_r_out  = 0.1301;     // outer radius  (0.2602 span)
slv_r_in   = 0.0867;     // inner bore radius
slv_hgt    = 0.2601;     // reach above base datum

// ---------- Projecting straight-sided arm tier ----------
arm_x0     = -0.4086;               // left edge offset
arm_x1     = base_len - 0.4248;     // right edge (right ref offset 0.4248)
arm_y0     = -0.0303;               // front edge offset
arm_y1     = base_wid + 0.0304;     // back edge (back ref offset 0.0304)
arm_hgt    = 0.1301;                // nominal full height
band_lo    = 0.0;                   // lower band cut start (underside)
band_hi    = 0.065;                 // lower band cut top -> stepped tier

// ---------------- Narrow triangular web -----------------
web_x0        = 0.0466;             // left offset
web_x1        = 0.1863;             // right offset
web_y0        = 0.0781;             // front offset
web_thk       = 0.0217;             // material thickness (Y)
web_ramp_run  = 0.108382;           // plan run of the rising profile
web_top_z     = 0.2601;             // reaches upper sleeve tier level

// ============================================================
// Modules
// ============================================================

// Base plate: simple rectangular slab
module main_base() {
    translate([0, 0, 0])
        cube([base_len, base_wid, base_hgt]);
}

// Solid (uncored) annular boss footprint
module annulus_solid(ro, ri, h) {
    difference() {
        cylinder(h = h, r = ro, center = false);
        translate([0, 0, -0.01])
            cylinder(h = h + 0.02, r = ri, center = false);
    }
}

// Hollow sleeve placed at its reference center
module sleeve_solid() {
    translate([slv_cx, slv_cy, 0])
        cylinder(h = slv_hgt, r = slv_r_out);
}

// Arm blank occupying its full footprint
module arm_blank() {
    translate([arm_x0, arm_y0, 0])
        cube([arm_x1 - arm_x0, arm_y1 - arm_y0, arm_hgt]);
}

// Triangular/trapezoidal web: profile drawn in the XZ plane,
// then extruded through the web thickness along Y.
module web_gusset() {
    ramp_x = web_x0 + web_ramp_run;         // end of rising ramp
    translate([0, web_y0 + web_thk, 0])
        rotate([90, 0, 0])
            linear_extrude(height = web_thk)
                polygon(points = [
                    [web_x0,  band_hi],          // toe at base top
                    [ramp_x,  web_top_z],        // top of the rise
                    [web_x1,  web_top_z],        // flat reach outward
                    [web_x1,  band_hi]           // heel at base top
                ]);
}

// ============================================================
// Main assembly
// ============================================================
difference() {

    // --- Union of all additive features ---
    union() {
        main_base();                        // main base slab
        translate([ann_cx, ann_cy, 0])
            annulus_solid(ann_r_out, ann_r_in, ann_thk);  // low annular ring
        sleeve_solid();                     // tall hollow sleeve blank
        arm_blank();                        // arm blank (band removed below)
        web_gusset();                       // triangular reinforcement web
    }

    // --- Subtractive features ---

    // Open the inner profile of the low annular boss straight
    // through the full 0.065 thickness (boss + base slab).
    translate([ann_cx, ann_cy, -0.01])
        cylinder(h = ann_thk + 0.02, r = ann_r_in);

    // Bore of the tall hollow sleeve, kept open full height.
    translate([slv_cx, slv_cy, -0.01])
        cylinder(h = slv_hgt + 0.02, r = slv_r_in);

    // Remove the lower band (z = 0 .. 0.065) over the entire arm
    // footprint, leaving the arm as a raised stepped tier
    // (remaining slab from 0.065 up to 0.1301).
    translate([arm_x0, arm_y0, band_lo])
        cube([arm_x1 - arm_x0,
              arm_y1 - arm_y0,
              band_hi - band_lo + 0.01]);
}