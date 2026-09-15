// Parameters: compact armored tank, millimeters
$fn = 72;
corner_fn = 24;
eps = 0.04;

// Hull
hull_sections = [[0,9,88,60], [0,22,100,68], [4,36,84,68]];
hull_corner = 4;
hull_layer = 0.8;
deck_z = 36;
bumper_pos = [-48,0,17];
bumper_width = 56;
bumper_r = 1.3;
tooth_pos = [-48,0,12.5];
tooth_size = [5,4.5,7];
tooth_pitch = 6;
tooth_count = 9;
latch_pos = [-44,0,30];
latch_size = [4,6,8];
grille_pos = [35,0,36.5];
grille_size = [17,36,2];
grille_slots = 6;
grille_slot_w = 1.6;

// Tracks and wheels
track_span = 72;
track_y = 42;
track_z = 20;
track_r = 18;
track_width = 18;
track_wall = 3;
tread_size = [7.1,21,2.5];
tread_skew = 1.2;
tread_straight_count = 9;
tread_arc_count = 7;
cleat_width = 1.5;
cleat_height = 0.8;
wheel_r = 16.1;
wheel_depth = 19;
wheel_dish_r = 12.5;
wheel_dish_depth = 1.6;
wheel_hub_r = 6;
wheel_hub_height = 3;
wheel_socket_r = 1.65;
axle_r = 4;
bolt_r = 1.4;
bolt_height = 1.1;
bolt_circle = 9.7;

// Track armor
guard_pos = [2,0,26];
guard_size = [31,23,33];
guard_r = 4.5;
panel_seam = 0.4;
panel_cut_depth = 0.6;
fender_size = [21,22,3];
front_fender_pos = [-46,0,34];
front_fender_angle = -36;
rear_fender_pos = [47,0,34];
rear_fender_angle = 36;
flap_pos = [-54,0,16];
flap_size = [19,22,3];
flap_angle = -68;

// Domed turret
turret_x = -3;
turret_base_z = 40;
turret_shoulder_z = 52;
turret_radius = 30;
turret_lower_radius = 28.8;
turret_dome_height = 26;
turret_roof_z = 75.5;
turret_ring_z = 36;
turret_ring_r = 28;
turret_ring_height = 5;
turret_seam_width = 0.38;
turret_seam_depth = 0.45;
turret_seam_angles = [-140,-45,70];

// Main cannon
cannon_mouth = [-64,0,58];
barrel_length = 28;
barrel_front_r = 10.8;
barrel_rear_r = 11.5;
barrel_bore_r = 8.8;
mantlet_length = 11;
mantlet_r = 14;
muzzle_lip = 0.8;
rifling_count = 8;
rifling_rib = 0.75;
rifling_length = 13;

// Paired side launchers
pod_pos = [2,31,60];
pod_size = [22,13,25];
pod_corner = 2.7;
port_spacing = 13;
port_r = 3.65;
port_lip_r = 4.8;
port_lip_height = 1.3;
port_depth = 12;

// Hatch and grab rails
hatch_pos = [-5,0,74.8];
hatch_size = [34,31,2.8];
hatch_corner = 4;
hatch_inset = 2;
hatch_lid_height = 1.5;
rail_r = 0.8;
rail_height = 2.6;
rail_length = 22;
rail_y = 11.5;
grab_r = 1.5;
grab_socket_r = 2.3;
grab_points = [
    [-23,15,65], [-28,18,64], [-31,19,61],
    [-32,19,55], [-29,18,51], [-25,17,50]
];

// Roof-mounted sight
sight_base = [9,5,78.8];
sight_post_r = 3;
sight_post_height = 6.5;
sight_foot_r = 5.5;
sight_foot_height = 1.6;
sight_front = [-4,5,92];
sight_r = 8.5;
sight_length = 13;
sight_rear_length = 8;
sight_lens_r = 6.6;
sight_recess = 3.2;
sight_ring_r = 9.2;
sight_ring_height = 1.2;
sight_stud_r = 1.3;
sight_bar_width = 1.6;

