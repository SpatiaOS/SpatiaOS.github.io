// Global Configuration
$fn = 100;
default_fillet = 1;

// Barrel Core Parameters
barrel_total_length = 260;
barrel_mid_radius = 188.5 / 2;
barrel_end_radius = 141.2 / 2;
num_staves = 18;
stave_thickness = 33;
stave_width = (2 * PI * barrel_mid_radius) / num_staves;

// Hoop Parameters
small_hoop_od = 163;
large_hoop_od = 188.5;
hoop_height = 21;
hoop_offsets = [-95, -35, 35, 95]; // Position along barrel axis
hoop_diameters = [large_hoop_od, small_hoop_od, small_hoop_od, large_hoop_od];

// End Cap Parameters
cap_diameter = 141.2;
cap_thickness = 12;
cap_locating_boss_r = 10;
cap_locating_boss_h = 3;

// Bung Assembly Parameters
collar_od = 40;
collar_height = 15;
collar_bore_d = 15;
collar_countersink_d = 23;
plug_diameter = 32.5;
plug_height = 14;

// Tap Assembly Parameters
tap_base_r = 10.6;
tap_sphere_r = 8;
tap_lever_d = 5;
tap_lever_length = 17.4;
knob_depth = 27.5;
knob_r = 4;
spacer_od = 8;
spacer_id = 6;
spacer_length = 40;

// Cradle Parameters
saddle_width = 45;
saddle_depth = 170;
saddle_height = 25;
saddle_channel_r = 12.5;
crossbar_dim = 25;
crossbar_length = 220;
keybar_length = 189;
keybar_side_angle = 22;


// Helper Module: Rounded Prism for edge fillets
module rounded_prism(w, d, h, r) {
    minkowski() {
        cube([w-2*r, d-2*r, h-2*r], center=true);
        sphere(r=r);
    }
}

// Barrel Stave Module
module barrel_stave() {
    angle_step = 360 / num_staves;
    // Generate curved stave profile matching barrel bulge
    hull() {
        // Mid section (widest point)
        rotate([0, 0, -angle_step/2])
        translate([barrel_mid_radius - stave_thickness/2, 0, 0])
        cube([stave_thickness, stave_width, 1], center=true);
        // Left end
        rotate([0, 0, -angle_step/2])
        translate([barrel_end_radius - stave_thickness/2, 0, -barrel_total_length/2 + cap_thickness])
        cube([stave_thickness, stave_width, 1], center=true);
        // Right end
        rotate([0, 0, -angle_step/2])
        translate([barrel_end_radius - stave_thickness/2, 0, barrel_total_length/2 - cap_thickness])
        cube([stave_thickness, stave_width, 1], center=true);
    }
}

// Hoop Ring Module
module hoop(outer_d, height) {
    rotate_extrude()
    translate([outer_d/2 - height/2, 0, 0])
    offset(r=height/6)
    square([height/2, height], center=true);
}

// End Cap Module
module end_cap(decorative = false) {
    difference() {
        union() {
            cylinder(d=cap_diameter, h=cap_thickness, center=true);
            // Locating boss on back of decorative cap
            if (decorative) {
                translate([0, 0, -cap_thickness/2 - cap_locating_boss_h/2])
                cylinder(r=cap_locating_boss_r, h=cap_locating_boss_h, center=true);
            }
            // Chamfered rim
            translate([0, 0, cap_thickness/2])
            cylinder(h=2, r1=cap_diameter/2, r2=cap_diameter/2 - 3, center=true);
        }
        // Embossed text on decorative cap
        if (decorative) {
            translate([-20, -20, cap_thickness/2 - 0.5])
            linear_extrude(height=1)
            text("Dębowa", size=14, font="Script MT Bold:style=Bold");
        }
    }
}

// Bung Assembly Module
module bung_assembly() {
    union() {
        // Flanged collar
        difference() {
            union() {
                cylinder(d=collar_od, h=collar_height*0.6, center=true);
                translate([0, 0, collar_height*0.2])
                cylinder(d=collar_od * 0.7, h=collar_height*0.6, center=true);
            }
            // Countersunk bore
            translate([0, 0, collar_height*0.3])
            cylinder(d=collar_countersink_d, h=collar_height*0.4, center=true);
            cylinder(d=collar_bore_d, h=collar_height + 1, center=true);
        }
        // Plug cap
        translate([0, 0, collar_height*0.8 + plug_height/2])
        cylinder(d=plug_diameter, h=plug_height, center=true, $fn=64);
    }
}

