// =========================================================
// Parametric D-Shaped Frame with Shallow Protrusion & Cut
// =========================================================

$fn = 128;

// Base & Frame Parameters
base_length      = 0.395255;
base_width       = 0.60219;
base_height      = 0.109489;
extrusion_depth  = 0.1095;
frame_wall_thick = 0.04;

// Protrusion Parameters
protr_axis_x     = 0.0942;
protr_axis_y     = -0.0821;
protr_radius     = 0.0657;
protr_height     = 0.054745;

// Cut Parameters
cut_radius       = 0.0285;
cut_height       = 0.056;

// =========================================================
// Profile Definitions
// =========================================================

// Outer D-shape (flat rear, curved front)
module profile_outer() {
    arc_r = base_length / 2;
    straight_h = base_width - arc_r;
    union() {
        square([base_length, straight_h]);
        translate([base_length/2, straight_h]) circle(r=arc_r);
    }
}

// Inner D-shape (uniform inward offset)
module profile_inner() {
    arc_r = base_length / 2 - frame_wall_thick;
    straight_h = base_width - base_length/2 - frame_wall_thick;
    translate([frame_wall_thick, frame_wall_thick]) {
        union() {
            square([base_length - 2*frame_wall_thick, straight_h]);
            translate([(base_length - 2*frame_wall_thick)/2, straight_h]) circle(r=arc_r);
        }
    }
}

// =========================================================
// Main Assembly
// =========================================================

difference() {
    union() {
        // Full-depth D-shaped frame
        linear_extrude(height=extrusion_depth) {
            difference() {
                profile_outer();
                profile_inner();
            }
        }

        // Shallow round protrusion attached outside front-left
        translate([protr_axis_x, protr_axis_y, 0]) {
            cylinder(r=protr_radius, h=protr_height);
        }
    }

    // Concentric circular through-cut in the protrusion
    translate([protr_axis_x, protr_axis_y, -0.001]) {
        cylinder(r=cut_radius, h=cut_height);
    }
}