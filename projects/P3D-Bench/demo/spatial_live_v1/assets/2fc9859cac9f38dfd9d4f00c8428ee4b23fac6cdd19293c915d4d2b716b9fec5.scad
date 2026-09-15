// Parametric Reconstruction of 4-Cylinder Linkage Assembly
// Bounding Box: 80 mm (X) x 438 mm (Y) x 168 mm (Z)

$fn = 60;

// Overall Assembly Dimensions
assembly_length = 438.0;
assembly_height = 168.0;
assembly_width  = 80.0;

// Shaft Bar Parameters
shaft_d      = 6.0;
shaft_len    = 438.0;
disc_d       = 30.0;
disc_t       = 14.0;
disc_slot_w  = 5.0;
disc_slot_d  = 2.5;
arm_w        = 8.0;
arm_t        = 6.0;

// Bushing Parameters
bushing_od   = 8.0;
bushing_id   = 6.0;
bushing_len  = 5.0;

// Piston Parameters
piston_d        = 50.0;
piston_h        = 40.0;
skirt_bore_d    = 40.0;
skirt_bore_h    = 24.0;
crown_pocket_d  = 30.0;
crown_t         = 5.0;
wrist_pin_d     = 12.0;
pin_z_offset    = 20.0;
ring_groove_w   = 2.0;
ring_groove_d   = 2.0;
ring_groove_z   = 37.0;

// Spacer Ring Parameters
spacer_od    = 54.56;
spacer_id    = 50.0;
spacer_h     = 5.0;
spacer_z     = 31.0;

// Connecting Rod Parameters
conrod_length  = 103.0;
big_end_od     = 44.0;
big_end_id     = 30.0;
big_end_t      = 12.0;
small_end_od   = 22.0;
small_end_id   = 12.0;
small_end_t    = 18.0;
shank_w_bottom = 16.0;
shank_w_top    = 13.0;
shank_t        = 10.0;
web_t          = 4.0;
flute_w        = 7.0;

// Layout Offsets
z_rod   = 4.0;
x_rod   = 48.72;
z_disc  = 45.0;
x_disc  = 0.0;

piston_pitch = 85.0;
y_start      = 90.0;
piston_base_z = z_disc + conrod_length - pin_z_offset;

// Module: Piston
module piston() {
    difference() {
        union() {
            // Main cylinder body
            cylinder(h=piston_h, d=piston_d);

            // Wrist-pin boss reinforcements inside pocket
            translate([0, 0, pin_z_offset])
                rotate([90, 0, 0])
                    cylinder(h=piston_d - 4, d=18, center=true);
        }

        // Lower skirt bore
        translate([0, 0, -1])
            cylinder(h=skirt_bore_h + 1, d=skirt_bore_d);

        // Blind pocket under crown
        translate([0, 0, skirt_bore_h - 0.1])
            cylinder(h=piston_h - crown_t - skirt_bore_h + 0.1, d=crown_pocket_d);

        // Circumferential ring groove near crown
        translate([0, 0, ring_groove_z])
            difference() {
                cylinder(h=ring_groove_w, d=piston_d + 1);
                translate([0, 0, -0.5])
                    cylinder(h=ring_groove_w + 1, d=piston_d - 2*ring_groove_d);
            }

        // Transverse wrist-pin bore
        translate([0, 0, pin_z_offset])
            rotate([90, 0, 0])
                cylinder(h=piston_d + 4, d=wrist_pin_d, center=true);

        // Outer pin-boss recesses on skirt exterior (+Y and -Y)
        for (side = [-1, 1]) {
            translate([0, side * (piston_d/2), pin_z_offset])
                cube([24, 7, 16], center=true);
        }

        // Slipper skirt cutaways at bottom
        for (side = [-1, 1]) {
            translate([0, side * (piston_d/2 + 2), 0])
                rotate([0, 90, 0])
                    cylinder(r=12, h=32, center=true);
        }
    }
}

// Module: Spacer Ring
module spacer_ring() {
    difference() {
        cylinder(h=spacer_h, d=spacer_od);
        translate([0, 0, -0.5])
            cylinder(h=spacer_h + 1, d=spacer_id);
    }
}

