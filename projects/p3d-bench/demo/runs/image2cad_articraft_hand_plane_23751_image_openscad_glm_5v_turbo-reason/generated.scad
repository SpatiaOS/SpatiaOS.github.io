// Router Plane / Hand Tool Model
// Parametric OpenSCAD recreation - Optimized for performance

// ============================================
// PARAMETERS
// ============================================

// Resolution - reduced for faster rendering while maintaining quality
$fn = 48;

// Main body dimensions
body_length = 95;
body_width = 58;
body_thickness = 7;

// Knob parameters
large_knob_diameter = 24;
large_knob_height = 22;
large_knob_base_diameter = 28;
large_knob_base_height = 6;

// Small adjustment knob
small_knob_diameter = 14;
small_knob_height = 10;
small_knob_stem_diameter = 5;
small_knob_stem_length = 8;

// Central post mechanism
main_post_diameter = 10;
main_post_height = 25;
threaded_rod_diameter = 5;
threaded_rod_height = 18;
nut_diameter = 12;
nut_height = 4;

// Secondary post
secondary_post_diameter = 8;
secondary_post_height = 20;

// Hole positions (from center)
left_knob_pos = [-32, 18];
right_knob_pos = [30, -16];
main_post_pos = [8, 5];
secondary_post_pos = [-15, 0];
small_knob_pos = [15, 12];

// Base cutout parameters
cutout_width = 20;
cutout_length = 35;

// ============================================
// MODULES
// ============================================

// Large spherical knob with base - optimized
module large_knob() {
    union() {
        // Base cylinder
        cylinder(h=large_knob_base_height, d=large_knob_base_diameter);
        
        // Spherical knob portion using intersection for clean sphere cap
        translate([0, 0, large_knob_base_height])
        intersection() {
            sphere(d=large_knob_diameter);
            // Keep only upper portion of sphere
            translate([0, 0, large_knob_diameter/2])
            cube([large_knob_diameter + 1, large_knob_diameter + 1, large_knob_diameter], center=true);
        }
        
        // Flat spot on top for grip
        translate([0, 0, large_knob_base_height + large_knob_diameter - 3])
        cylinder(h=3, d=8);
    }
}

// Small adjustment knob with stem - simplified without heavy knurling
module small_adjustment_knob() {
    union() {
        // Stem
        cylinder(h=small_knob_stem_length, d=small_knob_stem_diameter);
        
        // Knob head - simple rounded cylinder
        translate([0, 0, small_knob_stem_length]) {
            union() {
                cylinder(h=small_knob_height * 0.7, d=small_knob_diameter);
                translate([0, 0, small_knob_height * 0.65])
                sphere(d=small_knob_diameter * 0.9);
                
                // Simple grip lines instead of spheres (much faster)
                for (i = [0:30:330]) {
                    rotate([0, 0, i])
                    translate([small_knob_diameter/2 - 1.5, 0, small_knob_height * 0.35])
                    rotate([90, 0, 0])
                    cylinder(h=3, d=1, $fn=8);
                }
            }
        }
    }
}

// Main central post assembly
module central_post_assembly() {
    union() {
        // Main post base
        cylinder(h=main_post_height, d=main_post_diameter);
        
        // Threaded rod
        translate([0, 0, main_post_height])
        cylinder(h=threaded_rod_height, d=threaded_rod_diameter);
        
        // Hex nut at top of main post
        translate([0, 0, main_post_height])
        cylinder(h=nut_height, d=nut_diameter, $fn=6);
        
        // Washer under nut
        translate([0, 0, main_post_height - 1.5])
        cylinder(h=1.5, d=nut_diameter + 4);
    }
}

// Secondary simple post
module secondary_post() {
    cylinder(h=secondary_post_height, d=secondary_post_diameter);
    
    // Rounded top
    translate([0, 0, secondary_post_height])
    sphere(d=secondary_post_diameter);
}

// Main body base plate - simplified organic shape using fewer hull points
module main_body() {
    linear_extrude(height=body_thickness, center=false)
    hull() {
        // Define key outline points as circles
        translate([-38, 20]) circle(r=14);
        translate([-10, 26]) circle(r=12);
        translate([28, 18]) circle(r=16);
        translate([40, -18]) circle(r=14);
        translate([8, -28]) circle(r=12);
        translate([-28, -20]) circle(r=11);
        translate([0, 0]) circle(r=16);
    }
}

// Cutout/arch in the middle of the body - simplified
module body_cutouts() {
    // Main arch cutout - use simple shapes
    translate([-5, -8, -1])
    linear_extrude(body_thickness + 2)
    offset(r=3)
    square([cutout_width - 6, cutout_length * 0.35]);
    
    // Side cutout
    translate([-25, 8, -1])
    linear_extrude(body_thickness + 2)
    offset(r=2)
    square([12, 10]);
}

// Embossed text/logo areas - simplified rectangles
module logo_areas() {
    // Left logo area
    color("gray")
    translate([-18, 8, body_thickness])
    linear_extrude(0.5)
    rounded_square([12, 8], r=1);
    
    // Right logo area
    color("gray")
    translate([22, -10, body_thickness])
    linear_extrude(0.5)
    rounded_square([18, 10], r=1);
}

// Rounded square helper
module rounded_square(size, r) {
    offset(r=r)
    offset(r=-r)
    square(size, center=true);
}

// Mounting holes in base
module mounting_holes() {
    hole_positions = [
        [-20, -5],
        [15, -18],
        [25, -5]
    ];
    
    for (pos = hole_positions) {
        translate([pos[0], pos[1], -1])
        cylinder(h=body_thickness + 2, d=4);
    }
}

// Reinforcement arch between posts - simplified
module reinforcement_arch() {
    color("silver")
    translate([-8, -2, 0])
    rotate([0, 0, -20])
    linear_extrude(height=body_thickness * 0.75)
    difference() {
        // Arch outer shape
        hull() {
            circle(r=7);
            translate([18, 0]) circle(r=5);
        }
        // Inner cutout
        hull() {
            translate([3, 0]) circle(r=4);
            translate([15, 0]) circle(r=3);
        }
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Main body with cutouts and holes
    difference() {
        main_body();
        body_cutouts();
        mounting_holes();
    }
    
    // Reinforcement arch
    reinforcement_arch();
    
    // Logo/text areas
    logo_areas();
    
    // Left large knob
    translate([left_knob_pos[0], left_knob_pos[1], body_thickness])
    large_knob();
    
    // Right large knob
    translate([right_knob_pos[0], right_knob_pos[1], body_thickness])
    large_knob();
    
    // Central post assembly
    translate([main_post_pos[0], main_post_pos[1], body_thickness])
    central_post_assembly();
    
    // Secondary post
    translate([secondary_post_pos[0], secondary_post_pos[1], body_thickness])
    secondary_post();
    
    // Small adjustment knob (positioned at angle)
    translate([small_knob_pos[0], small_knob_pos[1], body_thickness + 15])
    rotate([0, 20, 45])
    small_adjustment_knob();
}