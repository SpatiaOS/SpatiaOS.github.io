// Reconstructed wedge-fin / hub-cap / wire-ring assembly
// Units: millimeters

// ---------- Global resolution ----------
$fn = 72;
epsilon = 0.03;
model_color = [0.62, 0.62, 0.66, 1.0];

// ---------- Fin plate parameters ----------
plate_thickness = 1.50;
fin_surface_scale = 0.982;              // slight two-sided taper to suggest chamfered perimeter
fin_scale_center = [11.00, 5.75];
fin_convexity = 12;

// Freeform fin outline control points, in the XY plane
fin_top_left  = [0.80, 6.55];
fin_shoulder  = [5.80, 10.55];
fin_mid_top   = [15.50, 10.50];
fin_top_right = [21.35, 10.95];
fin_tip_nose  = [21.85, 9.45];
fin_lower_tip = [20.70, 7.20];
fin_mid_lower = [12.70, 1.85];
fin_lower_neck = [4.65, 0.85];

fin_left_ctrl1 = [-0.20, 5.35];
fin_left_ctrl2 = [1.15, 2.15];

fin_lower_ctrl1a = [6.70, 0.15];
fin_lower_ctrl1b = [9.50, 0.45];
fin_lower_ctrl2a = [15.60, 2.55];
fin_lower_ctrl2b = [18.50, 5.10];

fin_top_ctrl1a = [2.60, 8.10];
fin_top_ctrl1b = [3.95, 9.95];
fin_top_ctrl2a = [8.90, 10.85];
fin_top_ctrl2b = [12.10, 10.15];
fin_top_ctrl3a = [17.60, 10.45];
fin_top_ctrl3b = [19.85, 11.10];

fin_steps_left = 14;
fin_steps_lower1 = 18;
fin_steps_lower2 = 18;
fin_steps_top1 = 12;
fin_steps_top2 = 18;
fin_steps_top3 = 12;

// Row of five chamfered openings along the upper ridge
top_row_hole_d = 1.10;
top_row_hole_chamfer_depth = 0.18;
top_row_hole_centers = [
    [6.90, 8.95],
    [8.55, 9.04],
    [10.20, 9.10],
    [11.85, 9.13],
    [13.50, 9.15]
];

// Wire-ring receiving openings
lower_ring_hole_center = [10.85, 2.30];
tip_ring_hole_center   = [21.10, 9.35];
ring_hole_d = 0.90;
ring_hole_chamfer_depth = 0.16;

// ---------- Hub cap / bearing parameters ----------
hub_center = [2.00, 4.15];

hub_cap_edge_bevel_depth = 0.42;
hub_cap_face_depth = 0.88;
hub_cap_total_depth = hub_cap_edge_bevel_depth + hub_cap_face_depth;
hub_cap_front_scale = 0.91;
hub_cap_attach_overlap = 0.04;
hub_cap_corner_radius = 0.18;

// Faceted, bulbous cap outline relative to hub_center
hub_cap_outline_points = [
    [-4.00, -1.80],
    [-3.80,  0.90],
    [-2.60,  2.80],
    [-0.40,  3.85],
    [ 1.80,  3.50],
    [ 3.30,  1.90],
    [ 3.55,  0.00],
    [ 2.80, -2.00],
    [ 0.90, -3.10],
    [-1.50, -3.30],
    [-3.30, -2.70]
];

// Central bearing sleeve / boss
hub_sleeve_projection = 0.30;
hub_sleeve_length = plate_thickness + 2 * (hub_cap_total_depth + hub_sleeve_projection);
hub_boss_outer_d = 2.70;
hub_boss_chamfer = 0.16;
hub_bore_d = 0.95;
hub_bore_chamfer_depth = 0.22;

// ---------- Wire ring parameters ----------
lower_ring_major_radius = 1.20;
tip_ring_major_radius = 1.15;
wire_radius = 0.09;
ring_sweep_fn = 96;
ring_cross_section_fn = 18;
hole_fn = 56;


// ---------- Helper functions ----------
function bezier3(p0, p1, p2, p3, t) =
    let (u = 1 - t)
    [
        u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
        u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]
    ];

