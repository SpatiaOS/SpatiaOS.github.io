// === Parameters ===

// Overall dimensions
length       = 0.75;
width        = 0.220587;
height       = 0.147058;
body_height  = 0.1471;

// Lobe / link parameters
lobe_radius    = 0.1103;
left_center_x  = 0.1103;   // 0.1103 from left edge
right_center_x = 0.6397;   // 0.1103 from right edge
center_y       = 0.1103;   // 0.1103 from front edge (= width/2)

// Concentric feature radii at each lobe
bore_radius   = 0.0294;    // centered through-bore
recess_radius = 0.0956;    // larger annular stepped recess
recess_height = 0.0882;    // recess depth from underside

// Middle rectangular slot parameters
slot_length     = 0.191175;
slot_height     = 0.023529;
slot_left_off   = 0.2794;  // left offset from left edge
slot_z_bottom   = 0.0618;  // bottom of slot above base
slot_z_top      = 0.0853;  // top of slot above base
slot_cut_depth  = 0.7353;  // overcut reach from front edge through body

// Resolution
$fn = 120;

// Small epsilon for clean boolean cuts
eps = 0.005;

// === Modules ===

// 2D rounded-link (stadium) profile: two circles connected by tangent lines
module link_2d() {
    hull() {
        translate([left_center_x, center_y])
            circle(r = lobe_radius);
        translate([right_center_x, center_y])
            circle(r = lobe_radius);
    }
}

// Through-bore at a given lobe center
module bore(cx, cy) {
    translate([cx, cy, -eps])
        cylinder(r = bore_radius, h = body_height + 2 * eps);
}

// Annular recess cut from the underside at a given lobe center
module annular_recess(cx, cy) {
    translate([cx, cy, -eps])
        cylinder(r = recess_radius, h = recess_height + eps);
}

// Middle rectangular slot cut from the front face through the body
module middle_slot() {
    translate([slot_left_off, -eps, slot_z_bottom])
        cube([slot_length, slot_cut_depth, slot_height]);
}

// === Main Assembly ===

difference() {
    // Step 1: Main solid body – extrude the rounded link footprint
    linear_extrude(height = body_height)
        link_2d();

    // Step 2: Left lobe – through bore (radius 0.0294)
    bore(left_center_x, center_y);

    // Step 3: Right lobe – through bore (radius 0.0294)
    bore(right_center_x, center_y);

    // Step 4: Left lobe – annular recess from base up to 0.0882
    annular_recess(left_center_x, center_y);

    // Step 5: Right lobe – annular recess from base up to 0.0882
    annular_recess(right_center_x, center_y);

    // Step 6: Middle rectangular slot on the side web, cut through front-to-back
    middle_slot();
}