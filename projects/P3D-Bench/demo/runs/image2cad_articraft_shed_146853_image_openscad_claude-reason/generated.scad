// Storage Shed / Barn with Gable Roof and Exposed Trusses
// Dimensions in millimeters (scaled model)

// Main parameters
shed_width = 120;       // Width (side to side)
shed_depth = 150;       // Depth (front to back)
wall_height = 80;       // Wall height to eave
roof_peak_height = 50;  // Height from eave to ridge
wall_thickness = 3;
panel_thickness = 1.5;

// Roof parameters
roof_overhang_side = 5;
roof_overhang_front = 5;
rafter_width = 2;
rafter_height = 3;
num_trusses = 7;

// Door parameters
door_width = 25;
door_height = 65;
door_gap = 1;

// Batten parameters
batten_width = 1.5;
batten_depth = 0.8;
batten_spacing = 15;

$fn = 20;

// Module for a single wall panel with vertical battens
module wall_panel(width, height, thickness) {
    // Base panel
    cube([width, thickness, height]);
    // Vertical battens
    num_battens = floor(width / batten_spacing);
    for (i = [0 : num_battens]) {
        translate([i * batten_spacing, -batten_depth, 0])
            cube([batten_width, batten_depth, height]);
    }
}

// Module for gable wall (triangular top)
module gable_wall(width, wall_h, peak_h, thickness) {
    // Rectangular lower part
    cube([width, thickness, wall_h]);
    // Triangular gable
    translate([0, 0, wall_h])
        linear_extrude(height=thickness)
            rotate([90, 0, 0])
                translate([0, 0, -thickness])
                    linear_extrude(height=thickness)
                        polygon([[0, 0], [width, 0], [width/2, peak_h]]);
}

// Module for roof truss
module roof_truss(width, peak_h) {
    half_w = width / 2;
    rafter_len = sqrt(half_w * half_w + peak_h * peak_h);
    rafter_angle = atan2(peak_h, half_w);
    
    // Left rafter
    translate([0, 0, 0])
        rotate([0, -rafter_angle, 0])
            cube([rafter_len, rafter_width, rafter_height]);
    
    // Right rafter
    translate([width, 0, 0])
        rotate([0, rafter_angle - 180, 0])
            translate([-rafter_len, 0, 0])
                cube([rafter_len, rafter_width, rafter_height]);
    
    // Bottom chord (tie beam)
    translate([0, 0, -rafter_height])
        cube([width, rafter_width, rafter_height]);
    
    // King post
    translate([half_w - rafter_width/2, 0, -rafter_height])
        cube([rafter_width, rafter_width, peak_h + rafter_height]);
    
    // Left diagonal brace
    translate([width*0.25, 0, -rafter_height])
        rotate([0, -atan2(peak_h*0.5, half_w*0.25), 0])
            cube([sqrt((half_w*0.25)*(half_w*0.25) + (peak_h*0.5)*(peak_h*0.5)), rafter_width, rafter_height*0.7]);
    
    // Right diagonal brace
    translate([width*0.75, 0, -rafter_height])
        rotate([0, atan2(peak_h*0.5, half_w*0.25)-180, 0])
            translate([-sqrt((half_w*0.25)*(half_w*0.25) + (peak_h*0.5)*(peak_h*0.5)), 0, 0])
                cube([sqrt((half_w*0.25)*(half_w*0.25) + (peak_h*0.5)*(peak_h*0.5)), rafter_width, rafter_height*0.7]);
}

// Module for door with hinges
module door(width, height, thickness) {
    cube([width, thickness, height]);
    // Hinges
    for (z = [height*0.2, height*0.5, height*0.8]) {
        translate([-1, -0.5, z-2])
            cube([2.5, 2, 4]);
    }
}

// Module for roof panel
module roof_panel(width, depth, thickness) {
    cube([width, depth, thickness]);
}

