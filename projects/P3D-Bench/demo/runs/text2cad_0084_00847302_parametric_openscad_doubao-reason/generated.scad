// ==============================================
// Parameters (all dimensions in inches)
// ==============================================
outer_x = 0.75;    // Outer width (left-right axis)
outer_y = 0.625;   // Outer depth (front-back axis, front at Y=outer_y)
outer_z = 0.55;    // Outer height (base at Z=0, top at Z=0.55)
wall_thickness = 0.075; // Uniform wall thickness

// Front cutout parameters
front_cut_width = 0.5;
front_cut_side_margin = 0.125;
front_cut_z_low = 0.25;
front_cut_z_high = 0.45;

// Left side cutout parameters
left_cut_front_margin = 0.2;
left_cut_back_margin = 0.2;
left_cut_z_max = 0.5;

// Internal ledge parameters
ledge_width = 0.5;
ledge_side_margin = 0.125;
ledge_depth = 0.1;
ledge_thickness = 0.0125;

// Resolution setting for curved surfaces
$fn = 100;

// ==============================================
// Module Definitions
// ==============================================
module hollow_open_top_enclosure(ox, oy, oz, wall_t) {
    // Generates hollow rectangular enclosure with open top, straight vertical walls
    difference() {
        // Outer solid block
        cube([ox, oy, oz]);
        // Inner void, extended slightly above top to ensure full cut through
        translate([wall_t, wall_t, 0])
        cube([ox - 2*wall_t, oy - 2*wall_t, oz + 0.1]);
    }
}

// ==============================================
// Main Model Assembly
// ==============================================
union() {
    // Base enclosure with cutouts
    difference() {
        hollow_open_top_enclosure(outer_x, outer_y, outer_z, wall_thickness);
        
        // Front horizontal wall cut
        translate([
            front_cut_side_margin,
            outer_y - wall_thickness,
            front_cut_z_low
        ])
        cube([
            front_cut_width,
            wall_thickness,
            front_cut_z_high - front_cut_z_low
        ]);
        
        // Left side vertical opening
        translate([
            0,
            left_cut_back_margin,
            0
        ])
        cube([
            wall_thickness,
            outer_y - left_cut_front_margin - left_cut_back_margin,
            left_cut_z_max
        ]);
    }
    
    // Internal front ledge
    translate([
        ledge_side_margin,
        outer_y - wall_thickness - ledge_depth,
        0
    ])
    cube([ledge_width, ledge_depth, ledge_thickness]);
}