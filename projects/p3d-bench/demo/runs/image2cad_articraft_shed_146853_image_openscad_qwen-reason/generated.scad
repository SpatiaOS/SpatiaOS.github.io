// Shed Model based on provided image
// Parametric Garden Shed with Gable Roof and Double Doors

// --- Global Parameters ---
$fn = 50; // Resolution for curves

// Dimensions (mm)
shed_width = 2400;      // X axis
shed_depth = 1800;      // Y axis
wall_height = 2000;     // Z axis (eaves height)
roof_rise = 800;        // Height from eaves to ridge
roof_overhang = 250;    // Overhang on all sides

// Lumber Dimensions (nominal 2x4 approx)
lumber_thickness = 38;  
lumber_width = 89;

// Siding
siding_thickness = 12;

// Door
door_width = (shed_width - 4*lumber_thickness) / 2; // Approx width fitting between studs
door_height = wall_height - 100; // Slightly shorter than wall
hinge_count = 3;
hinge_size = [40, 40, 5];

// Colors (for visualization, optional)
color_wood = [0.8, 0.6, 0.4];
color_siding = [0.7, 0.7, 0.7];
color_door = [0.6, 0.5, 0.3];

// --- Main Assembly ---
assembly();

module assembly() {
    // Base Platform
    translate([0, 0, 0])
        base_frame();

    // Walls
    // Back Wall (at y=0)
    translate([0, 0, lumber_width]) // Sit on top of base frame
        wall_assembly(shed_width, wall_height, has_doors=false);

    // Left Wall (at x=0)
    rotate([0, 0, 90])
        translate([0, 0, lumber_width])
            wall_assembly(shed_depth, wall_height, has_doors=false);

    // Right Wall (at x=shed_width)
    translate([shed_width, 0, 0])
        rotate([0, 0, -90])
            translate([0, 0, lumber_width])
                wall_assembly(shed_depth, wall_height, has_doors=false);

    // Front Wall (at y=shed_depth) - Contains doors
    translate([0, shed_depth, 0])
        rotate([0, 0, 180])
            translate([0, 0, lumber_width])
                front_wall_assembly();

    // Roof Structure
    translate([0, 0, wall_height + lumber_width]) // Sit on top of wall plates
        roof_structure();
}

// --- Base Module ---
module base_frame() {
    color(color_wood) {
        // Perimeter frame
        // Front and Back beams (along X)
        translate([0, 0, 0]) cube([shed_width, lumber_width, lumber_width]);
        translate([0, shed_depth - lumber_width, 0]) cube([shed_width, lumber_width, lumber_width]);
        
        // Side beams (along Y) - placed inside width to overlap corners simply
        translate([0, 0, 0]) cube([lumber_width, shed_depth, lumber_width]);
        translate([shed_width - lumber_width, 0, 0]) cube([lumber_width, shed_depth, lumber_width]);
        
        // Floor joists (simplified - just a few for support)
        num_joists = 4;
        for (i = [1 : num_joists-1]) {
            translate([i * (shed_width/num_joists), 0, 0])
                cube([lumber_thickness, shed_depth, lumber_width]);
        }
    }
}

// --- Generic Wall Module ---
// Creates a wall with top/bottom plates, studs, and siding
module wall_assembly(length, height, has_doors=false) {
    color(color_wood) {
        // Bottom Plate
        translate([0, 0, 0])
            cube([length, lumber_width, lumber_thickness]);
        
        // Top Plate (Double plate for strength usually, simplified here)
        translate([0, height - lumber_thickness, 0])
            cube([length, lumber_width, lumber_thickness]);
            
        // Studs
        stud_spacing = 600;
        num_studs = floor(length / stud_spacing);
        // Ensure studs at ends
        // Stud 0
        translate([0, 0, lumber_thickness])
            cube([lumber_thickness, lumber_width, height - 2*lumber_thickness]);
            
        for (i = [1 : num_studs]) {
            pos_x = i * stud_spacing;
            if (pos_x < length) {
                translate([pos_x, 0, lumber_thickness])
                    cube([lumber_thickness, lumber_width, height - 2*lumber_thickness]);
            }
        }
        // Last stud
        translate([length - lumber_thickness, 0, lumber_thickness])
            cube([lumber_thickness, lumber_width, height - 2*lumber_thickness]);
    }
    
