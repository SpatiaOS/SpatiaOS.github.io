// Architectural tower model (interpreted from image)
// Tall residential slab tower: repetitive windows, balcony bands,
// floor-slab ledges, side annex, podium block, parapet + chamfered crown.

// ---------------- Parameters ----------------
tower_w   = 30;      // tower width  (X)
tower_d   = 22;      // tower depth  (Y)
n_floors  = 20;      // typical floors
floor_h   = 3;       // floor-to-floor height
base_h    = 5;       // taller ground floor

win_w  = 2.1;        // window width
win_h  = 1.5;        // window height
win_d  = 0.3;        // window frame depth
edge   = 2.5;        // facade margin
cols_f = 4;          // window columns front/back
cols_s = 3;          // window columns sides

balc_w = 3.2;        // balcony width
balc_d = 1.6;        // balcony projection
balc_t = 0.18;       // balcony slab thickness
rail_h = 1.0;        // railing height
rail_t = 0.08;       // railing thickness

para_h = 1.3;        // roof parapet height
para_t = 0.5;        // roof parapet thickness
pent_h = 2.2;        // penthouse height
crown_h = 3.2;       // chamfered crown height

annex_w = 12; annex_d = 16; annex_h = 9;   // left annex block
pod_w   = 9;  pod_d   = 15; pod_h   = 4;   // right podium block
plinth_h = 1.2; plinth_e = 3;              // base plinth

$fn = 24;
tower_z = base_h + n_floors*floor_h;       // top of shaft

c_body  = [0.72,0.73,0.76];
c_slab  = [0.58,0.60,0.63];
c_glass = [0.10,0.13,0.18];
c_frame = [0.85,0.86,0.88];

// ---------------- Modules ----------------
module window() {  // frame + recessed dark glazing + mullions
    color(c_frame) cube([win_w, win_d, win_h], center=true);
    color(c_glass) translate([0,0.08,0])
        cube([win_w-0.35, win_d, win_h-0.35], center=true);
    color(c_frame) {
        cube([0.1, win_d+0.04, win_h-0.3], center=true);
        cube([win_w-0.3, win_d+0.04, 0.1], center=true);
    }
}

module balcony() { // slab + 3-side railing, extends +Y from facade line
    color(c_slab) translate([0, balc_d/2, 0])
        cube([balc_w, balc_d, balc_t], center=true);
    color([0.3,0.32,0.35]) {
        translate([0, balc_d-rail_t/2, balc_t/2+rail_h/2])
            cube([balc_w, rail_t, rail_h], center=true);
        for (s=[-1,1]) translate([s*(balc_w/2-rail_t/2), balc_d/2, balc_t/2+rail_h/2])
            cube([rail_t, balc_d, rail_h], center=true);
    }
}

module parapet_ring(w,d,h,t) {
    difference() {
        cube([w,d,h], center=true);
        cube([w-2*t, d-2*t, h+2], center=true);
    }
}

module chamfer_cap(w1,d1,w2,d2,h,dx,dy) { // sloped crown via hull
    hull() {
        translate([0,0,0.1])   cube([w1,d1,0.2], center=true);
        translate([dx,dy,h])   cube([w2,d2,0.2], center=true);
    }
}

// ---------------- Main assembly ----------------
// Base plinth
color(c_slab) translate([0,0,plinth_h/2])
    cube([tower_w+plinth_e, tower_d+plinth_e, plinth_h], center=true);

// Tower shaft with entrance recess
difference() {
    color(c_body) translate([0,0,plinth_h + (tower_z-plinth_h)/2])
        cube([tower_w, tower_d, tower_z-plinth_h], center=true);
    color(c_glass) translate([0,-tower_d/2, base_h/2+0.5])
        cube([7, 2, base_h-1.5], center=true); // entrance glazing
}
// Ground floor glass band (front)
color(c_glass) translate([0,-tower_d/2-0.02, base_h/2+0.3])
    cube([tower_w-6, 0.15, base_h-2], center=true);

// Floor-slab ledge lines (strong horizontal banding)
for (f=[1:n_floors]) {
    z = base_h + (f-1)*floor_h;
    color(c_slab) {
        translate([0,-tower_d/2-0.06,z]) cube([tower_w-1.5, 0.22, 0.14], center=true);
        translate([0, tower_d/2+0.06,z]) cube([tower_w-1.5, 0.22, 0.14], center=true);
        translate([-tower_w/2-0.06,0,z]) cube([0.22, tower_d-1.5, 0.14], center=true);
        translate([ tower_w/2+0.06,0,z]) cube([0.22, tower_d-1.5, 0.14], center=true);
    }
}

// Windows + balconies per floor
for (f=[1:n_floors]) {
    zw = base_h + (f-0.5)*floor_h;   // window center height
    zb = base_h + (f-1)*floor_h;     // balcony slab height
    // front / back windows
    for (i=[0:cols_f-1]) {
        x = -tower_w/2 + edge + (tower_w-2*edge)/cols_f*(i+0.5);
        translate([x,-tower_d/2,zw]) window();
        translate([x, tower_d/2,zw]) rotate([0,0,180]) window();
    }
    // side windows
    for (j=[0:cols_s-1]) {
        y = -tower_d/2 + edge + (tower_d-2*edge)/cols_s*(j+0.5);
        translate([ tower_w/2,y,zw]) rotate([0,0,90]) window();
        translate([-tower_w/2,y,zw]) rotate([0,0,-90]) window();
    }
    // balcony bands (front center, side offset)
    translate([0,-tower_d/2,zb+balc_t]) rotate([0,0,180]) balcony();
    translate([tower_w/2,2.8,zb+balc_t]) rotate([0,0,90]) balcony();
}

// Corner fins
color(c_slab) for (s=[-1,1])
    translate([s*(tower_w/2-0.2), -tower_d/2+0.2, plinth_h+(tower_z-plinth_h)/2])
        cube([0.5,0.5,tower_z-plinth_h], center=true);

// ---------------- Roof ----------------
color(c_slab) translate([0,0,tower_z+para_h/2])
    parapet_ring(tower_w, tower_d, para_h, para_t);
color(c_body) translate([0,-0.5,tower_z+pent_h/2])
    cube([tower_w-5, tower_d-7, pent_h], center=true);
color(c_slab) translate([0,-0.5,tower_z+pent_h])
    chamfer_cap(tower_w-5, tower_d-7, tower_w-12, tower_d-13, crown_h, 2.5, 1.5);

// ---------------- Annex (left block) ----------------
ax = -tower_w/2 - annex_w/2 + 1;
color(c_body) translate([ax,-2,annex_h/2])
    cube([annex_w, annex_d, annex_h], center=true);
color(c_slab) translate([ax,-2,annex_h+0.3])
    parapet_ring(annex_w, annex_d, 0.6, 0.35);
color(c_slab) translate([ax,-2,annex_h+0.4])
    chamfer_cap(annex_w-2, annex_d-2, annex_w-2, 0.3, 1.5, 0, 0); // skylight ridge

// ---------------- Podium (right block) ----------------
color(c_body) translate([tower_w/2+pod_w/2-0.5, 1, pod_h/2])
    cube([pod_w, pod_d, pod_h], center=true);
color(c_slab) translate([tower_w/2+pod_w/2-0.5, 1, pod_h+0.25])
    parapet_ring(pod_w, pod_d, 0.5, 0.3);