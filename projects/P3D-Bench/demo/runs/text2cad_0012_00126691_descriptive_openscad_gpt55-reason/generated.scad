// Parameters
$fn = 64;

// Base slab
base_width = 90;
base_depth = 64;
base_thickness = 2.5;

// Rear raised pad layout
rear_clearance = 3;
side_clearance = 6;
front_exposed_strip_depth = 18;
raised_height = 3.0;
raised_width = base_width - 2 * side_clearance;
raised_depth = base_depth - rear_clearance - front_exposed_strip_depth;

// Stepped forward continuation
continuation_width = 26;
continuation_depth = 10;
continuation_x_offset = 0;
continuation_height = raised_height;

// Left and right raised strips
side_strip_width = 5;
side_strip_depth = raised_depth;
side_strip_height = 1.1;

// Thin transverse raised feature
transverse_rib_width = raised_width;
transverse_rib_depth = 3;
transverse_rib_height = 1.1;
transverse_rib_front_setback = 0;

// Real opening through transverse feature only
rib_opening_width = 28;
rib_opening_depth = 1.2;

// Boolean robustness
join_overlap = 0.02;
plan_overlap = 0.05;
cut_clearance = 0.05;

// Derived positions
base_top_z = base_thickness;
raised_top_z = base_top_z + raised_height;
rear_y = base_depth / 2 - rear_clearance;
raised_front_y = rear_y - raised_depth;
rib_center_y = raised_front_y + transverse_rib_front_setback + transverse_rib_depth / 2;

// Centered box with bottom at zmin
module centered_box(w, d, h, xpos = 0, ypos = 0, zmin = 0) {
    translate([xpos, ypos, zmin + h / 2])
        cube([w, d, h], center = true);
}

// Added solid with slight vertical overlap
module added_box(w, d, h, xpos = 0, ypos = 0, zmin = 0) {
    centered_box(w, d, h + join_overlap, xpos, ypos, zmin - join_overlap);
}

// Rear-aligned rectangular solid
module rear_aligned_box(w, d, h, xpos = 0, y_rear = 0, zmin = 0) {
    added_box(w, d, h, xpos, y_rear - d / 2, zmin);
}

// Thin base slab
module base_slab() {
    centered_box(base_width, base_depth, base_thickness, 0, 0, 0);
}

// Main rear raised rectangular portion
module rear_raised_pad() {
    rear_aligned_box(raised_width, raised_depth, raised_height, 0, rear_y, base_top_z);
}

// Aligned continuation creating the stepped lower/front outline
module forward_continuation() {
    centered_box(
        continuation_width,
        continuation_depth + plan_overlap,
        continuation_height + join_overlap,
        continuation_x_offset,
        raised_front_y - continuation_depth / 2 + plan_overlap / 2,
        base_top_z - join_overlap
    );
}

// Narrow raised side strip
module side_strip(xsign = 1) {
    xpos = xsign * (raised_width / 2 - side_strip_width / 2);
    rear_aligned_box(side_strip_width, side_strip_depth, side_strip_height, xpos, rear_y, raised_top_z);
}

// Transverse raised rib with a real internal opening
module transverse_rib_with_opening() {
    difference() {
        added_box(transverse_rib_width, transverse_rib_depth, transverse_rib_height, 0, rib_center_y, raised_top_z);

        translate([0, rib_center_y, raised_top_z + transverse_rib_height / 2])
            cube(
                [
                    rib_opening_width,
                    rib_opening_depth,
                    transverse_rib_height + join_overlap + 2 * cut_clearance
                ],
                center = true
            );
    }
}

// Main model
union() {
    base_slab();

    // Added solids on top of the base
    rear_raised_pad();
    forward_continuation();

    // Higher raised strips and transverse feature
    side_strip(-1);
    side_strip(1);
    transverse_rib_with_opening();
}