    // Siding
    color(color_siding) {
        // Backing sheet
        translate([0, lumber_width, lumber_thickness])
            cube([length, siding_thickness, height - 2*lumber_thickness]);
            
        // Vertical battens/panels to simulate the look
        batten_width = 150;
        batten_thickness = 15;
        num_battens = floor(length / batten_width);
        for (i = [0 : num_battens]) {
            translate([i * batten_width + 20, lumber_width + siding_thickness, lumber_thickness])
                cube([batten_thickness, siding_thickness, height - 2*lumber_thickness]);
        }
    }
}

// --- Front Wall with Doors ---
module front_wall_assembly() {
    // We need to frame the door opening
    // Re-use generic wall logic but subtract door hole or build around it
    
    color(color_wood) {
        // Bottom Plate
        translate([0, 0, 0]) cube([shed_width, lumber_width, lumber_thickness]);
        
        // Top Plate
        translate([0, wall_height - lumber_thickness, 0]) cube([shed_width, lumber_width, lumber_thickness]);
        
        // Header for doors (above doors)
        header_height = 100;
        door_opening_height = door_height;
        header_y = wall_height - lumber_thickness - header_height;
        
        // Left King Stud
        translate([0, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, wall_height - 2*lumber_thickness]);
        
        // Right King Stud
        translate([shed_width - lumber_thickness, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, wall_height - 2*lumber_thickness]);
        
        // Door framing studs (Jack studs)
        // Calculate door positions
        // Total width available: shed_width - 2*lumber_thickness (king studs)
        // Let's center the doors
        total_door_width = 2 * door_width + 20; // gap
        start_x = (shed_width - total_door_width) / 2;
        
        // Left Jack Stud
        translate([start_x, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, door_opening_height]);
        // Right Jack Stud
        translate([start_x + door_width + 20, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, door_opening_height]);
        
        // Header Beam
        translate([start_x, 0, door_opening_height + lumber_thickness]) 
            cube([total_door_width, lumber_width, header_height]);
            
        // Intermediate studs (simplified)
        // Left of door
        translate([lumber_thickness, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, wall_height - 2*lumber_thickness]);
        // Right of door
        translate([shed_width - 2*lumber_thickness, 0, lumber_thickness]) cube([lumber_thickness, lumber_width, wall_height - 2*lumber_thickness]);
    }
    
    // Siding (with hole for doors)
    color(color_siding) {
        difference() {
            translate([0, lumber_width, lumber_thickness])
                cube([shed_width, siding_thickness, wall_height - 2*lumber_thickness]);
            
            // Cutout for doors
            translate([start_x - 10, -10, lumber_thickness])
                cube([total_door_width + 20, siding_thickness + 20, door_opening_height + 20]);
        }
        
        // Vertical lines on siding
        batten_width = 150;
        batten_thickness = 15;
        num_battens = floor(shed_width / batten_width);
        for (i = [0 : num_battens]) {
            bx = i * batten_width + 20;
            // Only draw if not in door area
            if (bx < start_x || bx > start_x + total_door_width) {
                 translate([bx, lumber_width + siding_thickness, lumber_thickness])
                    cube([batten_thickness, siding_thickness, wall_height - 2*lumber_thickness]);
            }
        }
    }
    
    // Doors
    translate([0, 0, lumber_thickness]) // Adjust for base
        door_assembly(start_x, door_opening_height);
}

// --- Door Module ---
module door_assembly(offset_x, opening_h) {
    // Two doors
    // Left Door
    translate([offset_x, -5, 0]) // Slightly outside the frame
        single_door(door_width, opening_h, left_hinge=true);
        
