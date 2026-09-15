// Parameters (mm)
plate_length     = 80;
plate_width      = 28;
plate_thickness  = 4;
center_hole_d    = 12;
collar_outer_d   = 20;
collar_height    = 2.5;
tab_height       = 28;
tab_thickness    = 7;
tab_width        = 20;
tab_hole_d       = 7;
overlap          = 0.05;
$fn              = 96;

// Derived
end_r      = plate_width / 2;
tab_x      = plate_length / 2 - end_r;
tab_hole_z = tab_height - tab_width / 2;

// Arc-end (stadium) outline
module plate_profile() {
    hull() {
        translate([-plate_length / 2 + end_r, 0]) circle(r = end_r);
        translate([ plate_length / 2 - end_r, 0]) circle(r = end_r);
    }
}

// Rounded tombstone tab with hole through its thickness
module end_tab() {
    difference() {
        hull() {
            translate([0, 0, plate_thickness / 2])
                cube([tab_thickness, tab_width, plate_thickness], center = true);
            translate([0, 0, tab_hole_z])
                rotate([0, 90, 0])
                    cylinder(h = tab_thickness, d = tab_width, center = true);
        }
        translate([0, 0, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_thickness + 2, d = tab_hole_d, center = true);
    }
}

// Assembly
difference() {
    union() {
        // Shallow plate
        linear_extrude(height = plate_thickness)
            plate_profile();

        // Underside annular collar (ring via later hole cut)
        translate([0, 0, -collar_height])
            cylinder(h = collar_height + overlap, d = collar_outer_d);

        // Tall rounded end tabs
        translate([-tab_x, 0, 0]) end_tab();
        translate([ tab_x, 0, 0]) end_tab();
    }

    // Central through opening (plate + collar)
    translate([0, 0, -collar_height - 1])
        cylinder(h = plate_thickness + collar_height + 2, d = center_hole_d);
}