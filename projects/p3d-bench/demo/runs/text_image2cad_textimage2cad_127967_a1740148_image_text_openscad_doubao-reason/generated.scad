// Global Configuration
$fn = 64;
arm_pose_elbow_angle = 45;
arm_pose_wrist_angle = 20;
gripper_open_angle = 30;

// Housing Cap (Base) Parameters
base_outer_r = 150;
base_inner_ledge_r = 130;
base_height = 104;
base_central_boss_r = 15;
base_central_boss_h = 20;
base_lug_count = 12;
base_lug_size = 30;

// Spacer Parameters
spacer_od = 6;
spacer_id = 3.2;
spacer_thickness = 3;
spacer_pcd = 120;
spacer_count = 12;

// Lever Arm with Bevel Gear Parameters
lever_base_r1 = 125;
lever_base_r2 = 90;
lever_base_r3 = 68.5;
lever_base_h = 40;
lever_arm_length = 220;
lever_arm_width = 100;
lever_arm_thickness = 60;
bevel_gear_r = 50;
bevel_gear_teeth = 24;
bevel_gear_h = 30;

// Connecting Arm Parameters
connect_arm_length = 442.5;
connect_arm_width = 120;
connect_arm_thickness = 62;
connect_hub_r = 30;
connect_flange_hole_d = 6;
connect_flange_hole_count = 13;
connect_flange_hole_depth = 10;

// Joint Housing Parameters
joint_housing_length = 296;
joint_housing_width = 132.5;
joint_housing_thickness = 93.9;
joint_bore_d = 30;
joint_bore_depth = 20;
joint_through_bore_d = 44;
joint_flange_hole_count = 12;
joint_flange_hole_d = 3;

// Multi-Bore Housing Parameters
multi_housing_length = 173.1;
multi_housing_width = 80;
multi_housing_thickness = 76.2;
multi_cross_bore_r = 85;
multi_long_bore_r = 35.4;
multi_boss_r = 15;

// Scroll Housing Parameters
scroll_outer_r = 35;
scroll_housing_length = 87.6;
scroll_housing_width = 70;
scroll_housing_thickness = 55.4;
scroll_mount_hole_d = 3;
scroll_mount_hole_count = 4;

// Gripper Jaw Parameters
gripper_length = 126.9;
gripper_width = 70.9;
gripper_thickness = 19.5;
gripper_pivot_r = 15;
gripper_slot_r = 7;
gripper_serration_count = 8;

// ------------------------------
// Module Definitions
// ------------------------------
module housing_cap() {
    union() {
        // Main base body
        cylinder(h=base_height, r=base_outer_r, center=false);
        // Inner ledge step
        translate([0,0,base_height*0.6]) cylinder(h=base_height*0.4, r=base_inner_ledge_r, center=false);
        // Central boss
        translate([0,0,base_height]) cylinder(h=base_central_boss_h, r=base_central_boss_r, center=false);
        // Peripheral lugs
        for (a = [0:360/base_lug_count:359]) rotate(a) translate([base_outer_r - base_lug_size/2, 0, base_height*0.3]) cube([base_lug_size, base_lug_size*0.8, base_height*0.7], center=false);
    }
}

module spacer() {
    difference() {
        cylinder(h=spacer_thickness, d=spacer_od, center=true);
        cylinder(h=spacer_thickness + 1, d=spacer_id, center=true);
    }
}

module lever_arm_with_bevel_gear() {
    union() {
        // Stepped turntable base
        cylinder(h=lever_base_h, r=lever_base_r1, center=false);
        translate([0,0,lever_base_h]) cylinder(h=lever_base_h*0.7, r=lever_base_r2, center=false);
        translate([0,0,lever_base_h*1.7]) cylinder(h=lever_base_h*0.5, r=lever_base_r3, center=false);
        // Lever arm web
        translate([0, 0, lever_base_h*2.2 + lever_arm_thickness/2]) rotate([90,0,0]) linear_extrude(height=lever_arm_thickness, center=true) hull() {
            circle(r=lever_base_r3);
            translate([lever_arm_length, 0]) circle(r=bevel_gear_r);
        }
        // Bevel gear hub
        translate([lever_arm_length, 0, lever_base_h*2.2 + lever_arm_thickness/2]) rotate([0,90,0]) cylinder(h=bevel_gear_h, r=bevel_gear_r, center=true);
        // Bevel gear teeth
        for (a = [0:360/bevel_gear_teeth:359]) rotate(a) translate([lever_arm_length, 0, lever_base_h*2.2 + lever_arm_thickness/2]) rotate([0,90,0]) linear_extrude(height=bevel_gear_h + 2, center=true) polygon(points=[
            [bevel_gear_r, 0], [bevel_gear_r + 8, 3], [bevel_gear_r + 8, -3]
        ]);
    }
    // Blind bores
    translate([lever_arm_length, 0, lever_base_h*2.2 + lever_arm_thickness/2]) rotate([0,90,0]) cylinder(h=joint_bore_depth + 1, d=joint_bore_d, center=true);
    translate([0, 0, -1]) cylinder(h=joint_bore_depth, d=joint_bore_d, center=false);
}

