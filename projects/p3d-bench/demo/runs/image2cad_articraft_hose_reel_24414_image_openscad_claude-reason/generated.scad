// Wall-mounted hose reel with inlet valve and outlet faucet
// Parameters (mm)
$fn = 64;

// Reel drum
flange_dia    = 220;
flange_thk    = 6;
drum_dia      = 130;
drum_width    = 110;     // distance between flanges
hose_dia      = 10;      // wound hose cross-section
hose_turns    = 9;

// Mounting holes on flange
mount_hole_d  = 6;
mount_offset  = 35;      // from center

// Inlet pipe (top)
inlet_pipe_d  = 14;
inlet_pipe_h  = 280;
inlet_valve_d = 28;

// Outlet pipe (bottom) with faucet
outlet_pipe_d = 14;
outlet_pipe_h = 180;
faucet_body_d = 26;

// ---------- Modules ----------
module flange() {
    cylinder(h=flange_thk, d=flange_dia);
}

module drum_core() {
    cylinder(h=drum_width, d=drum_dia);
}

module wound_hose() {
    // Stack of toroidal hose loops along the drum axis
    coil_d = drum_dia + hose_dia;
    for (i = [0 : hose_turns-1]) {
        translate([0, 0, hose_dia/2 + i*hose_dia])
            rotate_extrude()
                translate([coil_d/2, 0, 0])
                    circle(d=hose_dia);
    }
}

module reel() {
    // Reel oriented along Y axis (axle horizontal)
    rotate([90, 0, 0]) {
        // Back flange
        flange();
        // Front flange
        translate([0, 0, drum_width + flange_thk]) flange();
        // Drum core
        translate([0, 0, flange_thk]) drum_core();
        // Hose coil on drum
        translate([0, 0, flange_thk]) wound_hose();
    }
}

module flange_mount_holes() {
    // Four small holes in a square pattern on the front flange
    rotate([90, 0, 0])
    translate([0, 0, drum_width + 2*flange_thk - 1])
        for (x = [-1, 1], z = [-1, 1])
            translate([x*mount_offset/2, z*mount_offset/2, 0])
                cylinder(h=flange_thk+2, d=mount_hole_d);
}

module valve_handle() {
    // Hex-ish valve body on top
    cylinder(h=18, d=inlet_valve_d, $fn=6);
    translate([0, 0, 18]) cylinder(h=6, d=inlet_valve_d*0.6);
}

module inlet_assembly() {
    // Comes off the back-top of the reel, curves up to wall valve
    translate([-flange_dia/2 + 10, 0, 0]) {
        // Vertical pipe
        cylinder(h=inlet_pipe_h, d=inlet_pipe_d);
        // Curved elbow at bottom going toward reel
        translate([0, 0, 0])
            rotate([90, 0, 0])
                rotate_extrude(angle=90)
                    translate([20, 0, 0]) circle(d=inlet_pipe_d);
        // Valve at top
        translate([0, 0, inlet_pipe_h]) valve_handle();
    }
}

module faucet() {
    // Faucet body
    sphere(d=faucet_body_d);
    // Spout pointing down
    translate([0, 0, -faucet_body_d/2])
        cylinder(h=35, d1=faucet_body_d*0.7, d2=faucet_body_d*0.4);
    // Lever handle
    translate([-faucet_body_d/2, 0, 0])
        rotate([0, -20, 0])
            translate([-25, 0, 0])
                cube([50, 5, 8], center=true);
}

module outlet_assembly() {
    // Drops from bottom of reel down to faucet
    translate([0, 0, -flange_dia/2 + 10]) {
        cylinder(h=-outlet_pipe_h, d=outlet_pipe_d);
        translate([0, 0, -outlet_pipe_h - faucet_body_d/2])
            faucet();
    }
}

// ---------- Assembly ----------
difference() {
    union() {
        reel();
        inlet_assembly();
        outlet_assembly();
    }
    flange_mount_holes();
}