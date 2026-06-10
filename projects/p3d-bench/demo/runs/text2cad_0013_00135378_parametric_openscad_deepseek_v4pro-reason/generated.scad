// Parametric Pill-Shaped Base with Concentric Collars
// All dimensions in inches (as given)

// Base dimensions
base_length = 0.75;
base_width = 0.45;
base_height = 0.05625;          // thickness of base plate, also shoulder datum Z

// Central axis (center of base)
center_x = base_length / 2;     // 0.375 from left edge
center_y = base_width / 2;      // 0.225 from front edge

// Outer collar (tall tube)
outer_radius = 0.225;
outer_inner_radius = 0.1875;
outer_height = 0.1687;          // from shoulder datum

// Smaller collar (short tube)
small_outer_radius = 0.0937;
small_inner_radius = 0.0562;
small_height = 0.0937;          // from shoulder datum

// Innermost solid cylinder
inner_radius = 0.0562;
inner_height = 0.075;          // from shoulder datum

// Resolution
$fn = 100;

// 2D pill shape (slot-like footprint)
module pill_shape() {
    hull() {
        // Left semicircle
        translate([base_width / 2, center_y])
            circle(r = base_width / 2);
        // Right semicircle
        translate([base_length - base_width / 2, center_y])
            circle(r = base_width / 2);
    }
}

// Base plate: pill shape extruded to base_height
module base_plate() {
    linear_extrude(height = base_height)
        pill_shape();
}

// Outer annular collar (tube)
module outer_collar() {
    translate([center_x, center_y, base_height])
    difference() {
        cylinder(h = outer_height, r = outer_radius);
        cylinder(h = outer_height, r = outer_inner_radius);
    }
}

// Smaller annular collar (tube)
module smaller_collar() {
    translate([center_x, center_y, base_height])
    difference() {
        cylinder(h = small_height, r = small_outer_radius);
        cylinder(h = small_height, r = small_inner_radius);
    }
}

// Innermost solid cylinder
module inner_solid() {
    translate([center_x, center_y, base_height])
        cylinder(h = inner_height, r = inner_radius);
}

// Assemble final model
union() {
    base_plate();
    outer_collar();
    smaller_collar();
    inner_solid();
}