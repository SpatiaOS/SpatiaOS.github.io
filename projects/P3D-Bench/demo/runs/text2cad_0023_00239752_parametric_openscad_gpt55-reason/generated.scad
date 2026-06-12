// Parameters
$fn = 96;
eps = 0.0001;

// Base
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;
base_extrude_depth = 0.0288;

// Lengthwise rib pair
rib_pair_span_x = 0.162037;
rib_pair_span_y = base_width;
rib_edge_offset = 0.0635;
rib_pair_x0 = (base_length - rib_pair_span_x) / 2;
rib_width_x = base_extrude_depth;
rib_gap_x = rib_pair_span_x - 2 * rib_width_x;
rib_rise = 0.017308;
rib_extrude_depth = 0.0173;
rib_overlap = eps;

// Stepped circular cuts
cut_top_z = base_extrude_depth;
top_cut_overlap = max(eps, base_height - cut_top_z + eps);
bottom_cut_overlap = eps;

upper_recess_depth = 0.0231;
upper_recess_bottom_z = cut_top_z - upper_recess_depth;

deep_cut_depth = 0.1442;
deep_cut_bottom_z = cut_top_z - deep_cut_depth;

deep_opening_radius_scale = 0.60;

circular_features = [
    [0.0352, 0.7072, 0.013],
    [0.1433, 0.0577, 0.0173],
    [0.2538, 0.7072, 0.013]
];

// Base solid
module base_plate() {
    cube([base_length, base_width, base_height], center=false);
}

// One full-width lengthwise rib
module lengthwise_rib(x0) {
    translate([x0, 0, base_height - rib_overlap])
        cube([rib_width_x, rib_pair_span_y, rib_rise + rib_overlap], center=false);
}

// Two separate ribs inside the paired footprint
module rib_pair() {
    lengthwise_rib(rib_pair_x0);
    lengthwise_rib(rib_pair_x0 + rib_width_x + rib_gap_x);
}

// Uncut solid body
module solid_body() {
    union() {
        base_plate();
        rib_pair();
    }
}

// One stepped circular removed feature
module stepped_circular_cutter(x0, y0, recess_r) {
    through_r = recess_r * deep_opening_radius_scale;

    union() {
        // Upper circular recess: z 0.0057 to 0.0288
        translate([x0, y0, upper_recess_bottom_z])
            cylinder(h=upper_recess_depth + top_cut_overlap, r=recess_r, center=false);

        // Deeper aligned cut: z -0.1154 to 0.0288
        translate([x0, y0, deep_cut_bottom_z - bottom_cut_overlap])
            cylinder(h=deep_cut_depth + top_cut_overlap + bottom_cut_overlap, r=through_r, center=false);
    }
}

// All circular feature cutters
module circular_cutters() {
    union() {
        for (f = circular_features)
            stepped_circular_cutter(f[0], f[1], f[2]);
    }
}

// Main model
difference() {
    solid_body();
    circular_cutters();
}