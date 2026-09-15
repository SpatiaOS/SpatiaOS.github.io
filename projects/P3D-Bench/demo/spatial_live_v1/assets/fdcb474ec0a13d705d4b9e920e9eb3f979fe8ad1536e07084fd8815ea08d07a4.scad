// -------------------------------------------------------------
// Four-digit seven-segment LED display - reconstructed assembly
// All dimensions in mm. Overall extent ~50.7 x 11.0 x 19.0
// -------------------------------------------------------------
$fn = 72;

// ---------- parameters ----------
body_l = 50.7;                    // face length  (X)
body_h = 19.0;                    // face height  (Z)
body_d = 7.9;                     // housing depth (Y)
shim_t = 0.1;                     // front shim plate thickness
seg_t  = 0.01;                    // segment / disc plate thickness

// seven-segment stroke classes (7 classes x 4 digits)
segA_l = 6.44; segA_t = 1.48;     // top horizontal, double-pointed hexagon
segG_l = 6.34; segG_t = 1.44;     // middle horizontal, chamfered strip
segD_l = 6.40; segD_t = 1.46;     // bottom horizontal (unextracted class)
segB_l = 5.70;                    // upper-right vertical, pointed both ends
segF_l = 5.68;                    // upper-left vertical, hexagonal
segE_l = 5.65;                    // lower-left vertical (unextracted class)
segC_l = 5.61;                    // lower-right vertical, single-point gusset
segV_t = 1.46;                    // vertical stroke width

disc_r = 0.8;                     // decimal-point disc radius
disc_t = 0.01;

pin_r     = 0.25;                 // locating pins
pin_shank = 2.63;
pin_cone  = 0.37;
pin_tip_r = 0.08;                 // truncated flat at cone tip
pin_n     = 12;
pin_pitch = 2.54;
pin_z     = 16.4;                 // height of pin row on rear face

// derived digit layout
digit_pitch = body_l/4;
y_top = segB_l;                   // top stroke centre height
y_bot = segC_l;                   // bottom stroke centre height
x_v   = segG_l/2 - segV_t/2;      // vertical stroke offset from digit centre
dp_x  = x_v + segV_t/2 + 1.45;    // decimal-point position (digit-local)
dp_y  = -y_bot*0.8;

// ---------- 2D stroke profiles ----------
module hexagon2d(l, t)            // elongated hexagon, points along X
    polygon([[-l/2,0],[-l/2+t/2,t/2],[l/2-t/2,t/2],[l/2,0],
             [l/2-t/2,-t/2],[-l/2+t/2,-t/2]]);

module strip2d(l, t)              // hexagonal strip, blunt chamfered ends
    polygon([[-l/2,0],[-l/2+0.35*t,t/2],[l/2-0.35*t,t/2],[l/2,0],
             [l/2-0.35*t,-t/2],[-l/2+0.35*t,-t/2]]);

module hexv2d(l, t)               // vertical hexagon, points along Y
    polygon([[0,-l/2],[t/2,-l/2+t/2],[t/2,l/2-t/2],[0,l/2],
             [-t/2,l/2-t/2],[-t/2,-l/2+t/2]]);

module gussetv2d(l, t)            // vertical plate, pointed at bottom end only
    polygon([[0,-l/2],[t/2,-l/2+t/2],[t/2,l/2],[-t/2,l/2],[-t/2,-l/2+t/2]]);

// extrude a 2D child as an ultra-thin plate on the front face
module front_plate()
    translate([0,-shim_t,0]) rotate([90,0,0]) linear_extrude(seg_t) children();

// ---------- components ----------
module decimal_disc()
    translate([dp_x,-shim_t-disc_t,dp_y]) rotate([-90,0,0]) cylinder(r=disc_r,h=disc_t);

module digit7() {
    front_plate() translate([0, y_top]) hexagon2d(segA_l, segA_t);        // A
    front_plate() translate([0, 0])     strip2d(segG_l, segG_t);          // G
    front_plate() translate([0,-y_bot]) hexagon2d(segD_l, segD_t);        // D
    front_plate() translate([ x_v,  y_top/2]) hexv2d(segB_l, segV_t);     // B
    front_plate() translate([-x_v,  y_top/2]) hexv2d(segF_l, segV_t);     // F
    front_plate() translate([ x_v, -y_bot/2]) gussetv2d(segC_l, segV_t);  // C
    front_plate() translate([-x_v, -y_bot/2]) hexv2d(segE_l, segV_t);     // E
    decimal_disc();
}

module pin() {                    // shank + truncated-cone tip
    cylinder(r=pin_r, h=pin_shank);
    translate([0,0,pin_shank]) cylinder(r1=pin_r, r2=pin_tip_r, h=pin_cone);
}

module pin_row() {
    x0 = (body_l - (pin_n-1)*pin_pitch)/2;
    for (i=[0:pin_n-1])
        translate([x0+i*pin_pitch, body_d, pin_z]) rotate([-90,0,0]) pin();
}

// ---------- unified model ----------
union() {
    cube([body_l, body_d, body_h]);                           // grounded spacer block
    translate([0,-shim_t,0]) cube([body_l, shim_t, body_h]);  // front shim plate
    for (i=[0:3])
        translate([digit_pitch*(i+0.5), 0, body_h/2]) digit7();
    pin_row();
}