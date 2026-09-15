// 4-digit 7-segment display module, parametric model
$fn = 32;

// Overall dimensions (design coordinate system: X=right, Y=up, Z=back)
total_length = 50.7;    // X: long axis, digit row length
total_height = 19.0;    // Y: front face height
total_depth = 11.0;     // Z: total depth including pins
housing_depth = 7.9;    // Z: main spacer block depth
shim_thickness = 0.1;   // Z: front shim plate thickness
body_depth = housing_depth + shim_thickness; // Z depth of main body (no pins)

// Thin feature dimensions
seg_thickness = 0.01;   // Z: thickness of segment plates
dp_r = 0.8;             // decimal point radius
dp_thickness = 0.01;    // Z: decimal point disc thickness

// Pin dimensions
pin_r = 0.25;           // pin shank radius
pin_shank_len = 2.63;   // Z: cylindrical shank length
pin_tip_len = 0.37;     // Z: conical tip length
pin_tip_r = 0.1;        // radius of truncated pin tip
num_pins = 12;
num_digits = 4;

// 7-segment dimensions
seg_bar_width = 1.5;    // width of individual segment bars
seg_h_length = 5.0;     // length of horizontal segments
seg_v_length = 5.0;     // length of vertical segments
seg_gap = 0.3;          // gap between adjacent segment tips
digit_spacing = 3.2;    // X spacing between digit origins
pin_y_offset = 2.0;     // Y distance from top edge to pin row
pin_x_margin = 5.0;     // X margin from ends to first/last pin

// Derived layout dimensions
dw = 2*seg_bar_width + 2*seg_gap + seg_h_length; // single digit width
dh = 3*seg_bar_width + 2*seg_v_length + 4*seg_gap; // single digit height
digit_total_width = num_digits * dw + (num_digits - 1)*digit_spacing;
digit_start_x = (total_length - digit_total_width) / 2;
digit_start_y = (total_height - dh) / 2;
pin_x_start = pin_x_margin;
pin_x_end = total_length - pin_x_margin;
pin_spacing = (pin_x_end - pin_x_start) / (num_pins - 1);
pin_y_pos = total_height - pin_y_offset; // Y position of pins (near top)

// Main housing spacer block (solid rectangular prism)
module spacer_block() {
    translate([0, 0, shim_thickness])
        cube([total_length, total_height, housing_depth]);
}

// Front shim plate (thin front face datum)
module shim_plate() {
    cube([total_length, total_height, shim_thickness]);
}

// Single locating pin: cylindrical shank with truncated conical tip
module locating_pin() {
    cylinder(h=pin_shank_len, r=pin_r, center=false);
    translate([0, 0, pin_shank_len])
        cylinder(h=pin_tip_len, r1=pin_r, r2=pin_tip_r, center=false);
}

// Decimal point thin disc
module decimal_point() {
    cylinder(h=dp_thickness, r=dp_r, center=false);
}

// Horizontal seven-segment bar (symmetric double-pointed hexagon)
module horizontal_segment() {
    linear_extrude(height=seg_thickness)
    polygon(
        let(c = seg_bar_width / 2)
        [
            [c, 0],
            [seg_h_length - c, 0],
            [seg_h_length, c],
            [seg_h_length - c, seg_bar_width],
            [c, seg_bar_width],
            [0, c]
        ]
    );
}

// Vertical seven-segment bar (symmetric double-pointed hexagon)
module vertical_segment() {
    linear_extrude(height=seg_thickness)
    polygon(
        let(c = seg_bar_width / 2)
        [
            [c, 0],
            [seg_bar_width - c, 0],
            [seg_bar_width, c],
            [seg_bar_width - c, seg_v_length],
            [c, seg_v_length],
            [0, c]
        ]
    );
}

// Single 7-segment digit (all segments lit, showing '8' with decimal point)
module seven_seg_digit() {
    cy = dh / 2;
    hx = (dw - seg_h_length) / 2;
    rvx = dw - seg_bar_width;
    
    // Middle horizontal segment (g)
    translate([hx, cy - seg_bar_width/2, -seg_thickness])
        horizontal_segment();
    // Top horizontal segment (a)
    translate([hx, cy + seg_bar_width/2 + 2*seg_gap + seg_v_length, -seg_thickness])
        horizontal_segment();
    // Bottom horizontal segment (d)
    translate([hx, cy - seg_bar_width/2 - 2*seg_gap - seg_v_length - seg_bar_width, -seg_thickness])
        horizontal_segment();
    // Upper left vertical (f)
    translate([0, cy + seg_bar_width/2 + seg_gap, -seg_thickness])
        vertical_segment();
    // Upper right vertical (b)
    translate([rvx, cy + seg_bar_width/2 + seg_gap, -seg_thickness])
        vertical_segment();
    // Lower left vertical (e)
    translate([0, cy - seg_bar_width/2 - seg_gap - seg_v_length, -seg_thickness])
        vertical_segment();
    // Lower right vertical (c)
    translate([rvx, cy - seg_bar_width/2 - seg_gap - seg_v_length, -seg_thickness])
        vertical_segment();
    // Decimal point (lower right)
    translate([dw + 1.0, dp_r, -dp_thickness])
        decimal_point();
}

// Main assembly (design coordinates)
module assembly() {
    // Main body components
    union() {
        spacer_block();
        shim_plate();
    }
    
    // Four seven-segment digits across front face
    for (i = [0:num_digits-1]) {
        translate([
            digit_start_x + i*(dw + digit_spacing),
            digit_start_y,
            0
        ]) {
            seven_seg_digit();
        }
    }
    
    // 12 pins along upper rear edge
    for (i = [0:num_pins-1]) {
        translate([
            pin_x_start + i*pin_spacing,
            pin_y_pos,
            body_depth
        ]) {
            locating_pin();
        }
    }
}

// Transform to OpenSCAD default coordinate system (X=right, Y=back, Z=up) for natural viewing
rotate([90, 0, 0])
mirror([0, 1, 0])
assembly();