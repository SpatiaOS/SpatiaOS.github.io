// Parametric mechanical assembly reconstruction
// Overall bounding envelope ~600 × 501 × 527 mm

$fn = 80;

// ----- Global dimensions -----
// Flat bar (top rail)
FLAT_L = 600;
FLAT_W = 50;
FLAT_T = 10;

// Triangular linkage bracket
TB_T        = 80;          // plate thickness (Y)
TB_R        = [180, 0, 0]; // right vertex (40 mm bore)
TB_TOP      = [-50, 0, 160];   // top vertex (40 mm bore)
TB_LL       = [-180, 0, -120]; // lower-left vertex (30 mm bore)
TB_BOSS_D   = 70;
TB_HOLE_40_D= 40;
TB_HOLE_40_L= 100;
TB_HOLE_30_D= 30;

// Right support tower (inferred from image)
TOWER_X     = 260;
TOWER_W     = 90;   // X-thickness
TOWER_D     = 100;  // Y-depth
TOWER_H     = 440;  // Z-height
TOWER_Z_CEN = 60;

// U-shaped curved link arm
LA_BOSS_D   = 60;
LA_HOLE_D   = 40;
LA_BODY_D   = 55;
LA_P1       = [-50, 80, 160];   // upper boss
LA_P2       = [-180, 80, -120]; // lower boss
LA_MID      = [-130, 150, 20];  // outward curve control point

// Pulley disc
PULLEY_OD   = 230;
PULLEY_T    = 61;
PULLEY_HUB_OD = 140;
PULLEY_HUB_T  = 78;
PULLEY_BOLT_DR= 14;
PULLEY_BC_R = 48;           // bolt-circle radius
PULLEY_NOTCHES = 30;

// Pins / shafts
PIN40_D = 40;
PIN40_L = 120;
PIN30_D = 30;
PIN30_L = 110;

// ----- Modules -----

module flat_bar() {
    translate([0, 0, 250])
        cube([FLAT_L, FLAT_W, FLAT_T], center=true);
}

module right_tower() {
    difference() {
        union() {
            // vertical web
            translate([TOWER_X, 0, TOWER_Z_CEN])
                cube([TOWER_W, TOWER_D, TOWER_H], center=true);
            // top flange tying into flat bar
            translate([TOWER_X - 10, 0, 250 - FLAT_T/2 - 15])
                cube([TOWER_W + 60, TOWER_D, 30], center=true);
            // bottom foot
            translate([TOWER_X + 10, 0, -150])
                cube([TOWER_W + 50, TOWER_D + 20, 40], center=true);
        }
        // pocket that receives the bracket right boss
        translate([TB_R[0] + 25, 0, TB_R[2]])
            cube([90, TB_BOSS_D + 10, TB_BOSS_D + 10], center=true);
        // coaxial 40 mm bore
        translate([TOWER_X, 0, TB_R[2]])
            rotate([0, 90, 0])
            cylinder(d=TB_HOLE_40_D + 2, h=TOWER_W + 80, center=true);
    }
}

module triangular_bracket() {
    // Main web – flat triangular frame with central cutout
    translate([0, -TB_T/2, 0])
        linear_extrude(height=TB_T, convexity=4)
            offset(r=12)
            difference() {
                polygon([
                    [TB_R[0],   TB_R[2]],
                    [TB_TOP[0], TB_TOP[2]],
                    [TB_LL[0],  TB_LL[2]]
                ]);
                polygon([
                    [TB_R[0]*0.30,   TB_R[2]*0.10 + 15],
                    [TB_TOP[0]*0.45, TB_TOP[2]*0.45],
                    [TB_LL[0]*0.40,  TB_LL[2]*0.20]
                ]);
            }

    // Right boss – 40 mm hole on X-axis
    translate(TB_R)
        rotate([0, 90, 0])
        difference() {
            cylinder(d=TB_BOSS_D, h=TB_HOLE_40_L, center=true);
            cylinder(d=TB_HOLE_40_D, h=TB_HOLE_40_L + 2, center=true);
        }

