// Global resolution
$fn = 100;

// ==================== Barrel Parameters ====================
stave_count = 18;               // Number of curved segments
stave_length = 259.6;           // Length of each stave (along barrel axis)
stave_width = 33;               // Width of stave (tangential)
stave_height = 33.5;            // Height of stave (radial)
barrel_outer_radius = 100;      // Outer radius of assembled barrel
stave_rotation_step = 360 / stave_count;  // Rotation between staves

// ==================== Seal Ring Parameters ====================
seal_small_outer_r = 163 / 2;   // Small seal outer radius
seal_small_height = 21;         // Small seal axial height
seal_small_inner_r = seal_small_outer_r - 1.5;  // Small seal inner radius (1.5mm thickness)

seal_large_outer_r = 188.5 / 2; // Large seal outer radius
seal_large_height = 21.9;       // Large seal axial height
seal_large_inner_r = seal_large_outer_r - 1.25; // Large seal inner radius (1.25mm thickness)

// Seal positions along barrel axis (X)
seal_positions = [50, 209.6];   // Large seals at these X coordinates

// ==================== End Cap Parameters ====================
cap_outer_r = 141.2 / 2;        // Cap outer radius
cap_thickness = 12;             // Cap thickness
cap_boss_r = 10;                // Decorated cap boss radius
cap_boss_depth = 3;             // Decorated cap boss depth

// ==================== Flanged Collar (Bung) Parameters ====================
collar_outer_r = 40 / 2;        // Collar outer radius
collar_height = 15;             // Collar height
collar_countersink_r = 23 / 2;  // Countersink radius
collar_bore_r = 15 / 2;         // Through-bore radius
collar_position = [stave_length / 2, barrel_outer_radius, 0];  // Midway on barrel top
collar_orientation = [90, 0, 0]; // Orient collar axis along Y (top of barrel)

// ==================== Bung Plug Parameters ====================
plug_r = 16.25;                 // Plug radius
plug_height = 14;               // Plug height

// ==================== Tap Assembly Parameters ====================
tap_position = [0, 0, barrel_outer_radius];  // Tap on front face (X=0, top Z)

// Dual-lobe knob
knob_length = 45;               // Knob total length
knob_diameter = 32;             // Knob maximum diameter
knob_bore_r = 4;                // Blind bore radius
knob_bore_depth = 27.5;         // Blind bore depth

// Ball lever handle
ball_sphere_r = 10;             // Sphere radius
ball_lever_d = 5;               // Lever arm diameter
ball_lever_length = 17.4;       // Lever arm length
ball_base_r = 10.6;             // Disc base radius

// Spacer sleeve
sleeve_outer_r = 4;             // Sleeve outer radius
sleeve_inner_r = 3;             // Sleeve inner radius
sleeve_length = 40;             // Sleeve length

// ==================== Cradle Parameters ====================
saddle_length = 170;            // Saddle support length
saddle_width = 45;              // Saddle support width
saddle_height = 25;             // Saddle support height
saddle_channel_r = barrel_outer_radius;  // Channel radius matches barrel

crossbar_length = 220;          // Crossbar length
crossbar_width = 25;            // Crossbar width
crossbar_height = 25;           // Crossbar height

key_length = 189;               // Key bar length
key_width = 25;                 // Key bar top width
key_height = 25;                // Key bar height
key_angle = 22;                 // Trapezoidal side angle (degrees)

cradle_position = [0, -barrel_outer_radius - saddle_height / 2, 0];  // Cradle below barrel


// ==================== Helper Modules ====================
// Single stave (curved segment)
module stave() {
    cube([stave_length, stave_width, stave_height], center=true);
}

// Assembled barrel (18 staves rotated around X-axis)
module barrel() {
    for (i = [0 : stave_count - 1]) {
        rotate([i * stave_rotation_step, 0, 0])
        translate([0, 0, barrel_outer_radius - stave_height / 2])
        stave();
    }
}

// Annular seal ring
module seal_ring(outer_r, inner_r, height) {
    difference() {
        cylinder(h=height, r=outer_r, center=true);
        cylinder(h=height + 1, r=inner_r, center=true);  // +1 to avoid z-fighting
    }
}

// Plain end cap
module plain_cap() {
    cylinder(h=cap_thickness, r=cap_outer_r, center=true);
}

// Decorated end cap (with rear boss)
module decorated_cap() {
    union() {
        cylinder(h=cap_thickness, r=cap_outer_r, center=true);
        translate([0, 0, -cap_thickness/2 + cap_boss_depth/2])
        cylinder(h=cap_boss_depth, r=cap_boss_r, center=true);
    }
}

// Flanged collar (bung fitting)
module flanged_collar() {
    difference() {
        // Collar body
        cylinder(h=collar_height, r=collar_outer_r, center=true);
        // Countersunk through-hole
        translate([0, 0, collar_height/2 - collar_countersink_r])
        cylinder(h=collar_countersink_r, r1=collar_countersink_r, r2=collar_bore_r, center=true);
        cylinder(h=collar_height + 1, r=collar_bore_r, center=true);
    }
}

