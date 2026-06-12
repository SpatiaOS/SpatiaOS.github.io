// Parameters
$fn = 128;

// Reference dimensions
ref_length = 0.75;
ref_width = 0.75;
ref_height = 0.05625;

// Base annulus
base_outer_r = 0.375;
base_inner_r = 0.3375;
base_h = ref_height;
base_z = 0;

// Central collar
collar_dia = 0.15;
collar_outer_r = collar_dia / 2;
collar_inner_r = 0.05;
collar_h = 0.0468;
collar_z = 0;
collar_edge_off = 0.3;

// Rib web
rib_w = 0.618448;
rib_d = 0.521035;
rib_h = 0.028125;
rib_z = 0;
rib_off_left = 0.0658;
rib_off_front = 0.0387;

// Derived centers
cx = ref_length / 2;
cy = ref_width / 2;
rib_cx = rib_off_left + rib_w / 2;
rib_cy = rib_off_front + rib_d / 2;

// Main assembly
union() {
    // Main base annulus
    translate([cx, cy, base_z])
        difference() {
            cylinder(h=base_h, r=base_outer_r, center=true);
            cylinder(h=base_h + 0.01, r=base_inner_r, center=true);
        }

    // Central annular collar
    translate([cx, cy, collar_z])
        difference() {
            cylinder(h=collar_h, r=collar_outer_r, center=true);
            cylinder(h=collar_h + 0.01, r=collar_inner_r, center=true);
        }

    // Rounded radial rib web
    translate([rib_cx, rib_cy, rib_z])
        linear_extrude(height=rib_h, center=true)
            rib_profile();
}

// Rib web 2D profile
module rib_profile() {
    difference() {
        // Arc-based outline
        hull() {
            circle(d=rib_d);
            translate([rib_w - rib_d, 0]) circle(d=rib_d);
        }
        // Intervening elongated slot-like openings
        translate([rib_w * 0.25, 0]) 
            hull() {
                circle(d=rib_d * 0.15);
                translate([rib_w * 0.12, 0]) circle(d=rib_d * 0.15);
            }
        translate([rib_w * 0.75, 0]) 
            hull() {
                circle(d=rib_d * 0.15);
                translate([rib_w * 0.12, 0]) circle(d=rib_d * 0.15);
            }
    }
}