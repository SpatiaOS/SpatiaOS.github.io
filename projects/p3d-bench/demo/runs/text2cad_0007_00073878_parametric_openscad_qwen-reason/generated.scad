// Parametric Variables
ref_length = 0.375;
ref_width = 0.375;
ref_height = 0.25;

main_cx = 0.1875;
main_cy = 0.1875;
main_r = 0.1875;
main_h = 0.25;
main_bore_r = 0.075;

tab_cx = 0.1875;
tab_cy = -0.1875;
tab_r = 0.1875;
tab_h = 0.05;
tab_bore_r = 0.05;

cut_cx = 0.1875;
cut_cy = 0.1875;
cut_r = 0.075;
cut_h = 0.125;

$fn = 100;

// Main Assembly
difference() {
    // Union of main sleeve and shallow tab
    union() {
        translate([main_cx, main_cy, 0])
            cylinder(h=main_h, r=main_r, center=false);
        translate([tab_cx, tab_cy, 0])
            cylinder(h=tab_h, r=tab_r, center=false);
    }

    // Main central through bore
    translate([main_cx, main_cy, -0.1])
        cylinder(h=main_h + 0.2, r=main_bore_r, center=false);

    // Tab centered through opening
    translate([tab_cx, tab_cy, -0.1])
        cylinder(h=tab_h + 0.2, r=tab_bore_r, center=false);

    // Underside recess/cut (circular profile)
    translate([cut_cx, cut_cy, 0])
        cylinder(h=cut_h, r=cut_r, center=false);
}