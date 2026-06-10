// Parameters
$fn = 100;
eps = 0.0005;

// Main base reference
base_length = 0.395255;
base_width  = 0.602190;
base_height = 0.109489;
main_depth  = 0.109500;

// D-frame wall
frame_wall = 0.065700;

// Shallow round protrusion footprint
tab_length = 0.259658;
tab_width  = 0.197373;
tab_height = 0.054745;

tab_left_offset  = 0.000000;
tab_right_offset = 0.135600;
tab_front_offset = -0.147800;
tab_back_offset  = 0.552600;

// Coaxial round tab and through-hole
tab_axis_x = 0.094200;
tab_axis_y = -0.082100;
tab_outer_r = 0.065700;
tab_hole_r  = 0.028500;

// Derived coordinates
tab_x0 = tab_left_offset;
tab_x1 = base_length - tab_right_offset;
tab_y0 = tab_front_offset;
tab_y1 = base_width - tab_back_offset;

// 2D outer D profile: flat rear, straight sides, rounded front
module d_profile_2d(len, wid) {
    r = len / 2;
    union() {
        translate([0, r])
            square([len, wid - r]);
        translate([r, r])
            circle(r=r);
    }
}

// 2D D-shaped frame with one continuous through-opening
module d_frame_2d(len, wid, wall) {
    r = len / 2;
    difference() {
        d_profile_2d(len, wid);
        union() {
            translate([wall, r])
                square([len - 2*wall, wid - wall - r]);
            translate([r, r])
                circle(r=r - wall);
        }
    }
}

// Main full-depth D-frame solid
module main_frame() {
    linear_extrude(height=main_depth)
        d_frame_2d(base_length, base_width, frame_wall);
}

// Shallow added round protrusion and connector band
module shallow_tab_solid() {
    linear_extrude(height=tab_height)
        union() {
            translate([tab_axis_x, tab_axis_y])
                circle(r=tab_outer_r);
            translate([tab_x0, tab_axis_y])
                square([tab_x1 - tab_x0, tab_y1 - tab_axis_y]);
        }
}

// Final model
difference() {
    union() {
        main_frame();
        shallow_tab_solid();
    }

    // Concentric circular opening through shallow protrusion
    translate([tab_axis_x, tab_axis_y, -eps])
        cylinder(h=tab_height + 2*eps, r=tab_hole_r);
}