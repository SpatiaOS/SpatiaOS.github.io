// ==============================================
// Fire Hose Reel 3D Model
// All dimensions in millimeters
// ==============================================

// -------------------
// General Settings
// -------------------
$fn = 64; // Smoothness of curved surfaces
model_color = "lightgray";

// -------------------
// Reel Parameters
// -------------------
flange_diameter = 200;       // Diameter of side flanges
flange_thickness = 6;        // Thickness of side flanges
core_diameter = 100;         // Diameter of central core
core_length = 80;            // Width of the winding core
mounting_hole_dia = 4;       // Diameter of mounting holes on front flange
mounting_hole_circle = 140;  // Diameter of circle for mounting hole pattern
num_mounting_holes = 4;      // Number of mounting holes

// -------------------
// Hose Parameters
// -------------------
hose_diameter = 10;          // Outer diameter of hose
hose_coil_count = 7;         // Number of wound hose loops
hose_inlet_length = 220;     // Length of vertical inlet hose
hose_outlet_length = 150;    // Length of vertical outlet hose
bend_radius = hose_diameter * 2; // Radius for hose bends

// -------------------
// Fitting Parameters
// -------------------
spray_head_length = 20;      // Length of top spray nozzle
valve_length = 25;           // Length of lower control valve
valve_handle_length = 22;    // Length of valve lever
nozzle_length = 30;          // Length of outlet nozzle tip

// ==============================================
// Module Definitions
// ==============================================

// Reel assembly (flanges + core + mounting holes)
module reel(flange_d, flange_t, core_d, core_l) {
    difference() {
        union() {
            // Left side flange
            translate([0, -core_l/2 - flange_t/2, 0])
                cylinder(d=flange_d, h=flange_t);
            // Right side flange
            translate([0, core_l/2 + flange_t/2, 0])
                cylinder(d=flange_d, h=flange_t);
            // Central core
            cylinder(h=core_l, d=core_d, center=true);
        }
        // Mounting holes on right flange
        for (i = [0:num_mounting_holes-1]) {
            rotate([0, 0, i * 360/num_mounting_holes])
            translate([mounting_hole_circle/2, core_l/2 + flange_t + 1, 0])
            rotate([90, 0, 0])
                cylinder(h=flange_t + 2, d=mounting_hole_dia, center=true);
        }
    }
}

// Wound helical hose coil
module wound_hose(core_d, hose_d, num_coils, coil_length) {
    coil_diameter = core_d + hose_d;
    // Create helix using twisted extrusion
    rotate([90, 0, 0])
    linear_extrude(height=coil_length, twist=360 * num_coils, center=true)
        translate([coil_diameter/2, 0, 0])
        circle(d=hose_d, $fn=16);
}

// Inlet hose with 90deg bend
module inlet_hose(hose_d, vertical_len, bend_r) {
    union() {
        // Horizontal segment leading out of coil
        translate([-(core_diameter + hose_d)/2, -core_length/2, 0])
        rotate([0, 90, 0])
            cylinder(h=bend_r + 10, d=hose_d);
        // 90 degree curved bend
        translate([-(core_diameter + hose_d)/2, -core_length/2 - bend_r, bend_r])
        rotate([90, 0, 90])
        rotate_extrude(angle=90, $fn=16)
            translate([bend_r, 0, 0])
            circle(d=hose_d, $fn=16);
        // Vertical straight segment
        translate([-(core_diameter + hose_d)/2, -core_length/2 - bend_r, bend_r])
            cylinder(h=vertical_len, d=hose_d);
    }
}

// Top spray nozzle head
module spray_head(head_len, hose_d) {
    union() {
        // Base connector
        cylinder(d=hose_d * 1.2, h=hose_d, center=true);
        // Hexagonal valve body
        translate([0, 0, hose_d + head_len/2])
        linear_extrude(height=head_len, center=true)
            circle(d=hose_d * 1.5, $fn=6);
        // Nozzle tip
        translate([0, 0, hose_d + head_len])
            cylinder(d1=hose_d * 1.5, d2=hose_d * 1.1, h=hose_d * 0.8);
        // Outlet hole
        translate([0, 0, hose_d + head_len + hose_d * 0.8 + 1])
        rotate([90, 0, 0])
            cylinder(d=hose_d * 0.4, h=2, center=true);
    }
}

// Outlet vertical hose
module outlet_hose(hose_d, length_down) {
    translate([0, core_length/2 + flange_thickness, -(core_diameter + hose_d)/2])
        cylinder(h=length_down, d=hose_d);
}

// Lower control valve with handle
module control_valve(valve_len, hose_d, handle_len) {
    union() {
        // Valve body
        cylinder(d=hose_d * 1.5, h=valve_len, center=true);
        // Valve lever handle
        translate([0, handle_len/2, 0])
        rotate([90, 0, 0])
            cylinder(d=hose_d * 0.5, h=handle_len, center=true);
        // Upper and lower hose connectors
        translate([0, 0, valve_len/2])
            cylinder(d=hose_d * 1.2, h=hose_d * 0.6, center=true);
        translate([0, 0, -valve_len/2])
            cylinder(d=hose_d * 1.2, h=hose_d * 0.6, center=true);
    }
}

// Outlet nozzle tip
module outlet_nozzle(nozzle_len, hose_d) {
    union() {
        // Tapered nozzle
        cylinder(d1=hose_d * 1.2, d2=hose_d * 0.6, h=nozzle_len);
        // End cap
        translate([0, 0, nozzle_len])
            cylinder(d=hose_d * 0.6, h=hose_d * 0.3);
    }
}

// ==============================================
// Main Assembly
// ==============================================
color(model_color)
union() {
    // Reel structure
    reel(flange_diameter, flange_thickness, core_diameter, core_length);
    
    // Wound hose on core
    wound_hose(core_diameter, hose_diameter, hose_coil_count, core_length);
    
    // Inlet hose assembly
    inlet_hose(hose_diameter, hose_inlet_length, bend_radius);
    
    // Spray head at top of inlet
    translate([
        -(core_diameter + hose_diameter)/2,
        -core_length/2 - bend_radius,
        bend_radius + hose_inlet_length
    ])
    spray_head(spray_head_length, hose_diameter);
    
    // Outlet hose assembly
    outlet_hose(hose_diameter, hose_outlet_length);
    
    // Control valve at end of outlet hose
    translate([
        0,
        core_length/2 + flange_thickness,
        -(core_diameter + hose_diameter)/2 - hose_outlet_length - valve_length/2
    ])
    rotate([0, 90, 0])
    control_valve(valve_length, hose_diameter, valve_handle_length);
    
    // Outlet nozzle below valve
    translate([
        0,
        core_length/2 + flange_thickness,
        -(core_diameter + hose_diameter)/2 - hose_outlet_length - valve_length
    ])
    outlet_nozzle(nozzle_length, hose_diameter);
}