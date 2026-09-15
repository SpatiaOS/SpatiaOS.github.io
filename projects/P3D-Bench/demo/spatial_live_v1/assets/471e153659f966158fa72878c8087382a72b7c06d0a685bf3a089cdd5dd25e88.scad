// =============================================================
//  Slender residential high-rise tower
//  - Pentagonal (chamfered-corner) floor plan
//  - Balcony stack on one long facade
//  - Recessed window grids on the remaining facades
//  - Podium base + adjacent low annex block
//  - Cornice band + hipped (gable-like) crown roof
// =============================================================

$fn = 32;

// ---------- Tower plan ----------
tw   = 24;      // plan width  (X)
td   = 16;      // plan depth  (Y)
tch  = 9;       // chamfered corner size (+X/+Y corner)

// ---------- Floors ----------
nf       = 17;              // number of floors
fh       = 5.2;             // floor-to-floor height
H        = nf * fh;         // shaft height
fstart   = 2;               // first floor above the podium
band_t   = 0.6;             // projecting floor band thickness
band_out = 0.4;             // floor band projection

// ---------- Balconies (facade at y = 0) ----------
bal_proj = 3.2;             // balcony projection
bal_t    = 0.6;             // balcony slab thickness
rail_h   = 1.8;             // railing height
rail_n   = 3;               // horizontal rails
rail_t   = 0.20;            // rail bar thickness
screen_t = 0.5;             // side privacy screens
glz_d    = 1.0;             // glazing recess depth
louv_n   = 4;               // horizontal louvers per floor

// ---------- Windows ----------
w_w  = 3.4;  w_h = 2.5;  w_d = 0.5;   // panel size / recess depth
w_nx = 3;    w_nz = 2;   mull = 0.22; // panes + mullion thickness

// ---------- Podium ----------
pod_h   = 10;
pod_out = 6;

// ---------- Annex (low neighbouring block) ----------
anx      = [23, 18, 7.5];
anx_pos  = [-19, -13, 0];
anx_wall = 1.2;

// ---------- Crown ----------
cor_h   = 3.4;   cor_out = 1.3;   // cornice band
roof_h  = 10;    roof_in = 5.5;   // hip roof rise / inward taper

// =============================================================
//  2D plan profile (rectangle with one 45 deg chamfered corner)
// =============================================================
module plan() {
    polygon([[0,0],[tw,0],[tw,td-tch],[tw-tch,td],[0,td]]);
}

// =============================================================
//  Window helpers  (local frame: +x along facade, +y into wall)
// =============================================================
module win_cut(pw, ph, pd) {
    translate([-pw/2, -0.3, -ph/2]) cube([pw, pd + 0.3, ph]);
}

module win_grid(pw, ph, pd, nx, nz, t) {
    // full-depth ribs -> solidly attached to the recess back wall
    for (i = [1 : nx-1])
        translate([-pw/2 + i*pw/nx - t/2, -0.05, -ph/2])
            cube([t, pd + 0.05, ph]);
    for (j = [1 : nz-1])
        translate([-pw/2, -0.05, -ph/2 + j*ph/nz - t/2])
            cube([pw, pd + 0.05, t]);
}

// Distribute window panels along a facade of length "len"
// mode 0 = recess cuts, mode 1 = mullion grids
module facade(len, mode) {
    cnt   = max(1, floor((len - 1.0) / (w_w + 1.4)));
    pitch = len / cnt;
    for (i = [fstart : nf-1])
        for (k = [0 : cnt-1])
            translate([pitch*(k+0.5), 0, i*fh + fh/2 + 0.2])
                if (mode == 0) win_cut(w_w, w_h, w_d);
                else           win_grid(w_w, w_h, w_d, w_nx, w_nz, mull);
}

// Place window rows on all "closed" facades
module windowed_facades(mode) {
    // right short facade (x = tw)
    translate([tw, 0, 0]) rotate([0,0,90]) facade(td - tch, mode);
    // chamfer facade
    translate([tw, td - tch, 0]) rotate([0,0,135]) facade(tch*sqrt(2), mode);
    // rear long facade (y = td)
    translate([tw - tch, td, 0]) rotate([0,0,180]) facade(tw - tch, mode);
    // left short facade (x = 0)
    translate([0, td, 0]) rotate([0,0,-90]) facade(td, mode);
}

