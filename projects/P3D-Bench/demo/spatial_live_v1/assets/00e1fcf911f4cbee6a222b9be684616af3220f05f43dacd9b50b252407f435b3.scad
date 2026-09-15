// =====================================================================
// Steering intermediate shaft assembly
// Two universal-joint knuckles linked by a splined shaft,
// smooth journal stubs at each outer end.
// =====================================================================

$fn = 48;

// ---------------- Global parameters ----------------
shaft_r          = 11.08;   // main tube radius
journal_r        = 10.0;    // smooth end journal radius
spline_root_r    = 8.62;    // spline root radius
spline_tip_r     = 9.35;    // spline tip radius
spline_teeth     = 36;

main_shaft_len   = 120;     // central tube between the two joints
black_sleeve_len = 55;      // dark sleeve section on the tube

yoke_hub_r       = 14.0;    // universal joint yoke hub radius
yoke_ear_w       = 11.0;    // thickness of each fork ear
yoke_ear_gap     = 26.0;    // clear span between ear inner faces
yoke_ear_len     = 22.0;    // ear projection from hub face
yoke_ear_r       = 11.0;    // ear rounded end radius
cross_pin_d      = 8.0;     // cross trunnion bore diameter

cross_body_r     = 8.0;     // spider centre body radius
cross_arm_r      = 4.0;     // spider trunnion radius
cross_arm_len    = 17.0;    // spider arm half length
cap_r            = 6.6;     // bearing cap radius
cap_h            = 6.0;

stub_len         = 62;      // outer smooth stub length
stub_hole_d      = 4.0;

joint_angle_1    = 16;      // articulation of first (lower) knuckle
joint_angle_2    = 26;      // articulation of second (upper) knuckle

// =====================================================================
// Helper geometry
// =====================================================================

// Straight involute-ish spline: root cylinder + radial tooth ribs
module spline(len, root_r = spline_root_r, tip_r = spline_tip_r,
              teeth = spline_teeth) {
    tooth_w = 2 * PI * root_r / teeth * 0.55;
    union() {
        cylinder(h = len, r = root_r);
        for (i = [0 : teeth - 1])
            rotate([0, 0, i * 360 / teeth])
                translate([0, -tooth_w / 2, 0])
                    cube([tip_r, tooth_w, len]);
    }
}

// Serrated (fine tooth) band used on the angle-joint interface
module serration(len, root_r = 8.24, tip_r = 8.62, teeth = 38) {
    spline(len, root_r, tip_r, teeth);
}

// One fork ear: rounded flat plate with a cross-pin bore
module fork_ear(len, thick, r_end, bore_d) {
    difference() {
        hull() {
            translate([-r_end, -thick / 2, -r_end])
                cube([2 * r_end, thick, r_end]);
            translate([0, -thick / 2, len - r_end])
                rotate([-90, 0, 0])
                    cylinder(h = thick, r = r_end);
        }
        translate([0, -thick, len - r_end])
            rotate([-90, 0, 0])
                cylinder(h = 3 * thick, d = bore_d);
    }
}

// A clevis: two parallel ears rising in +Z from z=0
module clevis(len = yoke_ear_len, gap = yoke_ear_gap,
              thick = yoke_ear_w, r_end = yoke_ear_r,
              bore_d = cross_pin_d) {
    for (s = [-1, 1])
        translate([0, s * (gap / 2 + thick / 2), 0])
            fork_ear(len, thick, r_end, bore_d);
}

// Universal joint cross / spider (part e73a834c)
module spider() {
    union() {
        sphere(r = cross_body_r);
        for (a = [0, 90, 180, 270])
            rotate([0, 0, a])
                rotate([0, 90, 0]) {
                    cylinder(h = cross_arm_len, r = cross_arm_r);
                    translate([0, 0, cross_arm_len - cap_h])
                        cylinder(h = cap_h, r = cap_r);
                }
    }
}

// =====================================================================
// Universal joint yoke (e744bc80): double clevis with splined bore
// Hub axis along Z, forks open toward +Z, splined bore enters from -Z
// =====================================================================
module universal_joint_yoke() {
    hub_h = 20;
    difference() {
        union() {
            // hub block
            hull() {
                cylinder(h = hub_h, r = yoke_hub_r);
                translate([0, 0, hub_h - 1])
                    cylinder(h = 1, r = yoke_hub_r);
            }
            translate([0, 0, hub_h]) clevis();
        }
        // internal splined bore
        translate([0, 0, -1]) spline(hub_h + 1.5, spline_root_r - 0.1,
                                     spline_tip_r - 0.1);
        // countersunk hub through hole
        translate([0, 0, -1]) cylinder(h = hub_h + 2, d = 19.48);
        // web counterbores
        for (s = [-1, 1])
            translate([s * (yoke_hub_r - 4), 0, hub_h - 3])
                cylinder(h = 6, d = 6.78);
    }
}

// =====================================================================
// Serrated angle joint body (e740c52e)
// Serrated collar + clevis fork, axis along Z
// =====================================================================
module serrated_angle_joint() {
    collar_h = 20;
    difference() {
        union() {
            cylinder(h = collar_h, r = yoke_hub_r - 1);
            translate([0, 0, collar_h]) clevis(len = 20, gap = 22,
                                               thick = 9, r_end = 10);
        }
        translate([0, 0, -1]) cylinder(h = collar_h + 2, d = 19.5);
        translate([0, 0, collar_h - 4])
            cylinder(h = 5, d = 17.37);
    }
    // serrated interface ring at the base
    translate([0, 0, -12]) serration(12.5);
}

