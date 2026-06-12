// === Parameters ===

// Main body dimensions
body_length = 80;
body_width  = 60;
body_height = 40;

// Rim / top recess (broad upper pocket)
rim_thickness   = 3;      // thin rim wall around upper recess
top_recess_depth = 8;     // depth of the uppermost pocket

// Middle stepped pocket (inset from upper recess walls)
mid_inset       = 5;      // additional inset per side from upper recess
mid_recess_depth = 10;    // depth of middle pocket

// Deepest pocket (shifted to one side for uneven ledges)
deep_inset_front = 8;     // inset from mid pocket on front side
deep_inset_back  = 3;     // inset from mid pocket on back side (less = shifted)
deep_inset_left  = 6;     // inset from mid pocket on left
deep_inset_right = 10;    // inset from mid pocket on right (asymmetric)
deep_recess_depth = 10;   // depth of deepest pocket
// Solid bottom remains below deepest pocket

// Side projection (boss) along one side (+Y side)
proj_length  = 30;        // length of projection along X
proj_width   = 8;         // how far it sticks out in Y
proj_height  = 15;        // height of projection
proj_x_offset = 10;       // offset from left edge of body
proj_z_offset = 0;        // sits on bottom of body

// Side recess above the projection (stepped tier on same face)
side_recess_length = proj_length + 6;  // slightly wider than projection
side_recess_depth  = 4;               // how deep into body wall (Y)
side_recess_height = 10;              // vertical extent
side_recess_x_offset = proj_x_offset - 3;
side_recess_z_offset = proj_z_offset + proj_height; // sits above projection

// Resolution
$fn = 32;

// === Derived dimensions for cavity cuts ===

// Upper recess cavity
upper_cav_x = body_length - 2 * rim_thickness;
upper_cav_y = body_width  - 2 * rim_thickness;

// Middle recess cavity
mid_cav_x = upper_cav_x - 2 * mid_inset;
mid_cav_y = upper_cav_y - 2 * mid_inset;

// Deep pocket cavity (asymmetric offsets from middle cavity edges)
deep_cav_x = mid_cav_x - deep_inset_left - deep_inset_right;
deep_cav_y = mid_cav_y - deep_inset_front - deep_inset_back;

// Deep pocket position relative to middle cavity origin
deep_origin_x = rim_thickness + mid_inset + deep_inset_left;
deep_origin_y = rim_thickness + mid_inset + deep_inset_front;

// === Assembly ===

// Combine body + projection, then subtract all cavities
union() {
    difference() {
        union() {
            // 1. Main rectangular body
            cube([body_length, body_width, body_height]);

            // 5. Added rectangular projection on +Y side
            translate([proj_x_offset, body_width, proj_z_offset])
                cube([proj_length, proj_width, proj_height]);
        }

        // 2. Upper recess — broad pocket from top, thin rim walls
        translate([rim_thickness, rim_thickness, body_height - top_recess_depth])
            cube([upper_cav_x, upper_cav_y, top_recess_depth + 1]); // +1 to clear top

        // 3. Middle stepped pocket — smaller inset, goes deeper
        translate([
            rim_thickness + mid_inset,
            rim_thickness + mid_inset,
            body_height - top_recess_depth - mid_recess_depth
        ])
            cube([mid_cav_x, mid_cav_y, mid_recess_depth + 1]);

        // 4. Deepest pocket — shifted to one side, solid bottom remains
        translate([
            deep_origin_x,
            deep_origin_y,
            body_height - top_recess_depth - mid_recess_depth - deep_recess_depth
        ])
            cube([deep_cav_x, deep_cav_y, deep_recess_depth + 1]);

        // 6. Side recess above projection on +Y face (cut into body wall)
        translate([
            side_recess_x_offset,
            body_width - side_recess_depth,
            side_recess_z_offset
        ])
            cube([side_recess_length, side_recess_depth + 1, side_recess_height]);
    }
}