// Base dimensions
base_l = 0.75;
base_w = 0.375;
base_h = 0.0375;

// Raised wall material (front and back walls)
wall_z = base_h;
wall_top = 0.1312;
wall_h = wall_top - wall_z;
front_th = 0.0281;
back_th = 0.0375;

// Narrow left-end solid inside channel
pad_x = 0;
pad_y = front_th;
pad_z = base_h;
pad_top = 0.0937;
pad_l = 0.0319;
pad_w = 0.3094;
pad_h = pad_top - pad_z;

// Annular posts
post_y = 0.1875;
post_z = base_h;
post_top = 0.1312;
post_h = post_top - post_z;
post_x = [0.15, 0.3, 0.45, 0.6];
post_ro = [0.0469, 0.0469, 0.0562, 0.0562];
post_ri = [0.0188, 0.0197, 0.0216, 0.0234];

$fn = 100;

// Main base plate
module base() {
    cube([base_l, base_w, base_h]);
}

// Raised front and back walls leaving channel open
module raised_walls() {
    translate([0, 0, wall_z])
        cube([base_l, front_th, wall_h]);
    translate([0, base_w - back_th, wall_z])
        cube([base_l, back_th, wall_h]);
}

// Narrow rectangular solid at left end of channel
module left_pad() {
    translate([pad_x, pad_y, pad_z])
        cube([pad_l, pad_w, pad_h]);
}

// Single annular cylindrical post
module annular_post(x, outer_r, inner_r) {
    translate([x, post_y, post_z])
        difference() {
            cylinder(h = post_h, r = outer_r);
            translate([0, 0, -1])
                cylinder(h = post_h + 2, r = inner_r);
        }
}

// Assembly
union() {
    base();
    raised_walls();
    left_pad();
    for (i = [0 : 3])
        annular_post(post_x[i], post_ro[i], post_ri[i]);
}