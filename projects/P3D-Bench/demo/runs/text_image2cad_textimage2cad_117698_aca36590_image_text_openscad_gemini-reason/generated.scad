// ==========================================
// Parametric Warship Figurine
// ==========================================

// --- Parameters ---

// Hull dimensions
hull_length = 100.0;
hull_width = 20.0;
hull_depth = 8.0;

// Superstructure dimensions
base_tier_length = 34.0;
base_tier_width = 14.0;
base_tier_height = 3.0;

mid_tier_length = 24.0;
mid_tier_width = 10.0;
mid_tier_height = 3.0;
mid_tier_chamfer = 2.0;

top_tier_length = 6.0;
top_tier_width = 6.0;
top_tier_height = 3.0;

aft_block_length = 9.0;
aft_block_width = 8.0;
aft_block_height = 2.0;

// Chimney (Spacer) dimensions
chimney_radius = 2.5;
chimney_height = 9.7;
chimney_tilt_angle = 10.0; // Degrees tilted aft

// Turret & Gun dimensions
turret_radius = 5.0;
turret_height = 3.5;
gun_radius = 0.5;
gun_length = 10.0;
gun_spacing = 1.5;

// Positions
deck_z = hull_depth;
turret1_x = 30.0;   // Forward turret
turret2_x = 16.0;   // Mid-forward turret
turret3_x = -32.0;  // Aft turret

// Resolution
$fn = 100;
eps = 0.01; // Small overlap to ensure manifold geometry

// --- Helper Modules ---

// A cube that sits on the XY plane (Z=0)
module bottom_anchored_cube(size) {
    translate([0, 0, size[2]/2]) 
        cube(size, center=true);
}

// A rectangular box with chamfered front (+X) corners
module chamfered_front_box(l, w, h, c) {
    linear_extrude(h)
    polygon([
        [-l/2, -w/2],           // Bottom-left
        [l/2-c, -w/2],          // Bottom-right start chamfer
        [l/2, -w/2+c],          // Bottom-right end chamfer
        [l/2, w/2-c],           // Top-right start chamfer
        [l/2-c, w/2],           // Top-right end chamfer
        [-l/2, w/2]             // Top-left
    ]);
}

// --- Main Component Modules ---

// The main hull body with a flat deck and curved B-spline-like lower contour
module ship_hull() {
    translate([0, 0, hull_depth])
    difference() {
        // Scaled sphere creates the elliptical deck and curved bottom
        scale([hull_length/2, hull_width/2, hull_depth]) 
            sphere(1);
        // Cut away the top half to create the flat deck
        translate([0, 0, hull_depth]) 
            cube([hull_length + 1, hull_width + 1, hull_depth * 2], center=true);
    }
}

// The stepped central superstructure
module superstructure() {
    // Base tier
    translate([-7, 0, deck_z - eps])
        bottom_anchored_cube([base_tier_length, base_tier_width, base_tier_height + eps]);

    // Middle tier (chamfered front facing +X)
    translate([-4, 0, deck_z + base_tier_height - eps])
        chamfered_front_box(mid_tier_length, mid_tier_width, mid_tier_height + eps, mid_tier_chamfer);

    // Top tier (small bridge/conning tower)
    translate([3, 0, deck_z + base_tier_height + mid_tier_height - eps])
        bottom_anchored_cube([top_tier_length, top_tier_width, top_tier_height + eps]);

    // Aft block (steps down behind the middle tier)
    translate([-19.5, 0, deck_z + base_tier_height - eps])
        bottom_anchored_cube([aft_block_length, aft_block_width, aft_block_height + eps]);

    // Chimney / Spacer part (sheared cylinder leaning aft)
    translate([-8, 0, deck_z + base_tier_height + mid_tier_height - eps])
        multmatrix([
            [1, 0, -tan(chimney_tilt_angle), 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
        cylinder(h=chimney_height + eps, r=chimney_radius);
}

// A single turret with triple gun barrels
module turret(x_pos, pointing_forward=true) {
    // Turret boss
    translate([x_pos, 0, deck_z - eps])
        cylinder(h=turret_height + eps, r=turret_radius);

    // Triple gun barrels (pins)
    gun_z = deck_z + turret_height / 2;
    rot_y = pointing_forward ? 90 : -90;
    
    for (y = [-gun_spacing, 0, gun_spacing]) {
        translate([x_pos, y, gun_z])
        rotate([0, rot_y, 0])
        // Cylinder length includes turret radius to ensure it embeds fully to the center
        cylinder(h=turret_radius + gun_length, r=gun_radius);
    }
}

// --- Assembly ---

color("lightgray") {
    union() {
        ship_hull();
        superstructure();
        
        // Forward turrets
        turret(turret1_x, pointing_forward=true);
        turret(turret2_x, pointing_forward=true);
        
        // Aft turret
        turret(turret3_x, pointing_forward=false);
    }
}