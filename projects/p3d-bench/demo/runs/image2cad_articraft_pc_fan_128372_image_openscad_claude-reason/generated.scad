// 80mm Axial Computer Cooling Fan
// Parametric model based on standard 80x80x25mm form factor

// === Main Parameters ===
fan_size        = 80;       // Square frame dimension (mm)
fan_height      = 25;       // Total height (mm)
corner_r        = 4;        // Frame corner radius

// Frame details
flange_thick    = 2.0;      // Top/bottom flange plate thickness
bore_dia        = 74;       // Bore (air passage) diameter
shroud_wall     = 2.0;      // Cylindrical shroud wall thickness

// Mounting
mount_spacing   = 71.5;     // Mounting hole center-to-center
mount_hole_dia  = 4.3;      // Screw hole diameter
mount_boss_dia  = 8.0;      // Cylindrical boss around each hole

// Hub and struts
hub_dia         = 30;       // Motor hub diameter
hub_total_h     = 16;       // Hub height from strut base to dome top
num_struts      = 4;        // Number of support struts
strut_w         = 3.5;      // Strut width
strut_h         = 2.5;      // Strut thickness

// Blades
num_blades      = 7;
blade_thick     = 1.3;

$fn = 80;

// === 2D Rounded Square Profile ===
module rounded_sq(s, r) {
    offset(r = r) offset(delta = -r)
        square([s, s], center = true);
}

// === Frame flange plate (square with center bore) ===
module flange_plate() {
    linear_extrude(flange_thick)
        difference() {
            rounded_sq(fan_size, corner_r);
            circle(d = bore_dia, $fn = 120);
        }
}

// === Cylindrical shroud ring connecting flanges ===
module shroud() {
    shroud_od = bore_dia + 2 * shroud_wall;
    difference() {
        cylinder(h = fan_height, d = shroud_od, $fn = 120);
        translate([0, 0, -0.1])
            cylinder(h = fan_height + 0.2, d = bore_dia, $fn = 120);
    }
}

// === Inner lip rings at top and bottom of bore ===
module bore_lips() {
    lip_width = 1.5;
    lip_h = 0.8;
    // Bottom inner lip
    translate([0, 0, flange_thick - lip_h])
        difference() {
            cylinder(h = lip_h + 0.01, d = bore_dia, $fn = 120);
            translate([0, 0, -0.1])
                cylinder(h = lip_h + 0.3, d = bore_dia - 2 * lip_width, $fn = 120);
        }
    // Top inner lip
    translate([0, 0, fan_height - flange_thick])
        difference() {
            cylinder(h = lip_h + 0.01, d = bore_dia, $fn = 120);
            translate([0, 0, -0.1])
                cylinder(h = lip_h + 0.3, d = bore_dia - 2 * lip_width, $fn = 120);
        }
}

// === Corner mounting bosses with screw holes ===
module corner_posts() {
    hs = mount_spacing / 2;
    positions = [[hs, hs], [-hs, hs], [-hs, -hs], [hs, -hs]];
    
    for (p = positions) {
        translate([p[0], p[1], 0])
            difference() {
                // Cylindrical post runs full height
                cylinder(h = fan_height, d = mount_boss_dia, $fn = 36);
                // Screw hole through entire post
                translate([0, 0, -0.1])
                    cylinder(h = fan_height + 0.2, d = mount_hole_dia, $fn = 30);
            }
    }
}

// === Support struts connecting hub to shroud at bottom ===
module support_struts() {
    strut_z = flange_thick;
    strut_len = bore_dia / 2 + shroud_wall;
    
    for (i = [0 : num_struts - 1]) {
        rotate([0, 0, i * 90 + 45])
            translate([0, -strut_w / 2, strut_z])
                // Slight taper - wider at shroud
                hull() {
                    cube([hub_dia / 2, strut_w, strut_h]);
                    translate([strut_len - 0.1, -0.5, 0])
                        cube([0.1, strut_w + 1, strut_h]);
                }
    }
}

// === Central motor hub assembly ===
module motor_hub() {
    base_z = flange_thick + strut_h;
    
