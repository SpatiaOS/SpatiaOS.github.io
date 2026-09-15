// ==============================================================================
// PARAMETRIC CHIBI COMBAT TANK (SV-001 METAL SLUG STYLE)
// ==============================================================================
// Description: Stylized, super-deformed chibi tank featuring chunky tracks,
// rounded hull, squashed spherical turret, stubby howitzer cannon with rifled
// muzzle, dual rear Gatling/Vulcan cannons, cheek sensor pods, hooded periscope,
// exhaust vents, and whip antennas.
// ==============================================================================

// --- Resolution Settings ---
$fn = 40;
eps = 0.05;

// --- Global Proportions ---
hull_w = 40;            // Hull width (between tracks)
hull_l = 54;            // Hull length
hull_h = 22;            // Hull height

track_span = 53;        // Distance between track centers (Y)
track_w = 13.5;         // Width of track treads
wheel_r = 11.5;         // Road wheel radius
wheel_dist = 42;        // Distance between front and rear wheel centers

turret_r = 19.5;        // Turret radius (X/Y)
turret_z_scale = 0.76;  // Turret vertical squash factor
turret_z_pos = 32.5;    // Turret center height

cannon_r = 6.8;         // Main cannon outer radius
cannon_l = 21.0;        // Barrel length
cannon_tilt = -3.5;     // Barrel depression angle (degrees)

// ==============================================================================
// 1. TRACKS & WHEELS
// ==============================================================================

// Single chunky caterpillar tread cleat
module track_cleat(w=13.8, l=5.6, h=3.2) {
    union() {
        // Chamfered base pad
        hull() {
            cube([l, w, 0.6], center=true);
            translate([0, 0, h - 0.6])
                cube([l * 0.65, w * 0.86, 0.6], center=true);
        }
        // Center traction ridge
        translate([0, 0, h])
            cube([l * 0.28, w * 0.9, 0.8], center=true);
    }
}

// Detailed road wheel (sprocket / idler)
module road_wheel() {
    rotate([90, 0, 0]) {
        difference() {
            union() {
                // Main rim cylinder
                cylinder(r=wheel_r, h=4.2, center=true);
                // Beveled outer tire lip
                cylinder(r1=wheel_r, r2=wheel_r - 0.8, h=5.2, center=true);
            }
            // Recessed dish
            translate([0, 0, 1.0])
                cylinder(r=wheel_r - 1.8, h=5);
            // Weight-reduction / detail holes
            for (i = [0:4]) {
                rotate([0, 0, i * 72 + 36])
                    translate([6.4, 0, 0])
                        cylinder(r=1.9, h=8, center=true, $fn=24);
            }
        }
        // Raised center hub
        translate([0, 0, 1.2]) {
            cylinder(r=4.2, h=2.8, center=true);
            // Hexagonal axle nut
            translate([0, 0, 1.6])
                cylinder(r=2.2, h=1.4, center=true, $fn=6);
        }
        // 5 Hub bolts
        for (i = [0:4]) {
            rotate([0, 0, i * 72])
                translate([4.4, 0, 2.2])
                    cylinder(r=0.65, h=1.0, center=true, $fn=6);
        }
    }
}

// Complete track assembly (Left or Right)
module track_assembly(y_pos) {
    sign_y = (y_pos > 0) ? 1 : -1;