// Rear aerials and ribbed canister
mast_foot = [17,12,68];
mast_foot_size = [12,12,7];
mast_top = [23,13,80];
mast_top_size = [7,8,6];
canister_base = [24,17,82];
canister_r = 4.7;
canister_height = 22;
canister_cap_r = 5.4;
canister_cap_height = 1.5;
canister_flute_r = 0.45;
canister_flutes = 8;
antenna_start = [24,9,80];
antenna_end = [44,10,141];
antenna_r = 0.75;
antenna_tip_r = 1.2;
whip_start = [21,9,79];
whip_end = [36,9,115];
whip_r = 0.4;

// Rear rotary gun
gun_ball = [28,-32,54];
gun_ball_r = 7.2;
gun_stem_r = 3.6;
gun_direction = [15,-6,37];
gun_length = 44;
gun_cluster_r = 4.5;
gun_barrel_r = 1.5;
gun_bore_r = 0.85;
gun_barrel_count = 6;
gun_band_r = 6.4;
gun_band_height = 2.2;
gun_base_height = 5;

// Exhausts
pipe_start = [23,-16,36];
pipe_end = [38,-18,89];
pipe_r = 3.7;
pipe_wall = 0.9;
small_pipe_start = [35,-20,36];
small_pipe_end = [43,-22,78];
small_pipe_r = 3.2;
snorkel_points = [[43,-22,78], [45,-22,86], [52,-22,90]];
snorkel_r = 1.1;

// Ribbed front-deck tools
tool_pos = [-29,23,40];
tool_size = [14,8,5];
tool_corner = 2;
tool_angle = -35;
tool_handle_length = 13;
tool_handle_r = 1.5;
tool_groove = 0.45;


// Rounded solids
module rounded_box(s, r) {
    hull()
        for (x = [-1,1], y = [-1,1], z = [-1,1])
            translate([
                x*(s[0]/2-r),
                y*(s[1]/2-r),
                z*(s[2]/2-r)
            ])
                sphere(r=r, $fn=corner_fn);
}

module rounded_plate(s, r) {
    linear_extrude(height=s[2])
        offset(r=r)
            square([s[0]-2*r, s[1]-2*r], center=true);
}

// Axial placement
module along(p, q) {
    v = q-p;
    translate(p)
        rotate([0, acos(v[2]/norm(v)), atan2(v[1],v[0])])
            children();
}

module rod(p, q, r) {
    along(p,q)
        cylinder(h=norm(q-p), r=r);
}

module round_path(points, r) {
    for (i = [0:len(points)-2])
        hull() {
            translate(points[i]) sphere(r=r, $fn=corner_fn);
            translate(points[i+1]) sphere(r=r, $fn=corner_fn);
        }
}

module annulus(h, ro, ri) {
    difference() {
        cylinder(h=h, r=ro);
        translate([0,0,-eps])
            cylinder(h=h+2*eps, r=ri);
    }
}

module bolt_head(r=bolt_r, h=bolt_height) {
    difference() {
        cylinder(h=h, r=r, $fn=6);
        translate([0,0,h])
            cube([1.4*r,0.3*r,0.6*h], center=true);
    }
}


// Sloped, rounded hull
module hull_body() {
    hull()
        for (s = hull_sections)
            translate([s[0],0,s[1]])
                rounded_plate([s[2],s[3],hull_layer], hull_corner);
}

module hull_details() {
    rod(
        bumper_pos+[0,-bumper_width/2,0],
        bumper_pos+[0, bumper_width/2,0],
        bumper_r
    );

    for (i = [0:tooth_count-1])
        translate(tooth_pos+[0,(i-(tooth_count-1)/2)*tooth_pitch,0])
            rotate([0,-12,0])
                rounded_box(tooth_size, tooth_size[0]/8);

    translate(latch_pos)
        rotate([0,-40,0])
            rounded_box(latch_size, latch_size[0]/6);

    translate(grille_pos)
        difference() {
            rounded_plate(grille_size, grille_size[2]/2);
            for (i = [0:grille_slots-1])
                translate([
                    (i-(grille_slots-1)/2)*grille_size[0]/(grille_slots+1),
                    0,
                    grille_size[2]/2
                ])
                    cube([
                        grille_slot_w,
                        grille_size[1]*0.8,
                        grille_size[2]+2*eps
                    ], center=true);
        }
}


