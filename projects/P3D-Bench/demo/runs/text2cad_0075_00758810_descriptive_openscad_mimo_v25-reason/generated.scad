// Parameters
base_length = 100;
base_width = 60;
base_height = 20;
base_radius = 10;
collar_outer_radius = 25;
collar_inner_radius = 15;
collar_height = 15;
collar_bore_radius = 10;
side_recess_radius = 5;
side_recess_depth = 3;
underside_pattern_radius = 8;
underside_pattern_depth = 2;
hole_step_height = 10;
$fn = 100;

// Rounded base with curved ends
module rounded_base() {
    hull() {
        // Left curved end
        translate([base_radius, base_width/2, 0])
            cylinder(h=base_height, r=base_radius);
        // Right curved end
        translate([base_length - base_radius, base_width/2, 0])
            cylinder(h=base_height, r=base_radius);
        // Center rectangular section
        translate([base_radius, 0, 0])
            cube([base_length - 2*base_radius, base_width, base_height]);
    }
}

// Through hole with stepped profile
module through_hole() {
    // Lower section of hole (larger diameter)
    translate([base_length/2, base_width/2, -0.1])
        cylinder(h=hole_step_height + 0.1, r=collar_bore_radius + 5);
    
    // Upper section of hole (smaller diameter, continues through collar)
    translate([base_length/2, base_width/2, hole_step_height])
        cylinder(h=base_height + collar_height - hole_step_height + 0.1, r=collar_bore_radius);
}

// Annular collar on upper face
module collar() {
    translate([base_length/2, base_width/2, base_height])
        difference() {
            // Outer cylinder
            cylinder(h=collar_height, r=collar_outer_radius);
            // Inner bore (continues into base)
            translate([0, 0, -0.1])
                cylinder(h=collar_height + 0.2, r=collar_inner_radius);
        }
}

// Side recesses (shallow circular cuts)
module side_recesses() {
    // Front side recesses
    for (i = [0, 1]) {
        translate([base_length * (i + 0.25), -0.1, base_height/2])
            rotate([-90, 0, 0])
                cylinder(h=side_recess_depth + 0.1, r=side_recess_radius);
    }
    
    // Back side recesses
    for (i = [0, 1]) {
        translate([base_length * (i + 0.25), base_width + 0.1, base_height/2])
            rotate([90, 0, 0])
                cylinder(h=side_recess_depth + 0.1, r=side_recess_radius);
    }
}

// Underside pattern of circular cuts
module underside_pattern() {
    // Array of circular cuts on bottom face
    for (i = [0:2]) {
        for (j = [0:1]) {
            translate([
                base_length * 0.2 + i * base_length * 0.3,
                base_width * 0.25 + j * base_width * 0.5,
                -0.1
            ])
                cylinder(h=underside_pattern_depth + 0.1, r=underside_pattern_radius);
        }
    }
}

// Main assembly
difference() {
    union() {
        // Base structure
        rounded_base();
        
        // Collar on upper face
        collar();
    }
    
    // Remove through hole
    through_hole();
    
    // Remove side recesses
    side_recesses();
    
    // Remove underside pattern
    underside_pattern();
}