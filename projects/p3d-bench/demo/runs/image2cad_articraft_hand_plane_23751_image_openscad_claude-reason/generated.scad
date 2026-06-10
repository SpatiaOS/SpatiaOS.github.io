// =============================================
// Dual Ball Trailer Hitch Mount
// Simplified geometry for reliable STL export
// =============================================

// === Parameters ===
base_length = 200;
base_width = 105;
base_thickness = 12;
rim_height = 4;
rim_width = 4;
base_corner_r = 8;

notch_radius = 32;
notch_offset_x = 15;

// Tow balls
large_ball_dia = 50;
small_ball_dia = 44;
ball_neck_dia = 25;
ball_neck_height = 18;
ball_flange_dia = 38;
ball_flange_height = 5;
pedestal_dia = 48;
pedestal_height = 4;

large_ball_x = -68;
small_ball_x = 68;

// Central mechanism
center_lower_post_dia = 28;
center_lower_post_h = 30;
center_disc_dia = 52;
center_disc_h = 7;
center_upper_post_dia = 14;
center_upper_post_h = 12;
threaded_rod_dia = 10;
threaded_rod_h = 22;
knurled_nut_dia = 26;
knurled_nut_h = 10;
washer_dia = 22;
washer_h = 3;
bolt_head_dia = 16;
bolt_head_h = 8;

pin1_x = -22;
pin1_y = 12;
pin1_dia = 8;
pin1_h = 22;

pin2_x = -10;
pin2_y = -12;
pin2_dia = 6;
pin2_h = 16;

mount_hole_dia = 8;
mount_holes_x = 30;
mount_holes_y_spacing = 16;

thumb_screw_dia = 15;

$fn = 48;

// === Modules ===

module base_profile_2d() {
    difference() {
        offset(r = base_corner_r)
        offset(delta = -base_corner_r)
        union() {
            translate([-base_length/2, -base_width/2])
                square([base_length * 0.4, base_width]);
            translate([base_length * 0.1, -base_width/2])
                square([base_length * 0.4, base_width]);
            translate([-base_length * 0.12, -base_width * 0.38])
                square([base_length * 0.24, base_width * 0.76]);
        }
        // Side notches
        translate([-notch_offset_x, base_width/2 + 2])
            circle(r = notch_radius);
        translate([-notch_offset_x, -base_width/2 - 2])
            circle(r = notch_radius);
        translate([notch_offset_x, base_width/2 + 2])
            circle(r = notch_radius);
        translate([notch_offset_x, -base_width/2 - 2])
            circle(r = notch_radius);
    }
}

module base_plate() {
    // Solid base
    linear_extrude(height = base_thickness)
        base_profile_2d();
    
    // Raised rim
    linear_extrude(height = base_thickness + rim_height)
        difference() {
            base_profile_2d();
            offset(delta = -rim_width)
                base_profile_2d();
        }
    
    // Ball pedestals
    translate([large_ball_x, 0, base_thickness])
        cylinder(h = pedestal_height, d1 = pedestal_dia + 6, d2 = pedestal_dia);
    translate([small_ball_x, 0, base_thickness])
        cylinder(h = pedestal_height, d1 = pedestal_dia + 4, d2 = pedestal_dia - 2);
    
    // Central raised boss
    translate([0, 0, base_thickness])
        cylinder(h = 5, d1 = center_disc_dia + 8, d2 = center_lower_post_dia + 6);
}

module tow_ball(ball_d, neck_d, neck_h, flange_d, flange_h) {
    // Flange
    cylinder(h = flange_h, d1 = flange_d + 2, d2 = flange_d);
    // Neck
    translate([0, 0, flange_h])
        cylinder(h = neck_h, d = neck_d);
    // Taper
    translate([0, 0, flange_h + neck_h])
        cylinder(h = ball_d * 0.2, d1 = neck_d, d2 = ball_d * 0.55);
    // Ball with slot
    ball_cz = flange_h + neck_h + ball_d * 0.38;
    translate([0, 0, ball_cz])
        difference() {
            sphere(d = ball_d);
            translate([0, 0, ball_d * 0.3])
                cube([ball_d * 0.35, 2.5, ball_d * 0.25], center = true);
        }
}

