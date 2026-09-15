// ============================================================
//  Hand-crank planetary winch  (large internal ring gear,
//  planet set, gear-box nose with crank, welded A-frame stand)
//  All dimensions in millimetres.
// ============================================================
$fn = 56;

// ---------------- main proportions ----------------
wheel_od    = 190;   // outside diameter of the big ring gear
rim_radial  = 18;    // radial thickness of the rim
rim_w       = 30;    // axial width of the rim
ring_teeth  = 54;    // internal teeth
t_rad       = 8;     // tooth height (radial)
t_tan       = 6;     // tooth thickness (tangential)
t_axial     = 16;    // tooth face width
tooth_z     = 5;     // axial position of the gear band
web_z       = -10;   // axial position of spokes / carrier band

hub_r       = 24;
spoke_w     = 18;
spoke_t     = 10;

planet_n    = 3;
planet_pr   = 22;    // planet pitch radius
planet_r    = 51;    // planet centre radius
planet_w    = 14;
sun_pr      = 29;

axle_r      = 10;
wheel_z     = 112;   // height of the wheel axis

// ---------------- frame ----------------
plate_t     = 10;    // frame plate thickness (Y)
frame_x0    = -165;  // front bottom corner
apex_x      = -24;   // plate apex (front bearing)
leg_x       = 28;    // rear leg
foot_len    = 125;   // cross-foot length

// ---------------- gearbox / crank ----------------
hub_pt   = [0, 0, wheel_z];        // gearbox mounted on the wheel hub
nose_pt  = [-105, -70, 58];        // tip of the output shaft
hlen     = norm(nose_pt - hub_pt);
hdir     = (nose_pt - hub_pt) / hlen;

crank_hub = hub_pt + hdir * 118;                 // crank boss on the shaft
knee      = crank_hub + [-122, 22, 185];         // top bend of the crank arm

// ============================================================
//  helpers
// ============================================================

// aligns children local +Z with the vector p1 -> p2
module orient(p1, p2) {
    d = p2 - p1;
    L = norm(d);
    translate(p1)
        rotate([0, 0, atan2(d[1], d[0])])
            rotate([0, acos(d[2] / L), 0])
                children();
}

// round bar / cone between two points
module rod(p1, p2, r1, r2 = -1) {
    L = norm(p2 - p1);
    orient(p1, p2) cylinder(h = L, r1 = r1, r2 = (r2 < 0) ? r1 : r2);
}

// rectangular beam between two points (t = thickness across Y)
module beam(p1, p2, w, t) {
    L = norm(p2 - p1);
    orient(p1, p2) linear_extrude(height = L) square([w, t], center = true);
}

// tubular hand grip with a collar at its root
module grip(p1, p2, r) {
    hull() {
        translate(p1) sphere(r);
        translate(p2) sphere(r);
    }
    rod(p1, p1 + (p2 - p1) * 0.14, r * 1.3);
}

// simple straight-tooth spur gear (axis = Z, centred)
module spur_gear(pr, w, n, th = 6, tw = 5) {
    union() {
        cylinder(h = w, r = pr - th * 0.35, center = true);
        for (i = [0 : n - 1])
            rotate([0, 0, i * 360 / n])
                translate([pr - th / 2, 0, 0])
                    cube([th, tw, w], center = true);
    }
}

// ============================================================
//  big internal ring gear
// ============================================================
module ring_gear() {
    ir = wheel_od / 2 - rim_radial;
    union() {
        // rim body
        difference() {
            cylinder(h = rim_w, r = wheel_od / 2, center = true);
            cylinder(h = rim_w + 2, r = ir, center = true);
        }
        // wider smooth outer flange band
        difference() {
            cylinder(h = rim_w + 10, r = wheel_od / 2, center = true);
            cylinder(h = rim_w + 12, r = wheel_od / 2 - 9, center = true);
        }
        // inward pointing teeth
        for (i = [0 : ring_teeth - 1])
            rotate([0, 0, i * 360 / ring_teeth])
                translate([ir - t_rad / 2, 0, tooth_z])
                    cube([t_rad, t_tan, t_axial], center = true);
    }
}

// ============================================================
//  complete wheel : ring + hub + spokes + planet set
// ============================================================
module wheel() {
    ir = wheel_od / 2 - rim_radial;
    union() {
        ring_gear();

