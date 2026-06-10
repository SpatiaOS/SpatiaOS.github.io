// ==========================================
// Parametric Variables
// ==========================================
plate_thickness = 1.5;
chamfer_depth = 0.3;
hole_dia = 1.2;

// Resolution for smooth curves
$fn = 60;

// ==========================================
// 2D Profiles
// ==========================================

// The main body plate profile. Features a concave arc cutout
// at the front to clear and lock into the hub cap.
module fin_plate_2d() {
    offset(r=0.5) offset(r=-0.5) polygon([
        [4.5, 4.5],   // concave arc cutout center
        [6.0, 8.0],   // top edge behind head
        [7.5, 10.5],  // top ridge start
        [13.0, 9.5],  // top ridge end
        [21.5, 5.5],  // pointed tail tip
        [18.0, 2.5],  // tail bottom curve
        [12.0, 0.5],  // belly bottom
        [7.0, 1.0]    // belly front
    ]);
}

// ==========================================
// Helper Modules
// ==========================================

// A cylindrical bore with 45° conical chamfers on both ends
module chamfered_hole(pos, d, thickness, c_depth) {
    translate([pos[0], pos[1], 0]) {
        // Main cylindrical bore
        cylinder(h=thickness+2, d=d, center=true);
        // Top conical chamfer
        translate([0, 0, thickness/2 - c_depth])
            cylinder(h=c_depth+0.05, d1=d, d2=d + 2*c_depth, center=false);
        // Bottom conical chamfer
        translate([0, 0, -thickness/2 - 0.05])
            rotate([180, 0, 0])
            cylinder(h=c_depth+0.05, d1=d, d2=d + 2*c_depth, center=false);
    }
}

// ==========================================
// Main Components
// ==========================================

// The main structural fin plate
module fin_plate() {
    difference() {
        // Plate body with pseudo-3D chamfer via stacked offset extrusions
        union() {
            layer_h = 0.1;
            // Bottom chamfer
            for (i = [0 : layer_h : chamfer_depth - layer_h]) {
                translate([0, 0, -plate_thickness/2 + i])
                    linear_extrude(layer_h + 0.01)
                        offset(r = -chamfer_depth + i) fin_plate_2d();
            }
            // Middle straight section
            translate([0, 0, -plate_thickness/2 + chamfer_depth])
                linear_extrude(plate_thickness - 2*chamfer_depth + 0.01)
                    fin_plate_2d();
            // Top chamfer
            for (i = [0 : layer_h : chamfer_depth - layer_h]) {
                translate([0, 0, plate_thickness/2 - chamfer_depth + i])
                    linear_extrude(layer_h + 0.01)
                        offset(r = -i) fin_plate_2d();
            }
        }
        
        // 4 circular openings arranged in a line along the top ridge
        chamfered_hole([8.2, 9.2], hole_dia, plate_thickness, chamfer_depth);
        chamfered_hole([10.0, 8.8], hole_dia, plate_thickness, chamfer_depth);
        chamfered_hole([11.8, 8.4], hole_dia, plate_thickness, chamfer_depth);
        chamfered_hole([13.6, 8.0], hole_dia, plate_thickness, chamfer_depth);
        
        // 1 opening near the lower body (belly)
        chamfered_hole([11.0, 1.8], hole_dia, plate_thickness, chamfer_depth);
        
        // 1 opening at the pointed tip (tail)
        chamfered_hole([20.5, 5.5], hole_dia, plate_thickness, chamfer_depth);
    }
}

// Base shapes for the bulbous hub cap (lead weight)
module head_front_shape() {
    hull() {
        translate([1.0, 3.5, 0]) sphere(d=3.5);
        translate([1.5, 6.0, 0]) sphere(d=3.5);
        translate([3.5, 8.0, 0]) sphere(d=4.5);
        translate([5.0, 4.5, 0]) sphere(d=5.5);
        translate([4.0, 1.5, 0]) sphere(d=4.0);
        translate([2.0, 1.5, 0]) sphere(d=3.5);
    }
}

module head_rear_shape() {
    hull() {
        translate([3.5, 8.0, 0]) sphere(d=4.5);
        translate([6.5, 7.0, 0]) sphere(d=3.5);
        translate([7.5, 4.5, 0]) sphere(d=4.0);
        translate([6.5, 1.5, 0]) sphere(d=3.5);
        translate([4.0, 1.5, 0]) sphere(d=4.0);
    }
}

// A single half-shell of the hub cap
module head_half_geom() {
    difference() {
        union() {
            // Main freeform bulb (stepped profile)
            scale([1, 1, 0.7]) head_front_shape();
            scale([1, 1, 0.45]) head_rear_shape();
            
            // Inner cylindrical boss / eye feature
            translate([4.2, 4.5, 1.8]) rotate_extrude() translate([1.6, 0, 0]) circle(d=0.8);
            translate([4.2, 4.5, 1.5]) cylinder(h=0.8, d=1.8, center=false);
        }
        // Center depression of the eye
        translate([4.2, 4.5, 1.8]) cylinder(h=2.0, d=1.0, center=false);
        // Ensure the mating plane is perfectly flat
        translate([0, 0, -10]) cube([20, 20, 20], center=true);
    }
}

// The complete hub cap assembly (mirror pair + bridge)
module hub_cap() {
    union() {
        // Right half-shell
        translate([0, 0, plate_thickness/2]) head_half_geom();
        
        // Left half-shell
        mirror([0, 0, 1]) translate([0, 0, plate_thickness/2]) head_half_geom();
        
        // Central bridge to connect the halves through the plate cutout
        intersection() {
            union() {
                scale([1, 1, 10]) head_front_shape();
                scale([1, 1, 10]) head_rear_shape();
            }
            cube([40, 40, plate_thickness], center=true);
        }
    }
}

// Small toroidal wire ring
module split_ring() {
    rotate_extrude(convexity=4)
        translate([1.2, 0, 0])
            circle(d=0.3);
}

// ==========================================
// Final Assembly
// ==========================================

module main_assembly() {
    union() {
        // 1. Fin plate (grounded structural part)
        color("Silver") fin_plate();
        
        // 2 & 3. Hub cap half-shells (mirror pair) forming the bulbous head
        color("DarkSlateGray") hub_cap();
        
        // 4 & 5. Small wire rings (mirror pair) at lower face and pointed tip
        color("LightGray") {
            // Belly ring (oriented in YZ plane to pass through Z-axis hole)
            translate([11.0, 0.6, 0]) 
                rotate([90, 0, 90]) 
                split_ring();
                
            // Tail ring (oriented in XZ plane to pass through Z-axis hole)
            translate([21.7, 5.5, 0]) 
                rotate([90, 0, 0]) 
                split_ring();
        }
    }
}

// Render the assembly
main_assembly();