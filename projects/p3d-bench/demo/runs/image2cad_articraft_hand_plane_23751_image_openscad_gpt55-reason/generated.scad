// Vintage Stanley-style router plane inspired by the reference image.
// Units: millimeters.  Geometry is an approximate, parametric recreation.

// -----------------------------
// Global resolution and helpers
// -----------------------------
$fn = 96;
eps = 0.05;
join_overlap = 0.08;

// -----------------------------
// Colors for preview rendering
// -----------------------------
metal_color       = [0.62, 0.62, 0.62, 1.0];
knob_color        = [0.76, 0.76, 0.76, 1.0];
dark_metal_color  = [0.08, 0.08, 0.08, 1.0];
highlight_color   = [0.86, 0.86, 0.86, 1.0];

// -----------------------------
// Main base plate parameters
// -----------------------------
base_length = 240;
base_width = 78;
base_body_width = 70;
base_body_length = base_length - 2 * 30;
base_thickness = 7;
base_corner_radius = 10;

base_end_lobe_radius = 30;
handle_center_x = 92;

base_center_bulge_length = 86;
base_center_bulge_width = 84;

front_scallop_radius = 18;
side_scallop_radius = 11;
rear_scallop_radius = 14;

edge_lip_width = 4.0;
edge_lip_height = 1.8;

top_rib_width = 3.0;
top_rib_height = 1.2;

// -----------------------------
// Base holes and countersinks
// -----------------------------
screw_hole_diameter = 4.2;
counterbore_diameter = 10.5;
screw_hole_ring_outer_diameter = 15;
screw_hole_ring_height = 0.9;

screw_hole_positions = [
    [-62, -22],
    [-54,  22],
    [ 54, -22],
    [ 64,  20],
    [  0,  25]
];

// -----------------------------
// Front arched STANLEY bridge
// -----------------------------
arch_x = -25;
arch_y = -base_width / 2 + 6;
arch_outer_radius = 32;
arch_inner_radius = 21;
arch_thickness = 12;

arch_text_radius = (arch_outer_radius + arch_inner_radius) / 2;
arch_letter_size = 7.2;
arch_letter_raise = 0.75;
arch_text_start_angle = 146;
arch_text_angle_step = -16;

// Base throat/opening under the arch and cutter
throat_front_length = 2 * arch_inner_radius + 14;
throat_front_width = 40;
throat_cutter_length = 40;
throat_cutter_width = 16;

// -----------------------------
// Handle and knob parameters
// -----------------------------
handle_pad_diameter = 50;
handle_pad_height = 3.2;

handle_pad_ring_outer_diameter = 56;
handle_pad_ring_inner_diameter = 38;
handle_pad_ring_height = 2.0;

handle_pedestal_cyl_height = 5.0;
handle_pedestal_lower_diameter = 31;
handle_pedestal_taper_height = 8.5;
handle_pedestal_upper_diameter = 18;

handle_neck_height = 6.5;
handle_neck_diameter = 16;

knob_height = 58;
knob_diameter = 39;
knob_neck_diameter = handle_neck_diameter;
knob_slot_length = 16;
knob_slot_width = 5.6;
knob_slot_depth = 3.0;
knob_slot_angle = 24;
knob_seam_z_ratio = 0.54;
knob_seam_major_radius = knob_diameter * 0.43;
knob_seam_minor_radius = 0.45;

// -----------------------------
// Central cutter tower parameters
// -----------------------------
tower_x = 22;
tower_y = 0;

central_boss_diameter = 56;
central_boss_height = 7;
central_ring_outer_diameter = 62;
central_ring_inner_diameter = 42;
central_ring_height = 3;

central_slot_offset_x = -8;
central_slot_length = 31;
central_slot_width = 14;

tower_post_base_z = base_thickness + central_boss_height + central_ring_height;

guide_post_offset_x = -13;
guide_post_spacing = 18;
guide_post_diameter = 8.5;
guide_post_rib_width = 1.2;
guide_post_height = 50;
guide_cap_diameter = 14;
guide_cap_height = 4;

guide_bridge_width = guide_post_diameter + 8;
guide_bridge_depth = guide_post_spacing + guide_cap_diameter;
guide_bridge_height = 4.5;

