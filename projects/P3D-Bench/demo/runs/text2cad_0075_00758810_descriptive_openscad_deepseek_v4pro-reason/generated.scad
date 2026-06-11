// Parameters
$fn = 64;
eps = 0.01;

// Base dimensions
base_length = 60;
base_width  = 30;
base_thickness = 12;

// Raised annular collar
collar_od = 20;
collar_id = 10;
collar_height = 8;

// Stepped through bore
small_bore_depth = 6;   // depth of small bore below base top
large_bore_d = 14;      // larger counterbore diameter

// Side shallow recesses
side_recess_d = 6;
side_recess_depth = 3;  // shallow indent from side face

// Underside circular pattern
pattern_d = 4;
pattern_depth = 2;
pattern_spacing_x = 10;
pattern_spacing_y = 8;

// Derived values
base_radius = base_width / 2;
step_z = base_thickness - small_bore_depth; // step level measured from bottom

// 2D pill shape (stadium / rounded rectangle)
module pill_2d() {
    hull() {
        translate([-base_length/2 + base_radius, 0])
            circle(r = base_radius);
        translate([ base_length/2 - base_radius, 0])
            circle(r = base_radius);
    }
}

// Annular collar (tube)
module annular_collar(od, id, h) {
    difference() {
        cylinder(h = h, d = od);
        cylinder(h = h + eps, d = id);
    }
}

// Main model
difference() {
    // Combined solid: base + collar
    union() {
        // Thick rounded base
        linear_extrude(height = base_thickness)
            pill_2d();

        // Raised collar centered on top
        translate([0, 0, base_thickness])
            annular_collar(collar_od, collar_id, collar_height);
    }

    // ===== Stepped through bore =====
    union() {
        // Small bore from collar top down to step_z
        translate([0, 0, step_z - eps])
            cylinder(h = collar_height + small_bore_depth + 2*eps,
                     d = collar_id);
        // Large counterbore from bottom up to step_z
        cylinder(h = step_z + eps, d = large_bore_d);
    }

    // ===== Side recesses (on straight faces) =====
    // Positive Y side
    translate([0, base_width/2, base_thickness/2])
        rotate([90, 0, 0])
            cylinder(h = side_recess_depth, d = side_recess_d, center = true);
    // Negative Y side
    translate([0, -base_width/2, base_thickness/2])
        rotate([90, 0, 0])
            cylinder(h = side_recess_depth, d = side_recess_d, center = true);

    // ===== Underside circular cut pattern =====
    // Grid within the rectangular footprint (positions outside pill removed automatically)
    for (x = [-25 : pattern_spacing_x : 25]) {
        for (y = [-12 : pattern_spacing_y : 12]) {
            translate([x, y, 0])
                cylinder(h = pattern_depth, d = pattern_d);
        }
    }
}