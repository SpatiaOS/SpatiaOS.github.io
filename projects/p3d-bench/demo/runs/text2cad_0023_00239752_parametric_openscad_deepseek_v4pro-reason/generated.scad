// Parametric dimensions (inches)
$fn = 50;

// Base solid
base_length  = 0.28896;
base_width   = 0.75;
base_height  = 0.028846;          // top face Z = base_height

// Ribs on top face
rib_height   = 0.017308;          // rise above base top
rib_edge_offset = 0.0635;         // left/right offset from base edges

// Two rib widths (equal); gap will be computed to fill the footprint
rib_width = 0.028846;             // same as base_height as a visual choice

// Footprint of rib array
footprint_x = base_length - 2 * rib_edge_offset;
rib_gap     = footprint_x - 2 * rib_width;

// Hole positions and radii (X from left edge, Y from front edge)
hole_specs = [
    [0.0352, 0.7072, 0.013],
    [0.1433, 0.0577, 0.0173],
    [0.2538, 0.7072, 0.013]
];

// Vertical stages common to all holes
recess_bottom_z = 0.0057;        // from base underside (Z=0)
recess_top_z    = 0.0288;
recess_height   = recess_top_z - recess_bottom_z;

deep_bottom_z   = -0.1154;
deep_top_z      = 0.0288;
deep_height     = deep_top_z - deep_bottom_z;

// Counterbore enlargement factor (recess radius = hole_radius * factor)
recess_radius_factor = 1.5;

// ------------------------------------------------------------
module base_with_ribs() {
    // Main plate
    cube([base_length, base_width, base_height]);
    
    // Left rib
    translate([rib_edge_offset, 0, base_height])
        cube([rib_width, base_width, rib_height]);
    // Right rib
    translate([rib_edge_offset + rib_width + rib_gap, 0, base_height])
        cube([rib_width, base_width, rib_height]);
}

module stepped_hole(x, y, hole_r) {
    recess_r = hole_r * recess_radius_factor;
    
    translate([x, y, recess_bottom_z])
        cylinder(r = recess_r, h = recess_height);
    
    translate([x, y, deep_bottom_z])
        cylinder(r = hole_r, h = deep_height);
}

difference() {
    base_with_ribs();
    for (spec = hole_specs) {
        stepped_hole(spec[0], spec[1], spec[2]);
    }
}