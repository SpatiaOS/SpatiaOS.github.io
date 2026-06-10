// Parametric CAD model

// ------ Base dimensions ------
rail_length = 0.748506;
rail_width  = 0.024642;
lower_height = 0.0185;          // lower solid body height
top_thickness = 0.0046;         // shallow top layer thickness, raising surface to Z=0.0231

// ------ End block ------
block_side = 0.030803;
block_left_x = 0.7192;          // ~0.0015 beyond rail right end
block_front_y = 0.0361;         // in front of rail front edge
block_back_y  = block_front_y - block_side; // 0.005297

// ------ Rail edge references ------
rail_front_y = 0;
rail_back_y  = -rail_width;

// ------ Circular recesses (in rail) ------
recess_radius = 0.0043;
recess_zmin   = 0.0062;         // start height above base underside
recess_height = 0.0123;         // band depth, ends exactly at Z = lower_height

rail_center_y = -0.0108;        // common Y offset from rail front edge
rail_cx1      = 0.0138;         // first recess center X (from left end)
rail_cx2      = 0.7346;         // second recess center X

// ------ Circular recess (in end block) ------
block_cyl_cx = 0.7361;
block_cyl_cy = 0.0192;          // in front of rail front edge

// ------ Deep rectangular cutout (in end block) ------
cutout_side = 0.027722;
cutout_left_x = block_left_x;   // shares block left edge
cutout_front_y = block_front_y; // shares block front edge
cutout_back_y = cutout_front_y - cutout_side; // 0.008378
cutout_zmin   = -0.0585;        // goes below base underside
cutout_zmax   = lower_height;   // starts from lower-body shoulder

// ------ Resolution ------
$fn = 100;

// ------ Main geometry ------
difference() {
    union() {
        // Rail lower body
        translate([0, rail_back_y, 0])
            cube([rail_length, rail_width, lower_height]);
        // Rail top layer (same footprint)
        translate([0, rail_back_y, lower_height])
            cube([rail_length, rail_width, top_thickness]);

        // End block lower body
        translate([block_left_x, block_back_y, 0])
            cube([block_side, block_side, lower_height]);
        // End block top layer
        translate([block_left_x, block_back_y, lower_height])
            cube([block_side, block_side, top_thickness]);
    }

    // Two circular recesses inside the rail
    translate([rail_cx1, rail_center_y, recess_zmin])
        cylinder(h = recess_height, r = recess_radius);
    translate([rail_cx2, rail_center_y, recess_zmin])
        cylinder(h = recess_height, r = recess_radius);

    // Circular recess inside the end block
    translate([block_cyl_cx, block_cyl_cy, recess_zmin])
        cylinder(h = recess_height, r = recess_radius);

    // Deep rectangular cutout at the block's left-front corner
    translate([cutout_left_x, cutout_back_y, cutout_zmin])
        cube([cutout_side, cutout_side, cutout_zmax - cutout_zmin]);
}