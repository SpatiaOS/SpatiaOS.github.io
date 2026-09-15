// ============================================================
//  Stepped base + tall annular sleeve + projecting side arm
//  with a raised triangular rib
// ============================================================
$fn = 128;

// ---- Base (low rounded section) ----
base_d      = 44;    // base diameter
base_h      = 9;     // base height
base_fil    = 3;     // rounded edge radius

// ---- Stepped circular portion ----
step_d      = 30;    // step diameter
step_h      = 7;     // step height

// ---- Tall annular sleeve ----
sleeve_od   = 24;    // sleeve outer diameter
sleeve_bore = 13;    // central through bore diameter
sleeve_h    = 52;    // sleeve height

// ---- Projecting side arm ----
arm_len     = 45;              // distance to centre of the rounded end
arm_w       = 22;              // arm width
arm_end_r   = arm_w / 2;       // rounded end radius
arm_top     = base_h + step_h; // arm top face height (16)
arm_cut_x   = 24;              // x where the underside cutaway starts
arm_cut_z   = 6;               // height of the raised lower tier
arm_hole    = 8;               // through hole in the rounded end

// ---- Thin triangular rib ----
rib_th      = 3;               // rib thickness (Y)
rib_x0      = sleeve_od / 2;   // rib start (against the sleeve)
rib_x1      = 38;              // rib end (toward the arm tip)
rib_top     = 34;              // rib apex height

// ------------------------------------------------------------
// Rounded base disc: rotate-extruded rounded rectangle profile
// ------------------------------------------------------------
module rounded_disc(d, h, r, seg = 16) {
    R = d / 2;
    pts = concat(
        [[0, 0], [R - r, 0]],
        [for (i = [1:seg]) let (a = -90 + 90 * i / seg)
            [R - r + r * cos(a), r + r * sin(a)]],
        [[R, h - r]],
        [for (i = [1:seg]) let (a = 90 * i / seg)
            [R - r + r * cos(a), h - r + r * sin(a)]],
        [[0, h]]
    );
    rotate_extrude($fn = 128) polygon(pts);
}

// ------------------------------------------------------------
// Arm top-view profile: straight shank + rounded end (stadium)
// ------------------------------------------------------------
module arm_2d() {
    hull() {
        translate([arm_len / 2, 0]) square([arm_len, arm_w], center = true);
        translate([arm_len, 0])     circle(r = arm_end_r);
    }
}

// ------------------------------------------------------------
// Projecting arm with a stepped (cut-away) underside
// ------------------------------------------------------------
module arm() {
    difference() {
        linear_extrude(height = arm_top) arm_2d();

        // lower cutaway -> outer portion sits on a higher tier
        translate([arm_cut_x, -arm_w, -1])
            cube([arm_len + arm_end_r - arm_cut_x + 2, 2 * arm_w, arm_cut_z + 1]);
    }
}

// ------------------------------------------------------------
// Thin triangular rib running from the sleeve to the arm end
// ------------------------------------------------------------
module rib() {
    translate([0, rib_th / 2, 0])
        rotate([90, 0, 0])
            linear_extrude(height = rib_th)
                polygon([
                    [rib_x0, arm_top],
                    [rib_x1, arm_top],
                    [rib_x0, rib_top]
                ]);
}

// ------------------------------------------------------------
// Full solid body
// ------------------------------------------------------------
module body() {
    union() {
        rounded_disc(base_d, base_h, base_fil);                 // low rounded base
        translate([0, 0, base_h])
            cylinder(h = step_h, d = step_d);                   // stepped circular portion
        translate([0, 0, base_h + step_h])
            cylinder(h = sleeve_h, d = sleeve_od);              // tall annular sleeve
        arm();                                                  // projecting side arm
        rib();                                                  // raised triangular rib
    }
}

// ------------------------------------------------------------
// Final part: body minus through bore and arm end hole
// ------------------------------------------------------------
difference() {
    body();

    // central bore continues through the stepped portion and base
    translate([0, 0, -1])
        cylinder(h = base_h + step_h + sleeve_h + 3, d = sleeve_bore);

    // real rounded opening through the arm end
    translate([arm_len, 0, -1])
        cylinder(h = arm_top + 3, d = arm_hole);
}