// === Parameters ===

// Main base dimensions
main_length  = 0.165891;   // X
main_width   = 0.325401;   // Y (front=0, back=max)
main_height  = 0.408347;   // Z

// Top square recess
recess_size     = 0.089326;
recess_x_off    = 0.0383;   // left/right offset
recess_y_front  = 0.0191;   // from front edge
recess_z_start  = 0.319;    // bottom of recess

// Lower rectangular opening
open_x_size   = 0.076565;
open_y_size   = 0.132416;
open_x_off    = 0.0447;     // left offset
open_y_off    = -0.0303;    // front offset (negative = beyond front face)
open_z_top    = 0.319;      // top of opening band

// Upper back strip removal
strip_y_width = 0.114848;   // Y extent measured from back edge
strip_z_start = 0.2807;     // bottom of strip cut

// Shallow base-level extension
base_ext_height = 0.0383;   // Z height
base_ext_x      = 0.4339;   // X span
base_ext_y      = 0.1148;   // Y span (front portion)
base_ext_proj   = 0.134;    // projection beyond each side in X

// Through-hole parameters in shallow section
hole_r       = 0.0255;      // radius
hole_y_pos   = 0.0574;      // Y center from front edge
hole_x1      = -0.069;      // X center relative to main base left edge
hole_x2      = 0.2349;      // X center relative to main base left edge

// Resolution
$fn = 100;

// Small epsilon for clean boolean cuts
eps = 0.001;

// === Assembly ===
difference() {
    union() {
        // Step 1: Main rectangular base block
        cube([main_length, main_width, main_height]);

        // Step 5: Shallow base-level section extending beyond both sides
        translate([-base_ext_proj, 0, 0])
            cube([base_ext_x, base_ext_y, base_ext_height]);
    }

    // Step 2: Square recess cut from the top
    translate([recess_x_off, recess_y_front, recess_z_start - eps])
        cube([recess_size, recess_size, main_height - recess_z_start + 2*eps]);

    // Step 3: Lower rectangular through-opening
    translate([open_x_off, open_y_off, -eps])
        cube([open_x_size, open_y_size, open_z_top + 2*eps]);

    // Step 4: Upper back strip removal (high-to-low step)
    translate([-eps, main_width - strip_y_width, strip_z_start - eps])
        cube([main_length + 2*eps, strip_y_width + eps, main_height - strip_z_start + 2*eps]);

    // Step 6: Two circular through-holes in shallow section
    translate([hole_x1, hole_y_pos, -eps])
        cylinder(r = hole_r, h = base_ext_height + 2*eps);

    translate([hole_x2, hole_y_pos, -eps])
        cylinder(r = hole_r, h = base_ext_height + 2*eps);
}