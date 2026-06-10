// Parameters
$fn = 100;

// Main plate dimensions
plate_len = 0.225;
plate_wid = 0.75;
plate_thk = 0.0375;

// Through holes
hole_rad = 0.0281;
hole_x = 0.1125;
hole_y1 = 0.0375;
hole_y2 = 0.7125;

// Upper central rectangular solid
upper_h = 0.1125;
upper_w = 0.5625;
upper_front_off = 0.0938;

// Lower central rectangular solid
lower_h = 0.375;

// Annular boss (lower stepped section)
boss_r_out = 0.1078;
boss_r_in = 0.0563;
boss_h = 0.0938;
boss_x = 0.1125;
boss_y = 0.4687;

// Solid pin (upper stepped section)
pin_r = 0.0563;
pin_h = 0.1594;
pin_x = 0.1126;
pin_y = 0.4688;

// Derived reference values
shoulder_z = upper_h;
center_y = upper_front_off + upper_w / 2;

// Module: Base plate
module main_plate() {
    translate([plate_len/2, plate_wid/2, plate_thk/2])
        cube([plate_len, plate_wid, plate_thk], center=true);
}

// Module: Upper rectangular solid
module upper_rect() {
    translate([plate_len/2, center_y, upper_h/2])
        cube([plate_len, upper_w, upper_h], center=true);
}

// Module: Lower rectangular solid
module lower_rect() {
    translate([plate_len/2, center_y, -lower_h/2])
        cube([plate_len, upper_w, lower_h], center=true);
}

// Module: Annular boss (hollow ring)
module annular_boss() {
    translate([boss_x, boss_y, shoulder_z])
        difference() {
            cylinder(h=boss_h, r=boss_r_out, center=false);
            cylinder(h=boss_h + 0.01, r=boss_r_in, center=false);
        }
}

// Module: Solid pin
module solid_pin() {
    translate([pin_x, pin_y, shoulder_z])
        cylinder(h=pin_h, r=pin_r, center=false);
}

// Module: Plate through-holes
module through_holes() {
    translate([hole_x, hole_y1, plate_thk/2])
        cylinder(h=plate_thk + 0.02, r=hole_rad, center=true);
    translate([hole_x, hole_y2, plate_thk/2])
        cylinder(h=plate_thk + 0.02, r=hole_rad, center=true);
}

// Main assembly
difference() {
    union() {
        main_plate();
        upper_rect();
        lower_rect();
        annular_boss();
        solid_pin();
    }
    through_holes();
}