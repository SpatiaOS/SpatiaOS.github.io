// Parameters
base_length = 0.341352;
base_width = 0.199422;
base_height = 0.065029;
main_extrusion = 0.065;

// Annular section parameters
annular_center_left = 0.2416;
annular_center_front = 0.0997;
annular_outer_r = 0.0997;
annular_inner_r = 0.0434;

// Hollow sleeve parameters
sleeve_span = 0.2602;
sleeve_offset_left = -0.2135;
sleeve_offset_right = 0.2946;
sleeve_offset_front = -0.0303;
sleeve_offset_back = -0.0305;
sleeve_center_left = -0.0834;
sleeve_center_front = 0.0998;
sleeve_outer_r = 0.1301;
sleeve_inner_r = 0.0867;
sleeve_height = 0.2601;

// Arm parameters
arm_length = 0.325145;
arm_width = 0.260116;
arm_height = 0.130058;
arm_offset_left = -0.4086;
arm_offset_right = 0.4248;
arm_offset_front = -0.0303;
arm_offset_back = -0.0304;
arm_cut_range = 0.065;

// Triangular web parameters
web_run = 0.108382;
web_thickness = 0.0217;
web_left_min = 0.0466;
web_left_max = 0.1863;
web_front_offset = 0.0781;
web_back_offset = 0.0996;
web_rise_span = 0.195087;
web_max_height = 0.2601;

$fn = 100;

// Main base
module base() {
    cube([base_length, base_width, base_height]);
}

// Low rounded annular section
module annular_section() {
    translate([annular_center_left, annular_center_front, base_height]) {
        difference() {
            cylinder(h = main_extrusion, r = annular_outer_r);
            cylinder(h = main_extrusion + 0.001, r = annular_inner_r);
        }
    }
}

// Taller hollow sleeve
module hollow_sleeve() {
    sleeve_x = sleeve_center_left;
    sleeve_y = sleeve_center_front;
    sleeve_base_z = base_height + main_extrusion;
    
    translate([sleeve_x, sleeve_y, sleeve_base_z]) {
        difference() {
            cylinder(h = sleeve_height, r = sleeve_outer_r);
            translate([0, 0, -0.001])
                cylinder(h = sleeve_height + 0.002, r = sleeve_inner_r);
        }
    }
}

// Arm with cutaway lower band
module arm_with_cut() {
    arm_x = arm_offset_left;
    arm_y = arm_offset_front;
    arm_z = base_height + main_extrusion;
    
    difference() {
        translate([arm_x, arm_y, arm_z])
            cube([arm_length, arm_width, arm_height]);
        
        // Cut away lower band from underside
        translate([arm_x - 0.001, arm_y - 0.001, -0.001])
            cube([arm_length + 0.002, arm_width + 0.002, arm_cut_range + 0.001]);
    }
}

// Triangular web
module triangular_web() {
    web_x_start = web_left_min;
    web_x_end = web_left_max;
    web_y_front = web_front_offset;
    web_y_back = web_back_offset;
    web_base_z = base_height + main_extrusion;
    
    // Create triangular cross-section that rises toward sleeve
    hull() {
        // Bottom edge at start
        translate([web_x_start, web_y_front, web_base_z])
            cube([0.001, web_y_back - web_y_front, web_thickness]);
        
        // Top edge at end, rising toward sleeve height
        translate([web_x_end, web_y_front, web_base_z + web_max_height - web_thickness])
            cube([0.001, web_y_back - web_y_front, web_thickness]);
    }
}

// Final assembly
union() {
    base();
    annular_section();
    hollow_sleeve();
    arm_with_cut();
    triangular_web();
}