    translate([0, y_pos, 0]) {
        // Continuous inner track belt
        difference() {
            hull() {
                translate([wheel_dist/2, 0, 14])
                    rotate([90, 0, 0]) cylinder(r=11.8, h=track_w, center=true);
                translate([-wheel_dist/2, 0, 14])
                    rotate([90, 0, 0]) cylinder(r=11.8, h=track_w, center=true);
            }
            // Inner hollow for wheel fit
            hull() {
                translate([wheel_dist/2, 0, 14])
                    rotate([90, 0, 0]) cylinder(r=9.2, h=track_w + 2*eps, center=true);
                translate([-wheel_dist/2, 0, 14])
                    rotate([90, 0, 0]) cylinder(r=9.2, h=track_w + 2*eps, center=true);
            }
        }

        // Treads: Top straight run
        for (x = [-14, -7, 0, 7, 14])
            translate([x, 0, 25.6])
                track_cleat(w=track_w);

        // Treads: Bottom straight run
        for (x = [-14, -7, 0, 7, 14])
            translate([x, 0, 2.4])
                rotate([0, 180, 0])
                    track_cleat(w=track_w);

        // Treads: Front curve
        for (a = [67.5, 45, 22.5, 0, -22.5, -45, -67.5])
            translate([wheel_dist/2 + 11.6*cos(a), 0, 14 + 11.6*sin(a)])
                rotate([0, -a, 0])
                    track_cleat(w=track_w);

        // Treads: Rear curve
        for (a = [112.5, 135, 157.5, 180, 202.5, 225, 247.5])
            translate([-wheel_dist/2 + 11.6*cos(a), 0, 14 + 11.6*sin(a)])
                rotate([0, -a, 0])
                    track_cleat(w=track_w);

        // Wheels: Front and Rear
        wheel_flip = (y_pos > 0) ? 0 : 180;
        translate([wheel_dist/2, sign_y * 1.5, 14])
            rotate([0, 0, wheel_flip])
                road_wheel();
        translate([-wheel_dist/2, sign_y * 1.5, 14])
            rotate([0, 0, wheel_flip])
                road_wheel();

        // Outer track guide / suspension frame
        translate([0, sign_y * (track_w/2 + 0.5), 14]) {
            difference() {
                hull() {
                    translate([wheel_dist/2, 0, 0])
                        rotate([90, 0, 0]) cylinder(r=12.2, h=1.6, center=true);
                    translate([-wheel_dist/2, 0, 0])
                        rotate([90, 0, 0]) cylinder(r=12.2, h=1.6, center=true);
                }
                // Large circular cutouts exposing wheel dishes
                translate([wheel_dist/2, 0, 0])
                    rotate([90, 0, 0]) cylinder(r=10.2, h=4, center=true);
                translate([-wheel_dist/2, 0, 0])
                    rotate([90, 0, 0]) cylinder(r=10.2, h=4, center=true);
                // Center relief cutout
                cube([15, 6, 17], center=true);
            }
        }
    }
}

// ==============================================================================
// 2. MAIN HULL & SPONSONS
// ==============================================================================

module lower_hull() {
    difference() {
        union() {
            // Main sloped armor body
            hull() {
                // Nose bottom
                translate([26, 0, 6])
                    cube([2, hull_w, 4], center=true);
                // Upper glacis break
                translate([18, 0, 22])
                    cube([2, hull_w, 4], center=true);
                // Deck top
                translate([0, 0, 24])
                    cube([hull_l * 0.65, hull_w, 4], center=true);
                // Rear plate
                translate([-25, 0, 15])
                    cube([4, hull_w, 14], center=true);
                // Bottom belly pan
                translate([0, 0, 6])
                    cube([hull_l * 0.8, hull_w - 4, 3], center=true);
            }

            // Driver's front cowl / intake bulge on glacis
            translate([13, 0, 24]) {
                hull() {
                    translate([2, 0, 0])
                        rotate([0, 45, 0]) cube([5, 10, 5], center=true);
                    translate([-3, 0, 0])
                        cube([6, 12, 4], center=true);
                }
            }

            // Lower front grille teeth (ditching ribs)
            for (i = [-3:3]) {
                translate([26.8, i * 4.6, 7.5])
                    rotate([0, -15, 0])
                        cube([1.8, 2.8, 4.5], center=true);
            }

            // Front central towing hook / bracket
            translate([24.5, 0, 14])
                cube([3.5, 4.5, 3.5], center=true);

            // Left & right sponsons (chubby rounded blocks connecting hull to tracks)
            for (s = [-1, 1]) {
                translate([2, s * (hull_w/2 + 2), 17]) {
                    hull() {
                        for (dx = [-10, 10]) {
                            for (dz = [-5, 5]) {
                                translate([dx, 0, dz])
                                    rotate([90, 0, 0])
                                        cylinder(r=3.2, h=6, center=true);
                            }
                        }
                    }
                }
            }

            // Front track fenders (mudguards)
            for (s = [-1, 1]) {
                translate([17, s * track_span/2, 26]) {
                    rotate([0, 16, 0]) {
                        hull() {
                            cube([15, track_w + 3, 2.2], center=true);
                            translate([8, 0, -2.5])
                                cube([3, track_w + 3, 2.2], center=true);
                        }
                    }
                }
            }
        }

        // Turret ring recess cutout
        translate([0, 0, 24])
            cylinder(r=17.5, h=8);
    }
}

// ==============================================================================
// 3. TURRET ASSEMBLY
// ==============================================================================

module turret_dome() {
    // Turret collar base ring
    translate([0, 0, 24])
        cylinder(r1=18, r2=17, h=5);

    // Rounded bulbous dome
    translate([0, 0, turret_z_pos]) {
        scale([1.1, 1.05, turret_z_scale])
            sphere(r=turret_r);
    }
}

