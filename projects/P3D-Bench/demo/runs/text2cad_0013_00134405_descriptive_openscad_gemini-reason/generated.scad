// ============================================================================
// Parametric Circular Ribbed Flange with Stepped Relief
// ============================================================================
// Description:
// A flat circular annular rim with an open center, a concentric hollow collar, 
// and solid radial ribs connecting them. The spaces between the ribs are 
// rounded slot-like windows. The components use different thickness tiers 
// to create stepped faces and underside relief.
// ============================================================================

// --- Parameters ---

// Outer Rim Dimensions
outer_rim_od = 120;        // Outer diameter of the main rim
outer_rim_id = 90;         // Inner diameter of the main rim
outer_rim_thickness = 15;  // Thickness (depth) of the main rim

// Center Collar Dimensions
collar_od = 40;            // Outer diameter of the central collar
collar_id = 20;            // Inner diameter (open center) of the collar
collar_thickness = 12;     // Thickness of the collar (shallower than outer rim)

// Radial Ribs & Windows Dimensions
rib_count = 5;             // Number of radial ribs connecting collar to rim
rib_width = 8;             // Width of each solid rib
rib_thickness = 6;         // Thickness of the rib web (shallower than collar)
corner_radius = 3;         // Fillet radius for the rounded slot-like windows

// Resolution
$fn = 100;                 // Global facet resolution for smooth curves


// --- Modules ---

// 1. Main Outer Rim
module outer_rim() {
    difference() {
        cylinder(h=outer_rim_thickness, d=outer_rim_od, center=true);
        // Subtract inner area to create the annular ring
        cylinder(h=outer_rim_thickness + 1, d=outer_rim_id, center=true);
    }
}

// 2. Central Hollow Collar
module collar() {
    difference() {
        cylinder(h=collar_thickness, d=collar_od, center=true);
        // Subtract inner area to create the open center
        cylinder(h=collar_thickness + 1, d=collar_id, center=true);
    }
}

// 3. 2D Profile for the Rounded Windows (Negative Space)
module rounded_windows_2d() {
    // Shrinking and then expanding a 2D shape rounds its convex corners.
    // For our subtracted windows, this creates perfect concave fillets 
    // where the ribs meet the outer rim and the collar.
    offset(r=corner_radius)
    offset(r=-corner_radius)
    difference() {
        // Base window area (annulus between collar and outer rim)
        circle(d=outer_rim_id);
        circle(d=collar_od);
        
        // Subtract the ribs to form individual sector-like windows
        for (i = [0 : rib_count - 1]) {
            rotate([0, 0, i * 360 / rib_count])
                // Translate so the rib extends outward from the center
                translate([outer_rim_od / 2, 0])
                    square([outer_rim_od, rib_width], center=true);
        }
    }
}

// 4. Rib Web Assembly
module rib_web() {
    // Extrude the 2D web profile into 3D
    linear_extrude(height=rib_thickness, center=true) {
        difference() {
            // Base solid disc. We make it slightly larger than the open 
            // space to overlap with the collar and rim. This ensures a 
            // perfectly manifold 3D union without zero-thickness walls.
            circle(d=outer_rim_id + 1);
            circle(d=collar_od - 1);
            
            // Subtract the rounded windows to leave only the filleted ribs
            rounded_windows_2d();
        }
    }
}


// --- Main Assembly ---

// Combine all parts. Because they use center=true and have varying 
// thicknesses (15, 12, 6), they naturally form stepped faces on both 
// the top and the underside, providing the required underside relief.
union() {
    color("steelblue") outer_rim();
    color("lightblue") collar();
    color("skyblue")   rib_web();
}