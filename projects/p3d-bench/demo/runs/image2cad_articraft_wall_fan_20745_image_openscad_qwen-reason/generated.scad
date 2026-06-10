// ============================================================================
// Parametric Model: Fan-Mounted Work Light / Spotlight Assembly
// Based on visual analysis of the provided image.
// ============================================================================

// Global Resolution
$fn = 60; // Smoothness for curves

// ============================================================================
// Parameters
// ============================================================================

// --- Base / Fan Housing ---
fan_outer_dia = 220;
fan_inner_dia = 80;
fan_height = 15;
fan_rim_thickness = 4;
num_radial_ribs = 36;
rib_width = 3;
concentric_rings = 3; // Number of support rings between inner and outer

// --- Motor Housing ---
motor_dia = 70;
motor_height = 50;
motor_base_plate_thickness = 5;

// --- Arm / Bracket ---
arm_length = 160;
arm_base_width = 30;
arm_tip_width = 20;
arm_thickness = 15;
hinge_dia = 12;
hinge_length = 20;

// --- Reflector / Dish ---
reflector_dia = 180;
reflector_depth = 60;
reflector_thickness = 3;
reflector_mount_width = 40;

// ============================================================================
// Modules
// ============================================================================

// 1. Fan Base / Grille
module fan_base() {
    // Outer Rim
    difference() {
        cylinder(h=fan_height, d=fan_outer_dia, center=false);
        translate([0, 0, -1])
            cylinder(h=fan_height + 2, d=fan_outer_dia - fan_rim_thickness * 2, center=false);
    }

    // Inner Hub (Solid part where motor sits)
    cylinder(h=fan_height, d=fan_inner_dia, center=false);

    // Radial Ribs (The grille pattern)
    // We create ribs from the inner hub to the outer rim
    for (i = [0 : num_radial_ribs - 1]) {
        angle = i * (360 / num_radial_ribs);
        rotate([0, 0, angle]) {
            // Rib geometry
            translate([fan_inner_dia/2, 0, fan_height/2]) {
                // Using a long thin cube for the rib
                // Length needs to reach the outer rim
                rib_len = (fan_outer_dia - fan_inner_dia) / 2;
                cube([rib_len, rib_width, fan_height - 2], center=true);
            }
        }
    }
    
    // Concentric Support Rings (to hold ribs together)
    // Distribute rings evenly between inner and outer radius
    inner_r = fan_inner_dia / 2;
    outer_r = fan_outer_dia / 2;
    for (j = [1 : concentric_rings]) {
        ring_r = inner_r + (outer_r - inner_r) * (j / (concentric_rings + 1));
        // Thin torus approximation using a thin cylinder difference or a rounded torus
        // Simple approach: Thin cylinder ring
        translate([0, 0, fan_height/2])
            rotate_extrude()
                translate([ring_r, 0, 0])
                    square([2, fan_height - 4], center=true);
    }
}

// 2. Motor Housing
module motor_housing() {
    // Main Cylinder
    cylinder(h=motor_height, d=motor_dia, center=false);
    
    // Top Details (Vents/Slots)
    // Based on image: a rectangular slot and some radial lines
    translate([0, 0, motor_height - 1]) {
        // Central square feature
        cube([15, 15, 2], center=true);
        
        // Radial vents
        for (k = [0 : 5]) {
            rotate([0, 0, k * 60]) {
                translate([20, 0, 0])
                    cube([20, 4, 2], center=true);
            }
        }
    }
    
    // Base flange (slightly wider than motor dia to sit on fan hub)
    translate([0, 0, -motor_base_plate_thickness])
        cylinder(h=motor_base_plate_thickness, d=motor_dia + 10, center=false);
}

// 3. Arm Assembly
module arm_assembly() {
    // The arm connects the motor housing to the reflector
    // It is angled. Let's define the pivot point.
    
    // Hinge Block on Motor Side
    translate([motor_dia/2 + 5, 0, motor_height * 0.6]) { // Approximate position on side
        // Pivot bracket
        cube([10, hinge_length, 20], center=true);
        // Hole for bolt
        rotate([90, 0, 0])
            cylinder(h=12, d=hinge_dia + 2, center=true); // Clearance hole
    }

