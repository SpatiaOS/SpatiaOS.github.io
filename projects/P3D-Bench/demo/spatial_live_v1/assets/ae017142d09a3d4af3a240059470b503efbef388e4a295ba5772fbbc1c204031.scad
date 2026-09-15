// Hand-Cranked Epicyclic (Planetary) Gear Demonstrator
// Parametric OpenSCAD Model

/* [Global Settings] */
$fn = 50;

/* [Stand Parameters] */
stand_height       = 105;   // Height from ground to shaft center
stand_base_w       = 130;   // Stand base width
stand_base_d       = 65;    // Stand depth (front to back)
plate_th           = 4.5;   // Upright plate thickness
front_plate_y      = -18;   // Front triangular plate Y position
rear_plate_y       = 32;    // Rear triangular plate Y position
bearing_boss_od    = 24;    // Front bearing housing outer diameter
bearing_boss_len   = 24;    // Front bearing housing length

/* [Gear System Parameters] */
gear_y             = 7;     // Y center of the planetary gear assembly
face_w             = 15;    // Gear face width
mod_val            = 2.5;   // Gear module (pitch diameter / num_teeth)
teeth_sun          = 16;    // Sun gear tooth count
teeth_planet       = 16;    // Planet gear tooth count
teeth_ring         = 48;    // Internal ring gear tooth count (16 + 2*16 = 48)
r_sun              = teeth_sun * mod_val / 2;       // 20 mm
r_planet           = teeth_planet * mod_val / 2;    // 20 mm
r_carrier          = r_sun + r_planet;              // 40 mm
r_ring             = teeth_ring * mod_val / 2;      // 60 mm
ring_od            = 156;   // Outer diameter of the ring gear rim
ring_w             = 18;    // Width of the ring gear rim
planet_angles      = [60, 180, 300]; // 120-degree planet spacing

/* [Crank & Handle Parameters] */
// Crank 1 (Vertical / Inner)
crank1_len         = 80;
crank1_angle       = 86;
crank1_y           = -30;
// Crank 2 (Long / Middle, tilted up-left)
crank2_len         = 130;
crank2_angle       = 138;
crank2_y           = -40;
// Crank 3 (Short / Outer, tilted down-left)
crank3_len         = 50;
crank3_angle       = 202;
crank3_y           = -50;
handle_len         = 24;
handle_d           = 9;

// --- Colors ---
c_stand  = [0.68, 0.70, 0.73];
c_gear   = [0.78, 0.80, 0.83];
c_ring   = [0.60, 0.62, 0.65];
c_crank  = [0.74, 0.76, 0.79];
c_shaft  = [0.55, 0.57, 0.60];

// ==========================================
// Reusable Modules
// ==========================================

// Spur Gear with trapezoidal teeth
module spur_gear(r_pitch, num_teeth, tooth_h, width, bore_d=6, num_holes=4) {
    r_root = r_pitch - tooth_h * 0.55;
    r_tip  = r_pitch + tooth_h * 0.45;
    step_a = 360 / num_teeth;
    w_root = (PI * r_pitch / num_teeth) * 0.55;
    w_tip  = (PI * r_pitch / num_teeth) * 0.28;

    difference() {
        union() {
            cylinder(r=r_root, h=width, center=true);
            for (i = [0 : num_teeth - 1]) {
                rotate([0, 0, i * step_a])
                linear_extrude(height=width, center=true)
                polygon([
                    [r_root - 0.1, -w_root / 2],
                    [r_tip,        -w_tip / 2],
                    [r_tip,         w_tip / 2],
                    [r_root - 0.1,  w_root / 2]
                ]);
            }
        }
        // Center bore
        if (bore_d > 0) cylinder(d=bore_d, h=width + 2, center=true);
        // Lightening holes
        if (num_holes > 0) {
            for (h = [0 : num_holes - 1]) {
                rotate([0, 0, h * (360 / num_holes) + step_a / 2])
                translate([r_pitch * 0.55, 0, 0])
                cylinder(r=r_pitch * 0.22, h=width + 2, center=true);
            }
        }
    }
}

// Internal Ring Gear
module internal_ring_gear(r_pitch, r_out, num_teeth, tooth_h, width) {
    r_inner_rim = r_pitch + tooth_h * 0.55;
    r_tip       = r_pitch - tooth_h * 0.45;
    step_a      = 360 / num_teeth;
    w_root      = (PI * r_pitch / num_teeth) * 0.55;
    w_tip       = (PI * r_pitch / num_teeth) * 0.28;

