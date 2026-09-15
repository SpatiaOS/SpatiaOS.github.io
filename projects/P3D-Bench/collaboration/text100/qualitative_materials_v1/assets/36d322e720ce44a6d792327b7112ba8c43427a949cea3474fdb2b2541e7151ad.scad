// -------------------------- PARAMETERS --------------------------
// Overall reference envelope for main upper body
envelope_length = 0.303436;    // X: left (0) to right (L) [units]
envelope_width = 0.502485;     // Y: front (0) to back (W) [units]
envelope_height = 0.468362;    // Z: base datum (0) to top of envelope [units]
main_top_z = 0.4684;           // Top height of main upright solid from Z=0 base

// Small coaxial sleeve feature (position and dimensions)
small_x = 0.1542;              // X: axis offset from left reference edge
small_y = 0.4232;              // Y: axis offset from front reference edge
small_r = 0.0714;              // Outer radius of sleeve wall / stepped face
small_bore_r = 0.025;          // Radius of central through opening
small_recess_depth = 0.1764;   // Depth of underside recess from Z=0
small_tier_height = 0.203;     // Height of small sleeve tier above base

// Large annular boss feature (position and dimensions)
large_x = 0.5416;              // X: axis offset from left reference edge
large_y = 0.2448;              // Y: axis offset from front reference edge
large_outer_r = 0.2084;        // Outer radius of lower annular solid
large_step_r = 0.1756;         // Radius of annular step / underside recess
large_bore_r = 0.0546;         // Radius of central through opening
large_tier_height = 0.203;     // Total height of large annular tier above base
large_recess_depth = 0.128;    // Depth of underside recess from Z=0

// Main body rounded frame parameters (arc-based open profile)
wall_thickness = 0.03;         // Vertical wall thickness for hollow main body
corner_radius = 0.03;          // Radius for rounded outer/inner corners

$fn = 100;                     // Resolution for smooth curved surfaces

// -------------------------- HELPER MODULES --------------------------
module rounded_rect_2d(w, d, r) {
    // 2D rounded rectangle aligned to origin (0,0), size w x d, corner radius r
    r = min(r, w/2, d/2); // Clamp radius to valid range for rectangle size
    // Central straight section
    translate([r, r]) square([w - 2*r, d - 2*r]);
    // Corner arc fillets
    translate([r, r]) circle(r);
    translate([w - r, r]) circle(r);
    translate([r, d - r]) circle(r);
    translate([w - r, d - r]) circle(r);
    // Straight edge segments
    translate([r, 0]) square([w - 2*r, r]);
    translate([r, d - r]) square([w - 2*r, r]);
    translate([0, r]) square([r, d - 2*r]);
    translate([w - r, r]) square([r, d - 2*r]);
}

module rounded_hollow_frame(w, d, h, wall_t, corner_r) {
    // 3D hollow vertical frame with rounded arc corners, open interior
    linear_extrude(height = h) {
        difference() {
            // Outer rounded perimeter (flush to reference extents)
            rounded_rect_2d(w, d, corner_r);
            // Inner cutout for open curved interior
            translate([wall_t, wall_t])
                rounded_rect_2d(w - 2*wall_t, d - 2*wall_t, max(corner_r - wall_t, 0));
        }
    }
}

// -------------------------- MAIN MODEL --------------------------
difference() {
    union() {
        // Main upper body: hollow rounded frame within envelope, open interior
        rounded_hollow_frame(
            envelope_length, envelope_width, main_top_z,
            wall_thickness, corner_radius
        );

        // Large lower annular solid tier (on upward side of base plane Z=0)
        translate([large_x, large_y, 0])
            cylinder(h = large_tier_height, r = large_outer_r, center = false);

        // Small coaxial sleeve tier (on upward side of base plane Z=0)
        translate([small_x, small_y, 0])
            cylinder(h = small_tier_height, r = small_r, center = false);

        // Connecting bridge between main frame right wall and outboard large boss
        bridge_x1 = envelope_length;
        bridge_x2 = large_x - large_outer_r;
        bridge_y1 = large_y - large_outer_r;
        bridge_y2 = large_y + large_outer_r;
        translate([bridge_x1, bridge_y1, 0])
            cube([bridge_x2 - bridge_x1, bridge_y2 - bridge_y1, large_tier_height]);
    }

    // --- Underside stepped recess cuts (partial depth, not through tiers) ---
    // Large underside recess (0 to large_recess_depth from Z=0)
    translate([large_x, large_y, -0.001])
        cylinder(h = large_recess_depth + 0.002, r = large_step_r, center = false);
    // Small underside recess (0 to small_recess_depth from Z=0)
    translate([small_x, small_y, -0.001])
        cylinder(h = small_recess_depth + 0.002, r = small_r, center = false);

    // --- Central through bores (full depth openings through all tiers) ---
    // Large central bore
    translate([large_x, large_y, -0.001])
        cylinder(h = large_tier_height + 0.002, r = large_bore_r, center = false);
    // Small central bore
    translate([small_x, small_y, -0.001])
        cylinder(h = small_tier_height + 0.002, r = small_bore_r, center = false);
}