    // The Arm itself (Tapered)
    // We use hull() to create a tapered shape between two points
    // Start point (near motor hinge)
    p1 = [motor_dia/2 + 10, 0, motor_height * 0.6];
    // End point (near reflector hinge)
    // The arm goes up and out.
    // Let's estimate coordinates relative to the motor center
    p2 = [motor_dia/2 + arm_length * 0.7, 0, motor_height + arm_length * 0.6]; 

    // To make it parametric and clean, let's use a rotated extrusion or just a hull of cubes
    // But the image shows a somewhat complex shape, maybe a rounded rectangle extrusion.
    // Let's approximate with a hull of two cubes for simplicity and robustness.
    
    // We need to position the arm relative to the hinge.
    // Let's create the arm in local coordinates and transform it.
    
    // Local arm definition
    module local_arm() {
        // Base of arm (at hinge)
        base_w = arm_base_width;
        tip_w = arm_tip_width;
        len = arm_length;
        
        // Create a tapered beam
        hull() {
            // Base block
            translate([0, 0, 0])
                cube([base_w, arm_thickness, 20], center=true); // 20 is height of hinge block
            
            // Tip block
            translate([len, 0, len * 0.5]) // Angled up
                cube([tip_w, arm_thickness, 20], center=true);
        }
    }
    
    // Positioning the arm
    // The hinge is on the side of the motor housing.
    // Let's assume the arm pivots at [motor_dia/2, 0, motor_height/2 + 10]
    translate([motor_dia/2, 0, motor_height/2 + 10]) {
        rotate([0, -45, 0]) { // Angle the arm up
            // Shift so pivot is at origin
            translate([-5, 0, -10]) { 
                // The actual arm geometry
                // Let's refine the shape to look more like the image (cylindrical/rounded)
                // Using a cylinder that tapers? No, hull of cylinders.
                hull() {
                    translate([0, 0, 0])
                        cylinder(h=20, d=arm_base_width, center=true);
                    translate([arm_length, 0, arm_length * 0.6]) // Angled up
                        cylinder(h=20, d=arm_tip_width, center=true);
                }
            }
        }
    }
}

// 4. Reflector / Dish
module reflector_dish() {
    // The dish is a parabolic shape.
    // We can use rotate_extrude with a polygon defining the curve.
    // Curve: y = k * x^2. 
    // At x=0 (center), y=0. At x=radius, y=depth.
    // Let's define points for the profile.
    
    r = reflector_dia / 2;
    d = reflector_depth;
    
    // Profile points (x, y) where x is radius, y is depth (vertical in extrude)
    // Actually, rotate_extrude rotates around Z. So we draw in XY plane.
    // X is radius, Y is height (depth of dish).
    // We want a dish opening upwards (or sideways depending on orientation).
    // Let's draw the cross section:
    // Start at center bottom (0,0) -> curve out to (r, d) -> thickness -> back to center.
    
    // Parabola approximation:
    // y = (d / r^2) * x^2
    steps = 20;
    profile_points = [];
    for (i = [0 : steps]) {
        x = (r / steps) * i;
        y = (d / (r * r)) * (x * x);
        profile_points = concat(profile_points, [[x, y]]);
    }
    
    // Add thickness to the back
    // We need a closed polygon.
    // Outer curve offset? Or just a simple thickness.
    // Let's do a simple thickness by shifting the curve.
    // This is tricky with rotate_extrude for variable thickness.
    // Easier: difference of two solids.
    
    difference() {
        // Outer Solid
        rotate_extrude() {
            polygon([
                [0, 0],
                [r, d],
                [r, d + reflector_thickness], // Back rim
                [0, reflector_thickness] // Back center (flat)
            ]);
            // Wait, the image shows a curved back, not flat.
            // Let's try to approximate the curve.
            // Let's just use the polygon defined above and add a parallel curve.
        }
        
        // This approach is hard to get perfect curvature.
        // Alternative: Hull of two circles? No.
        // Let's stick to the simple polygon for the "solid" and subtract an inner one.
        
        // Redefine Outer Solid with curved back
        // Points: (0,0) -> (r, d) -> (r, d+thick) -> curve back to (0, thick)
        // Let's approximate the back curve as similar to front.
        outer_poly = [
            [0, 0],
            [r, d],
            [r, d + reflector_thickness],
            [0, reflector_thickness] // Simplified flat back for now, or adjust points
        ];
        
        // Actually, let's just make a solid dish using the profile and a thickness offset manually?
        // No, let's use difference.
        
        // Outer shape
        rotate_extrude() {
            polygon([
                [0, 0],
                [r, d],
                [r, d + reflector_thickness],
                [0, reflector_thickness] // Flat back is acceptable approximation or simple curve
            ]);
        }
        
        // Inner hollow (the reflector surface)
        translate([0, 0, reflector_thickness]) // Shift up to create wall thickness
        rotate_extrude() {
             polygon([
                [0, 0],
                [r - reflector_thickness, d - reflector_thickness], // Shrink radius and depth slightly
                [r - reflector_thickness, 0], // Close loop? No.
                [0, 0]
            ]);
            // This creates a solid inner plug.
        }
    }
    
