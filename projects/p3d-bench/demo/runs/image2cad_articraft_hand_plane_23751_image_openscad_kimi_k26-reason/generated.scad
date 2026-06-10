// ==========================================
// Router Plane - Parametric OpenSCAD Model
// Approximation of a classic bench router plane
// (similar to Stanley No. 71 style)
// ==========================================

$fn = 60;

// --- Base Dimensions ---
wing_offset = 58;         // Distance from center to each wing/knob center
wing_dia = 46;            // Approximate wing diameter
base_thick = 11;          // Base plate thickness
base_round = 4;           // Corner rounding radius

// --- Knobs (wooden ball handles) ---
knob_dia = 32;
knob_stem_dia = 14;
knob_stem_h = 5;
knob_base_rim_dia = 22;   // Raised circular pad under knob
knob_base_rim_h = 2;
knob_top_pin_dia = 5;     // Small pin/ferrule on top of knob

// --- Central Blade & Yoke ---
blade_hole_dia = 14;      // Hole in base for blade
yoke_base_dia = 24;       // Circular boss around blade hole
yoke_base_h = 3;
yoke_arm_w = 5;           // Width of yoke arms
yoke_arm_h = 28;          // Height of yoke arms
yoke_span = 16;           // Distance between yoke arms
yoke_top_t = 4;           // Thickness of yoke crossbar
blade_w = 9;              // Blade width
blade_t = 2.5;            // Blade thickness
blade_len = 35;           // Total blade length below yoke

// --- Depth Adjustment (rear vertical screw) ---
depth_post_dia = 7;
depth_post_h = 34;
depth_wheel_dia = 19;
depth_wheel_thick = 8;
depth_wheel_face_hole_dia = 2.5;
depth_wheel_face_hole_count = 6;
depth_wheel_offset_y = 12; // Behind blade center

// --- Side Locking Knob ---
lock_shaft_dia = 6;
lock_shaft_len = 18;
lock_wheel_dia = 14;
lock_wheel_thick = 6;

// --- Small Guide Post (left of blade) ---
small_post_dia = 6;
small_post_h = 22;

// --- Text ---
text_emboss = 0.8;

// ==========================================
// Modules
// ==========================================

// Large wooden ball knob with stem and base rim
module knob(assemble_x) {
    translate([assemble_x, 0, 0]) {
        // Raised pad on wing
        cylinder(h=knob_base_rim_h, d=knob_base_rim_dia);
        
        // Stem
        translate([0, 0, knob_base_rim_h])
            cylinder(h=knob_stem_h, d=knob_stem_dia);
        
        // Ball
        translate([0, 0, knob_base_rim_h + knob_stem_h + knob_dia/2 - 3])
            sphere(d=knob_dia);
        
        // Equator seam (two halves joined)
        translate([0, 0, knob_base_rim_h + knob_stem_h + knob_dia/2 - 3])
            cylinder(h=0.4, d=knob_dia + 0.5, center=true);
        
        // Top plug/ferrule
        translate([0, 0, knob_base_rim_h + knob_stem_h + knob_dia - 4])
            cylinder(h=2, d=knob_top_pin_dia);
    }
}

// Main cast base with curved front arch and blade hole
module base_plate() {
    difference() {
        union() {
            // Main base body
            linear_extrude(height=base_thick, convexity=6)
                offset(r=base_round)
                    polygon([
                        [-wing_offset, -wing_dia/2 + 8],      // left front
                        [-wing_offset, wing_dia/2 - 2],       // left back
                        [-22, wing_dia/2 - 5],                // waist back left
                        [22, wing_dia/2 - 5],                 // waist back right
                        [wing_offset, wing_dia/2 - 2],        // right back
                        [wing_offset, -wing_dia/2 + 8],       // right front
                        [22, -wing_dia/2 - 8],                // waist front right
                        [0, -wing_dia/2 - 22],                // front center curve
                        [-22, -wing_dia/2 - 8]                // waist front left
                    ]);
        }
        
        // Through hole for blade in center
        translate([0, -2, -1])
            cylinder(h=base_thick + 2, d=blade_hole_dia);
        
        // Two small holes on right wing
        translate([wing_offset - 10, 8, -1])
            cylinder(h=base_thick + 2, d=3);
        translate([wing_offset - 10, -6, -1])
            cylinder(h=base_thick + 2, d=3);
    }
    
