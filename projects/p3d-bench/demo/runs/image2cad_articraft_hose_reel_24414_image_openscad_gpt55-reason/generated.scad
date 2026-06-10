// Parametric hose reel assembly inspired by the reference image.
// Units: millimeters
// Coordinate convention:
//   X = reel/spool axis, front flange on +X
//   Y = lateral depth direction
//   Z = vertical direction

// -----------------------------------------------------------------------------
// Global resolution and tolerances
// -----------------------------------------------------------------------------
$fn = 96;
eps = 0.05;

flange_fn     = 128;
core_fn       = 96;
hose_fn       = 18;
connector_fn  = 48;
wheel_fn      = 64;

// -----------------------------------------------------------------------------
// Preview colors
// -----------------------------------------------------------------------------
body_color       = [0.64, 0.64, 0.66, 1.0];
hose_color       = [0.46, 0.46, 0.48, 1.0];
dark_metal_color = [0.20, 0.20, 0.22, 1.0];

// -----------------------------------------------------------------------------
// Main reel / spool parameters
// -----------------------------------------------------------------------------
flange_radius      = 70;
flange_thickness   = 10;
flange_bevel       = 2.0;
flange_rim_height  = 1.2;
flange_rim_width   = 4.5;

spool_gap          = 86;
front_flange_x     =  spool_gap/2 + flange_thickness/2;
rear_flange_x      = -spool_gap/2 - flange_thickness/2;
front_face_x       = front_flange_x + flange_thickness/2;
rear_face_x        = rear_flange_x  - flange_thickness/2;

core_radius        = 36.0;
core_length        = spool_gap + 2*eps;
core_bevel         = 1.5;

// Wound hose represented as a helical tube between the two flanges.
winding_radius         = 40.0;
winding_hose_radius    = 3.8;
winding_turns          = 12;
winding_length         = spool_gap + flange_thickness - 2*eps;
winding_steps_per_turn = 12;
winding_phase          = 205;

// Front face fasteners
front_bolt_radius    = 31.5;
front_bolt_angles    = [35, 130, 220, 315];
bolt_head_radius     = 3.7;
bolt_head_height     = 2.3;
bolt_head_bevel      = 0.45;
bolt_slot_width      = 1.0;
bolt_slot_depth      = 1.0;

// -----------------------------------------------------------------------------
// External hose / pipe routing parameters
// -----------------------------------------------------------------------------
free_hose_radius = 4.0;

// Rear/left riser hose route
left_riser_x        = rear_flange_x - 9;
left_riser_y        = -flange_radius - 38;
left_riser_bottom_z = -42;
left_riser_top_z    = 154;

left_hose_points = [
    [rear_flange_x - 1, -flange_radius*0.45, -flange_radius*0.52],
    [rear_flange_x - 3, -flange_radius*0.70, -flange_radius*0.82],
    [left_riser_x,      left_riser_y + 25,   -flange_radius*1.08],
    [left_riser_x,      left_riser_y + 9,    -58],
    [left_riser_x,      left_riser_y,        left_riser_bottom_z],
    [left_riser_x,      left_riser_y,        left_riser_top_z]
];

// Front/lower drop hose route
front_drop_x        = front_face_x - 3.0;
front_drop_y        = -8;
front_drop_top_z    = -flange_radius + 8;
front_drop_bottom_z = -113;

front_drop_points = [
    [front_drop_x, front_drop_y, front_drop_top_z],
    [front_drop_x, front_drop_y, front_drop_bottom_z]
];

// Couplings and collars
small_bevel = 0.8;

rear_coupling_len      = 22;
rear_coupling_r        = 6.0;
rear_coupling_overlap  = 3.0;
rear_hex_len           = 8;
rear_hex_r             = 8.0;

riser_bottom_collar_h        = 16;
riser_bottom_collar_r        = 6.6;
riser_bottom_collar_z_offset = -2;

riser_top_collar_h        = 18;
riser_top_collar_r        = 6.8;
riser_top_collar_z_offset = 4;

front_port_extra         = 10;
front_port_r             = 6.0;
front_top_collar_h       = 16;
front_top_collar_r       = 6.8;
front_top_collar_z_offset = -4;

front_lower_collar_h        = 13;
front_lower_collar_r        = 6.5;
front_lower_collar_z_offset = 2;

// -----------------------------------------------------------------------------
// Upper valve / head parameters
// -----------------------------------------------------------------------------
top_base_collar_h = 12;
top_base_collar_r = 7.0;

