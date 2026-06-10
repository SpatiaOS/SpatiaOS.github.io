// ==========================================
// Parametric Variables
// ==========================================

// Barrel Body
barrel_length = 260;
barrel_r_mid = 92;
barrel_r_end = 74;
barrel_thickness = 8;
stave_count = 18;

// Hoop Rings
ring_large_od = 188.5;
ring_large_w = 4;
ring_large_h = 21.9;
ring_large_y = 45;

ring_small_od = 163;
ring_small_w = 4;
ring_small_h = 21.0;
ring_small_y = 105;

// Barrel Caps
cap_d = 141.2;
cap_thickness = 12;
cap_y = 122;

// Bung Fitting
bung_z = 90;

// Tap Sub-assembly
tap_y = -122;
tap_z = -25;

// Stand / Cradle
stand_y = 70;
stand_z_base = -105;

// Resolution
$fn = 100;

// Colors
color_wood = "#C19A6B";
color_metal = "#404040";
color_brass = "#DAA520";

// ==========================================
// Modules
// ==========================================

// Main barrel body formed by 18 curved staves
module barrel_body() {
    rotate([-90, 0, 0])
    rotate_extrude($fn=stave_count) {
        polygon([
            // Outer profile (parabolic curve)
            for(y=[-barrel_length/2 : 5 : barrel_length/2])
                [ barrel_r_mid - (barrel_r_mid - barrel_r_end)*pow(y/(barrel_length/2), 2), y ],
            // Inner profile (hollow interior)
            for(y=[barrel_length/2 : -5 : -barrel_length/2])
                [ barrel_r_mid - barrel_thickness - (barrel_r_mid - barrel_r_end)*pow(y/(barrel_length/2), 2), y ]
        ]);
    }
}

// Sculpted hoop rings
module hoop_ring(od, w, h) {
    rotate([-90, 0, 0])
    rotate_extrude($fn=100) {
        translate([od/2 - w/2, 0])
        scale([w/h, 1])
        circle(d=h, $fn=60);
    }
}

// End caps (decorated front, plain rear)
module barrel_cap(is_front=false) {
    if(is_front) {
        rotate([90, 0, 0])
        union() {
            cylinder(h=cap_thickness, d=cap_d, center=true, $fn=100);
            
            // Embossed decorative text
            translate([0, 0, cap_thickness/2 - 0.1])
            linear_extrude(2)
            text("Debowa", size=22, font="Arial:style=Italic", halign="center", valign="center", $fn=30);
            
            // Raised rim detail
            translate([0, 0, cap_thickness/2])
            difference() {
                cylinder(h=2, d=cap_d-4, $fn=100);
                translate([0, 0, -1]) cylinder(h=4, d=cap_d-12, $fn=100);
            }
        }
    } else {
        rotate([-90, 0, 0])
        cylinder(h=cap_thickness, d=cap_d, center=true, $fn=100);
    }
}

// Top bung fitting and plug
module bung() {
    translate([0, 0, bung_z]) {
        // Flanged collar
        cylinder(h=5, d=40, $fn=60);
        translate([0, 0, 5]) cylinder(h=10, d=27.5, $fn=60);
        // Solid plug
        translate([0, 0, 15]) cylinder(h=14, d=32.5, $fn=60);
    }
}

// Front tap / spigot sub-assembly
module tap() {
    // Spacer sleeve
    translate([0, tap_y, tap_z])
    rotate([90, 0, 0])
    difference() {
        cylinder(h=40, d=8, $fn=30);
        translate([0, 0, -1]) cylinder(h=42, d=6, $fn=30);
    }
    
    // Spigot body
    translate([0, tap_y - 40, tap_z]) {
        // Main bulb
        sphere(d=30.5, $fn=60);
        
        // Downward spout
        translate([0, 0, -15]) cylinder(h=15, d=16, $fn=30);
        translate([0, 0, -30]) sphere(d=18, $fn=40);
        
        // Rotary ball-lever handle
        translate([0, 0, 15]) {
            cylinder(h=5, d=20, $fn=30);
            translate([0, 0, 10]) sphere(d=16, $fn=40);
            // Actuating lever pointing forward (-Y)
            translate([0, 0, 10]) rotate([90, 0, 0]) cylinder(h=25, d=5, $fn=20);
        }
    }
}

// Base cradle stand
module stand() {
    // Longitudinal base feet
    for(x = [-50, 50]) {
        translate([x, 0, stand_z_base])
        cube([25, 220, 25], center=true);
    }
    
    // Center trapezoidal key bar
    translate([0, 0, stand_z_base])
    rotate([90, 0, 90])
    linear_extrude(189, center=true)
    polygon([ [-12.5, -12.5], [12.5, -12.5], [8, 12.5], [-8, 12.5] ]);
    
    // Transverse saddle supports with barrel cutouts
    for(y = [-stand_y, stand_y]) {
        translate([0, y, stand_z_base + 35])
        difference() {
            // Main block with raised rounded ends
            union() {
                cube([170, 25, 45], center=true);
                // Left raised end
                translate([-72.5, 0, 10]) cube([25, 25, 45], center=true);
                translate([-72.5, 0, 32.5]) rotate([-90, 0, 0]) cylinder(h=25, r=12.5, center=true, $fn=30);
                // Right raised end
                translate([72.5, 0, 10]) cube([25, 25, 45], center=true);
                translate([72.5, 0, 32.5]) rotate([-90, 0, 0]) cylinder(h=25, r=12.5, center=true, $fn=30);
            }
            // Concave cutout conforming to the barrel radius
            // Inverse translation ensures the cut originates at the absolute assembly origin
            translate([0, -y, -stand_z_base - 35]) 
            rotate([-90, 0, 0]) 
            cylinder(h=300, r=88, center=true, $fn=100);
        }
    }
}

// ==========================================
// Main Assembly Compilation
// ==========================================

union() {
    // 1. Barrel Body
    color(color_wood) barrel_body();
    
    // 2. Annular Hoop Rings
    color(color_metal) {
        translate([0, ring_large_y, 0]) hoop_ring(ring_large_od, ring_large_w, ring_large_h);
        translate([0, -ring_large_y, 0]) hoop_ring(ring_large_od, ring_large_w, ring_large_h);
        translate([0, ring_small_y, 0]) hoop_ring(ring_small_od, ring_small_w, ring_small_h);
        translate([0, -ring_small_y, 0]) hoop_ring(ring_small_od, ring_small_w, ring_small_h);
    }
    
    // 3. End Caps
    color(color_wood) {
        translate([0, -cap_y, 0]) barrel_cap(true);
        translate([0, cap_y, 0]) barrel_cap(false);
    }
    
    // 4. Bung Fitting
    color(color_wood) bung();
    
    // 5. Tap / Spigot
    color(color_brass) tap();
    
    // 6. Cradle Stand
    color(color_wood) stand();
}