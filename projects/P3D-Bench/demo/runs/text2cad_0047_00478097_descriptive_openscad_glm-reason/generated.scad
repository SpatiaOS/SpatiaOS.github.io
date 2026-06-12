// === Parametric Variables ===

// Main body dimensions
body_width  = 60;   // X axis
body_depth  = 40;   // Y axis
body_height = 25;   // Z axis

// Top cavity - Level 1: upper recess (surrounded by thin rim)
rim_thickness       = 3;   // rim on all four sides
upper_recess_depth  = 5;   // depth of the topmost recess

// Top cavity - Level 2: middle recess (inset further)
middle_extra_inset = 5;    // additional inset beyond upper recess
middle_recess_depth = 8;   // depth of the middle step

// Top cavity - Level 3: deep pocket (shifted, creating uneven ledges)
deep_extra_inset   = 5;    // additional inset beyond middle recess
deep_pocket_depth  = 7;    // depth of the deepest pocket
deep_pocket_x_shift = 7;   // X offset shifting the deep pocket to one side

// Side projection (added rectangular solid along +Y face)
proj_width   = 20;   // X size of projection
proj_extend  = 10;   // how far the projection extends in +Y
proj_height  = 12;   // Z height of projection from the base
proj_x_pos   = 10;   // X position of projection on the side wall

// Side recess (cut into +Y wall above the projection)
srecess_width  = 20;  // X size
srecess_depth  = 5;   // how far it cuts into the body (-Y direction)
srecess_height = 6;   // Z size of the side recess
srecess_x_pos  = 10;  // X position (aligned with projection)
srecess_z_pos  = 16;  // Z position (above the projection top)

$fn = 60;

// === Helper: computed cavity dimensions ===
upper_w = body_width  - 2 * rim_thickness;
upper_d = body_depth  - 2 * rim_thickness;
middle_w = upper_w - 2 * middle_extra_inset;
middle_d = upper_d - 2 * middle_extra_inset;
deep_w  = middle_w - 2 * deep_extra_inset - deep_pocket_x_shift;
deep_d  = middle_d - 2 * deep_extra_inset;

// X start for the shifted deep pocket (shifted toward +X)
deep_x_start = rim_thickness + middle_extra_inset + deep_extra_inset + deep_pocket_x_shift;
deep_y_start = rim_thickness + middle_extra_inset + deep_extra_inset;

// Z levels (measured from bottom)
upper_z_start  = body_height - upper_recess_depth;
middle_z_start = upper_z_start - middle_recess_depth;
deep_z_start   = middle_z_start - deep_pocket_depth;

// === Main Model ===

difference() {
    // --- Solid volume: body + side projection ---
    union() {
        // Primary rectangular body
        cube([body_width, body_depth, body_height]);

        // Rectangular projection along the +Y side
        translate([proj_x_pos, body_depth, 0])
            cube([proj_width, proj_extend, proj_height]);
    }

    // --- Subtractive features: stepped cavity + side recess ---

    // Level 1: broad upper recess with thin rim
    translate([rim_thickness, rim_thickness, upper_z_start])
        cube([upper_w, upper_d, upper_recess_depth + 0.1]);

    // Level 2: narrower middle recess, inset further on all sides
    translate([
        rim_thickness + middle_extra_inset,
        rim_thickness + middle_extra_inset,
        middle_z_start
    ])
        cube([middle_w, middle_d, middle_recess_depth + 0.1]);

    // Level 3: deepest pocket, shifted in +X creating uneven interior ledges
    translate([deep_x_start, deep_y_start, deep_z_start])
        cube([deep_w, deep_d, deep_pocket_depth + 0.1]);

    // Side recess above the projection: a stepped cut into the +Y wall
    translate([srecess_x_pos, body_depth - srecess_depth, srecess_z_pos])
        cube([srecess_width, srecess_depth + 0.1, srecess_height]);
}