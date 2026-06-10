// Parameters for CAD Model
$fn = 100; // High resolution for smooth curves
epsilon = 0.01; // Small overlap for clean boolean operations

// Base Slab Parameters
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;
base_radius = base_width / 2; // 0.125
base_center_left_x = 0.125;
base_center_right_x = 0.625;
base_center_y = 0.125;

// Base Holes Parameters
hole_radius = 0.05;

// Lower Upright Parameters
upright_length = 0.35;
upright_width = 0.2;
upright_height = 0.2;
upright_x_offset = 0.2;
upright_y_offset = 0.025;
upright_z_offset = base_thickness; // 0.1

// Rounded Cap Parameters
cap_radius = 0.1; // Semicircular profile spanning 0.2 width
cap_length = upright_length; // 0.35
cap_x = upright_x_offset; // 0.2
cap_y = upright_y_offset + cap_radius; // 0.125
cap_z = upright_z_offset + upright_height; // 0.3

// Upright Through-Passage Parameters
passage_radius = 0.05;
passage_x_start = 0.2;
passage_length = 0.444;
passage_y = 0.125;
passage_z = 0.3; // Centered in vertical band 0.25 to 0.35

// Rounded Upper Relief Parameters
relief_width = 0.24; // Lengthwise span
relief_radius = relief_width / 2; // 0.12
relief_x_center = 0.255 + relief_radius; // 0.375
relief_y_start = 0.025;
relief_y_length = 0.299; // Transverse reach
relief_z_bottom = 0.18;
relief_z_center = relief_z_bottom + relief_radius; // 0.30
relief_z_top = 0.45;

// --- Modules ---

// 1. Main base slab (obround shape)
module base_slab() {
    hull() {
        translate([base_center_left_x, base_center_y, 0])
            cylinder(h=base_thickness, r=base_radius);
        translate([base_center_right_x, base_center_y, 0])
            cylinder(h=base_thickness, r=base_radius);
    }
}

// 2. Vertical through openings in the base
module base_holes() {
    translate([base_center_left_x, base_center_y, -epsilon])
        cylinder(h=base_thickness + 2*epsilon, r=hole_radius);
    
    translate([base_center_right_x, base_center_y, -epsilon])
        cylinder(h=base_thickness + 2*epsilon, r=hole_radius);
}

// 3. Rectangular lower upright
module lower_upright() {
    translate([upright_x_offset, upright_y_offset, upright_z_offset])
        cube([upright_length, upright_width, upright_height]);
}

// 4. Solid rounded cap over the upright
// Modeled as a full cylinder; the bottom half merges into the upright
module rounded_cap() {
    translate([cap_x, cap_y, cap_z])
        rotate([0, 90, 0])
        cylinder(h=cap_length, r=cap_radius);
}

// 5. Horizontal circular through-passage
module upright_passage() {
    translate([passage_x_start - epsilon, passage_y, passage_z])
        rotate([0, 90, 0])
        cylinder(h=passage_length + 2*epsilon, r=passage_radius);
}

// 6. Rounded upper relief (U-shaped cut extruded along Y axis)
module upper_relief() {
    translate([0, relief_y_start - epsilon, 0])
        rotate([-90, 0, 0]) // Rotates the 2D XZ profile to extrude along Y
        linear_extrude(height=relief_y_length + 2*epsilon)
        hull() {
            // Semicircular bottom of the relief
            translate([relief_x_center, relief_z_center])
                circle(r=relief_radius);
            // Straight vertical section extending to the top
            translate([relief_x_center - relief_radius, relief_z_center])
                square([relief_width, relief_z_top - relief_z_center + epsilon]);
        }
}

// --- Main Model Assembly ---

difference() {
    // Additive geometry
    union() {
        base_slab();
        lower_upright();
        rounded_cap();
    }
    
    // Subtractive geometry
    base_holes();
    upright_passage();
    upper_relief();
}