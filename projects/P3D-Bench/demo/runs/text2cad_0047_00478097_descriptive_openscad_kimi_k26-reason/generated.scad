// Outer block dimensions
outer_w = 80;
outer_d = 60;
outer_h = 30;

// Rim and cavity depths
rim_t = 2;
upper_h = 10;
mid_h = 8;
deep_h = 10;

// Plan insets for each cavity step
mid_inset = 4;
deep_inset = 3;

// Shift of deepest pocket from center
deep_shift_x = 6;
deep_shift_y = -4;

// External projection on +X side
proj_w = 24;
proj_d = 6;
proj_h = 10;
proj_y_offset = 0;

// Side recess above projection
side_rec_w = 16;
side_rec_h = 8;
side_rec_depth = 3;
side_rec_z = 12;
side_rec_y_offset = 0;

$fn = 50;

// Derived cavity sizes
upper_w = outer_w - 2 * rim_t;
upper_d = outer_d - 2 * rim_t;
mid_w = upper_w - 2 * mid_inset;
mid_d = upper_d - 2 * mid_inset;
deep_w = mid_w - 2 * deep_inset;
deep_d = mid_d - 2 * deep_inset;

// Main solid with added side projection
module body_with_boss() {
    union() {
        cube([outer_w, outer_d, outer_h]);
        translate([outer_w, (outer_d - proj_w) / 2 + proj_y_offset, 0])
            cube([proj_d, proj_w, proj_h]);
    }
}

// Nested stepped cavity cut from top
module cavity_cuts() {
    // Upper broad recess
    translate([rim_t, rim_t, outer_h - upper_h])
        cube([upper_w, upper_d, upper_h + 0.01]);

    // Middle inset step
    translate([rim_t + mid_inset, rim_t + mid_inset, outer_h - upper_h - mid_h])
        cube([mid_w, mid_d, mid_h + 0.01]);

    // Deepest pocket, shifted to one side
    translate([
        (outer_w - deep_w) / 2 + deep_shift_x,
        (outer_d - deep_d) / 2 + deep_shift_y,
        outer_h - upper_h - mid_h - deep_h
    ])
        cube([deep_w, deep_d, deep_h + 0.01]);
}

// Recess on +X face above projection
module side_recess() {
    translate([
        outer_w - side_rec_depth,
        (outer_d - side_rec_w) / 2 + side_rec_y_offset,
        side_rec_z
    ])
        cube([side_rec_depth + 0.01, side_rec_w, side_rec_h]);
}

// Assembly
difference() {
    body_with_boss();
    cavity_cuts();
    side_recess();
}