// Module: Connecting Rod with I-Beam Shank
module connecting_rod() {
    difference() {
        union() {
            // Big-end eye
            rotate([90, 0, 0])
                cylinder(h=big_end_t, d=big_end_od, center=true);

            // Small-end eye
            translate([0, 0, conrod_length])
                rotate([90, 0, 0])
                    cylinder(h=small_end_t, d=small_end_od, center=true);

            // Shank transition to big end
            hull() {
                rotate([90, 0, 0])
                    cylinder(h=shank_t, d=big_end_od * 0.75, center=true);
                translate([0, 0, 32])
                    cube([shank_w_bottom, shank_t, 1], center=true);
            }

            // Central tapered shank
            hull() {
                translate([0, 0, 30])
                    cube([shank_w_bottom, shank_t, 1], center=true);
                translate([0, 0, conrod_length - 16])
                    cube([shank_w_top, shank_t, 1], center=true);
            }

            // Shank transition to small end
            hull() {
                translate([0, 0, conrod_length - 18])
                    cube([shank_w_top, shank_t, 1], center=true);
                translate([0, 0, conrod_length])
                    rotate([90, 0, 0])
                        cylinder(h=shank_t, d=small_end_od * 0.9, center=true);
            }
        }

        // Big-end bore
        rotate([90, 0, 0])
            cylinder(h=big_end_t + 2, d=big_end_id, center=true);

        // Small-end bore
        translate([0, 0, conrod_length])
            rotate([90, 0, 0])
                cylinder(h=small_end_t + 2, d=small_end_id, center=true);

        // I-beam flutes on front and rear faces
        for (side = [-1, 1]) {
            translate([0, side * (shank_t/2 - (shank_t - web_t)/4 + 0.1), 0]) {
                hull() {
                    translate([0, 0, 35])
                        rotate([90, 0, 0])
                            cylinder(d=flute_w, h=(shank_t - web_t)/2 + 0.2, center=true);
                    translate([0, 0, conrod_length - 20])
                        rotate([90, 0, 0])
                            cylinder(d=flute_w * 0.85, h=(shank_t - web_t)/2 + 0.2, center=true);
                }
            }
        }
    }
}

// Module: Bushing
module bushing() {
    difference() {
        cylinder(h=bushing_len, d=bushing_od);
        translate([0, 0, -0.5])
            cylinder(h=bushing_len + 1, d=bushing_id);
    }
}

// Module: Shaft Bar with Disc Bosses and Bracket Arms
module shaft_bar_with_disc_bosses() {
    arm_angle = atan2(z_disc - z_rod, x_disc - x_rod);

    // Continuous backbone rod spanning 438 mm
    translate([x_rod, 0, z_rod])
        rotate([-90, 0, 0])
            cylinder(h=shaft_len, d=shaft_d);

    // Four integral disc bosses and connecting bracket arms
    for (i = [0 : 3]) {
        y_pos = y_start + i * piston_pitch;

        // Disc Boss
        translate([x_disc, y_pos, z_disc]) {
            difference() {
                rotate([90, 0, 0])
                    cylinder(h=disc_t, d=disc_d, center=true);

                // Slot on front face (-Y)
                translate([0, -disc_t/2, 0])
                    rotate([0, -arm_angle, 0])
                        cube([disc_d + 2, disc_slot_d * 2, disc_slot_w], center=true);
            }
        }

        // Bracket Arm connecting rod to disc boss
        hull() {
            translate([x_disc, y_pos - disc_t/2 + arm_t/2, z_disc])
                rotate([90, 0, 0])
                    cylinder(h=arm_t, d=10.0, center=true);

            translate([x_rod, y_pos - disc_t/2 + arm_t/2, z_rod])
                rotate([90, 0, 0])
                    cylinder(h=arm_t, d=shaft_d, center=true);
        }
    }
}

// Complete Assembly
module assembly() {
    // Shaft Bar
    color([0.75, 0.77, 0.80])
        shaft_bar_with_disc_bosses();

    // Bushing at near end of shaft
    color([0.82, 0.80, 0.75])
        translate([x_rod, 0, z_rod])
            rotate([-90, 0, 0])
                bushing();

    // Four Piston, Spacer Ring, and Connecting Rod Sub-assemblies
    for (i = [0 : 3]) {
        y_pos = y_start + i * piston_pitch;

        // Connecting Rod
        color([0.72, 0.74, 0.77])
            translate([x_disc, y_pos, z_disc])
                connecting_rod();

        // Piston
        color([0.78, 0.80, 0.83])
            translate([x_disc, y_pos, piston_base_z])
                piston();

        // Spacer Ring on Piston Barrel
        color([0.62, 0.64, 0.68])
            translate([x_disc, y_pos, piston_base_z + spacer_z])
                spacer_ring();
    }
}

assembly();