// ==========================================
// Parameters
// ==========================================
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;
base_end_radius = base_width / 2;

hole_radius = 0.05;
hole1_x = 0.125;
hole2_x = 0.625;
hole_y = 0.125;

upright_length = 0.35;
upright_width = 0.2;
upright_x_start = 0.2;
upright_y_start = 0.025;
upright_height = 0.2;
upright_top_z = base_thickness + upright_height;

cap_rise = upright_width / 2;

passage_radius = 0.05;
passage_y = 0.125;
passage_z = 0.3;
passage_x_start = 0.2;
passage_length = 0.444;

relief_x_start = 0.255;
relief_length = 0.24;
relief_y_start = 0.025;
relief_z_bottom = 0.18;
relief_z_top = 0.45;
relief_radius = (relief_z_top - relief_z_bottom) / 2;
relief_z_center = (relief_z_top + relief_z_bottom) / 2;

$fn = 100;

// ==========================================
// Model
// ==========================================
difference() {
    union() {
        // Base: obround slab with rounded ends
        linear_extrude(height = base_thickness)
        hull() {
            translate([base_end_radius, base_end_radius, 0])
                circle(r = base_end_radius);
            translate([base_length - base_end_radius, base_end_radius, 0])
                circle(r = base_end_radius);
        }

        // Lower upright: rectangular block on base top
        translate([upright_x_start, upright_y_start, base_thickness])
            cube([upright_length, upright_width, upright_height]);

        // Rounded cap: semicircular profile over upright footprint
        intersection() {
            // Full cylinder along x-axis centered at upright top
            translate([upright_x_start, upright_y_start + upright_width / 2, upright_top_z])
                rotate([0, 90, 0])
                cylinder(r = cap_rise, h = upright_length, $fn = 100);
            // Keep only the upper semicircular half
            translate([0, 0, upright_top_z])
                cube([base_length, base_width, cap_rise + 0.001]);
        }
    }

    // Two vertical through holes in base
    translate([hole1_x, hole_y, -0.01])
        cylinder(r = hole_radius, h = base_thickness + 0.02, $fn = 100);
    translate([hole2_x, hole_y, -0.01])
        cylinder(r = hole_radius, h = base_thickness + 0.02, $fn = 100);

    // Horizontal through-passage through upright along length direction
    translate([passage_x_start, passage_y, passage_z])
        rotate([0, 90, 0])
        cylinder(r = passage_radius, h = passage_length, $fn = 100);

    // Rounded upper relief: horizontal cylinder from front side of upright
    translate([relief_x_start, relief_y_start + relief_radius, relief_z_center])
        rotate([0, 90, 0])
        cylinder(r = relief_radius, h = relief_length, $fn = 100);
}