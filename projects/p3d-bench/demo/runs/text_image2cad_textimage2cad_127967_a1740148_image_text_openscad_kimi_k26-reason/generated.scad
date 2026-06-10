// ==========================================
// Parametric Articulated Arm Assembly
// ==========================================
$fn = 60;

// ---------- housing_cap ----------
base_or         = 150;
base_ir         = 130;
base_h          = 104;
base_boss_r     = 15;
base_boss_h     = 20;
base_lug_n      = 6;
base_lug_w      = 40;
base_lug_d      = 20;
base_lug_h      = 50;

// ---------- lever_arm_with_bevel_gear ----------
la_r1           = 125;
la_r2           = 90;
la_r3           = 68.5;
la_step_h       = 20;
la_gear_n       = 24;
la_gear_r       = 50;
la_gear_h       = 8;
la_arm_w        = 60;
la_arm_t        = 36;
la_elbow_x      = -150;
la_elbow_z      = 196;          // relative to base top (base_h + 196 = 300)
la_hub_d        = 60;
la_hub_h        = 60;

// ---------- spacer ----------
spacer_or       = 3;
spacer_ir       = 1.6;
spacer_h        = 3;
spacer_ring_r   = 108;

// ---------- joint_housing ----------
jh_head_w       = 90;
jh_head_d       = 100;
jh_head_h       = 110;
jh_arm_d        = 62;
jh_arm_l        = 200;
jh_bore_d       = 44;
jh_pin_d        = 30;
jh_flange_d     = 82;

// ---------- connecting_arm ----------
ca_len          = 442;
ca_w            = 60;
ca_t            = 36;
ca_hub_or       = 35;
ca_hub_h        = 50;
ca_flange_holes = 13;
ca_flange_d     = 6;
ca_lug_n        = 3;

// ---------- multi_bore_housing ----------
mbh_l           = 173;
mbh_w           = 76;
mbh_h           = 80;
mbh_lobes       = 4;
mbh_wave        = 10;
mbh_bore_large  = 30;
mbh_bore_small  = 15;

// ---------- scroll_housing ----------
sh_r            = 35;
sh_h            = 55;
sh_inner_r      = 23.5;
sh_mount_r      = 46;
sh_hole_d       = 3;

// ---------- gripper_jaw ----------
grip_w          = 19.5;
grip_boss_r     = 15;
grip_slot_l     = 35;
grip_slot_w     = 6;

// ---------- knob_plug ----------
kp_dome_r       = 40;
kp_groove_r     = 42;
kp_shank_r      = 20;
kp_shank_h      = 24;
kp_tail         = 50;

// ==========================================
// Helper Modules
// ==========================================

module radial_teeth(count, radius, height, size) {
    for (i = [0 : count - 1])
        rotate([0, 0, i * 360 / count])
        translate([radius, 0, height / 2])
        cube([size, size * 0.5, height], center = true);
}

// ==========================================
// Part Modules
// ==========================================

module housing_cap() {
    difference() {
        union() {
            // Main cylindrical body
            cylinder(h = base_h - base_boss_h, r = base_or);
            // Inner top deck step
            translate([0, 0, base_h - base_boss_h - 20])
                cylinder(h = 20, r = base_ir);
            // Peripheral mounting lugs
            for (i = [0 : base_lug_n - 1])
                rotate([0, 0, i * 360 / base_lug_n])
                translate([base_or, 0, (base_h - base_boss_h) / 2])
                cube([base_lug_d, base_lug_w, base_h - base_boss_h], center = true);
        }
        // Blind holes in lugs
        for (i = [0 : base_lug_n - 1])
            rotate([0, 0, i * 360 / base_lug_n])
            translate([base_or + base_lug_d / 2, 0, (base_h - base_boss_h) / 2])
            rotate([0, 90, 0])
            cylinder(d = 8, h = base_lug_d + 2, center = true);
    }
    // Central locating boss
    translate([0, 0, base_h - base_boss_h])
        cylinder(h = base_boss_h, r = base_boss_r);
}

module lever_arm() {
    // Stepped cylindrical turntable interface
    cylinder(h = la_step_h, r = la_r1);
    translate([0, 0, la_step_h])
        cylinder(h = la_step_h, r = la_r2);
    translate([0, 0, 2 * la_step_h])
        cylinder(h = la_step_h, r = la_r3);

