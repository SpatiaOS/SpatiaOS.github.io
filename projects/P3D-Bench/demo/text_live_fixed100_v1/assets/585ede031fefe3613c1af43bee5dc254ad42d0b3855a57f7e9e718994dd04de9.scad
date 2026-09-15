// ============================================================
// Arc-outline plate with central bore, underside collar
// and two tall rounded end tabs with through holes
// ============================================================

$fn = 120;

// ---- Base plate parameters ----
plate_len       = 90;   // overall length (X)
plate_width     = 34;   // overall width  (Y)
plate_thick     = 6;    // base plate thickness (Z)
arc_bulge       = 10;   // how far the side arcs bulge outward

// ---- Central opening ----
center_hole_d   = 18;   // through opening at plate center

// ---- Underside annular collar ----
collar_od       = 30;   // collar outer diameter
collar_h        = 3;    // shallow lower tier height

// ---- End tabs ----
tab_width       = 22;   // tab width (Y)
tab_thick       = 10;   // tab thickness (X direction)
tab_height      = 26;   // tall solid tabs rising above plate
tab_round_r     = tab_width/2;   // rounded top radius
tab_hole_d      = 9;    // through opening in each tab
tab_hole_z      = 17;   // hole centre height above plate top
tab_inset       = 4;    // distance of tab face from plate end

eps = 0.01;

// ------------------------------------------------------------
// 2D outline of the plate: rectangle with two outward arcs
// on the long sides (arc-based outline)
// ------------------------------------------------------------
function arc_radius(c, h) = (c*c/4 + h*h) / (2*h);

module plate_profile() {
    r = arc_radius(plate_len, arc_bulge);   // radius of the side arcs
    intersection() {
        // Bounding rectangle limits the length
        square([plate_len, plate_width + 2*arc_bulge], center = true);
        // Arc from the top side (circle centre pushed down)
        translate([0, -(r - plate_width/2 - arc_bulge)])
            circle(r = r);
        // Arc from the bottom side (mirror image)
        translate([0,  (r - plate_width/2 - arc_bulge)])
            circle(r = r);
    }
}

// ------------------------------------------------------------
// Solid base plate
// ------------------------------------------------------------
module base_plate() {
    linear_extrude(height = plate_thick)
        plate_profile();
}

// ------------------------------------------------------------
// Shallow annular collar on the underside (hollow ring)
// ------------------------------------------------------------
module underside_collar() {
    translate([0, 0, -collar_h])
        difference() {
            cylinder(h = collar_h, d = collar_od);
            translate([0, 0, -eps])
                cylinder(h = collar_h + 2*eps, d = center_hole_d);
        }
}

// ------------------------------------------------------------
// One tall rounded tab (2D profile extruded along Y)
// ------------------------------------------------------------
module tab(x_pos) {
    translate([x_pos, 0, plate_thick])
        rotate([90, 0, 0])
            linear_extrude(height = tab_width, center = true)
                hull() {
                    // rectangular base of the tab
                    translate([-tab_thick/2, 0])
                        square([tab_thick, tab_height - tab_round_r]);
                    // rounded top
                    translate([0, tab_height - tab_round_r])
                        circle(r = tab_thick/2);
                }
}

// ------------------------------------------------------------
// Through hole in a tab (along X, through its thickness)
// ------------------------------------------------------------
module tab_hole(x_pos) {
    translate([x_pos, 0, plate_thick + tab_hole_z])
        rotate([0, 90, 0])
            cylinder(h = tab_thick + 4*eps, d = tab_hole_d, center = true);
}

// ------------------------------------------------------------
// Assembly
// ------------------------------------------------------------
tab_x = plate_len/2 - tab_inset - tab_thick/2;   // tab centre offset

difference() {
    union() {
        base_plate();                 // shallow arc-outline plate
        underside_collar();           // shallow ring below
        tab(  tab_x);                 // tall tab, +X end
        tab( -tab_x);                 // tall tab, -X end
    }

    // Central through opening (plate + collar)
    translate([0, 0, -collar_h - eps])
        cylinder(h = plate_thick + collar_h + 2*eps, d = center_hole_d);

    // Through openings in the tabs
    tab_hole(  tab_x);
    tab_hole( -tab_x);
}