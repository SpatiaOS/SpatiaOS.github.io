// ---------------------------------------------------------
// Parametric Pebble-Shaped Mechanical Assembly
// Reproduces a 3-part nesting enclosure (Base, Plate, Housing)
// ---------------------------------------------------------

$fn = 100; // Global resolution for smooth curves

// ================= DIMENSIONAL PARAMETERS =================

// --- Base Cover (Part 4607dfae) ---
// Largest body, pebble-shaped dome with flat base
base_length  = 304;   // Overall length (X)
base_width   = 159;   // Overall width (Y)
base_height  = 72;    // Overall height (Z)
boss_radius  = 6.0;   // Locating boss radius
boss_height  = 8.0;   // Locating boss height

// --- Cover Plate (Part 468e7438) ---
// Thin oval disc at the seam
plate_length     = 241.82; // Disc length
plate_width      = 126.86; // Disc width
plate_thickness  = 6.0;    // Disc thickness

// --- Housing Cover (Part 461c9fae) ---
// Smaller upper dome with control panel
house_length = 227.4; // Housing length
house_width  = 119.7; // Housing width
house_height = 50.0;  // Housing height


// ================= REUSABLE MODULES =================

/**
 * Generates a smooth, organic pebble/dome shape with a flat base.
 * Created by scaling a sphere and intersecting it with a cutting plane.
 * @param l Length (X-axis)
 * @param w Width (Y-axis)
 * @param h Height (Z-axis)
 */
module organic_dome(l, w, h) {
    scale([l/h, w/h, 1])
    intersection() {
        sphere(r = h/2);
        // Flatten the bottom perfectly
        translate([0, 0, -h/2 + 0.01]) 
            cube([h+2, h+2, h], center=true);
    }
}


// ================= COMPONENT DEFINITIONS =================

/**
 * Part 1: Base Cover
 * Stationary bottom element with branding and a central locating boss.
 */
module base_cover() {
    difference() {
        union() {
            // Main pebble body
            organic_dome(base_length, base_width, base_height);
            
            // Central cylindrical boss on the top deck
            translate([0, 0, base_height])
                cylinder(r = boss_radius, h = boss_height);
        }
        // No subtractive holes defined in requirements
    }
    
    // Embossed surface relief (Branding text)
    // Positioned on the front-right curved flank
    translate([65, -15, 42]) 
    rotate([65, 0, 20])
    linear_extrude(height = 2.5)
        text("harman/kardon", size = 11, valign = "center", halign = "center", font = "Liberation Sans:style=Bold");
}

/**
 * Part 2: Cover Plate
 * Featureless thin oval disc acting as a seam trim or gasket.
 */
module cover_plate() {
    // Positioned to sit flush/inset at the top rim of the base cover
    z_position = base_height - plate_thickness + 1.0;
    
    translate([0, 0, z_position])
    linear_extrude(height = plate_thickness)
        scale([plate_length / plate_width, 1, 1])
            circle(d = plate_width);
}

/**
 * Part 3: Housing Cover
 * Upper dome featuring a recessed control panel with dots and symbols.
 */
module housing_cover() {
    // Nesting height: sits on top of the cover plate seam
    z_offset = base_height - plate_thickness + 1.0;
    
    difference() {
        // Main housing dome body
        translate([0, 0, z_offset])
            organic_dome(house_length, house_width, house_height);
            
        // Recessed Oval Panel (Cut into the top surface)
        // Uses a scaled sphere to create a smooth bowl-shaped depression
        translate([0, 0, z_offset + house_height - 14])
            scale([1.5, 1.2, 0.5]) 
                sphere(d = 75);
    }
    
    // Control Interface Details (Inside the recess)
    // Raised features representing buttons and tactile markers
    translate([0, 0, z_offset + house_height - 19]) {
        
        // Five circular dot indicators (Status LEDs/Tactile points)
        dot_positions = [[-20, 14], [-10, 19], [0, 21], [10, 19], [20, 14]];
        for (pos = dot_positions) {
            translate(pos) cylinder(h = 2.5, d = 4.5);
        }
        
        // Embossed Relief Symbols (Cross-pattern arrangement)
        // Top: Plus (+)
        translate([0, 28]) {
            cube([12, 3, 2.5], center=true);
            cube([3, 12, 2.5], center=true);
        }
        // Bottom: Minus (-)
        translate([0, -28]) {
            cube([12, 3, 2.5], center=true);
        }
        // Left: Back/Menu
        translate([-28, 0]) {
            cube([10, 3, 2.5], center=true);
            translate([4, 0, 0]) cube([3, 8, 2.5], center=true); // Arrow head hint
        }
        // Right: Forward/Option
        translate([28, 0]) {
            cube([10, 3, 2.5], center=true);
            translate([-4, 0, 0]) cube([3, 8, 2.5], center=true); // Arrow head hint
        }
    }
}


// ================= FINAL ASSEMBLY =================

// Combine all grounded parts into a single unified model
union() {
    color("silver")           base_cover();
    color("dimgray")          cover_plate();
    color("whitesmoke")       housing_cover();
}