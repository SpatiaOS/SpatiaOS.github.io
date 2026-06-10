// Parameters
$fn = 100;
base_len = 0.742363;
base_wid = 0.535615;
base_h = 0.0944;
corner_r = 0.04;

axis_x = 0.1583;
axis_y = 0.3113;

void_r = 0.053;

collar_or = 0.0966;
collar_ir = 0.0748;
collar_z_start = 0.0944;
collar_z_end = 0.2396;
collar_h = collar_z_end - collar_z_start;

bore1_r = 0.0748;
bore1_z = 0.0218;
bore1_h = 0.0726;
bore2_r = 0.053;
bore2_z = -0.0944;
bore2_h = 0.0726;

side_r = 0.0073;
side_z = 0.0399;
side_h = 0.0146;
side1_x = 0.4487;
side1_y = 0.0472;
side2_x = 0.5939;
side2_y = 0.0472;

undercut_r = 0.0221;
undercut_h = 0.0152;
undercuts = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Rounded base footprint
module base_profile() {
    translate([corner_r, corner_r, 0])
    offset(r=corner_r)
    square([base_len - 2*corner_r, base_wid - 2*corner_r]);
}

// Annular collar geometry
module collar_geom() {
    difference() {
        cylinder(h=collar_h, r=collar_or, center=false);
        translate([0, 0, -0.01]) cylinder(h=collar_h + 0.02, r=collar_ir, center=false);
    }
}

// Main assembly
union() {
    difference() {
        linear_extrude(height=base_h, center=false, convexity=4) {
            base_profile();
        }
        translate([axis_x, axis_y, -0.1]) cylinder(h=base_h + 0.2, r=void_r, center=false);
        translate([axis_x, axis_y, bore1_z]) cylinder(h=bore1_h + 0.01, r=bore1_r, center=false);
        translate([axis_x, axis_y, bore2_z]) cylinder(h=bore2_h + 0.01, r=bore2_r, center=false);
        translate([side1_x, side1_y, side_z]) cylinder(h=side_h + 0.005, r=side_r, center=false);
        translate([side2_x, side2_y, side_z]) cylinder(h=side_h + 0.005, r=side_r, center=false);
        for (p = undercuts) {
            translate([p[0], p[1], -0.001]) cylinder(h=undercut_h + 0.002, r=undercut_r, center=false);
        }
    }
    translate([axis_x, axis_y, collar_z_start]) collar_geom();
}