thread_offset_x = 9;
thread_core_diameter = 5.4;
thread_major_diameter = 7.3;
thread_pitch = 2.4;
thread_ridge_height = 1.05;
thread_height = 62;

vertical_wheel_diameter = 34;
vertical_wheel_height = 5;
vertical_wheel_z = 36;
vertical_wheel_teeth = 28;

top_washer_diameter = 14;
top_washer_height = 2;
top_nut_diameter = 13;
top_nut_height = 6;
top_pin_diameter = 7;
top_pin_height = 4;

// -----------------------------
// Side thumb screw on cutter tower
// -----------------------------
side_screw_x = tower_x + 22;
side_screw_y_start = central_boss_diameter / 2 - 1;
side_screw_z = tower_post_base_z + 20;

side_hub_length = 9;
side_hub_diameter = 12;

side_screw_length = 34;
side_screw_core_diameter = 4.5;
side_screw_major_diameter = 5.8;
side_screw_pitch = 2.2;
side_screw_ridge_height = 0.9;

side_thumb_wheel_diameter = 23;
side_thumb_wheel_thickness = 5;
side_thumb_hole_diameter = 2.2;
side_thumb_hole_count = 12;

// -----------------------------
// Front depth-stop post and screw
// -----------------------------
depth_post_x = -26;
depth_post_y = 1;

depth_post_base_diameter = 24;
depth_post_taper_height = 13;
depth_post_shaft_diameter = 11;
depth_post_shaft_height = 50;
depth_post_cap_diameter = 14;
depth_post_cap_height = 4;

depth_side_screw_y_start = depth_post_y - depth_post_base_diameter / 2 + 4;
depth_side_screw_z = base_thickness + 16;
depth_side_hub_length = 6;
depth_side_hub_diameter = 9;

depth_side_screw_length = 16;
depth_side_screw_core_diameter = 3.4;
depth_side_screw_major_diameter = 4.6;
depth_side_screw_pitch = 1.8;
depth_side_screw_ridge_height = 0.7;

depth_thumb_wheel_diameter = 16;
depth_thumb_wheel_thickness = 4;
depth_thumb_hole_diameter = 1.6;
depth_thumb_hole_count = 8;

// -----------------------------
// Cutter blade and cast struts
// -----------------------------
cutter_x = tower_x - 8;
cutter_y = 0;
cutter_post_width = 6;
cutter_post_depth = 12;
cutter_post_height = 45;

cutter_blade_angle = -34;
cutter_slant_length = 38;
cutter_tip_height = 6;

cast_strut_diameter = 7.5;

// -----------------------------
// Raised labels on base
// -----------------------------
label_font = "Liberation Sans:style=Bold";
label_plate_height = 0.45;
label_frame_width = 1.25;
label_frame_height = 0.55;
label_text_height = 0.65;
label_text_size = 5.4;

// -----------------------------
// 2D helper shapes
// -----------------------------
module rounded_rect_2d(w, h, r) {
    offset(r = r)
        square([max(w - 2 * r, eps), max(h - 2 * r, eps)], center = true);
}

module rounded_slot_2d(len, wid) {
    hull() {
        translate([-(len - wid) / 2, 0])
            circle(d = wid);
        translate([ (len - wid) / 2, 0])
            circle(d = wid);
    }
}

module rectangular_frame_2d(w, h, border) {
    difference() {
        square([w, h], center = true);
        square([max(w - 2 * border, eps), max(h - 2 * border, eps)], center = true);
    }
}

// -----------------------------
// 3D helper shapes
// -----------------------------
module ring_cylinder(h, d_outer, d_inner) {
    difference() {
        cylinder(h = h, d = d_outer);
        translate([0, 0, -eps])
            cylinder(h = h + 2 * eps, d = d_inner);
    }
}

module torus(major_r, minor_r) {
    rotate_extrude(convexity = 10)
        translate([major_r, 0])
            circle(r = minor_r);
}

module rounded_bar(p1, p2, d) {
    hull() {
        translate(p1)
            sphere(d = d);
        translate(p2)
            sphere(d = d);
    }
}

