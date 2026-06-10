// === Parameters ===
// Base footprint and plate
base_length   = 0.375;       // X extent
base_width    = 0.75;        // Y extent
base_thick    = 0.013393;    // Base plate thickness
wall_thick    = 0.013393;    // Shell wall thickness
wall_reach    = 0.2277;      // Wall height from base datum
base_corner_r = 0.066964;    // Rounded corner radius for base footprint

// Sleeve/post feature
sleeve_length = 0.066964;    // Sleeve X extent
sleeve_width  = 0.133929;    // Sleeve Y extent
sleeve_height = 0.214286;    // Sleeve extrusion height
sleeve_x      = 0.308;       // Sleeve X offset from left edge
sleeve_y      = 0.308;       // Sleeve Y offset from front edge
sleeve_cr     = 0.033482;    // Sleeve corner radius (stadium shape)
sleeve_reach  = 0.442;       // Total reach from base datum

// Lower continuation depths (below base underside z=0)
lower_start_z = 0.2277;      // Bottom of deeper feature below z=0
lower_reach_z = 0.013393;    // Top of deeper feature below z=0

// Circular hole cut parameters
hole_radius   = 0.0067;
hole_x        = 0.3616;      // Hole axis X position
hole_y_front  = 0.0672;      // Front hole axis Y
hole_y_back   = 0.6828;      // Back hole axis Y
hole_z_lo     = 0.1674;      // Bottom of hole height band
hole_z_hi     = 0.1808;      // Top of hole height band
hole_z_mid    = (hole_z_lo + hole_z_hi) / 2;  // Center Z
hole_cut_dep  = 0.013393;    // Cut depth through wall

$fn = 100;

// --- 2D Modules ---

// Rounded rectangle with corner radius r, origin at lower-left
module rrect(w, l, r) {
    hull() {
        translate([r, r])     circle(r = r);
        translate([w-r, r])   circle(r = r);
        translate([r, l-r])   circle(r = r);
        translate([w-r, l-r]) circle(r = r);
    }
}

// Hollow shell profile: outer rounded rect minus inward offset
module shell2d(w, l, r, t) {
    difference() {
        rrect(w, l, r);
        offset(r = -t) rrect(w, l, r);
    }
}

// --- Main Assembly ---
difference() {
    union() {
        // Step 1: Solid base plate (z = 0 to base_thick)
        linear_extrude(height = base_thick)
            rrect(base_length, base_width, base_corner_r);

        // Step 2: Hollow wall shell (z = 0 to wall_reach)
        // Preserves curved outline; interior is open
        linear_extrude(height = wall_reach)
            shell2d(base_length, base_width, base_corner_r, wall_thick);

        // Step 3: Upper sleeve/post (z = wall_reach to sleeve_reach)
        // Hollow stadium-shaped post with open interior
        translate([sleeve_x, sleeve_y, wall_reach])
            linear_extrude(height = sleeve_height)
                shell2d(sleeve_length, sleeve_width, sleeve_cr, wall_thick);

        // Step 4a: Shallower lower continuation - wall shell below base
        // Bridges deeper sleeve to base (z = -base_thick to 0)
        translate([0, 0, -base_thick])
            linear_extrude(height = base_thick)
                shell2d(base_length, base_width, base_corner_r, wall_thick);

        // Step 4b: Deeper lower continuation - sleeve below base
        // Contained within shallower footprint, shares right edge
        // z = -lower_start_z to approx -lower_reach_z
        translate([sleeve_x, sleeve_y, -lower_start_z])
            linear_extrude(height = sleeve_height)
                shell2d(sleeve_length, sleeve_width, sleeve_cr, wall_thick);
    }

    // Step 5: Front circular cut through right wall
    // Axis at (hole_x, hole_y_front), height band hole_z_lo to hole_z_hi
    translate([hole_x, hole_y_front, hole_z_mid])
        rotate([0, 90, 0])
            cylinder(h = hole_cut_dep * 4, r = hole_radius, center = true);

    // Step 6: Back circular cut through right wall
    // Axis at (hole_x, hole_y_back), same height band
    translate([hole_x, hole_y_back, hole_z_mid])
        rotate([0, 90, 0])
            cylinder(h = hole_cut_dep * 4, r = hole_radius, center = true);
}