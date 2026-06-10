// ============================================
// Parametric Shed / Gable-Roof Framing Model
// ============================================

// --- Overall dimensions (mm) ---
building_width = 4000;        // Span between side walls (x-axis)
building_depth = 3000;        // Length front-to-back (y-axis)
wall_height    = 2400;        // Height of rectangular wall portion
roof_pitch     = 35;          // Roof pitch in degrees

// --- Timber / framing dimensions ---
timber_w       = 50;          // Thickness of framing (into wall plane)
timber_h       = 100;         // Width of framing (along wall plane)
stud_spacing   = 400;         // On-center spacing of studs & rafters

// --- Door parameters ---
door_width     = 1600;
door_height    = 2100;
door_thickness = 40;

// --- Sheathing parameters ---
sheath_t       = 20;          // Thickness of wall/roof panels

// --- Derived values ---
eave_height    = wall_height + timber_h;
roof_rise      = (building_width / 2) * tan(roof_pitch);
ridge_height   = eave_height + roof_rise;
rafter_spacing = stud_spacing;
rafter_len     = (building_width / 2) / cos(roof_pitch);
door_x_start   = (building_width - door_width) / 2;

$fn = 30;

// ============================================
// Helper Modules
// ============================================

// Vertical stud (common to all walls)
module stud(x, y, z, h, wx, wy) {
    translate([x - wx/2, y - wy/2, z])
    cube([wx, wy, h]);
}

// ============================================
// Side Walls (rectangular, under eaves)
// ============================================
module side_wall(x_center) {
    x = x_center - timber_w/2;

    // Bottom plate
    translate([x, 0, 0])
    cube([timber_w, building_depth, timber_h]);

    // Top plate
    translate([x, 0, wall_height])
    cube([timber_w, building_depth, timber_h]);

    // Studs
    n = ceil(building_depth / stud_spacing);
    for (i = [0 : n]) {
        y = (i == n) ? building_depth : i * stud_spacing;
        translate([x, y - timber_h/2, timber_h])
        cube([timber_w, timber_h, wall_height - timber_h]);
    }

    // Sheathing on outside face
    if (x_center == 0) {
        // Left wall – outside is -x
        translate([x - sheath_t, 0, 0])
        cube([sheath_t, building_depth, eave_height]);
    } else {
        // Right wall – outside is +x
        translate([x + timber_w, 0, 0])
        cube([sheath_t, building_depth, eave_height]);
    }
}

// ============================================
// Front Wall (gable end with double door)
// ============================================
module front_wall() {
    y = -timber_w/2;

    // Bottom plate
    translate([0, y, 0])
    cube([building_width, timber_w, timber_h]);

    // Top plate
    translate([0, y, wall_height])
    cube([building_width, timber_w, timber_h]);

    // Regular studs & corner studs
    n = ceil(building_width / stud_spacing);
    for (i = [0 : n]) {
        x = (i == n) ? building_width : i * stud_spacing;
        // Skip studs that fall inside the rough door opening
        if (x > door_x_start + timber_h && x < door_x_start + door_width - timber_h) {
            // opening – no stud
        } else {
            translate([x - timber_h/2, y, timber_h])
            cube([timber_h, timber_w, wall_height - timber_h]);
        }
    }

    // Door framing – jack studs
    for (x = [door_x_start, door_x_start + door_width]) {
        translate([x - timber_h/2, y, timber_h])
        cube([timber_h, timber_w, door_height - timber_h]);
    }

    // Door header
    translate([door_x_start, y, door_height])
    cube([door_width, timber_w, timber_h]);

    // Cripple stud above header
    translate([door_x_start + door_width/2 - timber_h/2, y, door_height + timber_h])
    cube([timber_h, timber_w, wall_height - door_height - timber_h]);

    // Gable studs above top plate
    for (i = [0 : n]) {
        x = (i == n) ? building_width : i * stud_spacing;
        h = min(x, building_width - x) * tan(roof_pitch);
        if (h > 1) {
            translate([x - timber_h/2, y, eave_height])
            cube([timber_h, timber_w, h]);
        }
    }

    // --- Sheathing ---
    front_wall_sheathing();
}

// Front wall sheathing: rectangular part with door cut-out + gable triangle
module front_wall_sheathing() {
    y_pos = -timber_w/2 - sheath_t;

    // Rectangular portion with door opening removed
    difference() {
        translate([0, y_pos, 0])
        cube([building_width, sheath_t, eave_height]);

        translate([door_x_start, y_pos - 1, 0])
        cube([door_width, sheath_t + 2, door_height]);
    }

    // Gable-end triangular sheathing (prism extruded in y)
    translate([0, y_pos, 0])
    polyhedron(
        points = [
            [0,                     0, eave_height],
            [building_width,        0, eave_height],
            [building_width/2,      0, ridge_height],
            [0,                     sheath_t, eave_height],
            [building_width,        sheath_t, eave_height],
            [building_width/2,      sheath_t, ridge_height]
        ],
        faces = [
            [0, 2, 1],
            [3, 4, 5],
            [0, 1, 4, 3],
            [1, 2, 5, 4],
            [2, 0, 3, 5]
        ]
    );
}

