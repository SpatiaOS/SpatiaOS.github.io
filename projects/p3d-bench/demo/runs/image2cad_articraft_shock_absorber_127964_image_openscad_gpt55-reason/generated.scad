// Parametric coil-over shock absorber / spring damper approximation
// Units: millimeters

// -----------------------------
// Global resolution and helpers
// -----------------------------
$fn = 96;

curve_fn = 96;
small_fn = 24;
spring_sphere_fn = 18;
thread_sphere_fn = 10;

boolean_extra = 2.0;       // Extra length used for clean boolean cuts
part_overlap = 0.8;        // Intentional overlap so adjoining parts union cleanly

// -----------------------------
// Lower spring seat parameters
// -----------------------------
lower_seat_center_z = 38;
lower_seat_thickness = 7;
lower_seat_diameter = 52;
lower_seat_hole_diameter = 14;
lower_seat_outer_bead_r = 1.4;
lower_seat_groove_r = 1.0;
lower_seat_center_boss_d = 27;
lower_seat_center_boss_h = 1.6;
lower_seat_notch_count = 1;
lower_seat_notch_d = 11;
lower_seat_notch_phase = 315;

// -----------------------------
// Main coil spring parameters
// -----------------------------
spring_wire_diameter = 6;
spring_wire_radius = spring_wire_diameter / 2;
spring_mean_diameter = 42;
spring_radius = spring_mean_diameter / 2;
spring_turns = 4.85;
spring_height = 82;
spring_seat_overlap = 0.8;
spring_phase = 25;
spring_steps_per_turn = 30;

spring_start_z = lower_seat_center_z + lower_seat_thickness / 2 + spring_wire_radius - spring_seat_overlap;
spring_end_z = spring_start_z + spring_height;

// -----------------------------
// Bottom eyelet and mount
// -----------------------------
bottom_eye_center_z = 12;
bottom_eye_width = 24;
bottom_eye_outer_d = 18;
bottom_eye_boss_d = 22;
bottom_eye_boss_w = 5;
bottom_eye_hole_d = 8;

bottom_neck_d = 16;
bottom_mount_seat_overlap = 2.0;
bottom_mount_top_z = lower_seat_center_z - lower_seat_thickness / 2 + bottom_mount_seat_overlap;

bottom_side_plate_w = 4;
bottom_side_plate_y = 15;
bottom_side_plate_h = 25;
bottom_side_plate_center_z = bottom_eye_center_z + 6;
bottom_side_plate_x_offset = bottom_eye_width / 2 - bottom_eye_boss_w / 2;

// -----------------------------
// Top toothed adjuster / collar
// -----------------------------
top_adjuster_thickness = 10;
top_adjuster_bottom_z = spring_end_z + spring_wire_radius - spring_seat_overlap;
top_adjuster_center_z = top_adjuster_bottom_z + top_adjuster_thickness / 2;
top_adjuster_top_z = top_adjuster_center_z + top_adjuster_thickness / 2;

top_adjuster_root_d = 44;
top_adjuster_inner_d = 16;
top_adjuster_teeth = 12;
top_adjuster_tooth_depth = 6;
top_adjuster_tooth_width = 8;
top_adjuster_tooth_overlap = 1.0;
top_adjuster_edge_bead_r = 0.8;

top_lock_ring_d = 34;
top_lock_ring_h = 5;
top_lock_ring_hole_d = 13;
top_lock_ring_bead_r = 0.8;
top_lock_ring_center_z = top_adjuster_bottom_z - top_lock_ring_h / 2 + part_overlap;

upper_base_boss_h = 5;
upper_base_boss_d1 = 30;
upper_base_boss_d2 = 21;
upper_base_boss_center_z = top_adjuster_top_z + upper_base_boss_h / 2 - part_overlap;

// -----------------------------
// Upper post and eyelet
// -----------------------------
upper_mount_base_z = top_adjuster_top_z + upper_base_boss_h - 1.4;
upper_post_d = 18;
upper_post_height = 29;

top_eye_center_z = upper_mount_base_z + 22;
top_eye_width = 30;
top_eye_outer_d = 16;
top_eye_boss_d = 20;
top_eye_boss_w = 6;
top_eye_hole_d = 7.5;

upper_foot_d = 23;
upper_foot_h = 5;

upper_top_plug_d = 9.5;
upper_top_plug_h = 1.8;
upper_top_plug_raise = 0.4;
upper_top_plug_center_z = upper_mount_base_z + upper_post_height + upper_post_d / 2 - upper_top_plug_h / 2 + upper_top_plug_raise;

