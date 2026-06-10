// Vintage Gramophone / Phonograph Model
// Parametric design based on image analysis

$fn = 120;

// === Base Parameters ===
base_outer_diameter = 130;
base_height = 5;
base_lip_height = 3;
base_lip_width = 3;

// === Radial Grill Parameters ===
grill_outer_radius = 58;
grill_inner_radius = 28;
grill_height = 18;
grill_fin_count = 72;
grill_fin_thickness = 1.2;
grill_ring_thickness = 2;
grill_ring_count = 4;

// === Central Cylinder Parameters ===
cylinder_diameter = 50;
cylinder_height = 38;
cylinder_wall = 2;
top_cap_height = 3;

// === Vent Slot Parameters ===
vent_slot_width = 2;
vent_slot_length = 12;
vent_slot_count = 5;
vent_slot_spacing = 3.5;

// === Connector Block Parameters ===
connector_size = 12;
connector_height = 12;
connector_offset_z = 28;

// === Horn Tube Parameters ===
horn_tube_length = 90;
horn_tube_r1 = 6;
horn_tube_r2 = 12;

// === Horn Bell Parameters ===
bell_diameter = 80;
bell_depth = 35;
bell_thickness = 2;

// === Needle/Stylus Parameters ===
needle_length = 35;
needle_diameter = 1;

// ----------------------------
// Module: Base Ring
// ----------------------------
module base_ring() {
    // Main flat base disc
    cylinder(h = base_height, d = base_outer_diameter);
    
    // Decorative lip around edge
    difference() {
        cylinder(h = base_height + base_lip_height, d = base_outer_diameter);
        translate([0, 0, -0.1])
            cylinder(h = base_height + base_lip_height + 0.2, 
                     d = base_outer_diameter - base_lip_width * 2);
    }
    
    // Textured edge ring (small bumps around perimeter)
    for (i = [0 : 2 : 360]) {
        rotate([0, 0, i])
            translate([base_outer_diameter/2 - 1.5, 0, 0])
                cylinder(h = base_height + 1, d = 1.8, $fn = 8);
    }
}

// ----------------------------
// Module: Radial Grill / Fin Assembly
// ----------------------------
module radial_grill() {
    // Concentric support rings
    for (i = [0 : grill_ring_count - 1]) {
        r = grill_inner_radius + i * (grill_outer_radius - grill_inner_radius) / (grill_ring_count - 1);
        difference() {
            cylinder(h = grill_height, r = r + grill_ring_thickness/2);
            translate([0, 0, -0.1])
                cylinder(h = grill_height + 0.2, r = r - grill_ring_thickness/2);
        }
    }
    
    // Radial fins
    for (i = [0 : grill_fin_count - 1]) {
        angle = i * 360 / grill_fin_count;
        rotate([0, 0, angle])
            translate([grill_inner_radius, -grill_fin_thickness/2, 0])
                cube([grill_outer_radius - grill_inner_radius, 
                      grill_fin_thickness, grill_height]);
    }
    
    // Top ring cap
    translate([0, 0, grill_height - 1.5])
    difference() {
        cylinder(h = 1.5, r = grill_outer_radius + 2);
        translate([0, 0, -0.1])
            cylinder(h = 1.7, r = grill_outer_radius - 1);
    }
    
    // Bottom solid ring
    difference() {
        cylinder(h = 2, r = grill_outer_radius + 2);
        translate([0, 0, -0.1])
            cylinder(h = 2.2, r = grill_inner_radius - 1);
    }
}

// ----------------------------
// Module: Central Cylinder Housing
// ----------------------------
module central_cylinder() {
    difference() {
        union() {
            // Main cylinder body
            cylinder(h = cylinder_height, d = cylinder_diameter);
            
            // Slight flange at bottom
            cylinder(h = 3, d = cylinder_diameter + 4);
        }
        
        // Hollow interior
        translate([0, 0, cylinder_wall])
            cylinder(h = cylinder_height, d = cylinder_diameter - cylinder_wall * 2);
    }
    
    // Top cap with details
    translate([0, 0, cylinder_height - top_cap_height])
        top_cap();
}

