// Global resolution setting for smooth curved surfaces
$fn = 100;

// --------------------------
// Parametric Model Definitions
// --------------------------
// Coordinate system: Origin at front-bottom-left corner of the main base
// X: Left-to-right, Y: Front-to-back, Z: Bottom-to-top (all dimensions in mm)

// Main base dimensions
base_length = 0.341352;    // Total X length of base
base_width = 0.199422;     // Total Y width of base
base_height = 0.065029;    // Total Z thickness of base
base_extrude = 0.065;      // Primary extrusion depth (matches base thickness)

// Low rounded annular section (integral to base right end)
annulus_cx = 0.2416;       // X center from left edge
annulus_cy = 0.0997;       // Y center from front edge
annulus_outer_r = 0.0997;  // Outer radius of annular ring
annulus_inner_r = 0.0434;  // Inner radius of through-hole

// Tall hollow overhanging sleeve
sleeve_cx = -0.0834;       // X center offset from base left edge
sleeve_cy = 0.0998;        // Y center offset from base front edge
sleeve_outer_r = 0.1301;   // Outer radius (matches 0.2602 span = 2*0.1301)
sleeve_inner_r = 0.0867;   // Inner radius for hollow bore
sleeve_height = 0.2601;    // Total height from base datum (Z=0 to Z=0.2601)

// Projecting straight-sided arm
arm_length = 0.325145;     // X dimension of arm
arm_width = 0.260116;      // Y dimension of arm
arm_total_height = 0.130058;// Full solid height before cut
arm_left_x = -0.4086;      // Left edge X (overhangs base left)
arm_front_y = -0.0303;     // Front edge Y (overhangs base front)
arm_cut_band_z = 0.065;    // Cut lower section from Z=0 to this height
arm_top_z = 0.1301;        // Final top surface height from base datum
// Calculated arm edges
arm_right_x = arm_left_x + arm_length;
arm_back_y = arm_front_y + arm_width;

// Triangular support gusset web
web_plan_run = 0.108382;   // Horizontal X run length from sleeve
web_thickness = 0.0217;    // Material thickness in Y direction
web_x_left = 0.0466;       // Left edge (adjacent to sleeve outer wall)
web_x_bound_right = 0.1863;// Right placement bound
web_y_front = 0.0781;      // Front edge Y
web_y_back = 0.0996;       // Back edge Y
web_rise = 0.195087;       // Vertical rise from base top to sleeve top
web_z_base = base_height;  // Z height at base top surface
web_z_sleeve = sleeve_height; // Z height at sleeve top surface
// Calculated web right edge
web_x_right = web_x_left + web_plan_run;

// --------------------------
// Reusable Component Modules
// --------------------------

// Main base with integrated rounded annular end and through-hole
module base() {
    linear_extrude(height=base_height) {
        difference() {
            union() {
                // Straight rectangular body section
                square([annulus_cx, base_width], center=false);
                // Rounded circular end forming outer profile of annulus
                translate([annulus_cx, annulus_cy])
                    circle(r=annulus_outer_r);
            }
            // Through-hole for annular section, cuts full base thickness
            translate([annulus_cx, annulus_cy])
                circle(r=annulus_inner_r);
        }
    }
}

// Tall hollow annular sleeve
module sleeve() {
    difference() {
        // Outer sleeve cylinder
        translate([sleeve_cx, sleeve_cy, 0])
            cylinder(h=sleeve_height, r=sleeve_outer_r, center=false);
        // Inner bore cut (oversized for clean manifold)
        translate([sleeve_cx, sleeve_cy, -0.1])
            cylinder(h=sleeve_height + 0.2, r=sleeve_inner_r, center=false);
    }
}

// Projecting stepped arm, cut to create raised tier
module arm() {
    difference() {
        // Full solid arm blank
        translate([arm_left_x, arm_front_y, 0])
            cube([arm_length, arm_width, arm_top_z], center=false);
        // Remove lower band to create the stepped tier
        translate([arm_left_x - 0.01, arm_front_y - 0.01, -0.1])
            cube([arm_length + 0.02, arm_width + 0.02, arm_cut_band_z + 0.1], center=false);
    }
}

// Triangular support gusset between sleeve and base top
module web() {
    x1 = web_x_left;
    x2 = web_x_right;
    y1 = web_y_front;
    y2 = web_y_back;
    z1 = web_z_base;
    z2 = web_z_sleeve;
    
    // Vertices for right-triangular prism geometry
    points = [
        [x1, y1, z1],  // 0: Left-front-bottom
        [x1, y2, z1],  // 1: Left-back-bottom
        [x1, y1, z2],  // 2: Left-front-top
        [x1, y2, z2],  // 3: Left-back-top
        [x2, y1, z1],  // 4: Right-front-bottom
        [x2, y2, z1]   // 5: Right-back-bottom
    ];
    
    // Face definitions (outward-facing winding order for manifold geometry)
    faces = [
        [0, 2, 4],     // Front triangular face
        [1, 5, 3],     // Back triangular face
        [0, 1, 3, 2],  // Left vertical face (mated to sleeve)
        [0, 4, 5, 1],  // Bottom horizontal face (mated to base)
        [2, 3, 5, 4]   // Sloped top face
    ];
    
    polyhedron(points=points, faces=faces, convexity=2);
}

// --------------------------
// Final Model Assembly
// --------------------------
union() {
    base();
    sleeve();
    arm();
    web();
}