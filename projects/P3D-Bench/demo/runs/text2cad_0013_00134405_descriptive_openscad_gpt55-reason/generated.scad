$fn = 128;

// Parameters (mm)
outer_diameter = 120;
rim_inner_diameter = 94;
center_bore_diameter = 22;
collar_outer_diameter = 42;

outer_ring_thickness = 6;
collar_thickness = 4;
rib_web_thickness = 3;

collar_top_setdown = 0.6;
rib_web_top_setdown = 1.2;

rib_count = 8;
rib_width_mid_radius = 8;
window_inner_margin = 2.5;
window_outer_margin = 3;
window_corner_radius = 2.2;
joint_overlap = 0.8;
window_arc_steps = 12;

// Derived dimensions
outer_radius = outer_diameter / 2;
rim_inner_radius = rim_inner_diameter / 2;
center_bore_radius = center_bore_diameter / 2;
collar_outer_radius = collar_outer_diameter / 2;

web_inner_radius = collar_outer_radius - joint_overlap;
web_outer_radius = rim_inner_radius + joint_overlap;

window_inner_radius = collar_outer_radius + window_inner_margin;
window_outer_radius = rim_inner_radius - window_outer_margin;
window_mid_radius = (window_inner_radius + window_outer_radius) / 2;

rib_pitch_deg = 360 / rib_count;
rib_angle_deg = 2 * asin(rib_width_mid_radius / (2 * window_mid_radius));
window_angle_deg = rib_pitch_deg - rib_angle_deg;
window_phase_deg = rib_pitch_deg / 2;

outer_ring_bottom_z = 0;
collar_top_z = outer_ring_thickness - collar_top_setdown;
collar_bottom_z = collar_top_z - collar_thickness;
rib_web_top_z = outer_ring_thickness - rib_web_top_setdown;
rib_web_bottom_z = rib_web_top_z - rib_web_thickness;

// 2D annulus
module annulus_2d(outer_r, inner_r) {
    difference() {
        circle(r=outer_r);
        circle(r=inner_r);
    }
}

// Arc point helper
function arc_points(r, a0, a1, steps) =
    [for (i = [0 : steps])
        [r * cos(a0 + (a1 - a0) * i / steps),
         r * sin(a0 + (a1 - a0) * i / steps)]
    ];

// 2D annular sector window
module annular_sector_2d(inner_r, outer_r, angle_deg) {
    polygon(points=concat(
        arc_points(outer_r, -angle_deg / 2, angle_deg / 2, window_arc_steps),
        arc_points(inner_r, angle_deg / 2, -angle_deg / 2, window_arc_steps)
    ));
}

// Rounded through-window
module rounded_window_2d(inner_r, outer_r, angle_deg, corner_r) {
    offset(r=corner_r)
        offset(delta=-corner_r)
            annular_sector_2d(inner_r, outer_r, angle_deg);
}

// Extrude a tier at a defined Z height
module extrude_layer(bottom_z, part_h) {
    translate([0, 0, bottom_z])
        linear_extrude(height=part_h, center=false, convexity=10)
            children();
}

// Main heavy outer rim
module outer_annular_rim() {
    extrude_layer(outer_ring_bottom_z, outer_ring_thickness)
        annulus_2d(outer_radius, rim_inner_radius);
}

// Hollow center collar
module center_hollow_collar() {
    extrude_layer(collar_bottom_z, collar_thickness)
        annulus_2d(collar_outer_radius, center_bore_radius);
}

// Slotted rib web; material between windows forms radial ribs
module rib_window_web_2d() {
    difference() {
        annulus_2d(web_outer_radius, web_inner_radius);

        for (i = [0 : rib_count - 1]) {
            rotate([0, 0, window_phase_deg + i * rib_pitch_deg])
                rounded_window_2d(
                    window_inner_radius,
                    window_outer_radius,
                    window_angle_deg,
                    window_corner_radius
                );
        }
    }
}

// Shallow stepped rib tier
module stepped_rib_web() {
    extrude_layer(rib_web_bottom_z, rib_web_thickness)
        rib_window_web_2d();
}

// Main model
union() {
    outer_annular_rim();
    stepped_rib_web();
    center_hollow_collar();
}