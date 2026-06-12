// -------------------------- PARAMETERS --------------------------
$fn = 100; // Smoothness of curved surfaces

// Main outer rim dimensions
outer_rim_od = 100;    // Outer diameter of main annular rim [mm]
outer_rim_id = 80;     // Inner diameter of main annular rim [mm]
rim_thickness = 10;    // Thickness of main outer rim [mm]

// Central collar dimensions
collar_od = 40;        // Outer diameter of central hollow collar [mm]
collar_id = 20;        // Inner diameter of central hollow collar [mm]
collar_thickness = 5;  // Thickness of collar (shallower than rim) [mm]

// Rib and slot dimensions
num_ribs = 6;          // Number of radial ribs connecting collar to rim
rib_thickness = 5;     // Width of each radial rib [mm]
slot_round_r = 3;      // Radius of rounded slot ends [mm]
// -----------------------------------------------------------------

// Calculated helper values
rim_outer_r = outer_rim_od / 2;
rim_inner_r = outer_rim_id / 2;
collar_outer_r = collar_od / 2;
collar_inner_r = collar_id / 2;
angle_per_section = 360 / num_ribs;
avg_web_radius = (rim_inner_r + collar_outer_r) / 2;
slot_width = (angle_per_section * pi / 180 * avg_web_radius) - rib_thickness;

// Main outer annular rim module
module outer_rim() {
    difference() {
        // Outer solid cylinder
        cylinder(h=rim_thickness, r=rim_outer_r, center=true);
        // Cut out inner hollow area
        cylinder(h=rim_thickness + 1, r=rim_inner_r, center=true);
    }
}

// Central hollow collar module (shallower depth tier)
module central_collar() {
    // Align bottom of collar with bottom of rim for flat underside
    translate([0, 0, (collar_thickness / 2) - (rim_thickness / 2)]) {
        difference() {
            cylinder(h=collar_thickness, r=collar_outer_r, center=true);
            // Cut out central through hole
            cylinder(h=collar_thickness + 1, r=collar_inner_r, center=true);
        }
    }
}

// Radial rib web with rounded slots module
module rib_web() {
    // Align bottom of web with bottom of rim for flat underside
    translate([0, 0, (collar_thickness / 2) - (rim_thickness / 2)]) {
        difference() {
            // Base annular web plate between collar and rim
            difference() {
                cylinder(h=collar_thickness, r=rim_inner_r, center=true);
                cylinder(h=collar_thickness + 1, r=collar_outer_r, center=true);
            }
            
            // Cut out rounded slot windows between ribs
            for (i = [0 : num_ribs - 1]) {
                rotate([0, 0, i * angle_per_section]) {
                    linear_extrude(height=collar_thickness + 1, center=true) {
                        union() {
                            // Rectangular middle section of slot
                            square([(rim_inner_r - collar_outer_r) - 2 * slot_round_r, slot_width], center=true);
                            // Rounded inner end of slot
                            translate([-((rim_inner_r - collar_outer_r) / 2 - slot_round_r), 0])
                            circle(r=slot_round_r);
                            // Rounded outer end of slot
                            translate([((rim_inner_r - collar_outer_r) / 2 - slot_round_r), 0])
                            circle(r=slot_round_r);
                        }
                    }
                }
            }
        }
    }
}

// Final assembly of all components
union() {
    outer_rim();
    central_collar();
    rib_web();
}