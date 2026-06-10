// ======================================================
// Wine Barrel on Wooden Cradle Stand Assembly
// All dimensions in millimeters
// ======================================================

$fn = 72;

// =================== BARREL ===================
barrel_len  = 260;
r_end       = 70.6;       // radius at barrel ends (~141.2mm dia)
r_mid       = 94.0;       // radius at barrel belly (~188mm dia)
n_staves    = 18;
gap_deg     = 0.8;        // angular gap between staves (degrees)

// =================== HOOPS ===================
hoop_w      = 8;           // band width
hoop_t      = 3.5;         // radial thickness
hoop_z      = [35, 88];    // symmetric pair distances from center

// =================== END CAPS ===================
cap_r       = 66;
cap_t       = 12;

// =================== BUNG & PLUG ===================
bung_flange_r = 20;
bung_hub_r    = 14;
bung_h        = 15;
plug_r        = 16.25;
plug_h        = 14;

// =================== TAP ASSEMBLY ===================
spout_or    = 4;
spout_ir    = 3;
spout_len   = 35;
knob_r1     = 16;          // large lobe
knob_r2     = 11;          // small lobe
ball_r      = 8;
arm_r       = 2.5;
arm_len     = 17;
base_disc_r = 10.6;
tap_offset  = 25;          // below barrel center on face

// =================== CRADLE ===================
sad_l       = 190;         // saddle length (perp. to barrel)
sad_w       = 30;          // saddle width (along barrel)
sad_h       = 38;          // saddle height
sc_r        = 86;          // scoop concave radius
sc_d        = 16;          // scoop depth from saddle top
cr_sep      = 160;         // saddle spacing along barrel axis
bar_s       = 22;          // crossbar section size
bar_l       = cr_sep + sad_w + 30;  // crossbar length

// Barrel center height (computed so barrel rests in scoop)
// br(80) ≈ 83.5mm; scoop bottom = bar_s + sad_h - sc_d = 44
barrel_cz   = bar_s + sad_h - sc_d + 83.5;

// =================== FUNCTIONS ===================

// Barrel radius at axial distance z from center
function br(z) = 
    r_end + (r_mid - r_end) * cos(min(abs(z) / (barrel_len / 2), 1) * 90);

// =================== BARREL MODULES ===================

// Solid barrel of revolution (axis along Z)
module barrel_solid() {
    n = 60;
    rotate_extrude()
        polygon(concat(
            [for (i = [0:n])
                let(t = -1 + 2 * i / n)
                [br(t * barrel_len / 2), t * barrel_len / 2]],
            [[0, barrel_len / 2], [0, -barrel_len / 2]]
        ));
}

// Barrel body split into staves with visible gaps
module barrel_staves() {
    sa  = 360 / n_staves;
    arc = sa - gap_deg;
    R   = r_mid + 10;
    for (i = [0:n_staves - 1]) {
        a0 = i * sa;
        intersection() {
            barrel_solid();
            linear_extrude(barrel_len + 4, center = true)
                polygon(concat(
                    [[0, 0]],
                    [for (a = [a0 - arc/2 : arc/4 : a0 + arc/2])
                        [R * cos(a), R * sin(a)]]
                ));
        }
    }
}

// Hoop ring at axial position
module hoop_ring(zp) {
    ri = br(zp) - 0.5;
    ro = br(zp) + hoop_t;
    rc = (ri + ro) / 2;
    translate([0, 0, zp])
        rotate_extrude()
            translate([rc, 0])
                offset(r = 1.5) offset(delta = -1.5)
                    square([ro - ri, hoop_w], center = true);
}

// End cap disc with optional embossed text
module end_cap(with_text = false) {
    // Main disc with chamfered edge
    cylinder(h = cap_t - 2, r = cap_r);
    translate([0, 0, cap_t - 2])
        cylinder(h = 2, r1 = cap_r, r2 = cap_r - 2);
    // Raised rim ring
    difference() {
        cylinder(h = 5, r = r_end + 1);
        translate([0, 0, -0.5])
            cylinder(h = 6, r = cap_r + 0.5);
    }
    // Embossed text
    if (with_text)
        translate([0, 0, cap_t - 0.5])
            linear_extrude(1.5)
                text("Delsowa", size = 14, halign = "center",
                     valign = "center", font = "serif:style=Italic");
}

// =================== BUNG ASSEMBLY ===================

module bung_assembly() {
    // Flange base
    cylinder(h = 4, r = bung_flange_r);
    // Step ring
    translate([0, 0, 4])
        cylinder(h = 4, r = plug_r + 1);
    // Upper hub
    translate([0, 0, 8])
        cylinder(h = bung_h - 8, r = bung_hub_r);
    // Plug cap
    translate([0, 0, bung_h + 1])
        hull() {
            cylinder(h = 0.01, r = plug_r - 1.5);
            translate([0, 0, 2])
                cylinder(h = plug_h - 4, r = plug_r);
            translate([0, 0, plug_h])
                cylinder(h = 0.01, r = plug_r - 1.5);
        }
}

