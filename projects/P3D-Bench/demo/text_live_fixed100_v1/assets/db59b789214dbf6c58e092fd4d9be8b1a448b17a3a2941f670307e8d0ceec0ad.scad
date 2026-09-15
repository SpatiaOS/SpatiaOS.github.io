// Parameters
$fn = 100;

// Base plate dimensions
plate_length = 120;
plate_width = 42;
plate_thickness = 6;
plate_arc_radius = plate_width / 2;

// Central opening and underside collar
center_opening_d = 20;
collar_od = 36;
collar_height = 3;
collar_overlap = 0.2;

// End tab dimensions
tab_length = 30;
tab_width = 24;
tab_height = 32;
tab_corner_radius = 8;
tab_hole_d = 8;
tab_hole_offset_from_top = 11;
tab_overlap = 0.5;

// Derived values
tiny = 0.1;
tab_center_x = plate_length / 2 - tab_length / 2;
tab_hole_center_z = plate_thickness + tab_height - tab_hole_offset_from_top;

// Rounded rectangle 2D profile
module rounded_rect_2d(size, radius) {
    x = max(size[0] / 2 - radius, 0);
    y = max(size[1] / 2 - radius, 0);

    hull() {
        translate([-x, -y]) circle(r=radius);
        translate([ x, -y]) circle(r=radius);
        translate([-x,  y]) circle(r=radius);
        translate([ x,  y]) circle(r=radius);
    }
}

// Tall end tab solid
module tab_solid(x_pos) {
    translate([x_pos, 0, plate_thickness - tab_overlap])
        linear_extrude(height=tab_height + tab_overlap)
            rounded_rect_2d([tab_length, tab_width], tab_corner_radius);
}

// Through-hole in tab thickness
module tab_bore(x_pos) {
    translate([x_pos, 0, tab_hole_center_z])
        rotate([90, 0, 0])
            cylinder(h=tab_width + 2, d=tab_hole_d, center=true);
}

// Central through opening through plate and collar
module center_bore() {
    translate([0, 0, -collar_height - tiny])
        cylinder(h=plate_thickness + collar_height + 2 * tiny, d=center_opening_d);
}

// Main model
difference() {
    union() {
        // Plate with underside collar, then central opening
        difference() {
            union() {
                // Shallow arc-based plate
                linear_extrude(height=plate_thickness)
                    rounded_rect_2d([plate_length, plate_width], plate_arc_radius);

                // Underside annular collar, overlapped slightly into plate
                translate([0, 0, -collar_height])
                    cylinder(h=collar_height + collar_overlap, d=collar_od);
            }

            // Real central through opening
            center_bore();
        }

        // Tall rounded tabs at both ends
        for (sx = [-1, 1]) {
            tab_solid(sx * tab_center_x);
        }
    }

    // Through openings in each tab
    for (sx = [-1, 1]) {
        tab_bore(sx * tab_center_x);
    }
}