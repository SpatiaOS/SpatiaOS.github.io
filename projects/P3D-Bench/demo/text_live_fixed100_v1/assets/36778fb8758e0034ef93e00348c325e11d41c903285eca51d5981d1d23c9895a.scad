// ==========================================
// OpenSCAD Model: Flanged Bracket with Sleeve, Side Arm, and Gusset Rib
// All dimensions in millimeters
// ==========================================

// Global curved-surface resolution
$fn = 80;

// --------------------------
// PARAMETER DEFINITIONS
// --------------------------
// Low rounded stepped base
base_lower_od   = 40;     // Outer diameter of wide lower base tier
base_lower_h    = 5;      // Height of lower base tier
base_upper_od   = 26;     // Outer diameter of upper stepped circular section
base_upper_h    = 4;      // Height of upper base tier
base_fillet     = 2;      // Edge rounding radius for lower base profile
base_total_h    = base_lower_h + base_upper_h;  // Z-height at top of base

// Tall annular sleeve
sleeve_od       = 20;     // Outer diameter of upright hollow sleeve
sleeve_id       = 10;     // Central bore diameter (passes through all tiers)
sleeve_h        = 38;     // Sleeve height above base top surface
sleeve_total_h  = base_total_h + sleeve_h;     // Overall part height at sleeve top

// Projecting side arm
arm_width       = 12;     // Width of arm (tangential/perpendicular direction)
arm_projection  = 32;     // Distance from part center to rounded arm tip
arm_outer_h     = 5;      // Thickness of outer arm section (above cutaway)
arm_step_r      = 24;     // Radial distance from center where underside step begins
arm_hole_d      = 5;      // Diameter of through-hole at rounded arm end
arm_end_r       = arm_width / 2;              // End-round radius (= half arm width)
arm_hole_x      = arm_projection - arm_end_r; // X-center of end hole / round center

// Triangular top rib (gusset)
rib_thick       = 2;      // Thickness of the vertical rib web
rib_h           = 7;      // Height of rib above arm top at sleeve wall
rib_gap         = 3;      // Clearance between rib tip and end hole
rib_end_x       = arm_hole_x - arm_hole_d/2 - rib_gap;  // Rib tip X-position
rib_start_x     = sleeve_od/2 - 2;             // Rib starts slightly inside sleeve wall

// --------------------------
// POSITIVE GEOMETRY (additive)
// --------------------------
union() {

    // Lower rounded base tier - uses minkowski to produce soft rounded edges
    translate([0, 0, base_fillet])
    minkowski() {
        cylinder(
            h = base_lower_h - 2*base_fillet,
            d = base_lower_od - 2*base_fillet,
            center = false
        );
        sphere(r = base_fillet);
    }

    // Upper stepped circular base tier (concentric shoulder under sleeve)
    translate([0, 0, base_lower_h])
    cylinder(h = base_upper_h, d = base_upper_od, center = false);

    // Tall annular sleeve (outer wall - bore subtracted below)
    translate([0, 0, base_total_h])
    cylinder(h = sleeve_h, d = sleeve_od, center = false);

    // Full-depth side arm (temporary full volume; cutaway subtracted below)
    // Arm outline: rectangle with a semicircular rounded end
    translate([0, 0, 0])
    linear_extrude(height = base_total_h, center = false)
    translate([-sleeve_od/2, -arm_width/2])
    union() {
        // Rectangular shank (extends into sleeve area for seamless merge)
        square([arm_hole_x + sleeve_od/2, arm_width]);
        // Rounded distal end (half-round)
        translate([arm_hole_x + sleeve_od/2, arm_width/2])
        circle(r = arm_end_r);
    }

    // Thin triangular rib / gusset on top of arm
    // Vertical flat plate in the XZ plane, extruded to thickness along Y
    translate([0, -rib_thick/2, base_total_h])
    linear_extrude(height = rib_thick, center = false)
    polygon(
        points = [
            [rib_start_x, 0],                 // bottom at sleeve wall (on arm top)
            [rib_start_x, rib_h],             // top at sleeve wall (rises up sleeve)
            [rib_end_x, 0]                    // tip at arm top, short of the end hole
        ]
    );
}

// --------------------------
// NEGATIVE GEOMETRY (subtractive)
// --------------------------
difference() {
    // The positive union built above is the first child (implicit via structure)
    // We use children() or restructure - restructure cleanly below:
}

// NOTE: Above split was for clarity; actual combined difference below.
// Re-structured into single valid boolean tree:
difference() {

    // --- POSITIVE PARENT ---
    union() {

        // Lower rounded base
        translate([0, 0, base_fillet])
        minkowski() {
            cylinder(
                h = base_lower_h - 2*base_fillet,
                d = base_lower_od - 2*base_fillet,
                center = false
            );
            sphere(r = base_fillet);
        }

        // Upper stepped tier
        translate([0, 0, base_lower_h])
        cylinder(h = base_upper_h, d = base_upper_od, center = false);

        // Sleeve outer
        translate([0, 0, base_total_h])
        cylinder(h = sleeve_h, d = sleeve_od, center = false);

        // Full-depth arm blank (before cutaway)
        linear_extrude(height = base_total_h, center = false)
        translate([-sleeve_od/2, -arm_width/2])
        union() {
            square([arm_hole_x + sleeve_od/2, arm_width]);
            translate([arm_hole_x + sleeve_od/2, arm_width/2])
            circle(r = arm_end_r);
        }

        // Triangular gusset rib on top
        translate([0, -rib_thick/2, base_total_h])
        linear_extrude(height = rib_thick, center = false)
        polygon(points = [
            [rib_start_x, 0],
            [rib_start_x, rib_h],
            [rib_end_x, 0]
        ]);
    }

    // --- SUBTRACTED FEATURES ---

    // Central bore - continues all the way through sleeve and both base tiers
    cylinder(h = sleeve_total_h + 2, d = sleeve_id, center = true);
    // Note: cylinder centered at origin places it symmetric about Z=0;
    // extra height ensures clearance top and bottom.

    // Underside cutaway on outer arm - removes lower section beyond step radius
    // Creates the "higher tier" look on the visible outer portion
    translate([arm_step_r - 0.5, -arm_width, -1])
    cube(
        [arm_projection + 2*arm_end_r - arm_step_r + 2, 2*arm_width + 2, base_total_h - arm_outer_h + 1],
        center = false
    );

    // Through-hole at the rounded arm end
    translate([arm_hole_x, 0, -1])
    cylinder(h = base_total_h + 2, d = arm_hole_d, center = false);
}