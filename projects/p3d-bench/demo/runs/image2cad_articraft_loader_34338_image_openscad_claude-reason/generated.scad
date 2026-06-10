// =============================================
// Front-End Wheel Loader
// Parametric OpenSCAD Model
// =============================================
$fn = 48;

// ===== WHEEL PARAMETERS =====
wheel_r = 21;            // tire outer radius
wheel_w = 14;            // tire width
rim_r = 13;              // rim outer radius
hub_r = 7.5;             // hub radius
hub_cap_r = 5;           // hub cap radius
n_treads = 14;           // number of chevron tread pairs
tread_h = 3.5;           // tread protrusion height

// ===== VEHICLE LAYOUT =====
front_axle_x = 28;       // front axle X position
rear_axle_x = -38;       // rear axle X position
half_track = 36;          // half track width (center to wheel center)
axle_z = wheel_r + tread_h;  // axle center height above ground

// ===== BODY DIMENSIONS =====
bz = 16;                  // body base Z height (ground clearance)

// Rear engine section
re_x1 = -58;  re_x2 = -5;
re_w = 48;    re_h = 24;

// Engine hood (sits on top of rear section)
hd_x1 = -54;  hd_x2 = -10;
hd_w = 44;    hd_h = 10;
hd_z = bz + re_h;

// Operator cab
cb_x1 = -5;   cb_x2 = 20;
cb_w = 40;     cb_h = 30;
cb_wall = 2.5;
win_h = 18;    // window height

// Front body section
fb_x1 = 15;   fb_x2 = 35;
fb_w = 36;     fb_h = 14;

// ===== BUCKET =====
bk_w = 80;     bk_d = 36;    bk_h = 26;
bk_t = 2.5;    // wall thickness
bk_front_x = 76;
bk_z = 1;      // bucket bottom Z

// ===== LIFT ARMS =====
arm_w = 5;                     // arm section width
arm_rear_x = 10;              // rear pivot X
arm_rear_z = bz + cb_h - 10;  // rear pivot Z
arm_front_x = bk_front_x - bk_d + 2;  // front pivot X
arm_front_z = bk_z + bk_h * 0.6;      // front pivot Z
arm_spacing = fb_w/2 + 3;     // Y offset from centerline

// ===== EXHAUST =====
exh_d = 5;     exh_h = 18;

// ===== FENDER =====
fender_r = wheel_r + tread_h + 5;
fender_w = wheel_w + 8;


// =============================================
// WHEEL MODULE - axis along Z, hub cap at +Z
// =============================================
module wheel_unit() {
    // Tire body with rounded profile
    difference() {
        hull() {
            cylinder(r=wheel_r, h=wheel_w - 4, center=true);
            cylinder(r=wheel_r - 2, h=wheel_w, center=true);
        }
        // Remove center for rim
        cylinder(r=rim_r - 1.5, h=wheel_w + 2, center=true);
    }
    
    // Rim disc
    difference() {
        cylinder(r=rim_r, h=wheel_w - 3, center=true);
        cylinder(r=hub_r, h=wheel_w, center=true);
    }
    
    // Hub cylinder
    cylinder(r=hub_r, h=wheel_w - 5, center=true);
    
    // Hub cap (outer face at +Z)
    translate([0, 0, wheel_w/2 - 2.5])
        cylinder(r=hub_cap_r, h=3);
    
    // Hub center ring detail
    translate([0, 0, wheel_w/2 + 0.2])
    difference() {
        cylinder(r=hub_cap_r + 0.3, h=1.2);
        translate([0, 0, -0.5])
            cylinder(r=hub_cap_r - 1.5, h=2.5);
    }
    
    // Chevron / V-pattern tread lugs
    for (i = [0 : n_treads - 1]) {
        a = i * 360 / n_treads;
        rotate([0, 0, a])
        translate([wheel_r + tread_h/2 - 0.5, 0, 0])
        for (s = [-1, 1]) {
            // Two angled bars forming a V shape
            translate([0, 0, s * wheel_w * 0.08])
            rotate([s * 30, 0, 0])
            cube([tread_h + 0.5, 3, wheel_w * 0.32], center=true);
        }
    }
}


// =============================================
// BUCKET MODULE
// =============================================
module bucket() {
    bk_bx = bk_front_x - bk_d;  // bucket back X
    
    translate([bk_bx, -bk_w/2, bk_z]) {
        // Main bucket shell - open top
        difference() {
            cube([bk_d, bk_w, bk_h]);
            translate([bk_t, bk_t, bk_t])
                cube([bk_d + 1, bk_w - 2*bk_t, bk_h + 1]);
        }
        
        // Thicker cutting edge at front bottom
        translate([bk_d - bk_t, 0, 0])
            cube([bk_t * 2, bk_w, bk_t * 2]);
        
        // Back wall reinforcement
        cube([bk_t + 1.5, bk_w, bk_h * 0.6]);
        
        // Side reinforcement gussets
        for (y_off = [1, bk_w - bk_t - 1]) {
            translate([bk_d - 10, y_off, 0])
            rotate([90, 0, 90])
            linear_extrude(10)
            polygon([[0, 0], [bk_t, 0], [bk_t, 7], [0, 10]]);
        }
        
        // Top edge lip reinforcement
        translate([bk_d - bk_t * 2, 0, bk_h - bk_t])
            cube([bk_t * 2, bk_w, bk_t]);
        translate([0, 0, bk_h - bk_t])
            cube([bk_t * 2, bk_w, bk_t]);
    }
}


