// --------------------------
// Retro CRT TV Parameters
// --------------------------
$fn = 50; // Smoothness for curved surfaces

// Overall Body Dimensions (mm)
tv_width = 300;       // Left-right front dimension
tv_height = 200;      // Top-bottom front dimension
tv_depth = 180;       // Front-back main cabinet depth
bezel_thickness = 10; // Front bezel width
body_round_radius = 3;// Rounded edge radius for cabinet

// Screen Dimensions
screen_width = 170;
screen_height = 140;
screen_recess_depth = 8;
screen_curve_rad = 350; // Convex curve radius of CRT face

// Control Panel Dimensions (right side of front)
ctrl_width = tv_width - screen_width - 2*bezel_thickness;
ctrl_height = tv_height - 2*bezel_thickness;
grille_hole_size = 4;
grille_spacing = 7;

// Rear CRT Bulge
bulge_width = 260;
bulge_height = 160;
bulge_depth = 60;

// Antenna Parameters
antenna_length = 180;
antenna_dia = 1.5;
ant_angle_left = 30;  // Angle from vertical (degrees)
ant_angle_right = -40;// Angle from vertical (degrees)

// --------------------------
// Helper Modules
// --------------------------
module rounded_box(w, h, d, r, center=false) {
    // Rounded box primitive using Minkowski sum
    minkowski() {
        cube([w - 2*r, h - 2*r, d - 2*r], center=center);
        sphere(r=r);
    }
}

// --------------------------
// Main TV Assembly
// --------------------------
union() {
    // Main Cabinet Body
    color("gray") difference() {
        union() {
            // Main front cabinet
            rounded_box(tv_width, tv_height, tv_depth, body_round_radius);
            // Rear CRT bulge
            translate([(tv_width - bulge_width)/2, (tv_height - bulge_height)/2, tv_depth])
                rounded_box(bulge_width, bulge_height, bulge_depth, body_round_radius);
        }

        // Screen recess cutout
        translate([bezel_thickness, bezel_thickness, -0.1])
            cube([screen_width, screen_height, screen_recess_depth + 0.2]);

        // Control panel recess cutout
        translate([tv_width - bezel_thickness - ctrl_width, bezel_thickness, -0.1])
            cube([ctrl_width, ctrl_height, 2.2]);

        // Speaker grille holes
        for (x = [0:grille_spacing:ctrl_width - grille_hole_size]) {
            for (y = [0:grille_spacing:60 - grille_hole_size]) {
                translate([tv_width - bezel_thickness - ctrl_width + x, bezel_thickness + 70 + y, -0.1])
                    cube([grille_hole_size, grille_hole_size, 2.2]);
            }
        }
    }

    // Curved CRT Screen
    color("silver") translate([bezel_thickness + screen_width/2, bezel_thickness, screen_recess_depth - 1])
    intersection() {
        rotate([90, 0, 0]) cylinder(h=screen_height, r=screen_curve_rad, center=true);
        translate([-screen_width/2, 0, -screen_curve_rad]) cube([screen_width, screen_height, screen_curve_rad*2]);
    }

    // Control Panel Components
    color("darkgray") {
        // Control panel buttons (top right)
        for (i = [0:2]) {
            translate([tv_width - bezel_thickness - 10 - i*10, bezel_thickness + ctrl_height - 10, 0])
                cylinder(h=2.5, d=5);
        }
        // Cassette slot lower panel
        translate([tv_width - bezel_thickness - ctrl_width + 2, bezel_thickness + 2, 0])
            cube([ctrl_width - 4, 60, 1.8]);
    }

    // Brand text on screen bezel
    color("black") translate([bezel_thickness + screen_width/2 - 22, bezel_thickness - 7, 0])
        linear_extrude(height=0.6) text("RETROTV", size=6, font="Arial:Bold");

    // Telescoping Antennas
    color("lightgray") {
        // Left antenna
        translate([tv_width/2 - 15, tv_height, 50])
        rotate([0, ant_angle_left, 15]) {
            cylinder(h=antenna_length, d=antenna_dia);
            translate([0, 0, antenna_length]) sphere(d=antenna_dia*2);
        }
        // Right antenna
        translate([tv_width/2 + 15, tv_height, 50])
        rotate([0, ant_angle_right, -15]) {
            cylinder(h=antenna_length, d=antenna_dia);
            translate([0, 0, antenna_length]) sphere(d=antenna_dia*2);
        }
    }
}