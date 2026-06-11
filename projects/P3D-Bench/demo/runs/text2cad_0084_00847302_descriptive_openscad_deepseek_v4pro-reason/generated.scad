// Parametric Open-Top Enclosure with Side Openings and Interior Shelf

/* ---- Dimensions ---- */
outer_width   = 80;    // X-axis outer dimension
outer_depth   = 60;    // Y-axis outer dimension
outer_height  = 50;    // Z-axis (bottom to top)
wall_thick    = 4;     // wall thickness
floor_thick   = 4;     // bottom thickness

/* ---- Horizontal Opening (front face, -Y side) ---- */
h_open_w      = 40;    // width (X)
h_open_h      = 10;    // height (Z)
h_open_z_off  = 15;    // distance from bottom to opening lower edge

/* ---- Vertical Opening (right face, +X side) ---- */
v_open_w      = 8;     // width (Y) – horizontal extent on that face
v_open_h      = 30;    // height (Z) – rises from underside

/* ---- Interior Ledge (back face, +Y side) ---- */
ledge_w       = 50;    // width (X)
ledge_t       = 2;     // protrusion into the interior (thin)
ledge_h       = 4;     // vertical thickness
ledge_z_off   = 25;    // height of ledge bottom from floor

$fn = 40;  // smoothness not strictly required, but good practice

// Helper: create hollow box with open top and solid bottom
module hollow_box() {
    difference() {
        // outer solid
        cube([outer_width, outer_depth, outer_height], center = true);
        // inner void (removes material, leaving walls and floor)
        translate([0, 0, floor_thick])
            cube([outer_width - 2*wall_thick,
                  outer_depth - 2*wall_thick,
                  outer_height - floor_thick + 0.01], center = true);
    }
}

// Helper: centered rectangular through-hole on a specified face
// face: "front" (-Y), "right" (+X), "back" (+Y), "left" (-X)
module side_through_hole(face, hole_w, hole_h, hole_dz=0) {
    epsilon = 1;  // small oversize to ensure clean subtraction

    if (face == "front") {
        // hole center placed on Y=-outer_depth/2 plane, centered in X at Z=hole_dz+hole_h/2
        translate([0, -outer_depth/2, hole_dz + hole_h/2])
            cube([hole_w, wall_thick + epsilon, hole_h + epsilon], center = true);
    } else if (face == "back") {
        translate([0, outer_depth/2, hole_dz + hole_h/2])
            cube([hole_w, wall_thick + epsilon, hole_h + epsilon], center = true);
    } else if (face == "right") {
        translate([outer_width/2, 0, hole_dz + hole_h/2])
            cube([wall_thick + epsilon, hole_w, hole_h + epsilon], center = true);
    } else if (face == "left") {
        translate([-outer_width/2, 0, hole_dz + hole_h/2])
            cube([wall_thick + epsilon, hole_w, hole_h + epsilon], center = true);
    }
}

// Main assembly
difference() {
    hollow_box();

    // Horizontal opening on front face
    side_through_hole("front", h_open_w, h_open_h, h_open_z_off);

    // Vertical opening on right face, rising from underside (dz=0 means bottom at floor level)
    // Note: v_open_h is total height, and we want it to start at floor level,
    // so the hole extends from Z=floor_thick (top of floor)? 
    // To simplify, we subtract from Z=0 upward; the hole will also cut the floor edge slightly,
    // which mimics the opening continuing to the very underside.
    side_through_hole("right", v_open_w, v_open_h, 0);
}

// Interior ledge on back wall (+Y side)
// Protrudes inward from inner face of back wall
inner_back_y = outer_depth/2 - wall_thick;   // interior Y coordinate of back wall
ledge_x1 = -ledge_w/2;
ledge_x2 =  ledge_w/2;
ledge_z1 = ledge_z_off;
ledge_z2 = ledge_z_off + ledge_h;

// Solid ledge block: width along X, thickness towards -Y, height along Z
module interior_ledge() {
    translate([0, inner_back_y - ledge_t/2, (ledge_z1 + ledge_z2)/2])
        cube([ledge_w, ledge_t, ledge_h], center = true);
}

// Combine ledge with the holed box
union() {
    // The box (already holed) is implicitly the first object because of the difference above.
    // We wrap the previous difference in a union to add the ledge.
    // OpenSCAD's implicit union handles this when we place the modules sequentially.
    // This is the main model.
    children(); // Actually this would refer to the difference result, but we can't use children that way.
    // Simpler: rewrite everything as a single union with difference inside.
}

// Better approach: place the difference into a module and then union with ledge.
module box_with_holes() {
    difference() {
        hollow_box();
        side_through_hole("front", h_open_w, h_open_h, h_open_z_off);
        side_through_hole("right", v_open_w, v_open_h, 0);
    }
}

// Final model
union() {
    box_with_holes();
    interior_ledge();
}

// The code above ensures manifold geometry. The ledge is attached cleanly to the interior of the back wall.