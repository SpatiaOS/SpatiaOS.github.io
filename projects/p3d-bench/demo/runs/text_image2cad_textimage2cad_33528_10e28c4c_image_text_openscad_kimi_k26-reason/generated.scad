// DJ Controller Assembly – Unified Model
// Coordinate system: Z-up, X = length, Y = depth

$fn = 60;

// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
ASM_LEN   = 309;
ASM_WID   = 247;
ASM_HT    = 65;

// Base plate
BASE_LEN  = 309;
BASE_WID  = 245;
BASE_HT   = 28;

// Housing cover
COVER_LEN = 300;
COVER_WID = 230;
COVER_HT  = 45;
COVER_CHAMFER = 3;
COVER_FILLET  = 1.0;
COVER_TOP_Z   = ASM_HT;
COVER_BOT_Z   = ASM_HT - COVER_HT;

// Jog-wheel caps
CAP_DIA      = 86;
CAP_HT       = 20;
CAP_STEP_DIA = 60.5;
CAP_STEP_HT  = 1;
CAP_BOSS_DIA = 5;
CAP_SKIRT_DIA= 92;
CAP_SLOTS    = 14;
CAP_SLOT_W   = 2.5;
CAP_SLOT_L   = 8;

// Tactile spacer blocks
SPACER_W = 18.87;
SPACER_D = 12.09;
SPACER_H = 5.0;
SPACER_FILLET = 2.0;

// Socket posts
SOCKET_BASE_DIA = 14.89;
SOCKET_HT       = 17;
SOCKET_HOLE_DIA = 1.178;

// Control pins
PIN_DIA = 1.5;
PIN_HT  = 11;

// Front-panel bushings (jacks)
BUSH_FLANGE_DIA = 18.2;
BUSH_BORE_DIA   = 4.92;
BUSH_BOSS_R     = 5.03;
BUSH_BOSS_LEN   = 5;
BUSH_DEPTH      = 10;

// Wedge guides & structural bars
WEDGE_W = 8;
WEDGE_D = 14;
WEDGE_H = 18;
BAR_W   = 1.10;
BAR_D   = 2.00;
BAR_H   = 20.0;

// Ball studs
STUD_HEAD_DIA = 18.2;
STUD_HT       = 10;
STUD_BORE_DIA = 4.92;

// Locating pins
LOC_PIN_DIA     = 14.9;
LOC_PIN_HT      = 17;
LOC_PIN_HOLE_DIA= 1.178;

// ------------------------------------------------------------------
// Part positions
// ------------------------------------------------------------------
CAP1_POS = [-85, -50];
CAP2_POS = [ 85,  50];

SPACER_POS = [
    [-130,-90], [-110,-90], [-130,-70], [-110,-70],
    [ -90,-110], [ -70,-110],
    [ -40,-100], [ -20,-100], [  20,-100], [  40,-100],
    [  90,-60], [ 110,-60], [ 130,-60],
    [  90,-30], [ 110,-30], [ 130,-30],
    [  90,  0], [ 110,  0], [ 130,  0],
    [  90, 60], [ 110, 60], [ 130, 60],
    [  90, 80], [ 110, 80],
    [ -20, 80], [   0, 80]
];

SOCKET_POS = [
    [-60,-50], [-30,-50], [0,-50], [30,-50],
    [ 60, 20], [ 90, 20],
    [-90, 40],
    [120, 60]
];

PIN_POS = [
    [-60,-50], [-30,-50], [0,-50], [30,-50],
    [ 60, 20], [ 90, 20], [120, 60],
    [-90, 40], [-120,-20], [140,0], [0,60]
];

BUSH_POS = [
    [-100, -COVER_WID/2 + 8],
    [ -75, -COVER_WID/2 + 8],
    [ -50, -COVER_WID/2 + 8],
    [-100, -COVER_WID/2 + 28],
    [ -75, -COVER_WID/2 + 28],
    [ -50, -COVER_WID/2 + 28]
];

