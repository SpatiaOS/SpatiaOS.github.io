// Stanley No.71 Router Plane Replica
// All dimensions in millimeters
$fn = 50; // Smooth curve resolution

// --------------------------
// Parametric Dimension Setup
// --------------------------
// Base Plate
base_length = 200;
base_width = 70;
base_thickness = 10;
base_border_height = 2;
corner_radius = 5;

// Handles (2 identical units)
handle_diameter = 38;
handle_total_height = 55;
handle_base_diameter = 45;
handle_base_height = 6;

// Thumb Screw Assembly
thumb_knob_dia = 16;
thumb_knob_thickness = 6;
screw_diameter = 4;
screw_length = 18;

// Fence Post
fence_post_dia = 10;
fence_post_height = 45;

// Central Adjustment Assembly
central_post_dia = 12;
central_post_height = 65;
adjuster_body_dia = 30;
adjuster_body_height = 16;
top_clamp_screw_dia = 6;
top_clamp_screw_length = 30;

// --------------------------
// Reusable Module Definitions
// --------------------------

// Ergonomic router plane handle
module handle() {
    union() {
        // Mounting flange base
        cylinder(h=handle_base_height, d=handle_base_dia);
        // Tapered main handle body
        translate([0,0,handle_base_height])
            cylinder(h=handle_total_height - 18, r1=handle_diameter/2 - 4, r2=handle_diameter/2);
        // Rounded spherical top
        translate([0,0,handle_total_height - 12])
            sphere(r=handle_diameter/2);
        // Top slot detail
        translate([0,0,handle_total_height - 2])
            rotate([0,90,0])
                cube([handle_diameter + 2, 2, 4], center=true);
    }
}

// Knurled thumb screw with grip dots
module thumb_screw() {
    union() {
        // Knob body
        cylinder(h=thumb_knob_thickness, d=thumb_knob_dia);
        // Screw shank
        translate([0,0,thumb_knob_thickness])
            cylinder(h=screw_length, d=screw_diameter);
        // Grip dot detailing
        for(angle = [0:30:330]) {
            for(radius = [thumb_knob_dia/4, thumb_knob_dia/2 - 3]) {
                translate([radius*cos(angle), radius*sin(angle), thumb_knob_thickness/2])
                    cylinder(h=1, d=1.2, center=true);
            }
        }
    }
}

// Base plate 2D profile
module base_shape() {
    offset(r=corner_radius)
        polygon(points=[
            [-base_length/2, -base_width/2 + 10],
            [-base_length/2 + 10, -base_width/2],
            [-base_length/4, -base_width/2],
            [-20, -base_width/2 + 15],
            [20, -base_width/2 + 15],
            [base_length/4, -base_width/2],
            [base_length/2 - 10, -base_width/2],
            [base_length/2, -base_width/2 + 10],
            [base_length/2, base_width/2 - 10],
            [base_length/2 - 10, base_width/2],
            [base_length/4, base_width/2],
            [20, base_width/2 - 15],
            [-20, base_width/2 -15],
            [-base_length/4, base_width/2],
            [-base_length/2 + 10, base_width/2],
            [-base_length/2, base_width/2 - 10]
        ]);
}

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // Main base plate with cutouts
    difference() {
        // Solid base extrusion
        linear_extrude(height=base_thickness) base_shape();
        
        // Middle arch cutout
        translate([0, -base_width/2 + 5, base_thickness/2])
            cylinder(h=base_thickness + 1, r=30, center=true);
        
        // Blade slot cutout
        translate([0, 5, base_thickness/2])
            cube([40, 30, base_thickness + 1], center=true);
        
        // Mounting holes
        for(pos = [[-60, -15], [60, -15], [60, 15], [-60, 15], [0, -25]]) {
            translate([pos.x, pos.y, 0])
                cylinder(h=base_thickness + 1, d=4);
        }
    }

    // Raised border lip on base
    linear_extrude(height=base_border_height)
        offset(r=-2) base_shape();

    // Left and right handles
    translate([-base_length/2 + handle_base_diameter/2 + 6, 0, base_thickness]) handle();
    translate([base_length/2 - handle_base_diameter/2 - 6, 0, base_thickness]) handle();

    // Fence post assembly
    translate([-30, 10, base_thickness]) {
        cylinder(h=fence_post_height, d=fence_post_dia);
        translate([0, -15, 10]) rotate([0,0,180]) thumb_screw();
    }

    // Central adjuster assembly
    translate([0, 0, base_thickness]) {
        // Main center post
        cylinder(h=central_post_height, d=central_post_dia);
        
        // Adjuster body
        translate([0, 0, 22]) {
            cylinder(h=adjuster_body_height, d=adjuster_body_dia);
            // Side clamp screw
            translate([adjuster_body_dia/2, 0, adjuster_body_height/2])
                rotate([0, 90, 90]) thumb_screw();
            // Top adjustment screw
            translate([0, 0, adjuster_body_height + 5])
                cylinder(h=top_clamp_screw_length, d=top_clamp_screw_dia);
            // Top adjustment knob
            translate([0, 0, adjuster_body_height + 16])
                cylinder(h=10, d=top_clamp_screw_dia + 8);
        }
    }

    // Engraved markings
    translate([base_length/2 - 40, -12, base_thickness + base_border_height])
        linear_extrude(height=1)
            text("No.71", size=9, font="Arial:Bold", halign="center");

    translate([0, -22, base_thickness + base_border_height])
        rotate([0, 0, 180])
            linear_extrude(height=1)
                text("STANLEY", size=7, font="Arial:Bold", halign="center");
}