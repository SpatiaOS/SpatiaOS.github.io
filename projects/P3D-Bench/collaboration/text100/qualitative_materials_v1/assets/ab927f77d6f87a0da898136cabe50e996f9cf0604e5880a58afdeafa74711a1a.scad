// Parameters
length = 140;             // Overall part length
width = 54;               // Overall part width
web_height = 5;           // Height/thickness of the thin open web
wall_height = 16;         // Total height of the raised side walls
wall_thickness = 6;       // Thickness of the two long side walls
end_rib_thickness = 5;    // Thickness of perimeter ribs at short ends
rib_thickness = 3.5;      // Thickness of internal structural ribs
hole_diameter = 14;       // Diameter of circular through-hole openings
boss_diameter = 24;       // Outer diameter of circular hubs
pitch = 38;               // Spacing between circular hubs
$fn = 64;                 // Arc resolution

inner_width = width - 2 * wall_thickness;
hole_positions = [-pitch, 0, pitch];

// 2D Profile of Open Web Structure
module web_profile() {
    difference() {
        intersection() {
            square([length, inner_width], center = true);
            union() {
                // Short-end perimeter ribs
                translate([-length / 2 + end_rib_thickness / 2, 0])
                    square([end_rib_thickness, inner_width], center = true);
                translate([length / 2 - end_rib_thickness / 2, 0])
                    square([end_rib_thickness, inner_width], center = true);

                // Longitudinal center rib
                square([length, rib_thickness], center = true);

                // Hub bosses and cross ribs
                for (x = hole_positions) {
                    translate([x, 0])
                        circle(d = boss_diameter);
                    translate([x, 0])
                        square([rib_thickness, inner_width], center = true);
                }

                // Internal diagonal truss ribs
                for (x = hole_positions) {
                    for (sy = [-1, 1]) {
                        hull() {
                            translate([x, 0])
                                circle(d = rib_thickness);
                            translate([x - pitch / 2, sy * inner_width / 2])
                                circle(d = rib_thickness);
                        }
                        hull() {
                            translate([x, 0])
                                circle(d = rib_thickness);
                            translate([x + pitch / 2, sy * inner_width / 2])
                                circle(d = rib_thickness);
                        }
                    }
                }
            }
        }

        // Circular voids passing through the hubs
        for (x = hole_positions) {
            translate([x, 0])
                circle(d = hole_diameter);
        }
    }
}

// Raised Solid Side Walls
module side_walls() {
    translate([0, (width - wall_thickness) / 2, wall_height / 2])
        cube([length, wall_thickness, wall_height], center = true);
    translate([0, -(width - wall_thickness) / 2, wall_height / 2])
        cube([length, wall_thickness, wall_height], center = true);
}

// Complete Assembly
union() {
    side_walls();
    linear_extrude(height = web_height)
        web_profile();
}