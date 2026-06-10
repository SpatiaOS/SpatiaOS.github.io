// Stepped Line-Profiled Block with Through Hole and Side Blind Holes

// ---- Overall Dimensions ----
L = 0.75;              // Overall length (X axis)
W = 0.714286;          // Overall width (Y axis)
H = 0.25;              // Overall height (Z axis) / main extrusion depth

// ---- Through Hole (Upper Circular Opening) ----
thru_x = 0.375;        // X center from left edge (midpoint of length)
thru_y = 0.5357;       // Y center from front edge
thru_r = 0.0893;       // Through hole radius

// ---- Side Blind Holes (Front Face Features) ----
side1_x = 0.0893;      // Hole 1 X center from left edge
side2_x = 0.6607;      // Hole 2 X center from left edge (L - side1_x)
side_r = 0.0491;       // Side hole radius
side_depth = 0.1071;   // Blind hole depth into front face
side_z_bot = 0.0759;   // Bottom extent of side hole above base
side_z_top = 0.1741;   // Top extent of side hole above base
side_z_ctr = (side_z_bot + side_z_top) / 2;  // Z center of side holes

// ---- Resolution ----
$fn = 120;

// ---- Tolerance for clean booleans ----
eps = 0.001;

// ---- Main Model ----
difference() {
    // Main solid: stepped line-profiled block extruded to full height
    cube([L, W, H]);

    // Upper through-opening: vertical circular hole cutting full height
    translate([thru_x, thru_y, -eps])
        cylinder(h = H + 2 * eps, r = thru_r);

    // Front side blind hole 1: circular cut into front face (Y=0 plane)
    translate([side1_x, -eps, side_z_ctr])
        rotate([-90, 0, 0])
            cylinder(h = side_depth + eps, r = side_r);

    // Front side blind hole 2: circular cut into front face (Y=0 plane)
    translate([side2_x, -eps, side_z_ctr])
        rotate([-90, 0, 0])
            cylinder(h = side_depth + eps, r = side_r);
}