// Continuous capsule-shaped track belt
module track_outline(r) {
    hull()
        for (x = [-track_span/2,track_span/2])
            translate([x,0]) circle(r=r);
}

module tread_shoe() {
    union() {
        linear_extrude(height=tread_size[2], center=true)
            polygon([
                [-tread_size[0]/2-tread_skew,-tread_size[1]/2],
                [ tread_size[0]/2-tread_skew,-tread_size[1]/2],
                [ tread_size[0]/2+tread_skew, tread_size[1]/2],
                [-tread_size[0]/2+tread_skew, tread_size[1]/2]
            ]);
        translate([0,0,(tread_size[2]+cleat_height)/2-eps])
            cube([cleat_width,tread_size[1],cleat_height], center=true);
    }
}

module track_belt(side) {
    translate([0,side*track_y,track_z])
        rotate([90,0,0])
            linear_extrude(height=track_width, center=true)
                difference() {
                    track_outline(track_r);
                    track_outline(track_r-track_wall);
                }

    for (i = [0:tread_straight_count-1], vertical = [-1,1])
        translate([
            -track_span/2+(i+0.5)*track_span/tread_straight_count,
            side*track_y,
            track_z+vertical*(track_r+tread_size[2]/2-eps)
        ])
            rotate([0,vertical == 1 ? 0 : 180,0])
                tread_shoe();

    for (end = [-1,1], i = [0:tread_arc_count-1])
        let(
            a = (end == 1 ? -90 : 90)
                +(i+0.5)*180/tread_arc_count,
            r = track_r+tread_size[2]/2-eps
        )
            translate([
                end*track_span/2+r*cos(a),
                side*track_y,
                track_z+r*sin(a)
            ])
                rotate([0,90-a,0])
                    tread_shoe();
}

// Recessed wheels with raised hubs
module road_wheel() {
    difference() {
        cylinder(h=wheel_depth, r=wheel_r);
        translate([0,0,wheel_depth-wheel_dish_depth])
            cylinder(h=wheel_dish_depth+eps, r=wheel_dish_r);
    }

    translate([0,0,wheel_depth-wheel_dish_depth-eps]) {
        difference() {
            union() {
                cylinder(h=wheel_hub_height, r=wheel_hub_r);
                translate([0,0,wheel_hub_height-eps])
                    cylinder(h=wheel_hub_height/3, r=wheel_hub_r/2);
            }
            translate([0,0,wheel_hub_height*0.65])
                cylinder(h=wheel_hub_height, r=wheel_socket_r);
        }

        annulus(
            wheel_dish_depth/3,
            wheel_dish_r*0.87,
            wheel_dish_r*0.83
        );

        for (a = [30:120:270])
            rotate([0,0,a]) {
                translate([bolt_circle,0,0])
                    bolt_head();
                translate([wheel_hub_r,0,wheel_dish_depth/6])
                    cube([
                        bolt_circle-wheel_hub_r,
                        bolt_r*1.5,
                        wheel_dish_depth/3
                    ], center=true);
            }
    }
}

module track_armor(side) {
    translate([guard_pos[0],side*track_y,guard_pos[2]])
        difference() {
            rounded_box(guard_size, guard_r);
            translate([
                0,
                side*(guard_size[1]/2-panel_cut_depth/2),
                0
            ])
                cube([
                    guard_size[0]+2*eps,
                    panel_cut_depth+eps,
                    panel_seam
                ], center=true);
            translate([
                guard_size[0]/4,
                side*(guard_size[1]/2-panel_cut_depth/2),
                0
            ])
                cube([
                    panel_seam,
                    panel_cut_depth+eps,
                    guard_size[2]+2*eps
                ], center=true);
        }

    for (p = [
        [front_fender_pos,front_fender_angle,fender_size],
        [rear_fender_pos,rear_fender_angle,fender_size],
        [flap_pos,flap_angle,flap_size]
    ])
        translate(p[0]+[0,side*track_y,0])
            rotate([0,p[1],0])
                cube(p[2], center=true);
}

