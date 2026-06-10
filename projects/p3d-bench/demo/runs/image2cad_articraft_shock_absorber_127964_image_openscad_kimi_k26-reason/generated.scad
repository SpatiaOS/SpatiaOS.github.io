// ==========================================
// Parametric Coilover Shock Absorber
// ==========================================

$fn = 100;

// --- General ---
TOL = 0.01;

// --- Spring ---
SPRING_OD = 22;
SPRING_WIRE = 2.5;
SPRING_LENGTH = 42;
SPRING_COILS = 5.5;
SPRING_MEAN_RADIUS = (SPRING_OD - SPRING_WIRE) / 2;

// --- Shock Body & Rod ---
BODY_DIA = 10;
BODY_LENGTH = 40;       // from lower perch top to body top
ROD_DIA = 6;

// --- Perches ---
LOWER_PERCH_DIA = 24;
LOWER_PERCH_THICK = 3;
LOWER_NOTCH_WIDTH = 3;
LOWER_NOTCH_DEPTH = 2;

UPPER_PERCH_DIA = 24;
UPPER_PERCH_THICK = 2;

// --- Bottom Mount ---
BOTTOM_BARREL_DIA = 10;
BOTTOM_BARREL_LENGTH = 12;
BOTTOM_BARREL_HOLE = 4;
BOTTOM_BASE_HEIGHT = 5; // body section between barrel and lower perch

// --- Top Mount ---
TOP_POST_HEIGHT = 8;
TOP_BARREL_DIA = 9;
TOP_BARREL_LENGTH = 10;
TOP_BARREL_HOLE = 3.5;

// --- Adjuster / Castellated Nut ---
ADJUSTER_CORE_DIA = 12;
ADJUSTER_OUTER_DIA = 18;
ADJUSTER_HEIGHT = 5;
ADJUSTER_TEETH = 8;
ADJUSTER_TOOTH_WIDTH = 3;

// --- Derived Z Positions ---
Z_BOTTOM_BARREL_CENTER = BOTTOM_BARREL_DIA / 2;
Z_BODY_BOTTOM = BOTTOM_BARREL_DIA;
Z_LOWER_PERCH_BOTTOM = Z_BODY_BOTTOM + BOTTOM_BASE_HEIGHT;
Z_LOWER_PERCH_TOP = Z_LOWER_PERCH_BOTTOM + LOWER_PERCH_THICK;
Z_BODY_TOP = Z_LOWER_PERCH_TOP + BODY_LENGTH;
Z_SPRING_BOTTOM = Z_LOWER_PERCH_TOP;
Z_SPRING_TOP = Z_SPRING_BOTTOM + SPRING_LENGTH;
Z_UPPER_PERCH_BOTTOM = Z_SPRING_TOP;
Z_UPPER_PERCH_TOP = Z_UPPER_PERCH_BOTTOM + UPPER_PERCH_THICK;
Z_ADJUSTER_BOTTOM = Z_UPPER_PERCH_TOP;
Z_ADJUSTER_TOP = Z_ADJUSTER_BOTTOM + ADJUSTER_HEIGHT;
Z_TOP_BARREL_CENTER = Z_ADJUSTER_TOP + TOP_POST_HEIGHT + TOP_BARREL_DIA / 2;

// --- Modules ---

// Eyelet barrel with perpendicular hole
module eyelet_barrel(dia, length, hole_dia, axis="x") {
    rot = axis == "x" ? [0, 90, 0] : [90, 0, 0];
    difference() {
        rotate(rot) cylinder(d=dia, h=length, center=true);
        rotate(rot) cylinder(d=hole_dia, h=length + 2, center=true);
    }
}

// Castellated adjustment nut
module castellated_nut(core_dia, outer_dia, height, teeth, tooth_width) {
    tooth_radial = (outer_dia - core_dia) / 2;
    union() {
        cylinder(d=core_dia, h=height);
        for (i = [0 : teeth - 1]) {
            rotate([0, 0, i * 360 / teeth])
            translate([core_dia / 2 - TOL, -tooth_width / 2, 0])
            cube([tooth_radial + TOL, tooth_width, height]);
        }
    }
}

// Lower spring perch with side notch
module lower_perch(dia, thick, notch_width, notch_depth) {
    difference() {
        cylinder(d=dia, h=thick);
        translate([dia / 2 - notch_depth / 2, 0, thick / 2])
        cube([notch_depth + 2, notch_width, thick + 2], center=true);
    }
}

// Fast helical coil spring using linear_extrude with twist
// Extrudes a circle offset from the Z axis while twisting it, producing a
// coiled tube with circular cross-section. This is manifold and exports
// orders of magnitude faster than hulling a chain of spheres.
module coil_spring(mean_radius, length, turns, wire_dia) {
    slices = max(20, ceil(turns * 24));
    linear_extrude(height=length, twist=turns * 360, slices=slices, convexity=10)
    translate([mean_radius, 0])
    circle(d=wire_dia);
}

// --- Assembly ---
union() {
    // Bottom eyelet (oriented along Y, perpendicular to top)
    translate([0, 0, Z_BOTTOM_BARREL_CENTER])
    eyelet_barrel(dia=BOTTOM_BARREL_DIA, length=BOTTOM_BARREL_LENGTH, hole_dia=BOTTOM_BARREL_HOLE, axis="y");

    // Main shock body tube (extends from bottom eyelet to rod transition)
    translate([0, 0, Z_BODY_BOTTOM])
    cylinder(d=BODY_DIA, h=BOTTOM_BASE_HEIGHT + LOWER_PERCH_THICK + BODY_LENGTH);

    // Lower spring perch with retention notch
    translate([0, 0, Z_LOWER_PERCH_BOTTOM])
    lower_perch(dia=LOWER_PERCH_DIA, thick=LOWER_PERCH_THICK, notch_width=LOWER_NOTCH_WIDTH, notch_depth=LOWER_NOTCH_DEPTH);

    // Coil spring centered between perches
    translate([0, 0, Z_SPRING_BOTTOM + SPRING_WIRE / 2])
    coil_spring(mean_radius=SPRING_MEAN_RADIUS, length=SPRING_LENGTH - SPRING_WIRE, turns=SPRING_COILS, wire_dia=SPRING_WIRE);

    // Shock rod extending from body top to top eyelet
    translate([0, 0, Z_BODY_TOP])
    cylinder(d=ROD_DIA, h=Z_TOP_BARREL_CENTER - Z_BODY_TOP);

    // Upper spring perch
    translate([0, 0, Z_UPPER_PERCH_BOTTOM])
    cylinder(d=UPPER_PERCH_DIA, h=UPPER_PERCH_THICK);

    // Castellated adjuster nut above upper perch
    translate([0, 0, Z_ADJUSTER_BOTTOM])
    castellated_nut(core_dia=ADJUSTER_CORE_DIA, outer_dia=ADJUSTER_OUTER_DIA, height=ADJUSTER_HEIGHT, teeth=ADJUSTER_TEETH, tooth_width=ADJUSTER_TOOTH_WIDTH);

    // Top eyelet (oriented along X, perpendicular to bottom)
    translate([0, 0, Z_TOP_BARREL_CENTER])
    eyelet_barrel(dia=TOP_BARREL_DIA, length=TOP_BARREL_LENGTH, hole_dia=TOP_BARREL_HOLE, axis="x");
}