// Parameters
base_length = 0.375;
base_width = 0.75;
base_height = 0.013393;

second_solid_reach = 0.2277;          // top Z of second solid
corner_radius = 0.05;                 // outer footprint rounding
frame_wall = 0.03;                    // wall thickness of second solid frame

sleeve_x_offset_left = 0.308;        // left edge of raised sleeve
sleeve_y_offset_front = 0.308;       // front edge of raised sleeve
sleeve_y_offset_back = 0.3081;       // back edge offset
sleeve_length = 0.066964;            // X size of sleeve
sleeve_width = 0.133929;             // Y size of sleeve
sleeve_height = 0.214286;            // sleeve extrusion height
sleeve_total_reach = 0.442;          // top Z of sleeve

right_wall_thickness = 0.025;        // thicker right wall for lower continuation
sleeve_wall = 0.012;                 // uniform wall thickness elsewhere

lower_bottom_reach = -0.2277;        // lower continuation bottom Z
lower_top_reach = -0.0134;           // lower continuation top Z

hole_radius = 0.0067;
hole_x_axis = 0.3616;
hole1_y_axis = 0.6828;
hole2_y_axis = 0.0672;
hole_z_bottom = 0.1674;
hole_z_top = 0.1808;

$fn = 64;

// ----- Base Plate -----
// Outer rounded rectangle footprint
module outer_footprint_2d() {
    offset(r=corner_radius)
        square([base_length - 2*corner_radius, base_width - 2*corner_radius]);
}

// Base solid (no openings)
module base_plate() {
    linear_extrude(height=base_height)
        outer_footprint_2d();
}

// ----- Second Solid (frame on top of base) -----
module inner_cutout_2d() {
    // simple rectangular cutout inside the outer footprint
    translate([frame_wall, frame_wall])
        square([base_length - 2*frame_wall, base_width - 2*frame_wall]);
}

module second_solid_frame() {
    difference() {
        // Full outer body up to second_solid_reach
        linear_extrude(height=second_solid_reach)
            outer_footprint_2d();
        // Cutout only above base_height
        translate([0, 0, base_height])
            linear_extrude(height=second_solid_reach - base_height)
                inner_cutout_2d();
    }
}

// ----- Raised Sleeve (upper hollow post) -----
// Outer solid block
module sleeve_outer() {
    sleeve_outer_x = sleeve_x_offset_left;
    sleeve_outer_y = sleeve_y_offset_front;
    sleeve_outer_dx = sleeve_length;
    sleeve_outer_dy = sleeve_width;
    translate([sleeve_outer_x, sleeve_outer_y, second_solid_reach])
        cube([sleeve_outer_dx, sleeve_outer_dy, sleeve_height]);
}

// Slot cutout inside the sleeve
module sleeve_slot() {
    sleeve_slot_x = sleeve_x_offset_left + sleeve_wall;
    sleeve_slot_y = sleeve_y_offset_front + sleeve_wall;
    sleeve_slot_dx = sleeve_length - sleeve_wall - right_wall_thickness;
    sleeve_slot_dy = sleeve_width - 2*sleeve_wall;
    translate([sleeve_slot_x, sleeve_slot_y, second_solid_reach])
        cube([sleeve_slot_dx, sleeve_slot_dy, sleeve_height]);
}

module raised_sleeve() {
    difference() {
        sleeve_outer();
        sleeve_slot();
    }
}

// ----- Lower Continuation (downward projection) -----
module lower_continuation() {
    lower_x_min = base_length - right_wall_thickness;
    lower_x_max = base_length;
    lower_y_min = sleeve_y_offset_front;
    lower_y_max = sleeve_y_offset_front + sleeve_width;
    lower_depth = lower_top_reach - lower_bottom_reach;  // 0.2143
    translate([lower_x_min, lower_y_min, lower_bottom_reach])
        cube([lower_x_max - lower_x_min, lower_y_max - lower_y_min, lower_depth]);
}

// ----- Small Circular Holes -----
module circular_holes() {
    hole_height = hole_z_top - hole_z_bottom;
    hole_z_center = hole_z_bottom + hole_height / 2;
    // Hole 1
    translate([hole_x_axis, hole1_y_axis, hole_z_center])
        cylinder(h=hole_height, r=hole_radius, center=true);
    // Hole 2
    translate([hole_x_axis, hole2_y_axis, hole_z_center])
        cylinder(h=hole_height, r=hole_radius, center=true);
}

// ----- Final Assembly -----
union() {
    base_plate();
    second_solid_frame();
    raised_sleeve();
    lower_continuation();
}

// Subtract the two small holes from the assembly
difference() {
    children();  // This won't work directly; we'll restructure: apply difference after union using separate module.

    // Better: create main body module and then apply holes difference.
}

// Alternative final structure is to union everything then difference the holes.
// In OpenSCAD best practice: put everything in a module that returns the union,
// then call difference with that module and the holes.

module main_body() {
    base_plate();
    second_solid_frame();
    raised_sleeve();
    lower_continuation();
}

module final_model() {
    difference() {
        main_body();
        circular_holes();
    }
}

final_model();