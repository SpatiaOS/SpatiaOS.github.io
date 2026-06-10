// Industrial Conical Strainer / Filter Basket
// Perforated conical shell with structural reinforcement ribs,
// circumferential rings, helical ribs, and domed end cap
// Optimized for export performance

// ============ PARAMETERS ============

// Resolution - balanced for quality vs export time
$fn = 18;

// Main body dimensions
large_r = 65;           // Radius at open (wide) end
small_r = 30;           // Radius at closed (narrow) end
body_len = 175;         // Conical body length
wall = 1.5;             // Shell wall thickness

// Longitudinal ribs
n_long = 6;             // Number of longitudinal ribs
long_w = 3.5;           // Rib width (circumferential)
long_h = 1.5;           // Rib protrusion (radial)

// Circumferential reinforcement rings
n_rings = 3;            // Number of rings
ring_w = 5;             // Ring width (axial)
ring_h = 1.5;           // Ring protrusion (radial)

// Helical (diagonal) ribs
n_helix = 6;            // Number of helical ribs
helix_twist = 55;       // Total twist angle over body length
helix_w = 2.5;          // Rib width
helix_h = 1.5;          // Rib protrusion
helix_segs = 8;         // Segments per rib

// Slot perforations
slot_l = 8;             // Slot length (circumferential)
slot_w = 1.8;           // Slot width (axial)
max_slot_rows = 2;      // Max rows per cell
max_slots_per_row = 3;  // Max slots per row

// Circular hole perforations along helical ribs
hole_d = 3.5;           // Hole diameter
hole_fn = 8;            // Resolution for holes
n_holes_per_helix = 5;  // Holes per helix path

// End cap
cap_h = 16;             // Dome height at narrow end

// Open end rim
rim_h = 6;              // Rim height
rim_extra_r = 2.5;      // Extra radial thickness of rim

// ============ HELPER FUNCTIONS ============

// Radius of cone at axial position z (z=0 is wide end)
function rz(z) = large_r + (small_r - large_r) * z / body_len;

// Z position of i-th circumferential ring center
function ring_z(i) = (i + 1) * body_len / (n_rings + 1);

// Degrees per radian shortcut
deg_per_rad = 57.2958;

// ============ SOLID STRUCTURE MODULES ============

// Hollow truncated cone shell
module cone_shell() {
    difference() {
        cylinder(h=body_len, r1=large_r, r2=small_r);
        translate([0, 0, -0.1])
            cylinder(h=body_len + 0.2, r1=large_r - wall, r2=small_r - wall);
    }
}

// Domed end cap at the narrow end
module end_cap() {
    translate([0, 0, body_len])
        difference() {
            scale([1, 1, cap_h / small_r])
                sphere(r=small_r);
            scale([1, 1, cap_h / small_r])
                sphere(r=small_r - wall);
            translate([0, 0, -small_r])
                cube(small_r * 3, center=true);
        }
}

// Reinforcement rim at the open end
module rim() {
    difference() {
        cylinder(h=rim_h, r1=large_r + rim_extra_r, r2=large_r + rim_extra_r);
        translate([0, 0, -0.1])
            cylinder(h=rim_h + 0.2, r1=large_r - wall, r2=rz(rim_h) - wall);
    }
}

// Straight longitudinal ribs from wide to narrow end
module long_ribs() {
    for (i = [0 : n_long - 1])
        rotate([0, 0, i * 360 / n_long])
            hull() {
                translate([large_r - 0.5, -long_w/2, 0])
                    cube([long_h + 0.5, long_w, 0.01]);
                translate([small_r - 0.5, -long_w/2, body_len])
                    cube([long_h + 0.5, long_w, 0.01]);
            }
}

// Circumferential reinforcement rings
module circ_rings() {
    for (i = [0 : n_rings - 1]) {
        zc = ring_z(i);
        z0 = zc - ring_w / 2;
        z1 = zc + ring_w / 2;
        translate([0, 0, z0])
            difference() {
                cylinder(h=ring_w, r1=rz(z0) + ring_h, r2=rz(z1) + ring_h);
                translate([0, 0, -0.1])
                    cylinder(h=ring_w + 0.2, r1=rz(z0) - 0.5, r2=rz(z1) - 0.5);
            }
    }
}

