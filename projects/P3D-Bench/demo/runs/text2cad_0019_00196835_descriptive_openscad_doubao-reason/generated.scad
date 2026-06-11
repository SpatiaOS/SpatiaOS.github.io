// Global Resolution Setting
$fn = 64;

// ==============================
// Parameter Definitions (all units mm)
// ==============================
// Main Rail Dimensions
rail_length = 200;
rail_width = 12;
rail_base_height = 6;
rail_top_shelf_height = 1.5; // Shallow full-length top layer

// Rail End Recess Features
rail_recess_diameter = 6;
rail_recess_depth = 2;
rail_recess_edge_offset = 10; // Distance from rail end to recess center

// End Block Dimensions (wider extension at one end of rail)
end_block_length = 30;
end_block_total_width = 40;
end_block_top_shelf_height = rail_top_shelf_height; // Matches rail top layer

// End Block Feature Dimensions
end_block_shallow_recess_dia = 10;
end_block_shallow_recess_depth = rail_recess_depth;
end_block_deep_cutout_width = 15;
end_block_deep_cutout_length = 20;
end_block_deep_cutout_depth = 4.8; // Deep cut into base, creates stepped depth

// ==============================
// Main Model Assembly
// ==============================
difference() {
    // Union of all solid base geometry
    union() {
        // Main rail base body
        translate([0, 0, 0])
        cube([rail_length, rail_width, rail_base_height]);
        
        // Full-length shallow top rail layer
        translate([0, 0, rail_base_height])
        cube([rail_length, rail_width, rail_top_shelf_height]);
        
        // End block base (wider extension)
        translate([
            rail_length,
            -(end_block_total_width - rail_width)/2, // Center block on rail
            0
        ])
        cube([end_block_length, end_block_total_width, rail_base_height]);
        
        // End block matching shallow top layer
        translate([
            rail_length,
            -(end_block_total_width - rail_width)/2,
            rail_base_height
        ])
        cube([end_block_length, end_block_total_width, end_block_top_shelf_height]);
    }

    // ------------------------------
    // Removed Features (Cuts/Recesses)
    // ------------------------------
    // Left end rail recess
    translate([rail_recess_edge_offset, rail_width/2, rail_base_height + rail_top_shelf_height])
    cylinder(h=-rail_recess_depth - 0.1, d=rail_recess_diameter); // Extra 0.1 ensures clean cut
    
    // Right end rail recess (near end block)
    translate([rail_length - rail_recess_edge_offset, rail_width/2, rail_base_height + rail_top_shelf_height])
    cylinder(h=-rail_recess_depth - 0.1, d=rail_recess_diameter);
    
    // End block shallow circular recess
    translate([
        rail_length + end_block_length/2,
        rail_width/2, // Align with rail centerline
        rail_base_height + end_block_top_shelf_height
    ])
    cylinder(h=-end_block_shallow_recess_depth - 0.1, d=end_block_shallow_recess_dia);
    
    // End block deep cutout (stepped depth feature)
    translate([
        rail_length + (end_block_length - end_block_deep_cutout_length)/2,
        -end_block_deep_cutout_width/2,
        rail_base_height + end_block_top_shelf_height
    ])
    cube([
        end_block_deep_cutout_length,
        end_block_deep_cutout_width,
        -(end_block_top_shelf_height + end_block_deep_cutout_depth + 0.1)
    ]);
}