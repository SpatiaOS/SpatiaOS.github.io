// OpenSCAD Model: Low Rectangular Open Web with Tall Side Walls
// All dimensions in millimeters

// --------------------------
// Parametric Part Definitions
// --------------------------
part_length = 120;          // Total part length along long X axis
part_width = 60;            // Total part width along short Y axis

// Tall side wall parameters (along long edges, higher than web)
wall_thickness = 5;         // Y-direction thickness of long side walls
wall_height = 12;           // Z-height of walls from Z=0 base (taller than web)

// Open web parameters (shallow ribbed grid)
web_rib_thickness = 4;      // In-plane (XY) thickness of all web ribs
web_height = 3;             // Z-height of web ribs from Z=0 base (shallow)
n_transverse_ribs = 2;      // Number of internal cross ribs across the width

// Circular opening parameters (through voids with circular rib borders)
circular_hole_r = 7;        // Radius of inner circular voids
circular_hole_centers = [   // [X,Y] center positions for circular openings
    [30, part_width/2],
    [90, part_width/2],
    [60, 20],
    [60, 40]
];

// Global resolution for curved surfaces
$fn = 64;

// --------------------------
// Helper Modules
// --------------------------
module diagonal_rib(p1, p2, rib_thickness, rib_height) {
    // Create a straight rectangular rib between two XY points, rooted at Z=0
    dx = p2[0] - p1[0];
    dy = p2[1] - p1[1];
    rib_length = norm([dx, dy]);
    rib_angle = atan2(dy, dx);
    midpoint = [
        (p1[0] + p2[0]) / 2,
        (p1[1] + p2[1]) / 2,
        rib_height / 2
    ];
    translate(midpoint)
        rotate(rib_angle, [0, 0, 1])
            cube([rib_length, rib_thickness, rib_height], center=true);
}

// --------------------------
// Main Part Geometry
// --------------------------
union() {
    // Tall solid side walls along opposite long edges (added material, not cuts)
    cube([part_length, wall_thickness, wall_height]);  // Wall at Y=0 edge
    translate([0, part_width - wall_thickness, 0])
        cube([part_length, wall_thickness, wall_height]);  // Wall at Y=part_width edge

    // Shallow open web structure (rib grid with through openings)
    difference() {
        // Build all solid web rib material
        union() {
            // Calculate positions for all Y-oriented ribs (end perimeter + cross ribs)
            left_end_x = web_rib_thickness / 2;
            right_end_x = part_length - web_rib_thickness / 2;
            rib_spacing = (part_length - web_rib_thickness) / (n_transverse_ribs + 1);
            transverse_x = [for (i = [1:n_transverse_ribs]) left_end_x + i * rib_spacing];
            all_y_rib_x = concat([left_end_x], transverse_x, [right_end_x]);

            // Add Y-direction straight ribs
            for (x_pos = all_y_rib_x) {
                diagonal_rib(
                    [x_pos, wall_thickness],
                    [x_pos, part_width - wall_thickness],
                    web_rib_thickness,
                    web_height
                );
            }

            // Add X-brace diagonal ribs in each bay between transverse ribs
            for (i = [0:len(all_y_rib_x)-2]) {
                xl = all_y_rib_x[i];
                xr = all_y_rib_x[i+1];
                y_min = wall_thickness;
                y_max = part_width - wall_thickness;
                diagonal_rib([xl, y_min], [xr, y_max], web_rib_thickness, web_height);
                diagonal_rib([xl, y_max], [xr, y_min], web_rib_thickness, web_height);
            }

            // Add solid ring stock for circular opening borders
            for (hole = circular_hole_centers) {
                translate([hole[0], hole[1], 0])
                    cylinder(h=web_height, r=circular_hole_r + web_rib_thickness);
            }
        }

        // Cut clean through openings for circular voids (removes any rib material across holes)
        for (hole = circular_hole_centers) {
            translate([hole[0], hole[1], -1])
                cylinder(h=web_height + 2, r=circular_hole_r);
        }
    }
}