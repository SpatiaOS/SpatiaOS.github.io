// Stepped cylindrical part with axial bores and annular recesses
// All units in inches

// ---- Parameters ----
r_main      = 0.1875;   // primary cylinder radius
r_sec       = 0.1875;   // secondary cylinder radius
h_body      = 0.5625;   // reach above shoulder

offset_sec  = 0.1875;   // lateral offset of secondary cylinder

// Positive-side (top) bores (reach measured from shoulder)
r_pos_main  = 0.0975;
r_pos_sec   = 0.0534;
reach_pos   = 0.9375;

// Negative-side (bottom) central bore
r_neg       = 0.0562;
reach_neg   = 0.375;

// Negative-side annular recesses (shallow)
r_ann1_in   = 0.0562;
r_ann1_out  = 0.1162;
r_ann2_in   = 0.0562;
r_ann2_out  = 0.0750;
reach_ann   = 0.0562;

eps = 0.001;
$fn = 120;

// ---- Main body: two overlapping cylinders above shoulder (z=0) ----
module body() {
    union() {
        cylinder(h=h_body, r=r_main);
        translate([offset_sec, 0, 0])
            cylinder(h=h_body, r=r_sec);
    }
}

// ---- Final model ----
difference() {
    body();

    // Positive-side bore through main cylinder (entering from top)
    translate([0, 0, h_body - reach_pos])
        cylinder(h=reach_pos + eps, r=r_pos_main);

    // Positive-side bore through secondary cylinder
    translate([offset_sec, 0, h_body - reach_pos])
        cylinder(h=reach_pos + eps, r=r_pos_sec);

    // Negative-side central blind bore (entering from shoulder face)
    translate([0, 0, -eps])
        cylinder(h=reach_neg + eps, r=r_neg);

    // Negative-side annular recess #1 (shallow ring around central bore)
    translate([0, 0, -eps])
        difference() {
            cylinder(h=reach_ann + eps, r=r_ann1_out);
            translate([0, 0, -eps])
                cylinder(h=reach_ann + 3*eps, r=r_ann1_in);
        }

    // Negative-side annular recess #2 (narrower shallow ring)
    translate([0, 0, -eps])
        difference() {
            cylinder(h=reach_ann + eps, r=r_ann2_out);
            translate([0, 0, -eps])
                cylinder(h=reach_ann + 3*eps, r=r_ann2_in);
        }
}