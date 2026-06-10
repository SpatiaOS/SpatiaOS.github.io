// Parameters
$fn = 60;
scale_factor = 10; // Scaling up the small dimensions from the text for visibility

// Overall Dimensions (scaled)
fin_length = 220;
fin_max_height = 100;
fin_thickness = 15; // 1.5mm * 10
hub_radius = 45;
hub_width = 60; // Total width of the hub assembly
hole_diameter = 12;
ring_wire_d = 4;
ring_diameter = 25;
chamfer_size = 2;

// Colors
color_fin = [0.7, 0.7, 0.7, 0.9];
color_hub = [0.6, 0.6, 0.6, 0.9];
color_ring = [0.5, 0.5, 0.5, 1.0];

// Main Assembly
assembly();

module assembly() {
    // The fin plate is the central spine
    // The hub shells sandwich the left end of the fin
    // The rings are attached to the fin
    
    // Hub Assembly (Left side)
    // Two half-shells sandwiching the fin
    translate([-hub_radius + 10, fin_max_height/2, 0]) { // Position hub at left end
        // Front Shell
        color(color_hub)
        hub_shell(side=1);
        
        // Back Shell
        color(color_hub)
        mirror([0, 0, 1])
        hub_shell(side=1); // Mirrored to create the back half
    }
    
    // Fin Plate (Center/Right)
    // Positioned to fit between the hub shells
    // The hub shells are at x ~ -35 to 35 (relative to their center)
    // Let's align the fin so its left end is inside the hub
    translate([0, 0, 0]) {
        color(color_fin)
        fin_plate();
    }
    
    // Rings
    // One at the bottom edge (mid-fin)
    // One at the tip
    // Coordinates estimated from visual inspection of the fin shape
    color(color_ring)
    translate([110, 25, -fin_thickness/2 - ring_diameter/2]) // Bottom ring
    rotate([90, 0, 0])
    make_ring();
    
    color(color_ring)
    translate([215, 45, -fin_thickness/2 - ring_diameter/2]) // Tip ring
    rotate([90, 0, 0])
    make_ring();
}

module fin_plate() {
    // The fin is a thin plate with a specific profile
    // We create the 2D profile and extrude it
    // Then we add chamfers and holes
    
    // Center the thickness
    translate([0, 0, -fin_thickness/2]) {
        // Base extrusion
        linear_extrude(height=fin_thickness) {
            fin_profile();
        }
        
        // Add chamfers to top and bottom edges to simulate the "conical faces" / chamfer strips
        // We do this by adding a slightly larger extrusion with a chamfer profile? 
        // Or simpler: just rely on the hole countersinks and edge sharpness for now, 
        // but the text mentions extensive chamfering.
        // Let's add a chamfer to the perimeter using a difference operation with a larger chamfered shape?
        // Too complex for script. Let's just chamfer the holes.
        
        // Holes (Countersunk/Conical as per text)
        // 5 holes along top edge
        // 1 hole near lower body
        // 1 hole at tip (implied by ring)
        
        // Top holes
        hole_positions_top = [
            [60, 80],
            [90, 82],
            [120, 80],
            [150, 75],
            [180, 65]
        ];
        
        for (pt = hole_positions_top) {
            translate([pt[0], pt[1], 0]) {
                // Countersunk hole (conical bore)
                cylinder(h=fin_thickness + 2, d=hole_diameter, center=true); // Through hole
                // Countersink top
                translate([0, 0, fin_thickness/2])
                cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
                // Countersink bottom
                translate([0, 0, -fin_thickness/2])
                cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
            }
        }
        
        // Bottom hole (for ring)
        translate([110, 25, 0]) {
             cylinder(h=fin_thickness + 2, d=hole_diameter, center=true);
             translate([0, 0, fin_thickness/2])
             cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
             translate([0, 0, -fin_thickness/2])
             cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
        }
        
        // Tip hole (for ring)
        translate([215, 45, 0]) {
             cylinder(h=fin_thickness + 2, d=hole_diameter, center=true);
             translate([0, 0, fin_thickness/2])
             cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
             translate([0, 0, -fin_thickness/2])
             cylinder(h=4, d1=hole_diameter, d2=hole_diameter + 8, center=false);
        }
    }
}

