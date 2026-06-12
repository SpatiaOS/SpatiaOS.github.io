// Base plate dimensions
base_l = 0.75;
base_w = 0.5;
base_h = 0.125;

// Central through void
void_r = 0.125;
void_x = 0.375;
void_y = 0.25;

// Underside annular collar
collar_h = 0.0375;
collar_or = 0.2125;
collar_ir = 0.125;

// Right tab parameters
rtab_x = 0.625;
rtab_y = 0.0625;
rtab_wx = 0.125;
rtab_wy = 0.375;
rtab_reach = 0.5875;
rtab_h = rtab_reach - base_h;
rtab_hole_r = 0.0937;

// Left tab parameters
ltab_x = 0.0;
ltab_y = 0.0625;
ltab_wx = 0.125;
ltab_wy = 0.375;
ltab_reach = 0.5875;
ltab_h = ltab_reach - base_h;
ltab_hole_r = 0.0937;

$fn = 100;

// Base solid plate
module base_plate() {
    cube([base_l, base_w, base_h]);
}

// Hollow collar on underside, concentric with central void
module collar() {
    translate([void_x, void_y, -collar_h])
    difference() {
        cylinder(h=collar_h, r=collar_or);
        translate([0, 0, -0.001])
            cylinder(h=collar_h + 0.002, r=collar_ir);
    }
}

// End tab with rounded top and through hole
module end_tab(x, y, wx, wy, h, hr) {
    r = wy / 2;
    rect_h = h - r;
    translate([x, y, base_h])
    difference() {
        union() {
            // Rectangular stem
            cube([wx, wy, rect_h]);
            // Rounded top (half cylinder along x)
            translate([0, r, rect_h])
            rotate([0, 90, 0])
                cylinder(h=wx, r=r);
        }
        // Through hole along tab thickness (x-axis)
        translate([wx / 2, r, h / 2])
        rotate([0, 90, 0])
            cylinder(h=wx + 0.01, r=hr, center=true);
    }
}

// Central void cutting through base and collar
module central_void() {
    translate([void_x, void_y, -collar_h - 0.001])
        cylinder(h=base_h + collar_h + 0.002, r=void_r);
}

// Assembly
difference() {
    union() {
        base_plate();
        collar();
        end_tab(rtab_x, rtab_y, rtab_wx, rtab_wy, rtab_h, rtab_hole_r);
        end_tab(ltab_x, ltab_y, ltab_wx, ltab_wy, ltab_h, ltab_hole_r);
    }
    central_void();
}