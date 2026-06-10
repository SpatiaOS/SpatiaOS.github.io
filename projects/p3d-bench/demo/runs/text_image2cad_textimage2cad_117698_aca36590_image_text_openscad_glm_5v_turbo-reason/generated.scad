// ============================================
// Warship Figurine Assembly - Parametric Model
// ============================================
// Generates a unified manifold model suitable for STL export
// Based on mechanical assembly reconstruction specifications

// --------------------
// DIMENSIONAL PARAMETERS (all values in mm)
// --------------------

// Hull primary dimensions
hull_length = 100.0;        // Overall length (fore to aft)
hull_beam = 20.0;           // Maximum beam (width) - aspect ratio 5:1
hull_depth = 8.0;           // Depth from deck to keel
deck_height = 3.5;          // Deck height above baseline

// Turret bosses (3 cylindrical bases)
boss_radius = 5.0;          // Base radius
boss_height = 4.0;          // Height above deck

// Superstructure (stepped central island)
island_length = 24.0;       // Longitudinal extent
island_width = 11.0;        // Transverse extent
tier1_height = 3.0;         // Lowest step (base)
tier2_height = 6.0;         // Middle step
tier3_height = 9.5;         // Top step (bridge level)
island_position = -6.0;     // Offset from center (toward stern)

// Funnel / Smokestack
funnel_radius = 2.5;        // Outer radius
funnel_height = 13.0;       // Total height
funnel_offset = [3.0, -1.5]; // Relative to island center [longitudinal, transverse]

// Gun barrel pins (9 instances: 3 turrets × 3 barrels)
pin_radius = 0.5;           // Barrel radius (diameter 1.0)
pin_length = 10.0;          // Barrel length
cluster_spacing = 2.2;      // Lateral spread within cluster
barrel_elevation = 12.0;    // Elevation angle from horizontal (degrees)

// Spacer component (partial-cylinder key/spacer)
spacer_width = 2.1;         // Thickness of flat face
spacer_arc_length = 9.7;    // Length along curved axis
spacer_height = 6.2;        // Vertical dimension
spacer_curve_radius = 3.5;  // Radius of BSpline-like curved face

// Global resolution control
$fn = 60;

// --------------------
// MODULE: HULL BODY
// Smoothly tapered hull with BSpline-like lower contour and flat deck
// Uses hull() operation over spherical cross-sections at frame stations
// --------------------
module hull_body() {
    difference() {
        // Generate hull volume via convex hull of longitudinal sections
        hull() {
            // Station 1: Bow (forward extremity) - sharp entry
            translate([hull_length/2 - 2.5, 0, 0.5])
                scale([1.8, 1.0, 1.3])
                    sphere(r=2.8);
            
            // Station 2: Forward shoulder
            translate([hull_length/3, 0, -0.3])
                scale([1.3, 1.0, 1.05])
                    sphere(r=hull_beam/2 * 0.82);
            
            // Station 3: Midships (maximum beam)
            translate([2, 0, -0.8])
                scale([1.5, 1.0, 0.98])
                    sphere(r=hull_beam/2);
            
            // Station 4: After shoulder
            translate([-hull_length/3 + 2, 0, -0.3])
                scale([1.3, 1.0, 1.05])
                    sphere(r=hull_beam/2 * 0.80);
            
            // Station 5: Stern (aft extremity) - fine run
            translate([-hull_length/2 + 3, 0, 0.5])
                scale([1.8, 1.0, 1.3])
                    sphere(r=3.0);
        }
        
        // Truncate top to create flat deck surface
        translate([0, 0, deck_height + 0.5])
            cube([hull_length + 4, hull_beam + 4, hull_depth * 2], center=true);
    }
}

// --------------------
// MODULE: TURRET BOSS
// Cylindrical base for gun mount
// --------------------
module turret_boss() {
    cylinder(h=boss_height, r=boss_radius, center=false);
}

// --------------------
// MODULE: SUPERSTRUCTURE ISLAND
// Stepped rectangular block assembly (39 planar faces across all tiers)
// --------------------
module superstructure_island() {
    // Tier 1: Base platform (largest footprint)
    translate([0, 0, 0])
        cube([island_length, island_width, tier1_height], center=true);
    
    // Tier 2: Middle section (reduced footprint, offset forward)
    translate([1.5, 0, (tier1_height + tier2_height)/2 - 0.2])
        cube([island_length * 0.72, island_width * 0.78, tier2_height - tier1_height + 0.4], center=true);
    