// ============================================
// Back Wall (gable end, no door)
// ============================================
module back_wall() {
    y = building_depth - timber_w/2;

    // Bottom plate
    translate([0, y, 0])
    cube([building_width, timber_w, timber_h]);

    // Top plate
    translate([0, y, wall_height])
    cube([building_width, timber_w, timber_h]);

    // Studs
    n = ceil(building_width / stud_spacing);
    for (i = [0 : n]) {
        x = (i == n) ? building_width : i * stud_spacing;
        translate([x - timber_h/2, y, timber_h])
        cube([timber_h, timber_w, wall_height - timber_h]);
    }

    // Gable studs
    for (i = [0 : n]) {
        x = (i == n) ? building_width : i * stud_spacing;
        h = min(x, building_width - x) * tan(roof_pitch);
        if (h > 1) {
            translate([x - timber_h/2, y, eave_height])
            cube([timber_h, timber_w, h]);
        }
    }

    // Sheathing
    back_wall_sheathing();
}

module back_wall_sheathing() {
    y_pos = building_depth + timber_w/2;

    // Rectangular portion
    translate([0, y_pos, 0])
    cube([building_width, sheath_t, eave_height]);

    // Gable triangle
    translate([0, y_pos, 0])
    polyhedron(
        points = [
            [0,                     0, eave_height],
            [building_width,        0, eave_height],
            [building_width/2,      0, ridge_height],
            [0,                     sheath_t, eave_height],
            [building_width,        sheath_t, eave_height],
            [building_width/2,      sheath_t, ridge_height]
        ],
        faces = [
            [0, 2, 1],
            [3, 4, 5],
            [0, 1, 4, 3],
            [1, 2, 5, 4],
            [2, 0, 3, 5]
        ]
    );
}

// ============================================
// Roof Framing
// ============================================

// Ridge board running front-to-back along the peak
module ridge_board() {
    translate([building_width/2 - timber_w/2, 0, ridge_height])
    cube([timber_w, building_depth, timber_h]);
}

// Common rafters – left and right slopes
module rafters() {
    n = ceil(building_depth / rafter_spacing);
    for (i = [0 : n]) {
        y = (i == n) ? building_depth : i * rafter_spacing;

        // Left slope rafter
        translate([0, y, eave_height])
        rotate([0, roof_pitch, 0])
        cube([rafter_len, timber_w, timber_h]);

        // Right slope rafter
        translate([building_width, y, eave_height])
        rotate([0, -roof_pitch, 0])
        translate([-rafter_len, 0, 0])
        cube([rafter_len, timber_w, timber_h]);
    }
}

// ============================================
// Roof Sheathing (partial, near/right slope only)
// ============================================

// Panel on the right roof plane.
// x = eave-side x coordinate (near building_width)
// dx = horizontal projection width toward ridge
module right_roof_panel(x, y, dx, dy) {
    translate([x, y, eave_height + (building_width - x) * tan(roof_pitch)])
    rotate([0, -roof_pitch, 0])
    translate([-dx / cos(roof_pitch), 0, 0])
    cube([dx / cos(roof_pitch), dy, sheath_t]);
}

module roof_sheathing() {
    panel_dx = 800;   // horizontal projection per row
    panel_dy = 1500;  // along the building depth

    // Two rows along slope, two columns along depth
    for (sx = [building_width - 2*panel_dx, building_width - panel_dx, building_width]) {
        for (sy = [0, panel_dy]) {
            // Ensure we don't exceed building depth on the last panel
            if (sy + panel_dy <= building_depth + 0.1) {
                right_roof_panel(sx, sy, panel_dx, panel_dy);
            }
        }
    }
}

// ============================================
// Doors
// ============================================
module doors() {
    y = -timber_w/2 - sheath_t - door_thickness;

    // Left leaf
    translate([door_x_start, y, 0])
    cube([door_width/2, door_thickness, door_height]);

    // Right leaf
    translate([door_x_start + door_width/2, y, 0])
    cube([door_width/2, door_thickness, door_height]);

    // Hinges (dark grey accent)
    hinge_y = y - 2;
    for (z = [300, 1050, 1800]) {
        // Left door – outer edge
        color([0.2, 0.2, 0.2])
        translate([door_x_start + 2, hinge_y, z])
        cube([5, 20, 60]);

        // Right door – outer edge
        color([0.2, 0.2, 0.2])
        translate([door_x_start + door_width - 7, hinge_y, z])
        cube([5, 20, 60]);
    }
}

// ============================================
// Assembly
// ============================================

// Walls
front_wall();
back_wall();
side_wall(0);          // Left
side_wall(building_width); // Right

// Roof structure
rafters();
ridge_board();

// Roof sheathing (partial, right side only)
roof_sheathing();

// Doors
doors();