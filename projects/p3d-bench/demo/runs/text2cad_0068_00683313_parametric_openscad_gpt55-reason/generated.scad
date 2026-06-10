// Parameters
$fn = 100;
cut_clearance = 0.0005;

// Main base
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;      // nominal extrusion depth 0.0938
base_z_min = 0;
base_z_max = base_z_min + base_height;

// Base circular opening
base_hole_cx = 0.25;
base_hole_cy = 0.1875;
base_hole_radius = 0.0938;

// Back-edge strip footprint
back_strip_length = 0.5;
back_strip_front_offset = 0.375;
back_strip_back_offset = 0;
back_strip_width = base_width - back_strip_front_offset - back_strip_back_offset;
back_strip_x_min = 0;
back_strip_y_min = back_strip_front_offset;

// Underside strip depth
under_strip_z_min = -0.25;
under_strip_z_max = 0;

// Tall back-edge solid
back_solid_z_min = -0.5;
back_solid_z_max = 0.25;

// Back-edge circular void
back_void_cx = 0.125;
back_void_cy = 0.4375;
back_void_radius = 0.05;

// Upper annular collar
collar_cx = 0.2501;
collar_cy = 0.1876;
collar_outer_radius = 0.0938;
collar_inner_radius = 0.05;
collar_height = 0.0625;
collar_z_min = base_z_max;
collar_z_max = collar_z_min + collar_height;

// Helper: box from minimum corner
module box_at(x, y, z, l, w, h) {
    translate([x, y, z])
        cube([l, w, h], center=false);
}

// Helper: vertical cylindrical cut
module z_cylinder_cut(cx, cy, z_min, z_max, r) {
    translate([cx, cy, z_min - cut_clearance])
        cylinder(h=(z_max - z_min) + 2 * cut_clearance, r=r, center=false);
}

// Main base with true circular through-opening
module main_base() {
    difference() {
        box_at(0, 0, base_z_min, base_length, base_width, base_height);
        z_cylinder_cut(base_hole_cx, base_hole_cy, base_z_min, base_z_max, base_hole_radius);
    }
}

// Full-length underside strip along the back edge
module underside_back_strip() {
    box_at(
        back_strip_x_min,
        back_strip_y_min,
        under_strip_z_min,
        back_strip_length,
        back_strip_width,
        under_strip_z_max - under_strip_z_min
    );
}

// Tall back-edge solid over the same footprint
module tall_back_solid() {
    box_at(
        back_strip_x_min,
        back_strip_y_min,
        back_solid_z_min,
        back_strip_length,
        back_strip_width,
        back_solid_z_max - back_solid_z_min
    );
}

// Lower body with back-edge circular void cut through the solids
module lower_body() {
    difference() {
        union() {
            main_base();
            underside_back_strip();
            tall_back_solid();
        }
        z_cylinder_cut(back_void_cx, back_void_cy, back_solid_z_min, back_solid_z_max, back_void_radius);
    }
}

// Upper annular collar
module annular_collar() {
    difference() {
        translate([collar_cx, collar_cy, collar_z_min])
            cylinder(h=collar_height, r=collar_outer_radius, center=false);

        z_cylinder_cut(collar_cx, collar_cy, collar_z_min, collar_z_max, collar_inner_radius);
    }
}

// Final model
union() {
    lower_body();
    annular_collar();
}