// =============================================
// Parametric reference model (all units in mm)
// =============================================

// ---- Global resolution ----
$fn = 100;

// ---- Base parameters ----
base_length   = 0.75;    // overall X dimension
base_width    = 0.375;   // overall Y dimension
base_height   = 0.0375;  // base datum plane height (extrusion depth)

// ---- Raised upper material (open channel walls) ----
upper_top_z       = 0.1312;          // top of raised material above datum
upper_height      = 0.0937;          // extrusion depth above base top
front_wall_thk    = 0.0281;          // front wall thickness of channel
back_wall_thk     = 0.0375;          // back wall thickness of channel

// ---- Narrow end block at left end ----
endblock_length   = 0.0319;          // X extent (right edge offset 0.7181 => left edge at 0)
endblock_width    = 0.3094;          // Y extent (fills space between walls)
endblock_front_y  = 0.0281;          // front offset from datum edge
endblock_back_y   = 0.0375;          // back offset
endblock_top_z    = 0.0937;          // reaches 0.0937 from base datum
endblock_height   = 0.05625;         // stated height (approx. depth above base)
endblock_depth    = 0.0562;          // extrusion depth above base

// ---- Annular post parameters ----
post_center_y     = 0.1875;                          // centered across width
post_x_positions  = [0.15, 0.30, 0.45, 0.60];        // axis left offsets
post_outer_r      = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_r      = [0.0188, 0.0197, 0.0216, 0.0234];
post_bottom_z     = 0.0375;                          // sits on base upper face
post_extrude      = 0.0937;                          // extrusion depth

// -------------------------------------------------
// Module: annular cylindrical post (tube)
// Built on the XY plane at origin, axis +Z,
// then translated into position by caller.
// -------------------------------------------------
module annular_post(r_out, r_in, z_bottom, depth) {
    translate([0, 0, z_bottom])
    difference() {
        cylinder(h = depth, r = r_out, center = false);
        // Central through-opening extended slightly beyond both ends
        translate([0, 0, -0.01])
            cylinder(h = depth + 0.02, r = r_in, center = false);
    }
}

// -------------------------------------------------
// Main assembly
// -------------------------------------------------
union() {

    // --- Step 1: Rectangular base ---
    // Length 0.75 x width 0.375 x height 0.0375
    cube([base_length, base_width, base_height]);

    // --- Step 2: Raised upper material with open channel interior ---
    // Outer footprint matches base edges (flush all around).
    // Modeled as two longitudinal walls so the channel stays open;
    // no solid pad is filled above the base.
    // Front wall
    cube([base_length, front_wall_thk, upper_height],
         center = false);
    // Back wall
    translate([0, base_width - back_wall_thk, 0])
        cube([base_length, back_wall_thk, upper_height],
             center = false);

    // --- Step 3: Narrower rectangular solid at left end ---
    // Footprint 0.0319 x 0.3094, spans between channel walls,
    // sitting on base top face up to z = 0.0937.
    translate([0, endblock_front_y, base_height])
        cube([endblock_length,
              endblock_width,
              endblock_depth]);

    // --- Step 4: Four separate annular posts on base upper face ---
    // All share one Y centerline; each has its own radii pair.
    for (i = [0 : 3]) {
        translate([post_x_positions[i], post_center_y, 0])
            annular_post(post_outer_r[i],
                         post_inner_r[i],
                         post_bottom_z,
                         post_extrude);
    }
}