// ===== MAIN ASSEMBLY =====

color("LightGray") {
    // Floor
    translate([0, 0, 0])
        cube([shed_width, shed_depth, wall_thickness]);
    
    // Front wall with door opening
    difference() {
        translate([0, 0, wall_thickness])
            wall_panel(shed_width, wall_height, wall_thickness);
        // Door opening
        translate([shed_width/2 - door_width - door_gap/2, -1, wall_thickness])
            cube([door_width*2 + door_gap, wall_thickness + 2, door_height]);
    }
    
    // Front gable triangle
    translate([0, 0, wall_height + wall_thickness])
        linear_extrude(height=wall_thickness)
            polygon([[0, 0], [shed_width, 0], [shed_width/2, roof_peak_height]]);
    
    // Back wall
    translate([0, shed_depth - wall_thickness, wall_thickness])
        wall_panel(shed_width, wall_height, wall_thickness);
    
    // Back gable triangle
    translate([0, shed_depth - wall_thickness, wall_height + wall_thickness])
        linear_extrude(height=wall_thickness)
            polygon([[0, 0], [shed_width, 0], [shed_width/2, roof_peak_height]]);
    
    // Left wall
    translate([0, 0, wall_thickness])
        rotate([0, 0, 90])
            wall_panel(shed_depth, wall_height, wall_thickness);
    
    // Right wall
    translate([shed_width, 0, wall_thickness])
        rotate([0, 0, 90])
            wall_panel(shed_depth, wall_height, wall_thickness);
    
    // Doors
    translate([shed_width/2 - door_width - door_gap/2, 0, wall_thickness])
        door(door_width, door_height, panel_thickness);
    translate([shed_width/2 + door_gap/2, 0, wall_thickness])
        door(door_width, door_height, panel_thickness);
}

// Roof structure
color("Gray") {
    roof_angle = atan2(roof_peak_height, shed_width/2);
    half_roof_len = sqrt((shed_width/2 + roof_overhang_side) * (shed_width/2 + roof_overhang_side) + roof_peak_height * roof_peak_height);
    
    // Trusses
    truss_spacing = shed_depth / (num_trusses - 1);
    for (i = [0 : num_trusses - 1]) {
        translate([0, i * truss_spacing, wall_height + wall_thickness])
            roof_truss(shed_width, roof_peak_height);
    }
    
    // Ridge beam
    translate([shed_width/2 - rafter_width/2, -roof_overhang_front, wall_height + wall_thickness + roof_peak_height])
        cube([rafter_width, shed_depth + 2*roof_overhang_front, rafter_height]);
    
    // Roof panels (left side)
    translate([shed_width/2, -roof_overhang_front, wall_height + wall_thickness + roof_peak_height])
        rotate([0, roof_angle, 0])
            translate([-half_roof_len, 0, 0])
                cube([half_roof_len, shed_depth + 2*roof_overhang_front, panel_thickness]);
    
    // Roof panels (right side)  
    translate([shed_width/2, -roof_overhang_front, wall_height + wall_thickness + roof_peak_height])
        rotate([0, -roof_angle, 0])
            cube([half_roof_len, shed_depth + 2*roof_overhang_front, panel_thickness]);
    
    // Purlins (horizontal roof supports)
    for (side = [0, 1]) {
        for (j = [1:3]) {
            px = (shed_width/2) * j / 4;
            pz = roof_peak_height * (1 - j/4);
            if (side == 0) {
                translate([shed_width/2 - px, -roof_overhang_front, wall_height + wall_thickness + pz - rafter_height])
                    cube([rafter_width, shed_depth + 2*roof_overhang_front, rafter_height]);
            } else {
                translate([shed_width/2 + px - rafter_width, -roof_overhang_front, wall_height + wall_thickness + pz - rafter_height])
                    cube([rafter_width, shed_depth + 2*roof_overhang_front, rafter_height]);
            }
        }
    }
}