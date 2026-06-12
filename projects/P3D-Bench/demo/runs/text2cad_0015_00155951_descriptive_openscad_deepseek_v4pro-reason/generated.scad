// ============================================================
// Parametric Bracket with Arc-Outline Plate, Central Hole,
// Underside Collar, and Rounded End Tabs
// ============================================================

// --- Main dimensions ---
plate_width    = 40;   // overall width of the plate (track shape)
plate_length   = 100;  // overall length of the plate
base_thickness = 5;    // thickness (height) of the main plate

// --- Central opening & underside collar ---
hole_radius    = 5;    // radius of the through opening
ring_outer     = 15;   // outer radius of the annular collar
ring_height    = 3;    // height (downward) of the collar

// --- End tabs ---
tab_outer      = 10;   // radius of each rounded tab
tab_height     = 25;   // total height of tabs above plate top
tab_hole_r     = 3;    // radius of through holes in tabs

// --- Resolution ---
$fn = 64;              // curvature smoothness

// ============================================================
// Derived quantities
// ============================================================
R           = plate_width / 2;
L_straight  = plate_length - plate_width;

// ============================================================
// 2D profile of the arc-outline (stadium shape)
// ============================================================
module stadium_2d() {
    hull() {
        // left semicircle
        translate([-L_straight/2, 0])
            circle(r = R);
        // right semicircle
        translate([ L_straight/2, 0])
            circle(r = R);
    }
}

// ============================================================
// Rounded tab: cylindrical body with hemispherical top
// ============================================================
module tab() {
    union() {
        // straight cylindrical section up to the hemisphere
        cylinder(h = tab_height - tab_outer, r = tab_outer);
        // hemispherical cap (equator matches cylinder top edge)
        translate([0, 0, tab_height - tab_outer])
            sphere(r = tab_outer);
    }
}

// ============================================================
// Main part: union of plate, collar, and tabs, then subtract
// the central opening and the tab through holes.
// ============================================================
difference() {
    union() {
        // 1. Main plate (extruded stadium)
        linear_extrude(height = base_thickness)
            stadium_2d();

        // 2. Underside annular collar (solid ring, central hole cut later)
        translate([0, 0, -ring_height])
            cylinder(h = ring_height, r = ring_outer);

        // 3. Tall tabs at both ends (sit on top of the plate)
        translate([ L_straight/2, 0, base_thickness])
            tab();
        translate([-L_straight/2, 0, base_thickness])
            tab();
    }

    // Subtract central through hole (goes through collar and plate)
    translate([0, 0, -ring_height])
        cylinder(h = base_thickness + ring_height + 0.01, r = hole_radius);

    // Subtract through holes for the tabs (go through tabs and plate)
    translate([ L_straight/2, 0, 0])
        cylinder(h = base_thickness + tab_height + 0.01, r = tab_hole_r);
    translate([-L_straight/2, 0, 0])
        cylinder(h = base_thickness + tab_height + 0.01, r = tab_hole_r);
}