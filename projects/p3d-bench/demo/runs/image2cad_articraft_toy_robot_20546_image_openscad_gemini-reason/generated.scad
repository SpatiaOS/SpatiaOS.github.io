// ==========================================
// Parametric Bionicle-Style Figure
// ==========================================

// --- Resolution ---
$fn = 30; // Optimized resolution to prevent export timeouts

// --- Dimensions ---
torso_width = 30;
torso_depth = 20;
torso_height = 35;
limb_length = 35;
weapon_length = 45;
ball_size = 8;
socket_size = 11;

// --- Colors ---
c_dark = [0.25, 0.25, 0.25];
c_med = [0.5, 0.5, 0.5];
c_light = [0.75, 0.75, 0.75];
c_accent = [0.8, 1.0, 0.2, 0.8]; // Translucent for eyes

// ==========================================
// Modules for Components
// ==========================================

// Main body block with joint connections
module bionicle_torso() {
    color(c_med) {
        difference() {
            union() {
                // Core body mass
                cube([torso_width-8, torso_depth-4, torso_height], center=true);
                // Shoulder mounting blocks
                translate([0, 5, torso_height/2 - 5]) cube([torso_width+6, 12, 10], center=true);
                // Hip mounting blocks
                translate([0, 0, -torso_height/2 + 5]) cube([torso_width, 12, 10], center=true);
                
                // Angled chest plate
                translate([0, torso_depth/2 + 2, 2]) rotate([15, 0, 0]) {
                    hull() {
                        translate([0, 0, 8]) cube([16, 4, 10], center=true);
                        translate([0, 0, -8]) cube([12, 4, 10], center=true);
                    }
                }
                
                // Back gear housing
                translate([0, -torso_depth/2 + 2, 0]) cube([12, 8, 20], center=true);
            }
            
            // Mechanical through-holes
            for(z=[-10, 0, 10]) {
                translate([0, 0, z]) rotate([90, 0, 0]) cylinder(h=torso_depth+15, d=5, center=true);
            }
            for(x=[-8, 8]) {
                translate([x, 0, 0]) rotate([90, 0, 0]) cylinder(h=torso_depth+15, d=5, center=true);
            }
            
            // Side weight-reduction cutouts
            translate([torso_width/2, 0, 0]) cube([10, torso_depth+5, torso_height-15], center=true);
            translate([-torso_width/2, 0, 0]) cube([10, torso_depth+5, torso_height-15], center=true);
        }
        
        // --- Ball Joints ---
        // Neck
        translate([0, 5, torso_height/2 + 2]) sphere(d=ball_size);
        // Shoulders
        translate([torso_width/2 + 3, 5, torso_height/2 - 5]) sphere(d=ball_size);
        translate([-torso_width/2 - 3, 5, torso_height/2 - 5]) sphere(d=ball_size);
        // Hips
        translate([torso_width/2 - 2, 0, -torso_height/2 + 2]) sphere(d=ball_size);
        translate([-torso_width/2 + 2, 0, -torso_height/2 + 2]) sphere(d=ball_size);
        // Backpack mount
        translate([0, -torso_depth/2, 5]) sphere(d=ball_size);
        
        // Decorative gear on the back
        translate([0, -torso_depth/2 - 2, 0]) rotate([90, 0, 0]) {
            cylinder(h=4, d=16, center=true);
            for(i=[0:45:315]) {
                rotate([0, 0, i]) translate([8, 0, 0]) cube([3, 3, 4], center=true);
            }
        }
    }
}

// Head with snout and eye stalk
module bionicle_head() {
    color(c_light) {
        translate([0, 2, 4]) { // Shift to place socket at origin
            difference() {
                union() {
                    // Cranium
                    translate([0, 0, 0]) sphere(d=14);
                    // Jaw/Snout
                    hull() {
                        translate([0, 3, 1]) cube([12, 12, 10], center=true);
                        translate([0, 14, -2]) cube([8, 4, 6], center=true);
                    }
                    // Top ridge detail
                    translate([0, 0, 6]) rotate([-20, 0, 0]) cube([4, 14, 6], center=true);
                }
                // Neck socket
                translate([0, -2, -4]) sphere(d=socket_size);
                // Eye sockets
                translate([5, 8, 3]) sphere(d=5);
                translate([-5, 8, 3]) sphere(d=5);
                // Mouth slot
                translate([0, 14, -3]) cube([10, 6, 2], center=true);
                // Side brain cutouts
                translate([8, 0, 2]) sphere(d=6);
                translate([-8, 0, 2]) sphere(d=6);
            }
            // Translucent eye stalk
            color(c_accent) {
                hull() {
                    translate([0, -2, 4]) sphere(d=6);
                    translate([4, 7, 3]) sphere(d=3.5);
                    translate([-4, 7, 3]) sphere(d=3.5);
                }
            }
        }
    }
}

