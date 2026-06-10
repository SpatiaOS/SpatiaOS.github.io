// Stylized Leaping Quadruped Figurine
// Reconstructed from assembly description and rendered image

$fn = 60;

// ============ MAIN PARAMETERS ============
// Overall assembly dimensions (mm)
assembly_length = 260;
assembly_width = 115;
assembly_height = 115;

// Body section
body_length = 110;
body_width = 80;
body_height = 55;
body_taper = 0.7;  // rear taper factor

// Head section  
head_length = 45;
head_width = 40;
head_height = 40;
snout_length = 25;
snout_width = 25;
snout_height = 25;

// Ears
ear_height = 18;
ear_base_width = 10;
ear_tip_width = 3;
ear_thickness = 4;

// Nose detail
nose_radius = 2.3;
nose_length = 2.1;

// Tail
tail_length = 95;
tail_base_diameter = 14;
tail_tip_diameter = 5;
tail_segments = 12;

// Legs
leg_upper_length = 35;
leg_lower_length = 30;
leg_diameter = 12;
paw_length = 18;
paw_width = 14;
paw_height = 8;

// Neck connection
neck_length = 25;
neck_diameter = 22;

// ============ HELPER MODULES ============

// Smooth organic ellipsoid shape
module organic_ellipsoid(l, w, h) {
    scale([l/2, w/2, h/2]) sphere(r=1);
}

// Smooth transition between two sizes
module smooth_transition(h, d1, d2) {
    hull() {
        cylinder(h=0.1, d=d1, center=true);
        translate([0, 0, h]) cylinder(h=0.1, d=d2, center=true);
    }
}

// Cat ear shape (triangular with curve)
module cat_ear(h, base_w, tip_w, thickness) {
    hull() {
        // Base
        cube([base_w, thickness, 0.1], center=true);
        // Tip
        translate([0, 0, h]) cube([tip_w, thickness * 0.5, 0.1], center=true);
    }
}

// Organic leg with joint
module animal_leg(length_upper, length_lower, diameter, paw_l, paw_w, paw_h, angle) {
    // Upper leg
    rotate([angle, 0, 0]) {
        cylinder(h=length_upper, d1=diameter * 1.2, d2=diameter, center=false);
        
        // Lower leg
        translate([0, 0, length_upper]) {
            rotate([angle * 0.5, 0, 0]) {
                cylinder(h=length_lower, d1=diameter, d2=diameter * 0.7, center=false);
                
                // Paw
                translate([0, 0, length_lower - 2]) {
                    hull() {
                        cylinder(h=2, d=diameter * 0.7, center=false);
                        translate([0, paw_l * 0.3, 0]) 
                            cube([paw_w, paw_l, paw_h], center=true);
                    }
                }
            }
        }
    }
}

// ============ PART MODULES ============

// Head shell with ears and nose
module sculptural_head_shell() {
    union() {
        // Main head shape
        hull() {
            // Back of head
            organic_ellipsoid(head_length * 0.6, head_width, head_height * 0.9);
            // Snout/muzzle
            translate([head_length * 0.35, 0, -head_height * 0.1]) 
                organic_ellipsoid(snout_length, snout_width, snout_height * 0.8);
        }
        
        // Left ear
        translate([head_length * 0.1, head_width * 0.35, head_height * 0.35]) {
            rotate([10, -15, 0]) 
                cat_ear(ear_height, ear_base_width, ear_tip_width, ear_thickness);
        }
        
        // Right ear
        translate([head_length * 0.1, -head_width * 0.35, head_height * 0.35]) {
            rotate([-10, 15, 0]) 
                cat_ear(ear_height, ear_base_width, ear_tip_width, ear_thickness);
        }
        
        // Nose (cylindrical detail at snout tip)
        translate([head_length * 0.35 + snout_length * 0.4, 0, -head_height * 0.15]) {
            rotate([0, 90, 0]) 
                cylinder(h=nose_length, r=nose_radius, center=false);
        }
        
        // Eye indentations (subtle depressions)
        translate([head_length * 0.15, head_width * 0.28, head_height * 0.1]) {
            scale([1, 1, 0.3]) sphere(r=5);
        }
        translate([head_length * 0.15, -head_width * 0.28, head_height * 0.1]) {
            scale([1, 1, 0.3]) sphere(r=5);
        }
        
        // Jaw line detail
        translate([head_length * 0.2, 0, -head_height * 0.3]) {
            scale([1.2, 0.8, 0.4]) sphere(r=12);
        }
    }
}

