// ==========================================
// Manual Coffee Grinder - OpenSCAD Model
// ==========================================
// Interpretation of a classic tabletop manual grinder
// with a square base, sliding drawer, tapered hopper bowl,
// central grinding shaft, and a bent crank handle.

$fn = 100;

// --- Global Scale ---
scale_factor = 1.0;

// --- Base Platform Dimensions ---
base_body_w        = 60;    // Main square body width/depth
base_body_d        = 60;
base_body_h        = 48;    // Main body height

bottom_flange_w    = 88;    // Widest bottom molding footprint
bottom_flange_d    = 88;
bottom_flange_h    = 3;

bottom_step_w      = 78;    // Intermediate step between flange and body
bottom_step_d      = 78;
bottom_step_h      = 2;

top_plate_w        = 92;    // Overhanging top plate
top_plate_d        = 92;
top_plate_h        = 5;

// --- Drawer Dimensions ---
drawer_w           = 46;
drawer_h           = 36;
drawer_recess_depth= 42;    // Depth of cavity cut into base body
drawer_front_thick = 4;
drawer_knob_d      = 10;
drawer_knob_h      = 8;

// --- Bowl / Hopper Dimensions ---
bowl_top_d         = 78;    // Outer diameter at rim
bowl_bottom_d      = 56;    // Outer diameter at base
bowl_h             = 48;    // Height of tapered bowl
bowl_wall          = 3;     // Wall thickness
bowl_rim_thick     = 5;     // Diameter of rolled torus rim

// --- Shaft Dimensions ---
shaft_d            = 12;
shaft_above_bowl   = 16;    // How far shaft extends above bowl rim
shaft_h            = bowl_h + shaft_above_bowl - 2; // Starts 2mm above bowl floor

// --- Crank Handle Dimensions ---
handle_length      = 54;    // Horizontal reach from shaft center
handle_width       = 12;    // Width of the metal strip
handle_thick       = 3;     // Thickness of the metal strip
handle_drop        = 18;    // Vertical drop from shaft top to knob
handle_bend_start  = 12;    // Where the bend begins

knob_d             = 14;    // Spherical knob diameter
knob_stem_d        = 6;
knob_stem_h        = 8;

// --- Retaining Nut ---
nut_d              = 11;
nut_h              = 4;

// ==========================================
// Derived Z Positions (build upward from z=0)
// ==========================================
z_bottom_flange = 0;
z_bottom_step   = z_bottom_flange + bottom_flange_h;
z_base_body     = z_bottom_step + bottom_step_h;
z_top_plate     = z_base_body + base_body_h;
z_bowl          = z_top_plate + top_plate_h;

// ==========================================
// Modules
// ==========================================

// The stand consists of a bottom molding, a hollow square body,
// and an overhanging top plate with a circular seat for the bowl.
module grinder_base() {
    union() {
        // Bottom flange (widest footprint)
        translate([0, 0, z_bottom_flange + bottom_flange_h/2])
            cube([bottom_flange_w, bottom_flange_d, bottom_flange_h], center=true);

        // Intermediate decorative step
        translate([0, 0, z_bottom_step + bottom_step_h/2])
            cube([bottom_step_w, bottom_step_d, bottom_step_h], center=true);

        // Main body with drawer opening subtracted from front face
        translate([0, 0, z_base_body + base_body_h/2])
            difference() {
                cube([base_body_w, base_body_d, base_body_h], center=true);
                translate([0, -base_body_d/2 + drawer_recess_depth/2, 0])
                    cube([drawer_w + 1, drawer_recess_depth, drawer_h + 1], center=true);
            }

        // Top plate
        translate([0, 0, z_top_plate + top_plate_h/2])
            cube([top_plate_w, top_plate_d, top_plate_h], center=true);

        // Raised ring that the bowl sits into
        translate([0, 0, z_top_plate + top_plate_h])
            difference() {
                cylinder(h=2, d=bowl_bottom_d + 6, center=false);
                cylinder(h=3, d=bowl_bottom_d, center=false);
            }
    }
}

// Drawer front panel with recessed border, decorative oval plaque,
// and a spherical pull knob.
module grinder_drawer() {
    front_face_y = -base_body_d/2 - drawer_front_thick/2;
    front_face_z = z_base_body + base_body_h/2;