    // Tier 3: Bridge/top (smallest, further offset)
    translate([3.0, 0, (tier2_height + tier3_height)/2 - 0.3])
        cube([island_length * 0.48, island_width * 0.58, tier3_height - tier2_height + 0.5], center=true);
}

// --------------------
// MODULE: FUNNEL / CHIMNEY
// Simple cylindrical smokestack
// --------------------
module funnel_stack() {
    cylinder(h=funnel_height, r=funnel_radius, center=false);
}

// --------------------
// MODULE: GUN BARREL (PIN)
// Individual solid cylinder representing a gun barrel
// --------------------
module gun_pin() {
    cylinder(h=pin_length, r=pin_radius, center=false);
}

// --------------------
// MODULE: BARREL CLUSTER
// Triple-barrel array (3 pins per turret)
// --------------------
module barrel_triple(elevation = barrel_elevation) {
    // Center barrel
    rotate([elevation, 0, 0])
        gun_pin();
    
    // Port-side barrel (offset left)
    translate([-cluster_spacing/2, 0, 0])
        rotate([elevation, 0, 0])
            gun_pin();
    
    // Starboard-side barrel (offset right)
    translate([cluster_spacing/2, 0, 0])
        rotate([elevation, 0, 0])
            gun_pin();
}

// --------------------
// MODULE: SPACER ELEMENT
// Partial-cylinder segment with one BSpline curved face,
// one longitudinal flat face, and two oblique end caps (~10° tilt)
// Mates to hull via planar contacts
// --------------------
module spacer_part() {
    // Intersection of full cylinder with cutting plane creates partial segment
    // This yields: 1 curved cylindrical face, 1 flat longitudinal face, 2 planar end caps
    intersection() {
        // Full cylinder providing the curved BSpline-like surface
        cylinder(h=spacer_height + 0.2, r=spacer_curve_radius, center=true, $fn=50);
        
        // Cutting box offset to produce desired width (flat face)
        translate([(spacer_curve_radius - spacer_width)/2 + 0.05, 0, 0])
            cube([spacer_width, spacer_curve_radius * 2.2, spacer_height + 0.5], center=true);
    }
}

// --------------------
// MAIN ASSEMBLY
// Combines all components into unified manifold geometry
// Coordinate system: X = longitudinal (fore+/aft-), Y = transverse, Z = vertical
// --------------------
union() {
    
    // === HULL (Part 1 of 11) ===
    color("slategray")
        hull_body();
    
    // === TURRET BOSSES (Parts 2-4 of 11) ===
    // Forward turret (bow position)
    color("dimgray")
        translate([30.0, 0, deck_height])
            turret_boss();
    
    // Midships turret (forward of superstructure)
    color("dimgray")
        translate([8.0, 0, deck_height])
            turret_boss();
    
    // Aft turret (stern position)
    color("dimgray")
        translate([-32.0, 0, deck_height])
            turret_boss();
    
    // === SUPERSTRUCTURE (integrated into hull body visually, but separate logical part) ===
    color("lightgray")
        translate([island_position, 0, deck_height])
            superstructure_island();
    
    // === FUNNEL ===
    color("silver")
        translate([
            island_position + funnel_offset[0], 
            funnel_offset[1], 
            deck_height + tier3_height
        ])
            funnel_stack();
    
    // === GUN BARREL PINS (Parts 5-13 of 11, i.e., 9 pin instances) ===
    // Forward turret barrel cluster (oriented forward/starboard)
    color("gray") {
        translate([30.0, 0, deck_height + boss_height])
            rotate([0, 0, -35])  // Azimuth angle
                barrel_triple(14);
    }
    
    // Midships turret barrel cluster (oriented abeam/port)
    color("gray") {
        translate([8.0, 0, deck_height + boss_height])
            rotate([0, 0, 55])   // Azimuth angle
                barrel_triple(10);
    }
    
    // Aft turret barrel cluster (oriented aft/port)
    color("gray") {
        translate([-32.0, 0, deck_height + boss_height])
            rotate([0, 0, 145])  // Azimuth angle
                barrel_triple(14);
    }
    
    // === SPACER COMPONENT (Part 14 of 11, i.e., the single spacer) ===
    // Positioned adjacent to superstructure as transition/key element
    // Rotated to orient curved face toward hull centerline
    color("lightsteelblue")
        translate([
            island_position - island_length/2 - 1.5, 
            island_width/2 + 0.8, 
            deck_height + 1.5
        ])
            rotate([0, 0, 95])    // Orientation for mating contact
                spacer_part();
}