module connecting_arm() {
    difference() {
        union() {
            // Curved arm profile
            linear_extrude(height=connect_arm_thickness, center=true) hull() {
                for (i = [0:5]) {
                    x = i * connect_arm_length / 5;
                    y = 20 * sin(i * 30);
                    translate([x, y]) circle(r=connect_arm_width/2 - 10 + 5 * sin(i*60));
                }
            }
            // End hubs
            translate([0, 0, 0]) cylinder(h=connect_arm_thickness + 20, r=connect_hub_r, center=true);
            translate([connect_arm_length, 0, 0]) cylinder(h=connect_arm_thickness + 20, r=connect_hub_r, center=true);
        }
        // Hub bores
        translate([0, 0, 0]) cylinder(h=connect_arm_thickness + 22, d=joint_bore_d, center=true);
        translate([connect_arm_length, 0, 0]) cylinder(h=connect_arm_thickness + 22, d=joint_bore_d, center=true);
        // Flange holes
        for (a = [0:360/connect_flange_hole_count:359]) rotate(a) translate([0, connect_hub_r + 10, connect_arm_thickness/2]) cylinder(h=-connect_flange_hole_depth, d=connect_flange_hole_d, center=false);
    }
}

module joint_housing() {
    difference() {
        union() {
            // L-shaped body
            cube([joint_housing_width, joint_housing_width, joint_housing_length*0.4], center=true);
            translate([0, 0, joint_housing_length*0.3]) cylinder(h=joint_housing_length*0.7, r=31, center=true);
        }
        // Perpendicular blind bores
        translate([0, -joint_housing_width/2 - 1, 0]) rotate([0,90,0]) cylinder(h=joint_bore_depth + 2, d=joint_bore_d, center=false);
        translate([-joint_housing_width/2 - 1, 0, 0]) rotate([90,0,0]) cylinder(h=joint_bore_depth + 2, d=joint_bore_d, center=false);
        // Through bore
        translate([0, 0, -joint_housing_length/2 - 1]) cylinder(h=joint_housing_length + 2, d=joint_through_bore_d, center=false);
        // Flange bolt holes
        for (a = [0:360/joint_flange_hole_count:359]) rotate(a) translate([0, 35, -joint_housing_length*0.05]) cylinder(h=10, d=joint_flange_hole_d, center=true);
    }
}

module multi_bore_housing() {
    difference() {
        // Lobed main body
        linear_extrude(height=multi_housing_thickness, center=true) {
            polygon(points=[
                for (a = [0:15:345]) [
                    (multi_housing_width/2) + 10 * sin(a*4),
                    (multi_housing_length/2) * cos(a)
                ]
            ]);
        }
        // Cross bore
        rotate([90,0,0]) cylinder(h=multi_housing_thickness + 2, r=multi_cross_bore_r, center=true);
        // Longitudinal bores
        for (x = [-20, 20]) translate([x, 0, 0]) cylinder(h=multi_housing_length + 2, r=multi_long_bore_r, center=true);
        // Locating holes
        translate([0, -multi_housing_length/2 -1, 0]) cylinder(h=20, d=20, center=false);
        translate([0, multi_housing_length/2 +1, 0]) cylinder(h=-20, d=20, center=false);
    }
    // Mounting boss
    translate([0, multi_housing_length/2, 0]) cylinder(h=24, r=multi_boss_r, center=false);
}

module scroll_housing() {
    difference() {
        union() {
            // Main body
            cube([scroll_housing_length, scroll_housing_width, scroll_housing_thickness], center=true);
            // Front rim
            translate([scroll_housing_length/2, 0, 0]) rotate([0,90,0]) cylinder(h=10, r=scroll_outer_r, center=true);
        }
        // Mounting holes
        for (x = [-20, 20], y = [-15, 15]) translate([-scroll_housing_length/2 + 5, x, y]) cylinder(h=12, d=scroll_mount_hole_d, center=true);
        // Blind bore
        translate([scroll_housing_length/2 + 1, 0, 0]) rotate([0,90,0]) cylinder(h=30, d=20, center=false);
    }
}

