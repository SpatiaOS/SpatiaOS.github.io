// ==========================================
// Parametric Stylised Chair Assembly
// ==========================================

// General Resolution
$fn = 60;

// ------------------------------------------
// Dimensional Parameters (Millimeters)
// ------------------------------------------

// Legs (Column / Column_Spacer)
leg_height      = 100;
leg_cross_section = 25;
leg_waist_radius   = 135; // Concave curvature (~130-145 range)
leg_corner_fillet  = 2;

// Decorative Bracket (Seat + Backrest)
seat_width       = 100;
seat_depth       = 85;
seat_thickness   = 12;
arm_radius       = 50;  // Semicircular arc feature

backrest_height  = 215;
backrest_width   = 75;  // Tapers/width of the plate
backrest_thickness = 6;

// Cutouts & Features
diamond_cut_size = 14;   // Diamond through-cutouts
recess_depth     = 2;   // Depth of seat recesses

// Assembly Offsets
leg_inset_x      = 32;  // Distance of legs from center X
leg_inset_y      = 28;  // Distance of legs from center Y

// ------------------------------------------
// Modules
// ------------------------------------------

/**
 * Waisted Leg Component
 * Creates a column with concave cylindrical sides and filleted vertical edges.
 */
module waisted_leg() {
    // We construct the leg by defining a 2D cross-section that has the 
    // concave "waist" profile, then extruding it.
    // Using difference() with large circles creates the concave cylindrical faces.
    // Using minkowski() applies the corner fillets.
    
    // Effective size reduction to account for minkowski fillet addition
    eff_size = leg_cross_section - (2 * leg_corner_fillet);
    eff_height = leg_height - (2 * leg_corner_fillet);

    render() { // Optimizes preview performance for boolean ops
        minkowski() {
            linear_extrude(height = eff_height, center = false) {
                difference() {
                    // Base square profile
                    square([eff_size, eff_size], center = true);
                    
                    // Cut concave cylindrical profiles on all 4 sides
                    // Placing large radius circles outside the square to scoop out the edges
                    translate([leg_waist_radius, 0])
                        circle(r = leg_waist_radius);
                    translate([-leg_waist_radius, 0])
                        circle(r = leg_waist_radius);
                    translate([0, leg_waist_radius])
                        circle(r = leg_waist_radius);
                    translate([0, -leg_waist_radius])
                        circle(r = leg_waist_radius);
                }
            }
            // Apply R=2mm fillet to all sharp edges (vertical and horizontal caps)
            sphere(r = leg_corner_fillet);
        }
    }
}

/**
 * Diamond Shaped Cutout
 * Used for the decorative through-holes in the backrest and seat.
 */
module diamond_cutout(size, depth) {
    // Rotate 45 degrees to align with axes, scale for aspect ratio if needed
    rotate([0, 0, 45])
        cube([size * 0.7, size, depth + 1], center = true); // +1 for clean boolean cut
}

/**
 * Clover/Diamond Cluster Cutout
 * The specific pattern seen on the backrest panel.
 */
module backrest_clover_cutout(total_depth) {
    union() {
        // Central element
        diamond_cutout(diamond_cut_size * 0.6, total_depth);
        // Surrounding elements (rotated arrangement)
        for (i = [0 : 90 : 270]) {
            rotate([0, 0, i])
                translate([diamond_cut_size * 0.7, 0, 0])
                diamond_cutout(diamond_cut_size * 0.8, total_depth);
        }
    }
}

/**
 * Decorative Bracket (Main Body)
 * Combines the seat platform and the tall backrest.
 */
