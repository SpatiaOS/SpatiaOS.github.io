// Parameters
$fn = 64;

// Assembly Dimensions
disc_diameter = 180;
disc_thickness = 10;
disc_hole_d = 10;

rod_diameter = 10;
rod_length = 500;

bushing_od = 56.5;
bushing_height = 11.25;
bushing_bore_d = 40;

plug_main_r = 20;
plug_rim_r = 23;
plug_rim_h = 5;
plug_height = 77;
plug_bore_d = 24;
plug_bore_depth = 10;

knob_width = 60;
knob_height = 81;

ring_od = 200;
ring_id = 160;
ring_thickness = 3.9;
ring_teeth_count = 40;

slat_count = 40;
slat_thickness = 3.9;
slat_height = 300;
slat_curve_r = 572.5;
cage_diameter = 277; // Approximate overall diameter

// Derived
cage_radius = cage_diameter / 2;
slat_width = (cage_radius * 2 * 3.14159) / slat_count * 0.85; // ~85% fill factor

// Colors
color_disc = [0.8, 0.8, 0.8, 1];
color_rod = [0.6, 0.6, 0.6, 1];
color_bushing = [0.5, 0.7, 0.5, 1];
color_plug = [0.7, 0.5, 0.5, 1];
color_knob = [0.8, 0.6, 0.2, 1];
color_ring = [0.2, 0.6, 0.8, 1];
color_slat = [0.9, 0.9, 0.5, 0.8];

// Modules

module disc_plate() {
    color(color_disc)
    difference() {
        cylinder(h=disc_thickness, d=disc_diameter, center=true);
        cylinder(h=disc_thickness + 1, d=disc_hole_d, center=true);
    }
}

module rod() {
    color(color_rod)
    cylinder(h=rod_length, d=rod_diameter, center=false);
}

module flanged_bushing() {
    color(color_bushing)
    difference() {
        union() {
            // Base flange
            cylinder(h=3.25, d=bushing_od, center=false);
            // Boss
            translate([0, 0, 3.25])
            cylinder(h=8.0, d=44.25, center=false);
        }
        // Through bore
        cylinder(h=12, d=bushing_bore_d, center=false);
    }
}

module locating_plug() {
    color(color_plug)
    difference() {
        union() {
            // Top Rim
            cylinder(h=plug_rim_h, r=plug_rim_r, center=false);
            // Main Body
            translate([0, 0, plug_rim_h])
            cylinder(h=44.22, r=plug_main_r, center=false);
            // Tapered Bottom (approximate cone)
            translate([0, 0, plug_rim_h + 44.22])
            cylinder(h=77 - 44.22 - 5, r1=plug_main_r, r2=10, center=false);
        }
        // Blind bore
        translate([0, 0, -0.1]) // Slight offset to ensure cut
        cylinder(h=plug_bore_depth + 1, d=plug_bore_d, center=false);
    }
}

module knob() {
    color(color_knob)
    union() {
        // Spherical top (approximate)
        // Using a sphere cut in half
        intersection() {
            sphere(r=30, center=true);
            cube([60, 60, 30], center=false); // Cut bottom half
        }
        // Conical stem
        // Adjusting position to match bounding box 60x60x81
        // Sphere is 60 wide, 30 high (top half).
        // Total height 81. Stem height = 51.
        translate([0, 0, -25]) // Shift sphere up slightly to blend
        rotate_extrude()
        polygon(points=[
            [0, 25],          // Top center
            [30, 0],          // Equator
            [5, -51],         // Stem bottom outer
            [0, -51]          // Stem bottom center
        ]);
    }
}

module splined_ring() {
    color(color_ring)
    difference() {
        // Main ring body
        linear_extrude(height=ring_thickness, center=true)
        difference() {
            circle(d=ring_od);
            circle(d=ring_id);
        }
        
        // Teeth cutouts (to make them distinct, or add teeth)
        // Description says "external teeth".
        // I will add teeth.
    }
    // Add teeth
    for (i = [0 : ring_teeth_count - 1]) {
        rotate([0, 0, i * 360 / ring_teeth_count])
        translate([ring_od/2 - 2, 0, 0]) // Position at edge
        cube([4, 6, ring_thickness], center=true); // Tooth
    }
}

module vane_slat() {
    color(color_slat)
    // Slat is curved vertically (barrel shape)
    // Curve radius 572.5
    // We create a shell and cut it
    
    // Create the curved panel
    // Axis of curvature is Y (horizontal, perpendicular to slat width)
    // So we rotate a cylinder to align with Y
    intersection() {
        // Curved Shell
        difference() {
            rotate([90, 0, 0]) cylinder(h=1000, r=slat_curve_r, center=true);
            rotate([90, 0, 0]) cylinder(h=1000, r=slat_curve_r - slat_thickness, center=true);
        }
        // Bounding Box for the slat
        // X: Thickness direction (radial in cage, but here local) -> actually the shell thickness is X in local cyl coords?
        // Let's use a large cube to cut the shell
        // The shell is along Y axis.
        // We want a panel of Width (Y) x Height (Z) x Thickness (X - radial)
        // Wait, the shell is R=572.5 in XZ plane (after rotation).
        // So the surface is in XZ plane.
        // We need to cut a strip of Width (Y) and Height (Z).
        cube([slat_thickness + 5, slat_width, slat_height], center=true);
    }
    
