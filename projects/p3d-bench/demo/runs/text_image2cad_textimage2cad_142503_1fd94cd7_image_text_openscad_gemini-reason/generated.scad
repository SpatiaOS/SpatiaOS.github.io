// ==============================================================================
// Parametric Trophy Assembly
// ==============================================================================

// Global Resolution
$fn = 60;

// --- Dimensions ---
// Pedestal
pedestal_height = 152;
pedestal_base_r = 30;
pedestal_neck_r = 16;
pedestal_top_r = 22;

// Crown
crown_height = 20;
crown_outer_r = 24;
crown_inner_r = 18.44;
crown_teeth = 10;

// Bearing Balls
sphere_r = 3.0;

// Keys (Prismatic Bars)
key_thickness = 7.5;
key_top_len = 120;
key_bottom_len = 101;
key_top_z = 145;
key_bottom_z = 130;

// ==============================================================================
// Modules
// ==============================================================================

// 1. Pedestal Body
// A complex revolved solid with flared base, tapered body, shoulder, and neck.
module pedestal_body() {
    rotate_extrude($fn=100) {
        polygon([
            [0, 0],
            [pedestal_base_r, 0],
            [pedestal_base_r, 5],
            [25, 15],
            [22, 25],
            [28, 35],
            [28, 40],
            [22, 50],
            [26, 110], // Shoulder bulge
            [30, 120], // Upper shoulder
            [pedestal_neck_r, 135], // Concave neck
            [pedestal_neck_r, 145],
            [pedestal_top_r, 150],
            [pedestal_top_r, pedestal_height],
            [0, pedestal_height]
        ]);
    }
    
    // Embossed Text
    translate([0, -23, 85])
    rotate([90, 0, 0])
    linear_extrude(height=2, center=true) {
        text("Premier", size=5, halign="center", valign="center", font="Arial:style=Bold");
    }
    
    translate([0, -24, 75])
    rotate([90, 0, 0])
    linear_extrude(height=2, center=true) {
        text("League", size=5, halign="center", valign="center", font="Arial:style=Bold");
    }
}

// 2. Serrated Crown Ring
// Sits atop the pedestal, features a zig-zag profile with 10 teeth.
module crown() {
    translate([0, 0, pedestal_height]) {
        difference() {
            cylinder(h=crown_height, r=crown_outer_r, $fn=60);
            translate([0, 0, -1]) cylinder(h=crown_height + 2, r=crown_inner_r, $fn=60);
            
            // Cut out V-notches using rotated square cylinders (diamonds)
            for(i=[0 : crown_teeth-1]) {
                rotate([0, 0, i * (360/crown_teeth) + (180/crown_teeth)])
                translate([0, crown_outer_r, crown_height])
                rotate([0, 90, 0])
                cylinder(h=60, r=10, $fn=4, center=true);
            }
        }
    }
}

// 3. Bearing Balls
// Arrayed around the crown's tips.
module bearing_balls() {
    tooth_center_r = (crown_outer_r + crown_inner_r) / 2;
    for(i=[0 : crown_teeth-1]) {
        rotate([0, 0, i * (360/crown_teeth)])
        translate([0, tooth_center_r, pedestal_height + crown_height])
        sphere(r=sphere_r, $fn=30);
    }
}

// 4. Handles (Curved Arms)
// S-curved profiles that frame the trophy.
module handle_arm() {
    rotate([90, 0, 0])
    linear_extrude(height=key_thickness, center=true) {
        polygon([
            [28, 0],
            [35, 0],
            [52, 60],
            [60, 110],
            [60, key_top_z - key_thickness/2], // Meets bottom of top key
            [52.5, key_top_z - key_thickness/2],
            [50.5, key_bottom_z], // Inner bulge to meet bottom key
            [52.5, 110],
            [44.5, 60],
            [20, 5]
        ]);
    }
}

module handles() {
    handle_arm();
    mirror([1, 0, 0]) handle_arm();
}

// 5. Parallel Keys (Prismatic Bars)
// Bridge the handles and the body.
module parallel_key(length) {
    // Extruding a circle along Z creates a bar with a square YZ cross-section 
    // and rounded ends in the XY plane.
    hull() {
        translate([-length/2 + key_thickness/2, 0, 0]) 
            cylinder(d=key_thickness, h=key_thickness, center=true, $fn=30);
        translate([length/2 - key_thickness/2, 0, 0]) 
            cylinder(d=key_thickness, h=key_thickness, center=true, $fn=30);
    }
}

module keys() {
    translate([0, 0, key_top_z]) parallel_key(key_top_len);
    translate([0, 0, key_bottom_z]) parallel_key(key_bottom_len);
}

// 6. Lion Clips
// Profile-cut clips with C-shaped hook features engaging the keys.
module lion_clip() {
    rotate([90, 0, 0])
    linear_extrude(height=2, center=true) {
        difference() {
            square([24, 27], center=true);
            
            // Top hook (engages top key)
            translate([5, 7.5]) circle(d=8, $fn=30);
            translate([10, 7.5]) square([15, 8], center=true);
            
            // Bottom hook (engages bottom key)
            translate([5, -7.5]) circle(d=8, $fn=30);
            translate([10, -7.5]) square([15, 8], center=true);
            
            // Stylized back cutout
            translate([-15, 0]) circle(d=16, $fn=30);
        }
    }
}

module clips() {
    // Positioned to perfectly hook onto the keys at Z=130 and Z=145
    translate([38, 0, (key_top_z + key_bottom_z)/2]) lion_clip();
    mirror([1, 0, 0]) translate([38, 0, (key_top_z + key_bottom_z)/2]) lion_clip();
}

// 7. Ribbons (Curved Support Strips)
// S-curved freeform strips adding decorative contour.
module ribbon() {
    rotate([90, 0, 0])
    linear_extrude(height=1, center=true) {
        polygon([
            [22, 10],
            [24, 10],
            [32, 50],
            [40, 90],
            [32, 130],
            [26, 145],
            [24, 145],
            [30, 130],
            [38, 90],
            [30, 50]
        ]);
    }
}

module ribbons() {
    // Arrayed slightly in front and behind the main handle plane
    translate([0, 15, 0]) ribbon();
    translate([0, -15, 0]) ribbon();
    mirror([1, 0, 0]) {
        translate([0, 15, 0]) ribbon();
        translate([0, -15, 0]) ribbon();
    }
}

// ==============================================================================
// Main Assembly
// ==============================================================================

union() {
    pedestal_body();
    crown();
    bearing_balls();
    handles();
    keys();
    clips();
    ribbons();
}