// Bevel Gear Assembly Reconstruction
// Three orthogonal bevel gears (X, Y, Z axes) converging at a common apex.

$fn = 100;

// ------------------------------------------------------------------
// Gear & Pin Parameters
// ------------------------------------------------------------------

// Common cone angle (miter gears, 45° pitch)
TAN_CONE = tan(45);

// --- Small gear (axis +Z) ---
SMALL_Z_BACK      = 60;     // Apex-to-back-face distance (and back-face radius @ 45°)
SMALL_FACE_WIDTH  = 28;     // Axial face width
SMALL_Z_FRONT     = SMALL_Z_BACK - SMALL_FACE_WIDTH;
SMALL_R_BACK      = SMALL_Z_BACK * TAN_CONE;
SMALL_R_FRONT     = SMALL_Z_FRONT * TAN_CONE;
SMALL_TOOTH_DEPTH = 10;
SMALL_ROOT_R_BACK = SMALL_R_BACK - SMALL_TOOTH_DEPTH;
SMALL_ROOT_R_FRONT= SMALL_R_FRONT - SMALL_TOOTH_DEPTH;
SMALL_HUB_R       = 22;
SMALL_HUB_LEN     = 25;
SMALL_TEETH       = 24;
SMALL_GAP_ANG     = 360 / SMALL_TEETH * 0.5;
SMALL_BORE_R      = 14.4;
SMALL_PIN_LEN     = 120;

// --- Large gear (two instances, mirror pair) ---
LARGE_Z_BACK      = 115;
LARGE_FACE_WIDTH  = 35;
LARGE_Z_FRONT     = LARGE_Z_BACK - LARGE_FACE_WIDTH;
LARGE_R_BACK      = LARGE_Z_BACK * TAN_CONE;
LARGE_R_FRONT     = LARGE_Z_FRONT * TAN_CONE;
LARGE_TOOTH_DEPTH = 12;
LARGE_ROOT_R_BACK = LARGE_R_BACK - LARGE_TOOTH_DEPTH;
LARGE_ROOT_R_FRONT= LARGE_R_FRONT - LARGE_TOOTH_DEPTH;
LARGE_HUB_R       = 46;
LARGE_HUB_LEN     = 30;
LARGE_TEETH       = 40;
LARGE_GAP_ANG     = 360 / LARGE_TEETH * 0.5;
LARGE_BORE_R      = 33.87;
LARGE_PIN_LEN_LONG= 175;
LARGE_PIN_LEN_SHORT=100;

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

// 2D circular sector for tooth-gap subtraction
module sector_2d(angle, r_max) {
    intersection() {
        circle(r = r_max);
        polygon([
            [0, 0],
            [r_max * 2, 0],
            [r_max * 2 * cos(angle), r_max * 2 * sin(angle)]
        ]);
    }
}

// Straight bevel gear blank with hub and tapered teeth
module bevel_gear(z_front, z_back, r_front, r_back,
                  root_r_front, root_r_back,
                  hub_r, hub_len, teeth, gap_angle) {

    face_width = z_back - z_front;
    max_r = max(r_back, r_front) * 1.2;

    union() {
        // Solid root cone / body
        translate([0, 0, z_front])
            cylinder(h = face_width, r1 = root_r_front, r2 = root_r_back);

        // Toothed ring: outer cone minus root cone minus radial gaps
        translate([0, 0, z_front])
        difference() {
            cylinder(h = face_width, r1 = r_front, r2 = r_back);
            translate([0, 0, -0.5])
                cylinder(h = face_width + 1, r1 = root_r_front, r2 = root_r_back);

            for (i = [0 : teeth - 1])
                rotate([0, 0, i * 360 / teeth])
                    translate([0, 0, -0.5])
                    linear_extrude(height = face_width + 1)
                        sector_2d(gap_angle, max_r);
        }

        // Cylindrical hub protruding from back face
        translate([0, 0, z_back])
            cylinder(r = hub_r, h = hub_len);
    }
}

// Cylindrical shaft / pin coaxial with the gear axis
module axial_pin(r, len, z_start) {
    translate([0, 0, z_start])
        cylinder(r = r, h = len);
}

// ------------------------------------------------------------------
// Assembly
// ------------------------------------------------------------------

union() {
    // 1. Small gear at upper-left area (axis +Z)
    bevel_gear(
        z_front       = SMALL_Z_FRONT,
        z_back        = SMALL_Z_BACK,
        r_front       = SMALL_R_FRONT,
        r_back        = SMALL_R_BACK,
        root_r_front  = SMALL_ROOT_R_FRONT,
        root_r_back   = SMALL_ROOT_R_BACK,
        hub_r         = SMALL_HUB_R,
        hub_len       = SMALL_HUB_LEN,
        teeth         = SMALL_TEETH,
        gap_angle     = SMALL_GAP_ANG
    );
    axial_pin(SMALL_BORE_R, SMALL_PIN_LEN, SMALL_Z_FRONT);

    // 2. Right large gear (axis +X) – long pin
    rotate([0, 90, 0])
    union() {
        bevel_gear(
            z_front       = LARGE_Z_FRONT,
            z_back        = LARGE_Z_BACK,
            r_front       = LARGE_R_FRONT,
            r_back        = LARGE_R_BACK,
            root_r_front  = LARGE_ROOT_R_FRONT,
            root_r_back   = LARGE_ROOT_R_BACK,
            hub_r         = LARGE_HUB_R,
            hub_len       = LARGE_HUB_LEN,
            teeth         = LARGE_TEETH,
            gap_angle     = LARGE_GAP_ANG
        );
        axial_pin(LARGE_BORE_R, LARGE_PIN_LEN_LONG, LARGE_Z_FRONT);
    }

    // 3. Center large gear (axis +Y) – short pin, mirrored/rotated pair
    rotate([90, 0, 0])
    union() {
        bevel_gear(
            z_front       = LARGE_Z_FRONT,
            z_back        = LARGE_Z_BACK,
            r_front       = LARGE_R_FRONT,
            r_back        = LARGE_R_BACK,
            root_r_front  = LARGE_ROOT_R_FRONT,
            root_r_back   = LARGE_ROOT_R_BACK,
            hub_r         = LARGE_HUB_R,
            hub_len       = LARGE_HUB_LEN,
            teeth         = LARGE_TEETH,
            gap_angle     = LARGE_GAP_ANG
        );
        axial_pin(LARGE_BORE_R, LARGE_PIN_LEN_SHORT, LARGE_Z_FRONT);
    }
}