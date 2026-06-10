// Resolution for curved surfaces
$fn = 100;
// Small value to ensure clean boolean cuts (manifold geometry)
eps = 0.001;

// --- Parameters ---

// Base plate dimensions
base_length = 0.75;
base_width = 0.625;
base_thickness = 0.00625;

// Upright wall dimensions
wall_thickness = 0.0063;
wall_height = 0.1938;

// Cut 1: Lower rectangular opening in wall
cut1_y_span = 0.081103;
cut1_z_span = 0.111891;
cut1_y_offset = 0.4447;
cut1_z_offset = 0;

// Cut 2: Circular through-hole in wall
cut2_radius = 0.0432;
cut2_y_offset = 0.2948;
// Height band 0.0631 to 0.1495 means the center is at 0.0631 + radius
cut2_z_center = 0.0631 + cut2_radius; 
cut2_reach = 0.0625;

// Cut 3: Smaller rectangular opening in wall
cut3_y_span = 0.043521;
cut3_z_span = 0.044108;
cut3_y_offset = 0.091;
cut3_z_offset = 0.0992;
cut3_reach = 0.0625;

// Cut 4: Rectangular through opening in base
cut4_x_span = 0.264669;
cut4_y_span = 0.40625;
cut4_x_offset = 0.3125;
cut4_y_offset = 0.2073;
cut4_z_min = -0.0562;
cut4_z_max = 0.0063;

// --- Main Model ---

difference() {
    // 1. Solid Bodies (Base and Wall)
    union() {
        // Main rectangular base
        cube([base_length, base_width, base_thickness]);
        
        // Upright wall along the left edge (X=0)
        cube([wall_thickness, base_width, wall_height]);
    }

    // 2. Subtractive Features (Cuts and Holes)
    
    // Cut 1: Lower rectangular opening through the wall thickness
    translate([-eps, cut1_y_offset, cut1_z_offset - eps])
        cube([wall_thickness + 2*eps, cut1_y_span, cut1_z_span + eps]);

    // Cut 2: Circular through-hole in the wall
    translate([0, cut2_y_offset, cut2_z_center])
        rotate([0, 90, 0])
        cylinder(h=cut2_reach, r=cut2_radius, center=true);

    // Cut 3: Smaller rectangular through opening in the wall
    translate([-cut3_reach/2, cut3_y_offset, cut3_z_offset])
        cube([cut3_reach, cut3_y_span, cut3_z_span]);

    // Cut 4: Rectangular through opening in the horizontal base
    translate([cut4_x_offset, cut4_y_offset, cut4_z_min])
        cube([cut4_x_span, cut4_y_span, cut4_z_max - cut4_z_min + eps]);
}