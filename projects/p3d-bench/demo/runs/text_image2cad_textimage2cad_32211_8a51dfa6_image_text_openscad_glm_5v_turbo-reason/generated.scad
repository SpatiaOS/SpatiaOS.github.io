// =============================================================================
// Parametric Bevel Gear Assembly
// =============================================================================

// -----------------------------------------------------------------------------
// Global Settings
// -----------------------------------------------------------------------------
$fn = 100; // Resolution for smooth curves

// -----------------------------------------------------------------------------
// Dimensional Parameters (derived from text description and image analysis)
// -----------------------------------------------------------------------------

// --- Large Bevel Gears (Parts 79b06576 x2) ---
large_gear_teeth = 40;
large_gear_pitch_r = 80;       // Approximate pitch radius
large_gear_face_w = 35;        // Thickness of the gear body (cone height)
large_gear_cone_angle = 45;    // Pitch cone angle (degrees)
large_gear_bore_r = 33.874;    // 67.748mm diameter
large_gear_hub_r = 50;         // Hub outer radius
large_gear_hub_h = 20;         // Hub height/length

// --- Small Bevel Gear (Part 79afa20a) ---
small_gear_teeth = 20;
small_gear_pitch_r = 45;       // Approximate pitch radius
small_gear_face_w = 25;
small_gear_cone_angle = 45;
small_gear_bore_r = 14.4;      // 28.8mm diameter
small_gear_hub_r = 25;
small_gear_hub_h = 15;

// --- Pins ---
// Pin for Small Gear (79b1021e)
pin_small_r = 14.4;
pin_small_l = 120;

// Pin for Large Gear 1 - Long (79b03e80)
pin_large_long_r = 33.87;
pin_large_long_l = 175;

// Pin for Large Gear 2 - Short (79af53d4)
pin_large_short_r = 33.87;
pin_large_short_l = 100;

// --- Assembly Positions ---
// Distances from the common mesh zone (apex intersection)
pos_large_right = [110, 0, 0];      // Right Gear
pos_large_center = [0, 90, -60];    // Center/Bottom Gear (offset slightly for visual clarity)
pos_small_left = [-70, -60, 80];    // Left/Top Gear


// -----------------------------------------------------------------------------
// Modules
// -----------------------------------------------------------------------------

// Basic Pin/Dowel Module
module pin(radius, length) {
    color("silver")
    cylinder(r=radius, h=length, center=true);
}

// Bevel Gear Generator
// Generates a simplified visual model of a bevel gear with a central bore
module bevel_gear(teeth, pitch_r, face_w, cone_angle, bore_r, hub_r, hub_h) {
    // Calculations for geometry
    // We model the gear with the Apex at the origin (0,0,0) 
    // and the body extending along the negative Z axis.
    
    angle_rad = cone_angle;
    
    // Radii at the back face (largest diameter)
    // Assuming addendum/dedendum factors for visuals
    tip_r_back = pitch_r + (face_w * 0.15); // Outer radius (tooth tips)
    root_r_back = pitch_r - (face_w * 0.15); // Root radius (tooth base)
    
    // Radii at the front face (near apex)
    // Taper linearly based on cone angle
    taper_factor = 0.4; // How much the radius reduces towards the tip
    tip_r_front = tip_r_back * taper_factor;
    root_r_front = root_r_back * taper_factor;
    
    // Minimum radius at the very tip to avoid singularity
    tip_limit = 5; 
    
    tooth_angle = 360 / teeth;
    tooth_width_angle = tooth_angle * 0.4; // Duty cycle

    color("gray")
    difference() {
        union() {
            // 1. Main Gear Body (Frustum/Cone)
            // We create a solid cone that represents the blank
            translate([0, 0, -face_w/2])
            cylinder(
                r1=max(root_r_front, tip_limit), 
                r2=root_r_back, 
                h=face_w
            );
            
            // 2. Hub (Cylinder attached to the back)
            translate([0, 0, -face_w - hub_h/2])
            cylinder(r=hub_r, h=hub_h);

            // 3. Teeth Generation (Union of tapered prisms)
            for (i = [0 : teeth]) {
                rotate([0, 0, i * tooth_angle]) {
                    // Define tooth profile at back and front, connect with hull
                    hull() {
                        // Tooth at Back (Larger)
                        translate([root_r_back, 0, 0])
                        rotate([0, 0, tooth_width_angle/2])
                        cube([tip_r_back - root_r_back, sin(tooth_width_angle)*root_r_back, 0.1]); 
                        // Note: Using a thin cube slice for the cross section
                        
                        // Tooth at Front (Smaller)
                        translate([0, 0, -face_w])
                        translate([max(root_r_front, tip_limit), 0, 0])
                        rotate([0, 0, tooth_width_angle/2])
                        cube([tip_r_front - max(root_r_front, tip_limit), sin(tooth_width_angle)*max(root_r_front, tip_limit), 0.1]);
                    }
                }
            }
        }
        
        // 4. Central Bore (Subtraction)
        // Extends through the whole part plus margin
        cylinder(r=bore_r, h=(face_w + hub_h + 20), center=true);
    }
}


// -----------------------------------------------------------------------------
// Assembly Construction
// -----------------------------------------------------------------------------

// 1. Right Large Gear + Short Pin
// Orientation: Points towards Left (-X). 
// Transform: Rotate standard Z-down gear to point -X.
translate(pos_large_right) {
    rotate([0, 90, 0]) { // Orient axis to X
        // Gear
        bevel_gear(large_gear_teeth, large_gear_pitch_r, large_gear_face_w, large_gear_cone_angle, large_gear_bore_r, large_gear_hub_r, large_gear_hub_h);
        // Pin (Short, 100mm)
        // Offset pin to stick out the back (away from mesh)
        // Mesh is at local +X (since gear points -X). Back is local -X.
        translate([-(large_gear_face_w/2 + large_gear_hub_h/2) + (pin_large_short_l/2 - 10), 0, 0]) 
        pin(pin_large_short_r, pin_large_short_l);
    }
}

// 2. Center Large Gear + Long Pin
// Orientation: Points Up (+Z).
// Transform: Rotate standard Z-down gear 180 to point +Z.
translate(pos_large_center) {
    rotate([180, 0, 0]) { // Orient axis to +Z
        // Gear
        bevel_gear(large_gear_teeth, large_gear_pitch_r, large_gear_face_w, large_gear_cone_angle, large_gear_bore_r, large_gear_hub_r, large_gear_hub_h);
        // Pin (Long, 175mm)
        // Stick out the back (local -Z)
        translate([0, 0, -(large_gear_face_w/2 + large_gear_hub_h/2) + (pin_large_long_l/2 - 10)])
        pin(pin_large_long_r, pin_large_long_l);
    }
}

// 3. Left Small Gear + Medium Pin
// Orientation: Points towards Bottom-Right.
// Transform: Custom rotation to match visual layout.
translate(pos_small_left) {
    rotate([45, -45, 30]) { // Approximate tilt for the third axis
        // Gear
        bevel_gear(small_gear_teeth, small_gear_pitch_r, small_gear_face_w, small_gear_cone_angle, small_gear_bore_r, small_gear_hub_r, small_gear_hub_h);
        // Pin (Medium, 120mm)
        // Stick out the back
        translate([0, 0, -(small_gear_face_w/2 + small_gear_hub_h/2) + (pin_small_l/2 - 15)])
        pin(pin_small_r, pin_small_l);
    }
}