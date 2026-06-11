// Parameters
base_length = 100;
base_width = 60;
base_thickness = 2;

wall_height = 40;
wall_thickness = 2;
wall_position = 0; // Along y=0 edge

// Base sheet rectangular cuts (through material)
base_cut1 = [30, 15, 10, 8]; // [x, y, width, height]
base_cut2 = [60, 35, 15, 10];

// Wall rectangular openings (through wall thickness)
wall_opening1 = [25, 5, 20, 15]; // [x, z_from_base, width, height]
wall_opening2 = [70, 20, 12, 10];

// Wall round through-hole
hole_x = 50;
hole_z = 30;
hole_radius = 4;

$fn = 100;

// Base sheet with cuts
module base_with_cuts() {
    difference() {
        // Main base sheet
        cube([base_length, base_width, base_thickness]);
        
        // Subtract rectangular cuts
        translate([base_cut1[0], base_cut1[1], -0.1])
            cube([base_cut1[2], base_cut1[3], base_thickness + 0.2]);
        translate([base_cut2[0], base_cut2[1], -0.1])
            cube([base_cut2[2], base_cut2[3], base_thickness + 0.2]);
    }
}

// Wall with openings and hole
module wall_with_features() {
    difference() {
        // Main wall
        translate([0, wall_position, base_thickness])
            cube([base_length, wall_thickness, wall_height]);
        
        // Subtract lower rectangular opening
        translate([wall_opening1[0], wall_position - 0.1, base_thickness + wall_opening1[1]])
            cube([wall_opening1[2], wall_thickness + 0.2, wall_opening1[3]]);
        
        // Subtract upper rectangular opening
        translate([wall_opening2[0], wall_position - 0.1, base_thickness + wall_opening2[1]])
            cube([wall_opening2[2], wall_thickness + 0.2, wall_opening2[3]]);
        
        // Subtract round through-hole
        translate([hole_x, wall_position - 0.1, base_thickness + hole_z])
            rotate([-90, 0, 0])
                cylinder(h = wall_thickness + 0.2, r = hole_radius);
    }
}

// Main assembly
union() {
    base_with_cuts();
    wall_with_features();
}