// Standard 80mm Axial PC Fan Model
// All dimensions in millimeters, following standard ATX fan specifications

// ============================== PARAMETERS ==============================
fan_size = 80;               // Outer square dimension of mounting flanges
fan_thickness = 25;          // Total overall thickness of the fan
flange_thickness = 2;        // Thickness of top/bottom mounting flanges
mounting_hole_spacing = 71.5;// Center-to-center distance between mounting holes
mounting_hole_dia = 4.5;     // Diameter of through mounting holes
frame_outer_dia = 74;        // Outer diameter of the main fan frame ring
frame_inner_dia = 68;        // Inner diameter of frame (airflow opening)
hub_diameter = 28;           // Diameter of central motor hub
num_blades = 7;              // Number of impeller blades
blade_pitch = 22;            // Angle of blade pitch for airflow
blade_thickness = 1.6;       // Thickness of individual fan blades
$fn = 100;                   // Global curve smoothing value
// =========================================================================

module fan_blade() {
    // Curved 2D profile of a single fan blade
    rotate([0, blade_pitch, 0])
    linear_extrude(height=blade_thickness, center=true, convexity=2)
    polygon(points=[
        [hub_diameter/2 + 0.5, -1.2],
        [frame_inner_dia/2 - 2.5, -4],
        [frame_inner_dia/2 - 1, 3.5],
        [hub_diameter/2 + 0.5, 1]
    ]);
}

module fan_frame() {
    difference() {
        union() {
            // Top mounting flange
            translate([0, 0, fan_thickness/2 - flange_thickness/2])
            cube([fan_size, fan_size, flange_thickness], center=true);
            
            // Bottom mounting flange
            translate([0, 0, -fan_thickness/2 + flange_thickness/2])
            cube([fan_size, fan_size, flange_thickness], center=true);
            
            // Corner connecting standoffs between flanges
            corner_offs = mounting_hole_spacing/2;
            for (x = [-corner_offs, corner_offs], y = [-corner_offs, corner_offs]) {
                translate([x, y, 0])
                cube([6, 6, fan_thickness - 2*flange_thickness], center=true);
            }
            
            // Main cylindrical outer frame ring
            cylinder(h=fan_thickness - 2*flange_thickness, d=frame_outer_dia, center=true);
        }
        
        // Cut central airflow opening through entire frame
        cylinder(h=fan_thickness + 2, d=frame_inner_dia, center=true);
        
        // Drill through mounting holes at all 4 corners
        corner_offs = mounting_hole_spacing/2;
        for (x = [-corner_offs, corner_offs], y = [-corner_offs, corner_offs]) {
            translate([x, y, 0])
            cylinder(h=fan_thickness + 2, d=mounting_hole_dia, center=true);
        }
    }
}

// Main fan assembly
union() {
    // Outer frame structure
    fan_frame();
    
    // Central motor hub
    cylinder(h=fan_thickness - 2*flange_thickness, d=hub_diameter, center=true);
    
    // Circular array of fan blades
    for (angle = [0 : 360/num_blades : 359.9]) {
        rotate(angle)
        fan_blade();
    }
}