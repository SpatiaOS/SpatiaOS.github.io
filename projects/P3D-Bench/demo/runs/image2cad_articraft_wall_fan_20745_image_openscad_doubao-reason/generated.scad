// --------------------------
// Parametric Rechargeable Clip Fan Model
// Units: Millimeters
// --------------------------
$fn = 64; // Smooth curve resolution

// Fan Assembly Parameters
fan_dia = 200;               // Total diameter of fan grill
grill_depth = 24;            // Depth of the fan grill cage
grill_bar_dia = 1.5;         // Diameter of grill wire bars
num_radial_spokes = 32;      // Number of radial support bars in grill
num_concentric_rings = 6;    // Number of circular support rings in grill
blade_count = 7;             // Number of fan blades
blade_pitch_angle = 12;      // Tilt angle of fan blades
motor_housing_dia = 80;      // Diameter of main motor body
motor_housing_height = 70;   // Height of main motor body

// Arm & Suction Mount Parameters
arm_length = 120;            // Length of support arm
arm_dia_motor_end = 25;      // Diameter of arm at motor hinge
arm_dia_suction_end = 20;    // Diameter of arm at suction cup end
suction_cup_dia = 150;       // Diameter of suction cup mount
suction_cup_depth = 40;      // Depth of suction cup concave profile
hinge_size = 16;             // Size of pivot hinge block

// --------------------------
// Helper Modules
// --------------------------
module rounded_rect(size, r) {
    // Rounded 2D rectangle for fan blades
    minkowski() {
        square([size[0] - 2*r, size[1] - 2*r], center=true);
        circle(r=r);
    }
}

// --------------------------
// Component Modules
// --------------------------
module fan_grill(dia, depth, bar_dia, spokes, rings) {
    // Outer rim of grill
    difference() {
        cylinder(h=depth, d=dia, center=true);
        cylinder(h=depth+0.2, d=dia - 2*bar_dia, center=true);
    }
    // Radial support bars (round wires)
    for (ang = [0 : 360/spokes : 359.9]) {
        rotate([0, 0, ang])
        translate([dia/4, 0, 0])
        rotate([0, 90, 0])
        cylinder(h=dia/2 - bar_dia, d=bar_dia, center=true);
    }
    // Concentric support rings
    ring_spacing = (dia/2 - bar_dia) / (rings + 1);
    for (r = [ring_spacing : ring_spacing : dia/2 - bar_dia - ring_spacing]) {
        difference() {
            cylinder(h=depth, d=2*r + bar_dia, center=true);
            cylinder(h=depth+0.2, d=2*r - bar_dia, center=true);
        }
    }
}

module fan_blade_set(count, blade_len, blade_w, pitch) {
    // Central blade hub
    cylinder(h=10, d=30, center=true);
    // Individual blades
    for (i = [0 : 1 : count-1]) {
        rotate([0, 0, i * 360/count])
        rotate([pitch, 0, 0])
        translate([blade_len/2 + 15, 0, 0])
        linear_extrude(height=1.8, center=true)
        rounded_rect([blade_len, blade_w], 3);
    }
}

module motor_housing(dia, height) {
    // Main motor cylinder
    cylinder(h=height, d=dia, center=false);
    // Top control cover
    translate([0, 0, height])
    cylinder(h=3, d=dia, center=false);
    // Vent slots in top cover
    for (ang = [0 : 12 : 120]) {
        translate([0, 0, height + 1.5])
        rotate([0, 0, ang])
        translate([dia/4, 0, 0])
        cube([dia/4, 2, 4], center=true);
    }
    // Control switch cutout
    translate([0, dia/6, height + 1.5])
    cube([8, 12, 4], center=true);
}

module support_arm(length, d1, d2) {
    // Tapered arm body
    cylinder(h=length, r1=d1/2, r2=d2/2, center=true);
    // Suction cup release levers
    translate([length/2 - 10, d1/2 + 4, 0])
    rotate([0, 90, 0])
    cylinder(h=40, d=2.5, center=true);
    translate([length/2 - 10, -d1/2 -4, 0])
    rotate([0, 90, 0])
    cylinder(h=40, d=2.5, center=true);
}

module suction_cup(dia, depth) {
    // Rotate extruded profile for suction cup shape
    rotate_extrude()
    polygon(points=[
        [0, 0],
        [dia/2, 0],
        [dia/2 - 4, -2],
        [dia*0.3, -depth*0.85],
        [0, -depth]
    ]);
}

// --------------------------
// Main Assembly
// --------------------------
union() {
    // Fan unit at origin
    translate([0, 0, grill_depth/2])
    fan_grill(fan_dia, grill_depth, grill_bar_dia, num_radial_spokes, num_concentric_rings);
    
    translate([0, 0, grill_depth/2])
    fan_blade_set(blade_count, 70, 20, blade_pitch_angle);
    
    translate([0, 0, grill_depth])
    motor_housing(motor_housing_dia, motor_housing_height);
    
    // Pivot hinge
    translate([motor_housing_dia/2 + hinge_size/2, 0, motor_housing_height/2]) {
        cube([hinge_size, hinge_size, hinge_size], center=true);
        rotate([0, 90, 0])
        cylinder(h=hinge_size + 2, d=6, center=true);
    }
    
    // Angled support arm (30 degree upward tilt matching reference)
    translate([
        motor_housing_dia/2 + hinge_size + arm_length/2 * cos(30),
        0,
        motor_housing_height/2 + arm_length/2 * sin(30)
    ])
    rotate([0, -30, 0])
    support_arm(arm_length, arm_dia_motor_end, arm_dia_suction_end);
    
    // Suction cup mount at end of arm
    translate([
        motor_housing_dia/2 + hinge_size + arm_length * cos(30) + suction_cup_depth,
        0,
        motor_housing_height/2 + arm_length * sin(30)
    ])
    rotate([0, 90, 0])
    suction_cup(suction_cup_dia, suction_cup_depth);
}