module decorative_bracket() {
    union() {
        // --- SEAT BASE ---
        difference() {
            union() {
                // Main rectangular seat block
                translate([0, 0, seat_thickness/2])
                    cube([seat_width, seat_depth, seat_thickness], center=true);
                
                // Side Semicircular Arcs (Armrests/Wings)
                // Left Wing
                translate([-seat_width/2 + arm_radius, 0, 0])
                    difference() {
                        cylinder(h=seat_thickness, r=arm_radius, center=true);
                        // Trim the inner half to merge smoothly or leave as bump
                        // Based on image, they look like semi-cylinders attached to sides
                        translate([arm_radius+1, 0, 0]) 
                            cube([arm_radius*2, arm_radius*2.5, seat_thickness+2], center=true);
                    }
                // Right Wing (Mirror)
                translate([seat_width/2 - arm_radius, 0, 0])
                    difference() {
                        cylinder(h=seat_thickness, r=arm_radius, center=true);
                        translate([-arm_radius-1, 0, 0]) 
                            cube([arm_radius*2, arm_radius*2.5, seat_thickness+2], center=true);
                    }
            }
            
            // Seat Top Recesses (Where legs mate)
            // 4 positions corresponding to leg placement
            for (x = [-leg_inset_x, leg_inset_x]) {
                for (y = [-leg_inset_y, leg_inset_y]) {
                    translate([x, y, seat_thickness/2])
                        diamond_cutout(diamond_cut_size * 1.2, recess_depth);
                }
            }
            
            // Additional diamond cutout on the front lip (visible in some views/text)
            translate([0, seat_depth/2 - 10, seat_thickness/2])
                 diamond_cutout(diamond_cut_size, recess_depth);
        }

        // --- BACKREST ---
        // Positioned at the rear of the seat
        translate([0, -seat_depth/2 + backrest_thickness/2, seat_thickness]) {
            difference() {
                // Backrest Plate (Leaf Shape)
                // Constructed via linear_extrusion of a custom polygon
                linear_extrude(height = backrest_height, center = false, scale = [0.05, 1]) {
                    // Base shape is a rectangle that tapers to a point
                    // We add some curvature to the sides for the "leaf" contour
                    // Using hull of points to approximate B-spline contour
                    w = backrest_width;
                    h_base = 10; // Thickness of the base before tapering starts fully
                    
                    // Custom polygon for the leaf profile
                    polygon(points=[
                        [-w/2, 0],           // Bottom Left
                        [w/2, 0],            // Bottom Right
                        [w/2, h_base],       // Right shoulder
                        [w/4, backrest_height * 0.8], // Right curve control
                        [0, backrest_height],         // Tip (Top Point)
                        [-w/4, backrest_height * 0.8],// Left curve control
                        [-w/2, h_base]        // Left shoulder
                    ]);
                }
                
                // Decorative Through-Cutout (Clover Pattern)
                // Positioned in the upper-middle area
                translate([0, backrest_height * 0.55, backrest_thickness/2 + 1])
                    backrest_clover_cutout(backrest_thickness + 2);
                    
                // Optional: Curved groove detail (approximated by a swept cut or simple void)
                // The image shows a curved line sweeping up. 
                // We can simulate this with a thin boolean subtraction if needed, 
                // but the main cutout is the primary feature requested.
            }
        }
    }
}

// ------------------------------------------
// Main Assembly
// ------------------------------------------

union() {
    // 1. The Main Bracket (Centered)
    // Shift Z so legs sit on ground (Z=0) and bracket sits atop
    // Bracket bottom is at Z=0 here, legs extend down? 
    // Let's put Seat bottom at Z=leg_height so legs hang down? 
    // Or Seat at Z=0 and legs go negative. Standard is Z=0 ground.
    // Let's place Seat at Z = leg_height.
    
    translate([0, 0, leg_height]) {
        decorative_bracket();
    }

    // 2. The Four Legs
    // Layout: 2 Front, 2 Rear
    // Coordinates relative to seat center
    
    // Front Left
    translate([-leg_inset_x, leg_inset_y, 0])
        waisted_leg();
        
    // Front Right
    translate([leg_inset_x, leg_inset_y, 0])
        waisted_leg();

    // Rear Left
    translate([-leg_inset_x, -leg_inset_y, 0])
        waisted_leg();
        
    // Rear Right
    translate([leg_inset_x, -leg_inset_y, 0])
        waisted_leg();
        
    // Note: The text mentions specific part IDs (column vs spacer) which may imply 
    // slight differences or mirroring. Visually they appear symmetric. 
    // If strict adherence to "mirrored pair" is needed for internal logic, 
    // mirror() could be used, but the geometry generated by waisted_leg() is radially symmetric 
    // in this implementation due to the uniform waist definition.
}