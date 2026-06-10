// Parameters
curve_facets = 128;
$fn = curve_facets;

join_overlap = 0.0001;
cut_clearance = 0.0002;

// Base
base_length = 0.75;
base_width = 0.45;
base_height = 0.05625;
main_depth = 0.0562;

// Common coaxial datum
axis_x = 0.375;
axis_y = 0.225;
shoulder_z = base_height;

// Paired concentric profile radii
outer_collar_outer_radius = 0.225;
outer_collar_inner_radius = 0.1875;

main_annulus_outer_radius = outer_collar_inner_radius;
main_annulus_inner_radius = 0.0937;

small_annulus_outer_radius = main_annulus_inner_radius;
small_annulus_inner_radius = 0.0562;

inner_solid_radius = small_annulus_inner_radius;

// Absolute reaches from shoulder_z
main_annulus_reach = main_depth;
inner_solid_reach = 0.075;
small_annulus_reach = 0.0937;
outer_collar_reach = 0.1687;

// Reference span offsets, L/R/F/B
small_annulus_offsets_lrfb = [0.2812, 0.2814, 0.1312, 0.1314];
inner_solid_offsets_lrfb = [0.3188, 0.3188, 0.1688, 0.1688];

// 2D rounded slot footprint
module slot_footprint_2d(l, w) {
    hull() {
        translate([w / 2, w / 2])
            circle(r = w / 2);
        translate([l - w / 2, w / 2])
            circle(r = w / 2);
    }
}

// Extruded slot base
module rounded_slot_base() {
    linear_extrude(height = base_height, convexity = 4)
        slot_footprint_2d(base_length, base_width);
}

// Coaxial annulus with real hollow boundary
module coaxial_annulus(outer_r, inner_r, reach) {
    translate([axis_x, axis_y, shoulder_z - join_overlap])
        difference() {
            cylinder(h = reach + join_overlap, r = outer_r);
            translate([0, 0, -cut_clearance])
                cylinder(h = reach + join_overlap + 2 * cut_clearance, r = inner_r);
        }
}

// Coaxial solid circular section
module coaxial_solid(r, reach) {
    translate([axis_x, axis_y, shoulder_z - join_overlap])
        cylinder(h = reach + join_overlap, r = r);
}

// Absolute-height concentric profile set
module coaxial_features() {
    // Outer annular collar: R0.225 to R0.1875
    coaxial_annulus(
        outer_collar_outer_radius,
        outer_collar_inner_radius,
        outer_collar_reach
    );

    // Base-level annular profile: R0.1875 to R0.0937
    coaxial_annulus(
        main_annulus_outer_radius,
        main_annulus_inner_radius,
        main_annulus_reach
    );

    // Smaller annular section: R0.0937 to R0.0562
    coaxial_annulus(
        small_annulus_outer_radius,
        small_annulus_inner_radius,
        small_annulus_reach
    );

    // Innermost solid circular section: R0.0562
    coaxial_solid(
        inner_solid_radius,
        inner_solid_reach
    );
}

// Main model
module model() {
    union() {
        rounded_slot_base();
        coaxial_features();
    }
}

model();