    // Right Door
    translate([offset_x + door_width + 20, -5, 0])
        single_door(door_width, opening_h, left_hinge=false);
}

module single_door(w, h, left_hinge) {
    color(color_door) {
        // Door panel
        // Thickness of door
        door_thick = 30;
        translate([0, 0, 0])
            cube([w, door_thick, h]);
            
        // Door frame/trim
        translate([-10, -5, -10]) cube([w + 20, door_thick + 10, 10]); // Top
        translate([-10, -5, h]) cube([w + 20, door_thick + 10, 10]); // Bottom (wait, h is height)
        // Let's just do a simple box for the door slab
        
        // Hinges
        color([0.2, 0.2, 0.2]) {
            hinge_y = left_hinge ? -5 : w + 5 - hinge_size[1]; // Position on edge
            // Actually, hinges are usually on the side.
            // If left_hinge is true, hinges are at x=0.
            // If false, hinges are at x=w.
            
            hinge_x_pos = left_hinge ? -hinge_size[0]/2 : w - hinge_size[0]/2;
            
            for (i = [0 : hinge_count-1]) {
                h_z = (h / hinge_count) * i + (h/hinge_count)/2 - hinge_size[2]/2;
                // Adjust hinge placement to be on the jamb side
                translate([hinge_x_pos, -10, h_z])
                    cube(hinge_size);
            }
        }
    }
}

