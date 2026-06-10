// ==========================================
// DJ Mixer Console Assembly - OpenSCAD Model
// ==========================================

// General resolution for curved surfaces
$fn = 60;

// ------------------------------------------
// DIMENSIONAL PARAMETERS (Millimeters)
// ------------------------------------------

// --- Housing & Base ---
housing_width = 300;      // X axis extent
housing_depth = 230;      // Z axis extent
housing_height = 45;      // Y axis extent

base_width = 309;
base_depth = 245;
base_height = 28;

chamfer_size = 3;         // Perimeter chamfer depth

// --- Jog Wheel Caps (x2) ---
cap_diameter = 86;
cap_height = 20;
cap_slot_count = 14;
cap_slot_w = 3;
cap_slot_d = 5;
boss_diameter = 8;
boss_height = 3;

// --- Spacer Blocks / Pads (x26) ---
pad_w = 18.87;
pad_d = 12.09;
pad_h = 5.0;
pad_fillet_r = 2.0;

// --- Socket Posts (x8) ---
post_base_d = 14.89;
post_height = 17;
post_hole_d = 1.178;

// --- Control Pins (x11) ---
pin_d = 1.5;
pin_h = 11;

// --- Flanged Bushings / Jacks (x6) ---
jack_flange_d = 18.2;
jack_boss_d = 10.06; // radius * 2
jack_total_h = 10;
jack_bore_d = 4.92;

// --- Wedge Guide Blocks (x3) ---
wedge_w = 8;
wedge_l = 18;
wedge_h = 14;

// --- Structural Bars (x3) ---
bar_w = 1.1;
bar_d = 20;
bar_h = 2.0;

// --- Ball Studs (x2) ---
ball_head_d = 18.2;
ball_bore_d = 4.92;
ball_total_h = 10;

// --- Locating Pins (x3) ---
loc_pin_head_d = 14.9;
loc_pin_h = 17;


// ==========================================
// MODULE DEFINITIONS
// ==========================================

// --- Main Housing Cover ---
module housing_cover() {
    difference() {
        // Main body with chamfered top edges
        hull() {
            // Top flat surface (thin slice)
            translate([0, housing_height/2 - 0.1, 0]) 
                cube([housing_width - chamfer_size*2, 0.1, housing_depth - chamfer_size*2], center=true);
            // Bottom full size
            cube([housing_width, housing_height, housing_depth], center=true);
        }
        
        // Jog Wheel Recesses (Circular cutouts)
        translate([-95, housing_height/2, -55]) 
            cylinder(d=cap_diameter + 2, h=housing_height+1, center=true);
        translate([95, housing_height/2, -55]) 
            cylinder(d=cap_diameter + 2, h=housing_height+1, center=true);

        // Fader Slot Recesses (Rectangular cutouts for wedges/bars)
        for(z = [-35, 0, 35]) {
            translate([0, housing_height/2, z + 60])
                cube([25, housing_height+1, 8], center=true);
        }

        // Jack Holes (Front Left)
        for(i=[0:5]) {
            translate([-130, housing_height/2, 80 + i*16])
                rotate([0, 90, 0]) 
                    cylinder(d=jack_flange_d + 2, h=housing_width, center=true);
        }
        
        // Generic Button Recesses (Grids)
        // Left Bank
        for(x=[-145, -125, -105], z=[-25, -5, 15, 35]) {
             translate([x, housing_height/2 - 2, z])
                cube([pad_w+1, 5, pad_d+1], center=true);
        }
        // Right Bank
        for(x=[145, 125, 105], z=[-25, -5, 15, 35]) {
             translate([x, housing_height/2 - 2, z])
                cube([pad_w+1, 5, pad_d+1], center=true);
        }
    }
}

// --- Base Plate ---
module base_plate() {
    // Stepped profile approximation
    difference() {
        union() {
            // Main slab
            cube([base_width, base_height, base_depth], center=true);
            // Front lip extension (visual detail)
            translate([0, -base_height/4, base_depth/2 - 5])
                cube([base_width, base_height/2, 10], center=true);
        }
        // Corner notch (approximation)
        translate([-base_width/2, 0, base_depth/2 - 20])
            rotate([0, 45, 0]) 
                cube([20, base_height+1, 20], center=true);
    }
}

