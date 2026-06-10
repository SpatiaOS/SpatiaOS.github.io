/*
  Leaping Quadruped (Rat/Mouse) Assembly
  
  This model reproduces the stylized, freeform B-spline geometry of the 
  described quadruped assembly. Because OpenSCAD does not natively support 
  NURBS/B-spline patches, the organic sculptural shape is approximated 
  using overlapping hulls of spheres and cylinders. 
  
  The model includes the main body, the head shell with eye indentations 
  and a cylindrical nose, splayed limbs for a leaping pose, and a sweeping 
  S-curved tail. A flat base cut is applied at the bottom to provide the 
  described seating planar faces.
*/

// ==========================================
// PARAMETERS
// ==========================================

// Global resolution for smooth curved surfaces
$fn = 60;

// Head parameters
head_offset_x = 35;
head_offset_z = 20;
nose_radius = 2.30;
nose_length = 2.06;

// Overall scale
body_scale = 1.0;

// ==========================================
// HELPER MODULES
// ==========================================

// Creates a smooth organic segment between two points
module bone(p1, p2, r1, r2) {
    hull() {
        translate(p1) sphere(r=r1);
        translate(p2) sphere(r=r2);
    }
}

// ==========================================
// COMPONENT MODULES
// ==========================================

module head() {
    difference() {
        union() {
            // Main head mass (tapered snout)
            hull() {
                // Back of head
                translate([head_offset_x, 0, head_offset_z]) scale([1.2, 1.2, 1.1]) sphere(r=16);
                // Snout base
                translate([head_offset_x + 40, 0, head_offset_z - 8]) sphere(r=7);
                // Lower jaw
                translate([head_offset_x + 30, 0, head_offset_z - 14]) sphere(r=8);
            }
            
            // Pointed Ears
            translate([head_offset_x + 5, 14, head_offset_z + 12]) 
                rotate([-20, 30, 20]) scale([1, 0.3, 1.5]) sphere(r=8);
            translate([head_offset_x + 5, -14, head_offset_z + 12]) 
                rotate([20, 30, -20]) scale([1, 0.3, 1.5]) sphere(r=8);
            
            // Small cylindrical nose detail at the tip
            translate([head_offset_x + 46, 0, head_offset_z - 8]) 
                rotate([0, 90, 0]) cylinder(h=nose_length, r=nose_radius, center=true);
        }
        
        // Subtle eye indentations
        translate([head_offset_x + 25, 12, head_offset_z - 2]) sphere(r=4);
        translate([head_offset_x + 25, -12, head_offset_z - 2]) sphere(r=4);
    }
}

module torso() {
    // Upper body / Chest
    hull() {
        translate([35, 0, 12]) sphere(r=22);
        translate([10, 0, 18]) scale([1, 0.9, 1]) sphere(r=25);
    }
    // Mid body
    hull() {
        translate([10, 0, 18]) scale([1, 0.9, 1]) sphere(r=25);
        translate([-15, 0, 12]) scale([1, 0.95, 1]) sphere(r=26);
    }
    // Belly droop
    hull() {
        translate([10, 0, 18]) scale([1, 0.9, 1]) sphere(r=25);
        translate([-5, 0, 0]) scale([1, 0.9, 1]) sphere(r=24);
        translate([-15, 0, 12]) scale([1, 0.95, 1]) sphere(r=26);
    }
    // Lower body / Pelvis
    hull() {
        translate([-15, 0, 12]) scale([1, 0.95, 1]) sphere(r=26);
        translate([-35, 0, 2]) scale([1.2, 1, 1]) sphere(r=24);
        translate([-25, 0, -5]) scale([1, 1, 1]) sphere(r=22);
    }
}

module front_leg(left=true) {
    side = left ? 1 : -1;
    shoulder = [25, 20*side, 5];
    elbow = [10, 28*side, -10];
    wrist = [25, 16*side, -25];
    paw = [35, 16*side, -30];
    
    // Upper arm
    hull() {
        translate(shoulder) scale([1, 0.8, 1]) sphere(r=10);
        translate(elbow) sphere(r=7);
    }
    // Lower arm
    hull() {
        translate(elbow) sphere(r=7);
        translate(wrist) sphere(r=5);
    }
    // Paw
    hull() {
        translate(wrist) sphere(r=5);
        translate(paw) scale([1, 1.5, 0.5]) sphere(r=4);
    }
    // Toes detail
    translate(paw) {
        for(i=[-1, 0, 1]) {
            rotate([0, 0, i*15]) translate([3, 0, 0]) scale([2, 0.5, 0.5]) sphere(r=2);
        }
    }
}

module hind_leg(left=true) {
    side = left ? 1 : -1;
    hip = [-25, 20*side, 2];
    knee = [-15, 30*side, -10];
    ankle = [-45, 18*side, -25];
    toes = [-35, 20*side, -40];
    
    // Thigh
    hull() {
        translate(hip) scale([1.2, 0.8, 1]) sphere(r=16);
        translate(knee) sphere(r=9);
    }
    // Calf
    hull() {
        translate(knee) sphere(r=9);
        translate(ankle) sphere(r=6);
    }
    // Foot
    hull() {
        translate(ankle) sphere(r=6);
        translate(toes) scale([1, 1.5, 0.5]) sphere(r=4);
    }
    // Toes detail
    translate(toes) {
        for(i=[-1, 0, 1]) {
            rotate([0, 0, i*15]) translate([3, 0, 0]) scale([2, 0.5, 0.5]) sphere(r=2.5);
        }
    }
}

module tail() {
    // S-curve tail (curving in both Z and Y for a dynamic pose)
    pts = [
        [-35, 0, 5],
        [-55, 15, -10],
        [-75, 35, -15],
        [-95, 45, -5],
        [-115, 30, 10],
        [-135, 10, 15],
        [-155, -10, 12]
    ];
    radii = [6, 5.5, 5, 4.5, 4, 3.5, 3];
    
    for(i=[0:5]) {
        bone(pts[i], pts[i+1], radii[i], radii[i+1]);
    }
    // Tail tip
    translate(pts[6]) sphere(r=radii[6]);
}

// ==========================================
// MAIN ASSEMBLY
// ==========================================

module rat_assembly() {
    difference() {
        // Union of all organic parts to form a single continuous mesh
        union() {
            torso();
            head();
            front_leg(left=true);
            front_leg(left=false);
            hind_leg(left=true);
            hind_leg(left=false);
            tail();
        }
        
        // Flat base cut at the bottom for stable seating (as described in the text).
        // This slices the bottom-most extent of the toes to create planar faces 
        // with a downward-pointing normal.
        translate([0, 0, -96]) cube([400, 400, 100], center=true);
    }
}

// Instantiate the full model. 
// A slight pitch rotation is applied to enhance the leaping posture.
rotate([0, -8, 0])
    scale([body_scale, body_scale, body_scale])
    rat_assembly();