module running_gear() {
    for (x = [-track_span/2,track_span/2])
        rod(
            [x,-track_y,track_z],
            [x, track_y,track_z],
            axle_r
        );

    for (side = [-1,1]) {
        track_belt(side);
        for (x = [-track_span/2,track_span/2])
            translate([
                x,
                side*(track_y-track_width/2),
                track_z
            ])
                rotate([-90*side,0,0])
                    road_wheel();
        track_armor(side);
    }
}


// Shallow panel seams in the dome
module dome_seams() {
    translate([turret_x,0,turret_shoulder_z-turret_seam_width/2])
        annulus(
            turret_seam_width,
            turret_radius+eps,
            turret_radius-turret_seam_depth
        );

    translate([turret_x,0,turret_shoulder_z])
        for (a = turret_seam_angles)
            intersection() {
                difference() {
                    scale([1,1,turret_dome_height/turret_radius])
                        sphere(r=turret_radius+eps);
                    scale([1,1,turret_dome_height/turret_radius])
                        sphere(r=turret_radius-turret_seam_depth);
                }
                rotate([0,0,a])
                    translate([0,-turret_seam_width/2,0])
                        cube([
                            turret_radius+eps,
                            turret_seam_width,
                            turret_roof_z-turret_shoulder_z+eps
                        ]);
            }
}

module turret_shell() {
    difference() {
        union() {
            translate([turret_x,0,turret_base_z])
                cylinder(
                    h=turret_shoulder_z-turret_base_z,
                    r1=turret_lower_radius,
                    r2=turret_radius
                );

            translate([turret_x,0,turret_shoulder_z])
                intersection() {
                    scale([1,1,turret_dome_height/turret_radius])
                        sphere(r=turret_radius);
                    translate([-turret_radius,-turret_radius,-eps])
                        cube([
                            2*turret_radius,
                            2*turret_radius,
                            turret_roof_z-turret_shoulder_z+eps
                        ]);
                }
        }
        dome_seams();
    }
}

// Twin forward-facing ports on each side
module turret_with_pods() {
    difference() {
        union() {
            turret_shell();
            for (side = [-1,1]) {
                translate([pod_pos[0],side*pod_pos[1],pod_pos[2]])
                    rounded_box(pod_size, pod_corner);

                for (level = [-1,1])
                    translate([
                        pod_pos[0]-pod_size[0]/2-port_lip_height,
                        side*pod_pos[1],
                        pod_pos[2]+level*port_spacing/2
                    ])
                        rotate([0,90,0])
                            cylinder(
                                h=port_lip_height+pod_corner/2,
                                r=port_lip_r
                            );
            }
        }

        for (side = [-1,1], level = [-1,1])
            translate([
                pod_pos[0]-pod_size[0]/2-port_lip_height-eps,
                side*pod_pos[1],
                pod_pos[2]+level*port_spacing/2
            ])
                rotate([0,90,0]) {
                    cylinder(h=port_depth, r=port_r);
                    cylinder(
                        h=port_lip_height,
                        r1=port_r+port_lip_height/3,
                        r2=port_r
                    );
                }
    }
}

// Hollow short cannon with muzzle ribs
module main_cannon() {
    translate(cannon_mouth)
        rotate([0,90,0])
            union() {
                difference() {
                    union() {
                        cylinder(
                            h=barrel_length,
                            r1=barrel_front_r,
                            r2=barrel_rear_r
                        );
                        cylinder(
                            h=muzzle_lip,
                            r=barrel_front_r+muzzle_lip/2
                        );
                        translate([0,0,barrel_length-muzzle_lip])
                            cylinder(
                                h=mantlet_length,
                                r1=mantlet_r-muzzle_lip,
                                r2=mantlet_r
                            );
                        translate([0,0,barrel_length+muzzle_lip])
                            cylinder(
                                h=2*muzzle_lip,
                                r=mantlet_r+muzzle_lip/2
                            );
                    }
                    translate([0,0,-eps])
                        cylinder(
                            h=barrel_length+mantlet_length/2,
                            r=barrel_bore_r
                        );
                    translate([0,0,-eps])
                        cylinder(
                            h=muzzle_lip+eps,
                            r1=barrel_bore_r+muzzle_lip,
                            r2=barrel_bore_r
                        );
                }

