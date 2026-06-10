// ==========================================
// Parameters
// ==========================================

// General Settings
$fn = 100; // Resolution for smooth curves

// Barrel Dimensions
barrel_length = 260;
stave_count = 18;
stave_angle = 360 / stave_count;
barrel_radius_mid = 93;      // Outer radius at center
barrel_radius_end = 69;      // Outer radius at ends

// Hoop Rings (Seal Rings)
hoop_large_od = 188.5;
hoop_small_od = 163;
hoop_height = 22;
hoop_section_r = 4;          // Approximate thickness/profile radius

// End Caps
cap_diameter = 141.2;
cap_thickness = 12;

// Bung Assembly (Top)
bung_flange_dia = 40;
bung_flange_height = 15;
bung_plug_dia = 32.5;
bung_plug_height = 14;

// Tap Assembly (Front)
knob_l1_r = 16; // Large lobe
knob_l2_r = 10; // Small lobe
knob_height = 45;
lever_ball_r = 8;
lever_arm_len = 17;
lever_arm_dia = 5;
sleeve_len = 40;
sleeve_od = 8;
sleeve_id = 6;

// Cradle Dimensions
cradle_saddle_len = 170;
cradle_saddle_wid = 45;
cradle_saddle_hgt = 25;
cradle_bar_len = 220;
cradle_key_len = 189;
cradle_channel_r = 12.5; // Concave radius for barrel

// ==========================================
// Modules
// ==========================================

// Utility: Rounded Box
module rounded_box(w, d, h, r) {
    minkowski() {
        cube([w-r*2, d-r*2, h-r*2], center=true);
        sphere(r);
    }
}

// Component: Single Stave (Curved Segment)
// Constructs a wedge of the barrel volume with slight detailing
module stave(length, r_mid, r_end) {
    // Create the basic wedge shape using intersection
    intersection() {
        // The barrel envelope: We use a hull of two cylinders to create the bulge
        // Centered at origin, aligned on X axis
        translate([0, 0, 0]) 
            hull() {
                rotate([0, 90, 0]) cylinder(h=1, r=r_mid, center=true); // Middle slice
                translate([length/2 - 10, 0, 0]) rotate([0, 90, 0]) cylinder(h=1, r=r_end, center=true); // End slice
                translate([-length/2 + 10, 0, 0]) rotate([0, 90, 0]) cylinder(h=1, r=r_end, center=True); // Other end
            }
        
        // The angular wedge (20 degrees)
        // We rotate a cube to act as the slice
        rotate([0, 0, -stave_angle/2])
            cube([r_mid * 2, r_mid * 2, length + 2], center=false);
    }
    
    // Optional: Add subtle visual detail for the "step" or bevel on edges 
    // (Kept minimal to maintain manifold integrity)
}

// Component: Hoop Ring
// Sculpted toroidal/conical cross-section
module hoop_ring(od, height) {
    or = od / 2;
    ir = or - 6; // Thickness estimate
    
    difference() {
        // Base ring shape
        rotate_extrude()
            translate([or - 3, 0, 0])
                circle(r=3); // Simple torus-like profile
        
        // Inner cut to make it a band (optional, depends on if it sits on surface or wraps)
        // Assuming it wraps around, we keep it solid torus or thin band
        // Let's make it a profiled band
    }
    
    // Re-implementing as a proper profiled ring for better match to description
    // Using a custom 2D profile extruded
    rotate_extrude()
        polygon(points=[
            [ir, -height/2 + 2],
            [or - 1, -height/2],
            [or, -height/2 + 2], // Outer edge round
            [or, height/2 - 2],
            [or - 1, height/2],
            [ir, height/2 - 2]
        ]);
}

// Component: End Cap
// Plain or Decorated
module end_cap(decorated=false) {
    r = cap_diameter / 2;
    h = cap_thickness;
    
