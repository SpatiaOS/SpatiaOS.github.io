// Parameters
box_width = 100;
box_depth = 80;
box_height = 50;
wall_thickness = 4;
floor_thickness = 4;

// Horizontal cut parameters (Front face)
horiz_cut_width = 60;
horiz_cut_height = 15;
horiz_cut_z_offset = 12;

// Vertical cut parameters (Right face)
vert_cut_width = 25;
vert_cut_height = 35;

// Internal ledge parameters (Left face)
ledge_width = 8;
ledge_thickness = 2;
ledge_z_offset = 20;

$fn = 100;

// Main enclosure module
module enclosure() {
    union() {
        difference() {
            // Main outer body
            cube([box_width, box_depth, box_height]);
            
            // Hollow interior creating the open top and wall rim
            translate([wall_thickness, wall_thickness, floor_thickness])
                cube([box_width - 2 * wall_thickness, box_depth - 2 * wall_thickness, box_height]);
                
            // Centered horizontal rectangular opening on the front side (y = 0)
            // Positioned above the lower edge
            translate([(box_width - horiz_cut_width) / 2, -1, floor_thickness + horiz_cut_z_offset])
                cube([horiz_cut_width, wall_thickness + 2, horiz_cut_height]);
                
            // Taller vertical through opening on the adjacent right side (x = box_width)
            // Rising from the underside region
            translate([box_width - wall_thickness - 1, (box_depth - vert_cut_width) / 2, -1])
                cube([wall_thickness + 2, vert_cut_width, vert_cut_height + 1]);
        }
        
        // Thin solid ledge/shelf-like rib along the inside left wall
        translate([wall_thickness, wall_thickness, floor_thickness + ledge_z_offset])
            cube([ledge_width, box_depth - 2 * wall_thickness, ledge_thickness]);
    }
}

// Generate the model
enclosure();