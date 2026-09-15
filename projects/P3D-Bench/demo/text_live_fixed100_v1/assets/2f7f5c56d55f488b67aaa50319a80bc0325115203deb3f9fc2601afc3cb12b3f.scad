// ---------------------------------------------------------------
// Parametric plate with central void, underside collar,
// and two upright slotted end tabs
// All dimensions in millimeters (as specified)
// ---------------------------------------------------------------

$fn = 100;

// ----- Main base parameters -----
base_length   = 0.75;    // X extent
base_width    = 0.5;     // Y extent
base_height   = 0.125;   // extrusion from base datum
edge_round_r  = 0.0625;  // arc-edged (rounded) top edges

// ----- Central void -----
void_radius   = 0.125;
void_x        = 0.375;   // from left edge
void_y        = 0.25;    // from front edge

// ----- Underside collar -----
collar_h      = 0.0375;  // below underside
collar_or     = 0.2125;  // outer radius
collar_ir     = 0.125;   // inner radius (matches void)

// ----- End tabs -----
tab_footprint_x = 0.125;     // thickness
tab_footprint_y = 0.375;     // front-back width
tab_side_margin = 0.0625;    // inset from front & back edges
tab_top_reach   = 0.5875;    // total reach above base datum
tab_top_round_r = tab_footprint_x / 2;
tab_hole_r      = 0.0937;
tab_hole_y      = 0.25;                                   // front-offset
tab_hole_z      = tab_top_reach - tab_hole_r - 0.0625;    // sensible center height

// Right tab: x from 0.625 to 0.75 ; Left tab: x from 0 to 0.125
right_tab_x0 = 0.625;
left_tab_x0  = 0.0;

// ---------------------------------------------------------------
// Module: arc-edged plate cross-section (in local x=depth, y=height)
// Rectangle with the two UPPER corners rounded.
// ---------------------------------------------------------------
module base_profile() {
    r = edge_round_r;
    union() {
        // lower solid body up to start of rounding
        translate([r, 0])
            square([base_width - 2*r, base_height]);
        // straight mid strip keeps verticals sharp
        translate([r, 0])
            square([base_width - 2*r, base_height]);
        // top arc corners via filled rounded strip
        translate([r, base_height - r])
            square([base_width - 2*r, r]);
        // two corner arcs
        translate([r, base_height - r])               circle(r);
        translate([base_width - r, base_height - r])  circle(r);
    }
}

// Full base plate: profile swept along X for the full length
module base_plate() {
    rotate([90, 0, 90])                    // profile-x -> Y, profile-y -> Z, sweep -> +X
        linear_extrude(height = base_length)
            base_profile();
}

// Underside annular collar (hollow ring, fused into base)
module collar() {
    translate([void_x, void_y, -collar_h])
        linear_extrude(height = collar_h + base_height*0.5)  // overlap upward to fuse
            difference() {
                circle(r = collar_or);
                circle(r = collar_ir);
            }
}

// Upright rounded (slot-like) tab: outline rounded at TOP in elevation,
// constant thickness, extruded across tab_footprint_y
module tab(x_start) {
    xc = x_start + tab_footprint_x/2;       // tab width-axis center
    zs = base_height;                       // starts on top of base
    zt = tab_top_reach - tab_top_round_r;   // center of top semicircle
    translate([0, tab_side_margin + tab_footprint_y, 0])   // sweep runs -Y
        rotate([90, 0, 0])                 // local x -> X, local y -> Z
            linear_extrude(height = tab_footprint_y)
                union() {
                    // rectangular stem rising from base top
                    translate([x_start, zs])
                        square([tab_footprint_x, zt - zs]);
                    // rounded top
                    translate([xc, zt])
                        circle(r = tab_top_round_r);
                }
}

// Horizontal through opening in a tab (axis along X, through thickness)
module tab_hole(x_start) {
    xc = x_start + tab_footprint_x/2;
    translate([xc - 0.01, tab_hole_y, tab_hole_z])
        rotate([0, 90, 0])
            cylinder(h = tab_footprint_x + 0.02, r = tab_hole_r);
}

// ---------------------------------------------------------------
// Main assembly
// ---------------------------------------------------------------
difference() {
    union() {
        base_plate();                  // step 1: arc-edged base plate
        collar();                      // step 2: underside annular collar
        tab(right_tab_x0);             // step 4: right-end upright tab
        tab(left_tab_x0);              // step 5: left-end upright tab
    }
    // Step 3: central circular through void - continuous through
    //         base AND underside collar
    translate([void_x, void_y, -collar_h - 0.01])
        cylinder(h = base_height + collar_h + 0.02, r = void_radius);
    // Tab through openings
    tab_hole(right_tab_x0);
    tab_hole(left_tab_x0);
}