// --- Jog Wheel Cap ---
module jog_wheel_cap() {
    difference() {
        union() {
            // Main cylinder
            cylinder(d=cap_diameter, h=cap_height, center=true);
            // Tapered skirt (bottom wider)
            translate([0, -cap_height/2, 0])
                cylinder(d1=cap_diameter+6, d2=cap_diameter, h=4, center=false);
            // Central plateau
            translate([0, cap_height/2 - 1, 0])
                cylinder(d=60.5, h=1, center=true);
            // Hemisphere indicator boss
            translate([0, cap_height/2 + boss_height/2 - 1, 20])
                sphere(d=boss_diameter);
        }
        // Peripheral slots
        for(i=[1:cap_slot_count]) {
            rotate([0, 0, i * (360/cap_slot_count)])
                translate([cap_diameter/2 + 1, 0, 0])
                    cube([cap_slot_d, cap_slot_w, cap_height*2], center=true);
        }
    }
}

// --- Spacer Block (Tactile Pad) ---
module spacer_block() {
    // Pillow-top profile using hull
    hull() {
        // Flat bottom
        translate([0, -pad_h/2, 0]) 
            cube([pad_w, 0.1, pad_d], center=true);
        // Rounded top (approximated by smaller box with spherical corners via minkowski would be slow, 
        // using hull of offset shapes is faster)
        translate([0, pad_h/2 - pad_fillet_r, 0]) 
            cube([pad_w - pad_fillet_r*2, 0.1, pad_d - pad_fillet_r*2], center=true);
    }
    // Add the fillets explicitly if hull isn't smooth enough, but hull is usually fine for this shape.
    // Refining shape to match "pillow-top":
    render() // force cache for complex hulls
    hull() {
        translate([0, -pad_h/2, 0]) 
            cube([pad_w, 0.01, pad_d], center=true);
        translate([0, pad_h/2 - pad_fillet_r, 0]) 
            minkowski() {
                cube([pad_w - pad_fillet_r*2 - 0.1, 0.01, pad_d - pad_fillet_r*2 - 0.1], center=true);
                sphere(r=pad_fillet_r);
            }
    }
}

// --- Socket Post (Bell Shape) ---
module socket_post() {
    difference() {
        // Tapered body
        cylinder(d1=post_base_d, d2=post_base_d * 0.6, h=post_height, center=true);
        // Axial through-hole
        cylinder(d=post_hole_d, h=post_height + 2, center=true);
    }
    // Base flange
    translate([0, -post_height/2, 0])
        cylinder(d=post_base_d + 4, h=2, center=true);
}

// --- Control Pin ---
module control_pin() {
    cylinder(d=pin_d, h=pin_h, center=true);
}

// --- Flanged Bushing (Jack) ---
module flanged_bushing() {
    difference() {
        union() {
            // Flange
            cylinder(d=jack_flange_d, h=3, center=true);
            // Body
            translate([0, -(jack_total_h-3)/2, 0])
                cylinder(d=jack_boss_d, h=jack_total_h-3, center=false);
        }
        // Central Bore
        cylinder(d=jack_bore_d, h=jack_total_h + 2, center=true);
        // Countersink
        translate([0, 2, 0])
            cylinder(d1=jack_bore_d + 4, d2=jack_bore_d, h=3, center=true);
    }
}

// --- Wedge Guide Block (Fader Knob) ---
module wedge_guide_block() {
    // Trapezoidal prism with groove
    hull() {
        translate([0, -wedge_h/2, 0]) cube([wedge_w, 0.1, wedge_l], center=true); // Base
        translate([0, wedge_h/2, 0]) cube([wedge_w * 0.6, 0.1, wedge_l * 0.8], center=true); // Top
    }
    // Subtract groove (simplified)
    /*
    difference() {
        // shape...
        translate([0, 0, 0]) cube([2, wedge_h+1, wedge_l*0.6], center=true);
    }
    */
    // Using simple solid representation as per "solid trapezoidal wedge"
     hull() {
        translate([0, -wedge_h/2, 0]) cube([wedge_w, 0.1, wedge_l], center=true); 
        translate([0, wedge_h/2, 0]) cube([wedge_w * 0.6, 0.1, wedge_l * 0.8], center=true); 
    }
}

// --- Structural Bar ---
module structural_bar() {
    cube([bar_w, bar_h, bar_d], center=true);
}

// --- Ball Stud ---
module ball_stud() {
    difference() {
        union() {
            // Sphere head
            sphere(d=ball_head_d);
            // Cylindrical collar
            translate([0, -ball_total_h/2 + ball_head_d/3, 0])
                cylinder(d=ball_head_d * 0.7, h=ball_total_h - ball_head_d/1.5, center=false);
        }
        // Bore
        cylinder(d=ball_bore_d, h=ball_total_h * 2, center=true);
    }
}

