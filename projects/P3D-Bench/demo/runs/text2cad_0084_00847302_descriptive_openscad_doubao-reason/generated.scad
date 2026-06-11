// Global resolution setting
$fn = 64;

// ==============================
// Parametric Dimension Definitions
// ==============================
// Envelope Dimensions (mm)
outer_length = 120;   // X-axis size of enclosure
outer_width = 90;     // Y-axis size of enclosure
outer_height = 60;    // Z-axis total height of enclosure
wall_thickness = 4;   // Thickness of all exterior walls
rim_height = 6;       // Height of top rim surrounding the open top

// Horizontal Recess Parameters (on +X front face)
horiz_recess_width = 50;
horiz_recess_height = 12;
horiz_recess_bottom_gap = 18; // Distance from enclosure base to bottom of recess

// Vertical Opening Parameters (on +Y side face)
vert_opening_width = 25;
vert_opening_height = 35; // Total height, extends upward from enclosure base

// Internal Ledge Parameters (mounted on -X interior wall)
ledge_depth = 12;
ledge_thickness = 2.5;
ledge_top_height = 28; // Height of ledge top surface from enclosure base

// ==============================
// Module Definitions
// ==============================
// Generates hollow enclosure shell with top rim
module enclosure_shell() {
    difference() {
        // Full outer solid block
        cube([outer_length, outer_width, outer_height], center=true);
        
        // Remove internal cavity, leaving top rim intact
        translate([0, 0, -rim_height/2])
        cube([
            outer_length - 2*wall_thickness,
            outer_width - 2*wall_thickness,
            outer_height - rim_height
        ], center=true);
    }
}

// Generates all subtractive side cut geometry
module side_cut_features() {
    union() {
        // Horizontal recess on front (+X) face
        translate([
            outer_length/2,
            0,
            (-outer_height/2) + horiz_recess_bottom_gap + horiz_recess_height/2
        ])
        cube([wall_thickness + 1, horiz_recess_width, horiz_recess_height], center=true);
        
        // Vertical through opening on right (+Y) face
        translate([
            0,
            outer_width/2,
            (-outer_height/2) + vert_opening_height/2
        ])
        cube([vert_opening_width, wall_thickness + 1, vert_opening_height], center=true);
    }
}

// Generates internal shelf ledge mounted to rear interior wall
module internal_shelf_ledge() {
    translate([
        (-outer_length/2) + wall_thickness + ledge_depth/2,
        0,
        (-outer_height/2) + ledge_top_height + ledge_thickness/2
    ])
    cube([
        ledge_depth,
        outer_width - 2*wall_thickness,
        ledge_thickness
    ], center=true);
}

// ==============================
// Final Model Assembly
// ==============================
union() {
    // Base enclosure with side features subtracted
    difference() {
        enclosure_shell();
        side_cut_features();
    }
    
    // Add internal ledge feature
    internal_shelf_ledge();
}