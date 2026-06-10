// ==========================================
// Parametric Mechanical Grapple Assembly
// ==========================================

$fn = 64;

// --- Central hub dimensions ---
hub_r_lower = 13.5;
hub_r_upper = 9.39;
hub_lower_h = 10;
hub_cone_h    = 14;
hub_upper_h   = 12;
hub_y_base    = 0;

// Eye lug (protrudes in +X, hole along Z)
lug_r       = 5.07;
lug_h       = 8;
lug_thick   = 5;
lug_hole    = 5;

// --- Lugs ---
lower_lug_t     = 1.47;
lower_lug_hole  = 2.8;
lower_lug_y     = 6;

upper_d_t       = 1.47;
upper_d_hole    = 1.28;

upper_lug_t     = 1.47;
upper_lug_hole  = 2.48;
upper_lug_eye_r = 2.85;

// --- Jaws ---
jaw_thick = 3.5;
jaw_hole  = 3.6;

// --- Barrel ---
barrel_len  = 28;
barrel_od   = 6.76;
barrel_wall = 0.7;
barrel_id   = barrel_od - 2 * barrel_wall;
barrel_boss_hole = 0.864;

// --- Follower rod ---
rod_head_r   = 2.53;
rod_stem_r   = 0.54;
rod_stem_len = 16.6;
rod_boss_r   = 1.5;
rod_boss_h   = 2.5;
rod_boss_hole= 1.2;

// --- Fasteners ---
step_shank  = 2.7;
step_head   = 3.6;
step_len    = 8.4;
flange_shaft= 1.2;
flange_len  = 8.4;
spool_shaft = 1.2;
spool_len   = 5.46;
plain_dia   = 1.08;
plain_len   = 1.084;

// --- Layout positions (local X = radial, Y = vertical, Z = tangential) ---
barrel_hub_r = 10;
barrel_hub_y = 32;

lower_lug_r = 20;

jaw_pivot_r = 32;
jaw_pivot_y = 14;

jaw_mid_r = 37;
jaw_mid_y = -2;

// ==========================================
// Modules
// ==========================================

module end_fitting() {
    y0 = hub_y_base;
    translate([0, y0, 0]) {
        // Lower cylinder
        cylinder(h = hub_lower_h, r = hub_r_lower);
        // Conical transition
        translate([0, hub_lower_h, 0])
            cylinder(h = hub_cone_h, r1 = hub_r_lower, r2 = hub_r_upper);
        // Upper cylinder
        translate([0, hub_lower_h + hub_cone_h, 0])
            cylinder(h = hub_upper_h, r = hub_r_upper);
        // Eye lug protruding in +X, hole along Z
        translate([0, hub_lower_h + hub_cone_h + hub_upper_h, 0])
            difference() {
                linear_extrude(height = lug_thick, center = true)
                    hull() {
                        translate([2, 0]) circle(r = lug_r);
                        translate([6, 0]) circle(r = lug_r);
                    }
                translate([lug_r + 2, 0, 0])
                    cylinder(d = lug_hole, h = lug_thick + 2, center = true);
            }
    }
}

module lower_mounting_lug() {
    // Origin at inner face (mates with hub cylinder), extends in +X
    difference() {
        linear_extrude(height = lower_lug_t, center = true)
            hull() {
                square([2, 6], center = true);
                translate([6, 0]) circle(d = 7);
            }
        translate([6, 0, 0])
            cylinder(d = lower_lug_hole, h = lower_lug_t + 1, center = true);
    }
}

module upper_d_lug() {
    difference() {
        linear_extrude(height = upper_d_t, center = true)
            hull() {
                square([2, 5], center = true);
                translate([4, 0]) circle(d = 5);
            }
        translate([4, 0, 0])
            cylinder(d = upper_d_hole, h = upper_d_t + 1, center = true);
    }
}

module upper_mount_lug() {
    difference() {
        linear_extrude(height = upper_lug_t, center = true)
            hull() {
                square([2, 5], center = true);
                translate([4, 0]) circle(r = upper_lug_eye_r);
            }
        translate([4, 0, 0])
            cylinder(d = upper_lug_hole, h = upper_lug_t + 1, center = true);
    }
}

