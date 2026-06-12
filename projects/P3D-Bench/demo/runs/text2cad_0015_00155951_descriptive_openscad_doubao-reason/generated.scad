// Global Resolution Setting
$fn = 100;

// ====================== PARAMETERS ======================
// Main Base Plate
base_total_length = 120;  // End-to-end length of arc-edged plate [mm]
base_width = 60;          // Width of plate body [mm]
base_thickness = 4;       // Thickness of main plate [mm]
center_hole_dia = 30;     // Diameter of central through opening [mm]

// Underside Annular Collar
collar_outer_dia = 40;    // Outer diameter of bottom collar [mm]
collar_thickness = 2;     // Height of protruding underside collar [mm]

// End Tabs
tab_height = 30;          // Height of tabs above base top surface [mm]
tab_thickness = 6;        // Thickness of tab material [mm]
tab_hole_dia = 8;         // Diameter of through hole in each tab [mm]
tab_corner_radius = 5;    // Radius for rounded tab corners [mm]
// =========================================================

// Helper Module: 2D capsule shape (arc ends + straight center)
module capsule_2d(total_length, width) {
    end_radius = width / 2;
    straight_section_length = total_length - 2 * end_radius;
    hull() {
        translate([-straight_section_length/2, 0]) circle(r=end_radius);
        translate([straight_section_length/2, 0]) circle(r=end_radius);
    }
}

// Helper Module: Rounded end tab with through hole
module rounded_tab(height, width, thickness, corner_r, hole_dia) {
    difference() {
        // Solid tab body with rounded corners
        linear_extrude(height=height) {
            offset(r=corner_r) square([thickness, width - 2*corner_r], center=true);
        }
        // Through hole aligned across tab thickness
        translate([0, 0, height/2])
        rotate([90, 0, 0])
        cylinder(h=thickness + 1, d=hole_dia, center=true);
    }
}

// Main Model Assembly
difference() {
    union() {
        // 1. Main arc-edged base plate
        linear_extrude(height=base_thickness) {
            capsule_2d(base_total_length, base_width);
        }

        // 2. Underside hollow annular collar
        translate([0, 0, -collar_thickness])
        difference() {
            cylinder(h=collar_thickness, d=collar_outer_dia);
            cylinder(h=collar_thickness + 1, d=center_hole_dia);
        }

        // 3. Left end tab
        translate([-base_total_length/2 + tab_thickness/2, 0, base_thickness])
        rounded_tab(tab_height, base_width, tab_thickness, tab_corner_radius, tab_hole_dia);

        // 4. Right end tab
        translate([base_total_length/2 - tab_thickness/2, 0, base_thickness])
        rounded_tab(tab_height, base_width, tab_thickness, tab_corner_radius, tab_hole_dia);
    }

    // Central through hole cut through entire assembly
    translate([0, 0, -collar_thickness - 0.5])
    cylinder(h=base_thickness + collar_thickness + 1, d=center_hole_dia);
}