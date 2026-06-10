// ==========================================
// Retro CRT Television
// ==========================================

$fn = 60;

// --- Overall Cabinet Dimensions ---
tv_w = 254;          // Total width (left to right)
tv_h = 190;          // Total height
tv_d = 220;          // Total depth (front to back)

// --- Front Bezel ---
bz_thick = 12;       // Width of outer bezel frame bars
bz_depth = 8;        // How far the bezel protrudes forward
bz_top = 25;         // Height of top bezel
bz_bot = 25;         // Height of bottom bezel

// --- Screen (Left Side) ---
scr_w = 170;         // Screen opening width
scr_h = tv_h - bz_top - bz_bot;  // Screen opening height (140)
scr_curve_r = 300;   // Radius of CRT curvature

// --- Right Control / Speaker Panel ---
rp_w = 50;           // Width of right panel opening
rp_h = scr_h;        // Full height between top/bottom bezels

// --- Derived Positions ---
front_y = -tv_d / 2;                     // Front-most Y plane
screen_cx = -tv_w/2 + bz_thick + scr_w/2; // Screen center X
rp_cx = tv_w/2 - bz_thick - rp_w/2;       // Right panel center X

// --- Back Protrusion (CRT Neck Housing) ---
bump_w = 120;
bump_h = 90;
bump_d = 45;
bump_cx = screen_cx;  // Centered behind the screen
bump_cz = 15;         // Slightly above vertical center

// --- Top Slider Controls ---
slider_len = 30;
slider_wid = 5;
slider_dep = 2;
slider_x1 = screen_cx - 20;
slider_x2 = screen_cx + 20;
slider_y = front_y + bz_depth + slider_len/2 + 10; // On top surface, behind bezel

// --- Antennas (Rabbit Ears) ---
ant_len = 150;
ant_d = 3;
ant_spread = 28;      // Lateral spread angle (degrees)
ant_tilt = 18;        // Backward tilt angle (degrees)

// --- Speaker Grille ---
spk_slots = 6;
spk_slot_h = 5;
spk_slot_gap = 5;
spk_w = rp_w - 8;     // Fits inside right panel opening
spk_cz = 30;          // Centered in upper portion of right panel

// --- Lower Control Pocket ---
pocket_w = rp_w - 8;
pocket_h = 30;
pocket_d = 2;
pocket_cz = -25;      // Below speaker grille

// --- Logo Plate ---
logo_w = 35;
logo_h = 5;
logo_d = 1;

// --- Right Side Recessed Detail ---
side_dep = 2;
side_w = 100;
side_h = 120;


// ==========================================
// Modules
// ==========================================

// Main cabinet body plus rear CRT bump, with slider cutouts
module main_body() {
    mb_d = tv_d - bz_depth;                 // Depth behind bezel
    mb_cy = front_y + bz_depth + mb_d/2;    // Center Y of main block

    difference() {
        union() {
            // Primary cabinet block
            translate([0, mb_cy, 0])
                cube([tv_w, mb_d, tv_h], center=true);

            // Rear protrusion for CRT neck / electronics
            translate([bump_cx, tv_d/2 + bump_d/2, bump_cz])
                cube([bump_w, bump_d, bump_h], center=true);
        }

        // Top slider cutouts (two slots over the screen area)
        for (sx = [slider_x1, slider_x2]) {
            translate([sx, slider_y, tv_h/2 - slider_dep/2])
                cube([slider_wid, slider_len, slider_dep + 0.2], center=true);
        }
    }
}

// Front bezel frame with openings for screen and right panel
module front_bezel() {
    translate([0, front_y + bz_depth/2, 0])
        difference() {
            // Solid bezel plate
            cube([tv_w, bz_depth, tv_h], center=true);

            // Screen opening
            translate([screen_cx, 0, 0])
                cube([scr_w, bz_depth + 0.2, scr_h], center=true);

            // Right panel opening
            translate([rp_cx, 0, 0])
                cube([rp_w, bz_depth + 0.2, rp_h], center=true);
        }
}

// Curved CRT screen face (spherical cap) bulging through bezel
module crt_screen() {
    a = scr_w / 2;
    // Sagitta (bulge) derived from chord half-width and sphere radius
    bulge = scr_curve_r - sqrt(scr_curve_r*scr_curve_r - a*a);

    translate([screen_cx, front_y + bz_depth + bulge - scr_curve_r, 0])
        intersection() {
            sphere(r=scr_curve_r);
            // Keep only the front cap bounded to screen dimensions
            translate([0, scr_curve_r/2, 0])
                cube([scr_w + 2, scr_curve_r, scr_h + 2], center=true);
        }
}

// Horizontal ribs forming the speaker grille in the right panel
module speaker_grille() {
    y = front_y + bz_depth + 1;  // Slightly proud of front face
    total_h = spk_slots * spk_slot_h + (spk_slots - 1) * spk_slot_gap;
    start_z = spk_cz - total_h/2 + spk_slot_h/2;

    for (i = [0 : spk_slots - 1]) {
        z = start_z + i * (spk_slot_h + spk_slot_gap);
        translate([rp_cx, y, z])
            cube([spk_w, 1.5, spk_slot_h], center=true);
    }
}

// Recessed pocket below the speaker grille
module control_pocket() {
    translate([rp_cx, front_y + bz_depth - pocket_d/2, pocket_cz])
        cube([pocket_w, pocket_d, pocket_h], center=true);
}

// Small control knobs / buttons above speaker
module control_buttons() {
    y = front_y + bz_depth + 1;
    for (bx = [-6, 6]) {
        translate([rp_cx + bx, y, spk_cz + 35])
            cylinder(h=2, d=4, center=true);
    }
}

// Brand logo plate on bottom bezel below screen
module logo_plate() {
    y = front_y + bz_depth + logo_d/2;
    z = -tv_h/2 + bz_bot/2;
    translate([screen_cx, y, z])
        cube([logo_w, logo_d, logo_h], center=true);
}

// Recessed detail strip on the right side face
module side_panel_detail() {
    translate([tv_w/2 - side_dep/2, 10, 0])
        cube([side_dep, side_w, side_h], center=true);
}

// Single antenna with spherical tip
module antenna(azimuth) {
    rotate([-ant_tilt, 0, azimuth]) {
        cylinder(h=ant_len, d=ant_d);
        translate([0, 0, ant_len])
            sphere(d=ant_d * 1.5);
    }
}

// Both antennas emerging from top
module antennas() {
    base_x = 0;
    base_y = -30;
    base_z = tv_h / 2;

    translate([base_x, base_y, base_z]) {
        antenna(ant_spread);
        antenna(-ant_spread);
    }
}


// ==========================================
// Final Assembly
// ==========================================

union() {
    main_body();
    front_bezel();
    crt_screen();
    speaker_grille();
    control_pocket();
    control_buttons();
    logo_plate();
    side_panel_detail();
    antennas();
}