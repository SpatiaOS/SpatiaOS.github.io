// Parameters
base_length = 0.75;
base_width = 0.75;
base_height = 0.05625;
base_outer_radius = 0.375;
base_inner_radius = 0.3375;
base_center_x = 0.375;
base_center_y = 0.375;

collar_footprint = 0.15;
collar_outer_radius = collar_footprint / 2;
collar_inner_radius = 0.05; // Assumed inner radius
collar_offset = 0.3;
collar_height = 0.0468; // Total height from -0.0234 to 0.0234

rib_length = 0.618448;
rib_width = 0.521035;
rib_height = 0.028125;
rib_offset_left = 0.0658;
rib_offset_front = 0.0387;
rib_corner_radius = 0.005; // For rounding corners

$fn = 100; // Smooth circles

// Module for rounded rectangle
module rounded_rect(length, width, height, corner_r) {
    minkowski() {
        cube([length - 2*corner_r, width - 2*corner_r, height/2], center=true);
        cylinder(r=corner_r, h=height/2, center=true);
    }
}

// Main base annulus
translate([base_center_x, base_center_y, 0])
difference() {
    cylinder(h=base_height, r=base_outer_radius, center=true);
    cylinder(h=base_height+1, r=base_inner_radius, center=true);
}

// Central collar annulus
translate([base_center_x, base_center_y, 0])
difference() {
    cylinder(h=collar_height, r=collar_outer_radius, center=true);
    cylinder(h=collar_height+1, r=collar_inner_radius, center=true);
}

// Rib web (approximated as rounded rectangle)
rib_center_x = rib_offset_left + rib_length/2;
rib_center_y = rib_offset_front + rib_width/2;
translate([rib_center_x, rib_center_y, 0])
rounded_rect(rib_length, rib_width, rib_height, rib_corner_radius);