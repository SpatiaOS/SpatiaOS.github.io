// Resolution for curved surfaces
$fn = 100;

// Small tolerance to ensure clean through-cuts
eps = 0.001;

// --- Base plate dimensions ---
base_length = 0.75;
base_width  = 0.625;
base_height = 0.00625;      // solid extends upward from base datum (z=0)

// --- Left upright wall dimensions ---
wall_thickness = 0.0063;    // footprint x-dimension
wall_height    = 0.1938;    // total reach from base datum (z=0)

// --- Lower rectangular opening through wall ---
open1_y_span   = 0.081103;
open1_height   = 0.111891;
open1_front_offset = 0.4447;    // distance from front edge (y=0)
open1_z_bottom = 0;             // relative to base underside
open1_reach    = 0.0062;        // nominal through reach

// --- Circular through-hole in wall ---
hole_radius    = 0.0432;
hole_front_offset = 0.2948;     // axis location in y
hole_z_bottom  = 0.0631;
hole_z_top     = 0.1495;
hole_reach     = 0.0625;        // cut depth along x
hole_z_center  = (hole_z_bottom + hole_z_top) / 2;

// --- Smaller rectangular through opening in wall ---
open3_y_span   = 0.043521;
open3_height   = 0.044108;
open3_front_offset = 0.091;
open3_z_bottom = 0.0992;
open3_reach    = 0.0625;

// --- Rectangular through opening in base plate ---
basecut_x_span = 0.264669;
basecut_y_span = 0.40625;
basecut_left_offset  = 0.3125;
basecut_front_offset = 0.2073;
basecut_z_bottom = -0.0562;
basecut_z_top    = 0.0063;

// Main model
difference() {
    union() {
        // Base plate sitting on datum
        cube([base_length, base_width, base_height]);

        // Left wall flush with front/back edges, rising from datum
        cube([wall_thickness, base_width, wall_height]);
    }

    // 1) Lower rectangular opening through wall thickness
    // Starts at wall plane x=0; depth expanded to wall_thickness+eps to ensure
    // a clean through cut (nominal reach 0.0062 is slightly less than wall thickness)
    translate([0, open1_front_offset, open1_z_bottom])
        cube([wall_thickness + eps, open1_y_span, open1_height]);

    // 2) Circular through-hole
    // Axis placed on wall plane (x=0) at specified front offset and vertical center
    translate([0, hole_front_offset, hole_z_center])
        rotate([0, 90, 0])
            cylinder(h = hole_reach, r = hole_radius, center = false);

    // 3) Smaller rectangular through opening
    // Anchored to wall plane x=0 and cutting inward
    translate([0, open3_front_offset, open3_z_bottom])
        cube([open3_reach, open3_y_span, open3_height]);

    // 4) Base plate rectangular through opening
    // Positioned by edge offsets, removal band fully passes through thin plate
    translate([basecut_left_offset, basecut_front_offset, basecut_z_bottom])
        cube([basecut_x_span, basecut_y_span, basecut_z_top - basecut_z_bottom]);
}