// ------------------------------------------------------------
// Hand-cranked planetary gear winch (interpreted from image)
// Big internally-toothed flywheel ring, sun + 3 planets on a
// pinned spider, rope drum, two-arm crank with grips, and a
// triangular support plate with cross feet.
// Axis of rotation = world X, wheel stands vertical.
// All dimensions in mm.
// ------------------------------------------------------------
$fn = 80;

/* ---------- flywheel ring gear ---------- */
ring_outer_r = 84;    // outer radius of rim
ring_root_r  = 70;    // radius at root of internal teeth
ring_tip_r   = 64;    // radius at tip of internal teeth
ring_width   = 26;    // axial width of rim
ring_teeth   = 72;    // internal tooth count

/* ---------- gears ---------- */
sun_r        = 10;    // sun gear pitch body radius
sun_teeth    = 13;
planet_r     = 23;    // planet body radius
planet_teeth = 25;
planet_orbit = 40;    // planet center distance from axis
gear_thick   = 12;
planet_ang   = [30, 150, 270];

/* ---------- carrier spider & pins ---------- */
pin_r   = 6;
hub_r   = 12;

/* ---------- axle & drum ---------- */
axle_r        = 9;
drum_r        = 24;
drum_x0       = 12;
drum_len      = 44;
flange_r      = 29;
flange_t      = 6;
stub_r        = 8;
crank_hub_r   = 13;
crank_hub_x   = 62;
crank_hub_len = 18;

/* ---------- crank arms & grips ---------- */
arm_sec  = 14;
arm1_len = 160;  arm1_ang = -140;  arm1_z = 72;  // long arm on front hub
arm2_len = 125;  arm2_ang = -170;  arm2_z = 21;  // short arm on drum
grip_r   = 11;
grip_len = 58;

/* ---------- support base ---------- */
axle_z    = 95;     // axle height above ground
plate_t   = 8;
plate_y   = 25;     // plate offset from wheel plane
base_len  = 80;     // horizontal length of triangular plate
boss_r    = 11;     // axle support boss at apex
boss_len  = 33;
foot_w    = 14;
foot_len  = 64;
foot_h    = 8;
pad_len   = 26;
pad_w     = 12;

/* ---------- external spur gear (axis = Z, centered) ---------- */
module spur_gear(r, teeth, thick, tooth_len, tooth_w, bore) {
    difference() {
        union() {
            cylinder(h = thick, r = r, center = true);
            for (i = [0:teeth-1])
                rotate([0, 0, i*360/teeth])
                    translate([r + tooth_len/2 - 1, 0, 0])
                        cube([tooth_len, tooth_w, thick], center = true);
        }
        cylinder(h = thick + 2, r = bore, center = true);
    }
}

/* ---------- ring gear: rim + inward teeth (axis = Z) ---------- */
module ring_gear() {
    rotate_extrude()
        polygon([[ring_root_r, -ring_width/2],
                 [ring_outer_r, -ring_width/2],
                 [ring_outer_r,  ring_width/2],
                 [ring_root_r,  ring_width/2]]);
    for (i = [0:ring_teeth-1])
        rotate([0, 0, i*360/ring_teeth])
            translate([(ring_tip_r + ring_root_r)/2 + 1.5, 0, 0])
                cube([ring_root_r - ring_tip_r + 3, 4, ring_width - 2],
                     center = true);
}

/* ---------- front spider carrier with protruding pins ---------- */
module carrier() {
    translate([0, 0, 2]) cylinder(h = 6, r = hub_r);          // hub disc
    for (a = planet_ang)
        rotate([0, 0, a])
            translate([6, -8, 2]) cube([40, 16, 6]);          // spokes
    for (a = planet_ang)
        translate([planet_orbit*cos(a), planet_orbit*sin(a), -6])
            cylinder(h = 38, r = pin_r);                      // axle pins
}

/* ---------- rear spider with short pins ---------- */
module rear_spider() {
    translate([0, 0, -26]) cylinder(h = 6, r = hub_r);
    for (a = planet_ang)
        rotate([0, 0, a])
            translate([6, -6, -26]) cube([40, 12, 6]);
    for (a = planet_ang)
        translate([planet_orbit*cos(a), planet_orbit*sin(a), -32])
            cylinder(h = 28, r = 5);
}

/* ---------- crank arm with axial grip (in wheel local frame) ---------- */
module crank_arm(zp, ang, len) {
    translate([0, 0, zp]) rotate([0, 0, ang]) {
        translate([-12, -arm_sec/2, -arm_sec/2])
            cube([len + 12, arm_sec, arm_sec]);               // arm bar
        translate([len, 0, 0])
            cylinder(h = grip_len, r = grip_r);               // handle grip
    }
}

/* ---------- whole rotating group, axis = local Z ---------- */
module wheel_assembly() {
    // rim with internal teeth
    ring_gear();

    // sun gear on axle
    spur_gear(sun_r, sun_teeth, gear_thick, 3, 3.2, axle_r + 0.2);

    // planet gears
    for (a = planet_ang)
        translate([planet_orbit*cos(a), planet_orbit*sin(a), 0])
            spur_gear(planet_r, planet_teeth, gear_thick, 3, 3.4, pin_r + 0.3);

    // spiders and pins
    carrier();
    rear_spider();

    // axle stub and apex support boss
    translate([0, 0, -16]) cylinder(h = 28, r = axle_r);
    translate([0, boss_y0, 0]) rotate([90, 0, 0])
        cylinder(h = boss_len, r = boss_r);

    // rope drum, flange, stub shaft, crank hub
    translate([0, 0, drum_x0]) cylinder(h = drum_len, r = drum_r);
    translate([0, 0, drum_x0 + drum_len - flange_t])
        cylinder(h = flange_t, r = flange_r);
    translate([0, 0, drum_x0 + drum_len])
        cylinder(h = 10, r = stub_r);
    translate([0, 0, crank_hub_x])
        cylinder(h = crank_hub_len, r = crank_hub_r);

    // two crank arms with grips
    crank_arm(arm1_z, arm1_ang, arm1_len);
    crank_arm(arm2_z, arm2_ang, arm2_len);
}

/* ---------- triangular support plate + feet ---------- */
module base() {
    // side plate in the vertical plane, apex at the axle
    translate([0, -plate_y, 0])
        rotate([90, 0, 0])
            linear_extrude(height = plate_t, center = true)
                polygon([[0, 0], [base_len, 0], [0, axle_z]]);

    // cross feet under rear edge and hypotenuse end
    translate([1, -44, 0])   cube([foot_w, foot_len, foot_h]);
    translate([65, -44, 0])  cube([foot_w, foot_len, foot_h]);

    // foot pads (front pad protrudes past the hypotenuse)
    translate([-4, -46, 0])  cube([pad_len, pad_w, foot_h]);
    translate([62, -46, 0])  cube([pad_len, pad_w, foot_h]);
}

/* ---------- assembly ---------- */
translate([0, 0, axle_z]) rotate([0, 90, 0]) wheel_assembly();
base();