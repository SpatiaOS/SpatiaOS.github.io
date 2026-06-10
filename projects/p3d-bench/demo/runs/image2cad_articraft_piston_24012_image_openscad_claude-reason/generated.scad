// ============================================
// Piston and Connecting Rod Assembly
// ============================================

// === Piston Parameters ===
piston_d = 80;                // piston bore diameter
piston_h = 55;                // overall piston height
crown_thickness = 10;         // crown wall thickness
wall_thickness = 4;           // skirt wall thickness

// Ring grooves
num_rings = 3;                // compression rings
ring_groove_w = 1.8;          // groove width
ring_groove_depth = 2.5;      // groove depth into wall
ring_pitch = 4.0;             // center-to-center spacing
ring_top_offset = 8;          // top of piston to first groove center
oil_groove_w = 3.0;           // oil scraper groove width
oil_groove_gap = 3;           // gap below last compression ring

// Valve pocket on crown
valve_pocket_d = 14;
valve_pocket_depth = 2.0;
valve_pocket_x = -10;
valve_pocket_y = 10;

// Wrist pin
pin_d = 22;
pin_z_from_bottom = 18;      // center of pin from piston bottom edge

// === Connecting Rod Parameters ===
rod_cc = 140;                 // center-to-center length

// Small end (piston end)
se_od = 34;
se_id = 22;                   // matches pin diameter
se_width = 22;

// Big end (crank end)
be_od = 60;
be_id = 44;
be_width = 24;

// Beam (I-section)
beam_w_big = 24;              // flange width at big end
beam_w_small = 17;            // flange width at small end
beam_depth_big = 15;          // I-beam height at big end
beam_depth_small = 12;        // I-beam height at small end
web_t = 5;                    // web thickness
flange_t = 3.0;              // flange thickness

// Cap bolts
bolt_d = 7;
bolt_head_d = 11;
bolt_head_h = 5;
bolt_nut_h = 5;
bolt_spacing_x = 40;         // bolt center-to-center across big end
cap_gap = 0.6;               // visual split line thickness

// Smoothness
$fn = 120;

// === Helper Modules ===

// Ring groove cut (annular groove)
module ring_groove(outer_r, depth, width) {
    difference() {
        cylinder(h = width, r = outer_r + 0.1);
        cylinder(h = width, r = outer_r - depth);
    }
}

// Hexagonal prism for bolt heads/nuts
module hex_prism(d, h) {
    cylinder(h = h, d = d, $fn = 6);
}

// === Piston Module ===
module piston() {
    r = piston_d / 2;
    
    difference() {
        union() {
            // Main cylindrical body
            cylinder(h = piston_h, r = r);
            
            // Very subtle crown dome
            translate([0, 0, piston_h])
                scale([1, 1, 0.035])
                    sphere(r = r * 0.98);
        }
        
        // Hollow interior (open bottom)
        translate([0, 0, -0.1])
            cylinder(h = piston_h - crown_thickness + 0.1, r = r - wall_thickness);
        
        // Compression ring grooves
        for (i = [0 : num_rings - 1]) {
            gz = piston_h - ring_top_offset - i * ring_pitch - ring_groove_w / 2;
            translate([0, 0, gz])
                ring_groove(r, ring_groove_depth, ring_groove_w);
        }
        
        // Oil scraper ring groove
        oil_gz = piston_h - ring_top_offset - num_rings * ring_pitch - oil_groove_gap - oil_groove_w / 2;
        translate([0, 0, oil_gz])
            ring_groove(r, ring_groove_depth, oil_groove_w);
        
        // Valve relief pocket on crown
        translate([valve_pocket_x, valve_pocket_y, piston_h - valve_pocket_depth])
            scale([1, 0.7, 1])
                cylinder(h = valve_pocket_depth + 2, d = valve_pocket_d);
        
        // Wrist pin bore (through hole)
        translate([0, -(r + 1), pin_z_from_bottom])
            rotate([-90, 0, 0])
                cylinder(h = piston_d + 2, d = pin_d);
        
        // Interior cutouts for wrist pin clearance
        for (sx = [-1, 1]) {
            translate([sx * (r - wall_thickness - 3), 0, pin_z_from_bottom])
                rotate([0, 0, 0])
                    cube([8, pin_d + 6, pin_d + 6], center = true);
        }
    }
    
    // Internal wrist pin bosses
    difference() {
        union() {
            for (sy = [-1, 1]) {
                translate([0, sy * (r - wall_thickness - 6), pin_z_from_bottom])
                    rotate([90, 0, 0])
                        cylinder(h = 10, d = pin_d + 12, center = true);
            }
        }
        // Recut pin bore
        translate([0, -(r + 1), pin_z_from_bottom])
            rotate([-90, 0, 0])
                cylinder(h = piston_d + 2, d = pin_d);
        // Trim to interior only
        difference() {
            translate([0, 0, -1])
                cylinder(h = piston_h + 5, r = r + 5);
            translate([0, 0, -1])
                cylinder(h = piston_h + 5, r = r - 0.01);
        }
        // Trim below piston
        translate([-(r+5), -(r+5), -(r+5)])
            cube([piston_d + 10, piston_d + 10, r + 5]);
    }
}

// === Connecting Rod Beam (Tapered I-section) ===
module rod_beam() {
    small_z = rod_cc - se_od / 2;
    big_z = be_od / 2 + 2;
    beam_len = small_z - big_z;
    
