// Stirling Engine Model - Parametric Design
// All dimensions in millimeters

// --------------------------
// Global Parameters
// --------------------------
$fn = 64; // Smooth curve resolution

// Base Plate Dimensions
base_length = 160;
base_width = 70;
base_height = 8;
base_fillet_radius = 3;

// Main Stand Dimensions
stand_width = 55;
stand_depth = 28;
stand_height = 52;
stand_fillet = 4;
axle_center_height = stand_height + base_height; // Height of flywheel axle above build plate

// Flywheel Parameters
flywheel_diameter = 115;
flywheel_thickness = 12;
flywheel_rim_width = 10;
flywheel_hub_diameter = 28;
flywheel_axle_hole_dia = 8;
flywheel_cutout_dia = 22;
flywheel_num_cutouts = 5;
distance_between_flywheels = 42;

// Finned Cylinder Parameters
cylinder_diameter = 48;
cylinder_length = 85;
fin_count = 22;
fin_height = 2.2;
fin_thickness = 1.4;
cylinder_top_port_dia = 10;
cylinder_top_port_height = 12;

// Crank & Piston Parameters
crank_journal_dia = 12;
crank_offset = 14;
connecting_rod_dia = 6;
piston_rod_length = 60;

// --------------------------
// Reusable Module Definitions
// --------------------------

// Rounded plate/box generator
module rounded_box(w, d, h, r) {
    minkowski() {
        cube([w-2*r, d-2*r, h-2*r], center=false);
        sphere(r=r);
    }
    translate([r, r, 0]) cube([w-2*r, d-2*r, h], center=false);
}

// Spoked flywheel module
module flywheel(dia, thick, rim_w, hub_dia, axle_dia, cutout_dia, num_cuts) {
    difference() {
        // Main flywheel body
        cylinder(h=thick, d=dia, center=true);
        
        // Inner rim cutout
        cylinder(h=thick + 1, d=dia - 2*rim_w, center=true);
        
        // Hub cutouts (spoke gaps)
        for(i = [0:num_cuts-1]) {
            rotate([0, 0, i * 360/num_cuts])
            translate([dia/2 - rim_w - cutout_dia/2 - 5, 0, 0])
            cylinder(h=thick + 1, d=cutout_dia, center=true);
        }
        
        // Axle hole
        cylinder(h=thick + 1, d=axle_dia, center=true);
    }
    // Add central hub
    cylinder(h=thick, d=hub_dia, center=true);
}

// Finned hot cylinder module
module finned_cylinder(dia, len, fin_cnt, fin_h, fin_t, port_dia, port_h) {
    union() {
        // Main cylinder body
        cylinder(h=len, d=dia, center=false);
        
        // Cooling fins
        for(i = [0:fin_cnt-1]) {
            translate([0,0, i * (len/fin_cnt)])
            cylinder(h=fin_t, d=dia + 2*fin_h, center=false);
        }
        
        // Top port fitting
        translate([0, 0, len * 0.75])
        rotate([90, 0, 0])
        cylinder(h=port_h, d=port_dia, center=false);
        
        // Cylinder mounting foot
        translate([dia/2 - 4, -6, 0])
        cube([8, 12, 6], center=false);
    }
}

// --------------------------
// Main Assembly
// --------------------------
union() {
    // 1. Base plate
    translate([0, 0, 0])
    rounded_box(base_length, base_width, base_height, base_fillet_radius);
    
    // 2. Main vertical stand
    translate([base_length/2 - stand_width/2, base_width/2 - stand_depth/2, base_height])
    rounded_box(stand_width, stand_depth, stand_height, stand_fillet);
    
    // 3. Main axle connecting both flywheels
    translate([base_length/2, base_width/2, axle_center_height])
    rotate([90, 0, 0])
    cylinder(h=distance_between_flywheels + 2*flywheel_thickness, d=flywheel_axle_hole_dia, center=true);
    
    // 4. Left flywheel (closer to cylinder)
    translate([base_length/2, base_width/2 - distance_between_flywheels/2 - flywheel_thickness/2, axle_center_height])
    rotate([90, 0, 0])
    flywheel(flywheel_diameter, flywheel_thickness, flywheel_rim_width, flywheel_hub_diameter, flywheel_axle_hole_dia, flywheel_cutout_dia, flywheel_num_cutouts);
    
    // 5. Right flywheel
    translate([base_length/2, base_width/2 + distance_between_flywheels/2 + flywheel_thickness/2, axle_center_height])
    rotate([90, 0, 0])
    flywheel(flywheel_diameter, flywheel_thickness, flywheel_rim_width, flywheel_hub_diameter, flywheel_axle_hole_dia, flywheel_cutout_dia, flywheel_num_cutouts);
    
    // 6. Crank journal between flywheels
    translate([base_length/2 + crank_offset, base_width/2, axle_center_height])
    rotate([90, 0, 0])
    cylinder(h=distance_between_flywheels, d=crank_journal_dia, center=true);
    
    // 7. Finned cylinder assembly
    translate([base_length*0.12, base_width/2 - cylinder_diameter/2, base_height + 15])
    rotate([0, -15, 0])
    finned_cylinder(cylinder_diameter, cylinder_length, fin_count, fin_height, fin_thickness, cylinder_top_port_dia, cylinder_top_port_height);
    
    // 8. Connecting rod between crank and piston
    translate([base_length*0.12 + cylinder_length, base_width/2, base_height + 15 + cylinder_diameter/2])
    rotate([0, 15, 0])
    cylinder(h=piston_rod_length, d=connecting_rod_dia, center=false);
}