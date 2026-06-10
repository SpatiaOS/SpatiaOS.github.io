// Parameters
$fn = 128;
eps = 0.0005;

// Main base reference
base_length = 0.341352;
base_width = 0.199422;
base_height = 0.065029;
base_extrude_depth = 0.065;

base_center_x = 0.2416;
base_center_y = 0.0997;
base_outer_r = 0.0997;
base_inner_r = 0.0434;

// Tall hollow sleeve
sleeve_span = 0.2602;
sleeve_outer_r = 0.1301;
sleeve_inner_r = 0.0867;
sleeve_center_x = -0.0834;
sleeve_center_y = 0.0998;
sleeve_top_z = 0.2601;

sleeve_left_offset = -0.2135;
sleeve_right_offset = 0.2946;
sleeve_front_offset = -0.0303;
sleeve_back_offset = -0.0305;

// Raised straight-sided arm
arm_length = 0.325145;
arm_width = 0.260116;
arm_top_z = 0.130058;
arm_lower_cut_z = 0.065;

arm_left_offset = -0.4086;
arm_right_offset = 0.4248;
arm_front_offset = -0.0303;
arm_back_offset = -0.0304;

arm_x0 = arm_left_offset;
arm_x1 = arm_x0 + arm_length;
arm_y0 = arm_front_offset;
arm_y1 = arm_y0 + arm_width;

// Narrow triangular web
web_plan_run = 0.108382;
web_thickness = 0.0217;
web_profile_span = 0.195087;

web_left_offset = 0.0466;
web_right_offset = 0.1863;
web_front_offset = 0.0781;
web_back_offset = 0.0996;

web_x0 = web_left_offset;
web_x1 = web_x0 + web_plan_run;
web_y0 = web_front_offset;
web_y1 = web_y0 + web_thickness;
web_bottom_z = base_height - eps;

// Helper functions
function clamp(v, lo, hi) = min(max(v, lo), hi);
function web_top_z_at(x) =
    web_bottom_z +
    (sleeve_top_z - web_bottom_z) *
    clamp((web_profile_span - (x - web_x0)) / web_profile_span, 0, 1);

// 2D rounded base footprint
module base_outer_profile_2d() {
    union() {
        square([base_center_x, base_width], center=false);
        translate([base_center_x, base_center_y])
            circle(r=base_outer_r);
    }
}

// Low rounded base solid
module main_base_solid() {
    linear_extrude(height=base_height, convexity=6)
        base_outer_profile_2d();
}

// Tall sleeve outer cylinder
module sleeve_outer_solid() {
    translate([sleeve_center_x, sleeve_center_y, 0])
        cylinder(h=sleeve_top_z, r=sleeve_outer_r, center=false);
}

// Arm with underside band removed from z=0 to z=0.065
module stepped_arm_solid() {
    difference() {
        translate([arm_x0, arm_y0, 0])
            cube([arm_x1 - arm_x0, arm_y1 - arm_y0, arm_top_z], center=false);

        translate([arm_x0 - eps, arm_y0 - eps, -eps])
            cube([arm_x1 - arm_x0 + 2*eps,
                  arm_y1 - arm_y0 + 2*eps,
                  arm_lower_cut_z + eps], center=false);
    }
}

// Sloped triangular web extruded across its narrow thickness
module triangular_web_solid() {
    let (
        z1 = web_top_z_at(web_x1),
        pts = [
            [web_x0, -web_bottom_z],
            [web_x0, -sleeve_top_z],
            [web_x1, -z1],
            [web_x1, -web_bottom_z]
        ]
    )
    translate([0, web_y0, 0])
        rotate([-90, 0, 0])
            linear_extrude(height=web_y1 - web_y0, convexity=4)
                polygon(points=pts);
}

// Through bore cutter
module vertical_bore(cx, cy, r, z_top) {
    translate([cx, cy, -eps])
        cylinder(h=z_top + 2*eps, r=r, center=false);
}

// Final model
difference() {
    union() {
        main_base_solid();
        sleeve_outer_solid();
        stepped_arm_solid();
        triangular_web_solid();
    }

    // Base annular opening
    vertical_bore(base_center_x, base_center_y, base_inner_r, base_height);

    // Sleeve hollow opening
    vertical_bore(sleeve_center_x, sleeve_center_y, sleeve_inner_r, sleeve_top_z);
}