module gripper_jaw() {
    difference() {
        union() {
            linear_extrude(height = jaw_thick, center = true)
                offset(r = 1.2)
                polygon([
                    [-4,  4],
                    [-4, -2],
                    [-1, -25],
                    [ 3, -50],
                    [10, -64],
                    [14, -58],
                    [12, -40],
                    [ 8, -20],
                    [ 5, -2],
                    [ 5,  4],
                    [ 0,  6]
                ]);
            // Mid-body tab protrudes in +X
            translate([6, -16, 0])
                rotate([0, 90, 0])
                    cylinder(d = 6, h = 4, center = true);
        }
        // Pivot hole along Z
        cylinder(d = jaw_hole, h = jaw_thick + 2, center = true);
        // Mid hole along Z
        translate([6, -16, 0])
            cylinder(d = jaw_hole, h = 10, center = true);
    }
}

module gripper_tine() {
    difference() {
        union() {
            linear_extrude(height = jaw_thick, center = true)
                offset(r = 1.2)
                polygon([
                    [-3,  4],
                    [-3, -2],
                    [ 0, -25],
                    [ 2, -50],
                    [ 7, -66],
                    [10, -62],
                    [ 8, -40],
                    [ 5, -20],
                    [ 4, -2],
                    [ 4,  4],
                    [ 0,  6]
                ]);
            translate([5, -16, 0])
                rotate([0, 90, 0])
                    cylinder(d = 6, h = 4, center = true);
        }
        cylinder(d = jaw_hole, h = jaw_thick + 2, center = true);
        translate([5, -16, 0])
            cylinder(d = jaw_hole, h = 10, center = true);
    }
}

module curved_support_arm() {
    linear_extrude(height = 2, center = true)
        offset(r = 1.0)
        polygon([
            [-3,  4],
            [-3, -2],
            [ 0, -25],
            [ 3, -50],
            [ 7, -64],
            [10, -60],
            [ 8, -40],
            [ 5, -20],
            [ 3, -2],
            [ 3,  4],
            [ 0,  5]
        ]);
}

module curved_arm() {
    union() {
        linear_extrude(height = 2, center = true)
            offset(r = 1.0)
            polygon([
                [-3,  4],
                [-3, -2],
                [ 0, -25],
                [ 3, -50],
                [ 7, -64],
                [10, -60],
                [ 8, -40],
                [ 5, -20],
                [ 3, -2],
                [ 3,  4],
                [ 0,  5]
            ]);
        // Cylindrical protrusion at upper tip
        translate([0, 4, 0])
            rotate([0, 90, 0])
                cylinder(h = 11, r = 1.0);
        translate([11, 4, 0])
            sphere(r = 1.0);
    }
}

module barrel() {
    difference() {
        union() {
            // Tube along local X
            rotate([0, 90, 0])
                cylinder(h = barrel_len, d = barrel_od, center = true);
            // Domed end at +X
            translate([barrel_len / 2, 0, 0])
                sphere(d = barrel_od);
            // Radial bosses (protrude in Z)
            translate([-2, 0,  barrel_od / 2])
                cylinder(h = 1.5, d = 3, center = true);
            translate([-2, 0, -barrel_od / 2])
                cylinder(h = 1.5, d = 3, center = true);
        }
        // Hollow bore
        rotate([0, 90, 0])
            cylinder(h = barrel_len + 2, d = barrel_id, center = true);
        // Boss holes along Z
        translate([-2, 0,  barrel_od / 2])
            cylinder(d = barrel_boss_hole, h = 4, center = true);
        translate([-2, 0, -barrel_od / 2])
            cylinder(d = barrel_boss_hole, h = 4, center = true);
    }
}

module follower_rod() {
    difference() {
        union() {
            // Mushroom head at origin
            rotate([0, 90, 0])
                cylinder(h = 1.5, r = rod_head_r);
            // Stem
            translate([1.5, 0, 0])
                rotate([0, 90, 0])
                    cylinder(h = rod_stem_len, r = rod_stem_r);
            // Transverse boss at far end (along Z)
            translate([1.5 + rod_stem_len + 0.5, 0, 0])
                cylinder(h = rod_boss_h, r = rod_boss_r, center = true);
            // Blend fillets
            translate([1.5, 0, 0]) sphere(r = 0.6);
            translate([1.5 + rod_stem_len, 0, 0]) sphere(r = 0.6);
        }
        // Hole through boss along Z
        translate([1.5 + rod_stem_len + 0.5, 0, 0])
            cylinder(d = rod_boss_hole, h = rod_boss_h + 2, center = true);
    }
}

