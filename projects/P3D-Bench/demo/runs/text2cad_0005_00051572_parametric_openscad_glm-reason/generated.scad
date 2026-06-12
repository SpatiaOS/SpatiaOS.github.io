// ============================================
// Parametric Dimensions
// ============================================

// Base block
base_length = 0.75;
base_width = 0.375;
base_height = 0.0375;

// Raised wall parameters
raised_height = 0.0937;       // extrusion from z=0.0375 to z=0.1312
front_wall_t = 0.0281;        // front wall thickness
back_wall_t = 0.0375;         // back wall thickness
left_wall_t = 0.0319;         // left wall thickness (narrower solid width)
right_wall_t = 0.0319;        // right wall thickness

// Narrower solid at left end (short left wall / step)
narrower_y = 0.3094;          // y-span between front and back channel walls
narrower_height = 0.05625;    // from z=0.0375 to z=0.0937

// Annular post parameters
post_height = 0.0937;         // from z=0.0375 to z=0.1312
post_y_center = 0.1875;       // centered across width

post1_x = 0.15;  post1_or = 0.0469;  post1_ir = 0.0188;
post2_x = 0.30;  post2_or = 0.0469;  post2_ir = 0.0197;
post3_x = 0.45;  post3_or = 0.0562;  post3_ir = 0.0216;
post4_x = 0.60;  post4_or = 0.0562;  post4_ir = 0.0234;

eps = 0.001;  // small overlap for clean boolean operations
$fn = 100;

// ============================================
// Annular Post Module
// ============================================
module annular_post(x, y, outer_r, inner_r) {
    translate([x, y, base_height])
        cylinder(h=post_height, r=outer_r);
}

// ============================================
// Main Model
// ============================================
difference() {
    union() {
        // 1. Rectangular base
        cube([base_length, base_width, base_height]);

        // 2. Raised walls: outer block minus open channel
        difference() {
            // Outer raised block flush with base edges
            translate([0, 0, base_height])
                cube([base_length, base_width, raised_height]);

            // Channel cutout — removes interior, open on left side
            // so the left wall is defined only by the shorter narrower solid
            translate([0, front_wall_t, base_height - eps])
                cube([
                    base_length - right_wall_t,
                    base_width - front_wall_t - back_wall_t,
                    raised_height + 2 * eps
                ]);
        }

        // 3. Narrower rectangular solid at left end (short left wall step)
        //    Sits on base top from z=0.0375 to z=0.0937
        translate([0, front_wall_t, base_height])
            cube([left_wall_t, narrower_y, narrower_height]);

        // 4. Four separate annular cylindrical posts
        annular_post(post1_x, post_y_center, post1_or, post1_ir);
        annular_post(post2_x, post_y_center, post2_or, post2_ir);
        annular_post(post3_x, post_y_center, post3_or, post3_ir);
        annular_post(post4_x, post_y_center, post4_or, post4_ir);
    }

    // 5. Through holes penetrating base and posts
    translate([post1_x, post_y_center, -eps])
        cylinder(h=base_height + post_height + 2 * eps, r=post1_ir);
    translate([post2_x, post_y_center, -eps])
        cylinder(h=base_height + post_height + 2 * eps, r=post2_ir);
    translate([post3_x, post_y_center, -eps])
        cylinder(h=base_height + post_height + 2 * eps, r=post3_ir);
    translate([post4_x, post_y_center, -eps])
        cylinder(h=base_height + post_height + 2 * eps, r=post4_ir);
}