// Simple knurled look - just a cylinder with flats
module simple_knurled(h, d) {
    intersection() {
        cylinder(h = h, d = d);
        // Cut flats around circumference
        for (i = [0:15:359]) {
            rotate([0, 0, i])
                translate([0, 0, h/2])
                    cube([d + 2, d * 0.19, h], center = true);
        }
    }
}

module central_mechanism() {
    // Lower post
    cylinder(h = center_lower_post_h, d = center_lower_post_dia);
    
    // Disc
    translate([0, 0, center_lower_post_h])
        cylinder(h = center_disc_h, d = center_disc_dia);
    translate([0, 0, center_lower_post_h + center_disc_h])
        cylinder(h = 2, d1 = center_disc_dia, d2 = center_disc_dia - 4);
    
    // Upper post
    translate([0, 0, center_lower_post_h + center_disc_h + 2])
        cylinder(h = center_upper_post_h, d = center_upper_post_dia);
    
    // Threaded rod (plain cylinder)
    tr_base = center_lower_post_h + center_disc_h + 2 + center_upper_post_h;
    translate([0, 0, tr_base])
        cylinder(h = threaded_rod_h, d = threaded_rod_dia);
    
    // Knurled nut (simplified)
    kn_base = tr_base + threaded_rod_h;
    translate([0, 0, kn_base])
        simple_knurled(knurled_nut_h, knurled_nut_dia);
    
    // Washer
    translate([0, 0, kn_base + knurled_nut_h])
        cylinder(h = washer_h, d = washer_dia);
    
    // Bolt above
    translate([0, 0, kn_base + knurled_nut_h + washer_h])
        cylinder(h = 15, d = threaded_rod_dia);
    
    // Hex bolt head
    translate([0, 0, kn_base + knurled_nut_h + washer_h + 15])
        cylinder(h = bolt_head_h, d = bolt_head_dia, $fn = 6);
    
    // Side thumb screw
    translate([0, 0, center_lower_post_h + center_disc_h/2])
        rotate([0, 90, -25]) {
            cylinder(h = center_disc_dia/2 + 8, d = 7);
            translate([0, 0, center_disc_dia/2 + 8])
                simple_knurled(12, thumb_screw_dia);
        }
}

module guide_pin(h, d) {
    cylinder(h = h, d = d);
    translate([0, 0, h])
        scale([1, 1, 0.6])
            sphere(d = d * 1.1);
}

module label_plate(w, h) {
    cube([w, h, 0.8], center = true);
}

module mounting_holes() {
    for (dy = [-mount_holes_y_spacing/2, 0, mount_holes_y_spacing/2]) {
        translate([mount_holes_x, dy, -1])
            cylinder(h = base_thickness + rim_height + 10, d = mount_hole_dia);
    }
}

// === Main Assembly ===
color("Silver")
difference() {
    union() {
        base_plate();
        
        // Large tow ball (left)
        translate([large_ball_x, 0, base_thickness + pedestal_height])
            tow_ball(large_ball_dia, ball_neck_dia, ball_neck_height,
                     ball_flange_dia, ball_flange_height);
        
        // Small tow ball (right)
        translate([small_ball_x, 0, base_thickness + pedestal_height])
            tow_ball(small_ball_dia, ball_neck_dia * 0.88, ball_neck_height * 0.9,
                     ball_flange_dia * 0.88, ball_flange_height);
        
        // Central mechanism
        translate([0, 0, base_thickness + 4])
            central_mechanism();
        
        // Guide pins
        translate([pin1_x, pin1_y, base_thickness])
            guide_pin(pin1_h, pin1_dia);
        translate([pin2_x, pin2_y, base_thickness])
            guide_pin(pin2_h, pin2_dia);
        
        // Label plates
        translate([large_ball_x + 20, 5, base_thickness + rim_height + 0.4])
            rotate([0, 0, 10])
                label_plate(16, 10);
        translate([small_ball_x - 18, -8, base_thickness + rim_height + 0.4])
            rotate([0, 0, 5])
                label_plate(14, 9);
    }
    
    // Mounting holes
    mounting_holes();
    
    // Center bore
    translate([0, 0, -1])
        cylinder(h = base_thickness + 10, d = center_lower_post_dia - 4);
}