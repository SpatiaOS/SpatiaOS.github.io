// ============================================
// Mechanical Assembly: Vertical Cage Structure
// ============================================
// Overall dimensions: ~800mm tall, ~277mm wide
// Coordinate system: Y-axis is vertical (up)

$fn = 100; // Global resolution for smooth curves

// ==================== PARAMETERS ====================

// Disc Plate (Top Anchor)
disc_diameter = 180;
disc_thickness = 10;
disc_hole_dia = 10;

// Central Rod
rod_length = 500;
rod_diameter = 10;

// Flanged Bushing (at rod end)
fb_od_flange = 56.5;
fb_od_boss = 44.25;
fb_h_flange = 3.25;
fb_h_boss = 8.0;
fb_bore_dia = 40;
fb_total_h = fb_h_flange + fb_h_boss;

// Locating Plug/Bushing
lp_rim_radius = 23;
lp_body_radius = 20;
lp_h_rim = 5;
lp_h_body = 44.22;
lp_h_taper = 28; // remaining height to reach ~77mm total
lp_taper_end_radius = 8;
lp_blind_bore_dia = 24;
lp_blind_bore_depth = 10;
lp_total_height = lp_h_rim + lp_h_body + lp_h_taper;

// Splined Ring
sr_od = 200;
sr_id = 160;
sr_thickness = 3.9;
sr_tooth_count = 40;

// Vane Slat (x40 instances)
slat_thickness = 3.9;
slat_width = 50;
slat_height = 300;
slat_curve_radius = 572.5; // radius of cylindrical face
slat_count = 40;
slat_center_y = -80.4; // rotational center Y position
slat_cage_radius = 95; // approximate radial distance of slats from axis

// Knob (bottom cap)
knob_max_width = 60;
knob_total_height = 81;
knob_sphere_radius = 30;
knob_base_diameter = 24;

// Assembly positions (Y-coordinates, assuming disc at y=0)
y_disc = 0;
y_rod_top = -disc_thickness/2 + 0.3; // slight overlap into disc
y_rod_bottom = y_rod_top - rod_length;
y_flange_bushing = y_rod_bottom - fb_total_h + 11.85; // positioned per overlap spec
y_locating_plug = y_flange_bushing - lp_total_height + 20; // stacked below bushing
y_splined_ring = y_locating_plug - sr_thickness/2 - 5; // surrounding hub zone
y_knob = y_locating_plug - lp_total_height - knob_total_height/2 + 15;

// ==================== MODULES ====================

// --- Disc Plate: Flat circular mounting plate ---
module disc_plate() {
    difference() {
        cylinder(h=disc_thickness, d=disc_diameter, center=true);
        cylinder(h=disc_thickness+1, d=disc_hole_dia, center=true);
    }
}

// --- Rod: Solid cylindrical shaft ---
module rod() {
    cylinder(h=rod_length, d=rod_diameter, center=false);
}

// --- Flanged Bushing: Collar with flange base ---
module flanged_bushing() {
    difference() {
        union() {
            // Lower flange
            cylinder(h=fb_h_flange, d=fb_od_flange, center=false);
            // Upper boss
            translate([0, 0, fb_h_flange])
                cylinder(h=fb_h_boss, d=fb_od_boss, center=false);
        }
        // Central through-bore
        cylinder(h=fb_total_h+0.1, d=fb_bore_dia, center=false);
    }
}

// --- Locating Plug: Stepped bushing with tapered end ---
module locating_plug() {
    difference() {
        union() {
            // Top rim (radius 23mm)
            cylinder(h=lp_h_rim, r=lp_rim_radius, center=false);
            // Main cylindrical body (radius 20mm)
            translate([0, 0, lp_h_rim])
                cylinder(h=lp_h_body, r=lp_body_radius, center=false);
            // Conical taper to smaller base
            translate([0, 0, lp_h_rim + lp_h_body])
                cylinder(h=lp_h_taper, r1=lp_body_radius, r2=lp_taper_end_radius, center=false);
        }
        // Blind bore from top (diameter 24mm, depth 10mm)
        translate([0, 0, -0.1])
            cylinder(h=lp_blind_bore_depth+0.1, d=lp_blind_bore_dia, center=false);
    }
}