// -----------------------------
// Decorative base footprint
// -----------------------------
module base_footprint_2d() {
    difference() {
        union() {
            // Long main body with rounded corners.
            rounded_rect_2d(base_body_length, base_body_width, base_corner_radius);

            // Circular end lobes supporting the two knobs.
            translate([-handle_center_x, 0])
                circle(r = base_end_lobe_radius);
            translate([ handle_center_x, 0])
                circle(r = base_end_lobe_radius);

            // Slightly wider central casting around the cutter opening.
            rounded_rect_2d(base_center_bulge_length, base_center_bulge_width, base_corner_radius + 4);
        }

        // Exterior scallops and reliefs seen on the casting perimeter.
        translate([0, -base_width / 2 - 3])
            circle(r = front_scallop_radius);
        translate([-62, -base_width / 2 - 4])
            circle(r = side_scallop_radius);
        translate([62, base_width / 2 + 4])
            circle(r = side_scallop_radius);
        translate([0, base_width / 2 + 4])
            circle(r = rear_scallop_radius);
    }
}

// Opening through the base under the cutter and arched bridge.
module base_throat_2d() {
    union() {
        translate([arch_x, arch_y + 8])
            rounded_slot_2d(throat_front_length, throat_front_width);

        translate([tower_x - 13, 0])
            rounded_slot_2d(throat_cutter_length, throat_cutter_width);
    }
}

// Raised ribs, panel outlines, and circular details on the top face.
module top_cast_ribs_2d() {
    union() {
        // Long cast ribs along both side panels.
        for (yy = [-(base_width / 2 - 9), (base_width / 2 - 9)])
            translate([0, yy])
                rounded_slot_2d(base_body_length - 14, top_rib_width);

        // Raised circular ribs around handle pads.
        for (x = [-handle_center_x, handle_center_x])
            translate([x, 0])
                difference() {
                    circle(r = handle_pad_diameter / 2 + 4);
                    circle(r = handle_pad_diameter / 2 + 1);
                }

        // Rectangular inset-style panel lines on left and right wings.
        for (xc = [-58, 58])
            translate([xc, 0])
                difference() {
                    rounded_rect_2d(54, base_body_width - 17, 7);
                    rounded_rect_2d(
                        54 - 2 * top_rib_width,
                        base_body_width - 17 - 2 * top_rib_width,
                        max(7 - top_rib_width, 1)
                    );
                }
    }
}

// Raised rings around countersunk screw holes.
module screw_hole_bosses() {
    for (p = screw_hole_positions)
        translate([p[0], p[1], base_thickness - join_overlap])
            ring_cylinder(
                h = screw_hole_ring_height + join_overlap,
                d_outer = screw_hole_ring_outer_diameter,
                d_inner = counterbore_diameter
            );
}

// Through cuts and screw holes for the base.
module base_cutouts_3d() {
    cut_h = base_thickness + edge_lip_height + top_rib_height + screw_hole_ring_height + 6;

    // Large front throat and cutter slot.
    translate([0, 0, -eps])
        linear_extrude(height = cut_h + 2 * eps, convexity = 10)
            base_throat_2d();

    // Mounting holes with cylindrical counterbores.
    for (p = screw_hole_positions) {
        translate([p[0], p[1], -eps])
            cylinder(h = cut_h + 2 * eps, d = screw_hole_diameter);

        translate([p[0], p[1], base_thickness - 0.9])
            cylinder(h = cut_h, d = counterbore_diameter);
    }
}

// Main cast base with lip, ribs, holes, and central throat.
module base_plate() {
    color(metal_color)
    difference() {
        union() {
            // Solid base slab.
            linear_extrude(height = base_thickness, convexity = 10)
                base_footprint_2d();

            // Raised perimeter rim.
            translate([0, 0, base_thickness - join_overlap])
                linear_extrude(height = edge_lip_height + join_overlap, convexity = 10)
                    difference() {
                        base_footprint_2d();
                        offset(delta = -edge_lip_width)
                            base_footprint_2d();
                    }

            // Low raised decorative top ribs.
            translate([0, 0, base_thickness - join_overlap])
                linear_extrude(height = top_rib_height + join_overlap, convexity = 10)
                    top_cast_ribs_2d();

            screw_hole_bosses();
        }

        base_cutouts_3d();
    }
}

