// ================================================================
// DJ Controller Assembly — Parametric Model
// ================================================================
$fn = 60;

// --- Overall Assembly ---
total_length = 309;    // X
total_depth  = 247;    // Y (front face at Y=0)
total_height = 65;     // Z

// --- Base Plate ---
base_l  = 309;
base_d  = 245;
base_h  = 24;
base_ch = 5;

// --- Housing Cover (Top Panel) ---
panel_l     = 300;
panel_d     = 230;
panel_thick = 13;
panel_z     = base_h - 3;
surface_z   = panel_z + panel_thick;   // ≈ 34

// --- Corner Pillars ---
corner_w = 15;
corner_d = 15;

// --- Jog Wheels ---
jog_dia       = 86;
jog_r         = jog_dia / 2;
jog_h         = 20;
jog_plateau_d = 60.5;
jog_num_slots = 14;
jog_slot_w    = 3;
jog_slot_h    = 5;
jog_recess_r  = jog_r + 5;

jog_left  = [78,  152];
jog_right = [231, 97];

// --- Button Pads ---
pad_w  = 18.87;
pad_d  = 12.09;
pad_h  = 5.0;
pad_r  = 2.0;
pad_gx = 3.5;
pad_gy = 3.0;

// --- Knob Posts ---
knob_base_d = 14.89;
knob_top_d  = 5.5;
knob_h      = 17;

// --- Control Pins ---
pin_d = 1.5;
pin_h = 11;

// --- Front Panel Jacks ---
jack_flange_d = 18.2;
jack_boss_d   = 10;
jack_bore_d   = 4.92;

// --- Crossfader ---
cf_slot_len = 55;
cf_knob_w   = 14;
cf_knob_d   = 8;
cf_knob_h   = 12;

// ================================================================
// MODULES
// ================================================================

// Box with 45° chamfer on top edges
module cbox(l, d, h, c) {
    hull() {
        translate([c, c, 0])
            cube([l - 2*c, d - 2*c, h]);
        cube([l, d, max(h - c, 0.01)]);
    }
}

// Rounded-top button pad
module pad_single() {
    hull() {
        translate([pad_r, pad_r, 0])
            cylinder(r=pad_r, h=0.01, $fn=16);
        translate([pad_w-pad_r, pad_r, 0])
            cylinder(r=pad_r, h=0.01, $fn=16);
        translate([pad_r, pad_d-pad_r, 0])
            cylinder(r=pad_r, h=0.01, $fn=16);
        translate([pad_w-pad_r, pad_d-pad_r, 0])
            cylinder(r=pad_r, h=0.01, $fn=16);
        // Slightly inset top for pillow effect
        translate([pad_r+0.3, pad_r+0.3, pad_h])
            cylinder(r=pad_r*0.7, h=0.01, $fn=16);
        translate([pad_w-pad_r-0.3, pad_r+0.3, pad_h])
            cylinder(r=pad_r*0.7, h=0.01, $fn=16);
        translate([pad_r+0.3, pad_d-pad_r-0.3, pad_h])
            cylinder(r=pad_r*0.7, h=0.01, $fn=16);
        translate([pad_w-pad_r-0.3, pad_d-pad_r-0.3, pad_h])
            cylinder(r=pad_r*0.7, h=0.01, $fn=16);
    }
}

// Grid of pads
module pad_grid(cols, rows) {
    for (c=[0:cols-1], r=[0:rows-1])
        translate([c*(pad_w+pad_gx), r*(pad_d+pad_gy), 0])
            pad_single();
}