    translate([0, 0, base_z]) {
        // Tapered lower section
        cylinder(h = 3, d1 = hub_dia * 0.6, d2 = hub_dia, $fn = 80);
        
        // Main cylindrical hub body
        translate([0, 0, 3])
            cylinder(h = hub_total_h - 6, d = hub_dia, $fn = 80);
        
        // Rounded dome cap on top
        translate([0, 0, hub_total_h - 3])
            resize([hub_dia + 2, hub_dia + 2, 6])
                sphere(d = hub_dia, $fn = 80);
    }
    
    // Small cylindrical base connecting to struts
    translate([0, 0, flange_thick])
        cylinder(h = strut_h + 1, d = hub_dia * 0.6, $fn = 60);
}

// === Single curved fan blade ===
module single_blade(start_angle) {
    base_z = flange_thick + strut_h;
    inner_r = hub_dia / 2 + 1;
    outer_r = bore_dia / 2 - 2;
    span = outer_r - inner_r;
    max_z = hub_total_h - 3;
    sweep = 35;             // Angular sweep of blade from hub to tip
    
    steps = 12;
    
    translate([0, 0, base_z])
    rotate([0, 0, start_angle])
    {
        for (j = [0 : steps - 2]) {
            t1 = j / (steps - 1);
            t2 = (j + 1) / (steps - 1);
            
            // Radial position along blade
            r1 = inner_r + t1 * span;
            r2 = inner_r + t2 * span;
            
            // Angular position (blade curves as it extends outward)
            ang1 = t1 * sweep;
            ang2 = t2 * sweep;
            
            // Z position (high near hub, descends toward tip)
            z1 = max_z * (1 - t1 * 0.8);
            z2 = max_z * (1 - t2 * 0.8);
            
            // Chord width (narrow at hub, wider at tip)
            w1 = 5 + t1 * 12;
            w2 = 5 + t2 * 12;
            
            // Pitch angle - angle of attack (steep at hub, shallow at tip)
            pitch1 = 50 - t1 * 35;
            pitch2 = 50 - t2 * 35;
            
            hull() {
                // Inner cross-section
                translate([r1 * cos(ang1), r1 * sin(ang1), z1])
                    rotate([0, 0, ang1 + 90])
                    rotate([pitch1, 0, 0])
                        cube([w1, blade_thick, 0.01], center = true);
                
                // Outer cross-section
                translate([r2 * cos(ang2), r2 * sin(ang2), z2])
                    rotate([0, 0, ang2 + 90])
                    rotate([pitch2, 0, 0])
                        cube([w2, blade_thick, 0.01], center = true);
            }
        }
    }
}

// === All fan blades arranged radially ===
module all_blades() {
    for (i = [0 : num_blades - 1]) {
        single_blade(i * 360 / num_blades);
    }
}

// === Frame side webbing (curved transitions between corners and shroud) ===
module side_webs() {
    // Thin curved webs on top and bottom flanges connecting
    // the square perimeter smoothly to the circular shroud
    web_h = 1.0;
    
    for (z_pos = [0, fan_height - web_h]) {
        translate([0, 0, z_pos])
            linear_extrude(web_h)
                difference() {
                    rounded_sq(fan_size, corner_r);
                    offset(r = -3) rounded_sq(fan_size, corner_r);
                }
    }
}

// === Complete Fan Assembly ===
module cooling_fan() {
    color("SlateGray") {
        // Bottom flange plate
        flange_plate();
        
        // Top flange plate
        translate([0, 0, fan_height - flange_thick])
            flange_plate();
        
        // Cylindrical shroud ring
        shroud();
        
        // Inner bore lip rings
        bore_lips();
        
        // Corner mounting bosses with screw holes
        corner_posts();
        
        // Side web reinforcement
        side_webs();
        
        // Bottom support struts (hub to shroud)
        support_struts();
        
        // Central motor hub
        motor_hub();
        
        // Fan blades
        all_blades();
    }
}

// === Render the complete fan ===
cooling_fan();