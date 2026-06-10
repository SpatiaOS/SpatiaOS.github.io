// ==============================
// Parametric Dimensions
// ==============================
// Base footprint dimensions
base_length = 0.75;       // Total length of slot base
base_width = 0.45;        // Total width of slot base
base_height = 0.05625;    // Thickness of base plate
// Central axis position (from left/front edges)
central_x = 0.375;
central_y = 0.225;
// Concentric feature dimensions
collar_outer_r = 0.225;   // Outer radius of top annular collar
collar_inner_r = 0.1875;  // Inner radius of top annular collar
collar_height = 0.1687;   // Height of collar above base shoulder
small_annular_outer_r = 0.0937;  // Outer radius of middle annular section
small_annular_inner_r = 0.0562;  // Inner radius of middle annular section
small_annular_height = 0.0937;   // Height of middle section above shoulder
inner_solid_r = 0.0562;   // Radius of innermost solid post
inner_solid_height = 0.075;      // Height of inner post above shoulder
// Curve resolution
$fn = 64;

// ==============================
// Helper Module: Rounded Slot Base
// ==============================
module rounded_slot_base(length, width, height) {
    linear_extrude(height=height) {
        // Hull two half-circle ends to make slot shape
        hull() {
            translate([width/2, width/2, 0]) circle(r=width/2);
            translate([length - width/2, width/2, 0]) circle(r=width/2);
        }
    }
}

// ==============================
// Main Model Assembly
// ==============================
union() {
    // Base plate with hollow cutouts
    difference() {
        rounded_slot_base(base_length, base_width, base_height);
        // Cut hollow annulus between 0.1875 and 0.0937 radius through base
        translate([central_x, central_y, -0.01]) difference() {
            cylinder(h=base_height + 0.02, r=collar_inner_r);
            cylinder(h=base_height + 0.02, r=small_annular_outer_r);
        }
    }

    // Outer coaxial annular collar
    translate([central_x, central_y, base_height]) difference() {
        cylinder(h=collar_height, r=collar_outer_r);
        cylinder(h=collar_height + 0.02, r=collar_inner_r);
    }

    // Middle coaxial annular section
    translate([central_x, central_y, base_height]) difference() {
        cylinder(h=small_annular_height, r=small_annular_outer_r);
        cylinder(h=small_annular_height + 0.02, r=small_annular_inner_r);
    }

    // Innermost solid circular post
    translate([central_x, central_y, base_height]) cylinder(h=inner_solid_height, r=inner_solid_r);
}