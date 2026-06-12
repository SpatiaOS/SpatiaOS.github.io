// ==========================================
// Parametric Annular Rim with Collar & Ribs
// ==========================================

// Primary Dimensions (mm)
outer_radius = 50;          // Outer edge of the main rim
rim_inner_radius = 35;      // Inner edge of the main rim (defines window start)
rim_thickness = 10;         // Thickness of the main outer ring (deepest tier)

collar_outer_radius = 20;   // Outer diameter of the central collar
collar_inner_radius = 12;   // Inner diameter of the central collar (hollow center)
web_thickness = 5;          // Thickness of collar and ribs (shallower tier)

num_ribs = 6;               // Number of radial ribs
rib_angle = 20;             // Angular width of each rib in degrees
window_corner_r = 3;        // Corner radius for the rounded window slots

// Resolution Control
$fn = 64;

// Derived Values
gap_angle = 360 / num_ribs - rib_angle;
mid_radius = (collar_outer_radius + rim_inner_radius) / 2;
radial_len = rim_inner_radius - collar_outer_radius;
window_width = 2 * PI * mid_radius * (gap_angle / 360);
safe_corner_r = min(window_width / 2, window_corner_r);

// Module: Rounded Slot Cutter
// Creates a negative stadium shape to form the window between ribs
module window_cutter() {
    translate([mid_radius, 0, -1]) {
        linear_extrude(height = web_thickness + 2) {
            hull() {
                translate([-radial_len / 2 + safe_corner_r, 0]) circle(r = safe_corner_r);
                translate([radial_len / 2 - safe_corner_r, 0]) circle(r = safe_corner_r);
            }
        }
    }
}

// Module: Main Assembly
module annular_assembly() {
    union() {
        // 1. Main Outer Rim (Deepest Tier)
        difference() {
            cylinder(r = outer_radius, h = rim_thickness, center = false);
            cylinder(r = rim_inner_radius, h = rim_thickness + 1, center = false);
        }

        // 2. Shallower Web Tier (Collar + Ribs)
        translate([0, 0, rim_thickness - web_thickness]) {
            difference() {
                // Base annulus for the web
                difference() {
                    cylinder(r = rim_inner_radius, h = web_thickness, center = false);
                    cylinder(r = collar_outer_radius, h = web_thickness + 1, center = false);
                }
                // Subtract windows to leave solid radial ribs
                for (i = [0 : num_ribs - 1]) {
                    rotate([0, 0, i * (360 / num_ribs) + gap_angle / 2]) {
                        window_cutter();
                    }
                }
            }

            // 3. Concentric Hollow Collar
            difference() {
                cylinder(r = collar_outer_radius, h = web_thickness, center = false);
                cylinder(r = collar_inner_radius, h = web_thickness + 1, center = false);
            }
        }
    }
}

// Generate Model
annular_assembly();