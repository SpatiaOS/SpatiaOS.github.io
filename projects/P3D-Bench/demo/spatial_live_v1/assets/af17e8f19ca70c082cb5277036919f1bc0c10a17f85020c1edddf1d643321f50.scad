// ============================================================
//  Scissors assembly : two blade halves + slotted knob pivot
// ============================================================
$fn = 72;

// ---- global proportions (mm) ----
blade_th    = 2.0;    // steel blade / pivot region thickness (per half)
loop_th     = 5.0;    // moulded finger-loop thickness
blade_len   = 95;     // pivot -> blade tip
blade_w     = 4.3;    // blade width at the pivot
tip_w       = 0.25;   // residual width at the point
pivot_d     = 1.583;  // pivot bore
pivot_pad_r = 4.4;    // material pad around the bore
open_angle  = 6;      // half opening angle of the scissor

// finger loops : [cx, cy, rx, ry, tilt, band width]
LOOP_BIG    = [24, 37, 18.0, 22, -10, 6.0];
LOOP_SMALL  = [12, 45, 10.0, 16,  -6, 5.0];

groove_d    = 0.6;    // decorative rim groove depth
groove_in   = 1.2;    // groove inset from the band edges

// ---- slotted knob fastener ----
shaft_len   = 4.0;
shaft_r     = pivot_d/2 - 0.02;
head_th     = 1.0;
head_r_top  = 2.66;
head_r_bot  = 2.56;
slot_w      = 0.8;
slot_d      = 0.45;
slot_ang    = 70;

// ---- helpers ----
function rot2(p,a)      = [p[0]*cos(a)-p[1]*sin(a), p[0]*sin(a)+p[1]*cos(a)];
function bez(p0,p1,p2,t)= [for (k=[0,1]) pow(1-t,2)*p0[k] + 2*(1-t)*t*p1[k] + t*t*p2[k]];
function neck_r(t)      = 3.3 - 0.5*t;
function attach_pt(L)   = [L[0],L[1]] + rot2([-L[2]*0.30, -L[3]*0.86], L[4]);
function stub_pt(L)     = [L[0],L[1]] + rot2([-L[2]*0.25, -L[3]*0.90], L[4]);

// ---- 2D profiles ----
module blade_2d() {
    n = 28;
    outer = [for (i=[0:n]) let (t = i/n)
                [-(tip_w + (blade_w - tip_w)*pow(1-t, 1.35)), -t*blade_len]];
    polygon(concat([[0, 4], [0, -blade_len]], [for (i=[n:-1:0]) outer[i]]));
}

module neck_2d(ap) {                       // quadratic-bezier tapered shank
    p0 = [0, 2];
    p1 = [ap[0]*0.12, ap[1]*0.55];
    n  = 20;
    for (i = [0:n-1]) hull() {
        translate(bez(p0,p1,ap, i/n))     circle(r = neck_r(i/n));
        translate(bez(p0,p1,ap,(i+1)/n))  circle(r = neck_r((i+1)/n));
    }
}

module loop_2d(L) {                        // elliptical finger ring
    translate([L[0], L[1]]) rotate(L[4])
        difference() {
            scale([L[2], L[3]]) circle(r = 1, $fn = 120);
            offset(r = -L[5]) scale([L[2], L[3]]) circle(r = 1, $fn = 120);
        }
}

module groove_2d(L) { offset(r = -groove_in) loop_2d(L); }

// ---- one blade half (thin blade + thick handle) ----
module scissor_half(L) {
    ap = attach_pt(L);
    difference() {
        union() {
            linear_extrude(blade_th) {
                blade_2d();
                circle(r = pivot_pad_r);
                neck_2d(ap);
            }
            // thin shank -> thick handle thickness transition
            hull() {
                linear_extrude(blade_th) translate(ap) circle(r = neck_r(1));
                translate([0,0,blade_th/2]) linear_extrude(loop_th, center=true)
                    translate(stub_pt(L)) circle(r = L[5]/2);
            }
            translate([0,0,blade_th/2])
                linear_extrude(loop_th, center = true) loop_2d(L);
        }
        // pivot bore
        translate([0,0,-1]) cylinder(h = blade_th + 2, d = pivot_d);
        // rim grooves on both handle faces
        translate([0,0, blade_th/2 + loop_th/2 - groove_d])
            linear_extrude(groove_d + 1) groove_2d(L);
        translate([0,0, blade_th/2 - loop_th/2 - 1])
            linear_extrude(groove_d + 1) groove_2d(L);
    }
}

// ---- slotted knob fastener ----
module knob_head(r) {                      // slightly domed disc, z = 0..head_th
    union() {
        cylinder(h = head_th*0.55, r = r);
        translate([0,0,head_th*0.55])
            cylinder(h = head_th*0.45, r1 = r, r2 = r*0.82);
    }
}

module knob_fastener() {
    difference() {
        union() {
            cylinder(h = shaft_len, r = shaft_r);              // shaft in the bores
            mirror([0,0,1]) knob_head(head_r_bot);             // lower flange
            translate([0,0,shaft_len]) knob_head(head_r_top);  // upper flange
        }
        // driver slot across the upper head
        translate([0,0, shaft_len + head_th - slot_d + 1])
            rotate([0,0,slot_ang])
                cube([2*head_r_top + 2, slot_w, 2], center = true);
    }
}

// ============================================================
//  Assembly
// ============================================================
module scissors() {
    color("silver") {
        // grounded half : large loop, handle to +X, tip to -X
        rotate([0,0,-open_angle]) scissor_half(LOOP_BIG);
        // pivoting half : small loop, mirrored and stacked on top
        translate([0,0,blade_th]) rotate([0,0,open_angle])
            mirror([1,0,0]) scissor_half(LOOP_SMALL);
    }
    color("dimgray") translate([0,0,0]) knob_fastener();
}

scissors();