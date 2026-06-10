// Parameters
length = 0.75;
width = 0.714286;
height = 0.25;

// Upper through-opening parameters
hole_x = 0.375;
hole_y = 0.5357;
hole_r = 0.0893;

// Front side face removed features parameters
front_cut_x1 = 0.0893;
front_cut_x2 = 0.6607;
front_cut_r = 0.0491;
front_cut_depth = 0.1071;
// Z-axis derived from the circular band limits (0.0759 to 0.1741)
front_cut_z = (0.0759 + 0.1741) / 2; 

// Resolution and manifold tolerance
$fn = 100;
eps = 0.001;

// Reusable module for the main solid body
module main_body() {
    // Generates the overall bounding block for the stepped, line-profiled body
    // based on the provided overall maximum dimensions.
    cube([length, width, height]);
}

// Main model construction
difference() {
    // Base solid
    main_body();
    
    // Upper through-opening
    // Cuts completely through the Z-height of the main solid
    translate([hole_x, hole_y, -eps])
        cylinder(h=height + 2*eps, r=hole_r);
        
    // Left front circular removed feature
    // Blind cylindrical cut into the body from the front edge (Y=0)
    translate([front_cut_x1, -eps, front_cut_z])
        rotate([-90, 0, 0])
        cylinder(h=front_cut_depth + eps, r=front_cut_r);
        
    // Right front circular removed feature
    // Blind cylindrical cut into the body from the front edge (Y=0)
    translate([front_cut_x2, -eps, front_cut_z])
        rotate([-90, 0, 0])
        cylinder(h=front_cut_depth + eps, r=front_cut_r);
}