// Curved shield/backpack piece
module bionicle_backpack() {
    color(c_dark) {
        translate([0, -15, 0]) { // Shift to place socket at origin
            difference() {
                // Main curved dome
                intersection() {
                    scale([1, 0.8, 1.4]) sphere(d=45);
                    translate([0, -20, 0]) cube([50, 40, 70], center=true);
                }
                // Hollow inside
                scale([1, 0.8, 1.4]) sphere(d=41);
                // Trim bottom flat
                translate([0, 0, -35]) cube([60, 60, 20], center=true);
                
                // Decorative cooling slots
                for(i=[-1, 1]) {
                    translate([i*10, -15, 10]) rotate([45, 0, 0]) cube([4, 20, 30], center=true);
                    translate([i*15, -10, 0]) rotate([45, 0, 0]) cube([4, 20, 20], center=true);
                }
                // Center slot
                translate([0, -20, 15]) rotate([60, 0, 0]) cube([4, 20, 20], center=true);
            }
            // Attachment stalk
            translate([0, 15, 0]) rotate([90, 0, 0]) cylinder(h=15, d=6);
        }
        // Socket at origin (using 10.1 to prevent coincident faces)
        difference() {
            sphere(d=socket_size);
            translate([0, 5.05, 0]) cube([socket_size+2, 10.1, socket_size+2], center=true);
        }
    }
}

// Twin-pronged claw weapon
module bionicle_weapon() {
    color(c_light) {
        // Shoulder socket
        difference() {
            sphere(d=socket_size);
            translate([-5.05, 0, 0]) cube([10.1, socket_size+2, socket_size+2], center=true);
        }
        
        // Arm beam (oriented forward along Y axis)
        rotate([-90, 0, 0]) {
            translate([0, 0, 4]) cylinder(h=15, d=6);
            
            // Splitter block
            translate([0, 0, 22]) {
                cube([14, 10, 12], center=true);
                
                // Left prong
                translate([5, 0, 5]) {
                    cylinder(h=weapon_length, d=4);
                    // Ribbed texture
                    for(i=[0:12]) translate([0, 0, 2 + i*2.5]) cylinder(h=1.5, d=5.5);
                    // Blade tip (overlapped slightly to ensure manifold geometry)
                    translate([0, 0, weapon_length - 0.1]) hull() {
                        cylinder(h=0.2, d=4);
                        translate([0, 0, 12]) cylinder(h=0.1, d=1);
                    }
                }
                
                // Right prong
                translate([-5, 0, 5]) {
                    cylinder(h=weapon_length, d=4);
                    // Ribbed texture
                    for(i=[0:12]) translate([0, 0, 2 + i*2.5]) cylinder(h=1.5, d=5.5);
                    // Blade tip
                    translate([0, 0, weapon_length - 0.1]) hull() {
                        cylinder(h=0.2, d=4);
                        translate([0, 0, 12]) cylinder(h=0.1, d=1);
                    }
                }
                
                // Structural crossbar
                translate([0, 0, 15]) cube([10, 4, 4], center=true);
                
                // Center pin detail
                translate([0, 0, 5]) cylinder(h=15, d=3);
            }
        }
    }
}

