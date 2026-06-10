// Parametric CAD model
// Based on specified dimensions and geometry

// Parameters
$fn = 100;  // Smooth curved surfaces

// Base plate overall span
span_length = 0.75;
span_width  = 0.421875;
base_height = 0.191921;  // Lower base extrusion height from datum

// Left circular profile (axis and radius)
left_axis_x = 0.2109;
left_axis_y = 0.2109;
left_radius = 0.2109;

// Right circular concentric group
right_axis_x = 0.6094;
right_axis_y = 0.2109;
right_outer_radius = 0.1406;
right_inner_radius = 0.1055;   // opening radius

// Assumed inner hole radius for left circle (same as right inner)
inner_hole_radius = 0.1055;

// Taller upper circular section (left boss)
upper_section_height = 0.4424;   // from base datum

// Rectangular upright tab
tab_length = 0.041188;
tab_width  = 0.070313;
tab_height = 0.441346;           // from base datum
tab_left_offset  = 0.0703;       // x position
tab_front_offset = 0.1758;       // y position

// ---- 2D Profiles (used as cross sections) ----

// Outer shape of the lower base: hull of left solid circle and right outer circle
module outer_base_profile() {
    hull() {
        translate([left_axis_x, left_axis_y])
            circle(r = left_radius);
        translate([right_axis_x, right_axis_y])
            circle(r = right_outer_radius);
    }
}

// Inner cutout (combined slot and holes): hull of the two inner circles
module inner_cutout() {
    hull() {
        translate([left_axis_x, left_axis_y])
            circle(r = inner_hole_radius);
        translate([right_axis_x, right_axis_y])
            circle(r = inner_hole_radius);
    }
}

// ---- Solid components ----

// Lower base plate (extruded from 0 to base_height)
module lower_base() {
    linear_extrude(height = base_height)
    difference() {
        outer_base_profile();
        inner_cutout();
    }
}

// Upper circular boss (left side, taller)
module upper_circular_section() {
    linear_extrude(height = upper_section_height)
    difference() {
        // Outer circle of the left boss
        translate([left_axis_x, left_axis_y])
            circle(r = left_radius);
        inner_cutout();   // subtract the slot + holes (opens the right side)
    }
}

// Rectangular tab
module upright_tab() {
    translate([tab_left_offset, tab_front_offset, 0])
        cube([tab_length, tab_width, tab_height]);
}

// ---- Main assembly: union all components ----
union() {
    lower_base();
    upper_circular_section();
    upright_tab();
}