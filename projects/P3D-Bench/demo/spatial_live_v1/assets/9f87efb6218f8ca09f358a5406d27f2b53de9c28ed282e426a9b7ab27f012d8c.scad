// Chibi Super Deformed Tank (Metal Slug style)
// All units in millimeters, manifold for STL export
$fn = 40; // Global curve resolution, balanced detail/performance

// --------------------------
// Parametric Dimensions
// --------------------------
overall_scale = 1;
hull_length = 72 * overall_scale;
hull_width = 56 * overall_scale;
hull_height = 26 * overall_scale;
hull_round_r = 7 * overall_scale;

// Track Assembly
track_width = 11 * overall_scale;
track_thickness = 3 * overall_scale;
wheel_r = 12 * overall_scale;
wheel_w = 7 * overall_scale;
wheel_spacing = 50 * overall_scale;
grouser_h = 4 * overall_scale;
grouser_w = 5 * overall_scale;
grouser_spacing = 7 * overall_scale;

// Turret Dome
turret_dome_r = 27 * overall_scale;
turret_top_cut = 8 * overall_scale;
turret_plate_thick = 2 * overall_scale;

// Main Cannon
barrel_length = 32 * overall_scale;
barrel_outer_r = 12 * overall_scale;
barrel_inner_r = 9 * overall_scale;
barrel_inset = 8 * overall_scale;

// Turret Top Accessories
cupola_r = 8 * overall_scale;
cupola_h = 9 * overall_scale;
twin_exhaust_r = 3.5 * overall_scale;
twin_exhaust_h = 24 * overall_scale;
long_antenna_len = 58 * overall_scale;
long_antenna_r = 0.8 * overall_scale;
short_antenna_len = 23 * overall_scale;
short_antenna_r = 0.6 * overall_scale;
antenna_tilt = 15;
side_pipe_r = 4 * overall_scale;
side_pipe_len = 22 * overall_scale;
side_pipe_angle = 30;
small_pipe_r = 2.5 * overall_scale;
small_pipe_len = 18 * overall_scale;
small_pipe_bend_h = 6 * overall_scale;

// Gatling Minigun
gatling_ball_r = 8 * overall_scale;
gatling_barrel_r = 1.8 * overall_scale;
gatling_barrel_len = 36 * overall_scale;
gatling_barrel_pcd = 5 * overall_scale;
gatling_muzzle_disc_r = 9 * overall_scale;
gatling_muzzle_disc_thick = 2 * overall_scale;
gatling_tilt_x = -15;
gatling_tilt_y = 30;

// Turret Side Details
side_box_size = [21, 14, 19] * overall_scale;
side_box_round_r = 2 * overall_scale;
port_r = 4 * overall_scale;
port_depth = 3 * overall_scale;
handle_pipe_r = 1.8 * overall_scale;
handle_bend_r = 7 * overall_scale;

// Hull Front Details
front_armor_thick = 5 * overall_scale;
front_slope_angle = 35;
front_tooth_count = 7;
front_tooth_size = [4, 6, 7] * overall_scale;
headlight_size = [8, 10, 12] * overall_scale;

// --------------------------
// Helper Modules
// --------------------------
module rounded_box(size, r=2) {
    size = is_list(size) ? size : [size, size, size];
    r = min(r, min(size[0], min(size[1], size[2]))/2 - 0.1);
    minkowski() {
        cube([size[0]-2*r, size[1]-2*r, size[2]-2*r], center=true);
        sphere(r=r);
    }
}

module port(r=4, depth=3) {
    union() {
        cylinder(h=depth, r=r*1.2, center=true);
        cylinder(h=depth+0.5, r=r*0.7, center=true);
    }
}

module track_wheel(r=12, w=7) {
    union() {
        difference() {
            cylinder(h=w, r=r, center=true);
            cylinder(h=w+2, r=r*0.72, center=true); // Recess between rim and hub
        }
        // Raised center hub
        cylinder(h=w/2 + 1, r=r*0.28, center=true);
        // Center hub indent
        translate([0,0,w/4]) cylinder(h=w/2 +2, r=r*0.12, center=true);
        // 4 bolt heads
        for (a = [0:90:270]) {
            rotate(a) translate([r*0.52, 0, w/4]) cylinder(h=w/2 +2, r=r*0.11, center=true);
        }
    }
}

