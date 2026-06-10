// Parametric Computer Cooling Fan
// Based on visual analysis of the provided image
// Features: Square frame, circular shroud, 7 twisted blades, corner mounting pillars

// ==========================================
// Parameters
// ==========================================

// Global Resolution
$fn = 40; // Higher for smoother curves, lower for faster rendering

// Dimensions (mm)
fan_outer_size = 80;          // Overall width/height of the square frame
mounting_hole_spacing = 71.5; // Standard spacing for 80mm fans
mounting_hole_dia = 4.5;      // Diameter for M4 screws
frame_thickness = 3.5;        // Thickness of the top and bottom frames
total_depth = 25;             // Total height of the fan
corner_radius = 5;            // Rounding of the square frame corners

// Hub and Motor
hub_diameter = 42;
hub_height = 20;
hub_top_diameter = 38;        // Slight taper on top of hub

// Blades
blade_count = 7;
blade_root_radius = 22;       // Radius where blade starts (hub surface)
blade_tip_radius = 36;        // Radius where blade ends (shroud inner)
blade_twist_angle = 35;       // Total twist of the blade from root to tip
blade_thickness_root = 4;     // Thickness at the hub
blade_thickness_tip = 2;      // Thickness at the tip

// ==========================================
// Main Assembly
// ==========================================

fan_assembly();

module fan_assembly() {
    // 1. Bottom Frame (Base)
    // Acts as the mounting base and air intake support
    translate([0, 0, 0])
    difference() {
        // Solid base plate with rounded corners
        rounded_square_plate(fan_outer_size, frame_thickness, corner_radius);
        
        // Large central hole for air intake
        translate([0, 0, -1])
        cylinder(h = frame_thickness + 2, d = fan_outer_size - 15);
        
        // Mounting holes
        mounting_holes();
    }

    // 2. Corner Pillars (Standoffs)
    // Connects bottom frame to top frame, provides structural integrity
    corner_pillars();

    // 3. Central Hub and Blades
    // The rotating part (modeled as static here)
    translate([0, 0, frame_thickness]) // Sit on top of bottom frame
    fan_rotor();

    // 4. Top Frame (Guard/Shroud)
    // Protects the blades and directs airflow
    translate([0, 0, total_depth - frame_thickness])
    difference() {
        // Top plate with rounded corners
        rounded_square_plate(fan_outer_size, frame_thickness, corner_radius);
        
        // Circular cutout for the blades (Shroud)
        // The image shows a circular opening inside the square frame
        translate([0, 0, -1])
        cylinder(h = frame_thickness + 2, d = blade_tip_radius * 2 + 4);
        
        // Mounting holes (aligned with bottom)
        mounting_holes();
    }
}

// ==========================================
// Component Modules
// ==========================================

// Creates a square plate with rounded corners
module rounded_square_plate(size, height, r) {
    hull() {
        offset = size / 2 - r;
        for (x = [-1, 1], y = [-1, 1]) {
            translate([x * offset, y * offset, 0])
            cylinder(h = height, r = r);
        }
    }
}

// Creates the 4 mounting holes at the corners
module mounting_holes() {
    offset = mounting_hole_spacing / 2;
    for (x = [-1, 1], y = [-1, 1]) {
        translate([x * offset, y * offset, 0])
        cylinder(h = 100, d = mounting_hole_dia, center = true);
    }
}

// Creates the 4 vertical pillars at the mounting hole locations
module corner_pillars() {
    offset = mounting_hole_spacing / 2;
    pillar_outer_dia = 8;
    // Pillar height is the distance between top and bottom frames
    pillar_height = total_depth - 2 * frame_thickness;
    
    for (x = [-1, 1], y = [-1, 1]) {
        translate([x * offset, y * offset, frame_thickness])
        difference() {
            // Outer pillar
            cylinder(h = pillar_height, d = pillar_outer_dia);
            // Inner hole (optional, for weight reduction or wire routing)
            // translate([0, 0, -1]) cylinder(h = pillar_height + 2, d = mounting_hole_dia);
        }
    }
}

// The central rotating assembly (Hub + Blades)
module fan_rotor() {
    // Central Motor Hub
    // Tapered cylinder
    cylinder(h = hub_height, d1 = hub_diameter, d2 = hub_top_diameter);
    
    // Small detail on top of hub
    translate([0, 0, hub_height])
    cylinder(h = 1, d = 20);

    // Blades
    for (i = [0 : blade_count - 1]) {
        rotate([0, 0, i * 360 / blade_count])
        fan_blade();
    }
}

// Single Fan Blade
// Uses hull() to create a twisted, tapered airfoil shape
module fan_blade() {
    // We define three cross-sections (Root, Mid, Tip) and hull them together.
    // This creates a smooth, curved, twisted surface.
    
    // 1. Root Profile (at the hub)
    // Positioned at root radius, slightly above the base
    translate([blade_root_radius, 0, 2]) 
    rotate([0, 0, 0]) // No twist at root
    blade_cross_section(blade_thickness_root, 8);

    // 2. Mid Profile (intermediate)
    // Positioned halfway, with half the twist
    mid_radius = (blade_root_radius + blade_tip_radius) / 2;
    translate([mid_radius, 0, hub_height / 2])
    rotate([0, 0, blade_twist_angle / 2])
    blade_cross_section((blade_thickness_root + blade_thickness_tip)/2, 12);

    // 3. Tip Profile (at the shroud)
    // Positioned at tip radius, with full twist
    translate([blade_tip_radius, 0, hub_height])
    rotate([0, 0, blade_twist_angle])
    blade_cross_section(blade_thickness_tip, 16);
}

// Helper module for the blade cross-section (Airfoil shape)
// Creates a teardrop-like volume
module blade_cross_section(thickness, width) {
    // Using hull of spheres/ellipsoids to create a smooth 3D airfoil volume
    // Leading edge (thicker)
    translate([0, 0, 0]) 
    scale([1, 1, thickness/4]) // Flatten the sphere
    sphere(d = 4);
    
    // Body
    translate([width * 0.3, 0, 0])
    scale([1, 1, thickness/3])
    sphere(d = 5);

    // Trailing edge (thinner, pointed)
    translate([width, 0, 0])
    scale([1, 1, thickness/5])
    sphere(d = 2);
}