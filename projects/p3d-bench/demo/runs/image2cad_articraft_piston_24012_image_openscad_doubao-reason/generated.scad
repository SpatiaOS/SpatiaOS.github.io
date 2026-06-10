// ==============================
// Configuration & Parameters
// ==============================
$fn = 100; // Smooth curve resolution

// Piston Dimensions (mm)
piston_diameter = 60;
piston_height = 40;
top_recess_diameter = 15;
top_recess_depth = 2;
ring_groove_count = 3;
ring_groove_width = 2;
ring_groove_spacing = 2;
ring_groove_depth = 1.5;
wrist_pin_diameter = 12;
wrist_pin_length = piston_diameter + 4;

// Connecting Rod Dimensions (mm)
rod_center_distance = 120; // Distance between small/big end centers
rod_width = 12; // Thickness along wrist pin axis
rod_flange_thickness = 8; // I-beam flange thickness
small_end_outer_dia = 20;
big_end_outer_dia = 36;
big_end_inner_dia = 22;
big_end_cap_height = 10;
bolt_diameter = 4;
bolt_head_size = 7;
bolt_length = 12;

// ==============================
// Module Definitions
// ==============================
module piston() {
    /* Generates standard piston with ring grooves, wrist pin hole, and top recess */
    difference() {
        // Main piston body
        cylinder(h=piston_height, d=piston_diameter, center=false);
        
        // Top center recess
        translate([0, 0, piston_height - top_recess_depth])
        cylinder(h=top_recess_depth + 0.1, d=top_recess_diameter, center=false);
        
        // Piston ring grooves
        for (i = [0:ring_groove_count-1]) {
            groove_z = piston_height - 5 - i * (ring_groove_width + ring_groove_spacing);
            translate([0, 0, groove_z])
            linear_extrude(height=ring_groove_width)
            difference() {
                circle(d=piston_diameter);
                circle(d=piston_diameter - 2*ring_groove_depth);
            }
        }
        
        // Wrist pin through hole (offset from bottom of piston)
        translate([0, 0, piston_height * 0.4])
        rotate([90, 0, 0])
        cylinder(h=piston_diameter + 1, d=wrist_pin_diameter, center=true);
    }
}

module connecting_rod() {
    /* Generates I-beam connecting rod with small end, big end, cap and bolts */
    union() {
        // Small end (connects to piston wrist pin)
        translate([0, 0, rod_center_distance])
        rotate([90, 0, 0])
        difference() {
            cylinder(h=rod_width, d=small_end_outer_dia, center=true);
            cylinder(h=rod_width + 1, d=wrist_pin_diameter, center=true);
        }

        // Big end (connects to crankshaft)
        rotate([90, 0, 0])
        difference() {
            cylinder(h=rod_width, d=big_end_outer_dia, center=true);
            cylinder(h=rod_width + 1, d=big_end_inner_dia, center=true);
        }

        // Solid core rod beam
        hull() {
            translate([0, 0, rod_center_distance])
            cube([rod_flange_thickness, rod_width, 0.1], center=true);
            translate([0, 0, 0])
            cube([rod_flange_thickness, rod_width, 0.1], center=true);
        }

        // I-beam cutouts (remove material from sides to reduce weight)
        cutout_width = (rod_flange_thickness - 2) / 2;
        for (side = [-1, 1]) {
            translate([side * (rod_flange_thickness/2 - cutout_width/2), 0, rod_center_distance/2])
            cube([
                cutout_width,
                rod_width - 4,
                rod_center_distance - (small_end_outer_dia/2 + big_end_outer_dia/2)
            ], center=true);
        }

        // Big end cap
        translate([0, 0, -big_end_outer_dia/2 + big_end_cap_height/2])
        cube([rod_flange_thickness + 6, rod_width, big_end_cap_height], center=true);

        // Cap mounting bolts
        for (x_offset = [-(rod_flange_thickness/2 + 3), rod_flange_thickness/2 + 3]) {
            translate([x_offset, 0, -big_end_outer_dia/2 - bolt_length + 3])
            union() {
                cylinder(h=bolt_length, d=bolt_diameter, center=false); // Shank
                cylinder(h=3, d=bolt_head_size, center=false); // Head
            }
        }
    }
}

// ==============================
// Main Assembly
// ==============================
union() {
    // Piston aligned so wrist pin hole matches rod small end position
    translate([0, 0, rod_center_distance - piston_height * 0.4])
    piston();

    // Connecting rod
    connecting_rod();

    // Wrist pin connecting piston to rod
    rotate([90, 0, 0])
    translate([0, 0, rod_center_distance])
    cylinder(h=wrist_pin_length, d=wrist_pin_diameter, center=true);
}