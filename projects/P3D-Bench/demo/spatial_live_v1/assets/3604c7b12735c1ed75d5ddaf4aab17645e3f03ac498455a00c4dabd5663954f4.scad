// Parameters
shaft_length = 438;
shaft_diameter = 6;
piston_count = 4;
piston_spacing = 100;
crank_throw = 30;
crank_phase = 45;

boss_diameter = 30;
boss_thickness = 14;
arm_width = 6;
arm_thickness = 3.5;
arm_corner_radius = 0.6;
arm_slot_width = 1.5;
arm_slot_end_margin = 6;

piston_diameter = 50;
piston_height = 40;
skirt_bore_diameter = 40;
skirt_bore_depth = 27;
crown_pocket_diameter = 30;
crown_thickness = 5;
wrist_pin_diameter = 12;
wrist_pin_crown_offset = 24;
wrist_pin_end_inset = 0.3;
pin_flat_width = 17;
pin_flat_height = 14;
pin_flat_depth = 1.8;

ring_outer_diameter = 54.56;
ring_inner_diameter = 50;
ring_height = 5;
ring_top_offset = 1.5;
groove_crown_offset = 1.05;
groove_radius = 0.55;

rod_length = 85;
rod_big_end_diameter = 38;
rod_small_end_diameter = 20;
rod_thickness = 12;
rod_web_thickness = 3;
rod_fillet = 1.5;
rod_base_width = 27;
rod_base_height = 8;
rod_shoulder_width = 20;
rod_shoulder_height = 21;
rod_stem_width = 12;
rod_stem_start = 32;
rod_neck_width = 10;
rod_neck_offset = 13;
rod_head_width = 16;
rod_head_offset = 4;
rod_recess_lower = 29;
rod_recess_top_offset = 18;
rod_recess_lower_width = 6;
rod_recess_upper_width = 4;
rod_fork_gap = 4;
rod_fork_depth = 12;

bushing_outer_diameter = 8;
bushing_inner_diameter = 6;
bushing_length = 5;
shaft_end_recess = 0.6;
join_overlap = 0.04;
$fn = 96;

// Derived dimensions
station_start = (shaft_length - (piston_count - 1) * piston_spacing) / 2;
arm_offset = boss_thickness / 2 + arm_thickness / 2 - join_overlap;
rod_recess_depth = (rod_thickness - rod_web_thickness) / 2;
shaft_height = abs(crank_throw * cos(crank_phase))
             + rod_big_end_diameter / 2;

function station(i) = station_start + i * piston_spacing;
function phase(i) =
    (i == 0 || i == piston_count - 1) ? crank_phase : crank_phase + 180;
function crank_y(i) = crank_throw * sin(phase(i));
function crank_z(i) = crank_throw * cos(phase(i));
function rod_rise(i) = sqrt(rod_length * rod_length - crank_y(i) * crank_y(i));
function pin_z(i) = crank_z(i) + rod_rise(i);

assembly_height = shaft_height + pin_z(0) + wrist_pin_crown_offset;

$vpr = [60, 0, 315];
$vpt = [shaft_length / 2, 0, assembly_height / 2];
$vpd = shaft_length * 1.7;

assert(rod_length > crank_throw);
assert(rod_big_end_diameter > boss_diameter);
assert(station_start > ring_outer_diameter / 2);

// Axial helpers
module cylinder_x(length, diameter) {
    rotate([0, 90, 0])
        cylinder(h = length, d = diameter, center = true);
}

module extrude_x(thickness) {
    rotate([90, 0, 90])
        linear_extrude(height = thickness, center = true, convexity = 10)
            children();
}

module shaft_segment(start, finish) {
    translate([(start + finish) / 2, 0, 0])
        cylinder_x(finish - start, shaft_diameter);
}

// Slotted crank cheeks
module crank_arm() {
    difference() {
        extrude_x(arm_thickness)
            offset(r = arm_corner_radius)
                translate([
                    -arm_width / 2 + arm_corner_radius,
                    -arm_width / 2 + arm_corner_radius
                ])
                    square([
                        arm_width - 2 * arm_corner_radius,
                        crank_throw + arm_width - 2 * arm_corner_radius
                    ]);

        extrude_x(arm_thickness + 2 * join_overlap)
            hull() {
                translate([0, arm_slot_end_margin])
                    circle(d = arm_slot_width);
                translate([0, crank_throw - arm_slot_end_margin])
                    circle(d = arm_slot_width);
            }
    }
}

module crank_station(i) {
    translate([station(i), crank_y(i), crank_z(i)])
        cylinder_x(boss_thickness, boss_diameter);

    for (side = [-1, 1])
        translate([station(i) + side * arm_offset, 0, 0])
            rotate([-phase(i), 0, 0])
                crank_arm();
}

// Five journals and four offset bosses
module crankshaft() {
    union() {
        for (i = [0 : piston_count])
            let(
                start = i == 0
                    ? shaft_end_recess
                    : station(i - 1) + arm_offset,
                finish = i == piston_count
                    ? shaft_length
                    : station(i) - arm_offset
            )
                shaft_segment(start, finish);