top_neck_h        = 10;
top_neck_r        = 5.2;

top_transition_h  = 6;
top_body_h        = 22;
top_body_r        = 10.0;
top_body_facets   = 8;

top_hex_h         = 8;
top_hex_r         = 12.0;

top_cap_h         = 4;
top_cap_r         = 9.0;

top_side_port_len     = 20;
top_side_port_r       = 5.5;
top_side_overlap      = 2.0;

top_wheel_r           = 9.0;
top_wheel_thickness   = 4.0;
top_wheel_hub_r       = 3.2;
top_wheel_hole_r      = 1.5;

handwheel_hole_count         = 6;
handwheel_hole_radius_factor = 0.55;
hex_rotation_z               = 30;

// -----------------------------------------------------------------------------
// Lower valve / nozzle parameters
// -----------------------------------------------------------------------------
bottom_valve_z = -145;

bottom_body_r          = 10.0;
bottom_body_scale      = [0.95, 1.05, 1.15];

bottom_upper_tube_z    = 24;
bottom_upper_tube_h    = 14;
bottom_upper_tube_r    = 5.5;

bottom_hex_z           = 15;
bottom_hex_h           = 8;
bottom_hex_r           = 8.0;

bottom_lower_neck_z    = 7;
bottom_lower_neck_h    = 10;
bottom_lower_neck_r    = 6.5;

bottom_side_cap_len     = 12;
bottom_side_cap_r       = 7.5;
bottom_side_cap_z       = 0;
bottom_side_overlap     = 2.0;
bottom_side_screw_h     = 2.4;
bottom_side_screw_r     = 2.4;
bottom_side_screw_inset = 1.2;

bottom_lever_length     = 32;
bottom_lever_width      = 4.0;
bottom_lever_thickness  = 2.5;
bottom_lever_overlap    = 3.0;
bottom_lever_end_len    = 8;
bottom_lever_z          = 2.5;

lever_end_width_scale     = 1.6;
lever_end_thickness_scale = 1.2;

bottom_nozzle_length   = 36;
bottom_nozzle_top_r    = 7.5;
bottom_nozzle_tip_r    = 3.0;
bottom_nozzle_overlap  = 2.0;

bottom_tip_h           = 6;
bottom_tip_r           = 2.6;

// -----------------------------------------------------------------------------
// Basic helper modules
// -----------------------------------------------------------------------------

// Cylinder along global X axis.
module cylinder_x(h, r, center=true, fn=64) {
    rotate([0, 90, 0])
        cylinder(h=h, r=r, center=center, $fn=fn);
}

// Cylinder along global Y axis.
module cylinder_y(h, r, center=true, fn=64) {
    rotate([90, 0, 0])
        cylinder(h=h, r=r, center=center, $fn=fn);
}

// Chamfered cylinder along Z axis.
module chamfered_cylinder_z(h, r, bevel, fn=96) {
    b = min(bevel, min(h/2 - eps, r - eps));

    union() {
        cylinder(
            h=max(eps, h - 2*b),
            r=r,
            center=true,
            $fn=fn
        );

        translate([0, 0, h/2 - b/2])
            cylinder(
                h=b,
                r1=r,
                r2=max(eps, r - b),
                center=true,
                $fn=fn
            );

        translate([0, 0, -h/2 + b/2])
            cylinder(
                h=b,
                r1=max(eps, r - b),
                r2=r,
                center=true,
                $fn=fn
            );
    }
}

// Chamfered cylinder along X axis.
module chamfered_cylinder_x(h, r, bevel, fn=96) {
    rotate([0, 90, 0])
        chamfered_cylinder_z(h, r, bevel, fn);
}

// Chamfered cylinder along Y axis.
module chamfered_cylinder_y(h, r, bevel, fn=96) {
    rotate([90, 0, 0])
        chamfered_cylinder_z(h, r, bevel, fn);
}

// Annular ring with axis along X, used as raised circular flange rims.
module annular_ring_x(h, outer_r, inner_r, fn=96) {
    difference() {
        cylinder_x(h, outer_r, center=true, fn=fn);
        cylinder_x(h + 2*eps, inner_r, center=true, fn=fn);
    }
}

// Tube swept along a polyline using overlapping rounded capsule segments.
module polyline_tube(points, r, fn=18) {
    union() {
        for (i = [0 : len(points) - 2]) {
            hull() {
                translate(points[i])
                    sphere(r=r, $fn=fn);
                translate(points[i + 1])
                    sphere(r=r, $fn=fn);
            }
        }
    }
}

