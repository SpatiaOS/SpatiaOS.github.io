// Global Resolution Setting
$fn = 64;

// ==============================
// All Parametric Dimensions
// ==============================
// Base Footprint Specifications
base_len = 0.375;          // Total X dimension of base footprint
base_wid = 0.75;           // Total Y dimension of base footprint
base_corner_r = base_len/2;// Radius for rounded stadium ends
base_thickness = 0.0134;   // Thickness of lower solid base plate

// Upper Perimeter Wall Specifications
main_wall_total_reach = 0.2277;  // Max Z height from base datum (Z=0)
main_wall_thickness = 0.02;      // Wall thickness of upper perimeter
main_wall_height = main_wall_total_reach - base_thickness;

// Raised Upper Sleeve Specifications
sleeve_offset_left = 0.308;      // Offset from base left edge
sleeve_outer_len = 0.066964;     // Sleeve X dimension
sleeve_outer_wid = 0.133929;     // Sleeve Y dimension
sleeve_total_reach = 0.442;      // Max Z height from base datum
sleeve_height = sleeve_total_reach - main_wall_total_reach;
sleeve_wall_thickness = 0.01;    // Wall thickness of hollow sleeve

// Lower Sleeve Continuation Specifications
lower_sleeve_outer_len = 0.05;   // X dimension (fits inside upper sleeve)
lower_sleeve_outer_wid = 0.11;   // Y dimension (fits inside upper sleeve)
lower_sleeve_depth = 0.2143;     // Extrusion depth below base
lower_sleeve_top_z = -0.0134;    // Top Z position (0.0134 below base)

// Circular Cut Hole Specifications
hole_r = 0.0067;                 // Hole radius
hole_x_pos = 0.3616;             // Shared X position for both holes
hole_y_pos1 = 0.6828;            // Y position of upper hole
hole_y_pos2 = 0.0672;            // Y position of lower hole
hole_z_start = 0.1674;           // Start Z height of cuts
hole_z_end = 0.1808;             // End Z height of cuts
hole_height = hole_z_end - hole_z_start;

// ==============================
// Helper Module Definitions
// ==============================
// Generate 2D stadium/rounded footprint for base
module base_footprint(filled=true, wall_thickness=0) {
    hull() {
        translate([base_len/2, base_corner_r, 0]) circle(r=base_corner_r);
        translate([base_len/2, base_wid - base_corner_r, 0]) circle(r=base_corner_r);
    }
    if (!filled) {
        difference() {
            children();
            offset(r=-wall_thickness) children();
        }
    }
}

// Generate 2D hollow rectangular footprint for sleeves
module sleeve_footprint(outer_len, outer_wid, wall_thickness) {
    difference() {
        square([outer_len, outer_wid]);
        translate([wall_thickness, wall_thickness, 0])
            square([outer_len - 2*wall_thickness, outer_wid - 2*wall_thickness]);
    }
}

// ==============================
// Main Model Assembly
// ==============================
difference() {
    union() {
        // Lower solid base plate
        linear_extrude(height=base_thickness)
            base_footprint(filled=true);
        
        // Upper perimeter wall (hollow inner region)
        translate([0, 0, base_thickness])
            linear_extrude(height=main_wall_height)
                base_footprint(filled=false, wall_thickness=main_wall_thickness);
        
        // Raised hollow upper sleeve
        translate([sleeve_offset_left, (base_wid - sleeve_outer_wid)/2, main_wall_total_reach])
            linear_extrude(height=sleeve_height)
                sleeve_footprint(sleeve_outer_len, sleeve_outer_wid, sleeve_wall_thickness);
        
        // Lower hollow sleeve continuation
        translate([base_len - lower_sleeve_outer_len, (base_wid - lower_sleeve_outer_wid)/2, lower_sleeve_top_z - lower_sleeve_depth])
            linear_extrude(height=lower_sleeve_depth)
                sleeve_footprint(lower_sleeve_outer_len, lower_sleeve_outer_wid, sleeve_wall_thickness);
    }

    // Cut pair of circular holes
    translate([hole_x_pos, hole_y_pos1, hole_z_start])
        cylinder(r=hole_r, h=hole_height);
    translate([hole_x_pos, hole_y_pos2, hole_z_start])
        cylinder(r=hole_r, h=hole_height);
}