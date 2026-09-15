// Nested stepped-cavity body with side tab and side recess (mm)
body_length = 70;
body_width  = 45;
body_height = 20;

rim_width    = 2.5;
upper_depth  = 3;

mid_length = 50;
mid_width  = 28;
mid_depth  = 6;

deep_length = 32;
deep_width  = 20;
deep_depth  = 7;
deep_shift  = 4;          // extra inset toward -X inside mid pocket

proj_length = 20;
proj_width  = 7;
proj_height = 8;

recess_length = 20;
recess_depth  = 2;
recess_height = 9;        // sits directly above the projection

eps = 0.05;

module body_block() {
    cube([body_length, body_width, body_height]);
}

module side_projection() {
    translate([(body_length - proj_length) / 2, body_width, 0])
        cube([proj_length, proj_width, proj_height]);
}

module upper_recess() {
    translate([rim_width, rim_width, body_height - upper_depth])
        cube([
            body_length - 2 * rim_width,
            body_width  - 2 * rim_width,
            upper_depth + eps
        ]);
}

module mid_pocket() {
    mx = (body_length - mid_length) / 2;
    my = (body_width  - mid_width)  / 2;
    translate([mx, my, body_height - upper_depth - mid_depth])
        cube([mid_length, mid_width, upper_depth + mid_depth + eps]);
}

module deep_pocket() {
    mx = (body_length - mid_length) / 2;
    my = (body_width  - mid_width)  / 2;
    dx = mx + deep_shift;
    dy = my + (mid_width - deep_width) / 2;
    dz = body_height - upper_depth - mid_depth - deep_depth;
    translate([dx, dy, dz])
        cube([
            deep_length,
            deep_width,
            upper_depth + mid_depth + deep_depth + eps
        ]);
}

module side_recess() {
    translate([
        (body_length - recess_length) / 2,
        body_width - recess_depth,
        proj_height
    ])
        cube([recess_length, recess_depth + eps, recess_height]);
}

difference() {
    union() {
        body_block();
        side_projection();
    }
    upper_recess();
    mid_pocket();
    deep_pocket();
    side_recess();
}