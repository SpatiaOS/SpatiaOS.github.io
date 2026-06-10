// Parameters
base_length = 0.75;
base_width = 0.45;
base_thickness = 0.05625;
main_depth = 0.0562;

r_outer = 0.225;
r_mid_outer = 0.1875;
r_inner_outer = 0.0937;
r_inner = 0.0562;

h_collar_outer = 0.1687;
h_collar_inner = 0.0937;
h_solid_center = 0.075;

$fn = 100;

// Base footprint module
module slot_base(l, w, h) {
    linear_extrude(height=h) {
        hull() {
            translate([(l - w) / 2, 0]) circle(d=w);
            translate([-(l - w) / 2, 0]) circle(d=w);
        }
    }
}

// Hollow annular collar module
module annulus(r_out, r_in, h) {
    difference() {
        cylinder(h=h, r=r_out, center=false);
        cylinder(h=h + 0.01, r=r_in, center=false);
    }
}

// Main assembly module
module model() {
    // Base plate
    slot_base(base_length, base_width, base_thickness);

    // Shoulder datum Z
    shoulder_z = base_thickness;

    // Coaxial outer annular collar
    translate([0, 0, shoulder_z])
        annulus(r_outer, r_mid_outer, h_collar_outer);

    // Smaller coaxial annular section
    translate([0, 0, shoulder_z])
        annulus(r_inner_outer, r_inner, h_collar_inner);

    // Innermost solid circular section
    translate([0, 0, shoulder_z])
        cylinder(h=h_solid_center, r=r_inner, center=false);
}

// Render
model();