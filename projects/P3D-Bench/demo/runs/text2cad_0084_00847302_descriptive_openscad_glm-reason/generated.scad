// Enclosure outer dimensions
outer_length = 80;
outer_width = 60;
outer_height = 40;

// Wall and bottom thickness
wall_thickness = 3;
bottom_thickness = 3;

// Front face: centered horizontal recess above lower edge
front_recess_width = 30;
front_recess_height = 10;
front_recess_depth = 1.5;
front_recess_z_offset = 10;

// Right face: taller vertical through-opening from underside region
right_opening_width = 15;
right_opening_height = 25;
right_opening_z_offset = bottom_thickness;

// Interior ledge along back wall
ledge_depth = 6;
ledge_thickness = 1.5;
ledge_z = bottom_thickness + 5;

$fn = 100;

// Main enclosure body with subtractions
difference() {
    // Solid outer block
    cube([outer_length, outer_width, outer_height]);

    // Hollow interior — open top, leaves wall rim
    translate([wall_thickness, wall_thickness, bottom_thickness])
        cube([
            outer_length - 2 * wall_thickness,
            outer_width - 2 * wall_thickness,
            outer_height - bottom_thickness + 1
        ]);

    // Front recess: centered horizontally, above lower edge
    // Subtracted material on the Y-minus face
    translate([
        (outer_length - front_recess_width) / 2,
        -1,
        front_recess_z_offset
    ])
        cube([front_recess_width, front_recess_depth + 1, front_recess_height]);

    // Right through-opening: taller vertical cut from underside region
    // Subtracted material on the X-plus face
    translate([
        outer_length - 1,
        (outer_width - right_opening_width) / 2,
        right_opening_z_offset
    ])
        cube([wall_thickness + 2, right_opening_width, right_opening_height]);
}

// Interior ledge: thin shelf rib along back wall
// Creates a shallow stepped tier inside the enclosure
translate([
    wall_thickness,
    outer_width - wall_thickness - ledge_depth,
    ledge_z
])
    cube([
        outer_length - 2 * wall_thickness,
        ledge_depth,
        ledge_thickness
    ]);