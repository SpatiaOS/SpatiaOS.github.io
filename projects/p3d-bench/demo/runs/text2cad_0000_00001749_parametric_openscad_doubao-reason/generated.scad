// Global Settings
$fn = 100; // Smooth curve resolution

// Main Base & Frame Parameters
main_length = 0.395255;
main_width = 0.60219;
main_height = 0.1095;
frame_thickness = 0.05; // Uniform frame wall thickness
d_straight_length = 0.0942; // Length of straight portion of D shape (matches protrusion center offset)

// Shallow Protrusion Parameters
protrusion_height = 0.054745;
protrusion_x_min = 0;
protrusion_x_max = 0.1356;
protrusion_y_min = -0.1478;
protrusion_y_max = 0.5526;
round_tab_center = [0.0942, -0.0821]; // Shared center for tab and hole
round_tab_outer_r = 0.0657;
round_tab_hole_r = 0.0285;

// 2D D Shape Module (fits exactly in main footprint)
module d_shape_2d() {
    union() {
        // Straight rectangular portion of D
        square([d_straight_length, main_width]);
        // Semicircular curved portion of D
        translate([d_straight_length, main_width/2])
        scale([1, 1, 0]) // Force 2D
        sphere(r=main_width/2);
    }
}

// Main D Frame Module
module main_d_frame() {
    difference() {
        // Outer solid D shape
        linear_extrude(height=main_height)
        d_shape_2d();
        // Inner cutout for through opening
        linear_extrude(height=main_height + 0.1, center=true)
        offset(r=-frame_thickness)
        d_shape_2d();
    }
}

// Shallow Protrusion with through hole Module
module shallow_protrusion() {
    difference() {
        union() {
            // Rectangular base of protrusion
            linear_extrude(height=protrusion_height)
            square([
                protrusion_x_max - protrusion_x_min,
                protrusion_y_max - protrusion_y_min
            ]);
            // Rounded tab portion
            translate(round_tab_center)
            linear_extrude(height=protrusion_height)
            circle(r=round_tab_outer_r);
        }
        // Concentric through hole in tab
        translate(round_tab_center)
        linear_extrude(height=protrusion_height + 0.1, center=true)
        circle(r=round_tab_hole_r);
    }
}

// Final Assembly
union() {
    main_d_frame();
    shallow_protrusion();
}