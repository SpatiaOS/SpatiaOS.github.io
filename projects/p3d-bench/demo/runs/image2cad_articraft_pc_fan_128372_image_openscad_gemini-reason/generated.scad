/*
 * Parametric 3D Computer Cooling Fan
 * 
 * This model generates a standard axial cooling fan (e.g., 120mm case fan).
 * It features a dual-flange square frame with rounded corners, mounting holes,
 * recessed corner pockets, a central cylindrical shroud, stator support struts,
 * and a rotor with swept aerodynamic blades.
 */

// --- Parameters ---

// Frame Dimensions
fan_size = 120;             // Outer width/length of the square frame
fan_thickness = 25;         // Total height/thickness of the fan
flange_thickness = 4.0;     // Thickness of the top and bottom mounting flanges
corner_radius = 5.0;        // Radius of the outer corners
hole_diameter = 4.5;        // Diameter of the mounting holes
hole_spacing = 105.0;       // Distance between centers of mounting holes
inner_diameter = 114.0;     // Inner diameter of the main air channel (shroud)

// Rotor & Stator Dimensions
hub_diameter = 42.0;        // Diameter of the central motor hub
blade_count = 7;            // Number of fan blades
blade_twist = -45;          // Twist angle for the blades (degrees)

// Resolution
$fn = 64;                   // Global fragment count for smooth curves


// --- Helper Modules ---

// Generates a square block with rounded corners
module rounded_box(size, r, h) {
    hull() {
        for(x = [-1, 1], y = [-1, 1]) {
            translate([x * (size/2 - r), y * (size/2 - r), 0])
                cylinder(r=r, h=h, center=true);
        }
    }
}

// Generates a single aerodynamic swept blade
module blade() {
    blade_h = fan_thickness - 2;
    blade_len = inner_diameter/2 - hub_diameter/2 + 2;
    
    // Intersect with the inner shroud cylinder to trim the blade tips perfectly
    intersection() {
        cylinder(d=inner_diameter - 1.5, h=blade_h, center=true);
        
        translate([0, 0, -blade_h/2])
            linear_extrude(height=blade_h, twist=blade_twist, slices=30)
                translate([hub_diameter/2 - 1, 0])
                    // 2D airfoil-like profile
                    polygon([
                        [0, -1.0],
                        [blade_len * 0.4, -4.0],
                        [blade_len, -5.0],
                        [blade_len, 3.0],
                        [blade_len * 0.4, 3.0],
                        [0, 1.5]
                    ]);
    }
}

// Generates the recessed triangular pockets on the top and bottom corners
module corner_pockets() {
    pocket_depth = 1.2;
    
    for(z = [fan_thickness/2 - pocket_depth/2 + 0.01, -fan_thickness/2 + pocket_depth/2 - 0.01]) {
        translate([0, 0, z]) {
            for(i = [0 : 90 : 270]) {
                rotate([0, 0, i]) {
                    difference() {
                        // Base area to cut out
                        translate([fan_size/2 - 14, fan_size/2 - 14, 0])
                            cube([28, 28, pocket_depth + 0.1], center=true);

                        // Leave material for the screw boss
                        translate([hole_spacing/2, hole_spacing/2, 0])
                            cylinder(d=hole_diameter + 7, h=pocket_depth + 1, center=true);

                        // Leave material for the inner cylindrical shroud
                        cylinder(d=inner_diameter + 4, h=pocket_depth + 1, center=true);

                        // Leave material for the outer rim
                        difference() {
                            cube([fan_size + 5, fan_size + 5, pocket_depth + 1], center=true);
                            cube([fan_size - 2.5, fan_size - 2.5, pocket_depth + 2], center=true);
                        }
                    }
                }
            }
        }
    }
}


// --- Main Components ---

// The outer casing/frame of the fan
module fan_frame() {
    difference() {
        // Main solid body
        rounded_box(fan_size, corner_radius, fan_thickness);

        // Central air channel
        cylinder(d=inner_diameter, h=fan_thickness + 2, center=true);

        // Side cutouts (removes material between top and bottom flanges)
        difference() {
            union() {
                cube([fan_size + 2, fan_size - 32, fan_thickness - 2*flange_thickness], center=true);
                cube([fan_size - 32, fan_size + 2, fan_thickness - 2*flange_thickness], center=true);
            }
            // Protect the inner shroud from being cut
            cylinder(d=inner_diameter + 3, h=fan_thickness, center=true);
        }

        // Mounting holes
        for(x = [-1, 1], y = [-1, 1]) {
            translate([x * hole_spacing/2, y * hole_spacing/2, 0])
                cylinder(d=hole_diameter, h=fan_thickness + 2, center=true);
        }

        // Top and bottom corner pockets
        corner_pockets();

        // Edge slits/notches (wire routing and structural details)
        for(i = [0 : 90 : 270]) {
            rotate([0, 0, i]) {
                translate([fan_size/2, 22, 0]) 
                    cube([4, 1.5, fan_thickness + 2], center=true);
            }
        }
    }
}

// The rotating part (hub and blades)
module fan_rotor() {
    // Main hub cylinder
    cylinder(d=hub_diameter, h=fan_thickness - 2, center=true);

    // Domed top for the hub
    translate([0, 0, (fan_thickness - 2)/2])
        scale([1, 1, 0.25])
            sphere(d=hub_diameter);

    // Blades array
    for(i = [0 : blade_count - 1]) {
        rotate([0, 0, i * (360 / blade_count)])
            blade();
    }
}

// The stationary motor mount and struts
module fan_stator() {
    stator_z_offset = -fan_thickness/2 + 1.5;
    
    // Motor base plate
    translate([0, 0, stator_z_offset])
        cylinder(d=hub_diameter - 2, h=3, center=true);
        
    // Support struts connecting hub to frame
    translate([0, 0, stator_z_offset]) {
        for(i = [0 : 3]) {
            rotate([0, 0, i * 90 + 45])
                translate([hub_diameter/2 - 1, -2.5, -1.5])
                    cube([inner_diameter/2 - hub_diameter/2 + 2, 5, 3]);
        }
    }
}


// --- Assembly ---

union() {
    color([0.4, 0.4, 0.45]) fan_frame();
    color([0.2, 0.2, 0.25]) fan_rotor();
    color([0.3, 0.3, 0.35]) fan_stator();
}