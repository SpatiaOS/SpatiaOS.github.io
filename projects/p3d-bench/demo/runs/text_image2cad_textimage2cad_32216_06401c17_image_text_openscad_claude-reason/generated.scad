// Hydraulic Grapple Assembly
// 4-arm grapple with central bell hub, eye lug,
// hydraulic cylinders, curved jaw arms, and linkage hardware
$fn = 60;

// ============ PARAMETERS ============

// Central Hub (bell shape)
hub_base_r  = 13.5;       // Lower wide cylinder radius
hub_top_r   = 9.39;       // Upper narrow cylinder radius
hub_base_h  = 10;         // Lower cylinder height
hub_cone_h  = 15;         // Cone transition height
hub_top_h   = 8;          // Upper cylinder height
hub_total_h = hub_base_h + hub_cone_h + hub_top_h;

// Eye Lug at crown
eye_r       = 5.07;       // Outer profile radius
eye_bore_d  = 5;          // Through-bore diameter
eye_t       = 6;          // Plate thickness
eye_h       = 10;         // Lug height

// Jaw Arms
jaw_len     = 73.6;       // Total arm length
jaw_w0      = 10;         // Width at pivot end
jaw_w1      = 3;          // Width at tip
jaw_d0      = 7;          // Depth at pivot end
jaw_d1      = 2.5;        // Depth at tip
jaw_pin_d   = 3.6;        // Pin hole diameter
jaw_angle   = 18;         // Outward tilt from vertical (deg)

// Hydraulic Barrel
brl_or      = 3.38;       // Outer radius (OD 6.76)
brl_wall    = 0.7;        // Wall thickness

// Follower Rod
frod_r      = 0.8;        // Stem radius
frod_head_r = 2.53;       // Mushroom head radius

// Mounting Lugs
lug_t       = 1.47;       // Lug thickness

// Pins
pin_r       = 1.35;       // Stepped pin shank radius
pin_head_r  = 1.8;        // Stepped pin head radius

// Layout
n_arms      = 4;
piv_z       = hub_base_h * 0.5;   // Pivot height on hub
piv_r       = hub_base_r;          // Pivot radial distance

// Barrel attachment point on hub cone
brl_frac    = 0.82;
brl_att_z   = hub_base_h + hub_cone_h * brl_frac;
brl_att_r   = hub_base_r + (hub_top_r - hub_base_r) * brl_frac;

// Jaw curve functions (local coordinates)
function jcx(t) = 7 * sin(t * 140) * (1 - t * 0.8) - 3 * t * t;
function jcz(t) = -t * jaw_len;
function jw(t)  = jaw_w0 + (jaw_w1 - jaw_w0) * pow(t, 0.8);
function jd(t)  = jaw_d0 + (jaw_d1 - jaw_d0) * pow(t, 0.7);

// World coordinates of jaw point (for arm at azimuth 0)
function jwx(t) = piv_r + jcx(t) * cos(jaw_angle) - jcz(t) * sin(jaw_angle);
function jwz(t) = piv_z + jcx(t) * sin(jaw_angle) + jcz(t) * cos(jaw_angle);

// ============ MAIN ASSEMBLY ============
assembly();

module assembly() {
    hub_and_eye();
    for (i = [0 : n_arms - 1])
        rotate([0, 0, i * 90])
            arm_assembly();
}

// ============ CENTRAL HUB WITH EYE LUG ============
module hub_and_eye() {
    color([0.62, 0.62, 0.66]) {
        // Lower wide cylinder
        cylinder(h = hub_base_h, r = hub_base_r);
        // Conical transition
        translate([0, 0, hub_base_h])
            cylinder(h = hub_cone_h, r1 = hub_base_r, r2 = hub_top_r);
        // Upper narrow cylinder
        translate([0, 0, hub_base_h + hub_cone_h])
            cylinder(h = hub_top_h, r = hub_top_r);
        // Collar ring at base-cone junction
        translate([0, 0, hub_base_h - 0.5])
            cylinder(h = 1.0, r = hub_base_r + 1.0);
        // Collar ring at cone-upper junction
        translate([0, 0, hub_base_h + hub_cone_h - 0.5])
            cylinder(h = 1.0, r = hub_top_r + 1.0);
        // Eye lug at crown
        translate([0, 0, hub_total_h])
            eye_lug_part();
    }
}

