// Coilover Shock Absorber / Suspension Spring Assembly
// All dimensions in millimeters

$fn = 80;

// ==================== Parameters ====================

// Central shaft/rod
rod_d = 10;
inner_bore = rod_d + 1;    // bore for sliding components

// Coil spring
spring_mean_r = 18;         // mean coil radius
spring_wire_d = 5;          // wire diameter
spring_coils = 6.5;         // number of coils
spring_pitch = 11;          // vertical pitch per coil
spring_length = spring_coils * spring_pitch;

// Eye mount (clevis) - top and bottom
eye_od = 20;                // eye outer diameter
eye_bore = 9;               // bore for pin
eye_width = 16;             // total width across ears
eye_gap = 6;                // gap between ears

// Castellated adjustment nut
castle_base_d = 26;
castle_n_teeth = 10;
castle_tooth_len = 8;       // radial tooth length
castle_tooth_w = 5;         // circumferential tooth width
castle_h = 12;

// Spring perches (seats)
lower_perch_d = 44;
upper_perch_d = 38;
perch_h = 3.5;
perch_lip_d = 30;           // centering lip diameter
perch_lip_h = 2.5;

// Collar dimensions
collar_d = 22;
notch_collar_d = 28;
notch_collar_h = 7;

// ==================== Z-axis Layout ====================
// Stacked from bottom to top

z_bot_eye       = 0;
z_bot_stem      = eye_od/2 + 3;
z_bot_collar    = z_bot_stem + 7;
z_lower_perch   = z_bot_collar + 5;
z_spring_start  = z_lower_perch + perch_h + perch_lip_h;
z_spring_end    = z_spring_start + spring_length;
z_upper_perch   = z_spring_end - perch_lip_h;
z_notch_collar  = z_upper_perch + perch_h;
z_castle_nut    = z_notch_collar + notch_collar_h;
z_top_flange    = z_castle_nut + castle_h;
z_top_neck      = z_top_flange + 3;
z_top_eye       = z_top_neck + 10;
total_height    = z_top_eye + 12;

// ==================== Modules ====================

// Helical coil spring using hull'd spheres along helix path
module coil_spring(mean_r, wd, coils, pitch) {
    segments_per_coil = 36;
    total_segments = floor(coils * segments_per_coil);
    
    for (i = [0 : total_segments - 1]) {
        hull() {
            for (j = [0, 1]) {
                angle = (i + j) * 360 / segments_per_coil;
                z = (i + j) * pitch / segments_per_coil;
                translate([mean_r * cos(angle), mean_r * sin(angle), z])
                    sphere(d = wd, $fn = 14);
            }
        }
    }
}

// Clevis / yoke eye mount - centered at origin, bore along Y axis
module eye_mount(od, bore_d, w, gap) {
    ear_t = (w - gap) / 2;
    
    difference() {
        union() {
            // Two parallel ears
            for (s = [-1, 1])
                translate([0, s * (gap/2 + ear_t/2), 0])
                    rotate([90, 0, 0])
                        cylinder(d = od, h = ear_t, center = true);
            // Top bridge connecting ears
            translate([0, 0, od * 0.12])
                rotate([90, 0, 0])
                    scale([1, 1, 1])
                        cylinder(d = od * 0.55, h = w, center = true, $fn = 40);
        }
        // Through bore for pin
        rotate([90, 0, 0])
            cylinder(d = bore_d, h = w + 4, center = true);
        // Cut away lower half to create clevis gap
        translate([-(od + 4)/2, -gap/2, -(od/2 + 1)])
            cube([od + 4, gap, od/2 + 1]);
    }
}

// Simple annular ring
module ring(od, h, id = 0) {
    bore = id > 0 ? id : inner_bore;
    difference() {
        cylinder(d = od, h = h);
        translate([0, 0, -0.5])
            cylinder(d = bore, h = h + 1);
    }
}

