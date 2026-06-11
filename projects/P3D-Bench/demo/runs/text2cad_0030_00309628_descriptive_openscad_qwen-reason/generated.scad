// ==========================================
// PARAMETRIC DIMENSIONS
// ==========================================
// Base sheet geometry
plate_width = 120;
plate_depth = 80;
plate_thickness = 2;

// Upright wall geometry (spans full width along back edge)
wall_thickness = 5;
wall_height = 45;

// Floor plate rectangular void (through-cut)
floor_void_width = 25;
floor_void_depth = 35;
floor_void_x = -20;
floor_void_y = -5;

// Wall void 1 (lower rectangular opening)
wall_void1_width = 18;
wall_void1_height = 12;
wall_void1_z_offset = 3;
wall_void1_x = -25;

// Wall void 2 (higher rectangular opening)
wall_void2_width = 12;
wall_void2_height = 8;
wall_void2_z_offset = 22;
wall_void2_x = 15;

// Wall round through-hole
wall_hole_diameter = 10;
wall_hole_x = 0;
wall_hole_z = 32;

// Global mesh resolution for curved surfaces
$fn = 80;

// ==========================================
// REUSABLE MODULES
// ==========================================
module base_sheet() {
    translate([0, 0, plate_thickness / 2])
        cube([plate_width, plate_depth, plate_thickness], center = true);
}

module upright_wall() {
    translate([0, plate_depth / 2 - wall_thickness / 2, plate_thickness + wall_height / 2])
        cube([plate_width, wall_thickness, wall_height], center = true);
}

module floor_void() {
    translate([floor_void_x, floor_void_y, plate_thickness / 2])
        cube([floor_void_width, floor_void_depth, plate_thickness + 1], center = true);
}

module wall_void_1() {
    translate([wall_void1_x, plate_depth / 2 - wall_thickness / 2, plate_thickness + wall_void1_z_offset + wall_void1_height / 2])
        cube([wall_void1_width, wall_thickness + 1, wall_void1_height], center = true);
}

module wall_void_2() {
    translate([wall_void2_x, plate_depth / 2 - wall_thickness / 2, plate_thickness + wall_void2_z_offset + wall_void2_height / 2])
        cube([wall_void2_width, wall_thickness + 1, wall_void2_height], center = true);
}

module wall_hole() {
    translate([wall_hole_x, plate_depth / 2 - wall_thickness / 2, plate_thickness + wall_hole_z])
        rotate([90, 0, 0])
            cylinder(h = wall_thickness + 1, d = wall_hole_diameter, center = true);
}

// ==========================================
// MAIN MODEL ASSEMBLY
// ==========================================
difference() {
    union() {
        base_sheet();
        upright_wall();
    }
    floor_void();
    wall_void_1();
    wall_void_2();
    wall_hole();
}