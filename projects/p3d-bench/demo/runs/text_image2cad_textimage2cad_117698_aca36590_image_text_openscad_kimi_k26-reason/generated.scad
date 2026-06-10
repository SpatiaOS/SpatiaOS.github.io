// Parameters
ship_length = 100;
ship_width = 20;
hull_height = 14;
hull_curvature = 22;

turret_r = 5;
turret_h = 4;

chimney_r = 2.5;
chimney_h = 10;

barrel_r = 0.5;
barrel_l = 10;
barrel_pitch = 12;
barrel_spacing = 1.3;

// Superstructure dimensions
ss_base_l = 30;
ss_base_w = 12;
ss_base_h = 3.5;
ss_mid_l = 22;
ss_mid_w = 10;
ss_mid_h = 3;
ss_top_l = 14;
ss_top_w = 8;
ss_top_h = 2.5;
bridge_l = 4;
bridge_w = 4;
bridge_h = 4;

// Positions along Z (bow toward +Z)
deck_y = 0;
bow_turret_z = 38;
fwd_turret_z = 16;
aft_turret_z = -18;
ss_center_z = 0;
bridge_z = 9;
chimney_z = 2;

// Spacer
spacer_chord = 6.2;
spacer_h = 2.1;
spacer_length = 9.7;
spacer_end_angle = 10;
spacer_R = (pow(spacer_chord / 2, 2) + pow(spacer_h, 2)) / (2 * spacer_h);
spacer_d = spacer_R - spacer_h;
spacer_x = 6.5;
spacer_z = -8;

$fn = 80;

// Lower hull: lower half of a scaled ellipsoid truncated at the flat base
module hull_body() {
    intersection() {
        scale([ship_width / 2, hull_curvature, ship_length / 2])
            sphere(r = 1);
        translate([0, -hull_height / 2, 0])
            cube([ship_width * 2, hull_height, ship_length * 2], center = true);
    }
}

// Stepped rectangular superstructure + bridge tower
module superstructure() {
    translate([0, deck_y + ss_base_h / 2, ss_center_z])
        cube([ss_base_w, ss_base_h, ss_base_l], center = true);

    translate([0, deck_y + ss_base_h + ss_mid_h / 2, ss_center_z])
        cube([ss_mid_w, ss_mid_h, ss_mid_l], center = true);

    translate([0, deck_y + ss_base_h + ss_mid_h + ss_top_h / 2, ss_center_z])
        cube([ss_top_w, ss_top_h, ss_top_l], center = true);

    translate([0, deck_y + ss_base_h + ss_mid_h + bridge_h / 2, ss_center_z + bridge_z])
        cube([bridge_w, bridge_h, bridge_l], center = true);
}

// Cylindrical chimney on top of the superstructure
module chimney() {
    translate([0, deck_y + ss_base_h + ss_mid_h + ss_top_h + chimney_h / 2, ss_center_z + chimney_z])
        cylinder(r = chimney_r, h = chimney_h, center = true);
}

// Turret base cylinder
module turret_boss(z_pos) {
    translate([0, deck_y + turret_h / 2, z_pos])
        cylinder(r = turret_r, h = turret_h, center = true);
}

// Single gun barrel pitched slightly upward
module barrel() {
    rotate([-barrel_pitch, 0, 0])
        cylinder(r = barrel_r, h = barrel_l);
}

// Triple barrel cluster spaced laterally
module barrel_cluster() {
    for (dx = [-barrel_spacing, 0, barrel_spacing])
        translate([dx, 0, 0])
            barrel();
}

// Partial-cylindrical spacer with oblique end caps
module spacer_part() {
    difference() {
        translate([0, -spacer_d, 0])
            cylinder(r = spacer_R, h = spacer_length + 2, center = true);

        // Flat bottom face at deck level
        translate([0, -500, 0])
            cube([1000, 1000, 1000], center = true);

        // Oblique end caps
        rotate([spacer_end_angle, 0, 0])
            translate([0, 0, spacer_length / 2 + 1])
                cube([20, 20, 4], center = true);

        rotate([-spacer_end_angle, 0, 0])
            translate([0, 0, -spacer_length / 2 - 1])
                cube([20, 20, 4], center = true);
    }
}

// Unified assembly
union() {
    // Ship figurine monolithic body
    hull_body();
    superstructure();
    turret_boss(bow_turret_z);
    turret_boss(fwd_turret_z);
    turret_boss(aft_turret_z);
    chimney();

    // Nine pin barrels in three triple clusters
    translate([0, deck_y + turret_h, bow_turret_z + turret_r * 0.5])
        barrel_cluster();
    translate([0, deck_y + turret_h, fwd_turret_z + turret_r * 0.5])
        barrel_cluster();
    translate([0, deck_y + turret_h, aft_turret_z + turret_r * 0.5])
        barrel_cluster();

    // Spacer cowl on the starboard deck
    translate([spacer_x, deck_y, spacer_z])
        spacer_part();
}