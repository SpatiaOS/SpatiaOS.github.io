// Stepped flange plate: arc-outlined shallow base, annular underside collar,
// two tall rounded end tabs with through holes

// ---------------- Parameters ----------------
// Base plate
plate_length    = 80;    // overall plate length
plate_width     = 40;    // plate width = diameter of the end arcs
plate_thickness = 6;     // shallow base thickness

// Central through opening
center_hole_d   = 20;

// Underside annular collar (hollow ring, shallow lower tier)
collar_outer_d  = 32;
collar_height   = 4;

// Tall end tabs (much taller than the base)
tab_thickness   = 10;    // thickness along X = hole axis direction
tab_height      = 30;    // height above plate top
tab_hole_d      = 12;    // through hole in each tab

$fn = 100;

// ---------------- Derived values ----------------
end_radius = plate_width / 2;
end_offset = plate_length / 2 - end_radius;            // X of arc centers / tabs
tab_width  = plate_width;                              // tabs span full plate width
tab_hole_z = plate_thickness + tab_height - tab_width / 2; // Z of tab top arc center

// ---------------- Modules ----------------

// Shallow base plate with arc-based (stadium) outline
module base_plate() {
    linear_extrude(height = plate_thickness)
        hull()
            for (s = [-1, 1])
                translate([s * end_offset, 0])
                    circle(r = end_radius);
}

// Annular collar: hollow ring, never a filled disk
module underside_collar() {
    difference() {
        cylinder(h = collar_height + 1, d = collar_outer_d); // +1 embeds into plate
        translate([0, 0, -1])
            cylinder(h = collar_height + 3, d = center_hole_d);
    }
}

// Tall rounded tab: stem + semicircular top, hole through its thickness
module end_tab() {
    difference() {
        union() {
            // stem, starting at plate bottom for a solid merge
            translate([-tab_thickness/2, -tab_width/2, 0])
                cube([tab_thickness, tab_width, tab_hole_z]);
            // rounded top (cylinder axis along the tab thickness)
            translate([0, 0, tab_hole_z])
                rotate([0, 90, 0])
                    cylinder(h = tab_thickness, d = tab_width, center = true);
        }
        // through hole passing through the tab thickness (along X)
        translate([0, 0, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_thickness + 2, d = tab_hole_d, center = true);
    }
}

// ---------------- Assembly ----------------
difference() {
    union() {
        // shallow base tier
        color("LightGray") base_plate();
        // shallow lower tier (step down)
        color("DimGray") translate([0, 0, -collar_height]) underside_collar();
        // tall upper tiers (step up)
        color("SteelBlue")
            for (s = [-1, 1])
                translate([s * end_offset, 0, 0])
                    end_tab();
    }
    // real central through opening: cuts base plate AND collar
    translate([0, 0, -collar_height - 1])
        cylinder(h = plate_thickness + collar_height + 2, d = center_hole_d);
}