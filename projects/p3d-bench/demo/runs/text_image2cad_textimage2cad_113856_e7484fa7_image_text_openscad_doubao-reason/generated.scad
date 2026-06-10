// Global resolution setting
$fn = 100;

/* ==============================
   PARAMETRIC DIMENSIONS (all in mm)
   ============================== */
// Top disc plate
disc_dia = 180;
disc_thick = 10;
disc_hole_dia = 10;

// Central rod
rod_dia = 10;
rod_length = 500;
rod_overlap = 0.3;

// Flanged bushing
flange_bush_od = 56.5;
flange_bush_height = 11.25;
flange_thick = 3.25;
flange_boss_od = 44.25;
flange_bore_dia = 40;

// Locating plug / bushing
plug_main_r = 20;
plug_main_h = 44.22;
plug_rim_r = 23;
plug_rim_h = 5;
plug_total_h = 77.22;
plug_hole_dia = 24;
plug_hole_depth = 10;
plug_cone_h = plug_total_h - plug_main_h - plug_rim_h;
plug_cone_base_dia = plug_main_r * 2;
plug_cone_top_dia = 20;

// Splined support rings
splined_ring_od = 200;
splined_ring_id = 160;
splined_ring_thick = 3.9;
splined_teeth_count = 40;
splined_tooth_width = 3.9;
splined_tooth_height = (splined_ring_od - splined_ring_id) / 2;

// Vane slats
slat_thick = 3.9;
slat_width = 50;
slat_height = 300;
slat_curve_r = 572.5;
slat_count = 40;

// End knob
knob_width = 60;
knob_height = 81;
knob_sphere_r = knob_width / 2;

/* ==============================
   MODULE DEFINITIONS
   ============================== */
module disc_plate() {
    difference() {
        cylinder(d=disc_dia, h=disc_thick, center=false);
        translate([0, 0, -1]) cylinder(d=disc_hole_dia, h=disc_thick + 2, center=false);
    }
}

module rod() {
    cylinder(d=rod_dia, h=rod_length, center=false);
}

module flanged_bushing() {
    difference() {
        union() {
            // Lower flange
            cylinder(d=flange_bush_od, h=flange_thick, center=false);
            // Upper boss
            translate([0, 0, flange_thick]) cylinder(d=flange_boss_od, h=flange_bush_height - flange_thick, center=false);
        }
        // Central through bore
        translate([0, 0, -1]) cylinder(d=flange_bore_dia, h=flange_bush_height + 2, center=false);
    }
}

module locating_plug() {
    difference() {
        union() {
            // Top rim shoulder
            cylinder(r=plug_rim_r, h=plug_rim_h, center=false);
            // Main cylindrical body
            translate([0, 0, plug_rim_h]) cylinder(r=plug_main_r, h=plug_main_h, center=false);
            // Lower tapered cone
            translate([0, 0, plug_rim_h + plug_main_h]) cylinder(h=plug_cone_h, r1=plug_main_r, r2=plug_cone_top_dia/2, center=false);
        }
        // Blind top mounting hole
        cylinder(d=plug_hole_dia, h=plug_hole_depth, center=false);
    }
}

module splined_ring() {
    union() {
        // Base ring
        difference() {
            cylinder(d=splined_ring_od, h=splined_ring_thick, center=false);
            translate([0,0,-1]) cylinder(d=splined_ring_id, h=splined_ring_thick + 2, center=false);
        }
        // External teeth for slat mounting
        for (a = [0 : 360/splined_teeth_count : 359.9]) {
            rotate(a, [0,0,1])
            translate([splined_ring_id/2, -splined_tooth_width/2, 0])
            cube([splined_tooth_height, splined_tooth_width, splined_ring_thick]);
        }
    }
}

module curved_slat() {
    // Generate curved panel from cylindrical section
    rotate([0, 90, 0])
    difference() {
        // Outer curved face
        cylinder(r=slat_curve_r, h=slat_thick, center=true);
        // Inner curved face (remove inner cylinder)
        cylinder(r=slat_curve_r - slat_width, h=slat_thick + 2, center=true);
        // Cut to slat height
        translate([-slat_curve_r - 1, -slat_height/2 - 1, -slat_thick/2 -1])
        cube([slat_curve_r * 2 + 2, slat_height + 2, slat_thick + 2]);
        translate([-slat_curve_r -1, slat_height/2 + 1, -slat_thick/2 -1])
        cube([slat_curve_r * 2 + 2, slat_height + 2, slat_thick + 2]);
    }
}

module end_knob() {
    union() {
        // Spherical top grip
        translate([0, 0, knob_height - knob_sphere_r])
        sphere(r=knob_sphere_r);
        // Conical mounting stem
        cylinder(h=knob_height - knob_sphere_r, r1=knob_sphere_r, r2=plug_cone_top_dia/2, center=false);
    }
}

/* ==============================
   MAIN ASSEMBLY
   ============================== */
union() {
    // Top grounded mounting plate
    translate([0, 0, 0])
    disc_plate();

    // Central hanging rod
    translate([0, 0, -rod_overlap])
    rod();

    // Hub components at bottom of rod
    hub_base_z = -(disc_thick + 190);
    translate([0, 0, hub_base_z])
    rotate([180, 0, 0])
    flanged_bushing();

    translate([0, 0, hub_base_z + flange_bush_height])
    rotate([180, 0, 0])
    locating_plug();

    // Slat support rings
    slat_top_z = hub_base_z - 10;
    slat_mid_z = slat_top_z - slat_height / 2;
    slat_bottom_z = slat_top_z - slat_height;

    translate([0, 0, slat_top_z])
    splined_ring();

    translate([0, 0, slat_mid_z])
    splined_ring();

    translate([0, 0, slat_bottom_z])
    splined_ring();

    // Radial array of curved slats
    for (angle = [0 : 360/slat_count : 359.9]) {
        rotate(angle, [0,0,1])
        translate([splined_ring_od/2 - slat_width/2, 0, slat_top_z])
        rotate([0, 0, -90])
        curved_slat();
    }

    // Bottom end knob
    translate([0, 0, hub_base_z + flange_bush_height + plug_total_h])
    end_knob();
}