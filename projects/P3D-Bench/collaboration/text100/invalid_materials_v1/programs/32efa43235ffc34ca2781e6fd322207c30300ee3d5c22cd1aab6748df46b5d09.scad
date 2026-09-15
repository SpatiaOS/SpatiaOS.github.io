// ============================================
// Parametric elongated bracket with capped hub
// ============================================

// ---------- Parameters ----------
$fn = 100;

// Base plate
base_length   = 120;   // overall X length
base_width    = 40;    // Y width
base_thick    = 8;     // Z thickness

// End holes
hole_diameter = 10;
hole_offset   = 15;    // hole center inset from each end

// Central stepped block
block_width       = 34;          // Y width of main block
block_len_step1   = 50;          // X span of broader shallow step
block_len_step2   = 30;          // X span of deeper inner continuation
block_h1          = 6;           // height of shallow outer step above base
block_h2          = 12;          // additional height of deeper step

// Cap (half-cylinder on top)
cap_radius     = 12;
cap_length     = 26;

// Curved slot in cap's lower middle
slot_radius_inner = 7;           // inner radius of arc slot
slot_thickness    = 4;           // radial thickness of slot
slot_angle_start  = -35;         // start angle (deg) around axis
slot_angle_end    = 215;         // end angle (deg) around axis
slot_axis_z       = base_thick + block_h1 + block_h2 + 3; // arc center Z

// ---------- Helper modules ----------

// Rounded-end plate (stadium shape) extruded to a thickness
module stadium_plate(len, wid, thick) {
    linear_extrude(height = thick)
        hull() {
            translate([-(len - wid)/2, 0]) circle(d = wid);
            translate([ (len - wid)/2, 0]) circle(d = wid);
        }
}

// Arc slot ring segment (in XY plane at slot_axis_z), rotated around X axis
module arc_slot() {
    intersection() {
        // full ring (difference of circles) as flat 2D profile
        difference() {
            circle(r = slot_radius_inner + slot_thickness);
            circle(r = slot_radius_inner);
        }
        rotate([0, 0, slot_angle_start])
        // wedge selecting desired angular range
        wedge(slot_angle_end - slot_angle_start,
              slot_radius_inner + slot_thickness + 1);
    }
}

// 2D pie/wedge shape centered on origin starting along +X
function wedge_pt(a, r) = [r*cos(a), r*sin(a)];
module wedge(ang, r) {
    steps = 64;
    polygon(concat([[0, 0]],
                   [for (i = [0:steps])
                       wedge_pt(-ang*0, r)])); // placeholder replaced below
}