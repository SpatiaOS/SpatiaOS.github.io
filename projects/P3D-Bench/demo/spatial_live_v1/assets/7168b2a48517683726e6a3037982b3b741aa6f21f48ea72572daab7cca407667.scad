// =====================================================================
//  Drive-shaft assembly: splined shaft + two universal-joint knuckles
//  Overall envelope ~374 x 47 x 52 mm, axis along +X.
// =====================================================================
$fn = 72;

/* ------------------------- parameters (mm) ------------------------- */
stub_r    = 9.0;      // end stub radius
stub_cb   = 1.5;      // end chamfer
tube_r    = 11.0;     // input tube radius
shank_r   = 11.08;    // long shank radius
journal_r = 10.0;     // splined-pin journal radius
spline_ro = 8.62;     // 36-tooth spline root radius
spline_rt = 9.20;     // 36-tooth spline tip radius
spline_n  = 36;       // spline tooth count

hub_len  = 18;        // yoke hub length
hub_w    = 36;        // yoke hub width / height
hub_cr   = 7;         // hub corner radius
fork_len = 36;        // fork ear length
ear_gap  = 30;        // clear gap between fork ears
ear_t    = 5;         // fork ear thickness
ear_w    = 26;        // fork ear width
pin_d    = 8.0;       // cross-trunnion diameter
ear_hole = 8.4;       // fork ear counter bore (8 mm pin passages)
bore_d   = 19.48;     // countersunk through-bore on the yoke hub axis
cap_d    = 13.5;      // bearing cap on the cross ends

/* ----------------------- axial stations (mm) ---------------------- */
xA0 = 55;  xA1 = xA0 + hub_len;   //  55..73   yoke A hub (input side)
xB1 = 127; xB0 = xB1 - hub_len;   // 109..127  yoke B hub (splined bore)
xc1 = (xA1 + xB0)/2;              // 91  knuckle-1 centre
xS0 = 125; xS1 = 163;             // serrated / splined sleeve
xC0 = 161; xC1 = 168;             // shoulder collar
xK0 = 166; xK1 = 270;             // long smooth shank
xD0 = 268; xD1 = xD0 + hub_len;   // 268..286  yoke C hub
xE1 = 340; xE0 = xE1 - hub_len;   // 322..340  yoke D hub (splined bore)
xc2 = (xD1 + xE0)/2;              // 304 knuckle-2 centre
xJ0 = 330; xJ1 = 352;             // smooth journal
xQ0 = 350; xQ1 = 374;             // output stub

/* ---------------------------- modules ----------------------------- */
// rounded rectangle profile (for hub blocks)
module rrect(w, h, r) {
    hull() for (x = [-1, 1]) for (y = [-1, 1])
        translate([x*(w/2 - r), y*(h/2 - r)]) circle(r);
}

// straight splined sleeve, axis +X, base at origin
module spline_sleeve(len) {
    linear_extrude(height = len, convexity = 6)
        polygon([for (i = [0 : 2*spline_n - 1])
                    let (a = i*180/spline_n, r = (i % 2 == 0) ? spline_ro : spline_rt)
                    [r*cos(a), r*sin(a)]]);
}

// one clevis ear: plate from x=0..fork_len, thickness ear_t in Z, hole in Z
module fork_ear() {
    difference() {
        union() {
            translate([(fork_len - ear_w/2)/2, 0, 0])
                cube([fork_len - ear_w/2, ear_w, ear_t], center = true);
            translate([fork_len - ear_w/2, 0, 0])
                cylinder(h = ear_t, r = ear_w/2, center = true);
        }
        translate([hub_len + 18, 0, 0]) cylinder(h = ear_t + 2, d = ear_hole, center = true);
    }
}

// universal-joint yoke: hub at 0..hub_len, fork towards +X, ears on +/-Z
module yoke(flip = false, ear_axis = "z", bored = false) {
    rotate([0, 0, flip ? 180 : 0]) rotate([ear_axis == "z" ? 0 : 90, 0, 0]) {
        difference() {
            union() {
                rotate([0, 90, 0]) linear_extrude(hub_len) rrect(hub_w, hub_w, hub_cr);
                for (s = [-1, 1])
                    translate([hub_len, 0, s*(ear_gap + ear_t)/2]) fork_ear();
            }
            if (bored)
                translate([-1, 0, 0]) rotate([0, 90, 0]) cylinder(h = hub_len + 2, d = bore_d);
        }
    }
}

// cross / spider element: boss with four trunnions and bearing caps
module spider() {
    cube([hub_len*1.45, ear_gap*0.86, ear_gap*0.86], center = true);
    for (a = [0, 90, 180, 270]) rotate([a, 0, 0]) {
        translate([0, 0, 11]) cylinder(h = 22, d = pin_d, center = true);
        translate([0, 0, 22]) cylinder(h = 8, d = cap_d, center = true);
    }
}

/* --------------------------- assembly ----------------------------- */
module assembly() {
    // input shaft with its forked yoke (yoke A)
    color("silver") difference() {
        union() {
            cylinder(h = 4, r1 = stub_r - stub_cb, r2 = stub_r);
            translate([3, 0, 0])   cylinder(h = 22, r = stub_r);
            translate([22, 0, 0])  cylinder(h = 16, r = 11.5);
            translate([36, 0, 0])  cylinder(h = 22, r = tube_r);
            translate([xA0, 0, 0]) yoke(false, "z");
        }
        translate([-1, 0, 0]) rotate([0, 90, 0]) cylinder(h = 13, d = 12);
        translate([15, 0, 0]) rotate([0, 90, 0]) cylinder(h = 44, d = 6, center = true);
    }

    // matching yoke with splined/countersunk bore (yoke B)
    color("silver") translate([xB1, 0, 0]) yoke(true, "y", true);

    // splined / serrated coupling section
    color([0.22, 0.22, 0.24]) translate([xS0, 0, 0]) spline_sleeve(xS1 - xS0);

    // shoulder collar with small locating pin
    color("silver") translate([xC0, 0, 0]) cylinder(h = xC1 - xC0, r = journal_r);
    color("silver") translate([164.5, 0, 0]) rotate([90, 0, 0]) cylinder(h = 22, d = 3.5, center = true);

    // long smooth shank
    color("silver") translate([xK0, 0, 0]) cylinder(h = xK1 - xK0, r = shank_r);

    // output-side knuckle (yokes C and D)
    color("silver") {
        translate([xD0, 0, 0]) yoke(false, "z");
        translate([xE1, 0, 0]) yoke(true, "y", true);
    }

    // output journal and stub with retention hole
    color("silver") difference() {
        union() {
            translate([xJ0, 0, 0]) cylinder(h = xJ1 - xJ0, r = journal_r);
            translate([xQ0, 0, 0]) cylinder(h = 20, r = stub_r);
            translate([370, 0, 0]) cylinder(h = 4, r1 = stub_r, r2 = stub_r - stub_cb);
        }
        translate([362, 0, 0]) rotate([0, 90, 0]) cylinder(h = 44, d = 6, center = true);
    }

    // cross elements in both knuckles
    color([0.65, 0.65, 0.70]) {
        translate([xc1, 0, 0]) spider();
        translate([xc2, 0, 0]) spider();
    }
}

assembly();