    union() {
        // Outer cylindrical rim
        difference() {
            cylinder(r=r_out, h=width, center=true);
            cylinder(r=r_inner_rim, h=width + 2, center=true);
        }
        // Inward pointing teeth
        for (i = [0 : num_teeth - 1]) {
            rotate([0, 0, i * step_a])
            linear_extrude(height=width, center=true)
            polygon([
                [r_inner_rim + 0.1, -w_root / 2],
                [r_tip,             -w_tip / 2],
                [r_tip,              w_tip / 2],
                [r_inner_rim + 0.1,  w_root / 2]
            ]);
        }
    }
}

// Crank Arm with Hub and Revolving Handle
module crank_assembly(arm_len, collar_od, collar_len, arm_w=9, arm_th=6, handle_diam=9, handle_l=24) {
    // Mounting collar
    difference() {
        cylinder(d=collar_od, h=collar_len, center=true);
        cylinder(d=collar_od - 5, h=collar_len + 2, center=true);
    }
    // Arm
    translate([0, 0, -arm_th / 2])
    linear_extrude(height=arm_th)
    hull() {
        circle(d=collar_od * 0.85);
        translate([arm_len, 0, 0]) circle(d=arm_w);
    }
    // Handle boss and grip
    translate([arm_len, 0, 0]) {
        // Square transition block
        translate([0, 0, -arm_th / 2])
        cube([arm_w, arm_w, arm_th], center=true);
        // Cylindrical grip extending forward (-Z in local coords)
        translate([0, 0, -handle_l / 2 - arm_th / 2]) {
            cylinder(d=handle_diam, h=handle_l, center=true);
            // Rounded handle end
            translate([0, 0, -handle_l / 2])
            sphere(d=handle_diam);
        }
    }
}

// Triangular Stand Plate
module stand_upright(h, base_w, top_w, th) {
    linear_extrude(height=th, center=true)
    difference() {
        polygon([
            [-base_w / 2,         0],
            [-base_w / 2,        10],
            [-base_w / 2 + 12,   10],
            [-top_w / 2,          h],
            [ top_w / 2,          h],
            [ base_w / 2 - 12,   10],
            [ base_w / 2,        10],
            [ base_w / 2,         0],
            [ base_w / 2 - 18,    0],
            [ base_w / 2 - 24,    6],
            [-base_w / 2 + 24,    6],
            [-base_w / 2 + 18,    0]
        ]);
        // Bottom tie-bar cutouts
        translate([-base_w / 2 + 18, 10]) square([8, 12], center=true);
        translate([ base_w / 2 - 18, 10]) square([8, 12], center=true);
    }
}

// ==========================================
// Assembly
// ==========================================

// --- Stand & Base Frame ---
color(c_stand) {
    // Front triangular upright
    translate([0, front_plate_y, 0])
    stand_upright(stand_height, stand_base_w, bearing_boss_od + 4, plate_th);

    // Rear triangular upright
    translate([0, rear_plate_y, 0])
    difference() {
        stand_upright(stand_height, stand_base_w, bearing_boss_od + 4, plate_th);
        // Rear shaft pass-through hole
        translate([0, stand_height, 0])
        circle(d=16);
    }

    // Front bearing housing
    translate([0, front_plate_y - bearing_boss_len / 2 + plate_th / 2, stand_height])
    rotate([90, 0, 0])
    difference() {
        cylinder(d=bearing_boss_od, h=bearing_boss_len, center=true);
        cylinder(d=14, h=bearing_boss_len + 2, center=true);
    }

    // Lubricator cup on front bearing
    translate([0, front_plate_y - bearing_boss_len / 2, stand_height + bearing_boss_od / 2 + 4])
    cylinder(d1=5, d2=7, h=8, center=true);

    // Rear bearing boss
    translate([0, rear_plate_y + 4, stand_height])
    rotate([90, 0, 0])
    difference() {
        cylinder(d=22, h=8, center=true);
        cylinder(d=12, h=10, center=true);
    }

    // Bottom tie-bars (structural stretchers)
    for (sx = [-1, 1]) {
        translate([sx * (stand_base_w / 2 - 18), (front_plate_y + rear_plate_y) / 2, 10]) {
            cube([7.5, stand_base_d + 16, 11], center=true);
            // End lock tabs
            translate([0, -(stand_base_d + 16) / 2, 0]) cube([10, 4, 14], center=true);
            translate([0,  (stand_base_d + 16) / 2, 0]) cube([10, 4, 14], center=true);
        }
    }
}

