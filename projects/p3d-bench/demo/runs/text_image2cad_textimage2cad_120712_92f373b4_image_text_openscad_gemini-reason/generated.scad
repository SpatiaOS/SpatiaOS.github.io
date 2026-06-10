// Assembly: Pebble-shaped Enclosure
// Consists of three parts: base_cover, cover_plate, and housing_cover stacked vertically.

// --- Parameters ---
// Base Cover Dimensions
base_length = 303.9;
base_width = 159.5;
base_height = 72.0;
base_ellipsoid_height = 119.0; // Calculated to match top profile with cover plate

// Cover Plate Dimensions
plate_length = 241.82;
plate_width = 126.86;
plate_height = 6.0;

// Housing Cover Dimensions
housing_length = 227.4;
housing_width = 119.7;
housing_height = 50.0;
housing_ellipsoid_height = 60.0; // Calculated to provide the correct top flat recess area

// Resolution
$fn = 100;

// --- Modules ---

// 1. Base Cover (Lower Dome)
module base_cover() {
    difference() {
        // Main dome body truncated at z = base_height
        intersection() {
            scale([base_length / 2, base_width / 2, base_ellipsoid_height]) 
                sphere(r = 1);
            translate([0, 0, base_height / 2]) 
                cube([base_length + 10, base_width + 10, base_height], center = true);
        }
        
        // 4 cylindrical recesses on the top deck (hidden internal features)
        // Representing the 4 cylindrical faces at r=6mm, h=8mm
        for(x = [-10, 10]) {
            for(y = [-10, 10]) {
                translate([x, y, base_height - 8]) 
                    cylinder(h = 8.01, r = 6, center = false);
            }
        }
    }
}

// 2. Cover Plate (Middle Parting Line Disc)
module cover_plate() {
    // Positioned exactly on top of the base cover
    translate([0, 0, base_height])
    scale([plate_length / 2, plate_width / 2, 1])
        cylinder(h = plate_height, r = 1, center = false);
}

// 3. Housing Cover (Upper Dome)
module housing_cover() {
    // Positioned on top of the cover plate
    translate([0, 0, base_height + plate_height])
    union() {
        difference() {
            // Main upper dome body truncated at z = housing_height
            intersection() {
                scale([housing_length / 2, housing_width / 2, housing_ellipsoid_height]) 
                    sphere(r = 1);
                translate([0, 0, housing_height / 2]) 
                    cube([housing_length + 10, housing_width + 10, housing_height], center = true);
            }
            
            // Oval recess on top panel
            translate([0, 0, housing_height - 1])
                scale([122 / 2, 62 / 2, 1])
                cylinder(h = 1.01, r = 1, center = false);
        }
        
        // Embossed features inside the top recess
        translate([0, 0, housing_height - 1]) {
            // 5 small circular-edge dot features
            for(i = [-2 : 1 : 2]) {
                translate([i * 6, 18, 0]) 
                    cylinder(h = 1.0, r = 0.8);
            }
            
            // Center Play/Pause button
            translate([0, 8, 0]) {
                translate([-2, 0, 0]) 
                    rotate([0, 0, -30]) 
                    cylinder(h = 1.0, r = 2.5, $fn = 3); // Triangle
                translate([2, 0, 0.5]) 
                    cube([1, 4, 1.0], center = true);    // Bar 1
                translate([4, 0, 0.5]) 
                    cube([1, 4, 1.0], center = true);    // Bar 2
            }
            
            // Left Minus button
            translate([-20, 0, 0.5]) {
                cube([6, 1.5, 1.0], center = true);
            }
            
            // Right Plus button
            translate([20, 0, 0.5]) {
                union() {
                    cube([6, 1.5, 1.0], center = true);
                    cube([1.5, 6, 1.0], center = true);
                }
            }
            
            // Bottom Power button
            translate([0, -12, 0]) {
                difference() {
                    cylinder(h = 1.0, r = 2.5);
                    translate([0, 0, -1]) 
                        cylinder(h = 3, r = 1.5);
                    translate([0, 2, 0]) 
                        cube([2, 4, 3], center = true); // Break the circle
                }
                translate([0, 1.5, 0.5]) 
                    cube([1, 3, 1.0], center = true);   // Inner line
            }
        }
        
        // Embossed Logo on the front slope
        translate([0, -57.5, 15])
            rotate([75, 0, 0])
            linear_extrude(1.5)
            text("harman/kardon", size = 4.5, halign = "center", valign = "center", font = "Arial:style=Bold");
    }
}

// --- Main Assembly ---
union() {
    color("#D0D0D0") base_cover();
    color("#A0A0A0") cover_plate();
    color("#E8E8E8") housing_cover();
}