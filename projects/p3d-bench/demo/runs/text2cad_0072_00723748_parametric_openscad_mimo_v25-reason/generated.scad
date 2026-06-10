// Parameters - Base Plate
base_length = 0.703125;
base_width = 0.75;
base_height = 0.013125;

// Parameters - Through-opening in base
hole_x = 0.075;
hole_y = 0.6562;
hole_radius = 0.0328;

// Parameters - Main Rectangular Block
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;
block_left_offset = 0.0563;
block_front_offset = 0.0844;

// Parameters - Annular Collars
collar_outer_r = 0.0656;
collar_inner_r = 0.0328;
collar_height = 0.0375;
collar_left_offset = 0.2062;
collar_front_offset_1 = 0.1968;
collar_front_offset_2 = 0.4781;

// Parameters - Shallow Rectangular Recesses
recess_length = 0.473437;
recess_width = 0.39375;
recess_left_offset = 0.1734;
recess_front_offset = 0.1406;
recess_depth = 0.0037;

// Derived positions
block_x = block_left_offset;
block_y = block_front_offset;
block_top_z = base_height + block_height;

// Resolution
$fn = 100;

// Main Assembly
difference() {
    union() {
        // Step 1: Base plate
        cube([base_length, base_width, base_height]);

        // Step 2: Main rectangular block on top of base
        translate([block_x, block_y, base_height])
            cube([block_length, block_width, block_height]);

        // Step 3: Two annular collars on block top
        // Collar 1
        translate([collar_left_offset, collar_front_offset_1, block_top_z])
            difference() {
                cylinder(h=collar_height, r=collar_outer_r);
                cylinder(h=collar_height, r=collar_inner_r);
            }
        // Collar 2
        translate([collar_left_offset, collar_front_offset_2, block_top_z])
            difference() {
                cylinder(h=collar_height, r=collar_outer_r);
                cylinder(h=collar_height, r=collar_inner_r);
            }
    }

    // Step 4: Circular through-opening in base plate
    translate([hole_x, hole_y, 0])
        cylinder(h=base_height, r=hole_radius);

    // Step 5: Shallow rectangular recesses in block top
    // Cuts from block_top_z - recess_depth to block_top_z
    translate([recess_left_offset, recess_front_offset, block_top_z - recess_depth])
        cube([recess_length, recess_width, recess_depth]);

    // Step 6: Circular cuts through collar centers
    // Extends through collar height plus recess depth into top band
    translate([collar_left_offset, collar_front_offset_1, block_top_z - recess_depth])
        cylinder(h=recess_depth + collar_height, r=hole_radius);
    translate([collar_left_offset, collar_front_offset_2, block_top_z - recess_depth])
        cylinder(h=recess_depth + collar_height, r=hole_radius);
}