        // central hub
        cylinder(h = rim_w, r = hub_r, center = true);

        // three web spokes tying rim to hub (rear band, 0/120/240)
        for (i = [0 : 2])
            rotate([0, 0, i * 120])
                translate([(hub_r + ir) / 2, 0, web_z])
                    cube([ir - hub_r + 6, spoke_w, spoke_t], center = true);

        // planet carrier arms (60/180/300) + pins + planet gears
        for (i = [0 : planet_n - 1])
            rotate([0, 0, 60 + i * 120]) {
                translate([planet_r / 2 + 6, 0, web_z])
                    cube([planet_r + 12, 16, spoke_t], center = true);
                translate([planet_r, 0, 0]) {
                    cylinder(h = rim_w - 2, r = 6, center = true);
                    translate([0, 0, tooth_z])
                        spur_gear(planet_pr, planet_w, 14);
                }
            }

        // sun gear on the centre shaft
        translate([0, 0, tooth_z]) spur_gear(sun_pr, planet_w, 18);
    }
}

// ============================================================
//  welded stand : triangular side plate, rear leg, feet
// ============================================================
module frame() {
    union() {
        // triangular plate lying in the XZ plane
        rotate([90, 0, 0])
            linear_extrude(height = plate_t, center = true)
                union() {
                    offset(r = 6) offset(delta = -6)
                        polygon([[frame_x0, 0], [apex_x, 0], [apex_x, wheel_z]]);
                    translate([apex_x, wheel_z]) circle(r = 22);   // front bearing boss
                }

        // rear leg + its bearing boss
        beam([leg_x, 0, wheel_z], [leg_x + 10, 0, 4], 16, plate_t);
        rod([leg_x - 8, 0, wheel_z], [leg_x + 10, 0, wheel_z], 17);

        // bottom rail between plate and rear leg
        beam([apex_x - 4, 0, 7], [leg_x + 12, 0, 7], 14, plate_t);

        // two cross feet with end pads
        for (fx = [frame_x0 + 16, leg_x + 4]) {
            translate([fx, 0, 7]) cube([20, foot_len, 14], center = true);
            for (s = [-1, 1])
                translate([fx, s * (foot_len / 2 - 8), 6])
                    cube([26, 22, 16], center = true);
        }
    }
}

// ============================================================
//  gear-box housing on the wheel hub + output shaft
// ============================================================
module housing() {
    orient(hub_pt, nose_pt) {
        cylinder(h = 30, r = 26);                        // hub flange
        translate([0, 0, 25]) cylinder(h = 45, r1 = 25, r2 = 19);   // tapered body
        translate([0, 0, 68]) cylinder(h = 10, r = 22);   // collar
        translate([0, 0, 76]) cylinder(h = 30, r1 = 19, r2 = 12);   // nose cone
        translate([0, 0, 100]) cylinder(h = 37, r = 7.5); // output shaft
        translate([0, 0, 137]) sphere(r = 7.5);
    }
    // small auxiliary lever rod with end block
    rod([-58, -32, 86], [-132, -78, 52], 5);
    translate([-132, -78, 52]) cube([16, 14, 14], center = true);
}

// ============================================================
//  crank arm with grip, and fixed grab handle bracket
// ============================================================
module crank() {
    rod(crank_hub - hdir * 10, crank_hub + hdir * 20, 15);  // crank boss
    beam(crank_hub, knee, 18, 14);                          // long arm
    grip(knee + [-4, -6, 4], knee + [-14, -66, 10], 9);     // rotating handle
}

module grab_handle() {
    beam([-38, 0, wheel_z - 10], [-58, 0, wheel_z + 92], 16, 12);
    grip([-58, -4, wheel_z + 92], [-70, -64, wheel_z + 98], 9);
    translate([-38, 0, wheel_z - 8]) cube([26, 14, 16], center = true);
}

// ============================================================
//  assembly
// ============================================================
color([0.72, 0.72, 0.76]) union() {
    frame();

    // wheel : axis turned to lie along X
    translate([0, 0, wheel_z]) rotate([0, 90, 0]) wheel();

    // through axle carried by plate apex and rear leg
    rod([-36, 0, wheel_z], [leg_x + 12, 0, wheel_z], axle_r);

    housing();
    crank();
    grab_handle();
}