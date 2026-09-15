// Overall dimensions, millimeters
base_length = 0.740822;
base_width = 0.672842;
base_height = 0.171797;
main_extrusion_depth = 0.1718;
upper_pad_depth = 0.1512;
underside_continuation_depth = 0.0206;

// Central opening
opening_center = [0.3687, 0.4283];
opening_radius = 0.2165;

// Shallow circular lip
lip_center = [0.3688, 0.4282];
lip_radius = 0.2165;
lip_height = 0.020616;
lip_wall = 0.0100;                  // Inferred radial wall

// Straight crossing web
web_left = 0.3434;
web_front = 0.2119;
web_length = 0.025368;
web_width = 0.432873;
web_height = 0.171797;

// Eccentric round pad
pad_left = 0.3927;
pad_front = 0.3476;
pad_length = 0.2000;
pad_width = 0.1984;
pad_axis = [0.4796, 0.4282];
pad_radius = 0.0754;

// Circular recess
recess_center = [0.4796, 0.4283];
recess_radius = 0.0754;
recess_lower_band = -0.1512;
recess_upper_band = 0.0206;
recess_continuation_start = -0.0206;
recess_continuation_depth = 0.1718;

// Inferred rounded perimeter and lobe slots
rear_lobe_radius = 0.1200;
front_lobe_radius = 0.0900;
underside_inset = 0.0100;
rear_slot_length = 0.1100;
rear_slot_width = 0.0240;
rear_slot_edge_offset = 0.1050;
rear_slot_front = 0.5500;
rear_slot_angle = 65;
front_slot_length = 0.1040;
front_slot_width = 0.0240;
front_slot_front = 0.1050;

// Resolution and Boolean overlap
epsilon = 0.0001;
$fn = 128;

// Derived dimensions
body_height = min(base_height, main_extrusion_depth);
upper_pad_bottom = body_height - upper_pad_depth;
lower_pad_height = min(
    underside_continuation_depth,
    upper_pad_bottom + epsilon
);
feature_datum = body_height - recess_upper_band;
lip_inner_radius = lip_radius - lip_wall;
pad_center = [
    pad_left + pad_length / 2,
    pad_front + pad_width / 2
];

// Rounded wedge footprint
module wedge_profile() {
    hull() {
        translate([base_length / 2, front_lobe_radius])
            circle(r = front_lobe_radius);

        translate([rear_lobe_radius, base_width - rear_lobe_radius])
            circle(r = rear_lobe_radius);

        translate([
            base_length - rear_lobe_radius,
            base_width - rear_lobe_radius
        ])
            circle(r = rear_lobe_radius);
    }
}

// Rounded slot profile
module capsule_profile(length, width) {
    hull() {
        translate([-(length - width) / 2, 0])
            circle(d = width);
        translate([(length - width) / 2, 0])
            circle(d = width);
    }
}

// Full-height cutting cylinder
module through_cylinder(position, radius) {
    translate([position[0], position[1], -epsilon])
        cylinder(h = body_height + 2 * epsilon, r = radius);
}

// Broad upper pad and inset underside continuation
module stepped_base() {
    difference() {
        union() {
            translate([0, 0, upper_pad_bottom])
                linear_extrude(height = upper_pad_depth)
                    wedge_profile();

            linear_extrude(height = lower_pad_height)
                offset(delta = -underside_inset)
                    wedge_profile();
        }

        through_cylinder(opening_center, opening_radius);
    }
}

// Annular upper lip
module circular_lip() {
    translate([lip_center[0], lip_center[1], body_height - lip_height])
        linear_extrude(height = lip_height)
            difference() {
                circle(r = lip_radius);
                circle(r = lip_inner_radius);
            }
}

// Full-depth central web
module crossing_web() {
    translate([web_left, web_front, 0])
        cube([web_length, web_width, min(web_height, body_height)]);
}

// Eccentric pad with the specified bounding span
module small_round_pad() {
    linear_extrude(height = body_height)
        union() {
            translate(pad_center)
                scale([pad_length / 2, pad_width / 2])
                    circle(r = 1);

            translate(pad_axis)
                circle(r = pad_radius);
        }
}

// Circular recess and downward continuation
module circular_recess() {
    translate([
        recess_center[0],
        recess_center[1],
        feature_datum + recess_lower_band - epsilon
    ])
        cylinder(
            h = recess_upper_band - recess_lower_band + 2 * epsilon,
            r = recess_radius
        );

    translate([
        recess_center[0],
        recess_center[1],
        feature_datum + recess_continuation_start
            - recess_continuation_depth - epsilon
    ])
        cylinder(
            h = recess_continuation_depth + 2 * epsilon,
            r = recess_radius
        );
}

// Through slots near the outer lobes
module lobe_slots() {
    translate([0, 0, -epsilon])
        linear_extrude(height = body_height + 2 * epsilon) {
            translate([rear_slot_edge_offset, rear_slot_front])
                rotate(rear_slot_angle)
                    capsule_profile(rear_slot_length, rear_slot_width);

            translate([
                base_length - rear_slot_edge_offset,
                rear_slot_front
            ])
                rotate(-rear_slot_angle)
                    capsule_profile(rear_slot_length, rear_slot_width);

            translate([base_length / 2, front_slot_front])
                capsule_profile(front_slot_length, front_slot_width);
        }
}

// Final solid
difference() {
    union() {
        stepped_base();
        circular_lip();
        crossing_web();
        small_round_pad();
    }

    circular_recess();
    lobe_slots();
}