// Parametric Model: Complex Base with Sleeve and Openings
// All dimensions in inches

// --- Parameters ---
base_length = 0.375;
base_width = 0.75;
base_thickness = 0.013393;
second_solid_reach = 0.2277; // from base datum

// Sleeve/Post parameters
sleeve_length = 0.066964;
sleeve_width = 0.133929;
sleeve_height = 0.214286;
sleeve_extrusion = 0.2143;
sleeve_total_reach = 0.442; // from base datum
sleeve_offset_left = 0.308;
sleeve_offset_right = 0;
sleeve_offset_front = 0.308;
sleeve_offset_back = 0.3081;

// Lower continuation parameters
lower_depth = 0.2143;
lower_start_below_base = 0.2277; // below base underside
lower_end_below_base = 0.0134;   // below base underside

// Circular opening parameters
hole_radius = 0.0067;
hole_axis_left = 0.3616;
hole1_axis_front = 0.6828;
hole2_axis_front = 0.0672;
hole_band_start = 0.1674; // above base underside
hole_band_end = 0.1808;   // above base underside
hole_cut_depth = 0.0134;

// Derived parameters
lower_z_start = -lower_start_below_base; // negative = below base datum
lower_z_end = -lower_end_below_base;
sleeve_z_start = second_solid_reach;
sleeve_z_end = sleeve_z_start + sleeve_extrusion;
hole_band_mid = (hole_band_start + hole_band_end) / 2;

// --- Modules ---
// Create base with rounded/arc footprint (ellipse approximation)
module base_plate() {
    // Use linear extrude with scale to create tapered/arc shape
    // Scale factors create elliptical curvature in XY
    scale_x = 1.0;
    scale_y = 1.0;
    linear_extrude(height=base_thickness, scale=[scale_x, scale_y])
        resize([base_length, base_width]) circle(d=1);
}

// Create second solid with inner openings
module second_solid() {
    difference() {
        // Outer volume
        linear_extrude(height=second_solid_reach)
            resize([base_length, base_width]) circle(d=1);
        
        // Inner openings - create hollow regions
        // Using difference to create openings
        translate([0, 0, -0.001])
        linear_extrude(height=second_solid_reach + 0.002)
            // Create inner loop region (example rectangular opening)
            translate([base_length*0.15, base_width*0.15])
                square([base_length*0.7, base_width*0.7]);
    }
}

// Create raised sleeve/post with hollow interior
module raised_sleeve() {
    sleeve_x = sleeve_offset_left;
    sleeve_y = sleeve_offset_front;
    
    difference() {
        // Solid sleeve material
        translate([sleeve_x, sleeve_y, sleeve_z_start])
            cube([sleeve_length, sleeve_width, sleeve_extrusion]);
        
        // Inner void/slot - elongated opening
        // Create hollow interior with walls
        wall_thickness = 0.008;
        translate([sleeve_x + wall_thickness, 
                   sleeve_y + wall_thickness, 
                   sleeve_z_start - 0.001])
            cube([sleeve_length - 2*wall_thickness,
                  sleeve_width - 2*wall_thickness,
                  sleeve_extrusion + 0.002]);
    }
}

// Create lower continuation beneath sleeve
module lower_continuation() {
    // Shares right edge with sleeve, contained within base footprint
    lower_x = sleeve_offset_left; // Same X as sleeve
    lower_y = sleeve_offset_front; // Same Y as sleeve
    lower_length = sleeve_length;
    lower_width = sleeve_width;
    
    translate([lower_x, lower_y, lower_z_start])
        cube([lower_length, lower_width, lower_depth]);
}

// Create circular openings
module circular_openings() {
    // Two holes at specified positions
    for (y_pos = [hole1_axis_front, hole2_axis_front]) {
        translate([hole_axis_left, y_pos, hole_band_start])
            cylinder(h=hole_cut_depth, r=hole_radius, $fn=50);
    }
}

// --- Main Assembly ---
union() {
    // Base plate
    color("LightGray") base_plate();
    
    // Second solid with openings
    color("Gray") second_solid();
    
    // Raised sleeve
    color("DarkGray") raised_sleeve();
    
    // Lower continuation
    color("SlateGray") lower_continuation();
}

// Subtract circular openings from the assembly
difference() {
    children(0); // Reference the union above
    circular_openings();
}