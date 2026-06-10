// Reconstructed bevel-gear assembly in millimeters

// ---------- Global resolution and modeling tolerances ----------
$fn = 96;
eps = 0.02;

// Slight negative clearance creates a tiny interference fit so pins and gears
// export as robust overlapping solids rather than coincident cylindrical faces.
bore_fit_clearance_diameter = -0.12;

// ---------- Pin dimensions ----------
large_pin_diameter = 67.74;
large_pin_long_length = 175.0;
large_pin_short_length = 100.0;

small_pin_diameter = 28.80;
small_pin_length = 120.0;

// ---------- Large bevel gear dimensions ----------
large_gear_teeth = 52;
large_gear_tip_radius = 110.0;
large_gear_root_radius = 100.0;
large_gear_tooth_inner_radius = 58.0;

large_gear_web_thickness = 12.0;
large_gear_cone_height = 21.0;
large_gear_tooth_height = 5.5;

large_gear_bore_diameter = 67.748;

large_gear_hub_radius = 52.0;
large_gear_hub_height = 10.0;
large_gear_collar_radius = 42.0;
large_gear_collar_height = 6.0;
large_gear_rear_hub_radius = 44.0;
large_gear_rear_hub_height = 8.0;

large_gear_trim_ring_outer_radius = 64.0;
large_gear_trim_ring_inner_radius = 50.0;
large_gear_trim_ring_height = 3.0;
large_gear_trim_ring_sink = 3.0;

large_gear_outer_rim_width = 5.0;
large_gear_outer_rim_height = 2.5;

large_tooth_base_fraction = 0.62;
large_tooth_tip_fraction = 0.40;
large_tooth_embed_depth = 0.80;

// ---------- Small bevel gear dimensions ----------
small_gear_teeth = 36;
small_gear_tip_radius = 72.0;
small_gear_root_radius = 64.0;
small_gear_tooth_inner_radius = 31.0;

small_gear_web_thickness = 9.0;
small_gear_cone_height = 12.0;
small_gear_tooth_height = 4.0;

small_gear_bore_diameter = 28.80;

small_gear_hub_radius = 25.0;
small_gear_hub_height = 8.0;
small_gear_collar_radius = 19.0;
small_gear_collar_height = 4.0;
small_gear_rear_hub_radius = 21.0;
small_gear_rear_hub_height = 4.0;

small_gear_trim_ring_outer_radius = 34.0;
small_gear_trim_ring_inner_radius = 24.0;
small_gear_trim_ring_height = 2.2;
small_gear_trim_ring_sink = 2.0;

small_gear_outer_rim_width = 3.5;
small_gear_outer_rim_height = 2.0;

small_tooth_base_fraction = 0.65;
small_tooth_tip_fraction = 0.42;
small_tooth_embed_depth = 0.60;

// ---------- Assembly placement ----------
central_large_gear_position = [0.0, -65.0, 0.0];
right_large_gear_position = [104.0, 38.3, 68.2];
small_gear_position = [-144.5, 45.0, 60.0];

central_pin_axial_offset = 0.0;
right_pin_axial_offset = 56.0;
small_pin_axial_offset = 51.5;

central_large_gear_tooth_phase = 0.0;
right_large_gear_tooth_phase = 180 / large_gear_teeth;
small_gear_tooth_phase = 180 / small_gear_teeth;

// ---------- Display colors ----------
gear_color = [0.68, 0.68, 0.70, 1.0];
pin_color = [0.76, 0.76, 0.78, 1.0];


// ---------- Helper functions ----------
function polar3(r, a, z) = [r * cos(a), r * sin(a), z];

function cone_face_z(r, inner_radius, root_radius, z_outer, cone_height) =
    z_outer + cone_height * (root_radius - r) / (root_radius - inner_radius);


// ---------- Primitive helpers ----------
module annular_cylinder_z(h, r_outer, r_inner, centered = false) {
    if (centered) {
        difference() {
            cylinder(h = h, r = r_outer, center = true);
            cylinder(h = h + 2 * eps, r = r_inner, center = true);
        }
    } else {
        difference() {
            cylinder(h = h, r = r_outer, center = false);
            translate([0, 0, -eps])
                cylinder(h = h + 2 * eps, r = r_inner, center = false);
        }
    }
}

module solid_pin_z(diameter, length) {
    cylinder(h = length, d = diameter, center = true);
}

