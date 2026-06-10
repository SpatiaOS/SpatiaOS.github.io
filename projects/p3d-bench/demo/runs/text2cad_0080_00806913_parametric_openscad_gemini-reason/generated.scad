// Parameters
overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;

lobe_radius = 0.1103;
center_left_x = 0.1103;
center_right_x = 0.6397;
center_y = 0.1103;

bore_radius = 0.0294;
recess_radius = 0.0956;
recess_height = 0.0882;

slot_length = 0.191175;
slot_height = 0.023529;
slot_x_offset = 0.2794;
slot_z_start = 0.0618;
slot_y_reach = 0.7353;

$fn = 100;
eps = 0.001; // Small overlap for clean boolean operations

// Main part
difference() {
    // 1. Main solid body: rounded link formed by hulling the two end lobes
    hull() {
        translate([center_left_x, center_y, 0])
            cylinder(r=lobe_radius, h=overall_height);
        translate([center_right_x, center_y, 0])
            cylinder(r=lobe_radius, h=overall_height);
    }

    // 2. Left centered bore (through-hole)
    translate([center_left_x, center_y, -eps])
        cylinder(r=bore_radius, h=overall_height + 2*eps);

    // 3. Right centered bore (through-hole)
    translate([center_right_x, center_y, -eps])
        cylinder(r=bore_radius, h=overall_height + 2*eps);

    // 4. Left larger annular circular recess (from underside up to reach)
    translate([center_left_x, center_y, -eps])
        cylinder(r=recess_radius, h=recess_height + eps);

    // 5. Right larger annular circular recess (from underside up to reach)
    translate([center_right_x, center_y, -eps])
        cylinder(r=recess_radius, h=recess_height + eps);

    // 6. Middle rectangular slot on the side web
    // Cut from the front side (Y=0) through the body
    translate([slot_x_offset, -eps, slot_z_start])
        cube([slot_length, slot_y_reach + eps, slot_height]);
}