// =============================================
// OPERATOR CAB MODULE
// =============================================
module cab() {
    len = cb_x2 - cb_x1;
    
    translate([cb_x1, -cb_w/2, bz]) {
        difference() {
            // Outer shell
            cube([len, cb_w, cb_h]);
            
            // Interior cavity
            translate([cb_wall, cb_wall, cb_wall])
                cube([len - 2*cb_wall, cb_w - 2*cb_wall, cb_h]);
            
            // Front windows (two panes with center mullion)
            pw = (cb_w - 2*cb_wall - 3) / 2;
            for (i = [0, 1])
                translate([-0.5, cb_wall + 1 + i*(pw + 1), cb_h - win_h - cb_wall])
                    cube([cb_wall + 1, pw, win_h - 1]);
            
            // Side windows (two per side)
            wl = (len - 2*cb_wall - 5) / 2;
            for (sy = [-0.5, cb_w - cb_wall - 0.5])
                for (i = [0, 1])
                    translate([cb_wall + 2 + i*(wl + 1), sy, cb_h - win_h - cb_wall])
                        cube([wl, cb_wall + 1, win_h - 1]);
            
            // Rear window
            translate([len - cb_wall - 0.5, cb_wall + 5, cb_h - win_h - cb_wall + 3])
                cube([cb_wall + 1, cb_w - 2*cb_wall - 10, win_h - 5]);
        }
        
        // Roof with slight overhang
        translate([-3, -3, cb_h - cb_wall])
            cube([len + 6, cb_w + 6, cb_wall + 0.5]);
    }
}


// =============================================
// ENGINE / REAR BODY MODULE
// =============================================
module engine_body() {
    // Main rear engine block
    translate([re_x1, -re_w/2, bz])
        cube([re_x2 - re_x1, re_w, re_h]);
    
    // Engine hood on top
    translate([hd_x1, -hd_w/2, hd_z])
        cube([hd_x2 - hd_x1, hd_w, hd_h]);
    
    // Hood top bevel/crown
    translate([hd_x1 + 1, -hd_w/2 + 1, hd_z + hd_h])
    hull() {
        cube([hd_x2 - hd_x1 - 2, hd_w - 2, 0.1]);
        translate([2, 2, 2])
            cube([hd_x2 - hd_x1 - 6, hd_w - 6, 0.1]);
    }
    
    // Exhaust pipe with cap
    translate([-46, hd_w/2 - 6, hd_z + hd_h]) {
        cylinder(d=exh_d, h=exh_h);
        translate([0, 0, exh_h])
            cylinder(d=exh_d + 2, h=2);
    }
    
    // Rear counterweight (curved back)
    translate([re_x1 - 3, -re_w/2 + 5, bz + 2])
    hull() {
        cube([4, re_w - 10, re_h - 4]);
        translate([2, 3, -2])
            cube([1, re_w - 16, re_h]);
    }
    
    // Side grille louver details
    for (side = [-1, 1]) {
        for (i = [0:4]) {
            translate([re_x1 + 8 + i*8, 
                       side > 0 ? re_w/2 - 0.7 : -re_w/2 - 0.8, 
                       bz + 5])
                cube([5, 1.5, re_h - 10]);
        }
    }
    
    // Air intake box on hood
    translate([-40, -8, hd_z + hd_h + 2])
        cube([10, 16, 3]);
}


// =============================================
// CHASSIS / FRAME MODULE
// =============================================
module chassis() {
    // Lower frame beam connecting front to rear
    hull() {
        translate([re_x1 + 3, -re_w/2 + 5, bz - 5])
            cube([1, re_w - 10, 5]);
        translate([fb_x2 - 1, -fb_w/2, bz - 5])
            cube([1, fb_w, 5]);
    }
    
    // Front body section
    translate([fb_x1, -fb_w/2, bz])
        cube([fb_x2 - fb_x1, fb_w, fb_h]);
    
    // Articulation joint (center of vehicle)
    translate([-4, -re_w/2 - 1, bz])
        cube([12, re_w + 2, re_h + 2]);
    
    // Platform under cab
    translate([cb_x1, -cb_w/2 - 2, bz])
        cube([cb_x2 - cb_x1, cb_w + 4, 3]);
    
    // Front frame extension toward bucket
    translate([fb_x2 - 2, -fb_w/2 + 4, bz])
        cube([10, fb_w - 8, 8]);
}


