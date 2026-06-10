// ============================================================
// Barrel Assembly – Unified Parametric Model
// ============================================================

$fn = 80;

// ------------------------------------------------------------------
// Barrel parameters
// ------------------------------------------------------------------
barrel_length   = 260;
barrel_R_mid    = 94.25;      // radius at bulge (OD ≈ 188.5)
barrel_R_end    = 81.5;       // radius at ends (OD ≈ 163)
bulge_start     = 90;         // axial distance from center where bulge ends
stave_thickness = 30;
stave_count     = 18;
stave_angle     = 360 / stave_count;
stave_gap       = 0.5;        // angular gap for visible stave seams

// ------------------------------------------------------------------
// Ring parameters (treated as bore diameters to fit the stave assembly)
// ------------------------------------------------------------------
ring_large_bore = 188.5;
ring_small_bore = 163;
ring_thickness  = 3;
ring_h_large    = 21.9;
ring_h_small    = 21;

// ------------------------------------------------------------------
// Cap parameters
// ------------------------------------------------------------------
cap_diameter    = 141.2;
cap_radius      = cap_diameter / 2;
cap_thickness   = 12;

// ------------------------------------------------------------------
// Bung / collar parameters
// ------------------------------------------------------------------
bung_x          = 30;
collar_flange_r = 20;
collar_groove_r = 16.25;
collar_hub_r    = 13.75;
collar_height   = 15;
plug_r          = 16.25;
plug_h          = 14;

// ------------------------------------------------------------------
// Tap parameters (simplified geometry)
// ------------------------------------------------------------------
tap_x           = -barrel_length / 2 - cap_thickness;
tap_z           = -50;

// ------------------------------------------------------------------
// Cradle parameters
// ------------------------------------------------------------------
saddle_w        = 170;
saddle_d        = 45;
saddle_h        = 25;
saddle_offset_x = 87.5;

crossbar_length = 220;
crossbar_w      = 25;
crossbar_h      = 25;
crossbar_y      = 60;

key_length      = 189;
key_h           = 25;

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------
function barrel_R(z) =
    let(a = abs(z))
    (a > bulge_start)
        ? barrel_R_end
        : barrel_R_mid - (barrel_R_mid - barrel_R_end) * pow(a / bulge_start, 4);

// Polygon points for one stave wall profile (X = radius, Z = axial)
function stave_profile() =
    concat(
        // outer surface
        [for (z = [-130, -110, -90, -50, 0, 50, 90, 110, 130])
            [barrel_R(z), z]],
        // inner surface (reversed)
        [for (z = [130, 110, 90, 50, 0, -50, -90, -110, -130])
            [barrel_R(z) - stave_thickness, z]]
    );

// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------

// One curved stave sector
module stave_sector() {
    rotate_extrude(angle = stave_angle - stave_gap)
        polygon(stave_profile());
}

// Full barrel body (bulged, 18-fold)
module barrel() {
    rotate([0, 90, 0])
        for (i = [0 : stave_count - 1])
            rotate([0, 0, i * stave_angle])
                stave_sector();
}

// Hoop ring with rectangular cross-section
module ring(bore_dia, height, thickness, x_pos) {
    translate([x_pos, 0, 0])
    rotate([0, 90, 0])
    rotate_extrude()
        translate([bore_dia / 2, -height / 2])
            square([thickness, height]);
}

// Plain end cap (right side)
module plain_cap() {
    translate([barrel_length / 2, 0, 0])
    rotate([0, 90, 0]) {
        cylinder(h = cap_thickness - 2, r = cap_radius, center = false);
        // chamfered rim
        translate([0, 0, cap_thickness - 2])
            cylinder(h = 2, r1 = cap_radius, r2 = cap_radius - 3);
    }
}

// Decorated end cap with embossed text and locating boss
module decorated_cap() {
    translate([-barrel_length / 2, 0, 0])
    rotate([0, 90, 0]) {
        difference() {
            union() {
                cylinder(h = cap_thickness, r = cap_radius);
                // toroidal blend rim (approximated)
                translate([0, 0, cap_thickness])
                    rotate_extrude()
                        translate([cap_radius - 2, 0])
                            circle(r = 2);
            }
            // locating boss on rear face (protrudes inward)
            translate([0, 0, -3])
                cylinder(h = 3.01, r = 10);
        }
        // embossed script (approximation)
        translate([0, 0, cap_thickness])
            rotate([0, 0, 90])
                linear_extrude(height = 1)
                    text("Debowa", size = 22, halign = "center", valign = "center",
                         font = "Liberation Sans:style=Italic");
    }
}

