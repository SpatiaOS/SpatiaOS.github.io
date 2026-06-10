// Parameters
base_length = 0.75;
base_width = 0.625;
base_height = 0.00625;          // plate thickness
base_bottom_z = 0;

wall_thickness = 0.0063;        // x-dimension of upright wall
wall_top_z = 0.1938;            // total height from base underside

// --- First rectangular opening in wall ---
rect1_y_len = 0.081103;
rect1_z_len = 0.111891;
rect1_front_offset = 0.4447;    // from front edge (y=0)
rect1_back_offset = 0.0992;     // from back edge
rect1_z_min = 0;
rect1_z_max = rect1_z_min + rect1_z_len;
rect1_cut_reach = 0.0062;       // x-depth of cut

// --- Circular hole in wall ---
circ_radius = 0.0432;
circ_front_offset = 0.2948;     // y-coordinate of axis
circ_z_min = 0.0631;
circ_z_max = 0.1495;
circ_cut_reach = 0.0625;        // x-depth of cut

// --- Second rectangular opening in wall ---
rect2_y_len = 0.043521;
rect2_z_len = 0.044108;
rect2_front_offset = 0.091;
rect2_back_offset = 0.4905;
rect2_z_min = 0.0992;
rect2_z_max = rect2_z_min + rect2_z_len;
rect2_cut_reach = 0.0625;

// --- Base cutout ---
base_cut_x_len = 0.264669;
base_cut_y_len = 0.40625;
base_cut_left_offset = 0.3125;  // from left edge (x=0)
base_cut_right_offset = 0.1728; // from right edge
base_cut_front_offset = 0.2073; // from front edge (y=0)
base_cut_back_offset = 0.0115;  // from back edge
base_cut_z_min = -0.0562;       // relative to base underside
base_cut_z_max = 0.0063;

// Computed positions and dimensions
wall_x_min = 0;
wall_x_max = wall_thickness;
wall_y_min = 0;
wall_y_max = base_width;
wall_z_min = base_bottom_z;
wall_z_max = wall_top_z;

// First rectangle cut
rect1_y_min = rect1_front_offset;
rect1_y_max = base_width - rect1_back_offset;
rect1_x_cut = rect1_cut_reach;   // x-length of subtracting box (centered on wall)

// Circular hole: axis at x=0 (left offset)
circ_center_y = circ_front_offset;
circ_center_z = (circ_z_min + circ_z_max) / 2;
circ_hole_len = circ_cut_reach;  // length along x, but we'll use oversized

// Second rectangle cut
rect2_y_min = rect2_front_offset;
rect2_y_max = base_width - rect2_back_offset;
rect2_x_cut = rect2_cut_reach;

// Base cut
base_cut_x_min = base_cut_left_offset;
base_cut_x_max = base_length - base_cut_right_offset;
base_cut_y_min = base_cut_front_offset;
base_cut_y_max = base_width - base_cut_back_offset;

// Modules
module baseplate() {
    cube([base_length, base_width, base_height]);
}

module wall() {
    cube([wall_thickness, base_width, wall_top_z]);
}

// Main model
difference() {
    union() {
        baseplate();
        wall();
    }

    // --- Wall openings ---

    // First rectangular opening
    // Overshoot in x to guarantee through cut
    translate([wall_x_min - 0.01, rect1_y_min, rect1_z_min])
        cube([wall_thickness + 0.02, rect1_y_max - rect1_y_min, rect1_z_max - rect1_z_min]);

    // Circular hole
    rotate([0, 90, 0])
        translate([0, circ_center_z - base_bottom_z - wall_z_min, 0]) // align center
            cylinder(h = wall_thickness + 1, r = circ_radius, center = true);
    // More accurate placement:
    translate([wall_x_min, circ_center_y, circ_center_z])
        rotate([0, 90, 0])
            cylinder(h = wall_thickness + 1, r = circ_radius, center = true);

    // Second rectangular opening
    translate([wall_x_min - 0.01, rect2_y_min, rect2_z_min])
        cube([wall_thickness + 0.02, rect2_y_max - rect2_y_min, rect2_z_max - rect2_z_min]);

    // --- Base cutout ---
    translate([base_cut_x_min, base_cut_y_min, base_cut_z_min])
        cube([base_cut_x_max - base_cut_x_min, base_cut_y_max - base_cut_y_min, base_cut_z_max - base_cut_z_min]);
}

// Resolution
$fn = 100;