module c_handle(pipe_r=1.8, bend_r=7) {
    rotate([90, 0, 0]) difference() {
        torus(R=bend_r, r=pipe_r);
        translate([0, 0, pipe_r+0.1]) cube([2*(bend_r+pipe_r), 2*(bend_r+pipe_r), 2*(bend_r+pipe_r)], center=true);
    }
}

module gatling_gun(ball_r=8, barrel_r=1.8, barrel_len=36, pcd=5, disc_r=9, disc_t=2) {
    union() {
        sphere(r=ball_r); // Ball mount
        translate([0, 0, ball_r]) {
            cylinder(h=barrel_len, r=barrel_r, center=true); // Center barrel
            for (a = [0:60:300]) { // 6 surrounding barrels
                rotate(a, [0,0,1]) translate([pcd, 0, 0]) cylinder(h=barrel_len, r=barrel_r, center=true);
            }
            translate([0,0,barrel_len/2 - disc_t/2]) cylinder(h=disc_t, r=disc_r, center=true); // Muzzle disc
            translate([0,0, -barrel_len/2 + 4]) cylinder(h=4, r=disc_r-1, center=true); // Barrel collar
        }
    }
}

// --------------------------
// Major Assemblies
// --------------------------
module track_side(y_offset) {
    wheel_center_z = wheel_r + track_thickness + grouser_h; // Sit grousers flush on Z=0
    outward_y = sign(y_offset) * (track_width/2 - wheel_w/2); // Shift wheel to outer face
    translate([0, y_offset, 0]) {
        union() {
            // Track belt loop
            translate([0, 0, wheel_center_z]) {
                rotate([90, 0, 0]) {
                    linear_extrude(height=track_width, center=true) {
                        offset(r=track_thickness) {
                            hull() {
                                translate([-wheel_spacing/2, 0]) circle(r=wheel_r);
                                translate([wheel_spacing/2, 0]) circle(r=wheel_r);
                            }
                        }
                    }
                }
            }
            // Visible outer wheels
            translate([-wheel_spacing/2, outward_y, wheel_center_z]) rotate([90,0,0]) track_wheel(r=wheel_r, w=wheel_w);
            translate([wheel_spacing/2, outward_y, wheel_center_z]) rotate([90,0,0]) track_wheel(r=wheel_r, w=wheel_w);
            // Bottom grousers (tread teeth)
            for (x = [-wheel_spacing/2 - wheel_r + grouser_w/2 : grouser_spacing : wheel_spacing/2 + wheel_r - grouser_w/2]) {
                z_pos = (wheel_center_z - wheel_r - track_thickness) - grouser_h/2;
                translate([x, 0, z_pos]) cube([grouser_w, track_width+2, grouser_h], center=true);
            }
            // Angled front/rear grousers
            for (a = [0:36:180]) {
                translate([-wheel_spacing/2, 0, wheel_center_z]) rotate([0,a,0]) {
                    translate([0,0, -(wheel_r + track_thickness + grouser_h/2)])
                    cube([grouser_w, track_width+2, grouser_h], center=true);
                }
                translate([wheel_spacing/2, 0, wheel_center_z]) rotate([0,-a,0]) {
                    translate([0,0, -(wheel_r + track_thickness + grouser_h/2)])
                    cube([grouser_w, track_width+2, grouser_h], center=true);
                }
            }
        }
    }
}