// -----------------------------
// Central damper body and thread
// -----------------------------
rod_d = 8;

damper_body_d = 16;
damper_body_bottom_z = lower_seat_center_z - lower_seat_thickness / 2 - 0.5;
damper_body_top_z = spring_start_z + spring_height * 0.58 + 3;

damper_band_r = 0.65;
damper_band_offset = 3;

thread_start_z = spring_start_z + spring_height * 0.58;
thread_sleeve_top_z = top_adjuster_bottom_z + 1.0;
thread_sleeve_h = thread_sleeve_top_z - thread_start_z;
thread_sleeve_d = 15;
thread_pitch = 4.2;
thread_turns = thread_sleeve_h / thread_pitch;
thread_ridge_r = 0.7;
thread_steps_per_turn = 18;

rod_bottom_z = damper_body_bottom_z;
rod_top_z = top_adjuster_top_z + upper_base_boss_h + 1;

// -----------------------------
// Helper modules
// -----------------------------

// Simple vertical cylinder between two Z elevations
module cylinder_between_z(z1, z2, d) {
    translate([0, 0, (z1 + z2) / 2])
        cylinder(h = abs(z2 - z1), d = d, center = true);
}

// Torus used for rounded beads, rims, and raised circular features
module torus(major_radius, minor_radius, fn_major = curve_fn, fn_minor = small_fn) {
    rotate_extrude(convexity = 10, $fn = fn_major)
        translate([major_radius, 0, 0])
            circle(r = minor_radius, $fn = fn_minor);
}

// Spherical/capsule sweep along a helix; used for spring and thread ridges
module helical_sweep(radius, wire_radius, height, turns, z0, phase = 0, steps_per_turn = 24, sphere_fn = 14) {
    steps = max(1, ceil(turns * steps_per_turn));

    union() {
        for (i = [0 : steps - 1]) {
            hull() {
                let(
                    t = i / steps,
                    a = phase + 360 * turns * t
                )
                translate([radius * cos(a), radius * sin(a), z0 + height * t])
                    sphere(r = wire_radius, $fn = sphere_fn);

                let(
                    t = (i + 1) / steps,
                    a = phase + 360 * turns * t
                )
                translate([radius * cos(a), radius * sin(a), z0 + height * t])
                    sphere(r = wire_radius, $fn = sphere_fn);
            }
        }
    }
}

// Horizontal cylindrical eyelet solid along X, without the bore cut
module eyelet_solid_x(width, outer_d, boss_d, boss_w) {
    rotate([0, 90, 0])
        cylinder(h = width, d = outer_d, center = true);

    for (sx = [-1, 1]) {
        translate([sx * (width / 2 - boss_w / 2), 0, 0])
            rotate([0, 90, 0])
                cylinder(h = boss_w, d = boss_d, center = true);
    }
}

// Raised annular ring with rounded outer beads
module annular_ring(d, h, hole_d, z = 0, bead_r = 0.8) {
    translate([0, 0, z])
        difference() {
            union() {
                cylinder(h = h, d = d, center = true);

                if (bead_r > 0) {
                    translate([0, 0, h / 2])
                        torus(major_radius = d / 2 - bead_r, minor_radius = bead_r);
                    translate([0, 0, -h / 2])
                        torus(major_radius = d / 2 - bead_r, minor_radius = bead_r);
                }
            }

            cylinder(
                h = h + 2 * bead_r + 2 * boolean_extra,
                d = hole_d,
                center = true
            );
        }
}

// Lower spring seat: shallow round plate with rim, center boss, spring groove, and edge notch
module spring_seat_plate(
    d,
    h,
    hole_d,
    z,
    outer_bead_r,
    groove_radius,
    groove_r,
    center_boss_d,
    center_boss_h,
    notch_count,
    notch_d,
    notch_phase
) {
    translate([0, 0, z])
        difference() {
            union() {
                cylinder(h = h, d = d, center = true);

                // Rounded outer beads on top and bottom
                translate([0, 0, h / 2])
                    torus(major_radius = d / 2 - outer_bead_r, minor_radius = outer_bead_r);
                translate([0, 0, -h / 2])
                    torus(major_radius = d / 2 - outer_bead_r, minor_radius = outer_bead_r);

                // Raised circular groove where the coil spring sits
                translate([0, 0, h / 2 + 0.2])
                    torus(major_radius = groove_radius, minor_radius = groove_r);

                // Small raised central boss/washer
                translate([0, 0, h / 2 + center_boss_h / 2 - 0.2])
                    cylinder(h = center_boss_h, d = center_boss_d, center = true);
            }

            // Central through-hole
            cylinder(
                h = h + 2 * outer_bead_r + center_boss_h + 2 * boolean_extra,
                d = hole_d,
                center = true
            );

            // Scalloped edge relief/notch visible on the lower spring seat
            if (notch_count > 0) {
                for (i = [0 : notch_count - 1]) {
                    rotate([0, 0, notch_phase + i * 360 / notch_count])
                        translate([d / 2 + notch_d * 0.25, 0, 0])
                            cylinder(
                                h = h + 2 * outer_bead_r + center_boss_h + 2 * boolean_extra,
                                d = notch_d,
                                center = true
                            );
                }
            }
        }
}

