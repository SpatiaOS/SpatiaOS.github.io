// Parameters (all dimensions in mm)
base_width = 80;
base_depth = 80;
base_height = 60;
platform_width = 100;
platform_depth = 100;
platform_height = 5;
bowl_lower_d = 80;
bowl_upper_d = 100;
bowl_height = 60;
rim_width = 5;
rim_thickness = 2;
post_d = 20;
post_height = 80;
lever_length = 80;
lever_width = 10;
lever_height = 5;
knob_d = 15;
bolt_d = 10;
button_d = 10;
button_height = 5;
label_text = "Fusion 360";
label_size = 10;

$fn = 100; // Smooth curves for cylinders/spheres

// Module: Base (lower square prism + top platform with bowl cutout)
module base() {
    // Lower base: solid square prism
    cube([base_width, base_depth, base_height], center=true);
    
    // Top platform: square with circular cutout for bowl rim
    difference() {
        cube([platform_width, platform_depth, platform_height], center=true);
        // Cutout for bowl rim (outer diameter = bowl_upper_d + 2*rim_width)
        cylinder(h=platform_height + 1, d=bowl_upper_d + 2*rim_width, center=true);
    }
}

// Module: Bowl (frustum with rim)
module bowl() {
    // Frustum (truncated cone) - hollow interior
    difference() {
        // Outer bowl
        cylinder(h=bowl_height, d1=bowl_lower_d, d2=bowl_upper_d, center=true);
        // Inner bowl (to create hollow space)
        translate([0, 0, -1])
        cylinder(h=bowl_height + 2, d1=bowl_lower_d - 4, d2=bowl_upper_d - 4, center=true);
    }
    
    // Rim around the bowl (ring)
    translate([0, 0, bowl_height/2])
    difference() {
        // Outer rim
        cylinder(h=rim_thickness, d=bowl_upper_d + 2*rim_width, center=true);
        // Inner rim (cutout)
        cylinder(h=rim_thickness + 1, d=bowl_upper_d, center=true);
    }
}

// Module: Central post (cylinder)
module central_post() {
    cylinder(h=post_height, d=post_d, center=true);
}

// Module: Lever (bar + knob + bolt)
module lever() {
    // Rectangular bar
    cube([lever_length, lever_width, lever_height], center=true);
    
    // Knob (sphere) at the lever's end
    translate([lever_length/2, 0, lever_height/2])
    sphere(d=knob_d);
    
    // Bolt (hexagon) on top of the knob
    translate([lever_length/2, 0, lever_height/2 + knob_d/2])
    cylinder(h=3, d=bolt_d, $fn=6); // Hexagon bolt
}

// Module: Button (small cylinder on base)
module button() {
    // Position on the front face of the base
    translate([-base_width/2 + 10, 0, -base_height/2 + 10])
    cylinder(h=button_height, d=button_d, center=true);
}

// Module: Label (extruded text on base)
module label() {
    // Extrude text on the front face of the base
    translate([0, 0, base_height/2 + 1])
    linear_extrude(height=1)
    text(label_text, size=label_size, halign="center", valign="center");
}

// Module: Main model (combines all parts)
module main_model() {
    // Base
    base();
    
    // Bowl (on top of platform)
    translate([0, 0, base_height/2 + platform_height + bowl_height/2])
    bowl();
    
    // Central post (inside bowl)
    translate([0, 0, base_height/2 + platform_height + post_height/2])
    central_post();
    
    // Lever (attached to post, at post's top)
    translate([0, 0, base_height/2 + platform_height + post_height - lever_height/2])
    lever();
    
    // Button
    button();
    
    // Label
    label();
}

// Render the main model
main_model();