// ============================================
// Parametric Tapered Strainer Basket / Filter Component
// Features: Scalloped rim, tapered body, domed end, perforated surface with ribs
// ============================================

// --------------------------------------------
// DIMENSIONAL PARAMETERS (all in mm)
// --------------------------------------------
large_dia      = 85;       // Diameter of open (scallop) end
small_dia      = 52;       // Diameter at closed end
total_length   = 105;      // Total length including dome
wall_thick     = 2.0;      // Wall thickness
num_lobes      = 8;        // Number of scallops on rim
lobe_depth     = 10;       // Depth of each scallop indentation
dome_radius    = 26;       // Radius of hemispherical end cap
rib_width      = 3.0;      // Width of structural ribs
num_ribs       = 8;        // Number of longitudinal ribs

// Perforation parameters
slot_length    = 8;        // Length of rectangular slots
slot_width     = 1.5;      // Width of rectangular slots
hole_dia       = 4.0;      // Diameter of circular holes
diag_slot_len  = 6;        // Length of diagonal accent slots
diag_slot_wid  = 0.8;      // Width of diagonal slots

// Resolution
$fn            = 120;      // Global fragment count for smooth curves

// --------------------------------------------
// HELPER MODULES
// --------------------------------------------

// Module: Scalloped Rim Profile
// Creates the flower-petal shaped opening
module scalloped_profile(outer_r, inner_r, num_petals, depth) {
    // Create points for a star-like shape with rounded petals
    points = [];
    angles = [for (i = [0:num_petals*2-1]) i * 180 / num_petals];
    
    for (i = [0:len(angles)-1]) {
        r = (i % 2 == 0) ? outer_r : (outer_r - depth);
        a = angles[i];
        points = concat(points, [[r * cos(a), r * sin(a)]]);
    }
    
    polygon(points);
}

// Module: Single Rib (longitudinal structural member)
module longitudinal_rib(length, top_r, bot_r, width, angle) {
    rotate([0, 0, angle])
    translate([top_r - wall_thick/2, 0, 0])
    rotate([90, 0, 0])
    linear_extrude(height=width, center=true)
    polygon(points=[
        [0, 0],
        [length, (top_r - bot_r)],  // Taper follows cone slope
        [length + 2, (top_r - bot_r)],
        [2, 0]
    ]);
}

// Module: Panel with rectangular slots
module slotted_panel(start_z, end_z, radius_at_start, radius_at_end, panel_angle_span, rotation, num_slots_x, num_slots_y) {
    rotate([0, 0, rotation])
    for (iy = [0:num_slots_y-1]) {
        // Interpolate radius and z position along the taper
        t = iy / max(1, num_slots_y - 1);
        current_z = start_z + t * (end_z - start_z);
        current_r = radius_at_start + t * (radius_at_end - radius_at_start);
        
        for (ix = [0:num_slots_x-1]) {
            // Position slots radially outward on the surface
            angle_offset = (ix - (num_slots_x-1)/2) * (panel_angle_span / (num_slots_x + 1));
            
            translate([
                current_r * cos(angle_offset),
                current_r * sin(angle_offset),
                current_z
            ])
            // Orient slot normal to surface (approximate for cone)
            rotate([0, 0, angle_offset + 90])
            rotate([90, 0, 0])
            cube([slot_length, slot_width, wall_thick + 1], center=true);
        }
    }
}

// Module: Panel with circular holes
module holed_panel(start_z, end_z, radius_at_start, radius_at_end, panel_angle_span, rotation, num_holes_x, num_holes_y) {
    rotate([0, 0, rotation])
    for (iy = [0:num_holes_y-1]) {
        t = iy / max(1, num_holes_y - 1);
        current_z = start_z + t * (end_z - start_z);
        current_r = radius_at_start + t * (radius_at_end - radius_at_start);
        
        for (ix = [0:num_holes_x-1]) {
            angle_offset = (ix - (num_holes_x-1)/2) * (panel_angle_span / (num_holes_x + 1));
            
            translate([
                current_r * cos(angle_offset),
                current_r * sin(angle_offset),
                current_z
            ])
            rotate([0, 0, angle_offset])
            rotate([90, 0, 0])
            cylinder(h=wall_thick+2, d=hole_dia, center=true);
        }
    }
}

// Module: Diagonal accent lines/slots
module diagonal_pattern(start_z, end_z, radius_at_start, radius_at_end, panel_center_angle, span, density) {
    rotate([0, 0, panel_center_angle])
    for (i = [0:density-1]) {
        t = i / max(1, density - 1);
        z_pos = start_z + t * (end_z - start_z);
        r_pos = radius_at_start + t * (radius_at_end - radius_at_start);
        
        // Alternate left/right offset for diagonal appearance
        offset = (i % 2 == 0) ? span/4 : -span/4;
        
        translate([r_pos * cos(offset), r_pos * sin(offset), z_pos])
        rotate([0, 0, offset + 45])  // 45 degree angle
        rotate([90, 0, 0])
        cube([diag_slot_len, diag_slot_wid, wall_thick + 1], center=true);
    }
}

// --------------------------------------------
// MAIN BODY CONSTRUCTION
// --------------------------------------------

