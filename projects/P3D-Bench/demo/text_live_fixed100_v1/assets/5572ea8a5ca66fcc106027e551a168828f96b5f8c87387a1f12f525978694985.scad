// ============================================================
// Parametric assembly: rounded base + hollow sleeve + side arm
// + triangular rib, with through bore and end opening
// ============================================================

// ---- Global resolution ----
$fn = 100;

// ---- Base parameters ----
base_length = 90;        // X extent of the rounded base
base_width = 50;         // Y extent of the base
base_height = 12;        // thickness of the base
base_corner_r = 10;      // corner rounding radius of the base

// ---- Sleeve (annular upright) parameters ----
sleeve_od = 44;          // outer diameter of tall sleeve
sleeve_id = 28;          // bore diameter (through hollow sleeve)
sleeve_h = 55;           // height above base

// ---- Stepped circular portion under sleeve ----
step_od = 56;            // diameter of stepped circular boss
step_h = 6;              // height of stepped boss on the base

// ---- Side arm parameters ----
arm_len = 70;            // length of arm beyond base edge
arm_width = 36;          // width of the arm
arm_depth = 16;          // full depth of arm at root
arm_step_depth = 9;      // reduced depth after lower cutaway
arm_end_round = 14;      // radius rounding at small end of arm
end_opening_d = 12;      // real rounded opening in small end

// ---- Rib (thin triangular web on top of arm) ----
rib_len = 46;            // run of rib along the arm
rib_height = 18;         // peak height of rib
rib_thick = 4;           // thickness of rib web

// ============================================================
// Helper modules
// ============================================================

// Rounded rectangular slab used for the base plate
module rounded_base_plate(l, w, h, r) {
    hull() {
        for (x = [-1, 1], y = [-1, 1])
            translate([x*(l/2 - r), y*(w/2 - r), 0])
                cylinder(h = h, r = r);
    }
}

// Full-depth arm profile lying horizontally (centered in Y)
module arm_block(depth) {
    hull() {
        // large end merging into base/sleeve region
        translate([-arm_len/2 + 20, 0, 0])
            cylinder(h = depth, d = arm_width);
        // small rounded end
        translate([arm_len/2 - arm_end_round, 0, 0])
            cylinder(h = depth, d = 2*arm_end_round);
    }
}

// ============================================================
// Component modules
// ============================================================

// Low rounded base section
module base_section() {
    rounded_base_plate(base_length, base_width, base_height, base_corner_r);
}

// Stepped circular boss under the sleeve
module step_boss() {
    cylinder(h = base_height + step_h, d = step_od);
}

// Tall hollow annular sleeve with continuous central bore
module sleeve() {
    difference() {
        cylinder(h = base_height + step_h + sleeve_h, d = sleeve_od);
        // central bore continues down through stepped portions
        translate([0, 0, -1])
            cylinder(h = base_height + step_h + sleeve_h + 2, d = sleeve_id);
    }
}

// Projecting side arm with stepped underside (lower cutaway)
module side_arm() {
    difference() {
        union() {
            // upper tier: full visible depth across whole arm
            arm_block(arm_step_depth + base_height);
            // lower tier: extra depth only near the root (no cutaway there)
            intersection() {
                arm_block(arm_depth + base_height);
                // keep the deep tier only over the root half of the arm
                translate([-(base_length/2 + arm_len) , -arm_width, 0])
                    cube([base_length/2 + arm_len/2 + 15,
                          2*arm_width,
                          base_height + arm_depth]);
            }
        }
        // real rounded opening through the smaller rounded end
        translate([arm_len/2 - arm_end_round, 0, -1])
            cylinder(h = base_height + arm_depth + 2, d = end_opening_d);
    }
}

// Thin triangular rib running from rounded end toward the sleeve
module triangular_rib() {
    translate([(base_length/2 - 20), -rib_thick/2, base_height + arm_step_depth])
        linear_extrude(height = rib_thick)
            polygon(points = [
                [rib_len, 0],                    // base at sleeve side
                [0, 0],                          // base at rounded-end side
                [rib_len, rib_height]            // rising peak
            ]);
}

// ============================================================
// Main assembly
// ============================================================
union() {
    // place everything relative to centered base
    base_section();

    // step boss and sleeve sit at center of base
    step_boss();
    sleeve();

    // arm projects from one side of the base
    translate([-(base_length/2) + 10, 0, 0])
        side_arm();

    // rib sits on top of the raised tier of the arm
    translate([-(base_length/2) + 12, 0, 0])
        triangular_rib();
}