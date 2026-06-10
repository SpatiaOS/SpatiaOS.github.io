// Global Resolution Setting
$fn = 64;

// --------------------------
// Base Dimension Parameters
// --------------------------
base_length = 0.165891;    // X-axis span of main base
base_width = 0.325401;     // Y-axis span of main base
base_height = 0.408347;    // Total Z height of main base
main_extrusion_depth = 0.4083; // Working Z height for cut references

// --------------------------
// Top Square Recess Params
// --------------------------
recess_side = 0.089326;
recess_left_offset = 0.0383;
recess_front_offset = 0.0191;
recess_bottom_z = 0.319;
recess_top_z = main_extrusion_depth;
recess_depth = recess_top_z - recess_bottom_z;

// --------------------------
// Lower Opening Params
// --------------------------
lower_opening_width = 0.076565;
lower_opening_depth = 0.132416;
lower_opening_left_offset = 0.0447;
lower_opening_front_offset = -0.0303;
lower_opening_top_z = 0.319;

// --------------------------
// Upper Back Strip Cut Params
// --------------------------
back_strip_width = 0.114848;
back_strip_front_gap = 0.2106;
back_strip_bottom_z = 0.2807;
back_strip_top_z = main_extrusion_depth;

// --------------------------
// Shallow Base Section Params
// --------------------------
shallow_height = 0.0383;
shallow_total_width = 0.4339;
shallow_depth = 0.1148;
shallow_side_projection = 0.134;

// --------------------------
// Shallow Section Hole Params
// --------------------------
hole_radius = 0.0255;
hole_front_offset = 0.0574;
hole1_x = -0.069;
hole2_x = 0.2349;

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // Main base with all cut features
    difference() {
        // Base solid
        cube([base_length, base_width, main_extrusion_depth]);

        // Cut top square recess
        translate([recess_left_offset, recess_front_offset, recess_bottom_z])
        cube([recess_side, recess_side, recess_depth + 0.001]); // Small oversize ensures clean cut

        // Cut lower through opening
        translate([lower_opening_left_offset, lower_opening_front_offset, 0])
        cube([lower_opening_width, lower_opening_depth, lower_opening_top_z + 0.001]);

        // Cut upper back step strip
        translate([0, back_strip_front_gap, back_strip_bottom_z])
        cube([base_length, back_strip_width, (back_strip_top_z - back_strip_bottom_z) + 0.001]);
    }

    // Shallow front base extension with mounting holes
    difference() {
        // Shallow section solid
        translate([-shallow_side_projection, 0, 0])
        cube([shallow_total_width, shallow_depth, shallow_height]);

        // Cut left mounting hole
        translate([hole1_x, hole_front_offset, -0.001])
        cylinder(h = shallow_height + 0.002, r = hole_radius);

        // Cut right mounting hole
        translate([hole2_x, hole_front_offset, -0.001])
        cylinder(h = shallow_height + 0.002, r = hole_radius);
    }
}