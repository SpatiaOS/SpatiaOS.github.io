// Parameters
$fn = 128;
eps = 0.001;
shoulder_z = 0;

// Main round solids
main_radius = 0.1875;
solid_reach_positive = 0.5625;
solid_reach_negative = 0.5625;

// Lateral overlap between attached round sections
lobe_center_spacing = main_radius;
upper_lobe_center = [0,  lobe_center_spacing / 2];
second_lobe_center = [0, -lobe_center_spacing / 2];

// Positive-side circular removals
positive_cut_reach = 0.9375;
positive_large_cut_radius = 0.0975;
positive_small_cut_radius = 0.0534;

// Negative-side circular and annular removals
negative_center_cut_radius = 0.0562;
negative_center_cut_reach = 0.375;
negative_recess_reach = 0.0562;
negative_recess_inner_radius = 0.0562;
negative_recess_outer_radius_large = 0.1162;
negative_recess_outer_radius_small = 0.075;

// Feature centers
large_cut_center = upper_lobe_center;
small_cut_center = second_lobe_center;
negative_bore_centers = [large_cut_center, small_cut_center];

// Vertical solid section
module round_section(center_xy, r, zmin, zmax) {
    translate([center_xy[0], center_xy[1], (zmin + zmax) / 2])
        cylinder(h = zmax - zmin, r = r, center = true);
}

// Circular axial cutter between two shoulder-referenced planes
module axial_cut(center_xy, r, z1, z2, grow = eps) {
    zlo = min(z1, z2) - grow;
    zhi = max(z1, z2) + grow;
    translate([center_xy[0], center_xy[1], (zlo + zhi) / 2])
        cylinder(h = zhi - zlo, r = r, center = true);
}

// Annular axial cutter
module annular_cut(center_xy, r_inner, r_outer, z1, z2) {
    difference() {
        axial_cut(center_xy, r_outer, z1, z2, eps);
        axial_cut(center_xy, r_inner, z1, z2, eps * 2);
    }
}

// Main attached circular solids
module main_body() {
    union() {
        round_section(upper_lobe_center, main_radius, -solid_reach_negative, solid_reach_positive);
        round_section(second_lobe_center, main_radius, -solid_reach_negative, solid_reach_positive);
    }
}

// All shoulder-referenced voids
module all_cuts() {
    union() {
        // Positive-side circular removals
        axial_cut(large_cut_center, positive_large_cut_radius, shoulder_z, shoulder_z + positive_cut_reach);
        axial_cut(small_cut_center, positive_small_cut_radius, shoulder_z, shoulder_z + positive_cut_reach);

        // Negative-side central circular removals
        for (c = negative_bore_centers)
            axial_cut(c, negative_center_cut_radius, shoulder_z, shoulder_z - negative_center_cut_reach);

        // Negative-side annular recesses
        annular_cut(large_cut_center, negative_recess_inner_radius, negative_recess_outer_radius_large,
                    shoulder_z, shoulder_z - negative_recess_reach);
        annular_cut(small_cut_center, negative_recess_inner_radius, negative_recess_outer_radius_small,
                    shoulder_z, shoulder_z - negative_recess_reach);
    }
}

// Final model
difference() {
    main_body();
    all_cuts();
}