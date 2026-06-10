// === Parametric Dimensions ===

// Main rectangular base
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;

// Circular void through base
base_void_cx = 0.25;
base_void_cy = 0.1875;
base_void_r = 0.0938;

// Back-edge strip common footprint
strip_x = 0.5;
strip_y = 0.0625;
strip_front_y = 0.375;

// Lower back-edge strip (below base underside)
lower_strip_depth = 0.25;

// Upper back-edge strip (spans below and above base underside)
upper_strip_below = 0.5;
upper_strip_above = 0.25;

// Circular void in upper strip
upper_void_cx = 0.125;
upper_void_cy = 0.4375;
upper_void_r = 0.05;

// Annular collar on top of base
collar_cx = 0.2501;
collar_cy = 0.1876;
collar_outer_r = 0.0938;
collar_inner_r = 0.05;
collar_height = 0.0625;

$fn = 100;

// === Main Model ===

union() {

    // 1. Main base with through-hole void
    difference() {
        cube([base_length, base_width, base_height]);
        translate([base_void_cx, base_void_cy, -0.005])
            cylinder(h=base_height + 0.01, r=base_void_r);
    }

    // 2. Lower back-edge solid strip (base underside down to -0.25)
    translate([0, strip_front_y, -lower_strip_depth])
        cube([strip_x, strip_y, lower_strip_depth]);

    // 3. Upper back-edge strip with circular void (-0.5 to +0.25)
    difference() {
        translate([0, strip_front_y, -upper_strip_below])
            cube([strip_x, strip_y, upper_strip_below + upper_strip_above]);
        translate([upper_void_cx, upper_void_cy, -upper_strip_below - 0.005])
            cylinder(h=upper_strip_below + upper_strip_above + 0.01, r=upper_void_r);
    }

    // 4. Annular collar concentric with base void, on top surface
    translate([collar_cx, collar_cy, base_height])
        difference() {
            cylinder(h=collar_height, r=collar_outer_r);
            translate([0, 0, -0.005])
                cylinder(h=collar_height + 0.01, r=collar_inner_r);
        }

}