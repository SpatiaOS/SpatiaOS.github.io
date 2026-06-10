// --------------------------
// Global Parameters (all dimensions in mm)
// --------------------------
shed_width = 3600;    // Width of shed (gable end span)
shed_depth = 6000;    // Length of shed along gable axis
sill_height = 100;    // Height of foundation sill plate
wall_height = 2400;   // Wall height from top of sill to top plate
roof_rise = 1200;     // Vertical height of roof peak above top plate
lumber_t = 50;        // Thickness of standard framing lumber
lumber_w = 100;       // Width of standard framing lumber
stud_spacing = 600;   // On-center spacing between wall studs
rafter_spacing = 600; // On-center spacing between roof trusses
door_width = 900;     // Width of each double door leaf
door_height = 2100;   // Height of door opening
sheeting_t = 12;      // Thickness of wall/roof sheeting panels
$fn = 24;             // Curve resolution for rounded features

// --------------------------
// Helper Modules
// --------------------------

// Foundation sill perimeter frame
module foundation_sill() {
    color("dimgray") {
        // Front & back sills
        translate([0, 0, 0]) cube([shed_width, lumber_w, sill_height]);
        translate([0, shed_depth - lumber_w, 0]) cube([shed_width, lumber_w, sill_height]);
        // Side sills
        translate([0, lumber_w, 0]) cube([lumber_t, shed_depth - 2*lumber_w, sill_height]);
        translate([shed_width - lumber_t, lumber_w, 0]) cube([lumber_t, shed_depth - 2*lumber_w, sill_height]);
    }
}

