// Parameters
$fn = 60; // Resolution for curves
width = 60;       // Overall width/diameter of the Reuleaux triangle
length = 100;     // Length of the cylindrical part
wall_thickness = 3; // Thickness of the shell
dome_radius = width / 2; // Radius of the end dome

// Derived dimensions
reuleaux_radius = width; // Radius of the generating circles
centroid_dist = width / sqrt(3); // Distance from center to vertex

// Main Assembly
difference() {
    // Outer Solid Body
    union() {
        // Main lobed body
        reuleaux_prism(length, width);
        // Domed end
        translate([0, 0, length]) sphere(dome_radius);
        // Blend the transition using hull (optional, but makes it smoother like the image)
        // Actually, simple union might leave a sharp edge. 
        // The image shows a smooth transition. 
        // Let's use hull for the transition zone.
    }
    
    // We need to reconstruct the body to ensure the hull works correctly with the prism
    // Re-defining the outer shape for better blending
    // hull() of the prism and the sphere
    // Note: hull() can be slow, but for this geometry it's acceptable.
    // To optimize, we hull the top face of the prism and the sphere.
    
    // Let's stick to the union for now, but add a fillet or just rely on the visual.
    // Actually, looking at the image, the dome seems to start right at the end of the prism.
    // Let's create a specific module for the blended body.
}

// Refined Body Construction
difference() {
    union() {
        // Main prism
        reuleaux_prism(length, width);
        
        // Dome
        translate([0, 0, length]) sphere(dome_radius);
        
        // Transition blend (Hull between the top of prism and sphere)
        // This creates the smooth shoulder seen in the image
        // We hull the top face of the prism (at z=length) and the sphere
        // But hull() takes children.
        // Let's just hull the whole prism and the sphere? 
        // No, that would distort the bottom.
        // Let's hull the top slice of the prism and the sphere.
        translate([0,0,length]) {
             // We need to hull the top face of the prism with the sphere
             // This is tricky in pure OpenSCAD without intermediate variables.
             // Alternative: Just rely on the sphere overlapping the prism slightly.
        }
    }

    // Inner Void (to make it a shell)
    // We create a smaller Reuleaux prism and a smaller sphere
    translate([0, 0, -1]) { // Extend slightly to ensure full cut
        union() {
            // Inner prism
            // Scale doesn't work perfectly for offsetting Reuleaux, but close enough for thin walls
            // Better: Create a smaller Reuleaux prism explicitly
            reuleaux_prism(length + 2, width - 2 * wall_thickness);
            
            // Inner dome
            translate([0, 0, length]) sphere(dome_radius - wall_thickness);
        }
    }

    // Perforations (Holes)
    // We cut holes through the wall
    perforation_patterns();
}

// Module: Reuleaux Prism
// Created by intersecting 3 cylinders
module reuleaux_prism(h, w) {
    d = w / sqrt(3);
    intersection() {
        translate([0, d, 0]) cylinder(h=h, r=w, center=true);
        rotate([0, 0, 120]) translate([0, d, 0]) cylinder(h=h, r=w, center=true);
        rotate([0, 0, 240]) translate([0, d, 0]) cylinder(h=h, r=w, center=true);
    }
}

// Module: Perforation Patterns
module perforation_patterns() {
    // The object has 3 faces (lobes). We rotate the pattern 3 times.
    // The faces are centered at 30, 150, 270 degrees (opposite the vertices at 90, 210, 330)
    for (face_angle = [30, 150, 270]) {
        rotate([0, 0, face_angle]) {
            // We define the pattern for one face here.
            // The face is roughly in the -Y direction (relative to the rotation).
            // We place cutters at a radius slightly larger than the max radius to ensure they cut.
            R_cut = centroid_dist + 2; // Just outside the vertex
            
            // Zone 1: Vertical Slots (Bottom part of the image, Z=10 to 35)
            zone1_slots(R_cut, 10, 35);
            
            // Zone 2: Mixed Pattern (Middle part, Z=40 to 65)
            zone2_mixed(R_cut, 40, 65);
            
            // Zone 3: Vertical Slots (Top part, Z=70 to 90)
            zone1_slots(R_cut, 70, 90); // Reuse slot pattern
            
            // Zone 4: Near Dome (Z=92 to 98) - Small holes
            zone4_dome_transition(R_cut, 92, 98);
        }
    }
}

