// =============================================================================
// OpenSCAD Model: Stylized Leaping Quadruped Figurine
// Description: Reconstructs a sculptural animal figure (mouse/rat) based on 
//              provided dimensions and visual reference using procedural 
//              organic modeling techniques (hull-based metaballs).
// =============================================================================

// -----------------------------------------------------------------------------
// Global Parameters & Settings
// -----------------------------------------------------------------------------
$fn = 100; // High resolution for smooth B-spline-like surfaces

// Overall Scale Factors (based on provided bounding box ~260 x 129 x 115 mm)
scale_factor = 1.0; 

// Part Dimensions (approximated from text description)
head_dims = [40.3, 43.7, 57.6];      // sculptural_head_shell
body_dims = [110.9, 114.9, 117.5];   // figurine_body
nose_r = 2.30;
nose_h = 2.06;

// Pose Orientation (Diagonal axis roughly [-0.70, -0.70, 0.14])
main_rotation = [0, 25, -35]; // Tilted upward and turned

// -----------------------------------------------------------------------------
// Helper Modules
// -----------------------------------------------------------------------------

// Creates an organic "blob" by hulling spheres of varying sizes at given points
// points: list of [x,y,z] coordinates
// radii:  list of radii corresponding to points (or single value)
module organic_blob(points, radii=10) {
    union() {
        for (i = [0 : len(points)-1]) {
            r = (len(radii) > i) ? radii[i] : radii;
            translate(points[i]) sphere(r=r);
        }
    }
}

// Generates a tapered limb or tail segment
module limb_segment(p1, p2, r1, r2) {
    hull() {
        translate(p1) sphere(r=r1);
        translate(p2) sphere(r=r2);
    }
}

// -----------------------------------------------------------------------------
// Component Modules
// -----------------------------------------------------------------------------

// Head Shell (sculptural_head_shell)
// Includes pointed ears, tapered snout, eye recesses, and cylindrical nose
module head_shell(pos=[0,0,0], rot=[0,0,0]) {
    translate(pos) rotate(rot) {
        difference() {
            union() {
                // Main Skull (ellipsoidal)
                scale([1.0, 0.85, 0.9]) sphere(d=head_dims.x);
                
                // Snout (tapered extension)
                translate([head_dims.x*0.4, 0, -head_dims.z*0.15]) 
                    scale([1.4, 0.55, 0.55]) sphere(d=head_dims.x*0.65);
                
                // Ears (Pointed triangular forms using hull)
                // Left Ear
                translate([-head_dims.x*0.15, head_dims.y*0.35, head_dims.z*0.35])
                    rotate([10, -20, 0]) 
                        scale([0.4, 0.8, 1.2]) sphere(d=head_dims.x*0.4);
                // Right Ear
                translate([-head_dims.x*0.15, -head_dims.y*0.35, head_dims.z*0.35])
                    rotate([10, -20, 0]) 
                        scale([0.4, 0.8, 1.2]) sphere(d=head_dims.x*0.4);
            }
            
            // Eye Indentations (Subtractive)
            translate([head_dims.x*0.2, head_dims.y*0.25, head_dims.z*0.1])
                rotate([10, 0, 0]) 
                    scale([0.3, 0.5, 0.3]) sphere(d=head_dims.x*0.35);
            translate([head_dims.x*0.2, -head_dims.y*0.25, head_dims.z*0.1])
                rotate([10, 0, 0]) 
                    scale([0.3, 0.5, 0.3]) sphere(d=head_dims.x*0.35);
        }
        
        // Nose Detail (Cylindrical feature at snout tip)
        translate([head_dims.x*0.85, 0, -head_dims.z*0.18]) 
            rotate([0, 90, 0]) 
                cylinder(h=nose_h, r=nose_r);
    }
}

