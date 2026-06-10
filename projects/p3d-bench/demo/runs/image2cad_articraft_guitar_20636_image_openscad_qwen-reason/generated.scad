// Hofner-style Violin Bass Model
// Parametric OpenSCAD Code
// Designed for 3D printing / STL export

$fn = 60; // Resolution for curves (higher = smoother)

// --- Parameters ---
// Dimensions in mm
body_thickness = 45;
top_plate_thickness = 6;
rim_width = 8;

neck_length = 450; // From nut to body joint
neck_width_nut = 38;
neck_width_joint = 46;
neck_thickness = 20;
fretboard_thickness = 6;
neck_z_offset = 20; // Raises neck to align fretboard with body top

headstock_length = 150;
headstock_thickness = 15;

scale_length = 800; // Nut to Bridge distance

// --- Main Assembly ---
module violin_bass() {
    union() {
        body_assembly();
        // Neck and Headstock are raised to sit on the body
        translate([0, 0, neck_z_offset]) {
            neck_assembly();
            headstock_assembly();
        }
        hardware_assembly();
        strings_assembly();
    }
}

// --- Body Module ---
module body_assembly() {
    // Define the violin body outline using a polygon
    // Coordinates relative to neck joint (0,0)
    // Approximating the Hofner 500/1 shape
    body_outline = [
        [25, 0],          // Neck joint right
        [85, -50],        // Upper bout right
        [65, -140],       // Waist right
        [95, -260],       // Lower bout right
        [0, -380],        // Bottom tip
        [-95, -260],      // Lower bout left
        [-65, -140],      // Waist left
        [-85, -50],       // Upper bout left
        [-25, 0]          // Neck joint left
    ];

    difference() {
        // Main body block
        linear_extrude(height=body_thickness)
            polygon(body_outline);

        // Hollow out the body (leave top plate and rims)
        // We extrude a smaller version of the polygon inside
        translate([0, 0, top_plate_thickness])
            linear_extrude(height=body_thickness - top_plate_thickness + 2) // +2 to ensure cut through
            offset(delta=-rim_width)
            polygon(body_outline);
    }

    // F-Holes
    // Upper bout f-hole (Bass side - Left in standard view)
    // Bulb at the top
    translate([-50, -60, 0])
        rotate([0, 0, 20])
        linear_extrude(height=body_thickness + 2)
        text("f", size=55, halign="center", valign="center", font="Arial:style=Bold");

    // Lower bout f-hole (Treble side - Right in standard view)
    // Bulb at the bottom (requires 180 rotation)
    translate([50, -240, 0])
        rotate([0, 0, 160]) // 180 - 20 degrees
        linear_extrude(height=body_thickness + 2)
        text("f", size=55, halign="center", valign="center", font="Arial:style=Bold");
}

// --- Neck Module ---
module neck_assembly() {
    // Neck wood (tapered)
    // Using hull to create a smooth taper between two blocks
    hull() {
        // At body joint
        translate([-neck_width_joint/2, 0, 0])
            cube([neck_width_joint, 20, neck_thickness]);
        // At nut
        translate([-neck_width_nut/2, neck_length, 0])
            cube([neck_width_nut, 20, neck_thickness]);
    }

    // Fretboard
    // Slightly wider and thicker than the neck wood
    hull() {
        // At body joint
        translate([-neck_width_joint/2 - 2, 0, neck_thickness])
            cube([neck_width_joint + 4, 20, fretboard_thickness]);
        // At nut
        translate([-neck_width_nut/2 - 2, neck_length, neck_thickness])
            cube([neck_width_nut + 4, 20, fretboard_thickness]);
    }

    // Frets
    // Calculate positions based on scale length formula: d = S - (S / 2^(n/12))
    // Distance from Nut = Scale * (1 - 1/2^(n/12))
    for (i = [1:24]) {
        dist_from_nut = scale_length * (1 - 1/pow(2, i/12));
        fret_y = neck_length - dist_from_nut;
        
        // Only render frets that fall on the neck (y > 0)
        if (fret_y > 10) {
            // Fret wire approximation
            translate([0, fret_y, neck_thickness])
                cube([neck_width_nut + 6, 2, fretboard_thickness + 1], center=true);
        }
    }
}

// --- Headstock Module ---
module headstock_assembly() {
    // Headstock shape using hull of circles for smooth organic curves
    linear_extrude(height=headstock_thickness)
        hull() {
            translate([0, neck_length + 10]) circle(r=20);   // Base near nut
            translate([0, neck_length + 70]) circle(r=28);   // Widest part
            translate([0, neck_length + 130]) circle(r=14);  // Tip
        }

    // Tuning Pegs
    // 2 on each side (4 total)
    tuner_y_positions = [neck_length + 40, neck_length + 100];
    
    for (y = tuner_y_positions) {
        // Left side tuners (Bass side)
        // Post
        translate([-25, y, headstock_thickness/2])
            rotate([0, 90, 0])
            cylinder(h=35, r=4, center=true); 
        // Knob
        translate([-45, y, headstock_thickness/2])
            cylinder(h=12, r=7, center=true);

        // Right side tuners (Treble side)
        // Post
        translate([25, y, headstock_thickness/2])
            rotate([0, 90, 0])
            cylinder(h=35, r=4, center=true);
        // Knob
        translate([45, y, headstock_thickness/2])
            cylinder(h=12, r=7, center=true);
    }
}

// --- Hardware Module ---
module hardware_assembly() {
    // Bridge (Floating style)
    translate([0, -350, body_thickness])
        cube([60, 12, 8], center=true);
        
    // Pickups (Staple style - rectangular blocks)
    // Neck Pickup
    translate([0, -120, body_thickness + 2])
        cube([70, 14, 10], center=true);
    // Bridge Pickup
    translate([0, -260, body_thickness + 2])
        cube([70, 14, 10], center=true);
        
    // Tailpiece (Trapeze style)
    // Main mounting block
    translate([0, -375, body_thickness])
        cube([50, 8, 6], center=true);
    // Tailpiece bar (simplified cylinder)
    translate([0, -385, body_thickness])
        rotate([90, 0, 0])
        cylinder(h=80, r=3, center=true);
        
    // Control Knobs (Volume/Tone)
    translate([50, -80, body_thickness + 2])
        cylinder(h=10, r=7, center=true);
    translate([50, -110, body_thickness + 2])
        cylinder(h=10, r=7, center=true);
        
    // Toggle Switch
    translate([40, -60, body_thickness + 2])
        cube([8, 20, 5], center=true);
}

// --- Strings Module ---
module strings_assembly() {
    // 4 strings from Nut to Tailpiece
    // Nut is at y=neck_length
    // Tailpiece is at y=-385
    
    nut_z = neck_thickness + fretboard_thickness;
    tailpiece_z = body_thickness;
    tailpiece_y = -385;
    
    // String spacing
    nut_spacing = 10;
    tailpiece_spacing = 14;
    
    for (i = [-1.5, -0.5, 0.5, 1.5]) {
        x_nut = i * nut_spacing;
        x_tail = i * tailpiece_spacing;
        
        // Use hull of spheres to create a cylinder-like string
        hull() {
            translate([x_nut, neck_length, nut_z]) sphere(r=0.6);
            translate([x_tail, tailpiece_y, tailpiece_z]) sphere(r=0.6);
        }
    }
}

// Generate the model
violin_bass();