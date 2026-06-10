// DJ Controller Assembly
// Based on provided image and text description

$fn = 60;

// Global Dimensions
HOUSING_W = 300;
HOUSING_D = 230;
HOUSING_H = 45;
BASE_W = 309;
BASE_D = 245;
BASE_H = 28;

// Component Dimensions
JOG_WHEEL_D = 86;
JOG_WHEEL_H = 20;
JOG_WHEEL_INNER_D = 60.5;

BUTTON_W = 18.87;
BUTTON_D = 12.09;
BUTTON_H = 5.0;
BUTTON_R = 2.0;

KNOB_BASE_D = 14.89;
KNOB_H = 17;
KNOB_HOLE_D = 1.18;

FADER_W = 25; // Estimated width
FADER_L = 80; // Estimated length for channel faders
CROSSFADER_L = 100; // Estimated length

JACK_FLANGE_D = 18.2;
JACK_BORE_D = 4.92;

// Colors
COLOR_HOUSING = [0.8, 0.8, 0.8];
COLOR_JOG = [0.3, 0.3, 0.3];
COLOR_BUTTON = [0.9, 0.9, 0.9];
COLOR_KNOB = [0.2, 0.2, 0.2];
COLOR_FADER = [0.5, 0.5, 0.5];
COLOR_JACK = [0.4, 0.4, 0.4];

// Main Assembly
assembly();

module assembly() {
    // Base Plate
    color([0.7, 0.7, 0.7])
    base_plate();

    // Housing Cover
    color(COLOR_HOUSING)
    housing_cover();

    // Jog Wheels (Left and Right)
    // Left Deck
    translate([-80, 30, HOUSING_H])
    jog_wheel();
    
    // Right Deck
    translate([80, 30, HOUSING_H])
    jog_wheel();

    // Channel Faders (Vertical sliders)
    // Left Fader
    translate([-40, -20, HOUSING_H + 2])
    fader_vertical();
    
    // Right Fader
    translate([40, -20, HOUSING_H + 2])
    fader_vertical();

    // Crossfader (Horizontal slider)
    translate([0, -80, HOUSING_H + 2])
    fader_horizontal();

    // Knobs (EQ/Gain) - 3 per channel + 1 gain? 
    // Visual shows 3 knobs above fader, 1 knob top left/right (Gain/Filter)
    // Left Knobs
    translate([-80, 80, HOUSING_H]) knob();
    translate([-60, 95, HOUSING_H]) knob();
    translate([-80, 110, HOUSING_H]) knob();
    translate([-100, 95, HOUSING_H]) knob(); // Gain

    // Right Knobs
    translate([80, 80, HOUSING_H]) knob();
    translate([60, 95, HOUSING_H]) knob();
    translate([80, 110, HOUSING_H]) knob();
    translate([100, 95, HOUSING_H]) knob(); // Gain

    // Buttons (Spacer Blocks)
    // Top Row (Performance Pads) - 4x2 grid per side
    // Left Pads
    for (x = [-110, -90, -70, -50]) {
        for (y = [80, 100]) {
            translate([x, y, HOUSING_H])
            spacer_block();
        }
    }
    // Right Pads
    for (x = [50, 70, 90, 110]) {
        for (y = [80, 100]) {
            translate([x, y, HOUSING_H])
            spacer_block();
        }
    }

    // Transport/Function Buttons (Top Center/Edges)
    // Top Left
    translate([-120, 50, HOUSING_H]) spacer_block();
    translate([-100, 50, HOUSING_H]) spacer_block();
    // Top Right
    translate([120, 50, HOUSING_H]) spacer_block();
    translate([100, 50, HOUSING_H]) spacer_block();
    
    // Center Buttons (Cue/Play etc)
    translate([-20, 50, HOUSING_H]) spacer_block();
    translate([20, 50, HOUSING_H]) spacer_block();
    translate([-20, 30, HOUSING_H]) spacer_block();
    translate([20, 30, HOUSING_H]) spacer_block();

