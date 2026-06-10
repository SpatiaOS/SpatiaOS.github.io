// Shed Parameters
shed_width = 2400;       // Overall width (mm)
shed_depth = 1800;       // Overall depth (mm)
wall_height = 2000;      // Wall height (mm)
roof_pitch = 4/12;       // Roof pitch (rise over run)
truss_spacing = 600;     // Spacing between roof trusses (mm)
panel_width = 300;       // Width of vertical wall panels (mm)
door_width = 1200;       // Total door width (double door, mm)
door_height = 1800;      // Door height (mm)
frame_thickness = 50;    // Thickness of frame members (mm)
panel_thickness = 20;    // Thickness of wall panels (mm)
hinge_width = 50;        // Width of door hinges (mm)
hinge_height = 100;      // Height of door hinges (mm)
floor_thickness = 100;   // Thickness of floor slab (mm)

// Calculated Parameters
roof_rise = (shed_width / 2) * roof_pitch;  // Roof rise from wall top to ridge
roof_height = wall_height + roof_rise;      // Total height to ridge
rafter_length = sqrt( (shed_width/2)^2 + roof_rise^2 );  // Length of each rafter
num_trusses = floor(shed_depth / truss_spacing) + 1;     // Number of trusses

$fn = 100;  // Smooth curves

// Module: Floor slab
module floor_slab(width, depth, thickness) {
    translate([0, 0, -thickness/2])
    cube([width, depth, thickness], center=true);
}

// Module: Wall frame (without door)
module wall_frame(width, height, depth, frame_thickness) {
    // Vertical studs
    for (x = [frame_thickness/2 : panel_width : width - frame_thickness/2]) {
        translate([x, 0, 0])
        cube([frame_thickness, depth, height], center=true);
    }
    // Top and bottom plates
    translate([width/2, 0, height/2])
    cube([width, depth, frame_thickness], center=true);
    translate([width/2, 0, -height/2])
    cube([width, depth, frame_thickness], center=true);
}

// Module: Front wall frame with door opening
module front_wall_frame(width, height, depth, frame_thickness, door_width, door_height) {
    // Vertical studs (excluding door area)
    // Left side of door
    for (x = [frame_thickness/2 : panel_width : (width - door_width)/2 - frame_thickness/2]) {
        translate([x, 0, 0])
        cube([frame_thickness, depth, height], center=true);
    }
    // Right side of door
    for (x = [(width + door_width)/2 + frame_thickness/2 : panel_width : width - frame_thickness/2]) {
        translate([x, 0, 0])
        cube([frame_thickness, depth, height], center=true);
    }
    // Studs above door
    door_top = door_height/2;
    for (x = [(width - door_width)/2 + frame_thickness/2 : panel_width : (width + door_width)/2 - frame_thickness/2]) {
        translate([x, 0, door_top + (height - door_top)/2])
        cube([frame_thickness, depth, height - door_top], center=true);
    }
    // Top and bottom plates
    translate([width/2, 0, height/2])
    cube([width, depth, frame_thickness], center=true);
    translate([width/2, 0, -height/2])
    cube([width, depth, frame_thickness], center=true);
    // Door header
    translate([width/2, 0, door_top + frame_thickness/2])
    cube([door_width, depth, frame_thickness], center=true);
}

// Module: Vertical wall panels
module wall_panels(width, height, depth, panel_width, panel_thickness) {
    for (x = [0 : panel_width : width - panel_width]) {
        translate([x + panel_width/2, 0, 0])
        cube([panel_width, depth, height], center=true);
    }
}

// Module: Roof truss
module roof_truss(width, roof_rise, depth, frame_thickness) {
    // Rafters
    rafter_width = frame_thickness;
    rafter_depth = depth;
    // Left rafter
    translate([-width/4, 0, wall_height/2 + roof_rise/2])
    rotate([0, atan2(roof_rise, width/2), 0])
    cube([rafter_width, rafter_depth, rafter_length], center=true);
    // Right rafter
    translate([width/4, 0, wall_height/2 + roof_rise/2])
    rotate([0, -atan2(roof_rise, width/2), 0])
    cube([rafter_width, rafter_depth, rafter_length], center=true);
    // Ridge beam
    translate([0, 0, wall_height + roof_rise])
    cube([frame_thickness, depth, frame_thickness], center=true);
    // Collar tie (for stability)
    translate([0, 0, wall_height + roof_rise/2])
    cube([width/2, depth, frame_thickness], center=true);
}

// Module: Double door with hinges
module door(width, height, depth, frame_thickness, hinge_width, hinge_height) {
    // Door panels
    door_panel_width = (width - frame_thickness)/2;
    // Left door
    translate([-door_panel_width/2 - frame_thickness/4, 0, 0])
    cube([door_panel_width, depth, height], center=true);
    // Right door
    translate([door_panel_width/2 + frame_thickness/4, 0, 0])
    cube([door_panel_width, depth, height], center=true);
    // Hinges on left door
    for (z = [-height/3, 0, height/3]) {
        translate([-door_panel_width/2 - frame_thickness/2, 0, z])
        cube([hinge_width, depth, hinge_height], center=true);
    }
    // Hinges on right door
    for (z = [-height/3, 0, height/3]) {
        translate([door_panel_width/2 + frame_thickness/2, 0, z])
        cube([hinge_width, depth, hinge_height], center=true);
    }
}

// Module: Complete shed assembly
module shed() {
    // Floor
    floor_slab(shed_width, shed_depth, floor_thickness);
    
    // Back wall
    translate([0, -shed_depth/2, wall_height/2])
    union() {
        wall_frame(shed_width, wall_height, frame_thickness, frame_thickness);
        wall_panels(shed_width, wall_height, panel_thickness, panel_width, panel_thickness);
    }
    
    // Left wall
    translate([-shed_width/2, 0, wall_height/2])
    rotate([0, 0, 90])
    union() {
        wall_frame(shed_depth, wall_height, frame_thickness, frame_thickness);
        wall_panels(shed_depth, wall_height, panel_thickness, panel_width, panel_thickness);
    }
    
    // Right wall
    translate([shed_width/2, 0, wall_height/2])
    rotate([0, 0, -90])
    union() {
        wall_frame(shed_depth, wall_height, frame_thickness, frame_thickness);
        wall_panels(shed_depth, wall_height, panel_thickness, panel_width, panel_thickness);
    }
    
    // Front wall
    translate([0, shed_depth/2, wall_height/2])
    union() {
        front_wall_frame(shed_width, wall_height, frame_thickness, frame_thickness, door_width, door_height);
        wall_panels(shed_width, wall_height, panel_thickness, panel_width, panel_thickness);
        // Door
        translate([0, 0, -wall_height/2 + door_height/2])
        door(door_width, door_height, panel_thickness, frame_thickness, hinge_width, hinge_height);
    }
    
    // Roof trusses
    for (y = [-shed_depth/2 + truss_spacing/2 : truss_spacing : shed_depth/2 - truss_spacing/2]) {
        translate([0, y, 0])
        roof_truss(shed_width, roof_rise, frame_thickness, frame_thickness);
    }
    
    // Roof panels
    // Left roof panel
    translate([-shed_width/4, 0, wall_height + roof_rise/2])
    rotate([0, atan2(roof_rise, shed_width/2), 0])
    cube([rafter_length, shed_depth, panel_thickness], center=true);
    // Right roof panel
    translate([shed_width/4, 0, wall_height + roof_rise/2])
    rotate([0, -atan2(roof_rise, shed_width/2), 0])
    cube([rafter_length, shed_depth, panel_thickness], center=true);
}

// Render the shed
shed();