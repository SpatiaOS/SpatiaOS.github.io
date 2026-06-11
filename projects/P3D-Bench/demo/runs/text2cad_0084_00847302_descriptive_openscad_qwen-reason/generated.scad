// ==========================================
// Parametric Rectangular Enclosure
// ==========================================

// Global resolution for curves
$fn = 100;

// --- Main Body Parameters ---
outer_width  = 80;   // X dimension
outer_depth  = 60;   // Y dimension
outer_height = 50;   // Z dimension
wall_thk     = 4;    // Side wall thickness
floor_thk    = 3;    // Bottom floor thickness

// --- Front Wall Feature: Horizontal Recess ---
recess_w     = 30;   // Width along X
recess_h     = 12;   // Height along Z
recess_d     = 2;    // Depth into wall (Y)
recess_z     = 22;   // Center height from bottom

// --- Right Wall Feature: Vertical Through Opening ---
slot_w       = 14;   // Width along Y
slot_h       = 34;   // Height along Z
slot_z_base  = 4;    // Starting height from bottom

// --- Interior Feature: Thin Ledge/Rib ---
ledge_thk    = 1.5;  // Thickness along Z
ledge_ext    = 10;   // Extent into interior along Y
ledge_z      = 16;   // Height from floor

// ==========================================
// Modeling Steps
// ==========================================

difference() {
    // Union combines the main shell with the interior ledge
    union() {
        // Step 1: Create outer box and subtract hollow interior (open top)
        difference() {
            cube([outer_width, outer_depth, outer_height]);
            // Inner cavity extends +1mm past top to ensure clean open face
            translate([wall_thk, wall_thk, floor_thk])
                cube([outer_width - 2*wall_thk, outer_depth - 2*wall_thk, outer_height - floor_thk + 1]);
        }

        // Step 2: Add thin interior ledge/rib attached to the back inner wall
        translate([wall_thk, wall_thk, ledge_z])
            cube([outer_width - 2*wall_thk, ledge_ext, ledge_thk]);
    }

    // Step 3: Subtract horizontal recess from front wall
    // Positioned to cut inward from the outer face (+0.05/0.1 prevents coplanar faces)
    translate([
        outer_width/2 - recess_w/2,
        outer_depth - recess_d + 0.05,
        recess_z - recess_h/2
    ])
    cube([recess_w, recess_d + 0.1, recess_h]);

    // Step 4: Subtract vertical through-opening from right wall
    // Spans full wall thickness to create a clean slot
    translate([
        outer_width - wall_thk - 0.05,
        outer_depth/2 - slot_w/2,
        slot_z_base
    ])
    cube([wall_thk + 0.1, slot_w, slot_h]);
}