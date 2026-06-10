$fn = 100;

// Parameters
OVERALL_LEN = 0.75;
OVERALL_WID = 0.220587;
OVERALL_HT = 0.147058;
EXTRUDE_HT = 0.1471;
LOBE_R = 0.1103;
LOBE1_CX = 0.1103;
LOBE1_CY = 0.1103;
LOBE2_CX = 0.6397;
LOBE2_CY = 0.1103;
BORE_R = 0.0294;
RECESS_R = 0.0956;
RECESS_HT = 0.0882;
SLOT_LEN = 0.191175;
SLOT_HT = 0.023529;
SLOT_X_OFF = 0.2794;
SLOT_Z_START = 0.0618;
SLOT_REACH = 0.7353;

// Base footprint module: rounded link shape
module base_footprint() {
    hull() {
        translate([LOBE1_CX, LOBE1_CY]) circle(r = LOBE_R);
        translate([LOBE2_CX, LOBE2_CY]) circle(r = LOBE_R);
    }
}

// Lobe cut module: through bore and annular recess
module lobe_cuts(cx, cy) {
    // Centered through bore
    translate([cx, cy, -0.01])
        cylinder(h = EXTRUDE_HT + 0.02, r = BORE_R);
    // Stepped annular recess from base
    translate([cx, cy, 0])
        cylinder(h = RECESS_HT, r = RECESS_R);
}

// Middle slot module: rectangular through-cut on side web
module middle_slot() {
    translate([SLOT_X_OFF, 0, SLOT_Z_START])
        cube([SLOT_LEN, SLOT_REACH, SLOT_HT]);
}

// Main model construction
difference() {
    // Extrude base footprint to full thickness
    linear_extrude(height = EXTRUDE_HT)
        base_footprint();

    // Apply concentric cuts at both end lobes
    lobe_cuts(LOBE1_CX, LOBE1_CY);
    lobe_cuts(LOBE2_CX, LOBE2_CY);

    // Remove middle rectangular slot
    middle_slot();
}