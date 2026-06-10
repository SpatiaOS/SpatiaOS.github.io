// Reconstructed mechanical assembly from rendered reference
// Units: millimeters
// Coordinate convention: Z is the vertical assembly axis; cage bottom is at Z = 0.

// -----------------------------------------------------------------------------
// Global resolution / modeling tolerances
// -----------------------------------------------------------------------------
circular_fn = 128;
$fn = circular_fn;

eps = 0.01;
part_overlap = 0.05;              // intentional tiny overlaps for manifold union
interface_interference = 0.04;    // hidden radial interference at constrained fits
fit_clearance = 0.20;             // visual clearance for nominal coaxial bores

// -----------------------------------------------------------------------------
// Overall layout
// -----------------------------------------------------------------------------
overall_height = 800;

// -----------------------------------------------------------------------------
// Top disc plate
// -----------------------------------------------------------------------------
disc_diameter = 180;
disc_thickness = 10;
disc_hole_diameter = 10;
disc_outer_chamfer = 1.2;

disc_top_z = overall_height;
disc_bottom_z = disc_top_z - disc_thickness;

// -----------------------------------------------------------------------------
// Long central rod
// -----------------------------------------------------------------------------
rod_diameter = 10;
rod_length = 500;
rod_disc_axial_overlap = 0.30;

rod_top_z = disc_bottom_z + rod_disc_axial_overlap;
rod_bottom_z = rod_top_z - rod_length;

// -----------------------------------------------------------------------------
// Barrel cage / vane slats
// -----------------------------------------------------------------------------
vane_count = 40;
cage_height = 300;
cage_max_diameter = 277;

slat_thickness = 3.9;             // tangential panel thickness
slat_radial_width = 50;
slat_curve_radius = 572.5;        // large-radius bow used for barrel profile
slat_profile_steps = 44;

slat_bow_sagitta =
    slat_curve_radius - sqrt(pow(slat_curve_radius, 2) - pow(cage_height / 2, 2));

slat_end_outer_radius = cage_max_diameter / 2 - slat_bow_sagitta;

slat_notch_overshoot = 2.0;

slat_top_notch_depth = 18;
slat_top_notch_height = 34;
slat_top_notch_radius = 5;

slat_bottom_notch_center_z = 58;
slat_bottom_notch_depth = 30;
slat_bottom_notch_height = 42;
slat_bottom_notch_radius = 15;

// -----------------------------------------------------------------------------
// Splined ring
// -----------------------------------------------------------------------------
splined_ring_outer_diameter = 200;
splined_ring_inner_diameter = 160;
splined_ring_thickness = 3.9;
splined_ring_tooth_count = 40;
splined_ring_tooth_depth = 5;
splined_ring_tooth_duty = 0.58;
splined_ring_tooth_phase = -180 / splined_ring_tooth_count;

// -----------------------------------------------------------------------------
// Flanged bushing
// -----------------------------------------------------------------------------
flanged_bushing_outer_diameter = 56.5;
flanged_bushing_total_height = 11.25;
flanged_bushing_flange_thickness = 3.25;
flanged_bushing_boss_diameter = 44.25;
flanged_bushing_bore_diameter = 40;
flanged_bushing_bore_clearance = fit_clearance;

// -----------------------------------------------------------------------------
// Bushing / locating plug
// -----------------------------------------------------------------------------
plug_total_height = 77.22;
plug_body_radius = 20;
plug_rim_radius = 23;
plug_rim_height = 5;
plug_body_height = 44.22;

plug_lower_height = plug_total_height - plug_rim_height - plug_body_height;
plug_base_height = 5;
plug_taper_height = plug_lower_height - plug_base_height;
plug_base_radius = 12;

plug_blind_bore_diameter = 24;
plug_blind_bore_depth = 10;

// -----------------------------------------------------------------------------
// Knob
// -----------------------------------------------------------------------------
knob_diameter = 60;
knob_height = 81;
knob_sphere_radius = knob_diameter / 2;
knob_base_diameter = 16;
knob_cone_height = knob_height - knob_sphere_radius;
knob_dome_steps = 28;

// -----------------------------------------------------------------------------
// Derived hub layout
// -----------------------------------------------------------------------------
plug_top_z = rod_bottom_z + plug_blind_bore_depth;
plug_bottom_z = plug_top_z - plug_total_height;

knob_base_z = plug_top_z - knob_cone_height;

flanged_bushing_bottom_z =
    plug_top_z - plug_rim_height - flanged_bushing_total_height + part_overlap;

splined_ring_center_z =
    flanged_bushing_bottom_z - splined_ring_thickness / 2 + part_overlap;

