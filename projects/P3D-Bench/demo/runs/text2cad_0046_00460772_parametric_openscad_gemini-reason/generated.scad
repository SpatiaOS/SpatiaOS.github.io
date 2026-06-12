// --- Parametric Variables ---

// Global resolution for smooth curves
$fn = 100;

// Base dimensions
base_length = 0.341352;
base_width = 0.199422;
base_height = 0.065029;

// Base rounded annular section (right side)
ring_x = 0.2416;
ring_y = 0.0997;
ring_r_out = 0.0997;
ring_r_in = 0.0434;

// Tall hollow sleeve (left side)
sleeve_x = -0.0834;
sleeve_y = 0.0998;
sleeve_r_out = 0.1301;
sleeve_r_in = 0.0867;
sleeve_height = 0.2601;

// Projecting arm section
arm_length = 0.325145;
arm_width = 0.260116;
arm_z_offset = 0.065029; // Floating above the 0 to 0.065 gap
arm_height = 0.130058 - arm_z_offset; 

// Triangular web
web_run = 0.108382;
web_thickness = 0.0217;
web_x_start = 0.0466;
web_y_center = (0.0781 + 0.0996) / 2; // Centered between front/back offsets
web_z_start = 0.065029;
web_z_end = 0.2601;

// --- Modules ---

// Main base with the rounded right end and through-hole
module base_solid() {
    difference() {
        union() {
            // Main rectangular body
            translate([0, 0, 0])
                cube([ring_x, base_width, base_height]);
            
            // Rounded annular section at the right end
            translate([ring_x, ring_y, 0])
                cylinder(h=base_height, r=ring_r_out);
        }
        // Inner profile kept open through the 0.065 thickness
        translate([ring_x, ring_y, -0.1])
            cylinder(h=base_height + 0.2, r=ring_r_in);
    }
}

// Solid cylinder for the tall sleeve (hole cut later to clear arm intersection)
module tall_sleeve() {
    translate([sleeve_x, sleeve_y, 0])
        cylinder(h=sleeve_height, r=sleeve_r_out);
}

// Raised stepped tier arm spanning between the sleeve and the base
module projecting_arm() {
    translate([sleeve_x, sleeve_y - arm_width/2, arm_z_offset])
        cube([arm_length, arm_width, arm_height]);
}

// Narrow triangular web connecting the arm to the tall sleeve
module triangular_web() {
    translate([0, web_y_center, 0])
        rotate([90, 0, 0])
        linear_extrude(height=web_thickness, center=true)
        polygon([
            [web_x_start, web_z_start],
            [web_x_start + web_run, web_z_start],
            [web_x_start, web_z_end]
        ]);
}

// --- Main Assembly ---

difference() {
    // Combine all solid bodies
    union() {
        base_solid();
        tall_sleeve();
        projecting_arm();
        triangular_web();
    }
    
    // Ensure the tall sleeve remains hollow through its entire height,
    // cutting through any overlapping geometry from the arm or web.
    translate([sleeve_x, sleeve_y, -0.1])
        cylinder(h=sleeve_height + 0.2, r=sleeve_r_in);
}