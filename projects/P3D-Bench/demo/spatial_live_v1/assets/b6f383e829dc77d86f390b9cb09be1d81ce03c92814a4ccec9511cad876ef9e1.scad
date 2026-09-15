// ============================================================
//  High-rise residential tower on a low podium with gabled cap
//  - 20 storey slab tower, balcony bands on the front facade
//  - punched window grid on the side facades
//  - low podium block with roof deck/parapet at the base
//  - gable (pitched) roof crown with overhanging cornice
// ============================================================

// ---------------- Parameters (mm) ----------------
$fn = 24;

tower_w   = 16;                 // tower width  (X)
tower_d   = 12;                 // tower depth  (Y)
floors    = 20;                 // number of storeys
floor_h   = 3.0;                // storey height
tower_h   = floors * floor_h;   // overall cladding height

sill_h    = 0.55;               // spandrel below windows
win_h     = 1.90;               // window opening height
recess    = 0.35;               // glazing setback into the facade
pier      = 0.90;               // solid corner piers (front facade)
cut_extra = 0.30;               // cutter overshoot outside the face

side_pier = 1.00;               // solid piers at the side facade ends
side_wins = 4;                  // windows per storey per side facade
side_span = tower_d - 2*side_pier;
pitch     = side_span / side_wins;
side_winw = pitch - 0.40;
mull_w    = 0.16;               // muntin bar size
munt_t    = 0.02;               // muntin protrusion past the facade

balc_proj = 1.00;               // balcony projection
balc_t    = 0.22;               // balcony slab thickness
rail_h    = 0.85;               // balcony railing height
rail_t    = 0.10;               // railing thickness
first_balc_floor = 2;           // floors below the podium top

pod_w     = 19;                 // podium width
pod_d     = 9;                  // podium depth in front of the tower
pod_x     = -1.5;               // podium lateral offset
pod_h     = 6.5;                // podium body height
par_h     = 1.0;                // podium parapet height
par_t     = 0.35;               // podium wall thickness

wing_w    = 5;                  // low base wing (right of the tower)
wing_d    = tower_d + 3;
wing_h    = 5.5;

corn_ov   = 0.80;               // cornice overhang
corn_t    = 0.90;               // cornice thickness
roof_h    = 4.50;               // gable ridge rise
roof_ov   = 0.60;               // roof overhang

// ---------------- Modules ----------------

// Full tower mass
module tower_core() {
    translate([-tower_w/2, -tower_d/2, 0])
        cube([tower_w, tower_d, tower_h]);
}

// Recessed window band on the front (-Y) facade
module front_cuts() {
    for (f = [first_balc_floor : floors-1])
        translate([-tower_w/2 + pier,
                   -tower_d/2 - cut_extra,
                   f*floor_h + sill_h])
            cube([tower_w - 2*pier, recess + cut_extra, win_h]);
}

// Punched window openings on a side (-X) facade
module side_cuts() {
    for (f = [0 : floors-1], i = [0 : side_wins-1])
        translate([-tower_w/2 - cut_extra,
                   -tower_d/2 + side_pier + i*pitch + 0.20,
                   f*floor_h + sill_h])
            cube([recess + cut_extra, side_winw, win_h]);
}

// Muntin crosses inside the side window openings (double-hung look)
module side_muntins() {
    for (f = [0 : floors-1], i = [0 : side_wins-1]) {
        y0 = -tower_d/2 + side_pier + i*pitch + 0.20;
        z0 = f*floor_h + sill_h;
        // horizontal bar
        translate([-tower_w/2 - munt_t,
                   y0 + side_winw/2 - mull_w/2,
                   z0 + win_h/2 - mull_w/2])
            cube([recess + munt_t, mull_w, mull_w]);
        // vertical bar
        translate([-tower_w/2 - munt_t,
                   y0 + side_winw/2 - mull_w/2,
                   z0 + 0.25])
            cube([recess + munt_t, mull_w, win_h - 0.50]);
    }
}

// Balcony slabs and railings on the front facade
module balconies() {
    for (f = [first_balc_floor : floors-1]) {
        z = f * floor_h;
        // slab
        translate([-tower_w/2 + 0.3, -tower_d/2 - balc_proj, z])
            cube([tower_w - 0.6, balc_proj + 0.1, balc_t]);
        // front railing
        translate([-tower_w/2 + 0.3, -tower_d/2 - balc_proj, z + balc_t])
            cube([tower_w - 0.6, rail_t, rail_h]);
        // side return railings
        for (s = [-1, 1])
            translate([s > 0 ? tower_w/2 - 0.3 - rail_t : -tower_w/2 + 0.3,
                       -tower_d/2 - balc_proj, z + balc_t])
                cube([rail_t, balc_proj, rail_h]);
    }
}

// Low podium block with roof deck and parapet
module podium() {
    difference() {
        translate([pod_x - pod_w/2, -tower_d/2 - pod_d, 0])
            cube([pod_w, pod_d + 0.5, pod_h + par_h]);
        // hollow the deck, leaving walls on three sides
        translate([pod_x - pod_w/2 + par_t,
                   -tower_d/2 - pod_d + par_t,
                   pod_h])
            cube([pod_w - 2*par_t, pod_d - par_t + 0.1, par_h + 1]);
    }
}

// Low stepped wing along the right side of the tower base
module base_wing() {
    translate([tower_w/2 - 0.5, -tower_d/2 - 2, 0])
        cube([wing_w, wing_d, wing_h]);
    translate([tower_w/2 - 0.8, -tower_d/2 - 2.3, wing_h])
        cube([wing_w + 0.6, wing_d + 0.6, 0.3]);
}

// Overhanging cornice plus gabled roof cap (ridge along Y)
module roof() {
    translate([-tower_w/2 - corn_ov, -tower_d/2 - corn_ov, tower_h])
        cube([tower_w + 2*corn_ov, tower_d + 2*corn_ov, corn_t]);
    translate([0, tower_d/2 + roof_ov, tower_h + corn_t])
        rotate([90, 0, 0])
            linear_extrude(height = tower_d + 2*roof_ov)
                polygon(points = [[-tower_w/2 - roof_ov, 0],
                                  [ tower_w/2 + roof_ov, 0],
                                  [ 0, roof_h]]);
}

// ---------------- Assembly ----------------
union() {
    difference() {
        tower_core();
        front_cuts();
        mirror([0, 1, 0]) front_cuts();     // rear facade
        side_cuts();
        mirror([1, 0, 0]) side_cuts();      // +X facade
    }
    side_muntins();
    mirror([1, 0, 0]) side_muntins();
    balconies();
    podium();
    base_wing();
    roof();
}