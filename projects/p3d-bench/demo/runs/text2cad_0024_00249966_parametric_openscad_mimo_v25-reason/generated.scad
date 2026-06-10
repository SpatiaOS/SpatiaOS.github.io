// Parameters
base_length = 0.75;
base_width = 0.364251;
base_height = 0.080711;
extrusion_depth = 0.0807;

// Circular through opening in base
base_hole_x = 0.4987;
base_hole_y = 0.1821;
base_hole_radius = 0.0396;

// Lower collar
collar_radius = 0.1104;
collar_x = 0.1865;
collar_y = 0.1821;
collar_footprint = 0.220812;
collar_footprint_x = 0.0761;
collar_footprint_y = 0.0717;
collar_height = 0.0914;

// Upper post
post_radius = 0.0563;
post_footprint = 0.1126;
post_footprint_x = 0.1302;
post_footprint_y = 0.1258;
post_height = 0.2893;

// Raised rounded region
rounded_region_x = 0.2916;
rounded_region_y = 0.0144;
rounded_region_width = 0.4584;
rounded_region_height = 0.3356;
rounded_region_thickness = 0.0411;

// Circular profile in raised region
raised_circle_x = 0.4987;
raised_circle_y = 0.1822;
raised_circle_radius = 0.0396;

// Rectangular rib
rib_x = 0.5673;
rib_y = 0.1349;
rib_width = 0.182741;
rib_height = 0.094416;
rib_thickness = 0.0305;

$fn = 100; // Smooth curves

// Main base with rounded corners and slot
module base() {
    difference() {
        // Main base body with rounded corners
        linear_extrude(height = base_height)
            offset(r = 0.01) // Small rounding radius
                square([base_length, base_width], center = false);
        
        // Through slot (example dimensions - adjust as needed)
        translate([0.2, 0.1, -0.01])
            cube([0.35, 0.164251, base_height + 0.02]);
        
        // Circular through opening
        translate([base_hole_x, base_hole_y, -0.01])
            cylinder(h = base_height + 0.02, r = base_hole_radius);
    }
}

// Lower collar
module lower_collar() {
    translate([collar_x, collar_y, base_height])
        cylinder(h = collar_height, r = collar_radius);
}

// Upper post
module upper_post() {
    translate([collar_x, collar_y, base_height + collar_height])
        cylinder(h = post_height, r = post_radius);
}

// Raised rounded region
module raised_region() {
    difference() {
        translate([rounded_region_x, rounded_region_y, base_height])
            linear_extrude(height = rounded_region_thickness)
                offset(r = 0.01)
                    square([rounded_region_width, rounded_region_height], center = false);
        
        // Circular profile in raised region
        translate([raised_circle_x, raised_circle_y, base_height - 0.01])
            cylinder(h = rounded_region_thickness + 0.02, r = raised_circle_radius);
    }
}

// Rectangular rib
module rectangular_rib() {
    translate([rib_x, rib_y, base_height + rounded_region_thickness])
        cube([rib_width, rib_height, rib_thickness]);
}

// Final assembly
union() {
    base();
    lower_collar();
    upper_post();
    raised_region();
    rectangular_rib();
}