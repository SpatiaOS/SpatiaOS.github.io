// OpenSCAD Model of Mechanical Assembly
// Based on provided image and text description

$fn = 60; // Resolution for curves

// ==========================================
// Parameters
// ==========================================

// Assembly Dimensions
assembly_width = 600;
assembly_depth = 500;
assembly_height = 527;

// Triangular Linkage Bracket (c0024a12)
bracket_thickness = 80;
bracket_arm_width = 60;
bracket_boss_od_40 = 60;
bracket_boss_len_40 = 100;
bracket_hole_40 = 40;
bracket_hole_30 = 30;

// Link Arm (bfd260d0)
link_arm_thickness = 60;
link_arm_boss_od = 60;
link_arm_blind_hole = 50;
link_arm_blind_depth = 15;

// Pulley Disc (bfd21264)
pulley_od = 230;
pulley_thickness = 61;
pulley_hub_dia = 140;
pulley_bolt_holes = 5;
pulley_bolt_hole_dia = 14;
pulley_bolt_circle_dia = 180; // Estimated
pulley_rim_notches = 30;
pulley_notch_r = 4;

// Flat Bar (bfd19d36)
flat_bar_w = 600;
flat_bar_h = 50;
flat_bar_t = 10;

// Pins
pin_40_dia = 40;
pin_40_len = 100;
pin_30_dia = 30;
pin_30_len_90 = 90;
pin_30_len_100 = 100;

// Positions (Approximate based on description)
// Origin near bottom center
pos_pulley_center = [-200, 0, 100];
pos_top_vertex = [0, 0, 450];
pos_right_vertex = [250, 0, 250];

// Offset for Link Arm (parallel to bracket)
link_arm_y_offset = 100;

// ==========================================
// Modules
// ==========================================

// Triangular Linkage Bracket
module triangular_linkage_bracket() {
    // Main triangular body with rounded corners
    // Vertices: Pulley (Bottom Left), Top, Right
    // Using hull to create the blended shape
    thickness = bracket_thickness;
    
    // Define the 2D profile vertices (in XZ plane, extruded in Y)
    // V1: Pulley mount (-200, 100)
    // V2: Top (0, 450)
    // V3: Right (250, 250)
    
    // We create the shape by hulling cylinders at the vertices
    // And connecting them with rectangular arms
    
    color("silver")
    difference() {
        union() {
            // Central web / arms
            // Arm 1: V1 to V2
            hull() {
                translate([pos_pulley_center.x, thickness/2, pos_pulley_center.z]) 
                    cube([bracket_arm_width, bracket_arm_width, bracket_arm_width], center=true); // Approximation
                // Better: Use cylinders for smooth blending
            }
            
            // Let's build it more explicitly
            // Base Plate
            linear_extrude(height=thickness, center=true) {
                polygon(points=[
                    [pos_pulley_center.x, pos_pulley_center.z],
                    [pos_top_vertex.x, pos_top_vertex.z],
                    [pos_right_vertex.x, pos_right_vertex.z]
                ]);
                // This creates a sharp triangle. We need rounded arms.
            }
            
            // Rounded Arms using Hull of spheres/cylinders
            // Arm V1-V2
            hull() {
                translate([pos_pulley_center.x, 0, pos_pulley_center.z]) 
                    sphere(r=bracket_arm_width/2);
                translate([pos_top_vertex.x, 0, pos_top_vertex.z]) 
                    sphere(r=bracket_arm_width/2);
            }
            // Arm V2-V3
            hull() {
                translate([pos_top_vertex.x, 0, pos_top_vertex.z]) 
                    sphere(r=bracket_arm_width/2);
                translate([pos_right_vertex.x, 0, pos_right_vertex.z]) 
                    sphere(r=bracket_arm_width/2);
            }
            // Arm V3-V1
            hull() {
                translate([pos_right_vertex.x, 0, pos_right_vertex.z]) 
                    sphere(r=bracket_arm_width/2);
                translate([pos_pulley_center.x, 0, pos_pulley_center.z]) 
                    sphere(r=bracket_arm_width/2);
            }
            
            // Bosses
            // Top Boss (V2)
            translate([pos_top_vertex.x, thickness/2 + bracket_boss_len_40/2 - 10, pos_top_vertex.z])
                rotate([90, 0, 0])
                cylinder(h=bracket_boss_len_40, d=bracket_boss_od_40, center=true);
                
            // Right Boss (V3)
            translate([pos_right_vertex.x, thickness/2 + bracket_boss_len_40/2 - 10, pos_right_vertex.z])
                rotate([90, 0, 0])
                cylinder(h=bracket_boss_len_40, d=bracket_boss_od_40, center=true);
                
            // Bottom Boss (V1) - Clevis style
            // Two small lugs for the pin
            translate([pos_pulley_center.x, -10, pos_pulley_center.z])
                cylinder(h=20, d=40, center=true);
            translate([pos_pulley_center.x, thickness + 10, pos_pulley_center.z])
                cylinder(h=20, d=40, center=true);
        }
        
        // Central Cutout (Open Web)
        // Scale down the triangle to create a hole
        linear_extrude(height=thickness + 1, center=true) {
            offset(delta=-25) {
                polygon(points=[
                    [pos_pulley_center.x, pos_pulley_center.z],
                    [pos_top_vertex.x, pos_top_vertex.z],
                    [pos_right_vertex.x, pos_right_vertex.z]
                ]);
            }
        }
        
        // Holes in Bosses
        // Top Boss Hole
        translate([pos_top_vertex.x, -20, pos_top_vertex.z])
            rotate([90, 0, 0])
            cylinder(h=bracket_boss_len_40 + 40, d=bracket_hole_40, center=true);
            
        // Right Boss Hole
        translate([pos_right_vertex.x, -20, pos_right_vertex.z])
            rotate([90, 0, 0])
            cylinder(h=bracket_boss_len_40 + 40, d=bracket_hole_40, center=true);
            
        // Bottom Boss Hole (V1)
        translate([pos_pulley_center.x, -30, pos_pulley_center.z])
            rotate([90, 0, 0])
            cylinder(h=bracket_thickness + 60, d=bracket_hole_30, center=true);
    }
}

