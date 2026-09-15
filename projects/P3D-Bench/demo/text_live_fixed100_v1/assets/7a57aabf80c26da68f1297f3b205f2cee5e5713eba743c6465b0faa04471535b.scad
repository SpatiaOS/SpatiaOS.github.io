// ============================================================
// Stepped circular base + annular sleeve + side arm + top rib
// ============================================================

$fn = 100;

// ---------- Base (low stepped circular section) ----------
base_dia = 64;   // lower flange diameter
base_h   = 6;    // lower flange height
step_dia = 50;   // upper step diameter
step_h   = 6;    // upper step height

// ---------- Sleeve (tall annular tube) ----------
sleeve_od = 36;  // sleeve outer diameter
sleeve_id = 20;  // through-bore diameter (passes through everything)
sleeve_h  = 44;  // sleeve height above the upper step

// ---------- Side arm ----------
arm_len    = 56; // sleeve axis to rounded-end center distance
arm_root_d = 34; // arm width at the base (root)
lug_r      = 12; // rounded end radius
arm_top    = 14; // arm top surface height (z)
arm_tier   = 8;  // raised underside level of the outer arm portion
step_x     = 30; // x position where the underside cutaway starts
lug_hole_d = 10; // rounded opening through the lug

// ---------- Rib (thin triangular web on top of the arm) ----------
rib_t = 3;       // rib thickness
rib_h = 20;      // rib height above the arm at the sleeve

// ---------- Derived values ----------
step_top = base_h + step_h;        // z of the upper step face
total_h  = step_top + sleeve_h;    // overall model height

// ---------------- Modules ----------------

// Low rounded base: two stepped circular discs
module base() {
    cylinder(d = base_dia, h = base_h);
    translate([0, 0, base_h])
        cylinder(d = step_dia, h = step_h);
}

// Tall sleeve body (bore subtracted later in assembly)
module sleeve() {
    translate([0, 0, step_top])
        cylinder(d = sleeve_od, h = sleeve_h);
}

// Projecting arm: tapered hull from root to rounded lug end,
// with a lower cutaway so the outer portion sits on a higher tier
module arm() {
    difference() {
        hull() {
            cylinder(d = arm_root_d, h = arm_top);           // root
            translate([arm_len, 0, 0])
                cylinder(r = lug_r, h = arm_top);            // rounded end
        }
        // Underside cutaway: removes full-depth material beyond step_x
        translate([step_x, -(arm_root_d/2 + 2), -1])
            cube([arm_len + lug_r - step_x + 2,
                  arm_root_d + 4,
                  arm_tier + 1]);
    }
}

// Thin triangular rib rising from the lug end toward the sleeve
module rib() {
    x0 = sleeve_id/2 + 1;      // root buried inside the sleeve wall
    x1 = arm_len - lug_r + 3;  // tip near the rounded end
    translate([0, rib_t/2, 0])
        rotate([90, 0, 0])     // 2D x-y profile -> x-z plane
            linear_extrude(height = rib_t)
                polygon([[x0, arm_top],
                         [x0, arm_top + rib_h],
                         [x1, arm_top]]);
}

// ---------------- Assembly ----------------

difference() {
    union() {
        base();
        sleeve();
        arm();
        rib();
    }
    // Central bore: through sleeve, step and base (not a blind pocket)
    translate([0, 0, -1])
        cylinder(d = sleeve_id, h = total_h + 2);
    // Rounded opening through the smaller arm end
    translate([arm_len, 0, -1])
        cylinder(d = lug_hole_d, h = arm_top + 2);
}