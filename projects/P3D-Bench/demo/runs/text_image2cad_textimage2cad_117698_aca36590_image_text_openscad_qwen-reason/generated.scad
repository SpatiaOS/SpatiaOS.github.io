// Warship Figurine Assembly
// Reconstructed from image and structured text description.

$fn = 60; // Smoothness for curves

// --- Parameters ---
// Hull Dimensions
hull_length = 100;
hull_width_deck = 18;
hull_width_keel = 14; // Diameter 14 -> Radius 7
hull_height = 8; // Deck level Z
deck_z = hull_height;

// Turret Dimensions
turret_radius = 5.0;
turret_height = 4.0;

// Funnel Dimensions
funnel_radius = 2.5;
funnel_height = 8.0;

// Gun Barrel (Pin) Dimensions
pin_diameter = 1.0;
pin_length = 10.0;
pin_radius = pin_diameter / 2;

// Spacer Dimensions
// bbox ~2.1 x 6.2 x 9.7
// Radius ~3.5 (to get width 6.2 and height 2.1 curvature)
spacer_radius = 3.5;
spacer_slice_height = 2.1;
spacer_length = 9.7;

// --- Main Assembly ---
assembly();

module assembly() {
    // The "ship_figurine" part (Hull + Turrets + Superstructure + Funnel)
    ship_figurine();
    
    // The 9 Pin parts (Gun Barrels)
    // 3 turrets * 3 guns each
    
    // Bow Turret (Forward) - X = -35
    translate([-35, 0, deck_z + turret_height]) 
        gun_cluster(forward=true);
    
    // Mid Turret (Forward of Superstructure) - X = -12
    translate([-12, 0, deck_z + turret_height]) 
        gun_cluster(forward=true);
        
    // Aft Turret (Stern) - X = 35
    // In the image, barrels point forward (Left, -X).
    translate([35, 0, deck_z + turret_height]) 
        gun_cluster(forward=true);

    // The Spacer part
    // Placed near the superstructure on the deck
    translate([15, 0, deck_z]) 
        spacer_part();
}

// --- Modules ---

module ship_figurine() {
    union() {
        // 1. Hull Body
        hull_body();
        
        // 2. Turret Bases (Cylindrical bosses)
        // Bow
        translate([-35, 0, deck_z]) 
            cylinder(h=turret_height, r=turret_radius, center=false);
        // Mid
        translate([-12, 0, deck_z]) 
            cylinder(h=turret_height, r=turret_radius, center=false);
        // Aft
        translate([35, 0, deck_z]) 
            cylinder(h=turret_height, r=turret_radius, center=false);
            
        // 3. Superstructure (Stepped rectangular)
        translate([5, 0, deck_z]) {
            // Base block
            cube([22, 14, 6], center=false);
            // Mid step
            translate([0, 0, 6]) cube([16, 12, 4], center=false);
            // Top step / Bridge
            translate([0, 0, 10]) cube([10, 10, 3], center=false);
            
            // Side blocks (to add complexity/face count)
            // Aft side block
            translate([8, 0, 6]) cube([6, 14, 4], center=false); 
        }
        
        // 4. Funnel (Chimney)
        // Projects from superstructure
        // Placed on top of the highest step (Z=13 relative to deck)
        translate([5, 0, deck_z + 13]) 
            cylinder(h=funnel_height, r=funnel_radius, center=false);
    }
}

module hull_body() {
    // Creates the main hull shape with flat deck and curved bottom
    hull() {
        // Deck Shape (Flat top at Z=deck_z)
        translate([0, 0, deck_z]) 
            linear_extrude(height=0.1) 
            hull() {
                // Stern (Rounded)
                translate([35, 0, 0]) circle(r=8);
                // Bow (Pointed/Tapered)
                translate([-35, 0, 0]) circle(r=3);
                // Midsection
                square([60, hull_width_deck], center=true);
            }
            
        // Keel Shape (Curved bottom at Z=0)
        translate([0, 0, 0]) 
            hull() {
                // Stern
                translate([30, 0, 0]) sphere(r=7); 
                // Bow
                translate([-30, 0, 0]) sphere(r=3);
                // Midsection
                cylinder(h=0.1, r=7, center=true);
            }
    }
}

module gun_cluster(forward) {
    // 3 gun barrels per turret
    spacing = 1.2;
    
    // Rotate to point forward (-X) or aft (+X)
    // rotate([0, -90, 0]) points along -X (Forward)
    // rotate([0, 90, 0]) points along +X (Aft)
    rotate([0, forward ? -90 : 90, 0]) {
        // Center barrel
        translate([0, 0, 0]) 
            cylinder(h=pin_length, r=pin_radius, center=false);
            
        // Left barrel (Y+)
        translate([0, spacing, 0]) 
            cylinder(h=pin_length, r=pin_radius, center=false);
            
        // Right barrel (Y-)
        translate([0, -spacing, 0]) 
            cylinder(h=pin_length, r=pin_radius, center=false);
    }
}

module spacer_part() {
    // Partial-cylindrical segment
    // Curved top, flat bottom, angled ends.
    // Radius 3.5, Slice height 2.1.
    // Bottom of slice is at Z = 3.5 - 2.1 = 1.4 (relative to cylinder center).
    // We want flat bottom at Z=0.
    // So shift everything down by 1.4.
    
    translate([0, 0, -1.4]) {
        intersection() {
            // 1. Cylinder along X axis
            // Rotate cylinder (along Z) 90 deg around Y -> Along X.
            // Cross section in YZ plane.
            rotate([0, 90, 0]) cylinder(h=12, r=spacer_radius, center=true);
            
            // 2. Cut to top slice (Z > 1.4)
            // We want the part of the cylinder where Z > 1.4.
            // Intersect with a cube covering Z > 1.4.
            translate([0, 0, 1.4]) cube([20, 20, 10], center=false);
            
            // 3. Cut ends (Oblique ~10 deg)
            // Intersect with two rotated cubes to create angled ends.
            // Cube 1: Rotated +10 deg around Y.
            rotate([0, 10, 0]) translate([2, 0, 0]) cube([14, 10, 10], center=true);
            // Cube 2: Rotated -10 deg around Y.
            rotate([0, -10, 0]) translate([-2, 0, 0]) cube([14, 10, 10], center=true);
        }
    }
}