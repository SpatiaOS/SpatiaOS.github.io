// Computer Fan 3D Model (OpenSCAD)
// Parametric design with estimated dimensions based on standard 120mm fan

// ---------------------- Parameters ----------------------
outer_side = 120;      // Outer square side length (mm)
thickness = 25;        // Overall thickness (mm)
inner_diameter = 100;  // Inner circular frame outer diameter (mm)
hub_diameter = 40;     // Central hub diameter (mm)
blade_count = 5;       // Number of fan blades
blade_thickness = 2;   // Blade thickness (mm)
mount_hole_dia = 4;    // Mounting hole diameter (mm)
counterbore_dia = 6;   // Counterbore diameter (mm)
counterbore_depth = 2; // Counterbore depth (mm)
strut_width = 5;       // Width of struts connecting outer to inner (mm)
corner_radius = 5;     // Radius of rounded corners on outer frame (mm)
$fn = 100;             // Smoothness for curved surfaces

// ---------------------- Modules ----------------------

// Module: Outer frame with rounded corners and mounting holes
module outer_frame() {
    difference() {
        // Rounded square (outer frame)
        minkowski() {
            cube([outer_side - 2*corner_radius, outer_side - 2*corner_radius, thickness], center=true);
            sphere(corner_radius, $fn=50);
        }
        // Mounting holes (4 corners)
        for (i = [0:3]) {  // Fixed syntax: added brackets around range
            angle = i * 90; // 0°, 90°, 180°, 270°
            x = (outer_side/2 - corner_radius) * cos(angle);
            y = (outer_side/2 - corner_radius) * sin(angle);
            translate([x, y, 0]) {
                // Counterbore (recessed hole for screw head)
                cylinder(h=counterbore_depth, d=counterbore_dia, center=true);
                // Through hole (for screw shaft)
                cylinder(h=thickness + 2, d=mount_hole_dia, center=true);
            }
        }
    }
}

// Module: Inner circular frame (ring)
module inner_frame() {
    difference() {
        // Outer cylinder of inner frame
        cylinder(h=thickness, d=inner_diameter, center=true);
        // Inner hole (to form a ring)
        cylinder(h=thickness + 2, d=inner_diameter - 2*strut_width, center=true);
    }
}

// Module: Struts (connect outer frame to inner frame)
module struts() {
    for (i = [0:3]) {  // Fixed syntax: added brackets around range
        angle = i * 90; // 0°, 90°, 180°, 270°
        // Outer frame corner position
        x_outer = (outer_side/2 - corner_radius) * cos(angle);
        y_outer = (outer_side/2 - corner_radius) * sin(angle);
        // Inner frame edge position (radius = inner_diameter/2)
        x_inner = (inner_diameter/2) * cos(angle);
        y_inner = (inner_diameter/2) * sin(angle);
        // Strut length (distance between outer and inner points)
        dx = x_inner - x_outer;
        dy = y_inner - y_outer;
        length = sqrt(dx*dx + dy*dy);
        // Strut: rectangular prism, centered at midpoint
        translate([x_outer, y_outer, 0]) {
            rotate([0, 0, angle]) {
                cube([length, strut_width, thickness], center=true);
            }
        }
    }
}

// Module: Central hub
module hub() {
    cylinder(h=thickness, d=hub_diameter, center=true);
}

// Module: Fan blades (curved blades attached to hub)
module blades() {
    for (i = [0:blade_count-1]) {  // Fixed syntax: added brackets around range
        angle = i * (360/blade_count); // Evenly spaced blades
        rotate([0, 0, angle]) {
            // Blade shape: 2D polygon with curved edges (using offset)
            linear_extrude(height=blade_thickness, center=true) {
                offset(r=2, chamfer=true) { // Chamfer for blade edge smoothness
                    polygon([
                        [0, 0],          // Hub center
                        [hub_diameter/2, 0], // Edge of hub
                        [inner_diameter/2, 10], // Blade tip (curved)
                        [hub_diameter/2, 20], // Back of blade
                        [0, 0]           // Close polygon
                    ]);
                }
            }
        }
    }
}

// ---------------------- Main Assembly ----------------------
union() {
    outer_frame();
    inner_frame();
    struts();
    hub();
    blades();
}