module main_assembly() {
    difference() {
        union() {
            // 1. Main tapered shell (solid)
            // Using hull of two circles to create smooth taper
            rotate_extrude($fn=num_lobes * 20)
            polygon(points=[
                [small_dia/2, 0],                              // Bottom center
                [small_dia/2, total_length - dome_radius],    // Start of dome transition
                [large_dia/2 - lobe_depth, total_length],     // Inner scallop base
                [large_dia/2, total_length],                  // Outer scallop tip
                [large_dia/2 - wall_thick, total_length - 1], // Inner wall top
                [small_dia/2 - wall_thick, 0]                 // Inner wall bottom
            ]);
            
            // 2. Domed end cap (hemisphere)
            translate([0, 0, 0])
            difference() {
                sphere(r=dome_radius);
                sphere(r=dome_radius - wall_thick);
                translate([0, 0, -dome_radius])
                cube([dome_radius*2, dome_radius*2, dome_radius*2], center=true);  // Keep only bottom half
            }
            
            // 3. Scalloped rim reinforcement (thicker edge)
            linear_extrude(height=wall_thick * 1.5, scale=0.9)
            difference() {
                circle(d=large_dia);
                scalloped_profile(large_dia/2 - wall_thick, large_dia/2 - lobe_depth - wall_thick, num_lobes, lobe_depth);
            }
            
            // 4. Structural Ribs (longitudinal)
            for (i = [0:num_ribs-1]) {
                angle = i * 360 / num_ribs;
                rib_top_r = large_dia/2 - wall_thick;
                rib_bot_r = small_dia/2 - wall_thick + 2;
                
                // Create rib as thin wall section following the taper
                rotate([0, 0, angle])
                translate([0, 0, 0])
                linear_extrude(height=total_length - dome_radius, scale=(rib_bot_r/rib_top_r))
                translate([rib_top_r - rib_width/2, 0, 0])
                square([rib_width, wall_thick], center=true);
            }
        }
        
        // ----------------------------------------
        // SUBTRACTIONS (Perforations)
        // ----------------------------------------
        
        // Inner hollow cavity (make it a shell)
        rotate_extrude($fn=num_lobes * 20)
        polygon(points=[
            [small_dia/2 - wall_thick - 0.1, 0.1],
            [small_dia/2 - wall_thick - 0.1, total_length - dome_radius],
            [large_dia/2 - lobe_depth - wall_thick - 0.1, total_length - 0.1]
        ]);
        
        // Hollow out the dome interior
        translate([0, 0, 0])
        sphere(r=dome_radius - wall_thick);
        
        // Apply perforation patterns to each panel between ribs
        panel_angle = 360 / num_ribs;
        
        for (p = [0:num_ribs-1]) {
            base_angle = p * panel_angle + panel_angle/2;  // Center of each panel
            
            // Calculate radii at different heights for this tapered geometry
            z_top = total_length - 8;
            z_mid = total_length - 50;
            z_bot = 15;
            
            r_top = large_dia/2 - wall_thick - 4;
            r_mid = (large_dia/2 + small_dia/2)/2 - wall_thick;
            r_bot = small_dia/2 - wall_thick + 4;
            
            effective_span = panel_angle - 5;  // Leave room for ribs
            
            // Pattern varies by panel position for visual interest
            pattern_type = p % 3;
            
            if (pattern_type == 0) {
                // Type A: Upper rectangular slots, lower circular holes
                slotted_panel(z_top-25, z_top, r_top-5, r_top, effective_span, base_angle, 3, 4);
                holed_panel(z_mid-15, z_mid+15, r_mid-3, r_mid+3, effective_span, base_angle, 3, 5);
                diagonal_pattern(z_bot+5, z_mid-20, r_bot, r_mid-5, base_angle, effective_span, 8);
            } else if (pattern_type == 1) {
                // Type B: Circular holes upper, slots lower
                holed_panel(z_top-30, z_top-5, r_top-6, r_top-2, effective_span, base_angle, 4, 4);
                slotted_panel(z_mid-10, z_bot+15, r_mid+2, r_bot+2, effective_span, base_angle, 3, 5);
                diagonal_pattern(z_top-35, z_mid, r_top-7, r_mid, base_angle, effective_span, 10);
            } else {
                // Type C: Mixed dense pattern
                slotted_panel(z_top-20, z_top-2, r_top-4, r_top-1, effective_span, base_angle, 4, 3);
                holed_panel(z_mid-20, z_mid+10, r_mid-4, r_mid+2, effective_span, base_angle, 4, 6);
                slotted_panel(z_bot+5, z_mid-25, r_bot+1, r_mid-6, effective_span, base_angle, 2, 4);
                diagonal_pattern(z_bot+2, z_bot+30, r_bot, r_bot+5, base_angle, effective_span, 6);
            }
        }
        
        // Additional row of circular holes near the scalloped rim (decorative/functional)
        for (h = [0:num_lobes-1]) {
            angle = h * (360/num_lobes) + (180/num_lobes);
            r = large_dia/2 - lobe_depth/2 - wall_thick;
            translate([r * cos(angle), r * sin(angle), total_length - 3])
            rotate([0, 0, angle])
            rotate([90, 0, 0])
            cylinder(h=wall_thick+2, d=hole_dia*0.7, center=true);
        }
    }
}

// --------------------------------------------
// RENDER
// --------------------------------------------
main_assembly();