// Jog wheel with peripheral slots and indicator boss
module jog_wheel() {
    // Recessed ring surround
    difference() {
        cylinder(r=jog_recess_r, h=4, $fn=80);
        translate([0, 0, 2])
            cylinder(r=jog_r+1, h=4, $fn=80);
        translate([0, 0, -1])
            cylinder(r=jog_recess_r-4, h=6, $fn=80);
    }
    // Main disc
    difference() {
        union() {
            // Tapered skirt
            cylinder(r1=jog_r+2, r2=jog_r, h=4, $fn=80);
            // Body
            translate([0, 0, 4])
                cylinder(r=jog_r, h=jog_h-5, $fn=80);
            // Raised plateau
            translate([0, 0, jog_h-1])
                cylinder(r=jog_plateau_d/2, h=2, $fn=80);
        }
        // Circumferential slots
        for (i=[0:jog_num_slots-1])
            rotate([0, 0, i*360/jog_num_slots])
                translate([jog_r-5, -jog_slot_w/2, jog_h-jog_slot_h])
                    cube([10, jog_slot_w, jog_slot_h+1]);
    }
    // Indicator hemisphere
    translate([jog_plateau_d/4, 0, jog_h+1])
        difference() {
            sphere(d=4, $fn=20);
            translate([0, 0, -3]) cube(6, center=true);
        }
}

// Bell-shaped socket post with pin
module knob_assembly() {
    // Flange base
    cylinder(d=knob_base_d, h=2, $fn=32);
    // Tapered bell body
    cylinder(d1=knob_base_d-1, d2=knob_top_d, h=knob_h, $fn=32);
    // Top collar
    translate([0, 0, knob_h-3])
        cylinder(d=knob_top_d+2, h=3, $fn=32);
    // Protruding pin
    cylinder(d=pin_d, h=knob_h+pin_h, $fn=16);
}

// Flanged bushing (front panel jack) pointing -Y
module front_jack() {
    rotate([90, 0, 0]) {
        difference() {
            union() {
                // Flange face
                cylinder(d=jack_flange_d, h=2.5, $fn=32);
                // Protruding boss
                translate([0, 0, 2.5])
                    cylinder(d=jack_boss_d, h=6, $fn=32);
            }
            // Central bore
            translate([0, 0, -1])
                cylinder(d=jack_bore_d, h=12, $fn=24);
        }
    }
}

// Crossfader with slot and handle
module crossfader() {
    // Slot groove
    translate([-cf_slot_len/2, -2, -1])
        cube([cf_slot_len, 4, 2]);
    // Side rails
    for (s=[-1, 1])
        translate([-cf_slot_len/2-2, s*3.5, 0])
            cube([cf_slot_len+4, 1.5, 4]);
    // Knob handle
    hull() {
        translate([-cf_knob_w/2, -cf_knob_d/2, 0])
            cube([cf_knob_w, cf_knob_d, cf_knob_h-4]);
        translate([-cf_knob_w/2+2, -cf_knob_d/2+1.5, cf_knob_h-4])
            cube([cf_knob_w-4, cf_knob_d-3, 4]);
    }
}

// Wedge guide block
module wedge_guide() {
    linear_extrude(height=14)
        polygon([[-4, 0], [4, 0], [3, 8], [-3, 8]]);
}

// Locating pin with mushroom head
module locating_pin() {
    // Tapered shank
    cylinder(d1=8, d2=4.5, h=12, $fn=24);
    // Domed head
    translate([0, 0, 12])
        resize([8, 8, 5])
            sphere(d=8, $fn=24);
}

// Ball stud
module ball_stud() {
    // Cylindrical collar
    cylinder(d=8, h=5, $fn=24);
    // Spherical head
    translate([0, 0, 5])
        sphere(d=12, $fn=30);
}

// ================================================================
// ASSEMBLY
// ================================================================

px = (base_l - panel_l) / 2;
py = (base_d - panel_d) / 2;

// ---- Base Plate ----
color([0.74, 0.74, 0.77])
cbox(base_l, base_d, base_h, base_ch);

// ---- Front edge recess (stepped panel area) ----
color([0.72, 0.72, 0.75])
translate([corner_w, 0, 0])
    cube([base_l - 2*corner_w, 12, base_h - 5]);

// ---- Housing Cover ----
color([0.71, 0.71, 0.74])
translate([px, py, panel_z])
    cbox(panel_l, panel_d, panel_thick, 3);

// ---- Corner Pillars ----
color([0.70, 0.70, 0.73])
for (ix=[0,1], iy=[0,1])
    translate([
        ix * (base_l - corner_w),
        iy * (base_d - corner_d),
        0
    ])
    cbox(corner_w, corner_d, surface_z + 1, 2);

