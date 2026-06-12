// Ribbed base plate with stepped holes

// --- Base dimensions ---
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;
main_extrusion_depth = 0.0288;

// --- Rib parameters ---
rib_edge_offset = 0.0635;           // left/right edge offset from base
rib_footprint_length = 0.162037;   // overall paired rib footprint in length direction
rib_height = 0.017308;             // rib height above base top surface
rib_extrusion_depth = 0.0173;
rib_thickness = 0.035;             // individual rib wall thickness (length dir)

// --- Stepped hole positions and radii ---
h1_x = 0.0352;  h1_y = 0.7072;  h1_r = 0.013;
h2_x = 0.1433;  h2_y = 0.0577;  h2_r = 0.0173;
h3_x = 0.2538;  h3_y = 0.7072;  h3_r = 0.013;

// --- Stepped hole depth stages (z relative to base underside at z=0) ---
upper_recess_z_bot = 0.0057;      // bottom of upper recess above base underside
upper_recess_z_top = 0.0288;      // top of upper recess
upper_recess_depth = 0.0231;       // vertical extent of upper recess
deeper_cut_z_bot = -0.1154;       // bottom of deeper through-hole
deeper_cut_z_top = 0.0288;        // top of deeper through-hole
deeper_cut_depth = 0.1442;        // vertical extent of deeper cut

// Through-hole radius as fraction of counterbore radius (adjust for step geometry)
through_hole_ratio = 0.6;

$fn = 100;
eps = 0.001;

// Module: stepped hole with upper counterbore and deeper through-hole
module stepped_hole(x, y, r) {
    // Upper counterbore (wider recess, shallow)
    translate([x, y, upper_recess_z_bot])
        cylinder(h = upper_recess_depth + eps, r = r);
    // Deeper through-hole (narrower, extends below base underside)
    translate([x, y, deeper_cut_z_bot])
        cylinder(h = deeper_cut_depth + eps, r = r * through_hole_ratio);
}

// Main model
difference() {
    // Solid body: base plate + two ribs
    union() {
        // Rectangular base
        cube([base_length, base_width, base_height]);

        // Left lengthwise rib (full width direction)
        translate([rib_edge_offset, 0, base_height])
            cube([rib_thickness, base_width, rib_height]);

        // Right lengthwise rib (full width direction)
        translate([base_length - rib_edge_offset - rib_thickness, 0, base_height])
            cube([rib_thickness, base_width, rib_height]);
    }

    // Three stepped circular removed features
    stepped_hole(h1_x, h1_y, h1_r);
    stepped_hole(h2_x, h2_y, h2_r);
    stepped_hole(h3_x, h3_y, h3_r);
}