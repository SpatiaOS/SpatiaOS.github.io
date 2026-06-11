// === Parameters ===

// Base slab
base_x      = 100;   // full length (X)
base_y      = 70;    // full width  (Y)
base_z      = 2;     // slab thickness (Z)

// Front exposed strip (gap between front edge and rear block)
front_strip = 15;    // Y depth of exposed front strip

// Rear raised block
rear_y      = base_y - front_strip;  // depth of rear block
rear_z      = 4;     // height of rear block above base top

// Narrow side strips (run along left/right of raised area)
strip_w     = 5;     // width of each side strip (X)
strip_z     = 3;     // additional height above rear block

// Transverse feature with internal opening
trans_depth   = 5;   // Y dimension (thin bar)
trans_height  = 8;   // Z height above base top surface
trans_y_off   = 22;  // Y offset from start of rear area
slot_width    = 68;  // X extent of internal opening
slot_height   = 3.5; // Z extent of internal opening

// Stepped bottom — deeper section extends below the base
step_drop     = 3;   // how far below z=0 the deep part goes
step_y_start  = front_strip;   // begins at rear-block front edge
step_y_len    = 24;  // Y length of the deeper section

$fn = 50;

// === Modules ===

// 1. Thin rectangular base slab
module base_slab() {
    cube([base_x, base_y, base_z]);
}

// 2. Rear raised rectangular block (leaves front strip exposed)
module rear_block() {
    translate([0, front_strip, base_z])
        cube([base_x, rear_y, rear_z]);
}

// 3. Narrow raised strips along left and right sides of the rear block
module side_strips() {
    h = strip_z;
    z0 = base_z + rear_z;
    // Left strip
    translate([0, front_strip, z0])
        cube([strip_w, rear_y, h]);
    // Right strip
    translate([base_x - strip_w, front_strip, z0])
        cube([strip_w, rear_y, h]);
}

// 4. Thin transverse bar spanning full width with a real internal slot
module transverse_feature() {
    z0 = base_z;
    translate([0, front_strip + trans_y_off, z0])
        difference() {
            // Solid bar
            cube([base_x, trans_depth, trans_height]);
            // Internal rectangular opening (centred in X and Z)
            translate([(base_x - slot_width) / 2,
                       -0.1,
                       (trans_height - slot_height) / 2])
                cube([slot_width, trans_depth + 0.2, slot_height]);
        }
}

// 5. Stepped bottom — a section that hangs below the base plane
module stepped_bottom() {
    translate([0, step_y_start, -step_drop])
        cube([base_x, step_y_len, step_drop]);
}

// === Assembly ===
union() {
    base_slab();
    rear_block();
    side_strips();
    transverse_feature();
    stepped_bottom();
}