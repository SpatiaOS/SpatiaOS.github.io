// Industrial 6-Axis Robot Arm (static stylized model)
// All dimensions in mm, proportional to reference image
$fn = 60; // Resolution for curved surfaces

// ----------------------
// Parameters
// ----------------------
// Base
base_l = 120;      base_w = 100;     base_h = 14;
base_ox = -20;    base_oy = -50;
tab_h = 8;        mhole_d = 4.5;

// Waist joint
waist_cx = 50;    waist_cy = 0;
waist_d = 68;     waist_h = 22;
waist_flange_d = 78;  waist_flange_h = 5;

// Lower shoulder housing
lshoulder_w = 50; lshoulder_h = 40;

// Shoulder pivot
shoulder_cx = 42; shoulder_cz = 41 + lshoulder_h;
shoulder_joint_d = 58; shoulder_joint_t = 28;
shoulder_axle_d = 22; shoulder_axle_l = 22;
hex_size = 10;    hex_t = 6;

// Upper shoulder bracket
ushoulder_w = 32;

// Diagonal side brace
brace_t = 10;     brace_w = 9;

// Rear arm pivot
rearpivot_cx = 25; rearpivot_cz = 122;
rearpivot_d = 42;  rearpivot_t = 12;
rear_post_d = 10;  rear_post_h = 18;

// Upper arm
uarm_len = 122;
uarm_d = 28;
uarm_flange_d = 44;
uarm_ring_d = 34;
uarm_angle = 253.6; // Angle around Y axis to point arm down-left

// Wrist & spindle
wrist_len = 47;
spindle_d = 16;
tip_nut_d = 12;
tip_d = 8;

// ----------------------
// Helper Functions
// ----------------------
// Calculate starting Z position for segment i in a stepped cylinder list
function seg_z_start(segments, i) =
    i == 0 ? 0 :
    segments[i-1][1] + seg_z_start(segments, i-1);

// ----------------------
// Helper Modules
// ----------------------
module hex_nut(across_flats, thickness) {
    // Hexagonal nut aligned to local Z axis
    cylinder(d=across_flats * 1.1547, h=thickness, $fn=6);
}

module stepped_cylinder(segments) {
    // Build a multi-diameter shaft along +Z from Z=0
    union() {
        for (i = [0 : len(segments) - 1]) {
            d = segments[i][0];
            l = segments[i][1];
            z_start = seg_z_start(segments, i);
            translate([0, 0, z_start + l/2])
                cylinder(d=d, h=l);
        }
    }
}

// ----------------------
// Main Model
// ----------------------
union() {
    // Base assembly with holes/notches
    difference() {
        union() {
            // Main base plate
            translate([base_ox, base_oy, 0])
                cube([base_l, base_w, base_h]);
            
            // Mounting features
            translate([base_ox, base_oy, 0])       // Left locator tab
                cube([20, 18, tab_h]);
            translate([35, base_oy, 0])            // Front mounting tab
                cube([25, 15, 10]);
            translate([85, -20, 0])                // Right front mounting tab
                cube([20, 20, 10]);
            translate([75, 25, 0])                 // Right back tab
                cube([20, 20, 10]);
            
            // Raised features on base
            translate([0, -48, base_h])            // Front label pad
                cube([20, 18, 3]);
            translate([40, -48, base_h])           // Small front boss 1
                cylinder(d=4, h=3);
            translate([48, -48, base_h])           // Small front boss 2
                cylinder(d=4, h=3);
        }
        // Subtract cutouts and mounting holes
        translate([base_ox-1, base_oy-1, tab_h])   // Left tab notch
            cube([22, 20, base_h - tab_h + 2]);
        translate([42, -42, -1])                   // Front tab mounting holes
            cylinder(d=mhole_d, h=12);
        translate([54, -42, -1])
            cylinder(d=mhole_d, h=12);
        translate([92, -10, -1])                   // Right tab mounting holes
            cylinder(d=mhole_d, h=12);
        translate([92, -4, -1])
            cylinder(d=mhole_d, h=12);
    }

    // Waist rotation joint
    translate([waist_cx, waist_cy, base_h])
        cylinder(d=waist_flange_d, h=waist_flange_h);
    translate([waist_cx, waist_cy, base_h + waist_flange_h])
        cylinder(d=waist_d, h=waist_h);

    // Lower tapered shoulder housing
    rotate([-90, 0, 0])
    linear_extrude(height=lshoulder_w, center=true)
    polygon(points=[
        [21, -41], [79, -41],  // Bottom edge (top of waist)
        [62, -81], [22, -81]   // Top edge (shoulder joint height)
    ]);

    // Shoulder pivot joint (axle along +Y axis)
    translate([shoulder_cx, -24, shoulder_cz])
    rotate([-90, 0, 0])
    stepped_cylinder([
        [40, 10],
        [shoulder_joint_d, shoulder_joint_t],
        [50, 8],
        [shoulder_axle_d, shoulder_axle_l]
    ]);
    // Shoulder axle hex nut
    translate([shoulder_cx, 44, shoulder_cz])
    rotate([-90, 0, 0])
        hex_nut(hex_size, hex_t);
    // Rear stub axle
    translate([shoulder_cx - 12, -24, shoulder_cz -5])
    rotate([90, 0, 0])
        cylinder(d=20, h=15);

    // Upper angled shoulder bracket
    rotate([-90, 0, 0])
    linear_extrude(height=ushoulder_w, center=true)
    polygon(points=[
        [38, -78], [26, -84],
        [22, -125], [36, -118]
    ]);

    // Diagonal side brace (offset to +Y side)
    translate([0, 14, 0])
    rotate([-90, 0, 0])
    linear_extrude(height=brace_t, center=false)
    polygon(points=[
        [50, -90], [54, -86],
        [30, -116], [26, -120]
    ]);

    // Rear arm pivot joint
    translate([rearpivot_cx, -14, rearpivot_cz])
    rotate([-90, 0, 0])
    stepped_cylinder([
        [30, 8],
        [rearpivot_d, rearpivot_t],
        [36, 10]
    ]);
    // Small control lever on rear pivot
    translate([rearpivot_cx + 10, 0, rearpivot_cz -10])
    rotate([0,0,30])
        cube([10,7,12], center=true);
    // Rear stop posts
    translate([rearpivot_cx+5, -7, rearpivot_cz+6])
    rotate([30,-15,0])
        cylinder(d=rear_post_d, h=rear_post_h);
    translate([rearpivot_cx+9, 5, rearpivot_cz-2])
    rotate([35,-10,0])
        cylinder(d=rear_post_d, h=rear_post_h-2);

    // Upper arm tube
    translate([rearpivot_cx, 0, rearpivot_cz])
    rotate([0, uarm_angle, 0])
    stepped_cylinder([
        [rearpivot_d, 8],
        [uarm_ring_d, 5],
        [uarm_d, 72],
        [uarm_ring_d, 5],
        [uarm_flange_d-4, 7],
        [uarm_ring_d, 5],
        [uarm_d, 11],
        [uarm_flange_d, 9]
    ]);

    // Wrist and end spindle
    translate([-92, 0, 87])
    rotate([0, uarm_angle, 0])
    stepped_cylinder([
        [36, 10],
        [30, 5],
        [20, 6],
        [spindle_d, 18],
        [tip_nut_d, 4],
        [tip_d, 4]
    ]);
}