// Slim Full-Size Keyboard Model
$fn = 36; // Reduced smoothness for faster rendering, still high quality

// ==============================================
// PARAMETRIC DIMENSIONS (all units in mm)
// ==============================================
// Base dimensions
base_length = 280;   // Total length along X axis
base_width = 120;    // Total width along Y axis
base_thickness = 3;  // Base plate thickness
front_lip_radius = base_thickness / 2; // Rounded roll on front edge

// Key specifications
reg_key_size = 12;     // Standard square key width/depth
key_height = 1;        // Height of keys above base surface
key_corner_radius = 0.8; // Rounded corner radius for all keys
key_gap = 2;           // Gap between adjacent keys
key_unit = reg_key_size + key_gap; // Base unit for key positioning

// Special key sizes (adjusted for gaps)
tab_width = 1.5 * key_unit - key_gap;
caps_width = 1.75 * key_unit - key_gap;
l_shift_width = 2.25 * key_unit - key_gap;
r_shift_width = 2.75 * key_unit - key_gap;
backspace_width = 2 * key_unit - key_gap;
main_enter_width = 2 * key_unit - key_gap;
spacebar_width = 6.25 * key_unit - key_gap;
numpad_plus_height = 2 * key_unit - key_gap;
numpad_enter_height = 2 * key_unit - key_gap;
numpad_zero_width = 2 * key_unit - key_gap;

// Edge margins
margin_left = 8;
margin_right = 8;
margin_top = 8;
margin_bottom = 8;

// ==============================================
// HELPER MODULES (FASTER IMPLEMENTATION)
// ==============================================
// Rounded box primitive using offset + extrude instead of slow minkowski
module rounded_box(w, d, h, r) {
  linear_extrude(height = h) {
    translate([r, r])
    offset(r = r)
    square([w - 2*r, d - 2*r]);
  }
}

// Single key module with rounded corners
module key(width, depth) {
  translate([0, 0, base_thickness])
  rounded_box(width, depth, key_height, key_corner_radius);
}

// Keyboard base plate with integrated front lip
module keyboard_base() {
  union() {
    // Main flat base plate
    cube([base_length, base_width, base_thickness]);
    // Rounded front lip (runs full length of keyboard)
    translate([0, 0, base_thickness/2])
    rotate([90, 0, 0])
    cylinder(h=base_length, r=front_lip_radius, center=false);
  }
}

// ==============================================
// MAIN MODEL ASSEMBLY
// ==============================================
union() {
  // Base structure
  keyboard_base();

  // ------------------------------
  // Alphanumeric Section (Left)
  // ------------------------------
  alpha_x0 = margin_left;
  alpha_y0 = base_width - margin_top - reg_key_size;
  num_alpha_cols = 14;

  // Row 0 (Top function row)
  for (col = [0:num_alpha_cols-1]) {
    translate([alpha_x0 + col * key_unit, alpha_y0, 0])
    key(reg_key_size, reg_key_size);
  }

  // Row 1 (Number row + backspace)
  for (col = [0:num_alpha_cols-2]) {
    translate([alpha_x0 + col * key_unit, alpha_y0 - 1*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }
  translate([alpha_x0 + (num_alpha_cols-2)*key_unit, alpha_y0 - 1*key_unit, 0])
  key(backspace_width, reg_key_size);

  // Row 2 (Tab + QWER row)
  translate([alpha_x0, alpha_y0 - 2*key_unit, 0])
  key(tab_width, reg_key_size);
  for (col = [1:num_alpha_cols-3]) {
    translate([alpha_x0 + tab_width + key_gap + (col-1)*key_unit, alpha_y0 - 2*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }

  // Row 3 (Caps Lock + ASDF row + Enter)
  translate([alpha_x0, alpha_y0 - 3*key_unit, 0])
  key(caps_width, reg_key_size);
  for (col = [1:num_alpha_cols-4]) {
    translate([alpha_x0 + caps_width + key_gap + (col-1)*key_unit, alpha_y0 - 3*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }
  translate([alpha_x0 + (num_alpha_cols-2)*key_unit, alpha_y0 - 3*key_unit, 0])
  key(main_enter_width, reg_key_size);

  // Row 4 (Left Shift + ZXCV row + Right Shift)
  translate([alpha_x0, alpha_y0 - 4*key_unit, 0])
  key(l_shift_width, reg_key_size);
  for (col = [1:num_alpha_cols-4]) {
    translate([alpha_x0 + l_shift_width + key_gap + (col-1)*key_unit, alpha_y0 - 4*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }
  translate([alpha_x0 + (num_alpha_cols-3)*key_unit, alpha_y0 - 4*key_unit, 0])
  key(r_shift_width, reg_key_size);

  // Row 5 (Modifiers + Spacebar)
  for (col = [0:3]) {
    translate([alpha_x0 + col * key_unit, alpha_y0 - 5*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }
  translate([alpha_x0 + 4*key_unit, alpha_y0 - 5*key_unit, 0])
  key(spacebar_width, reg_key_size);
  for (col = [10:num_alpha_cols-1]) {
    translate([alpha_x0 + col * key_unit, alpha_y0 - 5*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }

  // ------------------------------
  // Numpad Section (Right)
  // ------------------------------
  numpad_x0 = base_length - margin_right - 4*key_unit;
  numpad_y0 = base_width - margin_top - reg_key_size;
  num_numpad_cols = 4;

  // Numpad Row 0 (Function keys)
  for (col = [0:num_numpad_cols-1]) {
    translate([numpad_x0 + col * key_unit, numpad_y0, 0])
    key(reg_key_size, reg_key_size);
  }

  // Numpad Rows 1-2 (7/8/9, 4/5/6 + tall plus key)
  for (row = [1:2]) {
    for (col = [0:2]) {
      translate([numpad_x0 + col * key_unit, numpad_y0 - row*key_unit, 0])
      key(reg_key_size, reg_key_size);
    }
  }
  translate([numpad_x0 + 3*key_unit, numpad_y0 - 1*key_unit, 0])
  key(reg_key_size, numpad_plus_height);

  // Numpad Row 3 (1/2/3 + tall enter key)
  for (col = [0:2]) {
    translate([numpad_x0 + col * key_unit, numpad_y0 - 3*key_unit, 0])
    key(reg_key_size, reg_key_size);
  }
  translate([numpad_x0 + 3*key_unit, numpad_y0 - 3*key_unit, 0])
  key(reg_key_size, numpad_enter_height);

  // Numpad Row 4 (Wide zero + decimal)
  translate([numpad_x0, numpad_y0 - 4*key_unit, 0])
  key(numpad_zero_width, reg_key_size);
  translate([numpad_x0 + 2*key_unit, numpad_y0 - 4*key_unit, 0])
  key(reg_key_size, reg_key_size);
}