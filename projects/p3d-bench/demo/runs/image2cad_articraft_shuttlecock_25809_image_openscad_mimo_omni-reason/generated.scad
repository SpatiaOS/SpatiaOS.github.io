// Parameters
L = 100;          // Total length of the object
L_back = 10;      // Length of the back cylindrical part
L_front = L - L_back; // Length of the front frustum part
D_back = 50;      // Diameter of the back cylinder
D_front = 40;     // Diameter of the front of the frustum
t = 2;            // Wall thickness
N = 8;            // Number of segments (for pattern repetition)
$fn = 100;        // Smoothness for curved surfaces

// Helper module: Rectangular slot (length, width, height)
module rect_slot(l, w, h) {
    cube([l, w, h], center = false);
}

// Helper module: Circular hole (diameter, height)
module circ_hole(d, h) {
    cylinder(h = h, d = d, center = false);
}

// Helper module: Slanted slot (length, width, slant_angle, height)
module slant_slot(l, w, a, h) {
    rotate([a, 0, 0])  // Slant around x-axis
    cube([l, w, h], center = false);
}

// Module to place a slot at a specific (theta, z_slot) position
module slot_at(theta, z_slot, slot_type, params) {
    // Calculate radius at z_slot
    if (z_slot <= L_back) {
        // Back cylindrical part: radius is D_back/2
        r = D_back / 2;
    } else {
        // Front frustum: radius interpolates between D_back/2 and D_front/2
        r = D_back/2 + (D_front/2 - D_back/2) * ((z_slot - L_back) / L_front);
    }
    // Translate to (r*cos(theta), r*sin(theta), z_slot)
    translate([r * cos(theta), r * sin(theta), z_slot])
    // Rotate around z-axis to align tangent with x-axis
    rotate([0, 0, theta])
    if (slot_type == "rect") {
        // params: [length, width, height]
        rect_slot(params[0], params[1], params[2]);
    } else if (slot_type == "circ") {
        // params: [diameter, height]
        circ_hole(params[0], params[1]);
    } else if (slot_type == "slant") {
        // params: [length, width, slant_angle, height]
        slant_slot(params[0], params[1], params[2], params[3]);
    }
}

// Module for the pattern in one segment (angle_step = 360/N)
module segment_pattern(segment_index) {
    angle_step = 360 / N;
    theta_start = segment_index * angle_step;
    // Place slots at various theta offsets within the segment
    for (theta_offset = [5, 15, 25, 35]) {  // 4 slots per segment
        theta = theta_start + theta_offset;
        // Back cylindrical part (z=5)
        slot_at(theta, 5, "rect", [3, 1, 2]);
        // Back cylindrical part (z=10)
        slot_at(theta, 10, "rect", [5, 1, 2]);
        // Front frustum (z=30)
        slot_at(theta, 30, "circ", [3, 2]);
        // Front frustum (z=50)
        slot_at(theta, 50, "slant", [5, 1, 45, 2]);
        // Front frustum (z=70)
        slot_at(theta, 70, "rect", [10, 1, 2]);
        // Front frustum (z=90)
        slot_at(theta, 90, "circ", [3, 2]);
    }
}

// Full pattern: union of all segment patterns
module full_pattern() {
    for (i = [0 : N-1]) {
        segment_pattern(i);
    }
}

// Outer body: back cylinder + front frustum
module outer_body() {
    union() {
        // Back cylinder
        cylinder(h = L_back, d = D_back, center = false);
        // Front frustum
        translate([0, 0, L_back])
        cylinder(h = L_front, r1 = D_back/2, r2 = D_front/2, center = false);
    }
}

// Inner body: back cylinder + front frustum (smaller dimensions)
module inner_body() {
    translate([0, 0, -0.1])  // Offset to avoid z-fighting
    union() {
        // Back cylinder (inner)
        cylinder(h = L_back + 0.2, d = D_back - 2*t, center = false);
        // Front frustum (inner)
        translate([0, 0, L_back])
        cylinder(h = L_front + 0.2, r1 = D_back/2 - t, r2 = D_front/2 - t, center = false);
    }
}

// Main shell: outer - inner
module main_shell() {
    difference() {
        outer_body();
        inner_body();
    }
}

// Main model: shell minus pattern
module main_model() {
    difference() {
        main_shell();
        full_pattern();
    }
}

// Render the main model
main_model();