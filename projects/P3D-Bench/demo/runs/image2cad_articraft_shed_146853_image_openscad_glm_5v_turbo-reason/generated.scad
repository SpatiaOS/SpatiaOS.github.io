// Shed/Garage Framing Model - Parametric OpenSCAD Design
// This model creates a framed structure with gable roof, 
// exposed trusses, stud walls, and double doors

// ============================================
// PARAMETERS (All dimensions in millimeters)
// ============================================

// Building dimensions
building_width = 4000;      // Width of building (gable end)
building_length = 6000;     // Length of building (side)
wall_height = 2500;         // Height of side walls
roof_pitch = 35;            // Roof angle in degrees
overhang = 200;             // Roof overhang at eaves

// Framing dimensions
stud_width = 50;            // Stud thickness
stud_depth = 100;           // Stud width (into page)
plate_height = 50;          // Top/bottom plate height
truss_chord_depth = 100;    // Rafter/truss chord depth
purlin_size = 50;           // Square purlin dimension
foundation_thickness = 150; // Slab thickness
foundation_overhang = 100;  // How much slab extends beyond walls

// Spacing
stud_spacing = 600;         // Center-to-center stud spacing
truss_spacing = 1200;       // Center-to-center truss spacing
purlin_spacing = 800;       // Purlin spacing along roof

// Door parameters
door_width = 1200;          // Single door width
door_height = 2200;         // Door height
door_frame_width = 80;      // Door frame thickness
hinge_count = 4;            // Number of hinges per door
hinge_length = 100;
hinge_width = 40;
hinge_thickness = 8;

// Resolution
$fn = 30;

// ============================================
// MODULE DEFINITIONS
// ============================================

// Foundation slab
module foundation() {
    color("gray")
    translate([0, 0, foundation_thickness/2])
    cube([building_width + 2*foundation_overhang, 
          building_length + 2*foundation_overhang, 
          foundation_thickness], center=true);
}

// Single stud/post
module stud(length) {
    cube([stud_width, stud_depth, length], center=true);
}

// Bottom and top plates for walls
module wall_plate(length) {
    cube([stud_width, length, plate_height], center=true);
}

// Complete wall frame (one long side)
module side_wall_frame() {
    num_studs = floor(building_length / stud_spacing) + 1;
    
    // Bottom plate
    translate([0, 0, plate_height/2])
    wall_plate(building_length);
    
    // Top plate
    translate([0, 0, wall_height - plate_height/2])
    wall_plate(building_length);
    
    // Vertical studs
    for (i = [0 : num_studs-1]) {
        translate([0, -building_length/2 + i*stud_spacing, wall_height/2])
        stud(wall_height);
        
        // Double studs at ends (corners)
        if (i == 0 || i == num_studs-1) {
            translate([stud_width, -building_length/2 + i*stud_spacing, wall_height/2])
            stud(wall_height);
        }
    }
}

// Gable end wall frame
module gable_end_frame(is_front=false) {
    rise = (building_width/2) * tan(roof_pitch);
    gable_height = wall_height + rise;
    
    // Bottom plate
    translate([0, 0, plate_height/2])
    wall_plate(stud_depth);
    
    // Top plate (full width)
    translate([0, 0, wall_height - plate_height/2])
    cube([building_width, stud_depth, plate_height], center=true);
    
    // Gable peak plate
    translate([0, 0, gable_height - plate_height/2])
    cube([stud_width, stud_depth, plate_height], center=true);
    
    // Corner studs
    for (x = [-building_width/2 + stud_width/2, building_width/2 - stud_width/2]) {
        translate([x, 0, wall_height/2])
        stud(wall_height);
    }
    
    // Intermediate studs along base
    num_studs = floor((building_width - 2*stud_width) / stud_spacing);
    for (i = [1 : num_studs]) {
        x = -building_width/2 + stud_width + i * ((building_width - 2*stud_width)/(num_studs+1));
        translate([x, 0, wall_height/2])
        stud(wall_height);
    }
    
