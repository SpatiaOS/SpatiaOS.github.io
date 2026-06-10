// Hose Reel Model - Parametric OpenSCAD Design (Optimized)
// Wall-mounted garden hose reel with valve and nozzle assembly
// Performance fix: Reduced geometric complexity in hose coil modeling

// ============================================
// PARAMETRIC VARIABLES (all dimensions in mm)
// ============================================

// --- Reel Body Dimensions ---
reel_od = 165;              // Outer diameter of flanges
reel_width = 95;            // Width between inner faces of flanges
flange_thick = 9;           // Thickness of each flange
hub_od = 38;                // Central hub outer diameter
hub_id = 20;                // Central hub inner diameter (bore)
flange_rim = 3;             // Raised rim height on flanges

// --- Hose Specifications ---
hose_od = 19;               // Hose outer diameter
hose_coils = 10;            // Number of complete coils (reduced for performance)
coil_start_offset = 8;      // Margin from flange inner face to first coil

// --- Mounting Bracket (Bottom) ---
bracket_od = 22;            // Main pipe diameter
bracket_height = 130;       // Height from reel to valve base
base_flange_od = 32;        // Diameter of base flange connecting to reel
valve_body_od = 28;         // Valve body diameter
valve_body_h = 45;          // Valve body height
handle_len = 30;            // Valve handle length
handle_d = 7;               // Valve handle rod diameter
nozzle_tip_od = 18;         // Bottom nozzle tip diameter
nozzle_tip_h = 28;          // Bottom nozzle tip height

// --- Outlet Assembly (Top Left) ---
outlet_tube_od = 17;        // Outlet riser tube diameter
outlet_riser_h = 175;       // Vertical height of outlet riser
outlet_curve_r = 35;        // Radius of curve from reel to riser
fitting_od = 24;            // Top fitting hex/nut diameter
fitting_h = 26;             // Top fitting height
fitting_bore = 9;           // Fitting center bore diameter
collar_od = outlet_tube_od + 8; // Collar diameter under fitting
collar_h = 10;              // Collar height

// --- Front Flange Mounting Holes ---
mount_hole_d = 6.5;         // Diameter of mounting holes
mount_hole_pitch = 55;      // Bolt circle radius for mounting holes
mount_hole_count = 4;       // Number of mounting holes (square pattern rotated 45°)

// --- Global Resolution ---
$fn = 64;                   // Fragment number for smooth curves (balanced)

// ============================================
// UTILITY MODULES
// ============================================

// Simple rounded cylinder using hull (lightweight)
module rounded_cyl(h, d, r, center=false) {
    r_eff = min(r, d/2 - 0.1, h/2 - 0.1);
    h_eff = h - 2*r_eff;
    union() {
        cylinder(h=h_eff, d=d - 2*r_eff, center=center);
        translate([0, 0, center ? h_eff/2 : h_eff]) sphere(r=r_eff);
        translate([0, 0, center ? -h_eff/2 : 0]) sphere(r=r_eff);
    }
}

// Hexagonal prism for nuts/fittings
module hex_prism(h, d, center=false) {
    cylinder(h=h, d=d, $fn=6, center=center);
}

// ============================================
// COMPONENT MODULES
// ============================================

// Single flange disk with optional hole pattern
module flange(with_holes=false) {
    difference() {
        union() {
            // Main flat disk
            cylinder(h=flange_thick, d=reel_od, center=true);
            // Raised outer rim
            translate([0, 0, flange_thick/2])
                cylinder(h=flange_rim, d=reel_od, center=true);
            // Center hub boss
            cylinder(h=flange_thick + 2, d=hub_od, center=true);
        }
        // Center bore through hub
        cylinder(h=flange_thick + 4, d=hub_id, center=true);
        
        // Optional mounting holes (for front flange only)
        if (with_holes) {
            for (i = [0 : mount_hole_count - 1]) {
                angle = i * (360 / mount_hole_count) + 45;
                translate([
                    mount_hole_pitch * cos(angle),
                    mount_hole_pitch * sin(angle),
                    0
                ])
                cylinder(h=flange_thick + 2, d=mount_hole_d, center=true);
            }
        }
    }
}

// Complete reel body (two flanges + central drum)
module reel_assembly() {
    union() {
        // Rear flange (solid)
        translate([0, 0, -reel_width/2])
            flange(false);
        
        // Front flange (with mounting holes)
        translate([0, 0, reel_width/2])
            flange(true);
        
        // Central drum/cylinder between flanges
        difference() {
            cylinder(h=reel_width - 0.5, d=hub_od, center=true);
            cylinder(h=reel_width + 1, d=hub_id, center=true);
        }
    }
}

// Optimized coiled hose using reduced-segment hull approach
module hose_coil() {
    // Mean coil radius (midpoint of winding area)
    mean_radius = (hub_od/2 + hose_od/2 + (reel_od/2 - hub_od/2 - hose_od)/2) - 2;
    
    // Total axial length available for coiling
    coil_length = reel_width - 2 * coil_start_offset;
    
    // CRITICAL OPTIMIZATION: Use limited total segments (~48 total for all coils)
    // instead of per-coil segmentation that caused timeout
    total_segments = 48; 
    
    hull() {
        for (i = [0 : total_segments]) {
            t = i / total_segments;
            theta = t * hose_coils * 360;
            z = (-reel_width/2 + coil_start_offset) + t * coil_length;
            
            translate([
                mean_radius * cos(theta),
                mean_radius * sin(theta),
                z
            ])
            sphere(d=hose_od, $fn=16); // Lower $fn for hose spheres
        }
    }
}

