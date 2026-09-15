// ---------------------------------------------------------------------------
// Bracket: base plate + low annular ring boss + tall hollow sleeve
//          + stepped arm tier + triangular web
// All dimensions in millimeters. Origin at base left-front-bottom corner.
// ---------------------------------------------------------------------------
$fn = 100;
eps = 0.001;

// --- Base plate ---
base_length = 0.341352;   // X extent
base_width  = 0.199422;   // Y extent
base_height = 0.065029;   // Z extent

// --- Low annular ring boss on top of base ---
ring_cx        = 0.2416;  // center X from base left edge
ring_cy        = 0.0997;  // center Y from base front edge
ring_r_outer   = 0.0997;
ring_r_inner   = 0.0434;  // open through-profile radius
ring_thickness = 0.065;   // main extrusion depth

// --- Tall hollow sleeve (concentric annular cylinder) ---
sleeve_cx      = -0.0834;  // center X from base left edge (overhangs left)
sleeve_cy      = 0.0998;   // center Y from base front edge
sleeve_r_outer = 0.1301;
sleeve_r_inner = 0.0867;   // bore radius
sleeve_top     = 0.260116; // upward reach from base datum (Z = 0)

// --- Stepped arm tier (lower band 0..0.065 cut away from underside) ---
arm_x0     = -0.4086;               // left edge, base left reference
arm_x1     = base_length - 0.4248;  // right edge, base right reference
arm_y0     = -0.0303;               // front edge, base front reference
arm_y1     = base_width + 0.0304;   // back edge, base back reference
arm_bottom = 0.065;                 // underside band removed (0 to 0.065)
arm_top    = 0.130058;              // top of raised tier

// --- Triangular web on upper side ---
web_x0       = 0.0466;              // left end, base left reference
web_x1       = base_length - 0.1863;// right end, base right reference
web_y0       = 0.0781;              // front face, base front reference
web_y1       = base_width - 0.0996; // back face, base back reference
web_base     = base_height;         // rests on base top
web_top      = sleeve_top;          // rises to the 0.2601 sleeve tier
web_strap_x  = 0.030;               // strap depth into sleeve wall (robust union)

// --- Modules ---
module base_plate() {
    cube([base_length, base_width, base_height]);
}

module ring_boss() {
    // Solid boss; the inner opening is cut later at assembly level
    translate([ring_cx, ring_cy, base_height])
        cylinder(h = ring_thickness, r = ring_r_outer);
}

module sleeve_outer() {
    // Full-height outer cylinder from base datum up to the sleeve tier
    translate([sleeve_cx, sleeve_cy, 0])
        cylinder(h = sleeve_top, r = sleeve_r_outer);
}

module arm_tier() {
    // Raised tier only (lower band already removed)
    translate([arm_x0, arm_y0, arm_bottom])
        cube([arm_x1 - arm_x0, arm_y1 - arm_y0, arm_top - arm_bottom]);
}

module web() {
    // Vertical strap merging the web into the sleeve wall
    translate([web_strap_x, web_y0, web_base])
        cube([web_x0 - web_strap_x, web_y1 - web_y0, web_top - web_base]);
    // Triangular side profile in XZ, extruded across the web thickness in Y
    translate([0, web_y1, 0])
        rotate([90, 0, 0])
            linear_extrude(height = web_y1 - web_y0)
                polygon([[web_x0, web_base],
                         [web_x0, web_top],
                         [web_x1, web_base]]);
}

// --- Assembly ---
difference() {
    union() {
        base_plate();
        ring_boss();
        sleeve_outer();
        arm_tier();
        web();
    }
    // Ring inner profile open through ring and base
    translate([ring_cx, ring_cy, -eps])
        cylinder(h = base_height + ring_thickness + 2*eps, r = ring_r_inner);
    // Sleeve bore open through full height
    translate([sleeve_cx, sleeve_cy, -eps])
        cylinder(h = sleeve_top + 2*eps, r = sleeve_r_inner);
}