    // Front Panel Jacks
    // Left Side
    translate([-100, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();
    
    translate([-70, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();

    // Right Side
    translate([70, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();

    translate([100, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();
    
    // Center Jacks (Headphone/Mic?)
    translate([-20, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();

    translate([20, -HOUSING_D/2 - 5, 15])
    rotate([90, 0, 0])
    flanged_bushing();

    // Pins (Small protruding pins)
    // Scattered around for detail
    translate([-50, 0, HOUSING_H + 10]) pin();
    translate([50, 0, HOUSING_H + 10]) pin();
}

module base_plate() {
    // Thin slab with stepped edges
    difference() {
        // Main base block
        cube([BASE_W, BASE_D, BASE_H], center=true);
        
        // Corner notches/chamfers
        // Front Left
        translate([-BASE_W/2 + 20, -BASE_D/2 + 20, 0])
        cube([40, 40, BASE_H + 1], center=true);
        
        // Front Right
        translate([BASE_W/2 - 20, -BASE_D/2 + 20, 0])
        cube([40, 40, BASE_H + 1], center=true);
    }
    
    // Stepped tabs
    translate([-BASE_W/2 + 10, -BASE_D/2 + 10, -BASE_H/2 + 5])
    cube([20, 20, 10], center=true);
    
    translate([BASE_W/2 - 10, -BASE_D/2 + 10, -BASE_H/2 + 5])
    cube([20, 20, 10], center=true);
}

module housing_cover() {
    difference() {
        // Main housing body
        hull() {
            // Main block
            cube([HOUSING_W, HOUSING_D, HOUSING_H], center=true);
            // Rounded corners logic simplified by hulling with cylinders or just chamfering
        }
        
        // 45 degree chamfer on top edges
        // We can simulate this by subtracting a larger box rotated or just using a chamfer module
        // Simplified: Subtract a box slightly larger at the top
        translate([0, 0, HOUSING_H/2 - 2])
        linear_extrude(4)
        offset(delta=-2)
        square([HOUSING_W, HOUSING_D], center=true);
    }
    
    // Front panel step
    translate([0, -HOUSING_D/2, -10])
    cube([HOUSING_W, 20, 20], center=true);

    // Cutouts for buttons (simplified as shallow recesses)
    // Left Pads
    for (x = [-110, -90, -70, -50]) {
        for (y = [80, 100]) {
            translate([x, y, HOUSING_H - 1])
            cube([BUTTON_W + 1, BUTTON_D + 1, 2], center=true);
        }
    }
    // Right Pads
    for (x = [50, 70, 90, 110]) {
        for (y = [80, 100]) {
            translate([x, y, HOUSING_H - 1])
            cube([BUTTON_W + 1, BUTTON_D + 1, 2], center=true);
        }
    }
    
    // Fader slots
    // Left Fader Slot
    translate([-40, -20, HOUSING_H - 1])
    cube([FADER_W + 2, FADER_L + 10, 2], center=true);
    
    // Right Fader Slot
    translate([40, -20, HOUSING_H - 1])
    cube([FADER_W + 2, FADER_L + 10, 2], center=true);
    
    // Crossfader Slot
    translate([0, -80, HOUSING_H - 1])
    cube([CROSSFADER_L + 20, FADER_W + 2, 2], center=true);
    
    // Jog Wheel Recesses
    translate([-80, 30, HOUSING_H - 2])
    cylinder(h=4, d=JOG_WHEEL_D + 2);
    
    translate([80, 30, HOUSING_H - 2])
    cylinder(h=4, d=JOG_WHEEL_D + 2);
}

module jog_wheel() {
    difference() {
        // Main disc
        cylinder(h=JOG_WHEEL_H, d=JOG_WHEEL_D, center=false);
        
        // Slots around the perimeter
        for (i = [0 : 13]) {
            rotate([0, 0, i * (360/14)])
            translate([JOG_WHEEL_D/2 - 2, 0, JOG_WHEEL_H/2])
            cube([4, 2, JOG_WHEEL_H + 1], center=true);
        }
        
        // Inner step (shallow circular step)
        // The description says "shallow circular step... creates a raised central plateau"
        // So we subtract the outer ring to leave the center raised? 
        // Or subtract the center to make a recess? 
        // "shallow circular step (Ø 60.5 mm, 1 mm deep) that creates a raised central plateau"
        // This implies the outer ring is lower.
        translate([0, 0, JOG_WHEEL_H - 1])
        difference() {
            cylinder(h=2, d=JOG_WHEEL_D);
            cylinder(h=2, d=JOG_WHEEL_INNER_D);
        }
    }
    
    // Hemispherical boss
    translate([JOG_WHEEL_D/4, 0, JOG_WHEEL_H])
    sphere(d=5);
}

module spacer_block() {
    // Pillow-top profile
    // 18.87 x 12.09 x 5.0 with R=2.0 fillet
    // Using minkowski for rounded edges
    // Note: Minkowski is slow, so we use a smaller cube and sphere
    // Or just a hull of spheres for corners
    hull() {
        // Bottom corners
        translate([-BUTTON_W/2 + BUTTON_R, -BUTTON_D/2 + BUTTON_R, 0]) sphere(r=BUTTON_R);
        translate([BUTTON_W/2 - BUTTON_R, -BUTTON_D/2 + BUTTON_R, 0]) sphere(r=BUTTON_R);
        translate([-BUTTON_W/2 + BUTTON_R, BUTTON_D/2 - BUTTON_R, 0]) sphere(r=BUTTON_R);
        translate([BUTTON_W/2 - BUTTON_R, BUTTON_D/2 - BUTTON_R, 0]) sphere(r=BUTTON_R);
        
        // Top corners (slightly smaller for taper if needed, but text says flat top blended)
        // "smooth pillow-top profile"
        translate([-BUTTON_W/2 + BUTTON_R, -BUTTON_D/2 + BUTTON_R, BUTTON_H - 2*BUTTON_R]) sphere(r=BUTTON_R);
        translate([BUTTON_W/2 - BUTTON_R, -BUTTON_D/2 + BUTTON_R, BUTTON_H - 2*BUTTON_R]) sphere(r=BUTTON_R);
        translate([-BUTTON_W/2 + BUTTON_R, BUTTON_D/2 - BUTTON_R, BUTTON_H - 2*BUTTON_R]) sphere(r=BUTTON_R);
        translate([BUTTON_W/2 - BUTTON_R, BUTTON_D/2 - BUTTON_R, BUTTON_H - 2*BUTTON_R]) sphere(r=BUTTON_R);
    }
}

module knob() {
    // Bell-shaped conical post
    // Base D=14.89, H=17
    // Tapering body
    difference() {
        union() {
            // Base flange
            cylinder(h=2, d=KNOB_BASE_D);
            // Tapered body
            translate([0, 0, 2])
            cylinder(h=KNOB_H - 4, r1=KNOB_BASE_D/2 - 1, r2=4);
            // Top cap
            translate([0, 0, KNOB_H - 2])
            cylinder(h=2, d=8);
        }
        // Through hole
        cylinder(h=KNOB_H + 1, d=KNOB_HOLE_D, center=true);
    }
}

module fader_vertical() {
    // Vertical channel fader
    color(COLOR_FADER)
    union() {
        // Fader cap
        hull() {
            cube([FADER_W, 15, 8], center=true);
            translate([0, 0, 5])
            cube([FADER_W - 4, 10, 4], center=true);
        }
        // Stem (structural bar)
        translate([0, 0, -10])
        cube([4, 4, 20], center=true);
    }
}

module fader_horizontal() {
    // Horizontal crossfader
    color(COLOR_FADER)
    union() {
        // Fader cap
        hull() {
            cube([15, FADER_W, 8], center=true);
            translate([0, 0, 5])
            cube([10, FADER_W - 4, 4], center=true);
        }
        // Stem
        translate([0, 0, -10])
        cube([4, 4, 20], center=true);
    }
}

module flanged_bushing() {
    // Front panel jack
    difference() {
        union() {
            // Flange
            cylinder(h=2, d=JACK_FLANGE_D);
            // Boss
            translate([0, 0, 2])
            cylinder(h=8, d=10);
        }
        // Bore
        cylinder(h=12, d=JACK_BORE_D, center=true);
    }
}

module pin() {
    // Plain solid cylinder
    cylinder(h=11, r=0.75, center=true);
}