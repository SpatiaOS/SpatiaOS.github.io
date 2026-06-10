// ==============================
// Parameters (all dimensions in inches)
// ==============================
$fn = 64; // Smooth curve resolution

// Base dimensions
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;
base_end_radius = base_width / 2;

// Base mounting holes
hole_radius = 0.05;
hole_y_offset = 0.125;
hole_x_positions = [0.125, 0.625];

// Lower upright dimensions
upright_length = 0.35;
upright_width = 0.2;
upright_x_offset = 0.2;
upright_y_offset = 0.025;
upright_height = 0.2;

// Rounded cap dimensions
cap_rise = 0.1;

// Horizontal through passage
passage_radius = 0.05;
passage_y_center = 0.125;
passage_z_center = 0.3;
passage_length = 0.444;
passage_x_start = upright_x_offset;

// Upper relief cut
relief_span_x = 0.24;
relief_x_clearance = 0.255;
relief_y_start = 0.025;
relief_y_reach = 0.299;
relief_z_min = 0.18;
relief_z_max = 0.45;
relief_radius = (relief_z_max - relief_z_min) / 2;

// ==============================
// Helper Modules
// ==============================
module obround_slab(length, width, thickness) {
    // Obround shape with rounded ends along length axis
    end_r = width / 2;
    linear_extrude(height=thickness) {
        union() {
            square([length - width, width], center=false);
            translate([end_r, end_r]) circle(r=end_r);
            translate([length - end_r, end_r]) circle(r=end_r);
        }
    }
}

module semicircular_cap(length, width, rise) {
    // Extruded semicircular cap matching rectangular footprint
    w_half = width / 2;
    linear_extrude(length=length, direction=[1, 0, 0]) {
        // 2D semicircle profile in Y-Z plane
        polygon(points = concat(
            [ [0, 0], [width, 0] ],
            [ for (a = [0:180/$fn:180]) [ w_half + w_half * cos(a * pi/180), rise * sin(a * pi/180) ] ]
        ));
    }
}

// ==============================
// Main Model Assembly
// ==============================
difference() {
    union() {
        // Base obround slab
        obround_slab(base_length, base_width, base_thickness);

        // Lower upright block
        translate([upright_x_offset, upright_y_offset, base_thickness])
            cube([upright_length, upright_width, upright_height]);

        // Rounded upper cap
        translate([upright_x_offset, upright_y_offset, base_thickness + upright_height])
            semicircular_cap(upright_length, upright_width, cap_rise);
    }

    // Cut base mounting holes
    for (x = hole_x_positions) {
        translate([x, hole_y_offset, base_thickness/2])
            cylinder(h=base_thickness + 0.2, r=hole_radius, center=true);
    }

    // Cut horizontal through passage
    translate([passage_x_start + passage_length/2, passage_y_center, passage_z_center])
        rotate([0, 90, 0])
            cylinder(h=passage_length, r=passage_radius, center=true);

    // Cut upper front relief
    translate([
        relief_x_clearance + relief_span_x/2,
        relief_y_start + relief_y_reach/2,
        relief_z_min + relief_radius
    ])
        rotate([0, 90, 0])
            cylinder(h=relief_span_x, r=relief_radius, center=true);
}