module stepped_pin() {
    rotate([0, 90, 0]) {
        cylinder(h = 7.2, d = step_shank);
        translate([0, 0, 7.2]) cylinder(h = 0.4, d = step_shank + 0.4);
        translate([0, 0, 7.6]) cylinder(h = 0.4, d = step_head);
    }
}

module flanged_pin() {
    rotate([0, 90, 0]) {
        cylinder(h = flange_len, d = flange_shaft);
        translate([0, 0, 0]) cylinder(h = 0.5, d = 3.6);
        translate([0, 0, flange_len - 0.5]) cylinder(h = 0.5, d = 1.9);
    }
}

module spool_pin() {
    rotate([0, 90, 0]) {
        cylinder(h = 4.3, d = spool_shaft);
        translate([0, 0, 0]) cylinder(h = 0.5, d = 3.6);
        translate([0, 0, 3.8]) cylinder(h = 0.5, d = 1.9);
    }
}

module plain_pin() {
    rotate([0, 90, 0])
        cylinder(h = plain_len, d = plain_dia, center = true);
}

// ==========================================
// Assembly
// ==========================================

union() {
    // --- Central body ---
    end_fitting();

    // --- Lower mounting lugs (8x, paired around 4 quadrants) ---
    for (a = [0, 90, 180, 270])
        for (da = [-15, 15])
            rotate([0, a + da, 0])
                translate([hub_r_lower, lower_lug_y, 0])
                    lower_mounting_lug();

    // --- Upper D-shaped lug tabs (4x) ---
    for (a = [0, 90, 180, 270])
        rotate([0, a, 0])
            translate([hub_r_upper, hub_lower_h + hub_cone_h + hub_upper_h - 2, 0]) {
                upper_d_lug();
                // Flanged pin through lug hole (along Z)
                translate([4, 0, 0]) rotate([0, 90, 0]) flanged_pin();
            }

    // --- Upper mounting lugs (4x, offset 45°) ---
    for (a = [45, 135, 225, 315])
        rotate([0, a, 0])
            translate([hub_r_upper, hub_lower_h + hub_cone_h + hub_upper_h - 5, 0]) {
                upper_mount_lug();
                // Plain pin through lug hole (along Z)
                translate([4, 0, 0]) rotate([0, 90, 0]) plain_pin();
            }

    // --- Four jaw quadrants ---
    for (i = [0 : 3]) {
        a = i * 90;
        is_tine = (i == 1 || i == 3);

        // Vector geometry for barrel and rod
        barrel_dx = jaw_pivot_r - barrel_hub_r;
        barrel_dy = jaw_pivot_y - barrel_hub_y;
        barrel_ang = atan2(barrel_dy, barrel_dx);
        barrel_mid_r = (barrel_hub_r + jaw_pivot_r) / 2;
        barrel_mid_y = (barrel_hub_y + jaw_pivot_y) / 2;

        rod_dx = jaw_mid_r - lower_lug_r;
        rod_dy = jaw_mid_y - lower_lug_y;
        rod_ang = atan2(rod_dy, rod_dx);

        rotate([0, a, 0]) {
            // Main jaw
            translate([jaw_pivot_r, jaw_pivot_y, 0])
                if (is_tine) gripper_tine(); else gripper_jaw();

            // Curved support arm (offset in +Z)
            translate([jaw_pivot_r, jaw_pivot_y, 2.5])
                if (is_tine) curved_arm(); else curved_support_arm();

            // Barrel strut (midpoint placement)
            translate([barrel_mid_r, barrel_mid_y, 0])
                rotate([0, 0, barrel_ang])
                    barrel();

            // Follower rod (head at lower lug)
            translate([lower_lug_r, lower_lug_y, 0])
                rotate([0, 0, rod_ang])
                    follower_rod();

            // Stepped pin at jaw pivot (along Z)
            translate([jaw_pivot_r, jaw_pivot_y, 0])
                rotate([0, 90, 0])
                    stepped_pin();

            // Spool pin at jaw mid / follower rod boss (along Z)
            translate([jaw_mid_r, jaw_mid_y, 0])
                rotate([0, 90, 0])
                    spool_pin();
        }
    }
}