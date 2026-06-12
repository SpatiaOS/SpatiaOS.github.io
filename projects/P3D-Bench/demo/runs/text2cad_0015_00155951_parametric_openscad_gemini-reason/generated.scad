// Parameters
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;
base_corner_radius = 0.0625;

hole_x = 0.375;
hole_y = 0.25;
hole_r = 0.125;

collar_depth = 0.0375;
collar_outer_r = 0.2125;

tab_width = 0.125;
tab_depth = 0.375;
tab_y_offset = 0.0625;
tab_reach = 0.5875;
tab_hole_r = 0.0937;

// Calculated Values
tab_arc_r = tab_depth / 2;
tab_center_z = tab_reach - tab_arc_r;
tab_center_y = tab_y_offset + tab_arc_r;

// Global Resolution
$fn = 100;

// Reusable Modules

// 2D profile for the base plate with arc-edges (rounded corners)
module rounded_rect(l, w, r) {
    hull() {
        translate([r, r]) circle(r);
        translate([l - r, r]) circle(r);
        translate([r, w - r]) circle(r);
        translate([l - r, w - r]) circle(r);
    }
}

// Solid base plate
module base_plate() {
    linear_extrude(height = base_height)
        rounded_rect(base_length, base_width, base_corner_radius);
}

// Underside annular collar (solid part, hole cut later)
module underside_collar() {
    translate([hole_x, hole_y, -collar_depth])
        cylinder(h = collar_depth, r = collar_outer_r);
}

// Upright rounded tab
module upright_tab(x_offset) {
    translate([x_offset, 0, 0]) {
        // Lower rectangular body
        translate([0, tab_y_offset, base_height])
            cube([tab_width, tab_depth, tab_center_z - base_height]);
        
        // Upper rounded top
        translate([0, tab_center_y, tab_center_z])
            rotate([0, 90, 0])
                cylinder(h = tab_width, r = tab_arc_r);
    }
}

// Main Model Assembly
difference() {
    // 1. Combine all solid additive geometry
    union() {
        base_plate();
        underside_collar();
        // Left tab
        upright_tab(0);
        // Right tab
        upright_tab(base_length - tab_width);
    }
    
    // 2. Subtract all through holes
    union() {
        // Central base and collar void
        // Extended slightly in Z to ensure clean manifold cuts
        translate([hole_x, hole_y, -collar_depth - 0.1])
            cylinder(h = base_height + collar_depth + 0.2, r = hole_r);
        
        // Left tab hole
        translate([-0.1, tab_center_y, tab_center_z])
            rotate([0, 90, 0])
                cylinder(h = tab_width + 0.2, r = tab_hole_r);
                
        // Right tab hole
        translate([base_length - tab_width - 0.1, tab_center_y, tab_center_z])
            rotate([0, 90, 0])
                cylinder(h = tab_width + 0.2, r = tab_hole_r);
    }
}