$fn = 100;

// Base dimensions
base_len = 0.75;
base_wid = 0.625;
base_ht  = 0.00625;

// Wall dimensions
wall_thick = 0.0063;
wall_ht    = 0.1875;

// Cut 1: Lower rectangular opening
c1_y = 0.4447;
c1_dy = 0.081103;
c1_dz = 0.111891;
c1_dx = 0.0062;

// Cut 2: Circular through-hole
c2_y = 0.2948;
c2_z = 0.1063;
c2_r = 0.0432;
c2_dx = 0.0625;

// Cut 3: Smaller rectangular opening
c3_y = 0.091;
c3_dy = 0.043521;
c3_dz = 0.044108;
c3_dx = 0.0625;

// Cut 4: Horizontal base rectangular opening
c4_x = 0.3125;
c4_y = 0.2073;
c4_dx = 0.264669;
c4_dy = 0.40625;
c4_z = -0.0562;
c4_dz = 0.0625;

module base_plate() {
    cube([base_len, base_wid, base_ht]);
}

module upright_wall() {
    translate([0, 0, base_ht])
        cube([wall_thick, base_wid, wall_ht]);
}

module cut_lower_rect() {
    translate([0, c1_y, 0])
        cube([c1_dx, c1_dy, c1_dz]);
}

module cut_circular_hole() {
    translate([0, c2_y, c2_z])
        rotate([0, 90, 0])
            cylinder(h=c2_dx, r=c2_r, center=true);
}

module cut_small_rect() {
    translate([0, c3_y, 0.0992])
        cube([c3_dx, c3_dy, c3_dz]);
}

module cut_base_rect() {
    translate([c4_x, c4_y, c4_z])
        cube([c4_dx, c4_dy, c4_dz]);
}

difference() {
    union() {
        base_plate();
        upright_wall();
    }
    cut_lower_rect();
    cut_circular_hole();
    cut_small_rect();
    cut_base_rect();
}