// Parametric dimensions for annular sleeve with tab and underside recess
length = 0.375;
width = 0.375;
height = 0.25;
main_extrusion = 0.25;

// Main annular cylinder parameters
main_center_x = 0.1875;
main_center_y = 0.1875;
main_outer_radius = 0.1875;
main_bore_radius = 0.075;

// Shallow tab parameters
tab_bounding_length = 0.375;
tab_bounding_width = 0.5625;
tab_center_x = 0.1875;
tab_center_y = -0.1875;
tab_outer_radius = 0.1875;
tab_bore_radius = 0.05;
tab_height = 0.05;

// Underside recess parameters
recess_length = 0.2557;
recess_width = 0.2884;
recess_left_offset = 0.0597;
recess_right_offset = 0.0596;
recess_front_offset = 0.0433;
recess_back_offset = 0.0433;
recess_center_x = 0.1875;
recess_center_y = 0.1875;
recess_radius = 0.075;
recess_start_z = 0;
recess_end_z = 0.125;

// Resolution for smooth curves
$fn = 100;

// Module for creating annular cylinder (tube)
module annular_cylinder(outer_r, inner_r, h) {
    difference() {
        cylinder(h=h, r=outer_r);
        cylinder(h=h, r=inner_r);
    }
}

// Main model construction
union() {
    // Base rectangular solid
    cube([length, width, height]);
    
    // Main annular cylinder on upper side
    translate([main_center_x, main_center_y, height]) {
        annular_cylinder(main_outer_radius, main_bore_radius, main_extrusion);
    }
    
    // Shallow attached annular tab on upper side
    translate([tab_center_x, tab_center_y, height]) {
        annular_cylinder(tab_outer_radius, tab_bore_radius, tab_height);
    }
}

// Underside recess cut (subtract from base)
difference() {
    children(0); // Reference the union above
    translate([recess_center_x, recess_center_y, recess_start_z]) {
        cylinder(h=recess_end_z - recess_start_z, r=recess_radius);
    }
}