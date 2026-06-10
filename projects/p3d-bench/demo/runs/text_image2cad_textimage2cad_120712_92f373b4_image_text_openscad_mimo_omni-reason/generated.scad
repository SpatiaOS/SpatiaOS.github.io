// Parametric assembly of pebble-shaped enclosure
// Based on rendered image and structured description

// --- Global Parameters ---
$fn = 100;  // Smooth curves

// --- Base Cover (Bottom Dome) ---
base_width = 303.9;
base_depth = 159.5;
base_height = 72.0;
base_aspect = 4.22;

// --- Housing Cover (Top Dome) ---
housing_width = 227.4;
housing_depth = 119.7;
housing_height = 50.0;
housing_aspect = 4.55;

// --- Cover Plate (Thin Oval Disc) ---
plate_width = 241.82;
plate_depth = 126.86;
plate_height = 6.0;

// --- Assembly Offsets ---
plate_offset_z = base_height;  // Sits on top of base cover
housing_offset_z = base_height + plate_height;  // Sits on top of plate

// --- Small Features ---
boss_radius = 6.0;
boss_height = 8.0;

// --- Helper Module: Ellipsoid Shell ---
// Creates an ellipsoidal dome with specified dimensions
module ellipsoid_shell(w, d, h, wall_thickness = 2) {
    difference() {
        // Outer ellipsoid
        scale([w/2, d/2, h]) 
            sphere(1);
        // Inner ellipsoid (hollow)
        scale([(w - 2*wall_thickness)/2, (d - 2*wall_thickness)/2, h - wall_thickness]) 
            sphere(1);
    }
}

// --- Helper Module: Flat Base ---
// Creates a flat base plate for the bottom dome
module flat_base(w, d, thickness = 2) {
    linear_extrude(thickness)
        scale([w/2, d/2, 1])
            circle(1);
}

// --- Helper Module: Oval Disc ---
// Creates a thin oval disc (cover plate)
module oval_disc(w, d, h) {
    scale([w/2, d/2, h])
        sphere(1);
}

// --- Helper Module: Control Panel Recess ---
// Creates the recessed oval panel with dot features
module control_panel(w, d, recess_depth = 5) {
    // Oval recess
    scale([(w-20)/2, (d-20)/2, recess_depth])
        sphere(1);
    
    // Five dot features (simplified as small cylinders)
    dot_spacing = 15;
    for (i = [0:4]) {
        translate([i*dot_spacing - dot_spacing*2, 0, -recess_depth/2])
            cylinder(h=2, r=2, center=true);
    }
}

// --- Helper Module: Embossed Symbols ---
// Creates simplified cross-pattern embossed symbols
module embossed_symbols() {
    symbol_size = 8;
    symbol_height = 1;
    
    // Cross pattern of symbols
    for (x = [-1, 1]) {
        for (y = [-1, 1]) {
            translate([x*20, y*20, 0])
                cylinder(h=symbol_height, r=symbol_size/2, center=true);
        }
    }
    // Center symbol
    cylinder(h=symbol_height, r=symbol_size/2, center=true);
}

// --- Base Cover Module ---
module base_cover() {
    union() {
        // Main dome shell
        ellipsoid_shell(base_width, base_depth, base_height);
        
        // Flat base plate
        flat_base(base_width, base_depth);
        
        // Small boss on top deck
        translate([0, 0, base_height - boss_height/2])
            cylinder(h=boss_height, r=boss_radius, center=true);
    }
}

// --- Housing Cover Module ---
module housing_cover() {
    union() {
        // Main dome shell
        ellipsoid_shell(housing_width, housing_depth, housing_height);
        
        // Control panel recess on top
        translate([0, 0, housing_height - 5])
            control_panel(housing_width * 0.6, housing_depth * 0.6);
        
        // Embossed symbols (simplified)
        translate([0, 0, housing_height - 2])
            embossed_symbols();
    }
}

// --- Cover Plate Module ---
module cover_plate() {
    oval_disc(plate_width, plate_depth, plate_height);
}

// --- Main Assembly ---
module pebble_enclosure_assembly() {
    union() {
        // Base cover (bottom)
        base_cover();
        
        // Cover plate (middle, thin disc)
        translate([0, 0, plate_offset_z])
            cover_plate();
        
        // Housing cover (top)
        translate([0, 0, housing_offset_z])
            housing_cover();
    }
}

// --- Generate the Assembly ---
pebble_enclosure_assembly();