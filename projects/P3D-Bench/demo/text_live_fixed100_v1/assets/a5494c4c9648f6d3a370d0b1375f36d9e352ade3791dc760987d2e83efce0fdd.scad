// Parametric stepped recess block with side projection and recess
// Coordinate system:
//   X: Left-right (0 = left edge of main body, +X = right)
//   Y: Front-back (0 = front edge of main body, +Y = back)
//   Z: Vertical (0 = underside/bottom, +Z = up)
$fn = 32;
eps = 0.002; // Small epsilon for clean booleans, eliminates coplanar faces

// ------------------------------
// Main reference body dimensions
// ------------------------------
main_length = 0.702127;
main_width = 0.524964;
main_height = 0.2103;
bottom_wall = 0.0215; // Bottom wall thickness below lowest pocket

// ------------------------------
// Top shallow recess (top surface cut)
// ------------------------------
top_rec_x = 0.667793;
top_rec_y = 0.490631;
top_rec_left_inset = 0.0171;
top_rec_front_inset = 0.0172;
top_rec_z_bottom = 0.1888;
top_rec_depth = 0.0215;

// ------------------------------
// Middle stepped cut (continues top opening downward)
// ------------------------------
mid_cut_x = 0.650626;
mid_cut_y = 0.46488;
mid_cut_left_inset = 0.0257;
mid_cut_front_inset = 0.03;
mid_cut_z_bottom = 0.0729;
mid_cut_depth = 0.1159;

// ------------------------------
// Lower offset pocket (deepest internal cut)
// ------------------------------
lower_pkt_x = 0.567882;
lower_pkt_y = 0.447713;
lower_pkt_left_inset = 0.0999;
lower_pkt_front_inset = 0.0386;
lower_pkt_z_bottom = 0.0215;
lower_pkt_depth = 0.0515;

// ------------------------------
// Left side solid projection (external overhang + internal ledge)
// ------------------------------
proj_x = 0.130618;
proj_y = 0.463588;
proj_left_overhang = 0.0479; // Overhang past main body left edge
proj_front_inset = 0.03;
proj_z_bottom = 0.073;
proj_thickness = 0.0146;

// ------------------------------
// Left side recess (cut above side projection)
// ------------------------------
rec_x_depth = 0.0343;
rec_y = 0.3674;
rec_front_inset = 0.0546;
rec_z_bottom = 0.0876;
rec_height = 0.101285;

// ------------------------------
// Model construction
// ------------------------------
difference() {
    union() {
        // Base body with primary internal cuts
        difference() {
            // Start with solid main reference block
            cube([main_length, main_width, main_height]);

            // Remove top shallow recess, extend slightly past top surface
            translate([top_rec_left_inset, top_rec_front_inset, top_rec_z_bottom])
                cube([top_rec_x, top_rec_y, top_rec_depth + eps]);

            // Remove middle stepped cut, extend up to connect cleanly with top recess
            translate([mid_cut_left_inset, mid_cut_front_inset, mid_cut_z_bottom])
                cube([mid_cut_x, mid_cut_y, mid_cut_depth + eps]);

            // Remove lower pocket, extend up into (already void) middle cut area
            translate([lower_pkt_left_inset, lower_pkt_front_inset, lower_pkt_z_bottom])
                cube([lower_pkt_x, lower_pkt_y, lower_pkt_depth + eps]);
        }

        // Add solid side projection after internal cuts to preserve internal ledge
        // Extend slightly down to mate cleanly with support walls below
        translate([-proj_left_overhang, proj_front_inset, proj_z_bottom - eps])
            cube([proj_x, proj_y, proj_thickness + eps]);
    }

    // Remove side recess last, start slightly above projection to avoid cutting it
    translate([-eps, rec_front_inset, rec_z_bottom + eps/2])
        cube([rec_x_depth + eps, rec_y, rec_height + eps]);
}