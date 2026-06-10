// Parametric CAD Model
// All dimensions in millimeters

// --- Main Parameters ---
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;
base_extrusion = 0.0938;

// --- Base Hole Parameters ---
hole_center_x = 0.25;
hole_center_y = 0.1875;
hole_radius = 0.0938;

// --- Lower Back Strip Parameters ---
lower_strip_width = 0.0625;
lower_strip_front_offset = 0.375;
lower_strip_height_below = 0.25;

// --- Upper Back Strip Parameters ---
upper_strip_width = 0.0625;
upper_strip_front_offset = 0.375;
upper_strip_height_below = 0.5;
upper_strip_height_above = 0.25;

// --- Upper Strip Void Parameters ---
void_center_x = 0.125;
void_center_y = 0.4375;
void_radius = 0.05;

// --- Annular Collar Parameters ---
collar_center_x = 0.2501;
collar_center_y = 0.1876;
collar_outer_radius = 0.0938;
collar_inner_radius = 0.05;
collar_height = 0.0625;

// Resolution for smooth curves
$fn = 100;

// --- Main Model Construction ---
union() {
    // 1. Main rectangular base with circular void
    difference() {
        // Base solid
        cube([base_length, base_width, base_height]);
        
        // Circular void through base
        translate([hole_center_x, hole_center_y, -0.001])
            cylinder(h = base_height + 0.002, r = hole_radius);
    }
    
    // 2. Lower back-edge strip (extends below base)
    translate([0, base_width - lower_strip_front_offset, -lower_strip_height_below])
        cube([base_length, lower_strip_width, lower_strip_height_below]);
    
    // 3. Upper back-edge strip with circular voids
    difference() {
        // Upper strip solid
        translate([0, base_width - upper_strip_front_offset, -upper_strip_height_below])
            cube([base_length, upper_strip_width, 
                  upper_strip_height_below + base_height + upper_strip_height_above]);
        
        // Circular voids in upper strip
        for (z_offset = [-upper_strip_height_below : 0.1 : base_height + upper_strip_height_above]) {
            translate([void_center_x, void_center_y, z_offset])
                cylinder(h = 0.11, r = void_radius, center = true);
        }
    }
    
    // 4. Annular collar on upper side
    translate([collar_center_x, collar_center_y, base_height]) {
        difference() {
            // Outer cylinder
            cylinder(h = collar_height, r = collar_outer_radius);
            
            // Inner cylinder (creates annular shape)
            translate([0, 0, -0.001])
                cylinder(h = collar_height + 0.002, r = collar_inner_radius);
        }
    }
}