    // Drawer face
    translate([0, front_face_y, front_face_z])
    difference() {
        cube([drawer_w, drawer_front_thick, drawer_h], center=true);
        // Recessed panel detail
        translate([0, 0.5, 0])
            cube([drawer_w - 8, drawer_front_thick + 1, drawer_h - 8], center=true);
    }

    // Decorative oval plaque (raised)
    translate([0, front_face_y - drawer_front_thick/2 - 0.75, front_face_z + drawer_h/4])
        rotate([-90, 0, 0])
        scale([1.6, 1, 1])
        cylinder(d=10, h=1.5, center=true);

    // Text on plaque (requires a system font; approximate only)
    translate([0, front_face_y - drawer_front_thick/2 - 1.6, front_face_z + drawer_h/4])
        rotate([-90, 0, 0])
        linear_extrude(height=0.6)
        text("Fusion 360", size=3.5, halign="center", valign="center", font="Arial:style=Bold");

    // Pull knob
    translate([0, front_face_y - drawer_front_thick/2, front_face_z])
        rotate([-90, 0, 0]) {
            cylinder(d=drawer_knob_d, h=drawer_knob_h - drawer_knob_d/2);
            translate([0, 0, drawer_knob_h - drawer_knob_d/2])
                sphere(d=drawer_knob_d);
        }
}

// Tapered hopper bowl with a rolled torus rim at the top.
// Includes concentric rings inside the bottom to suggest burr details.
module grinder_bowl() {
    // Outer tapered shell
    translate([0, 0, z_bowl])
    difference() {
        cylinder(h=bowl_h, d1=bowl_bottom_d, d2=bowl_top_d, center=false);
        // Hollow interior (open top)
        translate([0, 0, bowl_wall])
            cylinder(h=bowl_h, d1=bowl_bottom_d - 2*bowl_wall, d2=bowl_top_d - 2*bowl_wall, center=false);
    }

    // Rolled rim at top edge
    translate([0, 0, z_bowl + bowl_h])
    rotate_extrude()
        translate([bowl_top_d/2, 0])
            circle(d=bowl_rim_thick);

    // Interior concentric grinder ridges (visible detail)
    translate([0, 0, z_bowl + bowl_wall])
    for (i = [0:2]) {
        difference() {
            cylinder(h=2, d=bowl_bottom_d - 6 - i*8, center=false);
            cylinder(h=3, d=bowl_bottom_d - 10 - i*8, center=false);
        }
    }
}

// Central shaft rising from the bowl floor, a two-segment bent crank handle,
// spherical grip knob, and a hex retaining nut on top.
module grinder_shaft_and_handle() {
    shaft_z     = z_bowl + 2;                 // Slightly raised above bowl floor
    shaft_top_z = shaft_z + shaft_h;

    // Shaft post
    translate([0, 0, shaft_z])
        cylinder(d=shaft_d, h=shaft_h, center=false);

    // Handle assembly
    translate([0, 0, shaft_top_z]) {
        // Flat foot where handle meets shaft
        cube([handle_width, handle_width, 2], center=true);

        // Segment 1: shaft to bend (slight downward slope)
        hull() {
            cube([2, handle_width, handle_thick], center=true);
            translate([handle_bend_start, 0, -handle_drop*0.25])
                cube([2, handle_width, handle_thick], center=true);
        }

        // Segment 2: bend to knob end (steeper slope to clear bowl rim)
        hull() {
            translate([handle_bend_start, 0, -handle_drop*0.25])
                cube([2, handle_width, handle_thick], center=true);
            translate([handle_length, 0, -handle_drop])
                cube([2, handle_width, handle_thick], center=true);
        }

        // Knob stem
        translate([handle_length, 0, -handle_drop])
            cylinder(d=knob_stem_d, h=knob_stem_h, center=false);

        // Spherical knob
        translate([handle_length, 0, -handle_drop + knob_stem_h])
            sphere(d=knob_d);
    }

    // Hex nut on top of handle
    translate([0, 0, shaft_top_z + 1 + nut_h/2])
        cylinder(d=nut_d, h=nut_h, center=true, $fn=6);
}

// ==========================================
// Final Assembly
// ==========================================

scale(scale_factor) {
    grinder_base();
    grinder_drawer();
    grinder_bowl();
    grinder_shaft_and_handle();
}