module lower_hull() {
    translate([0,0,10]) { // Offset hull to sit between tracks
        union() {
            // Main rounded hull body
            translate([0,0,hull_height/2]) rounded_box([hull_length, hull_width - 2*track_width + 4, hull_height], r=hull_round_r);
            // Front sloped armor
            translate([hull_length/2 - front_armor_thick/2, 0, hull_height*0.4]) {
                rotate([0, -front_slope_angle, 0])
                cube([front_armor_thick, hull_width - 2*track_width - 4, hull_height*0.7], center=true);
            }
            // Front lower bolt/teeth details
            for (i = [0:front_tooth_count-1]) {
                x_pos = hull_length/2 - 8 - i*(front_tooth_size[0]+2);
                z_pos = 8;
                translate([x_pos, (i%2 ? -1 : 1)*(hull_width/2 - track_width - 8), z_pos]) {
                    rotate([0, (i%2 ? -1 : 1)*10, 0])
                    cube(front_tooth_size, center=true);
                }
            }
            // Armored front headlight/vision block
            translate([hull_length/2 - 10, 0, hull_height*0.6]) {
                union() {
                    rounded_box(headlight_size, r=2);
                    translate([0,0,2]) cube([headlight_size[0]-2, headlight_size[1], 1], center=true);
                    translate([0,0,-2]) cube([headlight_size[0]-2, headlight_size[1], 1], center=true);
                }
            }
            // Front diamond detail plate
            translate([hull_length/2 - 16, 0, hull_height*0.35]) rotate([0,45,0]) cube([7,7,3], center=true);
            // Rounded upper hull side panels
            translate([0, hull_width/2 - track_width - 2, hull_height*0.7]) rotate([0,90,0]) cylinder(h=hull_length-15, r=10, center=true);
            translate([0, -(hull_width/2 - track_width - 2), hull_height*0.7]) rotate([0,90,0]) cylinder(h=hull_length-15, r=10, center=true);
        }
    }
}

