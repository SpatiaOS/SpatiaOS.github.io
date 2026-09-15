// ============================================================
//  Bracket / housing:  upright arc-shell body on a base plate
//  with a small sleeve boss and a large annular hub,
//  plus two stepped recesses cut from the underside.
//  All dimensions in millimetres (model units as given).
// ============================================================

$fn = 120;                 // smooth curves for the small radii

// ---------- Reference envelope (main upright body) ----------
env_l   = 0.303436;        // X extent (left -> right)
env_w   = 0.502485;        // Y extent (front -> back)
env_h   = 0.468362;        // Z reference height
body_h  = 0.4684;          // upright solid height above base datum

corner_r = 0.060;          // corner rounding of the envelope profile
wall_t   = 0.050;          // shell wall thickness (open curved interior)
mouth_w  = 0.110;          // width of the front opening of the shell

// ---------- Base plate (base datum = z0, plate grows downward) ----------
plate_t  = 0.203;          // base slab thickness

// ---------- Small circular sleeve (above the base plane) ----------
s_x      = 0.1542;         // axis, from left edge
s_y      = 0.4232;         // axis, from front edge
s_r_out  = 0.0714;         // sleeve wall outline / stepped face radius
s_r_bore = 0.0250;         // central bore (true void)
s_h      = 0.1030;         // sleeve projection above the base plane

// ---------- Large annular hub (above the base plane) ----------
l_x      = 0.5416;         // axis, from left edge
l_y      = 0.2448;         // axis, from front edge
l_r_out  = 0.2084;         // outer radius
l_r_ann  = 0.1756;         // repeated annular boundary radius
l_r_bore = 0.0546;         // central opening radius
l_h      = 0.2030;         // hub height above the base plane

// ---------- Underside stepped recesses (from base underside up) ----------
rec_l_d  = 0.1280;         // large recess depth   (radius l_r_ann)
rec_s_d  = 0.1764;         // small recess depth   (radius s_r_out)

eps      = 0.0020;         // boolean clearance

// derived
inner_r  = env_l/2 - wall_t;   // radius of the arc-based interior

// ============================================================
//  2D profiles
// ============================================================

// Rounded rectangle flush to the four reference extents
module envelope_profile() {
    offset(r = corner_r) offset(delta = -corner_r)
        square([env_l, env_w]);
}

// Arc based (stadium) interior cavity of the shell
module interior_profile() {
    hull() {
        translate([env_l/2, wall_t + inner_r])          circle(r = inner_r);
        translate([env_l/2, env_w - wall_t - inner_r])  circle(r = inner_r);
    }
}

// Shell profile: rounded outer boundary, open curved interior, front mouth
module shell_profile() {
    difference() {
        envelope_profile();
        interior_profile();
        translate([env_l/2 - mouth_w/2, -eps])
            square([mouth_w, wall_t + 2*eps]);
    }
}

// ============================================================
//  3D components
// ============================================================

// Base plate: hull of the envelope footprint and the large hub circle
module base_plate() {
    translate([0, 0, -plate_t])
        linear_extrude(height = plate_t)
            hull() {
                envelope_profile();
                translate([l_x, l_y]) circle(r = l_r_out);
            }
}

// Main upright body (open curved shell) rising to body_h
module body_shell() {
    linear_extrude(height = body_h)
        shell_profile();
}

// Small coaxial sleeve standing on the base plane
module small_sleeve() {
    translate([s_x, s_y, 0])
        cylinder(h = s_h, r = s_r_out);
}

// Large annular hub: ring wall between l_r_out and l_r_ann
module large_hub() {
    translate([l_x, l_y, 0])
        difference() {
            cylinder(h = l_h, r = l_r_out);
            translate([0, 0, -eps])
                cylinder(h = l_h + 2*eps, r = l_r_ann);
        }
}

// ============================================================
//  Assembly:  solids  minus  underside recesses and bores
// ============================================================
module part() {
    difference() {

        // ---- additive solids ----
        union() {
            base_plate();
            body_shell();
            small_sleeve();
            large_hub();
        }

        // ---- stepped recess under the large hub (0 .. rec_l_d) ----
        translate([l_x, l_y, -plate_t - eps])
            cylinder(h = rec_l_d + eps, r = l_r_ann);

        // ---- stepped recess under the small sleeve (0 .. rec_s_d) ----
        translate([s_x, s_y, -plate_t - eps])
            cylinder(h = rec_s_d + eps, r = s_r_out);

        // ---- through bore of the large tier ----
        translate([l_x, l_y, -plate_t - eps])
            cylinder(h = plate_t + l_h + 2*eps, r = l_r_bore);

        // ---- through bore of the small tier ----
        translate([s_x, s_y, -plate_t - eps])
            cylinder(h = plate_t + s_h + 2*eps, r = s_r_bore);
    }
}

part();