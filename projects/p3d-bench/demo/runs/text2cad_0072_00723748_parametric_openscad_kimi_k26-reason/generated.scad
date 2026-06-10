// ==========================================
// Parametric Dimensions
// ==========================================

// Base plate
base_length = 0.703125;
base_width  = 0.75;
base_height = 0.013125;

// Circular through-hole in base
base_hole_x = 0.075;
base_hole_y = 0.6562;
base_hole_r = 0.0328;

// Main rectangular block
block_length = 0.646875;
block_width  = 0.50625;
block_height = 0.645;
block_left   = 0.0563;   // offset from base left edge
block_front  = 0.0844;   // offset from base front edge

// Annular collars on block top
collar_or     = 0.0656;  // outer radius
collar_ir     = 0.0328;  // inner radius (hole size)
collar_h      = 0.0375;  // collar height above block
collar_x      = 0.2062;  // common X axis for both collars
collar_y1     = 0.1968;  // front collar Y
collar_y2     = 0.4781;  // rear collar Y

// Shallow top recess (combined bounding span)
recess_length = 0.473437;
recess_width  = 0.39375;
recess_depth  = 0.0037;  // blind cut depth from block top
recess_left   = 0.1734;  // offset from base left edge
recess_front  = 0.1406;  // offset from base front edge

// Collar center openings (through collar + shallow band)
hole_y1 = 0.1969;
hole_y2 = 0.4781;

// Render resolution
$fn = 100;

// ==========================================
// Derived Heights
// ==========================================
block_top_z   = base_height + block_height;        // 0.658125
collar_top_z  = block_top_z + collar_h;            // 0.695625
recess_floor_z = block_top_z - recess_depth;       // 0.654425

// ==========================================
// Modules
// ==========================================

module base_plate() {
    cube([base_length, base_width, base_height]);
}

module main_block() {
    translate([block_left, block_front, base_height])
        cube([block_length, block_width, block_height]);
}

module solid_collar(cx, cy) {
    translate([cx, cy, block_top_z])
        cylinder(h=collar_h, r=collar_or);
}

module base_through_hole() {
    translate([base_hole_x, base_hole_y, -1])
        cylinder(h=base_height + 2, r=base_hole_r);
}

module top_recess() {
    // Blind pocket cut into block top face
    translate([recess_left, recess_front, recess_floor_z])
        cube([recess_length, recess_width, recess_depth + 0.001]);
}

module collar_center_hole(cx, cy) {
    // Removes collar core and continues through shallow top band
    translate([cx, cy, recess_floor_z])
        cylinder(h=collar_h + recess_depth + 0.001, r=collar_ir);
}

// ==========================================
// Assembly
// ==========================================
difference() {
    union() {
        base_plate();
        main_block();
        solid_collar(collar_x, collar_y1);
        solid_collar(collar_x, collar_y2);
    }

    // Subtractive features
    base_through_hole();
    top_recess();
    collar_center_hole(collar_x, hole_y1);
    collar_center_hole(collar_x, hole_y2);
}