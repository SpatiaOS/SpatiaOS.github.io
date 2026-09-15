// Parameters (mm)
plate_t   = 2.0;    // blade plate thickness (pivot bore length per half)
loop_t    = 5.0;    // finger-loop domed thickness
pivot_hole_d = 1.583;
boss_r    = 2.654;
shaft_r   = 0.876;
shaft_len = 4.0;
head1_r   = 2.66;
head2_r   = 2.56;
head_t    = 1.0;
slot_w    = 1.2;
slot_depth= 1.0;
openA     = 10;     // opening angle of half A
openB     = 7;      // opening angle of half B
wall      = 3.2;    // loop ring wall
$fn = 80;

// Half A (cranked handle, wider loop)
A_blade = 95;  A_ly = -12; A_lz = 38; A_ao = 11;  A_bo = 20;
// Half B (straighter handle)
B_blade = 100; B_ly = 7;   B_lz = 39; B_ao = 9.5; B_bo = 20.4;

module ring2d(ly, lz, ao, bo) {
    difference() {
        translate([ly, lz]) scale([ao, bo]) circle(1);
        translate([ly, lz]) scale([ao - wall, bo - wall]) circle(1);
    }
}

module profile2d(blen, ly, lz, ao, bo) {
    difference() {
        union() {
            polygon([[-4, 2], [4, 2], [2.2, -blen*0.35], [0.6, -blen*0.8],
                     [0, -blen], [-0.6, -blen*0.8], [-2.2, -blen*0.35]]);
            hull() { circle(r = 4); translate([ly, lz - bo + 3]) circle(r = 5); }
            translate([ly, lz]) scale([ao, bo]) circle(1);
            circle(r = boss_r);                       // pivot boss
        }
        translate([ly, lz]) scale([ao - wall, bo - wall]) circle(1); // loop opening
        circle(d = pivot_hole_d);                     // pivot bore
    }
}

module blade_solid(blen, ly, lz, ao, bo, zoff) {
    translate([0, 0, zoff]) linear_extrude(plate_t) profile2d(blen, ly, lz, ao, bo);
    translate([0, 0, zoff + plate_t/2 - loop_t/2]) linear_extrude(loop_t) ring2d(ly, lz, ao, bo);
}

module half(ang, blen, ly, lz, ao, bo, zoff) {
    rotate([90 + ang, 0, 0]) rotate([0, 90, 0]) blade_solid(blen, ly, lz, ao, bo, zoff);
}

module fastener() {
    difference() {
        rotate([0, 90, 0]) union() {
            translate([0, 0, -head_t]) cylinder(h = head_t, r1 = head1_r, r2 = head1_r - 0.3);
            cylinder(h = shaft_len, r = shaft_r);
            translate([0, 0, shaft_len]) cylinder(h = head_t, r1 = head2_r - 0.3, r2 = head2_r);
        }
        translate([shaft_len + head_t - slot_depth, -head1_r - 1, -slot_w/2])
            cube([slot_depth + 0.5, 2*head1_r + 2, slot_w]);   // driver slot
    }
}

union() {
    half(openA,  A_blade, A_ly, A_lz, A_ao, A_bo, 0);
    half(-openB, B_blade, B_ly, B_lz, B_ao, B_bo, plate_t);
    fastener();
}