// ------------------------------------------------------------------
// Helper modules
// ------------------------------------------------------------------
module rounded_rect(w, d, r) {
    offset(r = r)
        square([w - 2*r, d - 2*r], center=true);
}

// ------------------------------------------------------------------
// Housing cover (top shell)
// ------------------------------------------------------------------
module housing_cover() {
    difference() {
        union() {
            // Main block
            translate([0, 0, (COVER_TOP_Z + COVER_BOT_Z)/2])
                cube([COVER_LEN, COVER_WID, COVER_HT], center=true);

            // Corner bosses
            for (sx = [-1, 1], sy = [-1, 1])
                translate([sx*(COVER_LEN/2-10), sy*(COVER_WID/2-10), COVER_TOP_Z-4])
                    cube([20, 20, 8], center=true);

            // Side protruding tab
            translate([-COVER_LEN/2-6, -COVER_WID/2+20, COVER_TOP_Z-6])
                cube([12, 40, 12], center=true);
        }

        // 45° chamfers on upper perimeter edges
        ch = COVER_CHAMFER;
        for (sx = [-1, 1])
            translate([sx*COVER_LEN/2, 0, COVER_TOP_Z])
                rotate([0, 0, 45])
                    cube([ch*sqrt(2), COVER_WID+2, ch*sqrt(2)], center=true);

        for (sy = [-1, 1])
            translate([0, sy*COVER_WID/2, COVER_TOP_Z])
                rotate([45, 0, 0])
                    cube([COVER_LEN+2, ch*sqrt(2), ch*sqrt(2)], center=true);

        // Rectangular cutouts for spacer blocks (3 mm pockets)
        for (p = SPACER_POS)
            translate([p[0], p[1], COVER_TOP_Z - 2])
                linear_extrude(height=4, center=true)
                    rounded_rect(SPACER_W, SPACER_D, COVER_FILLET);

        // Circular recesses for jog wheels
        for (p = [CAP1_POS, CAP2_POS])
            translate([p[0], p[1], COVER_TOP_Z - 2])
                cylinder(d=CAP_DIA+4, h=4, center=true);

        // Socket-post counterbores
        for (p = SOCKET_POS)
            translate([p[0], p[1], COVER_TOP_Z - 5])
                cylinder(d=SOCKET_BASE_DIA, h=10, center=true);

        // Pin through-holes
        for (p = PIN_POS)
            translate([p[0], p[1], COVER_TOP_Z - 5])
                cylinder(d=PIN_DIA+0.5, h=10, center=true);

        // Front-panel jack holes
        for (p = BUSH_POS)
            translate([p[0], p[1], ASM_HT/2])
                rotate([90, 0, 0])
                    cylinder(d=BUSH_BORE_DIA+2, h=15, center=true);

        // Blind holes on side faces
        translate([COVER_LEN/2-15, 0, COVER_BOT_Z+8])
            rotate([0, -90, 0])
                cylinder(d=6.9, h=12, center=true);
        translate([-COVER_LEN/2+15, 0, COVER_BOT_Z+8])
            rotate([0, 90, 0])
                cylinder(d=8.9, h=12, center=true);
    }
}

// ------------------------------------------------------------------
// Base plate (bottom chassis)
// ------------------------------------------------------------------
module base_plate() {
    difference() {
        union() {
            translate([0, 0, BASE_HT/2])
                cube([BASE_LEN, BASE_WID, BASE_HT], center=true);

            // Stepped tabs along front / back lower edges
            for (sy = [-1, 1])
                translate([0, sy*(BASE_WID/2-5), BASE_HT/2])
                    cube([BASE_LEN-40, 10, BASE_HT-4], center=true);
        }

        // Corner notch chamfers
        for (sx = [-1, 1], sy = [-1, 1])
            translate([sx*BASE_LEN/2, sy*BASE_WID/2, 0])
                rotate([0, 0, sx*sy*45])
                    cube([30, 30, BASE_HT+2], center=true);

        // Elongated surface grooves
        for (x = [-100:50:100])
            translate([x, 0, BASE_HT-1])
                cube([3, BASE_WID-40, 2], center=true);

        // Blind holes
        translate([-BASE_LEN/2+25, -BASE_WID/2+25, BASE_HT/2])
            cylinder(d=6.9, h=12, center=true);
        translate([BASE_LEN/2-25, BASE_WID/2-25, BASE_HT/2])
            cylinder(d=8.9, h=12, center=true);
    }
}