// Front wall frame with double door opening
module front_wall_frame() {
    z = sill_height;
    color("silver") {
        // Bottom and top plates
        translate([0, 0, z]) cube([shed_width, lumber_t, lumber_w]);
        translate([0, 0, z + wall_height]) cube([shed_width, lumber_t, lumber_w]);
        
        // End studs
        translate([0, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        translate([shed_width - lumber_w, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        
        // Studs left of door
        for(x = [stud_spacing : stud_spacing : shed_width/2 - door_width - stud_spacing]) {
            translate([x, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        }
        // Door frame studs
        translate([shed_width/2 - door_width, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        translate([shed_width/2, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        translate([shed_width/2 + door_width, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        
        // Studs right of door
        for(x = [shed_width/2 + door_width + stud_spacing : stud_spacing : shed_width - lumber_w - stud_spacing]) {
            translate([x, 0, z]) cube([lumber_w, lumber_t, wall_height]);
        }
    }
}

// Back wall frame (no openings)
module back_wall_frame() {
    z = sill_height;
    color("silver") {
        translate([0, shed_depth - lumber_t, z]) cube([shed_width, lumber_t, lumber_w]);
        translate([0, shed_depth - lumber_t, z + wall_height]) cube([shed_width, lumber_t, lumber_w]);
        
        translate([0, shed_depth - lumber_t, z]) cube([lumber_w, lumber_t, wall_height]);
        translate([shed_width - lumber_w, shed_depth - lumber_t, z]) cube([lumber_w, lumber_t, wall_height]);
        
        for(x = [stud_spacing : stud_spacing : shed_width - stud_spacing]) {
            translate([x, shed_depth - lumber_t, z]) cube([lumber_w, lumber_t, wall_height]);
        }
    }
}

// Left side wall frame
module left_side_wall_frame() {
    z = sill_height;
    color("silver") {
        translate([0, lumber_w, z]) cube([lumber_t, shed_depth - 2*lumber_w, lumber_w]);
        translate([0, lumber_w, z + wall_height]) cube([lumber_t, shed_depth - 2*lumber_w, lumber_w]);
        
        for(y = [lumber_w + stud_spacing : stud_spacing : shed_depth - lumber_w - stud_spacing]) {
            translate([0, y, z]) cube([lumber_t, lumber_w, wall_height]);
        }
    }
}

// Right side wall frame
module right_side_wall_frame() {
    z = sill_height;
    color("silver") {
        translate([shed_width - lumber_t, lumber_w, z]) cube([lumber_t, shed_depth - 2*lumber_w, lumber_w]);
        translate([shed_width - lumber_t, lumber_w, z + wall_height]) cube([lumber_t, shed_depth - 2*lumber_w, lumber_w]);
        
        for(y = [lumber_w + stud_spacing : stud_spacing : shed_depth - lumber_w - stud_spacing]) {
            translate([shed_width - lumber_t, y, z]) cube([lumber_t, lumber_w, wall_height]);
        }
    }
}

// Single gable roof truss
module roof_truss(y_pos) {
    z = sill_height + wall_height;
    rafter_len = sqrt(pow(shed_width/2, 2) + pow(roof_rise, 2));
    roof_angle = atan(roof_rise / (shed_width/2));
    
    color("lightgray") {
        // Bottom chord
        translate([0, y_pos, z]) cube([shed_width, lumber_t, lumber_w]);
        // Left rafter
        translate([0, y_pos, z]) rotate([0, -roof_angle, 0]) cube([rafter_len, lumber_t, lumber_w]);
        // Right rafter
        translate([shed_width, y_pos, z]) rotate([0, roof_angle, 180]) cube([rafter_len, lumber_t, lumber_w]);
        // King post center support
        translate([shed_width/2 - lumber_w/2, y_pos, z]) cube([lumber_w, lumber_t, roof_rise]);
    }
}

// Roof purlins (horizontal members across rafters)
module roof_purlins() {
    z = sill_height + wall_height;
    roof_angle = atan(roof_rise / (shed_width/2));
    rafter_len = sqrt(pow(shed_width/2, 2) + pow(roof_rise, 2));
    purlin_spacing = 600;
    
    color("lightgray") {
        for(d = [0 : purlin_spacing : rafter_len - purlin_spacing]) {
            x_left = d * cos(roof_angle);
            z_pos = z + d * sin(roof_angle);
            // Left slope purlin
            translate([x_left, lumber_w, z_pos]) cube([lumber_w, shed_depth - 2*lumber_w, lumber_t]);
            // Right slope purlin
            translate([shed_width - x_left, lumber_w, z_pos]) cube([lumber_w, shed_depth - 2*lumber_w, lumber_t]);
        }
        // Ridge purlin
        translate([shed_width/2 - lumber_w/2, lumber_w, z + roof_rise]) cube([lumber_w, shed_depth - 2*lumber_w, lumber_t]);
    }
}

// Wall sheeting, doors and hinges
module wall_sheeting() {
    z = sill_height;
    color("gainsboro") {
        // Front wall sections around door
        translate([-sheeting_t, -sheeting_t, z]) cube([shed_width/2 - door_width, sheeting_t, wall_height]);
        translate([shed_width/2 + door_width, -sheeting_t, z]) cube([shed_width/2 - door_width, sheeting_t, wall_height]);
        translate([shed_width/2 - door_width, -sheeting_t, z + door_height]) cube([2*door_width, sheeting_t, wall_height - door_height]);
        
        // Full side/back wall sheeting
        translate([-sheeting_t, 0, z]) cube([sheeting_t, shed_depth, wall_height]);
        translate([shed_width, 0, z]) cube([sheeting_t, shed_depth, wall_height]);
        translate([-sheeting_t, shed_depth, z]) cube([shed_width, sheeting_t, wall_height]);
        
        // Double doors
        translate([shed_width/2 - door_width, -sheeting_t, z]) cube([door_width, sheeting_t, door_height]);
        translate([shed_width/2, -sheeting_t, z]) cube([door_width, sheeting_t, door_height]);
        
        // Door hinges (4 per door)
        color("darkgray") for (z_hinge = [z+200, z+700, z+1400, z+1900]) {
            translate([shed_width/2 - door_width - 5, -sheeting_t - 1, z_hinge]) cube([10, sheeting_t + 2, 50]);
            translate([shed_width/2 + door_width - 5, -sheeting_t - 1, z_hinge]) cube([10, sheeting_t + 2, 50]);
        }
    }
}

// Partial roof sheeting as shown in reference image
module partial_roof_sheeting() {
    z = sill_height + wall_height;
    roof_angle = atan(roof_rise / (shed_width/2));
    
    color("lightgray") {
        translate([0, lumber_w, z]) rotate([0, -roof_angle, 0])
        translate([0, 0, -sheeting_t]) cube([1800, 1200, sheeting_t]);
    }
}

// --------------------------
// Main Assembly
// --------------------------
union() {
    foundation_sill();
    front_wall_frame();
    back_wall_frame();
    left_side_wall_frame();
    right_side_wall_frame();
    
    // Generate all roof trusses
    for (y = [lumber_w : rafter_spacing : shed_depth - lumber_w]) {
        roof_truss(y);
    }
    
    roof_purlins();
    wall_sheeting();
    partial_roof_sheeting();
}