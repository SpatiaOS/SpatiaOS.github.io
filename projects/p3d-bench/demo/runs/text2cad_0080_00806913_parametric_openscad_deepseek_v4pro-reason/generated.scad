// Parametric CAD model of rounded link with end bores, stepped recesses,
// and a through slot.

// -----------------------------------------------------------------------
// Main dimensions
overall_length  = 0.75;
overall_width   = 0.220587;   // nominal; constructed width = 2*lobe_radius
overall_height  = 0.147058;
lobe_radius     = 0.1103;     // outside lobe radius (width = 0.2206)
center_y        = lobe_radius;           // 0.1103 from front edge

left_center_x   = lobe_radius;          // 0.1103
right_center_x  = overall_length - lobe_radius; // 0.6397

// -----------------------------------------------------------------------
// Bore and recess parameters
bore_radius     = 0.0294;
recess_radius   = 0.0956;
recess_height   = 0.0882;

// -----------------------------------------------------------------------
// Middle slot parameters
slot_length     = 0.191175;
slot_height     = 0.023529;
slot_z_min      = 0.0618;               // bottom of slot above underside
slot_x_min      = 0.2794;               // left offset from overall left edge
slot_depth      = 0.7353;               // from front (y=0) to beyond back

// -----------------------------------------------------------------------
// Resolution
$fn = 100;

// -----------------------------------------------------------------------
// 2D footprint: stadium shape
module base_footprint() {
    union() {
        // left lobe
        translate([left_center_x, center_y])
            circle(r = lobe_radius);
        // right lobe
        translate([right_center_x, center_y])
            circle(r = lobe_radius);
        // connecting rectangle (straight sides)
        translate([left_center_x, 0])
            square([right_center_x - left_center_x, 2 * lobe_radius]);
    }
}

// -----------------------------------------------------------------------
// Main solid body
module body() {
    linear_extrude(height = overall_height)
        base_footprint();
}

// -----------------------------------------------------------------------
// Bore cylinder (through hole)
module bore() {
    translate([0, 0, 0])
        cylinder(h = overall_height, r = bore_radius);
}

// -----------------------------------------------------------------------
// Recess cylinder (stepped cut from underside)
module recess() {
    translate([0, 0, 0])
        cylinder(h = recess_height, r = recess_radius);
}

// -----------------------------------------------------------------------
// Middle slot (front to back through cut)
module slot() {
    translate([slot_x_min, 0, slot_z_min])
        cube([slot_length, slot_depth, slot_height]);
}

// -----------------------------------------------------------------------
// Final part: subtract bores, recesses, and slot from main body
difference() {
    body();

    // Bores at both lobe centres
    translate([left_center_x, center_y, 0]) bore();
    translate([right_center_x, center_y, 0]) bore();

    // Recesses at both lobe centres
    translate([left_center_x, center_y, 0]) recess();
    translate([right_center_x, center_y, 0]) recess();

    // Through slot
    slot();
}