// -----------------------------
// Egg-shaped handle knob
// -----------------------------
module egg_knob() {
    difference() {
        // Revolved profile approximating the oval wooden/metal knob.
        rotate_extrude(convexity = 10)
            polygon(points = [
                [0, 0],
                [knob_neck_diameter / 2, 0],
                [knob_diameter * 0.31, knob_height * 0.07],
                [knob_diameter * 0.44, knob_height * 0.20],
                [knob_diameter * 0.50, knob_height * 0.43],
                [knob_diameter * 0.46, knob_height * 0.67],
                [knob_diameter * 0.35, knob_height * 0.86],
                [knob_diameter * 0.25, knob_height * 0.96],
                [knob_diameter * 0.20, knob_height],
                [0, knob_height]
            ]);

        // Oval screwdriver slot/recess on top.
        translate([0, 0, knob_height - knob_slot_depth])
            rotate([0, 0, knob_slot_angle])
                linear_extrude(height = knob_slot_depth + 2 * eps, convexity = 10)
                    rounded_slot_2d(knob_slot_length, knob_slot_width);
    }

    // Fine circumferential seam/groove line visible around the knob.
    color(dark_metal_color)
        translate([0, 0, knob_height * knob_seam_z_ratio])
            torus(knob_seam_major_radius, knob_seam_minor_radius);
}

// Complete handle assembly on one end of the base.
module handle_assembly(xpos, ypos = 0) {
    knob_z =
        base_thickness +
        handle_pad_height +
        handle_pad_ring_height +
        handle_pedestal_cyl_height +
        handle_pedestal_taper_height +
        handle_neck_height -
        join_overlap;

    translate([xpos, ypos, 0]) {
        color(metal_color) {
            // Circular pad rising from base.
            translate([0, 0, base_thickness - join_overlap])
                cylinder(h = handle_pad_height + join_overlap, d = handle_pad_diameter);

            // Raised annular ring on the pad.
            translate([0, 0, base_thickness + handle_pad_height - join_overlap])
                ring_cylinder(
                    h = handle_pad_ring_height + join_overlap,
                    d_outer = handle_pad_ring_outer_diameter,
                    d_inner = handle_pad_ring_inner_diameter
                );

            // Short pedestal and tapered neck below the knob.
            translate([0, 0, base_thickness + handle_pad_height + handle_pad_ring_height - join_overlap])
                cylinder(h = handle_pedestal_cyl_height + join_overlap, d = handle_pedestal_lower_diameter);

            translate([0, 0, base_thickness + handle_pad_height + handle_pad_ring_height + handle_pedestal_cyl_height - join_overlap])
                cylinder(
                    h = handle_pedestal_taper_height + join_overlap,
                    r1 = handle_pedestal_lower_diameter / 2,
                    r2 = handle_pedestal_upper_diameter / 2
                );

            translate([0, 0, base_thickness + handle_pad_height + handle_pad_ring_height + handle_pedestal_cyl_height + handle_pedestal_taper_height - join_overlap])
                cylinder(h = handle_neck_height + join_overlap, d = handle_neck_diameter);
        }

        color(knob_color)
            translate([0, 0, knob_z])
                egg_knob();
    }
}

// -----------------------------
// Arched front bridge with raised lettering
// -----------------------------
module arch_profile_2d(outer_r, inner_r, step = 5) {
    polygon(points = concat(
        [for (a = [0 : step : 180]) [outer_r * cos(a), outer_r * sin(a)]],
        [for (a = [180 : -step : 0]) [inner_r * cos(a), inner_r * sin(a)]]
    ));
}

module arch_letters() {
    letters = ["S", "T", "A", "N", "L", "E", "Y"];

    for (i = [0 : len(letters) - 1]) {
        a = arch_text_start_angle + i * arch_text_angle_step;

        translate([
            arch_x + arch_text_radius * cos(a),
            arch_y - arch_thickness / 2 + arch_letter_raise * 0.20,
            base_thickness - join_overlap + arch_text_radius * sin(a)
        ])
            rotate([90, 0, 0])
                rotate([0, 0, a - 90])
                    linear_extrude(height = arch_letter_raise, convexity = 10)
                        text(
                            letters[i],
                            size = arch_letter_size,
                            font = label_font,
                            halign = "center",
                            valign = "center"
                        );
    }
}

