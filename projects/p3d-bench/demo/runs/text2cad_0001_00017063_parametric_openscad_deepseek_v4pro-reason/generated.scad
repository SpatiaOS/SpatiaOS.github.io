// Parameters – all dimensions in inches
length         = 0.75;
width          = 0.21875;
total_height   = 0.28125;
arch_radius    = width / 2;                // 0.109375
wall_height    = total_height - arch_radius; // 0.171875

// Hole parameters
hole1_x        = 0.0717;
hole2_x        = 0.6692;
hole_y         = 0.0625;
hole_bottom_z  = 0.1081;
hole_height    = 0.0625;   // 0.1705 – 0.1081
hole_radius    = 0.03125;  // diameter = 0.0625

$fn = 100;  // smooth curves

// -------------------------------------------------------------------
// Base geometry: rectangular lower block + arched top
module base() {
    union() {
        // Lower rectangular block (full footprint)
        cube([length, width, wall_height]);
        
        // Arched top – half‑cylinder placed along the X‑axis
        difference() {
            // Full horizontal cylinder
            translate([0, width/2, total_height])
                rotate([0, 90, 0])
                    cylinder(h = length, r = arch_radius, center = false);
            // Remove the portion below the wall top (Z = 0 … wall_height)
            translate([-0.1, -0.1, -0.1])
                cube([length + 0.2, width + 0.2, wall_height + 0.1]);
        }
    }
}

// -------------------------------------------------------------------
// Main model – subtract two vertical blind holes
difference() {
    base();
    // Hole 1
    translate([hole1_x, hole_y, hole_bottom_z])
        cylinder(h = hole_height, r = hole_radius);
    // Hole 2
    translate([hole2_x, hole_y, hole_bottom_z])
        cylinder(h = hole_height, r = hole_radius);
}