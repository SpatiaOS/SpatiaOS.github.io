// Parametric concentric annular assembly
// All dimensions in consistent units; z-reference at mid-plane
$fn = 120;

// === Shared coaxial center ===
cx = 0.375;                // center X (0.375 from left edge)
cy = 0.375;                // center Y (0.375 from front edge)

// === Main circular annulus base ===
main_outer_r   = 0.375;   // outer radius
main_inner_r   = 0.3375;  // inner radius (central opening)
main_z_bottom  = -0.0281; // z-min from reference
main_z_top     =  0.0281; // z-max from reference

// === Central annular collar ===
collar_outer_r  = 0.075;  // 0.15 / 2 footprint radius
collar_inner_r  = 0.0375; // through-void inner radius
collar_z_bottom = -0.0234;
collar_z_top    =  0.0234;

// === Radial rib web ===
rib_outer_r    = main_inner_r;   // ribs meet inner wall of main ring
rib_inner_r    = collar_outer_r; // ribs meet outer wall of collar
rib_z_bottom   = -0.0141;
rib_z_top      =  0.0141;

// Rib angular placement (math convention: 0°=+X, 90°=+Y, 270°=-Y=front)
// Three ribs ~120° apart; angles tuned to match specified bounding box
// (footprint 0.6184 x 0.521, offsets L0.0658 R0.0658 F0.0387 B0.1903)
rib_angles     = [270, 28, 152];
rib_half_angle = 5;              // half angular width per rib (degrees)
rib_arc_segs   = 24;             // arc polygon resolution

// =====================================================
// Helper modules
// =====================================================

// Annular ring (hollow cylinder section)
module annulus(outer_r, inner_r, height) {
    difference() {
        cylinder(h = height, r = outer_r);
        translate([0, 0, -0.001])
            cylinder(h = height + 0.002, r = inner_r);
    }
}

// Single radial rib with arc-based inner and outer outlines
module arc_rib(angle, half_w, r_out, r_in, height) {
    a_start = angle - half_w;
    a_end   = angle + half_w;
    n       = rib_arc_segs;
    linear_extrude(height = height)
        polygon(concat(
            // Outer arc points (counter-clockwise)
            [for (i = [0:n])
                let(a = a_start + (a_end - a_start) * i / n)
                [r_out * cos(a), r_out * sin(a)]
            ],
            // Inner arc points (clockwise / reversed)
            [for (i = [0:n])
                let(a = a_end - (a_end - a_start) * i / n)
                [r_in * cos(a), r_in * sin(a)]
            ]
        ));
}

// =====================================================
// Assembly – all features on shared coaxial center
// =====================================================
translate([cx, cy, 0]) {

    // 1) Main annulus base ring
    translate([0, 0, main_z_bottom])
        annulus(main_outer_r, main_inner_r,
                main_z_top - main_z_bottom);

    // 2) Central annular collar with through void
    translate([0, 0, collar_z_bottom])
        annulus(collar_outer_r, collar_inner_r,
                collar_z_top - collar_z_bottom);

    // 3) Radial rib web – three arc-outlined ribs with
    //    elongated slot-like openings between them
    for (a = rib_angles)
        translate([0, 0, rib_z_bottom])
            arc_rib(a, rib_half_angle,
                    rib_outer_r, rib_inner_r,
                    rib_z_top - rib_z_bottom);
}