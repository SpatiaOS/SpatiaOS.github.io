/*  Rounded wedge base - parametric OpenSCAD model
    All dimensions in millimetres                                    */

$fn = 120;

// ---------------- Parameters ----------------
// Main rounded wedge base
base_L   = 0.7408;      // overall length  (X)
base_W   = 0.6728;      // overall width   (Y)
base_H   = 0.1718;      // overall height  (Z)
corner_R = 0.1200;      // outer perimeter corner rounding

// Central circular through opening
cH_x = 0.3687;          // axis from the left edge
cH_y = 0.4283;          // axis from the front edge
cH_r = 0.2165;          // radius

// Shallow solid upper rim around the central opening
rim_H = 0.0206;         // rim height
rim_W = 0.0250;         // rim radial width

// Narrow straight web crossing the central opening
web_L = 0.025368;       // size in X
web_W = 0.432873;       // size in Y

// Smaller round tubular feature inside the central opening
sm_x  = 0.4796;         // axis from the left edge
sm_y  = 0.4282;         // axis from the front edge
sm_ro = 0.0992;         // outer radius (solid body)
sm_ri = 0.0754;         // inner radius (removed void)
sm_H  = 0.1718;         // full height

// Stepped underside band around the central opening
under_Z0 = -0.1512;     // band bottom
under_Z1 =  0.0206;     // band top (base underside = 0)

// Corner slot-like through openings
slot_inset = 0.0900;    // slot centre offset from corner arc centre
slot_len   = 0.1000;    // straight length
slot_r     = 0.0300;    // end radius

// ---------------- Helper modules ----------------
// Closed 2D rounded rectangle, centred on the origin
module rounded_rect(l, w, r) {
    offset(r = r) square([l - 2*r, w - 2*r], center = true);
}

// Rounded rectangular slab sitting on z = 0
module rounded_slab(l, w, h, r) {
    linear_extrude(height = h) rounded_rect(l, w, r);
}

// Capsule (2D slot) centred on the origin, long axis along X
module slot_2d(len, r) {
    hull() {
        translate([-len/2, 0]) circle(r = r);
        translate([ len/2, 0]) circle(r = r);
    }
}

// Annular ring of given height
module ring(ri, ro, h) {
    difference() {
        cylinder(r = ro, h = h);
        translate([0, 0, -1]) cylinder(r = ri, h = h + 2);
    }
}

// ---------------- Main model ----------------
// corner arc centres with inward direction signs
corners = [
    [corner_R,          corner_R,           1,  1],
    [base_L - corner_R, corner_R,          -1,  1],
    [corner_R,          base_W - corner_R,  1, -1],
    [base_L - corner_R, base_W - corner_R, -1, -1]
];

union() {
    difference() {
        // ---- solid material ----
        union() {
            // 1. main rounded wedge base (z = 0 .. base_H)
            translate([base_L/2, base_W/2, 0])
                rounded_slab(base_L, base_W, base_H, corner_R);

            // 2. shallow solid rim above the central opening
            translate([cH_x, cH_y, base_H])
                ring(cH_r, cH_r + rim_W, rim_H);
        }

        // ---- removed material ----
        // 3. central circular through opening
        translate([cH_x, cH_y, -base_H])
            cylinder(r = cH_r, h = 3*base_H);

        // 4. stepped underside recess around the central opening
        translate([cH_x, cH_y, under_Z0])
            cylinder(r = cH_r + rim_W, h = under_Z1 - under_Z0);

        // 5. slot-like through openings near the rounded outer lobes
        for (c = corners)
            translate([c[0] + c[2]*slot_inset,
                       c[1] + c[3]*slot_inset,
                       -base_H])
                linear_extrude(height = 3*base_H)
                    rotate(atan2(c[3], c[2]))
                        slot_2d(slot_len, slot_r);
    }

    // 6. narrow straight web crossing the central opening
    translate([cH_x, cH_y, 0])
        linear_extrude(height = base_H)
            square([web_L, web_W], center = true);

    // 7. smaller round tubular feature inside the central opening
    translate([sm_x, sm_y, 0])
        difference() {
            cylinder(r = sm_ro, h = sm_H);
            translate([0, 0, -1])
                cylinder(r = sm_ri, h = sm_H + 2);
        }
}