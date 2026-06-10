// ================================================
// Vintage Winch / Hoisting Mechanism
// Simplified for reliable STL export
// ================================================

$fn = 48;

// === Base Parameters ===
base_length = 110;
base_width = 75;
base_thickness = 5;
flange_pad = 8;
flange_hole_dia = 4;

// === Support Pedestal Parameters ===
support_thickness = 8;
support_base_width = 58;
shaft_center_z = 52;
support_top_dia = 24;

// === Shaft ===
shaft_dia = 8;
shaft_total_len = 125;

// === Large Flywheel (right/front) ===
lfw_od = 84;
lfw_thick = 7;
lfw_rim_w = 6;
lfw_hub_od = 20;
lfw_hub_len = 10;
lfw_spoke_w = 5;
lfw_hole_dia = 18;
lfw_hole_orbit = 25;
lfw_num_holes = 4;

// === Small Flywheel (left/middle) ===
sfw_od = 70;
sfw_thick = 7;
sfw_rim_w = 5;
sfw_hub_od = 18;
sfw_hub_len = 8;
sfw_spoke_w = 4.5;
sfw_hole_dia = 15;
sfw_hole_orbit = 20;
sfw_num_holes = 4;

// === Grooved Cable Drum ===
drum_od = 50;
drum_length = 44;
drum_flange_od = 58;
drum_flange_thick = 3;
drum_groove_count = 18;
drum_groove_depth = 1.3;

// === Top Port/Pipe ===
port_dia = 8;
port_height = 12;
port_cap_dia = 11;
port_cap_h = 3;

// === Crank/Crosshead ===
crank_pin_offset = 14;
crank_block_w = 10;
crank_block_h = 12;
crank_block_d = 14;
crank_pin_dia = 5;

// === Layout positions along X (shaft) axis ===
drum_center_x = -28;
left_support_x = -2;
small_fw_x = 5;
crank_x = 20;
right_support_x = 30;
large_fw_x = 38;

// ================================================
// MODULES
// ================================================

// Simple base plate with corner tabs
module base_plate() {
    difference() {
        union() {
            // Main plate
            translate([0, 0, base_thickness/2])
                cube([base_length, base_width, base_thickness], center=true);
            
            // Raised edge lip
            translate([0, 0, base_thickness]) {
                difference() {
                    cube([base_length - 4, base_width - 4, 2], center=true);
                    cube([base_length - 10, base_width - 10, 3], center=true);
                }
            }
            
            // Corner pads - simple cubes
            for (sx = [-1, 1])
                for (sy = [-1, 1])
                    translate([sx*(base_length/2 + 3), sy*(base_width/2 + 3), base_thickness/2])
                        cylinder(d=14, h=base_thickness, center=true);
        }
        // Mounting holes
        for (sx = [-1, 1])
            for (sy = [-1, 1])
                translate([sx*(base_length/2 + 3), sy*(base_width/2 + 3), -1])
                    cylinder(d=flange_hole_dia, h=base_thickness + 4);
    }
}

// Support pedestal - simplified
module support_pedestal() {
    difference() {
        union() {
            // Lower tapered body using linear_extrude
            translate([0, 0, base_thickness])
                linear_extrude(height = shaft_center_z - base_thickness - support_top_dia/2, scale=[1, 0.5])
                    square([support_thickness, support_base_width], center=true);
            
            // Upper cylindrical bearing area
            translate([0, 0, shaft_center_z])
                rotate([0, 90, 0])
                    cylinder(d=support_top_dia + 4, h=support_thickness, center=true);
            
            // Transition fill
            translate([0, 0, shaft_center_z - support_top_dia/2])
                linear_extrude(height = support_top_dia/2)
                    square([support_thickness, support_base_width * 0.5], center=true);
        }
        // Shaft bore
        translate([0, 0, shaft_center_z])
            rotate([0, 90, 0])
                cylinder(d=shaft_dia + 1, h=support_thickness + 4, center=true);
        
        // Trim below base
        translate([0, 0, -50])
            cube([200, 200, 100], center=true);
    }
}

