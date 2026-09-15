// Parameters
$fn = 100;
eps = 0.001;

// Base parameters
base_length    = 0.341352;
base_width     = 0.199422;
base_height    = 0.065029;
base_center_x  = 0.2416;
base_center_y  = 0.0997;
base_outer_r   = 0.0997;
base_inner_r   = 0.0434;

// Sleeve parameters
sleeve_x       = -0.0834;
sleeve_y       = 0.0998;
sleeve_outer_r = 0.1301;
sleeve_inner_r = 0.0867;
sleeve_height  = 0.2601;

// Arm parameters
arm_length     = 0.325145;
arm_width      = 0.260116;
arm_x_min      = -0.4086;
arm_y_min      = -0.0303;
arm_z_min      = 0.065;
arm_z_max      = 0.1301;

// Triangular web parameters
web_run        = 0.108382;
web_thickness  = 0.0217;
web_x_min      = 0.0466;
web_x_max      = web_x_min + web_run;
web_y_min      = 0.0781;
web_y_max      = web_y_min + web_thickness;
web_z_min      = 0.065029;
web_z_max      = 0.2601;

// Solid body assembly
difference() {
    union() {
        // Base plate: rectangular section and rounded end
        cube([base_center_x, base_width, base_height]);
        translate([base_center_x, base_center_y, 0])
            cylinder(h=base_height, r=base_outer_r);

        // Raised stepped arm tier
        translate([arm_x_min, arm_y_min, arm_z_min])
            cube([arm_length, arm_width, arm_z_max - arm_z_min]);

        // Taller sleeve outer cylinder
        translate([sleeve_x, sleeve_y, 0])
            cylinder(h=sleeve_height, r=sleeve_outer_r);

        // Triangular stiffening web
        translate([0, web_y_max, 0])
            rotate([90, 0, 0])
                linear_extrude(height=web_thickness)
                    polygon([
                        [web_x_min, web_z_min],
                        [web_x_max, web_z_min],
                        [web_x_min, web_z_max]
                    ]);
    }

    // Base through-hole
    translate([base_center_x, base_center_y, -eps])
        cylinder(h=base_height + 2*eps, r=base_inner_r);

    // Sleeve central through-bore
    translate([sleeve_x, sleeve_y, -eps])
        cylinder(h=sleeve_height + 2*eps, r=sleeve_inner_r);
}