// =============================================
// FENDERS MODULE
// =============================================
module fenders() {
    // Fender arches over all four wheels
    for (ax = [front_axle_x, rear_axle_x]) {
        for (side = [-1, 1]) {
            translate([ax, side * half_track, axle_z])
            difference() {
                // Outer arch cylinder (axis along Y)
                rotate([90, 0, 0])
                    cylinder(r=fender_r, h=fender_w, center=true);
                // Inner bore
                rotate([90, 0, 0])
                    cylinder(r=fender_r - 2.5, h=fender_w + 2, center=true);
                // Remove bottom half (everything below axle center)
                translate([-(fender_r + 1), -(fender_w/2 + 1), -(fender_r * 2 + 1)])
                    cube([fender_r * 2 + 2, fender_w + 2, fender_r * 2 + 1]);
            }
        }
    }
    
    // Side panels connecting rear body to rear fenders
    for (side = [-1, 1]) {
        hull() {
            translate([rear_axle_x - 12, side * re_w/2, bz])
                cube([24, 0.01, re_h]);
            translate([rear_axle_x - 8, side * (half_track - wheel_w/2 - 3), bz + 4])
                cube([16, 0.01, re_h - 8]);
        }
    }
    
    // Side panels connecting front body to front fenders
    for (side = [-1, 1]) {
        hull() {
            translate([front_axle_x - 8, side * fb_w/2, bz])
                cube([16, 0.01, fb_h]);
            translate([front_axle_x - 5, side * (half_track - wheel_w/2 - 3), bz + 2])
                cube([10, 0.01, fb_h - 4]);
        }
    }
}


// =============================================
// LIFT ARMS MODULE
// =============================================
module lift_arms() {
    for (side = [-1, 1]) {
        y = side * arm_spacing;
        
        // Main boom arm (upper)
        hull() {
            translate([arm_rear_x, y, arm_rear_z])
                rotate([90, 0, 0]) cylinder(d=6, h=arm_w, center=true);
            translate([arm_front_x, y, arm_front_z])
                rotate([90, 0, 0]) cylinder(d=5, h=arm_w, center=true);
        }
        
        // Lower Z-bar linkage arm
        hull() {
            translate([arm_rear_x + 10, y, arm_rear_z - 16])
                rotate([90, 0, 0]) cylinder(d=4.5, h=arm_w, center=true);
            translate([arm_front_x - 5, y, arm_front_z - 8])
                rotate([90, 0, 0]) cylinder(d=4, h=arm_w, center=true);
        }
        
        // Hydraulic lift cylinder
        hull() {
            translate([arm_rear_x - 2, y * 0.85, arm_rear_z + 5])
                rotate([90, 0, 0]) cylinder(d=5.5, h=4, center=true);
            translate([(arm_rear_x + arm_front_x)/2 - 5, y * 0.85, arm_rear_z + 8])
                rotate([90, 0, 0]) cylinder(d=3.5, h=3, center=true);
        }
        
        // Bucket tilt cylinder
        hull() {
            translate([arm_front_x - 12, y * 0.9, arm_front_z + 5])
                rotate([90, 0, 0]) cylinder(d=4, h=3, center=true);
            translate([arm_front_x - 2, y * 0.9, arm_front_z - 5])
                rotate([90, 0, 0]) cylinder(d=3, h=3, center=true);
        }
        
        // Pivot boss cylinders at joints
        for (p = [[arm_rear_x, arm_rear_z], [arm_front_x, arm_front_z]]) {
            translate([p[0], y, p[1]])
                rotate([90, 0, 0]) cylinder(d=8, h=arm_w + 2, center=true);
        }
        
        // Mid-arm cross-link pivot
        mid_x = (arm_rear_x + arm_front_x) / 2 + 2;
        mid_z = (arm_rear_z + arm_front_z) / 2 - 2;
        translate([mid_x, y, mid_z])
            rotate([90, 0, 0]) cylinder(d=6, h=arm_w + 1, center=true);
    }
    
    // Cross-bar connecting both arms near the rear
    hull() {
        translate([arm_rear_x + 3, -arm_spacing + arm_w/2, arm_rear_z - 1])
            rotate([90, 0, 0]) cylinder(d=4, h=1, center=true);
        translate([arm_rear_x + 3, arm_spacing - arm_w/2, arm_rear_z - 1])
            rotate([90, 0, 0]) cylinder(d=4, h=1, center=true);
    }
}


// =============================================
// MAIN ASSEMBLY
// =============================================

// --- Place Wheels ---
for (ax = [front_axle_x, rear_axle_x]) {
    // Right side wheels (hub cap faces +Y)
    translate([ax, half_track, axle_z])
        rotate([-90, 0, 0])
            wheel_unit();
    // Left side wheels (hub cap faces -Y)
    translate([ax, -half_track, axle_z])
        rotate([90, 0, 0])
            wheel_unit();
}

// --- Body Structure ---
chassis();
engine_body();
cab();
fenders();

// --- Working Equipment ---
lift_arms();
bucket();