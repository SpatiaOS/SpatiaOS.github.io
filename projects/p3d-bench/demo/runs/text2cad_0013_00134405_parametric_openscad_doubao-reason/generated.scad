// Global Resolution Setting
$fn = 100;

// Reference System Parameters
underside_ref_z = 0;          // Base underside reference plane Z position
central_axis = [0.375, 0.375, 0]; // Shared concentric axis position (0.375 from left/front edges)
base_total_extents = [0.75, 0.75]; // Overall footprint of assembly

// Main Annular Base Parameters
main_base_outer_r = 0.375;
main_base_inner_r = 0.3375;
main_base_thickness = 0.05625;
main_base_z_span = 0.0281;    // Distance from reference plane to top/bottom of base

// Central Annular Collar Parameters
collar_footprint = 0.15;
collar_outer_r = collar_footprint / 2;
collar_inner_r = 0.04;        // Through void radius
collar_thickness = 0.0468;
collar_z_span = 0.0234;       // Distance from reference plane to top/bottom of collar

// Radial Rib Web Parameters
rib_bound_left_offset = 0.0658;
rib_bound_right_offset = 0.0658;
rib_bound_front_offset = 0.0387;
rib_bound_back_offset = 0.1903;
rib_bound_size = [
    base_total_extents[0] - rib_bound_left_offset - rib_bound_right_offset,
    base_total_extents[1] - rib_bound_front_offset - rib_bound_back_offset
];
rib_bound_pos = [rib_bound_left_offset, rib_bound_front_offset, underside_ref_z - 0.0141];
rib_inner_r = collar_outer_r;
rib_outer_r = main_base_inner_r;
rib_thickness = 0.028125;
rib_z_span = 0.0141;          // Distance from reference plane to top/bottom of ribs
rib_count = 4;
rib_angle_width = 30;         // Angular width of each radial rib in degrees

// Reusable Module: Concentric Annulus
module annulus(outer_r, inner_r, height, center) {
    translate(center)
    difference() {
        cylinder(h=height, r=outer_r, center=true);
        cylinder(h=height + 0.1, r=inner_r, center=true); // Extended to ensure through cut
    }
}

// Reusable Module: Radial Sector Rib
module radial_rib(inner_r, outer_r, start_angle, width_angle, height, center) {
    end_angle = start_angle + width_angle;
    translate(center)
    linear_extrude(height=height, center=true)
    polygon(points = concat(
        // Inner arc start to outer arc start
        [
            [inner_r * cos(radians(start_angle)), inner_r * sin(radians(start_angle))],
            [outer_r * cos(radians(start_angle)), outer_r * sin(radians(start_angle))]
        ],
        // Outer arc from start to end
        [for (a = [start_angle : 1 : end_angle]) [outer_r * cos(radians(a)), outer_r * sin(radians(a))]],
        // Outer arc end to inner arc end
        [
            [outer_r * cos(radians(end_angle)), outer_r * sin(radians(end_angle))],
            [inner_r * cos(radians(end_angle)), inner_r * sin(radians(end_angle))]
        ],
        // Inner arc from end back to start
        [for (a = [end_angle : -1 : start_angle]) [inner_r * cos(radians(a)), inner_r * sin(radians(a))]]
    ));
}

// Main Assembly Union
union() {
    // 1. Main Annular Base
    annulus(
        outer_r = main_base_outer_r,
        inner_r = main_base_inner_r,
        height = main_base_thickness,
        center = [central_axis.x, central_axis.y, underside_ref_z]
    );

    // 2. Central Annular Collar
    annulus(
        outer_r = collar_outer_r,
        inner_r = collar_inner_r,
        height = collar_thickness,
        center = [central_axis.x, central_axis.y, underside_ref_z]
    );

    // 3. Radial Rib Web (clipped to specified bounding footprint)
    intersection() {
        // Generate radial ribs spaced evenly around axis
        for (i = [0 : rib_count - 1]) {
            radial_rib(
                inner_r = rib_inner_r,
                outer_r = rib_outer_r,
                start_angle = i * (360 / rib_count),
                width_angle = rib_angle_width,
                height = rib_thickness,
                center = [central_axis.x, central_axis.y, underside_ref_z]
            );
        }
        // Clip ribs to specified bounding box
        translate(rib_bound_pos)
        cube([rib_bound_size.x, rib_bound_size.y, rib_thickness], center=false);
    }
}