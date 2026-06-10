// === Parameters ===

// Base plate
base_length    = 0.75;       // X
base_width     = 0.625;      // Y
base_height    = 0.00625;    // Z

// Left upright wall
wall_thickness   = 0.0063;   // X extent
wall_width       = 0.625;    // Y extent (flush with base)
wall_total_height = 0.1938;  // Z total from base datum

// Lower rectangular opening in wall
lower_rect_y      = 0.4447;       // front offset (from Y=0)
lower_rect_y_size = 0.081103;     // span along wall (Y)
lower_rect_z      = 0.0;          // bottom of opening
lower_rect_z_size = 0.111891;     // height of opening

// Circular through-hole in wall
circ_radius = 0.0432;
circ_y      = 0.2948;                    // center Y (front offset)
circ_z      = (0.0631 + 0.1495) / 2;    // center Z

// Smaller rectangular opening in wall
small_rect_y      = 0.091;        // front offset (from Y=0)
small_rect_y_size = 0.043521;     // span along wall (Y)
small_rect_z      = 0.0992;       // bottom of opening
small_rect_z_size = 0.044108;     // height of opening

// Base plate rectangular through-opening
base_cut_x      = 0.3125;         // left offset
base_cut_x_size = 0.264669;       // X span
base_cut_y      = 0.2073;         // front offset
base_cut_y_size = 0.40625;        // Y span

// Resolution
$fn  = 80;
eps  = 0.001;  // small overlap for clean boolean cuts

// === Model ===
difference() {
    union() {
        // Base plate: sits from Z=0 to Z=base_height
        cube([base_length, base_width, base_height]);

        // Left wall: flush at X=0, spans full width, rises to wall_total_height
        cube([wall_thickness, wall_width, wall_total_height]);
    }

    // 1) Lower rectangular opening through the wall
    translate([-eps, lower_rect_y, lower_rect_z])
        cube([wall_thickness + 2 * eps,
              lower_rect_y_size,
              lower_rect_z_size]);

    // 2) Circular through-hole in the wall
    translate([-eps, circ_y, circ_z])
        rotate([0, 90, 0])
            cylinder(h = wall_thickness + 2 * eps, r = circ_radius);

    // 3) Smaller rectangular through-opening in the wall
    translate([-eps, small_rect_y, small_rect_z])
        cube([wall_thickness + 2 * eps,
              small_rect_y_size,
              small_rect_z_size]);

    // 4) Rectangular through-opening in the base plate
    translate([base_cut_x, base_cut_y, -eps])
        cube([base_cut_x_size,
              base_cut_y_size,
              base_height + 2 * eps]);
}