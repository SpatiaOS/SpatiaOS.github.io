// ==========================================
// Parametric Dimensions
// ==========================================

// Base block
base_length = 0.341352;
base_width = 0.199422;
base_height = 0.065029;
base_extrusion = 0.065;

// Low annular section on top of base
annular_cx = 0.2416;       // Center X from left edge
annular_cy = 0.0997;       // Center Y from front edge
annular_outer_r = 0.0997;
annular_inner_r = 0.0434;
annular_height = 0.065;

// Tall hollow sleeve
sleeve_cx = -0.0834;       // Center X offset from left edge
sleeve_cy = 0.0998;        // Center Y from front edge
sleeve_outer_r = 0.1301;
sleeve_inner_r = 0.0867;
sleeve_height = 0.2601;

// Arm (raised stepped tier after undercut)
arm_length = 0.325145;
arm_width = 0.260116;
arm_x_min = -0.4086;
arm_y_min = -0.0303;
arm_z_bottom = 0.065;      // Raised above base top (undercut removed)
arm_z_top = 0.1301;

// Triangular web gusset
web_plan_run = 0.108382;   // Horizontal leg of triangle
web_x_start = 0.0466;
web_y_min = 0.0781;
web_y_max = 0.0996;
web_z_bottom = 0.065;      // Sits on base top surface
web_z_top = 0.2601;        // Reaches toward sleeve tier

$fn = 100;

// ==========================================
// Module Definitions
// ==========================================

// Base block
module base_block() {
    cube([base_length, base_width, base_extrusion]);
}

// Low rounded annular section on upper side of base
module annular_ring() {
    translate([annular_cx, annular_cy, base_extrusion])
    difference() {
        cylinder(r=annular_outer_r, h=annular_height);
        // Inner profile open through the 0.065 thickness
        translate([0, 0, -0.001])
            cylinder(r=annular_inner_r, h=annular_height + 0.002);
    }
}

// Tall sleeve outer wall
module sleeve_outer() {
    translate([sleeve_cx, sleeve_cy, 0])
        cylinder(r=sleeve_outer_r, h=sleeve_height);
}

// Arm block raised as stepped tier (undercut removes z=0 to z=0.065)
module arm_block() {
    translate([arm_x_min, arm_y_min, arm_z_bottom])
        cube([arm_length, arm_width, arm_z_top - arm_z_bottom]);
}

// Narrow triangular web gusset between base and sleeve
module web_gusset() {
    web_h = web_z_top - web_z_bottom;
    web_thick = web_y_max - web_y_min;
    // Right triangle: vertical leg at x_start rising to sleeve tier,
    // horizontal leg along base top surface
    translate([web_x_start, web_y_min, web_z_bottom])
        linear_extrude(height=web_thick)
            polygon(points=[
                [0, 0],                   // Right angle at bottom-left
                [web_plan_run, 0],         // Horizontal leg endpoint
                [0, web_h]                 // Vertical leg reaching sleeve tier
            ]);
}

// ==========================================
// Main Model Assembly
// ==========================================

difference() {
    union() {
        // Base block
        base_block();

        // Low annular section on top of base
        annular_ring();

        // Tall sleeve outer cylinder
        sleeve_outer();

        // Arm raised tier (undercut already excluded)
        arm_block();

        // Triangular web gusset
        web_gusset();
    }

    // Sleeve inner bore through entire model height
    translate([sleeve_cx, sleeve_cy, -0.001])
        cylinder(r=sleeve_inner_r, h=sleeve_height + 0.002);

    // Annular section inner hole through base thickness
    translate([annular_cx, annular_cy, -0.001])
        cylinder(r=annular_inner_r, h=base_extrusion + 0.002);
}