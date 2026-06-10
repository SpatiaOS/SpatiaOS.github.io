// ============================================
// Parametric Bracket/Bearing Housing Model
// ============================================

// Base reference span
base_length = 0.75;
base_width = 0.421875;
base_height = 0.191921;

// Left circular profile (lower base)
left_cx = 0.2109;
left_cy = 0.2109;
left_r = 0.2109;

// Right circular profile (lower base, annular)
right_cx = 0.6094;
right_cy = 0.2109;
right_outer_r = 0.1406;
right_inner_r = 0.1055;

// Upper circular section (taller continuation)
upper_height = 0.4424;
upper_inner_r = 0.1055;

// Rectangular upright tab
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_left = 0.0703;
tab_front = 0.1758;

// Connecting bridge parameters
bridge_half_w = 0.035;

// Feature parameters (rounded cuts and slots)
bridge_slot_len = 0.03;
bridge_slot_w = 0.02;
keyway_w = 0.022;
keyway_d = 0.02;

// Resolution and tolerance
$fn = 120;
eps = 0.001;

// -------------------------------------------
// Helper: 3D rounded slot (capsule shape)
// -------------------------------------------
module rounded_slot_3d(l, w, h) {
    r = min(w / 2, l / 2);
    linear_extrude(height = h)
        hull() {
            translate([-l / 2 + r, 0])
                circle(r = r);
            translate([l / 2 - r, 0])
                circle(r = r);
        }
}

// -------------------------------------------
// Lower base: two rounded profiles + bridge
// formed from separate circular regions
// rather than a filled rectangular plate
// -------------------------------------------
module lower_base() {
    difference() {
        union() {
            // Left solid circular disk
            translate([left_cx, left_cy, 0])
                cylinder(h = base_height, r = left_r);

            // Right annular ring (outer wall)
            translate([right_cx, right_cy, 0])
                cylinder(h = base_height, r = right_outer_r);

            // Connecting bridge between the two profiles
            bx1 = left_cx + left_r;
            bx2 = right_cx - right_outer_r;
            translate([bx1, left_cy - bridge_half_w, 0])
                cube([bx2 - bx1, 2 * bridge_half_w, base_height]);
        }

        // Right bore opening (preserved as true void)
        translate([right_cx, right_cy, -eps])
            cylinder(h = base_height + 2 * eps, r = right_inner_r);

        // Bridge slot (rounded cut preserved as true void)
        slot_cx = (left_cx + left_r + right_cx - right_outer_r) / 2;
        translate([slot_cx, left_cy, -eps])
            rounded_slot_3d(bridge_slot_len, bridge_slot_w,
                            base_height + 2 * eps);
    }
}

// -------------------------------------------
// Upper section: taller annular cylinder
// rising from base datum (not stacked on base)
// with hollow bore and rounded slot interruptions
// -------------------------------------------
module upper_section() {
    translate([left_cx, left_cy, 0])
        difference() {
            // Outer cylinder from base datum to full height
            cylinder(h = upper_height, r = left_r);

            // Inner bore (annular opening)
            translate([0, 0, -eps])
                cylinder(h = upper_height + 2 * eps, r = upper_inner_r);

            // Keyway at top — rounded slot-like interruption
            translate([0, upper_inner_r + keyway_d / 2, -eps])
                rotate([0, 0, 90])
                    rounded_slot_3d(keyway_d, keyway_w,
                                    upper_height + 2 * eps);

            // Keyway at bottom — rounded slot-like interruption
            translate([0, -upper_inner_r - keyway_d / 2, -eps])
                rotate([0, 0, 90])
                    rounded_slot_3d(keyway_d, keyway_w,
                                    upper_height + 2 * eps);
        }
}

// -------------------------------------------
// Rectangular upright tab
// -------------------------------------------
module rect_tab() {
    translate([tab_left, tab_front, 0])
        cube([tab_length, tab_width, tab_height]);
}

// -------------------------------------------
// Main assembly
// -------------------------------------------
union() {
    lower_base();
    upper_section();
    rect_tab();
}