// Parameters
$fn = 64;

// Base Plate Dimensions (mm)
plate_length = 120;
plate_width  = 60;
plate_thick  = 6;

// Rib Dimensions (mm)
rib_height   = 4;
rib_width    = 10;
rib_offset_y = 15;

// Stepped Hole Dimensions (mm)
hole_x_positions = [-plate_length/2 + 15, 0, plate_length/2 - 15];
hole_y_position  = 0;
recess_diameter  = 16;
recess_depth     = 2;
bore_diameter    = 10;
bore_depth       = 4;

// Reusable Modules
module base_plate(len, wid, thk) {
    cube([len, wid, thk], center=true);
}

module pair_of_ribs(len, w, h, y_off) {
    translate([0, y_off, 0]) cube([len, w, h], center=true);
    translate([0, -y_off, 0]) cube([len, w, h], center=true);
}

module stepped_hole(x, y, top_z, r_d, r_h, b_d, b_h) {
    translate([x, y, top_z - r_h/2])
        cylinder(h=r_h, d=r_d, center=true);
    translate([x, y, top_z - r_h - b_h/2])
        cylinder(h=b_h, d=b_d, center=true);
}

// Main Assembly
difference() {
    union() {
        base_plate(plate_length, plate_width, plate_thick);
        translate([0, 0, plate_thick + rib_height/2])
            pair_of_ribs(plate_length, rib_width, rib_height, rib_offset_y);
    }

    for (x = hole_x_positions) {
        stepped_hole(x, hole_y_position, plate_thick,
                     recess_diameter, recess_depth,
                     bore_diameter, bore_depth);
    }
}