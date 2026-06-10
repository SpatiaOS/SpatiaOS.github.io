// === Parameters ===

// Base plate
base_length  = 0.703125;
base_width   = 0.75;
base_height  = 0.013125;

// Through-hole in base plate
hole_x_from_left  = 0.075;
hole_y_from_front = 0.6562;
hole_radius       = 0.0328;

// Main rectangular block (sits on top of base)
block_length    = 0.646875;
block_width     = 0.50625;
block_height    = 0.645;
block_x_offset  = 0.0563;   // left offset from base left edge
block_y_offset  = 0.0844;   // front offset from base front edge

// Annular collars on block top
collar_outer_r  = 0.0656;
collar_inner_r  = 0.0328;
collar_height   = 0.0375;
collar_dx       = 0.2062;   // X offset from block left edge
collar_dy1      = 0.1968;   // Y offset from block front edge (collar 1)
collar_dy2      = 0.4781;   // Y offset from block front edge (collar 2)

// Shallow rectangular recesses on block top (positions from base origin)
recess_length   = 0.473437;
recess_width    = 0.39375;
recess_x        = 0.1734;   // from base left edge
recess_y        = 0.1406;   // from base front edge
recess_depth    = 0.0037;   // shallow blind cut

// Circular openings at collar centers
collar_hole_r   = 0.0328;
collar_hole_dx  = 0.2062;   // X from block left edge
collar_hole_dy1 = 0.1969;   // Y from block front edge (hole 1)
collar_hole_dy2 = 0.4781;   // Y from block front edge (hole 2)

// Resolution
$fn = 100;

// === Derived values ===
block_z_base  = base_height;                    // bottom of block
block_z_top   = base_height + block_height;     // top of block (~0.658125)
collar_z_base = block_z_top;                    // collars sit on block top

// Collar center positions (absolute)
collar1_x = block_x_offset + collar_dx;
collar1_y = block_y_offset + collar_dy1;
collar2_x = block_x_offset + collar_dx;
collar2_y = block_y_offset + collar_dy2;

// Collar hole positions (absolute)
chole1_x = block_x_offset + collar_hole_dx;
chole1_y = block_y_offset + collar_hole_dy1;
chole2_x = block_x_offset + collar_hole_dx;
chole2_y = block_y_offset + collar_hole_dy2;

// Circular cut depth: through collar + shallow top band
circ_cut_depth = collar_height + recess_depth;

// Small epsilon for clean boolean cuts
eps = 0.001;

// === Assembly ===
difference() {
    union() {
        // Step 1: Base plate
        cube([base_length, base_width, base_height]);

        // Step 2: Main rectangular block on top of base
        translate([block_x_offset, block_y_offset, block_z_base])
            cube([block_length, block_width, block_height]);

        // Step 3: Annular collar 1
        translate([collar1_x, collar1_y, collar_z_base])
            cylinder(h = collar_height, r = collar_outer_r);

        // Step 4: Annular collar 2
        translate([collar2_x, collar2_y, collar_z_base])
            cylinder(h = collar_height, r = collar_outer_r);
    }

    // Step 5: Circular through-hole in base plate
    translate([hole_x_from_left, hole_y_from_front, -eps])
        cylinder(h = base_height + 2 * eps, r = hole_radius);

    // Step 6: Two shallow rectangular recesses into block top face
    translate([recess_x, recess_y, block_z_top - recess_depth])
        cube([recess_length, recess_width, recess_depth + eps]);

    // Step 7: Circular opening through collar 1 and shallow top band
    translate([chole1_x, chole1_y, block_z_top - recess_depth])
        cylinder(h = circ_cut_depth + eps, r = collar_hole_r);

    // Step 8: Circular opening through collar 2 and shallow top band
    translate([chole2_x, chole2_y, block_z_top - recess_depth])
        cylinder(h = circ_cut_depth + eps, r = collar_hole_r);
}