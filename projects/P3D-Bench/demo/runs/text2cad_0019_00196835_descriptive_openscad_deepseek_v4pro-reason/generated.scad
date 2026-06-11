// Parametric rail with extension block, top strip, and various recess cuts

// Main rail dimensions
rail_body_length = 100;   // length of the main rail body
rail_width = 20;          // width of the rail body
rail_height = 10;         // height of the main rail body

// Top layer dimensions (shallow, narrow)
top_thickness = 2;        // thickness of the top strip
top_width = 8;            // width of the top strip (narrower than rail)

// Extension block parameters
ext_length = 15;          // length of the wider extension block
ext_width = 30;           // width of the extension (wider than rail)
overlap = 5;              // distance the block overlaps the rail body
total_length = rail_body_length + ext_length - overlap; // overall part length

// Circular recess parameters
small_recess_dia = 4;       // diameter of small recesses at rail ends
small_recess_depth = top_thickness + 1; // recess depth (into top strip + 1mm into body)
large_recess_dia = 10;      // diameter of large shallow recess on extension
large_recess_depth = top_thickness + 2; // depth of large recess (into body)
deep_hole_dia = 5;          // diameter of the deep through cutout

// Positioning
recess_from_end = 10;       // distance from each end to the small recesses
large_recess_center_x = rail_body_length - overlap/2; // center of the overlapping area

$fn = 100; // resolution for circles

// Main solid body (rail + extension + top strip)
module main_assembly() {
    union() {
        // Main rail body, centered along Y and positioned on Z bottom
        translate([rail_body_length/2, 0, rail_height/2])
            cube([rail_body_length, rail_width, rail_height], center = true);
        // Extension block body, overlapping the rail end
        translate([rail_body_length - overlap + ext_length/2, 0, rail_height/2])
            cube([ext_length, ext_width, rail_height], center = true);
        // Continuous top strip across the full length
        translate([total_length/2, 0, rail_height + top_thickness/2])
            cube([total_length, top_width, top_thickness], center = true);
    }
}

// Subtractive features (recesses and deep hole)
module cutouts() {
    // Small circular recess near left end of top strip
    translate([recess_from_end, 0, rail_height + top_thickness])
        cylinder(h = small_recess_depth, d = small_recess_dia, center = false);
    // Small circular recess near right end of top strip
    translate([total_length - recess_from_end, 0, rail_height + top_thickness])
        cylinder(h = small_recess_depth, d = small_recess_dia, center = false);
    // Large shallow recess at the overlap area on the extension
    translate([large_recess_center_x, 0, rail_height + top_thickness])
        cylinder(h = large_recess_depth, d = large_recess_dia, center = false);
    // Deep through hole from top surface through the block and rail body
    translate([large_recess_center_x, 0, rail_height + top_thickness])
        cylinder(h = rail_height + top_thickness, d = deep_hole_dia, center = false);
}

// Final part
difference() {
    main_assembly();
    cutouts();
}