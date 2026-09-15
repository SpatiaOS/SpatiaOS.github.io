// ------------------------------------------------------------
// High-rise residential tower with balconied and windowed facades,
// corner podium, roof penthouse with triangular pitched roof,
// and a low annex block (recreation of reference image).
// All dimensions in millimeters (1 unit = 1 mm, building scale).
// ------------------------------------------------------------

// ---------------- Parameters ----------------
$fn = 64;

floor_h   = 3;      // storey height
n_floors  = 15;     // tower storeys above podium
podium_h  = 6;      // 2-storey base podium
podium_off= 1.2;    // podium outward offset from tower plan
balc_d    = 1.4;    // balcony depth
parapet_h = 0.9;    // roof parapet height
ph_h      = 2.6;    // penthouse wall height
ph_ridge  = 1.3;    // penthouse ridge rise
tower_h   = podium_h + n_floors*floor_h;   // 51

// Tower plan (pentagon, counter-clockwise)
// edges: 0 front(balconies) 1 chamfer(windows) 2 right(windows) 3 rear 4 left(balconies)
plan = [[-9,-8],[2.5,-8],[9,-3.5],[9,4.5],[-9,4.5]];

// Penthouse triangle on the roof (apex pointing front)
ph_pts = [[-2,-5.5],[5.5,1.5],[-6.5,1.5]];

// Colors (visual only)
c_wall  = [0.80,0.80,0.82];
c_dark  = [0.12,0.12,0.13];
c_white = [0.92,0.92,0.92];
c_roof  = [0.62,0.62,0.64];

// ---------------- Helper functions ----------------
function edgelen(a,b)      = norm(b-a);
function band_cols(L)      = max(1, floor((L-1.6)/1.5));
function band_pitch(L)     = (L-1.6)/band_cols(L);
function band_w(L)         = min(1.2, band_pitch(L)-0.45);

// Local frame on a plan edge: origin at midpoint, +x along edge, +y outward
module face_frame(A,B) {
    L = edgelen(A,B);
    u = (B-A)/L;
    n = [u[1], -u[0]];           // outward normal (CCW plan)
    translate([(A[0]+B[0])/2, (A[1]+B[1])/2, 0])
        multmatrix([[u[0], n[0], 0, 0],
                    [u[1], n[1], 0, 0],
                    [0,    0,    1, 0],
                    [0,    0,    0, 1]])
            children();
}

// ---------------- Building components ----------------

// 2-storey podium: mitered outward offset of the tower plan
module podium() {
    color(c_wall)
        linear_extrude(podium_h)
            offset(delta = podium_off) polygon(plan);
}

// Main tower shaft
module tower() {
    color(c_wall) linear_extrude(tower_h) polygon(plan);
}

// Roof deck + parapet ring around the tower outline
module roof() {
    color(c_roof) translate([0,0,tower_h]) linear_extrude(0.12) polygon(plan);
    color(c_wall) translate([0,0,tower_h])
        linear_extrude(parapet_h)
            difference() {
                offset(delta = 0.22) polygon(plan);
                polygon(plan);
            }
}

// Penthouse: triangular walls + wedge roof (ridge over back edge, apex low)
module penthouse_walls() {
    color(c_wall) translate([0,0,tower_h]) linear_extrude(ph_h) polygon(ph_pts);
}
module penthouse_roof() {
    z1 = tower_h + ph_h;
    z2 = z1 + ph_ridge;
    pts = [[-6.5,1.5,z1],[5.5,1.5,z1],[-2,-5.5,z1],
           [-6.5,1.5,z2],[5.5,1.5,z2]];
    fcs = [[0,1,2],[0,3,4,1],[0,2,3],[1,4,2],[3,2,4]];
    color(c_roof) polyhedron(points = pts, faces = fcs);
}

// Small mechanical box on rear roof deck
module mech_box() {
    color(c_wall) translate([1.5,2.2,tower_h]) cube([4,2.3,1.6]);
}

// Low annex block at bottom-left with open parapet
module annex() {
    color(c_wall) {
        difference() {
            translate([-17,-8,0])     cube([8, 7.5, 5.7]);
            translate([-16.7,-7.7,4.9]) cube([7.4, 6.9, 1.2]);
        }
        color(c_dark) translate([-16.7,-7.7,4.75]) cube([7.4, 6.9, 0.15]); // deck
        color(c_wall) translate([-13.2,-4.4,4.9])  cube([0.25,0.25,0.8]);  // post
    }
}

// One balcony on a face: dark recess panel, slab, railing (ext = corner extend side)
module balcony(A, B, ext, f) {
    L  = edgelen(A,B);
    Lx = L + 1.4;
    translate([0,0,podium_h + f*floor_h])
        face_frame(A,B)
            translate([ext*0.7,0,0]) {
                color(c_dark)
                    translate([0,0.03,0.15+(floor_h-0.15)/2])
                        cube([L, 0.06, floor_h-0.15], center=true);
                translate([0, balc_d/2, 0.075])
                    cube([Lx, balc_d, 0.15], center=true);            // slab
                color(c_white)
                    translate([0, balc_d-0.04, 0.625])
                        cube([Lx, 0.08, 0.95], center=true);          // railing
            }
}

module balconies_all() {
    for (f=[0:n_floors-1]) {
        balcony(plan[0], plan[1], -1, f);   // front face, extend to left corner
        balcony(plan[4], plan[0],  1, f);   // left face,  extend to left corner
    }
}

// Dark corner column between the two balcony stacks
module corner_post() {
    color(c_dark)
        translate([-9.9,-8.9,podium_h])
            cube([0.9, 0.9, n_floors*floor_h]);
}

// Window band: two rows of recessed windows per floor on a face
module win_cutters(L) {
    p = band_pitch(L); w = band_w(L);
    for (i=[0:band_cols(L)-1], zz=[0.95,1.95])
        translate([-(L-1.6)/2 + p*(i+0.5), -0.2, zz])
            cube([w+0.12, 0.5, 1.05], center=true);
}
module win_panes(L) {
    p = band_pitch(L); w = band_w(L);
    for (i=[0:band_cols(L)-1], zz=[0.95,1.95])
        translate([-(L-1.6)/2 + p*(i+0.5), -0.28, zz])
            color(c_dark) cube([w, 0.3, 0.95], center=true);
}
module face_win_cut(A,B)
    face_frame(A,B)
        for (f=[0:n_floors-1])
            translate([0,0,podium_h + f*floor_h]) win_cutters(edgelen(A,B));
module face_win_pane(A,B)
    face_frame(A,B)
        for (f=[0:n_floors-1])
            translate([0,0,podium_h + f*floor_h]) win_panes(edgelen(A,B));

// Entrance door on the podium right face (local +y offset = podium_off)
module door() {
    face_frame(plan[2], plan[3])
        translate([1.5, podium_off + 0.02, 0])
            color(c_dark) cube([1.6, 0.16, 2.4]);
}

// ---------------- Main assembly ----------------
union() {
    color(c_wall)
        difference() {
            union() {
                podium();
                tower();
                roof();
                penthouse_walls();
                mech_box();
                annex();
                balconies_all();
                corner_post();
            }
            // window recesses on chamfer and right faces
            face_win_cut(plan[1], plan[2]);
            face_win_cut(plan[2], plan[3]);
        }

    // dark glass panes seated in the recesses
    face_win_pane(plan[1], plan[2]);
    face_win_pane(plan[2], plan[3]);

    penthouse_roof();
    door();
}