// Parameters
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;

void_x = 0.375;
void_y = 0.25;
void_r = 0.125;

collar_outer_r = 0.2125;
collar_depth = 0.0375;

tab_thick = 0.125;
tab_width = 0.375;
tab_total_h = 0.5875;
tab_hole_r = 0.0937;
tab_y_offset = 0.0625;

tab_r = tab_width / 2;
tab_hole_z = tab_total_h - tab_r;

$fn = 100;

// Upright rounded tab module
module upright_tab(x_pos) {
    translate([x_pos, 0, 0]) {
        difference() {
            union() {
                translate([0, tab_y_offset, base_height])
                    cube([tab_thick, tab_width, tab_hole_z - base_height]);
                translate([0, void_y, tab_hole_z])
                    rotate([0, 90, 0])
                        cylinder(h=tab_thick, r=tab_r);
            }
            translate([-0.01, void_y, tab_hole_z])
                rotate([0, 90, 0])
                    cylinder(h=tab_thick + 0.02, r=tab_hole_r);
        }
    }
}

// Main model
difference() {
    union() {
        // Base plate
        cube([base_length, base_width, base_height]);
        
        // Underside collar
        translate([void_x, void_y, -collar_depth])
            cylinder(h=collar_depth, r=collar_outer_r);
        
        // Left and right tabs
        upright_tab(0);
        upright_tab(base_length - tab_thick);
    }
    
    // Continuous central through void
    translate([void_x, void_y, -collar_depth - 0.01])
        cylinder(h=base_height + collar_depth + 0.02, r=void_r);
}