// Tap Assembly Module
module tap_assembly() {
    union() {
        // Spacer sleeve
        cylinder(d=spacer_od, h=spacer_length, center=true);
        // Ball lever handle
        translate([0, 0, spacer_length/2 + tap_base_r]) {
            cylinder(r=tap_base_r, h=2, center=true);
            translate([0, 0, tap_base_r + tap_sphere_r])
            sphere(r=tap_sphere_r);
            translate([0, 0, tap_base_r + tap_sphere_r * 2])
            cylinder(d=tap_lever_d, h=tap_lever_length, center=true);
        }
        // Knob
        translate([0, 0, spacer_length/2 + tap_base_r*2 + tap_sphere_r*2 + tap_lever_length])
        rotate([90, 0, 0]) {
            union() {
                sphere(r=15);
                translate([0, 0, -20])
                cylinder(r=12, h=15, center=true);
            }
        }
    }
}

// Saddle Support Module
module saddle_support() {
    difference() {
        rounded_prism(saddle_depth, saddle_width, saddle_height, default_fillet);
        // Concave saddle channel
        translate([0, 0, saddle_height/2])
        rotate([90, 0, 0])
        cylinder(r=saddle_channel_r, h=saddle_width + 2, center=true);
    }
}

// Cradle Foot Module (trapezoidal cross section)
module cradle_foot() {
    linear_extrude(height=crossbar_dim, center=true)
    polygon(points=[
        [-15, -20],
        [15, -20],
        [10, 0],
        [-10, 0]
    ]);
}


// --------------------------
// Main Assembly
// --------------------------
union() {
    // Barrel Stave Assembly
    for (s = [0:num_staves-1]) {
        rotate([0, 0, s * 360/num_staves])
        barrel_stave();
    }

    // Hoop Assembly
    for (h = [0:len(hoop_offsets)-1]) {
        translate([0, 0, hoop_offsets[h]])
        hoop(hoop_diameters[h], hoop_height);
    }

    // End Caps
    translate([0, 0, -barrel_total_length/2 + cap_thickness/2])
    end_cap(decorative=true);
    translate([0, 0, barrel_total_length/2 - cap_thickness/2])
    end_cap(decorative=false);

    // Bung Assembly (top of barrel)
    translate([0, barrel_mid_radius + collar_height/2 - 5, 0])
    rotate([-90, 0, 0])
    bung_assembly();

    // Tap Assembly (front of decorative cap)
    translate([0, 0, -barrel_total_length/2 - 5])
    rotate([0, 0, 0])
    tap_assembly();

    // Cradle Assembly
    translate([0, -barrel_mid_radius - saddle_height/2, 0]) {
        // Left saddle
        translate([0, 0, -crossbar_length/2 + saddle_width/2])
        saddle_support();
        // Right saddle
        translate([0, 0, crossbar_length/2 - saddle_width/2])
        saddle_support();

        // Crossbars
        translate([-saddle_depth/2 + crossbar_dim/2, -saddle_height/2 - crossbar_dim/2, 0])
        rounded_prism(crossbar_dim, crossbar_length, crossbar_dim, default_fillet);
        translate([saddle_depth/2 - crossbar_dim/2, -saddle_height/2 - crossbar_dim/2, 0])
        rounded_prism(crossbar_dim, crossbar_length, crossbar_dim, default_fillet);

        // Base slat
        translate([0, -saddle_height/2 - crossbar_dim - crossbar_dim/2, 0])
        rounded_prism(saddle_depth, crossbar_length, crossbar_dim, default_fillet);

        // Cradle feet
        for (x = [-saddle_depth/2 + 20, saddle_depth/2 -20]) {
            for (z = [-crossbar_length/2 + 20, crossbar_length/2 -20]) {
                translate([x, -saddle_height/2 - crossbar_dim*2 - 10, z])
                rotate([0, 0, 90])
                cradle_foot();
            }
        }
    }
}