                for (a = [0:360/rifling_count:360-360/rifling_count])
                    rotate([0,0,a])
                        translate([
                            barrel_bore_r-rifling_rib/3,
                            -rifling_rib/2,
                            muzzle_lip
                        ])
                            cube([
                                rifling_rib,
                                rifling_rib,
                                rifling_length
                            ]);
            }
}

module turret_hatch() {
    translate(hatch_pos) {
        rounded_plate(hatch_size, hatch_corner);
        translate([0,0,hatch_size[2]-eps])
            rounded_plate([
                hatch_size[0]-2*hatch_inset,
                hatch_size[1]-2*hatch_inset,
                hatch_lid_height
            ], hatch_corner-hatch_inset/2);

        for (side = [-1,1])
            let(z = hatch_size[2]+hatch_lid_height-eps)
                round_path([
                    [-rail_length/2,side*rail_y,z],
                    [-rail_length/2,side*rail_y,z+rail_height],
                    [ rail_length/2,side*rail_y,z+rail_height],
                    [ rail_length/2,side*rail_y,z]
                ], rail_r);
    }
}

module turret_handles() {
    for (side = [-1,1]) {
        points = [for (p = grab_points) [p[0],side*p[1],p[2]]];
        round_path(points, grab_r);
        for (i = [0,len(points)-1])
            translate(points[i])
                sphere(r=grab_socket_r, $fn=corner_fn);
    }
}


// Circular armored sight
module roof_sight() {
    translate(sight_base) {
        cylinder(h=sight_foot_height, r=sight_foot_r);
        cylinder(h=sight_post_height, r=sight_post_r);
    }

    translate(sight_front)
        rotate([0,90,0]) {
            difference() {
                union() {
                    cylinder(h=sight_length, r=sight_r);
                    translate([0,0,-sight_ring_height])
                        cylinder(h=2*sight_ring_height, r=sight_ring_r);
                    translate([0,0,sight_length-eps])
                        cylinder(
                            h=sight_rear_length,
                            r1=sight_r*0.82,
                            r2=sight_r*0.63
                        );
                    translate([0,0,sight_length-sight_ring_height])
                        cylinder(h=sight_ring_height, r=sight_r*1.04);
                }
                translate([0,0,-sight_ring_height-eps])
                    cylinder(
                        h=sight_recess+sight_ring_height+eps,
                        r=sight_lens_r
                    );
            }

            translate([0,0,sight_recess-sight_ring_height])
                cylinder(h=sight_ring_height+eps, r=sight_stud_r);

            rotate([0,0,-25])
                translate([0,0,sight_ring_height/2])
                    cube([
                        2*sight_ring_r,
                        sight_bar_width,
                        sight_ring_height
                    ], center=true);
        }
}


// Rear antenna bracket and canister
module aerial_equipment() {
    hull() {
        translate(mast_foot) cube(mast_foot_size, center=true);
        translate(mast_top) cube(mast_top_size, center=true);
    }

    translate(canister_base) {
        cylinder(h=canister_height, r=canister_r);
        for (z = [0,canister_height-canister_cap_height])
            translate([0,0,z])
                cylinder(h=canister_cap_height, r=canister_cap_r);

        for (a = [0:360/canister_flutes:360-360/canister_flutes])
            rotate([0,0,a])
                translate([canister_r,0,canister_cap_height-eps])
                    cylinder(
                        h=canister_height-2*canister_cap_height+2*eps,
                        r=canister_flute_r
                    );

        for (a = [0:90:270])
            rotate([0,0,a])
                translate([
                    canister_r/2,
                    0,
                    canister_height-eps
                ])
                    bolt_head(
                        r=canister_cap_r/4,
                        h=canister_cap_height/2
                    );
    }

