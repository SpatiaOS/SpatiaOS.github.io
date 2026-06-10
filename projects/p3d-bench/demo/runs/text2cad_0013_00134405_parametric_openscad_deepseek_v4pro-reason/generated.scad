// Main parameter dimensions (all in mm)
outer_radius_base    = 0.375;   // outer radius of the annular base
inner_radius_base    = 0.3375;  // inner radius of the annular base (large central opening)
height_base          = 0.05625; // total thickness, centered on the underside reference plane

collar_outer_radius  = 0.075;   // outer radius of the solid annular collar (0.15 x 0.15 footprint)
collar_inner_radius  = 0.05;    // inner void radius of the collar (assumed, keeps the collar as a true through void)
collar_height        = 0.0468;  // height of the collar (spans from -0.0234 to +0.0234)

web_inner_radius     = collar_outer_radius;  // web attaches to collar
web_outer_radius     = inner_radius_base;    // web reaches the inner wall of the base annulus
web_height           = 0.028125;             // from -0.0141 to +0.0141

// Bounding rectangle for the rib web (offset within the 0.75 x 0.75 footprint)
rect_width           = 0.6184;   // full width
rect_height          = 0.521;    // full height
rect_center_y_offset = -0.0758;  // shift from the global center (0.375,0.375) to (0.375,0.2992)

// Radial slot parameters for the rib web
slot_count           = 8;
slot_width           = 0.04;      // tangential width of each elongated slot
slot_length          = web_outer_radius - web_inner_radius;

$fn = 100;  // smooth circular profiles

// ----------------------------------------------------------------------
// Utility module: annular ring (difference of two cylinders)
// ----------------------------------------------------------------------
module annular_ring(outer_r, inner_r, h) {
    difference() {
        cylinder(h = h, r = outer_r, center = true);
        cylinder(h = h + 0.001, r = inner_r, center = true); // slightly longer to ensure clean subtraction
    }
}

// ----------------------------------------------------------------------
// 2D shape of one radial slot (rectangle oriented radially)
// ----------------------------------------------------------------------
module radial_slot(length, width, angle) {
    // Position the rectangle so that its inner end lies on web_inner_radius
    translate([web_inner_radius + length / 2, 0])
        rotate(angle)
            square([length, width], center = true);
}

// ----------------------------------------------------------------------
// 2D projection of the rib web: annular ring clipped to the bounding rectangle
// ----------------------------------------------------------------------
module web_2d() {
    intersection() {
        // Full ring between web_inner_radius and web_outer_radius
        difference() {
            circle(r = web_outer_radius);
            circle(r = web_inner_radius);
        }
        // Clip to the rectangular region
        translate([0, rect_center_y_offset])
            square([rect_width, rect_height], center = true);
    }
}

// ======================================================================
// Main assembly: union of base annulus, central collar, and rib web
// ======================================================================
union() {
    // 1. Base annular plate (outer ring with large central hole)
    annular_ring(outer_radius_base, inner_radius_base, height_base);
    
    // 2. Solid annular collar (small, centered, with a through void)
    annular_ring(collar_outer_radius, collar_inner_radius, collar_height);
    
    // 3. Rib web (solid radial ribs with arc-based outlines and elongated slots)
    linear_extrude(height = web_height, center = true)
        difference() {
            // Base web shape (annular sector inside the rectangle)
            web_2d();
            // Subtract radial slots to leave solid ribs
            for (i = [0 : slot_count - 1]) {
                angle = i * 360 / slot_count;
                radial_slot(slot_length, slot_width, angle);
            }
        }
}