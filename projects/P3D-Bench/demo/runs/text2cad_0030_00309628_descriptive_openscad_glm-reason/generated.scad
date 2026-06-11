// ============================================================
// Parametric model: thin base plate with upright wall and cuts
// ============================================================

// --- Global resolution ---
$fn = 100;

// --- Base plate dimensions ---
plate_length   = 60;      // X extent of the base plate
plate_width    = 40;      // Y extent of the base plate
plate_thickness = 2;      // Z height (very thin)

// --- Wall dimensions ---
wall_height    = 30;       // how tall the wall rises from the plate top
wall_thickness = 3;        // wall depth along Y (narrow strip)
// Wall sits along one full X-edge of the plate, centered on that edge

// --- Floor plate rectangular cut ---
floor_cut_length  = 20;   // X size of the through-cut in the plate
floor_cut_width   = 12;   // Y size of the through-cut in the plate
floor_cut_offset_x = 18;  // X offset from plate origin
floor_cut_offset_y = 8;   // Y offset from plate origin (away from wall edge)

// --- Wall lower rectangular opening (near bottom) ---
wall_low_cut_width  = 14; // X size of the lower wall opening
wall_low_cut_height = 8;  // Z size of the lower wall opening
wall_low_cut_offset_x = 10;// X position along wall
wall_low_cut_z_start = 3; // Z start above plate top face

// --- Wall upper rectangular opening (smaller, higher) ---
wall_high_cut_width  = 8; // X size of the upper wall opening
wall_high_cut_height = 5; // Z size of the upper wall opening
wall_high_cut_offset_x = 30;// X position along wall
wall_high_cut_z_start = 16;// Z start above plate top face

// --- Wall round through-hole ---
hole_diameter   = 5;      // diameter of the round through-hole
hole_offset_x   = 40;     // X position along wall
hole_z_center   = 22;     // Z center above plate top face

// ============================================================
// Derived values (no manual duplication)
// ============================================================
wall_y_pos = plate_width - wall_thickness; // wall sits flush with far Y edge
wall_z_base = plate_thickness;             // wall starts on top of plate

// ============================================================
// Module: base plate (solid slab)
// ============================================================
module base_plate() {
    cube([plate_length, plate_width, plate_thickness]);
}

// ============================================================
// Module: upright wall along one full edge
// ============================================================
module upright_wall() {
    translate([0, wall_y_pos, wall_z_base])
        cube([plate_length, wall_thickness, wall_height]);
}

// ============================================================
// Module: rectangular through-cut in the floor plate
// Goes all the way through the thin sheet
// ============================================================
module floor_cut() {
    translate([floor_cut_offset_x, floor_cut_offset_y, -1])
        cube([floor_cut_length, floor_cut_width, plate_thickness + 2]);
}

// ============================================================
// Module: lower rectangular opening in the wall
// Passes through wall thickness at a lower height band
// ============================================================
module wall_lower_cut() {
    translate([
        wall_low_cut_offset_x,
        wall_y_pos - 1,
        wall_z_base + wall_low_cut_z_start
    ])
        cube([wall_low_cut_width, wall_thickness + 2, wall_low_cut_height]);
}

// ============================================================
// Module: upper rectangular opening in the wall
// Smaller opening at a higher stepped height band
// ============================================================
module wall_upper_cut() {
    translate([
        wall_high_cut_offset_x,
        wall_y_pos - 1,
        wall_z_base + wall_high_cut_z_start
    ])
        cube([wall_high_cut_width, wall_thickness + 2, wall_high_cut_height]);
}

// ============================================================
// Module: round through-hole in the wall
// ============================================================
module wall_round_hole() {
    translate([hole_offset_x, wall_y_pos - 1, wall_z_base + hole_z_center])
        rotate([-90, 0, 0])
            cylinder(d=hole_diameter, h=wall_thickness + 2);
}

// ============================================================
// Assemble the final model using boolean difference
// ============================================================
difference() {
    // Solid body: plate + wall
    union() {
        base_plate();
        upright_wall();
    }

    // Subtract all voids (cuts are through-material, not raised features)
    floor_cut();
    wall_lower_cut();
    wall_upper_cut();
    wall_round_hole();
}