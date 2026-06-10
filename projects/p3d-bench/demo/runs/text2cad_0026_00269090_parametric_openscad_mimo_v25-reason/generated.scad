// Parameters
base_length = 0.375;
base_width = 0.75;
base_height = 0.013393;
base_reach = 0.0134;

wall_reach = 0.2277;
wall_thickness = 0.0134;

sleeve_length = 0.066964;
sleeve_width = 0.133929;
sleeve_height = 0.214286;
sleeve_extrusion = 0.2143;
sleeve_total_reach = 0.442;
sleeve_offset_left = 0.308;
sleeve_offset_front = 0.308;
sleeve_offset_back = 0.3081;

lower_depth = 0.2143;
lower_top_below_base = 0.0134;
lower_bottom_below_base = 0.2277;

hole_radius = 0.0067;
hole_x = 0.3616;
hole1_y = 0.6828;
hole2_y = 0.0672;
hole_z_start = 0.1674;
hole_z_end = 0.1808;
hole_cut_depth = 0.0134;

corner_r = 0.01;
$fn = 100;

// Rounded rectangle module
module rounded_rect(l, w, h) {
    linear_extrude(height = h)
        offset(r = corner_r)
            square([l - 2*corner_r, w - 2*corner_r], center = false);
}

// Main assembly
difference() {
    union() {
        // Base plate: 0.375 x 0.75, reach 0.0134 from datum
        color("SteelBlue")
            rounded_rect(base_length, base_width, base_reach);

        // Wall frame: same footprint, reach 0.2277 from datum
        // Curved outline preserved, inner openings real (not capped)
        color("SlateBlue")
            difference() {
                rounded_rect(base_length, base_width, wall_reach);
                translate([wall_thickness, wall_thickness, -0.001])
                    rounded_rect(
                        base_length - 2*wall_thickness,
                        base_width - 2*wall_thickness,
                        wall_reach + 0.002
                    );
            }

        // Raised sleeve/post: solid attached material
        // Position: 0.308 from left, 0.308 from front, 0.3081 from back
        // Right edge shares base right edge (0.308 + 0.066964 ≈ 0.375)
        // Total reach 0.442 from base datum
        color("CornflowerBlue")
            translate([sleeve_offset_left, sleeve_offset_front, 0])
                rounded_rect(sleeve_length, sleeve_width, sleeve_total_reach);

        // Lower continuation: paired beneath sleeve, extends below base
        // Shares right edge at x=0.375
        // Top at z = -0.0134, bottom at z = -0.2277
        color("MediumSlateBlue")
            translate([
                base_length - sleeve_length,
                sleeve_offset_front,
                -(lower_bottom_below_base)
            ])
                rounded_rect(sleeve_length, sleeve_width, lower_depth);
    }

    // Two circular through-holes in wall height band
    // Axis at x=0.3616, y=0.6828 and y=0.0672
    // Height band: 0.1674 to 0.1808 above base underside
    // Cut depth 0.0134 (through wall thickness)
    translate([hole_x, hole1_y, hole_z_start - 0.001])
        cylinder(h = hole_cut_depth + 0.002, r = hole_radius);

    translate([hole_x, hole2_y, hole_z_start - 0.001])
        cylinder(h = hole_cut_depth + 0.002, r = hole_radius);
}