// ----------------------------
// Module: Top Cap with Vents
// ----------------------------
module top_cap() {
    difference() {
        // Solid cap
        cylinder(h = top_cap_height, d = cylinder_diameter);
        
        // Ventilation slots
        for (i = [0 : vent_slot_count - 1]) {
            translate([- vent_slot_length/2, 
                       -((vent_slot_count-1)/2 * vent_slot_spacing) + i * vent_slot_spacing,
                       -0.1])
                cube([vent_slot_length, vent_slot_width, top_cap_height + 0.2]);
        }
        
        // Additional shorter vent slots offset
        for (i = [0 : 3]) {
            translate([vent_slot_length/2 + 2, 
                       -((3)/2 * vent_slot_spacing) + i * vent_slot_spacing,
                       -0.1])
                cube([vent_slot_length * 0.6, vent_slot_width, top_cap_height + 0.2]);
        }
        
        // Small indicator hole
        translate([0, -cylinder_diameter/4 + 2, -0.1])
            cylinder(h = top_cap_height + 0.2, d = 3, $fn = 20);
        
        // Arrow/indicator groove
        translate([-1, -cylinder_diameter/4 + 6, top_cap_height - 1])
            cube([2, 8, 1.1]);
    }
}

// ----------------------------
// Module: Side Connector Block
// ----------------------------
module connector_block() {
    translate([cylinder_diameter/2 - 2, -connector_size/2, connector_offset_z - connector_height/2]) {
        // Main block
        cube([connector_size + 2, connector_size, connector_height]);
        
        // Small protruding hex bolt detail
        translate([connector_size/2 + 1, connector_size/2, connector_height/2])
            rotate([0, 90, 0])
                cylinder(h = 4, d = 5, $fn = 6);
    }
}

// ----------------------------
// Module: Horn Tube (Tapered)
// ----------------------------
module horn_tube() {
    // Tapered conical tube
    translate([cylinder_diameter/2 + connector_size, 0, connector_offset_z]) {
        rotate([0, 90, 0])
            rotate([0, 0, 0])
                cylinder(h = horn_tube_length, r1 = horn_tube_r1, r2 = horn_tube_r2);
    }
}

// ----------------------------
// Module: Horn Bell (Parabolic Flare)
// ----------------------------
module horn_bell() {
    bell_position = cylinder_diameter/2 + connector_size + horn_tube_length;
    
    translate([bell_position, 0, connector_offset_z]) {
        rotate([0, 90, 0]) {
            difference() {
                // Outer bell surface using rotate_extrude of a parabolic profile
                rotate_extrude($fn = 100) {
                    // Bell profile - parabolic curve
                    polygon(points = concat(
                        [[0, 0]],
                        [for (i = [0 : 2 : 100]) 
                            let(t = i / 100,
                                z = t * bell_depth,
                                r = horn_tube_r2 + (bell_diameter/2 - horn_tube_r2) * pow(t, 0.5))
                            [r, z]
                        ],
                        // Thickness offset (inner surface)
                        [for (i = [100 : -2 : 0])
                            let(t = i / 100,
                                z = t * bell_depth - (t > 0.1 ? bell_thickness : 0),
                                r = horn_tube_r2 + (bell_diameter/2 - horn_tube_r2 - bell_thickness) * pow(t, 0.5))
                            [max(0, r), z]
                        ],
                        [[0, -bell_thickness]]
                    ));
                }
            }
        }
    }
}

// ----------------------------
// Module: Needle / Stylus Arm
// ----------------------------
module needle() {
    translate([cylinder_diameter/2 + connector_size - 5, 0, connector_offset_z]) {
        // Angled needle pointing down-forward
        rotate([0, 45, 10])
            cylinder(h = needle_length, d = needle_diameter, $fn = 12);
        
        // Second needle line
        rotate([0, 45, -10])
            cylinder(h = needle_length, d = needle_diameter, $fn = 12);
    }
}

// ----------------------------
// Main Assembly
// ----------------------------
module gramophone() {
    color("LightGray") {
        // Layer 1: Base ring
        base_ring();
        
        // Layer 2: Radial grill sitting on base
        translate([0, 0, base_height])
            radial_grill();
        
        // Layer 3: Central cylinder
        translate([0, 0, base_height + 2])
            central_cylinder();
        
        // Connector block on cylinder side
        translate([0, 0, base_height + 2])
            connector_block();
        
        // Horn tube
        translate([0, 0, base_height + 2])
            horn_tube();
        
        // Horn bell
        translate([0, 0, base_height + 2])
            horn_bell();
        
        // Stylus needles
        translate([0, 0, base_height + 2])
            needle();
    }
}

// Render the complete model
gramophone();