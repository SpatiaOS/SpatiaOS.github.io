// =========================================================
// Parametric model: rounded base + hollow stepped sleeve +
// side arm with stepped underside + triangular top rib
// =========================================================

$fn = 100;

// ---- Base (low rounded plate) ----
base_d       = 64;   // overall base diameter
base_h       = 10;   // overall base height
base_edge_r  = 5;    // edge rounding radius of base

// ---- Sleeve (tall hollow stepped cylinder) ----
sleeve_lower_d = 40;   // diameter of lower sleeve section
sleeve_lower_h = 28;   // height of lower sleeve section
sleeve_upper_d = 26;   // diameter of upper sleeve section
sleeve_upper_h = 22;   // height of upper sleeve section
bore_d         = 12;   // central through-bore diameter

// ---- Side arm ----
arm_length = 58;   // arm reach from sleeve axis (+X)
arm_width  = 24;   // arm width (capsule diameter)
arm_thick  = 10;   // full arm thickness near sleeve
arm_top_z  = base_h + arm_thick;   // top surface of arm
step_x     = 22;   // X where the stepped underside begins
step_h     = 5;    // depth removed below outer tier
arm_hole_d = 9;    // hole diameter in rounded arm end

// ---- Triangular rib ----
rib_h        = 14;  // rib height above arm top
rib_t        = 5;   // rib thickness
rib_start_x  = 12;  // rib start (merges into sleeve)
rib_end_x    = arm_length - 8;  // rib taper end (near arm hole)

// =========================================================
// Modules
// =========================================================

// Rounded low base plate (all edges rounded via minkowski)
module rounded_base() {
    minkowski() {
        cylinder(d = base_d - 2*base_edge_r, h = base_h - 2*base_edge_r);
        sphere(r = base_edge_r);
    }
}

// Stepped hollow sleeve: bore passes completely through both tiers
module sleeve() {
    difference() {
        union() {
            // lower wide tier
            cylinder(d = sleeve_lower_d, h = sleeve_lower_h);
            // upper narrow tier
            translate([0, 0, sleeve_lower_h])
                cylinder(d = sleeve_upper_d, h = sleeve_upper_h);
        }
        // continuous central bore through the whole sleeve
        translate([0, 0, -1])
            cylinder(d = bore_d, h = sleeve_lower_h + sleeve_upper_h + 2);
    }
}

// Side arm: capsule profile extruded, then lower cutaway
// creates the stepped underside (outer portion on a higher tier)
module arm() {
    difference() {
        // capsule-shaped arm body (hull of two circles)
        translate([0, 0, base_h])
            linear_extrude(height = arm_thick)
                hull() {
                    circle(d = arm_width);
                    translate([arm_length, 0]) circle(d = arm_width);
                }
        // lower cutaway: removes bottom of the outer portion,
        // leaving the outer arm on a raised tier
        translate([step_x, -arm_width, base_h])
            cube([arm_length + arm_width, 2*arm_width, step_h]);
        // rounded opening through the arm end
        translate([arm_length, 0, base_h - 1])
            cylinder(d = arm_hole_d, h = arm_thick + 2);
    }
}

// Thin triangular rib on top of the arm, running from the arm
// end back toward the sleeve as a raised web
module rib() {
    translate([0, -rib_t/2, arm_top_z])
        linear_extrude(height = rib_t)
            polygon(points = [
                [rib_end_x,   0],        // taper point near arm end
                [rib_start_x, 0],        // base at sleeve side
                [rib_start_x, rib_h]     // full height at sleeve side
            ]);
}

// =========================================================
// Assembled model
// =========================================================
union() {
    rounded_base();
    sleeve();
    arm();
    rib();
}