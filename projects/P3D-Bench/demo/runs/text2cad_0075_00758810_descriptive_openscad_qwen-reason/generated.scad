// Parameters
base_length = 120;
base_width = 60;
base_height = 15;
base_radius = base_width / 2;

through_width = 40;
through_depth = 12;
through_length = 30;

collar_outer_r = 28;
collar_inner_r = 18;
collar_height = 8;

bore_into_base = 6;
stepped_bore_r = 24;
stepped_bore_depth = 5;

side_rec_r = 5;
side_rec_depth = 3;
side_rec_x = 25;

under_rec_r = 4;
under_rec_depth = 3;
under_pattern_r = 25;
under_count = 6;

$fn = 100;

// Base module: thick rounded stadium shape
module base_stadium() {
    hull() {
        translate([-(base_length/2 - base_radius), 0, 0])
            cylinder(h=base_height, r=base_radius, center=true);
        translate([(base_length/2 - base_radius), 0, 0])
            cylinder(h=base_height, r=base_radius, center=true);
    }
}

// Collar module: raised annular ring on upper face
module collar_ring() {
    translate([0, 0, base_height/2 + collar_height/2])
        difference() {
            cylinder(h=collar_height, r=collar_outer_r, center=true);
            cylinder(h=collar_height, r=collar_inner_r, center=true);
        }
}

// Through opening module: central cutout through base
module through_cut() {
    translate([0, 0, -0.5])
        cube([through_length, through_width, base_height + 1], center=true);
}

// Bore assembly module: collar bore + stepped lower continuation
module bore_assembly() {
    // Upper bore through collar and into base
    translate([0, 0, base_height/2 + collar_height - (collar_height + bore_into_base)/2])
        cylinder(h=collar_height + bore_into_base + 1, r=collar_inner_r, center=true);
    
    // Lower stepped tier inside base
    translate([0, 0, base_height/2 - bore_into_base - stepped_bore_depth/2])
        cylinder(h=stepped_bore_depth + 1, r=stepped_bore_r, center=true);
}

// Side recesses module: shallow circular cuts on lateral faces
module side_cuts() {
    for (x = [-side_rec_x, side_rec_x]) {
        translate([x, base_width/2, base_height/2])
            rotate([90, 0, 0]) cylinder(h=side_rec_depth + 1, r=side_rec_r, center=true);
        translate([x, -base_width/2, base_height/2])
            rotate([90, 0, 0]) cylinder(h=side_rec_depth + 1, r=side_rec_r, center=true);
    }
}

// Underside pattern module: shallow circular cuts on bottom face
module underside_cuts() {
    for (i = [0 : under_count-1]) {
        angle = i * 360 / under_count;
        rotate([0, 0, angle])
        translate([under_pattern_r, 0, -base_height/2 + under_rec_depth/2])
            cylinder(h=under_rec_depth + 1, r=under_rec_r, center=true);
    }
}

// Main assembly: combine additive features and subtract all cuts
difference() {
    union() {
        base_stadium();
        collar_ring();
    }
    through_cut();
    bore_assembly();
    side_cuts();
    underside_cuts();
}