// Flanged bung collar
module bung_collar() {
    top_z = barrel_R(bung_x);
    translate([bung_x, 0, top_z]) {
        difference() {
            union() {
                cylinder(h = 5, r = collar_flange_r);
                translate([0, 0, 5])
                    cylinder(h = 5, r = collar_groove_r);
                translate([0, 0, 10])
                    cylinder(h = 5, r = collar_hub_r);
            }
            // countersunk through-hole
            translate([0, 0, -1])
                cylinder(h = 6, r1 = 11.5, r2 = 7.5);
            translate([0, 0, 5])
                cylinder(h = 11, r = 7.5);
        }
    }
}

// Bung plug
module bung_plug() {
    top_z = barrel_R(bung_x) + collar_height;
    translate([bung_x, 0, top_z]) {
        union() {
            cylinder(h = plug_h - plug_r, r = plug_r);
            translate([0, 0, plug_h - plug_r])
                sphere(r = plug_r);
        }
    }
}

// Simplified tap assembly on the front face
module tap_assembly() {
    translate([tap_x, 0, tap_z])
    rotate([0, 90, 0]) {
        // spacer sleeve
        difference() {
            cylinder(h = 40, r = 4);
            cylinder(h = 41, r = 3);
        }
        // dual-lobe knob (approximated by two merged spheres)
        translate([0, 0, 40]) {
            union() {
                sphere(r = 14);
                translate([0, 0, 10]) sphere(r = 11);
            }
            // ball-lever handle
            translate([0, 0, 5]) {
                cylinder(h = 2, r = 10.6);
                translate([0, 0, 2]) sphere(r = 7);
                rotate([0, 45, 0])
                    translate([0, 0, 7])
                        cylinder(h = 15, r = 2.5);
            }
        }
    }
}

// Cradle saddle support with concave cradle cut
module saddle_support(x_pos) {
    r_barrel = barrel_R(x_pos);
    bottom_z = -r_barrel - saddle_h;
    translate([x_pos, 0, bottom_z + saddle_h / 2])
        difference() {
            cube([saddle_d, saddle_w, saddle_h], center = true);
            // concave cylindrical channel running along barrel axis
            rotate([0, 90, 0])
                cylinder(h = saddle_d + 2, r = r_barrel, center = true);
        }
}

// Plain structural crossbar
module crossbar_structural() {
    r_barrel = barrel_R(saddle_offset_x);
    z_pos = -r_barrel - saddle_h - crossbar_h / 2;
    translate([0, -crossbar_y, z_pos])
        cube([crossbar_length, crossbar_w, crossbar_h], center = true);
}

// Spacer crossbar with raised pads under the saddles
module crossbar_spacer() {
    r_barrel = barrel_R(saddle_offset_x);
    z_pos = -r_barrel - saddle_h - crossbar_h / 2;
    translate([0, crossbar_y, z_pos]) {
        cube([crossbar_length, crossbar_w, crossbar_h], center = true);
        // raised pads
        for (sx = [-saddle_offset_x, saddle_offset_x])
            translate([sx, 0, crossbar_h / 2 + 4])
                cube([saddle_d + 10, crossbar_w, 8], center = true);
    }
}

// Trapezoidal-section key bar (dovetail profile)
module key_bar() {
    r_barrel = barrel_R(saddle_offset_x);
    z_pos = -r_barrel - saddle_h - crossbar_h - key_h / 2;
    translate([0, 0, z_pos])
        rotate([90, 0, 0])
            linear_extrude(height = key_length, center = true)
                polygon([
                    [-12.5, 0],
                    [12.5, 0],
                    [2.5, key_h],
                    [-2.5, key_h]
                ]);
}

// ------------------------------------------------------------------
// Final assembly
// ------------------------------------------------------------------
union() {
    // Barrel staves
    barrel();

    // Hoop rings
    ring(ring_small_bore, ring_h_small, ring_thickness, -120);
    ring(ring_large_bore, ring_h_large, ring_thickness,  -35);
    ring(ring_large_bore, ring_h_large, ring_thickness,   35);
    ring(ring_small_bore, ring_h_small, ring_thickness,  120);

    // End caps
    plain_cap();
    decorated_cap();

    // Bung fitting
    bung_collar();
    bung_plug();

    // Tap
    tap_assembly();

    // Cradle
    saddle_support(-saddle_offset_x);
    saddle_support( saddle_offset_x);
    crossbar_structural();
    crossbar_spacer();
    key_bar();
}