// --------------------------
// Global Resolution Setting
// --------------------------
$fn = 100; // Smooth curve rendering

// --------------------------
// Overall Model Parameters
// --------------------------
overall_length = 0.75;       // X-axis dimension (left to right)
overall_width = 0.714286;    // Y-axis dimension (front to back)
overall_height = 0.25;       // Z-axis dimension (base underside to top)

// --------------------------
// Through Hole Parameters
// --------------------------
through_hole_x = 0.375;      // X position from left edge
through_hole_y = 0.5357;     // Y position from front edge
through_hole_r = 0.0893;     // Radius of through opening

// --------------------------
// Front Blind Cut Parameters
// --------------------------
blind_cut_r = 0.0491;        // Radius of front face cylindrical cuts
blind_cut_depth = 0.1071;    // Depth of cuts into front face
blind_cut_z_low = 0.0759;    // Lowest Z point of cut profile
blind_cut_z_high = 0.1741;   // Highest Z point of cut profile
blind_cut1_x = 0.0893;       // X position of left blind cut
blind_cut2_x = 0.6607;       // X position of right blind cut
blind_cut_center_z = (blind_cut_z_low + blind_cut_z_high) / 2; // Mid height of cuts

// --------------------------
// Main Model Assembly
// --------------------------
difference() {
    // Main stepped base block (full overall dimensions)
    cube([overall_length, overall_width, overall_height], center=false);

    // 1. Through hole cut (full height penetration)
    translate([through_hole_x, through_hole_y, overall_height/2])
        cylinder(h=overall_height + 0.1, r=through_hole_r, center=true);

    // 2. Left front blind cylindrical cut
    translate([blind_cut1_x, blind_cut_depth/2, blind_cut_center_z])
        rotate([90, 0, 0]) // Rotate cylinder to align with Y axis (into front face)
            cylinder(h=blind_cut_depth, r=blind_cut_r, center=true);

    // 3. Right front blind cylindrical cut
    translate([blind_cut2_x, blind_cut_depth/2, blind_cut_center_z])
        rotate([90, 0, 0]) // Rotate cylinder to align with Y axis (into front face)
            cylinder(h=blind_cut_depth, r=blind_cut_r, center=true);
}