// Parameters
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;

rib_height = 0.017308;
rib_width = 0.0635;
rib_group_width = 0.162037;
rib_inset = 0.0635;

// Hole axes (offset from left / front edges)
h1_x = 0.0352;  h1_y = 0.7072;  h1_r = 0.013;
h2_x = 0.1433;  h2_y = 0.0577;  h2_r = 0.0173;
h3_x = 0.2538;  h3_y = 0.7072;  h3_r = 0.013;

// Stepped hole Z extents from base underside
upper_z0 = 0.0057;
upper_h  = 0.0231;
deep_z0  = -0.1154;
deep_h   = 0.1442;

$fn = 100;

module base_block() {
    cube([base_length, base_width, base_height]);
}

module single_rib(x) {
    translate([x, 0, base_height])
        cube([rib_width, base_width, rib_height]);
}

module stepped_hole(x, y, r) {
    translate([x, y, upper_z0])
        cylinder(h = upper_h, r = r);
    translate([x, y, deep_z0])
        cylinder(h = deep_h, r = r);
}

difference() {
    union() {
        base_block();
        single_rib(rib_inset);
        single_rib(rib_inset + rib_group_width - rib_width);
    }
    stepped_hole(h1_x, h1_y, h1_r);
    stepped_hole(h2_x, h2_y, h2_r);
    stepped_hole(h3_x, h3_y, h3_r);
}