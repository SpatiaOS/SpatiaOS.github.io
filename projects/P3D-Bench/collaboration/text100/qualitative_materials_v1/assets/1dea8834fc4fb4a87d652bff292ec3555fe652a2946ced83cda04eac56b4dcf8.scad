// =============================================================================
// Parametric CAD Model: Upright Housing with Stepped Annular Bosses
// All linear dimensions are in millimeters.
// =============================================================================

$fn = 120; // High resolution for smooth circular and arc features
eps = 0.002; // Overlap epsilon to prevent z-fighting and ensure manifold cuts

// -----------------------------------------------------------------------------
// Reference Envelope Dimensions
// -----------------------------------------------------------------------------
env_length = 0.303436; // Left-to-right reference extent (X)
env_width  = 0.502485; // Front-to-back reference extent (Y)
env_height = 0.4684;   // Base datum to top upright extent (Z, envelope 0.468362)

// -----------------------------------------------------------------------------
// Main Upper Body Parameters
// -----------------------------------------------------------------------------
corner_rad   = 0.035;  // Corner radius for outer profile
wall_thick   = 0.032;  // Wall thickness of open curved interior
floor_height = 0.203;  // Floor height of the upper cavity

// -----------------------------------------------------------------------------
// Small Coaxial Sleeve Parameters
// -----------------------------------------------------------------------------
small_axis_x        = 0.1541; // Distance from left reference edge (X=0)
small_axis_y        = 0.4232; // Distance from front reference edge (Y=0)
small_wall_radius   = 0.0714; // Sleeve wall outline and stepped face radius
small_bore_radius   = 0.0250; // Central through-bore radius
small_recess_height = 0.1764; // Underside recess vertical extent (0 to 0.1764)

// -----------------------------------------------------------------------------
// Large Lower Annular Circular Solid Parameters
// -----------------------------------------------------------------------------
large_axis_x        = 0.5416; // Distance from left reference edge (X=0)
large_axis_y        = 0.2448; // Distance from front reference edge (Y=0)
large_outer_radius  = 0.2084; // Outer solid radius (0.4168 by 0.4168 profile span)
large_annular_rad   = 0.1756; // Annular boundary & underside recess radius
large_bore_radius   = 0.0546; // Central opening radius
large_solid_height  = 0.2030; // Height of large annular solid above base plane
large_recess_height = 0.1280; // Underside recess vertical extent (0 to 0.1280)

// =============================================================================
// Geometry Modules
// =============================================================================

// 2D profile of the main upright body, flush to envelope reference extents
module upright_profile_2d() {
    hull() {
        translate([corner_rad, corner_rad])
            circle(r = corner_rad);
        translate([env_length - corner_rad, corner_rad])
            circle(r = corner_rad);
        translate([env_length - corner_rad, env_width - corner_rad])
            circle(r = corner_rad);
        translate([corner_rad, env_width - corner_rad])
            circle(r = corner_rad);
    }
}

// Solid upright body extruded to maximum reference height
module main_upright_solid() {
    linear_extrude(height = env_height)
        upright_profile_2d();
}

// Small coaxial circular sleeve on the base plane
module small_sleeve_solid() {
    translate([small_axis_x, small_axis_y, 0])
        cylinder(h = env_height, r = small_wall_radius);
}

// Large lower annular circular solid
module large_annular_solid() {
    translate([large_axis_x, large_axis_y, 0])
        cylinder(h = large_solid_height, r = large_outer_radius);
}

// Connecting structural web joining the upright body to the large boss
module base_transition_web() {
    hull() {
        translate([env_length - 0.06, large_axis_y - 0.12, 0])
            cube([0.06, 0.24, large_solid_height]);
        translate([large_axis_x, large_axis_y, 0])
            cylinder(h = large_solid_height, r = large_outer_radius);
    }
}

// Open curved interior cavity of the main upright body
module open_curved_interior_cutout() {
    // Top cavity with curved boundary
    translate([0, 0, floor_height]) {
        linear_extrude(height = env_height - floor_height + eps) {
            hull() {
                translate([wall_thick + corner_rad, wall_thick + corner_rad])
                    circle(r = corner_rad);
                translate([env_length - wall_thick - corner_rad, wall_thick + corner_rad])
                    circle(r = corner_rad);
                translate([env_length - wall_thick - corner_rad, small_axis_y - small_wall_radius - 0.02])
                    circle(r = corner_rad);
                translate([wall_thick + corner_rad, small_axis_y - small_wall_radius - 0.02])
                    circle(r = corner_rad);
            }
        }
    }

    // Front arc-based interior opening
    translate([env_length / 2, -eps, (env_height + floor_height) / 2])
        rotate([-90, 0, 0])
            scale([1, 1.2, 1])
                cylinder(h = wall_thick + 2 * eps, r = (env_length / 2) - wall_thick);
}

// Subtractive voids and recesses
module cuts_and_bores() {
    // 1. Large boss underside circular recess (0 to 0.128, radius 0.1756)
    translate([large_axis_x, large_axis_y, -eps])
        cylinder(h = large_recess_height + eps, r = large_annular_rad);

    // 2. Large boss true void central bore (through full height, radius 0.0546)
    translate([large_axis_x, large_axis_y, -eps])
        cylinder(h = large_solid_height + 2 * eps, r = large_bore_radius);

    // 3. Small sleeve underside circular recess (0 to 0.1764, radius 0.0714)
    translate([small_axis_x, small_axis_y, -eps])
        cylinder(h = small_recess_height + eps, r = small_wall_radius);

    // 4. Small sleeve true void central bore (through full height, radius 0.025)
    translate([small_axis_x, small_axis_y, -eps])
        cylinder(h = env_height + 2 * eps, r = small_bore_radius);

    // 5. Main upper body open curved interior
    open_curved_interior_cutout();
}

// =============================================================================
// Final Model Assembly
// =============================================================================
difference() {
    // Positive structural volume
    union() {
        main_upright_solid();
        small_sleeve_solid();
        large_annular_solid();
        base_transition_web();
    }

    // Negative features (stepped recesses, central bores, open interior)
    cuts_and_bores();
}