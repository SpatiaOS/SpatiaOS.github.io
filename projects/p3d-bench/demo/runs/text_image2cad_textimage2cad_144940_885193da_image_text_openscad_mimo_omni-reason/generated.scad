// Overall assembly dimensions (mm)
overall_length = 600;
overall_width = 501;
overall_height = 527;

// Common parameters
$fn = 100;

// ==================== PART MODULES ====================

// Grounded flat bar (bfd19d36)
module flat_bar() {
    cube([600, 50, 10], center = false);
}

// Triangular linkage bracket (c0024a12)
module triangular_linkage_bracket() {
    // Approximate the triangular shape with B-spline blends using hulls
    // Main triangular body with central cutout
    hull() {
        // Three arms with rounded ends
        translate([0, 0, 0])
            cylinder(h = 80, d = 40, center = true);
        translate([400, 0, 0])
            cylinder(h = 80, d = 40, center = true);
        translate([200, 380, 0])
            cylinder(h = 80, d = 40, center = true);
    }
    
    // Upper vertices with tubular bosses (Ø40 mm × 100 mm through-holes)
    // Boss 1 (upper right)
    translate([400, 0, 0]) {
        difference() {
            cylinder(h = 100, d = 60, center = true);
            cylinder(h = 101, d = 40, center = true);
        }
    }
    
    // Boss 2 (upper left)
    translate([0, 0, 0]) {
        difference() {
            cylinder(h = 100, d = 60, center = true);
            cylinder(h = 101, d = 40, center = true);
        }
    }
    
    // Lower-left vertex with clevis (Ø30 mm through-hole)
    translate([200, 380, 0]) {
        difference() {
            // Clevis shape
            union() {
                cylinder(h = 17.3, d = 50, center = true);
                translate([0, 10, 0])
                    cube([50, 20, 17.3], center = true);
            }
            cylinder(h = 18, d = 30, center = true);
        }
    }
    
    // B-spline blend transitions (approximated with hulls)
    hull() {
        translate([400, 0, 0])
            sphere(d = 60);
        translate([200, 190, 0])
            sphere(d = 40);
    }
    
    hull() {
        translate([0, 0, 0])
            sphere(d = 60);
        translate([200, 190, 0])
            sphere(d = 40);
    }
    
    hull() {
        translate([200, 380, 0])
            sphere(d = 50);
        translate([200, 190, 0])
            sphere(d = 40);
    }
}

// U-shaped curved link arm (bfd260d0)
module link_arm() {
    // Approximate the U-shape with swept geometry
    // Main curved body (simplified as two arms and a base)
    // Left arm
    translate([0, 0, 0])
        cube([60, 380, 40], center = false);
    
    // Right arm
    translate([0, 380, 0])
        cube([60, 380, 40], center = false);
    
    // Connecting base
    hull() {
        translate([0, 0, 0])
            cube([60, 380, 40], center = false);
        translate([0, 380, 0])
            cube([60, 380, 40], center = false);
    }
    
    // Cylindrical bosses at open ends (Ø60 mm outer, Ø40 mm × 100 mm through-holes)
    // Boss 1 (left end)
    translate([30, 0, 20]) {
        difference() {
            cylinder(h = 100, d = 60, center = true);
            cylinder(h = 101, d = 40, center = true);
        }
    }
    
    // Boss 2 (right end)
    translate([30, 760, 20]) {
        difference() {
            cylinder(h = 100, d = 60, center = true);
            cylinder(h = 101, d = 40, center = true);
        }
    }
    
    // Ø50 mm × 15 mm blind hole on lateral face
    translate([30, 190, 40])
        rotate([90, 0, 0])
            cylinder(h = 15, d = 50, center = true);
}

// Pin type 1: Ø30 mm × 90 mm (bfd100ee, 2 instances)
module pin_30x90() {
    cylinder(h = 90, d = 30, center = true);
}

// Pin type 2: Ø30 mm × 100 mm (bfce1ad2, 1 instance)
module pin_30x100() {
    cylinder(h = 100, d = 30, center = true);
}

// Pin type 3: Ø40 mm × 100 mm (bfd12828, 4 instances)
module pin_40x100() {
    cylinder(h = 100, d = 40, center = true);
}

// Pulley disc (bfd21264)
module pulley_disc() {
    // Main disc body
    difference() {
        // Outer disc
        cylinder(h = 61, d = 230, center = true);
        
        // Central stepped hub cutout (for visual detail)
        translate([0, 0, -31])
            cylinder(h = 62, d = 140, center = false);
    }
    
    // Stepped hub
    translate([0, 0, -15])
        cylinder(h = 30, d = 140, center = true);
    
    // Five Ø14 mm bolt-circle through-holes
    for (i = [0:4]) {
        rotate([0, 0, i * 72])
            translate([70, 0, 0])
                cylinder(h = 62, d = 14, center = true);
    }
    
    // Periodic notch-like features around rim (30 instances)
    for (i = [0:29]) {
        rotate([0, 0, i * 12])
            translate([115, 0, 0])
                rotate([90, 0, 0])
                    cylinder(h = 8, r = 4, center = true);
    }
}

// Host part (bfce4234) - inferred from context
module host_part() {
    // Simple block to host the 30mm pin
    cube([50, 50, 100], center = true);
}

// ==================== ASSEMBLY ====================

module assembly() {
    // Grounded flat bar at top
    color("LightBlue")
        translate([0, 0, overall_height - 10])
            flat_bar();
    
    // Triangular bracket below flat bar
    color("Green")
        translate([100, 50, overall_height - 180])
            triangular_linkage_bracket();
    
    // Link arm connecting to triangular bracket
    color("Yellow")
        translate([130, 50, overall_height - 280])
            link_arm();
    
    // Pulley disc on left side
    color("Red")
        translate([0, 250, overall_height - 350])
            rotate([0, 90, 0])
                pulley_disc();
    
    // Four Ø40 mm pins through bracket and link arm
    color("Gray") {
        // Through triangular bracket upper vertices
        translate([100, 50, overall_height - 180])
            pin_40x100();
        translate([500, 50, overall_height - 180])
            pin_40x100();
        
        // Through link arm bosses
        translate([160, 50, overall_height - 280])
            pin_40x100();
        translate([160, 430, overall_height - 280])
            pin_40x100();
    }
    
    // Two Ø30 mm × 90 mm grounded pins
    color("Silver") {
        translate([100, 50, overall_height - 250])
            pin_30x90();
        translate([500, 50, overall_height - 250])
            pin_30x90();
    }
    
    // One Ø30 mm × 100 mm pin through host part
    color("White")
        translate([300, 430, overall_height - 350]) {
            host_part();
            pin_30x100();
        }
}

// Render the complete assembly
assembly();