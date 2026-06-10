// Premier League Trophy Assembly
// Parametric reconstruction from image and structured description

$fn = 80;

// --- Global Dimensions ---
pedestal_h = 150;
crown_r_in = 18.5;
crown_r_out = 25;
crown_h_valley = 10;
crown_h_peak = 25;
ball_r = 3.0;

handle_thick = 7.5;
strip_thick = 1.0;
key_size = 7.5;

// --- Pedestal Body (revolved profile) ---
module pedestal() {
    rotate_extrude(convexity = 10)
    polygon([
        [0, 0],
        [30, 0],
        [30, 5],
        [28, 15],
        [24, 40],
        [21, 70],
        [20, 100],
        [23, 115],
        [24, 125],
        [22, 140],
        [18.5, 150],
        [18.5, pedestal_h],
        [0, pedestal_h]
    ]);
}

// --- Embossed Text ---
module trophy_text() {
    translate([0, 21.5, 72])
        rotate([-90, 0, 0])
        linear_extrude(height = 1.2)
        text("Premier", size = 5, halign = "center", valign = "center");

    translate([0, 21.5, 64])
        rotate([-90, 0, 0])
        linear_extrude(height = 1.2)
        text("League", size = 5, halign = "center", valign = "center");
}

// --- Serrated Crown Ring ---
module crown_ring() {
    Hv = crown_h_valley;
    Hp = crown_h_peak;
    Ri = crown_r_in;
    Ro = crown_r_out;

    union() {
        difference() {
            cylinder(h = Hv, r = Ro);
            translate([0, 0, -0.1])
                cylinder(h = Hv + 0.2, r = Ri);
        }

        for (i = [0:9]) {
            a = i * 36;
            p0 = [Ri * cos(a - 18), Ri * sin(a - 18), Hv];
            p1 = [Ro * cos(a - 18), Ro * sin(a - 18), Hv];
            p2 = [Ro * cos(a), Ro * sin(a), Hp];
            p3 = [Ro * cos(a + 18), Ro * sin(a + 18), Hv];
            p4 = [Ri * cos(a + 18), Ri * sin(a + 18), Hv];
            p5 = [Ri * cos(a), Ri * sin(a), Hv];

            polyhedron(
                points = [p0, p1, p2, p3, p4, p5],
                faces = [
                    [0, 1, 5],
                    [1, 3, 5],
                    [3, 4, 5],
                    [0, 2, 1],
                    [4, 3, 2],
                    [0, 5, 2],
                    [5, 4, 2],
                    [1, 2, 3]
                ],
                convexity = 5
            );
        }
    }
}

// --- Bearing Ball ---
module bearing_ball() {
    sphere(r = ball_r);
}

// --- Curved Handle (planar S-curve strip) ---
module handle() {
    rotate([90, 0, 0])
    linear_extrude(height = handle_thick, center = true)
    polygon([
        [28, 10],
        [45, 40],
        [48, 80],
        [42, 120],
        [32, 145],
        [26, 145],
        [36, 120],
        [42, 80],
        [39, 40],
        [22, 10]
    ]);
}

// --- Rounded-end Key Bar (stadium profile) ---
module key_bar(length, size) {
    r = size / 2;
    rotate([90, 0, 0])
    linear_extrude(height = size, center = true)
    hull() {
        translate([-length / 2 + r, 0]) circle(r = r);
        translate([length / 2 - r, 0]) circle(r = r);
    }
}

// --- C-Shaped Retaining Clip ---
module clip() {
    rotate([90, 0, 0])
    linear_extrude(height = 2, center = true)
    polygon([
        [-6, -9],
        [6, -9],
        [6, -5],
        [0, -5],
        [0, 5],
        [6, 5],
        [6, 9],
        [-6, 9],
        [-6, 5],
        [-2, 5],
        [-2, -5],
        [-6, -5]
    ]);
}

// --- Decorative Curved Strip ---
module deco_strip(pts) {
    rotate([90, 0, 0])
    linear_extrude(height = strip_thick, center = true)
    polygon(pts);
}

// --- Main Assembly ---
union() {
    pedestal();
    trophy_text();

    // Crown seated around the pedestal neck
    translate([0, 0, 135])
        crown_ring();

    // 10 balls arrayed on crown tips
    for (i = [0:9]) {
        a = i * 36;
        translate([
            crown_r_out * cos(a),
            crown_r_out * sin(a),
            135 + crown_h_peak + ball_r
        ])
            bearing_ball();
    }

    // Mirrored handle pair (left / right)
    for (mz = [0, 180])
    rotate([0, 0, mz])
    union() {
        // Main curved arm
        handle();

        // Lower key bridging arm to body
        translate([30, 0, 45])
            key_bar(20, key_size);

        // Upper key bridging arm to body
        translate([28, 0, 115])
            key_bar(16, key_size);

        // Retaining clip near neck
        translate([22, 0, 138])
            clip();

        // Outer decorative strip 1
        deco_strip([
            [32, 15], [49, 45], [52, 85], [46, 125], [36, 148],
            [34, 148], [44, 125], [50, 85], [47, 45], [30, 15]
        ]);

        // Outer decorative strip 2
        deco_strip([
            [36, 20], [52, 50], [55, 90], [49, 130], [39, 152],
            [37, 152], [47, 130], [53, 90], [50, 50], [34, 20]
        ]);
    }
}