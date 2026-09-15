// ============================================================
// Stepped-Cavity Housing with Side Projection
// ============================================================

// ---- Global resolution ----
$fn = 64;

// ---- Main body dimensions (mm) ----
body_length   = 80;   // X size
body_width    = 50;   // Y size
body_height   = 40;   // Z size

// ---- Upper recess (broad pocket under the rim) ----
rim_width     = 4;    // thin rim surrounding the upper recess
recess1_depth = 8;    // depth of the broad upper recess
recess1_inset = rim_width;

// ---- Second (smaller inset) pocket ----
recess2_extra = 5;    // additional inset beyond recess 1 on each side
recess2_depth = 8;    // depth below the first recess floor

// ---- Deepest pocket (shifted to one side) ----
pocket_shift   = 10;  // shift of deepest pocket toward -X side
pocket_inset   = 8;   // inset of deepest pocket from recess 2 walls
pocket_depth   = 14;  // depth below the second recess floor
floor_thick    = 5;   // solid bottom thickness remaining

// ---- Side projection (boss along one side) ----
proj_height   = 15;   // height of the added side projection
proj_thickness= 10;   // how far it projects outward in +Y
proj_length   = 40;   // length of the projection along X
proj_setback  = 10;   // X offset of projection start

// ---- Side recess above the projection ----
side_recess_depth = 5;   // cut depth into the +Y face
side_recess_height = body_height - proj_height; // height of recessed tier

// ============================================================
// Modules
// ============================================================

// Main body blank
module body_blank() {
    cube([body_length, body_width, body_height]);
}

// Nested stepped cavity cut from the top (no through opening)
module stepped_cavity() {
    // Tier 1: broad upper recess bounded by the thin rim
    translate([recess1_inset, recess1_inset, body_height - recess1_depth])
        cube([body_length - 2*recess1_inset,
              body_width  - 2*recess1_inset,
              recess1_depth + 1]);          // +1 ensures clean top face cut

    // Tier 2: smaller inset rectangular cut continuing downward
    translate([recess1_inset + recess2_extra,
               recess1_inset + recess2_extra,
               body_height - recess1_depth - recess2_depth])
        cube([body_length - 2*(recess1_inset + recess2_extra),
              body_width  - 2*(recess1_inset + recess2_extra),
              recess2_depth + 1]);

    // Tier 3: deepest pocket, shifted to one side (-X)
    translate([recess1_inset + recess2_extra + pocket_inset - pocket_shift,
               recess1_inset + recess2_extra + pocket_inset,
               body_height - recess1_depth - recess2_depth - pocket_depth])
        cube([body_length - 2*(recess1_inset + recess2_extra + pocket_inset) + pocket_shift,
              body_width  - 2*(recess1_inset + recess2_extra + pocket_inset),
              pocket_depth + 1]);
}

// Added rectangular solid projection along the +Y side
module side_projection() {
    translate([proj_setback, body_width, 0])
        cube([proj_length, proj_thickness, proj_height]);
}

// Shallow recess cut into the +Y face above the projection,
// creating a stepped exterior tier
module side_recess() {
    translate([-1, body_width - side_recess_depth, proj_height])
        cube([body_length + 2, side_recess_depth + 1, side_recess_height]);
}

// ============================================================
// Assembly
// ============================================================

difference() {
    union() {
        // Main body plus the single side projection
        body_blank();
        side_projection();
    }
    // Top-down stepped cavity (leaves a solid bottom)
    stepped_cavity();
    // Stepped side recess above the projection
    side_recess();
}