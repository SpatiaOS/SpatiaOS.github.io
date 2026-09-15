// Old hand-cranked planetary winch/gear mechanism
// All dimensions in millimeters
$fn = 60; // Resolution for curved surfaces

// === Global Parameters ===
shaft_height = 125;        // Z height of main shaft centerline from ground
shaft_dia = 25;            // Main shaft diameter
shaft_total_length = 130;  // Total shaft length
shaft_front_length = 90;   // Shaft length forward (crank side)

// Crank parameters
long_crank_length = 130;   // Length of outermost long crank arm
long_crank_angle = 135;    // Angle of long crank (degrees CCW from +X around shaft)
long_crank_y = -80;        // Y position of long crank along shaft
short_upper_length = 75;   // Length of upper short crank
short_upper_angle = 85;    // Angle of upper short crank
short_upper_y = -35;       // Y position of upper short crank
short_lower_length = 70;   // Length of lower short crank
short_lower_angle = -60;   // Angle of lower short crank
short_lower_y = -15;       // Y position of lower short crank
crank_arm_thick = 10;      // Crank arm thickness (radial direction)
crank_arm_width = 12;      // Crank arm width along shaft axis
grip_dia = 12;             // Handle grip diameter
grip_length = 35;          // Grip length parallel to shaft

// Stand parameters
stand_plate_length_y = 55; // Thickness of triangular stand plate along Y
base_bar_x = 85;           // X position of base crossbar
base_bar_length_y = 70;    // Base crossbar length along Y
base_bar_thick_x = 20;     // Base bar thickness in X
base_bar_height = 8;       // Base bar height (Z)
foot_size = 5;             // Height/size of support feet
hub_dia_front = 30;        // Front diameter of tapered shaft hub
hub_dia_back = 48;         // Back diameter of tapered shaft hub
hub_length = 40;           // Hub length along shaft

// Gear train parameters
ring_gear_od = 220;        // Outer diameter of large ring gear
ring_gear_width = 30;      // Ring gear thickness along shaft
tooth_depth = 4;           // Gear tooth height
num_ring_teeth = 72;       // Number of internal ring gear teeth
sun_gear_dia = 64;         // Sun gear diameter (on input shaft)
sun_gear_width = 22;       // Sun gear thickness
num_sun_teeth = 24;        // Sun gear tooth count
planet_gear_dia = 60;      // Planet gear diameter
planet_gear_width = 20;    // Planet gear thickness
num_planet_teeth = 22;     // Planet gear tooth count
num_planets = 4;           // Number of planet gears
carrier_thick = 8;         // Planet carrier plate thickness
carrier_arm_width = 12;    // Carrier spoke width
planet_axle_dia = 8;       // Planet axle diameter
planet_axle_protrude = 12; // Distance axles extend in front of carrier
cap_dia = 12;              // Center cap diameter on carrier

// === Derived Gear Dimensions ===
sun_r_tip = sun_gear_dia / 2;
sun_r_root = sun_r_tip - tooth_depth;
planet_r_tip = planet_gear_dia / 2;
planet_r_root = planet_r_tip - tooth_depth;
planet_center_r = sun_r_tip + planet_r_tip; // Distance from main shaft to planet centers
ring_r_tip = planet_center_r + planet_r_tip;
ring_r_root = ring_r_tip + tooth_depth;
ring_r_outer = ring_gear_od / 2;
ring_y = 35;                                  // Y center position of gear set
sun_y = ring_y;
carrier_y = ring_y - ring_gear_width/2 - carrier_thick/2 - 1;
axle_front_y = carrier_y - planet_axle_protrude;
axle_back_y = ring_y + planet_gear_width/2;
axle_length = axle_back_y - axle_front_y;

// === Helper Modules ===
// External spur gear (for sun and planet gears)
module external_gear(tip_r, root_r, width, teeth) {
    linear_extrude(height=width) {
        circle(r=root_r);
        for (i = [0:teeth-1]) {
            a = i * 360 / teeth;
            rotate(a) {
                tooth_w = (2 * PI * root_r / teeth) * 0.45;
                translate([root_r, 0])
                    square([tip_r - root_r, tooth_w], center=true);
            }
        }
    }
}

// Internal ring gear
module internal_gear(outer_r, tip_r, root_r, width, teeth) {
    linear_extrude(height=width) {
        difference() {
            circle(r=outer_r);
            circle(r=root_r);
            for (i = [0:teeth-1]) {
                a = i * 360 / teeth;
                rotate(a) {
                    gap_w = (2 * PI * root_r / teeth) * 0.45;
                    translate([tip_r, 0])
                        square([root_r - tip_r, gap_w], center=true);
                }
            }
        }
    }
}

