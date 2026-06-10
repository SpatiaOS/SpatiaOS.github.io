// ==========================================
// Premier League Trophy Reconstruction
// Parametric OpenSCAD Model
// ==========================================

// General Resolution
$fn = 100;

// ------------------------------------------
// Dimensional Parameters (mm)
// ------------------------------------------

// Pedestal Body (Part 8d02bd4c)
body_base_radius = 32;       // Flared base radius
body_height = 130;           // Total height of main body
body_top_radius = 18;        // Radius of flat top disk
neck_radius = 21;            // Concave neck min radius
shoulder_radius = 29;        // Bulging shoulder max radius
body_mid_radius = 26;        // Tapered body section

// Serrated Crown Ring (Part 8d0a8592)
crown_inner_radius = 18.44;  // Central bore radius
crown_outer_radius = 27;     // Tip of teeth radius
crown_valley_radius = 21;    // Bottom of notches radius
crown_height = 18;           // Axial height of ring
crown_teeth_count = 10;      // Number of zigzag periods

// Bearing Balls (Part 8d0afae4)
ball_radius = 3.0;           // Sphere radius
ball_count = 10;             // Number of spheres
ball_orbit_radius = 28;      // Radial distance of balls from center

// Handle Assembly Parameters
handle_x_offset = 34;        // Distance of handle assembly from center axis
handle_total_height = 120;   // Vertical span of handles
handle_width = 45;           // Lateral width of handle structure

// Key / Bar Dimensions (Parts 8d0cf680, 8d0ea43e)
main_key_length = 120;
main_key_width = 7.5;
main_key_thickness = 7.5;
secondary_key_length = 101;

// Clip / Hook Dimensions (Part 8d0ef264)
clip_thickness = 2;
clip_width = 24;
clip_height = 27;

// ------------------------------------------
// Modules
// ------------------------------------------

// --- Main Pedestal Body ---
module pedestal_body() {
    // Revolved profile defined by points [radius, height]
    // Matches description: flared base, taper, bulge, neck, flat top
    rotate_extrude(convexity=10) {
        polygon(points=[
            [0, 0],
            [body_base_radius, 0],
            [body_base_radius, 5],       // Base flange bottom
            [body_base_radius - 2, 8],   // Base molding transition
            [body_mid_radius + 2, 30],   // Lower taper
            [body_mid_radius, 65],       // Waist start
            [shoulder_radius, 85],       // Shoulder bulge
            [neck_radius + 2, 100],      // Upper taper
            [neck_radius, 108],          // Neck minimum
            [body_top_radius + 4, 113],  // Top lip flare
            [body_top_radius, 117],      // Flat top surface
            [0, 117]                     // Center axis close
        ]);
    }
    
    // Embossed Text ("Premier League")
    // Placed on the tapered section (approx Z=50 to 80)
    color("silver") 
    translate([0, -body_mid_radius - 0.5, 65]) 
    rotate([0, 0, 0]) 
    linear_extrude(height=1, scale=1.05) {
        text("Premier", size=8, halign="center", valign="center", font="Liberation Sans:style=Bold");
    }
    
    color("silver") 
    translate([0, -body_mid_radius - 0.5, 54]) 
    rotate([0, 0, 0]) 
    linear_extrude(height=1, scale=1.05) {
        text("League", size=8, halign="center", valign="center", font="Liberation Sans:style=Bold");
    }
}

