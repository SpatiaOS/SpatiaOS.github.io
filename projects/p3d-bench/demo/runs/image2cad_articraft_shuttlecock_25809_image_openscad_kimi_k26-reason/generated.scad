// OpenSCAD model of a perforated cylindrical basket
// (e.g., washing machine drum / centrifuge basket)
// Features: domed bottom, open top with notched flange,
// longitudinal ribs, circumferential bands, and mixed hole pattern

// ==========================================
// Global resolution
// ==========================================
$fn = 100;

// ==========================================
// Overall dimensions
// ==========================================
basket_diameter = 80;          // Outer diameter of cylindrical body
body_height = 90;              // Height from bottom tip to top rim (excluding flange)
dome_height = 15;              // Height of bottom spherical cap
wall_thickness = 2;            // Uniform wall thickness

// ==========================================
// Top flange
// ==========================================
flange_height = 5;
flange_overhang = 3;           // Radial extension beyond cylinder outer wall
notch_count = 6;               // Number of castellations around flange rim
notch_depth = 4;               // How far each notch cuts inward
notch_width = 10;              // Tangential width of each notch

// ==========================================
// Ribs and reinforcing bands
// ==========================================
rib_count = 6;                 // Longitudinal ribs evenly spaced
rib_width = 4;
rib_height = 2;                // Protrusion beyond outer surface
rib_z_start = dome_height + 5; // Start above dome
rib_z_end = body_height - 2;   // End just below top rim

band_count = 2;
band_thickness = 2;            // Protrusion beyond outer surface
band_height = 3;
band_z_start = dome_height + 8;
band_spacing = 12;             // Vertical spacing between bands

// ==========================================
// Perforation pattern
// ==========================================
slot_length = 10;
slot_width = 2;
hole_diameter = 3;
diag_slot_length = 6;
diag_slot_width = 1.5;

hole_z_start = dome_height + 10;
hole_z_end = body_height - 10;
holes_per_col = 7;
hole_z_step = (hole_z_end - hole_z_start) / (holes_per_col - 1);

// ==========================================
// Helper functions for revolved shell profile
// Generates points for a spherical cap arc used in rotate_extrude
// ==========================================
function cap_arc_points(r, h, t, n, inner = false) =
    let (
        R = (r * r + h * h) / (2 * h),               // Radius of outer sphere
        rad = inner ? R - t : R,                     // Radius of this arc
        theta_start = inner ? atan2(t - R, 0) : -90, // Bottom center
        // Inner junction height where inner sphere meets inner cylinder radius
        inner_h = R - sqrt(max(0, (R - t) * (R - t) - (r - t) * (r - t))),
        theta_end = inner
            ? atan2(inner_h - R, r - t)
            : atan2(h - R, r)
    )
    [ for (i = [0:n])
        let(a = theta_start + (theta_end - theta_start) * i / n)
        [ rad * cos(a), R + rad * sin(a) ]
    ];

// Build closed 2D polygon representing one half of the basket wall cross-section
function shell_profile_points(r, h_cap, total_h, t, n_arc) =
    let (
        outer_arc = cap_arc_points(r, h_cap, t, n_arc, false),
        inner_arc = cap_arc_points(r, h_cap, t, n_arc, true),
        inner_arc_rev = [ for (i = [len(inner_arc)-1:-1:0]) inner_arc[i] ]
    )
    concat(
        outer_arc,                               // Outer dome: (0,0) to (r, h_cap)
        [ [r, total_h], [r - t, total_h] ],      // Top rim outer -> inner
        inner_arc_rev                            // Inner dome: (r-t, inner_h) to (0,t)
        // Polygon auto-closes from (0,t) back to (0,0)
    );

// ==========================================
// Modules
// ==========================================

// Main hollow body with domed bottom
module basket_shell() {
    r_outer = basket_diameter / 2;
    rotate_extrude($fn = 100)
        polygon(shell_profile_points(r_outer, dome_height, body_height, wall_thickness, 20));
}

// Top mounting flange with castellated/notched outer edge
module top_flange() {
    flange_inner_d = basket_diameter - 2 * wall_thickness;
    difference() {
        // Solid ring
        translate([0, 0, body_height])
            cylinder(d = basket_diameter + 2 * flange_overhang, h = flange_height);

        // Hollow center matching basket opening
        translate([0, 0, body_height - 1])
            cylinder(d = flange_inner_d, h = flange_height + 2);

        // Radial notches around perimeter
        for (i = [0 : notch_count - 1])
            rotate([0, 0, i * 360 / notch_count])
            translate([basket_diameter / 2 + flange_overhang, 0, body_height + flange_height / 2])
            cube([notch_depth * 2, notch_width, flange_height + 2], center = true);
    }
}

// External longitudinal ribs and circumferential reinforcing bands
module ribs_and_bands() {
    // Longitudinal ribs
    for (i = [0 : rib_count - 1])
        rotate([0, 0, i * 360 / rib_count])
        translate([basket_diameter / 2 - 0.5, -rib_width / 2, rib_z_start])
        cube([rib_height + 1, rib_width, rib_z_end - rib_z_start]);

    // Circumferential bands (rings)
    for (i = [0 : band_count - 1])
        let(z = band_z_start + i * band_spacing)
        difference() {
            translate([0, 0, z])
                cylinder(d = basket_diameter + 2 * band_thickness, h = band_height);
            translate([0, 0, z - 1])
                cylinder(d = basket_diameter, h = band_height + 2);
        }
}

// Cutters for the perforated pattern (slots, round holes, diagonal slots)
module perforations() {
    // Position cutters so they fully intersect the outermost surface (ribs + bands)
    r_cut = basket_diameter / 2 + 4;
    cut_depth = 12;  // Enough to cut through wall, ribs, and bands

    // --- Vertical rectangular slot columns ---
    for (panel = [0 : rib_count - 1])
        let(pa = panel * 360 / rib_count)
        for (col = [0 : 1])  // 2 columns per panel
            let(a = pa + 15 + col * 30)
            for (row = [0 : holes_per_col - 1])
                let(z = hole_z_start + row * hole_z_step)
                rotate([0, 0, a])
                translate([r_cut, 0, z])
                cube([cut_depth, slot_width, slot_length], center = true);

    // --- Circular hole columns (staggered between slot rows) ---
    for (panel = [0 : rib_count - 1])
        let(pa = panel * 360 / rib_count)
        let(a = pa + 30)  // Center of panel
        for (row = [0 : holes_per_col - 1])
            let(z = hole_z_start + row * hole_z_step + hole_z_step / 2)
            rotate([0, 0, a])
            translate([r_cut, 0, z])
            rotate([0, 90, 0])
            cylinder(d = hole_diameter, h = cut_depth, center = true, $fn = 20);

    // --- Short diagonal slot columns ---
    for (panel = [0 : rib_count - 1])
        let(pa = panel * 360 / rib_count)
        for (col = [0 : 1])
            let(a = pa + 7.5 + col * 45)
            for (row = [0 : holes_per_col - 2])
                let(z = hole_z_start + row * hole_z_step + hole_z_step / 3)
                rotate([0, 0, a])
                translate([r_cut, 0, z])
                rotate([0, 0, 45])
                cube([cut_depth, diag_slot_width, diag_slot_length], center = true);
}

// ==========================================
// Assembly
// ==========================================
difference() {
    union() {
        basket_shell();
        top_flange();
        ribs_and_bands();
    }
    perforations();
}