// =====================================================================
// Splined coupling pin (e73fdae8)
// spline at -Z end, journal toward +Z
// =====================================================================
module splined_pin() {
    spline_len  = 21.5;
    journal_len = 53.5;
    difference() {
        union() {
            spline(spline_len);
            translate([0, 0, spline_len])
                cylinder(h = journal_len, r = journal_r);
        }
        for (z = [spline_len + 14, spline_len + 40])
            translate([0, -journal_r - 2, z])
                rotate([-90, 0, 0])
                    cylinder(h = 2 * journal_r + 4, d = 6.0);
    }
}

// =====================================================================
// Locating pin (e7477ba8) - slender wedge-section rod
// =====================================================================
module locating_pin(len = 30) {
    rotate([0, 90, 0])
        linear_extrude(height = len)
            polygon(points = [[-1.3, -0.9], [1.3, -0.9], [0, 1.3]]);
}

// =====================================================================
// Splined shaft yoke (e747c9d4)
// Spline at -Z, shank, integral fork yoke at +Z
// =====================================================================
module splined_shaft_yoke() {
    spline_len = 40;
    shank_len  = 78;
    hub_h      = 18;
    union() {
        spline(spline_len);
        translate([0, 0, spline_len - 1])
            cylinder(h = 3, r1 = spline_tip_r, r2 = shaft_r);
        translate([0, 0, spline_len + 2])
            cylinder(h = shank_len, r = shaft_r);
        translate([0, 0, spline_len + 2 + shank_len]) {
            cylinder(h = hub_h, r = yoke_hub_r - 1);
            translate([0, 0, hub_h])
                clevis(len = yoke_ear_len, gap = yoke_ear_gap,
                       thick = yoke_ear_w, r_end = yoke_ear_r);
        }
    }
}

// Smooth outer end stub with retaining hole
module end_stub(len = stub_len) {
    difference() {
        union() {
            cylinder(h = len - 6, r = journal_r);
            translate([0, 0, len - 6])
                cylinder(h = 6, r1 = journal_r, r2 = journal_r - 1.2);
        }
        translate([0, -journal_r - 2, len - 16])
            rotate([-90, 0, 0])
                cylinder(h = 2 * journal_r + 4, d = stub_hole_d);
    }
}

// =====================================================================
// Assembly: chain built along +Z, then laid down diagonally
// =====================================================================

module knuckle(angle) {
    // lower yoke (fixed to incoming shaft), spider, upper yoke rotated
    hub_h      = 20;
    pivot_z    = hub_h + yoke_ear_len - yoke_ear_r;

    universal_joint_yoke();
    translate([0, 0, pivot_z]) rotate([0, 0, 90]) spider();

    // driven yoke: rotated about the pivot, phased 90 deg
    translate([0, 0, pivot_z])
        rotate([0, angle, 0])
            rotate([0, 0, 90])
                translate([0, 0, pivot_z])
                    rotate([180, 0, 0])
                        universal_joint_yoke();
}

module assembly() {
    hub_h   = 20;
    pivot_z = hub_h + yoke_ear_len - yoke_ear_r;
    knuckle_h = 2 * pivot_z;

    // ---- lower end: stub + splined pin + first knuckle ----
    translate([0, 0, -stub_len]) end_stub(stub_len);

    translate([0, 0, -30]) splined_pin();

    knuckle(joint_angle_1);

    // frame after first knuckle
    translate([0, 0, pivot_z])
    rotate([0, joint_angle_1, 0])
    translate([0, 0, pivot_z]) {

        // main tube with dark sleeve, plus terminal spline
        translate([0, 0, 2]) cylinder(h = main_shaft_len, r = shaft_r);
        color("black")
            translate([0, 0, 2 + main_shaft_len - black_sleeve_len])
                cylinder(h = black_sleeve_len, r = shaft_r + 0.6);

        // spline entering second knuckle's serrated joint
        translate([0, 0, 2 + main_shaft_len]) {
            cylinder(h = 3, r1 = shaft_r, r2 = spline_tip_r);
            translate([0, 0, 3]) spline(24);
        }

        // ---- second knuckle at the top of the tube ----
        translate([0, 0, 2 + main_shaft_len + 15]) {
            serrated_angle_joint();

            // driven yoke of the second knuckle, articulated
            translate([0, 0, 20 + 20 - 10]) {
                rotate([0, 0, 90]) spider();
                rotate([0, joint_angle_2, 0])
                    rotate([0, 0, 90])
                        translate([0, 0, pivot_z])
                            rotate([180, 0, 0])
                                universal_joint_yoke();
            }

            // outer end: splined pin + stub beyond the second knuckle
            translate([0, 0, 20 + 20 - 10])
                rotate([0, joint_angle_2, 0])
                    translate([0, 0, pivot_z]) {
                        rotate([180, 0, 0]) splined_pin();
                        translate([0, 0, 0]) end_stub(stub_len);
                        translate([0, 12, -6]) locating_pin(26);
                    }
        }
    }
}

// Lay the chain along the diagonal view axis
rotate([0, 62, 0])
    translate([0, 0, -90])
        assembly();