// Gear-like toothed top preload adjuster
module toothed_adjuster(
    root_d,
    inner_d,
    h,
    tooth_count,
    tooth_depth,
    tooth_width,
    tooth_overlap,
    edge_bead_r,
    z
) {
    translate([0, 0, z])
        difference() {
            union() {
                // Main annular disk
                cylinder(h = h, d = root_d, center = true);

                // Subtle rounded beads on the main disk
                translate([0, 0, h / 2])
                    torus(major_radius = root_d / 2 - edge_bead_r, minor_radius = edge_bead_r);
                translate([0, 0, -h / 2])
                    torus(major_radius = root_d / 2 - edge_bead_r, minor_radius = edge_bead_r);

                // Rectangular castellated teeth around the outside
                for (i = [0 : tooth_count - 1]) {
                    rotate([0, 0, i * 360 / tooth_count])
                        translate([root_d / 2 + tooth_depth / 2 - tooth_overlap, 0, 0])
                            cube(
                                [tooth_depth + 2 * tooth_overlap, tooth_width, h],
                                center = true
                            );
                }
            }

            // Central opening, later filled/overlapped by the upper post boss
            cylinder(
                h = h + 2 * edge_bead_r + 2 * boolean_extra,
                d = inner_d,
                center = true
            );
        }
}

// Fine external thread impression using a cylindrical sleeve plus helical ridge
module threaded_sleeve(z0, h, base_d, ridge_r, turns) {
    union() {
        translate([0, 0, z0 + h / 2])
            cylinder(h = h, d = base_d, center = true);

        helical_sweep(
            radius = base_d / 2 + ridge_r * 0.15,
            wire_radius = ridge_r,
            height = h,
            turns = turns,
            z0 = z0,
            phase = 180,
            steps_per_turn = thread_steps_per_turn,
            sphere_fn = thread_sphere_fn
        );

        // Thin retaining beads at each end of the threaded section
        translate([0, 0, z0])
            torus(major_radius = base_d / 2, minor_radius = ridge_r * 0.75, fn_minor = thread_sphere_fn);
        translate([0, 0, z0 + h])
            torus(major_radius = base_d / 2, minor_radius = ridge_r * 0.75, fn_minor = thread_sphere_fn);
    }
}

// -----------------------------
// Component modules
// -----------------------------

module lower_mount() {
    difference() {
        union() {
            // Central lower neck rising into the spring seat
            cylinder_between_z(bottom_eye_center_z, bottom_mount_top_z, bottom_neck_d);

            // Cylindrical lower eyelet with side bosses
            translate([0, 0, bottom_eye_center_z])
                eyelet_solid_x(
                    width = bottom_eye_width,
                    outer_d = bottom_eye_outer_d,
                    boss_d = bottom_eye_boss_d,
                    boss_w = bottom_eye_boss_w
                );

            // Flat side cheek plates to evoke the lower clevis/lug
            for (sx = [-1, 1]) {
                translate([sx * bottom_side_plate_x_offset, 0, bottom_side_plate_center_z])
                    cube([bottom_side_plate_w, bottom_side_plate_y, bottom_side_plate_h], center = true);
            }
        }

        // Through bore in the lower eyelet
        translate([0, 0, bottom_eye_center_z])
            rotate([0, 90, 0])
                cylinder(
                    h = bottom_eye_width + 2 * boolean_extra,
                    d = bottom_eye_hole_d,
                    center = true
                );
    }
}

