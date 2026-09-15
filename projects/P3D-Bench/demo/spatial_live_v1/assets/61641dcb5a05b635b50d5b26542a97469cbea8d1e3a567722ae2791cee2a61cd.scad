// Parametric Architectural Model of Slender High-Rise Tower
// Dimensions in millimeters

$fn = 32;
eps = 0.05;

// --- Global Dimensions & Parameters ---
floor_h      = 9.5;    // Typical floor-to-floor height
n_floors     = 18;     // Typical tower floors below terrace
podium_h     = 15.0;   // Ground podium height
tower_body_h = n_floors * floor_h; // 171.0
terrace_z    = podium_h + tower_body_h; // 186.0

// Facade Bay Widths
balcony_w    = 24.0;
grid_w       = 16.0;
front_w      = balcony_w + grid_w; // 40.0

// Right Facade Geometry
right_dx     = 18.0;
right_dy     = 26.0;
right_len    = sqrt(right_dx*right_dx + right_dy*right_dy); // ~31.62
right_angle  = atan2(right_dy, right_dx); // ~55.3 deg

// Footprint Vertices
pt_front_l   = [0, 0];
pt_front_r   = [front_w, 0];
pt_rear_r    = [front_w + right_dx, right_dy]; // [58, 26]
pt_rear_l    = [0, 36];
tower_footprint = [pt_front_l, pt_front_r, pt_rear_r, pt_rear_l];

// Color Palette
c_wall       = [0.82, 0.83, 0.85]; // Concrete facade light grey
c_wall_dark  = [0.74, 0.75, 0.78]; // Accent / base grey
c_glass      = [0.14, 0.15, 0.18]; // Dark glass & shadow recesses
c_frame      = [0.93, 0.94, 0.96]; // Mullions, transoms, railings
c_roof       = [0.65, 0.67, 0.70]; // Roof terrace surface

// --- Helper Modules ---

// Balconies on Front-Left Facade
module balcony_level(z) {
    w_total = balcony_w - 2.0; // 22.0
    sub_w = (w_total - 1.0) / 2; // 10.5 each
    
    // Recessed dark interior cavity
    color(c_glass)
        translate([1.0, -0.1, z + 1.0])
            cube([w_total, 3.5, floor_h - 1.0]);
            
    // Floor slab
    color(c_frame)
        translate([0.8, -0.5, z])
            cube([w_total + 0.4, 4.2, 1.0]);
            
    // Center divider wall
    color(c_wall)
        translate([1.0 + sub_w, -0.2, z + 1.0])
            cube([1.0, 3.6, floor_h - 1.0]);
            
    // Railings for the two balcony compartments
    for (b = [0, 1]) {
        bx = 1.0 + b * (sub_w + 1.0);
        
        // Lower solid balustrade panel
        color(c_wall)
            translate([bx, -0.3, z + 1.0])
                cube([sub_w, 0.5, 1.6]);
                
        // Dark reveal / slot
        color(c_glass)
            translate([bx, -0.25, z + 2.6])
                cube([sub_w, 0.4, 0.6]);
                
        // Top handrail
        color(c_frame)
            translate([bx, -0.35, z + 3.2])
                cube([sub_w, 0.6, 0.5]);
                
        // Side end posts
        color(c_frame) {
            translate([bx, -0.35, z + 1.0])
                cube([0.5, 0.6, 2.7]);
            translate([bx + sub_w - 0.5, -0.35, z + 1.0])
                cube([0.5, 0.6, 2.7]);
        }
    }
}

// 3x3 Grid Window on Front-Right Facade
module grid_window_level(z) {
    win_x = front_w - grid_w + 1.2; // 25.2
    win_w = grid_w - 2.4;          // 13.6
    win_h = floor_h - 2.5;         // 7.0
    win_z = z + 1.5;
    
    // Dark glass panel
    color(c_glass)
        translate([win_x, -0.2, win_z])
            cube([win_w, 0.5, win_h]);
            
    // Outer perimeter frame
    color(c_frame) {
        translate([win_x, -0.3, win_z])
            cube([win_w, 0.6, 0.4]); // bottom
        translate([win_x, -0.3, win_z + win_h - 0.4])
            cube([win_w, 0.6, 0.4]); // top
        translate([win_x, -0.3, win_z])
            cube([0.4, 0.6, win_h]); // left
        translate([win_x + win_w - 0.4, -0.3, win_z])
            cube([0.4, 0.6, win_h]); // right
    }
    
    // 2 Vertical Mullions (dividing into 3 panes)
    color(c_frame) {
        for (m = [1, 2]) {
            translate([win_x + m * (win_w / 3) - 0.2, -0.3, win_z])
                cube([0.4, 0.6, win_h]);
        }
    }
    
