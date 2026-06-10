// --------------------------
// Global Parameters
// --------------------------
$fn = 100; // Smoothness for curved surfaces

// Base dimensions
base_length = 0.75;         // X-axis, left-right span
base_width = 0.21875;       // Y-axis, front-back span
base_declared_height = 0.28125; // Nominal max height
base_extrusion_depth = 0.2812;  // Actual extrusion height of base

// Cutout parameters
cut_radius = 0.0312;        // Radius of each circular cut
cut_depth = 0.0625;         // Depth of each cut
cut_z_start = 0.1081;       // Z position of cut bottom (above base datum)

// Cut positions (distance from left edge X=0, front edge Y=0)
cut1_x = 0.0717;
cut1_y = 0.0625;
cut2_x = 0.6692;
cut2_y = 0.0625;

// --------------------------
// Module: Arched Base
// Creates solid base with arched side profile, full footprint coverage
// --------------------------
module arched_base(length, width, height) {
  half_length = length / 2;
  // Calculate circle parameters for curved arch profile
  circle_center_z = (pow(height, 2) - pow(half_length, 2)) / (2 * height);
  arch_radius = height - circle_center_z;

  // Rotate 2D profile to X-Z plane, extrude along full Y width
  rotate([90, 0, 0]) linear_extrude(length = width, center = false) {
    intersection() {
      // Base circle for arch curve
      translate([half_length, circle_center_z]) circle(r = arch_radius);
      // Clip to valid base bounds (full X span, Z >= 0)
      square([length, height], center = false);
    }
  }
}

// --------------------------
// Main Model Assembly
// --------------------------
difference() {
  // Main base solid
  arched_base(base_length, base_width, base_extrusion_depth);

  // First independent circular cut
  translate([cut1_x, cut1_y, cut_z_start])
    cylinder(h = cut_depth, r = cut_radius, center = false);

  // Second independent circular cut
  translate([cut2_x, cut2_y, cut_z_start])
    cylinder(h = cut_depth, r = cut_radius, center = false);
}