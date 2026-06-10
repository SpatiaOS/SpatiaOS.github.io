// OpenSCAD parametric model
// All dimensions in inches
$fn = 100;

// Main base dimensions
main_length = 0.395255;  // Y front-back extent
main_width  = 0.60219;   // X left-right extent
main_height = 0.109489;  // Z height
// Derived geometry for D‑shape
// The outer profile consists of a rectangle of height rect_h and a semicircle of radius R
R = main_width / 2;             // 0.301095
rect_h = main_length - R;       // 0.09416 (exact match to axis offset 0.0942)
// Wall thickness (assumed constant, not explicitly given)
wall = 0.04;                     // modify if actual thickness differs

// Round protrusion (boss) parameters
boss_axis_x = 0.0942;                // offset from left edge
boss_front_offset = -0.0821;         // offset from main front edge (negative = inside)
boss_axis_y = main_length + boss_front_offset;   // = 0.313155
boss_radius = 0.0657;
boss_height = 0.054745;              // shallower than main body
hole_radius = 0.0285;

//----------------------------------------------------------------------
// 2D profile of the main D‑shape outer edge
// It is a polygon that goes: bottom‑left, bottom‑right, right straight,
// then semicircle arc from right to left, then left straight back down.
module d_outer_2d() {
    polygon([
        [0, 0],
        [main_width, 0],
        [main_width, rect_h],
        each arc_points(main_width/2, rect_h, R, 0, 180), // arc from angle 0 to 180 (subtends full semi)
        [0, rect_h]
    ]);
}

// Helper: generate points on an arc (for polyhedron / polygon)
// center (cx,cy), radius r, start_angle, end_angle, steps derived from $fn
function arc_points(cx, cy, r, start_ang, end_ang) = [
    for (a = [start_ang : (end_ang-start_ang)/($fn*0.5) : end_ang])
        [cx + r*cos(a), cy + r*sin(a)]
];
// For polygon we need explicit array; define as a module using list comprehension in polygon call.
// Instead, we'll build the arc points directly inside the polygon using a loop.

module d_outer_2d() {
    polygon(
        concat(
            [[0, 0], [main_width, 0], [main_width, rect_h]],
            [ for (a = [0 : 180/($fn/2) : 180]) 
                [main_width/2 + R*cos(a), rect_h + R*sin(a)] ],
            [[0, rect_h]]
        )
    );
}

// 2D profile of the inner hole – offset inward by wall
module d_inner_2d() {
    inner_R = R - wall;
    // Ensure inner dimensions are positive
    assert(inner_R > 0, "Wall thickness too large for the given main dimensions");
    polygon(
        concat(
            [[wall, wall], [main_width - wall, wall], [main_width - wall, rect_h]],
            [ for (a = [0 : 180/($fn/2) : 180])
                [main_width/2 + inner_R*cos(a), rect_h + inner_R*sin(a)] ],
            [[wall, rect_h]]
        )
    );
}

//----------------------------------------------------------------------
// Main solid body: D‑shaped frame (outer minus inner)
module main_frame() {
    difference() {
        linear_extrude(height = main_height, center = false)
            d_outer_2d();
        // Through‑opening (extrude slightly more to ensure clean subtraction)
        translate([0, 0, -0.001])
            linear_extrude(height = main_height + 0.002, center = false)
                d_inner_2d();
    }
}

//----------------------------------------------------------------------
// Round protrusion (boss) – cylinder at the specified axis, shorter than main
module boss() {
    // Boss solid
    cylinder(h = boss_height, r = boss_radius, center = false);
    // Concentric hole
    translate([0, 0, -0.001])
        cylinder(h = boss_height + 0.002, r = hole_radius, center = false);
}

//----------------------------------------------------------------------
// Assemble final part
union() {
    main_frame();
    // Place boss: its axis at (boss_axis_x, boss_axis_y), starting at Z=0
    translate([boss_axis_x, boss_axis_y, 0])
        boss();
}