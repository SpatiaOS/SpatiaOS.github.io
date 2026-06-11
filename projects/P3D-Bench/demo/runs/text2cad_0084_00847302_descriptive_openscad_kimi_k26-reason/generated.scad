// Parametric Enclosure with Open Top, Side Cutouts, and Interior Ledge
// All dimensions in millimeters

// --- Main Envelope ---
width = 80;
depth = 60;
height = 40;

// --- Wall and Floor Thickness ---
wall_thick = 3;
floor_thick = 3;

// --- Front Face Horizontal Recess (blind pocket) ---
ho_width = 30;      // horizontal span
ho_height = 8;      // vertical span
ho_elev = 8;        // bottom edge above base
ho_depth = 2;       // depth into wall (blind recess)

// --- Right Face Vertical Through Opening ---
vo_width = 8;       // span along Y
vo_height = 25;     // span along Z
vo_elev = 2;        // bottom edge above base

// --- Interior Shelf-Like Rib on Left Wall ---
ledge_length = 40;      // span along Y
ledge_protrusion = 2;   // how far it extends into the cavity
ledge_thick = 1;        // vertical thickness
ledge_elev = 2;         // height above interior floor

$fn = 50;

// Main solid body with hollow interior and side features removed
difference() {
    // Outer rectangular block
    cube([width, depth, height]);

    // Hollow interior (open top)
    translate([wall_thick, wall_thick, floor_thick])
        cube([width - 2*wall_thick, depth - 2*wall_thick, height - floor_thick + 0.5]);

    // Front face centered horizontal recess (blind cut)
    translate([(width - ho_width)/2, -0.5, ho_elev])
        cube([ho_width, ho_depth + 0.5, ho_height]);

    // Right face centered vertical through opening
    translate([width - wall_thick - 0.5, (depth - vo_width)/2, vo_elev])
        cube([wall_thick + 1, vo_width, vo_height]);
}

// Interior ledge on left wall (added after hollowing to create internal step)
translate([wall_thick - 0.01, (depth - ledge_length)/2, floor_thick + ledge_elev])
    cube([ledge_protrusion + 0.01, ledge_length, ledge_thick]);