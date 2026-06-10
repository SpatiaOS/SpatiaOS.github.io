// Parameters
base_length = 0.375;
base_width = 0.75;
base_height = 0.013393;
base_corner_r = 0.067;          // Corner radius derived from footprint geometry
$fn = 50;

body_reach = 0.2277;
body_height = body_reach - base_height;

// Inner opening for frame profile (constant wall = corner radius)
inner_length = base_length - 2 * base_corner_r;
inner_width = base_width - 2 * base_corner_r;

// Raised sleeve/post
sleeve_length = 0.066964;
sleeve_width = 0.133929;
sleeve_height = 0.214286;
sleeve_left = 0.308;
sleeve_front = 0.308;
sleeve_wall = 0.0134;

// Lower continuation post
lower_top = -0.0134;
lower_bottom = -0.2277;
lower_height = lower_top - lower_bottom;
lower_length = sleeve_length * 0.8;
lower_width = sleeve_width * 0.8;

// Side blind holes
hole_radius = 0.0067;
hole_depth = 0.0134;
hole_x = 0.3616;
hole_y1 = 0.0672;
hole_y2 = 0.6828;
hole_z = (0.1674 + 0.1808) / 2;

// 2D rounded rectangle with exact bounding box
module rounded_rect(w, h, r) {
    dx = w/2 - r;
    dy = h/2 - r;
    hull() {
        translate([-dx, -dy]) circle(r);
        translate([ dx, -dy]) circle(r);
        translate([-dx,  dy]) circle(r);
        translate([ dx,  dy]) circle(r);
    }
}

// Base & body profile: outer rounded rect with central rectangular opening
module frame_profile() {
    difference() {
        rounded_rect(base_length, base_width, base_corner_r);
        square([inner_length, inner_width], center=true);
    }
}

// Sleeve profile: hollow rectangular tube
module sleeve_profile() {
    difference() {
        square([sleeve_length, sleeve_width], center=true);
        square([sleeve_length - 2*sleeve_wall, sleeve_width - 2*sleeve_wall], center=true);
    }
}

// Main assembly
difference() {
    union() {
        // Base flange (z = 0 to base_height)
        linear_extrude(height = base_height)
            frame_profile();

        // Second upper solid (z = base_height to body_reach)
        translate([0, 0, base_height])
            linear_extrude(height = body_height)
            frame_profile();

        // Raised sleeve/post on right wall
        translate([sleeve_left + sleeve_length/2, sleeve_front + sleeve_width/2, body_reach])
            linear_extrude(height = sleeve_height)
            sleeve_profile();

        // Lower continuation post beneath sleeve, sharing right edge
        translate([base_length - lower_length/2, sleeve_front + sleeve_width/2, lower_bottom + lower_height/2])
            cube([lower_length, lower_width, lower_height], center=true);
    }

    // Two blind circular holes from right face
    for (y = [hole_y1, hole_y2]) {
        translate([hole_x, y, hole_z])
            rotate([0, 90, 0])
            cylinder(h = hole_depth, r = hole_radius, center = false);
    }
}