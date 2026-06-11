// ============================================================
// Parametric stepped platform with side rails, cross wall, and
// bottom relief — all features are additive solids
// ============================================================

// --- Base slab ---
base_length      = 60;   // front-to-back (Y)
base_width       = 40;   // left-to-right (X)
base_thickness   = 3;    // thin slab height (Z)

// --- Raised rear section ---
front_exposed    = 20;   // length of bare front strip left exposed
raised_height    = 6;    // height of raised section above base top

// --- Narrow side strips flanking the raised section ---
side_strip_w     = 4;    // width of each side strip (X)
side_strip_extra = 4;    // additional height above raised section top

// --- Thin transverse wall with real internal opening ---
wall_thick      = 2;     // wall thickness in Y (very thin)
wall_y_pos      = 35;    // Y position measured from front edge
opening_d       = 8;     // through-opening diameter

// --- Bottom step (makes underside non-flat) ---
step_depth      = 3;     // extension below base bottom surface
step_length     = 25;    // Y extent of the lower step
step_width      = 30;    // X extent of the lower step

$fn = 80;

// ============================================================
// Derived helpers
// ============================================================
raised_len  = base_length - front_exposed;  // rear raised section length
total_rail  = raised_height + side_strip_extra;  // total rail height above base
wall_height = total_rail;                    // cross wall reaches same top level

// ============================================================
// Assembly — every feature is added as solid material
// ============================================================
union() {

    // 1. Thin rectangular base slab
    cube([base_width, base_length, base_thickness]);

    // 2. Larger raised rectangular portion at the rear
    translate([0, front_exposed, base_thickness])
        cube([base_width, raised_len, raised_height]);

    // 3. Left narrow raised strip along the raised area
    translate([0, front_exposed, base_thickness + raised_height])
        cube([side_strip_w, raised_len, side_strip_extra]);

    // 4. Right narrow raised strip along the raised area
    translate([base_width - side_strip_w, front_exposed, base_thickness + raised_height])
        cube([side_strip_w, raised_len, side_strip_extra]);

    // 5. Thin transverse wall with a real internal through-opening
    difference() {
        translate([0, wall_y_pos, base_thickness])
            cube([base_width, wall_thick, wall_height]);
        // Through-opening piercing the thin wall (Y direction)
        translate([base_width / 2,
                   wall_y_pos + wall_thick / 2,
                   base_thickness + wall_height / 2])
            rotate([90, 0, 0])
                cylinder(d = opening_d,
                         h = wall_thick + 1,   // overshoot guarantees clean cut
                         center = true);
    }

    // 6. Bottom step — aligned continuation reaching below the base,
    //    so the underside is not a single flat level
    translate([(base_width - step_width) / 2,
               front_exposed,
               -step_depth])
        cube([step_width, step_length, step_depth]);
}