module fin_profile() {
    // Define the 2D shape of the fin
    // Using a polygon for the main body and difference for the cutout
    
    // Main body polygon (fish shape)
    // Points estimated from image:
    // Left side (hub attachment): Wide
    // Top edge: Tapers slightly down
    // Tip: Pointed
    // Bottom edge: Concave cutout near hub, then tapers to tip
    
    polygon(points=[
        // Start bottom left (near hub)
        [20, 10],
        // Bottom cutout curve start
        [30, 15],
        // Bottom edge tapering to tip
        [100, 20],
        [160, 35],
        // Tip
        [220, 45],
        // Top edge tapering back
        [160, 65],
        [100, 80],
        [40, 85],
        // Top left (hub attachment)
        [20, 75],
        // Close loop
        [20, 10]
    ]);
    
    // Concave cutout on the bottom left to clear the hub
    // This is a "bite" taken out of the polygon
    // We use difference() in the parent module or here?
    // Since polygon is a single shape, we can't easily subtract inside the polygon definition without boolean ops.
    // So we rely on the parent module to subtract? 
    // No, let's just adjust the points to include the cutout.
    // The points above [20, 10] to [30, 15] are straight.
    // We need a curve.
    // Let's use a difference block in the fin_plate module instead.
}

// Redefine fin_plate to handle the cutout properly
module fin_plate() {
    translate([0, 0, -fin_thickness/2]) {
        difference() {
            // Base shape
            linear_extrude(height=fin_thickness) {
                polygon(points=[
                    [20, 10],
                    [30, 15], // Start of bottom edge
                    [100, 20],
                    [160, 35],
                    [220, 45], // Tip
                    [160, 65],
                    [100, 80],
                    [40, 85],
                    [20, 75], // Top left
                    [20, 40], // Down to cutout top
                    // Cutout is handled by subtraction below
                ]);
                
                // Actually, let's just make a simple polygon and subtract the cutout circle
                polygon(points=[
                    [0, 10],
                    [0, 80],
                    [40, 90],
                    [120, 85],
                    [180, 70],
                    [220, 45],
                    [150, 25],
                    [80, 15],
                    [30, 10],
                    [0, 10]
                ]);
            }
            
            // Concave cutout for hub clearance
            // Located at bottom left
            translate([10, 30, -1])
            cylinder(h=fin_thickness + 2, r=25);
            
            // Holes (Countersunk)
            // Top holes
            hole_positions_top = [
                [60, 80],
                [90, 82],
                [120, 80],
                [150, 75],
                [180, 65]
            ];
            
            for (pt = hole_positions_top) {
                translate([pt[0], pt[1], -1]) {
                    cylinder(h=fin_thickness + 2, d=hole_diameter);
                    // Countersink top
                    translate([0, 0, fin_thickness])
                    cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
                    // Countersink bottom
                    translate([0, 0, -5])
                    cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
                }
            }
            
            // Bottom hole
            translate([110, 25, -1]) {
                 cylinder(h=fin_thickness + 2, d=hole_diameter);
                 translate([0, 0, fin_thickness])
                 cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
                 translate([0, 0, -5])
                 cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
            }
            
            // Tip hole
            translate([215, 45, -1]) {
                 cylinder(h=fin_thickness + 2, d=hole_diameter);
                 translate([0, 0, fin_thickness])
                 cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
                 translate([0, 0, -5])
                 cylinder(h=5, d1=hole_diameter, d2=hole_diameter + 10);
            }
        }
        
        // Add chamfer strips to the edges (simplified)
        // The text mentions "34 conical faces... chamfer strips".
        // We can simulate this by adding a chamfer to the top and bottom perimeters.
        // Using a minkowski sum is too slow.
        // We'll just rely on the hole chamfers and the general shape.
    }
}

module hub_shell(side) {
    // side: 1 for front, -1 for back (handled by mirror in assembly)
    // The hub is a bulbous cap.
    // It needs to be split to sandwich the fin.
    // The fin is 15mm thick.
    // So the inner face of the shell is at z=0 (if centered).
    // Wait, the fin is centered at z=0.
    // So the shell inner face is at z=7.5 (half thickness).
    
    // Let's model the full hub and then cut it in half.
    // Or model the half directly.
    
