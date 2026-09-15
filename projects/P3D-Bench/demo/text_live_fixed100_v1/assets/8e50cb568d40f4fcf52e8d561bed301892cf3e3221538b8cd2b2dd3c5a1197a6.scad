// ============================================================
//  Stepped boss with side arm, rib and bushing eye
//  - low rounded base + intermediate step + tall hollow sleeve
//  - projecting side arm with stepped (cut-away) underside
//  - small rounded end with through opening
//  - thin triangular rib (web) on top of the arm
// ============================================================

$fn = 96;                       // curve resolution

// ---------- Base (low rounded section) ----------
base_d      = 58;               // outer diameter of base disc
base_h      = 14;               // base height
base_r      = 4;                // rounding of the base top edge

// ---------- Intermediate circular step ----------
step_d      = 48;               // diameter of the step
step_h      = 8;                // height of the step

// ---------- Upright sleeve ----------
sleeve_d    = 40;               // sleeve outer diameter
sleeve_h    = 64;               // sleeve top height (from z = 0)
bore_d      = 20;               // central bore, runs all the way through

// ---------- Projecting arm ----------
arm_len     = 66;               // sleeve axis -> eye axis distance
arm_root_d  = 30;               // arm width at the sleeve
arm_top     = 34;               // top face of the arm
arm_tier_z  = base_h;           // underside of the outer (raised) arm tier
cut_x       = 30;               // where the lower cut-away starts

// ---------- Small rounded end (eye) ----------
end_d       = 26;               // outer diameter of the eye
end_bore_d  = 13;               // rounded opening in the eye

// ---------- Rib / web ----------
rib_t       = 6;                // rib thickness
rib_top     = 54;               // rib height where it meets the sleeve
rib_root_x  = sleeve_d/2 - 3;   // rib root, buried inside the sleeve wall
rib_end_x   = arm_len - end_bore_d/2 - 2;   // rib stops clear of the eye hole

chamf       = 1.5;              // bore mouth chamfer

// ------------------------------------------------------------
//  Module: rounded base disc (revolved profile, flat bottom,
//          rounded top outer edge)
// ------------------------------------------------------------
module rounded_disc(d, h, r) {
    rotate_extrude()
        hull() {
            square([d/2 - r, h]);                          // inner flat body
            translate([d/2 - r, 0]) square([r, h - r]);    // straight wall
            translate([d/2 - r, h - r]) circle(r);         // rounded top edge
        }
}

// ------------------------------------------------------------
//  Module: stacked circular portions (base + step + sleeve)
// ------------------------------------------------------------
module stepped_body() {
    rounded_disc(base_d, base_h, base_r);                          // base
    translate([0, 0, base_h - 0.01])
        cylinder(h = step_h + 0.01, d = step_d);                   // step
    cylinder(h = sleeve_h, d = sleeve_d);                          // sleeve
}

// ------------------------------------------------------------
//  Module: side arm with stepped underside
//          (full depth at the sleeve, raised tier further out)
// ------------------------------------------------------------
module side_arm() {
    difference() {
        // tapered arm body: root cylinder hulled to the eye cylinder
        hull() {
            cylinder(h = arm_top, d = arm_root_d);
            translate([arm_len, 0, 0]) cylinder(h = arm_top, d = end_d);
        }
        // lower cut-away that creates the step on the underside
        translate([cut_x, -end_d, -1])
            cube([arm_len + end_d, 2 * end_d, arm_tier_z + 1]);
    }
}

// ------------------------------------------------------------
//  Module: thin triangular rib on top of the arm
// ------------------------------------------------------------
module top_rib() {
    rotate([90, 0, 0])                                   // place web in XZ plane
        linear_extrude(height = rib_t, center = true)
            polygon([[rib_root_x, arm_top - 1],          // arm top, sleeve side
                     [rib_end_x,  arm_top - 1],          // arm top, eye side
                     [rib_root_x, rib_top]]);            // apex on the sleeve
}

// ------------------------------------------------------------
//  Final part: solid union minus the two through bores
// ------------------------------------------------------------
difference() {
    union() {
        stepped_body();
        side_arm();
        top_rib();
    }

    // central bore -> continues through sleeve, step and base
    translate([0, 0, -1]) cylinder(h = sleeve_h + 2, d = bore_d);

    // rounded opening through the small end
    translate([arm_len, 0, -1]) cylinder(h = arm_top + 2, d = end_bore_d);

    // chamfered mouths
    translate([0, 0, sleeve_h - chamf])
        cylinder(h = chamf + 0.01, d1 = bore_d, d2 = bore_d + 2 * chamf);
    translate([0, 0, -0.01])
        cylinder(h = chamf, d1 = bore_d + 2 * chamf, d2 = bore_d);
    translate([arm_len, 0, arm_top - chamf])
        cylinder(h = chamf + 0.01, d1 = end_bore_d, d2 = end_bore_d + 2 * chamf);
    translate([arm_len, 0, arm_tier_z - 0.01])
        cylinder(h = chamf, d1 = end_bore_d + 2 * chamf, d2 = end_bore_d);
}