// Helical tube around the global X axis.
module helix_tube_x(length, radius, tube_r, turns, steps_per_turn=12, phase=0, fn=18) {
    steps = max(3, floor(turns * steps_per_turn));

    pts = [
        for (i = [0 : steps])
            let (
                t = i / steps,
                a = phase + 360 * turns * t
            )
            [
                -length/2 + length*t,
                radius*cos(a),
                radius*sin(a)
            ]
    ];

    polyline_tube(pts, tube_r, fn);
}

// Simple vertical collar centered at a point.
module collar_z(pos, h, r, bevel=small_bevel, fn=connector_fn) {
    translate(pos)
        chamfered_cylinder_z(h, r, bevel, fn);
}

// Button-head screw with a shallow slot, axis along X.
module button_screw_x(head_h, head_r, bevel, slot_w, slot_depth) {
    difference() {
        chamfered_cylinder_x(head_h, head_r, bevel, fn=32);

        translate([head_h/2 - slot_depth/2 + eps, 0, 0])
            cube(
                [slot_depth + 2*eps, 2*head_r + eps, slot_w],
                center=true
            );
    }
}

// Perforated handwheel / side knob with axis along Y.
module handwheel_y(r, thickness, hub_r, hole_r, fn=64) {
    union() {
        difference() {
            cylinder_y(thickness, r, center=true, fn=fn);

            for (a = [0 : 360/handwheel_hole_count : 360 - 360/handwheel_hole_count]) {
                translate([
                    r*handwheel_hole_radius_factor*cos(a),
                    0,
                    r*handwheel_hole_radius_factor*sin(a)
                ])
                    cylinder_y(thickness + 2*eps, hole_r, center=true, fn=16);
            }
        }

        cylinder_y(thickness + 1.0, hub_r, center=true, fn=32);
    }
}

// Flat lever extending along Y, used on the lower valve.
module flat_lever_y(length, width, thickness, end_len) {
    union() {
        cube([width, length, thickness], center=true);

        translate([0, -length/2 - end_len/2 + eps, 0])
            cube(
                [
                    width*lever_end_width_scale,
                    end_len,
                    thickness*lever_end_thickness_scale
                ],
                center=true
            );
    }
}

// -----------------------------------------------------------------------------
// Reel modules
// -----------------------------------------------------------------------------

// Circular flange with one raised outer rim.
// outer_side =  1 places rim on +X face,
// outer_side = -1 places rim on -X face.
module flanged_disc(outer_side=1) {
    color(body_color) {
        union() {
            chamfered_cylinder_x(
                flange_thickness,
                flange_radius,
                flange_bevel,
                fn=flange_fn
            );

            translate([
                outer_side * (flange_thickness/2 + flange_rim_height/2 - eps),
                0,
                0
            ])
                annular_ring_x(
                    flange_rim_height,
                    flange_radius - flange_bevel*0.25,
                    flange_radius - flange_rim_width,
                    fn=flange_fn
                );
        }
    }
}

// Front flange includes visible fasteners on the circular face.
module front_flange() {
    union() {
        flanged_disc(outer_side=1);

        for (ang = front_bolt_angles) {
            translate([
                flange_thickness/2 + bolt_head_height/2 - eps,
                front_bolt_radius*cos(ang),
                front_bolt_radius*sin(ang)
            ])
                color(dark_metal_color)
                    button_screw_x(
                        bolt_head_height,
                        bolt_head_radius,
                        bolt_head_bevel,
                        bolt_slot_width,
                        bolt_slot_depth
                    );
        }
    }
}

// Rear flange is mostly plain in the reference view.
module rear_flange() {
    flanged_disc(outer_side=-1);
}

// Main spool body: rear flange, front flange, central drum, and coiled hose.
module reel_body() {
    union() {
        translate([rear_flange_x, 0, 0])
            rear_flange();

        translate([front_flange_x, 0, 0])
            front_flange();

        color(body_color)
            chamfered_cylinder_x(
                core_length,
                core_radius,
                core_bevel,
                fn=core_fn
            );

        color(hose_color)
            helix_tube_x(
                winding_length,
                winding_radius,
                winding_hose_radius,
                winding_turns,
                winding_steps_per_turn,
                winding_phase,
                fn=hose_fn
            );
    }
}

// -----------------------------------------------------------------------------
// Coupling and valve modules
// -----------------------------------------------------------------------------