// Limb with a socket on both ends
module bionicle_limb_double_socket(length=35, holes=3) {
    width = 10;
    thickness = 8;
    color(c_dark) {
        difference() {
            union() {
                // Main strut
                hull() {
                    cylinder(h=thickness, d=width, center=true);
                    translate([0, 0, -length]) cylinder(h=thickness, d=width, center=true);
                }
                // Structural rib
                translate([0, 0, -length/2]) cube([width+4, thickness-3, length-6], center=true);
            }
            // Pin holes
            for (i=[1:holes]) {
                translate([0, 0, -i * (length/(holes+1))]) 
                    rotate([90, 0, 0]) cylinder(h=thickness+5, d=4.8, center=true);
            }
            // Triangular truss cutouts (using $fn=3 for fast rendering)
            for (i=[1:holes-1]) {
                z_pos = -i * (length/(holes+1)) - (length/(holes+1))/2;
                translate([0, 0, z_pos]) rotate([90, 0, 0]) cylinder(h=thickness+5, d=4, $fn=3, center=true);
            }
        }
        // Top Socket
        difference() {
            sphere(d=socket_size);
            translate([0, 5.05, 0]) cube([socket_size+2, 10.1, socket_size+2], center=true);
        }
        // Bottom Socket
        translate([0, 0, -length]) difference() {
            sphere(d=socket_size);
            translate([0, -5.05, 0]) cube([socket_size+2, 10.1, socket_size+2], center=true);
        }
    }
}

// Wide stable foot piece
module bionicle_foot() {
    color(c_med) {
        translate([0, 5, -16]) { // Shift to place ball joint at origin
            difference() {
                union() {
                    // Main foot body
                    hull() {
                        // Heel
                        translate([0, -8, 4]) cylinder(h=8, d=16, center=true);
                        // Toes
                        translate([12, 18, 3]) cylinder(h=6, d=10, center=true);
                        translate([-12, 18, 3]) cylinder(h=6, d=10, center=true);
                        translate([0, 20, 3]) cylinder(h=6, d=8, center=true);
                    }
                    // Ankle support block
                    translate([0, -5, 10]) cylinder(h=10, d=12, center=true);
                    translate([0, -5, 10]) cube([16, 8, 10], center=true);
                    
                    // Piston details on top
                    translate([5, 5, 7]) rotate([-20, 0, 0]) cylinder(h=10, d=3, center=true);
                    translate([-5, 5, 7]) rotate([-20, 0, 0]) cylinder(h=10, d=3, center=true);
                }
                // Front cutouts between toes
                translate([6, 22, 0]) cylinder(h=20, d=8, center=true);
                translate([-6, 22, 0]) cylinder(h=20, d=8, center=true);
                
                // Axle hole in heel
                translate([0, -8, 0]) cylinder(h=20, d=5.2, center=true);
                // Top pin hole
                translate([0, 5, 5]) cylinder(h=20, d=5.2, center=true);
            }
        }
        // Ankle ball joint
        sphere(d=ball_size);
    }
}

// ==========================================
// Main Assembly
// ==========================================

module assembly() {
    // Elevate torso to allow feet to rest on Z=0 plane
    torso_z = 64; 
    
    translate([0, 0, torso_z]) {
        // 1. Central Torso
        bionicle_torso();
        
        // 2. Head Assembly
        translate([0, 5, torso_height/2 + 2]) 
            rotate([-20, 0, 0]) 
            bionicle_head();
        
        // 3. Backpack / Shield
        translate([0, -torso_depth/2, 5]) 
            rotate([-15, 0, 0]) 
            bionicle_backpack();
        
        // 4. Left Arm (Weapon)
        translate([torso_width/2 + 3, 5, torso_height/2 - 5]) 
            rotate([10, 0, -15]) 
            bionicle_weapon();
        
        // 5. Right Arm (Weapon)
        translate([-torso_width/2 - 3, 5, torso_height/2 - 5]) 
            rotate([10, 0, 15]) 
            mirror([1, 0, 0]) 
            bionicle_weapon();
        
        // 6. Left Leg & Foot
        translate([torso_width/2 - 2, 0, -torso_height/2 + 2]) 
            rotate([15, 10, 0]) {
                bionicle_limb_double_socket(length=limb_length, holes=3);
                // Counter-rotate foot to keep it flat on the ground
                translate([0, 0, -limb_length]) 
                    rotate([-15, -10, 0]) 
                    bionicle_foot();
            }
        
        // 7. Right Leg & Foot
        translate([-torso_width/2 + 2, 0, -torso_height/2 + 2]) 
            rotate([15, -10, 0]) {
                bionicle_limb_double_socket(length=limb_length, holes=3);
                // Counter-rotate foot to keep it flat on the ground
                translate([0, 0, -limb_length]) 
                    rotate([-15, 10, 0]) 
                    bionicle_foot();
            }
    }
}

// Render the complete model
assembly();