// Flywheel with rim, hub, spokes, and lightening holes
module flywheel(od, thick, rim_w, hub_od, hub_len, spoke_w, 
                hole_dia, hole_orbit, num_holes) {
    rotate([0, 90, 0])
    difference() {
        union() {
            // Outer rim ring
            difference() {
                cylinder(d=od, h=thick, center=true);
                cylinder(d=od - 2*rim_w, h=thick + 1, center=true);
            }
            
            // Hub
            cylinder(d=hub_od, h=hub_len, center=true);
            
            // Spokes connecting hub to rim
            for (i = [0 : num_holes - 1]) {
                angle = i * (360 / num_holes) + (360 / (num_holes * 2));
                rotate([0, 0, angle])
                    translate([0, 0, 0])
                        cube([od - rim_w, spoke_w, thick], center=true);
            }
        }
        // Central shaft hole
        cylinder(d=shaft_dia, h=hub_len + 4, center=true);
        
        // Lightening holes between spokes
        for (i = [0 : num_holes - 1]) {
            angle = i * (360 / num_holes);
            translate([hole_orbit * cos(angle), hole_orbit * sin(angle), 0])
                cylinder(d=hole_dia, h=thick + 4, center=true);
        }
    }
}

// Grooved cable drum - simplified grooves
module cable_drum() {
    usable_len = drum_length - 2*drum_flange_thick;
    pitch = usable_len / drum_groove_count;
    
    rotate([0, 90, 0])
    difference() {
        union() {
            // Main barrel
            cylinder(d=drum_od, h=drum_length, center=true);
            
            // End flanges
            for (s = [-1, 1])
                translate([0, 0, s * (drum_length/2 - drum_flange_thick/2)])
                    cylinder(d=drum_flange_od, h=drum_flange_thick, center=true);
        }
        // Central bore
        cylinder(d=shaft_dia + 1, h=drum_length + 10, center=true);
        
        // Grooves as simple V-cuts using thin cylinders subtracted
        for (i = [0 : drum_groove_count - 1]) {
            z = -usable_len/2 + pitch/2 + i * pitch;
            difference() {
                translate([0, 0, z])
                    cylinder(d=drum_od + 1, h=pitch * 0.35, center=true);
                translate([0, 0, z])
                    cylinder(d=drum_od - 2*drum_groove_depth, h=pitch + 1, center=true);
            }
        }
    }
}

// Top pipe/port on drum
module drum_port() {
    // Main pipe
    cylinder(d=port_dia, h=port_height);
    // Cap at top
    translate([0, 0, port_height])
        cylinder(d=port_cap_dia, h=port_cap_h);
    // Base flange
    cylinder(d=port_cap_dia, h=2);
}

// Crank crosshead mechanism
module crank_mechanism() {
    // Crosshead block
    translate([0, crank_pin_offset, 0]) {
        cube([crank_block_w, crank_block_d, crank_block_h], center=true);
        // Guide rails
        cube([crank_block_w + 4, crank_block_d * 0.6, crank_block_h * 0.5], center=true);
    }
    
    // Connecting arm
    translate([0, crank_pin_offset/2, 0])
        cube([crank_block_w * 0.6, crank_pin_offset + 4, 4], center=true);
    
    // Crank disc on shaft
    rotate([0, 90, 0])
        difference() {
            cylinder(d=16, h=5, center=true);
            cylinder(d=shaft_dia, h=6, center=true);
        }
}

// ================================================
// ASSEMBLY
// ================================================

color("LightSteelBlue") {
    // --- Base ---
    base_plate();
    
    // --- Support Pedestals ---
    translate([left_support_x, 0, 0])
        support_pedestal();
    translate([right_support_x, 0, 0])
        support_pedestal();
    
    // --- Main Shaft ---
    translate([0, 0, shaft_center_z])
        rotate([0, 90, 0])
            cylinder(d=shaft_dia, h=shaft_total_len, center=true);
    
    // --- Grooved Cable Drum ---
    translate([drum_center_x, 0, shaft_center_z])
        cable_drum();
    
    // --- Small Flywheel ---
    translate([small_fw_x, 0, shaft_center_z])
        flywheel(sfw_od, sfw_thick, sfw_rim_w, sfw_hub_od, sfw_hub_len,
                 sfw_spoke_w, sfw_hole_dia, sfw_hole_orbit, sfw_num_holes);
    
    // --- Large Flywheel ---
    translate([large_fw_x, 0, shaft_center_z])
        flywheel(lfw_od, lfw_thick, lfw_rim_w, lfw_hub_od, lfw_hub_len,
                 lfw_spoke_w, lfw_hole_dia, lfw_hole_orbit, lfw_num_holes);
    
    // --- Crank/Crosshead Mechanism ---
    translate([crank_x, 0, shaft_center_z])
        crank_mechanism();
    
    // --- Port on Top of Drum ---
    translate([drum_center_x, 0, shaft_center_z + drum_od/2])
        drum_port();
    
    // --- Shaft extension stub ---
    translate([small_fw_x - 8, 0, shaft_center_z - 15])
        rotate([0, 90, 0])
            cylinder(d=5, h=12);
}