// Main Body / Torso (figurine_body & ornamental_figurine combined form)
// Organic mass representing the leaping torso
module body_torso(pos=[0,0,0]) {
    translate(pos) {
        // Chest / Shoulders (Front mass)
        scale([1.1, 1.05, 0.95]) sphere(d=body_dims.x * 0.95);
        
        // Abdomen / Midsection (Lower bulge)
        translate([0, 0, -body_dims.z*0.15]) 
            scale([1.0, 0.95, 0.85]) sphere(d=body_dims.x * 0.9);
        
        // Hindquarters (Rear mass, slightly higher for leap)
        translate([-body_dims.x*0.35, 0, body_dims.z*0.1]) 
            scale([1.0, 0.95, 0.95]) sphere(d=body_dims.x * 0.85);
    }
}

// Limbs (Front and Back pairs)
module limbs() {
    // Front Left Leg (Tucked/Forward)
    limb_chain([
        [body_dims.x*0.3, body_dims.y*0.35, -body_dims.z*0.2],  // Shoulder
        [body_dims.x*0.55, body_dims.y*0.3, -body_dims.z*0.5],   // Elbow
        [body_dims.x*0.65, body_dims.y*0.2, -body_dims.z*0.75]    // Paw
    ], [14, 11, 8]);
    
    // Front Right Leg (Tucked/Forward)
    limb_chain([
        [body_dims.x*0.3, -body_dims.y*0.35, -body_dims.z*0.2],
        [body_dims.x*0.55, -body_dims.y*0.3, -body_dims.z*0.5],
        [body_dims.x*0.65, -body_dims.y*0.2, -body_dims.z*0.75]
    ], [14, 11, 8]);

    // Back Left Leg (Extended backward for leap)
    limb_chain([
        [-body_dims.x*0.4, body_dims.y*0.3, body_dims.z*0.1],   // Hip
        [-body_dims.x*0.75, body_dims.y*0.2, -body_dims.z*0.1],  // Knee
        [-body_dims.x*0.95, body_dims.y*0.1, -body_dims.z*0.6]    // Foot
    ], [16, 13, 9]);
    
    // Back Right Leg (Extended backward for leap)
    limb_chain([
        [-body_dims.x*0.4, -body_dims.y*0.3, body_dims.z*0.1],
        [-body_dims.x*0.75, -body_dims.y*0.2, -body_dims.z*0.1],
        [-body_dims.x*0.95, -body_dims.y*0.1, -body_dims.z*0.6]
    ], [16, 13, 9]);
}

// Helper to draw a chain of segments for limbs
module limb_chain(pts, rads) {
    for (i=[0:len(pts)-2]) {
        limb_segment(pts[i], pts[i+1], rads[i], rads[i+1]);
    }
}

// Tail (Long curved appendage extending from hindquarters)
module tail() {
    // Define control points for a sweeping curve
    start_pt = [-body_dims.x*0.55, 0, body_dims.z*0.25];
    
    // Generate tail path points
    tail_pts = [
        start_pt,
        start_pt + [-25, 5, 20],
        start_pt + [-50, 15, 15],
        start_pt + [-80, 25, 0],
        start_pt + [-105, 30, -15],
        start_pt + [-120, 25, -30]
    ];
    
    // Radii tapering down
    tail_rads = [12, 9, 6, 4, 2.5, 1.5];
    
    // Draw tail segments
    for (i=[0:len(tail_pts)-2]) {
        limb_segment(tail_pts[i], tail_pts[i+1], tail_rads[i], tail_rads[i+1]);
    }
}

// -----------------------------------------------------------------------------
// Main Assembly
// -----------------------------------------------------------------------------
union() {
    rotate(main_rotation) {
        // Position components relative to each other
        
        // 1. Main Body (Center)
        color("lightgray") body_torso([0, 0, 0]);
        
        // 2. Head (Attached to front upper chest)
        color("lightgray") head_shell(
            pos = [body_dims.x*0.45, 0, body_dims.z*0.25], 
            rot = [-10, -15, 0]
        );
        
        // 3. Limbs
        color("lightgray") limbs();
        
        // 4. Tail
        color("lightgray") tail();
    }
}