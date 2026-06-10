// Parametric CAD Model
$fn = 100; // smooth curves

// --- Base Plate ---
base_length = 0.703125;
base_width = 0.75;
base_height = 0.013125;

// Base through-hole
base_hole_x = 0.075;    // from left edge
base_hole_y = 0.6562;   // from front edge
base_hole_r = 0.0328;

// --- Main Rectangular Block ---
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;
block_left_offset = 0.0563;   // from base left edge
block_front_offset = 0.0844;  // from base front edge

// --- Annular Collars ---
collar_outer_r = 0.0656;
collar_inner_r = 0.0328;
collar_height = 0.0375;
collar_x = 0.2062;      // from base left edge
collar1_y = 0.1968;     // from base front edge
collar2_y = 0.4781;     // from base front edge

// --- Shallow Rectangular Recesses ---
recess_depth = 0.0037;
recess_bottom_z = 0.6544;   // from base underside
recess_top_z = 0.6581;      // from base underside
// Combined bounding box (outer limits)
recess_left   = 0.1734;
recess_right  = base_length - 0.0563;   // right offset 0.0563 from right edge
recess_front  = 0.1406;
recess_back   = base_width - 0.2157;    // back offset 0.2157 from back edge
// Split into two separate recesses along Y with a small gap
recess_gap = 0.02;
recess_mid_y = (recess_front + recess_back) / 2;
recess1_y_min = recess_front;
recess1_y_max = recess_mid_y - recess_gap/2;
recess2_y_min = recess_mid_y + recess_gap/2;
recess2_y_max = recess_back;

// --- Holes through collars and recess band ---
hole_r = 0.0328;
hole_bottom_z = recess_bottom_z;
hole_top_z = base_height + block_height + collar_height; // collar top

// ==================== MODULES ====================
module base_plate() {
    cube([base_length, base_width, base_height]);
}

module main_block() {
    translate([block_left_offset, block_front_offset, base_height])
        cube([block_length, block_width, block_height]);
}

module collar() {
    difference() {
        cylinder(r=collar_outer_r, h=collar_height);
        cylinder(r=collar_inner_r, h=collar_height);
    }
}

module collars() {
    translate([collar_x, collar1_y, base_height + block_height])
        collar();
    translate([collar_x, collar2_y, base_height + block_height])
        collar();
}

module recess1_cut() {
    translate([recess_left, recess1_y_min, recess_bottom_z])
        cube([recess_right - recess_left, recess1_y_max - recess1_y_min, recess_depth]);
}

module recess2_cut() {
    translate([recess_left, recess2_y_min, recess_bottom_z])
        cube([recess_right - recess_left, recess2_y_max - recess2_y_min, recess_depth]);
}

module collar_holes() {
    translate([collar_x, collar1_y, hole_bottom_z])
        cylinder(r=hole_r, h=hole_top_z - hole_bottom_z);
    translate([collar_x, collar2_y, hole_bottom_z])
        cylinder(r=hole_r, h=hole_top_z - hole_bottom_z);
}

module base_hole() {
    translate([base_hole_x, base_hole_y, 0])
        cylinder(r=base_hole_r, h=base_height + 0.1);
}

// ==================== FINAL MODEL ====================
difference() {
    union() {
        base_plate();
        main_block();
        collars();
    }
    // Subtractions
    base_hole();
    recess1_cut();
    recess2_cut();
    collar_holes();
}