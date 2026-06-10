// Parameters for Base Plate
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

// Parameters for Base Holes
base_hole_radius = 0.0163;
hole1_pos = [0.0272, 0.1848];
hole2_pos = [0.0272, 0.4565];
hole3_pos = [0.5761, 0.0272];
hole4_pos = [0.5870, 0.5163];

// Parameters for Raised Rail Group (Rib Outlines)
rail_span_x = 0.5109;
rail_span_y = 0.5217;
rail_offset_x = 0.0435;
rail_offset_y = 0.0109;
rail_height = 0.0978;
rail_wall_thickness = 0.015; // Wall thickness to create the rib outline effect

// Parameters for Shallow Rectangular Tab
tab_span_x = 0.0435;
tab_span_y = 0.0761;
tab_offset_x = 0.7065;
tab_offset_y = 0.0978;
tab_height = 0.0163;

// Parameters for Deeper Side Block
block_span_x = 0.1413;
block_span_y = 0.0870;
block_offset_x = 0.5978;
block_offset_y = 0.4130;
block_height = 0.1413;

// Parameters for Deeper Side Block Hole
block_hole_radius = 0.0326;
block_hole_x = 0.7391;
block_hole_y = 0.4548;

// Global Resolution
$fn = 100;

// Main Assembly
union() {
    
    // 1. Base Plate with 4 Through Holes
    difference() {
        // Main solid base
        cube([base_length, base_width, base_height]);
        
        // Subtract four circular openings
        translate([hole1_pos[0], hole1_pos[1], -0.1])
            cylinder(h = base_height + 0.2, r = base_hole_radius);
            
        translate([hole2_pos[0], hole2_pos[1], -0.1])
            cylinder(h = base_height + 0.2, r = base_hole_radius);
            
        translate([hole3_pos[0], hole3_pos[1], -0.1])
            cylinder(h = base_height + 0.2, r = base_hole_radius);
            
        translate([hole4_pos[0], hole4_pos[1], -0.1])
            cylinder(h = base_height + 0.2, r = base_hole_radius);
    }

    // 2. Main Raised Rail Group
    // Sits on top of the base plate
    translate([rail_offset_x, rail_offset_y, base_height]) {
        difference() {
            // Outer bounding box for the rails
            cube([rail_span_x, rail_span_y, rail_height]);
            
            // Hollow inner region to leave only rectangular rib outlines
            translate([rail_wall_thickness, rail_wall_thickness, -0.1])
                cube([
                    rail_span_x - 2 * rail_wall_thickness, 
                    rail_span_y - 2 * rail_wall_thickness, 
                    rail_height + 0.2
                ]);
        }
    }

    // 3. Shallow Rectangular Solid Tab
    // Sits on top of the base plate
    translate([tab_offset_x, tab_offset_y, base_height]) {
        cube([tab_span_x, tab_span_y, tab_height]);
    }

    // 4. Deeper Side Solid Block with Through Hole
    difference() {
        // Solid block body starting from the reference plane (z=0)
        translate([block_offset_x, block_offset_y, 0])
            cube([block_span_x, block_span_y, block_height]);
        
        // Circular through opening in the deeper block
        translate([block_hole_x, block_hole_y, -0.1])
            cylinder(h = block_height + 0.2, r = block_hole_radius);
    }
}