// Link Arm
module link_arm() {
    thickness = link_arm_thickness;
    y_pos = link_arm_y_offset + thickness/2;
    
    color("lightgray")
    difference() {
        union() {
            // Curved Body (U-shape connecting Top and Right vertices)
            // Path from Top Vertex to Right Vertex
            // Using hull of spheres along a curve
            // Curve bulges outward (negative X)
            
            // Points along the curve
            p1 = [pos_top_vertex.x, y_pos, pos_top_vertex.z];
            p2 = [pos_right_vertex.x, y_pos, pos_right_vertex.z];
            control = [-150, y_pos, 350]; // Bulge out to the left
            
            // Approximate curve with segments
            for (i = [0:10]) {
                t = i/10;
                // Quadratic Bezier
                px = (1-t)*(1-t)*p1.x + 2*(1-t)*t*control.x + t*t*p2.x;
                pz = (1-t)*(1-t)*p1.z + 2*(1-t)*t*control.z + t*t*p2.z;
                translate([px, y_pos, pz])
                    sphere(r=30); // Arm radius
            }
            
            // Bosses
            // Top Boss
            translate([pos_top_vertex.x, y_pos, pos_top_vertex.z])
                rotate([90, 0, 0])
                cylinder(h=thickness + 20, d=link_arm_boss_od, center=true);
                
            // Right Boss
            translate([pos_right_vertex.x, y_pos, pos_right_vertex.z])
                rotate([90, 0, 0])
                cylinder(h=thickness + 20, d=link_arm_boss_od, center=true);
        }
        
        // Boss Holes
        translate([pos_top_vertex.x, y_pos - 20, pos_top_vertex.z])
            rotate([90, 0, 0])
            cylinder(h=thickness + 40, d=bracket_hole_40, center=true);
            
        translate([pos_right_vertex.x, y_pos - 20, pos_right_vertex.z])
            rotate([90, 0, 0])
            cylinder(h=thickness + 40, d=bracket_hole_40, center=true);
            
        // Blind Hole (Lateral face)
        // "shallow Ø50 mm blind socket on one flat face"
        // Located on the side of the arm
        translate([-50, y_pos, 350]) // Approximate location on the curve
            rotate([0, 90, 0])
            cylinder(h=link_arm_blind_depth, d=link_arm_blind_hole, center=false);
    }
}

