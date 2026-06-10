// Premier League Trophy Assembly
// Reconstructed from Fusion360 assembly data
// Overall envelope: ~60 × 178 × 120 mm

$fn = 80;

// ============ PARAMETERS ============
// Pedestal body (part 8d02bd4c)
pedestal_base_dia = 60;
pedestal_top_dia = 42;
pedestal_height = 130;
pedestal_neck_dia = 28;
pedestal_shoulder_dia = 52;

// Serrated crown ring (part 8d0a8592)
crown_outer_dia = 48;
crown_inner_dia = 36.88;
crown_height = 18;
crown_teeth = 10;
crown_tooth_depth = 7;

// Bearing balls (part 8d0afae4, ×10)
ball_radius = 3;

// Parallel key (part 8d0cf680)
key_width = 7.5;
key_height = 7.5;
key_length = 120;
key_end_radius = 5;

// Secondary key (part 8d0ea43e)
key2_length = 101;

// Curved arms (part 8d0d44b0, ×2)
arm_length = 120;
arm_width = 7.5;
arm_thickness = 12;

// Clips (part 8d0ef264, ×2)
clip_thickness = 2;

// Decorative strips (parts 8d11b16e, 8d135f1c, 8d1497a4, 8d15d01c)
strip_length = 128;
strip_thickness = 1;
strip_width = 8;

// ============ HELPER MODULES ============

// Smooth interpolation between values
function interpolate(t, a, b) = a + (b - a) * t;

// Generate smooth profile curve points
function pedestal_profile() = [
    [0, 0],
    [30, 0],
    [30, 5],
    [28, 10],
    [25, 18],
    [20, 30],
    [17, 50],
    [17, 70],
    [22, 85],
    [26, 95],
    [26, 100],
    [14, 105],
    [14, 115],
    [21, 120],
    [21, 128],
    [0, 128]
];

// ============ PART MODULES ============

// Pedestal body - axisymmetric revolved form
module pedestal_body() {
    points = pedestal_profile();
    rotate_extrude() {
        polygon(points);
    }
    
    // Embossed text placeholder (simplified)
    translate([0, 18, 65]) {
        rotate([90, 0, 0])
        linear_extrude(height = 1)
        text("Premier", size = 6, halign = "center", font = "Arial");
        translate([0, -1, 0])
        rotate([90, 0, 0])
        linear_extrude(height = 1)
        text("League", size = 6, halign = "center", font = "Arial");
    }
}

// Serrated crown ring with zigzag tooth profile
module serrated_crown() {
    outer_r = crown_outer_dia / 2;
    inner_r = crown_inner_dia / 2;
    
    difference() {
        union() {
            // Base ring
            difference() {
                cylinder(h = crown_height * 0.4, r = outer_r);
                translate([0, 0, -1])
                cylinder(h = crown_height * 0.4 + 2, r = inner_r);
            }
            
            // Crown teeth
            for (i = [0:crown_teeth-1]) {
                rotate([0, 0, i * 360 / crown_teeth])
                translate([0, -3, crown_height * 0.3])
                linear_extrude(height = crown_height * 0.7, scale = [1, 0.3])
                square([outer_r * sin(180/crown_teeth) * 1.8, 6], center = true);
            }
        }
        
        // Inner bore segments (simplified as continuous)
        translate([0, 0, -1])
        cylinder(h = crown_height + 2, r = inner_r);
    }
}

// Single bearing sphere
module bearing_ball() {
    sphere(r = ball_radius);
}

// Parallel key with bullnose ends
module parallel_key(length = key_length) {
    hull() {
        translate([0, -length/2 + key_end_radius, 0])
        cylinder(h = key_height, r = key_end_radius, center = true);
        translate([0, length/2 - key_end_radius, 0])
        cylinder(h = key_height, r = key_end_radius, center = true);
    }
}