        for (i = [0 : piston_count - 1])
            crank_station(i);
    }
}

// Connecting-rod outline
module rod_outline() {
    offset(r = rod_fillet)
        offset(delta = -rod_fillet)
            union() {
                circle(d = rod_big_end_diameter);

                translate([0, rod_length])
                    circle(d = rod_small_end_diameter);

                polygon(points = [
                    [-rod_base_width / 2, rod_base_height],
                    [-rod_shoulder_width / 2, rod_shoulder_height],
                    [-rod_stem_width / 2, rod_stem_start],
                    [-rod_neck_width / 2, rod_length - rod_neck_offset],
                    [-rod_head_width / 2, rod_length - rod_head_offset],
                    [ rod_head_width / 2, rod_length - rod_head_offset],
                    [ rod_neck_width / 2, rod_length - rod_neck_offset],
                    [ rod_stem_width / 2, rod_stem_start],
                    [ rod_shoulder_width / 2, rod_shoulder_height],
                    [ rod_base_width / 2, rod_base_height]
                ]);
            }
}

module rod_recess() {
    hull() {
        translate([0, rod_recess_lower])
            circle(d = rod_recess_lower_width);
        translate([0, rod_length - rod_recess_top_offset])
            circle(d = rod_recess_upper_width);
    }
}

// I-beam web and forked small end
module connecting_rod() {
    difference() {
        extrude_x(rod_thickness)
            rod_outline();

        cylinder_x(
            rod_thickness + 2 * join_overlap,
            boss_diameter - 2 * join_overlap
        );

        translate([0, 0, rod_length])
            cylinder_x(
                rod_thickness + 2 * join_overlap,
                wrist_pin_diameter
            );

        for (side = [-1, 1])
            translate([
                side * (rod_web_thickness / 2
                      + (rod_recess_depth + join_overlap) / 2),
                0, 0
            ])
                extrude_x(rod_recess_depth + join_overlap)
                    rod_recess();

        translate([
            -rod_fork_gap / 2,
            -rod_small_end_diameter / 2 - join_overlap,
            rod_length - rod_fork_depth
        ])
            cube([
                rod_fork_gap,
                rod_small_end_diameter + 2 * join_overlap,
                rod_fork_depth + rod_small_end_diameter / 2 + join_overlap
            ]);
    }
}

// Hollow piston and wrist-pin flats
module piston_barrel() {
    difference() {
        cylinder(h = piston_height, d = piston_diameter);

        translate([0, 0, -join_overlap])
            cylinder(
                h = skirt_bore_depth + join_overlap,
                d = skirt_bore_diameter
            );

        translate([0, 0, -join_overlap])
            cylinder(
                h = piston_height - crown_thickness + join_overlap,
                d = crown_pocket_diameter
            );

        translate([0, 0, piston_height - wrist_pin_crown_offset])
            cylinder_x(
                piston_diameter + 2 * join_overlap,
                wrist_pin_diameter
            );

        for (side = [-1, 1])
            translate([
                side * (piston_diameter / 2 - pin_flat_depth / 2),
                0,
                piston_height - wrist_pin_crown_offset
            ])
                cube([
                    pin_flat_depth + 2 * join_overlap,
                    pin_flat_width,
                    pin_flat_height
                ], center = true);

        translate([0, 0, piston_height - groove_crown_offset])
            rotate_extrude(convexity = 10)
                translate([piston_diameter / 2, 0])
                    circle(r = groove_radius);
    }
}

// Crown spacer
module spacer_ring() {
    difference() {
        cylinder(h = ring_height, d = ring_outer_diameter);
        translate([0, 0, -join_overlap])
            cylinder(
                h = ring_height + 2 * join_overlap,
                d = ring_inner_diameter - 2 * join_overlap
            );
    }
}

module piston() {
    union() {
        piston_barrel();
        translate([0, 0, piston_height - ring_top_offset - ring_height])
            spacer_ring();
    }
}

// End bushing
module end_bushing() {
    translate([bushing_length / 2, 0, 0])
        difference() {
            cylinder_x(bushing_length, bushing_outer_diameter);
            cylinder_x(
                bushing_length + 2 * join_overlap,
                bushing_inner_diameter - 2 * join_overlap
            );
        }
}

// Unified assembly
module assembly() {
    union() {
        crankshaft();
        end_bushing();

        for (i = [0 : piston_count - 1]) {
            translate([station(i), crank_y(i), crank_z(i)])
                rotate([atan2(crank_y(i), rod_rise(i)), 0, 0])
                    connecting_rod();

            translate([
                station(i),
                0,
                pin_z(i) + wrist_pin_crown_offset - piston_height
            ])
                piston();

            translate([station(i), 0, pin_z(i)])
                cylinder_x(
                    piston_diameter - 2 * wrist_pin_end_inset,
                    wrist_pin_diameter + 2 * join_overlap
                );
        }
    }
}

color([0.65, 0.65, 0.67])
    translate([0, 0, shaft_height])
        assembly();