// === Parametric Dimensions ===

// Base plate
base_length = 0.75;
base_width = 0.625;
base_height_nominal = 0.00625;
base_solid_height = 0.0062; // solid extension upward from base datum

// Left upright wall
wall_thickness = 0.0063;
wall_width = 0.625;         // flush with front and back edges
wall_left_offset = 0;
wall_right_offset = 0.7437; // from right edge of base to right edge of wall
wall_rise_above_plate = 0.1875;
wall_total_height = 0.1938; // total reach from base datum

// Cut 1: Lower rectangular opening through wall
cut1_along_wall = 0.081103; // y-span
cut1_height = 0.111891;     // z-span
cut1_front_offset = 0.4447;
cut1_back_offset = 0.0992;
cut1_z_bottom = 0;
cut1_z_top = 0.1119;
cut1_reach = 0.0062;        // x-depth through wall

// Cut 2: Circular through-hole in wall
cut2_radius = 0.0432;
cut2_left_offset = 0;       // axis at left face of wall
cut2_front_offset = 0.2948; // axis y-position from front
cut2_z_bottom = 0.0631;
cut2_z_top = 0.1495;
cut2_reach = 0.0625;        // x-depth of cylindrical cut

// Cut 3: Smaller rectangular through opening in wall
cut3_along_wall = 0.043521; // y-span
cut3_height = 0.044108;     // z-span
cut3_front_offset = 0.091;
cut3_back_offset = 0.4905;
cut3_z_bottom = 0.0992;
cut3_z_top = 0.1433;
cut3_reach = 0.0625;        // x-depth through wall

// Cut 4: Rectangular through opening in base plate
cut4_x_span = 0.264669;
cut4_y_span = 0.40625;
cut4_left_offset = 0.3125;
cut4_right_offset = 0.1728;
cut4_front_offset = 0.2073;
cut4_back_offset = 0.0115;
cut4_z_bottom = -0.0562;
cut4_z_top = 0.0063;

// Resolution and tolerance
$fn = 100;
eps = 0.0001;

// === Main Model ===
difference() {
    // Solid body: base plate + left wall
    union() {
        // Base plate (solid portion extending 0.0062 upward)
        cube([base_length, base_width, base_solid_height]);

        // Left upright wall along left edge, flush front/back
        // x: 0 to wall_thickness, y: 0 to wall_width, z: 0 to wall_total_height
        cube([wall_thickness, wall_width, wall_total_height]);
    }

    // Cut 1: Lower rectangular opening through wall thickness
    // y-position: front offset from y=0, back offset from y=base_width
    translate([-eps, cut1_front_offset, cut1_z_bottom])
        cube([
            cut1_reach + eps,
            base_width - cut1_front_offset - cut1_back_offset,
            cut1_z_top - cut1_z_bottom
        ]);

    // Cut 2: Circular through-hole in wall
    // Axis at left face (x=0), front offset gives y-center, z-center from height band
    translate([-eps, cut2_front_offset, (cut2_z_bottom + cut2_z_top) / 2])
        rotate([0, 90, 0])
            cylinder(h=cut2_reach + eps, r=cut2_radius);

    // Cut 3: Smaller rectangular through opening in wall
    translate([-eps, cut3_front_offset, cut3_z_bottom])
        cube([
            cut3_reach + eps,
            base_width - cut3_front_offset - cut3_back_offset,
            cut3_z_top - cut3_z_bottom
        ]);

    // Cut 4: Rectangular through opening in horizontal base plate
    // Fully passes through the thin plate (z-band extends below and above plate)
    translate([cut4_left_offset, cut4_front_offset, cut4_z_bottom])
        cube([
            base_length - cut4_left_offset - cut4_right_offset,
            base_width - cut4_front_offset - cut4_back_offset,
            cut4_z_top - cut4_z_bottom
        ]);
}