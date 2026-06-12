// Parametric Variables
plate_len = 80;           // Overall length of the plate
plate_wid = 40;           // Width (diameter of end arcs)
plate_thick = 4;          // Base plate thickness
$fn = 64;                 // Curve resolution

center_hole_d = 20;       // Diameter of central through opening

collar_od = 32;           // Outer diameter of underside collar
collar_id = 26;           // Inner diameter of underside collar
collar_h = 2;             // Height of shallow collar

tab_h = 25;               // Height of end tabs
tab_d = 18;               // Diameter/width of end tabs
tab_hole_d = 6;           // Through-hole diameter in tabs

// Module: Arc-based (stadium) plate body
module base_plate() {
    linear_extrude(height = plate_thick, center = true) {
        hull() {
            translate([-(plate_len - plate_wid)/2, 0]) circle(d = plate_wid);
            translate([(plate_len - plate_wid)/2, 0]) circle(d = plate_wid);
        }
    }
}

// Module: Shallow annular collar on underside
module underside_collar() {
    translate([0, 0, -plate_thick/2 - collar_h]) {
        difference() {
            cylinder(h = collar_h, d = collar_od, center = false);
            translate([0, 0, -0.1]) cylinder(h = collar_h + 0.2, d = collar_id, center = false);
        }
    }
}

// Module: Tall rounded end tabs
module end_tabs() {
    tab_x = (plate_len - tab_d)/2;
    // Create rounded profile using hull of cylinder and sphere
    translate([tab_x, 0, plate_thick/2]) {
        hull() {
            cylinder(h = tab_h - tab_d/2, d = tab_d);
            translate([0, 0, tab_h - tab_d/2]) sphere(d = tab_d);
        }
    }
    translate([-tab_x, 0, plate_thick/2]) {
        hull() {
            cylinder(h = tab_h - tab_d/2, d = tab_d);
            translate([0, 0, tab_h - tab_d/2]) sphere(d = tab_d);
        }
    }
}

// Module: All through-holes for subtraction
module cut_holes() {
    // Central through-hole (spans plate and collar)
    translate([0, 0, -plate_thick/2 - collar_h - 1])
        cylinder(h = plate_thick + collar_h + tab_h + 4, d = center_hole_d, center = false);
    
    // Tab through-holes
    tab_x = (plate_len - tab_d)/2;
    translate([tab_x, 0, plate_thick/2])
        cylinder(h = tab_h + 2, d = tab_hole_d, center = false);
    translate([-tab_x, 0, plate_thick/2])
        cylinder(h = tab_h + 2, d = tab_hole_d, center = false);
}

// Main Assembly
difference() {
    union() {
        base_plate();
        underside_collar();
        end_tabs();
    }
    cut_holes();
}