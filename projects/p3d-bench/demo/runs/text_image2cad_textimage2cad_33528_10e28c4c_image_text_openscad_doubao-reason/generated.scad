// Global Settings
$fn = 100;

// Overall Assembly Dimensions
assem_x = 309;    // X length
assem_y = 65;     // Total height (Y axis = vertical)
assem_z = 247;    // Z depth

// Base Plate Parameters
base_x = assem_x;
base_z = 245;
base_y = 28;

// Housing Cover Parameters
cover_x = 300;
cover_z = 230;
cover_y = assem_y - base_y;
cover_cutout_fillet = 1.0;
cover_perim_chamfer = 2.0;

// Spacer Block Parameters (26 instances)
spacer_x = 18.87;
spacer_z = 12.09;
spacer_y = 5.0;
spacer_edge_fillet = 2.0;

// Jog Cap Parameters (2 instances)
cap_dia = 86;
cap_height = 20;
cap_slot_count = 14;
cap_slot_width = 3;
cap_slot_depth = 3;
cap_center_step_dia = 60.5;
cap_indicator_boss_dia = 6;

// Control Pin Parameters (11 instances)
pin_dia = 1.5;
pin_length = 11;

// Socket Post Parameters (8 instances)
socket_base_dia = 14.89;
socket_height = 17;
socket_through_hole_dia = 1.178;

// Flanged Bushing Parameters (6 instances)
bushing_flange_dia = 18.2;
bushing_boss_dia = 10.06;
bushing_boss_length = 5;
bushing_total_height = 10;
bushing_bore_dia = 4.92;

// Wedge Guide Block Parameters (3 instances)
wedge_x = 18;
wedge_z = 14;
wedge_height = 8;
wedge_groove_width = 3;
wedge_groove_depth = 2;

// Structural Bar Parameters (3 instances)
bar_length = 20;
bar_width = 2;
bar_thickness = 1.1;

// Locating Pin Parameters (3 instances)
locpin_head_dia = 14.9;
locpin_total_height = 17;
locpin_cross_hole_dia = 1.178;

// Ball Stud Parameters (2 instances)
ball_head_dia = 18.2;
ball_total_height = 10;
ball_through_bore_dia = 4.92;

// Helper Module: 2D Filleted Rectangle
module rounded_square(size, r, center=true) {
  offset(r=r) offset(delta=-r) square(size, center=center);
}

// Component Module: Spacer Block
module spacer_block() {
  union() {
    cube([spacer_x, spacer_y - spacer_edge_fillet, spacer_z], center=true);
    translate([0, (spacer_y - spacer_edge_fillet)/2, 0])
    linear_extrude(height=spacer_edge_fillet)
    rounded_square([spacer_x, spacer_z], r=spacer_edge_fillet);
  }
}

// Component Module: Jog Wheel Cap
module jog_cap() {
  difference() {
    union() {
      cylinder(h=cap_height, d=cap_dia, center=true);
      translate([0, cap_height/2 - 1, 0])
      cylinder(h=2, d=cap_center_step_dia, center=true);
      translate([cap_center_step_dia/2 - 10, cap_height/2, 0])
      sphere(d=cap_indicator_boss_dia);
    }
    for (ang = [0 : 360/cap_slot_count : 359]) {
      rotate(ang, [0, 1, 0])
      translate([cap_dia/2 - cap_slot_depth/2, 0, 0])
      cube([cap_slot_depth, cap_height + 1, cap_slot_width], center=true);
    }
  }
}

// Component Module: Control Pin
module control_pin() {
  cylinder(h=pin_length, d=pin_dia, center=true);
}

// Component Module: Socket Post
module socket_post() {
  difference() {
    union() {
      cylinder(h=3, d=socket_base_dia, center=true);
      translate([0, (socket_height - 3)/2, 0])
      cylinder(h=socket_height - 3, r1=socket_base_dia/2, r2=socket_base_dia/2 * 0.7, center=true);
    }
    cylinder(h=socket_height + 1, d=socket_through_hole_dia, center=true);
  }
}

// Component Module: Flanged Bushing
module flanged_bushing() {
  difference() {
    union() {
      cylinder(h=bushing_total_height - bushing_boss_length, d=bushing_flange_dia, center=true);
      translate([0, -bushing_total_height/2 + bushing_boss_length/2, 0])
      cylinder(h=bushing_boss_length, d=bushing_boss_dia, center=true);
    }
    cylinder(h=bushing_total_height + 1, d=bushing_bore_dia, center=true);
    translate([0, bushing_total_height/2, 0])
    cylinder(h=2, r1=bushing_bore_dia/2, r2=bushing_bore_dia/2 + 1, center=true);
  }
}

// Component Module: Wedge Guide Block
module wedge_guide() {
  difference() {
    linear_extrude(height=wedge_z)
    polygon(points=[
      [-wedge_x/2, -wedge_height/2],
      [wedge_x/2, -wedge_height/2],
      [wedge_x/3, wedge_height/2],
      [-wedge_x/3, wedge_height/2]
    ]);
    translate([0, wedge_height/2 - wedge_groove_depth/2, 0])
    rotate([90, 0, 0])
    linear_extrude(height=wedge_groove_depth)
    square([wedge_x, wedge_groove_width], center=true);
  }
}

// Component Module: Structural Bar
module structural_bar() {
  cube([bar_length, bar_thickness, bar_width], center=true);
}

