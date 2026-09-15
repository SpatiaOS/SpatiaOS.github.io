// Shallow Arc-Based Plate with Raised Tabs and Underside Collar
// A parametric mounting plate with obround (arc) outline, central through hole,
// hollow locating collar on the underside, and tall rounded end tabs with through holes.
// All dimensions in millimeters.
// ----------------------
// Parametric Definitions
// ----------------------
plate_straight_length = 60;   // Length of straight parallel sides between the semicircular ends
plate_width = 30;             // Total width of the plate (diameter of end arcs)
base_thickness = 3;           // Vertical thickness of the shallow main plate
end_radius = plate_width / 2; // Radius of the semicircular end arcs (derived from plate width)
center_hole_diameter = 12;    // Diameter of the central through opening
collar_outer_diameter = 20;   // Outer diameter of the hollow underside locating collar
collar_thickness = 2;         // Downward projection depth of the shallow lower collar
tab_height = 25;              // Height of end tabs above the base plate (much taller than base)
tab_hole_diameter = 6;        // Diameter of the through-hole in each end tab
$fn = 100;                    // Resolution for smooth curved surfaces (higher = smoother)
// ----------------------
// Helper Modules
// ----------------------
// Creates a solid raised end tab matching the plate's semicircular end profile
module solid_end_tab(straight_len, end_r, tab_h, base_t) {
    translate([0, 0, base_t])
    linear_extrude(height=tab_h)
    translate([straight_len/2, 0])
    intersection() {
        // Full circle matching the plate end radius
        circle(r=end_r);
        // Rectangular cut to create a half-disk profile for the tab
        translate([0, -end_r])
        square([end_r, 2*end_r]);
    }
}
// ----------------------
// Main Model Assembly
// ----------------------
difference() {
    // Union of all solid positive geometry
    union() {
        // Main obround base plate (arc outline via convex hull of two vertical cylinders)
        hull() {
            translate([plate_straight_length/2, 0, base_thickness/2])
            cylinder(d=plate_width, h=base_thickness, center=true);
            translate([-plate_straight_length/2, 0, base_thickness/2])
            cylinder(d=plate_width, h=base_thickness, center=true);
        }
        // Right end raised tab
        solid_end_tab(plate_straight_length, end_radius, tab_height, base_thickness);
        // Left end raised tab (mirror of right tab across Y-Z center plane)
        mirror([1, 0, 0])
        solid_end_tab(plate_straight_length, end_radius, tab_height, base_thickness);
        // Underside collar blank (hollowed by central hole subtraction)
        translate([0, 0, -collar_thickness])
        cylinder(d=collar_outer_diameter, h=collar_thickness);
    }
    // Subtract central through hole (oversized to ensure clean cut through base and collar)
    translate([0, 0, -(collar_thickness + 2)])
    cylinder(d=center_hole_diameter, h=base_thickness + collar_thickness + 4);
    // Subtract aligned through hole in right tab (along X axis, through tab thickness)
    translate([plate_straight_length/2 + end_radius/2, 0, base_thickness + tab_height/2])
    rotate([0, 90, 0])
    cylinder(d=tab_hole_diameter, h=end_radius + 10, center=true);
    // Subtract aligned through hole in left tab (mirror of right hole)
    mirror([1, 0, 0])
    translate([plate_straight_length/2 + end_radius/2, 0, base_thickness + tab_height/2])
    rotate([0, 90, 0])
    cylinder(d=tab_hole_diameter, h=end_radius + 10, center=true);
}