// --- Splined Ring: Annular disc with 40 external teeth ---
module splined_ring() {
    tooth_pitch = 360 / sr_tooth_count;
    tooth_arc = (PI * sr_od / sr_tooth_count) * 0.45; // tooth width approx 45% of pitch
    
    difference() {
        // Base annulus
        difference() {
            cylinder(h=sr_thickness, d=sr_od, center=true);
            cylinder(h=sr_thickness+1, d=sr_id, center=true);
        }
        // Cut grooves between teeth (40 slots)
        for (i = [0 : sr_tooth_count - 1]) {
            rotate([0, 0, i * tooth_pitch + tooth_pitch/2])
                translate([sr_od/2 - 1.5, 0, 0])
                    cube([3, tooth_arc*1.6, sr_thickness+1], center=true);
        }
    }
}

// --- Single Vane Slat: Thin curved panel with edge notches ---
module vane_slat() {
    // Create curved panel by intersecting large cylinder arc with bounding box
    // One face lies on cylinder of radius slat_curve_radius
    
    // Main curved body
    difference() {
        // Offset the cylinder so inner face is at desired radius
        translate([slat_curve_radius - slat_thickness/2, 0, 0])
            rotate([0, 90, 0])
                cylinder(h=slat_thickness, r=slat_height/2, center=true);
        
        // Trim to exact width (Y-direction in local coords)
        // Using oversized box then trimming
    }
    
    // Better approach: use intersection to get precise curved slab
    intersection() {
        // Curved volume: thick-walled cylinder sector
        translate([slat_curve_radius - slat_thickness, 0, 0])
            rotate([0, 90, 0])
                difference() {
                    cylinder(h=slat_thickness, r=slat_height/2, center=true);
                    cylinder(h=slat_thickness+1, r=slat_height/2 - 0.01, center=true);
                }
        
        // Bounding prism for width constraint
        cube([slat_thickness * 2, slat_width, slat_height], center=true);
    }
    
    // Edge notches (simplified as corner cuts)
    // Upper notch
    translate([0, slat_width/2 - 8, slat_height/2 - 20])
        rotate([0, 45, 0])
            cube([slat_thickness+2, 16, 12], center=true);
    
    // Lower notch  
    translate([0, slat_width/2 - 8, -slat_height/2 + 20])
        rotate([0, 45, 0])
            cube([slat_thickness+2, 16, 12], center=true);
}

// --- Knob: Spherical dome on conical stem ---
module knob() {
    union() {
        // Spherical top dome
        translate([0, knob_total_height/2 - knob_sphere_radius + 5, 0])
            sphere(r=knob_sphere_radius);
        
        // Conical stem
        cylinder(h=knob_total_height - knob_sphere_radius + 10, 
                 d1=knob_base_diameter, 
                 d2=knob_max_width * 0.85, 
                 center=false);
    }
}

// ==================== ASSEMBLY ====================

union() {
    // 1. Disc Plate (grounded at top)
    translate([0, y_disc, 0])
        color("silver")
            disc_plate();
    
    // 2. Central Rod (passes through disc hole)
    translate([0, y_rod_bottom, 0]) // positioned so top overlaps disc
        color("gray")
            rod();
    
    // 3. Flanged Bushing (at lower end of rod)
    translate([0, y_flange_bushing, 0])
        color("darkgray")
            flanged_bushing();
    
    // 4. Locating Plug (stacked coaxially below bushing)
    translate([0, y_locating_plug, 0])
        color("dimgray")
            locating_plug();
    
    // 5. Splined Ring (encircling hub zone)
    translate([0, y_splined_ring, 0])
        color("lightgray")
            splined_ring();
    
    // 6. Vane Slats (40-fold rotational arrangement about Y-axis)
    // Centered at y = slat_center_y, arranged in barrel pattern
    for (i = [0 : slat_count - 1]) {
        rotate([0, i * (360/slat_count), 0]) // rotation about Y-axis
            translate([slat_cage_radius, slat_center_y, 0])
                color("silver", 0.9)
                    vane_slat();
    }
    
    // 7. Knob (capping the hub at bottom)
    translate([0, y_knob, 0])
        color("gainsboro")
            knob();
}