// Castellated / gear-tooth adjustment ring
module castellated_nut() {
    difference() {
        union() {
            // Central body
            cylinder(d = castle_base_d, h = castle_h);
            // Gear teeth
            for (i = [0 : castle_n_teeth - 1]) {
                angle = i * 360 / castle_n_teeth;
                rotate([0, 0, angle])
                    translate([castle_base_d/2 - 2, -castle_tooth_w/2, 0])
                        cube([castle_tooth_len + 2, castle_tooth_w, castle_h]);
            }
        }
        // Center bore
        translate([0, 0, -1])
            cylinder(d = inner_bore, h = castle_h + 2);
    }
}

// Notched locking collar
module notched_collar(od, h, n_notches = 8) {
    notch_w = 3;
    notch_depth = 4;
    
    difference() {
        ring(od, h);
        // Rectangular notches around circumference
        for (i = [0 : n_notches - 1])
            rotate([0, 0, i * 360 / n_notches])
                translate([od/2 - notch_depth + 1, -notch_w/2, h * 0.2])
                    cube([notch_depth + 1, notch_w, h * 0.85]);
    }
}

// Stem/neck with optional taper
module stem(d_top, d_bot, h) {
    cylinder(d1 = d_bot, d2 = d_top, h = h);
}

// ==================== Main Assembly ====================

color("LightSteelBlue") {

    // --- Central shaft running full length ---
    translate([0, 0, -3])
        cylinder(d = rod_d, h = total_height + 3);
    
    // === Bottom Section ===
    
    // Bottom eye mount
    translate([0, 0, eye_od/2 + 2])
        rotate([0, 0, 90])
            eye_mount(eye_od, eye_bore, eye_width, eye_gap);
    
    // Bottom eye to stem transition (rounded)
    translate([0, 0, eye_od/2 + 2])
        cylinder(d1 = eye_od * 0.7, d2 = rod_d + 6, h = 5);
    
    // Bottom stem
    translate([0, 0, z_bot_stem])
        ring(rod_d + 6, z_bot_collar - z_bot_stem);
    
    // Bottom collar (wider)
    translate([0, 0, z_bot_collar])
        ring(collar_d, z_lower_perch - z_bot_collar);
    
    // === Lower Spring Perch ===
    translate([0, 0, z_lower_perch]) {
        // Main disc
        ring(lower_perch_d, perch_h);
        // Centering lip on top
        translate([0, 0, perch_h])
            ring(perch_lip_d, perch_lip_h);
    }
    
    // === Coil Spring ===
    translate([0, 0, z_spring_start])
        coil_spring(spring_mean_r, spring_wire_d, spring_coils, spring_pitch);
    
    // === Upper Spring Perch ===
    translate([0, 0, z_upper_perch]) {
        // Centering lip on bottom
        translate([0, 0, -perch_lip_h])
            ring(perch_lip_d, perch_lip_h);
        // Main disc
        ring(upper_perch_d, perch_h);
    }
    
    // === Notched Locking Collar ===
    translate([0, 0, z_notch_collar])
        notched_collar(notch_collar_d, notch_collar_h, 8);
    
    // === Castellated Adjustment Nut ===
    translate([0, 0, z_castle_nut])
        castellated_nut();
    
    // === Top Flange (washer above castle nut) ===
    translate([0, 0, z_top_flange])
        ring(castle_base_d + 8, 3);
    
    // === Top Neck ===
    translate([0, 0, z_top_neck]) {
        // Lower wider portion
        ring(20, 3);
        // Narrower neck
        translate([0, 0, 3])
            ring(16, z_top_eye - z_top_neck - 3);
    }
    
    // === Top Eye Mount ===
    translate([0, 0, z_top_eye]) {
        // Transition from neck to eye
        translate([0, 0, -2])
            cylinder(d1 = 16, d2 = eye_od * 0.7, h = 4);
        // Eye mount (rotated 45° from bottom for visual variety)
        translate([0, 0, 2])
            rotate([0, 0, 45])
                eye_mount(eye_od * 1.1, eye_bore, eye_width, eye_gap);
    }
}