module front_arch_bridge() {
    color(metal_color) {
        // Main semi-circular cast bridge, extruded front-to-back.
        translate([arch_x, arch_y, base_thickness - join_overlap])
            rotate([90, 0, 0])
                linear_extrude(height = arch_thickness, center = true, convexity = 10)
                    arch_profile_2d(arch_outer_radius, arch_inner_radius);

        // Slightly enlarged feet to visually merge with the base casting.
        for (sx = [-1, 1])
            translate([
                arch_x + sx * (arch_outer_radius + arch_inner_radius) / 2,
                arch_y,
                base_thickness + 1.5
            ])
                cube([
                    arch_outer_radius - arch_inner_radius + 5,
                    arch_thickness + 3,
                    3.4
                ], center = true);
    }

    color(dark_metal_color)
        arch_letters();
}

// -----------------------------
// Threaded rods, knurled discs, and thumb wheels
// -----------------------------
module threaded_rod(h, core_d, major_d, pitch, ridge_h) {
    union() {
        cylinder(h = h, d = core_d);

        for (zz = [pitch / 2 : pitch : h - pitch / 2])
            translate([0, 0, zz - ridge_h / 2])
                cylinder(h = ridge_h, d = major_d);
    }
}

module knurled_disc(d, h, teeth = 24) {
    union() {
        cylinder(h = h, d = d);

        for (a = [0 : 360 / teeth : 359])
            rotate([0, 0, a])
                translate([d / 2, 0, h / 2])
                    cube([1.8, 3.2, h], center = true);
    }
}

module drilled_thumb_wheel(d, thickness, hole_d, hole_count) {
    union() {
        difference() {
            cylinder(h = thickness, d = d, center = true);

            // Outer ring of lightening holes.
            for (a = [0 : 360 / hole_count : 359])
                translate([d * 0.32 * cos(a), d * 0.32 * sin(a), 0])
                    cylinder(h = thickness + 2 * eps, d = hole_d, center = true);

            // Smaller inner ring of holes.
            for (a = [360 / (2 * hole_count) : 360 / hole_count : 359])
                translate([d * 0.20 * cos(a), d * 0.20 * sin(a), 0])
                    cylinder(h = thickness + 2 * eps, d = hole_d * 0.72, center = true);
        }

        // Knurled-looking perimeter teeth.
        for (a = [0 : 360 / 18 : 359])
            rotate([0, 0, a])
                translate([d / 2, 0, 0])
                    cube([1.6, 2.8, thickness], center = true);

        // Central hub.
        cylinder(h = thickness + 1.4, d = d * 0.28, center = true);
    }
}

module fluted_post(h, d, rib_w) {
    union() {
        cylinder(h = h, d = d);

        for (a = [0 : 90 : 270])
            rotate([0, 0, a])
                translate([d / 2, 0, h / 2])
                    cube([rib_w, rib_w * 2.4, h], center = true);
    }
}

// -----------------------------
// Central cutter tower assembly
// -----------------------------
module central_boss_base() {
    translate([tower_x, tower_y, base_thickness - join_overlap])
        difference() {
            union() {
                cylinder(h = central_boss_height + join_overlap, d = central_boss_diameter);

                translate([0, 0, central_boss_height - join_overlap])
                    ring_cylinder(
                        h = central_ring_height + join_overlap,
                        d_outer = central_ring_outer_diameter,
                        d_inner = central_ring_inner_diameter
                    );
            }

            // Slot through the boss for the cutter iron.
            translate([central_slot_offset_x, 0, -eps])
                linear_extrude(
                    height = central_boss_height + central_ring_height + 2 * join_overlap + 2 * eps,
                    convexity = 10
                )
                    rounded_slot_2d(central_slot_length, central_slot_width);
        }
}

module central_tower() {
    post_z = tower_post_base_z;
    guide_x = tower_x + guide_post_offset_x;
    thread_x = tower_x + thread_offset_x;

    color(metal_color) {
        central_boss_base();

        // Twin guide posts with small caps.
        for (py = [-guide_post_spacing / 2, guide_post_spacing / 2]) {
            translate([guide_x, py, post_z - join_overlap])
                fluted_post(
                    h = guide_post_height + join_overlap,
                    d = guide_post_diameter,
                    rib_w = guide_post_rib_width
                );

            translate([guide_x, py, post_z + guide_post_height - join_overlap])
                cylinder(h = guide_cap_height + join_overlap, d = guide_cap_diameter);
        }

        // Small bridge/collar connecting the guide posts near the top.
        translate([guide_x, 0, post_z + guide_post_height - guide_bridge_height / 2])
            cube([guide_bridge_width, guide_bridge_depth, guide_bridge_height], center = true);
    }

