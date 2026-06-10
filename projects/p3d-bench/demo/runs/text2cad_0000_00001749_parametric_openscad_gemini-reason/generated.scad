// ==========================================
// Parametric Variables
// ==========================================

// Global resolution
$fn = 100;

// Main Base Dimensions (D-shaped frame)
base_length = 0.395255;  // X dimension footprint
base_width  = 0.60219;   // Y dimension footprint
base_height = 0.109489;  // Main extrusion depth
wall_thick  = 0.04;      // Assumed uniform wall thickness for the frame

// Protrusion Dimensions (Added solid round tab)
prot_height = 0.054745;
prot_axis_x = 0.0942;    // Left-offset of the shared axis
prot_axis_y = -0.0821;   // Front-offset of the shared axis
prot_outer_r = 0.0657;   // Radius of the solid round portion
prot_inner_r = 0.0285;   // Radius of the concentric cut

// Protrusion Bounding Box (Derived from edge offsets relative to main base)
// Left offset: 0 -> X_min = 0
// Right offset: 0.1356 -> X_max = base_length - 0.1356 = 0.259655
// Front offset: -0.1478 -> Y_min = -0.1478
// Back offset: 0.5526 -> Y_max = base_width - 0.5526 = 0.04959
prot_bb_length = 0.259658; 
prot_bb_y_max  = base_width - 0.5526; 

// ==========================================
// Modules
// ==========================================

// Module for the main D-shaped frame
module main_frame() {
    // The rounded arc wall is at the front (Y=0)
    arc_radius = base_length / 2;
    arc_center_y = arc_radius; // Center of the front arc to keep it flush with Y=0
    
    difference() {
        // Outer D-shape profile
        linear_extrude(base_height) {
            union() {
                // Straight rear and side portions
                translate([0, arc_center_y])
                    square([base_length, base_width - arc_center_y]);
                // Rounded arc wall at the front
                translate([arc_radius, arc_center_y])
                    circle(r=arc_radius);
            }
        }
        
        // Inner continuous through-opening
        translate([0, 0, -0.01])
        linear_extrude(base_height + 0.02) {
            union() {
                translate([wall_thick, arc_center_y])
                    square([base_length - 2*wall_thick, base_width - arc_center_y - wall_thick]);
                translate([arc_radius, arc_center_y])
                    circle(r=arc_radius - wall_thick);
            }
        }
    }
}

// Module for the shallower solid round protrusion
module protrusion() {
    // Formed by hulling the circular profile to a thin bounding strip 
    // to accurately match the specified rectangular footprint and edge offsets.
    linear_extrude(prot_height) {
        hull() {
            // Main round tab circular profile
            translate([prot_axis_x, prot_axis_y])
                circle(r=prot_outer_r);
            
            // Thin strip representing the attachment area footprint boundary
            translate([0, prot_bb_y_max - 0.001])
                square([prot_bb_length, 0.001]);
        }
    }
}

// ==========================================
// Main Assembly
// ==========================================

difference() {
    // Combine the main frame and the added protrusion
    union() {
        main_frame();
        protrusion();
    }
    
    // Cut the concentric circular opening through the shallow band
    translate([prot_axis_x, prot_axis_y, -0.01])
        cylinder(h=prot_height + 0.02, r=prot_inner_r);
}