function fin_top_forward_points() =
    concat(
        [fin_top_left],
        [for (i = [1 : fin_steps_top1])
            bezier3(fin_top_left, fin_top_ctrl1a, fin_top_ctrl1b, fin_shoulder, i / fin_steps_top1)],
        [for (i = [1 : fin_steps_top2])
            bezier3(fin_shoulder, fin_top_ctrl2a, fin_top_ctrl2b, fin_mid_top, i / fin_steps_top2)],
        [for (i = [1 : fin_steps_top3])
            bezier3(fin_mid_top, fin_top_ctrl3a, fin_top_ctrl3b, fin_top_right, i / fin_steps_top3)]
    );

function fin_profile_points() =
    let (top = fin_top_forward_points())
    concat(
        [fin_top_left],
        [for (i = [1 : fin_steps_left])
            bezier3(fin_top_left, fin_left_ctrl1, fin_left_ctrl2, fin_lower_neck, i / fin_steps_left)],

        [for (i = [1 : fin_steps_lower1])
            bezier3(fin_lower_neck, fin_lower_ctrl1a, fin_lower_ctrl1b, fin_mid_lower, i / fin_steps_lower1)],

        [for (i = [1 : fin_steps_lower2])
            bezier3(fin_mid_lower, fin_lower_ctrl2a, fin_lower_ctrl2b, fin_lower_tip, i / fin_steps_lower2)],

        [fin_tip_nose, fin_top_right],

        [for (i = [len(top) - 2 : -1 : 1]) top[i]]
    );


// ---------- 2D profiles ----------
module fin_profile_2d() {
    polygon(points = fin_profile_points());
}

module hub_cap_profile_local() {
    offset(r = hub_cap_corner_radius)
        polygon(points = hub_cap_outline_points);
}


// ---------- Solid helpers ----------
module chamfered_bore_z(d, wall_thickness, chamfer_depth, fn = hole_fn) {
    union() {
        cylinder(h = wall_thickness + 2 * epsilon, d = d, center = true, $fn = fn);

        translate([0, 0, wall_thickness / 2 - chamfer_depth / 2 + epsilon / 2])
            cylinder(
                h = chamfer_depth + epsilon,
                d1 = d,
                d2 = d + 2 * chamfer_depth,
                center = true,
                $fn = fn
            );

        translate([0, 0, -wall_thickness / 2 + chamfer_depth / 2 - epsilon / 2])
            cylinder(
                h = chamfer_depth + epsilon,
                d1 = d + 2 * chamfer_depth,
                d2 = d,
                center = true,
                $fn = fn
            );
    }
}

module chamfered_cylinder_z(h, d, chamfer, fn = hole_fn) {
    union() {
        if (h > 2 * chamfer)
            cylinder(h = h - 2 * chamfer, d = d, center = true, $fn = fn);

        translate([0, 0, h / 2 - chamfer / 2])
            cylinder(h = chamfer, d1 = d, d2 = d - 2 * chamfer, center = true, $fn = fn);

        translate([0, 0, -h / 2 + chamfer / 2])
            cylinder(h = chamfer, d1 = d - 2 * chamfer, d2 = d, center = true, $fn = fn);
    }
}

module torus(major_radius, tube_radius, sweep_fn = ring_sweep_fn, cross_fn = ring_cross_section_fn) {
    rotate_extrude(angle = 360, convexity = 8, $fn = sweep_fn)
        translate([major_radius, 0, 0])
            circle(r = tube_radius, $fn = cross_fn);
}


// ---------- Main components ----------
module fin_plate_blank() {
    // Upper and lower tapered halves create the thin plate with chamfer-like perimeter facets.
    union() {
        translate([fin_scale_center[0], fin_scale_center[1], 0])
            linear_extrude(
                height = plate_thickness / 2,
                center = false,
                convexity = fin_convexity,
                scale = fin_surface_scale
            )
                translate([-fin_scale_center[0], -fin_scale_center[1]])
                    fin_profile_2d();

