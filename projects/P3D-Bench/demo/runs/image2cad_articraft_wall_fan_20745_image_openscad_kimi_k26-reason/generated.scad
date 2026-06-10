// ==========================================
// Industrial LED High-Bay Light with Wall Mount Arm
// ==========================================

// Render quality for curved surfaces
$fn = 80;

// --- Heat Sink Base ---
base_dia = 230;           // Overall diameter of the light base (mm)
base_thick = 10;          // Thickness of the bottom mounting plate
fin_h_outer = 45;         // Height of outer perimeter cooling fins
fin_h_inner = 25;         // Height of inner ring cooling fins
fin_thick = 2;            // Thickness of individual fins
outer_fin_count = 64;     // Number of fins around outer ring
inner_fin_count = 32;     // Number of fins around inner ring
inner_ring_dia = 150;     // Diameter of inner fin ring

// --- Driver Housing ---
drv_dia = 90;             // Diameter of the central driver cylinder
drv_h = 78;               // Height of the driver housing
drv_z = base_thick;       // Z position (sits on top of base plate)

// --- Mounting Arm ---
arm_dia = 24;             // Diameter of the support arm tube
arm_len = 165;            // Length from housing to bracket center
arm_angle = 30;           // Elevation angle above horizontal (degrees)
arm_attach_z = drv_z + drv_h * 0.52;  // Height where arm meets housing side

// --- Wall Mounting Bracket ---
bracket_h = 195;          // Vertical height of the oval dish (tall axis)
bracket_w = 170;          // Horizontal width of the oval dish (wide axis)
bracket_depth = 48;       // Depth of the dish curve

// --- Support Rods ---
rod_dia = 2.5;            // Diameter of the two diagonal support struts

// ==========================================
// Modules
// ==========================================

// Circular heat sink base with perimeter fins and connecting rings
module heat_sink_base() {
    // Bottom mounting plate
    cylinder(d=base_dia, h=base_thick);

    // Inner ring of shorter vertical fins
    for (i = [0 : 360/inner_fin_count : 359.9]) {
        rotate([0, 0, i])
        translate([inner_ring_dia/2 - fin_thick, -fin_thick/2, base_thick])
        cube([fin_thick * 2, fin_thick, fin_h_inner]);
    }

    // Outer ring of taller vertical fins
    for (i = [0 : 360/outer_fin_count : 359.9]) {
        rotate([0, 0, i])
        translate([base_dia/2 - fin_thick * 2, -fin_thick/2, base_thick])
        cube([fin_thick * 2.5, fin_thick, fin_h_outer]);
    }

    // Inner connecting ring (ties fins together)
    translate([0, 0, base_thick + fin_h_inner - 2])
    difference() {
        cylinder(d=inner_ring_dia + 6, h=2);
        cylinder(d=inner_ring_dia - 6, h=4, center=true);
    }

    // Outer connecting ring
    translate([0, 0, base_thick + fin_h_outer - 2])
    difference() {
        cylinder(d=base_dia + 6, h=2);
        cylinder(d=base_dia - 10, h=4, center=true);
    }

    // Radial spokes on top surface for structural detail
    for (i = [0 : 20 : 359.9]) {
        rotate([0, 0, i])
        translate([drv_dia/2 - 5, -fin_thick/2, base_thick])
        cube([(base_dia - drv_dia)/2 + 8, fin_thick, fin_h_inner * 0.5]);
    }
}

// Central driver housing with top vents, side boss, and screws
module driver_housing() {
    difference() {
        union() {
            // Main cylindrical body
            translate([0, 0, drv_z])
            cylinder(d=drv_dia, h=drv_h);

            // Side mounting boss for the arm
            translate([drv_dia/2 - 2, 0, arm_attach_z])
            rotate([0, 90, 0])
            cylinder(d=arm_dia + 10, h=12);
        }

        // Vent slots on top surface (radial pattern on arm side)
        translate([0, 0, drv_z + drv_h - 1]) {
            for (a = [-30 : 10 : 30]) {
                rotate([0, 0, a])
                translate([14, -1.5, 0])
                cube([28, 3, 3]);
            }
            // Rectangular wiring access / terminal block recess
            translate([-32, -14, 0])
            cube([30, 28, 3]);
        }
    }

    // Screw heads around top perimeter
    translate([0, 0, drv_z + drv_h]) {
        for (a = [0 : 60 : 300]) {
            rotate([0, 0, a])
            translate([drv_dia/2 - 10, 0, 0])
            cylinder(d=5, h=1.5);
        }
    }

    // Raised terminal block cover detail
    translate([-26, -8, drv_z + drv_h])
    cube([18, 16, 1.5]);
}

// Angled cylindrical arm with hex nut joint at the housing
module mounting_arm() {
    start_x = drv_dia/2 + 10;

    // Arm tube
    translate([start_x, 0, arm_attach_z])
    rotate([0, arm_angle, 0])
    cylinder(d=arm_dia, h=arm_len);

    // Hexagonal nut / adjustment joint
    translate([start_x, 0, arm_attach_z])
    rotate([0, arm_angle, 0])
    translate([0, 0, -6])
    cylinder(d=arm_dia + 8, h=7, $fn=6);
}

// Oval dish-shaped wall bracket with central mounting hub
module mounting_bracket() {
    // Local coords: X = tall axis, Y = wide axis, Z = depth (bulge direction)
    intersection() {
        resize([bracket_h, bracket_w, bracket_depth * 2])
        sphere(d=bracket_depth * 2);

        // Keep only the front spherical cap (bulging in +Z)
        translate([0, 0, bracket_depth / 2])
        cube([bracket_h + 10, bracket_w + 10, bracket_depth], center=true);
    }

    // Central hub where the arm inserts
    cylinder(d=42, h=10);
}

// Two diagonal support struts between housing and bracket rim
module support_rods() {
    start_x = drv_dia/2 + 10;
    end_x = start_x + arm_len * cos(arm_angle);
    end_z = arm_attach_z + arm_len * sin(arm_angle);

    // Housing attachment points (offset above and below arm joint)
    p_house_top = [start_x + 18, 0, arm_attach_z + 22];
    p_house_bot = [start_x + 18, 0, arm_attach_z - 22];

    // Bracket rim attachment points (top and bottom extremes)
    p_brack_top = [end_x, 0, end_z + bracket_h/2 * 0.82];
    p_brack_bot = [end_x, 0, end_z - bracket_h/2 * 0.82];

    rod(p_house_top, p_brack_top, rod_dia);
    rod(p_house_bot, p_brack_bot, rod_dia);
}

// Helper module: rod between two 3D points using hull of spheres
module rod(p1, p2, d) {
    hull() {
        translate(p1) sphere(d=d);
        translate(p2) sphere(d=d);
    }
}

// ==========================================
// Main Assembly
// ==========================================

union() {
    heat_sink_base();
    driver_housing();
    mounting_arm();

    // Position bracket at the end of the arm, oriented perpendicular to arm axis
    start_x = drv_dia/2 + 10;
    end_x = start_x + arm_len * cos(arm_angle);
    end_z = arm_attach_z + arm_len * sin(arm_angle);

    translate([end_x, 0, end_z])
    rotate([0, 90, 0])
    mounting_bracket();

    support_rods();
}