    // Central vertical threaded adjustment screw.
    color(dark_metal_color)
        translate([thread_x, tower_y, post_z - join_overlap])
            threaded_rod(
                h = thread_height + join_overlap,
                core_d = thread_core_diameter,
                major_d = thread_major_diameter,
                pitch = thread_pitch,
                ridge_h = thread_ridge_height
            );

    // Large knurled adjustment wheel.
    color(dark_metal_color)
        translate([thread_x, tower_y, post_z + vertical_wheel_z])
            knurled_disc(
                d = vertical_wheel_diameter,
                h = vertical_wheel_height,
                teeth = vertical_wheel_teeth
            );

    // Washer, hex nut, and small top pin.
    color(metal_color) {
        translate([thread_x, tower_y, post_z + thread_height - join_overlap])
            cylinder(h = top_washer_height + join_overlap, d = top_washer_diameter);

        translate([thread_x, tower_y, post_z + thread_height + top_washer_height - join_overlap])
            cylinder(h = top_nut_height + join_overlap, d = top_nut_diameter, $fn = 6);

        translate([thread_x, tower_y, post_z + thread_height + top_washer_height + top_nut_height - join_overlap])
            cylinder(h = top_pin_height + join_overlap, d = top_pin_diameter);
    }
}

// Horizontal side locking screw with perforated thumb wheel.
module side_thumb_screw() {
    color(metal_color) {
        // Hub emerging from the side of the central tower.
        translate([side_screw_x, side_screw_y_start - side_hub_length, side_screw_z])
            rotate([-90, 0, 0])
                cylinder(h = side_hub_length + join_overlap, d = side_hub_diameter);
    }

    color(dark_metal_color)
        translate([side_screw_x, side_screw_y_start - join_overlap, side_screw_z])
            rotate([-90, 0, 0])
                threaded_rod(
                    h = side_screw_length + join_overlap,
                    core_d = side_screw_core_diameter,
                    major_d = side_screw_major_diameter,
                    pitch = side_screw_pitch,
                    ridge_h = side_screw_ridge_height
                );

    color(metal_color) {
        // Washer just before the wheel.
        translate([side_screw_x, side_screw_y_start + side_screw_length - 2.0, side_screw_z])
            rotate([-90, 0, 0])
                cylinder(h = 3.0, d = 10);

        // Perforated side thumb wheel.
        translate([
            side_screw_x,
            side_screw_y_start + side_screw_length + side_thumb_wheel_thickness / 2 - join_overlap,
            side_screw_z
        ])
            rotate([-90, 0, 0])
                drilled_thumb_wheel(
                    d = side_thumb_wheel_diameter,
                    thickness = side_thumb_wheel_thickness,
                    hole_d = side_thumb_hole_diameter,
                    hole_count = side_thumb_hole_count
                );
    }
}

// -----------------------------
// Depth-stop post and small screw
// -----------------------------
module depth_stop_post() {
    color(metal_color)
        translate([depth_post_x, depth_post_y, 0]) {
            // Tapered base.
            translate([0, 0, base_thickness - join_overlap])
                cylinder(
                    h = depth_post_taper_height + join_overlap,
                    r1 = depth_post_base_diameter / 2,
                    r2 = depth_post_shaft_diameter / 2
                );

            // Smooth vertical post.
            translate([0, 0, base_thickness + depth_post_taper_height - join_overlap])
                cylinder(
                    h = depth_post_shaft_height + join_overlap,
                    d = depth_post_shaft_diameter
                );

            // Small top cap.
            translate([0, 0, base_thickness + depth_post_taper_height + depth_post_shaft_height - join_overlap])
                cylinder(
                    h = depth_post_cap_height + join_overlap,
                    d = depth_post_cap_diameter
                );
        }

    // Small side screw and miniature perforated wheel near the post base.
    color(metal_color)
        translate([depth_post_x, depth_side_screw_y_start + depth_side_hub_length, depth_side_screw_z])
            rotate([90, 0, 0])
                cylinder(h = depth_side_hub_length + join_overlap, d = depth_side_hub_diameter);