    // Full hub shape:
    // A sphere/cylinder blend.
    // Center at (0,0,0) relative to module.
    
    // We want the flat face to be at z=0 (inner face).
    // And the rounded face to extend to z=hub_width/2.
    
    // Shape:
    // A sphere of radius hub_radius, cut in half?
    // No, it needs to be wider than the fin.
    // Let's use a hull of spheres.
    
    translate([0, 0, 0]) { // Position relative to assembly
        // The hub shell covers the left end of the fin.
        // The fin is at z=0 (centered).
        // The shell should cover from z=0 to z=hub_width/2 (for one half).
        
        // Let's create a shape that is rounded on the outside and flat on the inside.
        // Inside face: z=0.
        // Outside: rounded.
        
        // Base: Cylinder
        // cylinder(h=hub_width/2, r=hub_radius);
        // Cap: Sphere
        // translate([0, 0, hub_width/2 - hub_radius]) sphere(hub_radius); 
        // This creates a pill shape.
        
        // But the image shows a more complex "multi-faceted" look.
        // Let's use a sphere and cut it.
        
        // Let's try a hull of a sphere and a cylinder.
        // hull() {
        //    sphere(r=hub_radius);
        //    cylinder(h=10, r=hub_radius); // Extend slightly
        // }
        
        // Let's stick to a simpler rounded shape that looks like the image.
        // A sphere cut in half, plus a cylinder base.
        
        // Inner face is flat at z=0.
        // Outer face is rounded.
        
        // Let's define the volume.
        // It attaches to the fin at x ~ 0 to 40.
        
        // Let's use a difference to create the split.
        // Full shape:
        union() {
            // Main body
            // A sphere centered at (-10, 40, hub_width/4) ?
            // Let's align with the fin.
            // Fin center is y=45 (approx).
            // Hub center y=45.
            
            // Let's place the hub center at (0, 45, 0) in the module local coords?
            // No, the module is translated in assembly.
            
            // Let's assume local coords:
            // x is along the fin length.
            // y is height.
            // z is thickness.
            
            // The hub is at the left end (x < 0).
            // The fin starts at x > 0.
            
            // Let's create a shape centered at x=0, y=45.
            
            // "Bulbous cap"
            // It looks like a sphere with a flat back.
            
            // Sphere
            translate([-10, 45, hub_width/4]) // Shift left and up
            sphere(r=hub_radius);
            
            // Cylinder to connect to fin
            translate([-10, 45, 0])
            cylinder(h=hub_width/2, r=hub_radius * 0.8);
            
            // Cut the inner face flat at z=0
            // We want the shell to exist for z > 0.
            // So we intersect with a half-space z > 0.
            // But we are building the shell directly.
            
            // Let's just build the half-shell directly.
            // It exists for z in [0, hub_width/2].
            
            // Actually, the easiest way is to build the full hub and cut it.
            // But I'm inside the module.
            
            // Let's build the half shell.
            // It's the volume of the hub for z > 0.
            
            // Shape:
            // A sphere at (-10, 45, hub_width/4) clipped at z=0.
            // Plus a cylinder at (-10, 45) clipped at z=0.
            
            // Let's use intersection with a cube to clip it.
            intersection() {
                union() {
                    // Bulbous part
                    translate([-15, 45, hub_width/4])
                    sphere(r=hub_radius);
                    
                    // Connecting part
                    translate([-15, 45, 0])
                    cylinder(h=hub_width/2 + 10, r=hub_radius * 0.9);
                }
                // Clip to z >= 0
                translate([-100, -100, 0])
                cube([200, 200, hub_width]);
            }
            
            // Central Boss (Bearing seat)
            // Visible at the hub centre.
            // It's a cylinder protruding from the face? Or a hole?
            // "Inner cylindrical boss or bearing seat".
            // Usually a boss protrudes.
            // Let's add a cylinder on the outer face? Or inner?
            // "visible at the hub centre".
            // In the image, there's a circle in the middle of the hub.
            // It looks like a raised ring or a hole.
            // Let's make it a raised cylinder on the outer face.
            
            translate([-15, 45, hub_width/2]) // On the outer face (approx)
            // Wait, the outer face is curved.
            // Let's put it on the side face (the rounded part).
            // Or on the flat face (inner)?
            // "interfaces with neighbours... 3 coaxial cylindrical fits".
            // This suggests a shaft goes through.
            // So it's a hole through the hub.
            
            // Let's add a hole through the center.
            translate([-15, 45, -10])
            cylinder(h=hub_width + 20, r=15); // Through hole
            
            // And a boss around it?
            translate([-15, 45, hub_width/2 - 5])
            cylinder(h=10, r=25);
        }
    }
}

