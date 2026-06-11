// Units: millimeters

// Parameters
$fn = 96;
eps = 0.2;

// Base sheet
base_length = 120;
base_depth = 70;
base_thickness = 2;

// Upright edge wall
wall_length = base_length;
wall_thickness = 5;
wall_height = 40;
wall_overlap = 0.05;

// Floor through-opening
floor_cut_width = 34;
floor_cut_depth = 22;
floor_cut_x = -28;
floor_cut_y = 30;

// Lower wall rectangular through-opening
lower_wall_cut_width = 46;
lower_wall_cut_height = 13;
lower_wall_cut_x = -24;
lower_wall_cut_z_bottom = 3;

// Upper wall rectangular through-opening
upper_wall_cut_width = 24;
upper_wall_cut_height = 8;
upper_wall_cut_x = 24;
upper_wall_cut_z_bottom = 25;

// Round wall through-hole
wall_hole_diameter = 9;
wall_hole_x = 42;
wall_hole_z_center = 16;

// Derived positions
wall_y_center = base_depth - wall_thickness / 2;
wall_z_bottom = base_thickness - wall_overlap;
wall_total_height = wall_height + wall_overlap;

// Thin floor plate
module base_sheet() {
    translate([0, base_depth / 2, base_thickness / 2])
        cube([base_length, base_depth, base_thickness], center=true);
}

// Solid wall along rear edge
module upright_wall() {
    translate([0, wall_y_center, wall_z_bottom + wall_total_height / 2])
        cube([wall_length, wall_thickness, wall_total_height], center=true);
}

// Main solid before subtractive cuts
module solid_body() {
    union() {
        base_sheet();
        upright_wall();
    }
}

// Rectangular opening through horizontal sheet
module floor_rect_cut() {
    translate([floor_cut_x, floor_cut_y, base_thickness / 2])
        cube([floor_cut_width, floor_cut_depth, base_thickness + 2 * eps], center=true);
}

// Rectangular opening through wall thickness
module wall_rect_cut(x, z_bottom, w, h) {
    translate([x, wall_y_center, base_thickness + z_bottom + h / 2])
        cube([w, wall_thickness + 2 * eps, h], center=true);
}

// Round opening through wall thickness
module wall_round_hole() {
    translate([wall_hole_x, wall_y_center, base_thickness + wall_hole_z_center])
        rotate([90, 0, 0])
            cylinder(h=wall_thickness + 2 * eps, d=wall_hole_diameter, center=true);
}

// Final model with all voids removed
difference() {
    solid_body();

    // Floor cut
    floor_rect_cut();

    // Lower wall cut
    wall_rect_cut(
        lower_wall_cut_x,
        lower_wall_cut_z_bottom,
        lower_wall_cut_width,
        lower_wall_cut_height
    );

    // Upper wall cut
    wall_rect_cut(
        upper_wall_cut_x,
        upper_wall_cut_z_bottom,
        upper_wall_cut_width,
        upper_wall_cut_height
    );

    // Round wall hole
    wall_round_hole();
}