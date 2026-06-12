// CAD Model: Concentric Annulus Base with Collar and Radial Rib Web
// All dimensions are in the implied base units (e.g., inches or mm)

$fn = 120; // High resolution for smooth circular profiles

// --- Parameters ---

// Global Reference
base_cx = 0.375;
base_cy = 0.375;

// Main Annulus Base
annulus_r_out = 0.375;
annulus_r_in = 0.3375;
annulus_z_min = -0.0281;
annulus_z_max = 0.0281;
annulus_h = annulus_z_max - annulus_z_min;

// Central Annular Collar
collar_footprint_size = 0.15;
collar_r_out = collar_footprint_size / 2; // 0.075
collar_r_in = 0.04; // Inner through-void radius (assumed clearance)
collar_z_min = -0.0234;
collar_z_max = 0.0234;
collar_h = collar_z_max - collar_z_min;

// Radial Rib Web
web_z_min = -0.0141;
web_z_max = 0.0141;
web_h = web_z_max - web_z_min;
web_bb_x = 0.6184;
web_bb_y = 0.5210;
web_offset_left = 0.0658;
web_offset_front = 0.0387;

// --- Modules ---

// Main base as a concentric circular annulus
module main_annulus() {
    translate([base_cx, base_cy, 0]) {
        difference() {
            cylinder(h=annulus_h, r=annulus_r_out, center=true);
            // Inner circular opening
            cylinder(h=annulus_h + 0.002, r=annulus_r_in, center=true);
        }
    }
}

// Centered solid annular collar with an open inner profile
module central_collar() {
    translate([base_cx, base_cy, 0]) {
        difference() {
            cylinder(h=collar_h, r=collar_r_out, center=true);
            // Inner through void
            cylinder(h=collar_h + 0.002, r=collar_r_in, center=true);
        }
    }
}

// Rounded radial rib web with elongated slot-like openings
module radial_rib_web() {
    intersection() {
        // Full radial web structure
        translate([base_cx, base_cy, 0]) {
            difference() {
                // Solid disc filling the space between collar and annulus
                cylinder(h=web_h, r=annulus_r_in, center=true);
                
                // Clear the center for the collar
                cylinder(h=web_h + 0.002, r=collar_r_out, center=true);
                
                // Subtract radial elongated slots to form the ribs
                for (i = [0 : 45 : 359]) {
                    rotate([0, 0, i]) {
                        hull() {
                            translate([collar_r_out + 0.03, 0, 0]) 
                                cylinder(h=web_h + 0.01, r=0.015, center=true);
                            translate([annulus_r_in - 0.03, 0, 0]) 
                                cylinder(h=web_h + 0.01, r=0.04, center=true);
                        }
                    }
                }
            }
        }
        
        // Bounding footprint applied in global coordinate space
        translate([web_offset_left, web_offset_front, -web_h/2 - 0.001]) {
            cube([web_bb_x, web_bb_y, web_h + 0.002]);
        }
    }
}

// --- Main Assembly ---
union() {
    main_annulus();
    central_collar();
    radial_rib_web();
}