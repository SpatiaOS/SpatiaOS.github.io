// Parametric Stepped Cavity Enclosure with Side Projection
// All dimensions in millimeters, coordinate origin at bottom-left-front corner (Z=0 is part base)

// --------------------------
// Parameter Definitions
// --------------------------
// Main outer body dimensions
body_width = 60;       // X-axis total outer width
body_depth = 40;       // Y-axis total outer depth
body_height = 30;      // Z-axis total height (base at Z=0, top surface at Z=body_height)

// Wall and base thicknesses
top_rim_thickness = 3; // Uniform wall thickness around uppermost cavity opening
base_thickness = 4;    // Solid floor thickness below the lowest pocket

// Top cavity tier (shallowest, widest cut)
upper_recess_depth = 8; // Vertical depth of upper recess measured down from top surface

// Side feature parameters (located on +X face)
proj_protrusion = 8;    // Distance external projection sticks out from body wall
proj_height = 12;       // Vertical height of the external projection
proj_depth = 20;        // Y-axis length of the projection (centered on side face)
proj_base_z = 4;        // Z position of projection bottom edge (sits just above part base)
side_recess_inset = 12; // Horizontal distance the recess above projection cuts into the body
side_recess_floor_z = proj_base_z + proj_height; // Align recess floor exactly with projection top

// Deepest pocket parameters (offset to create uneven internal ledges)
deep_pocket_w = 30;     // X-axis width of lowest cavity
deep_pocket_d = 28;     // Y-axis depth of lowest cavity
deep_pocket_x_offset = -7; // X shift from body center (negative = shifted toward left/X=0 side)
deep_pocket_top_z = body_height - upper_recess_depth; // Align pocket top with upper recess floor
deep_pocket_floor_z = base_thickness; // Align pocket floor with top of solid base

$fn = 50; // Default resolution for curved geometry

// --------------------------
// Reusable Component Modules
// --------------------------
module solid_main_body() {
    // Base rectangular solid that forms the primary enclosure structure
    cube([body_width, body_depth, body_height]);
}

module external_side_projection() {
    // Added rectangular boss protruding from the +X side wall
    translate([
        body_width,
        (body_depth - proj_depth)/2,
        proj_base_z
    ]) {
        cube([proj_protrusion, proj_depth, proj_height]);
    }
}

module cut_upper_recess() {
    // Broad top cavity that creates the thin top rim
    translate([
        top_rim_thickness,
        top_rim_thickness,
        body_height - upper_recess_depth
    ]) {
        cube([
            body_width - 2*top_rim_thickness,
            body_depth - 2*top_rim_thickness,
            upper_recess_depth + 1 // Small overcut to ensure clean top edge
        ]);
    }
}

module cut_side_recess() {
    // Extra stepped cut directly above the external projection
    translate([
        body_width - side_recess_inset,
        (body_depth - proj_depth)/2,
        side_recess_floor_z
    ]) {
        cube([
            side_recess_inset + top_rim_thickness, // Overcut to break through outer wall
            proj_depth,
            body_height - side_recess_floor_z + 1 // Overcut to break through top surface
        ]);
    }
}

module cut_deep_pocket() {
    // Lowest offset cavity that creates uneven interior ledges
    pocket_center_x = body_width/2 + deep_pocket_x_offset;
    translate([
        pocket_center_x - deep_pocket_w/2,
        (body_depth - deep_pocket_d)/2,
        deep_pocket_floor_z
    ]) {
        cube([
            deep_pocket_w,
            deep_pocket_d,
            deep_pocket_top_z - deep_pocket_floor_z + 1 // Overcut to meet upper recess floor
        ]);
    }
}

// --------------------------
// Final Model Assembly
// --------------------------
union() {
    // Combine solid base geometry
    solid_main_body();
    external_side_projection();

    // Subtract all internal cavity features
    difference() {
        children();
        cut_upper_recess();
        cut_side_recess();
        cut_deep_pocket();
    }
}