module solid_pin_x(diameter, length) {
    rotate([0, 90, 0])
        solid_pin_z(diameter, length);
}


// ---------- Bevel tooth modeled as a tapered triangular-faced polyhedron ----------
module bevel_tooth(
    tooth_index,
    teeth_count,
    inner_radius,
    tip_radius,
    root_radius,
    z_outer,
    cone_height,
    tooth_height,
    base_width_fraction,
    tip_width_fraction,
    embed_depth
) {
    tooth_pitch = 360 / teeth_count;
    a_center = tooth_index * tooth_pitch;

    base_half_angle = tooth_pitch * base_width_fraction / 2;
    tip_half_angle = tooth_pitch * tip_width_fraction / 2;

    z_inner_base = cone_face_z(inner_radius, inner_radius, root_radius, z_outer, cone_height) - embed_depth;
    z_tip_base = cone_face_z(tip_radius, inner_radius, root_radius, z_outer, cone_height) - embed_depth;

    z_inner_top = cone_face_z(inner_radius, inner_radius, root_radius, z_outer, cone_height) + tooth_height;
    z_tip_top = cone_face_z(tip_radius, inner_radius, root_radius, z_outer, cone_height) + tooth_height;

    polyhedron(
        points = [
            polar3(inner_radius, a_center - base_half_angle, z_inner_base),
            polar3(tip_radius,   a_center - base_half_angle, z_tip_base),
            polar3(tip_radius,   a_center + base_half_angle, z_tip_base),
            polar3(inner_radius, a_center + base_half_angle, z_inner_base),

            polar3(inner_radius, a_center - tip_half_angle, z_inner_top),
            polar3(tip_radius,   a_center - tip_half_angle, z_tip_top),
            polar3(tip_radius,   a_center + tip_half_angle, z_tip_top),
            polar3(inner_radius, a_center + tip_half_angle, z_inner_top)
        ],
        faces = [
            [0, 3, 2], [0, 2, 1],
            [4, 5, 6], [4, 6, 7],
            [0, 1, 5], [0, 5, 4],
            [1, 2, 6], [1, 6, 5],
            [2, 3, 7], [2, 7, 6],
            [3, 0, 4], [3, 4, 7]
        ],
        convexity = 4
    );
}


// ---------- Parametric bevel gear with bore, hub, rings, and conical radial teeth ----------
module bevel_gear_z(
    teeth_count,
    tip_radius,
    root_radius,
    tooth_inner_radius,
    web_thickness,
    cone_height,
    tooth_height,
    bore_diameter,
    hub_radius,
    hub_height,
    collar_radius,
    collar_height,
    rear_hub_radius,
    rear_hub_height,
    trim_ring_outer_radius,
    trim_ring_inner_radius,
    trim_ring_height,
    trim_ring_sink,
    outer_rim_width,
    outer_rim_height,
    tooth_base_fraction,
    tooth_tip_fraction,
    tooth_embed_depth
) {
    front_z = web_thickness / 2;
    rear_z = -web_thickness / 2;
    bore_radius = (bore_diameter + bore_fit_clearance_diameter) / 2;
    bore_cut_height = 2 * (
        web_thickness +
        cone_height +
        tooth_height +
        hub_height +
        collar_height +
        rear_hub_height +
        20
    );

    difference() {
        union() {
            // Flat gear web/root disk.
            cylinder(h = web_thickness, r = root_radius, center = true);

            // Conical support face beneath the bevel teeth.
            translate([0, 0, front_z - eps])
                cylinder(
                    h = cone_height + eps,
                    r1 = root_radius,
                    r2 = tooth_inner_radius,
                    center = false
                );

            // Root rim visible between outer tooth valleys.
            translate([0, 0, front_z - outer_rim_height])
                annular_cylinder_z(
                    h = outer_rim_height,
                    r_outer = root_radius,
                    r_inner = root_radius - outer_rim_width,
                    centered = false
                );

            // Radial bevel teeth.
            for (tooth_idx = [0 : teeth_count - 1]) {
                bevel_tooth(
                    tooth_idx,
                    teeth_count,
                    tooth_inner_radius,
                    tip_radius,
                    root_radius,
                    front_z,
                    cone_height,
                    tooth_height,
                    tooth_base_fraction,
                    tooth_tip_fraction,
                    tooth_embed_depth
                );
            }

            // Raised decorative annular ring near the hub.
            translate([0, 0, front_z + cone_height - trim_ring_sink])
                annular_cylinder_z(
                    h = trim_ring_height,
                    r_outer = trim_ring_outer_radius,
                    r_inner = trim_ring_inner_radius,
                    centered = false
                );

            // Front hub and collar around the bore.
            translate([0, 0, front_z + cone_height - eps])
                cylinder(h = hub_height, r = hub_radius, center = false);

            translate([0, 0, front_z + cone_height + hub_height - eps])
                cylinder(h = collar_height, r = collar_radius, center = false);

            // Short rear boss for thickness around the bore.
            translate([0, 0, rear_z - rear_hub_height + eps])
                cylinder(h = rear_hub_height, r = rear_hub_radius, center = false);
        }

        // Through-bore for the mating cylindrical pin.
        cylinder(h = bore_cut_height, r = bore_radius, center = true);
    }
}


