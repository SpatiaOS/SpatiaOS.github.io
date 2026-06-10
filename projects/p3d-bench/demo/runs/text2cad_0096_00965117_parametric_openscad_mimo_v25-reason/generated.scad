// === Parametric Dimensions ===

// Main rectangular plate
plate_length = 0.225;
plate_width  = 0.75;
plate_thick  = 0.0375;

// Through-hole parameters
hole_radius  = 0.0281;
hole_x       = 0.1125;     // Centered in X
hole_y1      = 0.0375;     // Front hole
hole_y2      = 0.7125;     // Back hole

// Central upper rectangular solid
upper_width  = 0.5625;
upper_y_off  = 0.0938;     // Front offset (back = 0.0937)
upper_height = 0.1125;     // Rises from base datum

// Central underside rectangular solid (same footprint)
lower_width  = 0.5625;
lower_height = 0.375;      // Extends downward

// Annular collar (hollow ring above shoulder)
collar_or     = 0.1078;    // Outer radius
collar_ir     = 0.0563;    // Inner radius
collar_cx     = 0.1125;
collar_cy     = 0.4687;
collar_height = 0.0938;

// Solid circular pin (above shoulder)
pin_r      = 0.0563;
pin_cx     = 0.1126;
pin_cy     = 0.4688;
pin_height = 0.1594;

$fn = 100;

// === Main Assembly ===
difference() {
    union() {
        // 1. Main rectangular plate at base datum z=0
        cube([plate_length, plate_width, plate_thick]);

        // 2. Central upper solid rising from base datum
        translate([0, upper_y_off, 0])
            cube([plate_length, upper_width, upper_height]);

        // 3. Central underside solid extending downward
        translate([0, upper_y_off, -lower_height])
            cube([plate_length, lower_width, lower_height]);

        // 4. Annular collar (hollow ring) above the shoulder
        translate([collar_cx, collar_cy, upper_height])
            difference() {
                cylinder(h=collar_height, r=collar_or);
                translate([0, 0, -0.001])
                    cylinder(h=collar_height + 0.002, r=collar_ir);
            }

        // 5. Solid circular pin above the shoulder
        translate([pin_cx, pin_cy, upper_height])
            cylinder(h=pin_height, r=pin_r);
    }

    // 6. Front through-hole in plate
    translate([hole_x, hole_y1, -1])
        cylinder(h=2, r=hole_radius);

    // 7. Back through-hole in plate
    translate([hole_x, hole_y2, -1])
        cylinder(h=2, r=hole_radius);
}