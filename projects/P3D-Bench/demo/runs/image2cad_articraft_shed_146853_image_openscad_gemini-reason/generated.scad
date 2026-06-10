// ==========================================
// Parametric Shed / Framed Building Model
// ==========================================

// --- Parameters ---
// Overall Dimensions
W = 300;            // Total width of the building
D = 400;            // Total depth of the building
H_wall = 160;       // Height of the walls
H_roof = 90;        // Height of the roof peak from the wall top

// Framing & Material Thicknesses
T_wall = 4;         // Thickness of the wall panels
T_frame = 6;        // Thickness of the framing members (trusses, purlins)
batten_w = 2;       // Width of the wall battens (vertical lines)
batten_t = 1.5;     // Thickness/depth of the wall battens

// Spacing
truss_spacing = 40; // Target spacing between roof trusses
purlin_spacing = 25;// Target spacing between horizontal roof purlins
batten_spacing = 15;// Spacing between vertical wall lines

// Door Dimensions
door_w = W * 0.35;  // Total width of the double doors
door_h = H_wall * 0.85; // Height of the doors

// Resolution
$fn = 32;           // Smoothness for small details (hinges)

// ==========================================
// Helper Modules (2D & Basic Shapes)
// ==========================================

// Creates a 2D rectangular beam from point p1 to p2
module beam2d(p1, p2, w) {
    L = norm(p2 - p1);
    angle = atan2(p2[1] - p1[1], p2[0] - p1[0]);
    translate(p1)
        rotate(angle)
        translate([0, -w/2])
        square([L, w]);
}

// ==========================================
// Wall Components
// ==========================================

// A solid wall panel with vertical raised battens and top/bottom trim
module wall_panel(w, h) {
    union() {
        // Main flat wall sheet
        cube([w, T_wall, h]);
        
        // Vertical battens (facing -Y direction)
        for(x = [batten_spacing/2 : batten_spacing : w - batten_spacing/2]) {
            translate([x - batten_w/2, -batten_t, 0])
                cube([batten_w, batten_t, h]);
        }
        
        // Bottom trim board
        translate([0, -batten_t - 0.5, 0])
            cube([w, batten_t + 0.5, 12]);
            
        // Top trim board (wall plate)
        translate([0, -batten_t - 0.5, h - 10])
            cube([w, batten_t + 0.5, 10]);
    }
}

// Detailed door hinge
module hinge() {
    color("DarkSlateGray") {
        // Hinge plate attached to wall/door
        translate([-4, -1, -6]) cube([8, 2, 12]);
        // Hinge pin/barrel
        translate([0, -1.5, -8]) cylinder(h=16, d=3);
    }
}

// Single door leaf
module door_leaf(w, h) {
    // Door outer frame
    difference() {
        cube([w, T_wall + 1, h]);
        // Cutout for inner recessed panel
        translate([8, -1, 8]) cube([w - 16, T_wall + 3, h - 16]);
    }
    // Inner recessed panel
    translate([8, 1.5, 8]) cube([w - 16, T_wall - 2, h - 16]);
}

// Double door assembly with hinges
module double_doors(w, h) {
    leaf_w = w / 2 - 1; // Slight gap in the middle
    
    // Left Door
    door_leaf(leaf_w, h);
    // Right Door
    translate([w / 2 + 1, 0, 0]) door_leaf(leaf_w, h);
    
    // Place Hinges
    hinge_heights = [h * 0.15, h * 0.5, h * 0.85];
    for(z = hinge_heights) {
        // Left side hinges
        translate([0, -batten_t, z]) hinge();
        // Right side hinges
        translate([w, -batten_t, z]) hinge();
    }
}

// Front wall with door cutout and placed doors
module front_wall() {
    door_x = (W - door_w) / 2;
    
    difference() {
        wall_panel(W, H_wall);
        // Cutout for the doors (oversized in Y to ensure clean cut)
        translate([door_x, -10, -1])
            cube([door_w, 20, door_h + 1]);
    }
    
    // Insert the doors into the cutout
    translate([door_x, -batten_t, 0])
        double_doors(door_w, door_h);
}

// ==========================================
// Roof Components
// ==========================================

