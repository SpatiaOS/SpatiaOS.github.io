// DJ Controller Assembly
// Reconstructed from text description and visual reference

$fn = 60;

// --- Helper Modules ---

// Generates the 2D footprint of the console, including the front notch
// Uses a triple-offset trick to perfectly round all corners (convex and concave)
module console_profile(r=4, inset=0) {
    offset(delta=-inset)
    offset(r=r) offset(r=-2*r) offset(r=r) 
    polygon([
        [-154.5, -123.5], // Bottom left
        [-90, -123.5],    // Notch left start
        [-50, -95],       // Notch left inner
        [50, -95],        // Notch right inner
        [90, -123.5],     // Notch right end
        [154.5, -123.5],  // Bottom right
        [154.5, 123.5],   // Top right
        [-154.5, 123.5]   // Top left
    ]);
}

// Places a connector on the front panel aligned to the face normal
module place_connector(x, y, z, angle) {
    translate([x, y, z]) 
    rotate([0, 0, angle]) 
    rotate([0, 90, 0]) 
    children();
}

// --- Component Modules ---

module console_body() {
    union() {
        // Base plate
        linear_extrude(10) console_profile(r=4);
        
        // Side tabs (mounting features)
        translate([-154.5, 0, 5]) cube([10, 100, 10], center=true);
        translate([154.5, 0, 5]) cube([10, 100, 10], center=true);
        
        // Main housing cover
        translate([0, 0, 10]) linear_extrude(20) console_profile(r=4);
        
        // Chamfered top edge (45 degrees)
        translate([0, 0, 30]) hull() {
            linear_extrude(0.1) console_profile(r=4);
            translate([0, 0, 5]) linear_extrude(0.1) console_profile(r=4, inset=5);
        }
    }
}

module jog_wheel() {
    difference() {
        union() {
            // Tapered conical skirt
            cylinder(h=6, d1=86, d2=82);
            // Main cylindrical body
            translate([0, 0, 6]) cylinder(h=13, d=82);
            // Raised central plateau
            translate([0, 0, 19]) cylinder(h=1, d=60.5);
            // Hemispherical indicator boss
            translate([0, 22, 19.5]) sphere(r=3);
        }
        // 14 peripheral slots for grip
        for(i = [0 : 13]) {
            rotate([0, 0, i * 360 / 14])
            translate([39, 0, 12])
            rotate([0, 15, 0])
            cube([6, 2, 16], center=true);
        }
    }
}

module fader_wedge() {
    // Trapezoidal wedge block
    hull() {
        cube([14, 8, 0.1], center=true);
        translate([0, 0, 15]) cube([10, 4, 0.1], center=true);
    }
}

module fader_assembly() {
    // Structural bar (stem)
    cube([1.1, 2, 20], center=true);
    // Wedge block (knob)
    translate([0, 0, 10]) fader_wedge();
}

module pad() {
    // Filleted-top rectangular prism (pillow top)
    minkowski() {
        cube([18.87 - 2, 12.09 - 2, 2], center=true);
        sphere(r=1, $fn=20);
    }
}

module socket_post() {
    difference() {
        union() {
            // Broad base flange
            cylinder(h=2, d=14.9);
            // Tapering bell-shaped body
            translate([0, 0, 2]) cylinder(h=10, d1=12, d2=6);
            // Narrow top
            translate([0, 0, 12]) cylinder(h=5, d=6);
        }
        // Axial through-hole
        translate([0, 0, -1]) cylinder(h=20, d=1.18, $fn=12);
    }
    // Internal locating pin
    cylinder(h=11, d=1.5, $fn=12);
}

module locating_pin() {
    difference() {
        union() {
            cylinder(h=2, d=14.9);
            translate([0, 0, 2]) cylinder(h=10, d1=12, d2=8);
            // Domed head
            translate([0, 0, 12]) sphere(d=10);
        }
        // Perpendicular cross-hole near shank
        translate([0, 0, 8]) rotate([90, 0, 0]) cylinder(h=20, d=1.18, center=true, $fn=12);
    }
}

module flanged_bushing() {
    union() {
        cylinder(h=2, d=18.2);
        translate([0, 0, 2]) cylinder(h=8, d=10);
    }
}

module ball_stud() {
    union() {
        cylinder(h=2, d=18.2);
        translate([0, 0, 2]) cylinder(h=4, d=10);
        translate([0, 0, 6]) sphere(d=10);
    }
}


// --- Main Assembly ---

union() {
    // 1. Main Console Body with Cutouts
    difference() {
        console_body();
        
        // Jog wheel circular recesses (5mm deep)
        translate([-85, -10, 35]) cylinder(h=10, d=88, center=true);
        translate([85, -10, 35]) cylinder(h=10, d=88, center=true);
        
        // Fader slots (through cover)
        for (x = [-22, 0, 22]) {
            translate([x, -20, 35]) cube([4, 40, 10], center=true);
        }
    }
    
    // 2. Jog Wheels
    translate([-85, -10, 30]) jog_wheel();
    translate([85, -10, 30]) jog_wheel();
    
    // 3. Faders (Mixer section)
    for (x = [-22, 0, 22]) {
        translate([x, -20, 30]) fader_assembly();
    }
    
    // 4. Tactile Pads
    // Center pad grid (3 columns x 4 rows)
    for (x = [-22, 0, 22]) {
        for (y = [10, 25, 40, 55]) {
            translate([x, y, 35]) pad();
        }
    }
    
    // Left deck pads (7 instances)
    translate([-110, 45, 35]) pad();
    translate([-85, 45, 35]) pad();
    translate([-60, 45, 35]) pad();
    translate([-135, 60, 35]) pad();
    translate([-135, 75, 35]) pad();
    translate([-135, -40, 35]) pad();
    translate([-135, -55, 35]) pad();
    
    // Right deck pads (7 instances, mirrored)
    translate([110, 45, 35]) pad();
    translate([85, 45, 35]) pad();
    translate([60, 45, 35]) pad();
    translate([135, 60, 35]) pad();
    translate([135, 75, 35]) pad();
    translate([135, -40, 35]) pad();
    translate([135, -55, 35]) pad();
    
    // 5. Knobs and Controls
    // Center mixer knobs (locating_pin x3)
    for (x = [-22, 0, 22]) {
        translate([x, 75, 35]) locating_pin();
    }
    
    // Left deck knobs (socket_post x4)
    translate([-110, 75, 35]) socket_post();
    translate([-85, 75, 35]) socket_post();
    translate([-60, 75, 35]) socket_post();
    translate([-135, 95, 35]) socket_post();
    
    // Right deck knobs (socket_post x4)
    translate([110, 75, 35]) socket_post();
    translate([85, 75, 35]) socket_post();
    translate([60, 75, 35]) socket_post();
    translate([135, 95, 35]) socket_post();
    
    // 6. Front Panel Connectors
    // Flat central face (Normal angle = -90)
    place_connector(-30, -95, 20, -90) flanged_bushing();
    place_connector(-10, -95, 20, -90) flanged_bushing();
    place_connector( 10, -95, 20, -90) flanged_bushing();
    place_connector( 30, -95, 20, -90) flanged_bushing();
    
    // Left angled face (Normal angle = -54.5)
    place_connector(-79.4, -116.0, 20, -54.5) flanged_bushing();
    place_connector(-60.7, -102.6, 20, -54.5) ball_stud();
    
    // Right angled face (Normal angle = -125.5)
    place_connector(60.6, -102.5, 20, -125.5) ball_stud();
    place_connector(79.3, -115.9, 20, -125.5) flanged_bushing();
}