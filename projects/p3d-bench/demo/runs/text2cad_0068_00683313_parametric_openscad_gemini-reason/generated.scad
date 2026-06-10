// Resolution for smooth curved surfaces
$fn = 100;

// Small epsilon value for clean boolean operations (prevents z-fighting)
eps = 0.001;

// --- Parameters ---

// Main Base Dimensions
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;

// Main Base Void
base_void_x = 0.25;
base_void_y = 0.1875;
base_void_r = 0.0938;

// Back-edge Solids Footprint
back_solid_length = 0.5;
back_solid_width = 0.0625;
back_solid_y_offset = 0.375;

// Underside Strip Z-span
under_strip_z_min = -0.25;
under_strip_z_max = 0;

// Main Back-edge Solid Z-span
back_solid_z_min = -0.5;
back_solid_z_max = 0.25;

// Back-edge Void (Semi-circular notch on the back face)
back_void_x = 0.125;
back_void_y = 0.4375;
back_void_r = 0.05;

// Upper Concentric Annular Collar
collar_x = 0.2501;
collar_y = 0.1876;
collar_outer_r = 0.0938;
collar_inner_r = 0.05;
collar_height = 0.0625;


// --- Geometry ---

difference() {
    // 1. Positive Geometry (Additive)
    union() {
        // Main rectangular base
        cube([base_length, base_width, base_height]);
        
        // Underside solid strip along the back edge
        translate([0, back_solid_y_offset, under_strip_z_min])
            cube([back_solid_length, back_solid_width, under_strip_z_max - under_strip_z_min]);
            
        // Other back-edge solid (overlaps and extends the underside strip)
        translate([0, back_solid_y_offset, back_solid_z_min])
            cube([back_solid_length, back_solid_width, back_solid_z_max - back_solid_z_min]);
            
        // Upper concentric annular collar (outer solid boundary)
        translate([collar_x, collar_y, base_height])
            cylinder(h=collar_height, r=collar_outer_r);
    }
    
    // 2. Negative Geometry (Subtractive)
    
    // Main base circular void
    translate([base_void_x, base_void_y, -eps])
        cylinder(h=base_height + 2*eps, r=base_void_r);
        
    // Collar inner circular void
    translate([collar_x, collar_y, base_height - eps])
        cylinder(h=collar_height + 2*eps, r=collar_inner_r);
        
    // Back-edge solid circular void (coincident profile cutting through the back edge)
    translate([back_void_x, back_void_y, back_solid_z_min - eps])
        cylinder(h=(back_solid_z_max - back_solid_z_min) + 2*eps, r=back_void_r);
}