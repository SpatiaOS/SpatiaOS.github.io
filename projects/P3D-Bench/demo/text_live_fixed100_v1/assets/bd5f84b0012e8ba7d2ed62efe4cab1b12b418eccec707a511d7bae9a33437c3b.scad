// Parameters
$fn = 100;

// Base dimensions
base_length = 0.75;
base_width = 0.375;
base_height = 0.0375;

// Raised channel wall parameters
wall_height = 0.0937;               // Extrusion depth from top of base (0.0375 to 0.1312)
front_wall_thickness = 0.0281;      // Front wall thickness along Y
back_wall_thickness = 0.0375;       // Back wall thickness along Y

// Left end solid parameters
left_solid_length = 0.0319;         // Footprint length along X
left_solid_width = 0.3094;          // Footprint width along Y (0.375 - 0.0281 - 0.0375)
left_solid_height = 0.05625;        // Extrusion depth from top of base (0.0375 to 0.0937)
left_solid_y_offset = 0.0281;       // Front offset

// Annular cylindrical posts parameters
posts_y = 0.1875;                   // Centered across width at front offset 0.1875
posts_height = 0.0937;              // Extrusion depth spanning from 0.0375 to 0.1312
posts_x = [0.15, 0.30, 0.45, 0.60]; // Left offset along X for post axes
posts_r_outer = [0.0469, 0.0469, 0.0562, 0.0562]; // Post outer radii
posts_r_inner = [0.0188, 0.0197, 0.0216, 0.0234]; // Matching central opening radii

// Helper module for an annular cylindrical post
module annular_post(r_out, r_in, h) {
    difference() {
        cylinder(r = r_out, h = h);
        translate([0, 0, -0.001])
            cylinder(r = r_in, h = h + 0.002);
    }
}

// Main assembly
union() {
    // 1. Rectangular base reference
    cube([base_length, base_width, base_height]);

    // 2. Raised rectangular upper wall material forming the open channel
    // Front raised wall
    translate([0, 0, base_height])
        cube([base_length, front_wall_thickness, wall_height]);

    // Back raised wall
    translate([0, base_width - back_wall_thickness, base_height])
        cube([base_length, back_wall_thickness, wall_height]);

    // 3. Narrower rectangular solid at the left end of the channel
    translate([0, left_solid_y_offset, base_height])
        cube([left_solid_length, left_solid_width, left_solid_height]);

    // 4. Four separate annular cylindrical posts on the upper face of the base
    for (i = [0 : 3]) {
        translate([posts_x[i], posts_y, base_height])
            annular_post(posts_r_outer[i], posts_r_inner[i], posts_height);
    }
}