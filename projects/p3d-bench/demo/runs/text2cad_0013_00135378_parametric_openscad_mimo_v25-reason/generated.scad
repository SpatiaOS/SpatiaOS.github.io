// Parametric dimensions
length = 0.75;
width = 0.45;
base_height = 0.05625;
main_depth = 0.0562;
axis_x = 0.375;
axis_y = 0.225;

// Base-level concentric radii
base_radii = [0.225, 0.1875, 0.1875, 0.0937, 0.0937, 0.0562, 0.0562];

// Coaxial feature dimensions
outer_collar_outer_r = 0.225;
outer_collar_inner_r = 0.1875;
outer_collar_height = 0.1687;
inner_collar_outer_r = 0.0937;
inner_collar_inner_r = 0.0562;
inner_collar_height = 0.0937;
solid_section_radius = 0.0562;
solid_section_height = 0.075;

// Circular span offsets for inner collar and solid section
inner_collar_offsets = [0.2812, 0.2814, 0.1312, 0.1314];
solid_section_offsets = [0.3188, 0.3188, 0.1688, 0.1688];

// Resolution
$fn = 100;

// Module for rounded rectangular base
module rounded_base() {
    minkowski() {
        cube([length - 2*0.01, width - 2*0.01, base_height], center=false);
        cylinder(r=0.01, h=0.001);
    }
}

// Module for base-level concentric profile (rings and openings)
module base_concentric_profile() {
    // Create outermost ring
    difference() {
        cylinder(h=base_height, r=base_radii[0], center=false);
        cylinder(h=base_height*2, r=base_radii[1], center=true);
    }
    
    // Create middle ring
    difference() {
        cylinder(h=base_height, r=base_radii[2], center=false);
        cylinder(h=base_height*2, r=base_radii[3], center=true);
    }
    
    // Create inner ring
    difference() {
        cylinder(h=base_height, r=base_radii[4], center=false);
        cylinder(h=base_height*2, r=base_radii[5], center=true);
    }
    
    // Central opening
    cylinder(h=base_height*2, r=base_radii[6], center=true);
}

// Module for outer annular collar
module outer_annular_collar() {
    translate([axis_x, axis_y, base_height]) {
        difference() {
            cylinder(h=outer_collar_height, r=outer_collar_outer_r, center=false);
            cylinder(h=outer_collar_height*2, r=outer_collar_inner_r, center=true);
        }
    }
}

// Module for inner annular collar
module inner_annular_collar() {
    translate([axis_x, axis_y, base_height]) {
        difference() {
            cylinder(h=inner_collar_height, r=inner_collar_outer_r, center=false);
            cylinder(h=inner_collar_height*2, r=inner_collar_inner_r, center=true);
        }
    }
}

// Module for solid circular section
module solid_circular_section() {
    translate([axis_x, axis_y, base_height]) {
        cylinder(h=solid_section_height, r=solid_section_radius, center=false);
    }
}

// Main assembly
union() {
    // Base with concentric profile
    difference() {
        rounded_base();
        translate([axis_x, axis_y, 0]) {
            base_concentric_profile();
        }
    }
    
    // Coaxial features
    outer_annular_collar();
    inner_annular_collar();
    solid_circular_section();
}