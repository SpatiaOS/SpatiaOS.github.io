// Parameters for the base sheet
base_length = 150;
base_width = 80;
base_thickness = 2;

// Parameters for the upright wall
wall_height = 60;
wall_thickness = 4;

// Parameters for the floor cut
floor_cut_length = 50;
floor_cut_width = 40;
floor_cut_x = 20;
floor_cut_y = 15;

// Parameters for the lower wall cut
wall_cut_lower_length = 40;
wall_cut_lower_height = 15;
wall_cut_lower_x = 10;
wall_cut_lower_z = 5; // Height above the top face of the base

// Parameters for the higher wall cut
wall_cut_upper_length = 25;
wall_cut_upper_height = 10;
wall_cut_upper_x = 65;
wall_cut_upper_z = 35; // Height above the top face of the base

// Parameters for the wall hole
wall_hole_diameter = 15;
wall_hole_x = 120;
wall_hole_z = 30; // Height above the top face of the base

// Resolution and boolean operation tolerance
$fn = 100;
eps = 0.01; // Small overlap to ensure manifold geometry during cuts

// Module: Main solid geometry before cuts
module solid_structure() {
    union() {
        // Thin rectangular base sheet
        cube([base_length, base_width, base_thickness]);

        // Single solid upright wall along the back edge
        translate([0, base_width - wall_thickness, base_thickness]) {
            cube([base_length, wall_thickness, wall_height]);
        }
    }
}

// Module: All void volumes to be subtracted
module void_cuts() {
    // Rectangular cut through the floor plate
    translate([floor_cut_x, floor_cut_y, -eps]) {
        cube([floor_cut_length, floor_cut_width, base_thickness + (2 * eps)]);
    }

    // Lower rectangular opening in the wall
    translate([wall_cut_lower_x, base_width - wall_thickness - eps, base_thickness + wall_cut_lower_z]) {
        cube([wall_cut_lower_length, wall_thickness + (2 * eps), wall_cut_lower_height]);
    }

    // Smaller, higher rectangular opening in the wall
    translate([wall_cut_upper_x, base_width - wall_thickness - eps, base_thickness + wall_cut_upper_z]) {
        cube([wall_cut_upper_length, wall_thickness + (2 * eps), wall_cut_upper_height]);
    }

    // Round through-hole in the wall
    translate([wall_hole_x, base_width - wall_thickness - eps, base_thickness + wall_hole_z]) {
        // Rotate cylinder to align with the Y-axis (cutting through the wall thickness)
        rotate([-90, 0, 0]) {
            cylinder(h = wall_thickness + (2 * eps), d = wall_hole_diameter);
        }
    }
}

// Main Assembly: Subtract voids from the solid structure
difference() {
    solid_structure();
    void_cuts();
}