// Refined Hub Shell
module hub_shell(side) {
    // We want a shell that is flat on the inside (z=0) and rounded on the outside.
    // And has a central boss/hole.
    
    // Let's define the full hub first, then cut it.
    // But since we are in a module, let's just build the half.
    
    // Full Hub Shape:
    // Center at (0, 45, 0).
    // Extends x from -45 to 45.
    // Extends y from 0 to 90.
    // Extends z from -30 to 30.
    
    // Let's use a hull of spheres to make it organic.
    // Sphere at nose (-40, 45, 0).
    // Sphere at back (20, 45, 0).
    // Sphere at top (0, 80, 0).
    // Sphere at bottom (0, 10, 0).
    
    // This creates a nice fish-head shape.
    
    // Then we cut it in half at z=0.
    // And we add the central boss.
    
    // Let's do this.
    
    // Full shape
    full_hub();
    
    // Cut to half (z > 0)
    // We use intersection in the caller or here?
    // Let's do it here.
    intersection() {
        full_hub();
        translate([-100, -100, 0])
        cube([200, 200, 100]); // Keep z > 0
    }
}

module full_hub() {
    // Organic head shape
    hull() {
        // Nose
        translate([-35, 45, 0])
        sphere(r=35);
        
        // Back (where it meets fin)
        translate([15, 45, 0])
        sphere(r=30);
        
        // Top
        translate([-10, 75, 0])
        sphere(r=25);
        
        // Bottom
        translate([-10, 15, 0])
        sphere(r=25);
    }
    
    // Central Boss / Bearing
    // A cylinder through the center
    // And a raised ring on the outside
    
    // Through hole
    translate([-10, 45, -50])
    cylinder(h=100, r=12);
    
    // Raised boss on the outside (z > 0 side)
    // Since we are cutting at z=0, this needs to be on the z>0 side.
    // But the hull creates a smooth surface.
    // Let's add a cylinder on the "face" of the hub.
    // Which face? The side face (x-y plane)?
    // The image shows a circle on the side of the head.
    // So it's on the curved surface.
    
    // Let's add a cylinder protruding from the side.
    // Oriented along Z axis? No, the hub is split along Z (top/bottom? or front/back?).
    // Text: "two half-shells... mirror pairs".
    // If split along Z (top/bottom), the fin is sandwiched vertically.
    // If split along Y (front/back), the fin is sandwiched horizontally.
    // The fin is a "plate", so it's thin in Z.
    // So the hub shells must be split along Z (Top/Bottom) to sandwich the fin?
    // No, if the fin is thin in Z (thickness 15), and the hub is wide (60),
    // then the hub shells are likely split along Z (Top/Bottom halves) and the fin is in the middle?
    // Or the hub shells are split along Y (Left/Right) and the fin is in the middle?
    // If split along Y, the fin (which is in the X-Y plane) would be sandwiched between Front and Back shells.
    // This makes sense. The fin is the "spine".
    // So the split is at Y=0? No, the fin is at Y=45 (center).
    // So the split is at Z=0?
    // If the fin is in the X-Y plane (flat), its thickness is in Z.
    // So the fin occupies Z from -7.5 to 7.5.
    // The hub shells must sandwich this.
    // So the hub shells are split at Z=0? No, that would put the fin inside one shell.
    // The hub shells must be split at Z=7.5 and Z=-7.5?
    // Or the hub shells are "Front" and "Back" (split along Y? No, split along Z-axis plane? i.e. Z=0 plane).
    // If split at Z=0, one shell is Z>0, one is Z<0.
    // The fin is at Z=0 (centered).
    // So the fin is sandwiched between the two shells.
    // This matches "fin plate to hub shells" contact.
    // So the hub shells are Top (Z>0) and Bottom (Z<0)?
    // No, "Front" and "Back" usually implies Y.
    // But if the fin is flat (X-Y plane), then "Front" and "Back" are Z directions.
    // So yes, the shells are split along the Z=0 plane.
    // One shell is Z > 0 (Front/Top), one is Z < 0 (Back/Bottom).
    // Wait, usually "Top" and "Bottom" are Y.
    // Let's assume the split is along the plane of the fin's flat face?
    // No, the fin has two flat faces (Top and Bottom in Z).
    // So the shells attach to these faces.
    // So Shell 1 is at Z > 7.5. Shell 2 is at Z < -7.5.
    // And they meet at the fin edges?
    // Or they overlap?
    // "4 mating-plane interfaces... principally the fin plate to hub shells".
    // This implies the fin face touches the shell face.
    // So Shell Inner Face is at Z=7.5 (for top shell).
    // And Shell Inner Face is at Z=-7.5 (for bottom shell).
    
