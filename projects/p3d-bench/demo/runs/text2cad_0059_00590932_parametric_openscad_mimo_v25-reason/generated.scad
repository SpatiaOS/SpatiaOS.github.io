// === Parameters ===
// Main base block
base_length = 0.165891;      // X dimension
base_width  = 0.325401;      // Y dimension (front to back)
base_height = 0.408347;      // Z dimension

// Square recess (cut from top)
recess_size      = 0.089326; // side length of square
recess_x_offset  = 0.0383;   // from left edge (centered: same right)
recess_y_offset  = 0.0191;   // from front edge
recess_z_bottom  = 0.319;    // vertical band start
recess_z_top     = 0.4083;   // vertical band end (top)

// Lower rectangular opening (through cut)
lower_x_size     = 0.076565; // X width
lower_y_size     = 0.132416; // Y depth
lower_x_offset   = 0.0447;   // from left edge
lower_y_offset   = -0.0303;  // from front edge (negative = breaks out)
lower_z_bottom   = 0;        // vertical band start
lower_z_top      = 0.319;    // vertical band end

// Upper back strip removal (creates high-to-low step)
strip_y_size     = 0.114848; // Y width of removed strip
strip_y_start    = 0.2106;   // front edge of strip
strip_z_bottom   = 0.2807;   // vertical band start
strip_z_top      = 0.4083;   // vertical band end
// cut depth = 0.1276 (strip_z_top - strip_z_bottom)

// Shallow front base extension
shallow_height   = 0.0383;
shallow_x_total  = 0.4339;   // total X span
shallow_y_size   = 0.1148;   // Y span (front portion)
shallow_x_overhang = 0.134;  // projection beyond each side of main base

// Circular through holes in shallow section
hole_radius      = 0.0255;
hole_y_offset    = 0.0574;   // from front edge
hole_x_positions = [-0.069, 0.2349]; // from main base left edge

$fn = 100;

// === Main Model ===
difference() {
    union() {
        // 1. Main rectangular base block
        cube([base_length, base_width, base_height]);

        // 2. Shallow front base extension
        //    Projects 0.134 beyond left and right of main base
        //    Occupies front 0.1148 of width
        translate([-shallow_x_overhang, 0, 0])
            cube([shallow_x_total, shallow_y_size, shallow_height]);
    }

    // 3. Square recess cut from top
    //    Centered in X with 0.0383 offsets left/right
    //    Front offset 0.0191, back offset 0.217
    //    Vertical band 0.319 to 0.4083 (depth 0.0893 from top)
    translate([recess_x_offset, recess_y_offset, recess_z_bottom])
        cube([recess_size, recess_size, recess_z_top - recess_z_bottom]);

    // 4. Lower rectangular opening through vertical band 0 to 0.319
    //    Left offset 0.0447, front offset -0.0303 (breaks front face)
    translate([lower_x_offset, lower_y_offset, lower_z_bottom])
        cube([lower_x_size, lower_y_size, lower_z_top - lower_z_bottom]);

    // 5. Upper back strip removal (high-to-low step)
    //    Full length, width 0.114848, leaving 0.2106 in front
    //    Z band 0.2807 to 0.4083, cut depth 0.1276
    translate([0, strip_y_start, strip_z_bottom])
        cube([base_length, strip_y_size, strip_z_top - strip_z_bottom]);

    // 6. Two circular through holes in shallow section
    //    Radius 0.0255, at Y offset 0.0574 from front
    //    X positions at -0.069 and 0.2349 from main base left edge
    for (x_pos = hole_x_positions) {
        translate([x_pos, hole_y_offset, -0.001])
            cylinder(h = shallow_height + 0.002, r = hole_radius);
    }
}