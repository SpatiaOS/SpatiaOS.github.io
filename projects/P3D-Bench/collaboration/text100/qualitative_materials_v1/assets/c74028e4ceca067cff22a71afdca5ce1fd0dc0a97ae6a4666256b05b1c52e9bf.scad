// Parametric low rectangular open web with raised side walls
// Units: mm

// Overall footprint
length = 120;
width  = 60;

// Height / depth control
web_height          = 5;
wall_extra_height   = 13;
wall_height         = web_height + wall_extra_height;

// Web and wall sizing
frame_width          = 8;
wall_thickness       = frame_width;
rib_width            = 5;
diagonal_rib_width   = 5;

// Circular openings
hole_count         = 3;
hole_diameter      = 10;
hole_boss_width    = 4;
hole_boss_diameter = hole_diameter + 2 * hole_boss_width;

hole_positions = [
    for (i = [1 : hole_count])
        [length * i / (hole_count + 1), width / 2]
];

// Rib layout
num_cross_ribs = hole_count - 1;

// Derived inner web area
inner_length = length - 2 * frame_width;
inner_width  = width  - 2 * frame_width;
cross_pitch  = inner_length / (num_cross_ribs + 1);

// Resolution
$fn = 100;

// Basic rectangular plate used as the shallow web envelope
module base_plate(h) {
    cube([length, width, h]);
}

// Outer perimeter frame of the shallow web
module perimeter_frame() {
    difference() {
        base_plate(web_height);

        // Remove the interior to leave only the perimeter frame
        translate([frame_width, frame_width, -1])
            cube([inner_length, inner_width, web_height + 2]);
    }
}

// Transverse cross ribs
module cross_ribs() {
    for (i = [1 : num_cross_ribs]) {
        x = frame_width + i * cross_pitch - rib_width / 2;

        translate([x, 0, 0])
            cube([rib_width, width, web_height]);
    }
}

// Longitudinal center rib, also supports the circular openings
module center_rib() {
    translate([0, width / 2 - rib_width / 2, 0])
        cube([length, rib_width, web_height]);
}

// Diagonal ribs forming an X across the inner web area
module diagonal_ribs() {
    let (
        diag_len = sqrt(pow(inner_length, 2) + pow(inner_width, 2)),
        angle    = atan2(inner_width, inner_length)
    ) {
        intersection() {
            base_plate(web_height);

            union() {
                translate([length / 2, width / 2, web_height / 2])
                    rotate([0, 0, angle])
                    cube([diag_len + diagonal_rib_width,
                          diagonal_rib_width,
                          web_height],
                         center = true);

                translate([length / 2, width / 2, web_height / 2])
                    rotate([0, 0, -angle])
                    cube([diag_len + diagonal_rib_width,
                          diagonal_rib_width,
                          web_height],
                         center = true);
            }
        }
    }
}

// Local bosses around the holes so the circular openings remain defined
module hole_bosses() {
    for (p = hole_positions) {
        translate([p[0], p[1], 0])
            cylinder(h = web_height, d = hole_boss_diameter);
    }
}

// Through-hole cuts
module hole_cuts() {
    for (p = hole_positions) {
        translate([p[0], p[1], -1])
            cylinder(h = web_height + 2, d = hole_diameter);
    }
}

// Open ribbed web
module open_web() {
    difference() {
        union() {
            perimeter_frame();
            center_rib();
            cross_ribs();
            diagonal_ribs();
            hole_bosses();
        }

        hole_cuts();
    }
}

// Raised solid side walls along the two long edges
module side_walls() {
    // Wall along y = 0 edge
    cube([length, wall_thickness, wall_height]);

    // Wall along opposite y edge
    translate([0, width - wall_thickness, 0])
        cube([length, wall_thickness, wall_height]);
}

// Final model
union() {
    open_web();
    side_walls();
}