// Helical (diagonal) ribs approximated with hull segments
module helix_ribs() {
    for (i = [0 : n_helix - 1]) {
        base_ang = i * 360 / n_helix;
        for (s = [0 : helix_segs - 1]) {
            z0 = s * body_len / helix_segs;
            z1 = (s + 1) * body_len / helix_segs;
            a0 = base_ang + helix_twist * s / helix_segs;
            a1 = base_ang + helix_twist * (s + 1) / helix_segs;
            hull() {
                rotate([0, 0, a0])
                    translate([rz(z0) - 0.5, -helix_w/2, z0])
                        cube([helix_h + 0.5, helix_w, 0.01]);
                rotate([0, 0, a1])
                    translate([rz(z1) - 0.5, -helix_w/2, z1])
                        cube([helix_h + 0.5, helix_w, 0.01]);
            }
        }
    }
}

// ============ PERFORATION MODULES ============

// All rectangular slot perforations across panels
module all_slots() {
    panel_ang = 360 / n_long;
    
    for (ri = [0 : n_long - 1]) {
        ang_center = ri * panel_ang + panel_ang / 2;
        
        for (ci = [0 : n_rings]) {
            // Axial range for this cell
            z_start = (ci == 0) ? rim_h + 4 : ring_z(ci - 1) + ring_w/2 + 3;
            z_end = (ci == n_rings) ? body_len - 12 : ring_z(ci) - ring_w/2 - 3;
            dz = z_end - z_start;
            
            if (dz > 10) {
                nr = min(max_slot_rows, max(1, floor(dz / 12)));
                
                for (row = [0 : nr - 1]) {
                    z = z_start + (row + 0.5) * dz / nr;
                    r = rz(z);
                    
                    // Angular margins to avoid longitudinal ribs
                    margin = (long_w + 4) / r * deg_per_rad;
                    a_lo = ang_center - panel_ang/2 + margin;
                    a_hi = ang_center + panel_ang/2 - margin;
                    span = a_hi - a_lo;
                    
                    if (span > 5) {
                        // How many slots fit in the angular span
                        arc_len = span / deg_per_rad * r;
                        ns = min(max_slots_per_row, max(1, floor(arc_len / (slot_l + 3))));
                        
                        for (s = [0 : ns - 1]) {
                            a = a_lo + (s + 0.5) * span / ns;
                            rotate([0, 0, a])
                                translate([r - wall * 2, -slot_l/2, z - slot_w/2])
                                    cube([wall * 5, slot_l, slot_w]);
                        }
                    }
                }
            }
        }
    }
}

// Circular holes flanking the helical ribs
module all_holes() {
    for (i = [0 : n_helix - 1]) {
        base_ang = i * 360 / n_helix;
        for (j = [1 : n_holes_per_helix]) {
            z = j * body_len / (n_holes_per_helix + 1);
            ang = base_ang + helix_twist * j / (n_holes_per_helix + 1);
            r = rz(z);
            
            // Offset angle to place holes beside the helix rib
            off_ang = (helix_w/2 + hole_d/2 + 1.5) / r * deg_per_rad;
            
            // Holes on one side of helix
            rotate([0, 0, ang + off_ang])
                translate([r, 0, z])
                    rotate([0, 90, 0])
                        cylinder(h=wall * 5, d=hole_d, center=true, $fn=hole_fn);
        }
    }
}

// ============ FINAL ASSEMBLY ============

module strainer_basket() {
    difference() {
        // Union of all solid structural components
        union() {
            cone_shell();
            end_cap();
            rim();
            long_ribs();
            circ_rings();
            helix_ribs();
        }
        // Subtract all perforations
        all_slots();
        all_holes();
    }
}

// Render basket tilted to match reference image orientation
rotate([0, -65, 20])
    strainer_basket();