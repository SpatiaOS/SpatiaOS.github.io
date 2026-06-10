/* 
   Parametric Model: Stanley No. 71 Router Plane
   Description: A 3D representation of a classic woodworking router plane.
   Note: Dimensions are estimated based on visual proportions.
*/

// --- PARAMETERS ---

// Global Resolution
$fn = 60;
eps = 0.01; // Small epsilon for manifold boolean operations

// Base Plate Dimensions
base_width = 160;
base_depth = 75;
base_thickness = 6;
lip_height = 2.5;
lip_width = 2.5;
u_cutout_dia = 34;

// Handle Dimensions
handle_spacing = 130;
handle_base_dia = 32;
handle_max_dia = 34;
handle_height = 48;

// Center Mechanism
shaft_size = 8;
shaft_height = 55;
thread_dia = 5;
wheel_dia = 22;
wheel_thickness = 4;

// Colors
color_metal = [0.75, 0.75, 0.78];
color_handle = [0.65, 0.65, 0.65];
color_dark_metal = [0.4, 0.4, 0.45];

// --- 2D PROFILES ---

// Generates the complex 2D outline of the base plate
module base_2d_profile() {
    difference() {
        union() {
            // Left and right handle mounts
            translate([-handle_spacing/2, 0]) circle(d=handle_base_dia + 10);
            translate([handle_spacing/2, 0]) circle(d=handle_base_dia + 10);
            
            // Main central body
            polygon([
                [-handle_spacing/2, 22], [handle_spacing/2, 22],
                [handle_spacing/2, -10], [-handle_spacing/2, -10]
            ]);
            
            // Center rear bulge
            translate([0, 15]) circle(d=45);
        }
        
        // Front U-cutout
        translate([0, -20]) circle(d=u_cutout_dia);
        translate([-u_cutout_dia/2, -50]) square([u_cutout_dia, 30]);
        
        // Swept side cutouts to create the "batwing" shape
        translate([-handle_spacing/2 + 35, -35]) circle(d=45);
        translate([handle_spacing/2 - 35, -35]) circle(d=45);
        translate([-handle_spacing/2 + 35, 55]) circle(d=55);
        translate([handle_spacing/2 - 35, 55]) circle(d=55);
    }
}

// Generates the half-profile for the wooden handle
module handle_2d_profile() {
    intersection() {
        union() {
            // Flared base
            polygon([[0,0], [handle_base_dia/2, 0], [handle_base_dia/2 - 2, 4], [6, 12], [6, 18]]);
            // Main bulb
            translate([0, 30]) circle(d=handle_max_dia);
            // Neck transition
            polygon([[0, 12], [6, 12], [10, 20], [0, 20]]);
        }
        // Bounding box to flatten top and bottom
        square([handle_max_dia, handle_height - 2]);
    }
}

// --- 3D MODULES ---

// The main cast iron base
module base_plate() {
    color(color_metal) {
        difference() {
            union() {
                // Main solid floor
                linear_extrude(base_thickness - lip_height) {
                    base_2d_profile();
                }
                
                // Raised outer lip
                translate([0, 0, base_thickness - lip_height - eps])
                linear_extrude(lip_height + eps) {
                    difference() {
                        base_2d_profile();
                        offset(r=-lip_width) base_2d_profile();
                    }
                }
                
                // Arch around the U-cutout
                translate([0, -20, 0])
                difference() {
                    cylinder(h=base_thickness + 2, d=u_cutout_dia + 12);
                    translate([0, 0, -eps]) cylinder(h=base_thickness + 4, d=u_cutout_dia);
                    translate([-25, 0, -eps]) cube([50, 25, base_thickness + 4]);
                }
                
                // Handle mounting pads
                translate([-handle_spacing/2, 0, 0]) cylinder(h=base_thickness, d=handle_base_dia + 4);
                translate([handle_spacing/2, 0, 0]) cylinder(h=base_thickness, d=handle_base_dia + 4);
                
                // Center mechanism mounting pad
                translate([0, 12, 0]) cylinder(h=base_thickness, d=28);
            }
            
            // Recess for text (Right Side)
            translate([35, -5, base_thickness - lip_height - 1])
            rotate([0, 0, -10])
            linear_extrude(2) {
                difference() {
                    square([24, 10], center=true);
                    square([22, 8], center=true);
                }
            }
            
            // Recess for graphic (Left Side)
            translate([-35, -5, base_thickness - lip_height - 1])
            rotate([0, 0, 10])
            linear_extrude(2) {
                difference() {
                    square([12, 12], center=true);
                    square([10, 10], center=true);
                }
            }
        }
        
        // Text "No. 71"
        translate([35, -5, base_thickness - lip_height - 1])
        rotate([0, 0, -10])
        linear_extrude(1.5) {
            text("No. 71", size=4.5, font="Arial:style=Bold", halign="center", valign="center");
        }
        
        // Curved Text "STANLEY"
        translate([0, -20, base_thickness + 2 - eps]) {
            text_str = "STANLEY";
            radius = u_cutout_dia/2 + 3;
            angle_step = 16;
            for(i=[0:len(text_str)-1]) {
                rotate([0, 0, (len(text_str)/2 - i - 0.5) * angle_step])
                translate([0, radius, 0])
                linear_extrude(1)
                text(text_str[i], size=4, font="Arial:style=Bold", halign="center", valign="center");
            }
        }
    }
}

