// Parameters
$fn = 100;

overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;

lobe_radius = 0.1103;
lobe1_x = 0.1103;
lobe2_x = 0.6397;
lobe_y = 0.1103;

bore_r = 0.0294;
recess_r = 0.0956;
recess_h = 0.0882;

slot_length = 0.191175;
slot_height = 0.023529;
slot_left = 0.2794;
slot_z = 0.0618;
slot_reach = 0.7353;

eps = 0.001;

// Rounded link footprint from two end lobes
module link_profile() {
    hull() {
        translate([lobe1_x, lobe_y]) circle(r = lobe_radius);
        translate([lobe2_x, lobe_y]) circle(r = lobe_radius);
    }
}

// Main solid extruded from underside datum
module base() {
    linear_extrude(height = overall_height) link_profile();
}

// Concentric bore and annular recess at each lobe axis
module lobe_cuts() {
    translate([lobe1_x, lobe_y, -eps]) {
        cylinder(h = recess_h + eps, r = recess_r);
        cylinder(h = overall_height + 2*eps, r = bore_r);
    }
    translate([lobe2_x, lobe_y, -eps]) {
        cylinder(h = recess_h + eps, r = recess_r);
        cylinder(h = overall_height + 2*eps, r = bore_r);
    }
}

// Middle web slot cut from front face through body
module slot() {
    translate([slot_left, -eps, slot_z])
        cube([slot_length, slot_reach + eps, slot_height]);
}

// Final part
difference() {
    base();
    lobe_cuts();
    slot();
}