    rod(antenna_start, antenna_end, antenna_r);
    translate(antenna_end) sphere(r=antenna_tip_r);
    rod(whip_start, whip_end, whip_r);
    translate(whip_end) sphere(r=whip_r*1.4, $fn=corner_fn);
}


// Seven-bore rotary gun
module rotary_cluster() {
    difference() {
        union() {
            cylinder(h=gun_base_height, r=gun_band_r);

            for (a = [0:360/gun_barrel_count:360-360/gun_barrel_count])
                translate([
                    gun_cluster_r*cos(a),
                    gun_cluster_r*sin(a),
                    gun_base_height-eps
                ])
                    cylinder(
                        h=gun_length-gun_base_height+eps,
                        r=gun_barrel_r
                    );

            cylinder(h=gun_length, r=gun_barrel_r);

            for (z = [
                gun_base_height,
                gun_length*0.66,
                gun_length-gun_band_height
            ])
                translate([0,0,z])
                    cylinder(h=gun_band_height, r=gun_band_r);
        }

        for (a = [0:360/gun_barrel_count:360-360/gun_barrel_count])
            translate([
                gun_cluster_r*cos(a),
                gun_cluster_r*sin(a),
                gun_length-gun_base_height
            ])
                cylinder(
                    h=gun_base_height+eps,
                    r=gun_bore_r
                );

        translate([0,0,gun_length-gun_base_height])
            cylinder(h=gun_base_height+eps, r=gun_bore_r);
    }

    for (a = [0:360/gun_barrel_count:360-360/gun_barrel_count])
        translate([
            gun_cluster_r*cos(a),
            gun_cluster_r*sin(a),
            gun_length-eps
        ])
            annulus(
                gun_band_height/3,
                gun_barrel_r,
                gun_bore_r
            );
}

module rotary_gun() {
    rod(
        [gun_ball[0],gun_ball[1],deck_z],
        gun_ball,
        gun_stem_r
    );
    translate(gun_ball) sphere(r=gun_ball_r);
    along(gun_ball,gun_ball+gun_direction)
        rotary_cluster();
}


// Capped-base exhaust tubes
module exhaust_pipe(p, q, r) {
    along(p,q)
        difference() {
            union() {
                cylinder(h=norm(q-p), r=r);
                cylinder(h=2*r, r=r+pipe_wall);
                translate([0,0,norm(q-p)-pipe_wall])
                    cylinder(
                        h=pipe_wall,
                        r=r+pipe_wall/2
                    );
            }
            translate([0,0,pipe_wall])
                cylinder(
                    h=norm(q-p)+eps,
                    r=r-pipe_wall
                );
        }
}

module exhausts() {
    exhaust_pipe(pipe_start,pipe_end,pipe_r);
    exhaust_pipe(small_pipe_start,small_pipe_end,small_pipe_r);
    round_path(snorkel_points, snorkel_r);
}


// Segmented spare tools on the glacis
module deck_tool() {
    difference() {
        rounded_box(tool_size, tool_corner);

        for (x = [-tool_size[0]/4,0,tool_size[0]/4])
            translate([x,0,tool_size[2]/2-tool_groove/2])
                cube([
                    tool_groove,
                    tool_size[1]+2*eps,
                    2*tool_groove
                ], center=true);

        translate([0,0,tool_size[2]/2-tool_groove/2])
            cube([
                tool_size[0]+2*eps,
                tool_groove,
                2*tool_groove
            ], center=true);
    }

    rod(
        [tool_size[0]/3,0,0],
        [tool_size[0]/3+tool_handle_length,0,0],
        tool_handle_r
    );
}


// Complete model
union() {
    hull_body();
    hull_details();
    running_gear();

    translate([turret_x,0,turret_ring_z])
        cylinder(h=turret_ring_height, r=turret_ring_r);

    turret_with_pods();
    main_cannon();
    turret_hatch();
    turret_handles();
    roof_sight();
    aerial_equipment();
    rotary_gun();
    exhausts();

    for (side = [-1,1])
        translate([tool_pos[0],side*tool_pos[1],tool_pos[2]])
            rotate([0,tool_angle,0])
                deck_tool();
}