// Main body (torso)
module figurine_body() {
    union() {
        // Main torso - organic shape
        hull() {
            // Chest area (front)
            translate([body_length * 0.3, 0, 0]) 
                organic_ellipsoid(body_length * 0.4, body_width, body_height);
            
            // Mid body
            translate([0, 0, -body_height * 0.05]) 
                organic_ellipsoid(body_length * 0.5, body_width * 0.95, body_height * 0.95);
            
            // Rear body (tapered)
            translate([-body_length * 0.35, 0, -body_height * 0.1]) 
                organic_ellipsoid(body_length * 0.35, body_width * body_taper, body_height * 0.85);
        }
        
        // Shoulder mass
        translate([body_length * 0.35, 0, body_height * 0.15]) 
            scale([1.3, 1.1, 0.8]) sphere(r=body_width * 0.35);
        
        // Hip mass
        translate([-body_length * 0.3, 0, body_height * 0.05]) 
            scale([1.2, 1.0, 0.7]) sphere(r=body_width * 0.32);
    }
}

// Ornamental figurine (rear section with tail base)
module ornamental_figurine() {
    union() {
        // Rear haunches
        hull() {
            translate([-body_length * 0.2, 0, -body_height * 0.15]) 
                organic_ellipsoid(body_length * 0.5, body_width * 0.85, body_height * 0.75);
            
            // Tail base connection
            translate([-body_length * 0.45, 0, 0]) 
                scale([1.5, 0.6, 0.5]) sphere(r=tail_base_diameter);
        }
        
        // Tail
        tail_path();
    }
}

// Curved tail module
module tail_path() {
    // Create curved tail using hull of spheres along a path
    for (i = [0 : tail_segments - 1]) {
        t = i / tail_segments;
        angle = t * 120;  // tail curves upward and back
        radius = tail_base_diameter * (1 - t * 0.7) / 2;
        
        x = -body_length * 0.45 - t * tail_length * 0.8;
        y = sin(angle * 0.8) * tail_length * 0.15;
        z = t * tail_length * 0.4 + sin(t * 180) * 15;
        
        translate([x, y, z]) 
            scale([1.2, 1, 1]) sphere(r=radius);
    }
    
    // Tail tip
    translate([-body_length * 0.45 - tail_length * 0.8, 
               sin(120 * 0.8) * tail_length * 0.15, 
               tail_length * 0.4]) {
        scale([1.5, 1, 0.8]) sphere(r=tail_tip_diameter / 2);
    }
}

// Front legs (leaping pose - extended forward)
module front_legs() {
    // Left front leg
    translate([body_length * 0.3, body_width * 0.35, -body_height * 0.3]) {
        rotate([25, 0, 10]) {
            animal_leg(leg_upper_length, leg_lower_length, leg_diameter, 
                      paw_length, paw_width, paw_height, 30);
        }
    }
    
    // Right front leg
    translate([body_length * 0.3, -body_width * 0.35, -body_height * 0.3]) {
        rotate([25, 0, -10]) {
            animal_leg(leg_upper_length, leg_lower_length, leg_diameter, 
                      paw_length, paw_width, paw_height, 30);
        }
    }
}

// Rear legs (leaping pose - pushing off)
module rear_legs() {
    // Left rear leg
    translate([-body_length * 0.25, body_width * 0.3, -body_height * 0.35]) {
        rotate([-40, 0, 5]) {
            animal_leg(leg_upper_length * 1.1, leg_lower_length * 1.1, leg_diameter * 1.15, 
                      paw_length * 1.1, paw_width * 1.1, paw_height, -20);
        }
    }
    
    // Right rear leg
    translate([-body_length * 0.25, -body_width * 0.3, -body_height * 0.35]) {
        rotate([-40, 0, -5]) {
            animal_leg(leg_upper_length * 1.1, leg_lower_length * 1.1, leg_diameter * 1.15, 
                      paw_length * 1.1, paw_width * 1.1, paw_height, -20);
        }
    }
}

// Neck connector
module neck() {
    hull() {
        // Body end
        translate([body_length * 0.45, 0, body_height * 0.1]) 
            cylinder(h=5, d=body_width * 0.5, center=true);
        
        // Head start
        translate([body_length * 0.45 + neck_length, 0, body_height * 0.15]) 
            cylinder(h=5, d=head_width * 0.6, center=true);
    }
}

// ============ ASSEMBLY ============
module leaping_quadruped_assembly() {
    // Leaping pose orientation - diagonal axis
    rotate([0, -8, 0]) {
        
        // Main body (figurine_body)
        figurine_body();
        
        // Ornamental figurine (rear section with tail)
        ornamental_figurine();
        
        // Neck
        neck();
        
        // Head shell
        translate([body_length * 0.45 + neck_length + head_length * 0.3, 
                   0, 
                   body_height * 0.15 + head_height * 0.1]) {
            rotate([5, 0, 0]) 
                sculptural_head_shell();
        }
        
        // Front legs
        front_legs();
        
        // Rear legs
        rear_legs();
    }
}

// Render the complete assembly
leaping_quadruped_assembly();