// =================== TAP MODULES ===================

// Dual-lobe knob
module tap_knob() {
    // Large lobe
    hull() {
        sphere(r = knob_r1);
        translate([0, 0, 16])
            sphere(r = knob_r1 * 0.55);
    }
    // Small lobe
    hull() {
        translate([0, 0, 16])
            sphere(r = knob_r1 * 0.55);
        translate([0, 0, 34])
            sphere(r = knob_r2);
    }
}

// Ball lever handle
module ball_lever() {
    // Base disc
    cylinder(h = 2.5, r = base_disc_r);
    // Conical transition to ball
    translate([0, 0, 2.5])
        cylinder(h = 4, r1 = base_disc_r * 0.8, r2 = ball_r * 0.6);
    // Sphere
    translate([0, 0, 13])
        sphere(r = ball_r);
    // Lever arm
    translate([0, 0, 13])
        rotate([0, 90, 0])
            cylinder(h = arm_len, r = arm_r);
}

// Spout / spacer sleeve
module spout_tube() {
    difference() {
        union() {
            cylinder(h = spout_len, r = spout_or);
            // Base flange
            cylinder(h = 3, r = spout_or + 2);
        }
        translate([0, 0, -1])
            cylinder(h = spout_len + 2, r = spout_ir);
    }
}

// =================== CRADLE MODULES ===================

// Saddle support block with concave scoop
module saddle_block() {
    difference() {
        // Rounded rectangular block
        minkowski() {
            cube([sad_w - 2, sad_l - 2, sad_h - 2], center = true);
            sphere(r = 1, $fn = 20);
        }
        // Concave cylindrical scoop along X (barrel axis direction)
        translate([0, 0, sad_h / 2 + sc_r - sc_d])
            rotate([0, 90, 0])
                cylinder(h = sad_w + 6, r = sc_r, center = true);
    }
}

// Rectangular crossbar with rounded edges
module crossbar(len) {
    minkowski() {
        cube([len - 2, bar_s - 2, bar_s - 2], center = true);
        sphere(r = 1, $fn = 16);
    }
}

// Trapezoidal key bar
module key_bar(len) {
    inset = bar_s * 0.18;
    rotate([0, 90, 0])
        linear_extrude(len, center = true)
            offset(r = 1) offset(delta = -1)
                polygon([
                    [-bar_s/2 + inset, -bar_s/2],
                    [ bar_s/2 - inset, -bar_s/2],
                    [ bar_s/2,          bar_s/2],
                    [-bar_s/2,          bar_s/2]
                ]);
}

// =================== SUB-ASSEMBLIES ===================

// Complete barrel (built in barrel frame: axis along Z)
module barrel_assembly() {
    // Stave body
    barrel_staves();

    // Four hoop rings (symmetric pairs)
    for (z = hoop_z) {
        hoop_ring(z);
        hoop_ring(-z);
    }

    // Front cap at -Z end (decorated, with text)
    translate([0, 0, -barrel_len / 2 + 2])
        mirror([0, 0, 1])
            end_cap(with_text = true);

    // Back cap at +Z end (plain)
    translate([0, 0, barrel_len / 2 - cap_t - 2])
        end_cap(with_text = false);

    // Bung on top (+X in barrel frame → +Z in global)
    translate([r_mid, 0, 0])
        rotate([0, 90, 0])
            bung_assembly();

    // Tap assembly on front face (-Z end)
    translate([-tap_offset, 0, -barrel_len / 2])
        mirror([0, 0, 1]) {
            // Spout
            spout_tube();
            // Knob at end of spout
            translate([0, 0, spout_len + knob_r1])
                tap_knob();
        }

    // Ball lever on front face, offset from tap
    translate([-tap_offset, 0, -barrel_len / 2 - 1])
        mirror([0, 0, 1])
            ball_lever();
}

// Complete cradle
module cradle_assembly() {
    // Crossbars at base level along X (barrel axis direction)
    bar_y_off = sad_l / 2 - 30;
    for (dy = [-bar_y_off, bar_y_off])
        translate([0, dy, bar_s / 2])
            crossbar(bar_l);

    // Center key bar
    translate([0, 0, bar_s / 2])
        key_bar(bar_l * 0.85);

    // Two saddle supports perpendicular to barrel axis
    for (dx = [-cr_sep / 2, cr_sep / 2])
        translate([dx, 0, bar_s + sad_h / 2])
            saddle_block();

    // Small raised pads on crossbars at saddle positions
    for (dx = [-cr_sep / 2, cr_sep / 2])
        for (dy = [-bar_y_off, bar_y_off])
            translate([dx, dy, bar_s])
                cube([sad_w - 4, bar_s - 4, 4], center = true);
}

// =================== FINAL ASSEMBLY ===================

// Cradle on ground
cradle_assembly();

// Barrel rotated to horizontal and elevated into cradle
// rotate([0,-90,0]) maps: X_barrel → Z_global, Z_barrel → -X_global
translate([0, 0, barrel_cz])
    rotate([0, -90, 0])
        barrel_assembly();