        mirror([0, 0, 1])
            translate([fin_scale_center[0], fin_scale_center[1], 0])
                linear_extrude(
                    height = plate_thickness / 2,
                    center = false,
                    convexity = fin_convexity,
                    scale = fin_surface_scale
                )
                    translate([-fin_scale_center[0], -fin_scale_center[1]])
                        fin_profile_2d();
    }
}

module hub_cap_shell_positive_z() {
    // Sloped outer band of the cap half-shell.
    translate([hub_center[0], hub_center[1], plate_thickness / 2 - hub_cap_attach_overlap])
        linear_extrude(
            height = hub_cap_edge_bevel_depth + hub_cap_attach_overlap,
            center = false,
            convexity = 8,
            scale = hub_cap_front_scale
        )
            hub_cap_profile_local();

    // Flat front face after the bevel step.
    translate([hub_center[0], hub_center[1], plate_thickness / 2 + hub_cap_edge_bevel_depth - hub_cap_attach_overlap])
        linear_extrude(
            height = hub_cap_face_depth + hub_cap_attach_overlap,
            center = false,
            convexity = 8
        )
            scale([hub_cap_front_scale, hub_cap_front_scale, 1])
                hub_cap_profile_local();
}

module hub_cap_shell(side = 1) {
    if (side >= 0) {
        hub_cap_shell_positive_z();
    } else {
        mirror([0, 0, 1])
            hub_cap_shell_positive_z();
    }
}

module hub_bearing_sleeve_blank() {
    translate([hub_center[0], hub_center[1], 0])
        chamfered_cylinder_z(
            h = hub_sleeve_length,
            d = hub_boss_outer_d,
            chamfer = hub_boss_chamfer,
            fn = hole_fn
        );
}

module base_assembly() {
    union() {
        fin_plate_blank();

        for (side = [-1, 1])
            hub_cap_shell(side);

        hub_bearing_sleeve_blank();
    }
}


// ---------- Cutters ----------
module plate_hole_cutters() {
    union() {
        for (c = top_row_hole_centers)
            translate([c[0], c[1], 0])
                chamfered_bore_z(
                    d = top_row_hole_d,
                    wall_thickness = plate_thickness,
                    chamfer_depth = top_row_hole_chamfer_depth,
                    fn = hole_fn
                );

        translate([lower_ring_hole_center[0], lower_ring_hole_center[1], 0])
            chamfered_bore_z(
                d = ring_hole_d,
                wall_thickness = plate_thickness,
                chamfer_depth = ring_hole_chamfer_depth,
                fn = hole_fn
            );

        translate([tip_ring_hole_center[0], tip_ring_hole_center[1], 0])
            chamfered_bore_z(
                d = ring_hole_d,
                wall_thickness = plate_thickness,
                chamfer_depth = ring_hole_chamfer_depth,
                fn = hole_fn
            );
    }
}

module hub_bore_cutter() {
    translate([hub_center[0], hub_center[1], 0])
        chamfered_bore_z(
            d = hub_bore_d,
            wall_thickness = hub_sleeve_length,
            chamfer_depth = hub_bore_chamfer_depth,
            fn = hole_fn
        );
}


// ---------- Wire rings ----------
module lower_wire_ring() {
    // Ring plane is YZ so the upper wire segment passes through the lower plate opening.
    translate([
        lower_ring_hole_center[0],
        lower_ring_hole_center[1] - lower_ring_major_radius,
        0
    ])
        rotate([0, 90, 0])
            torus(lower_ring_major_radius, wire_radius);
}

module tip_wire_ring() {
    // Ring plane is XZ so the loop protrudes from the pointed tip.
    translate([
        tip_ring_hole_center[0] + tip_ring_major_radius,
        tip_ring_hole_center[1],
        0
    ])
        rotate([90, 0, 0])
            torus(tip_ring_major_radius, wire_radius);
}

module wire_rings() {
    union() {
        lower_wire_ring();
        tip_wire_ring();
    }
}


// ---------- Final unified assembly ----------
module solid_assembly() {
    difference() {
        base_assembly();
        plate_hole_cutters();
        hub_bore_cutter();
    }
}

module reconstructed_assembly() {
    color(model_color)
        union() {
            solid_assembly();
            wire_rings();
        }
}

reconstructed_assembly();