    difference() {
        union() {
            // Main disc
            cylinder(h=h, r=r, center=true);
            
            // Rim details (chamfer/bevel)
            rotate_extrude()
                translate([r-2, h/2-2, 0])
                    circle(r=2);
        }
        
        // Decorative text if flagged
        if (decorated) {
            // Embossed text simulation (raised)
            // We actually want it raised, so we shouldn't diff it here, 
            // but union it. However, simpler to just leave flat or use linear_extrude on text
            translate([0, 0, h/2 + 0.5])
                linear_extrude(height=1)
                    text("Debowa", size=20, halign="center", valign="center");
                    
            // Locating boss on back (if needed for positioning logic, usually hidden)
            translate([0, 0, -h/2 - 1.5])
                cylinder(h=3, r=10);
        }
    }
}

// Component: Bung (Flanged Collar + Plug)
module bung_assembly() {
    // Flanged Collar
    fr = bung_flange_dia / 2;
    fh = bung_flange_height;
    
    // Collar Body
    difference() {
        union() {
            // Base flange
            cylinder(h=4, r=fr, center=true);
            // Upper hub
            translate([0, 0, 2]) cylinder(h=fh-2, r=fr*0.7, center=true);
        }
        // Countersunk hole
        cylinder(h=fh+1, r=7.5, center=true); // 15 bore
        translate([0, 0, 3]) cylinder(h=5, r=11.5, center=true); // 23 mouth
    }
    
    // Plug (sits on top/in collar)
    translate([0, 0, fh/2 + bung_plug_height/2 - 1]) {
        pr = bung_plug_dia / 2;
        ph = bung_plug_height;
        cylinder(h=ph, r=pr, center=true);
        // Edge fillets
        translate([0, 0, ph/2]) cylinder(h=1, r=pr, center=true);
        translate([0, 0, -ph/2]) cylinder(h=1, r=pr, center=true);
    }
}

// Component: Tap Sub-assembly
module tap_assembly() {
    // Spacer Sleeve
    color("gray")
        difference() {
            cylinder(h=sleeve_len, r=sleeve_od/2, center=true);
            cylinder(h=sleeve_len+1, r=sleeve_id/2, center=true);
        }
        
    // Ball Lever Handle
    translate([0, 15, 0]) { // Offset from sleeve
        // Disc base
        cylinder(h=2, r=10.6, center=true);
        // Sphere
        translate([0, 5, 0]) sphere(r=lever_ball_r);
        // Arm
        translate([0, 5 + lever_ball_r, 0]) 
            rotate([0, 90, 0]) 
                cylinder(h=lever_arm_len, d=lever_arm_dia, center=true);
    }

    // Knob (Dual-lobe)
    translate([0, -20, 0]) { // Offset
        // Simplified dual lobe: Sphere + smaller sphere
        // Large lobe base
        cylinder(h=knob_height*0.6, r=knob_l1_r*0.8, center=true);
        translate([0, knob_height*0.3, 0]) sphere(r=knob_l1_r);
        // Small lobe
        translate([0, knob_height*0.6, 0]) sphere(r=knob_l2_r);
        // Blind bore
        cylinder(h=27.5, r=4, center=true);
    }
}

// Component: Saddle Support
module saddle_support(len, wid, hgt, channel_r) {
    difference() {
        // Main block
        rounded_box(len, wid, hgt, 1);
        
        // Concave channel on top (Y+ direction usually)
        // Aligning such that the barrel (radius ~90) sits in it
        // Channel runs along X (length)
        translate([0, wid/2 - channel_r + 2, hgt/2 + channel_r - 5]) 
            rotate([90, 0, 0]) 
                cylinder(h=wid+2, r=channel_r, center=true);
                
        // Trim ends to look like the image (slightly rounded/domed ends)
        // Handled implicitly by rounded_box, but let's ensure the channel doesn't poke out ugly
    }
}

// Component: Structural Bar
module structural_bar(len) {
    rounded_box(len, 25, 25, 1);
}

