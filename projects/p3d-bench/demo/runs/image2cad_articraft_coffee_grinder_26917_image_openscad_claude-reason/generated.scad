// Classic Manual Coffee/Spice Grinder
// Square body with decorative corner pillars, round bowl, and crank handle

$fn = 100;

// ===== Dimensional Parameters =====

// Base plate
base_w       = 84;    // outer width
base_h       = 8;     // total height
base_rim_h   = 3;     // height of wider rim portion
fillet_r     = 2;     // corner rounding radius

// Main body (square box)
body_w       = 64;    // width of main body
body_h       = 48;    // height of main body
body_r       = 2;     // body edge rounding
pillar_r     = 5;     // corner pillar radius
pillar_inset = 3;     // pillar center distance from body corner

// Top plate
top_w        = 84;    // outer width (same as base)
top_h        = 8;     // total height
top_rim_h    = 3;     // height of wider rim portion

// Bowl (truncated cone with rim)
bowl_top_r   = 38;    // top outer radius
bowl_bot_r   = 27;    // bottom outer radius
bowl_h       = 48;    // height of bowl wall
bowl_wall    = 2.5;   // wall thickness
rim_r        = 3.5;   // rim torus cross-section radius

// Support collar on top plate
collar_or    = 31;    // outer radius
collar_ir    = 27;    // inner radius (matches bowl bottom)
collar_h     = 5;     // height

// Center shaft
shaft_r      = 3.5;   // shaft radius

// Crank handle
crank_len    = 44;    // arm length from center
crank_w      = 8;     // arm end width
crank_h      = 4;     // arm thickness
ball_r       = 6.5;   // ball knob radius
nut_r        = 5.5;   // hex nut circumradius
nut_h        = 5;     // hex nut height

// Drawer face details
drawer_w     = 54;    // drawer panel width
drawer_h     = 30;    // drawer panel height
drawer_d     = 1.5;   // drawer panel protrusion
label_w      = 38;    // oval label width
label_h      = 12;    // oval label height
label_d      = 1.2;   // label depth
knob_r       = 5;     // drawer knob radius
knob_h       = 4;     // drawer knob protrusion

// ===== Helper Modules =====

// Rounded square 2D profile
module rounded_sq(size, r) {
    offset(r = r)
        square([size - 2*r, size - 2*r], center = true);
}

// Stepped plate with optional flip (wider rim on top vs bottom)
module stepped_plate(w, h, rim_h, flip = false) {
    inner_w = w - 8;
    if (!flip) {
        // Wider rim on bottom (base style)
        linear_extrude(rim_h)
            rounded_sq(w, fillet_r);
        translate([0, 0, rim_h])
            linear_extrude(h - rim_h)
            rounded_sq(inner_w, fillet_r);
    } else {
        // Wider rim on top (top plate style)
        linear_extrude(h - rim_h)
            rounded_sq(inner_w, fillet_r);
        translate([0, 0, h - rim_h])
            linear_extrude(rim_h)
            rounded_sq(w, fillet_r);
    }
}

// Main body with decorative corner pillars
module grinder_body() {
    // Central box
    linear_extrude(body_h)
        rounded_sq(body_w, body_r);

    // Corner pillars positioned at body corners
    corner_offset = body_w / 2 - pillar_inset;
    for (x = [-1, 1])
        for (y = [-1, 1])
            translate([x * corner_offset, y * corner_offset, 0])
                cylinder(r = pillar_r, h = body_h);
}

// Front face details: drawer panel, label, and knob
module front_face_details() {
    // Slightly raised drawer panel
    linear_extrude(drawer_d)
        square([drawer_w, drawer_h], center = true);

    // Oval label plate (raised)
    translate([0, 5, drawer_d])
        linear_extrude(label_d)
        resize([label_w, label_h])
        circle(d = 20);

    // Label border ring
    translate([0, 5, drawer_d - 0.3])
        linear_extrude(0.6)
        difference() {
            resize([label_w + 3, label_h + 3]) circle(d = 20);
            resize([label_w - 0.5, label_h - 0.5]) circle(d = 20);
        }

