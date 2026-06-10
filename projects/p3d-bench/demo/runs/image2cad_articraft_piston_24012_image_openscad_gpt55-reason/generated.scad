// Parametric piston and connecting rod assembly
// Units: millimeters
// Interpretation: a stylized engine piston with crown recess, ring grooves,
// wrist-pin boss, I-beam connecting rod, big-end bore, cap blocks, and bolts.

// -----------------------------------------------------------------------------
// Global resolution
// -----------------------------------------------------------------------------
$fn = 96;
eps = 0.05;

// -----------------------------------------------------------------------------
// Piston parameters
// -----------------------------------------------------------------------------
piston_d              = 60;
piston_r              = piston_d / 2;
piston_h              = 36;
piston_edge_chamfer   = 2.0;
piston_top_z          =  piston_h / 2;
piston_bottom_z       = -piston_h / 2;

// Top crown detail
top_recess_d          = 12;
top_recess_depth      = 0.8;
top_slot_width        = 0.9;
top_slot_depth        = 0.35;
top_slot_angle        = 32;

// Compression ring groove group
ring_groove_count     = 7;
ring_groove_top_z     = piston_top_z - 11.0;
ring_groove_pitch     = 1.35;
ring_groove_width     = 0.62;
ring_groove_depth     = 1.25;

// Lower skirt/oil grooves
bottom_groove_zs      = [piston_bottom_z + 4.0, piston_bottom_z + 5.4];
bottom_groove_width   = 0.85;
bottom_groove_depth   = 1.0;

// Wrist-pin boss on one visible side
pin_angle             = -35;
pin_z                 = -4.0;
pin_hole_d            = 8.5;
pin_boss_outer_d      = 20;
pin_boss_length       = 10;
pin_boss_embed        = 2.5;
pin_boss_lip_d        = 14;
pin_boss_lip_length   = 4;

// -----------------------------------------------------------------------------
// Connecting rod parameters
// -----------------------------------------------------------------------------
big_end_center_z      = piston_bottom_z - 105;
big_end_outer_d       = 38;
big_end_inner_d       = 23.5;
big_end_y             = 12;
big_end_lip_y         = 2.0;
big_end_lip_width     = 3.0;

rod_top_z             = piston_bottom_z + 0.8;
rod_bottom_z          = big_end_center_z + big_end_outer_d / 2 - 6.0;

rod_top_w             = 13;
rod_mid_w             = 16;
rod_bottom_w          = 31;
rod_frame_y           = 7.2;
rod_rail_y            = 10.5;
rod_web_y             = 4.0;

rod_inner_top_w       = 5.2;
rod_inner_bottom_w    = 15.2;
rod_window_top_z      = rod_top_z - 13;
rod_window_bottom_z   = rod_bottom_z + 13;
rod_window_tip_z      = rod_bottom_z + 6;

rod_rail_d            = 4.0;
rod_rib_d             = 2.8;

top_neck_h            = 14;
top_neck_overlap      = 1.2;

// Big-end cap and fastener parameters
cap_block_w           = 8.5;
cap_block_y           = 15;
cap_block_h           = 30;
cap_block_overlap     = 2.0;
cap_block_drop        = 5.0;
cap_bridge_h          = 7.5;
cap_split_gap         = 0.75;
cap_split_z_offset    = 4.5;

bolt_stud_d           = 3.2;
bolt_stud_h           = 6.0;
bolt_head_d           = 6.2;
bolt_head_h           = 3.0;

// -----------------------------------------------------------------------------
// Helper modules
// -----------------------------------------------------------------------------

// Cylinder whose axis is along global Y.
module cylinder_y(length, diameter) {
    rotate([90, 0, 0])
        cylinder(h = length, d = diameter, center = true);
}

// Cylinder placed radially around the piston axis.
module radial_cylinder(angle, radius, zpos, length, diameter) {
    translate([radius * cos(angle), radius * sin(angle), zpos])
        rotate([0, 0, angle])
            rotate([0, 90, 0])
                cylinder(h = length, d = diameter, center = true);
}

// Extrude a 2D X/Z profile along global Y.
module extrude_y(thickness, convexity = 10) {
    rotate([90, 0, 0])
        linear_extrude(height = thickness, center = true, convexity = convexity)
            children();
}

// Rounded 2D bar between two points, used for rod ribs.
module capsule_2d(p1, p2, diameter) {
    hull() {
        translate(p1) circle(d = diameter);
        translate(p2) circle(d = diameter);
    }
}

// Annular rectangular cutter for piston side grooves.
module annular_groove_cut(zpos, width, depth) {
    rotate_extrude(convexity = 6)
        translate([piston_r - depth, zpos - width / 2])
            square([depth + 2.0, width]);
}

// -----------------------------------------------------------------------------
// Piston modules
// -----------------------------------------------------------------------------

