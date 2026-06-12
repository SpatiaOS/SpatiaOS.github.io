// === Parametric Annular Rim with Collar, Ribs, and Rounded Windows ===

// --- Outer annular ring (tallest tier) ---
outer_radius      = 60;       // Overall outer radius
ring_width        = 8;        // Radial width of outer ring
ring_height       = 8;        // Thickness of outer ring

// --- Inner concentric collar (middle tier) ---
collar_outer_r    = 22;       // Collar outer radius
collar_inner_r    = 15;       // Collar bore radius (open center)
collar_height     = 5;        // Collar thickness

// --- Radial ribs and window slots (shallowest tier) ---
num_ribs          = 8;        // Number of equally-spaced ribs
rib_angular_width = 10;       // Angular width of each rib (degrees)
rib_height        = 3.5;      // Rib web thickness
slot_corner_r     = 4;        // Fillet radius on window corners
slot_radial_margin = 2;       // Radial inset of windows from collar/ring edges

$fn = 120;

// --- Derived dimensions ---
ring_inner_r  = outer_radius - ring_width;
sector_angle  = 360 / num_ribs;
slot_angle    = sector_angle - rib_angular_width;

// =============================================
// Outer annular ring – full-height rim
// =============================================
module outer_ring() {
    difference() {
        cylinder(r = outer_radius, h = ring_height);
        translate([0, 0, -1])
            cylinder(r = ring_inner_r, h = ring_height + 2);
    }
}

// =============================================
// Inner collar – medium-height hollow boss
// =============================================
module collar() {
    difference() {
        cylinder(r = collar_outer_r, h = collar_height);
        translate([0, 0, -1])
            cylinder(r = collar_inner_r, h = collar_height + 2);
    }
}

// =============================================
// 2D rounded slot profile for one window
// Uses hull of four corner circles to create
// a rounded-rectangle-like cutout shape
// =============================================
module slot_profile_2d() {
    // Radii where corner circle centres sit
    r_in  = collar_outer_r + slot_radial_margin + slot_corner_r;
    r_out = ring_inner_r   - slot_radial_margin - slot_corner_r;

    // Angular margin so fillet circle stays inside the slot zone
    ang_margin = asin(slot_corner_r / r_in);   // most restrictive at inner r
    half_a     = slot_angle / 2 - ang_margin;

    // Four-corner hull gives a rounded window shape
    hull() {
        for (a = [-half_a, half_a])
            for (r = [r_in, r_out])
                rotate([0, 0, a])
                    translate([r, 0])
                        circle(r = slot_corner_r);
    }
}

// =============================================
// Rib web – thin annular disc with rounded
// window slots subtracted to leave solid ribs
// =============================================
module rib_web() {
    difference() {
        // Full thin annular disc spanning collar-to-ring gap
        difference() {
            cylinder(r = ring_inner_r, h = rib_height);
            translate([0, 0, -1])
                cylinder(r = collar_outer_r, h = rib_height + 2);
        }

        // Subtract one rounded window per sector, centred between ribs
        for (i = [0 : num_ribs - 1]) {
            rotate([0, 0, i * sector_angle + sector_angle / 2])
                translate([0, 0, -1])
                    linear_extrude(height = rib_height + 2)
                        slot_profile_2d();
        }
    }
}

// =============================================
// Final assembly – all tiers share the Z axis,
// bottoms co-planar at z=0 so stepped profile
// is visible from the top and underside
// =============================================
union() {
    outer_ring();    // Tier 1 – tallest
    collar();        // Tier 2 – medium
    rib_web();       // Tier 3 – shallowest
}