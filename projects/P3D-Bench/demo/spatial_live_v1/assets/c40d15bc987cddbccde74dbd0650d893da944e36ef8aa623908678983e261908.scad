// ================================================================
//  Scissors assembly - two crossed blade halves + slotted pivot knob
//  Modelled flat in XY (length = +Y, thickness = Z) and rotated
//  upright at the end so the plate normal lies along X.
// ================================================================

$fn = 96;

// ---------------- common dimensions ----------------
blade_t      = 2.0;      // blade plate thickness at the pivot
gap          = 0.1;      // clearance between the stacked blades
pivot_hole_d = 1.583;    // pivot bore diameter
pivot_hole_r = pivot_hole_d / 2;
boss_r       = 2.9;      // raised boss around the bore (upper blade)
boss_h       = 0.5;

// ---------------- slotted knob fastener ----------------
shaft_r = 0.75;          // shaft radius, fits the 1.583 bore
head_r1 = 2.66;          // slotted head radius
head_r2 = 2.56;          // plain head radius
head_h  = 0.9;           // head thickness
slot_w  = 0.9;           // slot width
slot_d  = 0.6;           // slot depth

// ---------------- blade A : large finger loop (right) ----------------
A_loop_c  = [12, 55];    // loop centre (pivot = origin)
A_loop_ro = [11, 22];    // loop outer radii
A_loop_ri = [6.8, 17];   // finger hole radii
A_neck_r  = 4.6;
A_mid_w   = 2.9;
A_tip_r   = 1.1;
A_tip_y   = -76;         // blade point
A_rot     = -3;          // lean of the finished part

// ---------------- blade B : small finger loop (left) ----------------
B_loop_c  = [10, 40];
B_loop_ro = [9.5, 18];
B_loop_ri = [5.8, 13];
B_neck_r  = 4.3;
B_mid_w   = 2.7;
B_tip_r   = 1.0;
B_tip_y   = -72;
B_rot     = 5;

// ---------------- stacked layer heights ----------------
zB        = -blade_t;            // lower blade  -2.0 .. 0.0
zA        = gap;                 // upper blade   0.1 .. 2.1
zA_top    = zA + blade_t;
z_boss    = zA_top + boss_h;     // top face of the pivot boss
z_head_lo = zB - head_h;         // bottom face of plain head
z_head_hi = z_boss + head_h;     // top face of slotted head

// ---------------- helpers ----------------
module oval(rx, ry) { scale([rx, ry]) circle(1); }

// 2D half profile: finger loop ring + neck + tapered blade (pivot at origin)
module blade_half_2d(loop_c, loop_ro, loop_ri, neck_r, mid_w, tip_r, tip_y) {
    union() {
        // oval finger loop
        difference() {
            translate(loop_c) oval(loop_ro[0], loop_ro[1]);
            translate(loop_c) oval(loop_ri[0], loop_ri[1]);
        }
        // neck blending the pivot region into the loop
        hull() {
            translate([1, 2]) circle(r = neck_r);
            translate([loop_c[0] - loop_ro[0] * 0.25,
                       loop_c[1] - loop_ro[1] + 1.5]) circle(r = neck_r * 1.1);
        }
        // blade tapering to a rounded point
        hull() {
            translate([1, 2]) circle(r = neck_r * 0.9);
            translate([1.2, tip_y * 0.35]) circle(r = mid_w);
            translate([-0.6, tip_y + tip_r]) circle(r = tip_r);
        }
    }
}

module blade_half(loop_c, loop_ro, loop_ri, neck_r, mid_w, tip_r, tip_y) {
    linear_extrude(height = blade_t, convexity = 4)
        blade_half_2d(loop_c, loop_ro, loop_ri, neck_r, mid_w, tip_r, tip_y);
}

// ---------------- blade stack ----------------
module scissors_body() {
    // lower blade, small loop, mirrored to the left
    translate([0, 0, zB]) rotate([0, 0, B_rot]) mirror([1, 0, 0])
        blade_half(B_loop_c, B_loop_ro, B_loop_ri, B_neck_r, B_mid_w, B_tip_r, B_tip_y);

    // upper blade, large loop, right side
    translate([0, 0, zA]) rotate([0, 0, A_rot])
        blade_half(A_loop_c, A_loop_ro, A_loop_ri, A_neck_r, A_mid_w, A_tip_r, A_tip_y);

    // boss around the pivot bore on the upper blade
    translate([0, 0, zA_top]) cylinder(h = boss_h, r = boss_r);
}

// ---------------- slotted knob fastener ----------------
module fastener() {
    // central shaft through both pivot bores
    translate([0, 0, z_head_lo]) cylinder(h = z_head_hi - z_head_lo, r = shaft_r);
    // plain underside head
    translate([0, 0, z_head_lo]) cylinder(h = head_h, r = head_r2);
    // slotted top head
    difference() {
        translate([0, 0, z_boss]) cylinder(h = head_h, r = head_r1);
        translate([0, 0, z_head_hi - slot_d / 2]) rotate([0, 0, 100])
            cube([2 * head_r1 + 2, slot_w, slot_d], center = true);
    }
}

// ---------------- assembly ----------------
rotate([90, 0, 90])            // stand upright: length -> Z, plate normal -> X
translate([0, 25, 0])          // roughly centre on the origin
union() {
    difference() {
        scissors_body();
        // pivot bore drilled through both blades and the boss
        translate([0, 0, zB - 2])
            cylinder(h = (z_boss + 2) - (zB - 2), r = pivot_hole_r);
    }
    fastener();
}