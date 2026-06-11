// ==========================================
// Parametric Sheet with Upright Wall and Cutouts
// ==========================================

// --- Resolution ---
$fn = 60;

// --- Base Sheet ---
base_width  = 100;  // X span
base_depth  = 60;   // Y span
base_thick  = 2;    // Very thin Z height

// --- Upright Wall ---
// Narrow strip rising from top face along the full back edge (y=0)
wall_height = 35;   // Z rise above base
wall_thick  = 4;    // Y thickness of wall strip

// --- Floor Plate Rectangular Cutout ---
// Through-cut in the thin sheet
floor_cut_w = 25;
floor_cut_d = 15;
floor_cut_x = 20;   // X position from left edge
floor_cut_y = 25;   // Y position from front (away from wall)

// --- Wall Openings (through wall thickness) ---
// Lower rectangular opening near bottom
wall_low_w   = 20;
wall_low_h   = 8;
wall_low_x   = 15;
wall_low_z   = 3;   // Height above base top face

// Higher smaller rectangular opening
wall_high_w  = 12;
wall_high_h  = 5;
wall_high_x  = 65;
wall_high_z  = 22;  // Height above base top face

// --- Round Through-Hole in Wall ---
hole_diam    = 6;
hole_x       = 40;
hole_z       = 14;  // Center height above base top face

// ==========================================
// Geometry
// ==========================================

difference() {
    // Solid body: base + wall
    union() {
        // Floor plate
        cube([base_width, base_depth, base_thick]);
        
        // Upright wall along back edge, full width
        translate([0, 0, base_thick])
            cube([base_width, wall_thick, wall_height]);
    }
    
    // --- Floor plate rectangular through-cut ---
    translate([floor_cut_x, floor_cut_y, -1])
        cube([floor_cut_w, floor_cut_d, base_thick + 2]);
    
    // --- Lower wall opening (through thickness) ---
    translate([wall_low_x, -1, base_thick + wall_low_z])
        cube([wall_low_w, wall_thick + 2, wall_low_h]);
    
    // --- Higher wall opening (through thickness) ---
    translate([wall_high_x, -1, base_thick + wall_high_z])
        cube([wall_high_w, wall_thick + 2, wall_high_h]);
    
    // --- Round through-hole in wall ---
    // Rotated cylinder aligned to wall thickness (Y axis)
    translate([hole_x, wall_thick / 2, base_thick + hole_z])
        rotate([90, 0, 0])
        cylinder(d = hole_diam, h = wall_thick + 2, center = true);
}