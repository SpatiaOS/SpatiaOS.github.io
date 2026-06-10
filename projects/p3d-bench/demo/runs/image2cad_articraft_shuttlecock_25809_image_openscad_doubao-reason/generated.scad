// --------------------------
// Parametric Conical Strainer (Optimized for fast export)
// --------------------------
// Global resolution setting (lowered for faster computation, still smooth enough)
$fn = 48;

// Core dimensions
overall_length = 120;       // Total length of strainer
small_end_dia = 60;         // Diameter of closed hemispherical end
large_end_dia = 100;        // Diameter of open scalloped end
wall_thickness = 1.2;       // Wall thickness of main body
num_panels = 8;             // Number of perforated panel segments

// Feature dimensions
rim_width = 5;              // Width of closed end reinforcing rim
rim_thickness = 2;          // Thickness of closed end rim
long_rib_width = 3;         // Width of longitudinal panel-separating ribs
long_rib_height = 1.5;      // Height of longitudinal ribs above wall
diag_rib_width = 2;         // Width of diagonal cross-panel ribs
diag_rib_height = 1;        // Height of diagonal ribs above wall
hole_diameter = 3;          // Diameter of circular perforations
slot_width = 2;             // Width of rectangular slot perforations
slot_short_len = 6;         // Length of short slots
slot_long_len = 12;         // Length of long slots
scallop_radius = 11;        // Radius of scalloped lobes at open end

// Calculated values
panel_angle = 360 / num_panels;
frustum_length = overall_length - small_end_dia/2;
small_r = small_end_dia / 2;
large_r = large_end_dia / 2;
slope = (large_r - small_r) / frustum_length; // Radius increase per mm length


// --------------------------
// Helper Module: Single panel perforation cutters
// --------------------------
module panel_perforations() {
    rotate([0,0, panel_angle/2])
    for (z = [20 : 25 : frustum_length - 15]) {
        current_r = small_r + z * slope;
        // Cut round holes (reduced count for speed)
        for (i = [1:4]) {
            angle = i * (panel_angle / 7);
            translate([
                current_r * cos(angle),
                current_r * sin(angle),
                z + 4 * i
            ]) cylinder(h=wall_thickness + 1, d=hole_diameter, center=true);
        }
        // Cut long slots (reduced count for speed)
        for (i = [1:3]) {
            angle = -i * (panel_angle / 7);
            translate([
                current_r * cos(angle),
                current_r * sin(angle),
                z + 3 * i
            ]) rotate([0,0, 45]) linear_extrude(height=wall_thickness + 1, center=true)
                square([slot_long_len, slot_width], center=true);
        }
        // Cut short slots (reduced count for speed)
        for (i = [1:3]) {
            angle = -i * (panel_angle / 7) - 6;
            translate([
                current_r * cos(angle),
                current_r * sin(angle),
                z + 2 * i + 15
            ]) rotate([0,0, 30]) linear_extrude(height=wall_thickness + 1, center=true)
                square([slot_short_len, slot_width], center=true);
        }
    }
}

// --------------------------
// Helper Module: Longitudinal separating ribs (no slow hull operations)
// --------------------------
module longitudinal_ribs() {
    for (a = [0 : panel_angle : 359.9]) {
        rotate([0, 0, a])
        rotate([atan(slope), 0, 0])
        translate([small_r + long_rib_height/2, 0, frustum_length/2])
        cube([long_rib_height, long_rib_width, frustum_length], center=true);
    }
}

// --------------------------
// Helper Module: Diagonal cross-panel ribs (no slow hull operations)
// --------------------------
module diagonal_ribs() {
    for (a = [0 : panel_angle : 359.9]) {
        rotate([0,0, a + panel_angle/2])
        for (offset = [0, 30, 60]) {
            z_start = offset;
            z_end = offset + 40;
            r_start = small_r + z_start * slope;
            r_end = small_r + z_end * slope;
            mid_z = (z_start + z_end)/2;
            mid_r = (r_start + r_end)/2;
            length = sqrt(pow(r_end - r_start, 2) + pow(z_end - z_start, 2));
            
            translate([mid_r + diag_rib_height/2, 0.2*mid_z, mid_z])
            rotate([atan(slope), 0, 25])
            cube([diag_rib_height, diag_rib_width, length], center=true);
        }
    }
}

// --------------------------
// Helper Module: Scallop open end profile
// --------------------------
module scallop_cutters() {
    translate([0,0,-1])
    for (a = [0 : panel_angle : 359.9]) {
        rotate([0,0, a + panel_angle/2])
        translate([large_r, 0, 0])
        cylinder(h=wall_thickness + 3, r=scallop_radius, center=true);
    }
}

// --------------------------
// Main Model Assembly (optimized boolean operations)
// --------------------------
union() {
    // Main hollow shell body
    difference() {
        // Outer solid shape
        union() {
            // Frustum main body
            cylinder(h=frustum_length, r1=small_r, r2=large_r, center=false);
            // Hemispherical closed end
            translate([0, 0, frustum_length]) sphere(r=small_r);
            // Closed end reinforcing rim
            translate([0,0, frustum_length - rim_width])
            cylinder(h=rim_width, r=small_r + rim_thickness, center=false);
        }
        
        // All cut operations grouped into single union for faster boolean
        union() {
            // Hollow out inner volume
            translate([0,0, wall_thickness]) union() {
                cylinder(h=frustum_length + 1, r1=small_r - wall_thickness, r2=large_r - wall_thickness, center=false);
                translate([0, 0, frustum_length]) sphere(r=small_r - wall_thickness);
            }
            
            // Cut perforations in all panels
            for (a = [0 : panel_angle : 359.9]) {
                rotate([0,0,a]) panel_perforations();
            }
            
            // Cut scalloped profile on open end
            scallop_cutters();
        }
    }
    
    // Add reinforcing ribs
    longitudinal_ribs();
    diagonal_ribs();
}