    // 2 Horizontal Transoms (dividing into 3 panes)
    color(c_frame) {
        for (t = [1, 2]) {
            translate([win_x, -0.3, win_z + t * (win_h / 3) - 0.2])
                cube([win_w, 0.6, 0.4]);
        }
    }
}

// Right Facade Window Strip
module right_facade_window(z, start_pos, win_len, num_panes) {
    win_h = floor_h - 2.8;
    win_z = z + 1.6;
    
    translate([pt_front_r[0], pt_front_r[1], 0])
    rotate([0, 0, right_angle]) {
        // Dark glass
        color(c_glass)
            translate([start_pos, -0.2, win_z])
                cube([win_len, 0.5, win_h]);
                
        // Outer frame
        color(c_frame) {
            translate([start_pos, -0.3, win_z])
                cube([win_len, 0.6, 0.4]);
            translate([start_pos, -0.3, win_z + win_h - 0.4])
                cube([win_len, 0.6, 0.4]);
            translate([start_pos, -0.3, win_z])
                cube([0.4, 0.6, win_h]);
            translate([start_pos + win_len - 0.4, -0.3, win_z])
                cube([0.4, 0.6, win_h]);
        }
        
        // Vertical mullions
        color(c_frame) {
            for (p = [1 : num_panes - 1]) {
                translate([start_pos + p * (win_len / num_panes) - 0.2, -0.3, win_z])
                    cube([0.4, 0.6, win_h]);
            }
        }
        
        // Mid horizontal transom
        color(c_frame)
            translate([start_pos, -0.3, win_z + win_h * 0.5 - 0.2])
                cube([win_len, 0.6, 0.4]);
    }
}

// --- Main Model Assembly ---

module tower_model() {
    
    // 1. Tower Main Structural Shell (Floors 1 to 18)
    color(c_wall) {
        difference() {
            translate([0, 0, podium_h])
                linear_extrude(height = tower_body_h)
                    polygon(tower_footprint);
                    
            // Subtract balcony cavities
            for (i = [0 : n_floors - 1]) {
                translate([0.8, -1.0, podium_h + i * floor_h + 0.8])
                    cube([balcony_w - 1.6, 4.5, floor_h - 0.6]);
            }
        }
    }
    
    // 2. Balconies and Windows on Lower 18 Floors
    for (i = [0 : n_floors - 1]) {
        zf = podium_h + i * floor_h;
        balcony_level(zf);
        grid_window_level(zf);
        right_facade_window(zf, 4.0, right_len - 6.0, 3);
    }
    
    // 3. Vertical Architectural Fins on Far-Left Facade
    color(c_wall) {
        for (f = [0 : 3]) {
            translate([-2.4, 1.0 + f * 2.0, podium_h])
                cube([2.4, 0.6, tower_body_h]);
        }
    }
    
    // 4. Floor 18 Overhanging Roof Slab / Terrace
    color(c_wall) {
        translate([0, 0, terrace_z])
            linear_extrude(height = 1.8)
                polygon([
                    [-2.8, -1.0],
                    [front_w + 0.8, -1.0],
                    pt_rear_r,
                    pt_rear_l,
                    [-2.8, 36]
                ]);
    }
    
    // Terrace floor surface
    color(c_roof)
        translate([0, 0, terrace_z + 1.8])
            linear_extrude(height = 0.2)
                polygon(tower_footprint);
                
    // 5. Penthouse & Rooftop Volumes (Floors 19 to 21)
    penthouse_h = 3 * floor_h; // 28.5
    pent_z = terrace_z + 2.0;
    
    // Triangular Penthouse (Front-Left)
    tri_apex  = [4.0, 10.0];
    tri_mid   = [24.0, 19.0];
    tri_rear  = pt_rear_l;
    poly_tri  = [tri_apex, tri_mid, tri_rear];
    
    // Right Penthouse Body
    pt_right_start = [front_w + right_dx * 0.35, right_dy * 0.35]; // ~ [46.3, 9.1]
    poly_right = [tri_mid, pt_right_start, pt_rear_r, tri_rear];
    
    // Triangular Volume Solid & Parapet
    color(c_wall) {
        translate([0, 0, pent_z])
            linear_extrude(height = penthouse_h - 2.0)
                polygon(poly_tri);
                
        // Parapet walls surrounding triangular roof
        translate([0, 0, pent_z + penthouse_h - 2.0])
            difference() {
                linear_extrude(height = 3.5)
                    polygon(poly_tri);
                translate([0, 0, -0.1])
                    linear_extrude(height = 3.7)
                        offset(r = -0.8)
                            polygon(poly_tri);
            }
    }
    // Sunken triangular roof surface
    color(c_roof)
        translate([0, 0, pent_z + penthouse_h - 1.5])
            linear_extrude(height = 0.2)
                offset(r = -0.6)
                    polygon(poly_tri);
                    