// Component Module: Locating Pin
module locating_pin() {
  difference() {
    union() {
      translate([0, locpin_total_height * 0.7, 0])
      sphere(d=locpin_head_dia * 0.8);
      translate([0, locpin_total_height * 0.2, 0])
      cylinder(h=locpin_total_height * 0.6, r1=locpin_head_dia/2 * 0.7, r2=locpin_head_dia/2 * 0.3, center=true);
    }
    translate([0, locpin_total_height * 0.1, 0])
    rotate([90, 0, 90])
    linear_extrude(height=locpin_head_dia/2 * 0.6 + 1)
    square([locpin_total_height * 0.4, 1.5], center=true);
    rotate([90, 0, 0])
    cylinder(h=locpin_head_dia + 1, d=locpin_cross_hole_dia, center=true);
  }
}

// Component Module: Ball Stud
module ball_stud() {
  difference() {
    union() {
      translate([0, ball_total_height/2 - ball_head_dia/4, 0])
      sphere(d=ball_head_dia);
      translate([0, -ball_total_height/4, 0])
      cylinder(h=ball_total_height/2, d=ball_head_dia * 0.8, center=true);
    }
    cylinder(h=ball_total_height + 1, d=ball_through_bore_dia, center=true);
  }
}

// Main Assembly
union() {
  // Base Plate
  translate([assem_x/2, base_y/2, assem_z/2])
  difference() {
    cube([base_x, base_y, base_z], center=true);
    // Surface grooves
    for (i = [0:6]) {
      translate([-base_x/2 + 40 + i*40, 0, 0])
      cube([20, base_y + 1, base_z - 20], center=true);
    }
    // Corner notch
    translate([-base_x/2 + 20, base_y + 1, base_z/2 - 20])
    rotate([0, 45, 0])
    cube([40, base_y + 2, 40], center=true);
  }

  // Housing Cover
  translate([assem_x/2, base_y + cover_y/2, assem_z/2])
  difference() {
    cube([cover_x, cover_y, cover_z], center=true);
    // Perimeter chamfer
    offset(r=-cover_perim_chamfer)
    linear_extrude(height=cover_y + 1, center=true)
    square([cover_x, cover_z], center=true);
    // Spacer block cutouts
    spacer_idx = 0;
    for (x = [-80, -40, 0, 40, 80], z = [-70, -40, -10, 20, 50, 80]) {
      if (!(x == 0 && z == 0) && abs(x) + abs(z) > 50 && spacer_idx < 26) {
        translate([x, 0, z])
        linear_extrude(height=cover_y + 1)
        rounded_square([spacer_x + 0.2, spacer_z + 0.2], r=cover_cutout_fillet);
        spacer_idx = spacer_idx + 1;
      }
    }
    // Jog cap recesses
    for (s = [-1, 1]) {
      translate([s * 80, 0, 0])
      cylinder(h=cover_y/2 + 1, d=cap_dia + 0.5, center=true);
    }
  }

  // Spacer Blocks (26 total)
  spacer_idx = 0;
  for (x = [-80, -40, 0, 40, 80], z = [-70, -40, -10, 20, 50, 80]) {
    if (!(x == 0 && z == 0) && abs(x) + abs(z) > 50 && spacer_idx < 26) {
      translate([assem_x/2 + x, base_y + cover_y + spacer_y/2, assem_z/2 + z])
      spacer_block();
      spacer_idx = spacer_idx + 1;
    }
  }

  // Jog Caps (2 mirrored)
  for (s = [-1, 1]) {
    translate([assem_x/2 + s*80, base_y + cover_y + cap_height/2, assem_z/2])
    jog_cap();
  }

  // Control Pins (11 total)
  pin_positions = [
    [-100, 10], [-60, 40], [-30, 70], [0, 40], [0, 80], [30, 60],
    [60, 90], [90, 50], [100, 20], [-70, -30], [70, -50]
  ];
  for (p = pin_positions) {
    translate([assem_x/2 + p[0], base_y + cover_y + pin_length/2, assem_z/2 + p[1]])
    control_pin();
  }

  // Socket Posts (8 total)
  socket_positions = [
    [-120, -90], [-120, 90], [-50, -100], [50, -100],
    [120, -90], [120, 90], [-50, 100], [50, 100]
  ];
  for (p = socket_positions) {
    translate([assem_x/2 + p[0], base_y + cover_y/2 + socket_height/2, assem_z/2 + p[1]])
    socket_post();
  }

  // Front Panel Flanged Bushings (6 total)
  for (i = [0:5]) {
    translate([assem_x/2 - 100 + i*30, base_y + cover_y/2, assem_z/2 - base_z/2])
    rotate([90, 0, 0])
    flanged_bushing();
  }

  // Central Crossfader Region (3-fold rotation)
  for (ang = [0, 120, 240]) {
    rotate(ang, [0, 1, 0])
    translate([assem_x/2, base_y + cover_y + wedge_height/2, assem_z/2])
    wedge_guide();

    rotate(ang + 60, [0, 1, 0])
    translate([assem_x/2, base_y + cover_y + bar_thickness/2, assem_z/2 + 10])
    structural_bar();

    rotate(ang + 30, [0, 1, 0])
    translate([assem_x/2 + 15, base_y + cover_y + locpin_total_height/2, assem_z/2])
    locating_pin();
  }

  // Ball Studs (2 mirrored)
  for (s = [-1, 1]) {
    translate([assem_x/2 + s*110, base_y + cover_y + ball_total_height/2, assem_z/2 + s*60])
    ball_stud();
  }
}