// --- Planetary Gear System ---
translate([0, gear_y, stand_height])
rotate([90, 0, 0]) {

    // 1. Internal Ring Gear
    color(c_ring)
    internal_ring_gear(r_ring, ring_od / 2, teeth_ring, 4.5, ring_w);

    // 2. Central Sun Gear
    color(c_gear)
    spur_gear(r_sun, teeth_sun, 4.5, face_w, bore_d=8, num_holes=0);

    // 3. Planet Gears
    for (a = planet_angles) {
        rotate([0, 0, a])
        translate([r_carrier, 0, 0])
        rotate([0, 0, -a * (teeth_ring / teeth_planet)]) // Meshing rotation
        color(c_gear)
        spur_gear(r_planet, teeth_planet, 4.5, face_w, bore_d=7, num_holes=4);
    }

    // 4. Planet Carrier Cage
    color(c_shaft) {
        // Front & Rear Spider Plates
        for (side_z = [-face_w / 2 - 2, face_w / 2 + 2]) {
            translate([0, 0, side_z]) {
                difference() {
                    union() {
                        cylinder(r=15, h=2.5, center=true);
                        for (a = planet_angles) {
                            rotate([0, 0, a])
                            hull() {
                                cylinder(r=12, h=2.5, center=true);
                                translate([r_carrier, 0, 0])
                                cylinder(r=7.5, h=2.5, center=true);
                            }
                        }
                    }
                    cylinder(d=9, h=4, center=true);
                }
            }
        }

        // Planet Gear Pivot Pins & Spacers
        for (a = planet_angles) {
            rotate([0, 0, a]) {
                translate([r_carrier, 0, 0]) {
                    // Central pin through each planet
                    cylinder(d=6.5, h=face_w + 10, center=true);
                    // Retaining caps
                    translate([0, 0, -(face_w + 10) / 2]) cylinder(d=9, h=1.5, center=true);
                    translate([0, 0,  (face_w + 10) / 2]) cylinder(d=9, h=1.5, center=true);
                }
                // Carrier cage perimeter bridge pillars
                rotate([0, 0, 60])
                translate([r_carrier * 0.95, 0, 0])
                cube([5, 8, face_w + 4], center=true);
            }
        }
    }
}

// --- Concentric Drive Shafts & Cranks ---
color(c_shaft) {
    // Main center shaft extending through the front
    translate([0, (crank3_y - 8 + rear_plate_y + 12) / 2, stand_height])
    rotate([90, 0, 0])
    difference() {
        cylinder(d=10, h=(rear_plate_y + 12) - (crank3_y - 8), center=true);
        // Hollow bore visible at front tip
        cylinder(d=5.5, h=(rear_plate_y + 12) - (crank3_y - 8) + 2, center=true);
    }
    // Intermediate sleeves
    translate([0, (crank1_y + front_plate_y) / 2, stand_height])
    rotate([90, 0, 0])
    cylinder(d=13.5, h=abs(crank1_y - front_plate_y), center=true);
}

// --- Cranks Assembly ---
color(c_crank) {
    // Crank 1 (Inner, Vertical)
    translate([0, crank1_y, stand_height])
    rotate([0, -crank1_angle, 0])
    rotate([90, 0, 0])
    crank_assembly(crank1_len, 20, 7.5, arm_w=9, arm_th=5.5, handle_diam=handle_d, handle_l=handle_len);

    // Crank 2 (Middle, Long - tilted up-left)
    translate([0, crank2_y, stand_height])
    rotate([0, -crank2_angle, 0])
    rotate([90, 0, 0])
    crank_assembly(crank2_len, 17, 7.5, arm_w=9.5, arm_th=5.5, handle_diam=handle_d, handle_l=handle_len);

    // Crank 3 (Outer, Short - tilted down-left)
    translate([0, crank3_y, stand_height])
    rotate([0, -crank3_angle, 0])
    rotate([90, 0, 0])
    crank_assembly(crank3_len, 14, 7.5, arm_w=8.5, arm_th=5, handle_diam=handle_d * 0.9, handle_l=handle_len * 0.85);
}