    translate([0, 0, big_z]) {
        // Web (vertical plate connecting flanges)
        hull() {
            cube([web_t, beam_depth_big, 0.01], center = true);
            translate([0, 0, beam_len])
                cube([web_t * 0.85, beam_depth_small, 0.01], center = true);
        }
        
        // Front flange
        hull() {
            translate([0, beam_depth_big / 2 - flange_t / 2, 0])
                cube([beam_w_big, flange_t, 0.01], center = true);
            translate([0, beam_depth_small / 2 - flange_t / 2, beam_len])
                cube([beam_w_small, flange_t, 0.01], center = true);
        }
        
        // Rear flange
        hull() {
            translate([0, -(beam_depth_big / 2 - flange_t / 2), 0])
                cube([beam_w_big, flange_t, 0.01], center = true);
            translate([0, -(beam_depth_small / 2 - flange_t / 2), beam_len])
                cube([beam_w_small, flange_t, 0.01], center = true);
        }
    }
}

// === Small End ===
module small_end() {
    translate([0, 0, rod_cc]) {
        difference() {
            rotate([90, 0, 0])
                cylinder(h = se_width, d = se_od, center = true);
            rotate([90, 0, 0])
                cylinder(h = se_width + 2, d = se_id, center = true);
        }
    }
}

// === Big End with Split Cap ===
module big_end() {
    r_o = be_od / 2;
    r_i = be_id / 2;
    bx = bolt_spacing_x / 2;
    
    difference() {
        union() {
            // Main big end ring
            rotate([90, 0, 0])
                cylinder(h = be_width, d = be_od, center = true);
            
            // Bolt boss bridges connecting to big end
            for (sx = [-1, 1]) {
                hull() {
                    translate([sx * bx, 0, 0])
                        rotate([90, 0, 0])
                            cylinder(h = be_width * 0.8, d = bolt_d + 7, center = true);
                    translate([sx * (r_o * 0.7), 0, -r_o * 0.2])
                        rotate([90, 0, 0])
                            cylinder(h = be_width * 0.8, d = bolt_d + 5, center = true);
                }
            }
            
            // Bearing cap flat bottom surface
            translate([-bx - bolt_d/2 - 3, -be_width * 0.4, -(r_o + 1)])
                cube([bolt_spacing_x + bolt_d + 6, be_width * 0.8, 4]);
        }
        
        // Bore
        rotate([90, 0, 0])
            cylinder(h = be_width + 2, d = be_id, center = true);
        
        // Bearing insert chamfer (visual detail)
        rotate([90, 0, 0])
            cylinder(h = be_width - 4, d = be_id + 2, center = true);
        
        // Split line
        translate([-(be_od + 20), -(be_width + 1), -cap_gap / 2])
            cube([be_od * 2 + 40, be_width + 2, cap_gap]);
        
        // Bolt holes
        for (sx = [-1, 1]) {
            translate([sx * bx, 0, -(r_o + 10)])
                cylinder(h = be_od + 20, d = bolt_d + 0.5);
        }
    }
}

// === Cap Bolts ===
module cap_bolts() {
    r_o = be_od / 2;
    bx = bolt_spacing_x / 2;
    
    for (sx = [-1, 1]) {
        translate([sx * bx, 0, 0]) {
            // Bolt shaft (visual)
            color("DarkGray")
            translate([0, 0, -(r_o + 2)])
                cylinder(h = r_o * 2 + 4, d = bolt_d - 1);
            
            // Bolt head (on bottom / cap side)
            color("DarkGray")
            translate([0, 0, -(r_o + 2)])
                hex_prism(bolt_head_d, bolt_head_h);
            
            // Nut (on top side)
            color("DarkGray")
            translate([0, 0, r_o - bolt_nut_h + 2])
                hex_prism(bolt_head_d, bolt_nut_h);
        }
    }
}

// === Smooth transition from beam to small end ===
module beam_to_small_end() {
    sz = rod_cc - se_od / 2;
    hull() {
        translate([0, 0, sz - 0.01])
            rotate([90, 0, 0])
                cylinder(h = se_width, d = se_od, center = true);
        translate([0, 0, sz - 8]) {
            cube([beam_w_small, beam_depth_small, 0.01], center = true);
        }
    }
}

// === Smooth transition from beam to big end ===
module beam_to_big_end() {
    bz = be_od / 2 + 2;
    hull() {
        translate([0, 0, bz + 0.01])
            cube([beam_w_big, beam_depth_big, 0.01], center = true);
        translate([0, 0, bz - 3])
            rotate([90, 0, 0])
                cylinder(h = be_width, d = be_od * 0.6, center = true);
    }
}

// === Complete Connecting Rod ===
module connecting_rod() {
    color("Silver") {
        union() {
            small_end();
            rod_beam();
            beam_to_small_end();
            beam_to_big_end();
            big_end();
        }
        cap_bolts();
    }
}

// === Full Assembly ===
module piston_assembly() {
    // Connecting rod - big end at origin, extends up along Z
    connecting_rod();
    
    // Piston - positioned so wrist pin center aligns with small end center
    piston_z_offset = rod_cc - pin_z_from_bottom;
    color("LightGray")
        translate([0, 0, piston_z_offset])
            piston();
}

// === Render ===
piston_assembly();