// === Parameters ===

// Outer box dimensions
box_width  = 80;   // X dimension
box_depth  = 60;   // Y dimension
box_height = 50;   // Z dimension
wall_thick = 3;    // Wall thickness

// Rim (top edge) stays full height; interior is hollowed
interior_depth = box_height - wall_thick;  // hollow depth from top

// Side recess (centered horizontal slot on front face, +Y side)
recess_width   = 36;   // X span of the recess
recess_height  = 12;   // Z span of the recess
recess_depth   = wall_thick + 1; // cut fully through wall
recess_z_off   = 8;    // distance from bottom to recess lower edge

// Adjacent-side vertical opening (right face, +X side)
vert_open_width  = 16;  // Y span of the vertical opening
vert_open_height = 30;  // Z span, rising from bottom
vert_open_depth  = wall_thick + 1; // through the wall

// Internal ledge / shelf rib (along back wall, -Y inside face)
ledge_thickness = 1.2;  // Z thickness of the shelf
ledge_width_pct = 0.8;  // fraction of interior X span
ledge_protrusion = 10;  // how far the ledge sticks out from back wall (Y)
ledge_z          = 20;  // height of ledge top surface from bottom

// Resolution
$fn = 40;

// === Helper Modules ===

// Basic hollow box with open top
module hollow_box(w, d, h, wt) {
    difference() {
        // Outer shell
        cube([w, d, h]);
        // Interior cavity (open top)
        translate([wt, wt, wt])
            cube([w - 2*wt, d - 2*wt, h]);  // extends above top to open it
    }
}

// Centered rectangular recess on the front face (+Y wall)
module front_recess(bw, bd, wt, rw, rh, rd, rz) {
    translate([bw/2 - rw/2, bd - wt - 0.5, rz])
        cube([rw, rd, rh]);
}

// Vertical through opening on the right face (+X wall)
module right_vert_opening(bw, bd, wt, ow, oh, od) {
    translate([bw - wt - 0.5, bd/2 - ow/2, -0.1])
        cube([od, ow, oh]);
}

// Internal ledge along back wall (-Y inside face)
module internal_ledge(bw, wt, lt, lw_pct, lp, lz) {
    interior_x = bw - 2*wt;
    ledge_w = interior_x * lw_pct;
    x_offset = wt + (interior_x - ledge_w) / 2;  // centered along X
    translate([x_offset, wt, lz - lt])
        cube([ledge_w, lp, lt]);
}

// === Main Assembly ===

union() {
    difference() {
        // Step 1: Create the hollow open-top box with rim
        hollow_box(box_width, box_depth, box_height, wall_thick);

        // Step 2: Horizontal rectangular recess on front face (centered)
        front_recess(box_width, box_depth, wall_thick,
                     recess_width, recess_height, recess_depth, recess_z_off);

        // Step 3: Vertical through opening on right face, rising from bottom
        right_vert_opening(box_width, box_depth, wall_thick,
                           vert_open_width, vert_open_height, vert_open_depth);
    }

    // Step 4: Add the thin internal shelf/rib along the back wall
    internal_ledge(box_width, wall_thick,
                   ledge_thickness, ledge_width_pct, ledge_protrusion, ledge_z);
}