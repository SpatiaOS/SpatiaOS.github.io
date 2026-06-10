// OpenSCAD Model: Wooden Barrel Assembly
// Based on provided image and text description

$fn = 60; // Resolution for curves

// --- Parameters ---

// Barrel Dimensions
barrel_length = 260;
barrel_radius_end = 70.6; // Matches cap diameter ~141.2
barrel_radius_bilge = 94.25; // Matches large hoop OD ~188.5
num_staves = 18;
stave_gap_angle = 1.5; // Gap between staves for visual separation

// Hoop Dimensions
hoop_large_od = 188.5;
hoop_small_od = 163.0;
hoop_thickness = 6; // Approximate cross-section thickness
hoop_profile_radius = 1.5; // Rounded profile radius
hoop_height = 22; // Axial height

// Cap Dimensions
cap_diameter = 141.2;
cap_thickness = 12;
cap_boss_radius = 10;
cap_boss_height = 3;

// Bung Dimensions
bung_flange_radius = 20;
bung_height = 15;
bung_hole_top = 23;
bung_hole_bore = 15;
bung_plug_radius = 16.25;
bung_plug_height = 14;

// Tap Dimensions
tap_knob_width = 30.5;
tap_knob_height = 45;
tap_handle_sphere_r = 10;
tap_handle_arm_len = 17;
tap_sleeve_outer_r = 4;
tap_sleeve_inner_r = 3;
tap_sleeve_len = 40;

// Stand Dimensions
stand_runner_len = 220;
stand_runner_width = 25;
stand_runner_height = 25;
stand_saddle_width = 170; // Width across barrel
stand_saddle_height = 45;
stand_saddle_thickness = 25; // Along barrel axis
// Saddle radius calculated to support barrel at bottom
// Barrel bottom ~ -94. Runners ~ -100. Saddle on runners.
// Saddle center Y ~ -70. Cutout center Y ~ -45.
// Barrel center Y = 0. Distance = 45.
// R_saddle - R_barrel = 45 => R_saddle = 94 + 45 = 139.
stand_saddle_radius = 140; 

// --- Modules ---

// 1. Barrel Body (Staves)
module barrel_assembly() {
    wedge_angle = 360 / num_staves;
    effective_wedge = wedge_angle - stave_gap_angle;

    module barrel_solid() {
        half_len = barrel_length / 2;
        polygon_points = [
            [barrel_radius_end, -half_len],
            [barrel_radius_end + 8, -half_len + 30],
            [barrel_radius_bilge, 0],
            [barrel_radius_end + 8, half_len - 30],
            [barrel_radius_end, half_len],
            [0, half_len],
            [0, -half_len]
        ];
        rotate_extrude() polygon(polygon_points);
    }

    module stave_mask_wedge() {
        // Creates a wedge from -eff/2 to eff/2
        rotate([0, 0, -45 + effective_wedge/2]) {
            intersection() {
                cube([300, 300, barrel_length + 20], center = true);
                rotate([0, 0, 90 - effective_wedge]) cube([300, 300, barrel_length + 20], center = true);
            }
        }
    }

    intersection() {
        barrel_solid();
        union() {
            for (i = [0 : num_staves - 1]) {
                rotate([0, 0, i * wedge_angle]) stave_mask_wedge();
            }
        }
    }
}

// 2. Hoops
module hoop(od) {
    radius = od / 2;
    
    // Profile: A tall thin rectangle with rounded corners
    // Outer edge at radius.
    // Width (radial) = hoop_thickness.
    // Height (axial) = hoop_height.
    // Base square for offset:
    // Width = hoop_thickness - 2*r
    // Height = hoop_height - 2*r
    
    base_w = hoop_thickness - 2 * hoop_profile_radius;
    base_h = hoop_height - 2 * hoop_profile_radius;
    
    // Ensure positive dimensions
    if (base_w > 0 && base_h > 0) {
        translate([radius - hoop_thickness, -hoop_height/2, 0]) {
            rotate_extrude() {
                offset(r = hoop_profile_radius) {
                    square([base_w, base_h]);
                }
            }
        }
    } else {
        // Fallback to circle if thickness is too small for offset
        translate([radius - hoop_thickness/2, 0, 0]) {
             rotate_extrude() {
                 circle(r = hoop_thickness/2);
             }
        }
    }
}

// 3. End Caps
module end_cap(decorated = false) {
    radius = cap_diameter / 2;
    
    // Main disc
    cylinder(h = cap_thickness, r = radius, center = false);
    
    // Rim (chamfered/filleted)
    // Top rim blend
    translate([0, 0, cap_thickness]) {
        rotate_extrude() {
            translate([radius, 0, 0]) {
                circle(r = 2); // Small blend
            }
        }
    }
    