    // Drawer knob (lower left)
    translate([-17, -8, drawer_d]) {
        cylinder(r1 = knob_r, r2 = knob_r * 0.8, h = knob_h);
        translate([0, 0, knob_h])
            sphere(r = knob_r * 0.65);
    }

    // Small cylindrical detail (lower right)
    translate([22, -4, drawer_d]) {
        cylinder(r1 = 3, r2 = 2, h = 5);
        translate([0, 0, 5])
            sphere(r = 2);
    }
}

// Bowl (hollow truncated cone with rolled rim)
module grinder_bowl() {
    difference() {
        union() {
            // Outer frustum wall
            cylinder(h = bowl_h, r1 = bowl_bot_r, r2 = bowl_top_r);

            // Rolled rim at top edge
            translate([0, 0, bowl_h])
                rotate_extrude()
                translate([bowl_top_r - rim_r, 0])
                circle(r = rim_r);
        }
        // Hollow interior
        translate([0, 0, bowl_wall])
            cylinder(h = bowl_h + rim_r + 1,
                     r1 = bowl_bot_r - bowl_wall,
                     r2 = bowl_top_r - bowl_wall);
    }
}

// Support collar/ring where bowl sits on top plate
module support_collar() {
    difference() {
        cylinder(r = collar_or, h = collar_h);
        translate([0, 0, -0.5])
            cylinder(r = collar_ir, h = collar_h + 1);
    }
}

// Grinding paddles inside bowl attached to shaft
module grinding_paddles(bowl_z) {
    paddle_h = 20;
    paddle_w = 2;
    paddle_len = bowl_bot_r - bowl_wall - shaft_r - 4;
    
    translate([0, 0, bowl_z + bowl_wall + 3]) {
        for (a = [0, 180]) {
            rotate([0, 0, a])
                translate([shaft_r + 1, -paddle_w/2, 0])
                rotate([0, -8, 0])
                cube([paddle_len, paddle_w, paddle_h]);
        }
    }
}

// Crank handle assembly (shaft, arm, nut, ball knob)
module crank_assembly(bowl_z) {
    total_shaft_h = bowl_h + 16;
    arm_z = total_shaft_h - nut_h - crank_h - 1;

    // Vertical center shaft through entire bowl
    translate([0, 0, bowl_z])
        cylinder(r = shaft_r, h = total_shaft_h);

    // Grinding paddles
    grinding_paddles(bowl_z);

    // Horizontal crank arm (hull between two cylinders)
    translate([0, 0, bowl_z + arm_z])
        hull() {
            cylinder(r = shaft_r + 2.5, h = crank_h);
            translate([crank_len, 0, 0])
                cylinder(r = crank_w / 2, h = crank_h);
        }

    // Hex nut on top of shaft
    translate([0, 0, bowl_z + total_shaft_h - nut_h])
        cylinder(r = nut_r, h = nut_h, $fn = 6);

    // Ball knob at end of crank arm
    translate([crank_len, 0, bowl_z + arm_z + crank_h / 2])
        sphere(r = ball_r);
}

// ===== Main Assembly =====

// Calculate Z positions for each component
z_base    = 0;
z_body    = z_base + base_h;
z_top     = z_body + body_h;
z_collar  = z_top + top_h;
z_bowl    = z_collar;

// 1. Base plate (wider rim on bottom)
color("Silver")
translate([0, 0, z_base])
    stepped_plate(base_w, base_h, base_rim_h, flip = false);

// 2. Main body with corner pillars
color("Silver")
translate([0, 0, z_body])
    grinder_body();

// 3. Front face details (positioned on -Y face of body)
color("Silver")
translate([0, -body_w / 2, z_body + body_h / 2])
    rotate([90, 0, 0])
    front_face_details();

// 4. Top plate (wider rim on top to support bowl)
color("Silver")
translate([0, 0, z_top])
    stepped_plate(top_w, top_h, top_rim_h, flip = true);

// 5. Support collar where bowl sits
color("Silver")
translate([0, 0, z_collar])
    support_collar();

// 6. Bowl (truncated cone with rolled rim)
color("Silver")
translate([0, 0, z_bowl])
    grinder_bowl();

// 7. Crank handle assembly with grinding paddles
color("Silver")
crank_assembly(z_bowl);