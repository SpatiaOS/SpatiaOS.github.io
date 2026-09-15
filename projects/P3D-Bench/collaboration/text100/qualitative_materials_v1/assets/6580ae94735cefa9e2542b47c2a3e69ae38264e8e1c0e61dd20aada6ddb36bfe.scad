// Parameters - Overall Dimensions
total_length = 0.740822;
total_width  = 0.672842;
total_height = 0.171797;
pad_depth    = 0.1512;
step_depth   = 0.0206;

// Central Opening & Rear Arc Parameters
center_x     = 0.3687;
center_y     = 0.4283;
r_central    = 0.2165;
r_back       = total_width - center_y; // 0.244542

// Straight Web Crossing Central Opening
web_x        = 0.3434;
web_len      = 0.025368;
web_y        = 0.2119;
web_width    = 0.432873;

// Smaller Round Boss & Concentric Hole
boss_x       = 0.4796;
boss_y       = 0.4282;
r_boss_outer = 0.1000;
r_boss_inner = 0.0754;

// Outer Rounded Lobes & Mounting Slots
r_lobe       = 0.0850;
lobe_L_x     = r_lobe;
lobe_L_y     = r_lobe;
lobe_R_x     = total_length - r_lobe;
lobe_R_y     = r_lobe;

slot_len     = 0.0700;
slot_width   = 0.0380;
slot_angle   = 40.0;

// Quality and tolerance settings
$fn = 100;
eps = 0.001;

// 2D Profile of the main rounded wedge base
module wedge_profile() {
    hull() {
        // Back rounded circular lobe
        translate([center_x, center_y])
            circle(r = r_back);
        // Front-left rounded lobe
        translate([lobe_L_x, lobe_L_y])
            circle(r = r_lobe);
        // Front-right rounded lobe
        translate([lobe_R_x, lobe_R_y])
            circle(r = r_lobe);
    }
}

// 2D Profile of the stepped circular underside continuation
module underside_step_profile() {
    intersection() {
        wedge_profile();
        translate([center_x, center_y])
            circle(r = r_back);
    }
}

// Straight mounting slot
module slot(len, wid, h) {
    hull() {
        translate([-(len - wid)/2, 0, 0])
            cylinder(h = h, d = wid, center = true);
        translate([(len - wid)/2, 0, 0])
            cylinder(h = h, d = wid, center = true);
    }
}

// Slots through the outer lobes
module mounting_slots() {
    // Left lobe slot
    translate([lobe_L_x, lobe_L_y, total_height / 2])
        rotate([0, 0, -slot_angle])
            slot(slot_len, slot_width, total_height + 4 * eps);

    // Right lobe slot
    translate([lobe_R_x, lobe_R_y, total_height / 2])
        rotate([0, 0, slot_angle])
            slot(slot_len, slot_width, total_height + 4 * eps);
}

// Narrow straight solid web
module web() {
    translate([web_x, web_y - eps, 0])
        cube([web_len, web_width + 2 * eps, total_height]);
}

// Smaller solid cylindrical boss
module boss_solid() {
    translate([boss_x, boss_y, 0])
        cylinder(h = total_height, r = r_boss_outer);
}

// Recess / through hole inside the boss
module boss_hole() {
    translate([boss_x, boss_y, -eps])
        cylinder(h = total_height + 2 * eps, r = r_boss_inner);
}

// Main Model Assembly
union() {
    difference() {
        // Base solid with stepped underside
        union() {
            // Broader upper pad
            translate([0, 0, step_depth])
                linear_extrude(height = pad_depth)
                    wedge_profile();

            // Underside stepped continuation
            linear_extrude(height = step_depth)
                underside_step_profile();
        }

        // Central circular through opening
        translate([center_x, center_y, -eps])
            cylinder(h = total_height + 2 * eps, r = r_central);

        // Slot openings near lobes
        mounting_slots();
    }

    // Reinforcing web crossing the central opening
    web();

    // Smaller round boss with concentric through hole
    difference() {
        boss_solid();
        boss_hole();
    }
}