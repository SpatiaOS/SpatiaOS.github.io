// === Main Base Obround Slab Parameters ===
base_length = 0.75;
base_width = 0.25;
base_height = 0.1;

// === Through-Hole Parameters ===
hole_radius = 0.05;
hole_y = 0.125;           // from front edge
hole_x1 = 0.125;          // first hole from left edge
hole_x2 = 0.625;          // second hole from left edge

// === Lower Upright Parameters ===
upright_length = 0.35;
upright_width = 0.2;
upright_height = 0.2;
upright_x_offset = 0.2;   // from both length ends
upright_y_offset = 0.025; // from both front/back edges

// === Rounded Cap Parameters ===
cap_radius = 0.1;          // semicircular profile radius (width/2)
cap_rise = 0.1;            // rise above upright top
crown_height = 0.4;        // crown above base underside

// === Horizontal Passage Parameters ===
passage_radius = 0.05;
passage_y = 0.125;         // center from front edge
passage_z_min = 0.25;
passage_z_max = 0.35;
passage_x_start = 0.2;     // starts at upright left face
passage_reach = 0.444;     // reach along length direction

// === Upper Relief Parameters ===
relief_length = 0.24;
relief_x_clearance = 0.255; // clearance to both base ends
relief_y_reach = 0.299;     // transverse reach from front position
relief_y_start = 0.025;     // front position from base front
relief_z_min = 0.18;
relief_z_max = 0.45;

// === Resolution ===
$fn = 100;

// === Derived Dimensions ===
obround_radius = base_width / 2;
upright_x1 = upright_x_offset;
upright_x2 = base_length - upright_x_offset;
upright_y1 = upright_y_offset;
upright_y2 = base_width - upright_y_offset;
upright_z_top = base_height + upright_height;
passage_z_center = (passage_z_min + passage_z_max) / 2;
passage_length = passage_reach + 1;
relief_x1 = relief_x_clearance;
relief_x2 = base_length - relief_x_clearance;
relief_y_end = relief_y_start + relief_y_reach;
relief_z_center = (relief_z_min + relief_z_max) / 2;
relief_radius = relief_y_reach / 2;

// === Main Assembly ===
difference() {
    union() {
        // 1. Main obround base slab
        obround_base();

        // 2. Lower upright
        translate([upright_x1, upright_y1, base_height])
            cube([upright_length, upright_width, upright_height]);

        // 3. Rounded cap over upright
        translate([upright_x1, 0, upright_z_top])
            rounded_cap(upright_length, upright_y1, upright_y2, cap_radius);
    }

    // 4. Two vertical through-holes in base
    translate([hole_x1, hole_y, -0.5])
        cylinder(h = base_height + 1, r = hole_radius);
    translate([hole_x2, hole_y, -0.5])
        cylinder(h = base_height + 1, r = hole_radius);

    // 5. Horizontal circular through-passage in upright
    translate([-0.5, passage_y, passage_z_center])
        rotate([0, 90, 0])
            cylinder(h = passage_length, r = passage_radius);

    // 6. Rounded upper relief from front side
    translate([relief_x1, 0, 0])
        linear_extrude(height = relief_length)
            relief_profile(relief_y_start, relief_z_center, relief_radius);
}

// === Module: Obround Base ===
module obround_base() {
    linear_extrude(height = base_height)
        hull() {
            translate([obround_radius, obround_radius])
                circle(r = obround_radius);
            translate([base_length - obround_radius, obround_radius])
                circle(r = obround_radius);
        }
}

// === Module: Rounded Cap (semicircular profile extruded along length) ===
module rounded_cap(length, y1, y2, r) {
    y_center = (y1 + y2) / 2;
    translate([0, y_center, 0])
        rotate([0, 90, 0])
            linear_extrude(height = length)
                intersection() {
                    translate([0, -y_center])
                        square([r, base_width]);
                    circle(r = r);
                }
}

// === Module: Relief Profile (semicircle for front-side cut) ===
module relief_profile(y_start, z_center, r) {
    translate([y_start + r, z_center])
        intersection() {
            translate([-r - r, -r])
                square([r, 2 * r]);
            circle(r = r);
        }
}