module lower_spring_seat() {
    spring_seat_plate(
        d = lower_seat_diameter,
        h = lower_seat_thickness,
        hole_d = lower_seat_hole_diameter,
        z = lower_seat_center_z,
        outer_bead_r = lower_seat_outer_bead_r,
        groove_radius = spring_radius,
        groove_r = lower_seat_groove_r,
        center_boss_d = lower_seat_center_boss_d,
        center_boss_h = lower_seat_center_boss_h,
        notch_count = lower_seat_notch_count,
        notch_d = lower_seat_notch_d,
        notch_phase = lower_seat_notch_phase
    );
}

module damper_core() {
    union() {
        // Central shaft
        cylinder_between_z(rod_bottom_z, rod_top_z, rod_d);

        // Main shock body inside the lower portion of the spring
        cylinder_between_z(damper_body_bottom_z, damper_body_top_z, damper_body_d);

        // Raised bands on the damper body
        for (zv = [damper_body_bottom_z + damper_band_offset, damper_body_top_z - damper_band_offset]) {
            translate([0, 0, zv])
                torus(major_radius = damper_body_d / 2, minor_radius = damper_band_r, fn_minor = small_fn);
        }

        // Threaded sleeve near the top, visible through the spring coils
        threaded_sleeve(
            z0 = thread_start_z,
            h = thread_sleeve_h,
            base_d = thread_sleeve_d,
            ridge_r = thread_ridge_r,
            turns = thread_turns
        );
    }
}

module main_coil_spring() {
    helical_sweep(
        radius = spring_radius,
        wire_radius = spring_wire_radius,
        height = spring_height,
        turns = spring_turns,
        z0 = spring_start_z,
        phase = spring_phase,
        steps_per_turn = spring_steps_per_turn,
        sphere_fn = spring_sphere_fn
    );
}

module top_adjuster_assembly() {
    union() {
        // Round lock ring below the castellated adjuster
        annular_ring(
            d = top_lock_ring_d,
            h = top_lock_ring_h,
            hole_d = top_lock_ring_hole_d,
            z = top_lock_ring_center_z,
            bead_r = top_lock_ring_bead_r
        );

        // Toothed preload adjuster wheel
        toothed_adjuster(
            root_d = top_adjuster_root_d,
            inner_d = top_adjuster_inner_d,
            h = top_adjuster_thickness,
            tooth_count = top_adjuster_teeth,
            tooth_depth = top_adjuster_tooth_depth,
            tooth_width = top_adjuster_tooth_width,
            tooth_overlap = top_adjuster_tooth_overlap,
            edge_bead_r = top_adjuster_edge_bead_r,
            z = top_adjuster_center_z
        );

        // Smooth central boss rising from the adjuster into the upper post
        translate([0, 0, upper_base_boss_center_z])
            cylinder(
                h = upper_base_boss_h,
                d1 = upper_base_boss_d1,
                d2 = upper_base_boss_d2,
                center = true
            );
    }
}

module upper_mount() {
    difference() {
        union() {
            // Foot/collar at the base of the upper mount
            translate([0, 0, upper_mount_base_z + upper_foot_h / 2 - part_overlap])
                cylinder(h = upper_foot_h, d = upper_foot_d, center = true);

            // Upright post
            cylinder_between_z(
                upper_mount_base_z,
                upper_mount_base_z + upper_post_height,
                upper_post_d
            );

            // Rounded dome cap on top of the post
            translate([0, 0, upper_mount_base_z + upper_post_height])
                sphere(d = upper_post_d, $fn = curve_fn);

            // Horizontal upper eyelet/bushing
            translate([0, 0, top_eye_center_z])
                eyelet_solid_x(
                    width = top_eye_width,
                    outer_d = top_eye_outer_d,
                    boss_d = top_eye_boss_d,
                    boss_w = top_eye_boss_w
                );

            // Small circular plug detail on top
            translate([0, 0, upper_top_plug_center_z])
                cylinder(h = upper_top_plug_h, d = upper_top_plug_d, center = true);
        }

        // Through bore in upper eyelet
        translate([0, 0, top_eye_center_z])
            rotate([0, 90, 0])
                cylinder(
                    h = top_eye_width + 2 * boolean_extra,
                    d = top_eye_hole_d,
                    center = true
                );
    }
}

// -----------------------------
// Main assembly
// -----------------------------
module coilover_shock_absorber() {
    color([0.78, 0.78, 0.76, 1])
        union() {
            lower_mount();
            lower_spring_seat();
            damper_core();
            main_coil_spring();
            top_adjuster_assembly();
            upper_mount();
        }
}

coilover_shock_absorber();