// Crank arm with parallel grip
module crank_arm(y_pos, length, angle) {
    translate([0, y_pos, shaft_height]) {
        rotate([0, angle, 0]) {
            // Radial arm
            translate([length/2, 0, 0])
                cube([length, crank_arm_width, crank_arm_thick], center=true);
            // Grip parallel to shaft
            translate([length, 0, 0])
                rotate([90, 0, 0])
                    cylinder(d=grip_dia, h=grip_length, center=true);
        }
    }
}

// 4-spoke planet carrier
module planet_carrier(planet_r, num_planets, thick, arm_w, hub_dia) {
    cylinder(d=hub_dia, h=thick, center=true);
    for (i = [0:num_planets-1]) {
        a = i * 360 / num_planets;
        rotate(a) {
            translate([planet_r/2, 0, 0])
                cube([planet_r, arm_w, thick], center=true);
        }
    }
}

// Triangular vertical stand gusset
module stand_plate() {
    translate([0, 17.5, 0]) // Shift to connect hub to rear base
    rotate([90, 0, 0])
        linear_extrude(height=stand_plate_length_y, center=true) {
            polygon(points=[
                [0, shaft_height],
                [base_bar_x, base_bar_height + foot_size],
                [-15, base_bar_height + foot_size]
            ]);
        }
}

// Base frame with feet
module base_stand() {
    // Crossbar along Y under ring gear
    translate([
        base_bar_x - base_bar_thick_x/2,
        ring_y - base_bar_length_y/2,
        foot_size + base_bar_height/2
    ])
        cube([base_bar_thick_x, base_bar_length_y, base_bar_height]);
    // Front foot
    translate([
        base_bar_x - foot_size/2,
        ring_y - base_bar_length_y/2 - foot_size/2,
        foot_size/2
    ])
        cube([foot_size, foot_size, foot_size]);
    // Back foot
    translate([
        base_bar_x - foot_size/2,
        ring_y + base_bar_length_y/2 - foot_size/2,
        foot_size/2
    ])
        cube([foot_size, foot_size, foot_size]);
}

// === Main Model Assembly ===
union() {
    // Base and stand
    base_stand();
    stand_plate();

    // Tapered shaft hub
    translate([0, 0, shaft_height])
        rotate([90, 0, 0])
            cylinder(h=hub_length, r1=hub_dia_front/2, r2=hub_dia_back/2, center=true);
    // Small key detail on hub
    translate([-15, -10, shaft_height - hub_dia_front/2 - 2])
        cube([6, 6, 6]);

    // Main shaft
    translate([0, (shaft_length_back(shaft_total_length) - shaft_front_length)/2, shaft_height])
        rotate([90, 0, 0])
            cylinder(d=shaft_dia, h=shaft_total_length, center=true);

    // Crank arms and handles
    crank_arm(long_crank_y, long_crank_length, long_crank_angle);
    crank_arm(short_upper_y, short_upper_length, short_upper_angle);
    crank_arm(short_lower_y, short_lower_length, short_lower_angle);

    // Large ring gear (fixed to stand)
    translate([0, ring_y, shaft_height])
        rotate([90, 0, 0])
            internal_gear(ring_r_outer, ring_r_tip, ring_r_root, ring_gear_width, num_ring_teeth);
    // Ring gear support bracket
    translate([-10, ring_y -15, shaft_height - ring_r_outer + 5])
        cube([20, 40, 12]);

    // Sun gear on input shaft
    translate([0, sun_y, shaft_height])
        rotate([90, 0, 0])
            external_gear(sun_r_tip, sun_r_root, sun_gear_width, num_sun_teeth);

    // Planet carrier
    translate([0, carrier_y, shaft_height])
        rotate([90, 0, 0]) {
            planet_carrier(planet_center_r, num_planets, carrier_thick, carrier_arm_width, 35);
            // Center cap
            translate([0,0,-carrier_thick/2 - 3])
                cylinder(d=cap_dia, h=6, center=true);
        }

    // Planet gears and axles
    for (i = [0:num_planets-1]) {
        a = i * 360 / num_planets;
        px = planet_center_r * cos(a);
        pz = shaft_height + planet_center_r * sin(a);
        // Planet gear
        translate([px, ring_y, pz])
            rotate([90, 0, 0])
                external_gear(planet_r_tip, planet_r_root, planet_gear_width, num_planet_teeth);
        // Planet axle (protrudes front for visual detail)
        translate([px, (axle_front_y + axle_back_y)/2, pz])
            rotate([90, 0, 0])
                cylinder(d=planet_axle_dia, h=axle_length, center=true);
    }
}

// Helper function to calculate shaft back length
function shaft_length_back(total) = total - shaft_front_length;