    // Top boss – 40 mm hole on X-axis
    translate(TB_TOP)
        rotate([0, 90, 0])
        difference() {
            cylinder(d=TB_BOSS_D, h=TB_HOLE_40_L, center=true);
            cylinder(d=TB_HOLE_40_D, h=TB_HOLE_40_L + 2, center=true);
        }

    // Lower-left clevis – 30 mm hole on Y-axis (pulley axle)
    translate(TB_LL)
        rotate([90, 0, 0])
        difference() {
            union() {
                cylinder(d=52, h=32, center=true);
                translate([0, 0,  18]) cylinder(d=44, h=8, center=true);
                translate([0, 0, -18]) cylinder(d=44, h=8, center=true);
            }
            cylinder(d=TB_HOLE_30_D, h=70, center=true);
        }
}

module link_arm() {
    // Swept B-spline-like body via convex hull of spheres
    hull() {
        translate(LA_P1) sphere(d=LA_BODY_D);
        translate(LA_MID) sphere(d=LA_BODY_D);
        translate(LA_P2) sphere(d=LA_BODY_D);
    }

    // Upper cylindrical boss
    translate(LA_P1)
        rotate([0, 90, 0])
        difference() {
            cylinder(d=LA_BOSS_D, h=80, center=true);
            cylinder(d=LA_HOLE_D, h=82, center=true);
        }

    // Lower cylindrical boss
    translate(LA_P2)
        rotate([0, 90, 0])
        difference() {
            cylinder(d=LA_BOSS_D, h=80, center=true);
            cylinder(d=LA_HOLE_D, h=82, center=true);
        }

    // Small spherical contact feature (visible bump toward bracket)
    translate([-120, 95, 30])
        sphere(d=22);
}

module pulley_disc() {
    // Planar mating face sits against the lower-left clevis (Y+ side)
    translate([TB_LL[0], 56, TB_LL[2]])
        rotate([90, 0, 0])
        difference() {
            union() {
                // main disc
                cylinder(d=PULLEY_OD, h=PULLEY_T, center=true);
                // stepped hub
                cylinder(d=PULLEY_HUB_OD, h=PULLEY_HUB_T, center=true);
            }
            // central bore
            cylinder(d=36, h=PULLEY_HUB_T + 2, center=true);
            // five bolt-circle holes
            for (i = [0:4])
                rotate([0, 0, i * 360/5])
                    translate([PULLEY_BC_R, 0, 0])
                    cylinder(d=PULLEY_BOLT_DR, h=PULLEY_HUB_T + 2, center=true);
            // periodic rim notches
            for (i = [0:PULLEY_NOTCHES-1])
                rotate([0, 0, i * 360/PULLEY_NOTCHES])
                    translate([PULLEY_OD/2, 0, 0])
                    cylinder(d=8, h=PULLEY_T + 2, center=true);
        }
}

module pin_40(pos) {
    translate(pos)
        rotate([0, 90, 0])
        cylinder(d=PIN40_D, h=PIN40_L, center=true);
}

module pin_30_y(pos, len) {
    translate(pos)
        rotate([90, 0, 0])
        cylinder(d=PIN30_D, h=len, center=true);
}

// ----- Assembly -----
union() {
    flat_bar();
    right_tower();
    triangular_bracket();
    link_arm();
    pulley_disc();

    // Four identical 40 mm pins – two in bracket bores, two in link-arm bores
    pin_40(TB_R);       // bracket right vertex
    pin_40(TB_TOP);     // bracket top vertex
    pin_40(LA_P1);      // link arm upper boss
    pin_40(LA_P2);      // link arm lower boss

    // 30 mm pin through lower-left clevis and pulley hub
    pin_30_y(TB_LL, PIN30_L + 20);
};