// Simplified hose exit tail (optimized)
module hose_exit_tail() {
    mean_radius = (hub_od/2 + hose_od/2 + (reel_od/2 - hub_od/2 - hose_od)/2) - 2;
    
    // Start point (end of coil on left side)
    start_x = -mean_radius;
    start_y = 0;
    start_z = reel_width/2 - coil_start_offset;
    
    // End point (connects to outlet tube base)
    end_x = -reel_od/2 - 10;
    end_y = 0;
    end_z = -reel_width/4;
    
    // Control point for smooth curve
    ctrl_x = -mean_radius - 25;
    ctrl_y = -15;
    ctrl_z = start_z - 20;
    
    // Limited segments for tail curve
    steps = 12;
    hull() {
        for (i = [0 : steps]) {
            t = i / steps;
            // Quadratic Bezier approximation
            xt = (1-t)*(1-t)*start_x + 2*(1-t)*t*ctrl_x + t*t*end_x;
            yt = (1-t)*(1-t)*start_y + 2*(1-t)*t*ctrl_y + t*t*end_y;
            zt = (1-t)*(1-t)*start_z + 2*(1-t)*t*ctrl_z + t*t*end_z;
            
            translate([xt, yt, zt])
                sphere(d=hose_od, $fn=16);
        }
    }
}

// Complete hose (coils + exit tail)
module complete_hose() {
    union() {
        hose_coil();
        hose_exit_tail();
    }
}

// Bottom mounting bracket with valve
module bottom_bracket() {
    translate([0, 0, -reel_width/2 - bracket_height/2 - 2])
    union() {
        // Connection base flange
        translate([0, 0, bracket_height/2 + 1])
            cylinder(h=5, d=base_flange_od, center=true);
        
        // Main vertical pipe
        rounded_cyl(bracket_height, bracket_od, 2, center=true);
        
        // Valve body (wider section)
        translate([0, 0, -bracket_height/2 + valve_body_h/2 + 8])
        difference() {
            rounded_cyl(valve_body_h, valve_body_od, 2, center=true);
            // Handle penetration hole
            translate([handle_len/2 + 5, 0, 0])
                rotate([0, 90, 0])
                    cylinder(h=handle_len + 10, d=handle_d + 2, center=true);
        }
        
        // Valve handle (lever)
        translate([handle_len/2 + 5, 0, -bracket_height/2 + valve_body_h + 5])
        rotate([0, 90, 0])
        union() {
            // Handle shaft
            cylinder(h=handle_len, d=handle_d, center=true);
            // Handle grip (T-handle end)
            translate([0, 0, handle_len/2 - 3])
                cylinder(h=12, d=handle_d + 6, center=true, $fn=24);
        }
        
        // Lower nozzle/tip (tapered outlet)
        translate([0, 0, -bracket_height/2 - nozzle_tip_h/2 + 5])
        union() {
            cylinder(h=nozzle_tip_h, d1=valve_body_od - 4, d2=nozzle_tip_od, center=true);
            // Tip orifice
            translate([0, 0, -nozzle_tip_h/2 - 1])
                cylinder(h=4, d=nozzle_tip_od * 0.6, center=true);
        }
    }
}

// Top left outlet assembly (riser pipe + fitting)
module top_outlet() {
    offset_x = -reel_od/2 - 12;
    offset_y = 0;
    base_z = -reel_width/4;
    
    translate([offset_x, offset_y, base_z])
    union() {
        // Curved elbow (torus quadrant approximation)
        translate([outlet_curve_r, 0, 0])
        rotate([0, 90, 0])
        difference() {
            rotate_extrude(angle=90, convexity=8)
                translate([outlet_curve_r, 0, 0])
                    circle(d=outlet_tube_od);
            // Hollow interior
            rotate_extrude(angle=90, convexity=8)
                translate([outlet_curve_r, 0, 0])
                    circle(d=outlet_tube_od - 4);
        }
        
        // Vertical riser tube
        translate([0, 0, outlet_riser_h/2])
        difference() {
            rounded_cyl(outlet_riser_h, outlet_tube_od, 1.5, center=true);
            cylinder(h=outlet_riser_h + 2, d=outlet_tube_od - 4, center=true);
        }
        
        // Collar (reinforcement ring below fitting)
        translate([0, 0, outlet_riser_h - collar_h/2])
            cylinder(h=collar_h, d=collar_od, center=true);
        
        // Top fitting (hex nut style)
        translate([0, 0, outlet_riser_h + fitting_h/2 - 2])
        difference() {
            hex_prism(fitting_h, fitting_od, center=true);
            // Bore through fitting
            cylinder(h=fitting_h + 2, d=fitting_bore, center=true);
            // Counterbore at top
            translate([0, 0, fitting_h/4])
                cylinder(h=fitting_h/2 + 1, d=fitting_bore + 4, center=true);
        }
    }
}

// ============================================
// FINAL ASSEMBLY
// ============================================

color("silver", 0.95) 
union() {
    // Main reel body (gray metallic)
    reel_assembly();
    
    // Wound hose (dark gray rubber)
    color("dimgray", 0.9)
        complete_hose();
    
    // Bottom mounting bracket with valve
    bottom_bracket();
    
    // Top outlet nozzle assembly
    top_outlet();
}