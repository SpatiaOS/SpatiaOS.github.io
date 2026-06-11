// ==============================
// PARAMETRIC DIMENSIONS (all in mm)
// ==============================
// Base Parameters
base_length = 80;       // Total length of rounded base
base_width = 40;        // Width of base (curved ends have radius = base_width/2)
base_thickness = 15;    // Thickness of base plate
base_corner_r = base_width / 2; // Fully rounded end radius

// Raised Collar Parameters
collar_od = 30;         // Outer diameter of top annular collar
collar_id = 12;         // Inner diameter of collar bore
collar_height = 8;      // Height of collar above base top surface

// Stepped Center Bore Parameters
bore_step_dia = 18;     // Diameter of lower stepped bore section
bore_step_depth = 10;   // Depth of upper small bore from base top
through_hole_dia = 8;   // Diameter of full through opening

// Side Recess Parameters
side_recess_dia = 10;   // Diameter of shallow side recesses
side_recess_depth = 3;  // Depth of side recesses into base
num_side_recesses = 4;  // Number of side recesses (even count recommended)

// Underside Cut Pattern Parameters
undercut_dia = 12;      // Diameter of underside circular cuts
undercut_depth = 4;     // Depth of underside cuts from base bottom
undercut_pitch_r = 20;  // Radius of underside cut pattern from center
num_undercuts = 4;      // Number of underside pattern cuts

// Global Resolution Setting
$fn = 100;              // Smoothness for curved surfaces

// ==============================
// REUSABLE MODULES
// ==============================
// Rounded capsule-shaped base module
module capsule_base(length, width, thickness, corner_r) {
    linear_extrude(height=thickness, center=false) {
        // Generate rounded rectangle with fully curved ends
        offset(r=corner_r) square([length - 2*corner_r, width - 2*corner_r], center=true);
    }
}

// ==============================
// MAIN MODEL ASSEMBLY
// ==============================
difference() {
    // Combine base and raised collar as base solid
    union() {
        // Main rounded base plate
        capsule_base(base_length, base_width, base_thickness, base_corner_r);
        
        // Raised annular collar on top of base
        translate([0, 0, base_thickness]) cylinder(h=collar_height, d=collar_od, center=false);
    }

    // ------------------------------
    // Subtractive Cut Features
    // ------------------------------
    // 1. Stepped center bore + through hole
    // Upper small bore (through collar and top of base)
    translate([0, 0, base_thickness]) cylinder(h=collar_height + bore_step_depth, d=collar_id, center=false);
    // Lower stepped larger bore in base
    translate([0, 0, base_thickness + bore_step_depth]) cylinder(h=base_thickness - bore_step_depth, d=bore_step_dia, center=false);
    // Full through opening (cuts all layers)
    cylinder(h=base_thickness + collar_height + 2, d=through_hole_dia, center=true);

    // 2. Shallow side recesses
    for (i = [0:num_side_recesses - 1]) {
        rotate([0, 0, i * 360 / num_side_recesses])
        translate([base_length/2 + side_recess_depth/2, 0, base_thickness/2])
        cylinder(h=side_recess_depth + 1, d=side_recess_dia, center=true);
    }

    // 3. Underside circular cut pattern
    for (i = [0:num_undercuts - 1]) {
        rotate([0, 0, i * 360 / num_undercuts])
        translate([undercut_pitch_r, 0, -undercut_depth/2])
        cylinder(h=undercut_depth + 1, d=undercut_dia, center=true);
    }
}