// Parametric Speaker Model
// Estimated dimensions based on proportions
// All units in millimeters

// === Global Parameters ===
$fn = 100; // Smooth curves for cylinders/spheres

// Main Speaker Box
box_width = 200;
box_depth = 100;
box_height = 80;
box_corner_radius = 5;

// Speaker Grilles
grille_hex_size = 40;
grille_inner_diameter = 30;
grille_depth = 10;
grille_radial_count = 24;

// Top Buttons
button_diameter = 8;
button_height = 3;
button_spacing = 15;
button_count = 3;

// Legs
leg_length = 100;
leg_top_diameter = 12;
leg_bottom_diameter = 6;
leg_angle = 15; // Tilt angle from vertical

// === Helper Modules ===

// Rounded Box for main enclosure
module rounded_box(w, h, d, r) {
    minkowski() {
        cube([w - 2*r, d - 2*r, h - 2*r], center=true);
        sphere(r);
    }
}

// Speaker Grille with hexagonal frame and radial pattern
module speaker_grille(hex_size, inner_d, depth, radial_count) {
    union() {
        // Hexagonal outer frame
        linear_extrude(depth)
            difference() {
                hexagon(hex_size);
                circle(d = inner_d);
            }
        
        // Radial lines inside the grille
        for (i = [0 : radial_count-1]) {
            rotate([0, 0, i * (360 / radial_count)])
                translate([inner_d/2 - 1, 0, 0])
                    cube([depth/2, 2, depth], center=true);
        }
        
        // Inner circular cover
        translate([0, 0, depth/2])
            cylinder(h=depth/2, d=inner_d-2);
    }
}

// Hexagon helper function
function hexagon(size) = 
    [for (i = [0:5]) [size * cos(60*i), size * sin(60*i)]];

// Button component
module button(d, h) {
    union() {
        cylinder(h=h, d=d);
        translate([0, 0, h])
            sphere(d=d*0.8);
    }
}

// Tapered leg component
module leg(length, top_d, bottom_d, angle) {
    rotate([0, -angle, 0])
        cylinder(h=length, d1=top_d, d2=bottom_d);
}

// Front panel decorations
module front_decorations(box_w, box_h, grille_hex_size) {
    // Center cross decoration
    translate([0, 0, 1])
        union() {
            cube([grille_hex_size*1.2, 5, 2], center=true);
            cube([5, grille_hex_size*0.8, 2], center=true);
        }
    
    // Grille outline decorations
    for (x_pos = [-box_w/4, box_w/4]) {
        translate([x_pos, 0, 1])
            linear_extrude(2)
                offset(delta=2)
                    hexagon(grille_hex_size);
    }
}

// === Main Assembly ===
union() {
    // Main Speaker Box
    rounded_box(box_width, box_depth, box_height, box_corner_radius);
    
    // Speaker Grilles
    for (x_pos = [-box_width/4, box_width/4]) {
        translate([x_pos, -box_depth/2 + grille_depth, 0])
            rotate([90, 0, 0])
                speaker_grille(grille_hex_size, grille_inner_diameter, grille_depth, grille_radial_count);
    }
    
    // Front Decorations
    translate([0, -box_depth/2 + 1, 0])
        front_decorations(box_width, box_height, grille_hex_size);
    
    // Top Buttons
    translate([box_width/4, box_depth/2, box_height/2])
        for (i = [0 : button_count-1]) {
            translate([i * button_spacing, 0, 0])
                button(button_diameter, button_height);
        }
    
    // Speaker Legs
    leg_positions = [
        [-box_width/2 + 20, -box_depth/2 + 20],
        [box_width/2 - 20, -box_depth/2 + 20],
        [-box_width/2 + 20, box_depth/2 - 20],
        [box_width/2 - 20, box_depth/2 - 20]
    ];
    
    for (pos = leg_positions) {
        translate([pos[0], pos[1], -box_height/2])
            rotate([0, 0, atan2(pos[1], pos[0]) + 90])
                leg(leg_length, leg_top_diameter, leg_bottom_diameter, leg_angle);
    }
}