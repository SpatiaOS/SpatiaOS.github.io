// Global Curve Resolution
$fn = 120;

// ------------------------------
// Parametric Dimension Definitions
// ------------------------------
// Main Body Dimensions
upper_outer_dia = 60;       // Outer diameter of upper vertical sleeve
upper_height = 100;         // Total height of upper vertical sleeve
lower_outer_dia = 45;       // Outer diameter of horizontal side cylinder
lower_length = 70;          // Total length of horizontal side cylinder
lower_center_z = 30;        // Z offset of side cylinder centerline from upper sleeve base
intersection_overlap = 5;   // Overlap distance between the two joined cylinders at their joint

// Internal Stepped Bore Parameters
bore_step1_dia = 40;        // Diameter of upper (larger) bore step
bore_step1_depth = 35;      // Depth of upper bore step from top face
bore_step2_dia = 28;        // Diameter of lower (smaller) bore step
bore_total_depth = 50;      // Total depth of full stepped bore from top face

// Radial Cutout Features
small_cut_dia = 8;          // Diameter of small radial through cuts on upper sleeve
small_cut_count = 3;        // Number of equally spaced small radial cuts
small_cut_z_offset = 60;    // Z height of small cut centerline from upper base

// Underside Relief Features
annular_relief_outer = 52;  // Outer diameter of underside annular ring relief
annular_relief_inner = 32;  // Inner diameter of underside annular ring relief
annular_relief_depth = 8;   // Depth of annular relief from bottom face
deep_undercut_dia = 22;     // Diameter of deep central underside cut
deep_undercut_depth = 40;   // Depth of central undercut from bottom face

// ------------------------------
// Module Definitions
// ------------------------------
// Main solid body: union of overlapping vertical and horizontal cylinders
module main_solid() {
    union() {
        // Upper vertical sleeve cylinder
        cylinder(h=upper_height, d=upper_outer_dia, center=false);
        // Horizontal side cylinder, aligned to intersect upper sleeve wall
        translate([
            (upper_outer_dia/2) + (lower_outer_dia/2) - intersection_overlap,
            0,
            lower_center_z
        ])
        rotate([0, 90, 0]) // Rotate to horizontal orientation along X axis
        cylinder(h=lower_length, d=lower_outer_dia, center=true);
    }
}

// Stepped concentric bore cut from top of upper sleeve
module stepped_bore_cut() {
    translate([upper_outer_dia/2, upper_outer_dia/2, upper_height])
    union() {
        // Upper larger bore step
        cylinder(h=bore_step1_depth, d=bore_step1_dia, center=false);
        // Lower smaller bore step extending deeper
        translate([0, 0, -bore_step1_depth])
        cylinder(h=bore_total_depth - bore_step1_depth, d=bore_step2_dia, center=false);
    }
}

// Underside relief cuts (annular ring + deep central cut)
module underside_cuts() {
    translate([upper_outer_dia/2, upper_outer_dia/2, 0])
    union() {
        // Annular ring relief
        difference() {
            cylinder(h=annular_relief_depth, d=annular_relief_outer, center=false);
            cylinder(h=annular_relief_depth + 1, d=annular_relief_inner, center=false);
        }
        // Deep central undercut penetrating multiple internal levels
        cylinder(h=deep_undercut_depth, d=deep_undercut_dia, center=false);
    }
}

// Equal spaced radial through cuts on upper sleeve circumference
module radial_cutouts() {
    for (i = [0 : small_cut_count - 1]) {
        rotate([0, 0, i * 360 / small_cut_count])
        translate([upper_outer_dia/2, 0, small_cut_z_offset])
        rotate([0, 90, 0])
        cylinder(h=upper_outer_dia + 1, d=small_cut_dia, center=true); // Extend fully through wall
    }
}

// ------------------------------
// Final Model Assembly
// ------------------------------
difference() {
    main_solid();
    stepped_bore_cut();
    underside_cuts();
    radial_cutouts();
}