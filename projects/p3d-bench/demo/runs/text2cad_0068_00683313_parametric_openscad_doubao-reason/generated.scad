// Global Resolution Setting
$fn = 64;

// ==============================
// Parameter Definitions
// ==============================
// Main Base Dimensions
base_length = 0.5;      // Left-right (X) dimension
base_width = 0.4375;    // Front-back (Y) dimension
base_height = 0.09375;  // Vertical (Z) thickness

// Base Void Parameters
base_hole_x = 0.25;     // X position from left edge
base_hole_y = 0.1875;   // Y position from front edge
base_hole_r = 0.0938;   // Radius of through hole

// Back Strip Shared Parameters
back_strip_width = 0.0625;
back_strip_front_offset = 0.375; // Y start position from front edge

// Lower Underside Back Strip
lower_strip_z_min = -0.25;
lower_strip_z_max = 0; // Aligned to base underside

// Tall Back Edge Strip
tall_strip_z_min = -0.5;
tall_strip_z_max = 0.25;
tall_strip_hole_x = 0.125;
tall_strip_hole_y = 0.4375;
tall_strip_hole_r = 0.05;

// Upper Annular Collar Parameters
collar_x = 0.2501;
collar_y = 0.1876;
collar_outer_r = 0.0938;
collar_inner_r = 0.05;
collar_height = 0.0625;

// ==============================
// Main Model Construction
// ==============================
difference() {
    // Union of all solid components
    union() {
        // Main base plate
        cube([base_length, base_width, base_height]);

        // Lower underside back strip
        translate([0, back_strip_front_offset, lower_strip_z_min])
        cube([base_length, back_strip_width, lower_strip_z_max - lower_strip_z_min]);

        // Tall back edge strip
        translate([0, back_strip_front_offset, tall_strip_z_min])
        cube([base_length, back_strip_width, tall_strip_z_max - tall_strip_z_min]);

        // Upper annular collar outer wall
        translate([collar_x, collar_y, base_height])
        cylinder(h=collar_height, r=collar_outer_r);
    }

    // All void/hole cuts
    // Base plate through hole
    translate([base_hole_x, base_hole_y, -0.005])
    cylinder(h=base_height + 0.01, r=base_hole_r);

    // Tall back strip through hole
    translate([tall_strip_hole_x, tall_strip_hole_y, tall_strip_z_min - 0.01])
    cylinder(h=tall_strip_z_max - tall_strip_z_min + 0.02, r=tall_strip_hole_r);

    // Collar inner hole
    translate([collar_x, collar_y, base_height - 0.005])
    cylinder(h=collar_height + 0.01, r=collar_inner_r);
}