// Bung plug
module bung_plug() {
    cylinder(h=plug_height, r=plug_r, center=true);
}

// Dual-lobe knob (simplified with spherical ends)
module dual_lobe_knob() {
    difference() {
        union() {
            // Middle cylinder
            cylinder(h=knob_length - knob_diameter, r=knob_diameter/2, center=true);
            // Front sphere
            translate([0, 0, knob_length/2 - knob_diameter/2])
            sphere(r=knob_diameter/2);
            // Rear sphere
            translate([0, 0, -knob_length/2 + knob_diameter/2])
            sphere(r=knob_diameter/2);
        }
        // Blind bore (subtract from front)
        translate([0, 0, knob_length/2 - knob_bore_depth/2])
        cylinder(h=knob_bore_depth, r=knob_bore_r, center=true);
    }
}

// Ball lever handle
module ball_lever_handle() {
    union() {
        // Disc base
        cylinder(h=2, r=ball_base_r, center=true);
        // Sphere
        translate([0, 0, 2/2 + ball_sphere_r])
        sphere(r=ball_sphere_r);
        // Lever arm
        translate([0, 0, 2/2 + 2*ball_sphere_r + ball_lever_length/2])
        cylinder(h=ball_lever_length, r=ball_lever_d/2, center=true);
    }
}

// Spacer sleeve
module spacer_sleeve() {
    difference() {
        cylinder(h=sleeve_length, r=sleeve_outer_r, center=true);
        cylinder(h=sleeve_length + 1, r=sleeve_inner_r, center=true);
    }
}

// Complete tap assembly
module tap_assembly() {
    dual_lobe_knob();
    translate([0, 0, knob_length/2 + sleeve_length/2])
    spacer_sleeve();
    translate([0, 0, knob_length/2 + sleeve_length + 2/2 + 2*ball_sphere_r + ball_lever_length/2])
    ball_lever_handle();
}

// Saddle support (cradle part)
module saddle_support() {
    difference() {
        // Main block
        cube([saddle_length, saddle_width, saddle_height], center=true);
        // Concave channel (matches barrel curvature)
        translate([0, 0, saddle_height/2 - saddle_channel_r])
        rotate([0, 90, 0])
        cylinder(h=saddle_length + 1, r=saddle_channel_r, center=true);
    }
}

// Crossbar (cradle part)
module crossbar() {
    cube([crossbar_length, crossbar_width, crossbar_height], center=true);
}

// Key bar (trapezoidal cross-section)
module key_bar() {
    bottom_width = key_width + 2 * key_height * tan(key_angle);
    linear_extrude(height=key_length, center=true)
    polygon(points=[
        [-bottom_width/2, -key_height/2],
        [bottom_width/2, -key_height/2],
        [key_width/2, key_height/2],
        [-key_width/2, key_height/2]
    ]);
}

// Complete cradle assembly
module cradle() {
    // Saddle supports (front and back)
    translate([0, 0, 0])
    saddle_support();
    translate([stave_length, 0, 0])
    mirror([1, 0, 0])
    saddle_support();
    // Crossbars (left and right)
    translate([stave_length/2, 0, -crossbar_length/2])
    crossbar();
    translate([stave_length/2, 0, crossbar_length/2])
    crossbar();
    // Key bar (front)
    translate([0, 0, 0])
    key_bar();
}


// ==================== Main Assembly ====================
union() {
    // Barrel body
    barrel();
    
    // Seal rings (2 large, 2 small)
    translate([seal_positions[0], 0, 0])
    seal_ring(seal_large_outer_r, seal_large_inner_r, seal_large_height);
    translate([seal_positions[1], 0, 0])
    seal_ring(seal_large_outer_r, seal_large_inner_r, seal_large_height);
    translate([0, 0, 0])
    seal_ring(seal_small_outer_r, seal_small_inner_r, seal_small_height);
    translate([stave_length, 0, 0])
    seal_ring(seal_small_outer_r, seal_small_inner_r, seal_small_height);
    
    // End caps (plain front, decorated rear)
    translate([0, 0, 0])
    rotate([0, 90, 0])
    plain_cap();
    translate([stave_length, 0, 0])
    rotate([0, 90, 0])
    decorated_cap();
    
    // Flanged collar and bung plug
    translate(collar_position)
    rotate(collar_orientation)
    flanged_collar();
    translate(collar_position)
    rotate(collar_orientation)
    translate([0, 0, collar_height/2 + plug_height/2])
    bung_plug();
    
    // Tap assembly (front face)
    translate(tap_position)
    tap_assembly();
    
    // Cradle (under barrel)
    translate(cradle_position)
    cradle();
}