// Steam Engine Model - Parametric OpenSCAD Design
// Based on analysis of the provided 3D model image

// ============================================
// PARAMETERS (all dimensions in mm)
// ============================================

// Global resolution
$fn = 80;

// Base dimensions
base_length = 90;
base_width = 55;
base_height = 8;
base_chamfer = 3;

// Cylinder assembly
cylinder_diameter = 32;
cylinder_length = 48;
fin_count = 24;
fin_thickness = 1.2;
fin_spacing = 1.8;
cylinder_end_cap_diameter = 36;
cylinder_end_cap_length = 12;

// Valve/Knob on cylinder
valve_stem_height = 8;
valve_knob_diameter = 10;
valve_knob_height = 6;

// Flywheel parameters
flywheel_outer_diameter = 58;
flywheel_inner_diameter = 44; // where cutouts are
flywheel_hub_diameter = 16;
flywheel_hub_length = 18;
flywheel_rim_thickness = 7;
flywheel_cutout_count = 5;
flywheel_cutout_diameter = 12;

// Shaft/Crankshaft
main_shaft_diameter = 8;
crank_pin_diameter = 6;
crank_throw = 10;

// Bearing block
bearing_block_width = 20;
bearing_block_height = 25;
bearing_block_depth = 16;

// Positioning offsets
cylinder_offset_x = -35;
cylinder_offset_y = 0;
cylinder_offset_z = base_height + bearing_block_height + 5;

front_flywheel_x = 15;
rear_flywheel_x = 40;
flywheel_z = base_height + bearing_block_height + flywheel_outer_diameter/2 - 5;

// ============================================
// MODULES
// ============================================

// Base plate with chamfered edges
module engine_base() {
    difference() {
        // Main base body
        translate([0, 0, base_height/2])
            cube([base_length, base_width, base_height], center=true);
        
        // Bottom edge chamfers (4 corners)
        for (x = [-base_length/2 + base_chamfer, base_length/2 - base_chamfer])
            for (y = [-base_width/2 + base_chamfer, base_width/2 - base_chamfer])
                translate([x, y, -0.5])
                    cylinder(h=base_height+1, r=base_chamfer);
        
        // Side edge fillets (simplified as cylinders along edges)
        // Front and back edges
        for (y = [-base_width/2 + base_chamfer, base_width/2 - base_chamfer]) {
            translate([0, y, base_height/2])
                rotate([90, 0, 0])
                    cylinder(h=base_width, r=base_chamfer, center=true);
        }
    }
    
    // Add raised center section for mounting
    translate([5, 0, base_height])
        cube([50, 30, 6], center=true);
}

// Finned cylinder (heat exchanger style)
module finned_cylinder() {
    union() {
        // Main cylinder body with fins
        translate([-cylinder_length/2, 0, 0]) {
            for (i = [0 : fin_count-1]) {
                translate([i * (fin_thickness + fin_spacing), 0, 0])
                    cylinder(h=fin_thickness, d=cylinder_diameter, center=true);
            }
        }
        
        // Smooth end cap (right side - toward engine)
        translate([cylinder_length/2 + cylinder_end_cap_length/2 - fin_thickness, 0, 0])
            cylinder(h=cylinder_end_cap_length, d=cylinder_end_cap_diameter, center=true);
        
        // Left end cap (closed)
        translate([-cylinder_length/2 - 4, 0, 0])
            cylinder(h=8, d=cylinder_diameter, center=true);
        
        // Valve stem on top
        translate([cylinder_length/4, 0, cylinder_diameter/2]) {
            cylinder(h=valve_stem_height, d=4, center=false);
            translate([0, 0, valve_stem_height])
                cylinder(h=valve_knob_height, d=valve_knob_diameter, center=false);
        }
    }
}

// Single flywheel with cutouts
module flywheel() {
    difference() {
        union() {
            // Outer rim
            cylinder(h=flywheel_rim_thickness, d=flywheel_outer_diameter, center=true);
            
            // Hub
            cylinder(h=flywheel_hub_length, d=flywheel_hub_diameter, center=true);
            
            // Spokes (connecting hub to rim) - simplified as solid disk with cutouts
            cylinder(h=flywheel_rim_thickness, d=flywheel_inner_diameter, center=true);
        }
        
        // Cutouts (holes in the wheel)
        cutout_radius = flywheel_outer_diameter/2 - 6;
        for (i = [0 : flywheel_cutout_count-1]) {
            angle = i * (360 / flywheel_cutout_count);
            translate([
                cos(angle) * cutout_radius * 0.55,
                sin(angle) * cutout_radius * 0.55,
                0
            ])
                cylinder(h=flywheel_rim_thickness + 1, d=flywheel_cutout_diameter, center=true);
        }
        
        // Center hole for shaft
        cylinder(h=flywheel_hub_length + 2, d=main_shaft_diameter + 1, center=true);
    }
}

