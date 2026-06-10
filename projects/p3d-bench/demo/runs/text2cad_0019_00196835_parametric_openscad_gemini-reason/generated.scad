// Parametric CAD Model
// All dimensions are in millimeters (or the consistent base unit of the model)

$fn = 100; // High resolution for smooth circular cuts

// --- Parameters ---

// Z-axis Datums and Heights
z_base = 0.0;
z_lower_top = 0.0185; // Extrusion depth of lower solid body
z_upper_top = 0.0231; // Upper surface Z level
layer_top_thickness = 0.0046; // Extrusion depth of the top layer (0.0231 - 0.0185)

// Rail Dimensions
rail_length = 0.748506;
rail_width = 0.024642;

// End Block Dimensions & Position
block_size = 0.030803;
block_x = 0.7192; // Left edge from rail left end
block_y = -0.0361; // Front edge in front of rail front edge (Y=0)

// Rail Circular Recesses
rail_recess_radius = 0.0043;
rail_recess_y = 0.0108; // Offset from rail front edge
rail_recess_x1 = 0.0138;
rail_recess_x2 = 0.7346;
recess_z_min = 0.0062;
recess_z_max = z_lower_top;
recess_depth = recess_z_max - recess_z_min; // 0.0123

// End Block Circular Recess
block_recess_x = 0.7361;
block_recess_y = -0.0192; // In front of rail front edge

// End Block Cutout
cutout_size = 0.027722;
cutout_z_min = -0.0585; // 0.0585 below the base underside
cutout_z_max = z_lower_top; // 0.0185 above the base underside

// --- Main Model ---

union() {
    // 1. Shallow Top Layers (Z = 0.0185 to 0.0231)
    // Added outside the difference block to preserve them from the cuts in the lower body
    
    // Rail top layer
    translate([0, 0, z_lower_top])
        cube([rail_length, rail_width, layer_top_thickness]);
        
    // End block top layer
    translate([block_x, block_y, z_lower_top])
        cube([block_size, block_size, layer_top_thickness]);

    // 2. Lower Bodies with Subtractive Features (Z = 0 to 0.0185)
    difference() {
        // Base solid bodies
        union() {
            // Main rail lower body
            cube([rail_length, rail_width, z_lower_top]);
            
            // End block lower body
            translate([block_x, block_y, z_base])
                cube([block_size, block_size, z_lower_top]);
        }
        
        // Subtractive Features (Cuts)
        
        // A. Rail Circular Recesses
        // Extended slightly in +Z to cleanly cut the top surface of the lower body
        translate([rail_recess_x1, rail_recess_y, recess_z_min])
            cylinder(h=recess_depth + 0.001, r=rail_recess_radius);
            
        translate([rail_recess_x2, rail_recess_y, recess_z_min])
            cylinder(h=recess_depth + 0.001, r=rail_recess_radius);
            
        // B. End Block Circular Recess
        translate([block_recess_x, block_recess_y, recess_z_min])
            cylinder(h=recess_depth + 0.001, r=rail_recess_radius);
            
        // C. End Block Deep Cutout
        // Shares the left (X) and front (Y) edges of the end block.
        // Extends slightly in -X, -Y, and +Z to avoid coincident faces during boolean difference.
        translate([block_x - 0.001, block_y - 0.001, cutout_z_min])
            cube([cutout_size + 0.001, cutout_size + 0.001, cutout_z_max - cutout_z_min + 0.001]);
    }
}