// --- Locating Pin ---
module locating_pin() {
    // Mushroom head
    translate([0, loc_pin_h/2 - 2, 0]) sphere(d=loc_pin_head_d * 0.8);
    // Shank
    cylinder(d=loc_pin_head_d * 0.4, h=loc_pin_h - 2, center=false);
    // Cross hole (visual only)
    translate([0, loc_pin_h/2, 0]) rotate([0, 90, 0]) cylinder(d=1.178, h=10, center=true);
}


// ==========================================
// ASSEMBLY INSTANTIATION
// ==========================================

union() {
    
    color("gray") 
        translate([0, -base_height/2, 0]) 
            base_plate();

    color("lightgray") 
        translate([0, base_height/2, 0]) 
            housing_cover();

    // --- Jog Wheels (x2) ---
    color("darkgray") {
        translate([-95, base_height + cap_height/2, -55]) jog_wheel_cap();
        translate([95, base_height + cap_height/2, -55]) jog_wheel_cap();
    }

    // --- Spacer Blocks / Pads (x26) ---
    // Left Bank (13)
    color("dimgray") {
        for(row=[0:3]) { // 4 rows
            for(col=[0:2]) { // 3 cols
                 // Offset positions
                 translate([-145 + col*22, base_height + pad_h/2, -25 + row*18]) 
                    spacer_block();
            }
        }
        // Extra scattered ones to reach count or fill gaps
        translate([-100, base_height + pad_h/2, -25]) spacer_block();
        translate([-100, base_height + pad_h/2, 10]) spacer_block();
    }
    
    // Right Bank (13) - Mirror
    color("dimgray") {
        for(row=[0:3]) {
            for(col=[0:2]) {
                 translate([145 - col*22, base_height + pad_h/2, -25 + row*18]) 
                    spacer_block();
            }
        }
        translate([100, base_height + pad_h/2, -25]) spacer_block();
        translate([100, base_height + pad_h/2, 10]) spacer_block();
    }


    // --- Socket Posts & Pins (8 Posts, 11 Pins) ---
    // Placed in the 'EQ' section typically found above faders
    color("silver") {
        // Left group (4 posts)
        for(z=[-20, 0, 20, 40]) {
            translate([-60, base_height + post_height/2, z + 10]) {
                socket_post();
                translate([0, post_height/2 + pin_h/2, 0]) control_pin(); // Pin inserted
            }
        }
        // Right group (4 posts)
        for(z=[-20, 0, 20, 40]) {
            translate([60, base_height + post_height/2, z + 10]) {
                socket_post();
                translate([0, post_height/2 + pin_h/2, 0]) control_pin();
            }
        }
        // Extra loose pins (3 remaining of 11)
        translate([-30, base_height + post_height/2 + 5, 10]) control_pin();
        translate([0, base_height + post_height/2 + 5, 10]) control_pin();
        translate([30, base_height + post_height/2 + 5, 10]) control_pin();
    }

    // --- Flanged Bushings / Jacks (x6) ---
    // Front panel mounted
    color("gold") {
        for(i=[0:5]) {
            translate([-130, base_height/2, 80 + i*16]) 
                rotate([0, 90, 0]) 
                    flanged_bushing();
        }
    }

    // --- Wedge Guides & Bars (Fader Area) ---
    // Center-bottom region
    color("black") {
        // 3 Wedges
        for(z=[-30, 0, 30]) {
            translate([z * 1.2, base_height + wedge_h/2, 65]) // Slight angle/fan
                rotate([0, 0, z * 0.5]) 
                    wedge_guide_block();
        }
        // 3 Bars (Slider tracks behind/underneath wedges visually)
        for(z=[-30, 0, 30]) {
            translate([z * 1.2, base_height + bar_h/2, 65 - 5]) 
                structural_bar();
        }
    }

    // --- Ball Studs (x2) ---
    // Often used for pivoting panel lights or display mounts
    color("steelblue") {
        translate([-110, base_height/2, -90]) rotate([0, 90, 0]) ball_stud();
        translate([110, base_height/2, -90]) rotate([0, -90, 0]) ball_stud();
    }

    // --- Locating Pins (x3) ---
    // Hidden or internal alignment, placing visibly for completeness
    color("red") {
        translate([0, -base_height/2 + 5, 0]) locating_pin();
        translate([-100, -base_height/2 + 5, 100]) locating_pin();
        translate([100, -base_height/2 + 5, -100]) locating_pin();
    }
}