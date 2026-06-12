// Parameters
base_length = 120;
base_width = 50;
base_thickness = 5;

rib_width = 4;
rib_height = 4;
rib_spacing = 26;

cbore_diameter = 12;
cbore_depth = 2.5;
through_diameter = 6;

hole_inset = 15;
hole_spread = 12;

$fn = 100;

// Main Model
difference() {
    // Additive features: Base plate and raised ribs
    union() {
        // Main rectangular base plate
        translate([0, 0, base_thickness / 2])
            cube([base_length, base_width, base_thickness], center=true);
        
        // Front lengthwise rib
        translate([0, rib_spacing / 2, base_thickness + (rib_height / 2)])
            cube([base_length, rib_width, rib_height], center=true);
            
        // Back lengthwise rib
        translate([0, -rib_spacing / 2, base_thickness + (rib_height / 2)])
            cube([base_length, rib_width, rib_height], center=true);
    }
    
    // Subtractive features: Three stepped circular openings near the ends
    // Hole 1: Single hole centered at the left end
    stepped_hole(-(base_length / 2) + hole_inset, 0);
    
    // Hole 2: Offset hole at the right end (front)
    stepped_hole((base_length / 2) - hole_inset, hole_spread);
    
    // Hole 3: Offset hole at the right end (back)
    stepped_hole((base_length / 2) - hole_inset, -hole_spread);
}

// Helper module for a stepped circular cut (counterbored hole)
module stepped_hole(x, y) {
    translate([x, y, 0]) {
        // Shallow upper recess (cuts through top face and any intersecting ribs)
        translate([0, 0, base_thickness - cbore_depth])
            cylinder(h=cbore_depth + rib_height + 1, d=cbore_diameter, center=false);
            
        // Deeper aligned opening (cuts entirely through the lower base)
        translate([0, 0, -1])
            cylinder(h=base_thickness + 2, d=through_diameter, center=false);
    }
}