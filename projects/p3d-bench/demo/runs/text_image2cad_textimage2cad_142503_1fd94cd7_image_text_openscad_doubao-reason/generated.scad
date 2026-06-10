// Global Configuration
$fn = 100;

// Core Assembly Dimensions
total_height = 178;
total_width = 120;

// Pedestal Body Parameters
pedestal_h = 130;
base_r = 30;
body_r = 22;
shoulder_r = 27;
neck_r = 20;
top_r = 25;
text_extrusion = 1;
text_size = 10;

// Crown Parameters
crown_h = 20;
crown_outer_r = 25;
crown_inner_r = 18.44;
tooth_count = 10;
tooth_depth = 8;

// Decorative Sphere Parameters
sphere_r = 3;

// Handle Parameters
handle_thickness = 7.5;
handle_height = 120;

// Key Parameters
key_cross = 7.5;
long_key_len = 120;
short_key_len = 101;
key_end_r = key_cross / 2;

// Clip Parameters
clip_thickness = 2;

// Support Strip Parameters
strip_thickness = 1;
strip_len = 128;

// ------------------------------
// Module Definitions
// ------------------------------

// Revolved main pedestal body with embossed text
module pedestal_body() {
    rotate_extrude() {
        polygon(points = [
            [0, 0], [base_r, 0], [base_r, 10],
            [body_r, 40], [body_r, 90], [shoulder_r, 105],
            [neck_r, 120], [top_r, 120], [top_r, pedestal_h], [0, pedestal_h]
        ]);
    }
    // Embossed front text
    translate([body_r + text_extrusion/2, -20, 60])
    rotate([0, 90, 0])
    linear_extrude(height=text_extrusion, center=true)
    text("Premier\nLeague", size=text_size, font="Arial:Bold", halign="center", valign="center");
}

// Serrated crown ring with central bore
module serrated_crown() {
    linear_extrude(height=crown_h) {
        difference() {
            polygon(points = [
                for (i = [0 : tooth_count*2 -1]) let(
                    angle = i * 360 / (tooth_count*2),
                    r = i%2 == 0 ? crown_outer_r : crown_outer_r - tooth_depth
                ) [r * cos(angle), r * sin(angle)]
            ]);
            circle(r = crown_inner_r);
        }
    }
}

// 10x rotational array of crown tip spheres
module crown_spheres() {
    for (i = [0:tooth_count-1]) let(
        angle = i * 360 / tooth_count,
        x = crown_outer_r * cos(angle),
        y = crown_outer_r * sin(angle)
    ) translate([x, y, crown_h]) sphere(r=sphere_r);
}

// Single curved S-profile handle
module curved_handle() {
    linear_extrude(height=handle_thickness, center=true) {
        polygon(points = [
            [0, 10], [15, 120], [10, 120],
            [-15, 70], [-20, 0], [-15, 0]
        ]);
    }
}

// Parallel key with rounded ends
module parallel_key(length) {
    hull() {
        translate([0, 0, 0]) cylinder(r=key_end_r, h=key_cross, center=true);
        translate([length, 0, 0]) cylinder(r=key_end_r, h=key_cross, center=true);
    }
}

// C-clip retaining part
module clip() {
    linear_extrude(height=clip_thickness, center=true) {
        difference() {
            polygon(points = [
                [0, 0], [24, 0], [24, 10], [18, 15],
                [18, 27], [6, 27], [6, 15], [0, 10]
            ]);
            translate([12, 19]) circle(r=4);
            translate([12, 8]) circle(r=4);
        }
    }
}

// Thin S-curved support strip
module support_strip() {
    linear_extrude(height=strip_thickness, center=true) {
        polygon(points = [
            [0, strip_len], [5, strip_len - 8], [-3, 64],
            [3, 8], [-2, 0]
        ]);
    }
}

// ------------------------------
// Main Assembly
// ------------------------------
union() {
    // Base Pedestal
    pedestal_body();

    // Top Crown Assembly
    translate([0, 0, pedestal_h]) {
        serrated_crown();
        crown_spheres();
    }

    // Mirrored Handle Pair
    translate([32, 0, pedestal_h/2]) rotate([90, 0, 0]) curved_handle();
    translate([-32, 0, pedestal_h/2]) rotate([90, 0, 0]) mirror([1, 0, 0]) curved_handle();

    // Key Elements
    translate([-26, 0, 60]) rotate([0, 90, 90]) parallel_key(long_key_len);
    translate([26, 0, 70]) rotate([0, 90, 90]) parallel_key(short_key_len);

    // Mirrored Clip Pair
    translate([20, 10, 100]) clip();
    translate([-20, 10, 100]) rotate([0, 0, 180]) clip();

    // Four Decorative Support Strips
    translate([36, 12, 20]) rotate([0, 0, 12]) support_strip();
    translate([36, -12, 20]) rotate([0, 0, -12]) support_strip();
    translate([-36, 12, 20]) rotate([0, 0, -12]) mirror([1,0,0]) support_strip();
    translate([-36, -12, 20]) rotate([0, 0, 12]) mirror([1,0,0]) support_strip();
}