// Crankshaft assembly
module crankshaft() {
    // Main shaft through both flywheels
    cylinder(h=100, d=main_shaft_diameter, center=true);
    
    // Crank throw/eccentric
    translate([crank_throw/2, 0, 0])
        cylinder(h=12, d=crank_pin_diameter * 1.8, center=true);
    
    // Crank pin
    translate([crank_throw, 0, 0])
        cylinder(h=20, d=crank_pin_diameter, center=true);
}

// Bearing block/support
module bearing_support(x_pos) {
    translate([x_pos, 0, base_height + bearing_block_height/2]) {
        difference() {
            // Block body
            cube([bearing_block_width, bearing_block_depth, bearing_block_height], center=true);
            
            // Hole for shaft
            rotate([0, 90, 0])
                cylinder(h=bearing_block_width + 2, d=main_shaft_diameter + 2, center=true);
        }
        
        // Mounting flange at bottom
        translate([0, 0, -bearing_block_height/2 - 2])
            cube([bearing_block_width + 6, bearing_block_depth + 4, 4], center=true);
    }
}

// Connecting rod (piston to crank)
module connecting_rod() {
    // Simplified connecting rod
    hull() {
        translate([cylinder_offset_x + 10, 0, cylinder_offset_z])
            cylinder(h=6, d=12, center=true);
        translate([front_flywheel_x + crank_throw, 0, flywheel_z])
            cylinder(h=6, d=10, center=true);
    }
}

// Piston/crosshead assembly
module piston_assembly() {
    translate([cylinder_offset_x + cylinder_length/2 - 5, 0, cylinder_offset_z]) {
        // Piston body
        cylinder(h=15, d=cylinder_diameter - 4, center=true);
        
        // Piston rod extending toward crank
        translate([10, 0, 0])
            cylinder(h=25, d=6, center=true);
    }
}

// Small detail bolts/fasteners
module bolt(head_d=5, head_h=2, shaft_d=3, shaft_h=6) {
    union() {
        cylinder(h=head_h, d=head_d, center=false, $fn=6); // Hex head
        translate([0, 0, head_h])
            cylinder(h=shaft_h, d=shaft_d, center=false);
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Base
    color("gray") engine_base();
    
    // Finned cylinder assembly
    color("silver")
        translate([cylinder_offset_x, cylinder_offset_y, cylinder_offset_z])
            rotate([0, 90, 0])
                finned_cylinder();
    
    // Front flywheel (larger, closer to viewer)
    color("lightgray")
        translate([front_flywheel_x, 0, flywheel_z])
            flywheel();
    
    // Rear flywheel (slightly offset back)
    color("lightgray")
        translate([rear_flywheel_x, -8, flywheel_z])
            flywheel();
    
    // Crankshaft
    color("darkgray")
        translate([(front_flywheel_x + rear_flywheel_x)/2, -4, flywheel_z])
            crankshaft();
    
    // Bearing supports
    color("gray") {
        bearing_support(front_flywheel_x - 5);
        bearing_support(rear_flywheel_x + 5);
    }
    
    // Connecting rod
    color("silver") connecting_rod();
    
    // Piston
    color("silver") piston_assembly();
    
    // Decorative bolts on bearing blocks
    color("darkgray") {
        // Bolts on front bearing
        translate([front_flywheel_x - 8, bearing_block_depth/2 + 1, base_height + 2])
            rotate([0, 0, 0]) bolt();
        translate([front_flywheel_x + 8, bearing_block_depth/2 + 1, base_height + 2])
            rotate([0, 0, 0]) bolt();
        
        // Bolts on rear bearing  
        translate([rear_flywheel_x + 8, -bearing_block_depth/2 - 1, base_height + 2])
            rotate([0, 180, 0]) bolt();
        translate([rear_flywheel_x - 8, -bearing_block_depth/2 - 1, base_height + 2])
            rotate([0, 180, 0]) bolt();
    }
}