// ---- Edge rails (front & back) ----
color([0.71, 0.71, 0.74]) {
    translate([corner_w, 0, 0])
        cube([base_l - 2*corner_w, py + 1, surface_z - 3]);
    translate([corner_w, base_d - py - 1, 0])
        cube([base_l - 2*corner_w, py + 1, surface_z - 3]);
}

// ---- Left Jog Wheel ----
color([0.68, 0.68, 0.72])
translate([jog_left[0], jog_left[1], surface_z - 2])
    jog_wheel();

// ---- Right Jog Wheel ----
color([0.68, 0.68, 0.72])
translate([jog_right[0], jog_right[1], surface_z - 2])
    jog_wheel();

// ---- Button Pad Groups (26 total) ----
color([0.66, 0.66, 0.70]) {
    // Grp 1: Behind left jog, 1×4 row (4)
    translate([30, 200, surface_z])
        pad_grid(4, 1);

    // Grp 2: Right of left jog upper, 2×2 (4)
    translate([130, 185, surface_z])
        pad_grid(2, 2);

    // Grp 3: Center upper, 2×2 (4)
    translate([178, 185, surface_z])
        pad_grid(2, 2);

    // Grp 4: Far-right upper, 2×1 (2)
    translate([254, 190, surface_z])
        pad_grid(2, 1);

    // Grp 5: Left of right jog, 2×2 (4)
    translate([166, 58, surface_z])
        pad_grid(2, 2);

    // Grp 6: Right of right jog, 2×2 (4)
    translate([258, 70, surface_z])
        pad_grid(2, 2);

    // Grp 7: Center near crossfader, 2×2 (4)
    translate([132, 110, surface_z])
        pad_grid(2, 2);
}
// Total pads: 4+4+4+2+4+4+4 = 26 ✓

// ---- Knob Assemblies (8 posts + 8 pins) ----
color([0.64, 0.64, 0.68]) {
    kp = [
        [48, 218],   [96, 218],
        [156, 218],  [198, 218],
        [256, 200],  [282, 200],
        [256, 148],  [282, 148]
    ];
    for (p = kp)
        translate([p[0], p[1], surface_z])
            knob_assembly();
}

// ---- Standalone Pins (3 extra, 11 total) ----
color([0.78, 0.78, 0.82]) {
    sp = [[44, 172], [124, 157], [194, 147]];
    for (p = sp)
        translate([p[0], p[1], surface_z])
            cylinder(d=pin_d, h=pin_h, $fn=16);
}

// ---- Front Panel Jacks (6 flanged bushings) ----
color([0.62, 0.62, 0.66]) {
    jz = base_h / 2 + 1;
    jxs = [28, 52, 76, 106, 136, 166];
    for (x = jxs)
        translate([x, 8, jz])
            front_jack();
}

// ---- Crossfader Assembly ----
color([0.64, 0.64, 0.68])
translate([total_length/2, 125, surface_z])
    crossfader();

// ---- Wedge Guide Blocks (3, 120° pattern) ----
color([0.66, 0.66, 0.70]) {
    wcx = total_length / 2;
    wcy = 125;
    for (i = [0:2])
        translate([
            wcx + 22*cos(i*120 + 30),
            wcy + 22*sin(i*120 + 30),
            surface_z
        ])
        rotate([0, 0, i*120])
            wedge_guide();
}

// ---- Structural Bars (3, 120° pattern) ----
color([0.68, 0.68, 0.72]) {
    bcx = total_length / 2;
    bcy = 125;
    for (i = [0:2])
        translate([
            bcx + 16*cos(i*120 + 90),
            bcy + 16*sin(i*120 + 90),
            surface_z
        ])
        rotate([0, 0, i*120 + 60])
            translate([-0.55, -1, 0])
                cube([1.1, 2, 20]);
}

// ---- Ball Studs (2, front panel area) ----
color([0.60, 0.60, 0.64])
for (x = [34, 64])
    translate([x, 5, base_h/2 + 2])
        rotate([-90, 0, 0])
            ball_stud();

// ---- Locating Pins (3, mushroom-headed) ----
color([0.63, 0.63, 0.67])
for (i = [0:2])
    translate([82 + i*72, 44, surface_z])
        locating_pin();