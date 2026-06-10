// OpenSCAD parametric model of rail with end block
$fn = 100;

// ============================================
// PARAMETRIC DIMENSIONS
// ============================================

// --- Main rail lower body ---
rail_length       = 0.748506;
rail_width        = 0.024642;
rail_lower_height = 0.018482;   // solid extrusion depth from base datum

// --- Rail shallow top layer ---
rail_top_thickness = 0.00462;    // raises upper surface toward 0.0231

// --- End block lower body ---
end_block_size        = 0.030803;
end_block_lower_height = 0.018482;

// --- End block shallow top layer ---
end_block_top_thickness = 0.00462;

// --- Circular recesses (pockets) ---
recess_radius    = 0.0043;
recess_z_bottom  = 0.0062;
recess_z_top     = 0.0185;
recess_height    = recess_z_top - recess_z_bottom;  // 0.0123

// --- End block rectangular cutout ---
cutout_size      = 0.027722;
cutout_z_top     = 0.0185;
cutout_z_bottom  = -0.0585;
cutout_height    = cutout_z_top - cutout_z_bottom;  // 0.077

// ============================================
// POSITIONS
// ============================================

// Rail datum: left end at X origin, front edge on Y axis
rail_origin_x = 0;
rail_front_y  = 0;

// Rail recess centers (x from left end, y offset from front edge)
rail_recess_x1 = 0.0138;
rail_recess_x2 = 0.7346;
rail_recess_y  = rail_front_y + 0.0108;

// End block placement
end_block_left_x  = 0.7192;
end_block_front_y = rail_front_y - 0.0361;   // in front of rail front edge

// End block circular recess center
end_recess_x = 0.7361;
end_recess_y = rail_front_y - 0.0192;        // in front of rail front edge

// ============================================
// MODULES
// ============================================

// Main reference rail lower body
module rail_lower() {
    translate([rail_origin_x, rail_front_y, 0])
        cube([rail_length, rail_width, rail_lower_height]);
}

// Second solid layer over full rail footprint
module rail_top() {
    translate([rail_origin_x, rail_front_y, rail_lower_height])
        cube([rail_length, rail_width, rail_top_thickness]);
}

// End block lower body
module end_block_lower() {
    translate([end_block_left_x, end_block_front_y, 0])
        cube([end_block_size, end_block_size, end_block_lower_height]);
}

// End block shallow top layer
module end_block_top() {
    translate([end_block_left_x, end_block_front_y, end_block_lower_height])
        cube([end_block_size, end_block_size, end_block_top_thickness]);
}

// Circular pocket (vertical recess band)
module circular_recess(px, py) {
    translate([px, py, recess_z_bottom])
        cylinder(h = recess_height, r = recess_radius);
}

// Deeper rectangular cutout sharing end block left and front edges
module end_block_cutout() {
    translate([end_block_left_x, end_block_front_y, cutout_z_bottom])
        cube([cutout_size, cutout_size, cutout_height]);
}

// ============================================
// ASSEMBLY
// ============================================

// Lower solid bodies with all pockets and cutouts removed
module lower_assembly() {
    difference() {
        union() {
            rail_lower();
            end_block_lower();
        }
        // Row of two circular recesses in rail
        circular_recess(rail_recess_x1, rail_recess_y);
        circular_recess(rail_recess_x2, rail_recess_y);
        // Circular recess in end block
        circular_recess(end_recess_x, end_recess_y);
        // Deeper rectangular cutout in end block
        end_block_cutout();
    }
}

// Final model: lower assembly plus shallow top layers
union() {
    lower_assembly();
    rail_top();
    end_block_top();
}