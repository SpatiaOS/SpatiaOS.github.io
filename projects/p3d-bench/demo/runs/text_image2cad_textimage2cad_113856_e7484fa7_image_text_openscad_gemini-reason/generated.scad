/*
  Fusion360 Mechanical Assembly Reconstruction
  A vertical hanging lamp structure consisting of a top ceiling disc, a long rod, 
  a central hub (knob, plug, bushing), and an outer barrel-shaped cage of slats.
*/

// Resolution for curved surfaces
$fn = 100;

// Small epsilon for ensuring manifold geometry in boolean operations
eps = 0.05;

// --- Parameters ---

// Rod dimensions
rod_length = 500;
rod_dia = 10;

// Disc plate dimensions
disc_dia = 180;
disc_thick = 10;

// Knob dimensions
knob_height = 81;
knob_width = 60;
knob_dome_r = 30;

// Cage slat dimensions
slat_count = 40;
slat_length = 300;
slat_width = 50;
slat_thick = 3.9;
slat_arc_r = 572.5;

// Global Z-positions (assuming rod bottom at Z=0)
z_knob_top = 0;
z_knob_base = -knob_height;
z_plug_top = z_knob_base;
z_splined_ring = -120;
z_top_spider = 20;
slat_center_z = -80.4;
z_disc = rod_length - disc_thick; // Rod passes through the disc


// --- Module Definitions ---

module disc_plate() {
    // Topmost anchor plate
    translate([0, 0, z_disc])
    difference() {
        cylinder(h=disc_thick, d=disc_dia);
        // Central through-hole for the rod
        translate([0, 0, -eps])
        cylinder(h=disc_thick + 2*eps, d=rod_dia);
    }
}

module rod() {
    // Main hanging rod
    // Extends slightly into the knob (Z=-1) to ensure a manifold union
    translate([0, 0, -1])
    cylinder(h=rod_length + 1, d=rod_dia);
}

module knob() {
    // Central decorative/structural cap at the top of the hub
    translate([0, 0, z_knob_top])
    union() {
        // Spherical upper dome
        translate([0, 0, -knob_dome_r])
        sphere(r=knob_dome_r);
        
        // Conical stem tapering down to the base
        translate([0, 0, -knob_height])
        cylinder(h=knob_height - knob_dome_r, r1=15, r2=knob_dome_r);
    }
}

module plug() {
    // Locating plug / central socket body
    translate([0, 0, z_plug_top])
    difference() {
        union() {
            // Top rim
            translate([0, 0, -5]) 
            cylinder(h=5, r=23);
            
            // Main cylindrical body
            translate([0, 0, -49.22]) 
            cylinder(h=44.22, r=20);
            
            // Lower conical taper
            translate([0, 0, -77.22]) 
            cylinder(h=28, r1=10, r2=20);
        }
        // Top blind bore
        translate([0, 0, -10]) 
        cylinder(h=10 + eps, r=12);
    }
}

module flanged_bushing() {
    // Flanged collar that slides over the plug's main body
    // Sits directly under the plug's top rim
    translate([0, 0, z_plug_top - 5])
    difference() {
        union() {
            // Base flange
            translate([0, 0, -3.25]) 
            cylinder(h=3.25, d=56.5);
            
            // Narrower cylindrical boss
            translate([0, 0, -11.25]) 
            cylinder(h=8, d=44.25);
        }
        // Central through-bore (slightly undersized in code to overlap plug for union)
        translate([0, 0, -12]) 
        cylinder(h=13, d=40 - eps);
    }
}

module splined_ring() {
    // Lower internal ring that spaces and holds the slats via notches
    thickness = 3.9;
    inner_r = 80;
    base_r = 95;
    outer_r = 100;
    teeth_count = 40;
    tooth_width = 4;
    
    translate([0, 0, z_splined_ring])
    union() {
        // Main annular body
        difference() {
            cylinder(h=thickness, r=base_r, center=true);
            cylinder(h=thickness + 2*eps, r=inner_r, center=true);
        }
        // External spline teeth
        for (i = [0 : teeth_count - 1]) {
            rotate([0, 0, i * 360 / teeth_count])
            translate([base_r - eps, -tooth_width/2, -thickness/2])
            cube([outer_r - base_r + eps, tooth_width, thickness]);
        }
    }
}

module slat_unit() {
    // A single curved vane slat
    // Modeled by intersecting a large hollow cylinder with a bounding box
    // The slat bows outwards, forming the barrel shape of the cage
    intersection() {
        // Shift so the inner face touches X=0 at the local origin
        translate([-(slat_arc_r - slat_thick), 0, 0])
        rotate([90, 0, 0])
        difference() {
            cylinder(r=slat_arc_r, h=slat_width + 2, center=true, $fn=200);
            cylinder(r=slat_arc_r - slat_thick, h=slat_width + 4, center=true, $fn=200);
        }
        // Bounding box to trim to exact width and length
        cube([100, slat_width, slat_length], center=true);
    }
}

module cage() {
    // Circular array of 40 slats
    for (i = [0 : slat_count - 1]) {
        rotate([0, 0, i * 360 / slat_count])
        // Translate outwards to R=100 and to the specified Z-center
        translate([100, 0, slat_center_z])
        slat_unit();
    }
}

module top_connector() {
    // Missing part reconstructed as a top spider connector
    // Connects the central rod to the upper part of the slat cage
    translate([0, 0, z_top_spider])
    union() {
        // Outer ring that engages the slats
        difference() {
            cylinder(h=4, r=93, center=true);
            cylinder(h=5, r=80, center=true);
        }
        // Central hub
        difference() {
            cylinder(h=4, r=15, center=true);
            cylinder(h=5, d=rod_dia - eps, center=true); // hole for rod overlap
        }
        // 4 connecting spokes
        for (i = [0:3]) {
            rotate([0, 0, i * 90])
            translate([47.5, 0, 0])
            cube([65, 8, 4], center=true);
        }
    }
}


// --- Main Assembly ---

union() {
    color("DarkGray") disc_plate();
    color("Silver") rod();
    color("DimGray") knob();
    color("Gray") plug();
    color("Silver") flanged_bushing();
    color("DarkSlateGray") splined_ring();
    color("DarkSlateGray") top_connector();
    color("BurlyWood") cage();
    
    // Tiny manifold bridge between knob base and plug rim
    translate([0, 0, z_knob_base - eps])
    cylinder(h=2*eps, r=20);
}