module gripper_jaw() {
    difference() {
        union() {
            // Main V-shape body
            rotate([0,0,150]) linear_extrude(height=gripper_thickness, center=true) polygon(points=[
                [0,0], [gripper_length*0.7, 0], [gripper_length, gripper_width/2], [gripper_length*0.6, gripper_width], [0, gripper_width*0.3]
            ]);
            // Pivot boss
            cylinder(h=gripper_thickness + 10, r=gripper_pivot_r, center=true);
        }
        // Serrated gripping face
        for (i = [0:gripper_serration_count]) translate([gripper_length - i*5, gripper_width/2 + 2, -gripper_thickness/2 -1]) linear_extrude(height=gripper_thickness + 2) polygon(points=[[0,0], [5,0], [2.5,3]]);
        // Pivot bore
        cylinder(h=gripper_thickness + 12, d=20, center=true);
        // Adjustment slots
        translate([gripper_length*0.3, gripper_width*0.2, 0]) rotate([0,0,15]) hull() {
            circle(r=gripper_slot_r);
            translate([30, 0]) circle(r=gripper_slot_r);
        }
    }
}

// ------------------------------
// Assembly
// ------------------------------
union() {
    // Base
    housing_cap();

    // Spacer array
    for (a = [0:360/spacer_count:359]) rotate(a) translate([spacer_pcd/2, 0, base_height + spacer_thickness/2]) spacer();

    // Lever arm assembly
    translate([0, 0, base_height + base_central_boss_h]) rotate([0, 0, 15]) lever_arm_with_bevel_gear();

    // Connecting arm (raised elbow pose)
    translate([lever_arm_length, 0, base_height + base_central_boss_h + lever_base_h*2.2 + lever_arm_thickness/2]) rotate([0, arm_pose_elbow_angle, 90]) connecting_arm();

    // Joint housing
    translate([lever_arm_length + connect_arm_length * cos(arm_pose_elbow_angle * pi/180), 0, base_height + base_central_boss_h + lever_base_h*2.2 + lever_arm_thickness/2 + connect_arm_length * sin(arm_pose_elbow_angle * pi/180)]) rotate([0, arm_pose_elbow_angle + arm_pose_wrist_angle, 90]) joint_housing();

    // Multi bore housing
    translate([lever_arm_length + connect_arm_length * cos(arm_pose_elbow_angle * pi/180) + joint_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180), 
        0, 
        base_height + base_central_boss_h + lever_base_h*2.2 + lever_arm_thickness/2 + connect_arm_length * sin(arm_pose_elbow_angle * pi/180) + joint_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180)]) 
    rotate([0, arm_pose_elbow_angle + arm_pose_wrist_angle, 90]) multi_bore_housing();

    // Scroll housing
    translate([lever_arm_length + connect_arm_length * cos(arm_pose_elbow_angle * pi/180) + joint_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + multi_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180),
        0,
        base_height + base_central_boss_h + lever_base_h*2.2 + lever_arm_thickness/2 + connect_arm_length * sin(arm_pose_elbow_angle * pi/180) + joint_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + multi_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180)])
    rotate([0, arm_pose_elbow_angle + arm_pose_wrist_angle, 90]) scroll_housing();

    // Gripper jaws (open configuration)
    base_x = lever_arm_length + connect_arm_length * cos(arm_pose_elbow_angle * pi/180) + joint_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + multi_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + scroll_housing_length * cos((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180);
    base_z = base_height + base_central_boss_h + lever_base_h*2.2 + lever_arm_thickness/2 + connect_arm_length * sin(arm_pose_elbow_angle * pi/180) + joint_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + multi_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180) + scroll_housing_length * sin((arm_pose_elbow_angle + arm_pose_wrist_angle) * pi/180);
    translate([base_x, 0, base_z]) rotate([0, arm_pose_elbow_angle + arm_pose_wrist_angle, 0]) {
        translate([0, 30, 0]) rotate([0,0,gripper_open_angle]) gripper_jaw();
        translate([0, -30, 0]) rotate([0,0,180 - gripper_open_angle]) mirror([0,1,0]) gripper_jaw();
    }
}