// --- Serrated Crown Ring ---
module serrated_crown() {
    difference() {
        // Outer shell with teeth
        rotate_extrude(convexity=10) {
            // Constructing the zigzag profile manually for precision
            // We draw one tooth period and let rotate_extrude duplicate it, 
            // or draw the full half-profile. Here we draw a full star-like profile.
            // To keep it simple and robust, we approximate the zigzag with a polygon
            // that has enough segments, or use a loop of unions.
            // Using a custom polygon for the cross section:
            
            // Step 1: Draw the base cylinder part
            // Step 2: Draw the teeth protruding outward
            
            // A simpler approach for rotate_extrude is defining the max envelope 
            // and subtracting valleys, OR drawing the explicit path.
            // Explicit path:
            p_teeth = crown_teeth_count;
            angle_step = 360 / p_teeth;
            
            // We cannot loop inside 2D polygon generation easily without recursion/hack,
            // so we approximate the crown profile as a circle with radial modulation 
            // OR we build the 3D crown differently.
            
            // Let's use a 3D approach for the crown to get sharp planar facets as described (62 planar faces)
            union() {
                // Base cylinder
                cylinder(h=crown_height, r=crown_valley_radius + 2);
                
                // Teeth
                for (i = [0 : p_teeth - 1]) {
                    rotate([0, 0, i * angle_step])
                    linear_extrude(height=crown_height, scale=1.0)
                    polygon(points=[
                        [crown_valley_radius, -2],
                        [crown_outer_radius, crown_height/2],
                        [crown_valley_radius, crown_height+2]
                    ]);
                }
            }
        }
        
        // Central Through-Bore (6 cylindrical segments conceptually, here modeled as continuous for stability)
        cylinder(h=crown_height + 2, r=crown_inner_radius, center=true);
        
        // Optional: Cutouts between teeth to make them distinct if needed, 
        // but the union approach above creates the shape. 
        // Refining shape to match "deep V-shaped notches":
    }
    
    // Refined Crown Construction for better geometry match
    // Re-doing crown as a single solid with correct topology
}

module crown_refined() {
    rotate_extrude(convexity=10) {
        // Generate the 2D profile of one tooth sector and mirror/rotate?
        // Actually, drawing the 'average' star shape in 2D is hard for rotate_extrude 
        // because rotate_extrude rotates a static 2D shape around Z.
        // So the 2D shape must look like a gear tooth profile in the XZ plane (r vs z).
        // But the text says "periodic zigzag... around circumference". 
        // This implies the variation is in XY plane (radial), not XZ (vertical).
        // Therefore, rotate_extrude of a simple disc + 3D teeth is best.
    }
    
    // Final Crown Implementation
    difference() {
        union() {
            // Core ring
            cylinder(h=crown_height, r=crown_valley_radius + 1);
            // Teeth array
            for (i = [0 : crown_teeth_count - 1]) {
                rotate([0, 0, i * (360 / crown_teeth_count)])
                translate([crown_valley_radius, 0, 0])
                // Triangular prism for tooth
                rotate([0, 0, 180/crown_teeth_count]) // Orient point outward
                linear_extrude(height=crown_height, center=false)
                polygon(points=[
                    [0, -2], 
                    [crown_outer_radius - crown_valley_radius, crown_height/2], 
                    [0, crown_height+2]
                ]);
            }
        }
        // Hollow center
        cylinder(h=crown_height + 1, r=crown_inner_radius, center=false);
    }
}


// --- Bearing Balls ---
module bearing_balls() {
    for (i = [0 : ball_count - 1]) {
        angle = i * (360 / ball_count);
        rotate([0, 0, angle])
        translate([ball_orbit_radius, 0, crown_height + ball_radius - 1]) // Sit on top of crown
        sphere(r=ball_radius);
    }
}

// --- Handle Components ---

// Helper: Rounded Bar (Parallel Key style)
module rounded_bar(l, w, h, r_end) {
    // Box with cylindrical ends
    // Centered horizontally, bottom aligned at z=0 for easy stacking
    hull() {
        translate([0, 0, r_end]) 
        rotate([0, 90, 0]) 
        cylinder(h=l - 2*r_end, r=w/2, center=true); // Main body
        
        translate([(l/2) - r_end, 0, r_end]) 
        sphere(r_end); // Front end
        
        translate([-(l/2) + r_end, 0, r_end]) 
        sphere(r_end); // Back end
    }
}

// Helper: S-Curved Strip (Curved Arm / Support Strip style)
// Generates a curved ribbon following control points
module curved_ribbon(p1, p2, p3, p4, thickness, width) {
    // Approximate curve using hull of spheres/segments
    // p1..p4 are [x,y,z] coords
    hull() {
        // Segment 1->2
        translate(p1) sphere(d=width);
        translate(p2) sphere(d=width);
        // Segment 2->3
        translate(p2) sphere(d=width);
        translate(p3) sphere(d=width);
        // Segment 3->4
        translate(p3) sphere(d=width);
        translate(p4) sphere(d=width);
    }
}