// ---------- Specific gear modules ----------
module large_bevel_gear() {
    bevel_gear_z(
        large_gear_teeth,
        large_gear_tip_radius,
        large_gear_root_radius,
        large_gear_tooth_inner_radius,
        large_gear_web_thickness,
        large_gear_cone_height,
        large_gear_tooth_height,
        large_gear_bore_diameter,
        large_gear_hub_radius,
        large_gear_hub_height,
        large_gear_collar_radius,
        large_gear_collar_height,
        large_gear_rear_hub_radius,
        large_gear_rear_hub_height,
        large_gear_trim_ring_outer_radius,
        large_gear_trim_ring_inner_radius,
        large_gear_trim_ring_height,
        large_gear_trim_ring_sink,
        large_gear_outer_rim_width,
        large_gear_outer_rim_height,
        large_tooth_base_fraction,
        large_tooth_tip_fraction,
        large_tooth_embed_depth
    );
}

module small_bevel_gear() {
    bevel_gear_z(
        small_gear_teeth,
        small_gear_tip_radius,
        small_gear_root_radius,
        small_gear_tooth_inner_radius,
        small_gear_web_thickness,
        small_gear_cone_height,
        small_gear_tooth_height,
        small_gear_bore_diameter,
        small_gear_hub_radius,
        small_gear_hub_height,
        small_gear_collar_radius,
        small_gear_collar_height,
        small_gear_rear_hub_radius,
        small_gear_rear_hub_height,
        small_gear_trim_ring_outer_radius,
        small_gear_trim_ring_inner_radius,
        small_gear_trim_ring_height,
        small_gear_trim_ring_sink,
        small_gear_outer_rim_width,
        small_gear_outer_rim_height,
        small_tooth_base_fraction,
        small_tooth_tip_fraction,
        small_tooth_embed_depth
    );
}


// ---------- Main unified assembly ----------
module reconstructed_assembly() {
    union() {
        color(gear_color) {
            // Lower/central large bevel gear with vertical shaft.
            translate(central_large_gear_position)
                rotate([0, 0, central_large_gear_tooth_phase])
                    large_bevel_gear();

            // Right large bevel gear rotated onto a horizontal axis.
            translate(right_large_gear_position)
                rotate([0, 90, 0])
                    rotate([0, 0, right_large_gear_tooth_phase])
                        large_bevel_gear();

            // Smaller upper-left bevel gear.
            translate(small_gear_position)
                rotate([0, 0, small_gear_tooth_phase])
                    small_bevel_gear();
        }

        color(pin_color) {
            // Long vertical pin through the central large gear.
            translate([
                central_large_gear_position[0],
                central_large_gear_position[1],
                central_large_gear_position[2] + central_pin_axial_offset
            ])
                solid_pin_z(large_pin_diameter, large_pin_long_length);

            // Short horizontal pin through the right gear.
            translate([
                right_large_gear_position[0] + right_pin_axial_offset,
                right_large_gear_position[1],
                right_large_gear_position[2]
            ])
                solid_pin_x(large_pin_diameter, large_pin_short_length);

            // Thin vertical pin through the small gear.
            translate([
                small_gear_position[0],
                small_gear_position[1],
                small_gear_position[2] + small_pin_axial_offset
            ])
                solid_pin_z(small_pin_diameter, small_pin_length);
        }
    }
}

reconstructed_assembly();