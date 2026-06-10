// ========================== PARAMETERS ==========================
$fn = 64; // Smooth curve resolution

// Fin Plate Dimensions
fin_length = 21.85;    // [mm] Overall fin length
fin_height = 11.28;    // [mm] Maximum fin height
fin_thickness = 1.5;   // [mm] Fin plate thickness
edge_chamfer = 0.3;    // [mm] 45deg edge chamfer size
hole_chamfer = 0.2;    // [mm] 45deg hole chamfer size

// Hole Dimensions
top_hole_dia = 2.0;    // [mm] Diameter of top edge holes
tip_hole_dia = 2.0;    // [mm] Diameter of tip hole
lower_hole_dia = 2.0;  // [mm] Diameter of lower hole
hub_hole_dia = 3.0;    // [mm] Diameter of central hub hole

// Hub Assembly Dimensions
hub_dia = 9.0;         // [mm] Outer diameter of bulbous hub
hub_shell_thickness = 2.0; // [mm] Thickness per hub half shell
hub_outer_chamfer = 0.8; // [mm] Rounded edge on hub exterior

// Wire Ring Dimensions
ring_wire_dia = 0.4;   // [mm] Diameter of ring wire
ring_outer_dia = 1.8;  // [mm] Outer diameter of wire rings

// ========================== HELPER MODULES ==========================
module chamfered_through_hole(hole_d, material_thickness, chamfer_size) {
    // Creates a through hole with 45deg chamfers on both faces
    cylinder(h=material_thickness + 0.2, d=hole_d, center=true);
    // Front face chamfer
    translate([0, 0, material_thickness/2 + 0.1])
    cylinder(h=chamfer_size, r1=hole_d/2, r2=hole_d/2 + chamfer_size, center=false);
    // Back face chamfer
    translate([0, 0, -material_thickness/2 - 0.1 - chamfer_size])
    cylinder(h=chamfer_size, r1=hole_d/2 + chamfer_size, r2=hole_d/2, center=false);
}

module wire_ring(wire_d, outer_d) {
    // Creates a small split toroidal wire ring
    rotate([90, 0, 0])
    difference() {
        torus(major_r=(outer_d - wire_d)/2, minor_r=wire_d/2);
        translate([outer_d/2 + 0.1, 0, 0])
        cube([0.2, wire_d*1.5, wire_d*1.5], center=true);
    }
}

// ========================== MAIN COMPONENTS ==========================
union() {
    // -------------------------- FIN PLATE --------------------------
    difference() {
        // Chamfered fin plate body
        union() {
            // Core fin body
            linear_extrude(height=fin_thickness, center=true)
            offset(r=-edge_chamfer)
            polygon(points=[
                [0, 1.5], [2, 0], [5, -0.5], [8, -1.2], [12, -2.0],
                [fin_length-3, -3], [fin_length, -0.5], [fin_length, 0.5],
                [fin_length-5, 2.5], [12, 3.8], [7, 4.5], [3, 4.2], [0, 3.0]
            ]);
            // Chamfered outer edge lip
            linear_extrude(height=fin_thickness - 2*edge_chamfer, center=true)
            polygon(points=[
                [0, 1.5], [2, 0], [5, -0.5], [8, -1.2], [12, -2.0],
                [fin_length-3, -3], [fin_length, -0.5], [fin_length, 0.5],
                [fin_length-5, 2.5], [12, 3.8], [7, 4.5], [3, 4.2], [0, 3.0]
            ]);
        }
        // Cut all chamfered holes
        // 4 top edge holes
        for (x = [9, 11, 13, 15]) {
            translate([x, 3.0, 0])
            chamfered_through_hole(top_hole_dia, fin_thickness, hole_chamfer);
        }
        // Tip hole
        translate([fin_length - 1, 0, 0])
        chamfered_through_hole(tip_hole_dia, fin_thickness, hole_chamfer);
        // Lower hole
        translate([10, -2.5, 0])
        chamfered_through_hole(lower_hole_dia, fin_thickness, hole_chamfer);
        // Central hub hole
        translate([2, 1.5, 0])
        chamfered_through_hole(hub_hole_dia, fin_thickness, hole_chamfer);
    }

    // -------------------------- HUB ASSEMBLY --------------------------
    // Inner central boss (bearing seat)
    translate([2, 1.5, 0])
    cylinder(h=fin_thickness + 2*hub_shell_thickness, d=hub_hole_dia, center=true);

    // Hub half shells (mirror pair)
    for (side = [-1, 1]) {
        translate([2, 1.5, side*(fin_thickness/2 + hub_shell_thickness/2)])
        difference() {
            // Rounded hub shell body
            minkowski() {
                cylinder(h=hub_shell_thickness - hub_outer_chamfer, d=hub_dia, center=true);
                sphere(r=hub_outer_chamfer);
            }
            // Center counterbore
            cylinder(h=hub_shell_thickness + 0.2, d=hub_hole_dia + 2.0, center=true);
            // Central through hole
            cylinder(h=hub_shell_thickness + 0.2, d=hub_hole_dia, center=true);
        }
    }

    // -------------------------- WIRE RINGS (mirror pair instances) --------------------------
    // Lower ring
    translate([10, -2.5, 0])
    rotate([0, 90, 0])
    wire_ring(ring_wire_dia, ring_outer_dia);

    // Tip ring
    translate([fin_length - 0.8, 0, 0])
    rotate([0, 0, 90])
    wire_ring(ring_wire_dia, ring_outer_dia);
}