// =============================================================
//  Balcony facade (y = 0)
// =============================================================
module balcony_glazing_cuts() {
    for (i = [fstart : nf-3])
        translate([1.2, -0.3, i*fh + bal_t])
            cube([tw - 2.4, glz_d + 0.3, fh - 1.5]);
}

module balcony_stack() {
    for (i = [fstart : nf-3]) {
        z = i*fh;
        // projecting balcony slab
        translate([-0.6, -bal_proj, z]) cube([tw + 1.2, bal_proj + 0.8, bal_t]);
        // horizontal railing bars
        for (r = [0 : rail_n-1])
            translate([-0.6, -bal_proj, z + bal_t + 0.35 + r*(rail_h/rail_n)])
                cube([tw + 1.2, rail_t, rail_t*1.5]);
        // side privacy screens
        for (x = [-0.6, tw + 0.6 - screen_t])
            translate([x, -bal_proj, z + bal_t])
                cube([screen_t, bal_proj + 0.6, rail_h]);
        // horizontal louvers inside the glazed recess
        for (l = [1 : louv_n])
            translate([1.6, -0.05, z + bal_t + l*(fh - 1.5)/(louv_n + 1)])
                cube([tw - 3.2, glz_d + 0.05, 0.18]);
    }
    // large projecting canopy near the top of the balcony stack
    cz = (nf - 2)*fh;
    translate([-1.8, -bal_proj - 2.6, cz]) cube([tw + 3.6, bal_proj + 3.2, 1.4]);
    translate([-1.8, -bal_proj - 2.6, cz - 2.0]) cube([tw + 3.6, 0.9, 3.4]);
}

// =============================================================
//  Horizontal floor bands (thin slab edges all around)
// =============================================================
module floor_bands() {
    for (i = [1 : nf-1])
        translate([0, 0, i*fh - band_t/2])
            linear_extrude(band_t) offset(delta = band_out) plan();
}

// =============================================================
//  Crown : cornice band + hipped roof
// =============================================================
module crown() {
    // cornice / parapet band
    translate([0, 0, H]) linear_extrude(cor_h)
        offset(delta = cor_out) plan();
    // hip roof (hull between eaves outline and shrunken ridge outline)
    hull() {
        translate([0, 0, H + cor_h - 0.2]) linear_extrude(0.3)
            offset(delta = cor_out) plan();
        translate([0, 0, H + cor_h + roof_h]) linear_extrude(0.3)
            offset(delta = -roof_in) plan();
    }
}

// =============================================================
//  Podium base
// =============================================================
module podium() {
    linear_extrude(pod_h) offset(delta = pod_out) plan();
    translate([0, 0, pod_h - 0.4]) linear_extrude(0.9)
        offset(delta = pod_out + 0.8) plan();
}

// =============================================================
//  Annex : low open-top block next to the tower
// =============================================================
module annex() {
    translate(anx_pos) union() {
        cube([anx[0], anx[1], anx[2]*0.35]);            // solid plinth
        difference() {                                   // surrounding rim wall
            cube([anx[0], anx[1], anx[2]]);
            translate([anx_wall, anx_wall, anx[2]*0.35])
                cube([anx[0] - 2*anx_wall,
                      anx[1] - 2*anx_wall,
                      anx[2]]);
        }
    }
}

// =============================================================
//  Assembly
// =============================================================
union() {
    // tower shaft with all facade openings subtracted
    difference() {
        linear_extrude(H) plan();
        windowed_facades(0);
        balcony_glazing_cuts();
    }
    windowed_facades(1);   // window mullion grids
    floor_bands();         // horizontal slab bands
    balcony_stack();       // balconies, railings, canopy
    crown();               // cornice + hip roof
    podium();              // base
    annex();               // adjacent low block
}