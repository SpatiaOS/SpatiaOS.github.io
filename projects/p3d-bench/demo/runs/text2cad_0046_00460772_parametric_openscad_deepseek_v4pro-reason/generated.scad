// Parameters (all dimensions in whatever unit system the input used)
base_length    = 0.341352;
base_width     = 0.199422;
base_height    = 0.065029;

// Annular ring (low rounded boss)
a_center_x     = 0.2416;   // from left edge
a_center_y     = 0.0997;   // from front edge
a_outer_r      = 0.0997;
a_inner_r      = 0.0434;
a_boss_h       = base_height;  // same thickness as base
a_fillet_r     = 0.01;         // rounding radius

// Tall hollow sleeve
s_center_x     = -0.0834;
s_center_y     = 0.0998;
s_outer_r      = 0.1301;
s_inner_r      = 0.0867;
s_height       = 0.2601;   // from base datum

// Projecting arm (raised stepped tier)
arm_left_x     = -0.4086;
arm_front_y    = -0.0303;
arm_length     = 0.325145;  // xspan
arm_width      = 0.260116;  // yspan
arm_total_h    = 0.130058;  // full height from datum
arm_upper_h    = arm_total_h - base_height; // part above lower cut-out

// Triangular web
web_base_len   = 0.108382;
web_rise       = 0.195087;  // vertical rise from base top to sleeve top
web_thick      = 0.0217;
web_x_start    = 0.0466;
web_y_center   = (0.0781 + 0.0996) / 2; // front/back offsets midpoint
web_y_min      = web_y_center - web_thick/2; // actual placement bottom

// Resolution
$fn = 100;

// --- Modules ---

// A rounded annular boss created by revolving a 2D profile with a filleted outer top edge
module rounded_annular_boss(inner_r, outer_r, h, fillet_r) {
    arc_steps = 20;
    profile = concat(
        [[inner_r, 0]],
        [[inner_r, h]],
        [[outer_r - fillet_r, h]],
        [ for (i = [0 : arc_steps])
            let(ang = -90 * i / arc_steps)
            [ outer_r - fillet_r + fillet_r * cos(ang),
              h - fillet_r + fillet_r * sin(ang) ]
        ],
        [[outer_r, 0]],
        [[inner_r, 0]]
    );
    rotate_extrude($fn = $fn)
        polygon(profile);
}

// Hollow cylinder (tube)
module hollow_cylinder(outer_r, inner_r, h) {
    difference() {
        cylinder(h = h, r = outer_r, $fn = $fn);
        translate([0, 0, -0.001])
            cylinder(h = h + 0.002, r = inner_r, $fn = $fn);
    }
}

// Thin triangular web (right triangle profile extruded in Y)
module triangular_web(base_len, height, thickness) {
    linear_extrude(height = thickness, center = false)
        polygon(points = [[0, 0], [base_len, 0], [0, height]]);
}

// --- Main Model ---
union() {
    // 1. Main base with through-holes
    difference() {
        cube([base_length, base_width, base_height]);
        // hole for the annular ring
        translate([a_center_x, a_center_y, -0.01])
            cylinder(h = base_height + 0.02, r = a_inner_r, $fn = $fn);
        // cutout for the sleeve intersecting the base
        translate([s_center_x, s_center_y, -0.01])
            cylinder(h = base_height + 0.02, r = s_outer_r, $fn = $fn);
    }

    // 2. Rounded annular boss on top of the base
    translate([a_center_x, a_center_y, base_height])
        rounded_annular_boss(a_inner_r, a_outer_r, a_boss_h, a_fillet_r);

    // 3. Arm (upper portion only, with sleeve clearance)
    difference() {
        translate([arm_left_x, arm_front_y, base_height])
            cube([arm_length, arm_width, arm_upper_h]);
        // opening for the sleeve
        translate([s_center_x, s_center_y, -0.01])
            cylinder(h = arm_total_h + 0.02, r = s_outer_r, $fn = $fn);
    }

    // 4. Tall hollow sleeve
    translate([s_center_x, s_center_y, 0])
        hollow_cylinder(s_outer_r, s_inner_r, s_height);

    // 5. Narrow triangular web
    translate([web_x_start, web_y_min, base_height])
        triangular_web(web_base_len, web_rise, web_thick);
}