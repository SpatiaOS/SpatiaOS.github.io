// Hand-cranked geared winch / flywheel model
// Interpretation: vertical ring gear with internal teeth + spoked pinion on a
// horizontal axle, triangular support plate, base feet, drum on axle,
// two long operating levers with cylindrical grips.

$fn = 60;

// --- Parameters (mm) ---
ring_or   = 35;    // ring gear outer radius
ring_ir   = 27;    // ring gear inner radius
ring_w    = 12;    // ring gear width
teeth_n   = 48;    // internal tooth count
tooth_h   = 3;     // tooth height
tooth_w   = 2;     // tooth width
pin_r     = 16;    // pinion outer radius
pin_w     = 10;    // pinion width
pin_teeth = 20;    // pinion tooth count
axle_d    = 8;     // axle diameter
axle_h    = 45;    // axle height above ground
drum_d    = 16;    // drum diameter on axle
plate_t   = 6;     // triangular plate thickness
plate_h   = 45;    // triangular plate height
plate_b   = 64;    // triangular plate base width
foot_len  = 40;    // base foot length
foot_h    = 5;     // base foot height
lever_len = 95;    // operating lever length
grip_d    = 9;     // handle grip diameter
gear_y    = 12;    // ring gear front face position

// --- Modules ---
module ring_gear() {           // ring with internal teeth (axis = Z)
    union() {
        difference() {
            cylinder(h=ring_w, r=ring_or);
            translate([0,0,-1]) cylinder(h=ring_w+2, r=ring_ir);
        }
        for (i=[0:teeth_n-1])
            rotate([0,0,i*360/teeth_n])
                translate([ring_ir-tooth_h, -tooth_w/2, 0])
                    cube([tooth_h+1, tooth_w, ring_w]);
    }
}

module pinion() {              // spoked gear with external teeth (axis = Z)
    union() {
        cylinder(h=pin_w, r=6);                                   // hub
        difference() {                                            // rim
            cylinder(h=pin_w, r=pin_r);
            translate([0,0,-1]) cylinder(h=pin_w+2, r=pin_r-4);
        }
        for (i=[0:3]) rotate([0,0,i*90]) {                        // spokes
            translate([0,-2,0]) cube([pin_r-3, 4, pin_w]);
            translate([8,-3.5,0]) cube([9, 7, pin_w]);            // spoke pads
        }
        for (i=[0:pin_teeth-1])                                   // teeth
            rotate([0,0,i*360/pin_teeth])
                translate([pin_r-1, -tooth_w/2, 0])
                    cube([tooth_h+1, tooth_w, pin_w]);
    }
}

module tri_plate() {           // triangular support plate
    translate([0,plate_t,0]) rotate([90,0,0])
        linear_extrude(plate_t)
            polygon([[-plate_b/2,0],[plate_b/2,0],[0,plate_h]]);
}

module lever(ylev, ang) {      // operating lever with grip
    translate([0,0,axle_h]) rotate([0,ang,0]) {
        translate([0,ylev,-4]) cube([lever_len, 4, 8]);           // arm
        translate([lever_len-2, ylev-22, 0])                      // grip
            rotate([-90,0,0]) cylinder(h=26, d=grip_d);
    }
}

// --- Main assembly ---
union() {
    // support plate and feet
    tri_plate();
    for (sx=[-1,1])
        translate([sx*plate_b/2-4, -foot_len/2+plate_t/2, 0])
            cube([8, foot_len, foot_h]);

    // axle along Y
    translate([0,-52,axle_h]) rotate([-90,0,0]) cylinder(h=78, d=axle_d);
    // front hub boss
    translate([0,-52,axle_h]) rotate([-90,0,0]) cylinder(h=12, d=13);
    // drum on axle
    translate([0,-34,axle_h]) rotate([-90,0,0]) cylinder(h=26, d=drum_d);
    // small side crank handle
    translate([5,-40,axle_h]) rotate([0,90,0]) cylinder(h=22, d=7);

    // ring gear and pinion on axle
    translate([0,gear_y,axle_h]) rotate([-90,0,0]) ring_gear();
    translate([0,gear_y+1,axle_h]) rotate([-90,0,0]) pinion();
    // vertical connecting rod inside ring
    translate([-1.5, gear_y+2, axle_h+6]) cube([3, ring_w-4, ring_ir-8]);

    // two operating levers with grips
    lever(-46, -120);
    lever(-50, -80);
}