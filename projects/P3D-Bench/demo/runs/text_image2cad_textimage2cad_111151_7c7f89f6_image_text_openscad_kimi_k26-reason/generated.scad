// Parameters
seat_width      = 100;   // width of seat / backrest (x)
seat_depth      = 110;   // depth of seat (y)
seat_thick      = 15;    // thickness of horizontal base (z)
backrest_h      = 230;   // total height of vertical plate (z)
back_thick      = 10;    // thickness of vertical plate (y)
leg_length      = 100;   // length of legs (z)
leg_size        = 25;    // nominal width of leg cross-section
leg_R           = 130;   // radius of concave cylindrical faces
fillet_r        = 2;     // fillet radius on leg edges
$fn             = 64;

// ---------------------------------------------------------
// Leg cross-section: square with slight concave cylindrical sides
// ---------------------------------------------------------
function leg_poly(w, R, n=16) =
    let(hw = w/2,
        cx = hw + sqrt(R*R - hw*hw),
        alpha = asin(hw/R))
    concat(
        // right face  : bottom-right -> top-right
        [for (i=[0:n-1]) let(t = -alpha + (2*alpha)*i/n) [cx - R*cos(t), R*sin(t)]],
        // top face    : top-left -> top-right
        [for (i=[0:n-1]) let(t = -alpha + (2*alpha)*i/n) [R*sin(t), cx - R*cos(t)]],
        // left face   : top-left -> bottom-left
        [for (i=[0:n-1]) let(t = alpha - (2*alpha)*i/n) [-cx + R*cos(t), R*sin(t)]],
        // bottom face : bottom-right -> bottom-left
        [for (i=[0:n-1]) let(t = alpha - (2*alpha)*i/n) [R*sin(t), -cx + R*cos(t)]]
    );

module waisted_leg() {
    linear_extrude(height = leg_length)
        polygon(leg_poly(leg_size, leg_R, n=16));
}

// ---------------------------------------------------------
// Decorative bracket: seat + backrest
// ---------------------------------------------------------

// Seat plan-view profile: rectangle with semicircular front (R=50)
module seat_profile_2d() {
    difference() {
        union() {
            // rectangular rear part
            translate([-seat_width/2, 0])
                square([seat_width, seat_depth - 50]);
            // semicircular front feature
            translate([0, seat_depth - 50])
                circle(r = 50);
        }
        // diamond cutouts on top face
        for (p = [[0, 70], [-20, 50], [20, 50]])
            translate(p)
                rotate(45)
                    square([8, 8], center = true);
    }
}

// Backrest profile: pointed-leaf shape in x-y (becomes x-z after rotation)
backrest_pts = [
    [-50, 0],
    [-55, 30],
    [-50, 80],
    [-40, 130],
    [-20, 180],
    [0, backrest_h],
    [20, 180],
    [40, 130],
    [50, 80],
    [55, 30],
    [50, 0]
];

module backrest_solid() {
    difference() {
        linear_extrude(height = back_thick)
            polygon(backrest_pts);
        // diamond through-cutouts with tilted normals (~30°)
        for (p = [[0, 140], [-15, 120], [15, 120], [-15, 160], [15, 160]])
            translate([p[0], p[1], back_thick/2])
                rotate([30, 0, 45])
                    cube([10, 10, 10], center = true);
    }
}

module bracket() {
    // Horizontal seat
    linear_extrude(height = seat_thick)
        seat_profile_2d();

    // Vertical backrest plate (rotated to stand behind seat)
    translate([0, 0, 0])
        rotate([90, 0, 0])
            backrest_solid();
}

// ---------------------------------------------------------
// Assembly
// ---------------------------------------------------------
module assembly() {
    // Decorative bracket
    bracket();

    // Four waisted legs beneath seat
    leg_positions = [
        [-30, 20],
        [ 30, 20],
        [-30, 90],
        [ 30, 90]
    ];
    for (p = leg_positions)
        translate([p[0], p[1], -leg_length])
            waisted_leg();
}

assembly();