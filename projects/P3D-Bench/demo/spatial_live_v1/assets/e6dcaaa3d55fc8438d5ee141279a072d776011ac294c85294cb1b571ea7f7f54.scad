// Global Parameters
$fn = 48;
blade_thickness = 2;
boss_height = 0.2;
pivot_hole_d = 1.583;
pivot_hole_r = pivot_hole_d / 2;
rotation_angle = 7; // degrees per blade, total open angle ~14 degrees

// Scissor half module: creates one blade+handle+loop, pivot at local origin
module scissor_half(is_large=true) {
    // Dimension set for large (right/wide loop) vs small (left/narrow loop) half
    if (is_large) {
        loop_center = [28, 46];
        loop_outer_rx = 14;
        loop_outer_ry = 22;
        loop_inner_rx = 9;
        loop_inner_ry = 15;
        blade_points = [
            [0, -93],   // Sharp blade tip
            [7, 0],     // Spine at pivot
            [9, 25],    // Mid spine curve
            [16, 40],   // Shank at loop junction
            [0, 39],    // Inner shank at loop
            [0, 18],    // Mid inner shank curve
            [-4, 0]     // Inner cutting edge at pivot
        ];
        add_boss = true;
    } else {
        loop_center = [-18, 50];
        loop_outer_rx = 8;
        loop_outer_ry = 13;
        loop_inner_rx = 5;
        loop_inner_ry = 9;
        blade_points = [
            [0, -90],   // Sharp blade tip
            [-6, 0],    // Spine at pivot
            [-8, 25],   // Mid spine curve
            [-12, 42],  // Shank at loop junction
            [0, 37],    // Inner shank at loop
            [0, 16],    // Mid inner shank curve
            [0.5, 0]    // Inner cutting edge at pivot
        ];
        add_boss = false;
    }
    boss_r = 2.654;

    difference() {
        union() {
            // Main blade/handle profile, extruded to thickness
            linear_extrude(height=blade_thickness, center=false) {
                difference() {
                    union() {
                        polygon(points=blade_points);
                        // Outer loop ellipse
                        translate(loop_center)
                            scale([loop_outer_rx/loop_outer_ry, 1, 1])
                            circle(r=loop_outer_ry);
                    }
                    // Hollow finger hole cutout
                    translate(loop_center)
                        scale([loop_inner_rx/loop_inner_ry, 1, 1])
                        circle(r=loop_inner_ry);
                }
            }
            // Pivot boss on inner face of large half
            if (add_boss) {
                translate([0, 0, blade_thickness])
                    cylinder(r=boss_r, h=boss_height, center=false, $fn=32);
            }
        }
        // Pivot through-hole (drills through blade + boss)
        translate([0, 0, -1])
            cylinder(r=pivot_hole_r, h=blade_thickness + boss_height + 2, center=false, $fn=32);
    }
}

// Slotted pivot fastener (spool-shaped with screwdriver slot)
module slotted_fastener() {
    shaft_r = 0.78; // Clearance fit for pivot hole
    total_stack = blade_thickness + boss_height + blade_thickness; // 4.2mm
    back_head_r = 2.66;
    back_head_h = 0.9;
    front_head_r = 2.56;
    front_head_h = 0.9;
    slot_w = 0.8;
    slot_l = 6;

    difference() {
        union() {
            // Back (unslotted) domed head
            translate([0,0,-back_head_h])
                cylinder(r=back_head_r, h=back_head_h, center=false);
            // Central pivot shaft
            cylinder(r=shaft_r, h=total_stack, center=false, $fn=32);
            // Front (slotted) domed head
            translate([0,0,total_stack])
                cylinder(r=front_head_r, h=front_head_h, center=false);
        }
        // Screwdriver slot cut in front head
        translate([0,0, total_stack + front_head_h/2])
            rotate(-30, [0,0,1]) // Match angle from reference render
            cube([slot_l, slot_w, front_head_h + 0.2], center=true);
    }
}

// Main assembly
union() {
    // Large half (right loop, long blade, with boss)
    rotate(-rotation_angle, [0,0,1])
        scissor_half(is_large=true);
    
    // Small half (left loop, shorter blade, no boss), shifted along Z to stack on boss
    translate([0,0, blade_thickness + boss_height])
        rotate(rotation_angle, [0,0,1])
            scissor_half(is_large=false);
    
    // Pivot fastener, aligned along Z axis through both holes
    slotted_fastener();
}