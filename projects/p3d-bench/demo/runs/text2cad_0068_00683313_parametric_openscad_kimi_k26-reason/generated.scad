// Parameters
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;

// Base circular opening
base_hole_x = 0.25;
base_hole_y = 0.1875;
base_hole_r = 0.0938;

// Back-edge strip 1 (underside, base underside to 0.25 below)
back_strip_width = 0.0625;
back_strip_y = base_width - back_strip_width; // back offset = 0, front offset = 0.375
back_strip1_z_bottom = -0.25;
back_strip1_z_top = 0;

// Back-edge solid 2 (same footprint, -0.5 below to +0.25 above base underside)
back_solid2_z_bottom = -0.5;
back_solid2_z_top = 0.25;

// Back-edge circular voids
back_hole_x = 0.125;
back_hole_y = 0.4375; // from front edge; note: aligns with back face of strip
back_hole_r = 0.05;

// Upper annular collar
collar_x = 0.2501;
collar_y = 0.1876;
collar_outer_r = 0.0938;
collar_inner_r = 0.05;
collar_height = 0.0625;
collar_z = base_height;

eps = 0.001;
$fn = 100;

// Main rectangular base with through hole
module main_base() {
    difference() {
        cube([base_length, base_width, base_height]);
        translate([base_hole_x, base_hole_y, -eps])
            cylinder(h=base_height + 2*eps, r=base_hole_r);
    }
}

// Underside back-edge strip 1
module back_strip1() {
    translate([0, back_strip_y, back_strip1_z_bottom])
        cube([base_length, back_strip_width, back_strip1_z_top - back_strip1_z_bottom]);
}

// Back-edge solid 2 (spans further down and up)
module back_solid2() {
    translate([0, back_strip_y, back_solid2_z_bottom])
        cube([base_length, back_strip_width, back_solid2_z_top - back_solid2_z_bottom]);
}

// Combined back-edge structure with circular void subtracted
module back_structure() {
    difference() {
        union() {
            back_strip1();
            back_solid2();
        }
        translate([back_hole_x, back_hole_y, back_solid2_z_bottom - eps])
            cylinder(h=(back_solid2_z_top - back_solid2_z_bottom) + 2*eps, r=back_hole_r);
    }
}

// Concentric annular collar on upper side
module top_collar() {
    translate([collar_x, collar_y, collar_z])
        difference() {
            cylinder(h=collar_height, r=collar_outer_r);
            translate([0, 0, -eps])
                cylinder(h=collar_height + 2*eps, r=collar_inner_r);
        }
}

// Final assembly
union() {
    main_base();
    back_structure();
    top_collar();
}