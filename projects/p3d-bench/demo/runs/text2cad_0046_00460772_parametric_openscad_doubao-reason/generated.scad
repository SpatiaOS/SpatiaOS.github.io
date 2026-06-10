// Global Settings
$fn = 100; // Curve resolution for smooth circular geometry

// Main Base Parameters
base_length = 0.341352;      // X-axis length of main base plate
base_width = 0.199422;       // Y-axis width of main base plate
base_height = 0.065029;      // Total Z height of base section
base_extrusion_depth = 0.065;// Thickness of base solid section

// Base Upper Annulus Parameters
annulus_center_x = 0.2416;   // X offset from base left edge
annulus_center_y = 0.0997;   // Y offset from base front edge
annulus_outer_r = 0.0997;    // Outer radius of raised base annulus
annulus_inner_r = 0.0434;    // Inner radius of base through hole

// Tall Hollow Sleeve Parameters
sleeve_center_x = -0.0834;   // X offset from base left edge
sleeve_center_y = 0.0998;    // Y offset from base front edge
sleeve_outer_r = 0.1301;     // Outer radius of sleeve
sleeve_inner_r = 0.0867;     // Inner radius of sleeve hollow
sleeve_height = 0.2601;      // Total height above base datum (z=0)

// Projecting Stepped Arm Parameters
arm_length = 0.325145;       // X-axis length of arm section
arm_width = 0.260116;        // Y-axis width of arm section
arm_top_z = 0.1301;          // Z height of arm top surface
arm_lower_cut_height = 0.065;// Height of lower section removed from arm
arm_left_offset = -0.4086;   // Left edge X offset
arm_front_offset = -0.0303;  // Front edge Y offset

// Triangular Connecting Web Parameters
web_thickness = 0.0217;      // Y-axis thickness of web
web_x_start = 0.0466;        // Left X bound of web
web_span = 0.195087;         // X-axis span of web profile
web_y_start = 0.0781;        // Front Y bound of web
web_bottom_z = 0.1301;       // Z height of web base (matches arm top)
web_top_z = 0.2601;          // Z height of web top (matches sleeve top)

// Reusable Module: Hollow Annular Cylinder
module annular_cylinder(height, r_outer, r_inner, center=false) {
    difference() {
        cylinder(h=height, r=r_outer, center=center);
        cylinder(h=height + 0.002, r=r_inner, center=center); // Oversize to guarantee through cut
    }
}

// Main Model Assembly
difference() {
    union() {
        // 1. Main base solid plate
        cube([base_length, base_width, base_extrusion_depth]);
        
        // 2. Raised annular ring on base upper surface
        translate([annulus_center_x, annulus_center_y, base_extrusion_depth])
        annular_cylinder(
            height = base_height - base_extrusion_depth,
            r_outer = annulus_outer_r,
            r_inner = annulus_inner_r
        );
        
        // 3. Tall hollow sleeve assembly
        translate([sleeve_center_x, sleeve_center_y, 0])
        annular_cylinder(
            height = sleeve_height,
            r_outer = sleeve_outer_r,
            r_inner = sleeve_inner_r
        );
        
        // 4. Stepped raised arm section (lower cut omitted entirely for efficiency)
        translate([arm_left_offset, arm_front_offset, arm_lower_cut_height])
        cube([arm_length, arm_width, arm_top_z - arm_lower_cut_height]);
        
        // 5. Triangular reinforcing web between arm and sleeve
        translate([0, web_y_start, 0])
        rotate([90, 0, 0]) // Rotate profile to extrude along Y-axis
        linear_extrude(height = web_thickness)
        polygon(points = [
            [web_x_start, web_bottom_z],      // Anchor on top of arm
            [web_x_start + web_span, web_top_z], // Attachment point at sleeve top
            [web_x_start + web_span, web_bottom_z] // Base closure point
        ]);
    }
    
    // Cut operations
    // Through hole for base annulus (cuts through full base height)
    translate([annulus_center_x, annulus_center_y, -0.001])
    cylinder(h = base_height + 0.002, r = annulus_inner_r);
}