    color(dark_metal_color)
        translate([depth_post_x, depth_side_screw_y_start, depth_side_screw_z])
            rotate([90, 0, 0])
                threaded_rod(
                    h = depth_side_screw_length,
                    core_d = depth_side_screw_core_diameter,
                    major_d = depth_side_screw_major_diameter,
                    pitch = depth_side_screw_pitch,
                    ridge_h = depth_side_screw_ridge_height
                );

    color(metal_color)
        translate([
            depth_post_x,
            depth_side_screw_y_start - depth_side_screw_length - depth_thumb_wheel_thickness / 2,
            depth_side_screw_z
        ])
            rotate([90, 0, 0])
                drilled_thumb_wheel(
                    d = depth_thumb_wheel_diameter,
                    thickness = depth_thumb_wheel_thickness,
                    hole_d = depth_thumb_hole_diameter,
                    hole_count = depth_thumb_hole_count
                );
}

// -----------------------------
// Cutter iron and cast bracing
// -----------------------------
module cutter_blade_assembly() {
    color(dark_metal_color)
        union() {
            // Vertical cutter shank passing through the boss.
            translate([cutter_x, cutter_y, base_thickness + cutter_post_height / 2])
                cube([cutter_post_width, cutter_post_depth, cutter_post_height], center = true);

            // Angled cutter blade descending toward the throat.
            translate([cutter_x - 11, cutter_y, base_thickness + 11])
                rotate([0, cutter_blade_angle, 0])
                    cube([cutter_post_width, cutter_post_depth, cutter_slant_length], center = true);

            // Sharpened lower shoe/tip approximation.
            translate([cutter_x - 24, cutter_y, base_thickness - 1])
                rotate([0, cutter_blade_angle, 0])
                    cube([cutter_post_width + 2, cutter_post_depth + 2, cutter_tip_height], center = true);
        }
}

module cast_struts() {
    color(metal_color)
        union() {
            // Cast rib from front bridge toward central boss.
            rounded_bar(
                [arch_x + arch_inner_radius + 5, arch_y + arch_thickness / 2 - 1, base_thickness + 4],
                [tower_x - 18, -8, base_thickness + central_boss_height + 2],
                cast_strut_diameter
            );

            // Cast rib from opposite bridge foot toward the depth post.
            rounded_bar(
                [arch_x - arch_inner_radius - 2, arch_y + arch_thickness / 2 - 1, base_thickness + 4],
                [depth_post_x, depth_post_y, base_thickness + depth_post_taper_height],
                cast_strut_diameter * 0.85
            );
        }
}

// -----------------------------
// Raised base labels / nameplates
// -----------------------------
module base_label_plate(x, y, w, h, txt, rot = 0) {
    translate([x, y, base_thickness - join_overlap])
        rotate([0, 0, rot]) {
            color(dark_metal_color)
                linear_extrude(height = label_plate_height + join_overlap, convexity = 10)
                    square([w, h], center = true);

            color(highlight_color)
                translate([0, 0, label_plate_height - join_overlap / 2])
                    linear_extrude(height = label_frame_height + join_overlap, convexity = 10)
                        rectangular_frame_2d(w, h, label_frame_width);

            color(highlight_color)
                translate([0, 0, label_plate_height + label_frame_height - join_overlap])
                    linear_extrude(height = label_text_height + join_overlap, convexity = 10)
                        text(
                            txt,
                            size = label_text_size,
                            font = label_font,
                            halign = "center",
                            valign = "center"
                        );
        }
}

// -----------------------------
// Final assembled model
// -----------------------------
module router_plane_model() {
    union() {
        base_plate();

        // End handles.
        handle_assembly(-handle_center_x);
        handle_assembly( handle_center_x);

        // Front arched bridge with STANLEY lettering.
        front_arch_bridge();

        // Central cutter/tower system.
        cast_struts();
        central_tower();
        cutter_blade_assembly();
        side_thumb_screw();

        // Front depth-stop post and small adjustment wheel.
        depth_stop_post();

        // Cast-in labels on the base panels.
        base_label_plate(-42, -8, 31, 13, "No.71", 0);
        base_label_plate( 66,  8, 26, 13, "SW", 0);
    }
}

router_plane_model();