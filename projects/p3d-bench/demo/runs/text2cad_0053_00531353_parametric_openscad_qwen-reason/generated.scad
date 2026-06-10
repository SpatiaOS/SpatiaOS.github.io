$fn = 100;

// Base parameters
base_len = 0.75;
base_wid = 0.25;
base_thk = 0.1;

// Base hole parameters
hole_r = 0.05;
hole1_x = 0.125;
hole2_x = 0.625;
hole_y = 0.125;

// Upright parameters
up_len = 0.35;
up_wid = 0.2;
up_hgt = 0.2;
up_off_x = 0.2;
up_off_y = 0.025;

// Cap parameters
cap_rise = 0.1;

// Horizontal passage parameters
pass_r = 0.05;
pass_start_x = 0.2;
pass_len = 0.444;
pass_y = 0.125;
pass_z = 0.30;

// Relief cutout parameters
rel_x_start = 0.255;
rel_len = 0.24;
rel_y_start = 0.025;
rel_y_reach = 0.299;
rel_z_bottom = 0.18;
rel_z_top = 0.45;

// Obround slab base
module obround_base() {
    hull() {
        translate([base_wid/2, base_wid/2, 0]) 
            cylinder(h=base_thk, r=base_wid/2, center=false);
        translate([base_len - base_wid/2, base_wid/2, 0]) 
            cylinder(h=base_thk, r=base_wid/2, center=false);
    }
}

// Rectangular lower upright
module upright_block() {
    cube([up_len, up_wid, up_hgt], center=false);
}

// Semicircular cap matching upright footprint
module rounded_cap() {
    intersection() {
        rotate([90, 0, 0]) cylinder(h=up_len, r=cap_rise, center=true);
        cube([up_len, up_wid*2, cap_rise*2], center=true);
    }
}

// Rounded upper relief pocket
module relief_cutout() {
    minkowski() {
        cube([rel_len - 0.04, rel_y_reach - 0.04, rel_z_top - rel_z_bottom - 0.04], center=true);
        sphere(r=0.02);
    }
}

// Main assembly
difference() {
    union() {
        obround_base();
        translate([up_off_x, up_off_y, base_thk]) upright_block();
        translate([up_off_x + up_len/2, up_off_y + up_wid/2, base_thk + up_hgt]) rounded_cap();
    }

    // Vertical through openings in base
    translate([hole1_x, hole_y, -0.01]) cylinder(h=base_thk + 0.02, r=hole_r, center=false);
    translate([hole2_x, hole_y, -0.01]) cylinder(h=base_thk + 0.02, r=hole_r, center=false);

    // Horizontal circular passage through upright
    translate([pass_start_x, pass_y, pass_z]) rotate([0, 90, 0]) cylinder(h=pass_len, r=pass_r, center=false);

    // Rounded upper relief cutout
    translate([rel_x_start + rel_len/2, rel_y_start + rel_y_reach/2, rel_z_bottom + (rel_z_top - rel_z_bottom)/2]) 
        relief_cutout();
}