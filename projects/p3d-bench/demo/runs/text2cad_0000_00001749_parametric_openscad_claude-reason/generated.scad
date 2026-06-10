// === Parameters ===

// Main D-shaped frame dimensions
main_length = 0.395255;    // X extent of footprint
main_width  = 0.60219;     // Y extent of footprint
main_height = 0.109489;    // Z extrusion depth

// Frame wall thickness (parametric)
wall_thickness = 0.05;

// D-shape derived geometry
arc_radius      = main_width / 2;              // semicircle radius
straight_section = main_length - arc_radius;   // straight side length

// Protrusion circular profile
prot_height   = 0.054745;  // shallower Z height
prot_center_x = 0.0942;    // circular axis left-offset
prot_center_y = -0.0821;   // circular axis front-offset (negative = outside frame)
prot_r_outer  = 0.0657;    // outer radius
prot_r_inner  = 0.0285;    // concentric hole radius

// Protrusion attachment rectangle (from edge offsets)
prot_rect_len = main_length - 0.1356;  // ~0.2597, right-edge inset
prot_rect_wid = main_width  - 0.5526;  // ~0.0496, back-edge inset

// Smoothness
$fn = 100;

// === 2D Modules ===

// D-shape: flat left (rear) wall, semicircular right (front) arc
module d_shape_2d(l, w) {
    r = w / 2;
    s = l - r;  // straight portion length
    union() {
        // Rectangular left portion (rear + sides)
        square([s, w]);
        // Right semicircle (curved arc wall)
        intersection() {
            translate([s, r])
                circle(r = r);
            translate([s, 0])
                square([r, w]);
        }
    }
}

// D-frame: outer D minus inset inner D (through-opening)
module d_frame_2d(l, w, wt) {
    difference() {
        d_shape_2d(l, w);
        offset(delta = -wt)
            d_shape_2d(l, w);
    }
}

// Protrusion tab: convex hull of outer circle and attachment rectangle
module protrusion_tab_2d(cx, cy, r, rl, rw) {
    hull() {
        // Circular profile outside the frame
        translate([cx, cy])
            circle(r = r);
        // Rectangle overlapping frame wall for solid attachment
        square([rl, rw]);
    }
}

// === Main Assembly ===

difference() {
    union() {
        // Primary body: D-shaped frame at full depth
        linear_extrude(height = main_height)
            d_frame_2d(main_length, main_width, wall_thickness);

        // Shallower protrusion tab attached to frame underside region
        linear_extrude(height = prot_height)
            protrusion_tab_2d(
                prot_center_x, prot_center_y,
                prot_r_outer,
                prot_rect_len, prot_rect_wid
            );
    }

    // Concentric circular hole through the shallow protrusion band
    translate([prot_center_x, prot_center_y, -0.001])
        cylinder(h = prot_height + 0.002, r = prot_r_inner);
}