// Main howitzer cannon with thick mantlet and internal rifling
module main_cannon() {
    translate([12, 0, 29.5]) {
        // Spherical mantlet base
        sphere(r=8.5);

        // Flanged mantlet collar
        translate([2.5, 0, 0])
            rotate([0, 90 + cannon_tilt, 0])
                rotate_extrude()
                    translate([6.4, 0])
                        circle(r=1.8);

        // Barrel pointing forward with tilt
        rotate([0, cannon_tilt, 0]) {
            translate([3.5, 0, 0]) {
                rotate([0, 90, 0]) {
                    difference() {
                        union() {
                            // Tapered outer barrel
                            cylinder(r1=cannon_r, r2=cannon_r - 0.6, h=cannon_l);
                            // Heavy reinforced muzzle ring
                            translate([0, 0, cannon_l - 2.8])
                                cylinder(r=cannon_r + 0.8, h=2.8);
                        }

                        // Hollow cannon bore
                        translate([0, 0, cannon_l - 17])
                            cylinder(r=cannon_r - 1.8, h=18);

                        // 8 Internal rifling grooves/teeth
                        for (i = [0:7]) {
                            rotate([0, 0, i * 45])
                                translate([cannon_r - 1.8, 0, cannon_l - 8])
                                    cube([1.2, 1.4, 17], center=true);
                        }
                    }
                }
            }
        }
    }
}

// Cheek pods (twin rocket tubes / sensors on turret sides)
module cheek_pod(side=1) {
    translate([2, side * 18.2, 33.5]) {
        rotate([0, 0, side * 5]) {
            difference() {
                // Rounded rectangular box
                hull() {
                    for (dx = [-4.5, 4.5]) {
                        for (dz = [-4.5, 4.5]) {
                            translate([dx, side * -0.8, dz])
                                rotate([0, 90, 0])
                                    cylinder(r=2.5, h=2, center=true);
                            translate([dx, side * 2.5, dz])
                                rotate([0, 90, 0])
                                    cylinder(r=1.5, h=2, center=true);
                        }
                    }
                }
                // Front dual circular ports
                for (dz = [-2.8, 2.8]) {
                    translate([5.6, 0.4 * side, dz])
                        rotate([0, 90, 0])
                            cylinder(r=2.2, h=3, center=true);
                }
            }
            // Raised port bezel rings
            for (dz = [-2.8, 2.8]) {
                translate([5.4, 0.4 * side, dz])
                    rotate([0, 90, 0])
                        difference() {
                            cylinder(r=3.1, h=1.0, center=true);
                            cylinder(r=2.2, h=2.0, center=true);
                        }
            }
        }
    }
}

// External curved conduit pipes on turret cheeks
module turret_pipes(side=1) {
    p1 = [13.5, side * 7.5, 27.0];
    p2 = [10.5, side * 13.5, 26.5];
    p3 = [4.5,  side * 17.0, 28.5];
    p4 = [-1.5, side * 17.5, 30.5];

    // Pipe segments
    hull() { translate(p1) sphere(r=1.2); translate(p2) sphere(r=1.2); }
    hull() { translate(p2) sphere(r=1.2); translate(p3) sphere(r=1.2); }
    hull() { translate(p3) sphere(r=1.2); translate(p4) sphere(r=1.2); }

    // Mounting collars
    translate(p1) rotate([0, 90, 0]) cylinder(r=1.8, h=1.2, center=true);
    translate(p4) rotate([0, 0, side * 90]) cylinder(r=1.8, h=1.2, center=true);
}

// Commander's roof hatch with grab handle
module roof_hatch() {
    translate([0, 0, 44.2]) {
        // Raised hatch base plate
        hull() {
            translate([5, 0, 0]) cube([4, 13, 2], center=true);
            translate([-5, 0, 0]) cube([4, 11, 2], center=true);
        }

        // Hatch hinge line
        translate([-4.5, 0, 1.2])
            rotate([90, 0, 0])
                cylinder(r=1.2, h=9, center=true);

        // Grab handle
        translate([-1, 4.5, 1.6]) {
            hull() {
                translate([0, -3.5, 1.4]) sphere(r=0.6);
                translate([0, 0, 1.4]) sphere(r=0.6);
            }
            translate([0, -3.5, 0.7]) cylinder(r=0.6, h=1.4);
            translate([0, 0, 0.7]) cylinder(r=0.6, h=1.4);
        }
    }
}

