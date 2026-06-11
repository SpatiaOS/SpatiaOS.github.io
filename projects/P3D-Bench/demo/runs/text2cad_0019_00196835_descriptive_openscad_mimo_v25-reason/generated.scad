// =============================================
// Rail Part with End Block
// =============================================

// Main rail dimensions
rail_length = 200;        // total rail length
rail_width = 15;          // narrow rail width
rail_base_height = 8;     // base body height
rail_top_height = 3;      // shallow full-length top layer

// End block dimensions
block_width = 35;         // wider than rail
block_length = 40;        // block extent along rail
block_top_height = 3;     // matches rail top layer

// Rail recess features (near each end)
rail_recess_dia = 4;      // small circular recess diameter
rail_recess_depth = 1.5;  // shallow recess depth
rail_recess_inset = 18;   // distance from each rail end

// End block shallow recess
block_shallow_dia = 10;   // circular recess diameter
block_shallow_depth = 2;  // shallow depth on top layer

// End block deep cutout (stepped through base)
deep_cutout_dia = 12;     // diameter of deep cutout
deep_cutout_depth = 14;   // extends through base and beyond

// Resolution
$fn = 80;

// =============================================
// Module: Rail Body
// =============================================
module rail_body() {
    union() {
        // Base rail strip
        cube([rail_length, rail_width, rail_base_height]);
        // Shallow top layer spanning full rail
        translate([0, 0, rail_base_height])
            cube([rail_length, rail_width, rail_top_height]);
    }
}

// =============================================
// Module: End Block Body
// =============================================
module end_block_body() {
    // Position block at right end of rail, centered on rail width
    translate([rail_length - block_length, (rail_width - block_width) / 2, 0])
    union() {
        // Block base (same height as rail base)
        cube([block_length, block_width, rail_base_height]);
        // Block shallow top layer
        translate([0, 0, rail_base_height])
            cube([block_length, block_width, block_top_height]);
    }
}

// =============================================
// Module: Rail Recesses (small circles near ends)
// =============================================
module rail_recesses() {
    // Recess near left end
    translate([rail_recess_inset, rail_width / 2, rail_base_height + rail_top_height - rail_recess_depth])
        cylinder(d = rail_recess_dia, h = rail_recess_depth + 0.1);
    // Recess near right end (inside block area)
    translate([rail_length - rail_recess_inset, rail_width / 2, rail_base_height + rail_top_height - rail_recess_depth])
        cylinder(d = rail_recess_dia, h = rail_recess_depth + 0.1);
}

// =============================================
// Module: End Block Shallow Recess
// =============================================
module block_shallow_recess() {
    // Centered on block, shallow depth into top layer
    translate([
        rail_length - block_length / 2,
        rail_width / 2,
        rail_base_height + block_top_height - block_shallow_depth
    ])
        cylinder(d = block_shallow_dia, h = block_shallow_depth + 0.1);
}

// =============================================
// Module: End Block Deep Cutout
// =============================================
module block_deep_cutout() {
    // Deep cutout - offset from shallow recess, extends through base
    translate([
        rail_length - block_length / 2 + block_shallow_dia * 0.6,
        rail_width / 2,
        -0.1
    ])
        cylinder(d = deep_cutout_dia, h = deep_cutout_depth);
}

// =============================================
// Main Assembly
// =============================================
difference() {
    // Solid geometry: rail + end block
    union() {
        rail_body();
        end_block_body();
    }
    // Subtract all recesses and cutouts
    rail_recesses();
    block_shallow_recess();
    block_deep_cutout();
}