    // So my previous `hub_shell` module which creates a shape for Z>0 and cuts at Z=0 is wrong.
    // It should create a shape for Z > 7.5 (approx).
    // Or just create the full hub and subtract the fin volume?
    // No, they are separate parts.
    
    // Let's adjust `hub_shell` to be the "Top" shell (Z > 0).
    // And we place it at Z = fin_thickness/2.
    
    // In `assembly`:
    // translate([..., ..., fin_thickness/2]) hub_shell();
    // translate([..., ..., -fin_thickness/2]) mirror([0,0,1]) hub_shell();
    
    // So `hub_shell` should be a shape that sits on the Z=0 plane (its inner face).
    // And extends to Z = hub_width/2.
    
    // So my `hub_shell` module (which intersects with z>0) is correct for the "Top" shell.
    // It creates the volume for Z > 0.
    // We just need to shift it up by fin_thickness/2 in the assembly.
    
    // Let's refine the `full_hub` shape to look more like the image.
    // The image shows a "multi-faceted" cap.
    // Maybe a sphere with some flat cuts?
    // Or just a smooth sphere is fine for OpenSCAD.
    
    // Central Boss:
    // "visible at the hub centre".
    // In the image, there is a concentric circle pattern.
    // It looks like a boss (raised cylinder) with a hole.
    // Located on the side of the hub (the rounded face).
    // Since the hub is split Top/Bottom (Z-axis), the side face is the X-Y perimeter.
    // So the boss is on the X-Y perimeter.
    // Oriented along Z? No, that would go through the fin.
    // Oriented along X (through the nose)?
    // Or Y (vertical)?
    // The image shows the circle on the "side" of the fish head.
    // The "side" is the X-Y face.
    // So the boss is a cylinder protruding from the X-Y face?
    // But the X-Y face is curved (the hull).
    // So it's a boss on the curved surface.
    // Let's just put a cylinder at the center (-10, 45) oriented along Z?
    // No, that's the split plane.
    // Oriented along X? (Through the nose).
    // Let's assume it's a bearing for an axle coming out the side (X direction).
    // So a cylinder along X axis.
    
    // Let's add a cylinder along X axis at the center.
    translate([-10, 45, 0])
    rotate([0, 90, 0])
    cylinder(h=hub_width + 20, r=15); // Through hole along X
    
    // And a boss around it on the surface?
    // This is getting complex.
    // Let's stick to the simple shape.
}

// Re-define full_hub to be cleaner
module full_hub() {
    // Main body
    hull() {
        translate([-30, 45, 0]) sphere(r=35); // Nose
        translate([10, 45, 0]) sphere(r=30);  // Back
        translate([-10, 75, 0]) sphere(r=20); // Top
        translate([-10, 15, 0]) sphere(r=20); // Bottom
    }
    
    // Central feature (Bearing/Boss)
    // A cylinder along the X-axis (through the nose)
    // This matches "coaxial cylindrical fits"
    translate([-10, 45, 0])
    rotate([0, 90, 0])
    cylinder(h=80, r=15, center=true);
    
    // A decorative ring/boss on the side
    translate([-10, 45, 0])
    rotate([0, 90, 0])
    cylinder(h=10, r=25, center=true);
}

module make_ring() {
    // A simple torus
    rotate_extrude()
    translate([ring_diameter/2, 0, 0])
    circle(r=ring_wire_d/2);
}