// Short side coupling where the rear hose leaves the reel.
module rear_reel_coupling() {
    port = left_hose_points[0];

    color(body_color) {
        union() {
            translate([
                port[0],
                port[1] - rear_coupling_len/2 + rear_coupling_overlap,
                port[2]
            ])
                chamfered_cylinder_y(
                    rear_coupling_len,
                    rear_coupling_r,
                    small_bevel,
                    fn=connector_fn
                );

            translate([
                port[0],
                port[1] - rear_coupling_len + rear_coupling_overlap - rear_hex_len/2 + eps,
                port[2]
            ])
                chamfered_cylinder_y(
                    rear_hex_len,
                    rear_hex_r,
                    small_bevel,
                    fn=6
                );
        }
    }
}

// Front drop fitting at the lower front face of the reel.
module front_drop_coupling() {
    port_len = abs(front_face_x - front_drop_x) + front_port_extra;
    port_x   = (front_face_x + front_drop_x)/2;

    color(body_color) {
        union() {
            translate([port_x, front_drop_y, front_drop_top_z])
                chamfered_cylinder_x(
                    port_len,
                    front_port_r,
                    small_bevel,
                    fn=connector_fn
                );

            translate([
                front_drop_x,
                front_drop_y,
                front_drop_top_z + front_top_collar_z_offset
            ])
                chamfered_cylinder_z(
                    front_top_collar_h,
                    front_top_collar_r,
                    small_bevel,
                    fn=connector_fn
                );
        }
    }
}

// Upper valve / head at the top of the left riser.
module upper_valve() {
    body_center_z = top_base_collar_h
                  + top_neck_h
                  + top_transition_h
                  + top_body_h/2
                  - 3*eps;

    hex_center_z = body_center_z
                 + top_body_h/2
                 + top_hex_h/2
                 - eps;

    cap_center_z = hex_center_z
                 + top_hex_h/2
                 + top_cap_h/2
                 - eps;

    side_port_center_y = -top_side_port_len/2 + top_side_overlap;
    wheel_center_y     = -top_side_port_len + top_side_overlap - top_wheel_thickness/2 + eps;

    color(body_color) {
        union() {
            // Lower collar on top of the vertical riser.
            translate([0, 0, top_base_collar_h/2 - eps])
                chamfered_cylinder_z(
                    top_base_collar_h,
                    top_base_collar_r,
                    small_bevel,
                    fn=connector_fn
                );

            // Narrow neck pipe.
            translate([0, 0, top_base_collar_h + top_neck_h/2 - 2*eps])
                chamfered_cylinder_z(
                    top_neck_h,
                    top_neck_r,
                    small_bevel,
                    fn=connector_fn
                );

            // Conical transition into the valve body.
            translate([
                0,
                0,
                top_base_collar_h + top_neck_h + top_transition_h/2 - 2*eps
            ])
                cylinder(
                    h=top_transition_h,
                    r1=top_neck_r,
                    r2=top_body_r,
                    center=true,
                    $fn=connector_fn
                );

            // Faceted main valve body.
            translate([0, 0, body_center_z])
                chamfered_cylinder_z(
                    top_body_h,
                    top_body_r,
                    1.2,
                    fn=top_body_facets
                );

            // Side port and handwheel.
            translate([0, side_port_center_y, body_center_z])
                chamfered_cylinder_y(
                    top_side_port_len,
                    top_side_port_r,
                    small_bevel,
                    fn=connector_fn
                );

            translate([0, wheel_center_y, body_center_z])
                handwheel_y(
                    top_wheel_r,
                    top_wheel_thickness,
                    top_wheel_hub_r,
                    top_wheel_hole_r,
                    fn=wheel_fn
                );

            // Hexagonal bonnet and small top cap.
            translate([0, 0, hex_center_z])
                rotate([0, 0, hex_rotation_z])
                    chamfered_cylinder_z(
                        top_hex_h,
                        top_hex_r,
                        small_bevel,
                        fn=6
                    );

            translate([0, 0, cap_center_z])
                rotate([0, 0, hex_rotation_z])
                    chamfered_cylinder_z(
                        top_cap_h,
                        top_cap_r,
                        0.5,
                        fn=6
                    );
        }
    }
}

// Lower valve and tapered spray/nozzle assembly.
module lower_valve() {
    nozzle_center_z = -bottom_body_r*bottom_body_scale[2]
                    - bottom_nozzle_length/2
                    + bottom_nozzle_overlap;