module eye_lug_part() {
    difference() {
        union() {
            // Transition pad from cylinder to rectangular lug
            hull() {
                cylinder(h = 0.01, r = hub_top_r * 0.55);
                translate([0, 0, 3])
                    cube([eye_r * 2, eye_t, 0.01], center = true);
            }
            // Lug plate with rounded top bearing the through-bore
            translate([0, 0, 3])
                hull() {
                    cube([eye_r * 2, eye_t, 0.01], center = true);
                    translate([0, 0, eye_h - eye_r])
                        rotate([90, 0, 0])
                            cylinder(h = eye_t, r = eye_r, center = true);
                }
        }
        // 5 mm through-bore at the crown
        translate([0, 0, 3 + eye_h - eye_r])
            rotate([90, 0, 0])
                cylinder(h = eye_t + 4, d = eye_bore_d, center = true);
    }
}

// ============ ONE ARM ASSEMBLY ============
module arm_assembly() {
    mt = 0.35;  // mid-body parameter for hydraulic connection

    // --- Curved jaw arm with ribs ---
    translate([piv_r, 0, piv_z])
        rotate([0, -jaw_angle, 0])
            color([0.55, 0.55, 0.60])
                jaw_arm();

    // --- Curved support strips flanking jaw ---
    for (s = [-1, 1])
        translate([piv_r, s * (jaw_d0 / 2 + 2.2), piv_z])
            rotate([0, -jaw_angle, 0])
                color([0.57, 0.57, 0.62])
                    support_arm();

    // --- 2 lower pivot mounting lugs (8 total in assembly) ---
    for (s = [-1, 1])
        translate([piv_r + 1.5, s * (jaw_d0 / 2 + lug_t / 2 + 1.2), piv_z])
            color([0.60, 0.60, 0.64])
                rotate([90, 0, 0])
                    lug_plate(7.5, 8.0, lug_t, 2.8);

    // --- 2 upper barrel attachment lugs ---
    for (s = [-1, 1])
        translate([brl_att_r + 1.0, s * (brl_or + lug_t / 2 + 1.5), brl_att_z])
            color([0.60, 0.60, 0.64])
                rotate([90, 0, 0])
                    lug_plate(5.5, 6.5, lug_t, 2.48);

    // --- 2 mid-body (knee) lugs on jaw ---
    for (s = [-1, 1])
        translate([jwx(mt) + 0.5, s * (jw(mt) / 2 + lug_t / 2 + 0.8), jwz(mt)])
            color([0.60, 0.60, 0.64])
                rotate([90, 0, 0])
                    lug_plate(5.0, 5.5, lug_t, 2.8);

    // --- Hydraulic barrel (dome-capped cylinder) ---
    brl_s = [brl_att_r, 0, brl_att_z];
    brl_e = [jwx(mt), 0, jwz(mt)];
    color([0.58, 0.58, 0.63]) {
        cyl_between(brl_s, brl_e, brl_or);
        translate(brl_s) sphere(r = brl_or);       // dome cap at hub end
        translate(brl_e) sphere(r = brl_or * 0.85); // cap at jaw end
    }

    // --- Follower rod with mushroom head ---
    f_off = brl_or + frod_r + 2.0;
    frod_s = [brl_att_r + 0.8, f_off, brl_att_z + 0.5];
    frod_e = [jwx(mt) + 0.8, f_off, jwz(mt) + 0.5];
    color([0.53, 0.53, 0.58]) {
        cyl_between(frod_s, frod_e, frod_r);
        // Mushroom head disc at hub end
        translate(frod_s) {
            sphere(r = frod_head_r);
            cylinder(h = 0.5, r = frod_head_r, center = true);
        }
        // Boss at jaw end
        translate(frod_e) sphere(r = frod_r * 3);
    }

    // --- Stepped pins at pivot and knee ---
    color([0.50, 0.50, 0.55]) {
        translate([piv_r, 0, piv_z])
            rotate([90, 0, 0])
                pin_body(jaw_d0 + 6);
        translate([jwx(mt), 0, jwz(mt)])
            rotate([90, 0, 0])
                pin_body(jw(mt) + 5);
    }
}

