// Parameters
base_length = 303.9;
base_width = 159.5;
base_height = 72.0;

housing_length = 227.4;
housing_width = 119.7;
housing_height = 50.0;

plate_length = 241.82;
plate_width = 126.86;
plate_thickness = 6.0;

boss_radius = 6.0;
boss_height = 8.0;

panel_length = 80;
panel_width = 50;
panel_depth = 2;
dot_radius = 2;

$fn = 100;

// Helper module: oval dome
module oval_dome(length, width, height, wall_thickness) {
    scale([length/2, width/2, height])
        difference() {
            sphere(r=1);
            translate([0, 0, -1])
                cube([2, 2, 2], center=true);
        }
}

// Helper module: flat oval disc
module oval_disc(length, width, thickness) {
    linear_extrude(height=thickness, center=true)
        scale([length/2, width/2, 1])
            circle(r=1);
}

// Base cover (lower dome)
module base_cover() {
    difference() {
        oval_dome(base_length, base_width, base_height, 3);
        
        // Flatten top deck
        translate([0, 0, base_height - 10])
            cube([base_length + 10, base_width + 10, 20], center=true);
    }
    
    // Top deck with boss
    translate([0, 0, base_height - 10]) {
        difference() {
            linear_extrude(height=10)
                scale([base_length/2, base_width/2, 1])
                    circle(r=1);
            
            translate([0, 0, 10 - boss_height])
                cylinder(r=boss_radius, h=boss_height + 1);
        }
    }
}

// Housing cover (upper dome with control panel)
module housing_cover() {
    translate([0, 0, base_height + plate_thickness]) {
        difference() {
            oval_dome(housing_length, housing_width, housing_height, 3);
            
            // Recessed control panel
            translate([-housing_length/4, 0, housing_height - panel_depth])
                linear_extrude(height=panel_depth + 1)
                    scale([panel_length/2, panel_width/2, 1])
                        circle(r=1);
        }
        
        // Control panel features (5 dots in cross pattern + center)
        translate([-housing_length/4, 0, housing_height - panel_depth]) {
            // Center dot
            translate([0, 0, -1])
                cylinder(r=dot_radius, h=1);
            // Top dot
            translate([0, 15, -1])
                cylinder(r=dot_radius, h=1);
            // Bottom dot
            translate([0, -15, -1])
                cylinder(r=dot_radius, h=1);
            // Left dot
            translate([-15, 0, -1])
                cylinder(r=dot_radius, h=1);
            // Right dot
            translate([15, 0, -1])
                cylinder(r=dot_radius, h=1);
        }
    }
}

// Cover plate (thin oval disc at parting line)
module cover_plate() {
    translate([0, 0, base_height])
        oval_disc(plate_length, plate_width, plate_thickness);
}

// Unified assembly
base_cover();
cover_plate();
housing_cover();