// Pulley Disc
module pulley_disc() {
    color("gray")
    difference() {
        union() {
            // Main Disc
            cylinder(h=pulley_thickness, d=pulley_od, center=true);
            
            // Stepped Hub
            translate([0, 0, pulley_thickness/2 - 5])
                cylinder(h=10, d=pulley_hub_dia, center=true);
        }
        
        // Central Hole (for mounting)
        // "mounted on one face via a planar mating contact"
        // Implies it mounts to the bracket face.
        // Assuming a central bore for the pin or shaft.
        // Text says "single Ø30 mm x 100 mm pin... passes through... at the bracket's lower-left vertex".
        // So the pulley likely has a Ø30 hole or mounts around it.
        cylinder(h=pulley_thickness + 2, d=30, center=true);
        
        // Bolt Circle Holes
        for (i = [0:pulley_bolt_holes-1]) {
            angle = i * 360 / pulley_bolt_holes;
            r = pulley_bolt_circle_dia / 2;
            x = r * cos(angle);
            y = r * sin(angle);
            translate([x, y, -1])
                cylinder(h=pulley_thickness + 2, d=pulley_bolt_hole_dia, center=true);
        }
        
        // Rim Notches (30 small features)
        for (i = [0:pulley_rim_notches-1]) {
            angle = i * 360 / pulley_rim_notches;
            r = pulley_od / 2 + 2; // Slightly outside
            x = r * cos(angle);
            y = r * sin(angle);
            // Small notch
            translate([x, y, 0])
                rotate([0, 0, angle])
                cube([5, 10, pulley_thickness + 2], center=true);
        }
    }
}

// Flat Bar
module flat_bar() {
    color("darkgray")
    // Spans the top
    // Positioned at the top right, resting on the vertical support
    translate([0, 50, 500]) // Approximate top position
        cube([flat_bar_w, flat_bar_h, flat_bar_t], center=true);
}

// Inferred Vertical Support (c0015ff0)
// L-shaped bracket on the right holding the flat bar
module vertical_support() {
    color("silver")
    union() {
        // Vertical Leg
        translate([pos_right_vertex.x + 50, 0, 250])
            cube([40, 100, 300], center=true);
            
        // Top Horizontal Leg (holding flat bar)
        translate([pos_right_vertex.x + 50, 50, 480])
            cube([40, 100, 40], center=true);
            
        // Connection to Right Boss area
        translate([pos_right_vertex.x + 20, 50, 250])
            cube([40, 100, 40], center=true);
    }
}

// Inferred Pulley Mount (bfce4234)
// Host part for the lower-left pin
module pulley_mount() {
    color("silver")
    // Bracket extension for the pulley pin
    translate([pos_pulley_center.x, -20, pos_pulley_center.z])
        cube([40, 40, 40], center=true);
}

// Pins
module pin_40() {
    color("blue")
    cylinder(h=pin_40_len, d=pin_40_dia, center=true);
}

module pin_30_90() {
    color("red")
    cylinder(h=pin_30_len_90, d=pin_30_dia, center=true);
}

module pin_30_100() {
    color("green")
    cylinder(h=pin_30_len_100, d=pin_30_dia, center=true);
}

// ==========================================
// Assembly
// ==========================================

// 1. Triangular Linkage Bracket
// Oriented in XZ plane, thickness in Y
translate([0, bracket_thickness/2, 0])
    triangular_linkage_bracket();

// 2. Link Arm
// Parallel to bracket, offset in Y
translate([0, 0, 0])
    link_arm();

// 3. Pulley
// Mounted on the lower-left vertex face (Y=0)
translate([pos_pulley_center.x, -pulley_thickness/2, pos_pulley_center.z])
    rotate([90, 0, 0]) // Rotate so face is in YZ plane? No, pulley axis is X.
    // Default cylinder is Z-axis. Rotate 90 X puts it on Y axis.
    // We want X axis. Rotate 90 Y.
    rotate([0, 90, 0])
    pulley_disc();

// 4. Flat Bar
flat_bar();

// 5. Vertical Support
vertical_support();

// 6. Pulley Mount
pulley_mount();

// 7. Pins
// 4x Ø40 Pins (2 at Top, 2 at Right)
// Top Hinge
translate([pos_top_vertex.x, 0, pos_top_vertex.z])
    rotate([90, 0, 0])
    pin_40();
translate([pos_top_vertex.x, link_arm_y_offset, pos_top_vertex.z])
    rotate([90, 0, 0])
    pin_40();
    
// Right Hinge
translate([pos_right_vertex.x, 0, pos_right_vertex.z])
    rotate([90, 0, 0])
    pin_40();
translate([pos_right_vertex.x, link_arm_y_offset, pos_right_vertex.z])
    rotate([90, 0, 0])
    pin_40();

// 2x Ø30 Grounded Pins (bfd100ee)
// Placed at the base of the vertical support
translate([pos_right_vertex.x + 50, 50, 50])
    rotate([90, 0, 0])
    pin_30_90();
translate([pos_right_vertex.x + 50, 50, 150])
    rotate([90, 0, 0])
    pin_30_90();

// 1x Ø30 Pin (bfce1ad2) at lower-left
translate([pos_pulley_center.x, 0, pos_pulley_center.z])
    rotate([90, 0, 0])
    pin_30_100();