// ============ JAW ARM WITH RIBS ============
module jaw_arm() {
    segs = 20;
    difference() {
        union() {
            // Main tapered curved body built from hull segments
            for (i = [0 : segs - 1]) {
                t1 = i / segs;
                t2 = (i + 1) / segs;
                hull() {
                    translate([jcx(t1), 0, jcz(t1)])
                        cube([jd(t1), jw(t1), 0.01], center = true);
                    translate([jcx(t2), 0, jcz(t2)])
                        cube([jd(t2), jw(t2), 0.01], center = true);
                }
            }
            // Longitudinal stiffening ribs on both sides
            for (side = [-1, 1])
                for (i = [0 : segs - 1]) {
                    t1 = i / segs;
                    t2 = (i + 1) / segs;
                    if (t1 < 0.7) {
                        rw1 = jw(t1) * 0.25;
                        rw2 = jw(t2) * 0.25;
                        rh1 = jd(t1) * 0.35 * (1 - t1);
                        rh2 = jd(t2) * 0.35 * (1 - t2);
                        hull() {
                            translate([jcx(t1) + side * (jd(t1)/2 + max(rh1,0.05)/2 - 0.2), 0, jcz(t1)])
                                cube([max(rh1, 0.05), max(rw1, 0.05), 0.01], center = true);
                            translate([jcx(t2) + side * (jd(t2)/2 + max(rh2,0.05)/2 - 0.2), 0, jcz(t2)])
                                cube([max(rh2, 0.05), max(rw2, 0.05), 0.01], center = true);
                        }
                    }
                }
            // Cylindrical pivot boss at top
            translate([jcx(0), 0, 0])
                rotate([90, 0, 0])
                    cylinder(h = jaw_w0, r = jaw_pin_d / 2 + 2, center = true);
            // Mid-body boss at knee
            translate([jcx(0.35), 0, jcz(0.35)])
                rotate([90, 0, 0])
                    cylinder(h = jw(0.35), r = jaw_pin_d / 2 + 1.5, center = true);
        }
        // Pivot pin hole
        translate([jcx(0), 0, 0])
            rotate([90, 0, 0])
                cylinder(h = jaw_w0 + 12, d = jaw_pin_d, center = true);
        // Mid-body pin hole
        translate([jcx(0.35), 0, jcz(0.35)])
            rotate([90, 0, 0])
                cylinder(h = jaw_w0 + 12, d = jaw_pin_d, center = true);
    }
}

// ============ CURVED SUPPORT ARM ============
module support_arm() {
    segs = 16;
    // Thin curved strip running alongside the jaw arm
    for (i = [0 : segs - 1]) {
        t1 = i / segs;
        t2 = (i + 1) / segs;
        if (t1 < 0.75) {
            w1 = 2.5 * (1 - t1 * 0.4);
            w2 = 2.5 * (1 - t2 * 0.4);
            hull() {
                translate([jcx(t1), 0, jcz(t1)])
                    cube([w1, 1.5, 0.01], center = true);
                translate([jcx(t2), 0, jcz(t2)])
                    cube([w2, 1.5, 0.01], center = true);
            }
        }
    }
    // Small cylindrical protrusion at top tip (locating pin)
    translate([jcx(0), 0, 0])
        rotate([90, 0, 0])
            cylinder(h = 3, r = 1.0, center = true);
}

// ============ MOUNTING LUG PLATE ============
module lug_plate(w, h, t, hole_d) {
    difference() {
        linear_extrude(t, center = true)
            hull() {
                translate([-w / 2, -h * 0.4])
                    square([w, h * 0.65]);
                circle(r = w * 0.38);
            }
        // Through-hole for pin
        cylinder(h = t + 2, d = hole_d, center = true);
    }
}

// ============ STEPPED PIN ============
module pin_body(span) {
    translate([0, 0, -span / 2]) {
        // Main shank
        cylinder(h = span, r = pin_r);
        // Head at one end
        cylinder(h = 0.5, r = pin_head_r);
        // Shoulder step
        cylinder(h = 0.9, r = pin_r + 0.2);
        // Retention ring at other end
        translate([0, 0, span - 0.5])
            cylinder(h = 0.5, r = pin_r + 0.2);
    }
}

// ============ UTILITY: CYLINDER BETWEEN TWO POINTS ============
module cyl_between(p1, p2, r) {
    v = p2 - p1;
    h = norm(v);
    if (h > 0.001) {
        d = v / h;
        ax = cross([0, 0, 1], d);
        al = norm(ax);
        ang = acos(max(-1, min(1, d[2])));
        translate(p1) {
            if (al > 0.001)
                rotate(a = ang, v = ax)
                    cylinder(h = h, r = r);
            else if (d[2] >= 0)
                cylinder(h = h, r = r);
            else
                rotate([180, 0, 0])
                    cylinder(h = h, r = r);
        }
    }
}