    if (decorated) {
        // Embossed text "Delowa"
        translate([0, 0, cap_thickness + 0.1]) {
            linear_extrude(height = 1) {
                text("Delowa", size = 20, halign = "center", valign = "center", font = "Liberation Serif:style=Italic");
            }
        }
        
        // Locating boss on rear face (Z = 0)
        translate([0, 0, -cap_boss_height]) {
            cylinder(h = cap_boss_height, r = cap_boss_radius);
        }
    }
}

// 4. Bung Assembly
module bung_assembly() {
    // Flanged Collar
    difference() {
        union() {
            // Base Flange
            cylinder(h = 5, r = bung_flange_radius);
            // Upper Hub
            translate([0, 0, 5]) {
                cylinder(h = 10, r = 13.75);
            }
        }
        // Countersunk Hole
        translate([0, 0, 15]) {
            cylinder(h = 5, d1 = bung_hole_top, d2 = bung_hole_bore, center = false);
        }
        // Bore
        cylinder(h = 20, d = bung_hole_bore, center = false);
    }
    
    // Plug (Cap)
    translate([0, 0, 15]) {
        cylinder(h = bung_plug_height, r = bung_plug_radius);
        // Top blend
        translate([0, 0, bung_plug_height]) {
             rotate_extrude() {
                 translate([bung_plug_radius, 0, 0]) {
                     circle(r = 2);
                 }
             }
        }
    }
}

// 5. Tap Assembly
module tap_assembly() {
    // Spacer Sleeve
    // Oriented along Y axis (sticking out -Y)
    rotate([90, 0, 0]) { 
        translate([0, 0, -10]) { // Relative offset
             difference() {
                 cylinder(h = tap_sleeve_len, r = tap_sleeve_outer_r);
                 translate([0, 0, -1]) { 
                     cylinder(h = tap_sleeve_len + 2, r = tap_sleeve_inner_r);
                 }
             }
        }
    }
    
    // Knob
    // At the end of the sleeve
    translate([0, -50, 0]) { 
        hull() {
            sphere(r = 15);
            translate([0, 0, 20]) sphere(r = 12);
        }
    }
    
    // Ball Lever Handle
    translate([0, -20, 0]) {
        // Base disc
        cylinder(h = 2, r = 10.6);
        // Sphere
        translate([0, 0, 2]) sphere(r = 10);
        // Lever arm
        rotate([0, 90, 0]) {
            translate([10, 0, 0]) {
                cylinder(h = 17, r = 2.5);
            }
        }
    }
}

// 6. Stand (Cradle)
module stand_assembly() {
    runner_y = - (barrel_radius_bilge + 10); // Below barrel
    
    module rail() {
        cube([stand_runner_width, stand_runner_height, stand_runner_len], center = true);
    }
    
    // Two rails
    translate([-60, runner_y, 0]) rail();
    translate([60, runner_y, 0]) rail();
    
    module saddle() {
        difference() {
            cube([stand_saddle_width, stand_saddle_height, stand_saddle_thickness], center = true);
            // Cutout cylinder (along Z)
            translate([0, stand_saddle_height/2, 0]) {
                cylinder(h = stand_saddle_thickness + 10, r = stand_saddle_radius, center = true);
            }
        }
    }
    
    // Place two saddles on the rails
    // Saddle bottom on rail top
    saddle_y = runner_y + stand_runner_height/2 + stand_saddle_height/2;
    
    translate([0, saddle_y, -80]) saddle();
    translate([0, saddle_y, 80]) saddle();
    
    // Key Bar (Cross brace)
    translate([0, runner_y - stand_runner_height, 0]) {
        rotate([0, 90, 0]) {
             // Trapezoidal prism approximation
             hull() {
                 cube([25, 25, 189], center = true);
                 // Tapered ends could be added, but cube is sufficient for structure
             }
        }
    }
}

// --- Main Assembly ---

rotate([60, 0, 30]) { // Isometric view rotation
    // 1. Stand
    stand_assembly();
    
    // 2. Barrel Body
    barrel_assembly();
    
    // 3. Hoops
    hoop(hoop_large_od);
    translate([0, 0, 40]) hoop(hoop_large_od);
    translate([0, 0, -40]) hoop(hoop_large_od);
    translate([0, 0, 100]) hoop(hoop_small_od);
    translate([0, 0, -100]) hoop(hoop_small_od);
    
    // 4. End Caps
    translate([0, 0, barrel_length/2]) {
        rotate([180, 0, 0]) { 
             end_cap(decorated = false);
        }
    }
    translate([0, 0, -barrel_length/2]) {
        end_cap(decorated = true);
    }
    
    // 5. Bung
    translate([0, barrel_radius_bilge, 0]) {
        rotate([90, 0, 0]) { 
             bung_assembly();
        }
    }
    
    // 6. Tap
    // Position on side, near decorated end
    translate([0, -barrel_radius_bilge, -barrel_length/2 + 50]) {
        rotate([0, 180, 0]) {
            tap_assembly();
        }
    }
}