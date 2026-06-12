// Parameters
base_length = 0.75;
base_width = 0.375;
base_height = 0.0375;

wall_height = 0.0937;          // Reaches 0.1312 from base datum (0.1312 - 0.0375)
front_wall_thickness = 0.0281;
back_wall_thickness = 0.0375;

left_solid_length = 0.0319;
left_solid_width = 0.3094;     // Spans the channel (0.375 - 0.0281 - 0.0375)
left_solid_height = 0.05625;   // Reaches 0.0937 from base datum (0.0937 - 0.0375)

post_y = 0.1875;               // Centered across the width
post_x = [0.15, 0.30, 0.45, 0.60];
post_r_out = [0.0469, 0.0469, 0.0562, 0.0562];
post_r_in = [0.0188, 0.0197, 0.0216, 0.0234];
post_height = 0.0937;          // Spans from 0.0375 to 0.1312

$fn = 100;

// Reusable module for annular cylindrical posts
module annular_post(x, y, z, h, r_out, r_in) {
    translate([x, y, z]) {
        difference() {
            // Outer solid cylinder
            cylinder(h = h, r = r_out);
            // Inner through hole (extended slightly to ensure manifold geometry)
            translate([0, 0, -0.01])
                cylinder(h = h + 0.02, r = r_in);
        }
    }
}

// Main assembly
union() {
    // Rectangular base
    cube([base_length, base_width, base_height]);

    // Raised rectangular upper material (Front Wall)
    // Keeps the interior channel open
    translate([0, 0, base_height])
        cube([base_length, front_wall_thickness, wall_height]);

    // Raised rectangular upper material (Back Wall)
    translate([0, base_width - back_wall_thickness, base_height])
        cube([base_length, back_wall_thickness, wall_height]);

    // Narrower rectangular solid at the left end
    translate([0, front_wall_thickness, base_height])
        cube([left_solid_length, left_solid_width, left_solid_height]);

    // Four separate annular cylindrical posts
    for (i = [0 : 3]) {
        annular_post(
            x = post_x[i], 
            y = post_y, 
            z = base_height, 
            h = post_height, 
            r_out = post_r_out[i], 
            r_in = post_r_in[i]
        );
    }
}