module turret() {
    turret_center_z = 10 + hull_height + turret_dome_r - turret_top_cut - turret_plate_thick;
    translate([0, 0, turret_center_z]) {
        union() {
            // Main domed turret body
            difference() {
                sphere(r=turret_dome_r);
                translate([0,0, turret_dome_r - turret_top_cut + 1]) cube([2*turret_dome_r, 2*turret_dome_r, turret_top_cut+2], center=true); // Flatten top
                translate([0,0, -turret_dome_r + 5]) cube([2*turret_dome_r, 2*turret_dome_r, 10], center=true); // Flatten bottom
            }
            // Turret top mounting plate
            translate([0,0, turret_dome_r - turret_top_cut + turret_plate_thick/2]) cylinder(h=turret_plate_thick, r=turret_dome_r-3, center=true);
            // Top plate grab loops
            for (y = [-6, 6]) translate([8, y, turret_dome_r - turret_top_cut + turret_plate_thick]) rotate([0,0,90]) c_handle(pipe_r=1.5, bend_r=5);
            // Main cannon assembly
            translate([turret_dome_r - barrel_inset, 0, 0]) {
                union() {
                    cylinder(h=6, r=barrel_outer_r+2, center=true); // Base collar
                    cylinder(h=barrel_length, r=barrel_outer_r, center=true); // Barrel
                    translate([0,0,barrel_length/2 - 3]) cylinder(h=4, r=barrel_outer_r+1, center=true); // Muzzle ring
                }
                difference() {
                    cylinder(h=barrel_length+2, r=barrel_inner_r, center=true); // Hollow bore
                    for (a = [0,90]) rotate(a) cube([barrel_length+2, barrel_inner_r+1, 3], center=true); // Muzzle slots
                }
            }
            // Cannon travel lock handle
            translate([10, 0, -22]) rotate([20,0,0]) {
                union() {
                    cylinder(h=12, r=3, center=true);
                    translate([0,0,6]) sphere(r=3.5);
                }
            }
            // Side grab handles next to cannon
            for (y = [-12, 12]) translate([15, y, -2]) rotate([0,0, -sign(y)*90]) c_handle(pipe_r=handle_pipe_r, bend_r=handle_bend_r);
            // Left side inspection ports
            translate([-5, -turret_dome_r + 3, 8]) port(r=port_r+1, depth=port_depth+1);
            translate([-5, -turret_dome_r + 3, -5]) port(r=port_r, depth=port_depth);
            // Right side equipment box
            translate([-2, turret_dome_r - side_box_size[0]/2 + 3, 0]) {
                union() {
                    rounded_box(side_box_size, r=side_box_round_r);
                    translate([-side_box_size[0]/2 - port_depth/2, 5, 4]) rotate([0,-90,0]) port(r=port_r, depth=port_depth);
                    translate([-side_box_size[0]/2 - port_depth/2, 5, -5]) rotate([0,-90,0]) port(r=port_r, depth=port_depth);
                    translate([0,0,side_box_size[2]/2 - 2]) cube([side_box_size[0]-4, side_box_size[1]+4, 4], center=true);
                }
            }
            // Commander cupola
            translate([8, 0, turret_dome_r - turret_top_cut + turret_plate_thick + cupola_h/2]) {
                difference() {
                    cylinder(h=cupola_h, r=cupola_r, center=true);
                    translate([cupola_r+1, 0, -2]) cube([cupola_r*2, cupola_r*2, cupola_h], center=true); // Open front notch
                }
                // Curved top guard
                translate([0,0,cupola_h/2]) difference() {
                    torus(R=cupola_r, r=1.5);
                    translate([cupola_r+2,0,0]) cube([cupola_r*3, cupola_r*3, cupola_r*3], center=true);
                }
            }
            // Rear twin exhausts
            for (y = [-5,5]) translate([-12, y, turret_dome_r - turret_top_cut + turret_plate_thick + twin_exhaust_h/2]) {
                union() {
                    cylinder(h=twin_exhaust_h, r=twin_exhaust_r, center=true);
                    translate([0,0,twin_exhaust_h/2 + 1]) cylinder(h=3, r=twin_exhaust_r-1, center=true); // Open top
                }
            }
            // Antenna mount
            translate([-16, 0, turret_dome_r - turret_top_cut + turret_plate_thick + 4]) {
                cube([8, 10, 8], center=true);
                rotate([-antenna_tilt, 5, 0]) translate([0, -2, long_antenna_len/2]) {
                    union() {
                        cylinder(h=long_antenna_len, r=long_antenna_r, center=true);
                        translate([0,0,long_antenna_len/2]) sphere(r=long_antenna_r*1.8);
                    }
                }
                rotate([-antenna_tilt + 10, 5, 0]) translate([0, 2, short_antenna_len/2]) {
                    union() {
                        cylinder(h=short_antenna_len, r=short_antenna_r, center=true);
                        translate([0,0,short_antenna_len/2]) sphere(r=short_antenna_r*1.8);
                    }
                }
            }
            // Rear angled exhaust pipe
            translate([-8, turret_dome_r - 2, 10]) rotate([-side_pipe_angle, 0, 45]) {
                union() {
                    cylinder(h=side_pipe_len, r=side_pipe_r, center=true);
                    translate([0,0,side_pipe_len/2]) cylinder(h=3, r=side_pipe_r-1, center=true);
                }
            }
            // Bent thin vent pipe
            translate([-4, turret_dome_r - 4, 6]) {
                union() {
                    cylinder(h=small_pipe_len, r=small_pipe_r, center=true);
                    translate([0,0,small_pipe_len/2]) rotate([0,45,0]) cylinder(h=small_pipe_bend_h, r=small_pipe_r, center=true);
                }
            }
            // Right side gatling gun
            translate([-6, turret_dome_r - gatling_ball_r, 2]) {
                rotate([gatling_tilt_x, gatling_tilt_y, 0])
                gatling_gun(
                    ball_r=gatling_ball_r,
                    barrel_r=gatling_barrel_r,
                    barrel_len=gatling_barrel_len,
                    pcd=gatling_barrel_pcd,
                    disc_r=gatling_muzzle_disc_r,
                    disc_t=gatling_muzzle_disc_thick
                );
            }
        }
    }
}

// --------------------------
// Final Model Assembly
// --------------------------
union() {
    lower_hull();
    track_side(y_offset=22.5);  // Right track
    track_side(y_offset=-22.5); // Left track
    turret();
}