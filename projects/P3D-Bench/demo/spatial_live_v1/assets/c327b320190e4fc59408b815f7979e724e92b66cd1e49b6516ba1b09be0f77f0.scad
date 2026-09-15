// ===================== Parameters (mm) =====================
$fn = 64;

plate_t   = 2.0;          // per-half plate thickness (bore length 2.0)
z_overlap = 0.02;         // plate-to-plate overlap at pivot plane
bore_r    = 1.583 / 2;    // pivot bore radius
tube_r    = 2.8;          // finger-loop rim tube radius

alpha_a   = 7.0;          // opening angle of half A (small loop)
alpha_b   = 4.5;          // opening angle of half B (large loop)

// Fastener
shaft_r = 0.876;          // shaft radius
shaft_l = 4.0;            // shaft length (spans both plates)
head_r1 = 2.66;           // rear head radius
head_r2 = 2.56;           // front (slotted) head radius
head_t  = 0.85;           // head disc thickness
dome_h  = 0.4;            // head dome height
slot_w  = 0.95;           // slot width
slot_d  = 1.3;            // slot cut height
slot_a  = -25;            // slot orientation

// Half A: small loop geometry
A_j=10.2; A_e=9.5; A_cy=36;   A_boss=6.0;
A_nmy=12; A_nmr=4.4; A_nty=17; A_ntr=4.6;
A_bmx=1.0; A_bmy=-48; A_bmr=3.2; A_tpx=2.2; A_tpy=-95; A_tpr=0.6;

// Half B: large loop geometry
B_j=20.2; B_e=3.3; B_cy=32;   B_boss=6.5;
B_nmy=5;  B_nmr=5.8; B_nty=9;  B_ntr=4.8;
B_bmx=-1.0; B_bmy=-50; B_bmr=3.6; B_tpx=-2.2; B_tpy=-100; B_tpr=0.6;

// ===================== Helper modules =====================

// round-rim torus lying in the XY plane
module torus(R, r) {
    rotate_extrude(convexity=6)
        translate([R, 0]) circle(r);
}

// stadium-oval finger loop with uniform rounded rim (two hulled tori)
module ring_loop(major, ext, cy, zc) {
    hull() {
        translate([0, cy - ext, zc]) torus(major, tube_r);
        translate([0, cy + ext, zc]) torus(major, tube_r);
    }
}

// one scissor blade half, built locally: pivot at origin,
// loop toward +Y, blade tip toward -Y, plate from zc to zc+plate_t
module blade_half(ang, zc, colr,
                  j, e, cy, boss,
                  nmy, nmr, nty, ntr,
                  bmx, bmy, bmr, tpx, tpy, tpr) {
    color(colr)
    rotate([0, 0, ang])
    union() {
        // flat plate: pivot boss + curved neck + tapered blade, with bore
        translate([0, 0, zc])
        linear_extrude(height = plate_t)
        difference() {
            union() {
                // neck: pivot boss -> waist -> loop root
                hull() {
                    circle(boss);
                    translate([0, nmy]) circle(nmr);
                    translate([0, nty]) circle(ntr);
                }
                // blade: pivot boss -> mid blade -> tip
                hull() {
                    circle(boss);
                    translate([bmx, bmy]) circle(bmr);
                    translate([tpx, tpy]) circle(tpr);
                }
            }
            circle(bore_r, $fn=32);      // pivot bore
        }
        // finger loop with rounded toroidal rim
        ring_loop(j, e, cy, zc + plate_t/2);
    }
}

// spool-shaped slotted fastener along Z, shaft spanning both plates
module slotted_fastener() {
    color("gray")
    difference() {
        union() {
            // shaft through both bores
            cylinder(r = shaft_r, h = shaft_l);
            // rear domed head (r1, facing -Z)
            translate([0, 0, -head_t])
                cylinder(r = head_r1, h = head_t + 0.05);
            translate([0, 0, -head_t])
                mirror([0, 0, 1])
                    intersection() {
                        scale([1, 1, dome_h/head_r1]) sphere(r = head_r1, $fn=48);
                        cylinder(r = head_r1 + 1, h = head_r1);
                    }
            // front domed head (r2, slotted, facing +Z)
            translate([0, 0, shaft_l - 0.05])
                cylinder(r = head_r2, h = head_t + 0.05);
            translate([0, 0, shaft_l + head_t])
                intersection() {
                    scale([1, 1, dome_h/head_r2]) sphere(r = head_r2, $fn=48);
                    translate([-head_r2-1, -head_r2-1, 0])
                        cube([2*head_r2+2, 2*head_r2+2, dome_h + 0.1]);
                }
        }
        // screwdriver slot across the front head
        translate([0, 0, shaft_l + head_t])
            rotate([0, 0, slot_a])
                cube([slot_w, 2*head_r2 + 1.5, slot_d], center = true);
    }
}

// ===================== Assembly =====================
// Built in-plane (length +Y, width X, thickness Z), then rotated so the
// thin direction aligns with +X and blade length with Z (source convention).
rotate(120, [1, 1, 1])
union() {
    // half A: small loop, plate on the back layer
    blade_half(alpha_a, 0, "silver",
               A_j, A_e, A_cy, A_boss,
               A_nmy, A_nmr, A_nty, A_ntr,
               A_bmx, A_bmy, A_bmr, A_tpx, A_tpy, A_tpr);
    // half B: large loop, plate on the front layer
    blade_half(-alpha_b, plate_t - z_overlap, "gainsboro",
               B_j, B_e, B_cy, B_boss,
               B_nmy, B_nmr, B_nty, B_ntr,
               B_bmx, B_bmy, B_bmr, B_tpx, B_tpy, B_tpr);
    // slotted knob fastener at the pivot
    slotted_fastener();
}