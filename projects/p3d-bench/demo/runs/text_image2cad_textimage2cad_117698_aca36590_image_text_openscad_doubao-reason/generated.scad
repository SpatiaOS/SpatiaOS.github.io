// Global Configuration
$fn = 50;

// Core Ship Dimensions
ship_length = 100;       // [mm] Overall length per specification
ship_width = ship_length / 5; // Aspect ratio 5 as given
hull_height = 10;        // Total hull height
deck_height = hull_height / 2; // Flat deck Z position

// Turret Specifications
turret_radius = 5;       // Radius per spec
turret_height = 4;       // Height of turret base
gun_radius = 0.5;        // Diameter 1mm per spec
gun_length = 10;         // Barrel length per spec

// Superstructure Specifications
chimney_radius = 2.5;    // Radius per spec
chimney_height = 12;     // Chimney height

// Spacer Specifications
spacer_width = 6.2;
spacer_depth = 9.7;
spacer_height = 2.1;
end_cap_angle = 10;      // Tilt angle of spacer end caps


// ------------------------------
// Module Definitions
// ------------------------------

// Main ship hull with tapered lower profile and flat deck
module ship_hull() {
    difference() {
        // Tapered hull body created via convex hull of 3 cross sections
        hull() {
            translate([-ship_length*0.45, 0, 0]) cylinder(h=hull_height, r=ship_width*0.25, center=true);
            translate([0, 0, 0]) cylinder(h=hull_height, r=ship_width*0.5, center=true);
            translate([ship_length*0.4, 0, 0]) cylinder(h=hull_height, r=ship_width*0.3, center=true);
        }
        // Cut flat deck surface
        translate([0, 0, hull_height]) cube([ship_length + 10, ship_width + 10, 10], center=true);
    }
}

// Turret base with 3 gun barrels
module turret(x_pos) {
    // Turret boss
    translate([x_pos, 0, deck_height])
        cylinder(h=turret_height, r=turret_radius);
    
    // Triple gun barrels (3 per turret, total 9 across 3 turrets)
    for (y_offset = [-1.5, 0, 1.5]) {
        translate([x_pos - turret_radius, y_offset, deck_height + turret_height/2])
            rotate([0, -10, 0])
                cylinder(h=gun_length, r=gun_radius);
    }
}

// Stepped superstructure with chimney
module superstructure() {
    translate([-10, -7, deck_height]) {
        // 3 stepped rectangular levels
        cube([22, 14, 3]);
        translate([1, 1, 3]) cube([20, 12, 3]);
        translate([2, 2, 6]) cube([18, 10, 3]);
        
        // Chimney protrusion
        translate([11, 7, 9]) cylinder(h=chimney_height, r=chimney_radius);
    }
}

// Partial cylinder spacer with angled end caps
module spacer_part() {
    translate([5, ship_width/2 - 2, deck_height + 1])
    rotate([0, 0, 90])
    difference() {
        // 180 degree partial cylinder (half round)
        rotate_extrude(angle=180)
            translate([spacer_height, 0]) square([spacer_width/2, spacer_depth], center=true);
        
        // Cut angled end caps
        rotate([end_cap_angle, 0, 0])
            translate([0, 0, -spacer_depth/2 - 1]) cube([spacer_width*2, spacer_width*2, 2], center=true);
        rotate([-end_cap_angle, 0, 0])
            translate([0, 0, spacer_depth/2 + 1]) cube([spacer_width*2, spacer_width*2, 2], center=true);
    }
}


// ------------------------------
// Final Assembly
// ------------------------------

union() {
    ship_hull();
    superstructure();
    spacer_part();
    
    // Three turret positions: front, middle, aft
    turret(-ship_length*0.3);
    turret(-ship_length*0.1);
    turret(ship_length*0.25);
}