    tip_center_z = nozzle_center_z
                 - bottom_nozzle_length/2
                 - bottom_tip_h/2
                 + eps;

    lever_positive_end_y = -bottom_side_cap_len
                         + bottom_side_overlap
                         + bottom_lever_overlap;

    lever_center_y = lever_positive_end_y - bottom_lever_length/2;

    color(body_color) {
        union() {
            // Rounded main valve body.
            scale(bottom_body_scale)
                sphere(r=bottom_body_r, $fn=48);

            // Vertical stacked fittings above valve body.
            translate([0, 0, bottom_upper_tube_z])
                chamfered_cylinder_z(
                    bottom_upper_tube_h,
                    bottom_upper_tube_r,
                    small_bevel,
                    fn=connector_fn
                );

            translate([0, 0, bottom_hex_z])
                rotate([0, 0, hex_rotation_z])
                    chamfered_cylinder_z(
                        bottom_hex_h,
                        bottom_hex_r,
                        small_bevel,
                        fn=6
                    );

            translate([0, 0, bottom_lower_neck_z])
                chamfered_cylinder_z(
                    bottom_lower_neck_h,
                    bottom_lower_neck_r,
                    small_bevel,
                    fn=connector_fn
                );

            // Side cap for the small control lever.
            translate([
                0,
                -bottom_side_cap_len/2 + bottom_side_overlap,
                bottom_side_cap_z
            ])
                chamfered_cylinder_y(
                    bottom_side_cap_len,
                    bottom_side_cap_r,
                    small_bevel,
                    fn=connector_fn
                );

            translate([
                0,
                -bottom_side_cap_len + bottom_side_overlap - bottom_side_screw_inset,
                bottom_side_cap_z
            ])
                color(dark_metal_color)
                    chamfered_cylinder_y(
                        bottom_side_screw_h,
                        bottom_side_screw_r,
                        0.35,
                        fn=24
                    );

            // Thin lever projecting from the side.
            translate([0, lever_center_y, bottom_lever_z])
                flat_lever_y(
                    bottom_lever_length,
                    bottom_lever_width,
                    bottom_lever_thickness,
                    bottom_lever_end_len
                );

            // Downward tapered nozzle.
            translate([0, 0, nozzle_center_z])
                cylinder(
                    h=bottom_nozzle_length,
                    r1=bottom_nozzle_tip_r,
                    r2=bottom_nozzle_top_r,
                    center=true,
                    $fn=connector_fn
                );

            translate([0, 0, tip_center_z])
                chamfered_cylinder_z(
                    bottom_tip_h,
                    bottom_tip_r,
                    0.4,
                    fn=connector_fn
                );
        }
    }
}

// -----------------------------------------------------------------------------
// Final assembly
// -----------------------------------------------------------------------------
module hose_reel_assembly() {
    union() {
        // Central reel with flanges and wound hose.
        reel_body();

        // Rear outlet, curved hose, and tall left riser.
        rear_reel_coupling();

        color(hose_color)
            polyline_tube(left_hose_points, free_hose_radius, fn=hose_fn);

        color(body_color) {
            collar_z(
                [
                    left_riser_x,
                    left_riser_y,
                    left_riser_bottom_z + riser_bottom_collar_h/2 + riser_bottom_collar_z_offset
                ],
                riser_bottom_collar_h,
                riser_bottom_collar_r,
                small_bevel,
                connector_fn
            );

            collar_z(
                [
                    left_riser_x,
                    left_riser_y,
                    left_riser_top_z - riser_top_collar_h/2 + riser_top_collar_z_offset
                ],
                riser_top_collar_h,
                riser_top_collar_r,
                small_bevel,
                connector_fn
            );
        }

        translate([left_riser_x, left_riser_y, left_riser_top_z - eps])
            upper_valve();

        // Front lower drop from the reel to the lower valve/nozzle.
        front_drop_coupling();

        color(hose_color)
            polyline_tube(front_drop_points, free_hose_radius, fn=hose_fn);

        color(body_color)
            collar_z(
                [
                    front_drop_x,
                    front_drop_y,
                    front_drop_bottom_z - front_lower_collar_h/2 + front_lower_collar_z_offset
                ],
                front_lower_collar_h,
                front_lower_collar_r,
                small_bevel,
                connector_fn
            );

        translate([front_drop_x, front_drop_y, bottom_valve_z])
            lower_valve();
    }
}

hose_reel_assembly();