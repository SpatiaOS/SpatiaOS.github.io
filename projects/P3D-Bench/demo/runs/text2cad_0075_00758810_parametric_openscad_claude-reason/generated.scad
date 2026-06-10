// ============================================================
// Parametric CAD Model — Arc-based base with collar and bores
// ============================================================

// --- Base Parameters ---
base_length   = 0.742363;   // X extent
base_width    = 0.535615;    // Y extent
base_height   = 0.094385;   // Z extent
corner_r      = 0.020;      // Arc-based corner rounding radius

// --- Collar / Bore Axis ---
center_x      = 0.1583;     // Left offset to axis
center_y      = 0.3113;     // Front offset to axis

// --- Annular Collar ---
collar_or     = 0.0966;     // Outer radius
collar_ir     = 0.0748;     // Inner radius (= wide bore radius)
collar_h      = 0.1452;     // Height above base top (total top = 0.2396)

// --- Stepped Bore ---
bore_wide_r   = 0.0748;     // Wide step radius
bore_narrow_r = 0.053;      // Narrow step radius (base-plane void)
bore_step_z   = 0.0218;     // Z height of step transition

// --- Front Side Recesses ---
sr_radius     = 0.0073;     // Circular profile radius
sr_depth      = 0.0073;     // Depth into front face
sr_z          = 0.0472;     // Z center of each recess
sr1_x         = 0.4487;     // X center, recess 1
sr2_x         = 0.5939;     // X center, recess 2

// --- Bottom Recesses (four separate round cuts) ---
br_radius     = 0.0221;     // Each recess radius
br_depth      = 0.0152;     // Depth from underside
br_pos = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// --- Resolution ---
$fn = 120;
eps = 0.001;

// ============================================================
// Rounded rectangle 2D profile anchored at origin
// ============================================================
module rounded_rect_2d(l, w, r) {
    offset(r = r)
        translate([r, r])
            square([l - 2*r, w - 2*r]);
}

// ============================================================
// Main Assembly
// ============================================================
difference() {
    // ---- Positive geometry ----
    union() {
        // Base: rounded, arc-based footprint
        linear_extrude(height = base_height)
            rounded_rect_2d(base_length, base_width, corner_r);

        // Annular collar: solid cylinder on base top (hollowed by bore cut)
        translate([center_x, center_y, base_height])
            cylinder(r = collar_or, h = collar_h);
    }

    // ---- Negative geometry (all cuts) ----

    // Wide bore: from step height through collar top
    // Creates collar inner bore and upper stepped recess in one cut
    translate([center_x, center_y, bore_step_z])
        cylinder(r = bore_wide_r,
                 h = base_height + collar_h - bore_step_z + eps);

    // Narrow bore: from base underside to step height
    // Completes the stepped through-hole at smaller radius
    translate([center_x, center_y, -eps])
        cylinder(r = bore_narrow_r, h = bore_step_z + 2 * eps);

    // Front-side recess 1: horizontal cylinder from front face
    translate([sr1_x, -eps, sr_z])
        rotate([-90, 0, 0])
            cylinder(r = sr_radius, h = sr_depth + eps);

    // Front-side recess 2: matching horizontal cylinder
    translate([sr2_x, -eps, sr_z])
        rotate([-90, 0, 0])
            cylinder(r = sr_radius, h = sr_depth + eps);

    // Four underside circular recesses (separate round cuts)
    for (p = br_pos) {
        translate([p[0], p[1], -eps])
            cylinder(r = br_radius, h = br_depth + eps);
    }
}