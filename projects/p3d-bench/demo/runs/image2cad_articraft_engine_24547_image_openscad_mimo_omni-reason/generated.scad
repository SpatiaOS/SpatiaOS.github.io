// Parametric Winch Assembly - Recreated from Image
// Units: Millimeters

// --------------------------
// Global Parameters
// --------------------------
$fn = 100; // Smooth curves for all circular features

// --------------------------
// Base Dimensions
// --------------------------
base_plate_width = 120;
base_plate_depth = 80;
base_plate_height = 8;
base_platform_width = 80;
base_platform_depth = 60;
base_platform_height = 20;
base_corner_radius = 5; // Rounded corners for lower base plate

// --------------------------
// Spoked Wheel Dimensions
// --------------------------
wheel_outer_diameter = 160;
wheel_thickness = 15;
wheel_hub_diameter = 30; // Central shaft hole
wheel_cutout_radius = 25; // Radius of spoke cutouts
wheel_cutout_distance = 45; // Distance from center to cutout centers
wheel_spacing = 120; // Distance between centers of the two wheels

// --------------------------
// Drum & Rope Dimensions
// --------------------------
drum_diameter = 70;
drum_length = 100;
rope_diameter = 8;
rope_coil_count = 12; // Number of rope coils
drum_knob_diameter = 15;
drum_knob_height = 10;

// --------------------------
// Shaft Dimensions
// --------------------------
shaft_diameter = 20;
shaft_length = 200;

// --------------------------
// Mounting Block Dimensions
// --------------------------
mount_block_width = 25;
mount_block_depth = 20;
mount_block_height = 15;
bolt_diameter = 6;

// --------------------------
// Component Modules
// --------------------------

// Base Assembly: Lower plate + upper mounting platform
module base() {
    // Lower base plate with rounded corners
    translate([0, 0, base_plate_height/2]) {
        minkowski() {
            cube([base_plate_width - 2*base_corner_radius, 
                  base_plate_depth - 2*base_corner_radius, 
                  base_plate_height], center=true);
            sphere(r=base_corner_radius);
        }
    }
    // Upper platform for wheel/shaft mounting
    translate([0, 0, base_plate_height + base_platform_height/2]) {
        cube([base_platform_width, base_platform_depth, base_platform_height], center=true);
    }
}

// Spoked Wheel: Solid wheel with 4 curved cutouts (spokes)
module wheel() {
    difference() {
        // Solid outer wheel
        cylinder(h=wheel_thickness, d=wheel_outer_diameter, center=true);
        // Central shaft hole
        cylinder(h=wheel_thickness + 2, d=wheel_hub_diameter, center=true);
        // 4 spoke cutouts (90° apart)
        for (i = [0:3]) {
            rotate([0, 0, i*90]) {
                translate([wheel_cutout_distance, 0, 0]) {
                    cylinder(h=wheel_thickness + 2, d=wheel_cutout_radius*2, center=true);
                }
            }
        }
    }
}

// Drum with Coiled Rope + Top Knob
module drum_assembly() {
    // Main drum cylinder
    cylinder(h=drum_length, d=drum_diameter, center=true);
    // Simulate coiled rope as a helical extrusion
    linear_extrude(height=drum_length, center=true, twist=360*rope_coil_count, slices=rope_coil_count*15) {
        translate([drum_diameter/2 + rope_diameter/2, 0, 0]) {
            circle(d=rope_diameter);
        }
    }
    // Knob on top of drum
    translate([0, 0, drum_length/2 + drum_knob_height/2]) {
        cylinder(h=drum_knob_height, d=drum_knob_diameter, center=true);
    }
}

// Mounting Block: Connects wheel to shaft with bolt holes
module mount_block() {
    difference() {
        // Main block
        cube([mount_block_width, mount_block_depth, mount_block_height], center=true);
        // Bolt holes
        for (x = [mount_block_width/4, -mount_block_width/4]) {
            for (y = [mount_block_depth/4, -mount_block_depth/4]) {
                translate([x, y, 0]) {
                    cylinder(h=mount_block_height + 2, d=bolt_diameter, center=true);
                }
            }
        }
    }
    // Bolt heads (visible on outer face)
    for (x = [mount_block_width/4, -mount_block_width/4]) {
        for (y = [mount_block_depth/4, -mount_block_depth/4]) {
            translate([x, y, mount_block_height/2 + 2]) {
                cylinder(h=4, d=bolt_diameter*1.5);
            }
        }
    }
}

// --------------------------
// Final Assembly
// --------------------------
union() {
    // Base structure
    base();
    
    // Calculate vertical position for wheels/shaft/drum
    wheel_z_position = base_plate_height + base_platform_height + wheel_thickness/2;
    
    // Left Wheel + Mounting Block
    translate([-wheel_spacing/2, 0, wheel_z_position]) {
        wheel();
        // Mounting block on inner side of wheel
        translate([wheel_outer_diameter/2 + mount_block_width/2, 0, 0]) {
            rotate([0, 90, 0]) {
                mount_block();
            }
        }
    }
    
    // Right Wheel + Mounting Block
    translate([wheel_spacing/2, 0, wheel_z_position]) {
        wheel();
        // Mounting block on inner side of wheel
        translate([-wheel_outer_diameter/2 - mount_block_width/2, 0, 0]) {
            rotate([0, 90, 0]) {
                mount_block();
            }
        }
    }
    
    // Central Shaft
    translate([0, 0, wheel_z_position]) {
        cylinder(h=shaft_length, d=shaft_diameter, center=true);
    }
    
    // Drum Assembly (between wheels)
    translate([0, 0, wheel_z_position]) {
        drum_assembly();
    }
}