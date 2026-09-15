// =====================================================================
// Parametric Arc-Based Plate with Underside Collar and End Tabs
// =====================================================================

// Surface quality resolution
$fn = 100;

// ---------------------------------------------------------------------
// Parameters (all dimensions in mm)
// ---------------------------------------------------------------------

// Base Plate Parameters
arc_radius      = 85;    // Radius of curvature of the arc spine
arc_angle       = 65;    // Angular span of the arc plate (degrees)
plate_width     = 30;    // Width of the arc plate body
plate_thickness = 6;     // Shallow thickness of the main base plate

// Center Opening & Underside Collar Parameters
center_hole_d   = 16;    // Diameter of the through opening at plate center
collar_od       = 24;    // Outer diameter of the underside annular collar
collar_height   = 4;     // Shallow height of the underside collar

// End Tabs Parameters
tab_height      = 36;    // Height of end tabs rising from upper plate surface
tab_width       = 24;    // Width of the tabs (diameter of rounded top arch)
tab_thick       = 10;    // Thickness of each tab
tab_hole_d      = 10;    // Diameter of through opening in each tab

// ---------------------------------------------------------------------
// Helper Functions & 2D Profiles
// ---------------------------------------------------------------------

// Generates 2D coordinates for an annular sector
function arc_sector_points(r_out, r_in, a_start, a_end, steps=60) = 
    concat(
        [for (i = [0 : steps]) 
            let(a = a_start + i * (a_end - a_start) / steps) 
            [r_out * sin(a), r_out * cos(a)]],
        [for (i = [steps : -1 : 0]) 
            let(a = a_start + i * (a_end - a_start) / steps) 
            [r_in * sin(a), r_in * cos(a)]]
    );

// 2D outline of the arc plate with full rounded ends
module plate_profile_2d() {
    half_angle = arc_angle / 2;
    r_out = arc_radius + plate_width / 2;
    r_in  = arc_radius - plate_width / 2;

    translate([0, -arc_radius]) {
        // Annular curved main section
        polygon(arc_sector_points(r_out, r_in, -half_angle, half_angle, 60));
        
        // Full semicircular rounded end caps
        translate([-arc_radius * sin(half_angle), arc_radius * cos(half_angle)])
            circle(d = plate_width);
        translate([ arc_radius * sin(half_angle), arc_radius * cos(half_angle)])
            circle(d = plate_width);
    }
}

// ---------------------------------------------------------------------
// Component Modules
// ---------------------------------------------------------------------

// Shallow annular collar on the underside (hollow ring)
module underside_collar() {
    overlap = 0.2;
    translate([0, 0, -collar_height]) {
        difference() {
            cylinder(h = collar_height + overlap, d = collar_od);
            translate([0, 0, -1])
                cylinder(h = collar_height + overlap + 2, d = center_hole_d);
        }
    }
}

// Tall rounded tab with horizontal through opening across its thickness
module rounded_tab(w, t, h, hole_d) {
    r_top = w / 2;
    h_straight = h - r_top;
    overlap = 0.2;

    difference() {
        // Solid upright body with semicircular rounded top
        hull() {
            // Lower prism with slight overlap for robust union
            translate([-w/2, -t/2, -overlap])
                cube([w, t, h_straight + overlap]);
            
            // Top cylindrical arch
            translate([0, 0, h_straight])
                rotate([-90, 0, 0])
                    cylinder(h = t, r = r_top, center = true);
        }

        // Horizontal through opening passing through tab thickness
        translate([0, 0, h_straight])
            rotate([-90, 0, 0])
                cylinder(h = t + 2, d = hole_d, center = true);
    }
}

// ---------------------------------------------------------------------
// Main Assembly
// ---------------------------------------------------------------------

half_angle = arc_angle / 2;
x_end = arc_radius * sin(half_angle);
y_end = arc_radius * cos(half_angle) - arc_radius;

difference() {
    union() {
        // 1. Shallow main plate with arc-based outline
        linear_extrude(height = plate_thickness)
            plate_profile_2d();

        // 2. Shallow annular collar added on underside around center
        underside_collar();

        // 3. Tall solid rounded tabs at both ends of the plate
        // Left end tab
        translate([-x_end, y_end, plate_thickness])
            rotate([0, 0, half_angle])
                rounded_tab(tab_width, tab_thick, tab_height, tab_hole_d);

        // Right end tab
        translate([x_end, y_end, plate_thickness])
            rotate([0, 0, -half_angle])
                rounded_tab(tab_width, tab_thick, tab_height, tab_hole_d);
    }

    // Central through opening penetrating both plate and underside collar
    translate([0, 0, -collar_height - 1])
        cylinder(h = plate_thickness + collar_height + 2, d = center_hole_d);
}