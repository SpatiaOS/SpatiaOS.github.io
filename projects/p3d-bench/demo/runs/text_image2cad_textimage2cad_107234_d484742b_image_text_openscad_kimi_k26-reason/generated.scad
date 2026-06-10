// ==========================================
// Parametric Assembly: Wedge Fin with Hub Cap
// ==========================================

$fn = 80;

// --- Fin Plate ---
fin_length        = 22.0;
fin_thickness     = 1.5;
fin_top_left_y    = 5.5;
fin_top_right_y   = 1.5;
fin_tip_y         = 0.0;
fin_bottom_left_y = -5.5;
notch_radius      = 4.2;

// --- Hub Shells (rounded half-shells) ---
hub_nose_x = -4.5;
hub_nose_r = 3.0;
hub_body_x = -1.0;
hub_body_r = 4.0;

// --- Central Boss / Bearing Seat ---
boss_x        = -2.5;
boss_od       = 3.0;   // hole diameter in fin & shells
boss_tube_od  = 1.5;
boss_tube_id  = 0.8;
boss_length   = 10.0;

// --- Holes ---
hole_d          = 2.0;
hole_chamfer_d  = 3.0;
hole_chamfer_h  = 0.5;

top_hole_start_x = 6.0;
top_hole_start_y = 4.2;
top_hole_step_x  = 3.0;
top_hole_step_y  = 0.4;

lower_hole_x = 8.0;
lower_hole_y = -2.5;

tip_hole_x = 21.0;
tip_hole_y = 0.2;

// --- Wire Rings ---
ring_major_r = 1.5;
ring_minor_r = 0.3;

// ==========================================
// 2D Fin Profile
// ==========================================
module fin_profile_2d() {
  difference() {
    polygon([
      [0, fin_top_left_y],
      [fin_length, fin_top_right_y],
      [fin_length, fin_tip_y],
      [fin_length * 0.9, fin_tip_y - 0.5],
      [fin_length * 0.5, -4.0],
      [fin_length * 0.2, -5.0],
      [0, fin_bottom_left_y]
    ]);
    // Concave arc cutout on left edge to clear hub cap
    circle(r = notch_radius);
  }
}

// ==========================================
// Chamfered Hole Cutter (45° countersink)
// ==========================================
module chamfered_cutter(d, h, cd, ch) {
  union() {
    cylinder(h = h, d = d, center = true);
    // top chamfer
    translate([0, 0, h/2 - ch/2])
      cylinder(h = ch + 0.02, d1 = d, d2 = cd, center = true);
    // bottom chamfer
    translate([0, 0, -h/2 + ch/2])
      cylinder(h = ch + 0.02, d1 = cd, d2 = d, center = true);
  }
}

// ==========================================
// Fin Plate (with holes and hub clearance)
// ==========================================
module fin_plate() {
  difference() {
    linear_extrude(height = fin_thickness, center = true)
      fin_profile_2d();

    // Boss hole through hub region
    translate([boss_x, 0, 0])
      cylinder(h = fin_thickness + 2, d = boss_od, center = true);

    // Five top-ridge holes
    for (i = [0 : 4]) {
      x = top_hole_start_x + i * top_hole_step_x;
      y = top_hole_start_y - i * top_hole_step_y;
      translate([x, y, 0])
        chamfered_cutter(hole_d, fin_thickness + 1, hole_chamfer_d, hole_chamfer_h);
    }

    // Lower hole for wire ring
    translate([lower_hole_x, lower_hole_y, 0])
      chamfered_cutter(hole_d, fin_thickness + 1, hole_chamfer_d, hole_chamfer_h);

    // Tip hole for wire ring
    translate([tip_hole_x, tip_hole_y, 0])
      chamfered_cutter(hole_d, fin_thickness + 1, hole_chamfer_d, hole_chamfer_h);
  }
}

// ==========================================
// Hub Half-Shell (front or back)
// ==========================================
module hub_shell(sign) {
  // sign = +1 for front (z+), -1 for back (z-)
  difference() {
    intersection() {
      hull() {
        translate([hub_nose_x, 0, 0]) sphere(r = hub_nose_r);
        translate([hub_body_x, 0, 0]) sphere(r = hub_body_r);
      }
      translate([-10, -10, sign * (fin_thickness/2 + 0.001)])
        cube([20, 20, 10]);
    }
    // Clearance for central boss
    translate([boss_x, 0, 0])
      cylinder(h = 20, d = boss_od, center = true);
  }
}

// ==========================================
// Central Cylindrical Boss (bearing seat)
// ==========================================
module boss() {
  difference() {
    union() {
      // Main tube
      cylinder(h = boss_length, r = boss_tube_od, center = true);
      // Visible front flange
      translate([0, 0, fin_thickness/2 + 1.5])
        cylinder(h = 1.0, r = boss_tube_od + 0.8, center = true);
    }
    // Bore
    cylinder(h = boss_length + 2, r = boss_tube_id, center = true);
  }
}

// ==========================================
// Small Wire Ring (torus)
// ==========================================
module wire_ring() {
  rotate([0, 90, 0])
    rotate_extrude($fn = 40)
      translate([ring_major_r, 0])
        circle(r = ring_minor_r);
}

// ==========================================
// Assembly
// ==========================================
union() {
  // Main structural fin
  fin_plate();

  // Hub cap half-shells on front & back faces
  hub_shell(+1);
  hub_shell(-1);

  // Central boss at hub centre
  translate([boss_x, 0, 0])
    boss();

  // Wire ring on lower hole
  translate([
    lower_hole_x,
    lower_hole_y - (ring_major_r + ring_minor_r),
    0
  ]) wire_ring();

  // Wire ring at pointed tip
  translate([
    tip_hole_x,
    tip_hole_y - (ring_major_r + ring_minor_r),
    0
  ]) wire_ring();
}