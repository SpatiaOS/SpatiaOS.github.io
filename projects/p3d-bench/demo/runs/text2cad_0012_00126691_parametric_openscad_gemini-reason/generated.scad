// Parameters for Main Reference Slab
base_length = 0.5;
base_width = 0.75;
base_height = 0.016667;

// Parameters for Upper-Side Solid Rectangular Feature
rear_feature_length = 0.5;
rear_feature_width = 0.5;
rear_feature_reach = 0.2334;
rear_feature_offset_y = 0.25;

// Parameters for Upper-Side Narrow Edge Strips
strip_length = 0.0083;
strip_width = 0.5;
strip_depth = 0.0083;

// Parameters for Thin Upper-Side Transverse Solid Feature
transverse_length = 0.5;
transverse_width = 0.250819;
transverse_thickness = 0.0021;
transverse_offset_y = 0.24922;
transverse_reach = 0.335265;

// Parameters for Stepped Void (Internal Profile)
// Note: Widths are approximated as the prompt states they share edges but does not define the unshared boundary
void_shallow_depth = 0.1;
void_shallow_width = 0.4;
void_deep_depth = 0.2167;
void_deep_width = 0.3;

$fn = 100;

module model() {
    difference() {
        union() {
            // 1. Main reference slab
            cube([base_length, base_width, base_height]);
            
            // 2. Upper-side solid rectangular feature
            // Flush to left, right, back. Offset 0.25 from front. Reach 0.2334 from base datum.
            translate([0, rear_feature_offset_y, 0])
                cube([rear_feature_length, rear_feature_width, rear_feature_reach]);
                
            // 3. Two upper-side solid narrow rectangular edge strips
            // Left strip
            translate([0, rear_feature_offset_y, rear_feature_reach])
                cube([strip_length, strip_width, strip_depth]);
                
            // Right strip
            translate([rear_feature_length - strip_length, rear_feature_offset_y, rear_feature_reach])
                cube([strip_length, strip_width, strip_depth]);
                
            // 4. Thin upper-side transverse solid feature
            // Offset 0.24922 from front. Reach 0.335265 from base datum.
            translate([0, transverse_offset_y, transverse_reach - transverse_thickness])
                cube([transverse_length, transverse_width, transverse_thickness]);
        }
        
        // 5. Aligned stepped open void
        // Shallow upper pad void
        translate([-0.01, rear_feature_offset_y - 0.01, rear_feature_reach - void_shallow_depth])
            cube([void_shallow_width + 0.01, rear_feature_width + 0.02, void_shallow_depth + 0.01]);
            
        // Deeper continuation void (shares same shoulder / top face)
        translate([-0.01, rear_feature_offset_y - 0.01, rear_feature_reach - void_deep_depth])
            cube([void_deep_width + 0.01, rear_feature_width + 0.02, void_deep_depth + 0.01]);
    }
}

// Instantiate the final model
model();