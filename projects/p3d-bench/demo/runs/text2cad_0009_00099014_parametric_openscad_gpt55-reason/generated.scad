// Parameters
$fn = 32;
join_overlap = 0.00001;

// Base dimensions
base_length = 0.75;
base_width = 0.669426;
base_height = 0.150979;
base_main_depth = 0.151;

// Z references: left/front/underside corner is [0,0,0]
base_underside_z = 0;
shallow_pad_depth = base_main_depth;
shallow_top_z = base_underside_z;
shallow_bottom_z = base_underside_z - shallow_pad_depth;

deep_start_below_underside = 0.1509;
deep_continuation_depth = 0.302;
deep_reach_below_underside = deep_start_below_underside + deep_continuation_depth; // 0.4529
deep_top_z = base_underside_z - deep_start_below_underside;
deep_bottom_z = base_underside_z - deep_reach_below_underside;

// Shallow pad 1
p1_sx = 0.156427;
p1_sy = 0.090313;
p1_left = 0.5351;
p1_right = 0.0585;
p1_front = 0.109;
p1_back = 0.4701;

// Shallow pad 2
p2_sx = 0.202932;
p2_sy = 0.128382;
p2_left = 0.0568;
p2_right = 0.4903;
p2_front = 0.0294;
p2_back = 0.5116;

// Shallow pad 3
p3_sx = 0.207237;
p3_sy = 0.111076;
p3_left = 0.5157;
p3_right = 0.0271;
p3_front = 0.5131;
p3_back = 0.0452;

// Shallow pad 4
p4_sx = 0.235324;
p4_sy = 0.115862;
p4_left = 0.0893;
p4_right = 0.4254;
p4_front = 0.5088;
p4_back = 0.0447;

// Deep continuation 1
p1d_sx = 0.078214;
p1d_sy = 0.090313;
p1d_left = 0.6133;
p1d_right = 0.0585;
p1d_front = 0.109;
p1d_back = 0.4701;

// Deep continuation 2
p2d_sx = 0.101466;
p2d_sy = 0.128382;
p2d_left = 0.0568;
p2d_right = 0.5917;
p2d_front = 0.0294;
p2d_back = 0.5116;

// Deep continuation 3
p3d_sx = 0.103619;
p3d_sy = 0.111076;
p3d_left = 0.6193;
p3d_right = 0.0271;
p3d_front = 0.5131;
p3d_back = 0.0452;

// Deep continuation 4
p4d_sx = 0.117662;
p4d_sy = 0.115862;
p4d_left = 0.0893;
p4d_right = 0.543;
p4d_front = 0.5088;
p4d_back = 0.0447;

// Base body
module base_body() {
    cube([base_length, base_width, base_height], center=false);
}

// Rectangular underside addition
module rectangular_feature(
    sx, sy,
    left_offset, right_offset,
    front_offset, back_offset,
    z_top, z_bottom,
    anchor_right=false,
    anchor_back=false,
    overlap_top=0
) {
    x0 = anchor_right ? base_length - right_offset - sx : left_offset;
    y0 = anchor_back ? base_width - back_offset - sy : front_offset;

    translate([x0, y0, z_bottom])
        cube([sx, sy, (z_top - z_bottom) + overlap_top], center=false);
}

// Main model
union() {
    // Reference base
    base_body();

    // Shallow underside pads
    rectangular_feature(p1_sx, p1_sy, p1_left, p1_right, p1_front, p1_back, shallow_top_z, shallow_bottom_z, true,  false, join_overlap);
    rectangular_feature(p2_sx, p2_sy, p2_left, p2_right, p2_front, p2_back, shallow_top_z, shallow_bottom_z, false, false, join_overlap);
    rectangular_feature(p3_sx, p3_sy, p3_left, p3_right, p3_front, p3_back, shallow_top_z, shallow_bottom_z, true,  true,  join_overlap);
    rectangular_feature(p4_sx, p4_sy, p4_left, p4_right, p4_front, p4_back, shallow_top_z, shallow_bottom_z, false, true,  join_overlap);

    // Deeper continuations
    rectangular_feature(p1d_sx, p1d_sy, p1d_left, p1d_right, p1d_front, p1d_back, deep_top_z, deep_bottom_z, true,  false, 0);
    rectangular_feature(p2d_sx, p2d_sy, p2d_left, p2d_right, p2d_front, p2d_back, deep_top_z, deep_bottom_z, false, false, 0);
    rectangular_feature(p3d_sx, p3d_sy, p3d_left, p3d_right, p3d_front, p3d_back, deep_top_z, deep_bottom_z, true,  true,  0);
    rectangular_feature(p4d_sx, p4d_sy, p4d_left, p4d_right, p4d_front, p4d_back, deep_top_z, deep_bottom_z, false, true,  0);
}