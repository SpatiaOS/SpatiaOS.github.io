// OpenSCAD code for Stylized Leaping Quadruped Assembly
// Based on provided image and text description.
// Approximates B-spline organic surfaces using hull() and spheres.

$fn = 60; // Resolution for smooth curves (approximating B-splines)

// --- Parameters ---
// Overall Scale to match bounding box ~260mm length
global_scale = 1.1;

// --- Modules ---

// Module for the nose detail (cylinder r=2.3, h=2.06)
module nose_detail() {
    rotate([0, 90, 0]) 
    cylinder(h=2.5, r=2.3, center=true);
}

// Module for a pointed ear
module ear() {
    // Pointed cone-like shape
    cylinder(h=22, r1=9, r2=1, center=false);
}

// Module for the Head (sculptural_head_shell)
// Dimensions approx: 40 x 44 x 58 mm
module sculptural_head_shell() {
    difference() {
        union() {
            // Main Skull (Hull for organic shape)
            hull() {
                translate([0, 0, 0]) sphere(r=22); // Cranium
                translate([25, 0, -8]) sphere(r=14); // Snout base
            }
            
            // Ears
            translate([-5, -14, 20]) rotate([0, 15, 0]) ear();
            translate([-5, 14, 20]) rotate([0, 15, 0]) ear();
            
            // Snout taper
            translate([25, 0, -8]) cylinder(h=22, r1=14, r2=7);
            
            // Nose cylinder at tip
            translate([47, 0, 0]) nose_detail();
        }
        
        // Eye indentations (subtractive spheres)
        // Positioned on the side of the snout/skull transition
        translate([12, -11, 8]) sphere(r=4.5);
        translate([12, 11, 8]) sphere(r=4.5);
    }
}

// Module for the Tail
// Long, tapering, curving upwards
module tail() {
    hull() {
        translate([0, 0, 0]) sphere(r=8);      // Base (thick)
        translate([-35, 0, 15]) sphere(r=6);   // Mid
        translate([-65, 0, 40]) sphere(r=4);   // Upper curve
        translate([-80, 0, 55]) sphere(r=2.5); // Tip
    }
}

// Module for Rear Leg
// Muscular thigh, bent knee
module leg_rear() {
    hull() {
        translate([0, 0, 0]) sphere(r=26);     // Thigh/Haunch connection
        translate([0, 0, -45]) sphere(r=20);   // Knee
        translate([15, 0, -75]) sphere(r=12);  // Ankle/Paw
    }
    // Paw detail
    translate([15, 0, -75]) cylinder(h=8, r=10);
}

// Module for Front Leg
// Reaching forward
module leg_front() {
    hull() {
        translate([0, 0, 0]) sphere(r=16);     // Shoulder
        translate([15, 0, -35]) sphere(r=13);  // Elbow
        translate([30, 0, -55]) sphere(r=9);   // Wrist
    }
    // Paw detail
    translate([30, 0, -55]) cylinder(h=7, r=8);
}

// Module for Rear Body Section (figurine_body approx)
// ~111 x 115 x 118 mm
module body_rear() {
    hull() {
        // Rear haunch (high)
        translate([-20, 0, 20]) sphere(r=42);
        // Mid-body (lower)
        translate([20, 0, 0]) sphere(r=38);
    }
}

// Module for Front Body Section (ornamental_figurine approx)
// ~111 x 115 x 233 mm (This likely includes the long stretch to the head)
// Note: The text says this part is long. I will model the front torso/chest here.
module body_front() {
    hull() {
        // Connection to rear
        translate([-30, 0, 0]) sphere(r=38);
        // Chest/Shoulders
        translate([30, 0, -15]) sphere(r=30);
    }
}

// --- Main Assembly ---
module assembly() {
    scale(global_scale) {
        
        // 1. Rear Assembly (Body Rear + Tail + Rear Legs)
        // Positioned at the back (left in image)
        translate([-50, 0, 10]) {
            body_rear();
            
            // Tail attached to rear top
            translate([-30, 0, 40]) tail();
            
            // Rear Legs
            // Left
            translate([-10, -35, -10]) leg_rear();
            // Right
            translate([-10, 35, -10]) mirror([0, 1, 0]) leg_rear();
        }

        // 2. Front Assembly (Body Front + Front Legs)
        // Positioned forward (right in image)
        translate([40, 0, 0]) {
            body_front();
            
            // Front Legs
            // Left
            translate([15, -25, -10]) leg_front();
            // Right
            translate([15, 25, -10]) mirror([0, 1, 0]) leg_front();
        }

        // 3. Head Assembly (sculptural_head_shell)
        // Attached to the front chest, lifted
        translate([95, 0, 5]) {
            rotate([0, 0, -10]) { // Slight upward tilt
                sculptural_head_shell();
            }
        }
        
        // 4. Unknown Part (part)
        // Text says "null extraction", "single contact".
        // Likely a small detail or internal structure not visible.
        // Omitted as geometry is unknown.
    }
}

// Render the model
assembly();