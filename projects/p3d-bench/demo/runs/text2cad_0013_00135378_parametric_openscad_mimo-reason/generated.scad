// Parametric Model: Rounded Base with Coaxial Features
// All dimensions in mm

// --- Global Parameters ---
$fn = 100; // Smoothness for circular features

// --- Base Parameters ---
base_length = 0.75;
base_width = 0.45;
base_height = 0.05625;
main_depth = 0.0562;
shoulder_z = 0; // Shoulder datum at base top

// --- Central Axis Position (from left-front corner) ---
axis_x = 0.375;
axis_y = 0.225;

// --- Concentric Profile Radii (outer to inner) ---
radii = [0.225, 0.1875, 0.1875, 0.0937, 0.0937, 0.0562, 0.0562];

// --- Outer Annular Collar ---
collar_outer_r = 0.225;
collar_inner_r = 0.1875;
collar_height = 0.1687;

// --- Smaller Annular Section ---
small_annular_outer_r = 0.0937;
small_annular_inner_r = 0.0562;
small_annular_height = 0.0937;
// Circular span offsets from central axis
small_annular_offset_left = 0.2812;
small_annular_offset_right = 0.2814;
small_annular_offset_front = 0.1312;
small_annular_offset_back = 0.1314;

// --- Innermost Solid Section ---
solid_r = 0.0562;
solid_height = 0.075;
solid_length = 0.1125;
solid_width = 0.1125;
// Circular span offsets from central axis
solid_offset_left = 0.3188;
solid_offset_right = 0.3188;
solid_offset_front = 0.1688;
solid_offset_back = 0.1688;

// --- Helper Modules ---
module rounded_slot(length, width, height) {
    // Rounded rectangular base using minkowski sum
    r = min(length, width) / 10; // Corner radius
    linear_extrude(height = height)
    minkowski() {
        square([length - 2*r, width - 2*r], center = true);
        circle(r = r);
    }
}

module concentric_profile() {
    // Create 2D concentric profile with hollow rings
    difference() {
        circle(r = radii[0]); // Outermost circle
        // Subtract inner circles to create rings
        for (i = [1 : len(radii)-1]) {
            if (i % 2 == 1) { // Paired inner loops as hollow boundaries
                circle(r = radii[i]);
            }
        }
    }
}

module annular_section(outer_r, inner_r, height) {
    // Hollow annular ring
    linear_extrude(height = height)
    difference() {
        circle(r = outer_r);
        circle(r = inner_r);
    }
}

module solid_cylinder_section(r, height, length, width) {
    // Solid circular section constrained within rectangular span
    intersection() {
        cylinder(h = height, r = r);
        translate([-length/2, -width/2, 0])
        cube([length, width, height]);
    }
}

// --- Main Model ---
union() {
    // 1. Rounded rectangular base
    translate([0, 0, -base_height])
    rounded_slot(base_length, base_width, base_height);
    
    // 2. Concentric circular profile at shoulder level
    translate([axis_x, axis_y, shoulder_z])
    linear_extrude(height = main_depth)
    concentric_profile();
    
    // 3. Outer annular collar
    translate([axis_x, axis_y, shoulder_z])
    annular_section(collar_outer_r, collar_inner_r, collar_height);
    
    // 4. Smaller coaxial annular section
    // Position based on circular span offsets (center of span)
    span_center_x = (small_annular_offset_right - small_annular_offset_left) / 2;
    span_center_y = (small_annular_offset_back - small_annular_offset_front) / 2;
    translate([axis_x + span_center_x, axis_y + span_center_y, shoulder_z])
    annular_section(small_annular_outer_r, small_annular_inner_r, small_annular_height);
    
    // 5. Innermost solid circular section
    // Position based on circular span offsets (center of span)
    solid_span_center_x = (solid_offset_right - solid_offset_left) / 2;
    solid_span_center_y = (solid_offset_back - solid_offset_front) / 2;
    translate([axis_x + solid_span_center_x, axis_y + solid_span_center_y, shoulder_z])
    solid_cylinder_section(solid_r, solid_height, solid_length, solid_width);
}