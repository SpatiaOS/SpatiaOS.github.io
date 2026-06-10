// Parameters
$fn = 96;
eps = 0.0005;

base_length = 0.75;
base_width = 0.21875;
base_height_declared = 0.28125;
main_extrusion_depth = 0.2812;
base_height = max(base_height_declared, main_extrusion_depth);

hole_radius = 0.0312;
hole1_x = 0.0717;
hole2_x = 0.6692;
hole_y = 0.0625;

cut_z_bottom = 0.1081;
cut_z_top = 0.1705;
cut_depth_nominal = 0.0625;
cut_depth = cut_z_top - cut_z_bottom;

arch_steps = 48;
flat_clearance = 0.002;
front_flat_depth = hole_y + hole_radius + flat_clearance;

pattern_envelope_length = (hole2_x + hole_radius) - (hole1_x - hole_radius);
pattern_envelope_width = 2 * hole_radius;

// Helpers
function clamp01(t) = min(1, max(0, t));
function arch_lift(t) = (1 - cos(180 * clamp01(t))) / 2;
function side_top_z(y) =
    y <= front_flat_depth
    ? cut_z_top
    : cut_z_top + (base_height - cut_z_top) *
      arch_lift((y - front_flat_depth) / (base_width - front_flat_depth));

function side_profile_points() =
    concat(
        [[0, 0], [base_width, 0], [base_width, base_height]],
        [for (i = [arch_steps - 1 : -1 : 0])
            let (
                t = i / arch_steps,
                y = front_flat_depth + t * (base_width - front_flat_depth)
            )
            [y, side_top_z(y)]
        ],
        [[0, cut_z_top]]
    );

// Extrude local Y-Z profile along global X
module extrude_along_x(len) {
    multmatrix([
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
    linear_extrude(height=len, convexity=10)
        children();
}

// Main arched base
module arched_base() {
    extrude_along_x(base_length)
        polygon(points=side_profile_points());
}

// One circular blind cut profile
module circular_blind_cut(xpos) {
    translate([xpos, hole_y, cut_z_bottom])
        cylinder(h=cut_depth + eps, r=hole_radius, center=false);
}

// Two separate circular profiles only
module two_circle_remove_feature() {
    circular_blind_cut(hole1_x);
    circular_blind_cut(hole2_x);
}

// Model
difference() {
    arched_base();
    two_circle_remove_feature();
}