// Parameters
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;
base_end_radius = base_width / 2;

hole_radius = 0.05;
hole_front_offset = 0.125;
hole1_left = 0.125;
hole2_left = 0.625;

upright_length = 0.35;
upright_width = 0.2;
upright_height = 0.2;
upright_left = 0.2;
upright_front = 0.025;

cap_radius = 0.1;
cap_length = upright_length;

passage_radius = 0.05;
passage_y = 0.125;
passage_z = 0.3;
passage_start_x = 0.2;
passage_length = 0.444;

relief_left = 0.255;
relief_front = 0.025;
relief_bottom_z = 0.18;
relief_length = 0.24;
relief_reach = 0.299;
relief_height = 0.27;

$fn = 100;

// Base obround slab
module base() {
    linear_extrude(height = base_thickness)
        hull() {
            translate([base_end_radius, base_width / 2])
                circle(r = base_end_radius);
            translate([base_length - base_end_radius, base_width / 2])
                circle(r = base_end_radius);
        }
}

// Lower upright block
module upright() {
    translate([upright_left, upright_front, base_thickness])
        cube([upright_length, upright_width, upright_height]);
}

// Rounded cap over upright
module cap() {
    intersection() {
        translate([upright_left, upright_front + upright_width / 2, base_thickness + upright_height])
            rotate([0, 90, 0])
            cylinder(h = cap_length, r = cap_radius);
        translate([upright_left, upright_front, base_thickness + upright_height])
            cube([cap_length, upright_width, cap_radius]);
    }
}

// Vertical through holes in base
module base_holes() {
    for (x = [hole1_left, hole2_left])
        translate([x, hole_front_offset, -1])
            cylinder(h = base_thickness + 2, r = hole_radius);
}

// Horizontal through passage along length
module length_passage() {
    translate([passage_start_x, passage_y, passage_z])
        rotate([0, 90, 0])
        cylinder(h = passage_length, r = passage_radius);
}

// Front upper relief pocket
module front_relief() {
    translate([relief_left, relief_front, relief_bottom_z])
        cube([relief_length, relief_reach, relief_height]);
}

// Assembly
difference() {
    union() {
        base();
        upright();
        cap();
    }
    base_holes();
    length_passage();
    front_relief();
}