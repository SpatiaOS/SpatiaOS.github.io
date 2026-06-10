// ============================================
// Hose Reel - Parametric 3D Model
// Based on image analysis
// ============================================

// === Global Resolution ===
$fn = 80;

// === Main Dimensions (in mm) ===
// Flange/Plate parameters
flange_diameter = 200;
flange_thickness = 8;
flange_gap = 160;  // Distance between inner faces of flanges

// Drum parameters
drum_diameter = 110;
drum_length = flange_gap;

// Hose parameters
hose_outer_diameter = 16;
hose_wall_thickness = 3;
hose_coils = 8;
hose_coil_spacing = hose_outer_diameter * 0.95; // Slight overlap for realism

// Hose extension parameters
hose_extension_length = 180;
hose_bend_radius = 40;

// Connector (top) parameters
connector_hex_size = 22;
connector_height = 25;
nozzle_diameter = 10;
nozzle_length = 15;

// Valve (bottom) parameters
valve_body_diameter = 20;
valve_body_height = 35;
valve_handle_length = 35;
valve_handle_width = 8;
valve_spout_length = 25;

// Mounting holes parameters
mounting_hole_diameter = 8;
mounting_hole_pattern_radius = 60;
mounting_hole_count = 4;

// === Helper Modules ===

// Hexagonal prism for connector
module hexagon(size, height) {
    cylinder(h = height, r = size * 0.57735, $fn = 6);
}

// Single flange plate with mounting holes
module flange_plate(diameter, thickness, with_holes = false) {
    difference() {
        // Main circular plate
        cylinder(h = thickness, d = diameter, center = false);
        
        // Optional mounting holes
        if (with_holes) {
            for (i = [0 : mounting_hole_count - 1]) {
                angle = i * 360 / mounting_hole_count + 45; // Offset for X pattern
                rotate([0, 0, angle])
                translate([mounting_hole_pattern_radius, 0, -1])
                cylinder(h = thickness + 2, d = mounting_hole_diameter, center = false);
            }
        }
    }
}

// Central drum cylinder
module drum(diameter, length) {
    cylinder(h = length, d = diameter, center = false);
}

// Coiled hose around drum
module coiled_hose(drum_d, num_coils, hose_d) {
    // Calculate coil radii - multiple layers
    coil_start_radius = drum_d / 2 + hose_d / 2;
    
    // Create multiple rings to simulate coiled hose
    for (coil = [0 : num_coils - 1]) {
        // Alternate between two radii to create layered appearance
        layer = floor(coil / 4);
        position_in_layer = coil % 4;
        
        coil_radius = coil_start_radius + layer * hose_d * 0.7 + position_in_layer * hose_d * 0.25;
        
        translate([0, 0, hose_d * 0.6 + position_in_layer * hose_d * 0.9])
        rotate_extrude()
        translate([coil_radius, 0, 0])
        circle(d = hose_d);
    }
}

// Hose extension going upward with bend
module upper_hose_extension() {
    // Vertical section from drum
    translate([-flange_gap/2 - flange_thickness - 5, 0, drum_diameter/2 + 20])
    rotate([0, 90, 0])
    cylinder(h = 30, d = hose_outer_diameter);
    
    // Curved section (approximated with segments)
    for (i = [0:8]) {
        angle = i * 90 / 8;
        radius = hose_bend_radius;
        translate([-flange_gap/2 - flange_thickness - 35, 0, drum_diameter/2 + 20])
        translate([0, -radius * sin(angle), radius * (1 - cos(angle))])
        rotate([0, 90 + angle, 0])
        cylinder(h = 10, d = hose_outer_diameter);
    }
    
    // Straight vertical section
    translate([-flange_gap/2 - flange_thickness - 35 - hose_bend_radius, 0, 
               drum_diameter/2 + 20 + hose_bend_radius])
    cylinder(h = hose_extension_length - hose_bend_radius, d = hose_outer_diameter);
}

// Top connector assembly
module top_connector() {
    x_pos = -flange_gap/2 - flange_thickness - 35 - hose_bend_radius;
    y_pos = 0;
    z_pos = drum_diameter/2 + 20 + hose_bend_radius + hose_extension_length - hose_bend_radius;
    
    translate([x_pos, y_pos, z_pos]) {
        // Connector base collar
        cylinder(h = 8, d = hose_outer_diameter + 6);
        
        // Hexagonal body
        translate([0, 0, 8])
        hexagon(connector_hex_size, connector_height - 8);
        
        // Nozzle tip
        translate([0, 0, connector_height])
        cylinder(h = nozzle_length, d = nozzle_diameter);
        
        // Small tip at end
        translate([0, 0, connector_height + nozzle_length])
        cylinder(h = 5, d = nozzle_diameter - 2);
    }
}

// Lower hose extension with valve
module lower_hose_extension() {
    // Hose from bottom of drum
    translate([flange_gap/2 + flange_thickness + 5, 0, -drum_diameter/2 - 10])
    rotate([0, -90, 0])
    cylinder(h = 40, d = hose_outer_diameter);
    
    // Vertical section down
    translate([flange_gap/2 + flange_thickness + 45, 0, -drum_diameter/2 - 10])
    cylinder(h = 60, d = hose_outer_diameter);
}

// Valve assembly
module valve_assembly() {
    x_pos = flange_gap/2 + flange_thickness + 45;
    y_pos = 0;
    z_pos = -drum_diameter/2 - 70;
    
    translate([x_pos, y_pos, z_pos]) {
        // Connection collar
        cylinder(h = 10, d = hose_outer_diameter + 6);
        
        // Valve body
        translate([0, 0, -valve_body_height])
        cylinder(h = valve_body_height, d = valve_body_diameter);
        
        // Valve handle hub
        translate([0, 0, -valve_body_height/2])
        cylinder(h = 10, d = 15);
        
        // Valve handle
        translate([0, 0, -valve_body_height/2 + 5])
        rotate([0, 0, 30])
        hull() {
            cylinder(h = valve_handle_width, d = 10, center = true);
            translate([valve_handle_length, 0, 0])
            cylinder(h = valve_handle_width, d = 8, center = true);
        }
        
        // Spout/nozzle
        translate([0, 0, -valve_body_height - valve_spout_length])
        cylinder(h = valve_spout_length, d1 = valve_body_diameter - 4, d2 = 10);
        
        // Spout tip
        translate([0, 0, -valve_body_height - valve_spout_length - 8])
        cylinder(h = 8, d = 8);
    }
}

// === Main Assembly ===
module hose_reel() {
    // Position flanges centered on origin
    flange_start_z = -flange_gap/2;
    flange_end_z = flange_gap/2;
    
    // Rear flange (back plate)
    translate([0, 0, flange_start_z - flange_thickness])
    flange_plate(flange_diameter, flange_thickness, with_holes = false);
    
    // Front flange (with mounting holes)
    translate([0, 0, flange_end_z])
    flange_plate(flange_diameter, flange_thickness, with_holes = true);
    
    // Central drum
    translate([0, 0, flange_start_z])
    drum(drum_diameter, drum_length);
    
    // Coiled hose on drum
    translate([0, 0, flange_start_z + 5])
    coiled_hose(drum_diameter, hose_coils, hose_outer_diameter);
    
    // Upper hose extension and connector
    upper_hose_extension();
    top_connector();
    
    // Lower hose extension and valve
    lower_hose_extension();
    valve_assembly();
}

// === Render the model ===
hose_reel();