// 2D Profile of a single W-Truss
module truss_2d() {
    // Intersect with a bounding box to clip any protruding beam corners at the ridge
    intersection() {
        polygon([
            [0, 0], [0, T_frame], 
            [W/2, H_roof + T_frame], 
            [W, T_frame], [W, 0]
        ]);
        
        union() {
            // Bottom chord (tie beam)
            beam2d([0, T_frame/2], [W, T_frame/2], T_frame);
            
            // Rafters (angled roof beams)
            beam2d([0, T_frame/2], [W/2, H_roof], T_frame);
            beam2d([W, T_frame/2], [W/2, H_roof], T_frame);
            
            // King post (center vertical beam)
            beam2d([W/2, T_frame/2], [W/2, H_roof], T_frame);
            
            // Diagonal web struts (W-shape)
            beam2d([W/2, T_frame/2], [W/4, H_roof/2 + T_frame/2], T_frame);
            beam2d([W/2, T_frame/2], [W*0.75, H_roof/2 + T_frame/2], T_frame);
        }
    }
}

// 3D Extruded Truss, properly oriented
module truss_3d() {
    translate([0, T_frame, 0])
        rotate([90, 0, 0])
        linear_extrude(T_frame)
        truss_2d();
}

// All roof trusses spaced along the depth of the building
module roof_trusses() {
    num_trusses = ceil(D / truss_spacing) + 1;
    actual_spacing = (D - T_frame) / (num_trusses - 1);
    
    for(i = [0 : num_trusses - 1]) {
        translate([0, i * actual_spacing, H_wall])
            truss_3d();
    }
}

// Horizontal strapping/purlins running across the trusses
module roof_purlins() {
    L_rafter = sqrt(pow(W/2, 2) + pow(H_roof, 2));
    alpha = atan2(H_roof, W/2);
    
    num_purlins = ceil(L_rafter / purlin_spacing) + 1;
    actual_spacing = L_rafter / (num_purlins - 1);
    
    for(i = [0 : num_purlins - 1]) {
        dist = i * actual_spacing;
        x_offset = dist * cos(alpha);
        z_offset = dist * sin(alpha);
        
        // Left side purlins
        translate([x_offset, 0, H_wall + z_offset])
            rotate([0, -alpha, 0])
            translate([-T_frame/2, 0, T_frame/2]) // Center on rafter top
            cube([T_frame, D, T_frame/2]);
            
        // Right side purlins
        translate([W - x_offset, 0, H_wall + z_offset])
            rotate([0, alpha, 0])
            translate([-T_frame/2, 0, T_frame/2]) // Center on rafter top
            cube([T_frame, D, T_frame/2]);
    }
}

// The solid roof panel on the front-left section
module roof_panel_cover() {
    L_rafter = sqrt(pow(W/2, 2) + pow(H_roof, 2));
    alpha = atan2(H_roof, W/2);
    panel_depth = D * 0.35; // Covers about 1/3 of the roof depth
    
    color("LightGray")
    translate([0, 0, H_wall])
        translate([0, 0, T_frame]) // Sit on top of the purlins
        rotate([0, -alpha, 0])
        cube([L_rafter + 2, panel_depth, 2]);
}

// ==========================================
// Main Assembly
// ==========================================

module main_assembly() {
    // 1. Walls Assembly
    color("Silver") {
        // Front Wall (faces -Y)
        translate([0, T_wall, 0]) 
            front_wall();
            
        // Back Wall (faces +Y)
        translate([0, D - T_wall, 0]) 
            mirror([0, 1, 0]) 
            wall_panel(W, H_wall);
            
        // Left Wall (faces -X)
        translate([T_wall, 0, 0]) 
            rotate([0, 0, 90]) 
            mirror([0, 1, 0]) 
            wall_panel(D, H_wall);
            
        // Right Wall (faces +X)
        translate([W - T_wall, 0, 0]) 
            rotate([0, 0, 90]) 
            wall_panel(D, H_wall);
    }

    // 2. Roof Framing
    color("Gainsboro") {
        roof_trusses();
        roof_purlins();
    }

    // 3. Roof Sheathing (Front Left)
    roof_panel_cover();
}

// Render the complete model
main_assembly();