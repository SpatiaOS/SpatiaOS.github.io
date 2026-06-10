// Stylized Gothic Throne Chair Assembly
// Decorative bracket (seat + backrest) with 4 waisted column legs
$fn = 60;

// ===== Parameters =====
// Leg dimensions
leg_sz    = 25;       // Cross-section size
leg_h     = 100;      // Height
waist_r   = 137;      // Concave cylinder radius for waisted profile
waist_d   = 4;        // Max concavity depth at mid-height

// Seat platform
seat_w    = 96;       // Width (X)
seat_d    = 95;       // Depth (Y)
seat_t    = 14;       // Thickness (Z)
seat_z    = leg_h;    // Bottom Z position

// Backrest panel
back_w    = 92;       // Width
back_h    = 200;      // Height from seat bottom
back_t    = 6;        // Thickness

// Side arc decorations
arc_r     = 38;       // Semicircle radius (~R50 scaled for fit)
arc_wall  = 10;       // Arch wall thickness (right side)
arc_oh    = 7;        // Overhang past seat edge

// Leg layout
leg_ix    = 10;       // Inset from seat edge X
leg_iy    = 8;        // Inset from seat edge Y

// ===== Waisted Column =====
// Square column with concave cylindrical faces creating hourglass profile
module waisted_column() {
    o = waist_r - waist_d;
    difference() {
        cube([leg_sz, leg_sz, leg_h]);
        // Horizontal cylinders centered at mid-height carve each face
        translate([-1, -o, leg_h/2])
            rotate([0,90,0]) cylinder(h=leg_sz+2, r=waist_r);
        translate([-1, leg_sz+o, leg_h/2])
            rotate([0,90,0]) cylinder(h=leg_sz+2, r=waist_r);
        translate([-o, -1, leg_h/2])
            rotate([-90,0,0]) cylinder(h=leg_sz+2, r=waist_r);
        translate([leg_sz+o, -1, leg_h/2])
            rotate([-90,0,0]) cylinder(h=leg_sz+2, r=waist_r);
    }
}

// ===== Diamond Prism (for cutouts/engravings) =====
module diamond(sz, dp) {
    rotate([0,0,45])
        cube([sz/sqrt(2), sz/sqrt(2), dp], center=true);
}

// ===== 2D Leaf/Teardrop Profile =====
// Pointed at top, widest at ~30% height
module leaf_2d(w, h) {
    hull() {
        translate([0, h*0.30]) circle(d=w, $fn=80);
        translate([0, h*0.96]) circle(d=1.5, $fn=16);
        circle(d=w*0.1, $fn=20);
    }
}

// ===== Leaf Groove =====
// 3D outline of leaf shape for engraving on front face
// Oriented: +Y = into face, +Z = upward
module leaf_groove(w, h, line_w, depth) {
    rotate([90, 0, 0])
        translate([0, 0, -depth])
            linear_extrude(height = depth + 0.01)
                difference() {
                    leaf_2d(w, h);
                    offset(delta = -line_w)
                        leaf_2d(w, h);
                }
}

// ===== Half Dome =====
// Flat base at z=0, dome to z=r, extends along +Y for len
module half_dome(r, len) {
    intersection() {
        rotate([-90,0,0]) cylinder(h=len, r=r, $fn=60);
        translate([-r, 0, 0]) cube([2*r, len, r]);
    }
}

// ===== Backrest Panel =====
// Tall panel with engraved leaf contour and diamond through-cutouts
module backrest() {
    lw = back_w * 0.76;
    lh = back_h * 0.87;
    cx = back_w / 2;
    cz = back_h * 0.36;

    difference() {
        cube([back_w, back_t, back_h]);

        // Engraved leaf outline on front face (y=0)
        translate([cx, 0, back_h * 0.02])
            leaf_groove(lw, lh, 2, 1.8);

        // Diamond through-cutouts in cross pattern
        for (a = [45, 135, 225, 315])
            translate([cx + 13*cos(a), back_t/2, cz + 13*sin(a)])
                rotate([90,0,0])
                    diamond(10, back_t + 4);
    }
}

// ===== Seat Platform with Side Arcs =====
// Rectangular seat with semicircular dome (left) and arch (right)
module seat_with_arcs() {
    ay = (seat_d - 2*arc_r) / 2;  // Y offset to center arcs on seat

    difference() {
        union() {
            // Main rectangular platform
            cube([seat_w, seat_d, seat_t]);

            // Left side: solid semicylinder dome
            translate([arc_r - arc_oh, ay, seat_t])
                half_dome(arc_r, 2*arc_r);

            // Right side: hollow arch (semicylinder shell)
            translate([seat_w - arc_r + arc_oh, ay, seat_t])
                difference() {
                    half_dome(arc_r, 2*arc_r);
                    translate([0, -1, 0])
                        half_dome(arc_r - arc_wall, 2*arc_r + 2);
                }
        }

        // Diamond engravings on seat top surface
        translate([seat_w*0.35, seat_d*0.40, seat_t])
            diamond(14, 5);
        translate([seat_w*0.57, seat_d*0.55, seat_t])
            diamond(11, 5);
    }
}

// ===== Main Assembly =====
union() {
    // Decorative bracket: seat + backrest
    translate([0, 0, seat_z]) {
        seat_with_arcs();

        // Backrest centered at rear of seat
        translate([(seat_w - back_w)/2, seat_d - back_t, 0])
            backrest();
    }

    // Four waisted column legs at seat corners
    // Front-left
    translate([leg_ix, leg_iy, 0])
        waisted_column();
    // Front-right
    translate([seat_w - leg_ix - leg_sz, leg_iy, 0])
        waisted_column();
    // Back-left
    translate([leg_ix, seat_d - leg_iy - leg_sz, 0])
        waisted_column();
    // Back-right
    translate([seat_w - leg_ix - leg_sz, seat_d - leg_iy - leg_sz, 0])
        waisted_column();
}