// --- Roof Structure ---
module roof_structure() {
    color(color_wood) {
        // Calculate Angle
        half_width = shed_width / 2;
        roof_angle = atan(roof_rise / half_width);
        rafter_length = sqrt(pow(half_width, 2) + pow(roof_rise, 2));
        
        // Ridge Beam (runs along Y, centered)
        // It sits at the peak
        ridge_z = roof_rise;
        // Ridge beam length matches depth + overhang
        ridge_len = shed_depth + 2 * roof_overhang;
        translate([half_width, -roof_overhang, ridge_z - lumber_width/2]) // Center ridge on top of rafters roughly
             cube([lumber_width, ridge_len, lumber_width]); 
             // Note: Ridge board is usually vertical (wide side vertical)
        
        // Rafters
        // Spacing
        rafter_spacing = 600;
        num_rafter_pairs = floor(shed_depth / rafter_spacing);
        
        for (i = [0 : num_rafter_pairs]) {
            y_pos = i * rafter_spacing;
            // Add overhang offset
            y_actual = y_pos - roof_overhang + lumber_width; // Start inside
            
            if (y_actual <= shed_depth + roof_overhang) {
                // Left Rafter
                // Pivot at top plate outer edge: [0, y, wall_height]
                // Actually, pivot is usually at the top plate.
                // Let's place rafters relative to the center ridge.
                
                // Left side
                push = [0, y_actual, 0];
                rotate([0, -roof_angle, 0]) // Rotate around Y axis? No, slope is in XZ plane.
                // Wait, standard rotation: rotate([x, y, z]).
                // We want to slope up from left to right.
                // So rotate around Y axis.
                // But the rafter is a long box.
                
                // Let's use a simpler approach:
                // Left Rafter:
                // Start: [0, y_actual, 0] (relative to roof base)
                // End: [half_width, y_actual, ridge_z]
                
                // Vector approach for cube is hard, use hull or rotate.
                // Rotate a cube of length rafter_length.
                
                // Left Rafter
                translate([0, y_actual, 0]) {
                    rotate([0, -roof_angle, 0]) { // Negative angle to go up towards center?
                        // If we are at x=0, we want to go to x=half_width, z=ridge_z.
                        // So we rotate "up".
                        // A cube along X axis rotated by -angle around Y goes Up-Right.
                        translate([0, 0, 0]) // Pivot
                            cube([rafter_length + roof_overhang, lumber_thickness, lumber_width]); 
                            // Length needs to cover hypotenuse + overhang
                    }
                }
                
                // Right Rafter
                translate([shed_width, y_actual, 0]) {
                    rotate([0, roof_angle, 0]) { // Mirror image
                         // Cube extends in negative X? No, standard cube extends positive.
                         // So we need to rotate 180 around Z then slope?
                         // Or just mirror.
                         mirror([1, 0, 0])
                            translate([0, 0, 0])
                                rotate([0, -roof_angle, 0])
                                    cube([rafter_length + roof_overhang, lumber_thickness, lumber_width]);
                    }
                }
                
                // Collar ties / Ceiling Joists (simplified - just one in middle)
                if (i == floor(num_rafter_pairs/2)) {
                     // Horizontal beam connecting rafters
                     tie_z = ridge_z * 0.6;
                     tie_width = shed_width - 200; // Don't go all the way to edge
                     translate([(shed_width - tie_width)/2, y_actual, tie_z])
                         cube([tie_width, lumber_thickness, lumber_thickness]);
                }
            }
        }
        
        // Purlins (Horizontal bars along the slope, supporting the roof)
        // Run along Y axis (depth)
        // Placed on top of rafters
        num_purlins = 3;
        for (j = [1 : num_purlins]) {
            // Position along the slope
            // Ratio from 0 (eaves) to 1 (ridge)
            ratio = j / (num_purlins + 1);
            
            purlin_x = half_width * ratio; // Distance from edge towards center
            purlin_z = roof_rise * ratio;
            
            // We need to place a beam along Y at this X, Z, tilted at roof_angle
            // Left side purlin
            translate([purlin_x, -roof_overhang, purlin_z]) {
                rotate([0, -roof_angle, 0]) {
                    // The purlin runs along Y (depth).
                    // But we rotated around Y. So the local X is the slope direction.
                    // We want the purlin to be perpendicular to the slope? 
                    // Usually purlins run perpendicular to rafters (i.e., along Y).
                    // So we just need to position it.
                    
                    // Reset rotation for a moment to think.
                    // We are at a point on the slope.
                    // We want a beam running in Y.
                    // It should be flat on the rafters? Or vertical?
                    // Image shows flat bars running across.
                    
                    // Let's just place a long cube in Y, but tilted.
                    // To tilt a Y-axis cube, we rotate around X.
                }
            }
            
            // Correct Purlin Logic:
            // A purlin runs along the Y axis (depth of shed).
            // It sits on the rafters.
            // So it needs to be tilted by roof_angle around the X axis? No.
            // The roof slopes in X. The purlin runs in Y.
            // So the purlin is horizontal in Y, but tilted in XZ plane.
            // So we rotate around Y? No, that tilts the Y axis.
            // We rotate around X? No, that tilts Y into Z.
            // We want the purlin to lie on the plane defined by the roof.
            // The roof plane is tilted around Y.
            // So a line along Y is NOT tilted. A line along X is tilted.
            // Wait.
            // If I have a flat roof, purlins run Y.
            // If I tilt the roof (rotate around Y), the lines running Y stay horizontal?
            // No.
            // Imagine a book. Spine is Y. Pages are XZ.
            // If I open the book (rotate around Y), the top edge of the page (parallel to Y) stays horizontal?
            // No, the top edge is parallel to Y. If I rotate around Y, the Y axis doesn't change.
            // So a beam along Y stays horizontal?
            // Yes! If you rotate a coordinate system around Y, the Y axis is invariant.
            // So a beam along Y remains horizontal (parallel to ground) if rotated around Y?
            // No, that's wrong.
            // Rotation around Y affects X and Z. Y stays Y.
            // So a vector [0, 1, 0] (along Y) rotated around Y is still [0, 1, 0].
            // So a beam running along Y is always horizontal?
            // YES.
            // So purlins running along the depth (Y) are horizontal?
            // Look at the image.
            // The "purlins" (horizontal bars) connect the rafters.
            // They look horizontal in the image?
            // No, they look parallel to the ground?
            // Let's look at the image carefully.
            // The bars running "into" the page (along depth) seem to follow the slope?
            // No, usually purlins run perpendicular to rafters.
            // Rafters go Up-Slope (XZ plane).
            // Perpendicular to that in 3D...
            // If rafters are in XZ plane, perpendicular is Y axis.
            // So purlins run along Y.
            // If purlins run along Y, and the roof is a gable (slope in X),
            // then the purlins are horizontal (level).
            // BUT, looking at the image, the roof structure has bars running along the slope (parallel to rafters) 
            // AND bars running across (perpendicular).
            // The bars running across (perpendicular to rafters) are the ones connecting the left and right sides?
            // No, that would be collar ties.
            // The image shows:
            // 1. Rafters (sloped, X direction).
            // 2. Purlins (running along the roof slope? No, running along the ridge? i.e. Y direction).
            // Let's look at the "ladder" effect on the roof.
            // It looks like there are beams running parallel to the ridge (Y axis).
            // These are purlins.
            // Are they horizontal or sloped?
            // If they are on the roof surface, and the roof surface slopes in X...
            // Then a line on that surface running in Y is horizontal.
            // (Because the slope is only in X).
            // So the purlins are horizontal beams running along the depth of the shed.
            
            // HOWEVER, looking at the image, there are also "lookouts" or framing for the gable end.
            // And there are bars running *parallel* to the rafters? No, those are the rafters.
            // There are bars running *perpendicular* to the rafters (along Y).
            // These are the purlins.
            // They are horizontal.
            
            // Wait, let's re-examine the image.
            // The roof has a grid.
            // Long lines: Rafters (Sloped).
            // Cross lines: Purlins (Horizontal, running Y).
            // Yes, that makes sense structurally.
            
            // So, Purlins are horizontal beams at height Z, running along Y.
            // But they need to be supported by the rafters.
            // So their Z height depends on their X position.
            // Z = X * tan(angle).
            
            // So for a purlin at distance `dist` from the edge (along the slope projected to X):
            // X_pos = dist.
            // Z_pos = dist * tan(roof_angle).
            // The beam runs from Y = -overhang to Y = depth + overhang.
            
            // Let's place them.
            // We want ~3 purlins per side.
            // Spacing along the slope.
            
            // Left side purlins
            for (k = [1 : 3]) {
                dist_along_slope = (rafter_length + roof_overhang) * (k / 4); // 4 spaces
                // Project to X
                x_pos = dist_along_slope * cos(roof_angle);
                z_pos = dist_along_slope * sin(roof_angle);
                
                // Place beam
                // Beam dimensions: Length (Y), Width (along slope?), Thickness (vertical to slope?)
                // Let's just use a box.
                // Oriented along Y.
                // But it needs to sit on the rafter.
                // The rafter surface is tilted.
                // So the purlin should be tilted?
                // If the purlin is horizontal (level), it cuts through the rafter?
                // No, usually purlins are laid flat on the rafters (so they are tilted) 
                // OR they are horizontal and notched into rafters.
                // In the image, the lines look parallel to the horizon?
                // Actually, looking at the perspective, the lines running "deep" (Y) seem to converge to a vanishing point.
                // The lines running "across" (X) slope up.
                // The lines running "deep" look horizontal?
                // If they were tilted (parallel to roof surface), they would also converge to the same vanishing point as the top plate?
                // The top plate is horizontal (Y).
                // The ridge is horizontal (Y).
                // So any line parallel to Y is horizontal.
                // So the purlins are horizontal beams.
                
                translate([x_pos, -roof_overhang, z_pos])
                    cube([lumber_thickness, shed_depth + 2*roof_overhang, lumber_width]);
                    // Wait, if it's horizontal, it's a box along Y.
                    // Size: X=thickness, Y=length, Z=width(height).
            }
            
            // Right side purlins (Mirror)
            for (k = [1 : 3]) {
                dist_along_slope = (rafter_length + roof_overhang) * (k / 4);
                x_pos = shed_width - dist_along_slope * cos(roof_angle);
                z_pos = dist_along_slope * sin(roof_angle);
                
                translate([x_pos, -roof_overhang, z_pos])
                    cube([lumber_thickness, shed_depth + 2*roof_overhang, lumber_width]);
            }
        }
        
        // Gable End Framing (The triangular part of the wall)
        // We need vertical studs going up to the rafters.
        // "Ladder" framing.
        // Spacing similar to wall studs.
        gable_stud_spacing = 400;
        // We are at y=0 (back) and y=shed_depth (front).
        // Let's do the front gable (visible in image? No, image shows side/front corner.
        // The front has the doors. The gable is above the doors.
        // So we need framing above the front wall header.
        
        // Front Gable Framing
        // Above the front wall (which is at y=shed_depth in global, but we are inside roof_structure which is translated).
        // Actually, roof_structure is translated to [0, 0, wall_height].
        // So local Z=0 is the top of the walls.
        // The front wall is at local Y = shed_depth.
        // Wait, the roof covers the whole shed.
        // The gable end is the triangle of the wall that goes up to the roof.
        // Front wall: We built the wall up to `wall_height`.
        // The roof starts there.
        // So we need studs filling the triangle between the wall top and the rafters.
        
        // Let's add gable studs for the Front and Back.
        // Back Gable (y=0 in local roof coords? No, roof is centered? No, roof starts at 0,0).
        // Roof module is translated to [0, 0, wall_height].
        // So the shed footprint in this module is X:[0, width], Y:[0, depth].
        
        // Back Gable (at Y=0)
        // Actually, usually gable ends are the short walls (Width).
        // So Back is at Y=0? No, Back is usually one of the long walls or short walls.
        // In my setup:
        // X is Width (2400). Y is Depth (1800).
        // Front/Back are the walls along X?
        // My `wall_assembly` calls:
        // Back Wall: length = shed_width. So Back is along X. (at Y=0).
        // Front Wall: length = shed_width. So Front is along X. (at Y=shed_depth).
        // Side Walls: length = shed_depth. So Sides are along Y.
        
        // So the Gables are the Front and Back walls (the ones with width 2400).
        // Wait, usually gables are on the short ends for a long shed?
        // Or on the wide ends?
        // Image: The doors are on the long face? Or short face?
        // Image shows doors on a face. The roof ridge runs parallel to that face?
        // No, the roof ridge runs perpendicular to the gable end.
        // The gable end is the triangle.
        // In the image, the face with the doors has a triangular top part?
        // Yes, above the doors, there is a triangle.
        // So the doors are on the Gable End.
        // This means the Gable End is the face with Width 2400?
        // Or is the shed 2400 Deep and 1800 Wide?
        // Let's look at proportions.
        // The face with doors looks wider than the side face.
        // So the face with doors is the "Width" (2400).
        // So the Ridge runs parallel to the Side walls (Depth 1800).
        // This matches my setup:
        // Ridge runs along Y (Depth).
        // Front/Back walls are along X (Width).
        // So Front and Back are the Gable ends.
        
        // So I need to add framing for the triangular part of the Front and Back walls.
        
        // Front Gable Framing (Above the door header)
        // The front wall module `front_wall_assembly` built up to `wall_height`.
        // The roof starts at `wall_height`.
        // So we need studs from Z=0 (local roof) up to the rafters.
        // Located at Y = shed_depth (local roof coords? No, roof is translated to 0,0,wall_height).
        // So the front wall top plate is at local Y = shed_depth?
        // Wait, `roof_structure` is translated to [0, 0, wall_height + lumber_width].
        // So local Z=0 is top of plates.
        // The walls are below.
        // The Front wall is at Y = shed_depth (in global).
        // In local roof coords, Front wall is at Y = shed_depth.
        // Wait, the roof overhangs.
        // So the gable framing should be at Y = shed_depth (roughly).
        // Actually, the gable end framing is usually flush with the wall below.
        
        // Let's add "Ladder" framing for the gable ends.
        // We need this for Front (Y=shed_depth) and Back (Y=0).
        // But wait, the roof overhangs Y.
        // So the gable end is usually recessed or flush.
        // Let's assume flush with the wall below.
        // Wall below is at Y=0 (Back) and Y=shed_depth (Front).
        
        // Back Gable (Y=0)
        // We need vertical studs along X, going up to the roof slope.
        // Slope equation: Z = X * tan(angle) (for left side)
        // And Z = (Width - X) * tan(angle) (for right side)
        
        // Back Gable Studs
        for (gx = [0 : gable_stud_spacing : shed_width]) {
            // Determine height at this X
            // Distance from nearest edge
            dist_from_left = gx;
            dist_from_right = shed_width - gx;
            min_dist = min(dist_from_left, dist_from_right);
            
            // Height = min_dist * tan(angle)
            // But wait, the roof starts at Z=0 (local).
            // So height is relative to local Z=0.
            gable_h = min_dist * tan(roof_angle);
            
            // Only build if height > 0
            if (gable_h > 10) {
                // Stud
                translate([gx, 0, 0]) // At back wall Y=0
                    cube([lumber_thickness, lumber_width, gable_h]); 
                    // Wait, lumber_width is depth (Y).
                    // So this stud runs from Y=0 into the roof?
                    // No, gable studs are vertical plates.
                    // They should be flush with the wall.
                    // The wall is at Y=0 (Back) and Y=shed_depth (Front).
                    // The roof overhangs in Y.
                    // So the gable framing is at Y=0 (Back) and Y=shed_depth (Front).
                    // But the roof structure (rafters) runs along Y.
                    // So the gable studs support the ends of the rafters?
                    // No, the rafters sit on the top plate.
                    // The gable studs fill the triangle.
                    // They are usually "lookouts" or just vertical studs.
                    // Let's place them at Y=0 (Back) and Y=shed_depth (Front).
                    // But wait, if I place them at Y=0, they are behind the rafters?
                    // The rafters start at Y=0?
                    // My rafter loop: y_actual = y_pos - roof_overhang...
                    // The first rafter is at y_pos=0 -> y_actual = -overhang.
                    // So there is a rafter at the very back (overhang).
                    // And a rafter at the very front.
                    // So the gable end is covered by the first/last rafter?
                    // Usually, there is a "ladder" frame on the gable end to support the overhang.
                    
                    // Let's add a "Gable Ladder" at Y=0 and Y=shed_depth.
                    // This consists of vertical studs and horizontal blocks.
                    
                    // For simplicity, I will just add vertical studs at the gable ends.
                    translate([gx, 0, 0]) 
                        cube([lumber_thickness, lumber_thickness, gable_h]); // Thin stud
            }
        }
        
        // Front Gable Studs (at Y=shed_depth)
        for (gx = [0 : gable_stud_spacing : shed_width]) {
            dist_from_left = gx;
            dist_from_right = shed_width - gx;
            min_dist = min(dist_from_left, dist_from_right);
            gable_h = min_dist * tan(roof_angle);
            
            if (gable_h > 10) {
                 // Check if this is above the door opening
                 // Door opening is roughly center.
                 // start_x ... start_x + total_door_width
                 // We defined these in front_wall_assembly.
                 // Let's approximate: Doors are central.
                 // If gx is in the door zone, we might not need a stud, or it's part of the header.
                 // The header is at local Z=0 (top of wall).
                 // So any gable stud starts at Z=0.
                 // If it's above the door, it sits on the header.
                 // My `front_wall_assembly` put the header at `door_opening_height + lumber_thickness`.
                 // Wait, `wall_height` is 2000. `door_height` is 1900.
                 // So there is 100mm above the door.
                 // The gable starts at Z=0 (which is wall_height).
                 // So the gable studs sit on the top plate / header.
                 
                 translate([gx, shed_depth, 0])
                    cube([lumber_thickness, lumber_thickness, gable_h]);
            }
        }
    }
}