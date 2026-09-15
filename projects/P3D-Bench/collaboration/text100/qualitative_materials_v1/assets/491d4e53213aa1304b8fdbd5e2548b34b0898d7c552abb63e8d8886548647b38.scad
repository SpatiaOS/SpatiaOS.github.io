// Dimensions (mm)
length = 120;
width = 60;
web_height = 3;
perimeter_width = 3;

wall_height = 12;
wall_thickness = 3;

rib_width = 2.4;
bay_count = 3;
opening_diameter = 14;
ring_width = 2.5;

$fn = 96;

// Derived dimensions
inner_length = length - 2 * perimeter_width;
inner_width = width - 2 * perimeter_width;
bay_length = inner_length / bay_count;
ring_diameter = opening_diameter + 2 * ring_width;

function bay_start(i) = -inner_length / 2 + i * bay_length;
function bay_center(i) = bay_start(i) + bay_length / 2;

// Parameter checks
assert(length > 2 * perimeter_width);
assert(width > 2 * perimeter_width);
assert(web_height > 0 && wall_height > web_height);
assert(wall_thickness > 0 && wall_thickness <= perimeter_width);
assert(rib_width > 0 && rib_width <= 2 * perimeter_width);
assert(bay_count >= 1 && bay_count == floor(bay_count));
assert(opening_diameter > 0 && ring_width > 0);
assert(ring_diameter < min(bay_length, inner_width));

// Rounded-end rib profile
module rib_profile(start, finish, thickness) {
    hull() {
        translate(start)
            circle(d = thickness);
        translate(finish)
            circle(d = thickness);
    }
}

// Rectangular perimeter
module perimeter_profile() {
    difference() {
        square([length, width], center = true);
        square([inner_length, inner_width], center = true);
    }
}

// Diagonal and transverse ribs
module bay_ribs(i) {
    x0 = bay_start(i);
    x1 = x0 + bay_length;
    xc = bay_center(i);
    y0 = -inner_width / 2;
    y1 = inner_width / 2;

    rib_profile([x0, y0], [x1, y1], rib_width);
    rib_profile([x0, y1], [x1, y0], rib_width);
    rib_profile([xc, y0], [xc, y1], rib_width);
}

// Open web with uninterrupted circular voids
module web_profile() {
    difference() {
        union() {
            perimeter_profile();

            rib_profile(
                [-inner_length / 2, 0],
                [inner_length / 2, 0],
                rib_width
            );

            for (i = [0 : bay_count - 1]) {
                bay_ribs(i);

                translate([bay_center(i), 0])
                    circle(d = ring_diameter);
            }
        }

        for (i = [0 : bay_count - 1])
            translate([bay_center(i), 0])
                circle(d = opening_diameter);
    }
}

// Shallow web
module open_web() {
    linear_extrude(height = web_height, convexity = 10)
        web_profile();
}

// Raised solid walls sharing the web's base plane
module side_walls() {
    for (side = [-1, 1])
        translate([
            0,
            side * (width - wall_thickness) / 2,
            wall_height / 2
        ])
            cube(
                [length, wall_thickness, wall_height],
                center = true
            );
}

// Unified manifold part
union() {
    open_web();
    side_walls();
}