slat_top_notch_center_z = splined_ring_center_z;

// Inferred thin spider connector for the null/unknown hub-region part.
// It bridges the central hub to the splined ring, matching the visible star-like top structure.
spider_enabled = true;
spider_center_z = splined_ring_center_z;
spider_thickness = splined_ring_thickness + 2 * part_overlap;
spider_spoke_count = 8;
spider_hub_outer_diameter = 70;
spider_center_hole_diameter = rod_diameter + 2;
spider_outer_radius = splined_ring_inner_diameter / 2 + 4;
spider_spoke_inner_radius = spider_hub_outer_diameter / 2 - 2;
spider_spoke_width_inner = 11;
spider_spoke_width_outer = 18;

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------
function polar_point(r, a) = [r * cos(a), r * sin(a)];

function slat_bow_offset(z) =
    sqrt(pow(slat_curve_radius, 2) - pow(z - cage_height / 2, 2))
    - sqrt(pow(slat_curve_radius, 2) - pow(cage_height / 2, 2));

function slat_outer_radius_at(z) =
    slat_end_outer_radius + slat_bow_offset(z);

function slat_inner_radius_at(z) =
    slat_outer_radius_at(z) - slat_radial_width;

function spline_outer_points(n, r_root, r_tip, duty, phase) =
    [
        for (i = [0 : n - 1], k = [0 : 3])
            let(
                pitch = 360 / n,
                a1 = phase + i * pitch + (1 - duty) * pitch / 2,
                a2 = phase + i * pitch + (1 + duty) * pitch / 2,
                a = (k < 2) ? a1 : a2,
                r = (k == 0 || k == 3) ? r_root : r_tip
            )
            polar_point(r, a)
    ];

// -----------------------------------------------------------------------------
// Generic reusable geometry
// -----------------------------------------------------------------------------
module rounded_rect_2d(size = [10, 10], r = 1) {
    rr = min(r, min(size[0], size[1]) / 2 - eps);
    offset(r = rr)
        square([size[0] - 2 * rr, size[1] - 2 * rr], center = true);
}

module annular_chamfered_cylinder(outer_d, inner_d, h, chamfer = 0) {
    ro = outer_d / 2;
    ri = inner_d / 2;
    c = min(chamfer, min((outer_d - inner_d) / 4, h / 2 - eps));

    rotate_extrude(convexity = 8, $fn = circular_fn)
        polygon(points = [
            [ri, 0],
            [ro - c, 0],
            [ro, c],
            [ro, h - c],
            [ro - c, h],
            [ri, h]
        ]);
}

// -----------------------------------------------------------------------------
// Part modules
// -----------------------------------------------------------------------------
module disc_plate() {
    translate([0, 0, disc_bottom_z])
        annular_chamfered_cylinder(
            outer_d = disc_diameter,
            inner_d = disc_hole_diameter,
            h = disc_thickness,
            chamfer = disc_outer_chamfer
        );
}

module rod() {
    translate([0, 0, rod_bottom_z])
        union() {
            cylinder(h = rod_length, d = rod_diameter, center = false);

            // Hidden short interference sleeve reproduces the marginal disc/rod overlap
            // while avoiding coincident-only contact in the STL.
            translate([0, 0, rod_length - rod_disc_axial_overlap])
                cylinder(
                    h = rod_disc_axial_overlap + eps,
                    d = disc_hole_diameter + 2 * interface_interference,
                    center = false
                );
        }
}

module flanged_bushing() {
    ri = (flanged_bushing_bore_diameter + flanged_bushing_bore_clearance) / 2;
    rf = flanged_bushing_outer_diameter / 2;
    rb = flanged_bushing_boss_diameter / 2;

    rotate_extrude(convexity = 8, $fn = circular_fn)
        polygon(points = [
            [ri, 0],
            [rf, 0],
            [rf, flanged_bushing_flange_thickness],
            [rb, flanged_bushing_flange_thickness],
            [rb, flanged_bushing_total_height],
            [ri, flanged_bushing_total_height]
        ]);
}

module locating_plug() {
    body_start_z = plug_base_height + plug_taper_height;
    rim_start_z = body_start_z + plug_body_height;

    difference() {
        rotate_extrude(convexity = 8, $fn = circular_fn)
            polygon(points = [
                [0, 0],
                [plug_base_radius, 0],
                [plug_base_radius, plug_base_height],
                [plug_body_radius, body_start_z],
                [plug_body_radius, rim_start_z],
                [plug_rim_radius, rim_start_z],
                [plug_rim_radius, plug_total_height],
                [0, plug_total_height]
            ]);

        translate([0, 0, plug_total_height - plug_blind_bore_depth - eps])
            cylinder(
                h = plug_blind_bore_depth + 2 * eps,
                d = plug_blind_bore_diameter,
                center = false
            );
    }
}

