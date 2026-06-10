// Global resolution setting
$fn = 100;

// --------------------------
// Parameter Definitions
// --------------------------
// Pin dimensions (from description)
small_pin_r = 14.4;            // 28.8mm diameter
small_pin_length = 120;
small_pin_overlap = 30.6;      // Insert depth into small gear bore

large_pin_r = 33.87;           // 67.74mm diameter
large_pin_long_length = 175;
large_pin_short_length = 100;
large_pin_overlap = 10.6;      // Insert depth into large gear bores

// Bevel Gear Parameters
// Small gear specs
small_gear_pitch_dia = 150;
small_gear_cone_angle = 30;    // Sum with large gear cone angle = 90deg for right angle mesh
small_gear_face_width = 25;
small_gear_num_teeth = 32;
small_gear_bore_dia = 2 * small_pin_r;
small_gear_hub_length = 30;

// Large gear specs (2 identical units)
large_gear_pitch_dia = 300;
large_gear_cone_angle = 60;
large_gear_face_width = 35;
large_gear_num_teeth = 64;
large_gear_bore_dia = 2 * large_pin_r;
large_gear_hub_length = 10;

tooth_profile_height = 5;      // Standard tooth depth for visualization

// Calculated assembly positions
large_apex_dist = (large_gear_pitch_dia / 2) / tan(radians(large_gear_cone_angle));
small_apex_dist = (small_gear_pitch_dia / 2) / tan(radians(small_gear_cone_angle));

// --------------------------
// Helper Module: Bevel Gear
// --------------------------
module bevel_gear(pitch_dia, cone_angle, face_width, num_teeth, bore_dia, hub_length) {
    pitch_r = pitch_dia / 2;
    apex_dist = pitch_r / tan(radians(cone_angle));
    addendum = tooth_profile_height * 0.4;
    dedendum = tooth_profile_height * 0.6;
    tooth_gap_angle = 360 / num_teeth;

    union() {
        // Hub body
        translate([0, 0, -hub_length])
        cylinder(h=hub_length + face_width, d=bore_dia + 16, center=false);

        // Cone gear body
        difference() {
            // Outer cone (addendum side)
            translate([0, 0, apex_dist])
            rotate([180, 0, 0])
            cylinder(h=apex_dist, r1=0, r2=pitch_r + addendum, center=false);
            
            // Inner cone (dedendum side, removes internal volume)
            translate([0, 0, apex_dist - face_width])
            rotate([180, 0, 0])
            cylinder(h=apex_dist, r1=0, r2=(pitch_r - dedendum) * (apex_dist - face_width)/apex_dist, center=false);
            
            // Center bore hole
            cylinder(h=hub_length + face_width + 2, d=bore_dia, center=false);
        }

        // Gear teeth array
        for (i = [0:num_teeth-1]) {
            rotate([0, 0, i * tooth_gap_angle])
            linear_extrude(length=face_width, center=false)
            polygon(points=[
                [pitch_r - dedendum, -tooth_profile_height/3],
                [pitch_r + addendum, -tooth_profile_height/4],
                [pitch_r + addendum, tooth_profile_height/4],
                [pitch_r - dedendum, tooth_profile_height/3]
            ]);
        }
    }
}

// --------------------------
// Main Assembly
// All gears mesh at common apex at (0,0,0)
// --------------------------
union() {
    // 1. Center Large Bevel Gear (axis aligned along +Z)
    translate([0, 0, large_apex_dist])
    bevel_gear(
        large_gear_pitch_dia,
        large_gear_cone_angle,
        large_gear_face_width,
        large_gear_num_teeth,
        large_gear_bore_dia,
        large_gear_hub_length
    );

    // 2. Right Large Bevel Gear (axis aligned along +X)
    rotate([0, 90, 0])
    translate([0, 0, large_apex_dist])
    bevel_gear(
        large_gear_pitch_dia,
        large_gear_cone_angle,
        large_gear_face_width,
        large_gear_num_teeth,
        large_gear_bore_dia,
        large_gear_hub_length
    );

    // 3. Upper Left Small Bevel Gear (axis aligned along -Y)
    rotate([90, 0, 0])
    translate([0, 0, -small_apex_dist])
    bevel_gear(
        small_gear_pitch_dia,
        small_gear_cone_angle,
        small_gear_face_width,
        small_gear_num_teeth,
        small_gear_bore_dia,
        small_gear_hub_length
    );

    // Pins / Shafts
    // Long pin for center large gear (along Z axis)
    translate([0, 0, large_apex_dist + large_pin_overlap - large_pin_long_length])
    cylinder(h=large_pin_long_length, r=large_pin_r, center=false);

    // Short pin for right large gear (along X axis)
    translate([large_apex_dist - large_pin_overlap, 0, 0])
    rotate([0, 90, 0])
    cylinder(h=large_pin_short_length, r=large_pin_r, center=false);

    // Small pin for upper left small gear (along -Y axis)
    translate([0, -small_apex_dist - (small_pin_length - small_pin_overlap), 0])
    rotate([90, 0, 0])
    cylinder(h=small_pin_length, r=small_pin_r, center=false);
}