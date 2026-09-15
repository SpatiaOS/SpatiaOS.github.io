// Parametric model of rectangular base channel with posts
// All dimensions in consistent units (drafted inch values)

// ----------------------
// Parameter Definitions
// ----------------------
// Base geometry
base_length = 0.75;       // X-axis: total left-right length
base_width = 0.375;       // Y-axis: total front-back width
base_height = 0.0375;     // Z-axis: base thickness, datum at Z=0 (base bottom)

// Render settings
$fn = 64;                 // Smoothness for cylindrical features
eps = 0.001;              // Small clearance for clean boolean operations (avoids coplanar faces)

// Full-height raised wall parameters (Z: top of base to 0.1312 datum)
wall_extrude = 0.0937;    // Extrusion depth for full-height walls and posts
wall_top_z = base_height + wall_extrude; // Top elevation: 0.1312 per spec
front_wall_t = 0.0281;    // Front wall thickness (Y-axis), matches block front offset
back_wall_t = 0.0375;     // Back wall thickness (Y-axis), matches block back offset
side_wall_t = 0.0319;     // Side wall thickness (X-axis), matches block length
right_wall_x = base_length - side_wall_t; // Inner X of right wall: 0.7181 per spec
back_wall_y = base_width - back_wall_t;   // Inner Y of back wall: 0.3375 per spec

// Left end partial-height block parameters (Z: top of base to 0.0937 datum)
block_x_len = 0.0319;     // X-axis footprint length
block_y_len = 0.3094;     // Y-axis footprint width
block_x_pos = 0;          // Left edge flush with base left edge
block_y_pos = front_wall_t; // Front face aligned with front wall inner face (0.0281 offset)
block_extrude = 0.0562;   // Extrusion depth per spec

// Annular post parameters
post_y_center = base_width / 2; // Posts centered on width (Y=0.1875 per spec)
post_x_pos = [0.15, 0.3, 0.45, 0.6]; // X-axis positions from left edge
post_outer_r = [0.0469, 0.0469, 0.0562, 0.0562]; // Post outer radii
post_inner_r = [0.0188, 0.0197, 0.0216, 0.0234];  // Post central hole radii
post_extrude = wall_extrude; // Posts match full wall height

// ----------------------
// Reusable Modules
// ----------------------
// Hollow annular cylindrical post with through hole
module annular_post(x, y, r_out, r_in, h, z_base) {
    translate([x, y, z_base]) {
        difference() {
            cylinder(h=h, r=r_out, center=false);
            // Through hole with slight overhang to avoid coplanar faces
            translate([0, 0, -eps])
                cylinder(h=h + 2*eps, r=r_in, center=false);
        }
    }
}

// ----------------------
// Main Model Assembly
// ----------------------
union() {
    // Solid base
    cube([base_length, base_width, base_height], center=false);

    // Full-height raised perimeter walls (open channel interior, no fill pad)
    // Front wall (full length, flush to front edge)
    translate([0, 0, base_height])
        cube([base_length, front_wall_t, wall_extrude], center=false);
    // Back wall (full length, flush to back edge)
    translate([0, back_wall_y, base_height])
        cube([base_length, back_wall_t, wall_extrude], center=false);
    // Right wall (spans between front/back walls, flush to right edge)
    translate([right_wall_x, front_wall_t, base_height])
        cube([side_wall_t, block_y_len, wall_extrude], center=false);

    // Partial-height narrow block at left end
    translate([block_x_pos, block_y_pos, base_height])
        cube([block_x_len, block_y_len, block_extrude], center=false);

    // Four separate annular posts (no connecting plate between them)
    for (i = [0:len(post_x_pos)-1]) {
        annular_post(
            x = post_x_pos[i],
            y = post_y_center,
            r_out = post_outer_r[i],
            r_in = post_inner_r[i],
            h = post_extrude,
            z_base = base_height
        );
    }
}