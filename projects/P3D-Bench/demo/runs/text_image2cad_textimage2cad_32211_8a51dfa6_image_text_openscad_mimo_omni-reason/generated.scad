// Assembly of three bevel gears and three pins
// Based on Fusion360 reconstruction from image and text description

// Global resolution
$fn = 100;

// Gear parameters (estimated from image and text)
small_gear_teeth = 16;
large_gear_teeth = 32;
gear_module = 4;  // Estimated module to fit bounding box
gear_thickness = 15;
gear_cone_angle = 45;  // Bevel gear cone angle in degrees

// Bore and pin parameters (from text description)
small_gear_bore_d = 28.8;
small_gear_bore_length = 30;
small_pin_r = 14.4;  // 28.8/2
small_pin_length = 120;

large_gear_bore_d = 67.748;
large_gear_bore_length = 10;
large_pin1_r = 33.87;  // 67.748/2
large_pin1_length = 175;
large_pin2_r = 33.87;
large_pin2_length = 100;

// Assembly positions (estimated from image and bounding box)
// Common mesh zone at origin
small_gear_pos = [-80, 60, 0];
large_gear1_pos = [0, 0, 0];
large_gear2_pos = [120, 0, 0];

// Gear orientations (estimated from image)
small_gear_rot = [0, 0, 0];  // Axis roughly vertical
large_gear1_rot = [0, 90, 0];  // Axis horizontal, facing right
large_gear2_rot = [0, 90, 0];  // Axis horizontal, facing right

// Helper module: Create a bevel gear profile
module bevel_gear_profile(outer_r, tooth_count, tooth_height, cone_angle) {
    // Create 2D gear profile
    circle(r = outer_r);
    
    // Add teeth
    for (i = [0 : tooth_count - 1]) {
        angle = i * 360 / tooth_count;
        rotate([0, 0, angle]) {
            translate([outer_r, 0, 0])
            square([tooth_height, tooth_height * 2], center = true);
        }
    }
}

// Helper module: Create a bevel gear
module bevel_gear(bore_d, tooth_count, thickness, cone_angle) {
    // Calculate gear dimensions
    pitch_r = (tooth_count * gear_module) / 2;
    outer_r = pitch_r + gear_module;
    tooth_height = gear_module * 2;
    
    difference() {
        // Main gear body with conical shape
        union() {
            // Back face (flat)
            cylinder(h = thickness * 0.3, d = bore_d + 20, center = false);
            
            // Conical section
            translate([0, 0, thickness * 0.3])
            cylinder(h = thickness * 0.7, 
                    d1 = bore_d + 20, 
                    d2 = outer_r * 2, 
                    center = false);
            
            // Teeth (simplified representation)
            for (i = [0 : tooth_count - 1]) {
                angle = i * 360 / tooth_count;
                rotate([0, 0, angle]) {
                    // Individual tooth
                    translate([pitch_r, 0, thickness * 0.2])
                    rotate([0, -cone_angle/2, 0])
                    cube([tooth_height * 2, tooth_height, thickness * 0.8], center = false);
                }
            }
        }
        
        // Central bore
        cylinder(h = thickness + 1, d = bore_d, center = true);
    }
}

// Helper module: Create a pin
module pin(radius, length) {
    cylinder(h = length, r = radius, center = true);
}

// Main assembly
union() {
    // Small bevel gear with its pin
    translate(small_gear_pos)
    rotate(small_gear_rot) {
        // Gear
        bevel_gear(small_gear_bore_d, small_gear_teeth, gear_thickness, gear_cone_angle);
        
        // Pin through bore
        translate([0, 0, small_gear_bore_length/2 - small_pin_length/2])
        pin(small_pin_r, small_pin_length);
    }
    
    // First large bevel gear with its pin (175mm long)
    translate(large_gear1_pos)
    rotate(large_gear1_rot) {
        // Gear
        bevel_gear(large_gear_bore_d, large_gear_teeth, gear_thickness, gear_cone_angle);
        
        // Pin through bore
        translate([0, 0, large_gear_bore_length/2 - large_pin1_length/2])
        pin(large_pin1_r, large_pin1_length);
    }
    
    // Second large bevel gear with its pin (100mm long)
    translate(large_gear2_pos)
    rotate(large_gear2_rot) {
        // Gear
        bevel_gear(large_gear_bore_d, large_gear_teeth, gear_thickness, gear_cone_angle);
        
        // Pin through bore
        translate([0, 0, large_gear_bore_length/2 - large_pin2_length/2])
        pin(large_pin2_r, large_pin2_length);
    }
}