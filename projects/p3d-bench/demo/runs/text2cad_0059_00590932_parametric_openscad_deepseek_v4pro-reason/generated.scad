// Parametric model of a machined part with base, recesses, step, and extension with holes

// Main base dimensions
base_length = 0.165891;  // X
base_width = 0.325401;   // Y
base_height = 0.408347;  // Z

// Square recess from top
recess_x = 0.089326;
recess_y = 0.089326;
recess_z = 0.0893;            // depth = 0.4083 - 0.319
recess_z_min = 0.319;
recess_x_offset = 0.0383;     // from left edge
recess_y_front = 0.0191;      // from front edge

// Lower rectangular opening (cuts through up to recess floor)
low_x = 0.076565;
low_y = 0.132416;
low_z = 0.319;                // 0 to 0.319
low_x_offset_left = 0.0447;
low_y_front = -0.0303;        // breaks out beyond front face

// Upper back strip removal (step)
back_strip_y = 0.114848;      // Y width of the strip
back_strip_y_start = 0.2106;  // front of strip
back_strip_z_min = 0.2807;    // from this height to top
back_strip_z = base_height - back_strip_z_min;  // 0.1276

// Shallow base extension (front, wider)
ext_z = 0.0383;
ext_x = 0.4339;
ext_y = 0.1148;
ext_x_min = -0.134;           // extends left of base
ext_y_min = 0;                // frontmost

// Through holes in the extension
hole_radius = 0.0255;
hole_y = 0.0574;              // front offset line
hole1_x = -0.069;             // relative to base left edge (X=0)
hole2_x = 0.2349;

$fn = 100; // smooth circles

difference() {
    union() {
        // Main base with three cutouts
        difference() {
            cube([base_length, base_width, base_height]);
            // square recess at top
            translate([recess_x_offset, recess_y_front, recess_z_min])
                cube([recess_x, recess_y, recess_z]);
            // lower rectangular opening
            translate([low_x_offset_left, low_y_front, 0])
                cube([low_x, low_y, low_z]);
            // upper back strip
            translate([0, back_strip_y_start, back_strip_z_min])
                cube([base_length, back_strip_y, back_strip_z]);
        }
        // shallow front extension
        translate([ext_x_min, ext_y_min, 0])
            cube([ext_x, ext_y, ext_z]);
    }
    // two through holes in the extension (clean cut)
    translate([hole1_x, hole_y, -0.01])
        cylinder(h = ext_z + 0.02, r = hole_radius);
    translate([hole2_x, hole_y, -0.01])
        cylinder(h = ext_z + 0.02, r = hole_radius);
}