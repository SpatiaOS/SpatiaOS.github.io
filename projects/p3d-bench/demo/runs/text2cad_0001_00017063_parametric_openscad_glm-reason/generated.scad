// === Parametric Dimensions ===
base_length = 0.75;            // x-dimension of base footprint
base_width = 0.21875;         // y-dimension of base footprint
base_height = 0.28125;        // declared z-height of base
main_extrusion_depth = 0.2812; // actual extrusion depth (z)

// Circular cutout placement (from left/front edges)
hole1_x = 0.0717;             // hole 1 center, offset from left edge
hole1_y = 0.0625;             // hole 1 center, offset from front edge
hole2_x = 0.6692;             // hole 2 center, offset from left edge
hole2_y = 0.0625;             // hole 2 center, offset from front edge
hole_radius = 0.0312;         // radius of each circular profile

// Cut band vertical range (above base underside)
cut_z_bottom = 0.1081;        // lower bound of removed band
cut_z_top = 0.1705;           // upper bound of removed band
cut_depth = 0.0625;           // vertical extent of cut

$fn = 100;                    // curve resolution

// === Base Module ===
module base_block() {
    // Solid upper-side extrusion from datum, full footprint with zero edge offsets
    // Side outline kept arched (full extrusion profile, no rectangular notch)
    cube([base_length, base_width, main_extrusion_depth]);
}

// === Circular Cutout Module ===
module circular_hole(cx, cy) {
    // Single circular profile cut from the upper side
    // Removed band runs from cut_z_bottom to cut_z_top above base underside
    translate([cx, cy, cut_z_bottom])
        cylinder(h = cut_depth, r = hole_radius);
}

// === Main Model ===
difference() {
    base_block();

    // Remove-material feature: two separate circular profiles (not a connected slot)
    // Envelope span 0.6599 x 0.0625 is bounding box only;
    // surrounding and intervening material remains solid
    circular_hole(hole1_x, hole1_y);
    circular_hole(hole2_x, hole2_y);
}