    // Bevel gear teeth at upper hub
    translate([0, 0, 3 * la_step_h])
        radial_teeth(la_gear_n, la_gear_r, la_gear_h, 6);

    // Curved shank (segmented hull approximation in X-Z plane)
    hull() {
        translate([-80, 0, 80])
            rotate([0, -12, 0])
            cube([la_arm_t, la_arm_w, 30], center = true);
        translate([-120, 0, 180])
            rotate([0, -22, 0])
            cube([la_arm_t, la_arm_w, 30], center = true);
    }
    hull() {
        translate([-120, 0, 180])
            rotate([0, -22, 0])
            cube([la_arm_t, la_arm_w, 30], center = true);
        translate([la_elbow_x, 0, la_elbow_z])
            rotate([0, -32, 0])
            cube([la_arm_t, la_arm_w, 30], center = true);
    }

    // Side lugs visible on lower arm
    for (z = [100 : 45 : 190])
        translate([-100 - (z - 100) * 0.4, 0, z])
            cube([20, la_arm_w + 4, 14], center = true);

    // Elbow hub (axis along Y)
    translate([la_elbow_x, 0, la_elbow_z])
        rotate([90, 0, 0])
        cylinder(d = la_hub_d, h = la_hub_h, center = true);

    // Perpendicular blind bores in elbow hub
    translate([la_elbow_x, 0, la_elbow_z]) {
        rotate([0, 90, 0])
            cylinder(d = jh_pin_d, h = la_hub_d + 2, center = true);
        cylinder(d = jh_pin_d, h = la_hub_d + 2, center = true);
    }
}

module spacer() {
    difference() {
        cylinder(r = spacer_or, h = spacer_h);
        translate([0, 0, -1])
            cylinder(r = spacer_ir, h = spacer_h + 2);
    }
}

module joint_housing() {
    // Chamfered blocky head (lies primarily in X-Z plane)
    cube([jh_head_w, jh_head_d, jh_head_h], center = true);

    // Cylindrical arm along Y (elbow axis)
    rotate([90, 0, 0])
    difference() {
        cylinder(d = jh_arm_d, h = jh_arm_l, center = true);
        cylinder(d = jh_bore_d, h = jh_arm_l + 2, center = true);
    }

    // Mounting flange at arm end
    translate([0, jh_arm_l / 2 - 4, 0])
    rotate([90, 0, 0])
    cylinder(d = jh_flange_d, h = 8, center = true);

    // Perpendicular blind bores in head
    rotate([0, 90, 0])
        cylinder(d = jh_pin_d, h = jh_head_w + 2, center = true);
    cylinder(d = jh_pin_d, h = jh_head_h + 2, center = true);
}

module connecting_arm() {
    // Left hub (elbow end) – axis along Y
    rotate([90, 0, 0])
        cylinder(r = ca_hub_or, h = ca_hub_h, center = true);

    // Bolted flange with blind holes
    translate([0, ca_hub_h / 2, 0])
    rotate([90, 0, 0])
    difference() {
        cylinder(r = ca_hub_or + 6, h = 6, center = true);
        for (i = [0 : ca_flange_holes - 1])
            rotate([0, 0, i * 360 / ca_flange_holes])
            translate([ca_hub_or - 2, 0, 0])
            cylinder(d = ca_flange_d, h = 10, center = true);
    }

    // Right hub (wrist end)
    translate([ca_len, 0, -80])
    rotate([90, 0, 0])
        cylinder(r = ca_hub_or, h = ca_hub_h, center = true);

    // Curved shank in X-Z plane
    hull() {
        translate([30, 0, -8])
            cube([ca_t, ca_w, 30], center = true);
        translate([ca_len / 2, 0, -38])
            cube([ca_t, ca_w, 30], center = true);
    }
    hull() {
        translate([ca_len / 2, 0, -38])
            cube([ca_t, ca_w, 30], center = true);
        translate([ca_len - 30, 0, -72])
            cube([ca_t, ca_w, 30], center = true);
    }

    // Top lugs protruding in +Z
    for (i = [1 : ca_lug_n])
        translate([i * ca_len / (ca_lug_n + 1), 0, -14])
            cube([18, ca_w + 4, 12], center = true);
}

module multi_bore_housing() {
    n = 64;
    r_base = 32;
    points = [
        for (i = [0 : n - 1])
        let (a = i * 360 / n)
        [
            (r_base + mbh_wave * sin(a * mbh_lobes)) * cos(a),
            (r_base + mbh_wave * sin(a * mbh_lobes)) * sin(a)
        ]
    ];