// The wooden knobs
module handle() {
    color(color_handle) {
        rotate_extrude() {
            handle_2d_profile();
        }
    }
    // Top mounting screw
    color(color_dark_metal) {
        translate([0, 0, handle_height - 2]) {
            difference() {
                sphere(d=12);
                translate([0, 0, -6]) cube([12, 12, 12], center=true); // cut bottom half
                translate([0, 0, 5]) cube([14, 1.5, 4], center=true); // screw slot
            }
        }
    }
}

// Thumb screw with flat, textured head
module thumb_screw(shaft_l=10, shaft_d=4, head_d=14, head_t=2.5) {
    color(color_metal) {
        // Threaded shaft
        cylinder(h=shaft_l, d=shaft_d);
        
        // Flat head
        translate([0, 0, shaft_l])
        rotate([90, 0, 0])
        difference() {
            cylinder(h=head_t, d=head_d, center=true);
            // Knurling simulation (notches)
            for(i=[0:15:345]) {
                rotate([0, 0, i]) translate([head_d/2, 0, 0]) cylinder(h=head_t+1, d=1.5, center=true, $fn=8);
            }
        }
    }
}

// Front auxiliary post
module front_post() {
    color(color_metal) {
        // Base flange
        cylinder(h=4, d=14);
        translate([0, 0, 4]) cylinder(h=4, d1=14, d2=8);
        // Main vertical post
        translate([0, 0, 8]) cylinder(h=25, d=8);
        // Rounded top
        translate([0, 0, 33]) sphere(d=8);
    }
    
    // Thumb screw
    translate([-10, 0, 12])
    rotate([0, 90, 0])
    thumb_screw(shaft_l=12, shaft_d=3, head_d=10, head_t=2);
}

// The central blade holding and adjustment mechanism
module center_mechanism() {
    // 1. Main Square Blade Shaft
    color(color_metal) {
        translate([0, -2, 10]) {
            difference() {
                // Square shaft with chamfered corners (using octagon)
                cylinder(h=shaft_height, d=shaft_size*1.2, $fn=8);
                // V-groove on the front
                translate([0, -shaft_size/2 - 1, 0])
                rotate([0, 0, 45])
                cube([2, 2, shaft_height*2.5], center=true);
            }
            // Shaft top cap
            translate([0, 0, shaft_height]) cylinder(h=3, d=shaft_size*1.2+2);
        }
    }
    
    // 2. Rear Threaded Adjustment Rod
    color(color_dark_metal) {
        translate([0, 8, 10]) cylinder(h=shaft_height + 5, d=thread_dia);
        // Top nut
        translate([0, 8, 10 + shaft_height + 5]) cylinder(h=3, d=thread_dia+3, $fn=6);
    }
    
    // 3. Adjustment Wheel (Knurled Nut)
    color(color_dark_metal) {
        translate([0, 8, 45]) {
            difference() {
                cylinder(h=wheel_thickness, d=wheel_dia);
                // Knurling
                for(i=[0:10:350]) {
                    rotate([0, 0, i]) translate([wheel_dia/2, 0, -1]) cylinder(h=wheel_thickness+2, d=1.5);
                }
                // Center hole
                translate([0, 0, -1]) cylinder(h=wheel_thickness+2, d=thread_dia);
            }
        }
    }
    
    // 4. Top Connecting Bracket
    color(color_metal) {
        translate([0, 3, 10 + shaft_height - 3])
        hull() {
            translate([0, -5, 0]) cylinder(h=4, d=12);
            translate([0, 5, 0]) cylinder(h=4, d=10);
        }
    }
    
    // 5. Main Clamp Collar
    color(color_metal) {
        translate([0, 0, 22]) {
            difference() {
                hull() {
                    translate([0, -2, 0]) cylinder(h=12, d=22); // Around shaft
                    translate([18, -2, 6]) sphere(d=10); // Thumb screw mount
                }
                // Cutout for shaft
                translate([0, -2, -1]) cylinder(h=14, d=shaft_size*1.3, $fn=8);
                // Cutout for threaded rod clearance
                translate([0, 8, -1]) cylinder(h=14, d=thread_dia+2);
            }
        }
    }
    
    // 6. Main Thumb Screw
    translate([16, -2, 28])
    rotate([0, 90, 20])
    thumb_screw(shaft_l=15, shaft_d=5, head_d=16, head_t=3);
}

// --- MAIN ASSEMBLY ---

module stanley_71_assembly() {
    // Base
    base_plate();
    
    // Left Handle
    translate([-handle_spacing/2, 0, base_thickness])
    handle();
    
    // Right Handle
    translate([handle_spacing/2, 0, base_thickness])
    handle();
    
    // Front Post (Left side of U-cutout)
    translate([-16, -6, base_thickness])
    front_post();
    
    // Center Mechanism
    translate([0, 10, base_thickness])
    center_mechanism();
}

// Render the complete model
stanley_71_assembly();