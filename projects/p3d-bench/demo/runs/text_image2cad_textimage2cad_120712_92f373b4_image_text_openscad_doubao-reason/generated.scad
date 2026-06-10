// Global Configuration
$fn = 100;
part_gap = 0.1; // Small gap between parts for clean manifold geometry

// ==============================
// Part Dimension Parameters
// ==============================
// Base Cover (lower dome)
base_length = 304;
base_width = 159;
base_height = 72;
base_boss_radius = 6;
base_boss_height = 8;
boss_spacing_x = 75;
boss_spacing_y = 35;

// Cover Plate (middle thin disc)
plate_length = 242;
plate_width = 127;
plate_thickness = 6;

// Housing Cover (upper dome)
housing_length = 227;
housing_width = 120;
housing_height = 50;
control_recess_length = 120;
control_recess_width = 60;
recess_depth = 2;
dot_radius = 3;
dot_spacing = 10;

// ==============================
// Helper Modules
// ==============================
module oval_half_dome(length, width, height, base_z = 0) {
    // Generates smooth elongated half-ellipsoid dome, flat base at z=base_z, peak at z=base_z + height
    translate([0, 0, base_z])
    intersection() {
        scale([length/2, width/2, height])
        sphere(r=1, center=true);
        // Keep only upper half of scaled sphere to create flat base
        translate([-length/2 - 1, -width/2 -1, 0])
        cube([length + 2, width + 2, height + 1]);
    }
}

module oval_solid(length, width, thickness, base_z = 0) {
    // Generates thin flat oval disc
    translate([0, 0, base_z])
    linear_extrude(height=thickness, center=false)
    scale([length, width])
    circle(r=0.5, center=true);
}

// ==============================
// Part Definitions
// ==============================
module base_cover() {
    color("silver")
    difference() {
        // Main curved base body
        oval_half_dome(base_length, base_width, base_height);
        // Cut flat top deck for cover plate seating
        translate([-plate_length/2 - 1, -plate_width/2 - 1, base_height - base_boss_height])
        cube([plate_length + 2, plate_width + 2, base_boss_height + 2]);
    }
    // Add 4 locating bosses on top deck
    color("silver")
    for (x = [-boss_spacing_x, boss_spacing_x], y = [-boss_spacing_y, boss_spacing_y]) {
        translate([x, y, base_height - base_boss_height])
        cylinder(h=base_boss_height, r=base_boss_r, center=false);
    }
}

module cover_plate() {
    color("lightgray")
    oval_solid(plate_length, plate_width, plate_thickness, base_z = base_height + part_gap);
}

module housing_cover() {
    housing_base_z = base_height + part_gap + plate_thickness + part_gap;
    color("silver")
    difference() {
        // Main upper dome body
        oval_half_dome(housing_length, housing_width, housing_height, base_z = housing_base_z);
        // Oval control panel recess on top surface
        translate([0, 0, housing_base_z + housing_height - recess_depth])
        linear_extrude(height=recess_depth + 1, center=false)
        scale([control_recess_length, control_recess_width])
        circle(r=0.5, center=true);
        // 5 status dot indicators in recess
        for (i = [-2, -1, 0, 1, 2]) {
            translate([i * dot_spacing, -15, housing_base_z + housing_height - recess_depth - 0.1])
            cylinder(h=recess_depth + 0.2, r=dot_radius, center=false);
        }
        // Simplified control symbols in recess
        // Minus volume
        translate([-40, 0, housing_base_z + housing_height - recess_depth - 0.1])
        cube([10, 3, recess_depth + 0.2], center=true);
        // Plus volume
        translate([40, 10, housing_base_z + housing_height - recess_depth - 0.1])
        union() {
            cube([10, 3, recess_depth + 0.2], center=true);
            cube([3, 10, recess_depth + 0.2], center=true);
        }
        // Play/Pause
        translate([0, 10, housing_base_z + housing_height - recess_depth - 0.1])
        linear_extrude(height=recess_depth + 0.2)
        polygon(points=[[-5, -3], [5, 0], [-5, 3]]);
        // Power button
        translate([0, 0, housing_base_z + housing_height - recess_depth - 0.1])
        linear_extrude(height=recess_depth + 0.2)
        difference() {
            circle(r=4, $fn=30);
            square([2, 5], center=true);
        }
        // Bluetooth symbol
        translate([40, 0, housing_base_z + housing_height - recess_depth - 0.1])
        linear_extrude(height=recess_depth + 0.2)
        polygon(points=[[-2, -3], [2, 0], [-2, 3], [-2, -1], [1, 0], [-2, 1]]);
    }
    // Harman Kardon branding embossed on side
    color("darkgray")
    translate([0, -housing_width/2 + 1, housing_base_z + housing_height/2])
    rotate([90, 0, 0])
    linear_extrude(height=1, center=false)
    text("harman/kardon", size=8, font="Arial:Bold", halign="center", valign="center");
}

// ==============================
// Main Assembly
// ==============================
union() {
    base_cover();
    cover_plate();
    housing_cover();
}