// Component: Key Bar (Trapezoidal)
module key_bar(len) {
    // Trapezoid cross section: top 25, bottom 25? No, angled sides.
    // "22 degree angled sides"
    // Linear extrusion of a trapezoid
    linear_extrude(height=len, center=true)
        polygon(points=[
            [-12.5, -12.5], 
            [12.5, -12.5], 
            [8, 12.5],   // Angled in
            [-8, 12.5]    // Angled in
        ]);
    // Note: fillets on a generic polyhedron are hard in raw SCAD without helpers,
    // relying on $fn and visual approximation.
}


// ==========================================
// Main Assembly
// ==========================================

union() {

    // --- 1. Cradle (Base) ---
    color("DimGray") {
        // Two Saddle Supports
        translate([0, 50, -barrel_radius_end - 10]) 
            saddle_support(cradle_saddle_len, cradle_saddle_wid, cradle_saddle_hgt, cradle_channel_r);
            
        translate([0, -50, -barrel_radius_end - 10]) 
            saddle_support(cradle_saddle_len, cradle_saddle_wid, cradle_saddle_hgt, cradle_channel_r);
            
        // Crossbars connecting saddles
        // Front bar
        translate([80, 0, -barrel_radius_end - 10 - 12]) 
            structural_bar(cradle_bar_len); // Rotated? No, length 220 along Y
            
        // Back bar
        translate([-80, 0, -barrel_radius_end - 10 - 12]) 
            structural_bar(cradle_bar_len);
            
        // Key bar (front lower)
        translate([80, 0, -barrel_radius_end - 10 - 25]) 
            rotate([0, 90, 0]) // Orient along Y
                key_bar(cradle_key_len);
    }


    // --- 2. Barrel Body (Staves) ---
    color("Sienna") {
        for (i = [0 : stave_count - 1]) {
            rotate([0, i * stave_angle, 0])
                stave(barrel_length, barrel_radius_mid, barrel_radius_end);
        }
    }
    
    
    // --- 3. Hoop Rings ---
    color("Silver") {
        // Positions along X axis
        // 2 Small, 2 Large
        // Distribute symmetrically
        
        // Small Hoops (Inner pair)
        translate([60, 0, 0]) hoop_ring(hoop_small_od, hoop_height);
        translate([-60, 0, 0]) hoop_ring(hoop_small_od, hoop_height);
        
        // Large Hoops (Outer pair)
        translate([100, 0, 0]) hoop_ring(hoop_large_od, hoop_height);
        translate([-100, 0, 0]) hoop_ring(hoop_large_od, hoop_height);
    }
    

    // --- 4. End Caps ---
    color("SaddleBrown") {
        // Left Cap (Decorated - "Debowa")
        translate([-barrel_length/2 - cap_thickness/2 + 5, 0, 0]) 
            end_cap(true);
            
        // Right Cap (Plain)
        translate([barrel_length/2 + cap_thickness/2 - 5, 0, 0]) 
            end_cap(false);
    }
    
    
    // --- 5. Bung Fitting (Top) ---
    // Positioned on top of barrel (Y+ or Z+ depending on orientation)
    // With barrel on X axis, "Top" is Y or Z. Let's assume standard gravity Z is down, 
    // so Top is Y+ (rotated 90deg from vertical in this view) or simply Z+ if we treat 
    // the barrel as upright then rotated. 
    // In current coords (X-length, Y-Z circular): Top is Y+.
    color("LightGray") {
        translate([20, barrel_radius_mid, 0]) 
            bung_assembly();
    }
    
    
    // --- 6. Tap Assembly (Front) ---
    // Attached to the front-left area (near decorated cap)
    color("White") {
        translate([-barrel_length/2 + 30, 0, -barrel_radius_end - 5]) {
            rotate([0, 90, 0]) // Point outwards/downwards
                tap_assembly();
        }
    }

}