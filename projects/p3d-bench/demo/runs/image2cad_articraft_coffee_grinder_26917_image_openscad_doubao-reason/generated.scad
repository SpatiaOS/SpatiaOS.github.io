// ==============================================
// Manual Coffee Grinder Model (Fusion 360 Style)
// ==============================================

// Global Settings
$fn = 100;
general_rounding = 2; // Radius for rounded edges on box components

// ======================
// Parametric Dimensions
// ======================
// Bottom Base
bottom_base_size = 130;
bottom_base_thickness = 10;

// Main Body Enclosure
body_size = 100;
body_height = 75;

// Top Mount Plate (under hopper)
top_plate_size = 120;
top_plate_thickness = 8;

// Hopper
hopper_top_dia = 120;
hopper_bottom_dia = 90;
hopper_height = 85;
hopper_wall_thickness = 3;
hopper_rim_width = 5;

// Central Drive Shaft
shaft_diameter = 20;
shaft_height = 75;

// Crank Assembly
crank_length = 110;
crank_width = 12;
crank_thickness = 4;
crank_knob_dia = 22;
crank_knob_height = 24;

// Drawer
drawer_width = 85;
drawer_height = 55;
drawer_depth = 95;
drawer_knob_dia = 16;
drawer_knob_protrusion = 8;

// Name Plate
name_plate_width = 52;
name_plate_height = 16;
name_plate_depth = 2.5;
text_size = 10;

// ======================
// Helper Modules
// ======================
module rounded_cube(dimensions, radius, center=true) {
    // Creates a cube with all edges rounded
    minkowski() {
        cube([
            dimensions[0] - 2 * radius,
            dimensions[1] - 2 * radius,
            dimensions[2] - 2 * radius
        ], center=center);
        sphere(r=radius);
    }
}

// ======================
// Main Model Assembly
// ======================
union() {
    // ----------------------
    // Bottom Base
    // ----------------------
    translate([0, 0, bottom_base_thickness / 2])
        rounded_cube([bottom_base_size, bottom_base_size, bottom_base_thickness], general_rounding);

    // ----------------------
    // Main Body Enclosure
    // ----------------------
    translate([0, 0, bottom_base_thickness + body_height / 2])
    difference() {
        rounded_cube([body_size, body_size, body_height], general_rounding);
        // Cut out drawer cavity
        translate([0, body_size/2 - 1, 0])
            cube([drawer_width, drawer_depth, drawer_height], center=true);
    }

    // ----------------------
    // Drawer
    // ----------------------
    translate([0, body_size/2 - drawer_depth/2 - 2, bottom_base_thickness + body_height/2 - 10])
    union() {
        rounded_cube([drawer_width, drawer_depth, drawer_height], 1);
        // Drawer front knob
        translate([0, -drawer_depth/2 - drawer_knob_protrusion/2 + 1, 0])
            cylinder(h=drawer_knob_protrusion, d=drawer_knob_dia, center=true);
    }

    // ----------------------
    // Hopper Mount Plate
    // ----------------------
    translate([0, 0, bottom_base_thickness + body_height + top_plate_thickness/2])
        rounded_cube([top_plate_size, top_plate_size, top_plate_thickness], general_rounding);

    // ----------------------
    // Hopper Assembly
    // ----------------------
    translate([0, 0, bottom_base_thickness + body_height + top_plate_thickness])
    union() {
        // Outer hopper wall (tapered cone)
        cylinder(h=hopper_height, d1=hopper_bottom_dia, d2=hopper_top_dia, center=false);
        // Top reinforcement rim
        translate([0, 0, hopper_height - hopper_rim_width])
            cylinder(h=hopper_rim_width, d=hopper_top_dia + 2*hopper_rim_width, center=false);
        
        // Hollow out inner hopper cavity
        difference() {
            // Inner cone cut
            translate([0,0, hopper_wall_thickness])
                cylinder(h=hopper_height, d1=hopper_bottom_dia - 2*hopper_wall_thickness, d2=hopper_top_dia - 2*hopper_wall_thickness, center=false);
            // Inner rim cut
            translate([0,0, hopper_height - hopper_rim_width])
                cylinder(h=hopper_rim_width + 1, d=hopper_top_dia, center=false);
        }

        // Central drive shaft
        cylinder(h=shaft_height, d=shaft_diameter, center=false);
    }

    // ----------------------
    // Crank Assembly
    // ----------------------
    translate([0,0, bottom_base_thickness + body_height + top_plate_thickness + shaft_height - crank_thickness/2])
    rotate([0,0, 25]) // Angle matches reference position
    union() {
        // Crank arm
        hull() {
            cube([crank_length, crank_width, crank_thickness], center=true);
            translate([crank_length/2 - crank_width/2, 0, 0])
                cylinder(h=crank_thickness, d=crank_width, center=true);
        }
        // Crank end knob
        translate([crank_length - crank_knob_dia/2, 0, crank_knob_height/2 + crank_thickness/2])
        union() {
            cylinder(h=crank_knob_height - 8, d=crank_knob_dia, center=true);
            translate([0,0, (crank_knob_height - 8)/2]) sphere(d=crank_knob_dia);
            translate([0,0, -(crank_knob_height - 8)/2]) sphere(d=crank_knob_dia * 0.7);
        }
        // Shaft mount hex fitting
        cylinder(h=crank_thickness + 2, d=shaft_diameter * 0.7, center=true);
    }

    // ----------------------
    // Front Name Plate
    // ----------------------
    translate([0, -body_size/2 - name_plate_depth/2 + 0.5, bottom_base_thickness + body_height - 15])
    difference() {
        // Oval plate shape
        rounded_cube([name_plate_width, name_plate_depth, name_plate_height], 3);
        // Engraved "Fusion 360" text
        translate([0, name_plate_depth/2 + 0.1, 0])
        rotate([90, 0, 0])
        linear_extrude(height=1)
            text("Fusion 360", size=text_size, font="Arial:Bold", halign="center", valign="center");
    }
}