// Top periscope / spotlight with hooded cowl
module periscope_spotlight() {
    translate([4, 0, 46]) {
        // Swivel mounting base
        cylinder(r=3.2, h=1.6);
        translate([0, 0, 1.6])
            cylinder(r=1.9, h=2.5);

        // Main cylindrical housing
        translate([1.5, 0, 5.2]) {
            rotate([0, 90, 0]) {
                difference() {
                    // Cylindrical body
                    cylinder(r=3.8, h=7.5, center=true);
                    // Lens recess
                    translate([0, 0, 2.2])
                        cylinder(r=3.1, h=4);
                }
                // Center optical bulb
                translate([0, 0, 2.6])
                    sphere(r=1.4);

                // Protective overhanging cowl / visor
                translate([0, 0, 2.2]) {
                    difference() {
                        cylinder(r=4.6, h=2.5);
                        cylinder(r=3.8, h=3);
                        // Cut away lower half to create an arched visor
                        translate([-6, -12, -0.5])
                            cube([12, 12, 4]);
                    }
                }
            }
        }
    }
}

// Multi-barrel rotary Gatling / Vulcan cannon
module gatling_gun() {
    // Ball-and-socket base
    sphere(r=3.6);
    cylinder(r=4.2, h=2.2);

    // Receiver housing
    translate([0, 0, 2.0]) {
        cylinder(r=3.5, h=5.5);
        // Barrel rotor disc
        translate([0, 0, 5.5])
            cylinder(r=3.8, h=2.0);

        // 6 Parallel rotating barrels
        translate([0, 0, 7.5]) {
            for (i = [0:5]) {
                rotate([0, 0, i * 60]) {
                    translate([2.2, 0, 0])
                        cylinder(r=0.6, h=16.5);
                }
            }
            // Center spindle
            cylinder(r=0.8, h=17);

            // Mid-barrel clamp ring
            translate([0, 0, 8.5])
                difference() {
                    cylinder(r=3.3, h=1.4);
                    cylinder(r=2.5, h=2, center=true);
                }

            // Muzzle clamp disc
            translate([0, 0, 15.5])
                difference() {
                    cylinder(r=3.4, h=1.2);
                    cylinder(r=0.9, h=2, center=true);
                }
        }
    }
}

// Exhaust pipes on rear turret deck
module exhaust_pipe(with_cap=false) {
    difference() {
        // Tilted pipe body
        cylinder(r=1.9, h=12.5);
        // Hollow interior
        translate([0, 0, 5])
            cylinder(r=1.3, h=8.5);
        // Angled slash cut at tip
        translate([0, 0, 12.5])
            rotate([0, 30, 0])
                cube([6, 6, 3], center=true);
    }

    // Flipped open rain flapper cap with hinge wire
    if (with_cap) {
        translate([1.2, 0, 12.8]) {
            rotate([0, -45, 0]) {
                cube([3.6, 3.2, 0.6], center=true);
                translate([0, 0, 1.2])
                    rotate([0, 90, 0])
                        cylinder(r=0.35, h=4, center=true);
            }
        }
    }
}

// Whip radio antennas
module antennas() {
    // Long main antenna (right rear)
    translate([-13, -3, 41]) {
        // Angled base socket
        cylinder(r1=1.6, r2=1.0, h=3);
        rotate([-12, 16, 0]) {
            cylinder(r1=0.75, r2=0.3, h=36);
            translate([0, 0, 36])
                sphere(r=0.9);
        }
    }

    // Short secondary antenna (left rear)
    translate([-14.5, 3, 40]) {
        cylinder(r1=1.4, r2=0.9, h=2.5);
        rotate([15, 20, 0]) {
            cylinder(r1=0.65, r2=0.3, h=22);
            translate([0, 0, 22])
                sphere(r=0.8);
        }
    }
}

// ==============================================================================
// 4. FINAL MODEL ASSEMBLY
// ==============================================================================

module chibi_tank() {
    // --- Chassis & Tracks ---
    track_assembly(y_pos =  track_span/2);
    track_assembly(y_pos = -track_span/2);
    lower_hull();

    // --- Turret & Armament ---
    turret_dome();
    main_cannon();

    // Side cheek pods & piping
    cheek_pod(side =  1);
    cheek_pod(side = -1);
    turret_pipes(side =  1);
    turret_pipes(side = -1);

    // Roof equipment
    roof_hatch();
    periscope_spotlight();

    // Rear Gatling guns (angled up and outward)
    translate([-9.5, 15.0, 36.5])
        rotate([20, -52, 28])
            gatling_gun();

    translate([-9.5, -15.0, 36.5])
        rotate([-20, -52, -28])
            gatling_gun();

    // Rear exhausts
    translate([-16.5, 6.5, 37.0])
        rotate([8, -32, 10])
            exhaust_pipe(with_cap=true);

    translate([-16.5, -6.5, 37.0])
        rotate([-8, -32, -10])
            exhaust_pipe(with_cap=false);

    // Antennas
    antennas();
}

// Render the completed model
chibi_tank();