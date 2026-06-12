// Concentric Annular Base with Collar and Rib Web

// ---- Main Base Reference Dimensions ----
base_length = 0.75;
base_width = 0.75;
base_height = 0.05625;
main_extrusion_depth = 0.0281;

// Concentric axis center (0.375 from left, 0.375 from front)
cx = 0.375;
cy = 0.375;

// ---- Outer Annulus (Main Base) ----
outer_r = 0.375;       // Outer radius of base annulus
inner_r = 0.3375;       // Inner radius of base annulus
base_z_bot = -0.0281;   // Bottom Z from underside reference
base_z_top = 0.0281;    // Top Z from underside reference
base_h = base_z_top - base_z_bot;

// ---- Inner Collar ----
collar_outer_r = 0.075;   // Outer radius (0.15/2 footprint)
collar_inner_r = 0.0375;   // Inner radius (through void)
collar_z_bot = -0.0234;
collar_z_top = 0.0234;
collar_h = collar_z_top - collar_z_bot;

// ---- Rib Web ----
rib_z_bot = -0.0141;
rib_z_top = 0.0141;
rib_h = rib_z_top - rib_z_bot;

// Rib bounding box edges (absolute coordinates)
rib_left = 0.0658;
rib_front = 0.0387;
rib_right = base_length - 0.0658;   // 0.6842
rib_back = base_width - 0.1903;     // 0.5597
rib_bbox_l = 0.618448;
rib_bbox_w = 0.521035;

// Rib arc radii (concentric with main axis)
rib_arc_inner = collar_outer_r;  // Connects to collar outer edge
rib_arc_outer = inner_r;          // Connects to outer annulus inner edge

// Radial slot parameters
num_slots = 6;
slot_angular_width = 10;  // Degrees per slot
slot_start_angle = 15;    // Angular offset for first slot

$fn = 120;

// ---- Module: Annulus (circular ring) ----
module annulus(r_outer, r_inner, h) {
    difference() {
        cylinder(h=h, r=r_outer, center=true, $fn=$fn);
        cylinder(h=h + 0.002, r=r_inner, center=true, $fn=$fn);
    }
}

// ---- Module: Annular Wedge (for slot subtraction) ----
module annular_wedge(r_outer, r_inner, angle, h) {
    ha = angle / 2;
    n = max(8, ceil(angle));
    outer_pts = [for (i = [0:n]) let (a = -ha + i * angle / n)
                    [r_outer * cos(a), r_outer * sin(a)]];
    inner_pts = [for (i = [0:n]) let (a = ha - i * angle / n)
                    [r_inner * cos(a), r_inner * sin(a)]];
    linear_extrude(height=h, center=true)
        polygon(concat(outer_pts, inner_pts));
}

// ---- Main Assembly ----
union() {
    // 1. Outer annulus base (circular ring plate)
    translate([cx, cy, 0])
        annulus(outer_r, inner_r, base_h);

    // 2. Inner collar (annular ring with through void)
    translate([cx, cy, 0])
        annulus(collar_outer_r, collar_inner_r, collar_h);

    // 3. Rib web with radial slots
    difference() {
        // Rib web base: annular region between collar and rim, clipped by bounding box
        intersection() {
            translate([cx, cy, 0])
                annulus(rib_arc_outer, rib_arc_inner, rib_h);

            // Asymmetric bounding box (offset center in Y)
            translate([(rib_left + rib_right) / 2, (rib_front + rib_back) / 2, 0])
                cube([rib_bbox_l, rib_bbox_w, rib_h + 0.01], center=true);
        }

        // Subtract radial slot-like openings
        translate([cx, cy, 0])
            for (i = [0:num_slots - 1]) {
                rotate([0, 0, slot_start_angle + i * 360 / num_slots])
                    annular_wedge(
                        rib_arc_outer + 0.005,
                        rib_arc_inner - 0.005,
                        slot_angular_width,
                        rib_h + 0.02
                    );
            }
    }
}