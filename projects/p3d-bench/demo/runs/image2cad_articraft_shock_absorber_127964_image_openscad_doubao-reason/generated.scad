// --------------------------
// Shock Absorber Parameters
// --------------------------
$fn = 100; // Smooth curve resolution
total_height = 100; // [mm] Overall length of the shock

// End Mount (Clevis) Parameters
mount_dia = 12;
mount_height = 15;
mount_lug_dia = 10;
mount_lug_thickness = 3;
mount_hole_dia = 4;

// Top Adjustment Gear Parameters
gear_outer_dia = 30;
gear_inner_dia = 12;
gear_thickness = 3;
gear_teeth_count = 10;
gear_tooth_width = 4;

// Coil Spring Parameters
spring_wire_dia = 3;
spring_outer_dia = 26;
spring_coil_count = 6;

// Internal Shaft Parameters
shaft_dia = 8;

// Lower Spring Seat Parameters
seat_dia = spring_outer_dia;
seat_thickness = 2;

// --------------------------
// Reusable Component Modules
// --------------------------

// End clevis mount (identical for top and bottom of shock)
module end_mount() {
    difference() {
        union() {
            // Main cylindrical mount body
            cylinder(h=mount_height, d=mount_dia, center=true);
            // Side lugs for mounting pin
            translate([0, mount_dia/2 + mount_lug_thickness/2, 0])
                cylinder(h=mount_lug_thickness, d=mount_lug_dia, center=true);
            translate([0, -(mount_dia/2 + mount_lug_thickness/2), 0])
                cylinder(h=mount_lug_thickness, d=mount_lug_dia, center=true);
        }
        // Cross hole for mounting pin
        rotate([90, 0, 0])
            cylinder(h=mount_dia + 2*mount_lug_thickness + 1, d=mount_hole_dia, center=true);
    }
}

// Top preload adjustment gear with rectangular teeth
module adjustment_gear() {
    union() {
        // Central hub that fits over top mount
        cylinder(h=gear_thickness, d=gear_inner_dia, center=true);
        // Generate gear teeth in a circle
        for(i = [0:gear_teeth_count-1]) {
            rotate([0, 0, i * 360/gear_teeth_count])
            translate([gear_inner_dia/2, -gear_tooth_width/2, -gear_thickness/2])
            cube([(gear_outer_dia - gear_inner_dia)/2, gear_tooth_width, gear_thickness]);
        }
    }
}

// Helical coil spring generated via twisted linear extrusion
module coil_spring(spring_height, coil_count, wire_dia, outer_dia) {
    mean_radius = (outer_dia - wire_dia) / 2;
    linear_extrude(height=spring_height, twist=coil_count * 360, center=true, convexity=10) {
        translate([mean_radius, 0])
        circle(r=wire_dia/2);
    }
}

// --------------------------
// Main Assembly
// --------------------------
union() {
    // Bottom clevis mount
    translate([0, 0, mount_height/2])
    rotate([0, 90, 0])
        end_mount();

    // Lower spring retention seat
    translate([0, 0, mount_height])
        cylinder(h=seat_thickness, d=seat_dia, center=false);

    // Central inner piston shaft
    translate([0, 0, mount_height + seat_thickness])
        cylinder(h=total_height - 2*mount_height - seat_thickness - gear_thickness, d=shaft_dia, center=false);

    // Coil spring around the shaft
    translate([0, 0, total_height/2])
        coil_spring(
            spring_height=total_height - 2*mount_height - seat_thickness - gear_thickness,
            coil_count=spring_coil_count,
            wire_dia=spring_wire_dia,
            outer_dia=spring_outer_dia
        );

    // Top adjustment gear (preload adjuster)
    translate([0, 0, total_height - mount_height - gear_thickness/2])
        adjustment_gear();

    // Top clevis mount (matches bottom orientation)
    translate([0, 0, total_height - mount_height/2])
    rotate([0, 90, 0])
        end_mount();
}