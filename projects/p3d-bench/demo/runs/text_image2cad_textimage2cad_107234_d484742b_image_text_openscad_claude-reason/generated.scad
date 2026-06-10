// =============================================
// Lipless Crankbait (VIB) Fishing Lure Assembly
// =============================================
// Parts: 1× fin plate, 2× head cap halves,
//        2× wire rings, 1× bearing boss, 2× eye features

$fn = 80;

// ============ PARAMETERS ============

// Fin plate (main structural body)
fin_L = 21.85;          // length along X
fin_H = 11.28;          // max height along Y
fin_T = 1.5;            // thickness along Z

// Head cap (ellipsoidal, 2 mirrored half-shells)
hd_cx = 2.0;            // X center on fin
hd_cy = 5.2;            // Y center on fin
hd_a  = 4.5;            // X semi-axis
hd_b  = 5.0;            // Y semi-axis
hd_c  = 3.8;            // Z semi-axis (outward bulge)
hd_w  = 0.8;            // shell wall thickness

// Eye / bearing feature
eye_R1   = 2.8;         // outer ring radius
eye_R2   = 1.7;         // inner boss radius
eye_bore = 0.65;        // center bore radius
eye_h    = 0.5;         // protrusion height
boss_r   = 1.0;         // bearing boss radius

// Dorsal ridge holes
hole_d = 1.5;           // bore diameter
cham   = 0.25;          // 45-degree chamfer depth

// Wire split rings
wR = 1.0;               // ring major radius
wr = 0.2;               // wire cross-section radius

// ============ HELPER MODULES ============

module torus(R, r) {
    rotate_extrude(convexity=4, $fn=48)
        translate([R, 0])
            circle(r=r, $fn=16);
}

// ============ FIN PLATE ============

// 2D freeform outline of the fin plate
module fin_2d() {
    polygon([
        // Tail tip
        [fin_L, 4.0],
        // Dorsal edge (tail → head)
        [20.0, 5.8],  [18.5, 7.5],  [17.0, 8.8],
        [15.5, 9.8],  [14.0, 10.5], [12.0, 11.0],
        [10.0, 11.2], [8.0, fin_H],  [6.5, 11.0],
        [5.0, 10.5],  [3.5, 9.5],
        // Concave arc at head (clears hub cap)
        [2.0, 7.8],  [1.0, 6.2],  [0.5, 5.2],
        [1.0, 4.0],  [2.0, 2.5],  [3.5, 1.3],
        // Ventral edge (head → tail)
        [5.0, 0.5],  [7.0, 0.1],  [9.0, 0.0],
        [11.0, 0.0], [13.0, 0.3], [15.0, 1.0],
        [17.0, 1.8], [19.0, 2.8], [20.5, 3.5]
    ]);
}

module fin_plate() {
    // Hole centers along dorsal ridge (inside polygon boundary)
    hx = [ 8.0, 10.5, 13.0, 15.5, 18.0];
    hy = [10.0,  9.85,  9.5,  8.55,  6.7];

    difference() {
        linear_extrude(fin_T, center=true)
            fin_2d();

        // Five through-holes with 45° chamfers
        for (i = [0:4]) {
            translate([hx[i], hy[i], 0]) {
                // Cylindrical bore
                cylinder(d=hole_d, h=fin_T + 2, center=true);
                // Top face chamfer
                translate([0, 0, fin_T/2 - cham])
                    cylinder(d1=hole_d, d2=hole_d + 2*cham,
                             h=cham + 0.01);
                // Bottom face chamfer
                translate([0, 0, -fin_T/2 - 0.01])
                    cylinder(d1=hole_d + 2*cham, d2=hole_d,
                             h=cham + 0.01);
            }
        }
    }
}

// ============ HEAD CAP HALF-SHELL ============

module cap_half() {
    translate([hd_cx, hd_cy, 0])
    intersection() {
        difference() {
            // Outer ellipsoid (faceted for multi-faceted look)
            scale([hd_a, hd_b, hd_c])
                sphere(r=1, $fn=16);
            // Inner cavity
            scale([hd_a - hd_w, hd_b - hd_w, hd_c - hd_w])
                sphere(r=1, $fn=16);
        }
        // Keep only the +Z half
        translate([0, 0, 25]) cube(50, center=true);
    }
}

// ============ EYE FEATURE ============

module eye_feat() {
    // Concentric ring eye boss, built at origin pointing +Z
    difference() {
        union() {
            // Outer raised ring
            difference() {
                cylinder(r=eye_R1, h=eye_h, $fn=60);
                translate([0, 0, -0.05])
                    cylinder(r=eye_R1 - 0.45, h=eye_h + 0.1, $fn=60);
            }
            // Inner raised boss disc
            cylinder(r=eye_R2, h=eye_h * 0.6, $fn=60);
        }
        // Central bore through all
        translate([0, 0, -0.5])
            cylinder(r=eye_bore, h=eye_h + 2, $fn=30);
    }
}

// ============ BEARING BOSS ============

module bearing_boss() {
    translate([hd_cx, hd_cy, 0])
    difference() {
        cylinder(r=boss_r, h=2*hd_c + 1, center=true, $fn=40);
        cylinder(r=eye_bore, h=2*hd_c + 2, center=true, $fn=30);
    }
}

// ============ WIRE RING WITH ATTACHMENT PIN ============

module ring_assembly(pin_length) {
    // Thin connecting pin along +Z, then torus at end
    cylinder(r=wr * 1.5, h=pin_length, $fn=12);
    translate([0, 0, pin_length])
        rotate([90, 0, 0])
            torus(wR, wr);
}

// ============ FULL ASSEMBLY ============

union() {
    // 1. Fin plate (main body)
    fin_plate();

    // 2. Head cap — top half-shell
    cap_half();

    // 3. Head cap — bottom half-shell (mirror pair)
    mirror([0, 0, 1])
        cap_half();

    // 4. Eye feature — +Z side
    translate([hd_cx, hd_cy, hd_c - 0.15])
        eye_feat();

    // 5. Eye feature — -Z side (mirror pair)
    translate([hd_cx, hd_cy, -(hd_c - 0.15)])
        mirror([0, 0, 1])
            eye_feat();

    // 6. Central bearing boss
    bearing_boss();

    // 7. Belly wire ring (ventral, hangs downward)
    translate([12, 0.1, 0])
        rotate([90, 0, 0])  // pin goes along -Y
            ring_assembly(wR + 0.2);

    // 8. Tail wire ring (caudal, extends past tail tip)
    translate([fin_L - 0.1, 4.0, 0])
        rotate([0, -90, 0])  // pin goes along +X
            ring_assembly(wR + 0.2);
}