// ------------------------------------------------------------------
// Jog-wheel cap
// ------------------------------------------------------------------
module cap() {
    difference() {
        union() {
            // Main disc
            cylinder(d=CAP_DIA, h=CAP_HT, center=true);

            // Tapered skirt
            translate([0, 0, -CAP_HT/2])
                cylinder(d1=CAP_SKIRT_DIA, d2=CAP_DIA, h=3, center=true);

            // Raised plateau
            translate([0, 0, CAP_HT/2 - CAP_STEP_HT/2])
                cylinder(d=CAP_STEP_DIA, h=CAP_STEP_HT, center=true);

            // Hemispherical indicator boss
            translate([0, 0, CAP_HT/2])
                sphere(d=CAP_BOSS_DIA);
        }

        // Peripheral slots
        for (i = [0:CAP_SLOTS-1])
            rotate([0, 0, i*360/CAP_SLOTS])
                translate([CAP_DIA/2, 0, 0])
                    rotate([0, 90, 0])
                        linear_extrude(height=5, center=true)
                            rounded_rect(CAP_SLOT_W, CAP_SLOT_L, 0.5);
    }
}

// ------------------------------------------------------------------
// Spacer block (pillow-top button)
// ------------------------------------------------------------------
module spacer_block() {
    hull() {
        translate([0, 0, -SPACER_H/2 + 0.5])
            cube([SPACER_W, SPACER_D, 1], center=true);
        translate([0, 0, SPACER_H/2 - SPACER_FILLET])
            minkowski() {
                cube([SPACER_W-2*SPACER_FILLET, SPACER_D-2*SPACER_FILLET, 0.01], center=true);
                sphere(r=SPACER_FILLET);
            }
    }
}

// ------------------------------------------------------------------
// Socket post (bell-shaped receptacle)
// ------------------------------------------------------------------
module socket_post() {
    difference() {
        union() {
            cylinder(d=SOCKET_BASE_DIA, h=3, center=true);
            translate([0, 0, 1.5])
                cylinder(d1=SOCKET_BASE_DIA, d2=4, h=SOCKET_HT-3, center=true);
            translate([0, 2, SOCKET_HT-2])
                cube([4, 4, 4], center=true);
        }
        cylinder(d=SOCKET_HOLE_DIA, h=SOCKET_HT+2, center=true);
    }
}

// ------------------------------------------------------------------
// Control pin
// ------------------------------------------------------------------
module pin() {
    cylinder(d=PIN_DIA, h=PIN_HT, center=true);
}

// ------------------------------------------------------------------
// Flanged bushing (front-panel jack)
// ------------------------------------------------------------------
module flanged_bushing() {
    rotate([-90, 0, 0])
    difference() {
        union() {
            cylinder(d=BUSH_FLANGE_DIA, h=2, center=true);
            translate([0, 0, BUSH_BOSS_LEN/2])
                cylinder(r=BUSH_BOSS_R, h=BUSH_BOSS_LEN, center=true);
        }
        cylinder(d=BUSH_BORE_DIA, h=BUSH_DEPTH+2, center=true);
        translate([0, 0, -1])
            cylinder(d1=BUSH_BORE_DIA, d2=BUSH_BORE_DIA+2, h=2, center=true);
    }
}