module knob() {
    rotate_extrude(convexity = 8, $fn = circular_fn)
        polygon(points = concat(
            [
                [0, 0],
                [knob_base_diameter / 2, 0],
                [knob_sphere_radius, knob_cone_height]
            ],
            [
                for (i = [1 : knob_dome_steps])
                    let(phi = i * 90 / knob_dome_steps)
                    [
                        knob_sphere_radius * cos(phi),
                        knob_cone_height + knob_sphere_radius * sin(phi)
                    ]
            ]
        ));
}

module splined_ring_2d() {
    r_tip = splined_ring_outer_diameter / 2;
    r_root = r_tip - splined_ring_tooth_depth;

    difference() {
        polygon(points =
            spline_outer_points(
                splined_ring_tooth_count,
                r_root,
                r_tip,
                splined_ring_tooth_duty,
                splined_ring_tooth_phase
            )
        );

        circle(d = splined_ring_inner_diameter, $fn = circular_fn);
    }
}

module splined_ring() {
    linear_extrude(height = splined_ring_thickness, center = true, convexity = 10)
        splined_ring_2d();
}

module hub_spider_2d() {
    union() {
        difference() {
            circle(d = spider_hub_outer_diameter, $fn = circular_fn);
            circle(d = spider_center_hole_diameter, $fn = circular_fn);
        }

        for (i = [0 : spider_spoke_count - 1]) {
            rotate(i * 360 / spider_spoke_count)
                polygon(points = [
                    [spider_spoke_inner_radius, -spider_spoke_width_inner / 2],
                    [spider_outer_radius, -spider_spoke_width_outer / 2],
                    [spider_outer_radius,  spider_spoke_width_outer / 2],
                    [spider_spoke_inner_radius,  spider_spoke_width_inner / 2]
                ]);
        }
    }
}

module hub_spider() {
    linear_extrude(height = spider_thickness, center = true, convexity = 10)
        hub_spider_2d();
}

module slat_edge_notch_2d(zc, depth, height, radius) {
    x0 = slat_inner_radius_at(zc);
    cutter_w = depth + slat_notch_overshoot;
    cutter_x = x0 + (depth - slat_notch_overshoot) / 2;

    translate([cutter_x, zc])
        rounded_rect_2d([cutter_w, height], radius);
}

module vane_slat_base_profile_2d() {
    polygon(points = concat(
        [
            for (i = [0 : slat_profile_steps])
                let(z = cage_height * i / slat_profile_steps)
                [slat_outer_radius_at(z), z]
        ],
        [
            for (i = [slat_profile_steps : -1 : 0])
                let(z = cage_height * i / slat_profile_steps)
                [slat_inner_radius_at(z), z]
        ]
    ));
}

module vane_slat_profile_2d() {
    difference() {
        vane_slat_base_profile_2d();

        // Top and bottom locating notches on the inner edge of each slat.
        slat_edge_notch_2d(
            slat_top_notch_center_z,
            slat_top_notch_depth,
            slat_top_notch_height,
            slat_top_notch_radius
        );

        slat_edge_notch_2d(
            slat_bottom_notch_center_z,
            slat_bottom_notch_depth,
            slat_bottom_notch_height,
            slat_bottom_notch_radius
        );
    }
}

module vane_slat() {
    // Profile is drawn in radial-vs-vertical coordinates and extruded tangentially.
    rotate([90, 0, 0])
        linear_extrude(height = slat_thickness, center = true, convexity = 8)
            vane_slat_profile_2d();
}

module vane_slat_array() {
    for (i = [0 : vane_count - 1]) {
        rotate([0, 0, i * 360 / vane_count])
            vane_slat();
    }
}

module lower_hub_assembly() {
    translate([0, 0, plug_bottom_z])
        locating_plug();

    translate([0, 0, flanged_bushing_bottom_z])
        flanged_bushing();

    translate([0, 0, knob_base_z])
        knob();

    translate([0, 0, splined_ring_center_z])
        splined_ring();

    if (spider_enabled) {
        translate([0, 0, spider_center_z])
            hub_spider();
    }
}

// -----------------------------------------------------------------------------
// Unified assembly
// -----------------------------------------------------------------------------
module unified_assembly() {
    union() {
        vane_slat_array();
        lower_hub_assembly();
        rod();
        disc_plate();
    }
}

color([0.62, 0.62, 0.64])
    unified_assembly();