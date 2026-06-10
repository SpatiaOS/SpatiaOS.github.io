// Parameters
length = 0.375;
width = 0.75;
base_height = 0.013393;

wall_reach = 0.2277;
wall_thickness = 0.013393;

post_length = 0.066964;
post_width = 0.133929;
post_reach = 0.442;
post_z_start = 0.2277;

lower_z_start = -0.2277;
lower_z_end = -0.013393;

hole_r = 0.0067;
hole_x = 0.3616;
hole_y1 = 0.6828;
hole_y2 = 0.0672;
hole_z_start = 0.1674;
hole_z_end = 0.1808;

$fn = 100;

// Reusable 2D profile for the base (half-circle on the left)
module base_profile() {
    intersection() {
        translate([length, width / 2]) circle(r = width / 2);
        square([length, width]);
    }
}

// Reusable 2D profile for the wall (hollowed out base)
module wall_profile() {
    difference() {
        base_profile();
        offset(r = -wall_thickness) base_profile();
    }
}

// Reusable 2D profile for the post (hollow rectangular tube)
module post_profile() {
    post_y_offset = (width - post_width) / 2;
    difference() {
        // Outer footprint
        translate([length - post_length, post_y_offset])
            square([post_length, post_width]);
        // Inner void / slot-like outline
        translate([length - post_length + wall_thickness, post_y_offset + wall_thickness])
            square([post_length - 2 * wall_thickness, post_width - 2 * wall_thickness]);
    }
}

// Main solid model
difference() {
    union() {
        // 1. Main base solid (upper-side solid)
        linear_extrude(height = base_height)
            base_profile();
            
        // 2. Second upper-side solid (Wall extending to reach 0.2277)
        linear_extrude(height = wall_reach)
            wall_profile();
            
        // 3. Raised sleeve/post feature (Upper continuation)
        translate([0, 0, post_z_start])
            linear_extrude(height = post_reach - post_z_start)
                post_profile();
                
        // 4. Paired lower continuation beneath the post
        translate([0, 0, lower_z_start])
            linear_extrude(height = lower_z_end - lower_z_start)
                post_profile();
    }
    
    // Circular cuts (vertical slots forming pockets on the inner wall)
    // Occupying the narrow height band from 0.1674 to 0.1808
    translate([hole_x, hole_y1, hole_z_start])
        cylinder(h = hole_z_end - hole_z_start, r = hole_r);
        
    translate([hole_x, hole_y2, hole_z_start])
        cylinder(h = hole_z_end - hole_z_start, r = hole_r);
}