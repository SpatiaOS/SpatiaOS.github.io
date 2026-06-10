// Parametric dimensions
base_length      = 0.341352;
base_width       = 0.199422;
base_height      = 0.065029;
base_extrusion   = 0.065;          // main extrusion depth reference

// Low rounded annular section (right end, on upper side)
annular_ctr_x    = 0.2416;
annular_ctr_y    = 0.0997;
annular_outer_r  = 0.0997;
annular_inner_r  = 0.0434;
annular_height   = base_height;    // low tier: base height added on top

// Taller hollow sleeve (left side, concentric annular cylinder)
sleeve_ctr_x     = -0.0834;
sleeve_ctr_y     = 0.0998;
sleeve_outer_r   = 0.1301;
sleeve_inner_r   = 0.0867;
sleeve_height    = 0.2601;

// Projecting arm section (stepped tier)
arm_length       = 0.325145;
arm_width        = 0.260116;
arm_height       = 0.130058;
arm_left         = -0.4086;
arm_front        = -0.0303;
arm_cut_z        = 0.065;          // lower band removed from underside

// Narrow triangular reinforcing web
web_x_min        = 0.0466;
web_run          = 0.108382;       // horizontal plan run of triangle
web_y_front      = 0.0781;
web_thickness    = 0.0217;
web_y_back       = web_y_front + web_thickness;
web_z_bottom     = base_height;
web_rise         = 0.195087;
web_z_top        = web_z_bottom + web_rise;

// Resolution
$fn = 100;
eps  = 1e-4;

// Main model assembly
union() {
    // 1. Main base block
    cube([base_length, base_width, base_height]);

    // 2. Low rounded annular section on upper side
    translate([annular_ctr_x, annular_ctr_y, base_height])
    difference() {
        cylinder(h = annular_height, r = annular_outer_r);
        translate([0, 0, -eps])
        cylinder(h = annular_height + 2*eps, r = annular_inner_r);
    }

    // 3. Taller hollow sleeve
    translate([sleeve_ctr_x, sleeve_ctr_y, 0])
    difference() {
        cylinder(h = sleeve_height, r = sleeve_outer_r);
        translate([0, 0, -eps])
        cylinder(h = sleeve_height + 2*eps, r = sleeve_inner_r);
    }

    // 4. Arm as raised stepped tier (lower band removed)
    translate([arm_left, arm_front, arm_cut_z])
    cube([arm_length, arm_width, arm_height - arm_cut_z]);

    // 5. Triangular web
    web_module();
}

// Triangular web: prism rising from base top toward sleeve tier height
module web_module() {
    x1 = web_x_min;
    x2 = web_x_min + web_run;
    y1 = web_y_front;
    y2 = web_y_back;
    z1 = web_z_bottom;
    z2 = web_z_top;

    polyhedron(
        points = [
            [x1, y1, z1],  // 0  bottom-front-left
            [x2, y1, z1],  // 1  bottom-front-right
            [x1, y1, z2],  // 2  top-front-left
            [x1, y2, z1],  // 3  bottom-back-left
            [x2, y2, z1],  // 4  bottom-back-right
            [x1, y2, z2]   // 5  top-back-left
        ],
        faces = [
            [0, 1, 4, 3],  // bottom
            [0, 1, 2],     // front triangle
            [3, 5, 4],     // back triangle
            [0, 2, 5, 3],  // left vertical face
            [1, 4, 5, 2]   // slanted top face
        ],
        convexity = 5
    );
}