// Parameters for smooth rendering
$fn = 100;
eps = 0.001; // Small overlap to maintain manifold geometry during boolean operations

// --- Base Plate Parameters ---
base_length = 0.703125;
base_width = 0.75;
base_height = 0.013125;

// --- Base Hole Parameters ---
base_hole_offset_x = 0.075;
base_hole_offset_y = 0.6562;
base_hole_radius = 0.0328;

// --- Main Block Parameters ---
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;
block_offset_x = 0.0563;
block_offset_y = 0.0844;

// --- Annular Collars Parameters ---
collar_outer_radius = 0.0656;
collar_inner_radius = 0.0328;
collar_height = 0.0375;
collar_offset_x = 0.2062;
collar_offset_y1 = 0.1968;
collar_offset_y2 = 0.4781;

// --- Rectangular Recess Parameters ---
recess_length = 0.473437;
recess_width = 0.39375;
recess_offset_x = 0.1734;
recess_offset_y = 0.1406;
recess_bottom_z = 0.6544;
recess_top_z = 0.6581; // Matches base_height + block_height (0.013125 + 0.645 = 0.658125 approx 0.6581)

// --- Collar Hole Offsets ---
collar_hole_offset_y1 = 0.1969;
collar_hole_offset_y2 = 0.4781;

// --- Calculated Z Levels ---
base_top_z = base_height;
block_top_z = base_top_z + block_height;
collar_top_z = block_top_z + collar_height;
recess_depth = block_top_z - recess_bottom_z;

// --- Main Assembly ---
difference() {
    // 1. Union of all solid bodies
    union() {
        // Base plate
        cube([base_length, base_width, base_height]);

        // Main rectangular block on top of base
        translate([block_offset_x, block_offset_y, base_top_z])
            cube([block_length, block_width, block_height]);

        // Annular collars on top of the main block
        translate([collar_offset_x, collar_offset_y1, block_top_z])
            cylinder(h=collar_height, r=collar_outer_radius);
            
        translate([collar_offset_x, collar_offset_y2, block_top_z])
            cylinder(h=collar_height, r=collar_outer_radius);
    }

    // 2. Subtractions (Holes and Recesses)
    
    // Base through-opening
    translate([base_hole_offset_x, base_hole_offset_y, -eps])
        cylinder(h=base_height + 2*eps, r=base_hole_radius);

    // Shallow rectangular recesses at the top of the block
    translate([recess_offset_x, recess_offset_y, recess_bottom_z])
        cube([recess_length, recess_width, recess_depth + eps]);

    // Collar center openings (passing through collar and shallow top band)
    translate([collar_offset_x, collar_hole_offset_y1, recess_bottom_z])
        cylinder(h=(collar_top_z - recess_bottom_z) + eps, r=collar_inner_radius);

    translate([collar_offset_x, collar_hole_offset_y2, recess_bottom_z])
        cylinder(h=(collar_top_z - recess_bottom_z) + eps, r=collar_inner_radius);
}