    rotate([90, 0, 0])
    difference() {
        linear_extrude(height = mbh_l, center = true)
            polygon(points);

        // Large cross-bore
        rotate([90, 0, 0])
            cylinder(d = mbh_bore_large, h = mbh_w + 2, center = true);

        // Longitudinal bores
        for (i = [-1 : 1])
            translate([0, i * 20, 0])
            rotate([0, 90, 0])
            cylinder(d = mbh_bore_small, h = mbh_l + 2, center = true);
    }
}

module scroll_housing() {
    difference() {
        union() {
            cylinder(r = sh_r, h = sh_h);
            // Four mounting flanges
            for (i = [0 : 3])
                rotate([0, 0, i * 90 + 45])
                translate([sh_mount_r - 10, 0, sh_h / 2])
                cube([20, 12, sh_h], center = true);
        }
        // Internal cavity
        translate([0, 0, -1])
            cylinder(r = sh_inner_r, h = sh_h + 2);

        // Through holes in flanges
        for (i = [0 : 3])
            rotate([0, 0, i * 90 + 45])
            translate([sh_mount_r - 10, 0, sh_h / 2])
            cylinder(d = sh_hole_d, h = sh_h + 20, center = true);
    }
}

module gripper_jaw(mirror = false) {
    mirror(mirror ? [0, 1, 0] : [0, 0, 0])
    difference() {
        union() {
            // Jaw body – profile in X-Z plane, extruded along Y
            rotate([90, 0, 0])
            linear_extrude(height = grip_w, center = true)
            polygon([
                [0, 0],
                [18, 22],
                [35, 48],
                [65, 108],
                [58, 112],
                [32, 58],
                [14, 30],
                [-12, 12],
                [-12, 0]
            ]);

            // Pivot boss
            rotate([90, 0, 0])
                cylinder(r = grip_boss_r, h = grip_w + 8, center = true);
        }

        // Elongated adjustment slot through thickness
        translate([25, 0, 0])
        rotate([90, 0, 0])
        hull() {
            cylinder(r = grip_slot_w / 2, h = grip_w + 10, center = true);
            translate([grip_slot_l, 0, 0])
                cylinder(r = grip_slot_w / 2, h = grip_w + 10, center = true);
        }
    }
}

module knob_plug() {
    // Dome head
    translate([0, 0, kp_dome_r * 0.6])
        sphere(r = kp_dome_r);

    // Peripheral groove
    rotate_extrude()
        translate([kp_groove_r, 0])
        circle(r = 2.5);

    // Cylindrical shank
    cylinder(r = kp_shank_r, h = kp_shank_h);

    // Squared anti-rotation tail
    translate([0, 0, -18])
        cube([kp_tail, kp_tail, 18], center = true);
}

// ==========================================
// Assembly
// ==========================================
union() {
    // 1. Grounded base
    housing_cap();

    // 2. Spacer ring cluster (12-fold rotational pattern)
    for (i = [0 : 11])
        rotate([0, 0, i * 30])
        translate([spacer_ring_r, 0, base_h])
        spacer();

    // 3. Lever arm on base
    translate([0, 0, base_h])
        lever_arm();

    // 4. Joint housing at elbow (elbow axis along Y)
    elbow_pos = [la_elbow_x, 0, base_h + la_elbow_z];
    translate(elbow_pos)
        joint_housing();

    // 5. Connecting arm (shares elbow axis)
    translate(elbow_pos)
        connecting_arm();

    // 6. Multi-bore housing at wrist
    // Wrist hub is at local [ca_len, 0, -80] inside connecting_arm
    wrist_pos = elbow_pos + [ca_len, 0, -80];
    translate(wrist_pos)
    rotate([0, -90, 0])
        multi_bore_housing();

    // 7. Scroll housing
    translate(wrist_pos + [mbh_l * 0.55, 0, 0])
    rotate([0, -90, 0])
        scroll_housing();

    // 8. Gripper jaws (mirror pair, open configuration)
    translate(wrist_pos + [mbh_l * 0.55 + sh_r * 1.3, 0, 0]) {
        translate([0, 16, 0]) gripper_jaw(false);
        translate([0, -16, 0]) gripper_jaw(true);
    }

    // 9. Knob plug atop joint housing head
    translate([elbow_pos[0], 0, elbow_pos[2] + jh_head_h / 2])
        knob_plug();
}