// Main chamfered piston body generated as a revolved profile.
module piston_core() {
    r  = piston_r;
    ch = piston_edge_chamfer;

    rotate_extrude(convexity = 8)
        polygon(points = [
            [0,      -piston_h / 2],
            [r - ch, -piston_h / 2],
            [r,      -piston_h / 2 + ch],
            [r,       piston_h / 2 - ch],
            [r - ch,  piston_h / 2],
            [0,       piston_h / 2]
        ]);
}

// Raised circular wrist-pin boss and smaller raised lip on the visible side.
module wrist_pin_boss(angle = pin_angle) {
    radial_cylinder(
        angle,
        piston_r + pin_boss_length / 2 - pin_boss_embed,
        pin_z,
        pin_boss_length,
        pin_boss_outer_d
    );

    radial_cylinder(
        angle,
        piston_r + pin_boss_length - pin_boss_embed + pin_boss_lip_length / 2 - eps,
        pin_z,
        pin_boss_lip_length + eps,
        pin_boss_lip_d
    );
}

// Cutters for the shallow crown recess and fine radial mark on the top.
module piston_top_detail_cuts() {
    translate([0, 0, piston_top_z - top_recess_depth / 2 + eps])
        cylinder(h = top_recess_depth + 2 * eps, d = top_recess_d, center = true);

    r1 = top_recess_d / 2;
    r2 = piston_r - piston_edge_chamfer - 2.0;

    rotate([0, 0, top_slot_angle])
        translate([(r1 + r2) / 2, 0, piston_top_z - top_slot_depth / 2 + eps])
            cube([r2 - r1, top_slot_width, top_slot_depth + 2 * eps], center = true);
}

// Complete piston with ring grooves, top recess, and wrist-pin hole.
module piston() {
    difference() {
        union() {
            piston_core();
            wrist_pin_boss(pin_angle);
        }

        // Upper ring pack: several close grooves below the crown.
        for (i = [0 : ring_groove_count - 1])
            annular_groove_cut(
                ring_groove_top_z - i * ring_groove_pitch,
                ring_groove_width,
                ring_groove_depth
            );

        // Lower skirt grooves near the bottom edge.
        for (zpos = bottom_groove_zs)
            annular_groove_cut(zpos, bottom_groove_width, bottom_groove_depth);

        // Shallow top details.
        piston_top_detail_cuts();

        // Through wrist-pin bore.
        radial_cylinder(
            pin_angle,
            0,
            pin_z,
            piston_d + 2 * (pin_boss_length + pin_boss_lip_length + 6),
            pin_hole_d
        );
    }
}

// -----------------------------------------------------------------------------
// Connecting rod modules
// -----------------------------------------------------------------------------

// Outer tapered connecting-rod shank profile.
module rod_outer_2d() {
    rod_mid_z = (rod_top_z + rod_bottom_z) / 2;

    polygon(points = [
        [-rod_top_w / 2,    rod_top_z],
        [ rod_top_w / 2,    rod_top_z],
        [ rod_mid_w / 2,    rod_mid_z],
        [ rod_bottom_w / 2, rod_bottom_z],
        [-rod_bottom_w / 2, rod_bottom_z],
        [-rod_mid_w / 2,    rod_mid_z]
    ]);
}

// Long internal opening that leaves an I-beam/truss frame.
module rod_inner_window_2d() {
    polygon(points = [
        [-rod_inner_top_w / 2,    rod_window_top_z],
        [ rod_inner_top_w / 2,    rod_window_top_z],
        [ rod_inner_bottom_w / 2, rod_window_bottom_z],
        [0,                       rod_window_tip_z],
        [-rod_inner_bottom_w / 2, rod_window_bottom_z]
    ]);
}

// Main rod frame with central cut-out.
module rod_frame() {
    extrude_y(rod_frame_y)
        difference() {
            rod_outer_2d();
            rod_inner_window_2d();
        }
}

// Raised outer rails on the connecting rod.
module rod_raised_rails() {
    extrude_y(rod_rail_y)
        union() {
            capsule_2d(
                [-(rod_top_w / 2 - rod_rail_d / 3), rod_top_z - 1.5],
                [-(rod_bottom_w / 2 - rod_rail_d / 2), rod_bottom_z + 2.0],
                rod_rail_d
            );

            capsule_2d(
                [ (rod_top_w / 2 - rod_rail_d / 3), rod_top_z - 1.5],
                [ (rod_bottom_w / 2 - rod_rail_d / 2), rod_bottom_z + 2.0],
                rod_rail_d
            );

            capsule_2d(
                [-rod_top_w / 2 + 2.2, rod_top_z - 1.2],
                [ rod_top_w / 2 - 2.2, rod_top_z - 1.2],
                rod_rail_d
            );

            capsule_2d(
                [-rod_bottom_w / 2 + 3.0, rod_bottom_z + 1.6],
                [ rod_bottom_w / 2 - 3.0, rod_bottom_z + 1.6],
                rod_rail_d
            );
        }
}

