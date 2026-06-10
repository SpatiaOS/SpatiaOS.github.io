// ==========================================
// Parametric D-Frame with Round Protrusion
// ==========================================

$fn = 100;

// --- Main Base Dimensions ---
base_length = 0.395255;   // Overall length (x)
base_width  = 0.60219;    // Overall width (y)
base_height = 0.1095;     // Full extrusion depth (z)

// --- Frame Wall Thickness ---
wall_thickness = 0.05;    // Parametric wall thickness for D-frame

// --- Derived D-Shape Geometry ---
arc_radius = base_width / 2;              // Outer semicircle radius
flat_length = base_length - arc_radius;   // Straight rear segment length
inner_arc_radius = arc_radius - wall_thickness;

// --- Protrusion Footprint ---
protrusion_length = 0.259658;
protrusion_width  = 0.197373;
protrusion_height = 0.054745;
protrusion_left   = 0.0;
protrusion_front  = -0.1478;   // Relative to main base front edge (y=0)

// --- Round Tab ---
round_center_left  = 0.0942;
round_center_front = -0.0821;
round_radius = 0.0657;

// --- Concentric Hole in Tab ---
hole_radius = 0.0285;
hole_height = protrusion_height + 0.002;  // Overcut for clean difference

// ==========================================
// Helper: Generate arc points (degrees)
// ==========================================
function arc_points(center, r, start_angle, end_angle, n = 50) = 
    [for (i = [0:n]) 
        let(a = start_angle + (end_angle - start_angle) * i / n)
        [center[0] + r * cos(a), center[1] + r * sin(a)]
    ];

// ==========================================
// 2D D-Frame Profile (outer minus inner)
// ==========================================
module d_frame_profile() {
    // Outer D-shape: straight rear, sides, and rounded arc wall
    outer_pts = concat(
        [[0, 0], [flat_length, 0]],
        arc_points([flat_length, base_width / 2], arc_radius, -90, 90),
        [[flat_length, base_width], [0, base_width]]
    );

    // Inner through-opening: concentric offset D-shape
    inner_pts = concat(
        [[wall_thickness, wall_thickness], [flat_length, wall_thickness]],
        arc_points([flat_length, base_width / 2], inner_arc_radius, -90, 90),
        [[flat_length, base_width - wall_thickness], [wall_thickness, base_width - wall_thickness]]
    );

    difference() {
        polygon(outer_pts);
        polygon(inner_pts);
    }
}

// ==========================================
// Main Full-Depth Frame
// ==========================================
module main_frame() {
    linear_extrude(height = base_height, convexity = 4)
        d_frame_profile();
}

// ==========================================
// Shallow Protrusion with Round Tab and Hole
// ==========================================
module protrusion() {
    difference() {
        union() {
            // Rectangular footprint block
            translate([protrusion_left, protrusion_front, 0])
                cube([protrusion_length, protrusion_width, protrusion_height]);

            // Coaxial cylindrical round portion
            translate([round_center_left, round_center_front, 0])
                cylinder(h = protrusion_height, r = round_radius);
        }

        // Concentric circular cut through shallow band
        translate([round_center_left, round_center_front, -0.001])
            cylinder(h = hole_height, r = hole_radius);
    }
}

// ==========================================
// Final Assembly
// ==========================================
union() {
    main_frame();
    protrusion();
}