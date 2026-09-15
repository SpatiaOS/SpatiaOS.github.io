// OpenSCAD model: Channel base with end tab and centered annular posts
// All dimensions in millimeters, suitable for 3D printing/STL export

// ----------------------
// Global Parameters
// ----------------------
$fn = 64;  // Surface smoothness for curved features (higher = smoother)

// Base plate dimensions
base_length = 120;    // Total base length (along channel axis, X direction)
base_width = 40;      // Total base width (Y direction)
base_thickness = 4;   // Thickness of flat base plate (Z direction)

// Tall side wall parameters (forms open channel, tallest features)
wall_thickness = 3;   // Thickness of each long side wall
wall_height = 10;     // Height of side walls above base (posts match this maximum height)

// Short end tab parameters (lower stepped rectangular addition)
tab_thickness = 8;    // Thickness of end tab along the channel length
tab_height = 5;       // Height of tab above base (must be less than wall_height for step)

// Annular post parameters (hollow ring posts inside channel)
post_outer_dia = 8;   // Outer diameter of cylindrical posts
post_inner_dia = 4;   // Inner diameter of post central openings
post_count = 5;       // Number of posts in the centered row
post_margin_from_tab = 15;  // Gap from inner face of end tab to first post center
post_margin_from_end = 15;  // Gap from open channel end to last post center

// Derived position constants
channel_center_y = base_width / 2;  // Y centerline of the channel
tab_inner_x = tab_thickness;        // X position of inner face of end tab
first_post_x = tab_inner_x + post_margin_from_tab;  // First post center X
last_post_x = base_length - post_margin_from_end;   // Last post center X

// ----------------------
// Reusable Modules
// ----------------------
// Hollow annular post that sits on the base top, with through-hole (no base cutout)
// x,y: center coordinates of post
// od: outer diameter, id: inner central hole diameter
// h: post height above base
// base_z: Z coordinate of base top surface
module annular_post(x, y, od, id, h, base_z) {
    translate([x, y, base_z]) {
        difference() {
            // Outer solid cylinder of the post
            cylinder(d=od, h=h, center=false);
            // Central through-hole: extends slightly above post for clean cut,
            // starts exactly at post bottom to avoid cutting into the base
            cylinder(d=id, h=h + 0.2, center=false);
        }
    }
}

// ----------------------
// Main Model Assembly
// ----------------------
union() {
    // Flat rectangular base plate
    cube([base_length, base_width, base_thickness]);

    // Long side walls (taller rectangular channel walls)
    // Left wall
    translate([0, 0, base_thickness]) {
        cube([base_length, wall_thickness, wall_height]);
    }
    // Right wall
    translate([0, base_width - wall_thickness, base_thickness]) {
        cube([base_length, wall_thickness, wall_height]);
    }

    // Short lower end tab (stepped rectangular addition)
    translate([0, wall_thickness, base_thickness]) {
        cube([tab_thickness, base_width - 2*wall_thickness, tab_height]);
    }

    // Centered row of annular posts, evenly spaced in channel
    for (i = [0:post_count-1]) {
        // Calculate post X position (auto-centers single post, evenly spaces multiple)
        post_x = post_count == 1 ?
            (first_post_x + last_post_x) / 2 :
            first_post_x + i * (last_post_x - first_post_x) / (post_count - 1);
        annular_post(post_x, channel_center_y, post_outer_dia, post_inner_dia, wall_height, base_thickness);
    }
}