// Parameters
base_length = 0.75;
base_width = 0.45;
base_height = 0.05625;
main_depth = 0.0562; // absolute reach of base-level opening from shoulder

// Central vertical axis
axis_x = 0.375;
axis_y = 0.225;

// Concentric radii
r_outer = 0.225;
r_outer_inner = 0.1875;
r_mid_outer = 0.0937;
r_mid_inner = 0.0562;
r_inner = 0.0562;

// Reach depths upward from shoulder datum
reach_outer = 0.1687;
reach_mid = 0.0937;
reach_inner = 0.075;

$fn = 100;

// Slot-like base footprint (stadium shape)
module slot_base(length, width, height) {
    r = width / 2;
    dx = (length - width) / 2;
    hull() {
        translate([-dx, 0, 0])
            cylinder(r = r, h = height);
        translate([dx, 0, 0])
            cylinder(r = r, h = height);
    }
}

// Annular ring (hollow boundary)
module annulus(outer_r, inner_r, h) {
    difference() {
        cylinder(r = outer_r, h = h);
        translate([0, 0, -0.001])
            cylinder(r = inner_r, h = h + 0.002);
    }
}

// Main assembly
union() {
    // Base with central concentric profile
    difference() {
        translate([axis_x, axis_y, 0])
            slot_base(base_length, base_width, base_height);

        // Base-level opening: annular groove between outer and inner lands
        translate([axis_x, axis_y, -0.001])
            annulus(r_outer_inner, r_mid_outer, base_height + 0.002);
    }

    // Coaxial outer annular collar
    translate([axis_x, axis_y, base_height])
        annulus(r_outer, r_outer_inner, reach_outer);

    // Smaller coaxial annular section
    translate([axis_x, axis_y, base_height])
        annulus(r_mid_outer, r_mid_inner, reach_mid);

    // Innermost solid circular section
    translate([axis_x, axis_y, base_height])
        cylinder(r = r_inner, h = reach_inner);
}