    // Gable studs (angled top)
    if (!is_front) {
        num_gable_studs = 5;
        for (i = [1 : num_gable_studs-1]) {
            ratio = i / num_gable_studs;
            x_left = -building_width/2 + ratio * building_width/2;
            x_right = building_width/2 - ratio * building_width/2;
            
            // Left side gable studs
            stud_h = wall_height + ratio * rise - plate_height;
            translate([x_left, 0, plate_height + stud_h/2])
            stud(stud_h);
            
            // Right side gable studs  
            translate([x_right, 0, plate_height + stud_h/2])
            stud(stud_h);
        }
    }
}

// Single roof truss (triangular A-frame)
module roof_truss() {
    rise = (building_width/2) * tan(roof_pitch);
    rafter_length = sqrt(pow(building_width/2, 2) + pow(rise, 2));
    rafter_angle = atan2(rise, building_width/2);
    
    color("burlywood") {
        // Bottom chord
        rotate([90, 0, 0])
        cylinder(h=building_length*0.3, d=truss_chord_depth, center=true); // Simplified as cylinder
        
        // Actually use proper beam for bottom chord
        translate([0, 0, plate_height])
        cube([building_width - 2*stud_width, truss_chord_depth, stud_width], center=true);
        
        // Left rafter
        translate([-building_width/4, 0, wall_height + rise/2])
        rotate([0, 0, rafter_angle])
        cube([rafter_length, truss_chord_depth, stud_width], center=true);
        
        // Right rafter
        translate([building_width/4, 0, wall_height + rise/2])
        rotate([0, 0, -rafter_angle])
        cube([rafter_length, truss_chord_depth, stud_width], center=true);
        
        // King post (vertical center)
        translate([0, 0, wall_height + rise/2])
        cube([stud_width, truss_chord_depth, rise], center=true);
        
        // Web struts
        strut_y = rise * 0.4;
        translate([-building_width/6, 0, wall_height + strut_y])
        rotate([0, 0, rafter_angle])
        cube([building_width/3, stud_width, stud_width], center=true);
        
        translate([building_width/6, 0, wall_height + strut_y])
        rotate([0, 0, -rafter_angle])
        cube([building_width/3, stud_width, stud_width], center=true);
    }
}

// Roof purlins (horizontal cross-beams)
module purlins() {
    rise = (building_width/2) * tan(roof_pitch);
    num_purlins = ceil(rise / purlin_spacing);
    
    color("tan") {
        for (i = [0 : num_purlins]) {
            y_pos = i * purlin_spacing;
            if (y_pos <= rise) {
                // Calculate width at this height (narrower near peak)
                width_at_height = building_width - 2*(rise - y_pos)/tan(roof_pitch);
                if (width_at_height > 0) {
                    translate([0, 0, wall_height + y_pos])
                    cube([width_at_height - 20, building_length, purlin_size], center=true);
                }
            }
        }
        
        // Ridge purlin at peak
        translate([0, 0, wall_height + rise])
        cube([purlin_size, building_length, purlin_size], center=true);
    }
}

// Single door panel
module door_panel(width, height) {
    color("saddlebrown")
    difference() {
        // Main door body
        cube([width - 10, stud_depth - 20, height - 10], center=true);
        
        // Panel recesses (decorative)
        for (z = [-height/4, height/4]) {
            translate([0, 5, z])
            cube([width - 60, stud_depth, height/3], center=true);
        }
    }
    
    // Door frame border
    color("darkgray")
    difference() {
        cube([width, stud_depth, height], center=true);
        cube([width - 15, stud_depth + 1, height - 15], center=true);
    }
}

// Hinge module
module hinge() {
    color("darkgray")
    cube([hinge_width, hinge_thickness, hinge_length], center=true);
    
    // Hinge pin detail
    color("silver")
    translate([0, hinge_thickness/2 + 2, 0])
    cylinder(h=hinge_length - 20, d=6, center=true);
}

