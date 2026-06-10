// Parametric D-Frame with Round Protrusion
// All dimensions in millimeters

// Main frame parameters
frame_length = 0.395255;
frame_width = 0.60219;
frame_height = 0.109489;
extrusion_depth = 0.1095;

// Round protrusion parameters
protrusion_length = 0.259658;
protrusion_width = 0.197373;
protrusion_height = 0.054745;
protrusion_left_offset = 0;
protrusion_right_offset = 0.1356;
protrusion_front_offset = -0.1478;
protrusion_back_offset = 0.5526;

// Round tab parameters
tab_axis_left = 0.0942;
tab_axis_front = -0.0821;
tab_radius = 0.0657;
tab_height = 0.0547;

// Cut parameters
cut_radius = 0.0285;
cut_bounding_length = 0.056934;
cut_bounding_width = 0.056934;
cut_z_start = 0;
cut_z_end = 0.0547;

// Resolution
$fn = 100;

// Helper module: D-shaped frame
module d_frame() {
    difference() {
        // Outer D-shape
        hull() {
            // Straight rear section
            translate([frame_length/2, frame_width, 0])
                cube([frame_length, 0.0001, extrusion_depth], center=true);
            // Rounded front arc
            translate([frame_length/2, frame_width*0.25, 0])
                cylinder(h=extrusion_depth, r=frame_width*0.45, center=true);
        }
        
        // Inner through-opening
        hull() {
            translate([frame_length/2, frame_width, 0])
                cube([frame_length*0.7, 0.0001, extrusion_depth+1], center=true);
            translate([frame_length/2, frame_width*0.25, 0])
                cylinder(h=extrusion_depth+1, r=frame_width*0.35, center=true);
        }
    }
}

// Helper module: Round protrusion base
module protrusion_base() {
    translate([protrusion_left_offset, protrusion_front_offset, 0])
        cube([protrusion_length, protrusion_width, protrusion_height]);
}

// Helper module: Round tab
module round_tab() {
    translate([tab_axis_left, tab_axis_front, 0])
        cylinder(h=tab_height, r=tab_radius);
}

// Helper module: Concentric cut
module concentric_cut() {
    translate([tab_axis_left, tab_axis_front, cut_z_start])
        cylinder(h=cut_z_end - cut_z_start, r=cut_radius);
}

// Main assembly
union() {
    // Main D-shaped frame
    d_frame();
    
    // Round protrusion with tab
    difference() {
        union() {
            protrusion_base();
            round_tab();
        }
        concentric_cut();
    }
}