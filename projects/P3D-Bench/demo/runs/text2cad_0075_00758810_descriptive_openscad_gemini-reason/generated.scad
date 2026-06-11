// Parameters
$fn = 100; // Geometry resolution

// Base dimensions
base_length_centers = 80; // Distance between centers of the curved ends
base_width = 40;          // Width of the base (and diameter of curved ends)
base_thickness = 15;      // Thickness of the main base body

// Collar dimensions
collar_outer_diameter = 26;
collar_height = 10;

// Stepped bore dimensions
upper_bore_diameter = 18;
upper_bore_depth = 16;    // Depth of the upper bore (goes through collar and into base)
lower_bore_diameter = 10; // Diameter of the lower through-hole

// Side recess dimensions
side_recess_diameter = 10;
side_recess_depth = 4;

// Underside pattern dimensions
bottom_cut_diameter = 8;
bottom_cut_depth = 3;
bottom_pattern_x_spacing = 25; // X offset from center
bottom_pattern_y_spacing = 10; // Y offset from center

// Reusable module for the stadium-shaped base
module stadium_base(length, width, thickness) {
    hull() {
        translate([length / 2, 0, 0]) 
            cylinder(h = thickness, d = width);
        translate([-length / 2, 0, 0]) 
            cylinder(h = thickness, d = width);
    }
}

// Main part construction
difference() {
    // 1. Additive features (Main solid body)
    union() {
        // Thick rounded base with curved ends
        stadium_base(base_length_centers, base_width, base_thickness);
        
        // Raised annular cylindrical collar on the upper face
        translate([0, 0, base_thickness])
            cylinder(h = collar_height, d = collar_outer_diameter);
    }

    // 2. Subtractive features (Cuts and bores)
    
    // Upper stepped bore (continues from collar into the base)
    // Starts at the top of the collar and cuts downwards
    translate([0, 0, base_thickness + collar_height - upper_bore_depth])
        cylinder(h = upper_bore_depth + 0.1, d = upper_bore_diameter);

    // Lower stepped bore (continues through the rest of the base)
    // Cut slightly below Z=0 to ensure manifold geometry
    translate([0, 0, -0.1])
        cylinder(h = base_thickness + collar_height + 0.2, d = lower_bore_diameter);

    // Small shallow side recesses on the curved ends
    // Right side recess
    translate([base_length_centers / 2 + base_width / 2 - side_recess_depth, 0, base_thickness / 2])
        rotate([0, 90, 0])
        cylinder(h = side_recess_depth + 0.1, d = side_recess_diameter, center = false);
        
    // Left side recess
    translate([-base_length_centers / 2 - base_width / 2 - 0.1, 0, base_thickness / 2])
        rotate([0, 90, 0])
        cylinder(h = side_recess_depth + 0.1, d = side_recess_diameter, center = false);

    // Separate shallow underside pattern of circular cuts
    // Creates a 4-hole rectangular pattern on the bottom face
    for (x = [-bottom_pattern_x_spacing, bottom_pattern_x_spacing]) {
        for (y = [-bottom_pattern_y_spacing, bottom_pattern_y_spacing]) {
            translate([x, y, -0.1])
                cylinder(h = bottom_cut_depth + 0.1, d = bottom_cut_diameter);
        }
    }
}