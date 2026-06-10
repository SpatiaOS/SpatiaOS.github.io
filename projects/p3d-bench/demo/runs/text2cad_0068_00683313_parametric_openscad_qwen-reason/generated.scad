$fn = 100;

// Parameters
base_len = 0.5;
base_wid = 0.4375;
base_ht  = 0.09375;

base_void_x = 0.25;
base_void_y = 0.1875;
base_void_r = 0.0938;

strip_len = 0.5;
strip_wid = 0.0625;
strip_y   = base_wid - strip_wid;

strip1_z_min = -0.25;
strip1_z_max = 0.0;

strip2_z_min = -0.5;
strip2_z_max = 0.25;

strip2_void_x = 0.125;
strip2_void_y = 0.4375;
strip2_void_r = 0.05;

collar_x = 0.2501;
collar_y = 0.1876;
collar_r_out = 0.0938;
collar_r_in  = 0.05;
collar_h     = 0.0625;
collar_z     = base_ht;

// Modules
module base_solid() {
    cube([base_len, base_wid, base_ht]);
}

module back_strips() {
    translate([0, strip_y, strip1_z_min])
        cube([strip_len, strip_wid, strip1_z_max - strip1_z_min]);
    translate([0, strip_y, strip2_z_min])
        cube([strip_len, strip_wid, strip2_z_max - strip2_z_min]);
}

module collar_solid() {
    translate([collar_x, collar_y, collar_z])
        difference() {
            cylinder(h=collar_h, r=collar_r_out);
            translate([0, 0, -0.01])
                cylinder(h=collar_h + 0.02, r=collar_r_in);
        }
}

module all_voids() {
    translate([base_void_x, base_void_y, -0.01])
        cylinder(h=base_ht + 0.02, r=base_void_r);
    translate([strip2_void_x, strip2_void_y, strip2_z_min - 0.01])
        cylinder(h=strip2_z_max - strip2_z_min + 0.02, r=strip2_void_r);
}

// Assembly
difference() {
    union() {
        base_solid();
        back_strips();
        collar_solid();
    }
    all_voids();
}