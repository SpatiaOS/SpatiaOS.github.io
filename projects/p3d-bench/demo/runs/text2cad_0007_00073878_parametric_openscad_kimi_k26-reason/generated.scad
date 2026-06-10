// Main reference footprint
length = 0.375;
width = 0.375;
height = 0.25;

// Main annular cylinder parameters
main_ctr_x = 0.1875;
main_ctr_y = 0.1875;
main_outer_r = 0.1875;
main_bore_r = 0.075;

// Shallow attached tab parameters
tab_height = 0.05;
tab_ctr_y = -0.1875; // 0.1875 from front edge in negative direction
tab_outer_r = 0.1875;
tab_bore_r = 0.05;

// Underside recess parameters
recess_height = 0.125;
recess_x = 0.0597;
recess_y = 0.0433;
recess_w = 0.2557;
recess_d = 0.2884;

// Resolution for small curved features
$fn = 100;

// Main sleeve: tall annular cylinder on underside datum
module main_sleeve() {
    translate([main_ctr_x, main_ctr_y, 0])
    difference() {
        cylinder(h = height, r = main_outer_r);
        // Central through bore
        cylinder(h = height, r = main_bore_r);
    }
}

// Shallow tab: short annular cylinder attached to front of main sleeve
module shallow_tab() {
    translate([main_ctr_x, tab_ctr_y, 0])
    difference() {
        cylinder(h = tab_height, r = tab_outer_r);
        // Centered through opening
        cylinder(h = tab_height, r = tab_bore_r);
    }
}

// Underside recess: rectangular pocket cut into bottom of main sleeve,
// centered on main axis, leaving the central bore wall intact
module underside_recess() {
    translate([recess_x, recess_y, 0])
        cube([recess_w, recess_d, recess_height]);
}

// Combine solids and subtract recess
difference() {
    union() {
        main_sleeve();
        shallow_tab();
    }
    underside_recess();
}