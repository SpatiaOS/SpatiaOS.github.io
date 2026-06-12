// Parametric Rectangular Base with Lengthwise Ribs and Stepped Holes
// All dimensions in mm

// ---- Base Plate ----
base_length = 100;
base_width  = 30;
base_thick  = 5;

// ---- Lengthwise Ribs ----
rib_width   = 4;           // thickness of each rib
rib_height  = 3;           // height above top face of base
rib_spacing = 14;          // center-to-center distance of the two ribs
rib_y_pos   = rib_spacing / 2; // offset from centerline for each rib

// ---- Hole Layout (stepped: shallow counterbore + through hole) ----
// Hole positions relative to center of base
hole_left_x   = -35;
hole_left_y   = 0;
hole_right_x  = 35;
hole_right_y  = 2.5;       // stays clear of ribs

// ---- Stepped Hole Dimensions ----
outer_dia    = 8;          // diameter of shallow recess
outer_depth  = 2;          // depth of recess from top surface
inner_dia    = 5;          // diameter of through hole

// Resolution
$fn = 64;

// ---- Module: Stepped Hole (cut from top surface downward) ----
// Places outer recess and inner through hole, both centered on XY, with top at z=0.
// total_depth must equal base_thick.
module stepped_hole() {
    union() {
        // shallow counterbore: outer_depth tall, starts at top
        translate([0, 0, -outer_depth/2])
            cylinder(h = outer_depth, d = outer_dia, center = true);
        // through hole: full base thickness, centered at mid-depth
        translate([0, 0, -base_thick/2])
            cylinder(h = base_thick, d = inner_dia, center = true);
    }
}

// ---- Main Model ----
difference() {
    // Solid part: base plate plus two ribs on top
    union() {
        // Base plate centered at origin, top at z = +base_thick/2
        cube([base_length, base_width, base_thick], center = true);

        // Left rib (when viewed from above, running the full length)
        translate([0, -rib_y_pos, base_thick/2 + rib_height/2])
            cube([base_length, rib_width, rib_height], center = true);

        // Right rib
        translate([0,  rib_y_pos, base_thick/2 + rib_height/2])
            cube([base_length, rib_width, rib_height], center = true);
    }

    // Cutouts: stepped holes at designated locations, referenced from top surface
    // Left hole
    translate([hole_left_x, hole_left_y, base_thick/2])
        stepped_hole();

    // Two right holes
    translate([hole_right_x,  hole_right_y, base_thick/2])
        stepped_hole();
    translate([hole_right_x, -hole_right_y, base_thick/2])
        stepped_hole();
}