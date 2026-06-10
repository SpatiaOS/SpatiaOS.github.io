// === Base plate parameters ===
base_length = 0.703125;
base_width = 0.75;
base_height = 0.013125;

// Through hole in base
hole_x = 0.075;
hole_y = 0.6562;
hole_radius = 0.0328;

// === Main block parameters ===
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;
block_left = 0.0563;
block_front = 0.0844;

// === Collar parameters ===
collar_outer_r = 0.0656;
collar_inner_r = 0.0328;
collar_height = 0.0375;
collar_x = 0.2062;
collar_y1 = 0.1968;
collar_y2 = 0.4781;

// === Rectangular recess parameters ===
recess_length = 0.473437;
recess_width = 0.39375;
recess_left = 0.1734;
recess_front = 0.1406;
recess_top_z = 0.6581;
recess_bottom_z = 0.6544;

// === Circular cut parameters at collar centers ===
cut_radius = 0.0328;

// Resolution and tolerance
$fn = 100;
eps = 0.0001;

// === Computed values ===
block_top_z = base_height + block_height;
collar_top_z = block_top_z + collar_height;
recess_depth = recess_top_z - recess_bottom_z;
cut_total_height = collar_top_z - recess_bottom_z;

// === Build model ===
difference() {
    union() {
        // Base plate
        cube([base_length, base_width, base_height]);

        // Main rectangular block on top of base
        translate([block_left, block_front, base_height])
            cube([block_length, block_width, block_height]);

        // Annular collar 1 (outer cylinder; inner hole cut below)
        translate([collar_x, collar_y1, block_top_z])
            cylinder(h=collar_height, r=collar_outer_r);

        // Annular collar 2 (outer cylinder; inner hole cut below)
        translate([collar_x, collar_y2, block_top_z])
            cylinder(h=collar_height, r=collar_outer_r);
    }

    // Through hole in base plate
    translate([hole_x, hole_y, -eps])
        cylinder(h=base_height + 2*eps, r=hole_radius);

    // Shallow rectangular recesses in block top face
    translate([recess_left, recess_front, recess_bottom_z])
        cube([recess_length, recess_width, recess_depth + eps]);

    // Circular cut at collar 1 center — through collar and top band only
    translate([collar_x, collar_y1, recess_bottom_z])
        cylinder(h=cut_total_height + eps, r=cut_radius);

    // Circular cut at collar 2 center — through collar and top band only
    translate([collar_x, collar_y2, recess_bottom_z])
        cylinder(h=cut_total_height + eps, r=cut_radius);
}