// Assembly Parameters
$fn = 100;

// Overall dimensions
total_height = 800;
disc_diameter = 180;
disc_thickness = 10;
rod_diameter = 10;
rod_length = 500;

// Flanged bushing parameters
flange_outer_diameter = 56.5;
flange_thickness = 3.25;
boss_diameter = 44.25;
boss_height = 8.0;
bushing_bore_diameter = 40;
bushing_height = 11.25;

// Locating plug parameters
plug_main_radius = 20.0;
plug_main_height = 44.22;
plug_rim_radius = 23.0;
plug_rim_height = 5.0;
plug_total_height = 77.22;
plug_bore_diameter = 24.0;
plug_bore_depth = 10.0;
plug_taper_height = plug_total_height - plug_main_height - plug_rim_height;

// Splined ring parameters
ring_outer_diameter = 200;
ring_thickness = 3.9;
ring_inner_diameter = 160;
ring_teeth_count = 40;

// Vane slat parameters
vane_count = 40;
vane_thickness = 3.9;
vane_width = 50;
vane_length = 300;
vane_curvature_radius = 572.5;
vane_notch_top_radius = 15;
vane_notch_bottom_radius = 5;
vane_notch_depth = 5;

// Knob parameters
knob_width = 60;
knob_height = 81;
knob_sphere_radius = 30;

// Derived positions (Y-axis as vertical, origin at disc plate center)
disc_z = 0;
rod_top_z = disc_z - disc_thickness/2;
rod_bottom_z = rod_top_z - rod_length;
hub_center_z = rod_bottom_z;
cage_center_z = hub_center_z - 70; // Approximate center of cage

// Helper module: Disc plate with central hole
module disc_plate() {
    difference() {
        cylinder(h=disc_thickness, d=disc_diameter, center=true);
        cylinder(h=disc_thickness+1, d=rod_diameter, center=true);
    }
}

// Helper module: Solid rod
module rod() {
    cylinder(h=rod_length, d=rod_diameter, center=true);
}

// Helper module: Flanged bushing
module flanged_bushing() {
    union() {
        // Flange
        cylinder(h=flange_thickness, d=flange_outer_diameter, center=true);
        // Boss
        translate([0, 0, flange_thickness/2 + boss_height/2])
            cylinder(h=boss_height, d=boss_diameter, center=true);
    }
    // Subtract central bore
    difference() {
        children();
        cylinder(h=bushing_height+1, d=bushing_bore_diameter, center=true);
    }
}

// Helper module: Locating plug
module locating_plug() {
    difference() {
        union() {
            // Main cylindrical body
            cylinder(h=plug_main_height, r=plug_main_radius, center=false);
            // Rim at top
            translate([0, 0, plug_main_height])
                cylinder(h=plug_rim_height, r=plug_rim_radius, center=false);
            // Tapered section
            translate([0, 0, -plug_taper_height])
                cylinder(h=plug_taper_height, r1=plug_main_radius*0.7, r2=plug_main_radius, center=false);
        }
        // Blind bore at top
        translate([0, 0, plug_total_height - plug_bore_depth])
            cylinder(h=plug_bore_depth+1, d=plug_bore_diameter, center=false);
    }
}

// Helper module: Splined ring with teeth
module splined_ring() {
    tooth_angle = 360 / ring_teeth_count;
    tooth_width = 5;
    tooth_height = 5;
    
    difference() {
        // Base ring
        cylinder(h=ring_thickness, d=ring_outer_diameter, center=true);
        // Inner bore
        cylinder(h=ring_thickness+1, d=ring_inner_diameter, center=true);
        // Teeth cutouts (create external teeth by subtracting from outer diameter)
        for (i = [0:ring_teeth_count-1]) {
            rotate([0, 0, i * tooth_angle])
                translate([ring_outer_diameter/2 - tooth_height/2, 0, 0])
                    cube([tooth_height, tooth_width, ring_thickness+1], center=true);
        }
    }
}

// Helper module: Single vane slat with curvature and notches
module vane_slat() {
    // Create curved vane using linear_extrude with scale
    linear_extrude(height=vane_length, center=true, scale=1, convexity=10)
        offset(r=0.5)
            square([vane_width, vane_thickness], center=true);
    
    // Add notches (simplified as rectangular cutouts)
    // Top notch
    translate([vane_width/2 - vane_notch_depth/2, 0, vane_length/2 - 10])
        cube([vane_notch_depth, vane_thickness+1, vane_notch_top_radius*2], center=true);
    // Bottom notch
    translate([vane_width/2 - vane_notch_depth/2, 0, -vane_length/2 + 10])
        cube([vane_notch_depth, vane_thickness+1, vane_notch_bottom_radius*2], center=true);
}

// Helper module: Knob with spherical top and conical stem
module knob() {
    union() {
        // Spherical top
        sphere(r=knob_sphere_radius);
        // Conical stem
        translate([0, 0, -knob_sphere_radius])
            cylinder(h=knob_height - knob_sphere_radius, 
                    r1=knob_sphere_radius*0.8, 
                    r2=knob_width/2, 
                    center=false);
        // Flat base
        translate([0, 0, -knob_height])
            cylinder(h=2, d=knob_width, center=false);
    }
}

// Main assembly
union() {
    // Disc plate (grounded part at top)
    translate([0, 0, disc_z])
        disc_plate();
    
    // Rod (passes through disc plate)
    translate([0, 0, rod_top_z - rod_length/2])
        rod();
    
    // Hub components at bottom of rod
    translate([0, 0, hub_center_z]) {
        // Flanged bushing
        flanged_bushing();
        
        // Locating plug (coaxial with bushing)
        translate([0, 0, -bushing_height/2 - plug_total_height/2])
            locating_plug();
    }
    
    // Splined ring (around hub zone)
    translate([0, 0, hub_center_z - 20])
        splined_ring();
    
    // Vane slats (40-fold rotational arrangement)
    for (i = [0:vane_count-1]) {
        rotate([0, 0, i * (360/vane_count)])
            translate([ring_inner_diameter/2 + vane_width/2, 0, cage_center_z])
                vane_slat();
    }
    
    // Knob (caps the hub at bottom)
    translate([0, 0, hub_center_z - 150])
        knob();
}