// Internal diagonal and vertical reinforcing ribs visible in the rod window.
module rod_internal_ribs() {
    mid_slot_z = (rod_window_top_z + rod_window_bottom_z) / 2;

    extrude_y(rod_web_y)
        union() {
            capsule_2d(
                [0, rod_window_top_z - 0.8],
                [0, rod_window_tip_z + 1.0],
                rod_rib_d * 0.85
            );

            capsule_2d(
                [-(rod_inner_bottom_w / 2 + 0.7), rod_window_bottom_z + 1.5],
                [ (rod_inner_top_w / 2 + 1.7),    mid_slot_z - 2.0],
                rod_rib_d
            );

            capsule_2d(
                [ (rod_inner_bottom_w / 2 + 0.7), rod_window_bottom_z - 5.5],
                [-(rod_inner_top_w / 2 + 1.7),    mid_slot_z + 10.0],
                rod_rib_d
            );

            capsule_2d(
                [-(rod_inner_top_w / 2 + 1.2),    rod_window_top_z + 2.0],
                [ (rod_inner_bottom_w / 2 + 0.3), rod_window_bottom_z - 2.0],
                rod_rib_d * 0.78
            );
        }
}

// Solid upper neck disappearing into the underside of the piston.
module rod_top_neck() {
    translate([0, 0, piston_bottom_z - top_neck_h / 2 + top_neck_overlap])
        cube([rod_top_w * 0.9, rod_frame_y, top_neck_h], center = true);
}

// Big-end bearing body with cap ears, bridge, bore, raised lips, and split line.
module big_end_body() {
    cap_x      = big_end_outer_d / 2 + cap_block_w / 2 - cap_block_overlap;
    cap_center = big_end_center_z - cap_block_drop;
    bridge_z  = big_end_center_z - big_end_outer_d / 2 + cap_bridge_h / 2 + 1.0;

    difference() {
        union() {
            // Main circular big-end ring.
            translate([0, 0, big_end_center_z])
                cylinder_y(big_end_y, big_end_outer_d);

            // Raised collars around both faces of the bearing bore.
            for (side = [-1, 1])
                translate([0, side * (big_end_y / 2 + big_end_lip_y / 2 - eps), big_end_center_z])
                    cylinder_y(big_end_lip_y, big_end_inner_d + 2 * big_end_lip_width);

            // Side cap blocks.
            for (sx = [-1, 1])
                translate([sx * cap_x, 0, cap_center])
                    cube([cap_block_w, cap_block_y, cap_block_h], center = true);

            // Lower cap bridge.
            translate([0, 0, bridge_z])
                cube([big_end_outer_d + 2 * cap_block_w - 4, cap_block_y, cap_bridge_h], center = true);
        }

        // Bearing bore through the big end.
        translate([0, 0, big_end_center_z])
            cylinder_y(big_end_y + 2 * big_end_lip_y + 2, big_end_inner_d);

        // Thin horizontal cap split line.
        translate([0, 0, big_end_center_z - cap_split_z_offset])
            cube([big_end_outer_d + 2 * cap_block_w + 6, cap_block_y + 3, cap_split_gap], center = true);
    }
}

// Vertical bolt/stud and hex head used on the cap blocks.
module cap_bolt_stack(base_z) {
    translate([0, 0, base_z + bolt_stud_h / 2])
        cylinder(h = bolt_stud_h, d = bolt_stud_d, center = true);

    translate([0, 0, base_z + bolt_stud_h + bolt_head_h / 2 - eps])
        cylinder(h = bolt_head_h, d = bolt_head_d, center = true, $fn = 6);
}

// Cap fasteners on both side blocks.
module big_end_bolts() {
    cap_x       = big_end_outer_d / 2 + cap_block_w / 2 - cap_block_overlap;
    cap_center  = big_end_center_z - cap_block_drop;
    cap_top_z   = cap_center + cap_block_h / 2;
    cap_bottom_z = cap_center - cap_block_h / 2;

    for (sx = [-1, 1]) {
        translate([sx * cap_x, 0, 0])
            cap_bolt_stack(cap_top_z - eps);

        translate([sx * cap_x, 0, cap_bottom_z - bolt_head_h / 2 + eps])
            cylinder(h = bolt_head_h, d = bolt_head_d, center = true, $fn = 6);
    }
}

// Complete big-end assembly.
module big_end() {
    union() {
        big_end_body();
        big_end_bolts();
    }
}

// Complete connecting rod.
module connecting_rod() {
    union() {
        rod_frame();
        rod_raised_rails();
        rod_internal_ribs();
        rod_top_neck();
        big_end();
    }
}

// -----------------------------------------------------------------------------
// Main model
// -----------------------------------------------------------------------------
color([0.72, 0.72, 0.72])
union() {
    piston();
    connecting_rod();
}