    // Right Penthouse Body Solid & Parapet
    color(c_wall) {
        translate([0, 0, pent_z])
            linear_extrude(height = penthouse_h)
                polygon(poly_right);
                
        // Parapet walls around right penthouse roof
        translate([0, 0, pent_z + penthouse_h])
            difference() {
                linear_extrude(height = 3.5)
                    polygon(poly_right);
                translate([0, 0, -0.1])
                    linear_extrude(height = 3.7)
                        offset(r = -0.8)
                            polygon(poly_right);
            }
    }
    // Sunken right roof surface
    color(c_roof)
        translate([0, 0, pent_z + penthouse_h + 0.5])
            linear_extrude(height = 0.2)
                offset(r = -0.6)
                    polygon(poly_right);
                    
    // Penthouse Windows on Right Facade (3 floors)
    for (p = [0 : 2]) {
        pz = pent_z + p * floor_h;
        right_facade_window(pz, right_len * 0.38, right_len * 0.58, 2);
    }
    
    // 6. Base / Podium Level
    
    // Ground level tower base
    color(c_wall_dark) {
        linear_extrude(height = podium_h)
            polygon(tower_footprint);
    }
    
    // Entrance shopfront under grid windows
    color(c_glass)
        translate([front_w - grid_w + 1.5, -0.2, 0])
            cube([grid_w - 3.0, 0.4, podium_h - 2.0]);
    color(c_frame) {
        translate([front_w - grid_w + 1.5, -0.3, 0])
            cube([grid_w - 3.0, 0.5, 0.8]);
        translate([front_w - grid_w + 1.5, -0.3, podium_h - 2.0])
            cube([grid_w - 3.0, 0.5, 0.8]);
        translate([front_w - grid_w * 0.5 - 0.3, -0.3, 0])
            cube([0.6, 0.5, podium_h - 2.0]);
    }
    
    // Right Podium Extension (Chamfered Plinth)
    poly_pod_r = [
        [front_w, 0],
        [front_w + 3.0, -3.0],
        [front_w + 12.0, -3.0],
        [front_w + right_dx + 5.0, 10.0],
        [front_w + right_dx + 5.0, right_dy],
        pt_rear_r
    ];
    color(c_wall_dark) {
        linear_extrude(height = podium_h)
            polygon(poly_pod_r);
            
        // Base parapet trim
        translate([0, 0, podium_h])
            linear_extrude(height = 1.0)
                polygon(poly_pod_r);
    }
    // Dark recess / opening on chamfered base
    color(c_glass)
        translate([front_w + 14.0, 0.0, 2.0])
            rotate([0, 0, right_angle])
                cube([10.0, 0.5, podium_h - 4.0]);
                
    // Left-Rear Podium Extension with Roof Terrace
    pod_l_x = -15.0;
    pod_l_y1 = 8.0;
    pod_l_y2 = 36.0;
    pod_l_h = podium_h + 3.0; // 18.0
    
    color(c_wall_dark) {
        translate([pod_l_x, pod_l_y1, 0])
            cube([-pod_l_x, pod_l_y2 - pod_l_y1, pod_l_h]);
            
        // Parapet walls around terrace
        translate([pod_l_x, pod_l_y1, pod_l_h]) {
            difference() {
                cube([-pod_l_x, pod_l_y2 - pod_l_y1, 2.5]);
                translate([0.6, 0.6, -0.1])
                    cube([-pod_l_x, pod_l_y2 - pod_l_y1 - 1.2, 2.7]);
            }
        }
    }
    // Terrace floor
    color(c_roof)
        translate([pod_l_x + 0.6, pod_l_y1 + 0.6, pod_l_h + 0.2])
            cube([-pod_l_x - 0.6, pod_l_y2 - pod_l_y1 - 1.2, 0.2]);
            
    // Corner post / mast on podium terrace
    color(c_frame)
        translate([pod_l_x + 0.8, pod_l_y1 + 0.8, pod_l_h])
            cylinder(h = 10.0, d = 0.5);
            
    // Decorative horizontal reveal groove on podium
    color(c_glass)
        translate([pod_l_x - 0.1, pod_l_y1 - 0.1, pod_l_h * 0.5])
            cube([-pod_l_x + 0.2, 0.3, 0.4]);
}

// Render complete tower model
tower_model();