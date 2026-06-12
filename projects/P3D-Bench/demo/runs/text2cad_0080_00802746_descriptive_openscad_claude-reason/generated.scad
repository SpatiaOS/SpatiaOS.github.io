// Parameters - Upper Cylinder
upper_od = 50;          // Upper cylinder outer diameter
upper_h = 45;           // Upper cylinder height
upper_bore_d1 = 30;     // Bore first step diameter
upper_bore_d2 = 24;     // Bore second step diameter
upper_bore_d3 = 18;     // Bore third step (through) diameter
bore_step1_depth = 10;  // Depth of first bore step from top
bore_step2_depth = 15;  // Depth of second bore step
bore_through = 50;      // Through bore depth (full)

// Parameters - Lower Side Cylinder
lower_od = 36;          // Lower cylinder outer diameter
lower_h = 30;           // Lower cylinder height
lower_offset_x = 20;   // X offset from upper center
lower_offset_z = -10;  // Z offset (overlapping region)

// Parameters - Small Circular Cuts (holes/recesses on body)
small_hole_d = 6;       // Small hole diameter
small_hole_depth = 12;  // Depth of small holes
num_upper_holes = 4;    // Number of holes around upper cylinder
hole_ring_r = 20;       // Radius of hole pattern on upper cyl

// Parameters - Underside Annular Reliefs
annular_relief_od = 40; // Annular relief outer diameter
annular_relief_id = 28; // Annular relief inner diameter
annular_relief_depth = 4; // Depth of annular relief

// Parameters - Lower Cylinder Bore
lower_bore_d1 = 22;    // Lower bore first step
lower_bore_d2 = 16;    // Lower bore second step
lower_bore_step_depth = 12;
lower_bore_through_depth = 35;

// Parameters - Side Recesses
side_recess_d = 8;     // Side circular recess diameter
side_recess_depth = 5; // Side recess depth
num_side_recesses = 3; // Number of side recesses on lower cyl

// Resolution
$fn = 100;

// --- Helper Modules ---

// Stepped bore module (top entry)
module stepped_bore(d1, d2, d3, depth1, depth2, total_h) {
    // First step (widest, shallowest)
    translate([0, 0, total_h - depth1])
        cylinder(h = depth1 + 1, d = d1);
    // Second step
    translate([0, 0, total_h - depth1 - depth2])
        cylinder(h = depth2 + depth1 + 1, d = d2);
    // Through bore
    translate([0, 0, -1])
        cylinder(h = total_h + 2, d = d3);
}

// Circular hole pattern
module hole_pattern(n, radius, hole_d, hole_depth, start_z) {
    for (i = [0 : n - 1]) {
        angle = i * 360 / n;
        translate([radius * cos(angle), radius * sin(angle), start_z])
            cylinder(h = hole_depth + 1, d = hole_d);
    }
}

// Annular relief (ring-shaped recess)
module annular_relief(od, id, depth) {
    difference() {
        cylinder(h = depth + 0.01, d = od);
        translate([0, 0, -0.5])
            cylinder(h = depth + 1, d = id);
    }
}

// --- Main Assembly ---
difference() {
    // Positive geometry: union of upper and lower cylinders
    union() {
        // Upper main cylinder
        cylinder(h = upper_h, d = upper_od);
        
        // Lower side cylinder, offset and overlapping
        translate([lower_offset_x, 0, lower_offset_z])
            cylinder(h = lower_h, d = lower_od);
    }
    
    // --- Subtractive features ---
    
    // Upper stepped bore (from top)
    stepped_bore(upper_bore_d1, upper_bore_d2, upper_bore_d3,
                 bore_step1_depth, bore_step2_depth, upper_h);
    
    // Small circular cuts on upper cylinder top face
    hole_pattern(num_upper_holes, hole_ring_r, small_hole_d, 
                 small_hole_depth, upper_h - small_hole_depth);
    
    // Side recesses on lower cylinder (radial cuts)
    for (i = [0 : num_side_recesses - 1]) {
        angle = i * 360 / num_side_recesses + 45;
        translate([lower_offset_x + (lower_od/2) * cos(angle),
                   (lower_od/2) * sin(angle),
                   lower_offset_z + lower_h/2])
            rotate([0, 90, angle])
                cylinder(h = side_recess_depth, d = side_recess_d);
    }
    
    // Lower cylinder stepped bore (from bottom)
    translate([lower_offset_x, 0, lower_offset_z - 1]) {
        // First step
        cylinder(h = lower_bore_step_depth + 1, d = lower_bore_d1);
        // Second step (deeper, narrower)
        cylinder(h = lower_bore_through_depth + 1, d = lower_bore_d2);
    }
    
    // Underside annular relief on upper cylinder (bottom face)
    translate([0, 0, -0.01])
        annular_relief(annular_relief_od, annular_relief_id, 
                       annular_relief_depth);
    
    // Additional shallow annular relief at mid-depth (hidden interior)
    translate([0, 0, annular_relief_depth])
        annular_relief(annular_relief_od - 6, annular_relief_id + 4, 
                       annular_relief_depth / 2);
    
    // Two extra small through-holes on upper cylinder flange area
    for (angle = [60, 240]) {
        translate([upper_od/2 * 0.7 * cos(angle),
                   upper_od/2 * 0.7 * sin(angle), -1])
            cylinder(h = upper_h + 2, d = small_hole_d * 0.7);
    }
}