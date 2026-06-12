// Parameters
outer_radius = 50;
inner_radius = 40;
collar_outer_radius = 25;
collar_inner_radius = 15;
rim_thickness = 8;
collar_thickness = 5;
rib_thickness = 4;
number_of_ribs = 6;
rib_width = 4;
window_radius = 3;
$fn = 100;

// Main outer rim
module outer_rim() {
    difference() {
        cylinder(h=rim_thickness, r=outer_radius, center=true);
        cylinder(h=rim_thickness+0.1, r=inner_radius, center=true);
    }
}

// Inner collar
module inner_collar() {
    difference() {
        cylinder(h=collar_thickness, r=collar_outer_radius, center=true);
        cylinder(h=collar_thickness+0.1, r=collar_inner_radius, center=true);
    }
}

// Single rib
module rib() {
    // Rib body
    translate([0, 0, -(rim_thickness - rib_thickness)/2])
    cube([outer_radius - inner_radius, rib_width, rib_thickness], center=false);
    
    // Rounded ends
    translate([inner_radius, 0, -(rim_thickness - rib_thickness)/2])
    cylinder(h=rib_thickness, r=rib_width/2, center=false);
    
    translate([outer_radius, 0, -(rim_thickness - rib_thickness)/2])
    cylinder(h=rib_thickness, r=rib_width/2, center=false);
}

// All ribs
module all_ribs() {
    for (i = [0 : 360/number_of_ribs : 360 - 360/number_of_ribs]) {
        rotate([0, 0, i])
        translate([inner_radius, -rib_width/2, 0])
        rib();
    }
}

// Window cutouts between ribs
module window_cutouts() {
    for (i = [0 : 360/number_of_ribs : 360 - 360/number_of_ribs]) {
        rotate([0, 0, i + 360/(2*number_of_ribs)])
        translate([(inner_radius + outer_radius)/2, 0, 0])
        cylinder(h=rim_thickness+1, r=window_radius, center=true);
    }
}

// Main assembly
difference() {
    union() {
        // Outer rim (deepest tier)
        color("SteelBlue") outer_rim();
        
        // Inner collar (middle tier)
        translate([0, 0, (rim_thickness - collar_thickness)/2])
        color("CadetBlue") inner_collar();
        
        // Ribs (shallowest tier)
        color("LightSteelBlue") all_ribs();
    }
    
    // Cut out windows between ribs
    color("LightCyan") window_cutouts();
    
    // Ensure open center
    cylinder(h=rim_thickness*2, r=collar_inner_radius, center=true);
}