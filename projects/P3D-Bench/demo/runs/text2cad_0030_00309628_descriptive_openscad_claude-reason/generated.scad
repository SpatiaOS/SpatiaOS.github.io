// === Parameters ===

// Base sheet dimensions
base_length = 120;       // X extent of the base plate
base_width  = 60;        // Y extent of the base plate
base_thick  = 2;         // Z thickness of the thin sheet

// Upright wall dimensions (along one full edge)
wall_thick  = 4;         // Y thickness of the wall strip
wall_height = 50;        // Z height of the wall above base top face
wall_length = base_length; // wall spans the full edge

// Floor plate rectangular cutout
floor_cut_length = 40;   // X size of floor opening
floor_cut_width  = 25;   // Y size of floor opening
floor_cut_x      = 35;   // X offset from origin to cutout start
floor_cut_y      = 18;   // Y offset from origin to cutout start

// Lower wall rectangular opening (larger, near bottom)
lower_opening_width  = 50;  // X span of lower wall opening
lower_opening_height = 20;  // Z span of lower wall opening
lower_opening_x      = 10;  // X offset from wall left edge
lower_opening_z      = 2;   // Z offset above base top face (near bottom)

// Upper wall rectangular opening (smaller, sits higher)
upper_opening_width  = 25;  // X span of upper wall opening
upper_opening_height = 12;  // Z span of upper wall opening
upper_opening_x      = 70;  // X offset from wall left edge
upper_opening_z      = 28;  // Z offset above base top face (higher up)

// Round through-hole in the wall
hole_diameter = 10;       // Diameter of circular hole
hole_x        = 100;      // X position center of hole
hole_z        = 30;       // Z position center of hole (above base top)

// Resolution
$fn = 80;

// === Modules ===

// Thin rectangular base sheet
module base_sheet() {
    cube([base_length, base_width, base_thick]);
}

// Solid upright wall along one full edge (Y=0 edge)
module upright_wall() {
    // Wall sits on top of the base sheet along the Y=0 edge
    translate([0, 0, base_thick])
        cube([wall_length, wall_thick, wall_height]);
}

// Rectangular cutout through the floor plate
module floor_cutout() {
    translate([floor_cut_x, floor_cut_y, -0.5])
        cube([floor_cut_length, floor_cut_width, base_thick + 1]);
}

// Lower rectangular opening through the wall
module lower_wall_opening() {
    translate([lower_opening_x, -0.5, base_thick + lower_opening_z])
        cube([lower_opening_width, wall_thick + 1, lower_opening_height]);
}

// Upper rectangular opening through the wall
module upper_wall_opening() {
    translate([upper_opening_x, -0.5, base_thick + upper_opening_z])
        cube([upper_opening_width, wall_thick + 1, upper_opening_height]);
}

// Round through-hole in the wall
module wall_hole() {
    translate([hole_x, wall_thick / 2, base_thick + hole_z])
        rotate([0, 0, 0])
        // Hole passes through wall thickness (Y direction)
        translate([0, 0, 0])
            rotate([90, 0, 0])
                cylinder(h = wall_thick + 2, d = hole_diameter, center = true);
}

// === Main Assembly ===

difference() {
    // Solid body: base sheet + upright wall
    union() {
        base_sheet();
        upright_wall();
    }

    // Subtractive features (all voids are removed material)
    floor_cutout();          // Through-cut in floor plate
    lower_wall_opening();    // Large rectangular opening low on wall
    upper_wall_opening();    // Smaller rectangular opening higher on wall
    wall_hole();             // Circular through-hole in wall
}