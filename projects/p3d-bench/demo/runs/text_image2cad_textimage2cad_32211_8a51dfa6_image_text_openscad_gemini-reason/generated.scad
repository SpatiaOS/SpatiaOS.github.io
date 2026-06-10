// ==========================================
// Parametric Bevel Gear Assembly
// ==========================================
// This model reconstructs the bevel gear assembly consisting of three 
// bevel gears and three locating pins. The center and right gears are 
// identical large bevel gears that mesh at 90 degrees. The left gear 
// is a smaller bevel gear that interlocks with the center gear.

$fn = 100; // High resolution for smooth cylindrical surfaces

// --- Parameters ---

// Large Bevel Gears (Center and Right)
large_pitch_radius = 130;
large_bore_radius = 33.87;
large_thickness = 30;
large_teeth = 45;

// Small Bevel Gear (Left)
small_pitch_radius = 48;
small_bore_radius = 14.4;
small_thickness = 15;
small_teeth = 20;

// Pins
pin_center_length = 175;
pin_center_radius = 33.87;

pin_right_length = 100;
pin_right_radius = 33.87;

pin_left_length = 120;
pin_left_radius = 14.4;

// Layout Coordinates
// Center gear is positioned at the origin (0,0,0)
right_gear_pos = [large_pitch_radius, 0, large_pitch_radius];
left_gear_pos = [-(large_pitch_radius + small_pitch_radius), 0, 0];

// --- Modules ---

// Reusable Parametric Bevel Gear Module
module bevel_gear(pitch_radius, bore_radius, thickness, num_teeth) {
    hub_radius = bore_radius + 15;
    hub_height = thickness + 15;
    rim_width = pitch_radius * 0.25;
    web_thickness = thickness * 0.4;
    
    color([0.75, 0.75, 0.75])
    difference() {
        union() {
            // Central Hub
            cylinder(r=hub_radius, h=hub_height);
            
            // Connecting Web
            cylinder(r=pitch_radius - rim_width + 1, h=web_thickness);
            
            // Conical Rim for teeth
            difference() {
                cylinder(r1=pitch_radius, r2=pitch_radius - thickness, h=thickness);
                translate([0, 0, -1]) 
                    cylinder(r=pitch_radius - rim_width, h=thickness + 2);
            }
        }
        
        // Center Bore
        translate([0, 0, -1]) 
            cylinder(r=bore_radius, h=hub_height + 2);
        
        // Cut V-shaped teeth around the conical rim
        for (i = [0 : num_teeth - 1]) {
            rotate([0, 0, i * 360 / num_teeth])
            hull() {
                translate([pitch_radius + 5, 0, thickness / 2]) 
                    cube([1, pitch_radius * 0.06, thickness * 3], center=true);
                translate([pitch_radius - rim_width - 5, 0, thickness / 2]) 
                    cube([1, pitch_radius * 0.03, thickness * 3], center=true);
            }
        }
    }
}

// Reusable Pin Module
module pin(r, h) {
    color([0.65, 0.65, 0.65])
    cylinder(r=r, h=h, center=true);
}

// --- Main Assembly ---

union() {
    // 1. Center Large Bevel Gear
    // Positioned at origin, facing +Z
    bevel_gear(
        pitch_radius = large_pitch_radius, 
        bore_radius = large_bore_radius, 
        thickness = large_thickness, 
        num_teeth = large_teeth
    );
    
    // Center Pin
    // Placed through the bore, extending above and below
    translate([0, 0, pin_center_length/2 - 20])
        pin(r=pin_center_radius, h=pin_center_length);

    // 2. Right Large Bevel Gear
    // Meshes at 90 degrees with the Center gear. 
    // Rotated by half a tooth pitch to perfectly interleave the teeth.
    translate(right_gear_pos)
        rotate([0, -90, 0])
            rotate([0, 0, 360 / (2 * large_teeth)])
                bevel_gear(
                    pitch_radius = large_pitch_radius, 
                    bore_radius = large_bore_radius, 
                    thickness = large_thickness, 
                    num_teeth = large_teeth
                );
            
    // Right Pin
    // Placed through the right gear's bore along the X axis
    translate([right_gear_pos[0] - 5.6, 0, right_gear_pos[2]])
        rotate([0, 90, 0])
            pin(r=pin_right_radius, h=pin_right_length);

    // 3. Left Small Bevel Gear
    // Placed coplanar with the Center gear, interlocking teeth at the periphery
    translate(left_gear_pos)
        bevel_gear(
            pitch_radius = small_pitch_radius, 
            bore_radius = small_bore_radius, 
            thickness = small_thickness, 
            num_teeth = small_teeth
        );
        
    // Left Pin
    // Placed through the left gear's bore
    translate([left_gear_pos[0], left_gear_pos[1], pin_left_length/2 - 20])
        pin(r=pin_left_radius, h=pin_left_length);
}