// Helper: Clip/Hook (C-shape)
module retaining_clip() {
    // Simplified C-shape hook
    // Extruded profile
    linear_extrude(height=clip_thickness, center=true)
    difference() {
        // Outer C shape
        translate([-clip_width/2, 0]) 
        square([clip_width, clip_height]);
        // Inner cutout
        translate([-clip_width/2 + 4, 4]) 
        square([clip_width - 4, clip_height - 6]);
    }
}

// Complete Handle Assembly (One Side)
module handle_assembly(side_multiplier) {
    // side_multiplier: 1 for Right, -1 for Left
    
    // Position the whole handle group
    // Attach point is roughly at the shoulder/neck (Z~95-115)
    // The handle extends down to base and up to crown level
    
    translate([side_multiplier * handle_x_offset, 0, 15]) {
        
        color("gray") 
        union() {
            
            // 1. Parallel Key (Main Spine) - Part 8d0cf680
            // 7.5 x 7.5 x 120mm, rounded ends
            // Positioned vertically, slightly angled or curved?
            // Description says "curved arms", so let's bend the main key slightly 
            // or position the straight key and wrap curved things around it.
            // Let's assume the "Parallel Key" is the straight rigid backbone.
            translate([0, 0, 0]) 
            rotate([0, 5*side_multiplier, 0]) // Slight tilt
            rounded_bar(main_key_length, main_key_width, main_key_thickness, 5);

            // 2. Curved Arms (Outer Frame) - Part 8d0d44b0 (x2 instances per side implied by structure, or 1 complex arm)
            // "S-curved profiles"
            // We create the sweeping outer boundary
            color("darkgray")
            hull() {
                translate([0, -15, 10]) sphere(d=8); // Bottom anchor
                translate([side_multiplier * 15, -20, 60]) sphere(d=8); // Bow out
                translate([side_multiplier * 5, -15, 110]) sphere(d=8); // Top anchor
            }

            // 3. Secondary Curved Support Strip - Part 8d11b16e
            // Inner decorative ribbon
            color("lightgray")
            hull() {
                translate([0, -5, 20]) sphere(d=5);
                translate([side_multiplier * 8, -10, 70]) sphere(d=5);
                translate([side_multiplier * 2, -5, 105]) sphere(d=5);
            }
            
            // 4. Additional Curved Strips (Decorative flow)
            // Parts 8d135f1c, 8d1497a4, 8d15d01c
            color("silver")
            hull() {
                 translate([2, -22, 30]) sphere(d=4);
                 translate([side_multiplier * 12, -25, 75]) sphere(d=4);
                 translate([side_multiplier * 8, -20, 100]) sphere(d=4);
            }
            
            color("silver")
            hull() {
                 translate([-2, -12, 40]) sphere(d=3);
                 translate([side_multiplier * 5, -15, 80]) sphere(d=3);
            }

            // 5. Secondary Key (Shorter bar) - Part 8d0ea43e
            // Bridges handles/body
            translate([side_multiplier * 5, -10, 50])
            rotate([0, 10, 0])
            rounded_bar(secondary_key_length, 6, 6, 3);

            // 6. Retaining Clips - Part 8d0ef264 (x2)
            // Engage arms to body (Top connection)
            translate([side_multiplier * (-2), -18, 105]) 
            rotate([0, 0, 15*side_multiplier])
            retaining_clip();
            
            // Lower clip/connection
            translate([side_multiplier * (-2), -18, 25]) 
            rotate([0, 0, -15*side_multiplier])
            scale([1, 0.8, 1])
            retaining_clip();
        }
    }
}

// ------------------------------------------
// Main Assembly
// ------------------------------------------

union() {
    // 1. Grounded Pedestal Body
    pedestal_body();
    
    // 2. Crown Ring (Seated atop pedestal)
    translate([0, 0, body_height - 2]) // Adjust Z to sit on flat top
    crown_refined();
    
    // 3. Bearing Balls (On crown tips)
    bearing_balls();
    
    // 4. Left Handle Assembly
    handle_assembly(-1);
    
    // 5. Right Handle Assembly (Mirrored)
    handle_assembly(1);
}