// Harman Kardon Pebble Speaker Reconstruction
// Fixed syntax error: Removed invalid geometry assignment to variable.
// Reorganized modules for clarity and correct stacking.

$fn = 64; // Smoothness for curved surfaces

// ==========================================
// Parameters
// ==========================================

// Base Cover Dimensions
base_length = 304;
base_width = 160;
base_height = 72;

// Housing Cover (Top) Dimensions
top_length = 227;
top_width = 120;
top_height = 50;

// Cover Plate (Middle Ring) Dimensions
plate_length = 242;
plate_width = 127;
plate_thickness = 6;

// Control Panel Details
panel_recess_depth = 3;
panel_oval_l = 100;
panel_oval_w = 50;

// ==========================================
// Modules
// ==========================================

// Base Cover Module
// Creates the bottom dome.
module base_cover() {
    color([0.8, 0.8, 0.8])
    difference() {
        // Main body: Bottom half of the ellipsoid
        // We create a full ellipsoid of height 2*base_height, then cut the top half off.
        // Sphere r=base_height. Resize Z to 2*base_height.
        intersection() {
            resize([base_length, base_width, base_height * 2]) sphere(r = base_height);
            // Keep Z < 0 (relative to sphere center)
            // Sphere center is 0,0,0. Z ranges from -base_height to +base_height.
            // We want the bottom part.
            translate([0, 0, -base_height / 2]) 
                cube([base_length + 20, base_width + 20, base_height], center = true);
        }
        
        // Flatten the very bottom to ensure it sits flat on Z=0 plane after translation
        // The intersection above creates a flat cut at Z = -base_height (relative to center).
        // Wait, the cube center is -base_height/2. 
        // Cube extends from -base_height/2 - base_height/2 = -base_height 
        // to -base_height/2 + base_height/2 = 0.
        // So the bottom is flat at Z = -base_height.
        // This is good.
    }
    
    // Add the small circular boss on the top deck (Z=0 relative to module)
    // Description: "4 cylindrical faces at a radius of 6.0 mm"
    // Positioned slightly off-center or centered? Description implies "small circular boss".
    // Let's place it near the front/center.
    translate([0, 20, 0]) 
        cylinder(r = 6, h = 4, $fn = 32);
}

// Cover Plate Module
// Thin oval disc.
module cover_plate() {
    color([0.75, 0.75, 0.75])
    linear_extrude(height = plate_thickness)
        resize([plate_length, plate_width])
            circle(r = plate_width / 2);
}

// Housing Cover Module
// Top dome with control panel.
module housing_cover() {
    color([0.85, 0.85, 0.85])
    difference() {
        // Main body: Top cap of the smaller ellipsoid
        // Sphere r=top_height. Resize Z to 2*top_height.
        intersection() {
            resize([top_length, top_width, top_height * 2]) sphere(r = top_height);
            // Keep Z > 0 (relative to sphere center)
            // Cube center at top_height/2. Extends from 0 to top_height.
            translate([0, 0, top_height / 2])
                cube([top_length + 20, top_width + 20, top_height], center = true);
        }
        
        // Control Panel Recess
        // Located on the top surface (Z = top_height).
        translate([0, 0, top_height - panel_recess_depth])
            linear_extrude(height = panel_recess_depth + 2) // Cut slightly deeper
                resize([panel_oval_l, panel_oval_w])
                    circle(r = panel_oval_w / 2);
    }
    
    // Control Panel Details
    // Placed inside the recess.
    // Recess bottom is at Z = top_height - panel_recess_depth.
    translate([0, 0, top_height - panel_recess_depth]) {
        
        // 5 Dots (LEDs) in an arc at the top of the panel
        // Arc radius approx 15, centered at y=15
        for (i = [-2 : 1 : 2]) {
            // Calculate position on arc
            angle = i * 15; // degrees
            px = sin(angle) * 20;
            py = 15 + (1 - cos(angle)) * 5; // slight curve
            translate([px, py, 0.5])
                cylinder(r = 1.5, h = 1, $fn = 16);
        }
        
        // Bluetooth Symbol (Center)
        // Using text for simplicity
        translate([0, 0, 0.5])
            linear_extrude(height = 1)
                text("B", size = 14, halign = "center", valign = "center", font = "Arial:style=Bold");
        
        // Volume Controls and Power at the bottom
        // Minus
        translate([-25, -15, 0.5])
            linear_extrude(height = 1)
                text("-", size = 14, halign = "center", valign = "center", font = "Arial:style=Bold");
        
        // Power (Circle with line)
        translate([0, -15, 0.5]) {
            // Circle
            difference() {
                circle(r = 5);
                translate([0, 0, 1]) square([3, 10], center=true); // Cut line? No, add line.
            }
            // Actually, let's just use text "O" or a simplified shape
            // Power symbol: Circle with vertical line at top.
            difference() {
                circle(r=5);
                translate([0, 2.5, 0.1]) square([2, 6], center=true);
            }
            // Vertical line
            translate([0, 5, 0.1]) square([1.5, 4], center=true);
        }
        
        // Plus
        translate([25, -15, 0.5])
            linear_extrude(height = 1)
                text("+", size = 14, halign = "center", valign = "center", font = "Arial:style=Bold");
    }
    
    // Harman Kardon Logo on the side
    // Positioned on the curved side surface.
    // Y = top_width / 2.
    // Z = mid-height.
    // Rotate to face outwards (tangent to surface).
    translate([0, top_width / 2 - 1, top_height / 2])
        rotate([90, 0, 0]) // Rotate 90 deg around X to stand up
            linear_extrude(height = 1.5)
                text("harman/kardon", size = 9, halign = "center", valign = "center", font = "Arial:style=Bold");
}

// ==========================================
// Assembly
// ==========================================

union() {
    // 1. Base Cover (Bottom)
    // Place so bottom is at Z=0
    translate([0, 0, 0]) 
        base_cover();
    
    // 2. Cover Plate (Middle)
    // Sits on top of base (Z = base_height)
    translate([0, 0, base_height]) 
        cover_plate();
    
    // 3. Housing Cover (Top)
    // Sits on top of plate (Z = base_height + plate_thickness)
    translate([0, 0, base_height + plate_thickness]) 
        housing_cover();
}