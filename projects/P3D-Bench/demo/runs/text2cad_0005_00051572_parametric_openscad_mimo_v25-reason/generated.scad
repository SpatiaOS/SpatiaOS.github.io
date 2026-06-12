// === Base Parameters ===
base_length = 0.75;
base_width  = 0.375;
base_height = 0.0375;

// === Frame (Raised Wall) Parameters ===
frame_height = 0.0937;       // extrusion depth of walls
wall_front   = 0.0281;       // front wall thickness
wall_back    = 0.0375;       // back wall thickness
wall_left    = 0.0281;       // left wall thickness
wall_right   = 0.0281;       // right wall thickness

// === Narrower Solid at Left End ===
ns_x0      = 0;             // left edge offset
ns_y0      = 0.0281;        // front offset
ns_width   = 0.0319;        // X extent
ns_depth   = 0.3094;        // Y extent (0.375 - 0.0281 - 0.0375)
ns_height  = 0.05625;       // height

// === Annular Post Parameters ===
post_y_pos     = 0.1875;    // centered across width (0.375/2)
post_x_pos     = [0.15, 0.3, 0.45, 0.6];
post_outer_r   = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_r   = [0.0188, 0.0197, 0.0216, 0.0234];
post_height    = 0.0937;    // spans 0.0375 to 0.1312

$fn = 100;

// === Modules ===

// Rectangular base plate
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// Raised rectangular frame (hollow tube forming channel walls)
module raised_frame() {
    difference() {
        // Outer shell
        cube([base_length, base_width, frame_height]);
        // Channel interior cutout
        translate([wall_left, wall_front, -0.001])
            cube([base_length - wall_left - wall_right,
                  base_width  - wall_front - wall_back,
                  frame_height + 0.002]);
    }
}

// Narrower rectangular solid at left end of channel
module narrow_block() {
    translate([ns_x0, ns_y0, 0])
        cube([ns_width, ns_depth, ns_height]);
}

// Annular cylindrical post with through hole
module annular_post(outer_r, inner_r, h) {
    difference() {
        cylinder(r = outer_r, h = h);
        translate([0, 0, -0.001])
            cylinder(r = inner_r, h = h + 0.002);
    }
}

// === Main Assembly ===

union() {
    // 1. Base plate at datum
    base_plate();

    // 2. Raised frame sitting on top of base
    translate([0, 0, base_height])
        raised_frame();

    // 3. Narrower solid at left end, on top of base
    translate([0, 0, base_height])
        narrow_block();

    // 4. Four separate annular posts on top of base
    for (i = [0 : 3]) {
        translate([post_x_pos[i], post_y_pos, base_height])
            annular_post(post_outer_r[i], post_inner_r[i], post_height);
    }
}