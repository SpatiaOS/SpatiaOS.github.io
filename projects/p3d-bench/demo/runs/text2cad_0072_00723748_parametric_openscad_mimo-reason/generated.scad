// Parametric CAD Model - Base with Block, Collars, and Recesses
// All dimensions in inches

// ===== PARAMETERS =====
// Base plate dimensions
base_length = 0.703125;
base_width = 0.75;
base_height = 0.013125;
base_extrusion = 0.0131;

// Base hole parameters
hole_radius = 0.0328;
hole_from_left = 0.075;
hole_from_front = 0.6562;

// Main block dimensions
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;

// Block placement offsets from base edges
block_left_offset = 0.0563;
block_right_offset = -0.0001;
block_front_offset = 0.0844;
block_back_offset = 0.1594;

// Collar parameters
collar_outer_radius = 0.0656;
collar_inner_radius = 0.0328;
collar_height = 0.0375;
collar_left_offset = 0.2062;
collar_front_offset1 = 0.1968;
collar_front_offset2 = 0.4781;

// Recess parameters
recess_length = 0.473437;
recess_width = 0.39375;
recess_left_offset = 0.1734;
recess_right_offset = 0.0563;
recess_front_offset = 0.1406;
recess_back_offset = 0.2157;
recess_top_z = 0.6581;  // From base underside
recess_bottom_z = 0.6544;  // From base underside
recess_depth = 0.0037;  // recess_top_z - recess_bottom_z

// Resolution for smooth curves
$fn = 100;

// ===== MODULES =====
// Create base plate with through-hole
module base_plate() {
    difference() {
        // Main base plate
        cube([base_length, base_width, base_height]);
        
        // Circular through-hole
        translate([hole_from_left, hole_from_front, -0.001])
            cylinder(h = base_height + 0.002, r = hole_radius);
    }
}

// Create main rectangular block
module main_block() {
    // Calculate block position based on offsets
    block_x = block_left_offset;
    block_y = block_front_offset;
    block_z = base_height;
    
    translate([block_x, block_y, block_z])
        cube([block_length, block_width, block_height]);
}

// Create single annular collar
module collar(center_x, center_y) {
    translate([center_x, center_y, base_height + block_height]) {
        difference() {
            // Outer cylinder
            cylinder(h = collar_height, r = collar_outer_radius);
            // Inner cylinder (hole)
            translate([0, 0, -0.001])
                cylinder(h = collar_height + 0.002, r = collar_inner_radius);
        }
    }
}

// Create shallow rectangular recess
module recess() {
    // Calculate recess position
    recess_x = recess_left_offset;
    recess_y = recess_front_offset;
    recess_z = recess_bottom_z;  // Start at bottom of recess
    
    translate([recess_x, recess_y, recess_z])
        cube([recess_length, recess_width, recess_depth]);
}

// Create circular cut through collar and top band
module collar_cut(center_x, center_y) {
    // Total cut depth: through collar (0.0375) plus through top band (0.0037)
    total_cut_height = collar_height + recess_depth;
    cut_start_z = base_height + block_height + collar_height - total_cut_height;
    
    translate([center_x, center_y, cut_start_z])
        cylinder(h = total_cut_height + 0.001, r = collar_inner_radius);
}

// ===== MAIN ASSEMBLY =====
union() {
    // 1. Create base plate
    base_plate();
    
    // 2. Add main block on top of base
    main_block();
    
    // 3. Add two separate annular collars
    collar(collar_left_offset, collar_front_offset1);
    collar(collar_left_offset, collar_front_offset2);
    
    // 4. Subtract shallow rectangular recesses from block top
    difference() {
        children(0);  // Placeholder for existing geometry
        recess();
    }
    
    // 5. Subtract circular cuts through collars and top band
    difference() {
        children(0);  // Placeholder for existing geometry
        collar_cut(collar_left_offset, collar_front_offset1);
        collar_cut(collar_left_offset, collar_front_offset2);
    }
}