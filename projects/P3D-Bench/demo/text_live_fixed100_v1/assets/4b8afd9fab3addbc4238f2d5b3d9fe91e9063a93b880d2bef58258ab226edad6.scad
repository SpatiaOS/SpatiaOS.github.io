// Parametric CAD model definition
$fn = 100; // Surface smoothness for curved geometry

// Core base dimensions
base_length = 0.75;       // X-axis: total left-right length
base_width = 0.5;         // Y-axis: total front-back width
base_height = 0.125;      // Z-axis: extrusion height from Z=0 datum
central_hole_r = 0.125;   // Radius of central through void
central_hole_x = base_length / 2; // Void X position (0.375 from left edge)
central_hole_y = base_width / 2;  // Void Y position (0.25 from front edge)

// Underside annular collar parameters
collar_depth = 0.0375;    // Collar extension below base underside
collar_outer_r = 0.2125;  // Collar outer radius
collar_inner_r = central_hole_r; // Inner radius matches central hole for continuity

// Shared geometry for left/right end tabs
tab_plan_x = 0.125;       // Tab thickness along X axis
tab_plan_y = 0.375;       // Tab width along Y axis
tab_y_offset = (base_width - tab_plan_y) / 2; // 0.0625 offset from front/back edges
tab_total_height = 0.5875;// Total Z height from datum to tab top
tab_top_r = tab_plan_y / 2; // Radius of semicircular rounded tab top
tab_hole_r = 0.0937;      // Radius of tab through openings
tab_rect_height = tab_total_height - base_height - tab_top_r; // Height of straight tab section
tab_hole_z = base_height + (tab_total_height - base_height) / 2; // Vertically centered hole position

// Hollow annular collar on base underside
module annular_collar() {
    difference() {
        // Outer collar ring geometry
        translate([central_hole_x, central_hole_y, -collar_depth/2])
        cylinder(h=collar_depth, r=collar_outer_r, center=true);
        // Inner bore to create hollow ring
        translate([central_hole_x, central_hole_y, -collar_depth/2])
        cylinder(h=collar_depth + 1, r=collar_inner_r, center=true);
    }
}

// Rounded upright end tab (flat base, semicircular rounded top)
module rounded_tab(x_center) {
    union() {
        // Straight rectangular lower section
        translate([x_center - tab_plan_x/2, tab_y_offset, base_height])
        cube([tab_plan_x, tab_plan_y, tab_rect_height]);
        // Semicircular rounded top (full cylinder used, lower half blends with rectangular section)
        translate([x_center, central_hole_y, base_height + tab_rect_height])
        rotate([0, 90, 0])
        cylinder(h=tab_plan_x, r=tab_top_r, center=true);
    }
}

// Main model assembly
difference() {
    union() {
        // Solid base plate (full footprint, square-edged as no arc radius specified)
        cube([base_length, base_width, base_height]);
        // Underside mounting collar
        annular_collar();
        // Right end rounded tab
        rounded_tab(base_length - tab_plan_x/2);
        // Left end rounded tab (mirror position)
        rounded_tab(tab_plan_x/2);
    }
    
    // Continuous central through void (cuts through base and collar)
    translate([central_hole_x, central_hole_y, (base_height - collar_depth)/2])
    cylinder(h=base_height + collar_depth + 1, r=central_hole_r, center=true);
    
    // Right tab through hole
    translate([base_length - tab_plan_x/2, central_hole_y, tab_hole_z])
    rotate([0, 90, 0])
    cylinder(h=tab_plan_x + 1, r=tab_hole_r, center=true);
    
    // Left tab through hole
    translate([tab_plan_x/2, central_hole_y, tab_hole_z])
    rotate([0, 90, 0])
    cylinder(h=tab_plan_x + 1, r=tab_hole_r, center=true);
}