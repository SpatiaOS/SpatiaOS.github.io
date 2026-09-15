// ============================================================
// Parametric stepped cavity box with side projection & recess
// All dimensions in millimeters
// ============================================================

// ---- Main body parameters ----
body_w = 60;          // outer width (X)
body_d = 40;          // outer depth (Y)
body_h = 30;          // outer height (Z)

wall = 3;             // wall thickness of the top rim
bottom_t = 4;         // solid bottom thickness
corner_fn = 0;        // (no rounding, kept simple)

// ---- Stepped cavity parameters ----
step1_w = 46;         // upper recess width
step1_d = 28;         // upper recess depth (Y)
step1_h = 6;          // upper recess height

step2_w = 36;         // middle recess width
step2_d = 20;         // middle recess depth (Y)
step2_h = 8;          // middle recess height

// Deepest pocket - shifted to one side (+X)
pocket_w = 24;
pocket_d = 12;
pocket_h = 10;        // extends down to bottom slab only
pocket_x_shift = 5;   // offset toward +X side

$fn = 64;

// ---- Side boss (projection) parameters ----
boss_w  = 18;         // projection width (X)
boss_t  = 6;          // projection length outward (Y)
boss_h  = 8;          // projection height (Z)
boss_z  = bottom_t;   // sits just above the base

// ---- Related side recess above the boss ----
side_recess_w = 26;   // recess width (X) in side wall
side_recess_depth = 4; // cut into the wall (Y)
side_recess_z_min = boss_z + boss_h;      // starts at boss top
side_recess_z_max = body_h - wall;        // ends under the rim


// ------------------------------------------------------------
// Module: plain rectangular block centered on Z=0 base reference
// ------------------------------------------------------------
module box(w, d, h) {
    translate([-w/2, -d/2, 0])
        cube([w, d, h]);
}

// ------------------------------------------------------------
// Module: nested stepped cavity cuts (subtracted from body)
// Cavity positions are relative to the TOP face and descend.
// ------------------------------------------------------------
module stepped_cavity() {
    z_top = body_h;                       // top face height

    // Upper broad recess (leaves the rim wall)
    translate([0, 0, z_top - step1_h])
        box(step1_w, step1_d, step1_h + 1); // +1 to punch through top

    // Middle inset step
    translate([0, 0, z_top - step1_h - step2_h])
        box(step2_w, step2_d, step2_h);

    // Deepest pocket, shifted to +X side
    translate([pocket_x_shift, 0, 0])
        box(pocket_w, pocket_d,
            body_h - bottom_t);
}

// ------------------------------------------------------------
// Module: side recess cut into one side wall (above the boss)
// ------------------------------------------------------------
module side_recess() {
    translate([-side_recess_w/2,
               body_d/2 - side_recess_depth - 0.001,
               side_recess_z_min])
        cube([side_recess_w,
              side_recess_depth + 1,
              side_recess_z_max - side_recess_z_min]);
}

// ------------------------------------------------------------
// Main model: difference the cavities from a solid block,
// then union the external projection.
// ------------------------------------------------------------
difference() {
    // Solid rectangular main body
    box(body_w, body_d, body_h);

    // Cut the nested stepped interior cavity from the top
    stepped_cavity();

    // Cut the recess in the side wall above the boss tier
    side_recess();
}

// Add the rectangular solid projection along the front side,
// directly below the side recess (creates a stepped side tier)
translate([-boss_w/2, body_d/2, boss_z])
    cube([boss_w, boss_t, boss_h]);