// Complete double door assembly
module double_door() {
    total_width = door_width * 2 + 20; // Gap between doors
    
    // Left door
    translate([-door_width/2 - 10, 0, door_height/2 + plate_height]) {
        door_panel(door_width, door_height);
        
        // Hinges for left door (on left edge)
        for (i = [0 : hinge_count-1]) {
            translate([-door_width/2 + hinge_width/2, -stud_depth/2 + hinge_thickness/2, 
                      -door_height/2 + 150 + i*((door_height-300)/(hinge_count-1))])
            hinge();
        }
    }
    
    // Right door
    translate([door_width/2 + 10, 0, door_height/2 + plate_height]) {
        door_panel(door_width, door_height);
        
        // Hinges for right door (on right edge - mirrored)
        for (i = [0 : hinge_count-1]) {
            translate([door_width/2 - hinge_width/2, -stud_depth/2 + hinge_thickness/2,
                      -door_height/2 + 150 + i*((door_height-300)/(hinge_count-1))])
            mirror([1,0,0])
            hinge();
        }
    }
    
    // Door header/lintel above doors
    color("gray")
    translate([0, 0, door_height + plate_height + 25])
    cube([total_width + 40, stud_depth, 50], center=true);
}

// Wall sheathing (siding panels)
module wall_sheathing(side="left") {
    panel_overlap = 20;
    panel_height = 300;
    num_panels = ceil(wall_height / (panel_height - panel_overlap));
    
    color("lightgray", 0.9) {
        if (side == "left" || side == "right") {
            // Side walls
            for (i = [0 : num_panels-1]) {
                z_pos = panel_height/2 + i * (panel_height - panel_overlap);
                if (z_pos < wall_height) {
                    translate([side=="left" ? -stud_width/2 - 5 : stud_width/2 + 5, 
                              0, z_pos])
                    cube([15, building_length, panel_height], center=true);
                }
            }
        } else if (side == "front" || side == "back") {
            // Gable ends (excluding door opening on front)
            rise = (building_width/2) * tan(roof_pitch);
            
            for (i = [0 : num_panels-1]) {
                z_pos = panel_height/2 + i * (panel_height - panel_overlap);
                if (z_pos < wall_height && !(side == "front" && z_pos < door_height + 50)) {
                    // Calculate width at this height for gable
                    if (z_pos <= wall_height) {
                        translate([0, side=="front" ? stud_depth/2 + 5 : -stud_depth/2 - 5, 
                                  z_pos])
                        cube([building_width, 15, min(panel_height, wall_height - z_pos + panel_height/2)], center=true);
                    }
                }
            }
        }
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Foundation
    foundation();
    
    // Side wall frames (left and right)
    translate([-building_width/2 + stud_width/2, 0, 0])
    side_wall_frame();
    
    translate([building_width/2 - stud_width/2, 0, 0])
    side_wall_frame();
    
    // Back gable end
    translate([0, -building_length/2 + stud_depth/2, 0])
    gable_end_frame(false);
    
    // Front gable end (with door opening)
    translate([0, building_length/2 - stud_depth/2, 0])
    gable_end_frame(true);
    
    // Roof trusses
    num_trusses = floor(building_length / truss_spacing) + 1;
    for (i = [0 : num_trusses-1]) {
        translate([0, -building_length/2 + i*truss_spacing, 0])
        roof_truss();
    }
    
    // Add truss at very end if needed
    if (num_trusses * truss_spacing < building_length - 100) {
        translate([0, building_length/2 - stud_depth - 50, 0])
        roof_truss();
    }
    
    // Purlins
    purlins();
    
    // Double doors on front
    translate([0, building_length/2 - stud_depth/2, 0])
    double_door();
    
    // Wall sheathing/siding
    wall_sheathing("left");
    wall_sheathing("right");
    wall_sheathing("back");
    // Front sheathing (around door)
    wall_sheathing("front");
}