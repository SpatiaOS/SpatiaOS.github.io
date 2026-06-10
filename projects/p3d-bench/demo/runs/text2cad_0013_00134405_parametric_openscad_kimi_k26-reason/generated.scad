// ============================================================
// Parametric Dimensions
// ============================================================

// Main base envelope
base_length = 0.75;
base_width = 0.75;
base_half_height = 0.0281;          // symmetric reach from central datum
base_height = base_half_height * 2; // total tier height

// Main annulus radii (coaxial, centered in envelope)
base_outer_radius = 0.375;
base_inner_radius = 0.3375;
center_x = base_length / 2; // 0.375
center_y = base_width / 2;  // 0.375

// Central collar (0.15 x 0.15 footprint, inset 0.3 from all edges)
collar_footprint = 0.15;
collar_offset = 0.3;
collar_outer_radius = collar_footprint / 2; // 0.075
collar_inner_radius = 0.05;                 // through void radius (parametric assumption)
collar_half_height = 0.0234;
collar_height = collar_half_height * 2;

// Rounded radial rib web bounding footprint
web_length = 0.618448;
web_width = 0.521035;
web_left_offset = 0.0658;
web_front_offset = 0.0387;
web_back_offset = 0.1903;
web_half_height = 0.0141;
web_height = web_half_height * 2;

// Rib web slot parameters
slot_count = 4;
slot_angle = 25;        // angular width of each slot opening (degrees)
slot_start_angle = 45;  // rotates slots to diagonal quadrants so ribs land at cardinal directions

// Resolution for curved surfaces
$fn = 100;

// ============================================================
// Helper Modules
// ============================================================

// 2D pie-slice polygon for radial slot cutouts
module pie_slice(r, a1, a2) {
    R = r;
    n = max(3, $fn / 4);
    step = (a2 - a1) / n;
    points = concat(
        [[0, 0]],
        [for (i = [0:n]) [R * cos(a1 + i * step), R * sin(a1 + i * step)]]
    );
    polygon(points);
}

// 2D profile of the rib web: annular region clipped to bounding box minus radial slots
module rib_web_profile() {
    difference() {
        // Gross solid: intersection of bounding footprint and annular ring
        intersection() {
            // Bounding box aligned with envelope edges
            translate([web_left_offset, web_front_offset])
                square([web_length, web_width]);
            // Annular region between base inner radius and collar outer radius
            difference() {
                translate([center_x, center_y])
                    circle(r = base_inner_radius);
                translate([center_x, center_y])
                    circle(r = collar_outer_radius);
            }
        }
        // Elongated radial slot-like openings
        for (i = [0 : slot_count - 1]) {
            angle = i * (360 / slot_count) + slot_start_angle;
            translate([center_x, center_y])
                rotate(angle)
                    pie_slice(r = base_inner_radius + 0.1, a1 = -slot_angle / 2, a2 = slot_angle / 2);
        }
    }
}

// ============================================================
// Component Modules
// ============================================================

// Main base: concentric circular annulus
module main_base() {
    linear_extrude(height = base_height, center = true, convexity = 2)
        difference() {
            translate([center_x, center_y])
                circle(r = base_outer_radius);
            translate([center_x, center_y])
                circle(r = base_inner_radius);
        }
}

// Central collar: solid annular boss with coaxial through void
module central_collar() {
    linear_extrude(height = collar_height, center = true, convexity = 2)
        difference() {
            translate([center_x, center_y])
                circle(r = collar_outer_radius);
            translate([center_x, center_y])
                circle(r = collar_inner_radius);
        }
}

// Rounded radial rib web: solid material between collar and inner rim with arc-based slots
module rib_web() {
    linear_extrude(height = web_height, center = true, convexity = 4)
        rib_web_profile();
}

// ============================================================
// Assembly (shared-reach tiers centered on common datum plane z=0)
// ============================================================
union() {
    main_base();
    central_collar();
    rib_web();
}