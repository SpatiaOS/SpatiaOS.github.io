// ============================================================
// Pendant Lamp Assembly - Barrel Cage with Disc Plate and Rod
// ============================================================
$fn = 80;

// ===================== PARAMETERS =====================

// Disc plate (ceiling canopy)
disc_d       = 180;
disc_h       = 10;
disc_hole_d  = 10;

// Suspension rod
rod_d        = 10;
rod_len      = 500;

// Vane slats (barrel cage)
num_slats    = 40;
slat_thick   = 3.9;     // tangential thickness (thin)
slat_depth   = 50;      // radial extent
slat_height  = 300;     // vertical height

// Barrel profile radii (measured to slat center)
barrel_r_end = 78;      // at top and bottom of cage
barrel_r_mid = 113;     // at mid-height (widest point)

// Splined ring
ring_od      = 200;
ring_id      = 160;
ring_h       = 3.9;
ring_teeth_n = 40;
ring_tooth_r = 5;       // radial tooth height
ring_tooth_w = 3;       // tangential tooth width

// Flanged bushing
fb_flange_d  = 56.5;
fb_boss_d    = 44.25;
fb_bore_d    = 40;
fb_h_total   = 11.25;
fb_flange_h  = 3.25;

// Locating plug
plug_body_r  = 20;
plug_rim_r   = 23;
plug_h_total = 77;
plug_rim_h   = 5;
plug_body_h  = 44.22;
plug_cone_h  = plug_h_total - plug_body_h - plug_rim_h;
plug_bore_d  = 24;
plug_bore_dp = 10;
plug_base_r  = 10;

// Knob
knob_sph_r   = 30;
knob_h_total = 81;
knob_base_r  = 6;
knob_cone_h  = knob_h_total - knob_sph_r;

// Hub support spokes
spoke_count  = 4;
spoke_w      = 5;
spoke_h      = 5;

// ===================== Z LAYOUT =====================
// z = 0 at bottom of cage, z = 800 at top of disc plate
cage_bot     = 0;
cage_top     = slat_height;                    // 300
rod_bot      = cage_top;                        // 300
rod_top_z    = rod_bot + rod_len;               // 800
disc_bot     = rod_top_z - disc_h;              // 790

// Hub components (inside cage near top)
bushing_bot  = cage_top - fb_h_total;           // 288.75
plug_bot     = bushing_bot - plug_h_total;      // 211.75
knob_bot     = cage_top - knob_h_total + 18;    // dome protrudes ~18mm

// ===================== MODULES =====================

// Ceiling disc plate with central bore
module disc_plate() {
    difference() {
        cylinder(h = disc_h, d = disc_d);
        translate([0, 0, -0.5])
            cylinder(h = disc_h + 1, d = disc_hole_d);
    }
}

// Plain suspension rod
module rod() {
    cylinder(h = rod_len, d = rod_d);
}

// Splined ring with external rectangular teeth
module splined_ring() {
    body_r = ring_od / 2 - ring_tooth_r;
    union() {
        // Annular body
        difference() {
            cylinder(h = ring_h, r = body_r);
            translate([0, 0, -0.5])
                cylinder(h = ring_h + 1, d = ring_id);
        }
        // External teeth
        for (i = [0 : ring_teeth_n - 1])
            rotate([0, 0, i * 360 / ring_teeth_n])
                translate([body_r - 0.5, -ring_tooth_w / 2, 0])
                    cube([ring_tooth_r + 0.5, ring_tooth_w, ring_h]);
    }
}

// Flanged bushing: flange at bottom, boss extends up
module flanged_bushing() {
    difference() {
        union() {
            cylinder(h = fb_flange_h, d = fb_flange_d);
            cylinder(h = fb_h_total, d = fb_boss_d);
        }
        translate([0, 0, -0.5])
            cylinder(h = fb_h_total + 1, d = fb_bore_d);
    }
}

// Locating plug: conical base, cylindrical body, rim, blind bore at top
module locating_plug() {
    difference() {
        union() {
            // Tapered lower portion
            cylinder(h = plug_cone_h, r1 = plug_base_r, r2 = plug_body_r);
            // Main cylindrical body
            translate([0, 0, plug_cone_h])
                cylinder(h = plug_body_h, r = plug_body_r);
            // Top rim (shoulder)
            translate([0, 0, plug_cone_h + plug_body_h])
                cylinder(h = plug_rim_h, r = plug_rim_r);
        }
        // Blind bore opening from top
        translate([0, 0, plug_h_total - plug_bore_dp])
            cylinder(h = plug_bore_dp + 0.5, d = plug_bore_d);
    }
}

// Knob: spherical dome on top, conical stem below
module knob() {
    union() {
        // Conical stem
        cylinder(h = knob_cone_h, r1 = knob_base_r, r2 = knob_sph_r);
        // Upper hemisphere dome
        translate([0, 0, knob_cone_h])
            difference() {
                sphere(r = knob_sph_r);
                translate([0, 0, -knob_sph_r])
                    cube(knob_sph_r * 2, center = true);
            }
    }
}

// Radial support spokes connecting hub to ring
module hub_spokes() {
    inner_r = plug_rim_r;
    outer_r = ring_id / 2;
    for (i = [0 : spoke_count - 1])
        rotate([0, 0, i * 360 / spoke_count + 45])
            translate([inner_r, -spoke_w / 2, -spoke_h / 2])
                cube([outer_r - inner_r, spoke_w, spoke_h]);
}

// Single barrel-shaped vane slat at a given angular position
module barrel_slat(angle) {
    segs = 20;
    seg_h = slat_height / segs;
    rotate([0, 0, angle])
        for (i = [0 : segs - 1]) {
            z0 = i * seg_h;
            z1 = (i + 1) * seg_h;
            // Barrel radius follows sine curve for smooth bulge
            r0 = barrel_r_end +
                 (barrel_r_mid - barrel_r_end) * sin(z0 / slat_height * 180);
            r1 = barrel_r_end +
                 (barrel_r_mid - barrel_r_end) * sin(z1 / slat_height * 180);
            hull() {
                translate([r0, 0, z0])
                    cube([slat_depth, slat_thick, 0.01], center = true);
                translate([r1, 0, z1])
                    cube([slat_depth, slat_thick, 0.01], center = true);
            }
        }
}

// Complete barrel cage: 40 slats arranged radially
module vane_cage() {
    for (i = [0 : num_slats - 1])
        barrel_slat(i * 360 / num_slats);
}

// ===================== ASSEMBLY =====================

// 1. Ceiling disc plate
translate([0, 0, disc_bot])
    disc_plate();

// 2. Suspension rod (passes through disc bore)
translate([0, 0, rod_bot])
    rod();

// 3. Barrel cage of vane slats
translate([0, 0, cage_bot])
    vane_cage();

// 4. Splined ring at top of cage
translate([0, 0, cage_top - ring_h])
    splined_ring();

// 5. Flanged bushing (hub, coaxial with rod)
translate([0, 0, bushing_bot])
    flanged_bushing();

// 6. Locating plug (extends downward from bushing)
translate([0, 0, plug_bot])
    locating_plug();

// 7. Knob capping the hub (dome protrudes above cage)
translate([0, 0, knob_bot])
    knob();

// 8. Hub support spokes (structural connection)
translate([0, 0, cage_top - ring_h / 2])
    hub_spokes();