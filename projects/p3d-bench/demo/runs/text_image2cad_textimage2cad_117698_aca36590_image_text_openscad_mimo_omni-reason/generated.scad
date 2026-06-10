// Warship Figurine Assembly - Reconstructed from Fusion360 description
$fn = 60;

// ==============================
// Global Parameters
// ==============================
// Hull dimensions
hull_length = 100;
hull_width = 20;          // Aspect ratio 5:1
hull_height = 12;
deck_thickness = 2;

// Turret bases
turret_radius = 5;
turret_height = 3;
turret_positions = [-30, 0, 30]; // Fore, amidships, aft along X-axis

// Chimney
chimney_radius = 2.5;
chimney_height = 8;

// Gun barrels (pins)
barrel_radius = 0.5;
barrel_length = 10;
barrels_per_turret = 3;
barrel_spacing = 1.5;     // Spacing between barrels in a cluster

// Spacer
spacer_length = 9.7;
spacer_width = 2.1;
spacer_height = 6.2;
spacer_tilt = 10;         // Degrees tilt of end caps

// Superstructure
superstructure_length = 25;
superstructure_width = 12;
superstructure_height = 6;
superstructure_step = 2;  // Height of each step

// Resolution
$fn = 80;

// ==============================
// Helper Modules
// ==============================
// Hull with tapered ends and curved bottom
module hull_body() {
    // Create hull shape using hull of cross-sections
    hull() {
        // Bow cross-section (pointed)
        translate([hull_length/2, 0, 0])
        rotate([90, 0, 0])
        linear_extrude(height=0.1, center=true)
        polygon(points=[
            [0, 0],
            [-hull_width/2, hull_height/2],
            [-hull_width/2, -hull_height/2]
        ]);
        
        // Stern cross-section (pointed)
        translate([-hull_length/2, 0, 0])
        rotate([90, 0, 0])
        linear_extrude(height=0.1, center=true)
        polygon(points=[
            [0, 0],
            [hull_width/2, hull_height/2],
            [hull_width/2, -hull_height/2]
        ]);
        
        // Midship cross-section (widest)
        translate([0, 0, 0])
        rotate([90, 0, 0])
        linear_extrude(height=0.1, center=true)
        offset(r=1, $fn=20)
        square([hull_width, hull_height], center=true);
    }
    
    // Add deck surface
    translate([0, 0, hull_height/2 - deck_thickness/2])
    hull() {
        translate([hull_length/2 - 5, 0, 0])
        cylinder(r=1, h=deck_thickness, center=true);
        translate([-hull_length/2 + 5, 0, 0])
        cylinder(r=1, h=deck_thickness, center=true);
        cube([hull_length - 10, hull_width - 2, deck_thickness], center=true);
    }
}

// Turret base with barrels
module turret_base() {
    // Cylindrical base
    cylinder(r=turret_radius, h=turret_height);
    
    // Gun barrels (3 per turret)
    for (i = [0:barrels_per_turret-1]) {
        translate([turret_radius + barrel_length/2, 
                  (i - (barrels_per_turret-1)/2) * barrel_spacing, 
                  turret_height/2])
        rotate([0, 90, 0])
        cylinder(r=barrel_radius, h=barrel_length);
    }
}

// Superstructure with stepped design
module superstructure() {
    for (i = [0:2]) {
        step_scale = 1 - i*0.2;
        translate([0, 0, i*superstructure_step])
        cube([superstructure_length * step_scale, 
              superstructure_width * step_scale, 
              superstructure_step], 
             center=true);
    }
    
    // Chimney on top
    translate([superstructure_length/4, 0, 
               superstructure_height + chimney_height/2])
    cylinder(r=chimney_radius, h=chimney_height, center=true);
}

// Spacer with tilted end caps
module spacer() {
    // Main body
    cube([spacer_length, spacer_width, spacer_height], center=true);
    
    // Tilted end caps
    for (side = [-1, 1]) {
        translate([side * spacer_length/2, 0, 0])
        rotate([0, side * spacer_tilt, 0])
        cube([0.5, spacer_width, spacer_height], center=true);
    }
}

// ==============================
// Main Assembly
// ==============================
module warship_assembly() {
    // Hull
    hull_body();
    
    // Superstructure
    translate([0, 0, hull_height/2 + superstructure_height/2])
    superstructure();
    
    // Turret bases with barrels
    for (pos = turret_positions) {
        translate([pos, 0, hull_height/2 + turret_height/2])
        turret_base();
    }
    
    // Spacer (positioned near superstructure)
    translate([superstructure_length/2 + spacer_length/2 + 2, 
               superstructure_width/2 + spacer_width/2 + 1, 
               hull_height/2 + spacer_height/2])
    spacer();
}

// Render the complete assembly
warship_assembly();