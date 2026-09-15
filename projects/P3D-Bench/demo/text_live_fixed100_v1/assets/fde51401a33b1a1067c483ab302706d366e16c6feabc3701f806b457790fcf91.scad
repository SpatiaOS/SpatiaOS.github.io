// Dimensions (mm)
plate_length = 100;
plate_width = 40;
plate_thickness = 6;

center_hole_diameter = 22;
collar_outer_diameter = 34;
collar_height = 3;

tab_width = 30;
tab_thickness = 10;
tab_height = 34;
tab_end_inset = 8;
tab_hole_diameter = 10;

overlap = 0.02;
$fn = 100;

// Derived dimensions
plate_end_radius = plate_width / 2;
plate_arc_offset = (plate_length - plate_width) / 2;
plate_bottom = collar_height;
plate_top = plate_bottom + plate_thickness;

tab_top_radius = tab_width / 2;
tab_center_x = plate_length / 2 - tab_end_inset - tab_thickness / 2;
tab_hole_z = plate_top + tab_height - tab_top_radius;
tab_outer_offset = max(
    0,
    tab_center_x + tab_thickness / 2 - plate_arc_offset
);

// Parameter checks
assert(plate_length >= plate_width && plate_width > 0);
assert(plate_thickness > 0 && collar_height > 0);
assert(overlap > 0 && overlap < min(plate_thickness, collar_height));
assert(center_hole_diameter > 0);
assert(collar_outer_diameter > center_hole_diameter);
assert(collar_outer_diameter < plate_width);
assert(tab_thickness > 0 && tab_width > 0);
assert(tab_height >= tab_width);
assert(tab_end_inset >= 0);
assert(tab_hole_diameter > 0 && tab_hole_diameter < tab_width);
assert(tab_center_x - tab_thickness / 2 > center_hole_diameter / 2);
assert(
    pow(tab_outer_offset, 2) + pow(tab_width / 2, 2)
    < pow(plate_end_radius, 2),
    "Tab roots must fit inside the plate outline."
);

// Arc-ended plate profile
module plate_profile() {
    hull() {
        for (side = [-1, 1])
            translate([side * plate_arc_offset, 0])
                circle(r = plate_end_radius);
    }
}

// Plate with central through opening
module base_plate() {
    difference() {
        translate([0, 0, plate_bottom])
            linear_extrude(height = plate_thickness)
                plate_profile();

        translate([0, 0, plate_bottom - overlap])
            cylinder(
                h = plate_thickness + 2 * overlap,
                d = center_hole_diameter
            );
    }
}

// Shallow hollow underside collar
module underside_collar() {
    difference() {
        cylinder(
            h = collar_height + overlap,
            d = collar_outer_diameter
        );

        translate([0, 0, -overlap])
            cylinder(
                h = collar_height + 3 * overlap,
                d = center_hole_diameter
            );
    }
}

// Upright profile with semicircular crown
module tab_profile() {
    union() {
        translate([-tab_width / 2, -overlap])
            square([
                tab_width,
                tab_height - tab_top_radius + overlap
            ]);

        translate([0, tab_height - tab_top_radius])
            circle(r = tab_top_radius);
    }
}

// End tab with transverse through opening
module end_tab(x_position) {
    difference() {
        translate([
            x_position - tab_thickness / 2,
            0,
            plate_top
        ])
            rotate([90, 0, 90])
                linear_extrude(height = tab_thickness)
                    tab_profile();

        translate([x_position, 0, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(
                    h = tab_thickness + 2 * overlap,
                    d = tab_hole_diameter,
                    center = true
                );
    }
}

// Single connected solid; collar underside at Z = 0
union() {
    base_plate();
    underside_collar();

    for (side = [-1, 1])
        end_tab(side * tab_center_x);
}