// ------------------------------------------------------------------
// Wedge guide block
// ------------------------------------------------------------------
module wedge_guide_block() {
    difference() {
        linear_extrude(height=WEDGE_H, center=true)
            polygon([
                [-WEDGE_W/2, -WEDGE_D/2],
                [ WEDGE_W/2, -WEDGE_D/2],
                [ WEDGE_W/2-2,  WEDGE_D/2],
                [-WEDGE_W/2+2,  WEDGE_D/2]
            ]);
        translate([0, 0, WEDGE_H/2-1])
            linear_extrude(height=2, center=true)
                polygon([
                    [-WEDGE_W/2+2, -WEDGE_D/2+2],
                    [ WEDGE_W/2-2, -WEDGE_D/2+2],
                    [ 0,  WEDGE_D/2-2]
                ]);
    }
}

// ------------------------------------------------------------------
// Structural bar
// ------------------------------------------------------------------
module structural_bar() {
    cube([BAR_W, BAR_D, BAR_H], center=true);
}

// ------------------------------------------------------------------
// Ball stud
// ------------------------------------------------------------------
module ball_stud() {
    difference() {
        union() {
            sphere(d=STUD_HEAD_DIA);
            translate([0, 0, -STUD_HT/2])
                cylinder(d=STUD_HEAD_DIA*0.6, h=STUD_HT, center=true);
        }
        cylinder(d=STUD_BORE_DIA, h=STUD_HT+2, center=true);
    }
}

// ------------------------------------------------------------------
// Locating pin (mushroom head)
// ------------------------------------------------------------------
module locating_pin() {
    difference() {
        union() {
            scale([1, 1, 0.6])
                sphere(d=LOC_PIN_DIA);
            translate([0, 0, -LOC_PIN_HT*0.3])
                cylinder(d1=LOC_PIN_DIA*0.5, d2=LOC_PIN_DIA, h=LOC_PIN_HT*0.3, center=true);
            translate([0, 0, -LOC_PIN_HT*0.7])
                cylinder(d=LOC_PIN_DIA*0.5, h=LOC_PIN_HT*0.5, center=true);
        }
        translate([0, 0, -LOC_PIN_HT*0.7])
            rotate([90, 0, 0])
                cylinder(d=LOC_PIN_HOLE_DIA, h=LOC_PIN_DIA, center=true);
    }
}

// ------------------------------------------------------------------
// Assembly
// ------------------------------------------------------------------
union() {
    // 1. Base plate
    base_plate();

    // 2. Housing cover
    housing_cover();

    // 3. Jog wheels (seated in recesses, floor at Z = 61)
    for (p = [CAP1_POS, CAP2_POS])
        translate([p[0], p[1], COVER_TOP_Z - 4 + CAP_HT/2])
            cap();

    // 4. Spacer blocks (tactile pads)
    for (p = SPACER_POS)
        translate([p[0], p[1], COVER_TOP_Z - 4 + SPACER_H/2])
            spacer_block();

    // 5. Socket posts
    for (p = SOCKET_POS)
        translate([p[0], p[1], COVER_TOP_Z + SOCKET_HT/2])
            socket_post();

    // 6. Control pins
    for (p = PIN_POS)
        translate([p[0], p[1], COVER_TOP_Z + PIN_HT/2])
            pin();

    // 7. Front-panel flanged bushings
    for (p = BUSH_POS)
        translate([p[0], p[1], ASM_HT/2])
            flanged_bushing();

    // 8. Central wedge guide blocks (3-fold rotational)
    for (i = [0:2])
        rotate([0, 0, i*120])
            translate([0, 20, COVER_TOP_Z + WEDGE_H/2])
                wedge_guide_block();

    // 9. Structural bars (3-fold rotational, offset)
    for (i = [0:2])
        rotate([0, 0, i*120 + 60])
            translate([0, 25, COVER_TOP_Z + BAR_H/2])
                structural_bar();

    // 10. Ball studs
    for (x = [-100, 100])
        translate([x, 60, COVER_TOP_Z + STUD_HT/2])
            ball_stud();

    // 11. Locating pins
    for (i = [0:2])
        let(a = i*120, r = 120)
            translate([r*cos(a), r*sin(a), COVER_TOP_Z])
                locating_pin();
}