// Global Configuration
$fn = 64;
fillet_r = 2;
cutout_tilt_angle = 30;

// Core Dimensions
leg_size = 25;
leg_height = 100;
leg_concave_radius = 138;
seat_width = 110;
seat_depth = 100;
seat_thickness = 15;
backrest_height = 215;
backrest_thickness = 15;

// ------------------------------
// Module: Waisted Leg (column/column_spacer)
// ------------------------------
module waisted_leg() {
  difference() {
    // Base leg solid
    cube([leg_size, leg_size, leg_height], center=false);
    
    // Create concave waisted profile on 4 sides
    translate([leg_size/2, -leg_concave_radius + leg_size/2, leg_height/2])
      rotate([90, 0, 0])
      cylinder(h=leg_size + 2, r=leg_concave_radius, center=true);
    translate([leg_size/2, leg_concave_radius + leg_size/2, leg_height/2])
      rotate([90, 0, 0])
      cylinder(h=leg_size + 2, r=leg_concave_radius, center=true);
    translate([-leg_concave_radius + leg_size/2, leg_size/2, leg_height/2])
      rotate([90, 90, 0])
      cylinder(h=leg_size + 2, r=leg_concave_radius, center=true);
    translate([leg_concave_radius + leg_size/2, leg_size/2, leg_height/2])
      rotate([90, 90, 0])
      cylinder(h=leg_size + 2, r=leg_concave_radius, center=true);

    // Round vertical edges
    for (x = [0, leg_size], y = [0, leg_size]) {
      translate([x, y, 0])
        cylinder(h=leg_height, r=fillet_r, center=false);
    }

    // Top/bottom end chamfers
    translate([-1, -1, -1])
      linear_extrude(height=4)
      offset(r=-3)
      square([leg_size + 2, leg_size + 2], center=false);
    translate([-1, -1, leg_height - 3])
      linear_extrude(height=4)
      offset(r=-3)
      square([leg_size + 2, leg_size + 2], center=false);
  }
}

// ------------------------------
// Module: Decorative Bracket (seat + backrest)
// ------------------------------
module decorative_bracket() {
  union() {
    // Seat assembly
    union() {
      // Main seat platform
      cube([seat_width, seat_depth, seat_thickness], center=false);
      // Rounded front arc (R=50 per spec)
      translate([seat_width/2, seat_depth, seat_thickness/2])
        rotate([90, 0, 90])
        cylinder(h=seat_thickness, r=50, center=true);
      // Side curved detail (R=20 per spec)
      translate([seat_width, seat_depth - 40, seat_thickness/2])
        rotate([90, 0, 0])
        cylinder(h=seat_thickness, r=30, center=true);
    }

    // Backrest assembly
    translate([0, seat_depth, 0])
    difference() {
      // Base pointed leaf profile
      linear_extrude(height=backrest_thickness, center=false)
      difference() {
        polygon(points=[
          [0, 0],
          [seat_width, 0],
          [seat_width, backrest_height],
          [seat_width/2, backrest_height + 20],
          [0, backrest_height]
        ]);
        // Curved front edge contour
        translate([seat_width, 0])
          circle(r=backrest_height - 15);
      }

      // Central diamond cutout (tilted 30deg per spec)
      translate([seat_width/2, backrest_height/2, -1])
        rotate([0, 0, cutout_tilt_angle])
        linear_extrude(height=backrest_thickness + 2, center=true)
        square([18, 18], center=true);

      // Four surrounding curved cutouts
      for (angle = [0, 90, 180, 270]) {
        rotate(angle)
        translate([seat_width/2 + 15, backrest_height/2, -1])
          rotate([0, 0, 45])
          linear_extrude(height=backrest_thickness + 2)
          circle(r=7.5);
      }
    }

    // Seat top recessed cutouts
    for (pos = [[28, 30], [55, 58], [82, 30]]) {
      translate([pos[0], pos[1], seat_thickness - 2])
        rotate([0, 0, cutout_tilt_angle])
        linear_extrude(height=3, center=true)
        square([18, 18], center=true);
    }
  }
}

// ------------------------------
// Main Assembly
// ------------------------------
union() {
  // Place 4 legs at seat corners
  translate([5, 5, 0]) waisted_leg();
  translate([seat_width - leg_size - 5, 5, 0]) waisted_leg();
  translate([5, seat_depth - leg_size - 5, 0]) waisted_leg();
  translate([seat_width - leg_size - 5, seat_depth - leg_size - 5, 0]) waisted_leg();

  // Place seat + backrest on top of legs
  translate([0, 0, leg_height]) decorative_bracket();
}