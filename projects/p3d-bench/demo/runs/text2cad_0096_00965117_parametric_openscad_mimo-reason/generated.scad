// Parametric dimensions for the CAD model
// All dimensions in meters

// Main rectangular plate
plate_length = 0.225;
plate_width = 0.75;
plate_thickness = 0.0375;

// Through holes
hole_radius = 0.0281;
hole_x_offset = 0.1125;
hole_y_offsets = [0.0375, 0.7125];

// Upper rectangular solid
upper_solid_length = plate_length;
upper_solid_width = 0.5625;
upper_solid_front_offset = 0.0938;
upper_solid_back_offset = 0.0937;
upper_solid_height = 0.1125 - plate_thickness; // Height above plate

// Underside rectangular solid
underside_solid_length = plate_length;
underside_solid_width = 0.5625;
underside_solid_front_offset = 0.0938;
underside_solid_back_offset = 0.0937;
underside_solid_height = 0.375; // Extends downward

// Annular boss (lower section)
annular_outer_radius = 0.1078;
annular_inner_radius = 0.0563;
annular_height = 0.0938;
annular_x_offset = 0.1125;
annular_y_offset = 0.4687;
annular_shoulder_z = plate_thickness + upper_solid_height; // Base of boss

// Upper solid pin
pin_radius = 0.0563;
pin_x_offset = 0.1126;
pin_y_offset = 0.4688;
pin_height = 0.1594; // Height above shoulder

$fn = 100; // Smooth curves

// Main assembly
union() {
    // Main plate with through holes
    difference() {
        // Base plate
        cube([plate_length, plate_width, plate_thickness]);
        
        // Through holes near ends
        for (y_offset = hole_y_offsets) {
            translate([hole_x_offset, y_offset, -0.001])
                cylinder(h = plate_thickness + 0.002, r = hole_radius);
        }
    }
    
    // Upper rectangular solid on plate
    translate([0, upper_solid_front_offset, plate_thickness])
        cube([upper_solid_length, upper_solid_width, upper_solid_height]);
    
    // Underside rectangular solid below plate
    translate([0, underside_solid_front_offset, -underside_solid_height])
        cube([underside_solid_length, underside_solid_width, underside_solid_height]);
    
    // Annular boss (hollow ring)
    translate([annular_x_offset, annular_y_offset, annular_shoulder_z])
        difference() {
            // Outer cylinder
            cylinder(h = annular_height, r = annular_outer_radius);
            // Inner hole (subtract)
            translate([0, 0, -0.001])
                cylinder(h = annular_height + 0.002, r = annular_inner_radius);
        }
    
    // Upper solid pin
    translate([pin_x_offset, pin_y_offset, annular_shoulder_z])
        cylinder(h = pin_height, r = pin_radius);
}