    // Better Reflector Generation:
    // Create the shell directly.
    // Front curve: y = a*x^2
    // Back curve: y = a*x^2 + thickness (approx)
    
    // Let's try a simpler geometric approach: A sphere segment or paraboloid shell.
    // Using difference of two paraboloids.
    
    // Outer Paraboloid
    // Using a series of cylinders to approximate? No, rotate_extrude is best.
    // Let's define the profile carefully.
    // x goes from 0 to r.
    // y_front = (d/r^2) * x^2
    // y_back = y_front + reflector_thickness (normal to surface is hard, let's just add to Y)
    
    shell_points = [];
    // Front curve points
    for (i = [0 : steps]) {
        x = (r / steps) * i;
        y = (d / (r * r)) * (x * x);
        shell_points = concat(shell_points, [[x, y]]);
    }
    // Back curve points (reverse order)
    for (i = [steps : -1 : 0]) {
        x = (r / steps) * i;
        y = (d / (r * r)) * (x * x) + reflector_thickness;
        shell_points = concat(shell_points, [[x, y]]);
    }
    
    color("grey")
    rotate_extrude()
        polygon(shell_points);
        
    // Mounting Bracket on the back of the dish
    // The image shows a bracket that connects to the arm.
    translate([0, 0, reflector_depth/2]) { // Approximate center of mass
        // U-bracket
        difference() {
            cube([reflector_mount_width, 20, 40], center=true);
            // Cutout for arm
            translate([0, 0, 0])
                cube([reflector_mount_width - 10, 22, 30], center=true);
        }
        // Pivot bolt
        rotate([90, 0, 0])
            cylinder(h=25, d=hinge_dia, center=true);
    }
}

// ============================================================================
// Assembly
// ============================================================================

module assembly() {
    // 1. Fan Base
    fan_base();
    
    // 2. Motor Housing (Centered on Fan Base)
    // The image shows the motor housing sitting on the central hub of the fan.
    translate([0, 0, fan_height]) {
        motor_housing();
        
        // 3. Arm Assembly
        // Attached to the side of the motor housing
        // We need to replicate the logic inside arm_assembly but integrated here
        // to ensure coordinates match.
        
        // Hinge position relative to motor center
        hinge_x = motor_dia / 2 + 5;
        hinge_z = motor_height * 0.6;
        
        // Arm Pivot
        translate([hinge_x, 0, hinge_z]) {
            // The arm angles up and out.
            // Based on image, roughly 45 degrees up.
            rotate([0, -40, 0]) { 
                // Arm Beam
                // Using hull for tapered shape
                hull() {
                    // Base of arm (at pivot)
                    translate([0, 0, 0])
                        cylinder(h=20, d=arm_base_width, center=true);
                    
                    // Tip of arm (connects to dish)
                    translate([arm_length, 0, arm_length * 0.7]) // Angled up
                        cylinder(h=20, d=arm_tip_width, center=true);
                }
                
                // Dish Mounting Point
                translate([arm_length, 0, arm_length * 0.7]) {
                    // Dish Pivot
                    // The dish needs to be attached here.
                    // In the image, the dish is angled relative to the arm.
                    // Let's assume the dish points somewhat forward/up.
                    
                    // Reflector
                    // We need to orient the reflector.
                    // The open face should point towards the target.
                    // In the image, the dish is facing "forward" relative to the arm extension.
                    // So we rotate it to face the correct way.
                    // Currently, rotate_extrude creates a bowl opening along Z (up).
                    // We need to rotate it so the opening faces "forward" (along the arm direction roughly).
                    
                    rotate([90, 0, 0]) { // Turn bowl to face X (forward)
                         // Adjust position so pivot is at the back of the dish
                         translate([0, 0, -reflector_depth/2]) {
                             reflector_dish();
                         }
                    }
                }
            }
        }
    }
}

// Render
assembly();