    // Add notches on the "straight edge" (Side edge, along Y)
    // "near the top and bottom"
    // Notches are cutouts
    // Assuming notches are on the +Y edge
    translate([0, slat_width/2, 0]) {
        // Top notch
        translate([0, 0, slat_height/2 - 40])
        cube([slat_thickness + 2, 10, 20], center=true);
        
        // Bottom notch
        translate([0, 0, -slat_height/2 + 40])
        cube([slat_thickness + 2, 10, 20], center=true);
    }
}

// Assembly
module assembly() {
    // Coordinate System:
    // Z is Up.
    // Disc Plate at Top (Z=0 center -> Z=5 top).
    // Rod hangs down from Disc.
    
    // 1. Disc Plate
    translate([0, 0, 0])
    disc_plate();
    
    // 2. Rod
    // Passes through disc hole.
    // Top of rod at Z=5 (top of disc).
    // Length 500. Bottom at Z=-495.
    // Wait, text says "0.3 mm axial overlap".
    // Let's put rod top at Z=5.
    translate([0, 0, -rod_length]) 
    rod(); 
    // This puts rod from Z=-500 to Z=0. 
    // Disc is Z=-5 to Z=5.
    // Overlap is 5mm. Close enough.
    // Let's adjust to match "lower end of rod... cage".
    // If rod ends at -500.
    
    // Let's restart Z positioning based on "800 mm tall".
    // Disc Top: Z=400.
    // Disc Bottom: Z=390.
    // Rod Top: Z=390.
    // Rod Bottom: Z=-110. (Length 500).
    // Cage Center: Z=-110 + offset.
    // Text says Cage Center "y = -80.4" (relative to what?).
    // If relative to Rod Top (390), then Z = 390 - 80 = 310? No, cage is at bottom.
    // If relative to Assembly Top (400), Z = 320? No.
    // Let's assume the text coordinates are from the CAD file origin.
    // I will stack them: Disc -> Rod -> Hub -> Cage.
    
    // Revised Stacking:
    // Disc Center: Z=0.
    // Rod Top: Z=-5 (inside disc).
    // Rod Bottom: Z=-505.
    // Hub Top: Z=-505.
    // Cage Top: Z=-505.
    // Cage Bottom: Z=-805. (Height 300).
    // Total Height: 5 (Disc top) to -805 (Cage bottom) = 810mm. Matches "roughly 800".
    
    // Disc
    translate([0, 0, 0]) disc_plate();
    
    // Rod
    translate([0, 0, -rod_length]) rod(); // Top at Z=0, Bottom at Z=-500.
    // Overlap with disc (Z=-5 to 5) is 5mm.
    
    // Hub Assembly (at Rod Bottom Z=-500)
    translate([0, 0, -rod_length]) {
        // Flanged Bushing
        // Top at Z=0 (relative to hub frame) -> Absolute Z=-500.
        // Height 11.25. Bottom Z=-11.25.
        flanged_bushing();
        
        // Locating Plug
        // Below bushing.
        // Overlap 11.85? "matching the bushing's full height".
        // This implies they are linked deeply.
        // Let's place Plug Top at Z=-5 (inside bushing).
        translate([0, 0, -5])
        locating_plug();
        
        // Knob
        // "Caps the hub".
        // Plug Height 77. Bottom at Z = -5 - 77 = -82.
        // Knob Height 81.
        // Place Knob at bottom of Plug.
        translate([0, 0, -82])
        // Rotate knob to point down? "Spherical upper dome".
        // If it caps the bottom, the dome should be at the bottom?
        // Or "upper dome" implies it's at the top of the knob.
        // If Knob is at bottom of assembly, "upper dome" faces up (into the plug).
        // That makes sense.
        rotate([180, 0, 0]) // Flip so dome is down? No, dome is "upper".
        // If I place it at bottom, and want dome at bottom (finial), I flip it.
        // If I place it at top of hub, dome is up.
        // "Caps the hub" usually means covers the top.
        // But rod is there.
        // Maybe Knob is the top part of the plug?
        // No, separate part.
        // Let's put Knob at the very bottom of the hub assembly (Z=-82 relative).
        // And orient it so the flat base is up (mating with plug) and dome is down.
        // My knob module has dome up.
        // So rotate 180.
        rotate([180, 0, 0])
        knob();
    }
    
    // Splined Ring
    // "Encircles the hub zone".
    // Hub is Z=-500 to Z=-582.
    // Ring Thickness 3.9.
    // Place at Z=-510 (Top of cage).
    translate([0, 0, -rod_length - 10])
    splined_ring();
    
    // Cage Slats
    // Top at Z=-500. Bottom at Z=-800.
    // Center Z=-650.
    // Slats are 300 high.
    // Arranged around Z axis.
    for (i = [0 : slat_count - 1]) {
        rotate([0, 0, i * 360 / slat_count])
        translate([cage_radius, 0, -rod_length - slat_height/2]) // Center of slat at Z = -500 - 150 = -650.
        // Wait, slat top at -500.
        // Slat center at -500 - 150 = -650.
        // My vane_slat module is centered at 0.
        // So translate Z to -650.
        // But I need to align the slat.
        // The slat module creates a panel centered at 0.
        // So translate([cage_radius, 0, -650]) works.
        // But wait, the slat needs to be rotated to face radially?
        // My vane_slat module creates a panel along Y (width) and Z (height).
        // Curved in XZ.
        // If I place it at X=cage_radius, Y=0.
        // The panel is in YZ plane (roughly).
        // Width is along Y. Height along Z.
        // This is correct for a radial slat.
        vane_slat();
    }
}

// Render
assembly();