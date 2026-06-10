// Electric Guitar Model - Semi-Hollow Body Style
// Parametric OpenSCAD implementation

// ============================================
// PARAMETERS
// ============================================

// Global settings
$fn = 50; // Resolution for curved surfaces

// Body dimensions
body_length = 420;      // Length of main body
body_width_lower = 340; // Width at lower bout
body_width_upper = 280; // Width at upper bout  
body_thickness = 45;    // Overall body thickness
body_edge_radius = 8;   // Rounded edge radius
body_depth = 42;        // Inner body depth before arch top

// Waist/curve parameters
waist_position = 160;   // Distance from bottom to waist
waist_width = 200;      // Width at waist

// Neck dimensions
neck_length = 620;      // Scale length area
neck_width_nut = 42;    // Width at nut
neck_width_body = 56;   // Width at body joint
neck_thickness = 18;    // Neck thickness
fret_count = 22;        // Number of frets
fret_wire_height = 1.2;
fret_wire_width = 0.2;

// Headstock dimensions
headstock_length = 130;
headstock_width_max = 85;
headstock_width_min = 52;

// Hardware dimensions
pickup_length = 68;
pickup_width = 16;
pickup_height = 12;
bridge_length = 75;
bridge_width = 18;
knob_diameter = 14;
knob_height = 10;
f_hole_size = [70, 25]; // Approximate f-hole size

// ============================================
// MODULES
// ============================================

// Main body profile generator using hull approximation
module body_profile() {
    // Define key points for the body outline
    hull() {
        // Lower bout (bottom curve)
        translate([0, 0]) 
            circle(d=body_width_lower * 0.95);
        
        // Lower waist transition
        translate([0, waist_position * 0.5])
            circle(d=(body_width_lower + waist_width) / 2);
        
        // Waist point
        translate([0, waist_position])
            circle(d=waist_width);
        
        // Upper waist transition
        translate([0, waist_position + (body_length - waist_position) * 0.4])
            circle(d=(waist_width + body_width_upper) / 2);
        
        // Upper bout (top curve near neck)
        translate([0, body_length * 0.88])
            circle(d=body_width_upper * 0.9);
        
        // Horn/cutaway point
        translate([body_width_upper * 0.3, body_length * 0.72])
            circle(d=60);
    }
}

// Complete body with thickness and edge rounding
module guitar_body() {
    difference() {
        // Main body extrusion
        linear_extrude(height=body_thickness, center=true)
            body_profile();
        
        // F-holes (characteristic of semi-hollow bodies)
        // Left f-hole
        translate([-55, body_length * 0.55, 0])
            rotate([0, 0, 15])
            scale([1, 1.3, 1])
            linear_extrude(height=body_thickness + 1, center=true)
                f_hole_shape();
            
        // Right f-hole  
        translate([55, body_length * 0.58, 0])
            rotate([0, 0, -15])
            scale([1, 1.3, 1])
            linear_extrude(height=body_thickness + 1, center=true)
                f_hole_shape();
        
        // Neck pocket (where neck joins body)
        translate([0, body_length - 5, -body_thickness/2 + neck_thickness/2 - 2])
            cube([neck_width_body + 2, 25, neck_thickness + 4], center=true);
    }
    
    // Binding detail (slight lip around edge)
    color("ivory")
        binding();
}

// F-hole shape generator
module f_hole_shape() {
    // Stylized f-hole using two circles connected
    union() {
        translate([0, -f_hole_size[1]/3])
            circle(d=f_hole_size[0] * 0.35);
        translate([0, f_hole_size[1]/3])
            circle(d=f_hole_size[0] * 0.28);
        // Connecting slot
        square([f_hole_size[0] * 0.15, f_hole_size[1] * 0.5], center=true);
    }
}

// Decorative binding around body edge
module binding() {
    difference() {
        linear_extrude(height=2, center=true)
            offset(delta=-3)
                body_profile();
        linear_extrude(height=3, center=true)
            offset(delta=-6)
                body_profile();
    }
    translate([0, 0, body_thickness/2 - 1])
        linear_extrude(height=2, center=true)
            offset(delta=-3)
                body_profile();
}

// Guitar neck module
module guitar_neck() {
    // Tapered neck shape
    translate([0, body_length/2 + neck_length/2 - 10, body_thickness/2 - neck_thickness/2 + 2])
        hull() {
            // At body joint (wider)
            translate([0, -neck_length/2 + 10, 0])
                rounded_box(neck_width_body, 20, neck_thickness, 2);
            // At nut (narrower)
            translate([0, neck_length/2 - headstock_length, 0])
                rounded_box(neck_width_nut, 15, neck_thickness - 4, 2);
        }
    
    // Fretboard (darker wood appearance)
    color("saddlebrown")
    translate([0, body_length/2 + neck_length/2 - 10, body_thickness/2 - neck_thickness/2 + 4])
        hull() {
            translate([0, -neck_length/2 + 15, 0])
                rounded_box(neck_width_body - 2, 22, 3, 1);
            translate([0, neck_length/2 - headstock_length + 5, 0])
                rounded_box(neck_width_nut - 2, 18, 3, 1);
        }
    
