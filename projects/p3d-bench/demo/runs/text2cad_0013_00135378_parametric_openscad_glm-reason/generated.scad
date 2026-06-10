// === Parametric Dimensions ===
base_length = 0.75;           // Base footprint length
base_width = 0.45;            // Base footprint width
base_height = 0.05625;        // Base height (shoulder datum)
main_depth = 0.0562;          // Main depth (≈ base_height)

// Center axis position from left and front edges
cx = 0.375;                   // 0.375 from left edge
cy = 0.225;                   // 0.225 from front edge

// Concentric circular radii (outer to inner)
r_collar_outer = 0.225;       // Outer collar outer radius
r_collar_inner = 0.1875;      // Outer collar inner radius (opening)
r_middle_outer = 0.0937;      // Middle annular section outer radius
r_middle_inner = 0.0562;      // Middle annular section inner radius (opening)
r_center = 0.0562;            // Innermost solid section radius

// Heights measured from shared shoulder datum (top of base)
h_collar = 0.1687;            // Collar reaches 0.1687 from shoulder
h_middle = 0.0937;            // Middle section reaches 0.0937 from shoulder
h_center = 0.075;             // Center post reaches 0.075 from shoulder

shoulder_z = base_height;     // Z position of shoulder datum

$fn = 120;

// Stadium (capsule/slot) shape module for the rounded rectangular base
module stadium(l, w, h) {
    r = w / 2;
    hull() {
        translate([r, r, 0])
            cylinder(r=r, h=h);
        translate([l - r, r, 0])
            cylinder(r=r, h=h);
    }
}

// Annular ring module (tube with hollow center = real opening)
module annular_ring(outer_r, inner_r, height) {
    difference() {
        cylinder(r=outer_r, h=height);
        translate([0, 0, -0.001])
            cylinder(r=inner_r, h=height + 0.002);
    }
}

// === Main Assembly ===
union() {
    // Rounded slot-like rectangular base
    stadium(base_length, base_width, base_height);

    // Outer annular collar: occupies central 0.45 x 0.45 span
    // Outer radius 0.225, inner radius 0.1875 (hollow opening)
    translate([cx, cy, shoulder_z])
        annular_ring(r_collar_outer, r_collar_inner, h_collar);

    // Smaller coaxial annular section
    // Outer radius 0.0937, inner radius 0.0562 (hollow opening)
    // Offsets: left 0.2812, right 0.2814, front 0.1312, back 0.1314
    translate([cx, cy, shoulder_z])
        annular_ring(r_middle_outer, r_middle_inner, h_middle);

    // Innermost solid circular section
    // Radius 0.0562, length 0.1125, width 0.1125, height 0.075
    // Offsets: left 0.3188, right 0.3188, front 0.1688, back 0.1688
    translate([cx, cy, shoulder_z])
        cylinder(r=r_center, h=h_center);
}