// Hose Reel Assembly
// Recreated from reference image of a wall-mounted hose reel featuring
// a flanged ribbed drum, top swivel inlet with elbow, and bottom outlet valve.

// --- Resolution ---
$fn = 100;

// --- Drum & Flange Parameters ---
flange_d = 120;          // Main flange disc diameter
flange_t = 5;            // Flange thickness
hub_d = 38;              // Central hub diameter
hub_t = 6;               // Hub protrusion toward drum
drum_width = 72;         // Inner distance between flange faces
drum_core_d = 65;        // Central drum cylinder diameter
hose_d = 12;             // Diameter of each coiled hose rib
num_coils = 6;           // Number of hose loops on drum
coil_spacing = (drum_width - hose_d) / (num_coils - 1); // Even spacing across width

// --- Right Flange Mounting Holes ---
hole_d = 6;
hole_circle_r = 28;
num_holes = 4;

// --- Pipe & Fitting Parameters ---
pipe_d = 10;
pipe_r = pipe_d / 2;
elbow_r = 18;            // Centerline bend radius for top inlet elbow

// Top inlet assembly
top_riser_height = 85;
top_coupling_h = 6;
top_hex_d = 16;
top_hex_h = 6;
side_nozzle_d = 5;
side_nozzle_l = 8;

// Bottom outlet assembly
bottom_pipe_len = 35;
valve_hex_d = 14;
valve_hex_h = 5;
valve_body_d = 16;
valve_body_h = 12;
nozzle_taper_l = 20;
nozzle_small_d = 5;
lever_l = 18;
lever_w = 3;
lever_t = 2;

// --- Derived Positions ---
left_flange_x = -drum_width/2 - flange_t/2;
right_flange_x = drum_width/2 + flange_t/2;

// --- Modules ---

// Single torus ring representing one loop of hose on the drum
module coil(x_pos) {
    // Major radius from drum axis to hose centerline
    r_major = drum_core_d/2 + hose_d/2;
    translate([x_pos, 0, 0])
    rotate([0, 90, 0])
    rotate_extrude()
    translate([r_major, 0])
    circle(d=hose_d);
}

// Left flange: solid disc with hub toward drum and small inlet boss
module left_flange() {
    union() {
        cylinder(h=flange_t, d=flange_d, center=true);
        // Hub protruding toward drum (+X local)
        translate([hub_t/2, 0, 0])
            cylinder(h=hub_t, d=hub_d, center=true);
        // Connection boss on outer face
        translate([-flange_t/2 - 1, 0, 0])
            cylinder(h=2, d=hub_d*0.8, center=true);
    }
}

// Right flange: disc with hub and through mounting holes
module right_flange() {
    difference() {
        union() {
            cylinder(h=flange_t, d=flange_d, center=true);
            // Hub protruding toward drum (-X local)
            translate([-hub_t/2, 0, 0])
                cylinder(h=hub_t, d=hub_d, center=true);
        }
        // Four mounting holes on bolt circle
        for (i = [0 : num_holes-1]) {
            rotate([0, 0, i * 360/num_holes])
                translate([hole_circle_r, 0, 0])
                cylinder(h=flange_t + hub_t + 1, d=hole_d, center=true);
        }
    }
}

// 90-degree elbow in XZ plane: connects +X direction to +Z direction
module elbow_90(r, d) {
    rotate([90, 0, 0])
    rotate_extrude(angle=90)
    translate([r, 0])
    circle(d=d);
}

// Top inlet pipe, elbow, and hex fitting with side nozzle
module top_assembly() {
    // Elbow center offset left from flange face by bend radius
    elbow_center_x = left_flange_x - elbow_r;
    
    // Quarter-torus elbow from flange face to vertical
    translate([elbow_center_x, 0, 0])
        elbow_90(elbow_r, pipe_d);
    
    // Vertical riser pipe
    riser_bottom_z = elbow_r;
    translate([elbow_center_x, 0, riser_bottom_z])
        cylinder(h=top_riser_height, d=pipe_d);
    
    // Coupling below hex cap
    translate([elbow_center_x, 0, riser_bottom_z + top_riser_height])
        cylinder(h=top_coupling_h, d=pipe_d*1.3);
    
    // Hexagonal cap / nut
    translate([elbow_center_x, 0, riser_bottom_z + top_riser_height + top_coupling_h])
        cylinder(h=top_hex_h, d=top_hex_d, $fn=6);
    
    // Side nozzle (vent / petcock)
    translate([elbow_center_x, 0, riser_bottom_z + top_riser_height + top_coupling_h - 3])
        rotate([90, 0, 0])
        cylinder(h=side_nozzle_l, d=side_nozzle_d);
    
    // Small end sphere on side nozzle
    translate([elbow_center_x, -side_nozzle_l, riser_bottom_z + top_riser_height + top_coupling_h - 3])
        sphere(d=side_nozzle_d*1.2);
}

// Bottom outlet pipe, valve body, lever handle, and tapered nozzle
module bottom_assembly() {
    // Position slightly right of drum center, at bottom of coil stack
    bx = 12;
    bz = -(drum_core_d/2 + hose_d);
    
    // Straight pipe from drum down toward valve
    translate([bx, 0, bz - bottom_pipe_len])
        cylinder(h=bottom_pipe_len, d=pipe_d);
    
    // Hexagonal nut above valve body
    translate([bx, 0, bz - bottom_pipe_len + 3])
        cylinder(h=valve_hex_h, d=valve_hex_d, $fn=6);
    
    // Valve body (ball valve style)
    valve_z = bz - bottom_pipe_len - valve_body_h/2 + 1;
    translate([bx, 0, valve_z])
        sphere(d=valve_body_d);
    
    // Lever handle pointing left (-X)
    translate([bx - lever_l/2, 0, valve_z])
        cube([lever_l, lever_w, lever_t], center=true);
    
    // Tapered nozzle below valve
    translate([bx, 0, valve_z - valve_body_d/2])
        cylinder(h=nozzle_taper_l, d1=valve_body_d*0.8, d2=nozzle_small_d);
}

// --- Main Assembly ---
union() {
    // Left flange (inlet side)
    translate([left_flange_x, 0, 0])
        left_flange();
    
    // Right flange (mounting side with holes)
    translate([right_flange_x, 0, 0])
        right_flange();
    
    // Central drum core cylinder
    rotate([0, 90, 0])
        cylinder(h=drum_width, d=drum_core_d, center=true);
    
    // Coiled hose segments filling the drum width
    for (i = [0 : num_coils-1]) {
        x = -drum_width/2 + hose_d/2 + i * coil_spacing;
        coil(x);
    }
    
    // Top inlet assembly with elbow and fitting
    top_assembly();
    
    // Bottom outlet assembly with valve and nozzle
    bottom_assembly();
}