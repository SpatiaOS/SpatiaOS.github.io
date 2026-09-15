// =====================================================================
// Parametric plate with front pad, two upright walls, slot and hole
// All dimensions in model units; Z = 0 is the base underside datum.
// Origin: left-front-bottom corner of the base plate.
// =====================================================================

$fn = 96;

// ------------------------- Base plate --------------------------------
plate_len   = 0.210172;   // X extent
plate_wid   = 0.578703;   // Y extent
plate_h     = 0.020556;   // solid height from datum
main_thk    = 0.0206;     // nominal extrusion thickness

// Through-hole in base plane
hole_x      = 0.1051;     // axis from left edge
hole_y      = 0.2894;     // axis from front edge
hole_r      = 0.0223;     // hole radius

// ------------------------- Front pad ---------------------------------
pad_wid     = 0.111;      // Y extent of pad
pad_back    = 0.4677;     // back-edge offset (= plate_wid - pad_wid)
pad_thk     = main_thk;   // own thickness
pad_top     = 0.0412;     // top of pad above datum (plate_h + pad_thk)

// ------------------ First upright block (on pad) ---------------------
up1_len     = 0.0651;     // X footprint
up1_left    = 0.0725;     // left offset
up1_right   = 0.0726;     // right offset (centred check)
up1_wid     = 0.111;      // Y footprint, flush with front of pad
up1_extrude = 0.1644;     // main extrusion depth
up1_top     = 0.2055;     // top above datum
up1_base_z  = pad_top;    // sits on the pad

// ----------------------- Removed slot / recess -----------------------
slot_len    = 0.023982;   // X footprint of cut
slot_left   = 0.0924;     // left offset
slot_right  = 0.0938;     // right offset
slot_front  = -0.0123;    // front offset (protrudes past front face)
slot_wid    = 0.11131;    // Y footprint of cut
cut_depth   = 0.1233;     // cut engagement depth
slot_zmin   = 0.0942;     // vertical band limits above underside
slot_zmax   = 0.2055;

// --------------- Second upright wall (same centred band) -------------
up2_len     = 0.0651;     // X footprint
up2_body_len= 0.065093;   // body length
up2_body_wid= 0.1209;     // body width (reference)
up2_wid     = 0.1713;     // Y footprint from offsets
up2_left    = 0.0725;
up2_right   = 0.0726;
up2_front   = -0.1713;    // front face measured from back edge
up2_back    = 0.5787;     // back face flush with rear edge
up2_extrude = 0.1713;
up2_top     = 0.2056;
up2_base_z  = up2_top - up2_extrude;   // sits low, into the pad zone
up2_y_min   = plate_wid - up2_wid;     // 0.4074 -> 0.5787

// --------- Stepped continuation below the second upright -------------
cont_thk    = main_thk;           // own thickness (0.0206)
cont_top    = -0.0206;            // reaches below underside
cont_bot    = -0.0412;            // deepest reach
cont_shallow_x0 = 0;              // shallow, full-width end footprint
cont_shallow_x1 = plate_len;
cont_deep_x0    = up2_left;       // deep footprint contained within,
cont_deep_x1    = up2_left + up2_len; // shared front/back edges
cont_y0         = cont_deep_y0 = up2_y_min;
cont_y1         = cont_deep_y1 = plate_wid;

// ======================= Component modules ===========================

module base_plate() {
    difference() {
        cube([plate_len, plate_wid, plate_h]);
        translate([hole_x, hole_y, -1])
            cylinder(h = plate_h + 2, r = hole_r);   // circular opening
    }
}

module front_pad() {
    translate([0, 0, plate_h])
        cube([plate_len, pad_wid, pad_thk]);         // flush left/right/front
}

module upright_block() {
    translate([up1_left, 0, up1_base_z])
        cube([up1_len, up1_wid, up1_extrude]);       // reaches up1_top
}

module upright_wall() {
    translate([up2_left, up2_y_min, up2_base_z])
        cube([up2_len, up2_wid, up2_extrude]);       // reaches up2_top
}

module slot_cut() {
    // Vertical removed band in the front upright area
    translate([slot_left, slot_front, slot_zmin])
        cube([slot_len, slot_wid, slot_zmax - slot_zmin + 0.001]);
}

module stepped_continuation() {
    // Shallow (upper) layer: full-width end footprint, flush under plate
    translate([cont_shallow_x0, cont_y0, cont_top])
        cube([cont_shallow_x1, cont_y1 - cont_y0, abs(cont_top)]);
    // Deep (lower) layer: narrow, same front/back edges
    translate([cont_deep_x0, cont_deep_y0, cont_bot])
        cube([cont_deep_x1 - cont_deep_x0,
              cont_deep_y1 - cont_deep_y0,
              abs(cont_top)]);
}

// ========================= Final assembly ============================

difference() {
    union() {
        stepped_continuation();   // lower steps first (share datum)
        base_plate();
        front_pad();
        upright_block();
        upright_wall();
    }
    slot_cut();
}