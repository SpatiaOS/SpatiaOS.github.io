// Parameters
$fn = 100;

// Disc plate
disc_dia = 180;
disc_thick = 10;
disc_hole_dia = 10;

// Rod
rod_dia = 10;
rod_len = 500;

// Flanged bushing
bushing_od = 56.5;
bushing_height = 11.25;
bushing_bore = 40;
bushing_flange_thick = 3.25;
bushing_boss_od = 44.25;
bushing_boss_height = bushing_height - bushing_flange_thick; // 8.0

// Bushing / locating plug
plug_main_r = 20;
plug_rim_r = 23;
plug_main_h = 44.22;
plug_rim_h = 5;
plug_bore_dia = 24;
plug_bore_depth = 10;
plug_total_h = 77;
plug_taper_h = plug_total_h - plug_main_h - plug_rim_h; // ~27.78
plug_taper_bottom_r = 10;

// Knob
knob_width = 60;
knob_height = 81;
knob_sphere_r = 30;
knob_base_dia = 20;

// Splined ring
ring_od = 200;
ring_id = 160;
ring_thick = 3.9;
ring_teeth = 40;
tooth_depth = 4;
tooth_width = 6;

// Vane slats
slat_count = 40;
slat_thick = 3.9;
slat_width = 50;
slat_height = 300;
slat_curve_r = 572.5;
slat_outer_r = 100;

// Layout positions (Y is vertical, top of disc at Y=0)
disc_y = -disc_thick / 2;
rod_y = -disc_thick - rod_len / 2;
hub_y = -disc_thick - rod_len; // -510
cage_top_y = hub_y;
cage_center_y = cage_top_y - slat_height / 2;
ring_y = cage_center_y;

// Helper to orient axisymmetric parts from local Z-up to global Y-up
module align_y() {
    rotate([-90, 0, 0]) children();
}

// Disc plate with central hole
module disc_plate() {
    difference() {
        cylinder(h=disc_thick, d=disc_dia, center=true);
        cylinder(h=disc_thick + 1, d=disc_hole_dia, center=true);
    }
}

// Solid cylinder rod
module rod() {
    cylinder(h=rod_len, d=rod_dia, center=true);
}

// Flanged bushing, local top at Z=0, extending downward
module flanged_bushing() {
    difference() {
        union() {
            // Boss
            translate([0, 0, -bushing_boss_height / 2])
                cylinder(h=bushing_boss_height, d=bushing_boss_od, center=true);
            // Flange at bottom
            translate([0, 0, -bushing_boss_height - bushing_flange_thick / 2])
                cylinder(h=bushing_flange_thick, d=bushing_od, center=true);
        }
        // Through bore
        cylinder(h=bushing_height + 1, d=bushing_bore, center=true);
    }
}

// Locating plug with rim, main body, taper and blind bore
module plug() {
    difference() {
        union() {
            // Rim
            translate([0, 0, -plug_rim_h / 2])
                cylinder(h=plug_rim_h, r=plug_rim_r, center=true);
            // Main cylindrical body
            translate([0, 0, -plug_rim_h - plug_main_h / 2])
                cylinder(h=plug_main_h, r=plug_main_r, center=true);
            // Conical taper
            translate([0, 0, -plug_rim_h - plug_main_h - plug_taper_h / 2])
                cylinder(h=plug_taper_h, r1=plug_main_r, r2=plug_taper_bottom_r, center=true);
        }
        // Blind bore from top
        translate([0, 0, -plug_bore_depth / 2])
            cylinder(h=plug_bore_depth + 0.1, d=plug_bore_dia, center=true);
    }
}

// Knob with spherical dome and conical stem, local base at Z=0
module knob() {
    union() {
        cylinder(h=knob_height - knob_sphere_r, d1=knob_base_dia, d2=knob_width, center=false);
        translate([0, 0, knob_height - knob_sphere_r])
            sphere(r=knob_sphere_r);
    }
}

// Splined ring with external teeth
module splined_ring() {
    difference() {
        union() {
            cylinder(h=ring_thick, d=ring_od, center=true);
            for (i = [0 : ring_teeth - 1])
                rotate([0, 0, i * 360 / ring_teeth])
                    translate([ring_od / 2, 0, 0])
                        cube([tooth_depth, tooth_width, ring_thick], center=true);
        }
        cylinder(h=ring_thick + 1, d=ring_id, center=true);
    }
}

// Single curved vane slat (barrel stave)
module vane_slat() {
    sagitta = slat_curve_r - sqrt(slat_curve_r * slat_curve_r - pow(slat_height / 2, 2));
    x_center = slat_outer_r - slat_curve_r;
    intersection() {
        difference() {
            translate([x_center, 0, 0])
                cylinder(h=slat_width + 2, r=slat_curve_r, center=true, $fn=200);
            translate([x_center, 0, 0])
                cylinder(h=slat_width + 2, r=slat_curve_r - slat_thick, center=true, $fn=200);
        }
        translate([slat_outer_r - sagitta / 2 - slat_thick / 2, 0, 0])
            cube([sagitta + slat_thick + 5, slat_height, slat_width], center=true);
    }
}

// Main assembly
union() {
    // Top disc plate
    translate([0, disc_y, 0])
        align_y() disc_plate();

    // Rod descending through disc
    translate([0, rod_y, 0])
        align_y() rod();

    // Hub group at lower end of rod
    // Plug top aligned with rod end
    translate([0, hub_y, 0])
        align_y() plug();

    // Flanged bushing sits around plug main body, just below rim
    translate([0, hub_y - plug_rim_h, 0])
        align_y() flanged_bushing();

    // Knob caps bottom of plug
    translate([0, hub_y - plug_total_h - knob_height, 0])
        align_y() knob();

    // Splined ring encircling slat zone
    translate([0, ring_y, 0])
        align_y() splined_ring();

    // 40 vane slats arranged radially about Y-axis
    for (i = [0 : slat_count - 1])
        rotate([0, i * 360 / slat_count, 0])
            translate([0, cage_center_y, 0])
                vane_slat();
}