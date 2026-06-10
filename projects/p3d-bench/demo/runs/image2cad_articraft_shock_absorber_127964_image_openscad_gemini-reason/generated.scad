// ==========================================
// Parametric Shock Absorber Model
// ==========================================

// --- Global Resolution ---
// Set to a reasonable value to ensure smooth curves without timing out
$fn = 50;

// --- Parameters ---

// Overall Dimensions
eye_to_eye_length = 110;

// Eyelet Mounts (Top and Bottom)
mount_body_d = 16;
mount_boss_d = 14;
mount_boss_w = 22;
mount_hole_d = 6;
mount_body_l = 12;

// Main Damper Body
damper_od = 16;
damper_start_z = 40; 
damper_end_z = eye_to_eye_length - mount_body_l; 
damper_length = damper_end_z - damper_start_z;

// Lower Rod
rod_od = 8;
rod_start_z = mount_body_l;
rod_length = damper_start_z - rod_start_z;

// Bottom Spring Seat
seat_od = 34;
seat_id = rod_od + 0.5; // slight clearance over the rod
seat_z = mount_body_l;

// Helical Spring
spring_wire_d = 4.5;
spring_od = 30;
spring_mean_d = spring_od - spring_wire_d;
spring_turns = 7;
spring_length = 53;
spring_start_z = seat_z + 5; // Sits on top of the seat flange

// Preload Adjuster Ring
adj_od = 38;
adj_id = damper_od - 0.5; // intersects with the threads to form a solid body
adj_h = 6;
adj_teeth = 12;
adj_z = spring_start_z + spring_length;


// --- Modules ---

// Reusable eyelet mount for top and bottom connections
module mount_eyelet(body_d, boss_d, boss_w, hole_d, body_l) {
    difference() {
        union() {
            // Rounded dome end
            sphere(d=body_d);
            // Main vertical cylindrical body
            translate([0, 0, -body_l]) 
                cylinder(d=body_d, h=body_l);
            // Horizontal protruding bosses
            rotate([0, 90, 0]) 
                cylinder(d=boss_d, h=boss_w, center=true);
        }
        // Main through-hole
        rotate([0, 90, 0]) 
            cylinder(d=hole_d, h=boss_w + 2, center=true);
        // Chamfers on the hole edges
        rotate([0, 90, 0]) 
            translate([0, 0, boss_w/2]) 
                cylinder(d1=hole_d, d2=hole_d+2, h=1.05, center=true);
        rotate([0, -90, 0]) 
            translate([0, 0, boss_w/2]) 
                cylinder(d1=hole_d, d2=hole_d+2, h=1.05, center=true);
    }
}

// Bottom flanged cup that holds the spring
module bottom_seat(od, id, base_d) {
    difference() {
        union() {
            // Base that meets the bottom mount
            cylinder(d=base_d, h=2); 
            // Main horizontal flange
            translate([0, 0, 2]) 
                cylinder(d=od, h=3);
            // Inner cylindrical guide to center the spring
            translate([0, 0, 5]) 
                cylinder(d=20, h=5);
            // Outer retaining lip
            translate([0, 0, 5]) 
                difference() {
                    cylinder(d=od, h=5);
                    // Slightly larger than spring OD to prevent coincident face issues
                    translate([0, 0, -1]) 
                        cylinder(d=od-3.5, h=7);
                }
        }
        // Center hole for the rod to pass through
        translate([0, 0, -1]) 
            cylinder(d=id, h=15);
    }
}

// Toothed ring for adjusting spring preload
module adjuster_ring(od, id, h, teeth) {
    difference() {
        union() {
            // Main gear body
            cylinder(d=od, h=h);
            // Lower collar that slots inside the spring to center it
            translate([0, 0, -4]) 
                cylinder(d=20, h=4);
            // Upper small lip
            translate([0, 0, h]) 
                cylinder(d=id+4, h=2);
        }
        // Center hole for the threaded body
        translate([0, 0, -5]) 
            cylinder(d=id, h=h + 15);
        // Cutouts to create the gear teeth
        for(i = [0 : teeth - 1]) {
            rotate([0, 0, i * 360 / teeth])
                translate([od/2, 0, h/2])
                    cube([6, 5, h + 2], center=true);
        }
    }
}

// Main upper cylinder with simulated threads
module damper_body(length, od) {
    union() {
        // Tapered bottom cap
        cylinder(d1=od-4, d2=od, h=2);
        // Smooth lower section
        translate([0, 0, 2]) 
            cylinder(d=od, h=length*0.3 - 2);
        
        // Threaded upper section
        translate([0, 0, length*0.3]) {
            // Solid core
            cylinder(d=od-0.8, h=length*0.7);
            // Simulated V-threads using stacked cones
            pitch = 1.5;
            for(z = [0 : pitch : length*0.7 - pitch]) {
                translate([0, 0, z]) 
                    cylinder(d1=od, d2=od-0.8, h=pitch/2, $fn=30);
                translate([0, 0, z + pitch/2]) 
                    cylinder(d1=od-0.8, d2=od, h=pitch/2, $fn=30);
            }
        }
    }
}

// Efficient helical coil spring with flat ground ends
module helical_spring(wire_d, mean_d, length, turns) {
    // Intersect to create perfectly flat ground ends at Z=0 and Z=length
    intersection() {
        cylinder(d=mean_d + wire_d + 2, h=length);
        
        // Generate helix using linear_extrude with twist (highly optimized)
        translate([0, 0, -wire_d])
            linear_extrude(height=length + 2*wire_d, twist=-(length + 2*wire_d)/length * turns*360, slices=turns*40, convexity=10) {
                translate([mean_d/2, 0])
                    circle(d=wire_d, $fn=24); // Lower local $fn for the wire profile
            }
    }
}


// --- Main Assembly ---
// Combine all components into a single manifold solid
union() {
    
    // 1. Bottom Mount (Rotated to point downwards)
    translate([0, 0, 0]) 
        rotate([180, 0, 0]) 
            mount_eyelet(mount_body_d, mount_boss_d, mount_boss_w, mount_hole_d, mount_body_l);

    // 2. Lower Rod (Embedded slightly to ensure manifold union)
    translate([0, 0, rod_start_z - 0.1]) 
        cylinder(d=rod_od, h=rod_length + 0.2);

    // 3. Bottom Spring Seat
    translate([0, 0, seat_z]) 
        bottom_seat(seat_od, seat_id, mount_body_d);

    // 4. Helical Spring
    translate([0, 0, spring_start_z]) 
        helical_spring(spring_wire_d, spring_mean_d, spring_length, spring_turns);

    // 5. Preload Adjuster Ring
    translate([0, 0, adj_z]) 
        adjuster_ring(adj_od, adj_id, adj_h, adj_teeth);

    // 6. Main Damper Body (Threaded)
    translate([0, 0, damper_start_z - 0.1]) 
        damper_body(damper_length + 0.2, damper_od);

    // 7. Top Mount
    translate([0, 0, eye_to_eye_length]) 
        mount_eyelet(mount_body_d, mount_boss_d, mount_boss_w, mount_hole_d, mount_body_l);
        
}