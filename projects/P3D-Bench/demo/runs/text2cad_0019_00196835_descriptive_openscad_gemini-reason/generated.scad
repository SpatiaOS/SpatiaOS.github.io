// ==========================================
// Parametric Variables
// ==========================================

// Resolution for curved surfaces
$fn = 100;

// Base Rail Dimensions
rail_length = 150;
rail_width = 10;
rail_base_height = 6;

// Top Layer Dimensions (shallow, full-length)
top_layer_width = 6;
top_layer_height = 2;

// Extension Block Dimensions (wider, at one end)
ext_length = 30;
ext_width = 24;
ext_top_width = 18;

// Rail Removed Features (Small circular cuts)
rail_hole_dia = 3;
rail_hole_1_pos = 142; // Positioned near the far end
rail_hole_2_pos = 40;  // Positioned near the extension end

// Extension Removed Features (Stepped depth cutouts)
ext_recess_dia = 12;
ext_recess_depth = 2.5; // Creates a shallow recess through top layer
ext_deep_cutout_dia = 5; // Deeper cutout through the lower body

// ==========================================
// Reusable Modules
// ==========================================

// Module: stepped_block
// Creates a rectangular body with a base layer and a centered shallow top layer
module stepped_block(length, base_w, base_h, top_w, top_h) {
    union() {
        // Lower body (base layer)
        translate([0, -base_w/2, 0])
            cube([length, base_w, base_h]);
        
        // Upper body (shallow top layer)
        translate([0, -top_w/2, base_h])
            cube([length, top_w, top_h]);
    }
}

// Module: stepped_hole
// Creates a compound cylindrical negative volume for counterbored/stepped cuts
module stepped_hole(recess_d, recess_depth, deep_d, total_depth, top_z) {
    union() {
        // Shallow circular recess (oversized slightly in Z for clean cuts)
        translate([0, 0, top_z - recess_depth])
            cylinder(h = recess_depth + 1, d = recess_d);
        
        // Much deeper cutout (through hole, extending below Z=0)
        translate([0, 0, -1])
            cylinder(h = total_depth + 2, d = deep_d);
    }
}

// ==========================================
// Main Model Assembly
// ==========================================

difference() {
    // 1. Positive Geometry: Union of the long rail and the wider extension block
    union() {
        // Long slim rectangular rail with shallow top layer
        stepped_block(
            length = rail_length,
            base_w = rail_width,
            base_h = rail_base_height,
            top_w = top_layer_width,
            top_h = top_layer_height
        );

        // Wider block-like extension at one end with matching top layer
        stepped_block(
            length = ext_length,
            base_w = ext_width,
            base_h = rail_base_height,
            top_w = ext_top_width,
            top_h = top_layer_height
        );
    }

    // 2. Negative Geometry: Subtractive features and cutouts

    // Small circular removed feature near the far end of the rail
    translate([rail_hole_1_pos, 0, -1])
        cylinder(h = rail_base_height + top_layer_height + 2, d = rail_hole_dia);

    // Small circular removed feature near the extension end of the rail
    translate([rail_hole_2_pos, 0, -1])
        cylinder(h = rail_base_height + top_layer_height + 2, d = rail_hole_dia);

    // Extension end detailing: shallow recess and a much deeper cutout
    // Centered within the extension block
    translate([ext_length / 2, 0, 0])
        stepped_hole(
            recess_d = ext_recess_dia,
            recess_depth = ext_recess_depth,
            deep_d = ext_deep_cutout_dia,
            total_depth = rail_base_height + top_layer_height,
            top_z = rail_base_height + top_layer_height
        );
}