// Helper: Vertical Slots Pattern
module zone1_slots(R, z_start, z_end) {
    // Rows of slots along Z
    // Staggered columns
    for (z = [z_start : 4 : z_end]) {
        for (angle = [-20 : 5 : 20]) {
            // Determine if we place a slot here (checkerboard/staggered effect)
            // Simple grid for now
            if (abs(angle) < 18) { // Limit width of the face
                translate([0, 0, z]) {
                    rotate([0, 0, angle]) {
                        translate([R, 0, 0]) {
                            // Cutter for slot along Z
                            // Rotated to align with surface tangent? 
                            // Just a box aligned with Z is sufficient for small slots
                            // Rotate -90 Y to align cylinder with X (radial) -> No, we want slot along Z.
                            // So we place a cube.
                            // The cube needs to cut through the wall (Y direction in local frame)
                            // and have length (Z direction) and width (X/angle direction).
                            
                            // Local coords: X is radial, Y is tangent, Z is axial.
                            // We are at [R, 0, 0] in the rotated frame (which is X-axis).
                            // Wait, rotate([0,0,angle]) moves the point on the circle.
                            // So [R, 0, 0] is on the surface.
                            // We want a slot along Z.
                            // So a cube centered at [R, 0, 0] with size [width, depth, height].
                            // width (radial) = wall_thickness + 2
                            // depth (tangential) = slot_width
                            // height (axial) = slot_length
                            
                            cube([wall_thickness + 2, 3, 6], center=true);
                        }
                    }
                }
            }
        }
    }
}

// Helper: Mixed Pattern (Circles and Diagonals)
module zone2_mixed(R, z_start, z_end) {
    // Row of circles
    z_circles = (z_start + z_end) / 2;
    for (angle = [-15 : 4 : 15]) {
         translate([0, 0, z_circles]) {
            rotate([0, 0, angle]) {
                translate([R, 0, 0]) {
                    // Radial cutter for circle hole
                    // Rotate to point inwards (-X)
                    rotate([0, -90, 0]) {
                        cylinder(h=wall_thickness + 2, d=4, center=true);
                    }
                }
            }
        }
    }
    
    // Diagonal slots above and below
    for (z = [z_start : 3 : z_end]) {
        if (abs(z - z_circles) > 3) { // Skip the circle row
            for (angle = [-15 : 5 : 15]) {
                translate([0, 0, z]) {
                    rotate([0, 0, angle]) {
                        translate([R, 0, 0]) {
                            // Diagonal slot
                            // Rotate the cube 45 degrees around Z (local tangent?)
                            // Actually, just rotate around X (radial) to tilt it?
                            // The image shows slots diagonal to the axis.
                            // So rotate around the radial axis (X).
                            rotate([45, 0, 0]) { 
                                // Wait, rotate([45,0,0]) tilts it relative to Z.
                                // But we are in a frame where X is radial, Y is tangent, Z is axial.
                                // We want the slot to be in the Y-Z plane (surface).
                                // So a cube at [0,0,0] (local) aligned with Z.
                                // Then rotate around X to make it diagonal.
                                
                                // But the cube is at [R, 0, 0].
                                // So:
                                cube([wall_thickness + 2, 2, 5], center=true);
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Let's add specific diagonal rows
    // Row 1: Diagonals leaning right
    for (z = [z_start + 2 : 4 : z_circles - 4]) {
         for (angle = [-12 : 6 : 12]) {
            translate([0, 0, z]) {
                rotate([0, 0, angle]) {
                    translate([R, 0, 0]) {
                         rotate([0, 0, 30]) { // Rotate around radial? No, Z is axial.
                             // To make a diagonal slot on the surface:
                             // The surface is roughly X-Y plane (curved).
                             // We want a slot at 45 deg to Z.
                             // So rotate around X (radial axis).
                             rotate([45, 0, 0]) {
                                 cube([wall_thickness + 2, 1.5, 6], center=true);
                             }
                         }
                    }
                }
            }
         }
    }

    // Row 2: Diagonals leaning left
    for (z = [z_circles + 4 : 4 : z_end - 2]) {
         for (angle = [-12 : 6 : 12]) {
            translate([0, 0, z]) {
                rotate([0, 0, angle]) {
                    translate([R, 0, 0]) {
                         rotate([-45, 0, 0]) {
                             cube([wall_thickness + 2, 1.5, 6], center=true);
                         }
                    }
                }
            }
         }
    }
}

// Helper: Dome transition holes
module zone4_dome_transition(R, z_start, z_end) {
    for (z = [z_start : 3 : z_end]) {
        for (angle = [-10 : 5 : 10]) {
             translate([0, 0, z]) {
                rotate([0, 0, angle]) {
                    translate([R, 0, 0]) {
                        // Smaller radial holes
                        rotate([0, -90, 0]) {
                            cylinder(h=wall_thickness + 2, d=2.5, center=true);
                        }
                    }
                }
            }
        }
    }
}

// Note on the Body Construction:
// The difference() block at the top uses `union()` of prism and sphere.
// This might result in a sharp edge at the junction.
// To fix this and match the image's smooth shoulder, we should use hull() 
// but only for the transition.
// Since I can't easily hull just the top part without complex logic, 
// I will rely on the `difference` logic to clean it up or accept the sharp edge 
// if the sphere overlaps enough.
// Actually, looking at the code structure:
// difference() { union() { prism; sphere; }; inner(); holes(); }
// If the sphere is at z=length and radius=width/2, and the prism ends at z=length.
// The prism top face is a Reuleaux triangle.
// The sphere bottom is a circle.
// They don't match perfectly.
// The image shows the dome is the same width as the prism.
// A Reuleaux triangle has constant width `width`.
// A sphere of diameter `width` fits "inside" the constant width property.
// So the sphere should blend well.
// I will add a small overlap to ensure union works.