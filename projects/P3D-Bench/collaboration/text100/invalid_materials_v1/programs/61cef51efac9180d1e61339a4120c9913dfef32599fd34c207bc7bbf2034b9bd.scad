// ============================================================
// Polygonal slab with clipped corners and raised annular sleeves
// All dimensions in millimeters
// ============================================================

// ---------- Parameters ----------
$fn = 96;

base_length   = 70;    // X extent of slab
base_width    = 45;    // Y extent of slab
base_height   = 4;     // Slab thickness
corner_clip   = 10;    // Corner clipping distance

sleeve_od     = 14;    // Outer diameter of each sleeve
sleeve_height = 6;     // Height of sleeve above slab
bore_d        = 10;    // Upper (larger) bore diameter - stepped recess
pilot_d       = 5;     // Lower/smaller bore diameter (through opening)

step_depth    = 3;     // Depth of wide bore stepping into the slab

row_spacing   = 18;    // Y distance between the two rows
row1_x        = [-17, 17];          // Post X positions, row 1
row2_x        = [-23, 23];          // Offset post X positions, row 2
row1_y        = -row_spacing / 2;
row2_y        =  row_spacing / 2;

// ---------- Derived ----------
post_positions = [
    [x, row1_y] for x = row1_x,
    [x, row2_y] for x = row2_x
];

// ---------- Modules ----------

// Slab profile: rectangle with all four corners clipped
module clipped_slab() {
    linear_extrude(height = base_height)
        polygon(points = [
            // Starting at front-left corner going counter-clockwise
            [corner_clip,                  0],
            [base_length - corner_clip,    0],
            [base_length,      corner_clip],
            [base_length, base_width - corner_clip],
            [base_length - corner_clip, base_width],
            [corner_clip,           base_width],
            [0,      base_width - corner_clip],
            [0,                 corner_clip]
        ]);
}

// One raised annular sleeve (hollow cylindrical post)
module sleeve() {
    translate([0, 0, base_height])
        difference() {
            cylinder(h = sleeve_height, d = sleeve_od);
            cylinder(h = sleeve_height + 1, d = pilot_d); // small centered opening
        }
}

// Full solid before cutting (slab + all sleeves)
module body() {
    union() {
        clipped_slab();
        for (p = post_positions)
            translate(p) sleeve();
    }
}

// Stepped bores cut through the whole stack at every post position
module bores() {
    for (p = post_positions) {
        translate(p) {
            // Small pilot hole through the entire part
            cylinder(h = base_height + sleeve_height + 2,
                     d = pilot_d, center = true);
            // Wide step: upper part of sleeve plus a step into the slab top
            translate([0, 0, base_height + sleeve_height - sleeve_height])
                cylinder(h = sleeve_height + step_depth,
                         d = bore_d);
        }
    }
}

// ---------- Main model ----------
difference() {
    body();
    bores();
}