// Steering Intermediate Shaft Assembly
// All dimensions in millimeters, parametric per supplied part specifications
$fn = 64; // Surface smoothness for curved geometry

// ---------------------- Parameters ----------------------
// Shaft diameters
shaft_od = 22;        // End stub outer diameter (matches R≈11.08mm)
shaft_r = shaft_od / 2;
mid_shaft_od = 24;    // Middle outer tube OD
mid_shaft_r = mid_shaft_od / 2;
slip_od = 20;         // Exposed slip shaft OD (matches R=10mm journal)
slip_r = slip_od / 2;

// Universal joint components
cross_pin_d = 8;      // Cross pin diameter per spec
cross_pin_r = cross_pin_d / 2;
cross_size = 30;      // Total cross width across opposing pins
yoke_total_len = 57;  // Yoke total length per spec
yoke_width = 41;      // Yoke width across ears per spec
yoke_thickness = 23;  // Yoke thickness per spec
yoke_ear_gap = 18;    // Clearance gap between yoke ears for cross
ear_thickness = (yoke_width - yoke_ear_gap) / 2;
hub_od = 26;          // Yoke hub outer diameter
hub_r = hub_od / 2;

// Length dimensions
end_stub_len = 45;    // Length of end connection stubs
slip_exposed_len = 35;// Length of exposed black slip section
mid_tube_len = 70;    // Middle outer shaft tube length
bend_angle1 = 21;     // Articulation angle at first U-joint (degrees)
bend_angle2 = 11;     // Additional articulation at second U-joint
hole_6mm = 6;         // Retainer pin hole diameter
hole_8mm = 8;         // Pinch bolt diameter

// ---------------------- Helper Modules ----------------------
// Universal joint cross / spider bearing assembly
module cross_spider() {
    union() {
        sphere(r=9); // Central hub
        // Pins along Y axis
        for (dy = [-1, 1]) {
            translate([0, dy*(cross_size/2 - cross_pin_r), 0])
                rotate([90, 0, 0])
                    cylinder(h=cross_pin_r*2, r=cross_pin_r, center=true);
        }
        // Pins along Z axis
        for (dz = [-1, 1]) {
            translate([0, 0, dz*(cross_size/2 - cross_pin_r)])
                cylinder(h=cross_pin_r*2, r=cross_pin_r, center=true);
        }
        // External bearing caps
        for (dy = [-1, 1]) {
            translate([0, dy*(cross_size/2), 0])
                rotate([90, 0, 0])
                    cylinder(h=2, r=cross_pin_r+1.5, center=true);
        }
        for (dz = [-1, 1]) {
            translate([0, 0, dz*(cross_size/2)])
                cylinder(h=2, r=cross_pin_r+1.5, center=true);
        }
    }
}

// Universal joint yoke
// Origin = cross center, yoke extends along -X axis
module yoke(is_clamp=false, is_end_yoke=false, stub_len=end_stub_len) {
    union() {
        // Two parallel fork ears
        for (y_sign = [-1, 1]) {
            translate([-2.5, y_sign*(yoke_ear_gap/2 + ear_thickness/2), 0]) {
                minkowski() {
                    cube([25, ear_thickness, yoke_thickness], center=true);
                    sphere(r=3);
                }
                // Cross pin bore through ear
                rotate([90, 0, 0])
                    cylinder(h=ear_thickness+2, r=cross_pin_r, center=true);
            }
        }
        // Central web connecting ears to hub
        translate([-15, 0, 0])
            cube([6, yoke_ear_gap - 2, yoke_thickness], center=true);
        // Hub section
        translate([-30, 0, 0]) {
            if (is_end_yoke) {
                // Solid hub with integrated end stub
                union() {
                    rotate([0,90,0])
                        cylinder(h=30, r=hub_r, center=true);
                    // End stub shaft
                    translate([-(15 + stub_len/2), 0, 0])
                        rotate([0,90,0])
                            cylinder(h=stub_len, r=shaft_r, center=true);
                    // Radial retainer hole near stub end
                    translate([-(15 + stub_len - 10), 0, 0])
                        cylinder(h=shaft_r*2+2, r=hole_6mm/2, center=true);
                }
            } else {
                // Hollow hub for shaft mounting
                difference() {
                    rotate([0,90,0])
                        cylinder(h=30, r=hub_r, center=true);
                    // Splined bore through hub
                    translate([-5,0,0])
                        rotate([0,90,0])
                            cylinder(h=50, r=slip_r, center=true);
                    if (is_clamp) {
                        // Pinch clamp slot at bottom
                        translate([0,0,-hub_r-1])
                            cube([32, hub_r*2, 3], center=true);
                        // Pinch bolt hole across clamp slot
                        translate([-5, 0, 0])
                            rotate([90,0,0])
                                cylinder(h=hub_r*2+2, r=hole_8mm/2, center=true);
                        // Clamp hub end stub
                        translate([-(15 + end_stub_len/2), 0, 0]) {
                            difference() {
                                rotate([0,90,0])
                                    cylinder(h=end_stub_len, r=shaft_r, center=true);
                                // Radial retainer hole
                                translate([-end_stub_len/2 + 10, 0, 0])
                                    cylinder(h=shaft_r*2+2, r=hole_6mm/2, center=true);
                            }
                        }
                    }
                }
            }
        }
    }
}

// ---------------------- Main Assembly ----------------------
rotate([10, 0, -20]) // Isometric view orientation matching reference render
color([0.85, 0.85, 0.85]) // Base silver/steel color for all metal parts
union() {
    // First U-joint at origin (cross A)
    yoke(is_clamp=true);          // Left clamp yoke (grounded side)
    cross_spider();

    // Articulated middle assembly, rotated at first U-joint around Y axis
    rotate([0, bend_angle1, 0]) {
        // First middle yoke (right side of cross A), phased 90deg
        mirror([1,0,0])
            rotate([90,0,0])
                yoke();
        
        // Exposed black slip section
        translate([45, 0, 0])
            color("black")
                rotate([0,90,0])
                    cylinder(r=slip_r, h=slip_exposed_len, center=false);
        
        // Middle outer shaft tube
        translate([45 + slip_exposed_len, 0, 0])
            rotate([0,90,0])
                cylinder(r=mid_shaft_r, h=mid_tube_len, center=false);
        
        // Second U-joint assembly at cross B
        translate([45 + slip_exposed_len + mid_tube_len + 45, 0, 0]) {
            // Second middle yoke (left side of cross B), phased 90deg
            rotate([90,0,0])
                yoke();
            cross_spider();

            // Articulated right end assembly, rotated at second U-joint
            rotate([0, bend_angle2, 0])
                // Right end yoke with output stub
                mirror([1,0,0])
                    yoke(is_end_yoke=true);
        }
    }
}