    // Embossed text on front arch
    translate([0, -wing_dia/2 - 12, base_thick])
        linear_extrude(height=text_emboss)
            text("STANLEY", size=5, halign="center", valign="center");
    
    // Label plate on right wing
    translate([wing_offset, 0, base_thick])
        linear_extrude(height=text_emboss)
            text("No 71", size=4, halign="center", valign="center");
}

// Yoke arms, crossbar, and blade iron
module yoke_and_blade() {
    translate([0, -2, base_thick]) {
        // Circular boss at base
        cylinder(h=yoke_base_h, d=yoke_base_dia);
        
        // Yoke arms
        for (dx = [-yoke_span/2, yoke_span/2]) {
            translate([dx, 0, yoke_base_h])
                cylinder(h=yoke_arm_h, d=yoke_arm_w);
        }
        
        // Yoke top crossbar
        translate([0, 0, yoke_base_h + yoke_arm_h])
            cube([yoke_span + yoke_arm_w, yoke_arm_w, yoke_top_t], center=true);
        
        // Top nut/cap on yoke
        translate([0, 0, yoke_base_h + yoke_arm_h + yoke_top_t])
            cylinder(h=3, d=8);
        
        // Blade descending through base
        color("DarkSlateGray")
        translate([0, 0, -base_thick])
            cube([blade_w, blade_t, blade_len], center=true);
    }
}

// Rear depth adjustment screw with thumb wheel
module depth_adjustment() {
    translate([0, depth_wheel_offset_y, base_thick]) {
        // Vertical threaded rod
        cylinder(h=depth_post_h, d=depth_post_dia);
        
        // Thumb wheel (adjustment nut)
        wheel_z = depth_post_h * 0.65;
        translate([0, 0, wheel_z])
            difference() {
                cylinder(h=depth_wheel_thick, d=depth_wheel_dia);
                // Face holes for grip
                for (i = [0:depth_wheel_face_hole_count-1]) {
                    a = i * 360 / depth_wheel_face_hole_count;
                    rotate([0, 0, a])
                        translate([depth_wheel_dia/3.5, 0, depth_wheel_thick - 1])
                            cylinder(h=2, d=depth_wheel_face_hole_dia);
                }
            }
        
        // Top nut/cap
        translate([0, 0, depth_post_h])
            cylinder(h=3, d=depth_post_dia + 2);
    }
}

// Side locking thumb screw entering yoke from right
module side_lock_screw() {
    translate([yoke_span/2 + 8, -2, base_thick + yoke_arm_h/2]) {
        rotate([0, 90, 0]) {
            // Shaft
            cylinder(h=lock_shaft_len, d=lock_shaft_dia);
            
            // Knurled thumb wheel head
            translate([0, 0, lock_shaft_len - 2]) {
                difference() {
                    union() {
                        cylinder(h=lock_wheel_thick, d=lock_wheel_dia);
                        // Raised rim
                        cylinder(h=1, d=lock_wheel_dia + 1);
                    }
                    // Dimples on face for knurling grip
                    for (a = [0:30:330]) {
                        rotate([0, 0, a])
                            translate([lock_wheel_dia/3, 0, lock_wheel_thick - 0.5])
                                sphere(d=1.2);
                    }
                }
            }
        }
    }
}

// Small cylindrical post to the left of the blade
module guide_post() {
    translate([-yoke_span - 5, -2, base_thick])
        cylinder(h=small_post_h, d=small_post_dia);
}

// ==========================================
// Final Assembly
// ==========================================

base_plate();
knob(-wing_offset);
knob(wing_offset);
yoke_and_blade();
depth_adjustment();
side_lock_screw();
guide_post();