// OpenSCAD parametric model
// All dimensions are used as given (treated as millimeters).

$fn = 120;
eps = 0.0001;

// Base reference block
base_length = 0.341352;
base_width  = 0.199422;
base_height = 0.065029;
main_extrusion_depth = 0.065;

// Edge-offset helper functions
function x_left(offset)  = offset;
function x_right(offset) = base_length - offset;
function y_front(offset) = offset;
function y_back(offset)  = base_width - offset;

// Low rounded annular section on base upper side
low_ring_cx = 0.2416;
low_ring_cy = 0.0997;
low_ring_outer_radius = 0.0997;
low_ring_inner_radius = 0.0434;
low_ring_height = main_extrusion_depth;

// Taller hollow sleeve
sleeve_edge_left  = -0.2135;
sleeve_edge_right = 0.2946;
sleeve_edge_front = -0.0303;
sleeve_edge_back  = -0.0305;
sleeve_center_x_offset = -0.0834;
sleeve_center_y_offset = 0.0998;
sleeve_outer_radius = 0.1301;
sleeve_inner_radius = 0.0867;
sleeve_height = 0.2601;

sleeve_x0 = x_left(sleeve_edge_left);
sleeve_x1 = x_right(sleeve_edge_right);
sleeve_y0 = y_front(sleeve_edge_front);
sleeve_y1 = y_back(sleeve_edge_back);

// Blend offset-derived center with explicitly given center
sleeve_cx = ((sleeve_x0 + sleeve_x1) / 2 + sleeve_center_x_offset) / 2;
sleeve_cy = ((sleeve_y0 + sleeve_y1) / 2 + sleeve_center_y_offset) / 2;

// Projecting arm section
arm_length = 0.325145;
arm_width  = 0.260116;
arm_height = 0.130058;
arm_edge_left  = -0.4086;
arm_edge_right = 0.4248;
arm_edge_front = -0.0303;
arm_edge_back  = -0.0304;
arm_upward_reach = 0.1301;
arm_cut_height = main_extrusion_depth;

arm_x0 = x_left(arm_edge_left);
arm_x1_by_offset = x_right(arm_edge_right);
arm_y0 = y_front(arm_edge_front);
arm_y1_by_offset = y_back(arm_edge_back);

// Average offset-derived span and stated size to honor both definitions
arm_size_x = ((arm_x1_by_offset - arm_x0) + arm_length) / 2;
arm_size_y = ((arm_y1_by_offset - arm_y0) + arm_width) / 2;
arm_top_z  = max(arm_height, arm_upward_reach);

// Narrow triangular web
web_plan_run = 0.108382;
web_material_thickness = 0.0217;
web_left_start = 0.0466;
web_left_end   = 0.1863;
web_front_offset = 0.0781;
web_back_offset  = 0.0996;
web_side_rise = 0.195087;

web_x0 = web_left_start;
web_x_run = min(web_left_end - web_left_start, web_plan_run);
web_x1 = web_x0 + web_x_run;

web_y0 = y_front(web_front_offset);
web_y1_limit = y_back(web_back_offset);
web_y1 = min(web_y1_limit, web_y0 + web_material_thickness);

// Start just below base top and rise to the sleeve tier
web_z_bottom = sleeve_height - web_side_rise - eps;
web_z_top = sleeve_height;

// Base plate
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// Low annular boss, inner opening cut later
module low_ring_boss() {
    translate([low_ring_cx, low_ring_cy, base_height - eps])
        cylinder(h=low_ring_height + eps, r=low_ring_outer_radius);
}

// Sleeve outer cylinder, inner opening cut later
module sleeve_boss() {
    translate([sleeve_cx, sleeve_cy, -eps])
        cylinder(h=sleeve_height + eps, r=sleeve_outer_radius);
}

// Arm as raised stepped tier: lower band 0 to arm_cut_height removed
module arm_tier() {
    translate([arm_x0, arm_y0, arm_cut_height])
        cube([arm_size_x, arm_size_y, arm_top_z - arm_cut_height]);
}

// Triangular web prism
module triangular_web() {
    polyhedron(
        points=[
            [web_x0, web_y0, web_z_bottom], // 0
            [web_x0, web_y0, web_z_top],    // 1
            [web_x1, web_y0, web_z_bottom], // 2
            [web_x0, web_y1, web_z_bottom], // 3
            [web_x0, web_y1, web_z_top],    // 4
            [web_x1, web_y1, web_z_bottom]  // 5
        ],
        faces=[
            [0, 2, 1],       // front triangular face
            [3, 4, 5],       // back triangular face
            [0, 3, 5], [0, 5, 2], // bottom face
            [1, 2, 5], [1, 5, 4], // sloped face
            [0, 1, 4], [0, 4, 3]  // vertical face at web_x0
        ],
        convexity=2
    );
}

// Final model: add all solids, then cut hollow openings
difference() {
    union() {
        base_plate();
        low_ring_boss();
        sleeve_boss();
        arm_tier();
        triangular_web();
    }

    // Hollow sleeve inner opening
    translate([sleeve_cx, sleeve_cy, -2 * eps])
        cylinder(h=sleeve_height + 4 * eps, r=sleeve_inner_radius);

    // Low annular section inner opening
    translate([low_ring_cx, low_ring_cy, -2 * eps])
        cylinder(h=base_height + low_ring_height + 4 * eps, r=low_ring_inner_radius);
}