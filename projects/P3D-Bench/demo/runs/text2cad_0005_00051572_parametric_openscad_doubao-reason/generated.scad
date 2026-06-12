// Global resolution setting for smooth curved surfaces
$fn = 60;

// --------------------------
// Base Parameters
// --------------------------
base_length = 0.75;       // X axis length
base_width = 0.375;       // Y axis width
base_height = 0.0375;     // Z axis height (datum at Z=0)

// --------------------------
// Raised Perimeter Wall Parameters
// --------------------------
raised_max_z = 0.1312;    // Total height from base datum
raised_height = raised_max_z - base_height; // Extrusion depth 0.0937
raised_wall_left = 0.0319;
raised_wall_right = 0.0319;
raised_wall_front = 0.0281;
raised_wall_back = 0.0375;

// --------------------------
// Left End Lower Block Parameters
// --------------------------
left_block_height = 0.0562; // Extrusion depth 0.0562
left_block_max_z = base_height + left_block_height; // 0.0937 from datum

// --------------------------
// Annular Post Parameters
// --------------------------
post_y_center = base_width / 2; // Centered across width, front offset 0.1875
post_x_positions = [0.15, 0.3, 0.45, 0.6];
post_outer_radii = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_radii = [0.0188, 0.0197, 0.0216, 0.0234];
post_height = raised_height; // 0.0937 extrusion depth

// --------------------------
// Reusable Module: Annular Cylindrical Post
// --------------------------
module annular_post(x_pos, y_pos, z_pos, r_outer, r_inner, height) {
    difference() {
        // Outer solid cylinder
        translate([x_pos, y_pos, z_pos])
            cylinder(h=height, r=r_outer, center=false);
        // Inner through hole (extended slightly to ensure full cut)
        translate([x_pos, y_pos, z_pos - 0.001])
            cylinder(h=height + 0.002, r=r_inner, center=false);
    }
}

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // 1. Main base plate
    translate([0, 0, 0])
        cube([base_length, base_width, base_height], center=false);

    // 2. Raised perimeter walls (open interior channel)
    // Front wall
    translate([0, 0, base_height])
        cube([base_length, raised_wall_front, raised_height], center=false);
    // Back wall
    translate([0, base_width - raised_wall_back, base_height])
        cube([base_length, raised_wall_back, raised_height], center=false);
    // Right wall
    translate([base_length - raised_wall_right, raised_wall_front, base_height])
        cube([
            raised_wall_right,
            base_width - raised_wall_front - raised_wall_back,
            raised_height
        ], center=false);

    // 3. Lower left end block
    translate([0, raised_wall_front, base_height])
        cube([
            raised_wall_left,
            base_width - raised_wall_front - raised_wall_back,
            left_block_height
        ], center=false);

    // 4. Four annular posts
    for (i = [0:len(post_x_positions)-1]) {
        annular_post(
            post_x_positions[i],
            post_y_center,
            base_height,
            post_outer_radii[i],
            post_inner_radii[i],
            post_height
        );
    }
}