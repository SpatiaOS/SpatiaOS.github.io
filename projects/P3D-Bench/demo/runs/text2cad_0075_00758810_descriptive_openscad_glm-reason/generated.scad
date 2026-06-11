```scad
// === Parametric Variables ===

// Rounded base dimensions
base_length = 80;                   // overall length of the base
base_width = 40;                    // overall width of the base
base_thickness = 15;                // base height / thickness
base_end_radius = base_width / 2;   // curved-end radius (stadium shape)

// Raised annular collar
collar_od = 32;                     // outer diameter of collar
collar_id = 16;                     // inner bore diameter of collar
collar_height = 10;                 // collar height above base top face

// Stepped bore inside base
bore_extend_depth = 8;              // depth wider bore extends into base from top
through_hole_d = 10;                // narrower through-hole diameter (creates step)

// Side recesses
side_recess_d = 6;                  // diameter of each side recess
side_recess_depth = 2.5;            // depth of each side recess
side_recess_x_pos = [-15, 15];      // x-positions along the straight sides

// Bottom recess pattern
bot_recess_d = 8;                   // diameter of each bottom recess
bot_recess_depth = 3;               // depth of each bottom recess
bot_recess_x_pos = [-18, 0, 18];    // x-positions of bottom recesses

// Resolution
$fn = 80;

// === Stadium-shaped 2D profile ===
module base_profile() {
    hull() {
        translate([-base_length / 2 + base_end_radius, 0])
            circle(r = base_end_radius);
        translate([base_length / 2 - base_end_radius, 0])
            circle(r = base_end_radius);
    }
}

// === Main Model ===
difference() {
    // ---- Solid body: base + collar ----
    union() {
        // Extruded rounded base with curved ends
        linear_extrude(height = base_thickness)
            base_profile();

        // Raised annular collar on the upper face
        translate([0, 0, base_thickness])
            difference() {
                cylinder(d = collar_od, h = collar_height);
                // Bore through collar (oversize height for clean cut)
                cylinder(d = collar_id, h = collar_height + 0.1);
            }
    }

    // ---- Subtractive features ----

    // 1) Collar bore continuing into the base as a wider stepped section
    translate([0, 0, base_thickness - bore_extend_depth])
        cylinder(d = collar_id, h = bore_extend_depth + 0.1);

    // 2) Narrower through-hole that passes entirely through the base
    translate([0, 0, -0.1])
        cylinder