    // Frets
    color("silver")
    for (i = [0:fret_count-1]) {
        fret_position = i * (neck_length - headstock_length - 30) / fret_count;
        translate([
            0, 
            body_length/2 + 20 + fret_position, 
            body_thickness/2 - neck_thickness/2 + 6
        ])
            cube([neck_width_nut - i*(neck_width_body-neck_width_nut)/fret_count - 4, fret_wire_width, fret_wire_height], center=true);
    }
    
    // Dot inlays (position markers)
    color("white")
    for (i = [2, 4, 6, 8, 11, 14, 16, 18, 20]) {
        if (i < fret_count) {
            fret_pos = i * (neck_length - headstock_length - 30) / fret_count;
            translate([0, body_length/2 + 20 + fret_pos, body_thickness/2 - neck_thickness/2 + 6])
                cylinder(h=1, d=5);
        }
    }
}

// Headstock module
module headstock() {
    color("saddlebrown")
    translate([0, body_length/2 + neck_length - headstock_length/2 - 5, body_thickness/2 - neck_thickness/2 + 2])
        hull() {
            // Base (connects to neck)
            translate([0, -headstock_length/2 + 10, 0])
                rounded_box(headstock_width_min, 20, neck_thickness - 2, 3);
            // Top (wider, angled look)
            translate([-5, headstock_length/2 - 10, 0])
                rounded_box(headstock_width_max, 25, neck_thickness - 4, 5);
        }
    
    // Tuning pegs/machines
    color("chrome")
    for (side = [-1, 1]) {
        for (i = [0:2]) {
            translate([
                side * (15 + i * 18),
                body_length/2 + neck_length - 30 - i * 25,
                body_thickness/2 + 5
            ])
                rotate([90, 0, side * 20])
                    cylinder(h=25, d=6);
            // Tuning button
            translate([
                side * (20 + i * 20),
                body_length/2 + neck_length - 35 - i * 25,
                body_thickness/2 + 8
            ])
                sphere(d=10);
        }
    }
    
    // Nut (at top of fretboard)
    color("white")
    translate([0, body_length/2 + neck_length - headstock_length, body_thickness/2 - neck_thickness/2 + 6])
        cube([neck_width_nut + 4, 3, 4], center=true);
}

// Pickup module (humbucker style)
module pickup(x, y, rotation=0) {
    translate([x, y, body_thickness/2 - 2])
        rotate([0, 0, rotation])
            color("black")
                rounded_box(pickup_length, pickup_width, pickup_height, 2);
    // Pole pieces
    color("silver")
    for (i = [-3:3]) {
        translate([x + i * 8, y, body_thickness/2 + 3])
            cylinder(h=6, d=3);
    }
}

// Bridge assembly
module bridge() {
    translate([0, body_length * 0.38, body_thickness/2 - 2]) {
        // Bridge base
        color("chrome")
            rounded_box(bridge_length, bridge_width, 10, 2);
        // Saddles
        for (i = [-3:3]) {
            translate([i * 9, 0, 5])
                color("chrome")
                    cube([6, 8, 4], center=true);
        }
    }
    
    // Tailpiece/stoptail
    translate([0, body_length * 0.28, body_thickness/2 + 5])
        color("chrome")
            rotate([0, 15, 0])
                cylinder(h=8, d=12);
}

// Control knobs and switches
module controls() {
    // Volume/Tone knobs
    for (i = [0:2]) {
        translate([70 + i * 22, body_length * 0.48, body_thickness/2 + knob_height/2])
            color("black")
                knob();
    }
    
    // Switch tip
    translate([80, body_length * 0.62, body_thickness/2 + 4])
        color("white")
            rotate([0, 0, 30])
                cube([8, 20, 6], center=true);
    
    // Input jack
    translate([body_width_lower/2 - 20, body_length * 0.35, 0])
        rotate([90, 0, 0])
            color("chrome")
                cylinder(h=15, d=10);
}

// Knob component
module knob() {
    difference() {
        cylinder(h=knob_height, d=knob_diameter);
        translate([0, 0, knob_height - 2])
            cylinder(h=3, d=knob_diameter - 4);
    }
    // Indicator dot
    translate([knob_diameter/4, 0, knob_height - 1])
        color("silver")
            sphere(d=2);
}

// Strings (visual only)
module strings() {
    color("steelblue")
    for (i = [-3:3]) {
        offset_x = i * 7;
        hull() {
            // At bridge
            translate([offset_x, body_length * 0.38, body_thickness/2 + 12])
                sphere(d=1);
            // At nut
            translate([offset_x * 0.6, body_length/2 + neck_length - headstock_length, body_thickness/2 - neck_thickness/2 + 8])
                sphere(d=1);
        }
    }
}

// Utility: Rounded box using minkowski
module rounded_box(w, h, d, r) {
    minkowski() {
        cube([w - 2*r, h - 2*r, d - 2*r], center=true);
        sphere(r);
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Main body
    guitar_body();
    
    // Neck
    guitar_neck();
    
    // Headstock
    headstock();
    
    // Hardware
    // Bridge pickup
    pickup(0, body_length * 0.38, 0);
    
    // Neck pickup  
    pickup(0, body_length * 0.62, 0);
    
    // Bridge and tailpiece
    bridge();
    
    // Controls
    controls();
    
    // Strings
    strings();
}