// S-curved arm handle
module curved_arm() {
    // Create S-curve using hull of positioned cross-sections
    hull() {
        // Top attachment point
        translate([0, arm_length * 0.45, arm_thickness * 0.3])
        cube([arm_width, 15, arm_thickness * 0.6], center = true);
        
        // Middle curve point
        translate([8, 0, 0])
        cube([arm_width, 12, arm_thickness], center = true);
        
        // Bottom curve point  
        translate([3, -arm_length * 0.35, -arm_thickness * 0.2])
        cube([arm_width, 12, arm_thickness * 0.8], center = true);
        
        // Lower tip with rounded end
        translate([0, -arm_length * 0.45, -arm_thickness * 0.3])
        rotate([90, 0, 0])
        cylinder(h = 10, r = arm_width/2, center = true);
    }
}

// C-shaped retaining clip
module clip() {
    clip_w = 24;
    clip_h = 27;
    
    difference() {
        // Main body
        cube([clip_w, clip_h, clip_thickness], center = true);
        
        // C-hook cutout
        translate([0, 3, 0])
        cube([clip_w - 6, clip_h - 8, clip_thickness + 1], center = true);
    }
    
    // Hook tabs
    translate([clip_w/2 - 3, clip_h/2 - 4, 0])
    cube([4, 3, clip_thickness], center = true);
    translate([-(clip_w/2 - 3), clip_h/2 - 4, 0])
    cube([4, 3, clip_thickness], center = true);
}

// Decorative curved strip
module curved_strip(variant = 0) {
    // S-curve using hull
    hull() {
        // Wide top end
        translate([0, strip_length/2, 0])
        scale([1.3, 1, 1])
        cylinder(h = strip_thickness, r = strip_width/2, center = true);
        
        // Middle inflection
        translate([4 * (variant % 2 == 0 ? 1 : -1), 0, 0])
        cube([strip_width, 8, strip_thickness], center = true);
        
        // Tapered bottom tip
        translate([0, -strip_length/2, 0])
        scale([0.6, 1, 1])
        cylinder(h = strip_thickness, r = strip_width/2, center = true);
    }
}

// ============ MAIN ASSEMBLY ============
module trophy_assembly() {
    // Pedestal body (grounded, center)
    color("Silver", 0.9)
    pedestal_body();
    
    // Serrated crown ring atop pedestal
    color("Gold", 0.95)
    translate([0, 0, pedestal_height - 5])
    serrated_crown();
    
    // 10 bearing balls on crown tips
    color("Silver")
    for (i = [0:crown_teeth-1]) {
        rotate([0, 0, i * 360/crown_teeth])
        translate([crown_outer_dia/2 - 2, 0, pedestal_height + crown_height * 0.8])
        bearing_ball();
    }
    
    // Two curved arm handles (mirrored pair)
    color("Silver", 0.95) {
        // Left arm
        translate([-32, 0, 55])
        rotate([0, 0, 5])
        curved_arm();
        
        // Right arm (mirrored)
        translate([32, 0, 55])
        rotate([0, 0, -5])
        mirror([1, 0, 0])
        curved_arm();
    }
    
    // Two C-shaped clips (engaging arms)
    color("DarkSlateGray", 0.9) {
        translate([-28, 12, 85])
        rotate([0, 0, -8])
        clip();
        
        translate([28, 12, 85])
        rotate([0, 0, 8])
        clip();
    }
    
    // Parallel key (bridging handles to body)
    color("Gray", 0.85)
    translate([0, 38, 45])
    rotate([90, 0, 0])
    parallel_key(key_length);
    
    // Secondary key with curved face
    color("Gray", 0.85)
    translate([0, -38, 45])
    rotate([90, 0, 0])
    parallel_key(key2_length);
    
    // Four decorative curved strips
    color("Silver", 0.9) {
        // Front left strip
        translate([-22, 5, 35])
        rotate([0, 0, -3])
        curved_strip(0);
        
        // Front right strip
        translate([22, 5, 35])
        rotate([0, 0, 3])
        curved_strip(1);
        
        // Rear left strip
        translate([-22, -5, 35])
        rotate([0, 0, -5])
        curved_strip(2);
        
        // Rear right strip
        translate([22, -5, 35])
        rotate([0, 0, 5])
        curved_strip(3);
    }
}

// Render complete assembly
trophy_assembly();