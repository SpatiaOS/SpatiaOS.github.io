// Base parameters
base_length = 0.341352;
base_width = 0.199422;
base_height_reference = 0.065029;
base_depth = 0.065;

base_ring_center = [0.2416, 0.0997];
base_outer_radius = 0.0997;
base_inner_radius = 0.0434;

// Sleeve parameters
sleeve_span_reference = [0.2602, 0.2602];
sleeve_offsets_reference = [-0.2135, 0.2946, -0.0303, -0.0305];
sleeve_center = [-0.0834, 0.0998];
sleeve_outer_radius = 0.1301;
sleeve_inner_radius = 0.0867;
sleeve_top = 0.2601;

// Arm parameters
arm_length = 0.325145;
arm_width = 0.260116;
arm_height_reference = 0.130058;
arm_offsets = [-0.4086, 0.4248, -0.0303, -0.0304];
arm_top = 0.1301;
arm_undercut_bottom = 0;
arm_undercut_top = 0.065;

// Web parameters
web_run = 0.108382;
web_thickness = 0.0217;
web_rise = 0.195087;
web_left_offset = 0.0466;
web_right_offset_reference = 0.1863;
web_front_offset = 0.0781;
web_back_offset_reference = 0.0996;
web_bottom = base_depth;

// Modeling parameters
epsilon = 0.00001;
$fn = 180;

// Rounded base outline
module base_outline() {
    intersection() {
        square([base_length, base_width]);

        union() {
            square([base_ring_center[0], base_width]);

            translate(base_ring_center)
                circle(r = base_outer_radius);
        }
    }
}

// Low annular base
module main_base() {
    difference() {
        linear_extrude(height = base_depth)
            base_outline();

        translate([
            base_ring_center[0],
            base_ring_center[1],
            -epsilon
        ])
            cylinder(
                h = base_depth + 2 * epsilon,
                r = base_inner_radius
            );
    }
}

// Hollow upper sleeve
module sleeve() {
    translate([sleeve_center[0], sleeve_center[1], 0])
        difference() {
            cylinder(h = sleeve_top, r = sleeve_outer_radius);

            translate([0, 0, -epsilon])
                cylinder(
                    h = sleeve_top + 2 * epsilon,
                    r = sleeve_inner_radius
                );
        }
}

// Raised arm with underside relief
module stepped_arm() {
    translate([arm_offsets[0], arm_offsets[2], 0])
        difference() {
            cube([arm_length, arm_width, arm_top]);

            translate([
                -epsilon,
                -epsilon,
                arm_undercut_bottom - epsilon
            ])
                cube([
                    arm_length + 2 * epsilon,
                    arm_width + 2 * epsilon,
                    arm_undercut_top - arm_undercut_bottom + epsilon
                ]);
        }
}

// Triangular web with embedded lower edge
module triangular_web() {
    translate([
        web_left_offset,
        web_front_offset + web_thickness,
        web_bottom
    ])
        rotate([90, 0, 0])
            linear_extrude(height = web_thickness, convexity = 4)
                polygon(points = [
                    [0, -epsilon],
                    [web_run, -epsilon],
                    [web_run, 0],
                    [0, web_rise]
                ]);
}

// Assembly and unobstructed sleeve bore
module bracket() {
    difference() {
        union() {
            main_base();
            sleeve();
            stepped_arm();
            triangular_web();
        }

        translate([sleeve_center[0], sleeve_center[1], -epsilon])
            cylinder(
                h = max(sleeve_top, arm_top, web_bottom + web_rise)
                    + 2 * epsilon,
                r = sleeve_inner_radius
            );
    }
}

bracket();